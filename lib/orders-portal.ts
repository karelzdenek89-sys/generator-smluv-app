import { createHash, randomBytes } from 'crypto';
import { redis } from '@/lib/redis';

const MAX_PORTAL_TTL_SEC = 60 * 60 * 24 * 90;

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function hashPortalToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/** Issue a one-way-hashed portal token scoped to the active order lifetime. */
export async function ensurePortalAccessToken(email: string, ttlSeconds: number): Promise<string> {
  const normalized = normalizeEmail(email);
  const ttl = Math.max(60, Math.min(Math.ceil(ttlSeconds), MAX_PORTAL_TTL_SEC));
  const token = randomBytes(32).toString('hex');
  const tokenKey = `orders:portal:token:${hashPortalToken(token)}`;
  await redis.set(tokenKey, normalized, { ex: ttl });
  return token;
}

export async function resolveEmailFromPortalToken(token: string | null | undefined): Promise<string | null> {
  if (!token?.trim()) return null;
  const email = await redis.get<string>(`orders:portal:token:${hashPortalToken(token.trim())}`);
  return email ? normalizeEmail(email) : null;
}
