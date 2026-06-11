import { BLOG_ARTICLES } from '@/lib/blog-articles';
import {
  CHECKOUT_ADDON_CONFIG,
  CHECKOUT_ADDONS,
  type CheckoutAddonKey,
} from '@/lib/checkout-addons';
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

export type AnalyticsInsight = {
  label: string;
  value: string;
  hint?: string;
};

export type AnalyticsDashboardData = {
  windowDays: number;
  recentWindowDays: number;
  analyzedEvents: number;
  generatedAt: string;
  overview: DashboardRow[];
  recentOverview: DashboardRow[];
  insights: AnalyticsInsight[];
  pricingInterest: Array<{
    band: '99' | '199' | '299';
    topFunnel: number;
    selection: number;
    checkout: number;
  }>;
  addOnPerformance: Array<{
    key: CheckoutAddonKey;
    title: string;
    priceCzk: number;
    selections: number;
    removals: number;
    purchases: number;
    revenueCzk: number;
    purchaseRate: number;
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
  seoLandingPerformance: Array<{
    pathname: string;
    label: string;
    views: number;
    toBuilder: number;
    toPackage: number;
  }>;
};

export const ANALYTICS_REPORTING_WINDOW_DAYS = 30;
export const ANALYTICS_REPORTING_RECENT_DAYS = 7;

const SEO_LANDING_LABELS: Record<string, string> = {
  '/najemni-smlouva': 'Nájemní smlouva',
  '/najemni-smlouva-byt': 'Nájemní smlouva na byt',
  '/kupni-smlouva': 'Kupní smlouva',
  '/pracovni-smlouva': 'Pracovní smlouva',
  '/dohoda-o-provedeni-prace': 'DPP',
  '/podnajemni-smlouva': 'Podnájemní smlouva',
  '/plna-moc-online': 'Plná moc',
  '/uznani-dluhu-vzor': 'Uznání dluhu',
  '/darovaci-smlouva': 'Darovací smlouva',
  '/nda-smlouva': 'NDA',
  '/smlouva-o-dilo-online': 'Smlouva o dílo',
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
  let parsed: StoredAnalyticsEvent | null = null;

  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw) as StoredAnalyticsEvent;
    } catch {
      return null;
    }
  } else if (raw && typeof raw === 'object') {
    parsed = raw as StoredAnalyticsEvent;
  } else {
    return null;
  }

  if (!parsed || typeof parsed !== 'object') return null;
  if (typeof parsed.event !== 'string' || typeof parsed.received_at !== 'string') return null;
  return parsed;
}

function resolveArticleSlug(params: AnalyticsEventParams) {
  if (params.article_slug) return params.article_slug;
  const pathname = params.pathname;
  if (pathname?.startsWith('/blog/')) {
    return pathname.replace('/blog/', '').split('?')[0];
  }
  return undefined;
}

function formatRate(numerator: number, denominator: number) {
  if (denominator <= 0) return '—';
  return `${Math.round((numerator / denominator) * 1000) / 10} %`;
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

function toCheckoutAddonKey(value?: string): CheckoutAddonKey | null {
  if (!value) return null;
  return Object.prototype.hasOwnProperty.call(CHECKOUT_ADDON_CONFIG, value)
    ? (value as CheckoutAddonKey)
    : null;
}

function incrementAddOn(
  record: Map<CheckoutAddonKey, { selections: number; removals: number; purchases: number; revenueCzk: number }>,
  key: CheckoutAddonKey | null,
  field: 'selections' | 'removals' | 'purchases' | 'revenueCzk',
  amount = 1,
) {
  if (!key) return;
  const current = record.get(key) ?? {
    selections: 0,
    removals: 0,
    purchases: 0,
    revenueCzk: 0,
  };
  current[field] += amount;
  record.set(key, current);
}

export async function getAnalyticsDashboardData(
  windowDays = ANALYTICS_REPORTING_WINDOW_DAYS,
): Promise<AnalyticsDashboardData> {
  const now = new Date();
  const sinceTime = now.getTime() - windowDays * 24 * 60 * 60 * 1000;
  const recentSinceTime = now.getTime() - ANALYTICS_REPORTING_RECENT_DAYS * 24 * 60 * 60 * 1000;
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
  let checkoutModalOpens = 0;
  let checkoutModalCloses = 0;
  let checkoutConsentMissing = 0;
  let checkoutClicks = 0;
  let stripeCheckoutStarts = 0;
  let addOnSelections = 0;
  let addOnPurchases = 0;
  let addOnRevenueCzk = 0;
  let purchasesCompleted = 0;
  let purchaseRevenueCzk = 0;
  let documentDownloads = 0;
  let ordersWithDownload = 0;
  let newsletterSubscriptions = 0;
  let seoLandingViews = 0;
  let attributedBuilderEntries = 0;

  let recentBuilderViews = 0;
  let recentCheckoutModalOpens = 0;
  let recentCheckoutModalCloses = 0;
  let recentCheckoutConsentMissing = 0;
  let recentCheckoutClicks = 0;
  let recentStripeCheckoutStarts = 0;
  let recentPurchasesCompleted = 0;
  let recentPurchaseRevenueCzk = 0;
  let recentDocumentDownloads = 0;
  let recentOrdersWithDownload = 0;

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
  const addOnStats = new Map<
    CheckoutAddonKey,
    { selections: number; removals: number; purchases: number; revenueCzk: number }
  >();
  const seoLandingStats = new Map<
    string,
    { views: number; toBuilder: number; toPackage: number }
  >();

  for (const event of events) {
    const params = event.params ?? {};
    const destination = normalizeDestination(params.destination);
    const articleSlug = resolveArticleSlug(params);
    const inRecentWindow = withinWindow(event.received_at, recentSinceTime);
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
        if (articleSlug || params.pathname?.startsWith('/blog/')) {
          const slug = articleSlug ?? resolveArticleSlug(params);
          if (!slug) break;
          const current = articleStats.get(slug) ?? {
            views: 0,
            toBuilder: 0,
            toSituation: 0,
            toPackage: 0,
          };

          if (isBuilderDestination(destination)) {
            articleToBuilderClicks += 1;
            current.toBuilder += 1;
            increment(sourceToBuilder, `\u010cl\u00e1nek: ${ARTICLE_TITLES.get(slug) ?? slug}`);
          } else if (isSituationDestination(destination)) {
            articleToSituationClicks += 1;
            current.toSituation += 1;
          } else if (isPackageDestination(destination)) {
            articleToPackageClicks += 1;
            current.toPackage += 1;
            increment(sourceToPackage, `\u010cl\u00e1nek: ${ARTICLE_TITLES.get(slug) ?? slug}`);
          }

          articleStats.set(slug, current);
        }
        break;

      case 'seo_landing_view': {
        seoLandingViews += 1;
        const landingPath = params.pathname;
        if (landingPath) {
          const current = seoLandingStats.get(landingPath) ?? {
            views: 0,
            toBuilder: 0,
            toPackage: 0,
          };
          current.views += 1;
          seoLandingStats.set(landingPath, current);
        }
        break;
      }

      case 'seo_landing_cta_click': {
        const landingPath = params.pathname;
        if (landingPath) {
          const current = seoLandingStats.get(landingPath) ?? {
            views: 0,
            toBuilder: 0,
            toPackage: 0,
          };
          if (isBuilderDestination(destination)) {
            current.toBuilder += 1;
            increment(
              sourceToBuilder,
              `SEO: ${SEO_LANDING_LABELS[landingPath] ?? landingPath}`,
            );
          } else if (isPackageDestination(destination)) {
            current.toPackage += 1;
            increment(
              sourceToPackage,
              `SEO: ${SEO_LANDING_LABELS[landingPath] ?? landingPath}`,
            );
          }
          seoLandingStats.set(landingPath, current);
        }
        break;
      }

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
        if (inRecentWindow) recentBuilderViews += 1;
        if (params.traffic_label || params.traffic_source) {
          attributedBuilderEntries += 1;
          increment(
            sourceToBuilder,
            params.traffic_label ?? params.traffic_source ?? 'Neznámý zdroj',
          );
        }
        if (articleSlug) {
          const current = articleStats.get(articleSlug) ?? {
            views: 0,
            toBuilder: 0,
            toSituation: 0,
            toPackage: 0,
          };
          current.toBuilder += 1;
          articleStats.set(articleSlug, current);
        }
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

      case 'builder_checkout_modal_open':
        checkoutModalOpens += 1;
        if (inRecentWindow) recentCheckoutModalOpens += 1;
        break;

      case 'builder_checkout_modal_closed':
        checkoutModalCloses += 1;
        if (inRecentWindow) recentCheckoutModalCloses += 1;
        break;

      case 'builder_checkout_consent_missing':
        checkoutConsentMissing += 1;
        if (inRecentWindow) recentCheckoutConsentMissing += 1;
        break;

      case 'builder_checkout_clicked':
        checkoutClicks += 1;
        if (inRecentWindow) recentCheckoutClicks += 1;
        if (params.price_band === '99') checkout99 += 1;
        if (params.price_band === '199') checkout199 += 1;
        if (params.price_band === '299') checkout299 += 1;
        break;

      case 'stripe_checkout_started':
        stripeCheckoutStarts += 1;
        if (inRecentWindow) recentStripeCheckoutStarts += 1;
        break;

      case 'checkout_addon_selected': {
        const addOnKey = toCheckoutAddonKey(params.add_on_key);
        addOnSelections += addOnKey ? 1 : 0;
        incrementAddOn(addOnStats, addOnKey, 'selections');
        break;
      }

      case 'checkout_addon_removed': {
        const addOnKey = toCheckoutAddonKey(params.add_on_key);
        incrementAddOn(addOnStats, addOnKey, 'removals');
        break;
      }

      case 'checkout_addon_purchased': {
        const addOnKey = toCheckoutAddonKey(params.add_on_key);
        const priceCzk = addOnKey
          ? Number(params.add_on_price_czk) || CHECKOUT_ADDON_CONFIG[addOnKey].priceCzk
          : 0;
        addOnPurchases += addOnKey ? 1 : 0;
        addOnRevenueCzk += priceCzk;
        incrementAddOn(addOnStats, addOnKey, 'purchases');
        incrementAddOn(addOnStats, addOnKey, 'revenueCzk', priceCzk);
        break;
      }

      case 'checkout_completed':
        purchasesCompleted += 1;
        if (inRecentWindow) recentPurchasesCompleted += 1;
        if (typeof params.total_price_czk === 'number' && Number.isFinite(params.total_price_czk)) {
          purchaseRevenueCzk += params.total_price_czk;
          if (inRecentWindow) recentPurchaseRevenueCzk += params.total_price_czk;
        }
        break;

      case 'document_downloaded':
        documentDownloads += 1;
        if (inRecentWindow) recentDocumentDownloads += 1;
        if (params.download_sequence === 1) {
          ordersWithDownload += 1;
          if (inRecentWindow) recentOrdersWithDownload += 1;
        }
        break;

      case 'newsletter_subscribed':
        newsletterSubscriptions += 1;
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

  const addOnPerformance = CHECKOUT_ADDONS.map((addon) => {
    const stat = addOnStats.get(addon.key) ?? {
      selections: 0,
      removals: 0,
      purchases: 0,
      revenueCzk: 0,
    };
    return {
      key: addon.key,
      title: addon.title,
      priceCzk: addon.priceCzk,
      selections: stat.selections,
      removals: stat.removals,
      purchases: stat.purchases,
      revenueCzk: stat.revenueCzk,
      purchaseRate: stat.selections > 0 ? stat.purchases / stat.selections : 0,
    };
  }).sort((a, b) => b.revenueCzk - a.revenueCzk || b.purchases - a.purchases || b.selections - a.selections);

  const seoLandingPerformance = [...seoLandingStats.entries()]
    .map(([pathname, stat]) => ({
      pathname,
      label: SEO_LANDING_LABELS[pathname] ?? pathname,
      views: stat.views,
      toBuilder: stat.toBuilder,
      toPackage: stat.toPackage,
    }))
    .sort((a, b) => b.views + b.toBuilder - (a.views + a.toBuilder))
    .slice(0, 12);

  const insights: AnalyticsInsight[] = [
    {
      label: 'Builder → checkout',
      value: formatRate(checkoutClicks, builderViews),
      hint: 'Podíl návštěv builderu, kde někdo klikl na platbu.',
    },
    {
      label: 'Modal → Stripe',
      value: formatRate(stripeCheckoutStarts, checkoutModalOpens),
      hint: 'Podíl otevřených payment modalů, kde aplikace vytvořila Stripe checkout a začala přesměrování.',
    },
    {
      label: 'Modal zavřen bez Stripe',
      value: formatRate(checkoutModalCloses, checkoutModalOpens),
      hint: 'Podíl otevřených objednávkových modalů, které uživatel zavřel před přesměrováním do Stripe.',
    },
    {
      label: 'Klik bez souhlasu',
      value: String(checkoutConsentMissing),
      hint: 'Počet kliků na platební tlačítko bez potvrzení obchodních podmínek a GDPR.',
    },
    {
      label: 'Checkout → platba',
      value: formatRate(purchasesCompleted, stripeCheckoutStarts || checkoutClicks),
      hint: 'Tržby a starší platby ověřte ve Stripe (dashboard je limitovaný vzorkem eventů).',
    },
    {
      label: 'Platba → stažení',
      value: formatRate(ordersWithDownload, purchasesCompleted),
      hint: 'Podíl dokončených plateb, u kterých proběhlo alespoň jedno úspěšné stažení. Opakovaná PDF/DOCX stažení jsou oddělená metrika.',
    },
    {
      label: 'Články → builder (kliky)',
      value: formatRate(articleToBuilderClicks, articleViews),
      hint: 'Jen měřená CTA; přímé URL do builderu se započítají ve vstupech do builderu.',
    },
    {
      label: 'Builder s atribucí',
      value: formatRate(attributedBuilderEntries, builderViews),
      hint: 'Návštěvník přišel z článku nebo SEO landingu v rámci jedné session (30 min).',
    },
    {
      label: `Platby (${ANALYTICS_REPORTING_RECENT_DAYS} dní)`,
      value: String(recentPurchasesCompleted),
      hint:
        recentPurchasesCompleted === 0
          ? 'Žádná platba v posledním týdnu — u starších prodejů sledujte Stripe.'
          : `Tržba ${recentPurchaseRevenueCzk} Kč v posledním týdnu (z webhooku).`,
    },
  ];

  const recentOverview: DashboardRow[] = [
    { key: 'recent_builder', label: 'Vstupy do builderu', value: recentBuilderViews },
    { key: 'recent_modal_open', label: 'Payment modal open', value: recentCheckoutModalOpens },
    { key: 'recent_modal_closed', label: 'Modal zavřen bez Stripe', value: recentCheckoutModalCloses },
    { key: 'recent_consent_missing', label: 'Klik bez souhlasu', value: recentCheckoutConsentMissing },
    { key: 'recent_checkout', label: 'Checkout kliky', value: recentCheckoutClicks },
    { key: 'recent_stripe_started', label: 'Stripe checkout start', value: recentStripeCheckoutStarts },
    { key: 'recent_purchases', label: 'Dokončené platby', value: recentPurchasesCompleted },
    { key: 'recent_orders_downloaded', label: 'Objednávky se stažením', value: recentOrdersWithDownload },
    { key: 'recent_downloads', label: 'Stažené dokumenty', value: recentDocumentDownloads },
    {
      key: 'recent_revenue',
      label: 'Tržba z plateb (Kč)',
      value: recentPurchaseRevenueCzk,
    },
  ];

  return {
    windowDays,
    recentWindowDays: ANALYTICS_REPORTING_RECENT_DAYS,
    analyzedEvents: events.length,
    generatedAt: now.toISOString(),
    insights,
    recentOverview,
    seoLandingPerformance,
    overview: [
      { key: 'article_views', label: 'Zobrazen\u00ed \u010dl\u00e1nk\u016f', value: articleViews },
      { key: 'article_to_builder', label: '\u010cl\u00e1nky \u2192 builder', value: articleToBuilderClicks },
      { key: 'article_to_package', label: '\u010cl\u00e1nky \u2192 bal\u00ed\u010dek', value: articleToPackageClicks },
      { key: 'situation_views', label: 'Zobrazen\u00ed situa\u010dn\u00edch str\u00e1nek', value: situationViews },
      { key: 'package_views', label: 'Zobrazen\u00ed bal\u00ed\u010dk\u016f', value: packageViews },
      { key: 'builder_views', label: 'Vstupy do builderu', value: builderViews },
      { key: 'package_entries', label: 'Vstupy do package flow', value: packageFlowEntries },
      { key: 'checkout_modal_opens', label: 'Payment modal open', value: checkoutModalOpens },
      { key: 'checkout_modal_closed', label: 'Modal zavřen bez Stripe', value: checkoutModalCloses },
      { key: 'checkout_consent_missing', label: 'Klik bez souhlasu', value: checkoutConsentMissing },
      { key: 'checkout_clicks', label: 'Checkout kliky', value: checkoutClicks },
      { key: 'stripe_checkout_started', label: 'Stripe checkout start', value: stripeCheckoutStarts },
      { key: 'purchases_completed', label: 'Dokončené platby', value: purchasesCompleted },
      { key: 'orders_with_download', label: 'Objednávky se stažením', value: ordersWithDownload },
      { key: 'document_downloads', label: 'Stažené dokumenty celkem', value: documentDownloads },
      { key: 'purchase_revenue', label: 'Tržba z plateb (Kč)', value: purchaseRevenueCzk },
      { key: 'newsletter_subscriptions', label: 'Přihlášení k newsletteru', value: newsletterSubscriptions },
      { key: 'addon_selections', label: 'Výběry add-onů', value: addOnSelections },
      { key: 'addon_purchases', label: 'Zaplacené add-ony', value: addOnPurchases },
      { key: 'addon_revenue', label: 'Tržba z add-onů (Kč)', value: addOnRevenueCzk },
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
    addOnPerformance,
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
      { key: 'f8', label: 'Payment modal open', value: checkoutModalOpens },
      { key: 'f9', label: 'Modal zavřen bez Stripe', value: checkoutModalCloses },
      { key: 'f10', label: 'Klik bez souhlasu', value: checkoutConsentMissing },
      { key: 'f11', label: 'Checkout kliky', value: checkoutClicks },
      { key: 'f12', label: 'Stripe checkout start', value: stripeCheckoutStarts },
      { key: 'f13', label: 'Dokončené platby', value: purchasesCompleted },
      { key: 'f14', label: 'Objednávky se stažením', value: ordersWithDownload },
      { key: 'f15', label: 'Stažené dokumenty celkem', value: documentDownloads },
      { key: 'f16', label: 'Přihlášení k newsletteru', value: newsletterSubscriptions },
    ],
    topSourcesToBuilder: topRows(sourceToBuilder),
    topSourcesToPackage: topRows(sourceToPackage),
    topCtas: topRows(ctaStats, (key) => key.replace(/_/g, ' ')),
  };
}
