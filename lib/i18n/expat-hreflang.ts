import type { ExpatContractType } from '@/lib/locale';
import { EXPAT_CONTRACT_ROUTES } from '@/lib/locale';
import { SITE_URL } from '@/lib/seo/site';
import { getExpatSeoSlug } from '@/lib/i18n/expat-seo-landings';

/** hreflang + canonical for Czech builder pages with EN/UA SEO landing alternates. */
export function getExpatContractHreflangAlternates(contractKey: ExpatContractType) {
  const czechPath = EXPAT_CONTRACT_ROUTES[contractKey];
  const slug = getExpatSeoSlug(contractKey);
  return {
    canonical: `${SITE_URL}${czechPath}`,
    languages: {
      cs: `${SITE_URL}${czechPath}`,
      en: `${SITE_URL}/en/${slug}`,
      uk: `${SITE_URL}/ua/${slug}`,
      'x-default': `${SITE_URL}${czechPath}`,
    },
  };
}

/** Same hreflang cluster as builder pages — use on /en|ua/{seo-slug} and in sitemap. */
export function getExpatSeoPageHreflangAlternates(contractKey: ExpatContractType) {
  return getExpatContractHreflangAlternates(contractKey).languages;
}
