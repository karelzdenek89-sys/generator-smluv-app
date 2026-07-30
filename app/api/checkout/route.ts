/**
 * Universální checkout endpoint – SmlouvaHned
 * Dostupný na /api/checkout i /api/pokladna
 *
 * Pravidla:
 *  - Draft payload musí být uložen před vytvořením platby
 *  - Tematické balíčky (299 Kč) → STRIPE_PRICE_ID_PACKAGE
 *  - Tier „complete"/„premium" → STRIPE_PRICE_ID_PREMIUM (199 Kč)
 *  - Payload každého typu smlouvy musí projít serverovým schématem
 *  - automatic_payment_methods → Google Pay, Apple Pay, karty atd.
 */

import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getClientIp, isBoundedJsonObject, readFirstPartyJson } from '@/lib/api-security';
import { redis } from '@/lib/redis';
import { stripe } from '@/lib/stripe';
import {
  getStripePriceIdForCheckout,
  normalizeThematicPackageKeyForContract,
} from '@/lib/packages';
import { normalizeLocale } from '@/lib/locale';
import { normalizePricingTier } from '@/lib/pricing';
import {
  CHECKOUT_ADDON_CONFIG,
  getArchiveDaysWithAddons,
  getCheckoutAddonMetadata,
  normalizeCheckoutAddons,
} from '@/lib/checkout-addons';
import { recordAnalyticsEvent } from '@/lib/analytics-server';
import type { CheckoutRejectReason } from '@/lib/analytics';
import { takeRateLimit } from '@/lib/rate-limit';
import {
  CHECKOUT_CONSENT_TEXT_VERSION,
  CHECKOUT_PRIVACY_VERSION,
  CHECKOUT_TERMS_VERSION,
  type CheckoutConsent,
} from '@/lib/checkout-authorization';
import {
  CONTRACT_TYPES,
  validateContractPayload,
  type ContractType,
} from '@/lib/checkout-validation';

export const runtime = 'nodejs';

// ── Typy smluv ────────────────────────────────────────────────────────────────

const CANCEL_URLS: Record<ContractType, string> = {
  lease:                '/najem',
  car_sale:             '/auto',
  gift:                 '/darovaci',
  work_contract:        '/smlouva-o-dilo',
  loan:                 '/pujcka',
  nda:                  '/nda',
  general_sale:         '/kupni',
  employment:           '/pracovni',
  dpp:                  '/dpp',
  service:              '/sluzby',
  sublease:             '/podnajem',
  power_of_attorney:    '/plna-moc',
  debt_acknowledgment:  '/uznani-dluhu',
  cooperation:          '/spoluprace',
};

// ── Rate limit ────────────────────────────────────────────────────────────────

async function tryRateLimit(ip: string): Promise<'allowed' | 'limited' | 'unavailable'> {
  try {
    const result = await takeRateLimit(`ratelimit:checkout:${ip}`, 20, 3600);
    return result.allowed ? 'allowed' : 'limited';
  } catch (err) {
    console.error('[checkout] Redis rate-limit unavailable:', err);
    return 'unavailable';
  }
}

// ── Hlavní handler ────────────────────────────────────────────────────────────

function priceBandForCheckout(tier: 'basic' | 'complete', packageKey?: string | null): '99' | '199' | '299' {
  if (packageKey) return '299';
  return tier === 'basic' ? '99' : '199';
}

/**
 * Records why a checkout was turned away, then returns the response unchanged.
 *
 * Every guard below ends the request before Stripe is reached, so without this
 * the attempt leaves no trace at all: the buyer sees an error, no order exists,
 * and reporting cannot tell a broken checkout from a change of heart.
 */
async function rejectCheckout(
  reason: CheckoutRejectReason,
  responseBody: Record<string, unknown>,
  status: number,
  details?: { contractType?: ContractType; field?: string },
): Promise<NextResponse> {
  await recordAnalyticsEvent('checkout_rejected', {
    source: 'checkout_modal',
    surface: 'checkout_endpoint',
    reject_reason: reason,
    ...(details?.contractType ? { contract_type: details.contractType } : {}),
    ...(details?.field ? { reject_field: details.field } : {}),
  });
  return NextResponse.json(responseBody, { status });
}

export async function POST(req: Request) {
  try {
    const json = await readFirstPartyJson(req, 128 * 1024);
    if (!json.ok) {
      const status = json.error === 'invalid_origin' ? 403 : json.error === 'payload_too_large' ? 413 : 400;
      return rejectCheckout('invalid_json', { error: 'Neplatný JSON požadavek.' }, status);
    }

    // 1. Rate limit
    const rateLimit = await tryRateLimit(getClientIp(req));
    if (rateLimit === 'limited') {
      return rejectCheckout('rate_limited', { error: 'Příliš mnoho požadavků. Zkuste to za chvíli.' }, 429);
    }
    if (rateLimit === 'unavailable') {
      return rejectCheckout(
        'storage_unavailable',
        { error: 'Platbu nyní nelze bezpečně zahájit. Zkuste to prosím znovu.' },
        503,
      );
    }

    // 2. Parsování body – checkout bez jasného contractType nesmí vytvořit default objednávku
    const body = json.data;

    // contractType
    const rawType = typeof body.contractType === 'string' ? body.contractType : '';
    if (!(CONTRACT_TYPES as readonly string[]).includes(rawType)) {
      return rejectCheckout('invalid_contract_type', { error: 'Neplatný typ dokumentu.' }, 400);
    }
    const contractType = rawType as ContractType;

    // tier – akceptujeme basic / professional / complete / premium
    const rawTier = typeof body.tier === 'string' ? body.tier.toLowerCase() : 'basic';
    const tier = ['basic', 'professional', 'complete', 'premium'].includes(rawTier)
      ? rawTier
      : 'basic';

    const paidTier = normalizePricingTier(tier);
    const notaryUpsell = paidTier !== 'basic';

    // Doručovací e-mail je samostatný údaj plátce. Nikdy jej neodvozujeme ze smluvních stran.
    const deliveryEmail = typeof body.deliveryEmail === 'string'
      ? body.deliveryEmail.trim().toLowerCase()
      : '';
    if (
      deliveryEmail.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(deliveryEmail)
    ) {
      return rejectCheckout('invalid_email', { error: 'Zadejte platný e-mail pro doručení dokumentu.' }, 400, { contractType });
    }

    const consentCandidate = body.consent;
    if (!consentCandidate || typeof consentCandidate !== 'object' || Array.isArray(consentCandidate)) {
      return rejectCheckout('consent_missing', { error: 'Chybí povinný souhlas s digitálním plněním.' }, 400, { contractType });
    }
    const consentRecord = consentCandidate as Record<string, unknown>;
    const acceptedAt = typeof consentRecord.acceptedAt === 'string' ? consentRecord.acceptedAt : '';
    const acceptedAtMs = Date.parse(acceptedAt);
    const now = Date.now();
    if (
      consentRecord.accepted !== true ||
      consentRecord.termsVersion !== CHECKOUT_TERMS_VERSION ||
      consentRecord.privacyVersion !== CHECKOUT_PRIVACY_VERSION ||
      consentRecord.textVersion !== CHECKOUT_CONSENT_TEXT_VERSION ||
      !Number.isFinite(acceptedAtMs) ||
      acceptedAtMs > now + 5 * 60_000 ||
      acceptedAtMs < now - 24 * 60 * 60_000
    ) {
      return rejectCheckout('consent_stale', { error: 'Souhlas je neplatný nebo zastaralý. Obnovte stránku a zkuste to znovu.' }, 400, { contractType });
    }
    const consent: CheckoutConsent = {
      accepted: true,
      acceptedAt: new Date(now).toISOString(),
      termsVersion: CHECKOUT_TERMS_VERSION,
      privacyVersion: CHECKOUT_PRIVACY_VERSION,
      textVersion: CHECKOUT_CONSENT_TEXT_VERSION,
    };

    // payload
    const payload =
      body.payload && typeof body.payload === 'object' && !Array.isArray(body.payload)
        ? (body.payload as Record<string, unknown>)
        : body;
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return rejectCheckout('payload_not_object', { error: 'Neplatná data dokumentu.' }, 400, { contractType });
    }
    if (!isBoundedJsonObject(payload, {
      maxDepth: 6,
      maxNodes: 1000,
      maxArrayLength: 100,
      maxStringLength: 20_000,
    })) {
      return rejectCheckout('payload_too_large', { error: 'Data dokumentu překračují povolené limity.' }, 400, { contractType });
    }
    const payloadValidation = validateContractPayload(contractType, payload);
    if (!payloadValidation.success) {
      const firstIssue = payloadValidation.error.issues[0];
      const invalidField = firstIssue?.path.join('.') || undefined;
      return rejectCheckout(
        'payload_invalid',
        { error: 'Dokument neobsahuje všechny povinné údaje.', field: invalidField },
        400,
        { contractType, field: invalidField },
      );
    }

    const lang = normalizeLocale(body.lang ?? payload.lang);

    const rawPackageKey =
      typeof body.packageKey === 'string'
        ? body.packageKey
        : typeof payload.packageKey === 'string'
          ? payload.packageKey
          : null;
    const packageKey = normalizeThematicPackageKeyForContract(rawPackageKey, contractType);
    const checkoutTier = packageKey ? 'complete' : paidTier;
    const addOns = normalizeCheckoutAddons(
      body.addOns ?? payload.addOns,
      contractType,
      checkoutTier,
      packageKey,
      lang,
    );

    // 3. Price ID
    const priceId = getStripePriceIdForCheckout(checkoutTier, packageKey);
    if (!priceId) {
      console.error(
        `[checkout] Chybí Stripe Price ID pro tier=${paidTier} packageKey=${packageKey ?? 'none'}`,
      );
      return rejectCheckout(
        'internal_error',
        { error: 'Konfigurace ceny nenalezena. Kontaktujte podporu.' },
        500,
        { contractType },
      );
    }

    const baseUrl  = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin;
    const draftId  = randomUUID();
    const archiveDays = getArchiveDaysWithAddons(checkoutTier, packageKey, addOns);
    const ttl      = archiveDays * 24 * 3600;

    // 4. Uložení draftu do Redisu — bez payloadu zákazník nedostane správný PDF výstup.
    const downloadToken = randomUUID();
    try {
      await redis.set(
        `contract:draft:${draftId}`,
        {
          contractType,
          tier: checkoutTier,
          packageKey,
          addOns,
          notaryUpsell: packageKey ? true : notaryUpsell,
          downloadToken,
          lang,
          deliveryEmail,
          consent,
          payload: {
            ...payload,
            contractType,
            tier: checkoutTier,
            packageKey,
            addOns,
            notaryUpsell: packageKey ? true : notaryUpsell,
            lang,
          },
          paid: false,
          createdAt: new Date().toISOString(),
        },
        { ex: ttl },
      );
    } catch (redisErr) {
      console.error('[checkout] Redis draft save failed:', redisErr);
      return rejectCheckout(
        'draft_persist_failed',
        { error: 'Dokument se nepodařilo bezpečně uložit před platbou. Zkuste to prosím znovu.' },
        503,
        { contractType },
      );
    }

    // 5. Stripe Checkout Session
    // automatic_payment_methods zapíná Google Pay, Apple Pay a vše z Dashboardu
    // Stripe v20 typy tuto prop ještě neznají → přetypujeme přes unknown
    const cancelPath = CANCEL_URLS[contractType] ?? '/';
    const langQuery = lang === 'cs' ? '' : `&lang=${encodeURIComponent(lang)}`;
    const successTokenFragment = `#token=${encodeURIComponent(downloadToken)}`;
    const cancelLangQuery = lang === 'cs' ? '' : `?lang=${encodeURIComponent(lang)}`;

    const lineItems = [
      { price: priceId, quantity: 1 },
      ...addOns.map((key) => {
        const addon = CHECKOUT_ADDON_CONFIG[key];
        return {
          price_data: {
            currency: 'czk',
            unit_amount: addon.priceCzk * 100,
            product_data: {
              name: addon.title,
              description: addon.description,
            },
          },
          quantity: 1,
        };
      }),
    ];

    const sessionParams = {
      mode:           'payment' as const,
      customer_email: deliveryEmail,
      locale:         (lang === 'cs' ? 'cs' : 'en') as 'cs' | 'en',
      line_items:     lineItems,
      success_url:    `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}${langQuery}${successTokenFragment}`,
      cancel_url:     `${baseUrl}${cancelPath}${cancelLangQuery}`,
      metadata: {
        draftId,
        contractType,
        tier: checkoutTier,
        lang,
        notaryUpsell: String(packageKey ? true : notaryUpsell),
        downloadToken,
        addOns: getCheckoutAddonMetadata(addOns),
        ...(packageKey ? { packageKey } : {}),
      },
    };

    // Bez payment_method_types → Stripe zobrazí vše povolené v Dashboardu
    // (Google Pay, Apple Pay, karty atd.)
    // automatic_payment_methods patří jen do PaymentIntent API, ne Checkout Sessions
    const session = await stripe.checkout.sessions.create(sessionParams);

    if (!session.url) throw new Error('Stripe nevrátil URL pro checkout.');

    await recordAnalyticsEvent('stripe_checkout_started', {
      source: 'checkout_modal',
      surface: 'checkout_endpoint',
      contract_type: contractType,
      tier: checkoutTier === 'basic' ? 'basic' : 'complete',
      package_key: packageKey ?? undefined,
      price_band: priceBandForCheckout(checkoutTier, packageKey),
      add_on_keys: addOns.join(','),
      selected_addons_count: addOns.length,
    });

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error('[checkout] Fatal error:', error);
    // Everything reachable before Stripe reports its own reason and returns early,
    // so an error surfacing here is either Stripe itself or genuinely unexpected.
    const isStripeError =
      typeof error === 'object' && error !== null && 'type' in error &&
      typeof (error as { type: unknown }).type === 'string' &&
      (error as { type: string }).type.startsWith('Stripe');
    return rejectCheckout(
      isStripeError ? 'stripe_unavailable' : 'internal_error',
      { error: 'Chyba při vytváření platby. Zkuste to prosím znovu.' },
      500,
    );
  }
}
