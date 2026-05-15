import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export const runtime = 'nodejs';

// Rate-limit: 5 zpráv / 1 hodina / IP. Fail-open při výpadku Redisu.
async function tryRateLimit(ip: string): Promise<boolean> {
  try {
    const key = `ratelimit:contact:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, 3600);
    return count <= 5;
  } catch (err) {
    console.error('[contact] Rate-limit fail-open:', err);
    return true;
  }
}

export async function POST(req: NextRequest) {
  // 1) Rate-limit per IP
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  const allowed = await tryRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Příliš mnoho zpráv. Zkuste to prosím za hodinu.' },
      { status: 429 },
    );
  }

  // 2) Parse + základní validace
  let payload: Record<string, unknown> = {};
  try {
    payload = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Neplatný formát požadavku.' }, { status: 400 });
  }

  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const subject = typeof payload.subject === 'string' ? payload.subject.trim() : '';
  const message = typeof payload.message === 'string' ? payload.message.trim() : '';
  const honeypot = typeof payload.website === 'string' ? payload.website.trim() : '';

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Vyplňte povinná pole.' }, { status: 400 });
  }

  // 3) Honeypot — bot vyplní skryté pole "website"
  if (honeypot) {
    // Tváříme se OK, ale e-mail neodesíláme (nepřátele tím nemotivujeme zkoušet znovu)
    return NextResponse.json({ ok: true });
  }

  // 4) Délkové limity (anti-flood)
  if (name.length > 200 || email.length > 200 || subject.length > 300 || message.length > 5000) {
    return NextResponse.json({ error: 'Zpráva přesahuje maximální délku.' }, { status: 400 });
  }

  // 5) Velmi jednoduchá validace e-mailu (Resend si ji ověří podrobněji)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Neplatný formát e-mailu.' }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.error('[contact] RESEND_API_KEY není nastaveno');
    return NextResponse.json({ error: 'Interní chyba serveru.' }, { status: 500 });
  }

  const body = `
Nová zpráva z kontaktního formuláře SmlouvaHned.cz

Jméno: ${name}
E-mail: ${email}
Předmět: ${subject || '(nevyplněno)'}

Zpráva:
${message}
  `.trim();

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'SmlouvaHned <noreply@smlouvahned.cz>',
      to: ['info@smlouvahned.cz'],
      reply_to: email,
      subject: `[Kontakt] ${subject || name}`,
      text: body,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Zprávu se nepodařilo odeslat.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
