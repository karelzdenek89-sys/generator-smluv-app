import type { ExpatContractType } from '@/lib/locale';
import { EXPAT_CONTRACT_ROUTES } from '@/lib/locale';
import { SITE_URL } from '@/lib/seo/site';
import { getExpatSeoSlug } from '@/lib/i18n/expat-seo-landings';

/**
 * Canonical Czech equivalents for hreflang `cs`.
 * Consolidated clusters point directly to the builder; the remaining clusters
 * keep a distinct Czech SEO landing where its intent is still unique.
 */
export const CZECH_SEO_LANDING_BY_CONTRACT: Record<ExpatContractType, string> = {
  lease: '/najem',
  employment: '/pracovni',
  dpp: '/dpp',
  sublease: '/podnajemni-smlouva',
  power_of_attorney: '/plna-moc-online',
  car_sale: '/prodej-vozidla',
};

/** Czech builder URLs with EN/UA SEO landing alternates (sitemap + metadata). */
export const EXPAT_BUILDER_SITEMAP: { path: string; contractKey: ExpatContractType }[] = [
  { path: EXPAT_CONTRACT_ROUTES.lease, contractKey: 'lease' },
  { path: EXPAT_CONTRACT_ROUTES.employment, contractKey: 'employment' },
  { path: EXPAT_CONTRACT_ROUTES.dpp, contractKey: 'dpp' },
  { path: EXPAT_CONTRACT_ROUTES.sublease, contractKey: 'sublease' },
  { path: EXPAT_CONTRACT_ROUTES.power_of_attorney, contractKey: 'power_of_attorney' },
  { path: EXPAT_CONTRACT_ROUTES.car_sale, contractKey: 'car_sale' },
];

/** Reciprocal hreflang cluster: cs SEO landing + EN/UA SEO landings. */
export function getExpatHreflangLanguages(contractKey: ExpatContractType): Record<string, string> {
  const slug = getExpatSeoSlug(contractKey);
  const csPath = CZECH_SEO_LANDING_BY_CONTRACT[contractKey];
  const cs = `${SITE_URL}${csPath}`;
  return {
    cs,
    en: `${SITE_URL}/en/${slug}`,
    uk: `${SITE_URL}/ua/${slug}`,
    'x-default': cs,
  };
}

function builderIsCzechHreflangEquivalent(contractKey: ExpatContractType): boolean {
  return EXPAT_CONTRACT_ROUTES[contractKey] === CZECH_SEO_LANDING_BY_CONTRACT[contractKey];
}

/**
 * Builder/form pages use a self canonical. Consolidated builders also expose
 * the reciprocal language cluster; builders with a separate Czech SEO landing
 * remain outside that cluster to avoid two Czech equivalents.
 */
export function getExpatBuilderCanonicalAlternates(contractKey: ExpatContractType) {
  const czechPath = EXPAT_CONTRACT_ROUTES[contractKey];
  return {
    canonical: `${SITE_URL}${czechPath}`,
    ...(builderIsCzechHreflangEquivalent(contractKey)
      ? { languages: getExpatHreflangLanguages(contractKey) }
      : {}),
  };
}

/** @deprecated Use getExpatBuilderCanonicalAlternates — kept for existing imports. */
export function getExpatContractHreflangAlternates(contractKey: ExpatContractType) {
  return getExpatBuilderCanonicalAlternates(contractKey);
}

/** Czech SEO landing page metadata alternates. */
export function getExpatSeoLandingHreflangAlternates(contractKey: ExpatContractType) {
  const csPath = CZECH_SEO_LANDING_BY_CONTRACT[contractKey];
  return {
    canonical: `${SITE_URL}${csPath}`,
    languages: getExpatHreflangLanguages(contractKey),
  };
}

/** EN or UA contract SEO landing — self canonical + full hreflang cluster. */
export function getExpatSeoPageAlternates(locale: 'en' | 'ua', contractKey: ExpatContractType) {
  const slug = getExpatSeoSlug(contractKey);
  const canonical = `${SITE_URL}/${locale}/${slug}`;
  return {
    canonical,
    languages: getExpatHreflangLanguages(contractKey),
  };
}

/** Sitemap hreflang languages for /en|ua/{seo-slug} entries. */
export function getExpatSeoPageHreflangAlternates(contractKey: ExpatContractType) {
  return getExpatHreflangLanguages(contractKey);
}

/** Hreflang sitemap data for builders that are the canonical Czech equivalent. */
export function getExpatBuilderSitemapAlternates(contractKey: ExpatContractType) {
  return builderIsCzechHreflangEquivalent(contractKey)
    ? getExpatHreflangLanguages(contractKey)
    : undefined;
}
