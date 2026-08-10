/**
 * Roční plány — PŘIPRAVENÁ ARCHITEKTURA, ZATÍM BEZ PROVOZU.
 *
 * ─────────────────────────────────────────────────────────────────────────
 *  STAV: vypnuto. Produkt se nikde nenabízí a nelze jej koupit.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Aplikace dnes nemá infrastrukturu pro opakované platby. Konkrétně chybí:
 *
 *  1. Stripe v režimu `subscription`. Checkout vytváří výhradně
 *     `mode: 'payment'` (viz app/api/checkout/route.ts). Roční plán potřebuje
 *     recurring Price, `mode: 'subscription'` a obsluhu událostí
 *     `customer.subscription.created|updated|deleted` a
 *     `invoice.payment_failed` ve webhooku.
 *
 *  2. Trvalou identitu zákazníka. Objednávky se dnes párují přes e-mail
 *     a token s omezenou platností (lib/orders-portal.ts, TTL max 90 dní).
 *     Roční plán potřebuje záznam zákazníka, který přežije rok, a způsob
 *     ověření totožnosti při návratu.
 *
 *  3. Archiv delší než 90 dní. Draft i hotový dokument leží v Redisu s TTL
 *     odvozeným od varianty (7 / 30 / 90 dní). Roční archiv vyžaduje jiné
 *     úložiště nebo jinou politiku expirace včetně mazání po skončení plánu.
 *
 *  4. Hlídání termínů. Neexistuje plánovač, který by sledoval konec nájmu
 *     ani datum valorizace nájemného a odeslal upozornění. Je třeba cron
 *     nebo fronta a evidence odeslaných notifikací.
 *
 *  5. Dodatky k existující smlouvě. Generátor umí vytvořit nový dokument
 *     z formuláře, neumí navázat dodatek na dříve vytvořenou smlouvu.
 *
 *  6. Správu odběru pro zákazníka — přehled plánu, zrušení, faktury —
 *     a odpovídající úpravu obchodních podmínek a informací o automatickém
 *     obnovování před uzavřením smlouvy.
 *
 * Do doby, než bude vše výše hotové, nesmí vzniknout žádné UI, které by
 * roční plán prezentovalo jako dostupnou službu. Web dnes zákazníkům
 * výslovně sděluje, že žádné předplatné neprovozuje; dokud to platí,
 * musí `NEXT_PUBLIC_FEATURE_LANDLORD_ANNUAL` zůstat vypnuté.
 */

import { isFeatureEnabled } from './feature-flags';
import type { ContractType } from './contracts';

export type AnnualPlanKey = 'landlord_annual';

export type AnnualPlanConfig = {
  key: AnnualPlanKey;
  /** Interní název; veřejný marketingový název vznikne až se spuštěním. */
  title: string;
  /** Orientační cena za rok. Autoritou zůstane recurring Stripe Price. */
  priceCzk: number;
  priceLabel: string;
  /** Typ dokumentu, kolem kterého je plán postavený. */
  contractType: ContractType;
  /** Tematický balíček, který plán zahrnuje jako vstupní plnění. */
  includesPackageKey: 'landlord';
  /** Kolik dní má být dokument dostupný v rámci plánu. */
  archiveDays: number;
  /** Zamýšlený obsah plánu. Slouží jako zadání, nikoli jako slib zákazníkovi. */
  plannedBenefits: readonly string[];
  /** Serverová proměnná s recurring Stripe Price ID. Zatím nenastavená. */
  stripePriceEnvVar: string;
};

export const ANNUAL_PLAN_CONFIG: Record<AnnualPlanKey, AnnualPlanConfig> = {
  landlord_annual: {
    key: 'landlord_annual',
    title: 'Pronajímatel 12 měsíců',
    priceCzk: 690,
    priceLabel: '690 Kč / rok',
    contractType: 'lease',
    includesPackageKey: 'landlord',
    archiveDays: 365,
    plannedBenefits: [
      'Balíček pro pronajímatele jako vstupní plnění',
      'Archiv dokumentů po dobu trvání plánu',
      'Navazující dodatek k nájemní smlouvě',
      'Upozornění na blížící se konec nájmu',
      'Upozornění na sjednané datum valorizace nájemného',
    ],
    stripePriceEnvVar: 'STRIPE_PRICE_ID_LANDLORD_ANNUAL',
  },
};

/**
 * Je roční plán v provozu?
 *
 * Vyžaduje současně zapnutý flag i nastavené recurring Stripe Price ID.
 * Dokud platí obojí, vrací `false` a produkt se nikde neobjeví.
 */
export function isAnnualPlanAvailable(key: AnnualPlanKey): boolean {
  if (key !== 'landlord_annual') return false;
  if (!isFeatureEnabled('landlordAnnual')) return false;
  return Boolean(process.env.STRIPE_PRICE_ID_LANDLORD_ANNUAL?.trim());
}

/** Plány, které se smí zobrazit v nabídce. Dnes vždy prázdné. */
export function getAvailableAnnualPlans(): readonly AnnualPlanConfig[] {
  return Object.values(ANNUAL_PLAN_CONFIG).filter((plan) => isAnnualPlanAvailable(plan.key));
}
