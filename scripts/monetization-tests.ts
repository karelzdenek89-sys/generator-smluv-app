/**
 * Monetizace 2.0 — kontextové nabídky, post-payment nabídky a feature flagy.
 *
 * Hlídá především to, co by se v produkci projevilo až chybou u zákazníka:
 * nabídku vedoucí na vypnutý produkt, cenu opsanou natvrdo mimo ceník
 * a partnerskou nabídku zobrazenou bez cílové URL nebo bez označení.
 */
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ANALYTICS_EVENT_NAMES } from '../lib/analytics';
import { PRICING_TIER_CONFIG } from '../lib/pricing';
import { THEMATIC_PACKAGE_CONFIG } from '../lib/packages';
// Oba moduly čtou flagy i konfiguraci až při volání, takže stačí načíst je jednou.
import { getPostPurchaseOffers } from '../lib/post-purchase-offers';
import { getContextualOffer } from '../lib/marketing/contextual-offers';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function resetFlags() {
  delete process.env.NEXT_PUBLIC_FEATURE_ZAKAZKA_PLUS;
  delete process.env.NEXT_PUBLIC_FEATURE_CAR_SALE_COMPLETE;
  delete process.env.NEXT_PUBLIC_FEATURE_LANDLORD_ANNUAL;
  delete process.env.NEXT_PUBLIC_FEATURE_ESIGN_OFFER;
  delete process.env.NEXT_PUBLIC_FEATURE_VEHICLE_HISTORY_OFFER;
  delete process.env.NEXT_PUBLIC_ESIGN_OFFER_URL;
  delete process.env.NEXT_PUBLIC_VEHICLE_HISTORY_OFFER_URL;
  delete process.env.NEXT_PUBLIC_ESIGN_OFFER_IS_AFFILIATE;
  delete process.env.NEXT_PUBLIC_VEHICLE_HISTORY_OFFER_IS_AFFILIATE;
}

function testOffersStayHiddenWithoutConfig() {
  resetFlags();
  assert.deepEqual(
    getPostPurchaseOffers('car_sale'),
    [],
    'no offer may render while every flag is off',
  );

  // Zapnutý flag bez cílové URL nesmí zobrazit nefunkční nabídku.
  process.env.NEXT_PUBLIC_FEATURE_ESIGN_OFFER = 'true';
  assert.deepEqual(
    getPostPurchaseOffers('lease'),
    [],
    'a flag without a destination URL must not render an offer',
  );

  // Relativní nebo nešifrovaný odkaz je odmítnut.
  process.env.NEXT_PUBLIC_ESIGN_OFFER_URL = '/interni/analytics';
  assert.deepEqual(getPostPurchaseOffers('lease'), [], 'relative URL must be rejected');

  process.env.NEXT_PUBLIC_ESIGN_OFFER_URL = 'http://example.com';
  assert.deepEqual(getPostPurchaseOffers('lease'), [], 'plain http URL must be rejected');
}

function testOfferTargeting() {
  resetFlags();
  process.env.NEXT_PUBLIC_FEATURE_ESIGN_OFFER = 'true';
  process.env.NEXT_PUBLIC_ESIGN_OFFER_URL = 'https://example.com/esign';
  process.env.NEXT_PUBLIC_FEATURE_VEHICLE_HISTORY_OFFER = 'true';
  process.env.NEXT_PUBLIC_VEHICLE_HISTORY_OFFER_URL = 'https://example.com/vin';
  process.env.NEXT_PUBLIC_VEHICLE_HISTORY_OFFER_IS_AFFILIATE = 'true';

  const forLease = getPostPurchaseOffers('lease').map((offer) => offer.id);
  assert.deepEqual(forLease, ['esign'], 'vehicle offer must not appear on a lease');

  const forCar = getPostPurchaseOffers('car_sale').map((offer) => offer.id);
  assert.deepEqual(forCar.sort(), ['esign', 'vehicle_history']);

  const vehicleOffer = getPostPurchaseOffers('car_sale')
    .find((offer) => offer.id === 'vehicle_history');
  assert.ok(vehicleOffer);
  assert.equal(vehicleOffer.isAffiliate, true, 'paid partner link must be flagged as affiliate');
  assert.ok(vehicleOffer.disclosure, 'partner offer must carry a disclosure sentence');

  const esignOffer = getPostPurchaseOffers('lease')[0];
  assert.equal(
    esignOffer.isAffiliate,
    false,
    'offer without the affiliate flag must not be labelled as one',
  );

  // Expat kupující nesmí dostat českou nabídku v anglickém ani ukrajinském UI.
  for (const locale of ['en', 'ua'] as const) {
    const localized = getPostPurchaseOffers('car_sale', locale);
    assert.equal(localized.length, 2, `${locale}: both offers must resolve`);
    for (const offer of localized) {
      assert.ok(offer.title.trim(), `${locale}: ${offer.id} has no title`);
      assert.ok(offer.cta.trim(), `${locale}: ${offer.id} has no CTA`);
      assert.ok(offer.disclosure?.trim(), `${locale}: ${offer.id} has no disclosure`);
      const czechOnly = /[ěščřžýáíéůúťďň]/i;
      assert.equal(
        czechOnly.test(`${offer.title}${offer.cta}`),
        false,
        `${locale}: ${offer.id} still shows Czech copy`,
      );
    }
  }

  resetFlags();
}

function testContextualOffersNeverPointAtDisabledProducts() {
  resetFlags();

  const keys = [
    'work_contract',
    'gift',
    'car_sale',
    'lease',
    'employment',
    'dpp',
    'nda',
    'cooperation',
  ] as const;

  for (const key of keys) {
    const offer = getContextualOffer(key);
    assert.ok(offer.title.trim(), `${key}: missing title`);
    assert.ok(offer.cta.trim(), `${key}: missing CTA`);
    assert.ok(offer.href.startsWith('/'), `${key}: CTA must stay on our own site`);
    assert.ok(offer.price.trim(), `${key}: missing price`);
    // Vypnutá Zakázka Plus nesmí být cílem žádného obsahového CTA.
    assert.doesNotMatch(
      offer.href,
      /package=work_order/,
      `${key}: must not link to a disabled package`,
    );
    // Žádné agresivní ani nepodložené tvrzení.
    assert.doesNotMatch(
      `${offer.title} ${offer.description} ${offer.note ?? ''}`,
      /neprůstřeln|100\s?%|garantujeme|ušetříte tisíce|pouze dnes|akce končí/i,
      `${key}: marketing wording must stay factual`,
    );
  }

  // Se zapnutým flagem už na balíček odkazovat smí.
  process.env.NEXT_PUBLIC_FEATURE_ZAKAZKA_PLUS = 'true';
  const workOffer = getContextualOffer('work_contract');
  assert.match(workOffer.href, /package=work_order/);
  assert.equal(workOffer.price, THEMATIC_PACKAGE_CONFIG.work_order.priceLabel);
  resetFlags();
}

/**
 * Ceny se smí brát jen z ceníku. Natvrdo zapsaná částka v článku by po změně
 * ceníku tiše lhala zákazníkovi ještě před vstupem do checkoutu.
 */
function testNoHardcodedPricesInArticles() {
  const pricePattern = /\b(?:99|199|299|399|599|690)\s?Kč/;
  const offenders: string[] = [];

  function walk(dir: string) {
    for (const entry of readdirSync(dir)) {
      const path = join(dir, entry);
      if (statSync(path).isDirectory()) {
        walk(path);
        continue;
      }
      if (!/\.tsx?$/.test(entry)) continue;
      const source = readFileSync(path, 'utf8');
      for (const line of source.split('\n')) {
        if (!pricePattern.test(line)) continue;
        // Komentáře a dokumentace do výstupu netečou.
        if (/^\s*(?:\/\/|\*|\/\*)/.test(line)) continue;
        // Nabídka smí cenu zobrazit, pokud ji bere z ceníku.
        if (/priceLabel|PRICING_TIER_CONFIG|THEMATIC_PACKAGE_CONFIG|getContextualOffer/.test(line)) {
          continue;
        }
        offenders.push(`${relative(ROOT, path).replace(/\\/g, '/')}: ${line.trim().slice(0, 120)}`);
      }
    }
  }

  walk(join(ROOT, 'lib', 'marketing'));

  assert.deepEqual(
    offenders,
    [],
    `contextual offers must not hardcode prices:\n${offenders.join('\n')}`,
  );

  // Ceník zůstává jediným zdrojem pravdy pro samostatný dokument.
  assert.equal(PRICING_TIER_CONFIG.basic.priceCzk, 99);
  assert.equal(PRICING_TIER_CONFIG.complete.priceCzk, 199);
}

function testAnalyticsEventsRegistered() {
  const required = [
    'content_offer_view',
    'content_offer_click',
    'bundle_selected',
    'post_purchase_offer_view',
    'post_purchase_offer_click',
    'annual_plan_interest',
    // Existující ekvivalent požadovaného `addon_selected`.
    'checkout_addon_selected',
  ];
  for (const event of required) {
    assert.ok(
      (ANALYTICS_EVENT_NAMES as readonly string[]).includes(event),
      `analytics allowlist is missing ${event}`,
    );
  }
}

/**
 * Do analytiky nesmí prosáknout osobní údaje. Kontroluje se, že nové
 * monetizační komponenty neposílají jména, adresy ani e-maily.
 */
function testNoPiiInMonetizationAnalytics() {
  const files = [
    'app/components/PostPurchaseOffers.tsx',
    'app/components/marketing/ContextualProductOffer.tsx',
  ];
  const forbidden =
    /(deliveryEmail|customerEmail|\bemail\b|sellerName|buyerName|clientName|contractorName|employeeName|landlordName|tenantName|Address|birthNumber)/i;

  for (const file of files) {
    const source = readFileSync(join(ROOT, file), 'utf8');
    const trackingLines = source
      .split('\n')
      .filter((line) => forbidden.test(line) && /trackEvent|eventParams/.test(line));
    assert.deepEqual(
      trackingLines,
      [],
      `${file} must not send personal data to analytics:\n${trackingLines.join('\n')}`,
    );
  }
}

function main() {
  testOffersStayHiddenWithoutConfig();
  testOfferTargeting();
  testContextualOffersNeverPointAtDisabledProducts();
  testNoHardcodedPricesInArticles();
  testAnalyticsEventsRegistered();
  testNoPiiInMonetizationAnalytics();

  console.log('Monetization audit passed (offers, flags, pricing source, analytics, PII).');
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
