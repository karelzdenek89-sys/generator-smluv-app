import { OG_CONTENT_TYPE, OG_SIZE, renderBlogOgImage } from '@/lib/og-image-template';

export const runtime = 'edge';
export const alt = 'SmlouvaHned · Blog — Právní průvodce 2026';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OgImage() {
  return renderBlogOgImage({
    title: 'Praktické články k běžným smluvním situacím',
    kicker: 'SmlouvaHned · Blog',
  });
}
