import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY;

if (!stripeSecret) {
  throw new Error('Missing STRIPE_SECRET_KEY in environment.');
}

export const stripe = new Stripe(stripeSecret, {
  apiVersion: '2026-02-25.clover',
});