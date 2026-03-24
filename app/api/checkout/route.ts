import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { redis } from '@/lib/redis';
import { ContractType } from '@/lib/contracts';
import { stripe } from '@/lib/stripe';

export const runtime = 'nodejs';

const checkoutSchema = z.object({
  contractType: z.enum(['lease', 'car_sale', 'gift', 'work_contract']),
  notaryUpsell: z.boolean().optional().default(false),
  payload: z.record(z.string(), z.unknown()),
});

const CONTRACT_TITLES: Record<ContractType, string> = {
  gift: 'Darovací smlouva (2026)',
  work_contract: 'Smlouva o dílo (2026)',
  car_sale: 'Kupní smlouva na vozidlo (2026)',
  lease: 'Nájemní smlouva (2026)',
};

function getPrice(contractType: ContractType, notaryUpsell: boolean) {
  const basePrice = 299;
  const notaryPrice = 1490;

  return {
    amountCzk: basePrice + (notaryUpsell ? notaryPrice : 0),
    title: CONTRACT_TITLES[contractType],
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Neplatná data formuláře.' },
        { status: 400 },
      );
    }

    const { contractType, notaryUpsell, payload } = parsed.data;

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      new URL(req.url).origin;

    const draftId = randomUUID();

    await redis.set(
      `contract:draft:${draftId}`,
      {
        contractType,
        notaryUpsell,
        payload: {
          ...payload,
          contractType,
          notaryUpsell,
        },
        paid: false,
        createdAt: new Date().toISOString(),
      },
      { ex: 60 * 60 * 24 },
    );

    const pricing = getPrice(contractType, notaryUpsell);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'czk',
            unit_amount: pricing.amountCzk * 100,
            product_data: {
              name: pricing.title,
              description: notaryUpsell
                ? 'Včetně přípravy pro notářské ověření'
                : 'Standardní verze',
            },
          },
        },
      ],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/`,
      metadata: {
        draftId,
        contractType,
        notaryUpsell: String(notaryUpsell),
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