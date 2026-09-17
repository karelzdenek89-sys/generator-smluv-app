import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { redis } from '@/lib/redis';

/**
 * Návratový odkaz k případu („Case Lite“ bez registrace).
 *
 * - token: 32 náhodných bajtů (hex, 64 znaků) — v URL pouze ve fragmentu,
 *   nikdy v query stringu, takže nekončí v logu, refereru ani analytice;
 * - na serveru se ukládá jen SHA-256 hash tokenu;
 * - záznam nese caseId + e-mail vlastníka, takže token nelze použít na jiný
 *   případ (IDOR guard) a lze jej hromadně zneplatnit.
 */

export const CASE_ACCESS_TOKEN_RE = /^[a-f0-9]{64}$/;
/** Odkaz z e-mailu platí 30 dní; každé otevření případu jej neprodlužuje. */
export const CASE_ACCESS_TTL_SECONDS = 60 * 60 * 24 * 30;

export type CaseAccessRecord = {
  caseId: string;
  email: string;
  issuedAt: string;
};

export function hashCaseAccessToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function tokenKey(token: string): string {
  return `case:access:${hashCaseAccessToken(token)}`;
}

function caseTokensKey(caseId: string): string {
  return `case:tokens:${caseId}`;
}

export function isCaseAccessTokenFormat(value: unknown): value is string {
  return typeof value === 'string' && CASE_ACCESS_TOKEN_RE.test(value);
}

export async function issueCaseAccessToken(
  caseId: string,
  email: string,
  ttlSeconds: number = CASE_ACCESS_TTL_SECONDS,
): Promise<string> {
  const token = randomBytes(32).toString('hex');
  const hashed = hashCaseAccessToken(token);
  const record: CaseAccessRecord = {
    caseId,
    email: email.trim().toLowerCase(),
    issuedAt: new Date().toISOString(),
  };
  const ttl = Math.max(60, Math.min(ttlSeconds, CASE_ACCESS_TTL_SECONDS));
  await redis.set(`case:access:${hashed}`, record, { ex: ttl });
  await redis.sadd(caseTokensKey(caseId), hashed);
  await redis.expire(caseTokensKey(caseId), 60 * 60 * 24 * 400);
  return token;
}

/**
 * Ověří token proti konkrétnímu případu. Vrací záznam pouze při shodě
 * caseId; jinak `null`, aniž by prozradil, zda token existuje.
 */
export async function resolveCaseAccess(
  caseId: string,
  token: string,
): Promise<CaseAccessRecord | null> {
  if (!isCaseAccessTokenFormat(token) || !caseId) return null;
  const record = await redis.get<CaseAccessRecord>(tokenKey(token));
  if (!record || typeof record.caseId !== 'string') return null;
  const expected = Buffer.from(record.caseId);
  const provided = Buffer.from(caseId);
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) return null;
  return record;
}

/** Zneplatní všechny vydané odkazy k případu (např. při přeposlání e-mailu cizí osobě). */
export async function revokeCaseAccessTokens(caseId: string): Promise<number> {
  const hashes = (await redis.smembers(caseTokensKey(caseId))) as string[];
  if (!hashes?.length) return 0;
  await Promise.all(hashes.map((hash) => redis.del(`case:access:${hash}`)));
  await redis.del(caseTokensKey(caseId));
  return hashes.length;
}
