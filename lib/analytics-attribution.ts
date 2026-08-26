export type TrafficAttribution = {
  source: string;
  label: string;
  article_slug?: string;
  pathname?: string;
  captured_at: string;
};

export type CheckoutAnalyticsAttribution = {
  trafficSource: string;
  articleSlug?: string;
  landingPage: string;
  capturedAt: string;
};

const STORAGE_KEY = 'sh_traffic_attribution';
export const PRODUCT_ANALYTICS_CONSENT_STORAGE_KEY = 'sh_product_analytics_consent_v1';
const PRODUCT_ANALYTICS_CONSENT_EVENT = 'sh:product-analytics-consent';
const MAX_AGE_MS = 30 * 60 * 1000;
const SAFE_SOURCE = /^(?:blog_article|seo_landing|situation_page|package_page|homepage|builder_landing)$/;
const SAFE_ARTICLE_SLUG = /^(?:expat\/)?[a-z0-9-]{1,160}$/;

const BUILDER_LANDING_PATHS = new Set([
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

let expiryTimer: number | undefined;

const LANDING_VIEW_EVENT_BY_SOURCE = {
  blog_article: 'blog_article_view',
  seo_landing: 'seo_landing_view',
  situation_page: 'situation_page_view',
  package_page: 'package_page_view',
  homepage: 'homepage_view',
  builder_landing: 'builder_view',
} as const;

export function attributionViewMatchesSource(eventName: string, trafficSource: string) {
  return LANDING_VIEW_EVENT_BY_SOURCE[
    trafficSource as keyof typeof LANDING_VIEW_EVENT_BY_SOURCE
  ] === eventName;
}

function cleanLandingPage(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  if (
    !normalized.startsWith('/')
    || normalized.length > 256
    || normalized.includes('?')
    || normalized.includes('#')
    || normalized.includes('\\')
    || (normalized !== '/' && !/^\/[a-z0-9-]+(?:\/[a-z0-9-]+)*$/.test(normalized))
    || /[\u0000-\u001f\u007f]/.test(normalized)
  ) return null;
  return normalized;
}

function landingPageMatchesSource(source: string, landingPage: string) {
  if (source === 'homepage') return landingPage === '/';
  if (source === 'builder_landing') return BUILDER_LANDING_PATHS.has(landingPage);
  if (source === 'blog_article') return /^\/blog\/[a-z0-9-]+(?:\/[a-z0-9-]+)?$/.test(landingPage);
  if (source === 'package_page') return /^\/balicek-[a-z0-9-]+$/.test(landingPage);
  if (source === 'situation_page') {
    return /^\/(?:pro-[a-z0-9-]+|prodej-vozidla)$/.test(landingPage);
  }
  if (source === 'seo_landing') {
    return !/^\/(?:api|interni|newsletter|stahnout|success|zakaznicka-zona)(?:\/|$)/.test(landingPage);
  }
  return false;
}

function clearTrafficAttribution() {
  if (typeof window === 'undefined') return;
  if (expiryTimer !== undefined) {
    window.clearTimeout(expiryTimer);
    expiryTimer = undefined;
  }
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // sessionStorage může být nedostupné
  }
}

function scheduleExpiry(capturedAt: string) {
  if (typeof window === 'undefined') return;
  if (expiryTimer !== undefined) window.clearTimeout(expiryTimer);
  expiryTimer = window.setTimeout(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      const stored = raw ? JSON.parse(raw) as Partial<TrafficAttribution> : null;
      if (stored?.captured_at === capturedAt) sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      clearTrafficAttribution();
    }
    expiryTimer = undefined;
  }, MAX_AGE_MS);
}

export type ProductAnalyticsConsent = 'granted' | 'denied' | null;

export function getProductAnalyticsConsent(): ProductAnalyticsConsent {
  if (typeof window === 'undefined') return null;
  try {
    const value = localStorage.getItem(PRODUCT_ANALYTICS_CONSENT_STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

export function isProductAnalyticsConsentGranted() {
  return getProductAnalyticsConsent() === 'granted';
}

export function setProductAnalyticsConsent(granted: boolean) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      PRODUCT_ANALYTICS_CONSENT_STORAGE_KEY,
      granted ? 'granted' : 'denied',
    );
  } catch {
    // Bez trvalé preference vlastní produktovou analytiku nespouštíme.
  }
  if (!granted) clearTrafficAttribution();
  window.dispatchEvent(new Event(PRODUCT_ANALYTICS_CONSENT_EVENT));
}

export function subscribeToProductAnalyticsConsent(callback: () => void) {
  if (typeof window === 'undefined') return () => undefined;
  const listener = () => {
    if (isProductAnalyticsConsentGranted()) callback();
  };
  window.addEventListener(PRODUCT_ANALYTICS_CONSENT_EVENT, listener);
  return () => window.removeEventListener(PRODUCT_ANALYTICS_CONSENT_EVENT, listener);
}

function normalizeAttribution(
  value: unknown,
  now: number,
  enforceFreshness: boolean,
): CheckoutAnalyticsAttribution | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const candidate = value as Record<string, unknown>;
  const trafficSource = typeof candidate.trafficSource === 'string'
    ? candidate.trafficSource.trim().toLowerCase()
    : '';
  const capturedAt = typeof candidate.capturedAt === 'string' ? candidate.capturedAt : '';
  const capturedAtMs = Date.parse(capturedAt);
  if (
    !SAFE_SOURCE.test(trafficSource)
    || !Number.isFinite(capturedAtMs)
    || capturedAtMs > now + 5 * 60_000
    || (enforceFreshness && capturedAtMs < now - MAX_AGE_MS)
  ) return null;

  const articleSlug = typeof candidate.articleSlug === 'string'
    && SAFE_ARTICLE_SLUG.test(candidate.articleSlug.trim().toLowerCase())
    ? candidate.articleSlug.trim().toLowerCase()
    : null;
  const landingPage = cleanLandingPage(candidate.landingPage)
    ?? (articleSlug ? `/blog/${articleSlug}` : null);
  if (!landingPage || !landingPageMatchesSource(trafficSource, landingPage)) return null;
  if (
    trafficSource === 'blog_article'
    && articleSlug
    && landingPage !== `/blog/${articleSlug}`
    && !landingPage.endsWith(`/${articleSlug}`)
  ) return null;

  return {
    trafficSource,
    ...(articleSlug ? { articleSlug } : {}),
    landingPage,
    capturedAt: new Date(capturedAtMs).toISOString(),
  };
}

export function normalizeCheckoutAnalyticsAttribution(
  value: unknown,
  now = Date.now(),
): CheckoutAnalyticsAttribution | null {
  return normalizeAttribution(value, now, true);
}

export function normalizeConsentedCheckoutAnalyticsAttribution(
  consentGranted: boolean,
  value: unknown,
  now = Date.now(),
): CheckoutAnalyticsAttribution | null {
  return consentGranted ? normalizeCheckoutAnalyticsAttribution(value, now) : null;
}

export function normalizeStoredCheckoutAnalyticsAttribution(
  value: unknown,
  now = Date.now(),
): CheckoutAnalyticsAttribution | null {
  return normalizeAttribution(value, now, false);
}

export function analyticsAttributionEventParams(
  attribution: CheckoutAnalyticsAttribution | null | undefined,
) {
  return attribution
    ? {
        traffic_source: attribution.trafficSource,
        article_slug: attribution.articleSlug,
        acquisition_page: attribution.landingPage,
      }
    : {};
}

export function rememberTrafficAttribution(
  attribution: Omit<TrafficAttribution, 'captured_at'>,
) {
  if (typeof window === 'undefined' || !isProductAnalyticsConsentGranted()) return;

  try {
    const payload: TrafficAttribution = {
      ...attribution,
      captured_at: new Date().toISOString(),
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    scheduleExpiry(payload.captured_at);
  } catch {
    // sessionStorage může být nedostupné
  }
}

export function rememberTrafficAttributionIfEmpty(
  attribution: Omit<TrafficAttribution, 'captured_at'>,
) {
  if (!readTrafficAttribution()) rememberTrafficAttribution(attribution);
}

export function readTrafficAttribution(): TrafficAttribution | null {
  if (typeof window === 'undefined') return null;

  if (!isProductAnalyticsConsentGranted()) {
    clearTrafficAttribution();
    return null;
  }

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as TrafficAttribution;
    if (!parsed?.captured_at || !parsed.source || !parsed.label) return null;

    const age = Date.now() - Date.parse(parsed.captured_at);
    if (!Number.isFinite(age) || age > MAX_AGE_MS) {
      clearTrafficAttribution();
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function trafficAttributionParams(): Pick<
  TrafficAttribution,
  'source' | 'label' | 'article_slug'
> & { acquisition_page?: string } | null {
  const attribution = readTrafficAttribution();
  if (!attribution) return null;

  return {
    source: attribution.source,
    label: attribution.label,
    article_slug: attribution.article_slug,
    acquisition_page: attribution.pathname,
  };
}

export function getCheckoutAnalyticsAttribution(): CheckoutAnalyticsAttribution | undefined {
  const attribution = readTrafficAttribution();
  return normalizeCheckoutAnalyticsAttribution(
    attribution
      ? {
          trafficSource: attribution.source,
          articleSlug: attribution.article_slug,
          landingPage: attribution.pathname,
          capturedAt: attribution.captured_at,
        }
      : null,
  ) ?? undefined;
}
