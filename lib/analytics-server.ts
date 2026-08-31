import { redis } from '@/lib/redis';
import type { AnalyticsEventName, AnalyticsEventParams } from './analytics';

export const ANALYTICS_RAW_EVENT_LIMIT = 5000;
const ANALYTICS_RETENTION_SECONDS = 60 * 60 * 24 * 180;

const ALLOWED_DIMENSIONS: Record<string, ReadonlySet<string>> = {
  situation: new Set(['landlord', 'vehicle_sale']),
  package: new Set(['landlord', 'vehicle_sale', 'employer_start', 'work_order']),
  contract: new Set([
    'lease', 'car_sale', 'gift', 'work_contract', 'loan', 'nda', 'general_sale',
    'employment', 'dpp', 'service', 'sublease', 'power_of_attorney',
    'debt_acknowledgment', 'cooperation',
  ]),
  tier: new Set(['basic', 'professional', 'complete', 'premium']),
  price_band: new Set(['99', '199', '299', '399', '599']),
  partner: new Set([
    'signi', 'cebia', 'carvertical', 'usetreno', 'planstavby', 'idoklad', 'sloneek',
    'klik', 'epojisteni', 'dokobit', 'raynet',
  ]),
  partner_offer: new Set([
    'signi_esign', 'cebia_vehicle_history', 'carvertical_vehicle_history',
    'usetreno_tenant_insurance', 'usetreno_landlord_insurance', 'planstavby_budget',
    'idoklad_invoicing', 'sloneek_hr', 'klik_insurance', 'epojisteni_insurance',
    'dokobit_esign', 'raynet_crm',
  ]),
  partner_category: new Set([
    'electronic_signature', 'vehicle_history', 'insurance', 'landlord_services',
    'construction_planning', 'invoicing', 'hr_payroll', 'business_tools',
  ]),
  partner_role: new Set([
    'landlord', 'tenant', 'seller', 'buyer', 'employer', 'employee', 'customer',
    'client', 'contractor', 'supplier', 'freelancer', 'company', 'unknown',
  ]),
  partner_locale: new Set(['cs', 'en', 'ua']),
  partner_placement: new Set(['success', 'download']),
  monetization_mode: new Set(['paid', 'freemium', 'free_experiment']),
  entry_mode: new Set(['single_document', 'package_flow']),
  add_on: new Set(['docx', 'signing_checklist', 'handover_protocol', 'extended_archive', 'bilingual_annex']),
};

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
    await redis.ltrim('analytics:events', 0, ANALYTICS_RAW_EVENT_LIMIT - 1);
    await redis.expire('analytics:events', ANALYTICS_RETENTION_SECONDS);
    const eventSummaryKey = `analytics:summary:${day}:events`;
    await redis.hincrby(eventSummaryKey, event, 1);
    await redis.expire(eventSummaryKey, ANALYTICS_RETENTION_SECONDS);

    const dimensions: Array<[string, string | undefined]> = [
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
      ['monetization_mode', dimensionValue(compact.monetization_mode)],
      ['entry_mode', dimensionValue(compact.entry_mode)],
      ['add_on', dimensionValue(compact.add_on_key)],
    ];

    await Promise.all(
      dimensions.map(async ([dimension, value]) => {
        if (!value || !ALLOWED_DIMENSIONS[dimension]?.has(value)) return;
        const key = `analytics:summary:${day}:${dimension}`;
        await redis.hincrby(key, value, 1);
        await redis.expire(key, ANALYTICS_RETENTION_SECONDS);
      }),
    );
    return true;
  } catch (error) {
    console.warn('[analytics] fail-open', error);
    return false;
  }
}
