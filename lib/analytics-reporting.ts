import { BLOG_ARTICLES } from '@/lib/blog-articles';
import { THEMATIC_PACKAGES } from '@/lib/packages';
import { redis } from '@/lib/redis';
import { SITUATION_LANDINGS } from '@/lib/situations';
import type { AnalyticsEventName, AnalyticsEventParams } from './analytics';

type StoredAnalyticsEvent = {
  event: AnalyticsEventName;
  params?: AnalyticsEventParams;
  received_at: string;
};

type DashboardRow = {
  key: string;
  label: string;
  value: number;
  secondary?: number;
  tertiary?: number;
};

export type AnalyticsDashboardData = {
  windowDays: number;
  analyzedEvents: number;
  generatedAt: string;
  overview: DashboardRow[];
  pricingInterest: Array<{
    band: '99' | '199' | '299';
    topFunnel: number;
    selection: number;
    checkout: number;
  }>;
  articlePerformance: Array<{
    articleSlug: string;
    title: string;
    views: number;
    toBuilder: number;
    toSituation: number;
    toPackage: number;
  }>;
  situationPerformance: Array<{
    situationKey: 'landlord' | 'vehicle_sale';
    title: string;
    views: number;
    toBuilder: number;
    toPackage: number;
  }>;
  packagePerformance: Array<{
    packageKey: 'landlord' | 'vehicle_sale';
    title: string;
    views: number;
    ctaToBuilder: number;
    builderEntries: number;
  }>;
  funnel: DashboardRow[];
  topSourcesToBuilder: DashboardRow[];
  topSourcesToPackage: DashboardRow[];
  topCtas: DashboardRow[];
};

const BUILDER_PATHS = new Set([
  '/najem',
  '/auto',
  '/darovaci',
  '/smlouva-o-dilo',
  '/pujcka',
  '/nda',
  '/kupni',
  '/pracovni',
  '/dpp',
  '/sluzby',
  '/podnajem',
  '/plna-moc',
  '/uznani-dluhu',
  '/spoluprace',
]);

const SITUATION_PATHS = new Map(
  SITUATION_LANDINGS.map((item) => [item.href, item.key] as const),
);
const PACKAGE_PATHS = new Map(
  THEMATIC_PACKAGES.map((item) => [item.href, item.key] as const),
);
const ARTICLE_TITLES = new Map(
  BLOG_ARTICLES.map((item) => [item.slug, item.title] as const),
);
const SITUATION_TITLES = new Map(
  SITUATION_LANDINGS.map((item) => [item.key, item.title] as const),
);
const PACKAGE_TITLES = new Map(
  THEMATIC_PACKAGES.map((item) => [item.key, item.title] as const),
);

function safeParseEvent(raw: unknown): StoredAnalyticsEvent | null {
  if (typeof raw !== 'string') return null;

  try {
    const parsed = JSON.parse(raw) as StoredAnalyticsEvent;
    if (!parsed || typeof parsed !== 'object') return null;
    if (typeof parsed.event !== 'string' || typeof parsed.received_at !== 'string') return null;
    return parsed;
  } catch {
    return null;
  }
}

function normalizeDestination(destination?: string) {
  if (!destination) return '';
  return destination.split('?')[0] ?? destination;
}

function isBuilderDestination(destination?: string) {
  return BUILDER_PATHS.has(normalizeDestination(destination));
}

function isSituationDestination(destination?: string) {
  return SITUATION_PATHS.has(normalizeDestination(destination));
}

function isPackageDestination(destination?: string) {
  return PACKAGE_PATHS.has(normalizeDestination(destination));
}

function withinWindow(receivedAt: string, sinceTime: number) {
  const timestamp = Date.parse(receivedAt);
  return Number.isFinite(timestamp) && timestamp >= sinceTime;
}

function topRows(record: Map<string, number>, fallbackLabel?: (key: string) => string): DashboardRow[] {
  return [...record.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([key, value]) => ({
      key,
      label: fallbackLabel ? fallbackLabel(key) : key,
      value,
    }));
}

function increment(record: Map<string, number>, key?: string | null, amount = 1) {
  if (!key) return;
  record.set(key, (record.get(key) ?? 0) + amount);
}

export async function getAnalyticsDashboardData(windowDays = 7): Promise<AnalyticsDashboardData> {
  const now = new Date();
  const sinceTime = now.getTime() - windowDays * 24 * 60 * 60 * 1000;
  const rawEvents = ((await redis.lrange('analytics:events', 0, 1999)) ?? []) as unknown[];
  const events = rawEvents
    .map(safeParseEvent)
    .filter((item): item is StoredAnalyticsEvent => Boolean(item))
    .filter((item) => withinWindow(item.received_at, sinceTime));

  let articleViews = 0;
  let articleToBuilderClicks = 0;
  let articleToSituationClicks = 0;
  let articleToPackageClicks = 0;
  let situationViews = 0;
  let situationToBuilderClicks = 0;
  let situationToPackageClicks = 0;
  let packageViews = 0;
  let packageCtaClicks = 0;
  let builderViews = 0;
  let packageFlowEntries = 0;
  let tier99Selections = 0;
  let tier199Selections = 0;
  let homepage99Clicks = 0;
  let homepage199Clicks = 0;
  let homepage299Clicks = 0;
  let checkout99 = 0;
  let checkout199 = 0;
  let checkout299 = 0;
  let upgrades = 0;
  let checkoutClicks = 0;

  const articleStats = new Map<
    string,
    { views: number; toBuilder: number; toSituation: number; toPackage: number }
  >();
  const situationStats = new Map<
    'landlord' | 'vehicle_sale',
    { views: number; toBuilder: number; toPackage: number }
  >();
  const packageStats = new Map<
    'landlord' | 'vehicle_sale',
    { views: number; ctaToBuilder: number; builderEntries: number }
  >();
  const sourceToBuilder = new Map<string, number>();
  const sourceToPackage = new Map<string, number>();
  const ctaStats = new Map<string, number>();

  for (const event of events) {
    const params = event.params ?? {};
    const destination = normalizeDestination(params.destination);
    const articleSlug = params.article_slug;
    const situationKey = params.situation_key;
    const packageKey = params.package_key;

    increment(ctaStats, params.cta_type);

    switch (event.event) {
      case 'blog_article_view':
        articleViews += 1;
        if (articleSlug) {
          const current = articleStats.get(articleSlug) ?? {
            views: 0,
            toBuilder: 0,
            toSituation: 0,
            toPackage: 0,
          };
          current.views += 1;
          articleStats.set(articleSlug, current);
        }
        break;

      case 'blog_cta_click':
        if (articleSlug) {
          const current = articleStats.get(articleSlug) ?? {
            views: 0,
            toBuilder: 0,
            toSituation: 0,
            toPackage: 0,
          };

          if (isBuilderDestination(destination)) {
            articleToBuilderClicks += 1;
            current.toBuilder += 1;
            increment(sourceToBuilder, `\u010cl\u00e1nek: ${ARTICLE_TITLES.get(articleSlug) ?? articleSlug}`);
          } else if (isSituationDestination(destination)) {
            articleToSituationClicks += 1;
            current.toSituation += 1;
          } else if (isPackageDestination(destination)) {
            articleToPackageClicks += 1;
            current.toPackage += 1;
            increment(sourceToPackage, `\u010cl\u00e1nek: ${ARTICLE_TITLES.get(articleSlug) ?? articleSlug}`);
          }

          articleStats.set(articleSlug, current);
        }
        break;

      case 'situation_page_view':
        situationViews += 1;
        if (situationKey) {
          const current = situationStats.get(situationKey) ?? {
            views: 0,
            toBuilder: 0,
            toPackage: 0,
          };
          current.views += 1;
          situationStats.set(situationKey, current);
        }
        break;

      case 'situation_cta_click':
        if (situationKey) {
          const current = situationStats.get(situationKey) ?? {
            views: 0,
            toBuilder: 0,
            toPackage: 0,
          };

          if (isBuilderDestination(destination)) {
            situationToBuilderClicks += 1;
            current.toBuilder += 1;
            increment(sourceToBuilder, `Situace: ${SITUATION_TITLES.get(situationKey) ?? situationKey}`);
          } else if (isPackageDestination(destination)) {
            situationToPackageClicks += 1;
            current.toPackage += 1;
            increment(sourceToPackage, `Situace: ${SITUATION_TITLES.get(situationKey) ?? situationKey}`);
          }

          situationStats.set(situationKey, current);
        }
        break;

      case 'package_page_view':
        packageViews += 1;
        if (packageKey) {
          const current = packageStats.get(packageKey) ?? {
            views: 0,
            ctaToBuilder: 0,
            builderEntries: 0,
          };
          current.views += 1;
          packageStats.set(packageKey, current);
        }
        break;

      case 'package_cta_click':
        packageCtaClicks += 1;
        if (packageKey && isBuilderDestination(destination)) {
          const current = packageStats.get(packageKey) ?? {
            views: 0,
            ctaToBuilder: 0,
            builderEntries: 0,
          };
          current.ctaToBuilder += 1;
          packageStats.set(packageKey, current);
          increment(sourceToBuilder, `Bal\u00ed\u010dek: ${PACKAGE_TITLES.get(packageKey) ?? packageKey}`);
        }
        break;

      case 'builder_view':
        builderViews += 1;
        break;

      case 'package_flow_entered':
        packageFlowEntries += 1;
        if (packageKey) {
          const current = packageStats.get(packageKey) ?? {
            views: 0,
            ctaToBuilder: 0,
            builderEntries: 0,
          };
          current.builderEntries += 1;
          packageStats.set(packageKey, current);
        }
        break;

      case 'builder_tier_selected':
        if (params.tier === 'basic') tier99Selections += 1;
        if (params.tier === 'complete') tier199Selections += 1;
        break;

      case 'builder_upgrade_clicked':
        upgrades += 1;
        break;

      case 'builder_checkout_clicked':
        checkoutClicks += 1;
        if (params.price_band === '99') checkout99 += 1;
        if (params.price_band === '199') checkout199 += 1;
        if (params.price_band === '299') checkout299 += 1;
        break;

      case 'homepage_pricing_path_click':
        if (params.price_band === '99') homepage99Clicks += 1;
        if (params.price_band === '199') homepage199Clicks += 1;
        break;

      case 'homepage_package_click':
        homepage299Clicks += 1;
        break;

      default:
        break;
    }
  }

  const articlePerformance = [...articleStats.entries()]
    .map(([articleSlug, stat]) => ({
      articleSlug,
      title: ARTICLE_TITLES.get(articleSlug) ?? articleSlug,
      views: stat.views,
      toBuilder: stat.toBuilder,
      toSituation: stat.toSituation,
      toPackage: stat.toPackage,
    }))
    .sort(
      (a, b) =>
        b.toBuilder + b.toPackage + b.toSituation - (a.toBuilder + a.toPackage + a.toSituation),
    )
    .slice(0, 10);

  const situationPerformance = [...situationStats.entries()]
    .map(([situationKey, stat]) => ({
      situationKey,
      title: SITUATION_TITLES.get(situationKey) ?? situationKey,
      views: stat.views,
      toBuilder: stat.toBuilder,
      toPackage: stat.toPackage,
    }))
    .sort((a, b) => b.toBuilder + b.toPackage - (a.toBuilder + a.toPackage));

  const packagePerformance = [...packageStats.entries()]
    .map(([packageKey, stat]) => ({
      packageKey,
      title: PACKAGE_TITLES.get(packageKey) ?? packageKey,
      views: stat.views,
      ctaToBuilder: stat.ctaToBuilder,
      builderEntries: stat.builderEntries,
    }))
    .sort((a, b) => b.builderEntries - a.builderEntries);

  return {
    windowDays,
    analyzedEvents: events.length,
    generatedAt: now.toISOString(),
    overview: [
      { key: 'article_views', label: 'Zobrazen\u00ed \u010dl\u00e1nk\u016f', value: articleViews },
      { key: 'article_to_builder', label: '\u010cl\u00e1nky \u2192 builder', value: articleToBuilderClicks },
      { key: 'article_to_package', label: '\u010cl\u00e1nky \u2192 bal\u00ed\u010dek', value: articleToPackageClicks },
      { key: 'situation_views', label: 'Zobrazen\u00ed situa\u010dn\u00edch str\u00e1nek', value: situationViews },
      { key: 'package_views', label: 'Zobrazen\u00ed bal\u00ed\u010dk\u016f', value: packageViews },
      { key: 'builder_views', label: 'Vstupy do builderu', value: builderViews },
      { key: 'package_entries', label: 'Vstupy do package flow', value: packageFlowEntries },
      { key: 'checkout_clicks', label: 'Checkout kliky', value: checkoutClicks },
    ],
    pricingInterest: [
      {
        band: '99',
        topFunnel: homepage99Clicks,
        selection: tier99Selections,
        checkout: checkout99,
      },
      {
        band: '199',
        topFunnel: homepage199Clicks,
        selection: tier199Selections + upgrades,
        checkout: checkout199,
      },
      {
        band: '299',
        topFunnel: homepage299Clicks,
        selection: packageFlowEntries,
        checkout: checkout299,
      },
    ],
    articlePerformance,
    situationPerformance,
    packagePerformance,
    funnel: [
      { key: 'f1', label: '\u010cl\u00e1nky \u2192 builder', value: articleToBuilderClicks },
      { key: 'f2', label: '\u010cl\u00e1nky \u2192 situa\u010dn\u00ed str\u00e1nky', value: articleToSituationClicks },
      { key: 'f3', label: '\u010cl\u00e1nky \u2192 bal\u00ed\u010dky', value: articleToPackageClicks },
      { key: 'f4', label: 'Situa\u010dn\u00ed str\u00e1nky \u2192 builder', value: situationToBuilderClicks },
      { key: 'f5', label: 'Situa\u010dn\u00ed str\u00e1nky \u2192 bal\u00ed\u010dky', value: situationToPackageClicks },
      { key: 'f6', label: 'Vstupy do package flow', value: packageFlowEntries },
      { key: 'f7', label: 'Upgrade 99 \u2192 199', value: upgrades },
      { key: 'f8', label: 'Checkout kliky', value: checkoutClicks },
    ],
    topSourcesToBuilder: topRows(sourceToBuilder),
    topSourcesToPackage: topRows(sourceToPackage),
    topCtas: topRows(ctaStats, (key) => key.replace(/_/g, ' ')),
  };
}
