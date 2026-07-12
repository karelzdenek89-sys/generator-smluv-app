import {
  getAllExpatBlogSlugs,
  getExpatBlogAlternateSlug,
  getExpatBlogArticle,
  getExpatBlogCanonical,
} from '@/lib/i18n/expat-blog-articles';
import { getBlogHreflangAlternates } from '@/lib/seo/blog-hreflang-clusters';

/** hreflang cluster for paired EN/UA expat blog guides. */
export function getExpatBlogHreflangAlternates(slug: string): Record<string, string> | undefined {
  const cluster = getBlogHreflangAlternates(slug);
  if (cluster) return cluster;

  const article = getExpatBlogArticle(slug);
  if (!article) return undefined;

  const canonical = getExpatBlogCanonical(slug);
  const primaryLang = article.audience === 'en' ? 'en' : 'uk';
  const languages: Record<string, string> = { [primaryLang]: canonical };

  const alternateSlug = getExpatBlogAlternateSlug(slug);
  if (alternateSlug) {
    const secondaryLang = article.audience === 'en' ? 'uk' : 'en';
    languages[secondaryLang] = getExpatBlogCanonical(alternateSlug);
  }

  languages['x-default'] = canonical;

  return languages;
}

export function expatBlogSitemapEntries(): Array<{
  slug: string;
  alternates?: Record<string, string>;
  lastModified: string;
}> {
  return getAllExpatBlogSlugs().flatMap((slug) => {
    const article = getExpatBlogArticle(slug);
    if (!article) return [];
    return [{
      slug,
      alternates: getExpatBlogHreflangAlternates(slug),
      lastModified: article.dateTime,
    }];
  });
}
