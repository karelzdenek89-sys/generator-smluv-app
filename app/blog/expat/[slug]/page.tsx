import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ExpatBlogArticleView from '@/app/components/blog/ExpatBlogArticleView';
import BlogArticleSchemas from '@/app/components/seo/BlogArticleSchemas';
import {
  getAllExpatBlogSlugs,
  getExpatBlogAlternateSlug,
  getExpatBlogArticle,
  getExpatBlogCanonical,
} from '@/lib/i18n/expat-blog-articles';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllExpatBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getExpatBlogArticle(slug);
  if (!article) return { title: 'SmlouvaHned' };

  const canonical = getExpatBlogCanonical(slug);
  const lang = article.audience === 'en' ? 'en' : 'uk';
  const alternateSlug = getExpatBlogAlternateSlug(slug);
  const languageAlternates: Record<string, string> = {
    [lang]: canonical,
  };
  if (alternateSlug) {
    languageAlternates[article.audience === 'en' ? 'uk' : 'en'] = getExpatBlogCanonical(alternateSlug);
  }

  return {
    title: `${article.title} | SmlouvaHned.cz`,
    description: article.excerpt,
    keywords: article.keywords,
    alternates: { canonical, languages: languageAlternates },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: canonical,
      type: 'article',
      locale: article.audience === 'en' ? 'en_US' : 'uk_UA',
    },
    other: {
      'content-language': lang,
    },
  };
}

export default async function ExpatBlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getExpatBlogArticle(slug);
  if (!article) notFound();

  return (
    <>
      <BlogArticleSchemas
        slug={`expat/${slug}`}
        datePublished={article.dateTime}
        withVisibleHeader={false}
      />
      <ExpatBlogArticleView article={article} />
    </>
  );
}
