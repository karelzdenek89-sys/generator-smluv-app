/**
 * In-memory náhrada Upstash klienta pro automatizované testy.
 *
 * Aktivuje se výhradně přes `SMLOUVAHNED_FAKE_REDIS=1` mimo produkci
 * (viz lib/redis.ts). Implementuje jen podmnožinu příkazů, které aplikace
 * používá, včetně TTL, NX a jednoduchého vyhodnocení tří Lua skriptů
 * (rate limit INCR+EXPIRE, uvolnění zámku podle vlastníka, compare-and-set
 * případu).
 */

type Entry = { value: unknown; expiresAt: number | null };

function now(): number {
  return Date.now();
}

export class MemoryRedis {
  private store = new Map<string, Entry>();

  private live(key: string): Entry | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt !== null && entry.expiresAt <= now()) {
      this.store.delete(key);
      return null;
    }
    return entry;
  }

  private write(key: string, value: unknown, ttlSeconds?: number): void {
    const existing = this.live(key);
    this.store.set(key, {
      value,
      expiresAt: typeof ttlSeconds === 'number' ? now() + ttlSeconds * 1000 : existing?.expiresAt ?? null,
    });
  }

  reset(): void {
    this.store.clear();
  }

  keys(pattern = '*'): string[] {
    const regex = new RegExp(`^${pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`);
    return [...this.store.keys()].filter((key) => this.live(key) && regex.test(key));
  }

  async scan(cursor: number, options?: { match?: string; count?: number }): Promise<[number, string[]]> {
    const keys = this.keys(options?.match ?? '*').sort();
    const end = cursor + (options?.count ?? 10);
    return [end >= keys.length ? 0 : end, keys.slice(cursor, end)];
  }

  async ping(): Promise<string> {
    return 'PONG';
  }

  async get<T = unknown>(key: string): Promise<T | null> {
    const entry = this.live(key);
    return entry ? (structuredClone(entry.value) as T) : null;
  }

  async set(key: string, value: unknown, options?: { ex?: number; nx?: boolean }): Promise<'OK' | null> {
    if (options?.nx && this.live(key)) return null;
    this.write(key, structuredClone(value), options?.ex);
    return 'OK';
  }

  async del(...keys: string[]): Promise<number> {
    let removed = 0;
    for (const key of keys) if (this.store.delete(key)) removed += 1;
    return removed;
  }

  async expire(key: string, seconds: number): Promise<number> {
    const entry = this.live(key);
    if (!entry) return 0;
    entry.expiresAt = now() + seconds * 1000;
    return 1;
  }

  async ttl(key: string): Promise<number> {
    const entry = this.live(key);
    if (!entry) return -2;
    if (entry.expiresAt === null) return -1;
    return Math.max(0, Math.ceil((entry.expiresAt - now()) / 1000));
  }

  async incr(key: string): Promise<number> {
    const entry = this.live(key);
    const next = (typeof entry?.value === 'number' ? entry.value : Number(entry?.value ?? 0)) + 1;
    this.write(key, next);
    return next;
  }

  async sadd(key: string, ...members: string[]): Promise<number> {
    const entry = this.live(key);
    const set = new Set<string>(Array.isArray(entry?.value) ? (entry!.value as string[]) : []);
    let added = 0;
    for (const member of members) {
      if (!set.has(member)) {
        set.add(member);
        added += 1;
      }
    }
    this.write(key, [...set]);
    return added;
  }

  async srem(key: string, ...members: string[]): Promise<number> {
    const entry = this.live(key);
    const set = new Set<string>(Array.isArray(entry?.value) ? (entry!.value as string[]) : []);
    let removed = 0;
    for (const member of members) if (set.delete(member)) removed += 1;
    this.write(key, [...set]);
    return removed;
  }

  async smembers(key: string): Promise<string[]> {
    const entry = this.live(key);
    return Array.isArray(entry?.value) ? [...(entry!.value as string[])] : [];
  }

  private zset(key: string): Map<string, number> {
    const entry = this.live(key);
    return entry?.value instanceof Map ? (entry.value as Map<string, number>) : new Map<string, number>();
  }

  async zadd(key: string, ...entries: Array<{ score: number; member: string }>): Promise<number> {
    const set = this.zset(key);
    let added = 0;
    for (const entry of entries) {
      if (!set.has(entry.member)) added += 1;
      set.set(entry.member, entry.score);
    }
    this.write(key, set);
    return added;
  }

  async zrem(key: string, ...members: string[]): Promise<number> {
    const set = this.zset(key);
    let removed = 0;
    for (const member of members) if (set.delete(member)) removed += 1;
    this.write(key, set);
    return removed;
  }

  async zcard(key: string): Promise<number> {
    return this.zset(key).size;
  }

  async zrange(
    key: string,
    start: number,
    stop: number,
    options?: { byScore?: boolean; withScores?: boolean; offset?: number; count?: number },
  ): Promise<Array<string | number>> {
    const sorted = [...this.zset(key).entries()].sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]));
    let slice: Array<[string, number]>;
    if (options?.byScore) {
      slice = sorted.filter(([, score]) => score >= start && score <= stop);
      const offset = options.offset ?? 0;
      slice = slice.slice(offset, typeof options.count === 'number' ? offset + options.count : undefined);
    } else {
      const from = start < 0 ? Math.max(0, sorted.length + start) : start;
      const to = stop < 0 ? sorted.length + stop : stop;
      slice = sorted.slice(from, to + 1);
    }
    return options?.withScores ? slice.flatMap(([member, score]) => [member, score]) : slice.map(([member]) => member);
  }

  async lpush(key: string, ...values: unknown[]): Promise<number> {
    const entry = this.live(key);
    const list = Array.isArray(entry?.value) ? [...(entry!.value as unknown[])] : [];
    list.unshift(...values.reverse());
    this.write(key, list);
    return list.length;
  }

  async ltrim(key: string, start: number, stop: number): Promise<'OK'> {
    const entry = this.live(key);
    const list = Array.isArray(entry?.value) ? [...(entry!.value as unknown[])] : [];
    this.write(key, list.slice(start, stop + 1));
    return 'OK';
  }

  async lrange(key: string, start: number, stop: number): Promise<unknown[]> {
    const entry = this.live(key);
    const list = Array.isArray(entry?.value) ? (entry!.value as unknown[]) : [];
    return list.slice(start, stop === -1 ? undefined : stop + 1);
  }

  async hincrby(key: string, field: string, increment: number): Promise<number> {
    const entry = this.live(key);
    const hash = entry?.value && typeof entry.value === 'object' && !Array.isArray(entry.value) ? { ...(entry.value as Record<string, number>) } : {};
    hash[field] = (hash[field] ?? 0) + increment;
    this.write(key, hash);
    return hash[field];
  }

  async eval(script: string, keys: string[], args: string[]): Promise<unknown> {
    if (script.includes("redis.call('INCR'")) {
      const count = await this.incr(keys[0]);
      if (count === 1) await this.expire(keys[0], Number(args[0]));
      return count;
    }
    if (script.includes("redis.call('GET', KEYS[1]) == ARGV[1]")) {
      const current = await this.get<string>(keys[0]);
      if (current === args[0]) return this.del(keys[0]);
      return 0;
    }
    if (script.includes("if current ~= ARGV[1] then return 0 end")) {
      // Compare-and-set případu (lib/cases/store.ts): revize v KEYS[2].
      const current = this.live(keys[1])?.value;
      if (String(current ?? '0') !== args[0]) return 0;
      const entry = this.live(keys[0]);
      let ttl = Number(args[3]);
      if (args[4] === 'preserve') {
        if (!entry?.expiresAt) return 0;
        ttl = Math.min(ttl, Math.floor((entry.expiresAt - now()) / 1000));
        if (ttl <= 0) return 0;
      }
      const previous = entry?.value as { documents?: { id: string }[] } | undefined;
      const index = new Map(this.zset(keys[2]));
      for (const doc of previous?.documents ?? []) index.delete(`${args[5]}:${doc.id}`);
      for (const [member, score] of JSON.parse(args[6]) as [string, number][]) index.set(member, score);
      this.write(keys[2], index);
      this.write(keys[0], JSON.parse(args[1]), ttl);
      this.write(keys[1], args[2], ttl);
      return 1;
    }
    throw new Error('MemoryRedis: unsupported script');
  }
}

export const memoryRedis = new MemoryRedis();
