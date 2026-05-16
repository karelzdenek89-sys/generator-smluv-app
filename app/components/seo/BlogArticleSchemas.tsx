import { articleSchema, breadcrumbSchema, jsonLdScript } from '@/lib/schemas';
import { getBlogArticleBySlug } from '@/lib/blog-articles';

type Props = {
  slug: string;
  /** Volitelný datePublished v ISO formátu „YYYY-MM-DD" — pokud není v BLOG_ARTICLES */
  datePublished?: string;
  /** Volitelný dateModified v ISO formátu „YYYY-MM-DD" */
  dateModified?: string;
};

/**
 * Mapuje českou textovou formu data („15. března 2026") na ISO „2026-03-15".
 */
const MONTHS_CZ: Record<string, string> = {
  ledna: '01',
  února: '02',
  března: '03',
  dubna: '04',
  května: '05',
  června: '06',
  července: '07',
  srpna: '08',
  září: '09',
  října: '10',
  listopadu: '11',
  prosince: '12',
};

function czechDateToIso(date: string): string {
  const m = date.match(/^(\d{1,2})\.\s*([^\s]+)\s+(\d{4})/);
  if (!m) return date;
  const day = m[1].padStart(2, '0');
  const month = MONTHS_CZ[m[2].toLowerCase()];
  if (!month) return date;
  return `${m[3]}-${month}-${day}`;
}

export default function BlogArticleSchemas({ slug, datePublished, dateModified }: Props) {
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
    </>
  );
}
