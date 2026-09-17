import { ANSWER_FIRST_ARTICLES, articleHref } from '@/lib/portal/articles';
import { LEGAL_AUDIENCE_HUBS } from '@/lib/legal/radar';
import { PORTAL_TOOLS } from '@/lib/portal/tools';

/**
 * Growth Engine — měření „URL → indexace → imprese → kliky → nástroj →
 * dokument → nákup“ pro každou stránku růstových clusterů.
 *
 * Search Console nemá API napojení (záměrně; viz lib/gsc-monetization-candidates.ts).
 * Stav indexace a výkon ve vyhledávání se sem přenáší ručně z exportu GSC
 * (Pages → Export) jako snapshot s datem. Zbytek trychtýře (nástroj, dokument,
 * nákup) přichází z first-party událostí s `traffic_source = portal_page`
 * (lib/analytics-reporting.ts, tabulka „Landing page → výnos“).
 *
 * Postup aktualizace: docs/GROWTH_MEASUREMENT.md.
 */

export type GrowthCluster = 'zakazka' | 'zamestnavam' | 'auto' | 'pronajimam' | 'zmeny-2027';

export type GrowthUrl = {
  path: string;
  cluster: GrowthCluster;
  kind: 'hub' | 'article' | 'tool' | 'radar';
  /** Datum zveřejnění (první den v sitemapě). */
  publishedAt: string;
};

export type GscIndexationStatus = 'unknown' | 'discovered' | 'crawled_not_indexed' | 'indexed' | 'excluded';

export type GrowthGscSnapshot = {
  path: string;
  /** Datum exportu z GSC. */
  observedAt: string;
  /** Délka období exportu (dny). */
  observedDays: number;
  indexation: GscIndexationStatus;
  impressions: number;
  clicks: number;
  averagePosition: number | null;
  /** Nejčastější dotazy sdružené do clusterů (ručně z GSC Queries). */
  queryClusters: readonly { label: string; impressions: number; clicks: number }[];
};

const CLUSTER_BY_SITUATION: Record<string, GrowthCluster> = {
  zakazka: 'zakazka',
  zamestnavam: 'zamestnavam',
  auto: 'auto',
  pronajimam: 'pronajimam',
  'zmeny-2027': 'zmeny-2027',
};

/** Všechny měřené URL růstových clusterů — odvozené z obsahu, ne opisované ručně. */
export function listGrowthUrls(): GrowthUrl[] {
  const urls: GrowthUrl[] = [
    { path: '/zakazka', cluster: 'zakazka', kind: 'hub', publishedAt: '2026-09-17' },
    { path: '/zamestnavam', cluster: 'zamestnavam', kind: 'hub', publishedAt: '2026-09-17' },
    { path: '/zmeny-2027', cluster: 'zmeny-2027', kind: 'radar', publishedAt: '2026-09-17' },
    ...Object.values(LEGAL_AUDIENCE_HUBS).map((hub) => ({
      path: `/zmeny-2027/${hub.slug}`,
      cluster: 'zmeny-2027' as const,
      kind: 'radar' as const,
      publishedAt: '2026-09-17',
    })),
  ];
  for (const article of ANSWER_FIRST_ARTICLES) {
    const cluster = CLUSTER_BY_SITUATION[article.situation];
    if (!cluster) continue;
    urls.push({ path: articleHref(article), cluster, kind: 'article', publishedAt: article.updatedAt });
  }
  for (const tool of PORTAL_TOOLS) {
    const cluster = CLUSTER_BY_SITUATION[tool.situation];
    if (!cluster) continue;
    urls.push({ path: `/nastroje/${tool.slug}`, cluster, kind: 'tool', publishedAt: '2026-09-17' });
  }
  return urls;
}

/**
 * Ruční snapshot z GSC. Prázdný = stránka je nová a ještě nebyla exportována.
 * Nikdy sem nezapisujte odhady: pole bez exportu zůstává `unknown`.
 */
export const GROWTH_GSC_SNAPSHOTS: readonly GrowthGscSnapshot[] = [];

export type GrowthFunnelInput = {
  landingPage: string;
  trafficSource: string;
  landingViews: number;
  productCtaClicks: number;
  toolStarts: number;
  builderStarts: number;
  purchases: number;
  purchaseRevenueCzk: number;
};

export type GrowthUrlReport = GrowthUrl & {
  snapshot: GrowthGscSnapshot | null;
  landingViews: number;
  ctaClicks: number;
  toolStarts: number;
  documentStarts: number;
  purchases: number;
  revenueCzk: number;
};

/** Spojí registr URL, GSC snapshot a first-party trychtýř (jen `portal_page`). */
export function buildGrowthReport(funnel: readonly GrowthFunnelInput[]): GrowthUrlReport[] {
  const snapshotByPath = new Map(GROWTH_GSC_SNAPSHOTS.map((snapshot) => [snapshot.path, snapshot]));
  const funnelByPath = new Map<string, GrowthFunnelInput>();
  for (const row of funnel) {
    if (row.trafficSource !== 'portal_page') continue;
    funnelByPath.set(row.landingPage, row);
  }
  return listGrowthUrls().map((url) => {
    const row = funnelByPath.get(url.path);
    return {
      ...url,
      snapshot: snapshotByPath.get(url.path) ?? null,
      landingViews: row?.landingViews ?? 0,
      ctaClicks: row?.productCtaClicks ?? 0,
      toolStarts: row?.toolStarts ?? 0,
      documentStarts: row?.builderStarts ?? 0,
      purchases: row?.purchases ?? 0,
      revenueCzk: row?.purchaseRevenueCzk ?? 0,
    };
  });
}

export function summarizeGrowthReport(report: readonly GrowthUrlReport[]) {
  const byCluster = new Map<GrowthCluster, { urls: number; indexed: number; withSnapshot: number; impressions: number; clicks: number; landingViews: number; toolStarts: number; documentStarts: number; purchases: number; revenueCzk: number }>();
  for (const row of report) {
    const entry = byCluster.get(row.cluster) ?? { urls: 0, indexed: 0, withSnapshot: 0, impressions: 0, clicks: 0, landingViews: 0, toolStarts: 0, documentStarts: 0, purchases: 0, revenueCzk: 0 };
    entry.urls += 1;
    if (row.snapshot) {
      entry.withSnapshot += 1;
      if (row.snapshot.indexation === 'indexed') entry.indexed += 1;
      entry.impressions += row.snapshot.impressions;
      entry.clicks += row.snapshot.clicks;
    }
    entry.landingViews += row.landingViews;
    entry.toolStarts += row.toolStarts;
    entry.documentStarts += row.documentStarts;
    entry.purchases += row.purchases;
    entry.revenueCzk += row.revenueCzk;
    byCluster.set(row.cluster, entry);
  }
  return [...byCluster.entries()].map(([cluster, stats]) => ({ cluster, ...stats }));
}
