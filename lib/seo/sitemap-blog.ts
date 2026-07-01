import type { MetadataRoute } from 'next';
import { CZECH_BLOG_ARTICLES } from '@/lib/blog-articles';
import { getBlogHreflangAlternates } from '@/lib/seo/blog-hreflang-clusters';
import { czechDateToDate } from '@/lib/seo/czech-date';
import { SITE_URL } from '@/lib/seo/site';

const PILLAR_SLUGS = new Set([
  'predavaci-protokol-vzor-2026',
  'smlouva-o-dilo-freelancer-2026',
  'smlouva-o-dilo-vs-dpp-2026',
  'kupni-smlouva-auto-kupujici-2026',
  'minimalni-mzda-dpp-pracovni-smlouva-2026',
  'prepis-auta-online-portal-dopravy-2026',
  'elektronicky-podpis-elegalizace-2026',
  'najemni-smlouva-vzor-2026',
  'valorizace-najemneho-2026',
  'kupni-smlouva-na-auto-2026',
  'smlouva-o-dilo-2026',
  'darovaci-smlouva-2026',
  'pracovni-smlouva-2026',
  'kupni-smlouva-movita-vec',
  'smlouva-o-zapujcce-2026',
  'nda-smlouva-mlcenlivost',
  'dpp-dohoda-provedeni-prace',
  'dpp-vzor-zdarma-2026',
  'podnajemni-smlouva-2026',
  'smlouva-o-spolupraci-2026',
  'plna-moc-2026',
  'smlouva-o-sluzbach-2026',
  'uznani-dluhu-2026',
  'plna-moc-zastupovani-cizincu-2026',
  'prodej-auta-prepis-cizinec-2026',
  'podnajem-vs-najem-cizinci-2026',
  'flexinovela-zakoniku-prace-2026',
  'energeticky-stitek-najemne-2026',
  'svarcsystem-osvc-2026',
  'viceprace-smlouva-o-dilo-2026',
  'autorska-prava-smlouva-o-dilo-2026',
  'kratkodoby-pronajem-airbnb-2026',
  'proc-smlouvahned-misto-vzoru-2026',
]);

export function czechBlogSitemapEntries(): MetadataRoute.Sitemap {
  return CZECH_BLOG_ARTICLES.map((article) => {
    const languages = getBlogHreflangAlternates(article.slug);
    return {
      url: `${SITE_URL}${article.href}`,
      lastModified: czechDateToDate(article.date),
      changeFrequency: 'monthly' as const,
      priority: PILLAR_SLUGS.has(article.slug) ? 0.92 : 0.88,
      ...(languages ? { alternates: { languages } } : {}),
    };
  });
}
