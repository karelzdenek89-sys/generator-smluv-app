/**
 * Retired guide landings that competed with both the transactional builder and
 * the deeper blog guide for the same query cluster.
 *
 * Keep this list centralized so redirects, sitemap tests, and future SEO audits
 * agree on the canonical destination.
 *
 * `/smlouva-o-spolupraci` sem patřilo od 2026-08-04 a 2026-09-11 bylo vráceno.
 * Ta dvojice nesoutěžila: landing měla za 169 dní 270 impresí a 16 prokliků na
 * pozici 22,1, kdežto builder `/spoluprace` 4 imprese a nula prokliků. Po
 * přesměrování spadl celý shluk z ~2,0 impresí denně na 0,13. Ostatní typy
 * smluv drží obě role zvlášť (`/kupni` + `/kupni-smlouva`, `/nda` +
 * `/nda-smlouva`); spolupráce byla jediná výjimka a výjimka to být neměla.
 */
export const CONTENT_CONSOLIDATION_REDIRECTS = [
  { source: '/najemni-smlouva', destination: '/najem', permanent: true },
  { source: '/pracovni-smlouva', destination: '/pracovni', permanent: true },
  { source: '/dohoda-o-provedeni-prace', destination: '/dpp', permanent: true },
] as const;

export const RETIRED_CONTENT_PATHS = CONTENT_CONSOLIDATION_REDIRECTS.map(
  ({ source }) => source,
);
