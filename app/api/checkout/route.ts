import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { redis } from '@/lib/redis';
import { stripe } from '@/lib/stripe';
import { ContractType } from '@/lib/contracts';

export const runtime = 'nodejs';

const TIER_VALUES = ['basic', 'professional', 'complete'] as const;
type Tier = (typeof TIER_VALUES)[number];

const checkoutSchema = z.object({
  contractType: z.enum([
    'lease', 'car_sale', 'gift', 'work_contract', 'loan', 'nda',
    'general_sale', 'employment', 'dpp', 'service', 'sublease',
    'power_of_attorney', 'debt_acknowledgment', 'cooperation',
  ]),
  tier: z.enum(TIER_VALUES).optional(),
  notaryUpsell: z.boolean().optional().default(false),
  payload: z.record(z.string(), z.unknown()),
  email: z.string().email().optional(),
});

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

/** Čte Price IDs za běhu (ne při inicializaci modulu) — bezpečné pro Next.js build */
function getPriceId(tier: Tier): string | undefined {
  const map: Record<Tier, string | undefined> = {
    basic:        process.env.STRIPE_PRICE_ID_BASIC,
    professional: process.env.STRIPE_PRICE_ID_PRO,
    complete:     process.env.STRIPE_PRICE_ID_PREMIUM,
  };
  return map[tier];
}

async function checkRateLimit(ip: string): Promise<boolean> {
  try {
    const key = `ratelimit:checkout:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, 3600);
    return count <= 15;
  } catch (err) {
    console.error('Redis Rate Limit Error:', err);
    return true; // fail-open: platba je důležitější než rate-limit při výpadku Redisu
  }
}

export async function POST(req: Request) {
  try {
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
      return NextResponse.json({ error: 'Neplatná data formuláře.' }, { status: 400 });
    }

    const { contractType, tier: rawTier, notaryUpsell, payload, email } = parsed.data;
    const tier: Tier = rawTier || (notaryUpsell ? 'professional' : 'basic');

    // Price ID čteme za běhu (ne na úrovni modulu)
    const priceId = getPriceId(tier);
    if (!priceId) {
      console.error(`Missing Stripe Price ID for tier: ${tier}`);
      return NextResponse.json(
        { error: 'Konfigurace ceny nebyla nalezena.' },
        { status: 500 },
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin;
    const draftId = randomUUID();
    const TTL_SECONDS = tier === 'complete' ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7;
    const effectiveNotaryUpsell = tier !== 'basic';

    // Uložení draftu do Redisu
    try {
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
            tier,
            notaryUpsell: effectiveNotaryUpsell,
          },
          paid: false,
          createdAt: new Date().toISOString(),
        },
        { ex: TTL_SECONDS },
      );
    } catch (redisError) {
      console.error('Redis draft save error:', redisError);
      // Pokračujeme — platba je primární, draft doplníme z metadat po zaplacení
    }

    const cancelPath = CONTRACT_CANCEL_URLS[contractType] || '/';

    // Stripe Checkout Session
    // Bez payment_method_types → Stripe použije všechny metody povolené v Dashboardu
    // (Google Pay, Apple Pay, karty atd.) — automatic_payment_methods je jen pro PaymentIntent API
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email || undefined,
      locale: 'cs',
      line_items: [
        {
          price: priceId,
          quantity: 1,
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
      throw new Error('Stripe nevrátil URL pro checkout.');
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
