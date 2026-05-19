import {
  getAllExpatBlogSlugs,
  getExpatBlogArticle,
} from '@/lib/i18n/expat-blog-articles';
import { OG_CONTENT_TYPE, OG_SIZE, renderExpatBlogOgImageBySlug } from '@/lib/og-image-template';

export const alt = 'SmlouvaHned · Expat guide';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getAllExpatBlogSlugs().map((slug) => ({ slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function OgImage({ params }: Props) {
  const { slug } = await params;
  if (!getExpatBlogArticle(slug)) {
    return new Response(null, { status: 404 });
  }
  return renderExpatBlogOgImageBySlug(slug);
}
