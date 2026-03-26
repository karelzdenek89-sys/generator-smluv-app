/**
 * Universální checkout endpoint – SmlouvaHned
 * Dostupný na /api/checkout i /api/pokladna
 *
 * Pravidla:
 *  - Redis fail-open: výpadek Redisu NIKDY nezastaví platbu
 *  - Tier „premium" i „complete" mapují na STRIPE_PRICE_ID_PREMIUM
 *  - Žádné přísné Zod schema – chybějící pole dostane výchozí hodnotu
 *  - automatic_payment_methods → Google Pay, Apple Pay, karty atd.
 */

import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { stripe } from '@/lib/stripe';

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

// ── Price ID (načítáme za běhu, ne při inicializaci modulu) ───────────────────

function getPriceId(tier: string): string | undefined {
  if (tier === 'basic')                        return process.env.STRIPE_PRICE_ID_BASIC;
  if (tier === 'professional')                 return process.env.STRIPE_PRICE_ID_PRO;
  if (tier === 'complete' || tier === 'premium') return process.env.STRIPE_PRICE_ID_PREMIUM;
  // neznámý tier → fallback na basic
  return process.env.STRIPE_PRICE_ID_BASIC;
}

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

    // notaryUpsell
    const notaryUpsell = Boolean(body.notaryUpsell) || tier !== 'basic';

    // email – prázdný string → undefined
    const rawEmail = typeof body.email === 'string' ? body.email.trim() : '';
    const email = rawEmail !== '' ? rawEmail : undefined;

    // payload
    const payload =
      body.payload && typeof body.payload === 'object' && !Array.isArray(body.payload)
        ? (body.payload as Record<string, unknown>)
        : body;

    // 3. Price ID
    const priceId = getPriceId(tier);
    if (!priceId) {
      console.error(`[checkout] Chybí Stripe Price ID pro tier: ${tier}`);
      return NextResponse.json(
        { error: 'Konfigurace ceny nenalezena. Kontaktujte podporu.' },
        { status: 500 },
      );
    }

    const baseUrl  = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin;
    const draftId  = randomUUID();
    const ttl      = (tier === 'complete' || tier === 'premium') ? 30 * 24 * 3600 : 7 * 24 * 3600;

    // 4. Uložení draftu do Redisu – FAIL-OPEN
    try {
      await redis.set(
        `contract:draft:${draftId}`,
        {
          contractType,
          tier,
          notaryUpsell,
          email: email ?? null,
          payload: { ...payload, contractType, tier, notaryUpsell },
          paid: false,
          createdAt: new Date().toISOString(),
        },
        { ex: ttl },
      );
    } catch (redisErr) {
      // Draft se neuložil, ale platba může proběhnout – webhook znovu sestaví data z metadat
      console.error('[checkout] Redis draft save fail-open:', redisErr);
    }

    // 5. Stripe Checkout Session
    // automatic_payment_methods zapíná Google Pay, Apple Pay a vše z Dashboardu
    // Stripe v20 typy tuto prop ještě neznají → přetypujeme přes unknown
    const cancelPath = CANCEL_URLS[contractType] ?? '/';

    const sessionParams = {
      mode:           'payment' as const,
      customer_email: email,
      locale:         'cs' as const,
      line_items:     [{ price: priceId, quantity: 1 }],
      success_url:    `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:     `${baseUrl}${cancelPath}`,
      metadata: {
        draftId,
        contractType,
        tier,
        notaryUpsell: String(notaryUpsell),
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
