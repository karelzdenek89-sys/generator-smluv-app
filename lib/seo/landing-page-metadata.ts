import type { Metadata } from 'next';
import { canonicalUrl, DEFAULT_OG_IMAGE, OG_IMAGE_PATH } from '@/lib/seo/site';

export type LandingPageMetadataOptions = {
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  openGraphTitle?: string;
  openGraphDescription?: string;
};

export function landingPageMetadata(options: LandingPageMetadataOptions): Metadata {
  const url = canonicalUrl(options.path);
  const ogTitle = options.openGraphTitle ?? options.title;
  const ogDescription = options.openGraphDescription ?? options.description;

  return {
    title: options.title,
    description: options.description,
    ...(options.keywords?.length ? { keywords: options.keywords } : {}),
    alternates: { canonical: url },
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
