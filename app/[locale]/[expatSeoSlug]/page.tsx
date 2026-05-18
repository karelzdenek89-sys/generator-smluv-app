import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import ExpatContractSeoPage from '@/app/components/seo/ExpatContractSeoPage';
import { getPublicLocalePath, normalizeLocale } from '@/lib/locale';
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
  return {
    title: content.metadata.title,
    description: content.metadata.description,
    keywords: content.metadata.keywords,
    alternates: {
      canonical: content.canonical,
      languages: {
        cs: `https://smlouvahned.cz${content.builderHref.split('?')[0]}`,
        en: `https://smlouvahned.cz/en/${expatSeoSlug}`,
        uk: `https://smlouvahned.cz/ua/${expatSeoSlug}`,
        'x-default': `https://smlouvahned.cz${content.builderHref.split('?')[0]}`,
      },
    },
    openGraph: {
      title: content.metadata.openGraphTitle,
      description: content.metadata.openGraphDescription,
      url: content.canonical,
      locale: content.metadata.openGraphLocale,
      type: 'website',
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
