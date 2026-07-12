import { NextRequest, NextResponse } from 'next/server';
import { getClientIp, readFirstPartyJson } from '@/lib/api-security';
import { recordAnalyticsEvent } from '@/lib/analytics-server';
import { saveNewsletterSubscriber } from '@/lib/newsletter-subscribers';
import { subscribeNewsletterContact } from '@/lib/resend-contacts';
import { redis } from '@/lib/redis';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function tryRateLimit(ip: string): Promise<boolean> {
  try {
    const key = `ratelimit:newsletter:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, 3600);
    return count <= 5;
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

  const consentedAt = new Date().toISOString();

  const saved = await saveNewsletterSubscriber(email, source, consentedAt);
  if (!saved.ok) {
    return NextResponse.json(
      { error: 'Nepodařilo se uložit přihlášení. Zkuste to znovu nebo napište na info@smlouvahned.cz.' },
      { status: 503 },
    );
  }

  // Volitelná synchronizace do Resend — jen pokud máte API klíč (není nutná pro přihlášení).
  const resend = await subscribeNewsletterContact({ email, source, consentedAt });
  if (!resend.ok && resend.reason === 'api_error') {
    console.warn('[newsletter] Resend sync skipped:', resend.status, resend.body);
  }

  await recordAnalyticsEvent('newsletter_subscribed', {
    source,
    surface: 'newsletter_form',
  });

  return NextResponse.json({ ok: true });
}
