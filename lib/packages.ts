import {
  COMPLETE_ARCHIVE_DAYS,
  COMPLETE_UPSELL_DELTA_CZK,
  getTierArchiveDays,
  getTierPriceLabel,
  normalizePricingTier,
  type PricingTier,
} from './pricing';
import type { ContractType } from './contracts';
import { getTierIncludedItems } from './tier-copy';

export type ThematicPackageKey = 'landlord' | 'vehicle_sale';

export type ThematicPackageConfig = {
  key: ThematicPackageKey;
  slug: string;
  href: string;
  title: string;
  shortTitle: string;
  priceCzk: number;
  priceLabel: string;
  badge: string;
  contractType: ContractType;
  defaultTier: 'complete';
  archiveDays: typeof COMPLETE_ARCHIVE_DAYS;
  intro: string;
  perex: string;
  comparisonNote: string;
  suitableFor: string;
  cta: string;
  builderTitle: string;
  builderDescription: string;
  checkoutDescription: string;
  includedOutputs: readonly string[];
};

export const THEMATIC_PACKAGE_CONFIG: Record<
  ThematicPackageKey,
  ThematicPackageConfig
> = {
  landlord: {
    key: 'landlord',
    slug: 'balicek-pronajimatel',
    href: '/balicek-pronajimatel',
    title: 'Balíček pro pronajímatele',
    shortTitle: 'Pronajímatel',
    priceCzk: 299,
    priceLabel: '299 Kč',
    badge: 'Tematický balíček',
    contractType: 'lease',
    defaultTier: 'complete',
    archiveDays: COMPLETE_ARCHIVE_DAYS,
    intro:
      'Praktické řešení pro standardní pronájem bytu nebo domu. Nájemní smlouva, související podklady k předání a potvrzení o převzetí kauce na jednom místě.',
    perex:
      'Balíček navazuje na nájemní smlouvu v komplexní variantě a doplňuje ji o podklady, které se při předání bytu používají nejčastěji.',
    comparisonNote:
      'Oproti samostatné nájemní smlouvě obsahuje i související podklady pro standardní předání bytu a převzetí kauce.',
    suitableFor:
      'Vhodné pro pronajímatele, kteří chtějí připravit hlavní dokument i navazující podklady k podpisu a předání bytu v jednom kroku.',
    cta: 'Pokračovat k balíčku pro pronajímatele',
    builderTitle: 'Balíček pro pronajímatele',
    builderDescription:
      'Součástí výstupu bude nájemní smlouva v komplexní variantě, předávací protokol, potvrzení o převzetí kauce a praktické podklady k podpisu a předání.',
    checkoutDescription:
      'Nájemní smlouva v komplexní variantě se souvisejícími podklady pro standardní pronájem bytu nebo domu.',
    includedOutputs: [
      'Nájemní smlouva v komplexní variantě',
      'Předávací protokol jako příloha ke smlouvě',
      'Potvrzení o převzetí kauce',
      'Praktické podklady k podpisu a předání',
      `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
    ],
  },
  vehicle_sale: {
    key: 'vehicle_sale',
    slug: 'balicek-prodej-vozidla',
    href: '/balicek-prodej-vozidla',
    title: 'Balíček pro prodej vozidla',
    shortTitle: 'Prodej vozidla',
    priceCzk: 299,
    priceLabel: '299 Kč',
    badge: 'Tematický balíček',
    contractType: 'car_sale',
    defaultTier: 'complete',
    archiveDays: COMPLETE_ARCHIVE_DAYS,
    intro:
      'Praktické řešení pro standardní převod vozidla mezi prodávajícím a kupujícím. Kupní smlouva, předávací protokol, potvrzení o převzetí vozidla a podklady k převodu v jednom výstupu.',
    perex:
      'Balíček navazuje na kupní smlouvu na vozidlo v komplexní variantě a doplňuje ji o související podklady, které se při předání a převodu používají nejčastěji.',
    comparisonNote:
      'Oproti samostatné kupní smlouvě na vozidlo obsahuje i podklady pro fyzické předání vozidla, klíčů a dokladů.',
    suitableFor:
      'Vhodné pro prodávající i kupující, kteří chtějí zachytit standardní převod vozidla přehledně a v návaznosti na předání všech důležitých podkladů.',
    cta: 'Pokračovat k balíčku pro prodej vozidla',
    builderTitle: 'Balíček pro prodej vozidla',
    builderDescription:
      'Součástí výstupu bude kupní smlouva na vozidlo v komplexní variantě, předávací protokol, potvrzení o převzetí vozidla, klíčů a dokladů a praktické podklady k převodu.',
    checkoutDescription:
      'Kupní smlouva na vozidlo v komplexní variantě se souvisejícími podklady pro standardní převod a předání vozidla.',
    includedOutputs: [
      'Kupní smlouva na vozidlo v komplexní variantě',
      'Předávací protokol k vozidlu',
      'Potvrzení o převzetí vozidla, klíčů a dokladů',
      'Praktické podklady k převodu a předání',
      `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
    ],
  },
};

export const THEMATIC_PACKAGES = Object.values(
  THEMATIC_PACKAGE_CONFIG,
) as readonly ThematicPackageConfig[];

export function normalizeThematicPackageKey(
  value?: string | null,
): ThematicPackageKey | null {
  if (!value) return null;
  const normalized = String(value).trim().toLowerCase();
  if (normalized === 'landlord') return 'landlord';
  if (normalized === 'vehicle_sale') return 'vehicle_sale';
  return null;
}

export function getThematicPackageConfig(
  value?: string | null,
): ThematicPackageConfig | null {
  const key = normalizeThematicPackageKey(value);
  return key ? THEMATIC_PACKAGE_CONFIG[key] : null;
}

export function getEffectiveIncludedItems(
  contractType: string | null | undefined,
  tier: PricingTier,
  packageKey?: string | null,
): readonly string[] {
  const packageConfig = getThematicPackageConfig(packageKey);
  if (packageConfig) return packageConfig.includedOutputs;
  return getTierIncludedItems(contractType, tier);
}

export function getEffectivePurchaseTitle(
  tier: PricingTier,
  packageKey?: string | null,
): string {
  const packageConfig = getThematicPackageConfig(packageKey);
  if (packageConfig) return packageConfig.title;
  return normalizePricingTier(tier) === 'complete'
    ? 'Rozšířený dokument'
    : 'Základní dokument';
}

export function getEffectivePriceLabel(
  tier: PricingTier,
  packageKey?: string | null,
): string {
  const packageConfig = getThematicPackageConfig(packageKey);
  if (packageConfig) return packageConfig.priceLabel;
  return getTierPriceLabel(tier);
}

export function getEffectiveArchiveDays(
  tier: PricingTier,
  packageKey?: string | null,
): number {
  const packageConfig = getThematicPackageConfig(packageKey);
  if (packageConfig) return packageConfig.archiveDays;
  return getTierArchiveDays(tier);
}

export function getPackageUpgradeContext(
  packageKey?: string | null,
): string | null {
  const packageConfig = getThematicPackageConfig(packageKey);
  if (!packageConfig) return null;
  const deltaVsBasic = COMPLETE_UPSELL_DELTA_CZK + packageConfig.priceCzk - 199;
  return `${packageConfig.title} rozšiřuje samostatný dokument o související podklady za navýšení ${deltaVsBasic} Kč oproti základní variantě.`;
}
