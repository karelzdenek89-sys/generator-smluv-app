import { Redis } from '@upstash/redis';

// Lazy initialization — client se vytvoří až při prvním volání,
// ne při importu modulu (buildu). Jinak Next.js build selže
// když env proměnné nejsou dostupné v build fázi.
function createRedis(): Redis {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!redisUrl || !redisToken) {
    throw new Error('Chybí proměnné prostředí Upstash Redis.');
  }

  return new Redis({ url: redisUrl, token: redisToken });
}

let _redis: Redis | null = null;

export const redis = new Proxy({} as Redis, {
  get(_target, prop: string | symbol) {
    if (!_redis) _redis = createRedis();
    return (_redis as unknown as Record<string | symbol, unknown>)[prop];
  },
});
