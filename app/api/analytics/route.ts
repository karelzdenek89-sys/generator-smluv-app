import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getClientIp, readFirstPartyJson } from '@/lib/api-security';
import {
  ANALYTICS_EVENT_NAMES,
  type AnalyticsEventName,
  type AnalyticsEventParams,
} from '@/lib/analytics';
import { recordAnalyticsEvent } from '@/lib/analytics-server';
import { redis } from '@/lib/redis';

export const runtime = 'nodejs';

const boundedString = z.string().max(512);
const boundedNumber = z.number().finite().min(0).max(1_000_000);

const eventSchema = z.object({
  event: z.enum(ANALYTICS_EVENT_NAMES),
  params: z
    .object({
      pathname: boundedString.optional(),
      source: boundedString.optional(),
      destination: boundedString.optional(),
      surface: boundedString.optional(),
      position: z.number().int().min(1).max(100).optional(),
      traffic_source: boundedString.optional(),
      traffic_label: boundedString.optional(),
      article_slug: boundedString.optional(),
      situation_key: z.enum(['landlord', 'vehicle_sale']).optional(),
      package_key: z.enum(['landlord', 'vehicle_sale', 'employer_start', 'work_order']).optional(),
      product_id: boundedString.optional(),
      offer_type: z.enum(['content_bundle', 'post_purchase', 'partner', 'annual_plan']).optional(),
      source_page: boundedString.optional(),
      locale: z.enum(['cs', 'en', 'ua']).optional(),
      partner_id: boundedString.optional(),
      provider: boundedString.optional(),
      offer_category: z.enum([
        'electronic_signature', 'vehicle_history', 'insurance', 'landlord_services',
        'construction_planning', 'invoicing', 'hr_payroll',
      ]).optional(),
      user_role: z.enum([
        'landlord', 'tenant', 'seller', 'buyer', 'employer', 'employee',
        'customer', 'client', 'contractor', 'supplier', 'freelancer', 'company', 'unknown',
      ]).optional(),
      placement: z.enum(['success', 'download']).optional(),
      revenue_czk: boundedNumber.optional(),
      partner_click_id: z.string().max(128).regex(/^[a-zA-Z0-9_-]+$/).optional(),
      partner_transaction_id: z.string().uuid().optional(),
      experiment_id: boundedString.optional(),
      variant: boundedString.optional(),
      monetization_mode: z.enum(['paid', 'freemium', 'free_experiment']).optional(),
      landing_page: boundedString.optional(),
      contract_type: z
        .enum([
          'lease',
          'car_sale',
          'gift',
          'work_contract',
          'loan',
          'nda',
          'general_sale',
          'employment',
          'dpp',
          'service',
          'sublease',
          'power_of_attorney',
          'debt_acknowledgment',
          'cooperation',
        ])
        .optional(),
      tier: z.enum(['basic', 'professional', 'complete', 'premium']).optional(),
      previous_tier: z.enum(['basic', 'professional', 'complete', 'premium']).optional(),
      cta_type: boundedString.optional(),
      price_band: z.enum(['0', '99', '199', '299', '399', '599']).optional(),
      entry_mode: z.enum(['single_document', 'package_flow']).optional(),
      add_on_key: z
        .enum(['docx', 'signing_checklist', 'handover_protocol', 'extended_archive', 'bilingual_annex'])
        .optional(),
      add_on_keys: boundedString.optional(),
      add_on_price_czk: boundedNumber.optional(),
      addons_total_czk: boundedNumber.optional(),
      base_price_czk: boundedNumber.optional(),
      total_price_czk: boundedNumber.optional(),
      selected_addons_count: z.number().int().min(0).max(20).optional(),
      download_format: z.enum(['pdf', 'docx']).optional(),
      download_sequence: z.number().int().min(1).max(1000).optional(),
      reject_reason: boundedString.optional(),
      reject_field: boundedString.optional(),
    })
    .partial()
    .optional(),
});

async function tryRateLimit(ip: string): Promise<'allowed' | 'limited' | 'unavailable'> {
  try {
    const key = `ratelimit:analytics:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, 60);
    return count <= 120 ? 'allowed' : 'limited';
  } catch (error) {
    console.warn('[analytics] Rate-limit unavailable:', error);
    return 'unavailable';
  }
}

export async function POST(req: Request) {
  const json = await readFirstPartyJson(req, 8 * 1024);
  if (!json.ok) {
    const status = json.error === 'invalid_origin' ? 403 : json.error === 'payload_too_large' ? 413 : 400;
    return NextResponse.json({ ok: false }, { status });
  }

  const rateLimit = await tryRateLimit(getClientIp(req));
  if (rateLimit !== 'allowed') {
    return NextResponse.json(
      { ok: false, error: rateLimit === 'limited' ? 'rate_limited' : 'storage_unavailable' },
      { status: rateLimit === 'limited' ? 429 : 503 },
    );
  }

  try {
    const parsed = eventSchema.safeParse(json.data);

    if (!parsed.success) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const event = parsed.data.event as AnalyticsEventName;
    const params = (parsed.data.params ?? {}) as AnalyticsEventParams;

    const stored = await recordAnalyticsEvent(event, params);

    if (!stored) {
      return NextResponse.json({ ok: false, error: 'storage_unavailable' }, { status: 503 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
