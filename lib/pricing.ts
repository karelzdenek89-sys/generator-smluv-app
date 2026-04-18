export type PricingTier = 'basic' | 'complete';
export type LegacyPricingTier = PricingTier | 'professional' | 'premium';

export type PricingTierConfig = {
  key: PricingTier;
  title: string;
  priceCzk: number;
  priceLabel: string;
  shortDescription: string;
  sectionDescription: string;
  bullets: string[];
  cta: string;
  badge?: string;
  highlighted?: boolean;
};

export type BuilderPricingOption = {
  value: PricingTier;
  label: string;
  price: string;
  desc: string;
  badge?: string;
  recommended?: boolean;
};

export const PRICING_TIER_CONFIG: Record<PricingTier, PricingTierConfig> = {
  basic: {
    key: 'basic',
    title: 'Základní dokument',
    priceCzk: 99,
    priceLabel: '99 Kč',
    shortDescription: 'Pro běžné a standardní situace.',
    sectionDescription: 'Pro běžné a standardní situace.',
    bullets: [
      'vyplnění dokumentu online',
      'hotové PDF ihned po zaplacení',
      'standardní ustanovení pro běžné situace',
      'vhodné pro obvyklé a přímočaré případy',
      'dostupnost odkazu ke stažení 7 dní',
    ],
    cta: 'Pokračovat se základní variantou',
  },
  complete: {
    key: 'complete',
    title: 'Rozšířený dokument',
    priceCzk: 199,
    priceLabel: '199 Kč',
    shortDescription: 'Pro situace, kde požadujete širší rozsah a vyšší míru jistoty.',
    sectionDescription: 'Pro situace, kde požadujete širší rozsah a vyšší míru jistoty.',
    bullets: [
      'vše ze základní varianty',
      'rozšířené varianty ustanovení podle typu dokumentu',
      'doplňující praktické podklady k podpisu a použití',
      'vhodné pro citlivější nebo složitější případy',
      'dostupnost odkazu ke stažení 30 dní',
    ],
    cta: 'Pokračovat s rozšířeným dokumentem',
    badge: 'Doporučená volba',
    highlighted: true,
  },
};

export const PRICING_TIERS = [
  PRICING_TIER_CONFIG.basic,
  PRICING_TIER_CONFIG.complete,
] as const;

export const PRICING_SECTION_COPY = {
  heading: 'Vyberte úroveň zpracování dokumentu',
  intro:
    'Každý dokument vytváříte prostřednictvím přehledného online formuláře. Zvolte variantu, která odpovídá vaší situaci a požadovanému rozsahu dokumentu.',
  footer:
    'Pro vybrané situace jsou k dispozici i tematické balíčky se souvisejícími podklady. Aktuálně nabízíme řešení pro pronajímatele a pro převod vozidla.',
} as const;

export const PRICING_RANGE = {
  lowPrice: '99',
  highPrice: '199',
  priceCurrency: 'CZK',
  offerCount: '2',
} as const;

export const BASIC_ARCHIVE_DAYS = 7;
export const COMPLETE_ARCHIVE_DAYS = 30;
export const COMPLETE_UPSELL_DELTA_CZK = 100;

export const BUILDER_PRICING_OPTIONS: readonly BuilderPricingOption[] = [
  {
    value: 'basic',
    label: PRICING_TIER_CONFIG.basic.title,
    price: PRICING_TIER_CONFIG.basic.priceLabel,
    desc: PRICING_TIER_CONFIG.basic.shortDescription,
  },
  {
    value: 'complete',
    label: PRICING_TIER_CONFIG.complete.title,
    price: PRICING_TIER_CONFIG.complete.priceLabel,
    desc: PRICING_TIER_CONFIG.complete.shortDescription,
    badge: PRICING_TIER_CONFIG.complete.badge,
    recommended: true,
  },
] as const;

export const BUILDER_COMPLETE_PERKS = [
  'Rozšířené varianty ustanovení',
  'Praktický checklist a instrukce',
  `${COMPLETE_ARCHIVE_DAYS}denní dostupnost odkazu`,
] as const;

export const CHECKOUT_INCLUDED_ITEMS = [
  'PDF dokument sestavený podle zadaných údajů',
  'Přehledná struktura určená ke kontrole a podpisu',
  'Stažení ihned po ověřené platbě',
] as const;

export const PRICING_UPSELL_COPY = {
  title: 'Rozšířit na Rozšířený dokument',
  description:
    'Vyšší varianta přidává širší rozsah ustanovení a doplňující podklady pro citlivější situace.',
  cta: 'Rozšířit na Rozšířený dokument',
} as const;

export function normalizePricingTier(tier?: string | null): PricingTier {
  const normalized = String(tier ?? 'basic').toLowerCase();
  if (normalized === 'complete' || normalized === 'professional' || normalized === 'premium') {
    return 'complete';
  }
  return 'basic';
}

export function getPricingTierConfig(tier?: string | null): PricingTierConfig {
  return PRICING_TIER_CONFIG[normalizePricingTier(tier)];
}

export function getTierPriceCzk(tier?: string | null): number {
  return getPricingTierConfig(tier).priceCzk;
}

export function getTierPriceLabel(tier?: string | null): string {
  return getPricingTierConfig(tier).priceLabel;
}

export function getTierArchiveDays(tier?: string | null): 7 | 30 {
  return normalizePricingTier(tier) === 'complete' ? COMPLETE_ARCHIVE_DAYS : BASIC_ARCHIVE_DAYS;
}

export function getTierUpsellAmountLabel(tier?: string | null): string {
  return normalizePricingTier(tier) === 'complete' ? '+100 Kč' : '';
}

export function getTierArchiveDaysLabel(tier?: string | null): string {
  return `${getTierArchiveDays(tier)} dní`;
}
