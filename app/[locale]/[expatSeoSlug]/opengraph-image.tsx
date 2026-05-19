import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderExpatSeoOgImageBySlug,
} from '@/lib/og-image-template';
import { getPublicLocalePath, normalizeLocale } from '@/lib/locale';
import {
  EXPAT_SEO_LOCALES,
  EXPAT_SEO_SLUGS,
  getExpatSeoLandingBySlug,
} from '@/lib/i18n/expat-seo-landings';

export const alt = 'SmlouvaHned expat contract guide';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return EXPAT_SEO_LOCALES.flatMap((locale) =>
    EXPAT_SEO_SLUGS.map((expatSeoSlug) => ({ locale, expatSeoSlug })),
  );
}

type Props = {
  params: Promise<{ locale: string; expatSeoSlug: string }>;
};

export default async function OgImage({ params }: Props) {
  const { locale: rawLocale, expatSeoSlug } = await params;
  const locale = normalizeLocale(rawLocale);
  const publicLocale = getPublicLocalePath(locale);
  if (
    locale === 'cs' ||
    rawLocale !== publicLocale ||
    !getExpatSeoLandingBySlug(expatSeoSlug, locale)
  ) {
    return new Response(null, { status: 404 });
  }

  return renderExpatSeoOgImageBySlug(expatSeoSlug, locale);
}
