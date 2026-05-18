import {
  getAllExpatBlogSlugs,
  getExpatBlogAlternateSlug,
  getExpatBlogArticle,
  getExpatBlogCanonical,
} from '@/lib/i18n/expat-blog-articles';
import { SITE_URL } from '@/lib/seo/site';

/** hreflang cluster for paired EN/UA expat blog guides. */
export function getExpatBlogHreflangAlternates(slug: string): Record<string, string> | undefined {
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

  languages['x-default'] =
    article.audience === 'en'
      ? `${SITE_URL}/en`
      : `${SITE_URL}/ua`;

  return languages;
}

export function expatBlogSitemapEntries(): Array<{
  slug: string;
  alternates?: Record<string, string>;
}> {
  return getAllExpatBlogSlugs().map((slug) => ({
    slug,
    alternates: getExpatBlogHreflangAlternates(slug),
  }));
}
