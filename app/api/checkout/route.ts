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
  contractType: z.enum(['lease', 'car_sale', 'gift', 'work_contract', 'loan', 'nda', 'general_sale', 'employment', 'dpp', 'service', 'sublease', 'power_of_attorney', 'debt_acknowledgment', 'cooperation']),
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

/** Mapování tierů na Environment Variables z Vercelu */
const TIER_PRICE_IDS: Record<Tier, string | undefined> = {
  basic: process.env.STRIPE_PRICE_ID_BASIC,
  professional: process.env.STRIPE_PRICE_ID_PRO,
  complete: process.env.STRIPE_PRICE_ID_PREMIUM,
};

// Fail-safe rate limit: Pokud Redis selže, logujeme chybu, ale pustíme uživatele dál
async function checkRateLimit(ip: string): Promise<boolean> {
  try {
    const key = `ratelimit:checkout:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, 3600);
    }
    return count <= 15; // Zvýšeno na 15 pro jistotu
  } catch (err) {
    console.error('Redis Rate Limit Error (Failing open):', err);
    return true; // Pustíme uživatele i při chybě Redisu
  }
}

export async function POST(req: Request) {
  try {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    
    // Kontrola limitů
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

    // Logika určení tarifu
    let tier: Tier = rawTier || (notaryUpsell ? 'professional' : 'basic');
    const priceId = TIER_PRICE_IDS[tier];

    if (!priceId) {
      console.error(`Missing Price ID for tier: ${tier}`);
      return NextResponse.json({ error: 'Konfigurace ceny nebyla nalezena.' }, { status: 500 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin;
    const draftId = randomUUID();

    // Uložení draftu do Redisu
    try {
      const TTL_SECONDS = tier === 'complete' ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7;
      const effectiveNotaryUpsell = tier !== 'basic';

      await redis.set(
        `contract:draft:${draftId}`,
        {
          contractType,
          tier,
          notaryUpsell: effectiveNotaryUpsell,
          email: email || null,
          payload: { ...payload, contractType, tier },
          paid: false,
          createdAt: new Date().toISOString(),
        },
        { ex: TTL_SECONDS },
      );
    } catch (redisError) {
      console.error('Failed to save draft to Redis:', redisError);
      // Pokračujeme dál – platba je důležitější než okamžitý draft v Redisu
    }

    const cancelPath = CONTRACT_CANCEL_URLS[contractType] || '/';

    // Vytvoření Stripe Checkout Session pomocí Price ID
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email || undefined,
      locale: 'cs',
      payment_method_types: ['card'], // Můžeš změnit na automatic_payment_methods: { enabled: true }
      line_items: [
        {
          price: priceId, // Používáme tvé ID z Vercelu (price_1T...)
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}${cancelPath}`,
      metadata: {
        draftId,
        contractType,
        tier,
      },
    });

    if (!session.url) {
      throw new Error('Stripe nevrátil URL.');
    }

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Final Checkout Error:', error);
    return NextResponse.json(
      { error: error.message || 'Chyba při vytváření platby.' },
      { status: 500 },
    );
  }
}