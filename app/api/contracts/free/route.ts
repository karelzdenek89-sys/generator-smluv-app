import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getClientIp, isBoundedJsonObject, readFirstPartyJson } from '@/lib/api-security';
import { validateContractPayload } from '@/lib/checkout-validation';
import { normalizeLocale } from '@/lib/locale';
import { getMonetizationPolicy, isFreeBasicPolicy } from '@/lib/monetization-policy';
import { buildPartnerContext, isContractType } from '@/lib/partners/context';
import { redis } from '@/lib/redis';
import { takeRateLimit } from '@/lib/rate-limit';
import { recordAnalyticsEvent } from '@/lib/analytics-server';
import {
  FREE_DOCUMENT_TTL_SECONDS,
  freeDocumentKey,
  validateCurrentCheckoutConsent,
  type FreeDocumentRecord,
} from '@/lib/free-documents';
import {
  analyticsAttributionEventParams,
  normalizeConsentedCheckoutAnalyticsAttribution,
} from '@/lib/analytics-attribution';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const json = await readFirstPartyJson(req, 128 * 1024);
  if (!json.ok) {
    const status = json.error === 'invalid_origin' ? 403 : json.error === 'payload_too_large' ? 413 : 400;
    return NextResponse.json({ error: 'Neplatný požadavek.' }, { status });
  }

  const ip = getClientIp(req);
  try {
    const rate = await takeRateLimit(`ratelimit:free-create:${ip}`, 5, 60 * 60);
    if (!rate.allowed) return NextResponse.json({ error: 'Příliš mnoho požadavků.' }, { status: 429 });
  } catch {
    return NextResponse.json({ error: 'Služba je dočasně nedostupná.' }, { status: 503 });
  }

  const body = json.data;
  const analyticsConsentGranted = body.analyticsConsentGranted === true;
  const analyticsAttribution = normalizeConsentedCheckoutAnalyticsAttribution(
    analyticsConsentGranted,
    body.analyticsAttribution,
  );
  if (!isContractType(body.contractType) || body.tier !== 'basic') {
    return NextResponse.json({ error: 'Bezplatný režim je dostupný jen pro povolenou základní variantu.' }, { status: 400 });
  }
  if (body.packageKey || (Array.isArray(body.addOns) && body.addOns.length > 0)) {
    return NextResponse.json({ error: 'Balíčky a doplňky nejsou součástí bezplatné varianty.' }, { status: 400 });
  }

  const locale = normalizeLocale(body.lang);
  const policy = getMonetizationPolicy(body.contractType, locale);
  if (!isFreeBasicPolicy(policy)) {
    return NextResponse.json({ error: 'Bezplatný experiment není aktivní.' }, { status: 403 });
  }

  const consent = validateCurrentCheckoutConsent(body.consent);
  if (!consent) return NextResponse.json({ error: 'Souhlas je neplatný nebo zastaralý.' }, { status: 400 });
  const payload = body.payload && typeof body.payload === 'object' && !Array.isArray(body.payload)
    ? body.payload as Record<string, unknown>
    : null;
  if (!payload || !isBoundedJsonObject(payload, {
    maxDepth: 6,
    maxNodes: 1000,
    maxArrayLength: 100,
    maxStringLength: 20_000,
  })) {
    return NextResponse.json({ error: 'Neplatná nebo příliš velká data dokumentu.' }, { status: 400 });
  }
  const validated = validateContractPayload(body.contractType, payload);
  if (!validated.success) {
    return NextResponse.json({
      error: 'Dokument neobsahuje všechny povinné údaje.',
      field: validated.error.issues[0]?.path.join('.') || undefined,
    }, { status: 400 });
  }

  const freeId = randomUUID();
  const downloadToken = randomUUID();
  const partnerAttributionId = randomUUID();
  const createdAt = new Date();
  const storedPayload = {
    ...validated.data,
    contractType: body.contractType,
    tier: 'basic' as const,
    lang: locale,
    addOns: [],
    packageKey: null,
    notaryUpsell: false,
  };
  const partnerContext = buildPartnerContext({
    contractType: body.contractType,
    documentTier: 'basic',
    locale,
    rawContractData: validated.data,
    monetizationMode: policy.mode,
    paid: false,
    completed: true,
  });
  const record: FreeDocumentRecord = {
    freeId,
    contractType: body.contractType,
    tier: 'basic',
    lang: locale,
    payload: storedPayload,
    consent,
    policy,
    downloadToken,
    partnerContext,
    partnerAttributionId,
    analyticsConsentGranted,
    ...(analyticsAttribution ? { analyticsAttribution } : {}),
    createdAt: createdAt.toISOString(),
    expiresAt: new Date(createdAt.getTime() + FREE_DOCUMENT_TTL_SECONDS * 1000).toISOString(),
    downloadCount: 0,
  };
  try {
    await redis.set(freeDocumentKey(freeId), record, { ex: FREE_DOCUMENT_TTL_SECONDS });
  } catch {
    return NextResponse.json({ error: 'Dokument se nyní nepodařilo bezpečně uložit.' }, { status: 503 });
  }

  const completedParams = {
    contract_type: body.contractType,
    tier: 'basic',
    locale,
    source: 'free_document_api',
    monetization_mode: policy.mode,
    experiment_id: policy.experimentId ?? undefined,
    variant: policy.variant ?? undefined,
    ...analyticsAttributionEventParams(analyticsAttribution),
  } as const;
  if (analyticsConsentGranted) {
    await Promise.all([
      recordAnalyticsEvent('builder_completed', completedParams),
      recordAnalyticsEvent('free_document_generated', completedParams),
    ]);
  }
  return NextResponse.json({ freeId, token: downloadToken, expiresAt: record.expiresAt });
}
