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
import { getLocalizedIncludedItems, getLocalizedPackagePresentation } from './i18n/pricing-locale';

export type ThematicPackageKey = 'landlord' | 'vehicle_sale' | 'employer_start';

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
  includesDocx?: boolean;
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
  employer_start: {
    key: 'employer_start',
    slug: 'balicek-zamestnavatel',
    href: '/balicek-zamestnavatel',
    title: 'Zaměstnavatel Start 2026',
    shortTitle: 'Zaměstnavatel Start',
    priceCzk: 599,
    priceLabel: '599 Kč',
    badge: 'Personální balíček',
    contractType: 'employment',
    defaultTier: 'complete',
    archiveDays: COMPLETE_ARCHIVE_DAYS,
    intro:
      'Ucelený dokumentační balíček pro nástup zaměstnance do běžného pracovního poměru. Pracovní smlouva, informace podle § 37 zákoníku práce a navazující podklady vzniknou z jednoho formuláře.',
    perex:
      'Balíček navazuje na pracovní smlouvu v rozšířené variantě a doplňuje ji o dokumenty, které zaměstnavatel při standardním nástupu zaměstnance typicky potřebuje předat, potvrdit nebo archivovat.',
    comparisonNote:
      'Oproti samostatné pracovní smlouvě obsahuje informační list podle § 37 ZP, podklady k práci na dálku a vybavení, nástupní checklist a editovatelný DOCX.',
    suitableFor:
      'Vhodné pro malé zaměstnavatele a HR, kteří nabírají zaměstnance do standardního pracovního poměru v České republice a chtějí připravit hlavní dokument i navazující personální podklady v jednom toku.',
    cta: 'Připravit balíček Zaměstnavatel Start',
    builderTitle: 'Zaměstnavatel Start 2026',
    builderDescription:
      'Součástí výstupu bude pracovní smlouva v rozšířené variantě, samostatná informace podle § 37 ZP, dohoda o práci na dálku při zvoleném home office, protokol k pracovnímu vybavení, nástupní checklist a PDF i DOCX.',
    checkoutDescription:
      'Dokumentační balíček pro standardní nástup zaměstnance včetně informačního listu podle § 37 ZP, navazujících personálních podkladů a DOCX.',
    includedOutputs: [
      'Pracovní smlouva v rozšířené variantě',
      'Informace o obsahu pracovního poměru podle § 37 ZP',
      'Dohoda o práci na dálku při zvoleném home office',
      'Protokol o předání pracovního vybavení',
      'Nástupní checklist zaměstnavatele',
      'PDF a editovatelná DOCX verze',
      `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
    ],
    includesDocx: true,
  },
};

export const THEMATIC_PACKAGES = Object.values(
  THEMATIC_PACKAGE_CONFIG,
) as readonly ThematicPackageConfig[];

/** Coerce unknown draft payload values to a thematic package key. */
export function packageKeyFromUnknown(value: unknown): ThematicPackageKey | null {
  return typeof value === 'string' ? normalizeThematicPackageKey(value) : null;
}

export function normalizeThematicPackageKey(
  value?: string | null,
): ThematicPackageKey | null {
  if (!value) return null;
  const normalized = String(value).trim().toLowerCase();
  if (normalized === 'landlord') return 'landlord';
  if (normalized === 'vehicle_sale') return 'vehicle_sale';
  if (normalized === 'employer_start') return 'employer_start';
  return null;
}

export function getThematicPackageConfig(
  value?: string | null,
): ThematicPackageConfig | null {
  const key = normalizeThematicPackageKey(value);
  return key ? THEMATIC_PACKAGE_CONFIG[key] : null;
}

export function normalizeThematicPackageKeyForContract(
  value: string | null | undefined,
  contractType: ContractType,
): ThematicPackageKey | null {
  const packageConfig = getThematicPackageConfig(value);
  if (!packageConfig || packageConfig.contractType !== contractType) return null;
  return packageConfig.key;
}

export function getEffectiveIncludedItems(
  contractType: string | null | undefined,
  tier: PricingTier,
  packageKey?: string | null,
  locale?: string | null,
): readonly string[] {
  const packageConfig = getThematicPackageConfig(packageKey);
  if (packageConfig) {
    const localized = getLocalizedPackagePresentation(packageConfig.key, locale);
    if (localized) return getLocalizedIncludedItems(contractType, tier, packageKey, locale);
    return packageConfig.includedOutputs;
  }
  if (locale && locale !== 'cs') {
    return getLocalizedIncludedItems(contractType, tier, packageKey, locale);
  }
  return getTierIncludedItems(contractType, tier);
}

export function getEffectivePurchaseTitle(
  tier: PricingTier,
  packageKey?: string | null,
  locale?: string | null,
): string {
  const packageConfig = getThematicPackageConfig(packageKey);
  if (packageConfig) {
    const localized = getLocalizedPackagePresentation(packageConfig.key, locale);
    if (localized) return localized.title;
    return packageConfig.title;
  }
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

/**
 * Stripe Price ID for checkout. The 299 Kč packages share STRIPE_PRICE_ID_PACKAGE;
 * Employer Start has its own 599 Kč Stripe Price and must never fall back to 299/199 Kč.
 */
export function getStripePriceIdForCheckout(
  tier: string,
  packageKey?: string | null,
): string | undefined {
  const pkg = normalizeThematicPackageKey(packageKey);
  if (pkg === 'employer_start') {
    return process.env.STRIPE_PRICE_ID_EMPLOYER_START;
  }
  if (pkg) {
    return process.env.STRIPE_PRICE_ID_PACKAGE;
  }
  if (tier === 'basic') return process.env.STRIPE_PRICE_ID_BASIC;
  if (tier === 'professional') return process.env.STRIPE_PRICE_ID_PRO;
  if (tier === 'complete' || tier === 'premium') {
    return process.env.STRIPE_PRICE_ID_PREMIUM ?? process.env.STRIPE_PRICE_ID_COMPLETE;
  }
  return process.env.STRIPE_PRICE_ID_BASIC;
}

export function packageIncludesDocx(packageKey?: string | null): boolean {
  return getThematicPackageConfig(packageKey)?.includesDocx === true;
}

export function getEffectivePriceBand(
  tier: PricingTier,
  packageKey?: string | null,
): '99' | '199' | '299' | '599' {
  const packageConfig = getThematicPackageConfig(packageKey);
  if (packageConfig) return String(packageConfig.priceCzk) as '299' | '599';
  return tier === 'complete' ? '199' : '99';
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
