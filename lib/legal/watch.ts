import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { redis } from '@/lib/redis';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { renderEmailShell, sendTransactionalEmail } from '@/lib/email/transactional';
import { LEGAL_CHANGES, LEGAL_CHANGE_STATUS_LABELS, type LegalChangeStatus } from './radar';
import { SITE_URL } from '@/lib/seo/site';

const WATCH_TTL_SECONDS = 60 * 60 * 24 * 730;
const INDEX_KEY = 'legal:watch:index';

export type LegislationWatch = {
  id: string;
  email: string;
  emailHash: string;
  changeKey: string;
  status: 'pending' | 'active';
  statusSnapshot: LegalChangeStatus;
  effectiveFromSnapshot: string | null;
  createdAt: string;
  confirmedAt: string | null;
  lastNotifiedAt: string | null;
};

function watchKey(id: string): string { return `legal:watch:${id}`; }
function dedupeKey(emailHash: string, changeKey: string): string { return `legal:watch:dedupe:${emailHash}:${changeKey}`; }
function emailHash(email: string): string { return createHash('sha256').update(email.trim().toLowerCase()).digest('hex'); }
function baseUrl(): string { return (process.env.NEXT_PUBLIC_BASE_URL || SITE_URL).replace(/\/+$/, ''); }

function secret(): string | null {
  const value = process.env.CRON_SECRET?.trim();
  return value && value.length >= 20 ? value : null;
}

export function isLegislationWatchOperational(): boolean {
  return isFeatureEnabled('legislationWatch') && Boolean(secret());
}

export function legalWatchAccessToken(id: string): string | null {
  const key = secret();
  if (!key) return null;
  return createHmac('sha256', key).update(`legal-watch:${id}`).digest('hex');
}

export function verifyLegalWatchAccessToken(id: string, token: string): boolean {
  const expected = legalWatchAccessToken(id);
  if (!expected || !/^[a-f0-9]{64}$/.test(token)) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function legalWatchManageUrl(id: string, token: string): string {
  return `${baseUrl()}/sledovani-zmeny?id=${encodeURIComponent(id)}#access=${encodeURIComponent(token)}`;
}

export async function subscribeLegislationWatch(changeKey: string, rawEmail: string): Promise<{ ok: true; id: string } | { ok: false; reason: 'disabled' | 'unknown_change' | 'email' | 'delivery' }> {
  if (!isLegislationWatchOperational()) return { ok: false, reason: 'disabled' };
  const change = LEGAL_CHANGES.find((item) => item.key === changeKey);
  if (!change) return { ok: false, reason: 'unknown_change' };
  const email = rawEmail.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) return { ok: false, reason: 'email' };
  const hashed = emailHash(email);
  const existingId = await redis.get<string>(dedupeKey(hashed, changeKey));
  let watch = existingId ? await redis.get<LegislationWatch>(watchKey(existingId)) : null;
  if (!watch) {
    const id = randomUUID();
    watch = {
      id,
      email,
      emailHash: hashed,
      changeKey,
      status: 'pending',
      statusSnapshot: change.status,
      effectiveFromSnapshot: change.effectiveFrom,
      createdAt: new Date().toISOString(),
      confirmedAt: null,
      lastNotifiedAt: null,
    };
    await Promise.all([
      redis.set(watchKey(id), watch, { ex: WATCH_TTL_SECONDS }),
      redis.set(dedupeKey(hashed, changeKey), id, { ex: WATCH_TTL_SECONDS }),
      redis.sadd(INDEX_KEY, id),
    ]);
  }
  const token = legalWatchAccessToken(watch.id);
  if (!token) return { ok: false, reason: 'disabled' };
  const result = await sendTransactionalEmail({
    to: email,
    subject: `Potvrďte sledování změny: ${change.title}`,
    idempotencyKey: `legal-watch-confirm-${watch.id}-${Date.now()}`,
    html: renderEmailShell({
      heading: 'Potvrďte funkční upozornění',
      intro: `Po potvrzení vás upozorníme pouze tehdy, když se u změny „${change.title}“ změní legislativní status nebo datum účinnosti. Nejde o newsletter ani marketingový souhlas.`,
      ctaLabel: 'Potvrdit sledování změny',
      ctaUrl: legalWatchManageUrl(watch.id, token),
      secondary: `Aktuální status: ${LEGAL_CHANGE_STATUS_LABELS[change.status]}. Upozornění můžete kdykoli zrušit.`,
      footerNote: 'Právní obsah radaru je aktualizován ručně proti oficiálním zdrojům. Automatizace pouze porovnává zveřejněný status a datum; sama nemění právní obsah.',
    }),
    text: `Potvrďte sledování změny „${change.title}“:\n${legalWatchManageUrl(watch.id, token)}\n\nUpozorníme vás pouze při změně statusu nebo data účinnosti.`,
  });
  if (!result.ok && watch.status === 'pending') {
    await Promise.all([redis.del(watchKey(watch.id)), redis.del(dedupeKey(hashed, changeKey)), redis.srem(INDEX_KEY, watch.id)]);
    return { ok: false, reason: 'delivery' };
  }
  return { ok: true, id: watch.id };
}

export async function manageLegislationWatch(id: string, token: string, action: 'confirm' | 'unsubscribe'): Promise<'confirmed' | 'unsubscribed' | 'invalid'> {
  if (!verifyLegalWatchAccessToken(id, token)) return 'invalid';
  const watch = await redis.get<LegislationWatch>(watchKey(id));
  if (!watch) return 'invalid';
  if (action === 'unsubscribe') {
    await Promise.all([
      redis.del(watchKey(id)),
      redis.del(dedupeKey(watch.emailHash, watch.changeKey)),
      redis.srem(INDEX_KEY, id),
    ]);
    return 'unsubscribed';
  }
  const change = LEGAL_CHANGES.find((item) => item.key === watch.changeKey);
  if (!change) return 'invalid';
  const confirmed: LegislationWatch = {
    ...watch,
    status: 'active',
    statusSnapshot: change.status,
    effectiveFromSnapshot: change.effectiveFrom,
    confirmedAt: watch.confirmedAt ?? new Date().toISOString(),
  };
  await redis.set(watchKey(id), confirmed, { ex: WATCH_TTL_SECONDS });
  await redis.expire(dedupeKey(watch.emailHash, watch.changeKey), WATCH_TTL_SECONDS);
  return 'confirmed';
}

export async function processLegislationWatches(limit = 500): Promise<{ checked: number; changed: number; sent: number; failed: number }> {
  const summary = { checked: 0, changed: 0, sent: 0, failed: 0 };
  if (!isLegislationWatchOperational()) return summary;
  const cursorKey = 'legal:watch:cursor';
  const all = ((await redis.smembers(INDEX_KEY)) as string[]).sort();
  const savedCursor = await redis.get<string | number>(cursorKey);
  const cursor = typeof savedCursor === 'string' ? savedCursor : null;
  const after = cursor ? all.findIndex((id) => id > cursor) : 0;
  const start = after < 0 ? 0 : after;
  const ids = all.slice(start, start + Math.max(1, Math.min(limit, 1000)));
  for (const id of ids) {
    const watch = await redis.get<LegislationWatch>(watchKey(id));
    if (!watch) {
      await redis.srem(INDEX_KEY, id);
      continue;
    }
    if (watch.status !== 'active') continue;
    summary.checked += 1;
    const change = LEGAL_CHANGES.find((item) => item.key === watch.changeKey);
    if (!change) continue;
    if (change.status === watch.statusSnapshot && change.effectiveFrom === watch.effectiveFromSnapshot) continue;
    summary.changed += 1;
    const token = legalWatchAccessToken(watch.id);
    if (!token) { summary.failed += 1; continue; }
    const result = await sendTransactionalEmail({
      to: watch.email,
      subject: `Změna legislativního stavu: ${change.title}`,
      idempotencyKey: `legal-watch-change-${watch.id}-${change.status}-${change.effectiveFrom ?? 'unknown'}`,
      html: renderEmailShell({
        heading: 'Sledovaná změna má nový stav',
        intro: `U položky „${change.title}“ se změnil sledovaný legislativní stav nebo datum účinnosti. Aktuální status: ${LEGAL_CHANGE_STATUS_LABELS[change.status]}.`,
        ctaLabel: 'Otevřít aktuální přehled',
        ctaUrl: `${baseUrl()}/zmeny-2027#${encodeURIComponent(change.key)}`,
        secondary: change.dateLabel,
        footerNote: `Správa upozornění: ${legalWatchManageUrl(watch.id, token)}. Toto je funkční upozornění, nikoli newsletter. Před rozhodnutím ověřte aktuální znění v oficiálních zdrojích uvedených na stránce.`,
      }),
      text: `Sledovaná změna: ${change.title}\nAktuální status: ${LEGAL_CHANGE_STATUS_LABELS[change.status]}\n${change.dateLabel}\n\nPřehled: ${baseUrl()}/zmeny-2027#${change.key}\nSpráva upozornění: ${legalWatchManageUrl(watch.id, token)}`,
    });
    if (!result.ok) { summary.failed += 1; continue; }
    summary.sent += 1;
    await redis.set(watchKey(id), {
      ...watch,
      statusSnapshot: change.status,
      effectiveFromSnapshot: change.effectiveFrom,
      lastNotifiedAt: new Date().toISOString(),
    } satisfies LegislationWatch, { ex: WATCH_TTL_SECONDS });
  }
  if (ids.length) await redis.set(cursorKey, ids[ids.length - 1], { ex: WATCH_TTL_SECONDS });
  return summary;
}
