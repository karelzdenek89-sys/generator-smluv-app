import { NextRequest, NextResponse } from 'next/server';
import { getClientIp, readFirstPartyJson } from '@/lib/api-security';
import { createNewsletterConfirmation } from '@/lib/newsletter-subscribers';
import { takeRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function tryRateLimit(ip: string): Promise<boolean> {
  try {
    return (await takeRateLimit(`ratelimit:newsletter:${ip}`, 5, 3600)).allowed;
  } catch (err) {
    console.error('[newsletter] Rate-limit unavailable:', err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  const json = await readFirstPartyJson(req, 4 * 1024);
  if (!json.ok) {
    const status = json.error === 'invalid_origin' ? 403 : json.error === 'payload_too_large' ? 413 : 400;
    return NextResponse.json({ error: 'Neplatný formát požadavku.' }, { status });
  }

  const ip = getClientIp(req);

  const allowed = await tryRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Příliš mnoho pokusů. Zkuste to prosím za hodinu.' },
      { status: 429 },
    );
  }

  const payload = json.data;

  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
  const consent = payload.consent === true;
  const honeypot = typeof payload.company === 'string' ? payload.company.trim() : '';
  const sourceRaw = typeof payload.source === 'string' ? payload.source.trim() : 'footer';
  const source = sourceRaw.slice(0, 64) || 'footer';

  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  if (!email || !consent) {
    return NextResponse.json(
      { error: 'Vyplňte e-mail a potvrďte souhlas se zasíláním tipů.' },
      { status: 400 },
    );
  }

  if (email.length > 200 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Neplatný formát e-mailu.' }, { status: 400 });
  }

  const requestedAt = new Date().toISOString();
  let confirmation: { token: string; alreadySubscribed: boolean };
  try {
    confirmation = await createNewsletterConfirmation(email, source, requestedAt);
  } catch (error) {
    console.error('[newsletter] Confirmation storage failed:', error);
    return NextResponse.json(
      { error: 'Nepodařilo se připravit potvrzení. Zkuste to znovu nebo napište na info@smlouvahned.cz.' },
      { status: 503 },
    );
  }

  if (!confirmation.alreadySubscribed) {
    const resendKey = process.env.RESEND_API_KEY?.trim();
    if (!resendKey) {
      return NextResponse.json(
        { error: 'Potvrzovací e-mail nyní nelze odeslat. Zkuste to prosím později.' },
        { status: 503 },
      );
    }
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin;
    const confirmUrl = `${baseUrl.replace(/\/+$/, '')}/newsletter/potvrdit#token=${confirmation.token}`;
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `newsletter-confirm-${confirmation.token}`,
      },
      body: JSON.stringify({
        from: 'SmlouvaHned <dokumenty@smlouvahned.cz>',
        to: [email],
        subject: 'Potvrďte odběr tipů SmlouvaHned',
        html: `<p>Dobrý den,</p><p>potvrďte prosím, že chcete dostávat praktické tipy a novinky služby SmlouvaHned.</p><p><a href="${confirmUrl}" style="display:inline-block;padding:12px 18px;background:#f59e0b;color:#111827;text-decoration:none;border-radius:10px;font-weight:700">Potvrdit odběr</a></p><p>Odkaz je platný 24 hodin. Pokud jste o odběr nežádali, tento e-mail ignorujte.</p>`,
      }),
    });
    if (!response.ok) {
      const responseBody = await response.text().catch(() => '');
      console.error('[newsletter] Confirmation email failed:', response.status, responseBody.slice(0, 300));
      return NextResponse.json(
        { error: 'Potvrzovací e-mail se nepodařilo odeslat. Zkuste to prosím později.' },
        { status: 503 },
      );
    }
  }

  return NextResponse.json({ ok: true, confirmationRequired: !confirmation.alreadySubscribed });
}
