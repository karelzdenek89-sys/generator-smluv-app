import { createHash, randomBytes } from 'crypto';
import { redis } from '@/lib/redis';

const PORTAL_TTL_SEC = 60 * 60 * 24 * 30;

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function hashPortalToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/** Issue or reuse a portal token for customer-zone access (sent in purchase e-mail). */
export async function ensurePortalAccessToken(email: string): Promise<string> {
  const normalized = normalizeEmail(email);
  const emailKey = `orders:portal:email:${normalized}`;
  const existing = await redis.get<string>(emailKey);
  if (existing) return existing;

  const token = randomBytes(32).toString('hex');
  const tokenKey = `orders:portal:token:${hashPortalToken(token)}`;
  await redis.set(tokenKey, normalized, { ex: PORTAL_TTL_SEC });
  await redis.set(emailKey, token, { ex: PORTAL_TTL_SEC });
  return token;
}

export async function resolveEmailFromPortalToken(token: string | null | undefined): Promise<string | null> {
  if (!token?.trim()) return null;
  const email = await redis.get<string>(`orders:portal:token:${hashPortalToken(token.trim())}`);
  return email ? normalizeEmail(email) : null;
}
