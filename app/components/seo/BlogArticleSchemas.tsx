import { articleSchema, breadcrumbSchema, jsonLdScript } from '@/lib/schemas';
import { getBlogArticleBySlug } from '@/lib/blog-articles';
import { CONTENT_AUTHOR } from '@/lib/author';
import InformativeDisclaimer from '@/app/components/blog/InformativeDisclaimer';
import { czechDateToIso } from '@/lib/seo/czech-date';

type Props = {
  slug: string;
  /** ISO 639-1 / BCP 47 language tag for Article schema (e.g. cs, en, uk). */
  inLanguage?: string;
  /** Volitelný datePublished v ISO formátu „YYYY-MM-DD" — pokud není v BLOG_ARTICLES */
  datePublished?: string;
  /** Volitelný dateModified v ISO formátu „YYYY-MM-DD" */
  dateModified?: string;
  /**
   * Volitelně skryje viditelný author byline + disclaimer.
   * Defaultně true — pro 15 starších blog článků, které nepoužívají ArticlePageLayout.
   * Nastavit na false v případě, že komponenta běží uvnitř ArticlePageLayout,
   * který už disclaimer vykresluje.
   */
  withVisibleHeader?: boolean;
};

export default function BlogArticleSchemas({
  slug,
  inLanguage = 'cs',
  datePublished,
  dateModified,
  withVisibleHeader = true,
}: Props) {
  const article = getBlogArticleBySlug(slug);
  if (!article) return null;

  const published = datePublished ?? czechDateToIso(article.date);
  const modified = dateModified ?? published;

  const schema = articleSchema({
    title: article.title,
    description: article.excerpt,
    url: article.href,
    datePublished: published,
    dateModified: modified,
    authorName: CONTENT_AUTHOR.name,
    authorJobTitle: CONTENT_AUTHOR.jobTitle,
    authorUrl: CONTENT_AUTHOR.url,
    inLanguage,
  });

  const breadcrumb = breadcrumbSchema([
    { label: 'SmlouvaHned', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: article.title, href: article.href },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }}
      />
      {withVisibleHeader ? (
        <div className="mb-8 space-y-4">
          <div
            className="flex items-center gap-3 text-xs text-slate-500"
            itemScope
            itemType="https://schema.org/Person"
          >
            <span
              aria-hidden="true"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 text-[11px] font-bold text-amber-400"
            >
              KZ
            </span>
            <div>
              <span className="text-slate-400">Autor: </span>
              <span itemProp="name" className="font-semibold text-slate-300">
                {CONTENT_AUTHOR.name}
              </span>
              <span className="mx-2 text-slate-700">·</span>
              <span itemProp="jobTitle" className="text-slate-500">
                {CONTENT_AUTHOR.jobTitle}
              </span>
            </div>
          </div>
          <InformativeDisclaimer />
        </div>
      ) : null}
    </>
  );
}
