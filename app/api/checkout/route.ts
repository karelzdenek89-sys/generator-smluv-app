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

// ── Rate limit – FAIL-OPEN ────────────────────────────────────────────────────

async function tryRateLimit(ip: string): Promise<boolean> {
  try {
    const key = `ratelimit:checkout:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, 3600);
    return count <= 20;
  } catch (err) {
    // Redis nedostupný → fail-open, platbu neblokujeme
    console.error('[checkout] Redis rate-limit fail-open:', err);
    return true;
  }
}

// ── Hlavní handler ────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {

    // 1. Rate limit (fail-open)
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    const allowed = await tryRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Příliš mnoho požadavků. Zkuste to za chvíli.' },
        { status: 429 },
      );
    }

    // 2. Parsování body – bez přísné validace, chybějící pole = výchozí hodnota
    let body: Record<string, unknown> = {};
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      // prázdné nebo neplatné JSON body → jedeme s výchozími hodnotami
      console.warn('[checkout] Failed to parse request body, using defaults');
    }

    // contractType
    const rawType = typeof body.contractType === 'string' ? body.contractType : '';
    const contractType: ContractType = (VALID_CONTRACT_TYPES as readonly string[]).includes(rawType)
      ? (rawType as ContractType)
      : 'lease';

    // tier – akceptujeme basic / professional / complete / premium
    const rawTier = typeof body.tier === 'string' ? body.tier.toLowerCase() : 'basic';
    const tier = ['basic', 'professional', 'complete', 'premium'].includes(rawTier)
      ? rawTier
      : 'basic';

    const paidTier = normalizePricingTier(tier);
    const notaryUpsell = paidTier !== 'basic';

    // email – prázdný string → undefined
    const rawEmail = typeof body.email === 'string' ? body.email.trim() : '';
    const email = rawEmail !== '' ? rawEmail : undefined;

    // payload
    const payload =
      body.payload && typeof body.payload === 'object' && !Array.isArray(body.payload)
        ? (body.payload as Record<string, unknown>)
        : body;

    const lang = normalizeLocale(body.lang ?? payload.lang);

    const rawPackageKey =
      typeof body.packageKey === 'string'
        ? body.packageKey
        : typeof payload.packageKey === 'string'
          ? payload.packageKey
          : null;
    const packageKey = normalizeThematicPackageKeyForContract(rawPackageKey, contractType);
    const addOns = normalizeCheckoutAddons(
      body.addOns ?? payload.addOns,
      contractType,
      paidTier,
      packageKey,
      lang,
    );

    // 3. Price ID
    const priceId = getStripePriceIdForCheckout(paidTier, packageKey);
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
    const archiveDays = getArchiveDaysWithAddons(paidTier, packageKey, addOns);
    const ttl      = archiveDays * 24 * 3600;

    // 4. Uložení draftu do Redisu — bez payloadu zákazník nedostane správný PDF výstup.
    const downloadToken = randomUUID();
    try {
      await redis.set(
        `contract:draft:${draftId}`,
        {
          contractType,
          tier: paidTier,
          packageKey,
          addOns,
          notaryUpsell,
          downloadToken,
          lang,
          email: email ?? null,
          payload: {
            ...payload,
            contractType,
            tier: paidTier,
            packageKey,
            addOns,
            notaryUpsell,
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
        tier: paidTier,
        lang,
        notaryUpsell: String(notaryUpsell),
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

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error('[checkout] Fatal error:', error);
    return NextResponse.json(
      { error: 'Chyba při vytváření platby. Zkuste to prosím znovu.' },
      { status: 500 },
    );
  }
}
