import { createHash, randomBytes } from 'node:crypto';
import { redis } from '@/lib/redis';
import { renderEmailShell, sendTransactionalEmail, type TransactionalEmailResult } from '@/lib/email/transactional';
import { SITE_URL } from '@/lib/seo/site';
import { issueCaseAccessToken } from './access';
import { casePagePath } from './emails';
import { hashOwnerEmail, listCasesForEmail } from './store';
import { getStageDefinition } from './workflow';

const HUB_TOKEN_RE = /^[a-f0-9]{64}$/;
const HUB_TTL_SECONDS = 60 * 60 * 24 * 30;
const HUB_PATH = '/moje-pripady';

type HubAccessRecord = {
  email: string;
  issuedAt: string;
};

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function hubKey(token: string): string {
  return `case:hub-access:${hashToken(token)}`;
}

function ownerHubTokensKey(email: string): string {
  return `case:hub-tokens:${hashOwnerEmail(email)}`;
}

function baseUrl(): string {
  return (process.env.NEXT_PUBLIC_BASE_URL || SITE_URL).replace(/\/+$/, '');
}

export function buildCaseHubUrl(token: string): string {
  return `${baseUrl()}${HUB_PATH}#access=${encodeURIComponent(token)}`;
}

export async function issueCaseHubAccessToken(email: string): Promise<string> {
  const normalized = email.trim().toLowerCase();
  const token = randomBytes(32).toString('hex');
  const hashed = hashToken(token);
  await Promise.all([
    redis.set(`case:hub-access:${hashed}`, { email: normalized, issuedAt: new Date().toISOString() } satisfies HubAccessRecord, { ex: HUB_TTL_SECONDS }),
    redis.sadd(ownerHubTokensKey(normalized), hashed),
  ]);
  await redis.expire(ownerHubTokensKey(normalized), HUB_TTL_SECONDS);
  return token;
}

/**
 * Zneplatní hub odkazy pro e-mail vlastníka. Nové tokeny mají reverzní index;
 * SCAN navíc odstraní i odkazy vydané před zavedením indexu, aby starý hub
 * odkaz nemohl po revokaci znovu vydat čerstvý přístup k případu.
 */
export async function revokeCaseHubAccessTokens(email: string): Promise<number> {
  const normalized = email.trim().toLowerCase();
  const indexKey = ownerHubTokensKey(normalized);
  const indexed = (await redis.smembers(indexKey)) as string[];
  let revoked = 0;

  for (const hash of indexed ?? []) revoked += await redis.del(`case:hub-access:${hash}`);
  await redis.del(indexKey);

  // Collect legacy keys before deleting them. Offset-based in-memory SCAN and
  // cursor-based Redis SCAN both remain safe when the keyspace is not mutated
  // during traversal; deleting while iterating could otherwise skip a page.
  const legacyKeys: string[] = [];
  let cursor = 0;
  do {
    const [nextCursor, keys] = await redis.scan(cursor, { match: 'case:hub-access:*', count: 200 });
    legacyKeys.push(...keys);
    cursor = Number(nextCursor);
  } while (cursor !== 0);

  for (const key of legacyKeys) {
    const record = await redis.get<HubAccessRecord>(key);
    if (record?.email?.trim().toLowerCase() !== normalized) continue;
    revoked += await redis.del(key);
  }

  return revoked;
}

export async function resolveCaseHubAccess(token: string): Promise<HubAccessRecord | null> {
  if (!HUB_TOKEN_RE.test(token)) return null;
  const record = await redis.get<HubAccessRecord>(hubKey(token));
  if (!record || typeof record.email !== 'string' || !record.email.includes('@')) return null;
  return record;
}

export async function sendCaseHubAccessEmail(email: string): Promise<{ cases: number; result: TransactionalEmailResult | null }> {
  const records = await listCasesForEmail(email, 50);
  if (records.length === 0) return { cases: 0, result: null };
  const token = await issueCaseHubAccessToken(email);
  const result = await sendTransactionalEmail({
    to: email,
    subject: 'Moje případy — bezpečný návratový odkaz',
    idempotencyKey: `case-hub-${hashToken(token).slice(0, 24)}`,
    html: renderEmailShell({
      heading: 'Vaše případy na jednom místě',
      intro: `Máte ${records.length} ${records.length === 1 ? 'uložený případ' : records.length < 5 ? 'uložené případy' : 'uložených případů'}. Bezpečným odkazem otevřete přehled aktivních situací, termínů a dalších kroků.`,
      ctaLabel: 'Otevřít Moje případy',
      ctaUrl: buildCaseHubUrl(token),
      secondary: 'Odkaz je platný 30 dní. Nikomu jej nepřeposílejte — funguje jako přístupový klíč k přehledu vašich případů.',
      footerNote: 'Tento e-mail je funkční zpráva vyžádaná pro přístup k uloženým případům, nikoli newsletter ani obchodní sdělení.',
    }),
    text: `Moje případy\n\nOtevřít přehled: ${buildCaseHubUrl(token)}\n\nOdkaz platí 30 dní a nikomu jej nepřeposílejte.`,
  });
  return { cases: records.length, result };
}

export async function buildCaseHubPayload(email: string, offset = 0, limit = 50) {
  const safeLimit = Math.max(1, Math.min(limit, 50));
  const safeOffset = Math.max(0, Math.floor(offset));
  const records = await listCasesForEmail(email, safeLimit + 1, safeOffset);
  const hasMore = records.length > safeLimit;
  const page = records.slice(0, safeLimit);
  const cases = await Promise.all(page.map(async (record) => {
    const token = await issueCaseAccessToken(record.id, email);
    const stage = getStageDefinition(record.kind, record.stage);
    const nextTask = record.tasks.find((task) => !task.done);
    return {
      id: record.id,
      kind: record.kind,
      title: record.title,
      stage: record.stage,
      stageLabel: stage?.label ?? 'Aktivní',
      deadline: record.deadline,
      nextStep: nextTask?.label ?? stage?.nextSteps[0] ?? (record.stage === 'closed' ? 'Případ je uzavřený' : 'Pokračovat v případu'),
      documentsCount: record.documents.filter((document) => document.status === 'ready').length,
      token,
      path: `${casePagePath(record.kind)}?id=${encodeURIComponent(record.id)}`,
      updatedAt: record.updatedAt,
    };
  }));
  return { cases, hasMore, nextOffset: safeOffset + page.length };
}
