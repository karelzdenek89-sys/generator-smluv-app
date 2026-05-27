import type { Metadata } from 'next';
import { getBlogArticleBySlug } from '@/lib/blog-articles';
import { canonicalUrl, DEFAULT_OG_IMAGE, OG_IMAGE_PATH } from '@/lib/seo/site';

export type BlogPageMetadataOptions = {
  title?: string;
  description?: string;
  keywords?: string[];
};

/** SEO metadata for Czech blog articles — canonical and OG URLs use SITE_URL. */
export function blogArticlePageMetadata(
  slug: string,
  options: BlogPageMetadataOptions = {},
): Metadata {
  const article = getBlogArticleBySlug(slug);
  const href = article?.href ?? `/blog/${slug}`;
  const url = canonicalUrl(href);
  const title = options.title ?? article?.title ?? 'SmlouvaHned — Blog';
  const description =
    options.description ??
    article?.excerpt ??
    'Praktický průvodce ke smluvním dokumentům a běžným právním situacím v ČR.';

  return {
    title,
    description,
    ...(options.keywords?.length ? { keywords: options.keywords } : {}),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: 'SmlouvaHned',
      locale: 'cs_CZ',
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE_PATH],
    },
  };
}

export function blogIndexMetadata(): Metadata {
  const url = canonicalUrl('/blog');
  return {
    title: 'Blog | Právní průvodce 2026',
    description:
      'Praktické průvodce ke smlouvám a běžným právním situacím. Obecně informační obsah aktuální pro legislativu 2026.',
    alternates: { canonical: url },
    openGraph: {
      title: 'Blog — Právní průvodce 2026',
      description: 'Praktické průvodce ke smlouvám a běžným právním situacím dle legislativy 2026.',
      url,
      type: 'website',
      siteName: 'SmlouvaHned',
      locale: 'cs_CZ',
    },
  };
}
