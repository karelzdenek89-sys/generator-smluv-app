import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { redis } from '@/lib/redis';
import { ContractType } from '@/lib/contracts';
import { stripe } from '@/lib/stripe';

export const runtime = 'nodejs';

const TIER_VALUES = ['basic', 'professional', 'complete'] as const;
type Tier = (typeof TIER_VALUES)[number];

const checkoutSchema = z.object({
  contractType: z.enum(['lease', 'car_sale', 'gift', 'work_contract', 'loan', 'nda', 'general_sale', 'employment', 'dpp', 'service', 'sublease', 'power_of_attorney', 'debt_acknowledgment', 'cooperation']),
  tier: z.enum(TIER_VALUES).optional(),
  notaryUpsell: z.boolean().optional().default(false),
  payload: z.record(z.string(), z.unknown()),
  email: z.string().email().optional(),
});

const CONTRACT_TITLES: Record<ContractType, string> = {
  gift: 'Darovací smlouva (2026)',
  work_contract: 'Smlouva o dílo (2026)',
  car_sale: 'Kupní smlouva na vozidlo (2026)',
  lease: 'Nájemní smlouva (2026)',
  loan: 'Smlouva o zápůjčce (2026)',
  nda: 'Smlouva o mlčenlivosti – NDA (2026)',
  general_sale: 'Kupní smlouva (2026)',
  employment: 'Pracovní smlouva (2026)',
  dpp: 'Dohoda o provedení práce – DPP (2026)',
  service: 'Smlouva o poskytování služeb (2026)',
  sublease: 'Podnájemní smlouva (2026)',
  power_of_attorney: 'Plná moc (2026)',
  debt_acknowledgment: 'Uznání dluhu (2026)',
  cooperation: 'Smlouva o spolupráci (2026)',
};

const CONTRACT_CANCEL_URLS: Record<ContractType, string> = {
  gift: '/darovaci',
  work_contract: '/smlouva-o-dilo',
  car_sale: '/auto',
  lease: '/najem',
  loan: '/pujcka',
  nda: '/nda',
  general_sale: '/kupni',
  employment: '/pracovni',
  dpp: '/dpp',
  service: '/sluzby',
  sublease: '/podnajem',
  power_of_attorney: '/plna-moc',
  debt_acknowledgment: '/uznani-dluhu',
  cooperation: '/spoluprace',
};

const TIER_PRICES: Record<Tier, number> = {
  basic: 249,
  professional: 449,
  complete: 749,
};

const TIER_DESCRIPTIONS: Record<Tier, string> = {
  basic: 'Základní dokument — profesionální smlouva dle OZ, PDF ke stažení',
  professional: 'Profesionální ochrana — rozšířené klauzule, smluvní pokuty a zajišťovací ustanovení',
  complete: 'Kompletní balíček — vše z Profesionální ochrany + průvodní instrukce, checklist a 30denní archivace',
};

/** Resolve tier from explicit `tier` field or legacy `notaryUpsell` boolean */
function resolveTier(tier: Tier | undefined, notaryUpsell: boolean): Tier {
  if (tier) return tier;
  return notaryUpsell ? 'professional' : 'basic';
}

function getPrice(contractType: ContractType, tier: Tier) {
  return {
    amountCzk: TIER_PRICES[tier],
    title: CONTRACT_TITLES[contractType],
    description: TIER_DESCRIPTIONS[tier],
  };
}

// Jednoduchý rate limit: max 10 checkoutů z jedné IP za hodinu
async function checkRateLimit(ip: string): Promise<boolean> {
  try {
    const key = `ratelimit:checkout:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, 3600);
    }
    return count <= 10;
  } catch (err) {
    // Pokud Redis selže, odmítneme request jako bezpečnostní opatření
    // (fail-closed: lepší false positive než bypass rate limitu)
    console.error('Rate limit Redis error:', err);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    // Rate limiting
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    const allowed = await checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Příliš mnoho požadavků. Zkuste to za chvíli.' },
        { status: 429 },
      );
    }

    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Neplatná data formuláře.' },
        { status: 400 },
      );
    }

    const { contractType, tier: rawTier, notaryUpsell, payload, email } = parsed.data;

    const tier = resolveTier(rawTier, notaryUpsell);

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      new URL(req.url).origin;

    const draftId = randomUUID();

    // TTL: 30 dní pro Kompletní balíček, 7 dní pro ostatní
    const TTL_SECONDS = tier === 'complete'
      ? 60 * 60 * 24 * 30
      : 60 * 60 * 24 * 7;

    // notaryUpsell pro backward compat s contracts.ts — professional i complete dostávají premium obsah
    const effectiveNotaryUpsell = tier !== 'basic';

    await redis.set(
      `contract:draft:${draftId}`,
      {
        contractType,
        tier,
        notaryUpsell: effectiveNotaryUpsell,
        email: email || null,
        payload: {
          ...payload,
          contractType,
          notaryUpsell: effectiveNotaryUpsell,
          tier,
        },
        paid: false,
        createdAt: new Date().toISOString(),
      },
      { ex: TTL_SECONDS },
    );

    const pricing = getPrice(contractType, tier);
    const cancelPath = CONTRACT_CANCEL_URLS[contractType];

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email || undefined,
      locale: 'cs',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'czk',
            unit_amount: pricing.amountCzk * 100,
            product_data: {
              name: pricing.title,
              description: pricing.description,
            },
          },
        },
      ],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}${cancelPath}`,
      metadata: {
        draftId,
        contractType,
        tier,
        notaryUpsell: String(effectiveNotaryUpsell),
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: 'Stripe nevrátil URL pro checkout.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Chyba při vytváření platby.' },
      { status: 500 },
    );
  }
}
