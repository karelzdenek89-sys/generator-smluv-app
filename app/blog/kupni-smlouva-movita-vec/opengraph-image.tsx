import { OG_CONTENT_TYPE, OG_SIZE, renderArticleOgImageBySlug } from '@/lib/og-image-template';

export const runtime = 'edge';
export const alt = 'SmlouvaHned · Blog';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OgImage() {
  return renderArticleOgImageBySlug('kupni-smlouva-movita-vec');
}
