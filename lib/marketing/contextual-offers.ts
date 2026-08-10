/**
 * Kontextové produktové nabídky pro právní obsah.
 *
 * Jediné místo, kde se pro články definuje, jaký produkt k danému tématu
 * nabídnout. Ceny se vždy odvozují z `lib/pricing.ts` a `lib/packages.ts`,
 * takže se v článcích nikdy neobjeví natvrdo zapsaná částka, která by se
 * po změně ceníku rozešla se skutečností.
 *
 * Každá nabídka musí být vázaná na téma článku. Univerzální formulace typu
 * „Potřebujete smlouvu? Kupte ji zde." sem nepatří.
 */

import { THEMATIC_PACKAGE_CONFIG } from '@/lib/packages';
import { PRICING_TIER_CONFIG } from '@/lib/pricing';
import { isFeatureEnabled } from '@/lib/feature-flags';

export type ContextualOfferKey =
  | 'work_contract'
  | 'gift'
  | 'car_sale'
  | 'lease'
  | 'employment'
  | 'dpp'
  | 'nda'
  | 'cooperation';

export type ContextualOffer = {
  /** Identifikátor produktu pro analytiku. */
  product: string;
  title: string;
  description: string;
  price: string;
  cta: string;
  href: string;
  contractType: string;
  note?: string;
};

const COMPLETE = PRICING_TIER_CONFIG.complete;
const BASIC = PRICING_TIER_CONFIG.basic;

/** Rozsah ceníku pro samostatný dokument, např. „99–199 Kč". */
const SINGLE_DOCUMENT_RANGE = `${BASIC.priceCzk}–${COMPLETE.priceLabel}`;

const STANDARD_SCOPE_NOTE =
  'Standardizovaný online dokument pro běžnou situaci. Nejde o individuální právní posouzení.';

/**
 * Zakázka Plus se v článcích nabízí jen tehdy, když je balíček skutečně
 * v provozu. Jinak článek odkáže na samostatnou smlouvu o dílo, aby CTA
 * nikdy nevedlo na vypnutý produkt.
 */
function workContractOffer(): ContextualOffer {
  const pkg = THEMATIC_PACKAGE_CONFIG.work_order;
  if (isFeatureEnabled('zakazkaPlus')) {
    return {
      product: 'work_order_package',
      title: 'Řešíte celou zakázku?',
      description:
        'Připravte smlouvu, platební podmínky, vícepráce a předání díla v jednom balíčku.',
      price: pkg.priceLabel,
      cta: 'Připravit dokumentaci k zakázce',
      href: '/smlouva-o-dilo?package=work_order',
      contractType: 'work_contract',
      note: 'Vhodné pro standardní zakázku mezi objednatelem a zhotovitelem. Nejde o individuální právní posouzení.',
    };
  }
  return {
    product: 'work_contract_document',
    title: 'Potřebujete smlouvu o dílo k této zakázce?',
    description:
      'Formulář vás provede předmětem díla, cenou, harmonogramem, zárukou i sankcemi za prodlení. Výstupem je hotové PDF ke kontrole a podpisu.',
    price: SINGLE_DOCUMENT_RANGE,
    cta: 'Vytvořit smlouvu o dílo',
    href: '/smlouva-o-dilo',
    contractType: 'work_contract',
    note: STANDARD_SCOPE_NOTE,
  };
}

export function getContextualOffer(key: ContextualOfferKey): ContextualOffer {
  switch (key) {
    case 'work_contract':
      return workContractOffer();

    case 'gift':
      return {
        product: 'gift_document',
        title: 'Chcete darování zachytit písemně?',
        description:
          'Formulář pokryje předmět daru, okamžik přechodu vlastnictví, podmínky vrácení daru i náležitosti podle typu darované věci.',
        price: SINGLE_DOCUMENT_RANGE,
        cta: 'Vytvořit darovací smlouvu',
        href: '/darovaci',
        contractType: 'gift',
        note: STANDARD_SCOPE_NOTE,
      };

    case 'car_sale': {
      const pkg = THEMATIC_PACKAGE_CONFIG.vehicle_sale;
      return {
        product: 'vehicle_sale_package',
        title: 'Řešíte celý převod vozidla?',
        description:
          'Kupní smlouva, předávací protokol a podklady k předání vozidla, klíčů a dokladů v jednom výstupu.',
        price: pkg.priceLabel,
        cta: 'Připravit kompletní dokumentaci k prodeji vozidla',
        href: '/auto?package=vehicle_sale',
        contractType: 'car_sale',
        note: 'Vhodné pro standardní převod vozidla mezi prodávajícím a kupujícím. Nejde o individuální právní posouzení.',
      };
    }

    case 'lease': {
      const pkg = THEMATIC_PACKAGE_CONFIG.landlord;
      return {
        product: 'landlord_package',
        title: 'Pronajímáte byt a chcete mít podklady pohromadě?',
        description:
          'Nájemní smlouva, předávací protokol a potvrzení o převzetí kauce vzniknou z jednoho formuláře.',
        price: pkg.priceLabel,
        cta: 'Připravit dokumenty k pronájmu',
        href: '/najem?package=landlord',
        contractType: 'lease',
        note: 'Vhodné pro standardní pronájem bytu nebo domu. Nejde o individuální právní posouzení.',
      };
    }

    case 'employment': {
      const pkg = THEMATIC_PACKAGE_CONFIG.employer_start;
      return {
        product: 'employer_start_package',
        title: 'Nabíráte zaměstnance?',
        description:
          'Pracovní smlouva, informace podle § 37 zákoníku práce, podklady k home office a vybavení a nástupní checklist v jednom toku.',
        price: pkg.priceLabel,
        cta: 'Připravit dokumentaci k nástupu',
        href: '/pracovni?package=employer_start',
        contractType: 'employment',
        note: 'Vhodné pro standardní nástup zaměstnance v České republice. Nejde o individuální právní posouzení.',
      };
    }

    case 'dpp':
      return {
        product: 'dpp_document',
        title: 'Potřebujete dohodu o provedení práce?',
        description:
          'Formulář hlídá limit 300 hodin, odměnu, rozhodný příjem i povinnosti při registraci zaměstnance podle pravidel roku 2026.',
        price: SINGLE_DOCUMENT_RANGE,
        cta: 'Vytvořit dohodu o provedení práce',
        href: '/dpp',
        contractType: 'dpp',
        note: STANDARD_SCOPE_NOTE,
      };

    case 'nda':
      return {
        product: 'nda_document',
        title: 'Chcete důvěrné informace ošetřit smluvně?',
        description:
          'Formulář vymezí, co je důvěrná informace, na jak dlouho závazek platí, jaké jsou výjimky a jaká sankce se uplatní při porušení.',
        price: SINGLE_DOCUMENT_RANGE,
        cta: 'Vytvořit smlouvu o mlčenlivosti',
        href: '/nda',
        contractType: 'nda',
        note: STANDARD_SCOPE_NOTE,
      };

    case 'cooperation':
      return {
        product: 'cooperation_document',
        title: 'Domlouváte spolupráci mezi podnikateli?',
        description:
          'Formulář zachytí předmět spolupráce, odměnu a fakturaci, rozdělení odpovědnosti, mlčenlivost i podmínky ukončení.',
        price: SINGLE_DOCUMENT_RANGE,
        cta: 'Vytvořit smlouvu o spolupráci',
        href: '/spoluprace',
        contractType: 'cooperation',
        note: STANDARD_SCOPE_NOTE,
      };
  }
}
