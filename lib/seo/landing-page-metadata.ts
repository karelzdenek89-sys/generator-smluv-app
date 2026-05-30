import type { Metadata } from 'next';
import type { ExpatContractType } from '@/lib/locale';
import { getExpatSeoLandingHreflangAlternates } from '@/lib/i18n/expat-hreflang';
import { canonicalUrl, DEFAULT_OG_IMAGE, OG_IMAGE_PATH } from '@/lib/seo/site';

export type LandingPageMetadataOptions = {
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  openGraphTitle?: string;
  openGraphDescription?: string;
  /** Adds cs/en/uk hreflang cluster for expat-related SEO landings. */
  expatContractKey?: ExpatContractType;
};

export function landingPageMetadata(options: LandingPageMetadataOptions): Metadata {
  const url = canonicalUrl(options.path);
  const ogTitle = options.openGraphTitle ?? options.title;
  const ogDescription = options.openGraphDescription ?? options.description;
  const alternates = options.expatContractKey
    ? getExpatSeoLandingHreflangAlternates(options.expatContractKey)
    : { canonical: url };

  return {
    title: options.title,
    description: options.description,
    ...(options.keywords?.length ? { keywords: options.keywords } : {}),
    alternates,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url,
      type: 'website',
      siteName: 'SmlouvaHned',
      locale: 'cs_CZ',
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [OG_IMAGE_PATH],
    },
  };
}
