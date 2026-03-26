import Stripe from 'stripe';

// Lazy initialization — client se vytvoří až při prvním volání,
// ne při importu modulu (buildu). Jinak Next.js build selže
// když env proměnné nejsou dostupné v build fázi.
function createStripe(): Stripe {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecret) {
    throw new Error('Missing STRIPE_SECRET_KEY in environment.');
  }

  return new Stripe(stripeSecret, {
    apiVersion: '2026-02-25.clover',
  });
}

let _stripe: Stripe | null = null;

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop: string | symbol) {
    if (!_stripe) _stripe = createStripe();
    return (_stripe as unknown as Record<string | symbol, unknown>)[prop];
  },
});
