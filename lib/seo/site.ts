/** Canonical site origin for metadata, sitemap, and JSON-LD. */
export const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.smlouvahned.cz';

/** Static OG asset; rewritten to /opengraph-image in next.config.ts */
export const OG_IMAGE_PATH = '/og-image.png';

export const DEFAULT_OG_IMAGE = {
  url: OG_IMAGE_PATH,
  width: 1200,
  height: 630,
  alt: 'SmlouvaHned — Czech contracts online',
} as const;

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function canonicalUrl(path: string): string {
  return absoluteUrl(path);
}
