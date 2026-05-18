import type { AppLocale } from '@/lib/locale';
import {
  type ExpatSeoContent,
  getExpatSeoLanding,
  EXPAT_SEO_LOCALES,
} from '@/lib/i18n/expat-seo-landings';

export type RentalSeoContent = ExpatSeoContent;

export { EXPAT_SEO_LOCALES as RENTAL_SEO_LOCALES };

export function getRentalSeoContent(locale: AppLocale): RentalSeoContent | null {
  return getExpatSeoLanding('lease', locale);
}
