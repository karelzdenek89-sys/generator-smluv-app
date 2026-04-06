import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  ANALYTICS_EVENT_NAMES,
  type AnalyticsEventName,
  type AnalyticsEventParams,
} from '@/lib/analytics';
import { recordAnalyticsEvent } from '@/lib/analytics-server';

export const runtime = 'nodejs';

const eventSchema = z.object({
  event: z.enum(ANALYTICS_EVENT_NAMES),
  params: z
    .object({
      pathname: z.string().optional(),
      source: z.string().optional(),
      destination: z.string().optional(),
      surface: z.string().optional(),
      article_slug: z.string().optional(),
      situation_key: z.enum(['landlord', 'vehicle_sale']).optional(),
      package_key: z.enum(['landlord', 'vehicle_sale']).optional(),
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
      tier: z.enum(['basic', 'complete']).optional(),
      previous_tier: z.enum(['basic', 'complete']).optional(),
      cta_type: z.string().optional(),
      price_band: z.enum(['99', '199', '299']).optional(),
      entry_mode: z.enum(['single_document', 'package_flow']).optional(),
    })
    .partial()
    .optional(),
});

export async function POST(req: Request) {
  try {
    const raw = await req.json();
    const parsed = eventSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const event = parsed.data.event as AnalyticsEventName;
    const params = (parsed.data.params ?? {}) as AnalyticsEventParams;

    await recordAnalyticsEvent(event, params);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
