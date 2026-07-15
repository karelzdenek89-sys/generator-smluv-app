import { NextRequest, NextResponse } from 'next/server';
import { getClientIp, readFirstPartyJson } from '@/lib/api-security';
import {
  completeNewsletterConfirmation,
  getNewsletterConfirmation,
  saveNewsletterSubscriber,
} from '@/lib/newsletter-subscribers';
import { subscribeNewsletterContact } from '@/lib/resend-contacts';
import { recordAnalyticsEvent } from '@/lib/analytics-server';
import { takeRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const json = await readFirstPartyJson(req, 4 * 1024);
  if (!json.ok) {
    const status = json.error === 'invalid_origin' ? 403 : json.error === 'payload_too_large' ? 413 : 400;
    return NextResponse.json({ error: 'Neplatný požadavek.' }, { status });
  }

  try {
    const rateLimit = await takeRateLimit(`ratelimit:newsletter-confirm:${getClientIp(req)}`, 20, 3600);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Příliš mnoho pokusů. Zkuste to prosím později.' }, { status: 429 });
    }
  } catch (error) {
    console.error('[newsletter] Confirmation rate-limit failed:', error);
    return NextResponse.json({ error: 'Potvrzení nyní nelze bezpečně zpracovat.' }, { status: 503 });
  }

  const token = typeof json.data.token === 'string' ? json.data.token.trim() : '';
  if (!/^[a-f0-9]{64}$/.test(token)) {
    return NextResponse.json({ error: 'Potvrzovací odkaz je neplatný.' }, { status: 400 });
  }

  let pending;
  try {
    pending = await getNewsletterConfirmation(token);
  } catch (error) {
    console.error('[newsletter] Confirmation lookup failed:', error);
    return NextResponse.json({ error: 'Potvrzení nyní nelze načíst.' }, { status: 503 });
  }
  if (!pending) {
    return NextResponse.json({ error: 'Potvrzovací odkaz již vypršel nebo byl použit.' }, { status: 410 });
  }

  const confirmedAt = new Date().toISOString();
  const resend = await subscribeNewsletterContact({
    email: pending.email,
    source: pending.source,
    consentedAt: confirmedAt,
  });
  if (!resend.ok) {
    console.error('[newsletter] Confirmed contact sync failed:', resend);
    return NextResponse.json({ error: 'Odběr se nepodařilo dokončit. Zkuste to prosím znovu.' }, { status: 503 });
  }

  const saved = await saveNewsletterSubscriber(pending, confirmedAt);
  if (!saved.ok) {
    return NextResponse.json({ error: 'Souhlas se nepodařilo bezpečně uložit. Zkuste to prosím znovu.' }, { status: 503 });
  }

  await completeNewsletterConfirmation(token).catch((error) => {
    console.error('[newsletter] Confirmation token cleanup failed:', error);
  });
  await recordAnalyticsEvent('newsletter_subscribed', {
    source: pending.source,
    surface: 'newsletter_double_opt_in',
  }).catch((error) => console.error('[newsletter] Confirmation analytics failed:', error));

  return NextResponse.json({ ok: true });
}
