import type { ExpatContractType } from '@/lib/locale';
import { EXPAT_CONTRACT_ROUTES } from '@/lib/locale';
import { getExpatSeoSlug } from '@/lib/i18n/expat-seo-landings';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

/** hreflang + canonical for Czech builder pages with EN/UA SEO landing alternates. */
export function getExpatContractHreflangAlternates(contractKey: ExpatContractType) {
  const czechPath = EXPAT_CONTRACT_ROUTES[contractKey];
  const slug = getExpatSeoSlug(contractKey);
  return {
    canonical: `${BASE_URL}${czechPath}`,
    languages: {
      cs: `${BASE_URL}${czechPath}`,
      en: `${BASE_URL}/en/${slug}`,
      uk: `${BASE_URL}/ua/${slug}`,
      'x-default': `${BASE_URL}${czechPath}`,
    },
  };
}
