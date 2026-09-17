import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { getClientIp, readFirstPartyJson } from '@/lib/api-security';
import { takeRateLimit } from '@/lib/rate-limit';
import { ensurePortalAccessToken } from '@/lib/orders-portal';
import { normalizeLocale, type AppLocale } from '@/lib/locale';
import { renderEmailShell, sendTransactionalEmail } from '@/lib/email/transactional';
import { SITE_URL } from '@/lib/seo/site';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COPY: Record<AppLocale, { subject: string; heading: string; intro: string; cta: string; note: string; text: string }> = {
  cs: {
    subject: 'Moje dokumenty — bezpečný přístupový odkaz',
    heading: 'Bezpečný přístup k dokumentům',
    intro: 'Požádali jste o nový přístupový odkaz k dokumentům, které jsou ještě dostupné v online archivu SmlouvaHned.',
    cta: 'Otevřít Moje dokumenty',
    note: 'Odkaz je určený pouze vám. Pokud jste o něj nežádali, tento e-mail ignorujte.',
    text: 'Otevřít Moje dokumenty',
  },
  en: {
    subject: 'My documents — secure access link',
    heading: 'Secure access to your documents',
    intro: 'You requested a new access link to documents that are still available in the SmlouvaHned online archive.',
    cta: 'Open My documents',
    note: 'This link is intended only for you. If you did not request it, ignore this e-mail.',
    text: 'Open My documents',
  },
  ua: {
    subject: 'Мої документи — безпечне посилання доступу',
    heading: 'Безпечний доступ до документів',
    intro: 'Ви запросили нове посилання для доступу до документів, які ще доступні в онлайн-архіві SmlouvaHned.',
    cta: 'Відкрити Мої документи',
    note: 'Це посилання призначене лише для вас. Якщо ви його не запитували, проігноруйте цей лист.',
    text: 'Відкрити Мої документи',
  },
};

function hashEmail(email: string): string {
  return createHash('sha256').update(email).digest('hex');
}

function baseUrl(): string {
  return (process.env.NEXT_PUBLIC_BASE_URL || SITE_URL).replace(/\/+$/, '');
}

async function hasActivePaidOrder(email: string): Promise<{ active: boolean; ttl: number }> {
  const emailKey = `orders:email:${email}`;
  const ttl = await redis.ttl(emailKey);
  if (ttl <= 0) return { active: false, ttl: 0 };
  const sessions = ((await redis.smembers(emailKey)) as string[]).slice(0, 25);
  for (const sessionId of sessions) {
    const draftId = await redis.get<string>(`session:draft:${sessionId}`);
    if (!draftId) continue;
    const draft = await redis.get<{ paid?: boolean }>(`contract:draft:${draftId}`);
    if (draft?.paid) return { active: true, ttl };
  }
  return { active: false, ttl };
}

export async function POST(req: Request) {
  const parsed = await readFirstPartyJson(req, 3 * 1024);
  if (!parsed.ok) {
    const status = parsed.error === 'invalid_origin' ? 403 : parsed.error === 'payload_too_large' ? 413 : 400;
    return NextResponse.json({ error: 'Neplatný požadavek.' }, { status });
  }
  const email = typeof parsed.data.email === 'string' ? parsed.data.email.trim().toLowerCase() : '';
  const locale = normalizeLocale(parsed.data.lang);
  const honeypot = typeof parsed.data.company === 'string' ? parsed.data.company.trim() : '';
  if (honeypot) return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  if (!EMAIL_RE.test(email) || email.length > 200) return NextResponse.json({ error: 'Zadejte platný e-mail.' }, { status: 400 });

  try {
    const [ipLimit, emailLimit] = await Promise.all([
      takeRateLimit(`ratelimit:orders-link:${getClientIp(req)}`, 10, 3600),
      takeRateLimit(`ratelimit:orders-link-email:${hashEmail(email)}`, 3, 3600),
    ]);
    if (!ipLimit.allowed || !emailLimit.allowed) return NextResponse.json({ error: 'Příliš mnoho požadavků. Zkuste to za hodinu.' }, { status: 429 });
  } catch {
    return NextResponse.json({ error: 'Službu nyní nelze bezpečně použít.' }, { status: 503 });
  }

  try {
    const active = await hasActivePaidOrder(email);
    if (active.active) {
      const token = await ensurePortalAccessToken(email, active.ttl);
      const langQuery = locale === 'cs' ? '' : `?lang=${locale}`;
      const url = `${baseUrl()}/zakaznicka-zona${langQuery}#access=${encodeURIComponent(token)}`;
      const copy = COPY[locale];
      await sendTransactionalEmail({
        to: email,
        subject: copy.subject,
        idempotencyKey: `orders-portal-link-${hashEmail(email).slice(0, 20)}-${Math.floor(Date.now() / 60000)}`,
        html: renderEmailShell({
          heading: copy.heading,
          intro: copy.intro,
          ctaLabel: copy.cta,
          ctaUrl: url,
          secondary: copy.note,
          footerNote: 'SmlouvaHned — funkční zpráva pro obnovení přístupu k zakoupeným dokumentům.',
        }),
        text: `${copy.heading}\n\n${copy.intro}\n\n${copy.text}: ${url}\n\n${copy.note}`,
      });
    }
  } catch (error) {
    // Enumeration resistance: internal delivery/storage failures are logged, but
    // the public response remains identical for existing and unknown e-mails.
    console.error('[orders] portal-link request failed', error instanceof Error ? error.name : 'unknown');
  }

  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
}
