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
  'builder_completed',
  'package_flow_entered',
  'builder_tier_selected',
  'builder_upgrade_clicked',
  'builder_checkout_modal_open',
  'builder_checkout_modal_closed',
  'builder_checkout_consent_missing',
  'builder_checkout_clicked',
  'stripe_checkout_started',
  'checkout_rejected',
  'checkout_addon_selected',
  'checkout_addon_removed',
  'checkout_addon_purchased',
  'homepage_pricing_path_click',
  'homepage_situation_click',
  'homepage_package_click',
  'checkout_completed',
  'newsletter_subscribed',
  'document_downloaded',
  'free_document_generated',
  'free_document_downloaded',
  'premium_offer_viewed',
  'premium_upgrade_clicked',
  // Monetizace 2.0 — kontextové produktové nabídky v obsahu
  'content_offer_view',
  'content_offer_click',
  // Volba balíčku proti samostatnému dokumentu
  'bundle_selected',
  // Navazující nabídka po zaplacení / u stažení
  'post_purchase_offer_view',
  'post_purchase_offer_click',
  // Generický partner funnel. Legacy post_purchase eventy zůstávají kvůli historii.
  'partner_offer_eligible',
  'partner_offer_viewed',
  'partner_offer_clicked',
  'partner_lead_started',
  'partner_lead_consent_granted',
  'partner_lead_submitted',
  'partner_lead_succeeded',
  'partner_lead_failed',
  'partner_conversion_recorded',
  // Zájem o roční plán; měří poptávku dřív, než vznikne recurring backend
  'annual_plan_interest',
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number];

/** Events that a browser may legitimately observe and submit. Revenue,
 * payment, fulfilment, subscription and verified partner outcomes are kept
 * server-only so the reporting dashboard cannot be forged through this API. */
export const PUBLIC_ANALYTICS_EVENT_NAMES = [
  'blog_article_view',
  'blog_cta_click',
  'seo_landing_view',
  'seo_landing_cta_click',
  'situation_page_view',
  'situation_cta_click',
  'package_page_view',
  'package_cta_click',
  'builder_view',
  'builder_completed',
  'package_flow_entered',
  'builder_tier_selected',
  'builder_upgrade_clicked',
  'builder_checkout_modal_open',
  'builder_checkout_modal_closed',
  'builder_checkout_consent_missing',
  'builder_checkout_clicked',
  'checkout_addon_selected',
  'checkout_addon_removed',
  'homepage_pricing_path_click',
  'homepage_situation_click',
  'homepage_package_click',
  'premium_offer_viewed',
  'premium_upgrade_clicked',
  'content_offer_view',
  'content_offer_click',
  'bundle_selected',
  'post_purchase_offer_view',
  'post_purchase_offer_click',
  'partner_offer_eligible',
  'partner_offer_viewed',
  'partner_offer_clicked',
  'partner_lead_started',
  'partner_lead_consent_granted',
  'partner_lead_submitted',
  'partner_lead_failed',
  'annual_plan_interest',
] as const satisfies readonly AnalyticsEventName[];

export type PublicAnalyticsEventName = (typeof PUBLIC_ANALYTICS_EVENT_NAMES)[number];

export type PriceBand = '99' | '199' | '299' | '399' | '599';

export type AnalyticsEventParams = {
  pathname?: string;
  source?: string;
  destination?: string;
  surface?: string;
  traffic_source?: string;
  traffic_label?: string;
  article_slug?: string;
  situation_key?: 'landlord' | 'vehicle_sale';
  package_key?: 'landlord' | 'vehicle_sale' | 'employer_start' | 'work_order';
  /** Stabilní identifikátor nabízeného produktu (balíček, plán, partnerská služba). */
  product_id?: string;
  /** Druh nabídky, aby šlo oddělit obsahové CTA od post-payment nabídek. */
  offer_type?: 'content_bundle' | 'post_purchase' | 'partner' | 'annual_plan';
  /** Stránka, na které se nabídka zobrazila — doplňuje pathname o logický zdroj. */
  source_page?: string;
  /** Jazyk rozhraní, ve kterém se nabídka zobrazila. */
  locale?: string;
  partner_id?: string;
  provider?: string;
  offer_category?:
    | 'electronic_signature' | 'vehicle_history' | 'insurance'
    | 'landlord_services' | 'construction_planning' | 'invoicing' | 'hr_payroll';
  user_role?:
    | 'landlord' | 'tenant' | 'seller' | 'buyer' | 'employer'
    | 'employee' | 'customer' | 'client' | 'contractor'
    | 'supplier' | 'freelancer' | 'company' | 'unknown';
  placement?: 'success' | 'download';
  revenue_czk?: number;
  partner_click_id?: string;
  partner_transaction_id?: string;
  experiment_id?: string;
  variant?: string;
  monetization_mode?: 'paid' | 'freemium' | 'free_experiment';
  landing_page?: string;
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
  price_band?: PriceBand;
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
  download_format?: 'pdf' | 'docx';
  download_sequence?: number;
  /** Which guard turned a checkout request away; see CHECKOUT_REJECT_REASONS. */
  reject_reason?: CheckoutRejectReason;
  /** Payload field that failed validation, when the guard identified one. */
  reject_field?: string;
};

/**
 * A rejected checkout is invisible to the buyer and to us: the request never
 * reaches Stripe, so no funnel event is recorded and no order exists. Naming
 * every guard lets a broken checkout show up in reporting instead of being
 * mistaken for people changing their minds.
 */
export const CHECKOUT_REJECT_REASONS = [
  'invalid_json',
  'rate_limited',
  'storage_unavailable',
  'invalid_contract_type',
  'invalid_email',
  'consent_missing',
  'consent_stale',
  'payload_not_object',
  'payload_too_large',
  'payload_invalid',
  'draft_persist_failed',
  'stripe_unavailable',
  'internal_error',
] as const;

export type CheckoutRejectReason = (typeof CHECKOUT_REJECT_REASONS)[number];

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
  '/balicek-zamestnavatel': 'employer_start',
  '/balicek-zakazka': 'work_order',
};

const ANALYTICS_CONTRACT_TYPES = new Set<string>(Object.values(CONTRACT_TYPE_BY_PATHNAME) as string[]);

/**
 * Zúží libovolný řetězec na typ dokumentu známý analytice.
 *
 * Neznámou hodnotu raději zahodí, než aby ji poslala dál — do reportingu nesmí
 * proniknout hodnota, kterou dashboard neumí zařadit.
 */
export function asAnalyticsContractType(
  value: string | null | undefined,
): AnalyticsEventParams['contract_type'] {
  return value && ANALYTICS_CONTRACT_TYPES.has(value)
    ? (value as AnalyticsEventParams['contract_type'])
    : undefined;
}

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
