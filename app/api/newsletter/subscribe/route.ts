import { NextRequest, NextResponse } from 'next/server';
import { recordAnalyticsEvent } from '@/lib/analytics-server';
import { recordNewsletterConsent } from '@/lib/newsletter-consent';
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
    console.error('[newsletter] Rate-limit fail-open:', err);
    return true;
  }
}

export async function POST(req: NextRequest) {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';

  const allowed = await tryRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Příliš mnoho pokusů. Zkuste to prosím za hodinu.' },
      { status: 429 },
    );
  }

  let payload: Record<string, unknown> = {};
  try {
    payload = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Neplatný formát požadavku.' }, { status: 400 });
  }

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
  const result = await subscribeNewsletterContact({
    email,
    source,
    consentedAt,
  });

  if (!result.ok) {
    if (result.reason === 'missing_api_key') {
      console.error('[newsletter] Chybí RESEND_API_KEY');
      return NextResponse.json(
        { error: 'Odběr není momentálně dostupný. Zkuste to prosím později.' },
        { status: 503 },
      );
    }
    console.error('[newsletter] Resend API error', result.status, result.body);
    return NextResponse.json(
      { error: 'Nepodařilo se přihlásit k odběru. Zkuste to znovu nebo napište na info@smlouvahned.cz.' },
      { status: 500 },
    );
  }

  await recordNewsletterConsent(email, source, consentedAt);

  if (!result.segmentAssigned) {
    console.warn(
      '[newsletter] Kontakt uložen bez segmentu — nastavte RESEND_NEWSLETTER_SEGMENT_ID ve Vercel pro broadcast seznam.',
    );
  }

  await recordAnalyticsEvent('newsletter_subscribed', {
    source,
    surface: 'newsletter_form',
  });

  return NextResponse.json({ ok: true });
}
