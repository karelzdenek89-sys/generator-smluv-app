import { trafficAttributionParams } from './analytics-attribution';

export const ANALYTICS_EVENT_NAMES = [
  'blog_article_view',
  'blog_cta_click',
  'seo_landing_view',
  'seo_landing_cta_click',
  'situation_page_view',
  'situation_cta_click',
  'package_page_view',
  'package_cta_click',
  'builder_view',
  'package_flow_entered',
  'builder_tier_selected',
  'builder_upgrade_clicked',
  'builder_checkout_clicked',
  'checkout_addon_selected',
  'checkout_addon_removed',
  'checkout_addon_purchased',
  'homepage_pricing_path_click',
  'homepage_situation_click',
  'homepage_package_click',
  'checkout_completed',
  'newsletter_subscribed',
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number];

export type AnalyticsEventParams = {
  pathname?: string;
  source?: string;
  destination?: string;
  surface?: string;
  traffic_source?: string;
  traffic_label?: string;
  article_slug?: string;
  situation_key?: 'landlord' | 'vehicle_sale';
  package_key?: 'landlord' | 'vehicle_sale';
  contract_type?:
    | 'lease'
    | 'car_sale'
    | 'gift'
    | 'work_contract'
    | 'loan'
    | 'nda'
    | 'general_sale'
    | 'employment'
    | 'dpp'
    | 'service'
    | 'sublease'
    | 'power_of_attorney'
    | 'debt_acknowledgment'
    | 'cooperation';
  tier?: 'basic' | 'complete';
  previous_tier?: 'basic' | 'complete';
  cta_type?: string;
  price_band?: '99' | '199' | '299';
  entry_mode?: 'single_document' | 'package_flow';
  add_on_key?:
    | 'docx'
    | 'signing_checklist'
    | 'handover_protocol'
    | 'extended_archive'
    | 'bilingual_annex';
  add_on_keys?: string;
  add_on_price_czk?: number;
  addons_total_czk?: number;
  base_price_czk?: number;
  total_price_czk?: number;
  selected_addons_count?: number;
};

type AnalyticsPayload = {
  event: AnalyticsEventName;
  params?: AnalyticsEventParams;
};

const CONTRACT_TYPE_BY_PATHNAME: Record<string, AnalyticsEventParams['contract_type']> = {
  '/najem': 'lease',
  '/auto': 'car_sale',
  '/darovaci': 'gift',
  '/smlouva-o-dilo': 'work_contract',
  '/pujcka': 'loan',
  '/nda': 'nda',
  '/kupni': 'general_sale',
  '/pracovni': 'employment',
  '/dpp': 'dpp',
  '/sluzby': 'service',
  '/podnajem': 'sublease',
  '/plna-moc': 'power_of_attorney',
  '/uznani-dluhu': 'debt_acknowledgment',
  '/spoluprace': 'cooperation',
};

const SITUATION_KEY_BY_PATHNAME: Record<string, NonNullable<AnalyticsEventParams['situation_key']>> = {
  '/pro-pronajimatele': 'landlord',
  '/prodej-vozidla': 'vehicle_sale',
};

const PACKAGE_KEY_BY_PATHNAME: Record<string, NonNullable<AnalyticsEventParams['package_key']>> = {
  '/balicek-pronajimatel': 'landlord',
  '/balicek-prodej-vozidla': 'vehicle_sale',
};

export function getAnalyticsDefaultsForPathname(pathname: string): AnalyticsEventParams {
  const defaults: AnalyticsEventParams = { pathname };

  if (pathname.startsWith('/blog/')) {
    defaults.article_slug = pathname.replace('/blog/', '');
  }

  if (CONTRACT_TYPE_BY_PATHNAME[pathname]) {
    defaults.contract_type = CONTRACT_TYPE_BY_PATHNAME[pathname];
  }

  if (SITUATION_KEY_BY_PATHNAME[pathname]) {
    defaults.situation_key = SITUATION_KEY_BY_PATHNAME[pathname];
  }

  if (PACKAGE_KEY_BY_PATHNAME[pathname]) {
    defaults.package_key = PACKAGE_KEY_BY_PATHNAME[pathname];
  }

  return defaults;
}

function shouldUseBeacon() {
  return typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function';
}

export function trackEvent(event: AnalyticsEventName, params?: AnalyticsEventParams) {
  if (typeof window === 'undefined') return;

  const pathname = params?.pathname ?? window.location.pathname;
  const attribution = trafficAttributionParams();
  const payload: AnalyticsPayload = {
    event,
    params: {
      ...getAnalyticsDefaultsForPathname(pathname),
      ...(attribution
        ? {
            traffic_source: attribution.source,
            traffic_label: attribution.label,
            article_slug: params?.article_slug ?? attribution.article_slug,
          }
        : {}),
      ...params,
      pathname,
    },
  };

  try {
    const body = JSON.stringify(payload);

    if (shouldUseBeacon()) {
      navigator.sendBeacon('/api/analytics', new Blob([body], { type: 'application/json' }));
      return;
    }

    void fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    });
  } catch {
    // analytika nesmí rušit UX
  }
}
