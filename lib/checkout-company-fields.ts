import type Stripe from 'stripe';

/**
 * Nepovinná firemní pole na platební stránce Stripe.
 *
 * FAQ slibuje, že na doklad lze uvést firemní IČO; zákazník ho proto musí mít
 * kam zadat přímo při nákupu. Hodnoty uloží Stripe ke Checkout Session
 * (Dashboard → platba → Checkout summary) a provozovatel je použije při
 * vystavení dokladu na firmu.
 *
 * Stripe zobrazuje stránku jen česky, nebo anglicky (EN i UA nákup), proto
 * popisky existují ve dvou jazycích. Limit popisku je 50 znaků.
 */
export function getCompanyCustomFields(
  lang: string,
): Stripe.Checkout.SessionCreateParams.CustomField[] {
  const isCzech = lang === 'cs';
  return [
    {
      key: 'ico',
      type: 'numeric',
      optional: true,
      label: {
        type: 'custom',
        custom: isCzech ? 'IČO (jen při nákupu na firmu)' : 'Company ID (IČO), if buying as a company',
      },
      numeric: { minimum_length: 8, maximum_length: 8 },
    },
    {
      key: 'companyname',
      type: 'text',
      optional: true,
      label: {
        type: 'custom',
        custom: isCzech ? 'Název firmy (jen při nákupu na firmu)' : 'Company name, if buying as a company',
      },
      text: { maximum_length: 100 },
    },
  ];
}

/**
 * Stripe odmítl jen firemní pole (např. po změně API)? Pak se platba vytvoří
 * bez nich — nepovinné IČO nesmí nikdy zablokovat nákup.
 */
export function isCompanyFieldsRejection(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;
  const { type, param } = error as { type?: unknown; param?: unknown };
  return type === 'StripeInvalidRequestError'
    && typeof param === 'string'
    && param.startsWith('custom_fields');
}
