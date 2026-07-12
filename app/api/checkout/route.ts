/**
 * Universální checkout endpoint – SmlouvaHned
 * Dostupný na /api/checkout i /api/pokladna
 *
 * Pravidla:
 *  - Draft payload musí být uložen před vytvořením platby
 *  - Tematické balíčky (299 Kč) → STRIPE_PRICE_ID_PACKAGE
 *  - Tier „complete"/„premium" → STRIPE_PRICE_ID_PREMIUM (199 Kč)
 *  - Žádné přísné Zod schema – chybějící pole dostane výchozí hodnotu
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

export const runtime = 'nodejs';

// ── Typy smluv ────────────────────────────────────────────────────────────────

const VALID_CONTRACT_TYPES = [
  'lease', 'car_sale', 'gift', 'work_contract', 'loan', 'nda',
  'general_sale', 'employment', 'dpp', 'service', 'sublease',
  'power_of_attorney', 'debt_acknowledgment', 'cooperation',
] as const;
type ContractType = (typeof VALID_CONTRACT_TYPES)[number];

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
    const key = `ratelimit:checkout:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, 3600);
    return count <= 20 ? 'allowed' : 'limited';
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

export async function POST(req: Request) {
  try {
    const json = await readFirstPartyJson(req, 128 * 1024);
    if (!json.ok) {
      const status = json.error === 'invalid_origin' ? 403 : json.error === 'payload_too_large' ? 413 : 400;
      return NextResponse.json({ error: 'Neplatný JSON požadavek.' }, { status });
    }

    // 1. Rate limit
    const rateLimit = await tryRateLimit(getClientIp(req));
    if (rateLimit === 'limited') {
      return NextResponse.json(
        { error: 'Příliš mnoho požadavků. Zkuste to za chvíli.' },
        { status: 429 },
      );
    }
    if (rateLimit === 'unavailable') {
      return NextResponse.json(
        { error: 'Platbu nyní nelze bezpečně zahájit. Zkuste to prosím znovu.' },
        { status: 503 },
      );
    }

    // 2. Parsování body – checkout bez jasného contractType nesmí vytvořit default objednávku
    const body = json.data;

    // contractType
    const rawType = typeof body.contractType === 'string' ? body.contractType : '';
    if (!(VALID_CONTRACT_TYPES as readonly string[]).includes(rawType)) {
      return NextResponse.json({ error: 'Neplatný typ dokumentu.' }, { status: 400 });
    }
    const contractType = rawType as ContractType;

    // tier – akceptujeme basic / professional / complete / premium
    const rawTier = typeof body.tier === 'string' ? body.tier.toLowerCase() : 'basic';
    const tier = ['basic', 'professional', 'complete', 'premium'].includes(rawTier)
      ? rawTier
      : 'basic';

    const paidTier = normalizePricingTier(tier);
    const notaryUpsell = paidTier !== 'basic';

    // email – prázdný string → undefined
    const rawEmail = typeof body.email === 'string' ? body.email.trim() : '';
    if (rawEmail.length > 254 || (rawEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail))) {
      return NextResponse.json({ error: 'Neplatný formát e-mailu.' }, { status: 400 });
    }
    const email = rawEmail !== '' ? rawEmail : undefined;

    // payload
    const payload =
      body.payload && typeof body.payload === 'object' && !Array.isArray(body.payload)
        ? (body.payload as Record<string, unknown>)
        : body;
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return NextResponse.json({ error: 'Neplatná data dokumentu.' }, { status: 400 });
    }
    if (!isBoundedJsonObject(payload, {
      maxDepth: 6,
      maxNodes: 1000,
      maxArrayLength: 100,
      maxStringLength: 20_000,
    })) {
      return NextResponse.json({ error: 'Data dokumentu překračují povolené limity.' }, { status: 400 });
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
      return NextResponse.json(
        { error: 'Konfigurace ceny nenalezena. Kontaktujte podporu.' },
        { status: 500 },
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
          email: email ?? null,
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
      return NextResponse.json(
        { error: 'Dokument se nepodařilo bezpečně uložit před platbou. Zkuste to prosím znovu.' },
        { status: 503 },
      );
    }

    // 5. Stripe Checkout Session
    // automatic_payment_methods zapíná Google Pay, Apple Pay a vše z Dashboardu
    // Stripe v20 typy tuto prop ještě neznají → přetypujeme přes unknown
    const cancelPath = CANCEL_URLS[contractType] ?? '/';
    const langQuery = lang === 'cs' ? '' : `&lang=${encodeURIComponent(lang)}`;
    const successTokenQuery = `&token=${encodeURIComponent(downloadToken)}`;
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
      customer_email: email,
      locale:         (lang === 'cs' ? 'cs' : 'en') as 'cs' | 'en',
      line_items:     lineItems,
      success_url:    `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}${langQuery}${successTokenQuery}`,
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
    return NextResponse.json(
      { error: 'Chyba při vytváření platby. Zkuste to prosím znovu.' },
      { status: 500 },
    );
  }
}
