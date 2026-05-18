import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ExpatBlogArticleView from '@/app/components/blog/ExpatBlogArticleView';
import BlogArticleSchemas from '@/app/components/seo/BlogArticleSchemas';
import {
  getAllExpatBlogSlugs,
  getExpatBlogArticle,
  getExpatBlogCanonical,
} from '@/lib/i18n/expat-blog-articles';
import { getExpatBlogHreflangAlternates } from '@/lib/i18n/expat-blog-sitemap';

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
  const languageAlternates = getExpatBlogHreflangAlternates(slug) ?? { [lang]: canonical };

  return {
    title: { absolute: `${article.title} | SmlouvaHned.cz` },
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
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
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

  const lang = article.audience === 'en' ? 'en' : 'uk';

  return (
    <>
      <BlogArticleSchemas
        slug={`expat/${slug}`}
        datePublished={article.dateTime}
        inLanguage={lang}
        withVisibleHeader={false}
      />
      <ExpatBlogArticleView article={article} />
    </>
  );
}
