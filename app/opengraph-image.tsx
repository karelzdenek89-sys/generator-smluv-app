import { OG_CONTENT_TYPE, OG_SIZE, renderBrandOgImage } from '@/lib/og-image-template';

export const runtime = 'edge';
export const alt = 'SmlouvaHned — Generování smluv online';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OgImage() {
  return renderBrandOgImage();
}
