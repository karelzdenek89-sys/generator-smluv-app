/**
 * Google Analytics 4 — načítá se až po souhlasu s analytikou.
 *
 * Měřicí ID přichází z `NEXT_PUBLIC_GA_MEASUREMENT_ID` (vkládá se při buildu).
 * Prázdná nebo neplatná hodnota znamená, že GA je vypnuté: nevznikne žádný
 * skript, CSP se nerozšiřuje a lišta cookies o Google nemluví.
 *
 * Před souhlasem se gtag.js vůbec nestahuje, takže nevznikne žádný požadavek
 * na googletagmanager.com / google-analytics.com ani cookies `_ga`.
 * Reklamní funkce (Google signály, personalizace reklam, ad_storage) zůstávají
 * vypnuté. Zobrazení stránek při klientské navigaci měří GA4 samo (enhanced
 * measurement → změny historie), proto page_view ručně neposíláme.
 */

const MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]{4,20}$/;

function readMeasurementId(): string {
  const raw = (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? '').trim().toUpperCase();
  return MEASUREMENT_ID_PATTERN.test(raw) ? raw : '';
}

/** Prázdný řetězec = GA4 vypnuté. */
export const GA_MEASUREMENT_ID = readMeasurementId();

export function isGoogleAnalyticsConfigured(): boolean {
  return GA_MEASUREMENT_ID !== '';
}

/** Minimální rozšíření CSP, které gtag.js potřebuje. Bez měřicího ID nic nepřidává. */
export const GOOGLE_ANALYTICS_CSP = GA_MEASUREMENT_ID
  ? {
      scriptSrc: ['https://www.googletagmanager.com'],
      connectSrc: [
        'https://*.google-analytics.com',
        'https://*.analytics.google.com',
        'https://*.googletagmanager.com',
      ],
      imgSrc: ['https://*.google-analytics.com', 'https://*.googletagmanager.com'],
    }
  : { scriptSrc: [], connectSrc: [], imgSrc: [] };

/**
 * Soukromé plochy po nákupu a účty. Adresy nesou identifikátory objednávek,
 * zakázek nebo přístupové tokeny, proto na nich GA nespouštíme ani neměříme.
 */
const PRIVATE_PATH = /^\/(?:success|stahnout|zakaznicka-zona|moje|moje-zakazka|moje-pripady|obnova-hesla|newsletter|interni|sledovani-zmeny|prihlaseni|registrace|api)(?:\/|$)/;

export function isGoogleAnalyticsExcludedPath(pathname: string): boolean {
  return PRIVATE_PATH.test(pathname);
}

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

const SCRIPT_ATTRIBUTE = 'data-sh-ga4';
let consentRevoked = false;

function disableFlagKey(measurementId: string) {
  return `ga-disable-${measurementId}`;
}

function setDisabled(measurementId: string, disabled: boolean) {
  (window as unknown as Record<string, unknown>)[disableFlagKey(measurementId)] = disabled;
}

function isScriptLoaded() {
  return document.querySelector(`script[${SCRIPT_ATTRIBUTE}]`) !== null;
}

/** Spustí GA4 po udělení souhlasu. Opakované volání nic nezdvojí. */
export function enableGoogleAnalytics(measurementId: string) {
  if (typeof window === 'undefined' || !MEASUREMENT_ID_PATTERN.test(measurementId)) return;
  setDisabled(measurementId, false);

  if (isScriptLoaded() && window.gtag) {
    if (consentRevoked) {
      window.gtag('consent', 'update', { analytics_storage: 'granted' });
      consentRevoked = false;
    }
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js očekává objekt `arguments`, ne pole.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'granted',
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  script.setAttribute(SCRIPT_ATTRIBUTE, '');
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  consentRevoked = false;
}

/** Dočasně zastaví odesílání (soukromá stránka) bez změny souhlasu. */
export function pauseGoogleAnalytics(measurementId: string) {
  if (typeof window === 'undefined' || !isScriptLoaded()) return;
  setDisabled(measurementId, true);
}

/** Smaže cookies `_ga` a `_ga_*` pro aktuální doménu i nadřazené domény. */
export function clearGoogleAnalyticsCookies() {
  if (typeof document === 'undefined') return;
  const names = document.cookie
    .split(';')
    .map((part) => part.split('=')[0]?.trim() ?? '')
    .filter((name) => name === '_ga' || name.startsWith('_ga_'));
  if (names.length === 0) return;

  const labels = window.location.hostname.split('.');
  const domains: string[] = [''];
  // www.smlouvahned.cz → www.smlouvahned.cz, smlouvahned.cz (bez samotné TLD)
  for (let index = 0; index < labels.length - 1; index += 1) {
    const domain = labels.slice(index).join('.');
    domains.push(domain, `.${domain}`);
  }

  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain ? `; domain=${domain}` : ''}`;
    }
  }
}

/** Odvolání souhlasu: zastaví měření a smaže GA cookies. */
export function revokeGoogleAnalytics(measurementId: string) {
  if (typeof window === 'undefined') return;
  if (window.gtag && isScriptLoaded()) {
    window.gtag('consent', 'update', { analytics_storage: 'denied' });
    consentRevoked = true;
  }
  setDisabled(measurementId, true);
  clearGoogleAnalyticsCookies();
}
