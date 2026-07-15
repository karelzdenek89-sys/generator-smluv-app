import { redis } from '@/lib/redis';

const INCREMENT_WITH_EXPIRY = `
local count = redis.call('INCR', KEYS[1])
if count == 1 then
  redis.call('EXPIRE', KEYS[1], ARGV[1])
end
return count
`;

/** Atomicky zvýší čítač a nastaví expiraci při prvním požadavku. */
export async function takeRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<{ allowed: boolean; count: number }> {
  const count = Number(
    await redis.eval(INCREMENT_WITH_EXPIRY, [key], [String(windowSeconds)]),
  );
  if (!Number.isFinite(count)) throw new Error('Rate-limit counter returned an invalid value.');
  return { allowed: count <= limit, count };
}
