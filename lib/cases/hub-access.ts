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
  /** Owner-scoped revocation generation. Legacy records have epoch 0. */
  epoch?: number;
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

function ownerHubEpochKey(email: string): string {
  return `case:hub-epoch:${hashOwnerEmail(email)}`;
}

async function currentOwnerHubEpoch(email: string): Promise<number> {
  const value = Number(await redis.get<string | number>(ownerHubEpochKey(email)) ?? 0);
  return Number.isInteger(value) && value >= 0 ? value : 0;
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
  const epoch = await currentOwnerHubEpoch(normalized);
  await Promise.all([
    redis.set(`case:hub-access:${hashed}`, { email: normalized, issuedAt: new Date().toISOString(), epoch } satisfies HubAccessRecord, { ex: HUB_TTL_SECONDS }),
    redis.sadd(ownerHubTokensKey(normalized), hashed),
  ]);
  await redis.expire(ownerHubTokensKey(normalized), HUB_TTL_SECONDS);
  return token;
}

/**
 * Zneplatní všechny hub odkazy pro e-mail vlastníka bez globálního SCANu.
 *
 * Autoritativní je owner-scoped epoch: staré tokeny (včetně tokenů vydaných
 * před zavedením reverzního indexu) mají epoch 0 a po prvním revoke přestanou
 * platit. Reverzní index pouze fyzicky uklidí novější tokeny; bezpečnost na něm
 * nezávisí. Epoch má stejnou TTL jako hub tokeny, takže může zaniknout až ve
 * chvíli, kdy už žádný dříve vydaný hub token nemůže být platný.
 */
export async function revokeCaseHubAccessTokens(email: string): Promise<number> {
  const normalized = email.trim().toLowerCase();
  const indexKey = ownerHubTokensKey(normalized);
  const epochKey = ownerHubEpochKey(normalized);
  const indexed = (await redis.smembers(indexKey)) as string[];

  await redis.incr(epochKey);
  await redis.expire(epochKey, HUB_TTL_SECONDS);

  let revoked = 0;
  for (const hash of indexed ?? []) revoked += await redis.del(`case:hub-access:${hash}`);
  await redis.del(indexKey);
  return revoked;
}

export async function resolveCaseHubAccess(token: string): Promise<HubAccessRecord | null> {
  if (!HUB_TOKEN_RE.test(token)) return null;
  const record = await redis.get<HubAccessRecord>(hubKey(token));
  if (!record || typeof record.email !== 'string' || !record.email.includes('@')) return null;
  const currentEpoch = await currentOwnerHubEpoch(record.email);
  const tokenEpoch = Number.isInteger(record.epoch) && (record.epoch as number) >= 0 ? (record.epoch as number) : 0;
  if (tokenEpoch !== currentEpoch) return null;
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
