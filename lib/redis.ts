import { Redis } from '@upstash/redis';
import { memoryRedis } from './redis-memory';

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

/**
 * Testovací seam: `SMLOUVAHNED_FAKE_REDIS=1` přepne na in-memory implementaci.
 * V produkci se ignoruje, takže se nikdy nemůže stát, že by produkční build
 * běžel bez skutečného úložiště.
 */
function isMemoryRedisEnabled(): boolean {
  return process.env.NODE_ENV !== 'production' && process.env.SMLOUVAHNED_FAKE_REDIS === '1';
}

let _redis: Redis | null = null;

export const redis = new Proxy({} as Redis, {
  get(_target, prop: string | symbol) {
    if (isMemoryRedisEnabled()) {
      const value = (memoryRedis as unknown as Record<string | symbol, unknown>)[prop];
      return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(memoryRedis) : value;
    }
    if (!_redis) _redis = createRedis();
    return (_redis as unknown as Record<string | symbol, unknown>)[prop];
  },
});
