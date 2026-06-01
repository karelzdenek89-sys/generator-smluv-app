/**
 * Permanent redirects for legacy expat blog URLs (GSC / external links).
 * Add entries when an old slug is retired — do not guess URLs that never existed.
 */
export const LEGACY_EXPAT_BLOG_REDIRECTS: {
  source: string;
  destination: string;
  permanent: true;
}[] = [
  {
    source: '/blog/expat/power-of-attorney-foreigners-2024-guide-us',
    destination: '/blog/expat/power-of-attorney-foreigners-2026-guide-en',
    permanent: true,
  },
  {
    source: '/blog/power-of-attorney-foreigners-2024-guide-us',
    destination: '/blog/expat/power-of-attorney-foreigners-2026-guide-en',
    permanent: true,
  },
  {
    source: '/blog/expat/power-of-attorney-foreigners-2024-guide-en',
    destination: '/blog/expat/power-of-attorney-foreigners-2026-guide-en',
    permanent: true,
  },
  {
    source: '/blog/expat/power-of-attorney-foreigners-2024-guide-ua',
    destination: '/blog/expat/power-of-attorney-foreigners-2026-guide-ua',
    permanent: true,
  },
];
