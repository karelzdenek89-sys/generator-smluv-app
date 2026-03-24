import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { redis } from '@/lib/redis';
import { stripe } from '@/lib/stripe';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'Missing STRIPE_WEBHOOK_SECRET.' },
      { status: 500 },
    );
  }

  try {
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header.' },
        { status: 400 },
      );
    }

    const rawBody = await req.text();

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const draftId = session.metadata?.draftId;

      if (draftId) {
        const key = `contract:draft:${draftId}`;
        const existing = await redis.get<Record<string, unknown>>(key);

        if (existing) {
          await redis.set(
            key,
            {
              ...existing,
              paid: true,
              paidAt: new Date().toISOString(),
              stripeSessionId: session.id,
              paymentStatus: session.payment_status,
            },
            { ex: 60 * 60 * 24 },
          );
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook verification failed.' },
      { status: 400 },
    );
  }
}