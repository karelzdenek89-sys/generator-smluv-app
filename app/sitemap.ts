import type { MetadataRoute } from 'next';
import { FOREIGN_LOCALES, LOCALE_META } from '@/lib/i18n/locales';
import { expatBlogSitemapEntries } from '@/lib/i18n/expat-blog-sitemap';
import { getExpatBlogCanonical } from '@/lib/i18n/expat-blog-articles';
import {
  EXPAT_SEO_LOCALES,
  EXPAT_SEO_SLUGS,
  getExpatContractKeyBySeoSlug,
} from '@/lib/i18n/expat-seo-landings';
import {
  EXPAT_BUILDER_SITEMAP,
  getExpatBuilderSitemapAlternates,
  getExpatSeoPageHreflangAlternates,
} from '@/lib/i18n/expat-hreflang';
import { czechBlogSitemapEntries } from '@/lib/seo/sitemap-blog';
import { OG_IMAGE_PATH, SITE_URL } from '@/lib/seo/site';

const BASE_URL = SITE_URL;
const DEFAULT_SITEMAP_IMAGE = `${BASE_URL}${OG_IMAGE_PATH}`;

const localeAlternates: Record<string, string> = {
  cs: `${BASE_URL}/`,
  'x-default': `${BASE_URL}/`,
};
for (const l of FOREIGN_LOCALES) {
  localeAlternates[LOCALE_META[l].htmlLang] = `${BASE_URL}/${LOCALE_META[l].segment}`;
}

function staticPage(
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency'] = 'monthly',
): MetadataRoute.Sitemap[0] {
  return {
    url: `${BASE_URL}${path}`,
    changeFrequency,
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const foreignEntries: MetadataRoute.Sitemap = FOREIGN_LOCALES.map((l) => ({
    url: `${BASE_URL}/${LOCALE_META[l].segment}`,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
    alternates: { languages: localeAlternates },
  }));

  const entries: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: { languages: localeAlternates },
    },
    ...foreignEntries,
    staticPage('/darovaci', 0.9),
    staticPage('/smlouva-o-dilo', 0.9),
    staticPage('/pujcka', 0.85),
    staticPage('/nda', 0.85),
    staticPage('/kupni', 0.9),
    staticPage('/sluzby', 0.88),
    staticPage('/uznani-dluhu', 0.85),
    staticPage('/spoluprace', 0.85),
    staticPage('/blog', 0.8, 'weekly'),
    ...czechBlogSitemapEntries(),
    staticPage('/smlouva-o-dilo-online', 0.95),
    staticPage('/kupni-smlouva', 0.95),
    staticPage('/darovaci-smlouva', 0.93),
    staticPage('/nda-smlouva', 0.93),
    staticPage('/pujcka-smlouva', 0.93),
    staticPage('/podnajemni-smlouva', 0.93),
    staticPage('/plna-moc-online', 0.93),
    staticPage('/uznani-dluhu-vzor', 0.93),
    staticPage('/smlouva-o-sluzbach', 0.93),
    staticPage('/najemni-smlouva-byt', 0.85),
    staticPage('/pro-pronajimatele', 0.9),
    staticPage('/prodej-vozidla', 0.9),
    staticPage('/balicek-pronajimatel', 0.88),
    staticPage('/balicek-prodej-vozidla', 0.88),
    staticPage('/o-projektu', 0.6, 'yearly'),
    staticPage('/faq', 0.7),
    staticPage('/slovnik', 0.6),
    staticPage('/kontakt', 0.5, 'yearly'),
    staticPage('/obchodni-podminky', 0.3, 'yearly'),
    staticPage('/gdpr', 0.3, 'yearly'),
    ...EXPAT_BUILDER_SITEMAP.map(({ path, contractKey }) => {
      const languages = getExpatBuilderSitemapAlternates(contractKey);
      return {
        url: `${BASE_URL}${path}`,
        changeFrequency: 'monthly' as const,
        priority: 0.9,
        ...(languages ? { alternates: { languages } } : {}),
      };
    }),
    ...EXPAT_SEO_LOCALES.flatMap((locale) =>
      EXPAT_SEO_SLUGS.map((slug) => {
        const contractKey = getExpatContractKeyBySeoSlug(slug);
        const languages = contractKey ? getExpatSeoPageHreflangAlternates(contractKey) : undefined;
        return {
          url: `${BASE_URL}/${locale}/${slug}`,
          changeFrequency: 'weekly' as const,
          priority: locale === 'en' ? 0.9 : 0.88,
          ...(languages ? { alternates: { languages } } : {}),
        };
      }),
    ),
    ...expatBlogSitemapEntries().map(({ slug, alternates, lastModified }) => ({
      url: getExpatBlogCanonical(slug),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: slug.includes('foreigners-czech-contracts-guide')
        ? 0.82
        : slug.includes('why-smlouvahned-not-template')
          ? 0.85
          : 0.78,
      ...(alternates ? { alternates: { languages: alternates } } : {}),
    })),
  ];

  return entries.map((entry) => ({
    ...entry,
    images: entry.images ?? [DEFAULT_SITEMAP_IMAGE],
  }));
}
