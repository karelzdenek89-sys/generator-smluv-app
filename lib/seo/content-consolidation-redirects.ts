/**
 * Retired guide landings that competed with both the transactional builder and
 * the deeper blog guide for the same query cluster.
 *
 * Keep this list centralized so redirects, sitemap tests, and future SEO audits
 * agree on the canonical destination.
 */
export const CONTENT_CONSOLIDATION_REDIRECTS = [
  { source: '/najemni-smlouva', destination: '/najem', permanent: true },
  { source: '/pracovni-smlouva', destination: '/pracovni', permanent: true },
  { source: '/dohoda-o-provedeni-prace', destination: '/dpp', permanent: true },
  { source: '/smlouva-o-spolupraci', destination: '/spoluprace', permanent: true },
] as const;

export const RETIRED_CONTENT_PATHS = CONTENT_CONSOLIDATION_REDIRECTS.map(
  ({ source }) => source,
);
