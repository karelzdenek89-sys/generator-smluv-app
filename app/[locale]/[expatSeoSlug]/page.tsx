import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import ExpatContractSeoPage from '@/app/components/seo/ExpatContractSeoPage';
import { getPublicLocalePath, normalizeLocale } from '@/lib/locale';
import { getExpatSeoPageAlternates } from '@/lib/i18n/expat-hreflang';
import {
  EXPAT_SEO_LOCALES,
  EXPAT_SEO_SLUGS,
  getExpatSeoLandingBySlug,
} from '@/lib/i18n/expat-seo-landings';

type PageProps = {
  params: Promise<{ locale: string; expatSeoSlug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, expatSeoSlug } = await params;
  const locale = normalizeLocale(rawLocale);
  const content = getExpatSeoLandingBySlug(expatSeoSlug, locale);
  if (!content) return { title: 'SmlouvaHned' };

  const localeSegment = locale === 'ua' ? 'ua' : 'en';
  const alternates = getExpatSeoPageAlternates(localeSegment, content.contractKey);
  const pageUrl = alternates.canonical;
  const ogImage = {
    url: `${pageUrl}/opengraph-image`,
    width: 1200,
    height: 630,
    alt: content.metadata.openGraphTitle,
  };

  return {
    title: { absolute: content.metadata.title },
    description: content.metadata.description,
    keywords: content.metadata.keywords,
    alternates,
    openGraph: {
      title: content.metadata.openGraphTitle,
      description: content.metadata.openGraphDescription,
      url: pageUrl,
      locale: content.metadata.openGraphLocale,
      type: 'website',
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.metadata.openGraphTitle,
      description: content.metadata.openGraphDescription,
      images: [ogImage.url],
    },
  };
}

export function generateStaticParams() {
  return EXPAT_SEO_LOCALES.flatMap((locale) =>
    EXPAT_SEO_SLUGS.map((expatSeoSlug) => ({ locale, expatSeoSlug })),
  );
}

export default async function ExpatSeoSlugPage({ params }: PageProps) {
  const { locale: rawLocale, expatSeoSlug } = await params;
  if (rawLocale === 'uk') redirect(`/ua/${expatSeoSlug}`);
  const locale = normalizeLocale(rawLocale);
  const publicLocale = getPublicLocalePath(locale);
  if (locale === 'cs' || rawLocale !== publicLocale) notFound();
  const content = getExpatSeoLandingBySlug(expatSeoSlug, locale);
  if (!content) notFound();
  return <ExpatContractSeoPage locale={locale} content={content} />;
}
