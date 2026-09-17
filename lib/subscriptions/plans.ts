/**
 * Recurring produkty — PŘIPRAVENÁ ARCHITEKTURA, ZATÍM BEZ PRODEJE.
 *
 * Case Engine (Moje zakázka) uzavřel dvě z mezer popsaných v
 * lib/annual-plans.ts: existuje plánovač termínů (cron připomínek) a
 * navratový přístup bez hesla (magic link). Stále chybí Stripe
 * `mode: 'subscription'`, trvalá identita zákazníka a správa odběru.
 *
 * Proto se plány nikde neprodávají. S flagem `subscriptions` se smí zobrazit
 * pouze měřený zájem („Chci vědět, až bude k dispozici“) přes event
 * `subscription_interest`. Bez recurring Stripe Price ID zůstává
 * `isSubscriptionPlanPurchasable()` vždy `false`.
 */

import { isFeatureEnabled } from '@/lib/feature-flags';

export type SubscriptionPlanKey = 'contractor_pro' | 'employer_pro' | 'landlord_pro';

export type SubscriptionPlanConfig = {
  key: SubscriptionPlanKey;
  title: string;
  audience: string;
  /** Orientační cena; autoritou bude recurring Stripe Price. */
  priceCzkPerYear: number;
  priceLabel: string;
  plannedBenefits: readonly string[];
  /** Serverová proměnná s recurring Stripe Price ID. Zatím nenastavená. */
  stripePriceEnvVar: string;
  /** Kde měřit zájem. */
  interestSurfaces: readonly string[];
};

export const SUBSCRIPTION_PLAN_CONFIG: Record<SubscriptionPlanKey, SubscriptionPlanConfig> = {
  contractor_pro: {
    key: 'contractor_pro',
    title: 'Řemeslník / podnikatel 12 měsíců',
    audience: 'Řemeslníci, freelanceři a menší firmy s více zakázkami ročně.',
    priceCzkPerYear: 1490,
    priceLabel: '1 490 Kč / rok',
    plannedBenefits: [
      'Neomezený počet zakázek s termíny a připomínkami',
      'Opakované použití údajů o vaší straně',
      'Všechny dokumenty k zakázce (smlouva, změnový list, vícepráce, předání, vady)',
      'Archiv dokumentů po dobu trvání plánu',
    ],
    stripePriceEnvVar: 'STRIPE_PRICE_ID_CONTRACTOR_PRO',
    interestSurfaces: ['case_page', 'zakazka_hub'],
  },
  employer_pro: {
    key: 'employer_pro',
    title: 'Zaměstnavatel 12 měsíců',
    audience: 'Malí zaměstnavatelé a HR, kteří nabírají opakovaně.',
    priceCzkPerYear: 1990,
    priceLabel: '1 990 Kč / rok',
    plannedBenefits: [
      'Opakované pracovní smlouvy, DPP a navazující personální podklady',
      'Upozornění na legislativní změny relevantní pro zaměstnavatele',
      'Workflow nástupu a ukončení zaměstnance',
      'Archiv dokumentů po dobu trvání plánu',
    ],
    stripePriceEnvVar: 'STRIPE_PRICE_ID_EMPLOYER_PRO',
    interestSurfaces: ['zamestnavam_hub'],
  },
  landlord_pro: {
    key: 'landlord_pro',
    title: 'Pronajímatel 12 měsíců',
    audience: 'Pronajímatelé s více nájmy nebo opakovanými změnami.',
    priceCzkPerYear: 690,
    priceLabel: '690 Kč / rok',
    plannedBenefits: [
      'Více nájmů s termíny konce a valorizace',
      'Dodatky, prodloužení a ukončení nájmu',
      'Předávací protokoly a potvrzení o kauci',
      'Archiv dokumentů po dobu trvání plánu',
    ],
    stripePriceEnvVar: 'STRIPE_PRICE_ID_LANDLORD_ANNUAL',
    interestSurfaces: ['pro_pronajimatele'],
  },
};

export const SUBSCRIPTION_PLANS = Object.values(SUBSCRIPTION_PLAN_CONFIG) as readonly SubscriptionPlanConfig[];

/** Smí se zobrazit měřený zájem o plán? */
export function isSubscriptionInterestVisible(): boolean {
  return isFeatureEnabled('subscriptions');
}

/**
 * Chybí subscription webhook a správa odběru. Přepnout až po implementaci
 * (viz docs/CASE_ENGINE.md, sekce Recurring).
 */
const SUBSCRIPTION_BACKEND_READY = false;

/** Lze plán koupit? Dnes vždy `false` — recurring backend neexistuje. */
export function isSubscriptionPlanPurchasable(key: SubscriptionPlanKey): boolean {
  if (!isFeatureEnabled('subscriptions')) return false;
  const priceId = process.env[SUBSCRIPTION_PLAN_CONFIG[key].stripePriceEnvVar]?.trim();
  return SUBSCRIPTION_BACKEND_READY && Boolean(priceId);
}
