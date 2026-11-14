/**
 * GA4 + souhlas s analytikou.
 *
 * - bez NEXT_PUBLIC_GA_MEASUREMENT_ID je GA vypnuté (žádné CSP, žádný souhlas s GA),
 * - souhlas z lišty bez zmínky o Google (jen `…_consent_v1`) neplatí pro GA,
 * - gtag.js se vloží až po souhlasu, ne na soukromých stránkách, a odvolání
 *   smaže cookies `_ga*`.
 *
 * Měřicí ID se čte při importu, proto se varianta bez ID spouští v podprocesu.
 */
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

type Element = { tag: string; attrs: Record<string, string>; src?: string; async?: boolean };

function installBrowserMocks() {
  const storage = new Map<string, string>();
  const head: Element[] = [];
  const cookies = new Map<string, string>();
  const listeners = new Map<string, Set<() => void>>();
  const deletedCookieWrites: string[] = [];

  const g = globalThis as unknown as Record<string, unknown>;
  g.localStorage = {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => void storage.set(key, value),
    removeItem: (key: string) => void storage.delete(key),
  };
  g.sessionStorage = g.localStorage;
  g.document = {
    get cookie() {
      return [...cookies.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
    },
    set cookie(value: string) {
      const [pair] = value.split(';');
      const [name, val] = pair.split('=');
      if (/expires=Thu, 01 Jan 1970/.test(value)) {
        deletedCookieWrites.push(value);
        cookies.delete(name.trim());
      } else {
        cookies.set(name.trim(), val ?? '');
      }
    },
    head: { appendChild: (el: Element) => void head.push(el) },
    createElement: (tag: string) => {
      const el: Element = { tag, attrs: {} };
      return Object.assign(el, { setAttribute: (k: string, v: string) => { el.attrs[k] = v; } });
    },
    querySelector: (selector: string) =>
      selector === 'script[data-sh-ga4]' ? head.find((el) => 'data-sh-ga4' in el.attrs) ?? null : null,
  };
  g.window = Object.assign(globalThis, {
    location: { hostname: 'www.smlouvahned.cz', pathname: '/' },
    setTimeout,
    clearTimeout,
    addEventListener: (name: string, cb: () => void) => {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name)!.add(cb);
    },
    removeEventListener: (name: string, cb: () => void) => listeners.get(name)?.delete(cb),
    dispatchEvent: (event: Event) => {
      listeners.get(event.type)?.forEach((cb) => cb());
      return true;
    },
  });
  return { storage, head, cookies, deletedCookieWrites };
}

async function runWithoutMeasurementId() {
  installBrowserMocks();
  const ga = await import('../lib/google-analytics');
  const consent = await import('../lib/analytics-attribution');
  assert.equal(ga.GA_MEASUREMENT_ID, '');
  assert.equal(ga.isGoogleAnalyticsConfigured(), false);
  assert.deepEqual(ga.GOOGLE_ANALYTICS_CSP, { scriptSrc: [], connectSrc: [], imgSrc: [] });
  consent.setProductAnalyticsConsent(true);
  assert.equal(localStorage.getItem(consent.GOOGLE_ANALYTICS_CONSENT_STORAGE_KEY), null,
    'bez GA se souhlas s GA nesmí zapsat (lišta Google nezmiňuje)');
  assert.equal(consent.getAnalyticsConsent(), 'granted');
  console.log('google-analytics-consent (bez ID): OK');
}

async function runWithMeasurementId() {
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'G-TEST000000';
  const { storage, head, cookies, deletedCookieWrites } = installBrowserMocks();
  const ga = await import('../lib/google-analytics');
  const consent = await import('../lib/analytics-attribution');
  const id = 'G-TEST000000';
  assert.equal(ga.GA_MEASUREMENT_ID, id);
  assert.ok(ga.GOOGLE_ANALYTICS_CSP.scriptSrc.includes('https://www.googletagmanager.com'));

  // Starší souhlas jen s vlastní analytikou → GA bez rozhodnutí → lišta znovu.
  storage.set(consent.PRODUCT_ANALYTICS_CONSENT_STORAGE_KEY, 'granted');
  assert.equal(consent.getProductAnalyticsConsent(), 'granted');
  assert.equal(consent.getGoogleAnalyticsConsent(), null);
  assert.equal(consent.getAnalyticsConsent(), null);

  // Soukromé plochy
  for (const path of ['/success', '/stahnout', '/zakaznicka-zona', '/moje', '/moje-zakazka/obnovit', '/moje-pripady/pripad']) {
    assert.ok(ga.isGoogleAnalyticsExcludedPath(path), path);
  }
  for (const path of ['/', '/najem', '/blog/dpp-dohoda-provedeni-prace', '/mojebydleni']) {
    assert.ok(!ga.isGoogleAnalyticsExcludedPath(path), path);
  }

  // Před souhlasem se nic nenačte.
  assert.equal(head.length, 0);

  // Souhlas
  consent.setProductAnalyticsConsent(true);
  assert.equal(consent.getGoogleAnalyticsConsent(), 'granted');
  ga.enableGoogleAnalytics(id);
  ga.enableGoogleAnalytics(id);
  assert.equal(head.length, 1, 'gtag.js se vloží právě jednou');
  assert.equal(head[0].src, `https://www.googletagmanager.com/gtag/js?id=${id}`);
  const dataLayer = (window as unknown as { dataLayer: IArguments[] }).dataLayer.map((args) => [...args]);
  assert.deepEqual(dataLayer[0], ['consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted',
  }]);
  assert.equal(dataLayer[1][0], 'js');
  assert.deepEqual(dataLayer[2], ['config', id, { allow_google_signals: false, allow_ad_personalization_signals: false }]);
  assert.equal(dataLayer.filter((args) => args[0] === 'config').length, 1, 'page_view se neposílá dvakrát');

  // Odvolání
  cookies.set('_ga', 'GA1.1.1');
  cookies.set('_ga_TEST000000', 'GS1.1');
  cookies.set('other', 'keep');
  consent.setProductAnalyticsConsent(false);
  ga.revokeGoogleAnalytics(id);
  assert.equal(consent.getGoogleAnalyticsConsent(), 'denied');
  assert.equal(localStorage.getItem(consent.GOOGLE_ANALYTICS_CONSENT_STORAGE_KEY), null);
  assert.equal((window as unknown as Record<string, unknown>)[`ga-disable-${id}`], true);
  assert.ok(!cookies.has('_ga') && !cookies.has('_ga_TEST000000'));
  assert.ok(cookies.has('other'));
  assert.ok(deletedCookieWrites.some((w) => w.includes('domain=.smlouvahned.cz')));
  const last = [...(window as unknown as { dataLayer: IArguments[] }).dataLayer.at(-1)!];
  assert.deepEqual(last, ['consent', 'update', { analytics_storage: 'denied' }]);

  // Neplatné ID se do URL skriptu nedostane.
  assert.equal(head.length, 1);
  ga.enableGoogleAnalytics('G-1"><script>');
  assert.equal(head.length, 1);
  console.log('google-analytics-consent (G-TEST000000): OK');
}

async function main() {
  if (process.argv.includes('--without-id')) {
    delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    await runWithoutMeasurementId();
    return;
  }
  const child = spawnSync(process.execPath, [...process.execArgv, process.argv[1], '--without-id'], {
    stdio: 'inherit',
    env: { ...process.env, NEXT_PUBLIC_GA_MEASUREMENT_ID: '' },
  });
  assert.equal(child.status, 0, 'varianta bez měřicího ID selhala');
  await runWithMeasurementId();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
