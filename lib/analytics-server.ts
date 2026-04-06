import { redis } from '@/lib/redis';
import type { AnalyticsEventName, AnalyticsEventParams } from './analytics';

const MAX_STORED_EVENTS = 5000;

function compactParams(params?: AnalyticsEventParams) {
  return Object.fromEntries(
    Object.entries(params ?? {}).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  );
}

export async function recordAnalyticsEvent(
  event: AnalyticsEventName,
  params?: AnalyticsEventParams,
) {
  try {
    const compact = compactParams(params);
    const now = new Date();
    const day = now.toISOString().slice(0, 10);
    const record = {
      event,
      params: compact,
      received_at: now.toISOString(),
    };

    await redis.lpush('analytics:events', JSON.stringify(record));
    await redis.ltrim('analytics:events', 0, MAX_STORED_EVENTS - 1);
    await redis.hincrby(`analytics:summary:${day}:events`, event, 1);

    const dimensions: Array<[string, string | undefined]> = [
      ['source', compact.source],
      ['destination', compact.destination],
      ['surface', compact.surface],
      ['article', compact.article_slug],
      ['situation', compact.situation_key],
      ['package', compact.package_key],
      ['contract', compact.contract_type],
      ['tier', compact.tier],
      ['price_band', compact.price_band],
      ['cta_type', compact.cta_type],
      ['entry_mode', compact.entry_mode],
    ];

    await Promise.all(
      dimensions
        .filter(([, value]) => Boolean(value))
        .map(([dimension, value]) =>
          redis.hincrby(`analytics:summary:${day}:${dimension}`, String(value), 1),
        ),
    );
  } catch (error) {
    console.warn('[analytics] fail-open', error);
  }
}
