import { redis } from '@/lib/redis';
import type { AnalyticsEventName, AnalyticsEventParams } from './analytics';

export const MAX_STORED_ANALYTICS_EVENTS = 5000;

function compactParams(params?: AnalyticsEventParams) {
  return Object.fromEntries(
    Object.entries(params ?? {}).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  );
}

function dimensionValue(value: unknown): string | undefined {
  if (typeof value === 'string' && value) return value;
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return undefined;
}

export async function recordAnalyticsEvent(
  event: AnalyticsEventName,
  params?: AnalyticsEventParams,
): Promise<boolean> {
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
    await redis.ltrim('analytics:events', 0, MAX_STORED_ANALYTICS_EVENTS - 1);
    await redis.hincrby(`analytics:summary:${day}:events`, event, 1);

    const dimensions: Array<[string, string | undefined]> = [
      ['source', dimensionValue(compact.source)],
      ['destination', dimensionValue(compact.destination)],
      ['surface', dimensionValue(compact.surface)],
      ['article', dimensionValue(compact.article_slug)],
      ['traffic', dimensionValue(compact.traffic_label ?? compact.traffic_source)],
      ['situation', dimensionValue(compact.situation_key)],
      ['package', dimensionValue(compact.package_key)],
      ['contract', dimensionValue(compact.contract_type)],
      ['tier', dimensionValue(compact.tier)],
      ['price_band', dimensionValue(compact.price_band)],
      ['partner', dimensionValue(compact.partner_id)],
      ['partner_offer', dimensionValue(compact.product_id)],
      ['partner_category', dimensionValue(compact.offer_category)],
      ['partner_role', dimensionValue(compact.user_role)],
      ['partner_locale', dimensionValue(compact.locale)],
      ['partner_placement', dimensionValue(compact.placement)],
      ['partner_experiment', dimensionValue(compact.experiment_id)],
      ['partner_variant', dimensionValue(compact.variant)],
      ['monetization_mode', dimensionValue(compact.monetization_mode)],
      ['landing_page', dimensionValue(compact.landing_page)],
      ['cta_type', dimensionValue(compact.cta_type)],
      ['entry_mode', dimensionValue(compact.entry_mode)],
      ['add_on', dimensionValue(compact.add_on_key)],
    ];

    await Promise.all(
      dimensions
        .filter(([, value]) => Boolean(value))
        .map(([dimension, value]) =>
          redis.hincrby(`analytics:summary:${day}:${dimension}`, String(value), 1),
        ),
    );
    return true;
  } catch (error) {
    console.warn('[analytics] fail-open', error);
    return false;
  }
}
