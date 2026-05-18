import { OG_CONTENT_TYPE, OG_SIZE, renderExpatBlogOgImageBySlug } from '@/lib/og-image-template';

export const runtime = 'edge';
export const alt = 'SmlouvaHned · Expat guide';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function OgImage({ params }: Props) {
  const { slug } = await params;
  return renderExpatBlogOgImageBySlug(slug);
}
