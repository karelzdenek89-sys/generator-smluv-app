import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AnswerFirstArticleView from './AnswerFirstArticleView';
import {
  articleHref,
  getAnswerFirstArticle,
  getAnswerFirstArticlesBySection,
  type ArticleSection,
} from '@/lib/portal/articles';
import { DEFAULT_OG_IMAGE, canonicalUrl } from '@/lib/seo/site';

type RouteProps = { params: Promise<{ slug: string }> };

/**
 * Tovární funkce pro answer-first routy `/[section]/[slug]`. Každá sekce
 * má vlastní soubor page.tsx, který jen re-exportuje výsledek — Next.js tak
 * vidí statické parametry a metadata jako u ručně psané stránky.
 */
export function createArticleRoute(section: ArticleSection) {
  async function generateStaticParams() {
    return getAnswerFirstArticlesBySection(section).map((article) => ({ slug: article.slug }));
  }

  async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
    const { slug } = await params;
    const article = getAnswerFirstArticle(section, slug);
    if (!article) return {};
    const href = articleHref(article);
    return {
      title: { absolute: `${article.metaTitle} | SmlouvaHned` },
      description: article.metaDescription,
      alternates: { canonical: canonicalUrl(href) },
      openGraph: {
        type: 'article',
        locale: 'cs_CZ',
        url: canonicalUrl(href),
        siteName: 'SmlouvaHned',
        title: article.metaTitle,
        description: article.metaDescription,
        images: [DEFAULT_OG_IMAGE],
        modifiedTime: `${article.updatedAt}T08:00:00+02:00`,
      },
      twitter: { card: 'summary_large_image', title: article.metaTitle, description: article.metaDescription },
    };
  }

  async function Page({ params }: RouteProps) {
    const { slug } = await params;
    const article = getAnswerFirstArticle(section, slug);
    if (!article) notFound();
    return <AnswerFirstArticleView article={article} />;
  }

  return { generateStaticParams, generateMetadata, Page };
}
