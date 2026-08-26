/**
 * Monetizace 2.0 — kontextové nabídky, post-payment nabídky a feature flagy.
 *
 * Hlídá především to, co by se v produkci projevilo až chybou u zákazníka:
 * nabídku vedoucí na vypnutý produkt, cenu opsanou natvrdo mimo ceník
 * a partnerskou nabídku zobrazenou bez cílové URL nebo bez označení.
 */
import assert from 'node:assert/strict';
import {
  attributionViewMatchesSource,
  analyticsAttributionEventParams,
  normalizeCheckoutAnalyticsAttribution,
  normalizeConsentedCheckoutAnalyticsAttribution,
  normalizeStoredCheckoutAnalyticsAttribution,
} from '../lib/analytics-attribution';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ANALYTICS_EVENT_NAMES } from '../lib/analytics';
import { PRICING_TIER_CONFIG } from '../lib/pricing';
import { getAvailableThematicPackages, THEMATIC_PACKAGE_CONFIG } from '../lib/packages';
// Oba moduly čtou flagy i konfiguraci až při volání, takže stačí načíst je jednou.
import { buildPartnerContext } from '../lib/partners/context';
import { getEligiblePartnerOffers } from '../lib/partners/catalog';
import { PARTNER_CONTEXT_KEYS, type PartnerContext } from '../lib/partners/types';
import { getContextualOffer } from '../lib/marketing/contextual-offers';
import {
  formatConsentTimestamp,
  getFulfilmentContractName,
  getFulfilmentEmailCopy,
} from '../lib/i18n/fulfilment-email';
import {
  getPackageAppendixNotice,
  getPackageUpsellCopy,
} from '../lib/i18n/package-upsell';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
/** Oddělovač řádků jako konstanta — v šablonách testů se snadno rozbije escapování. */
const NEWLINE = String.fromCharCode(10);

function resetFlags() {
  delete process.env.NEXT_PUBLIC_FEATURE_ZAKAZKA_PLUS;
  delete process.env.NEXT_PUBLIC_FEATURE_CAR_SALE_COMPLETE;
  delete process.env.NEXT_PUBLIC_FEATURE_LANDLORD_ANNUAL;
  for (const key of Object.keys(process.env)) {
    if (key.startsWith('PARTNER_')) delete process.env[key];
  }
}

function partnerContext(overrides: Partial<PartnerContext> = {}): PartnerContext {
  return {
    contractType: 'lease',
    documentTier: 'basic',
    locale: 'cs',
    country: 'CZ',
    transactionCategory: 'residential_lease',
    userRole: 'unknown',
    valueBand: 'unknown',
    customerType: 'unknown',
    monetizationMode: 'paid',
    paid: true,
    completed: true,
    ...overrides,
  };
}

function testOffersStayHiddenWithoutConfig() {
  resetFlags();
  assert.deepEqual(
    getEligiblePartnerOffers(partnerContext({ contractType: 'car_sale', transactionCategory: 'vehicle_used' })),
    [],
    'no offer may render while every flag is off',
  );

  // Zapnutý flag bez cílové URL nesmí zobrazit nefunkční nabídku.
  process.env.PARTNER_ENGINE_ENABLED = 'true';
  process.env.PARTNER_SIGNI_ENABLED = 'true';
  assert.deepEqual(
    getEligiblePartnerOffers(partnerContext()),
    [],
    'a flag without a destination URL must not render an offer',
  );

  // Relativní nebo nešifrovaný odkaz je odmítnut.
  process.env.PARTNER_SIGNI_URL = '/interni/analytics';
  assert.deepEqual(getEligiblePartnerOffers(partnerContext()), [], 'relative URL must be rejected');

  process.env.PARTNER_SIGNI_URL = 'http://signi.com';
  assert.deepEqual(getEligiblePartnerOffers(partnerContext()), [], 'plain http URL must be rejected');

  process.env.PARTNER_SIGNI_URL = 'https://signi.com.evil.test/';
  assert.deepEqual(getEligiblePartnerOffers(partnerContext()), [], 'look-alike domain must be rejected');

  process.env.PARTNER_SIGNI_URL = 'https://signi.com/?email=pii@example.test';
  assert.deepEqual(getEligiblePartnerOffers(partnerContext()), [], 'unapproved query must be rejected');
}

function testOfferTargeting() {
  resetFlags();
  process.env.PARTNER_ENGINE_ENABLED = 'true';
  process.env.PARTNER_SIGNI_ENABLED = 'true';
  process.env.PARTNER_SIGNI_URL = 'https://signi.com/produkt/';
  process.env.PARTNER_CEBIA_ENABLED = 'true';
  process.env.PARTNER_CEBIA_URL = 'https://www.cebia.cz/';
  process.env.PARTNER_CEBIA_IS_AFFILIATE = 'true';

  const forLease = getEligiblePartnerOffers(partnerContext()).map((offer) => offer.id);
  assert.deepEqual(forLease, ['signi_esign'], 'vehicle offer must not appear on a lease');

  const unknownCar = getEligiblePartnerOffers(partnerContext({
    contractType: 'car_sale', transactionCategory: 'vehicle_used', userRole: 'unknown',
  })).map((offer) => offer.id);
  assert.deepEqual(unknownCar, ['signi_esign'], 'vehicle offer must fail closed when the buyer role is unknown');

  const forCar = getEligiblePartnerOffers(partnerContext({
    contractType: 'car_sale', transactionCategory: 'vehicle_used', userRole: 'buyer',
  })).map((offer) => offer.id);
  assert.deepEqual(forCar.sort(), ['cebia_vehicle_history', 'signi_esign']);

  const vehicleOffer = getEligiblePartnerOffers(partnerContext({
    contractType: 'car_sale', transactionCategory: 'vehicle_used', userRole: 'buyer',
  }))
    .find((offer) => offer.id === 'cebia_vehicle_history');
  assert.ok(vehicleOffer);
  assert.equal(vehicleOffer.isAffiliate, true, 'paid partner link must be flagged as affiliate');
  assert.ok(vehicleOffer.disclosure, 'partner offer must carry a disclosure sentence');

  const esignOffer = getEligiblePartnerOffers(partnerContext())[0];
  assert.equal(
    esignOffer.isAffiliate,
    false,
    'offer without the affiliate flag must not be labelled as one',
  );

  // Expat kupující nesmí dostat českou nabídku v anglickém ani ukrajinském UI.
  for (const locale of ['en'] as const) {
    const localized = getEligiblePartnerOffers(partnerContext({
      contractType: 'car_sale', transactionCategory: 'vehicle_used', userRole: 'buyer', locale,
    }));
    assert.equal(localized.length, 1, `${locale}: supported offers must resolve`);
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

  assert.deepEqual(
    getEligiblePartnerOffers(partnerContext({ locale: 'ua' })),
    [],
    'unsupported locale must fail closed',
  );

  resetFlags();
}

function testPartnerContextIsCategoricalAndConstructionIsRelevant() {
  resetFlags();
  const context = buildPartnerContext({
    contractType: 'work_contract',
    documentTier: 'complete',
    locale: 'cs',
    packageKey: 'work_order',
    rawContractData: {
      partnerUserRole: 'customer',
      workTitle: 'Rekonstrukce střechy',
      workDescription: 'Citlivý volný text se nesmí přenést.',
      priceAmount: '350 000 Kč',
      deliveryEmail: 'pii@example.test',
      clientName: 'Jan Příklad',
      unexpected: 'secret',
    },
    paid: true,
    completed: true,
  });
  assert.ok(context);
  assert.deepEqual(Object.keys(context).sort(), [...PARTNER_CONTEXT_KEYS].sort());
  assert.equal(context.transactionCategory, 'construction_reconstruction');
  assert.equal(context.userRole, 'customer');
  assert.equal(context.valueBand, '250k_500k');
  assert.equal(JSON.stringify(context).includes('pii@example.test'), false);
  assert.equal(JSON.stringify(context).includes('Jan Příklad'), false);
  assert.equal(JSON.stringify(context).includes('Citlivý'), false);

  process.env.PARTNER_ENGINE_ENABLED = 'true';
  process.env.PARTNER_PLANSTAVBY_ENABLED = 'true';
  const offers = getEligiblePartnerOffers(context);
  assert.deepEqual(offers.map((offer) => offer.id), ['planstavby_budget']);
  const url = new URL(offers[0].href);
  assert.equal(url.searchParams.get('utm_source'), 'smlouvahned');
  assert.equal(url.searchParams.get('utm_medium'), 'cross_sell');
  assert.equal(url.searchParams.get('utm_campaign'), 'work_contract');
  assert.equal(url.searchParams.has('email'), false);
  assert.deepEqual(
    getEligiblePartnerOffers({ ...context, paid: false }).map((offer) => offer.id),
    ['planstavby_budget'],
    'completed free documents may use the same privacy-safe next-step engine',
  );
  assert.deepEqual(getEligiblePartnerOffers({ ...context, completed: false }), [], 'unfinished documents have no offers');
  assert.equal(
    getEligiblePartnerOffers({ ...context, transactionCategory: 'business_services' }).length,
    0,
    'irrelevant work contracts must not receive the construction cross-sell',
  );
  resetFlags();
}

function testRequiredRoleEligibilityMatrix() {
  resetFlags();
  process.env.PARTNER_ENGINE_ENABLED = 'true';
  process.env.PARTNER_CEBIA_ENABLED = 'true';
  process.env.PARTNER_CEBIA_URL = 'https://www.cebia.cz/';
  process.env.PARTNER_CEBIA_IS_AFFILIATE = 'true';
  process.env.PARTNER_USETRENO_TENANT_INSURANCE_ENABLED = 'true';
  process.env.PARTNER_USETRENO_TENANT_INSURANCE_URL = 'https://www.usetreno.cz/';
  process.env.PARTNER_USETRENO_LANDLORD_INSURANCE_ENABLED = 'true';
  process.env.PARTNER_USETRENO_LANDLORD_INSURANCE_URL = 'https://www.usetreno.cz/';
  process.env.PARTNER_PLANSTAVBY_ENABLED = 'true';
  process.env.PARTNER_IDOKLAD_ENABLED = 'true';
  process.env.PARTNER_IDOKLAD_URL = 'https://www.idoklad.cz/';
  process.env.PARTNER_SLONEEK_ENABLED = 'true';
  process.env.PARTNER_SLONEEK_URL = 'https://www.sloneek.com/';

  const ids = (context: PartnerContext) => getEligiblePartnerOffers(context).map((offer) => offer.id);
  assert.ok(ids(partnerContext({ contractType: 'car_sale', transactionCategory: 'vehicle_used', userRole: 'buyer' })).includes('cebia_vehicle_history'));
  assert.equal(ids(partnerContext({ contractType: 'car_sale', transactionCategory: 'vehicle_used', userRole: 'seller' })).includes('cebia_vehicle_history'), false);
  assert.ok(ids(partnerContext({ contractType: 'lease', transactionCategory: 'residential_lease', userRole: 'tenant' })).includes('usetreno_tenant_insurance'));
  assert.equal(ids(partnerContext({ contractType: 'lease', transactionCategory: 'residential_lease', userRole: 'tenant' })).includes('usetreno_landlord_insurance'), false);
  assert.ok(ids(partnerContext({ contractType: 'lease', transactionCategory: 'residential_lease', userRole: 'landlord' })).includes('usetreno_landlord_insurance'));
  assert.ok(ids(partnerContext({ contractType: 'work_contract', transactionCategory: 'construction_new_build', userRole: 'customer' })).includes('planstavby_budget'));
  assert.ok(ids(partnerContext({ contractType: 'work_contract', transactionCategory: 'construction_other', userRole: 'contractor', customerType: 'business' })).includes('idoklad_invoicing'));
  assert.ok(ids(partnerContext({ contractType: 'employment', transactionCategory: 'employment', userRole: 'employer', customerType: 'business' })).includes('sloneek_hr'));
  assert.equal(ids(partnerContext({ contractType: 'employment', transactionCategory: 'employment', userRole: 'employee' })).includes('sloneek_hr'), false);

  const unknownRiskSpecific = ids(partnerContext({ contractType: 'car_sale', transactionCategory: 'vehicle_used', userRole: 'unknown' }));
  assert.deepEqual(unknownRiskSpecific, [], 'unknown role must not receive a role-specific offer');
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

/**
 * Stránky nesmí vykreslovat surový výčet balíčků.
 *
 * `THEMATIC_PACKAGES` obsahuje i balíčky za vypnutým flagem, takže rozcestník
 * postavený přímo nad ním vytvoří klikatelný odkaz na stránku, která vrací 404.
 * Přesně to se jednou stalo na homepage. Renderovací vrstva proto musí sáhnout
 * po `getAvailableThematicPackages()`.
 */
function testPagesNeverRenderDisabledPackages() {
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
      if (!/\bTHEMATIC_PACKAGES\b/.test(source)) continue;
      offenders.push(relative(ROOT, path).replace(/\\/g, '/'));
    }
  }

  walk(join(ROOT, 'app'));

  assert.deepEqual(
    offenders,
    [],
    'these files iterate THEMATIC_PACKAGES and would link to disabled products; ' +
      `use getAvailableThematicPackages() instead:\n${offenders.join('\n')}`,
  );

  // A pojistka na chování: s vypnutým flagem výčet balíček nesmí obsahovat.
  resetFlags();
  assert.equal(
    getAvailableThematicPackages().some((pkg) => pkg.key === 'work_order'),
    false,
    'disabled package must not appear in the offered list',
  );
  // Odkazy na balíčky vedou vždy na existující stránku.
  for (const pkg of getAvailableThematicPackages()) {
    assert.ok(
      existsSync(join(ROOT, 'app', pkg.slug, 'page.tsx')),
      `package ${pkg.key} links to /${pkg.slug}, but that page does not exist`,
    );
  }
}

/**
 * Builder nesmí slibovat placený příplatek, který v checkoutu neexistuje.
 *
 * Formulář smlouvy o dílo nabízel „Chci notářsky ověřené podpisy (+200 Kč)“.
 * Žádný takový add-on nikdy neexistoval: server cenu neúčtoval, dokument se
 * nezměnil a notářské ověření je offline úkon, který web neposkytuje.
 * Zákazník tedy zaškrtl placenou právní službu, kterou nikdy nedostal.
 *
 * Pravidlo: ceny doplňků se do UI dostávají výhradně z `CHECKOUT_ADDON_CONFIG`
 * (`priceLabel`). Literálně napsaný příplatek ve stránce znamená buď neexistující
 * službu, nebo cenu, která se rozejde s ceníkem.
 */
function testNoBuilderAdvertisesUnavailableSurcharge() {
  const surcharge = /\+\s?\d{2,4}\s?Kč/;
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
      source.split('\n').forEach((line, index) => {
        if (!surcharge.test(line)) return;
        if (/^\s*(?:\/\/|\*|\/\*)/.test(line)) return;
        offenders.push(
          `${relative(ROOT, path).replace(/\\/g, '/')}:${index + 1}: ${line.trim().slice(0, 110)}`,
        );
      });
    }
  }

  walk(join(ROOT, 'app'));

  assert.deepEqual(
    offenders,
    [],
    'a surcharge is written literally into the UI instead of coming from ' +
      `CHECKOUT_ADDON_CONFIG — it may not correspond to any real add-on:\n${offenders.join('\n')}`,
  );

  // Žádná varianta notářského ověření se zákazníkovi nenabízí jako placená služba.
  // Bez \w — ten v JS nematchuje diakritiku, takže „ověřené" by propadlo.
  const notary = /notá[řr]sk\S*\s+ov[ěe][řr]en\S*\s+podpis/i;
  const notaryOffenders: string[] = [];
  function walkNotary(dir: string) {
    for (const entry of readdirSync(dir)) {
      const path = join(dir, entry);
      if (statSync(path).isDirectory()) {
        // Blog smí o notářském ověření věcně informovat; nabízet ho nesmí builder.
        if (entry === 'blog') continue;
        walkNotary(path);
        continue;
      }
      if (!/\.tsx?$/.test(entry)) continue;
      const source = readFileSync(path, 'utf8');
      source.split('\n').forEach((line, index) => {
        if (notary.test(line) && /checkbox|\(\+|Chci /i.test(line)) {
          notaryOffenders.push(`${relative(ROOT, path).replace(/\\/g, '/')}:${index + 1}`);
        }
      });
    }
  }
  walkNotary(join(ROOT, 'app'));

  assert.deepEqual(
    notaryOffenders,
    [],
    `no builder may offer notarised signatures as a purchasable option:\n${notaryOffenders.join('\n')}`,
  );
}

/**
 * Potvrzovací e-mail musí být v jazyce, ve kterém zákazník nakupoval.
 * Doklad o souhlasu s okamžitým dodáním digitálního obsahu musí zůstat
 * ve všech jazycích věcně stejný — je to zákonná náležitost, ne marketing.
 */
function testFulfilmentEmailIsLocalized() {
  const czechChars = /[ěščřžýáíéůúťďň]/i;
  const cyrillic = /[Ѐ-ӿ]/;

  const cs = getFulfilmentEmailCopy('cs');
  assert.equal(cs.htmlLang, 'cs');
  assert.match(cs.subject('X'), /připraven/);

  const en = getFulfilmentEmailCopy('en');
  assert.equal(en.htmlLang, 'en');
  for (const [label, text] of Object.entries({
    subject: en.subject('Czech rental agreement'),
    heading: en.heading,
    downloadPdf: en.downloadPdf,
    portal: en.portal,
    expiry: en.expiry(30),
    footer: en.footer,
    consent: en.consent('1. 1. 2026', '2026-07-15', '2026-07-15'),
  })) {
    assert.equal(czechChars.test(text), false, `EN e-mail ${label} still contains Czech: ${text}`);
  }

  const ua = getFulfilmentEmailCopy('ua');
  assert.equal(ua.htmlLang, 'uk');
  assert.ok(cyrillic.test(ua.heading), 'UA e-mail heading must be Ukrainian');
  assert.ok(cyrillic.test(ua.downloadPdf), 'UA download CTA must be Ukrainian');
  assert.ok(cyrillic.test(ua.consent('1.1.2026', 'a', 'b')), 'UA consent record must be Ukrainian');

  // Doklad o souhlasu musí ve všech jazycích nést verze podmínek.
  for (const locale of ['cs', 'en', 'ua'] as const) {
    const text = getFulfilmentEmailCopy(locale).consent('DATUM', 'T-1', 'P-1');
    assert.ok(text.includes('DATUM'), `${locale}: consent must include the timestamp`);
    assert.ok(text.includes('T-1') && text.includes('P-1'), `${locale}: consent must include versions`);
  }

  // Neznámé locale spadne na češtinu.
  assert.equal(getFulfilmentEmailCopy('de').htmlLang, 'cs');
  assert.equal(getFulfilmentContractName('lease', 'de'), 'Nájemní smlouva');

  // Název dokumentu existuje pro všech 14 typů ve všech jazycích.
  const types = ['lease','car_sale','gift','work_contract','loan','nda','general_sale',
    'employment','dpp','service','sublease','power_of_attorney','debt_acknowledgment','cooperation'];
  for (const locale of ['cs', 'en', 'ua'] as const) {
    for (const t of types) {
      const name = getFulfilmentContractName(t, locale);
      assert.notEqual(name, 'Legal document', `${locale}/${t} fell back to the generic name`);
      assert.notEqual(name, 'Právní dokument', `${locale}/${t} fell back to the generic name`);
    }
  }

  assert.ok(formatConsentTimestamp('2026-08-11T10:00:00.000Z', 'en').length > 0);
}

/**
 * Nabídka balíčku v cizojazyčném builderu.
 *
 * Upsell blok s CTA je aktivní nabídka, i když balíček není propagován na
 * `/en` ani `/ua`. Nesmí být česky a musí u něj zaznít, že přílohy balíčku
 * jsou pouze české — dřív než zákazník vstoupí do placeného toku.
 */
function testPackageUpsellIsLocalized() {
  const czechChars = /[ěščřžýáíéůúťďň]/i;
  const cyrillic = /[Ѐ-ӿ]/;

  // Balíčky nabízené cizojazyčnému zákazníkovi nesmí mít český text.
  for (const key of ['vehicle_sale', 'employer_start'] as const) {
    const en = getPackageUpsellCopy(key, 'en');
    assert.ok(en, `${key} must be offered in EN`);
    // „Kč" je měna, ne český text — zůstává i v cizojazyčné verzi.
    // „Zaměstnavatel Start 2026" je název produktu, ten se také nepřekládá.
    const withoutCurrency = (text: string) => text.replace(/Kč/g, '').replace(/Zaměstnavatel Start/g, '');
    for (const [field, text] of Object.entries({ badge: en.badge, body: en.body, cta: en.cta })) {
      assert.equal(
        czechChars.test(withoutCurrency(text)),
        false,
        `EN upsell ${key}.${field} still contains Czech: ${text}`,
      );
    }
    assert.ok(en.appendixNotice, `${key}: EN must disclose the language of package appendices`);
    assert.match(en.appendixNotice, /Czech/i);

    const ua = getPackageUpsellCopy(key, 'ua');
    assert.ok(ua, `${key} must be offered in UA`);
    assert.ok(cyrillic.test(ua.badge), `UA upsell ${key}.badge must be Ukrainian`);
    assert.ok(cyrillic.test(ua.body), `UA upsell ${key}.body must be Ukrainian`);
    assert.ok(cyrillic.test(ua.cta), `UA upsell ${key}.cta must be Ukrainian`);
    assert.ok(cyrillic.test(ua.appendixNotice), `${key}: UA disclosure must be Ukrainian`);
  }

  // Zakázka Plus je česky-only produkt a v cizím jazyce se nesmí nabídnout.
  assert.ok(getPackageUpsellCopy('work_order', 'cs'), 'work_order must be offered in Czech');
  assert.equal(
    getPackageUpsellCopy('work_order', 'en'),
    null,
    'work_order is a Czech-only product and must not be offered in EN',
  );
  assert.equal(
    getPackageUpsellCopy('work_order', 'ua'),
    null,
    'work_order is a Czech-only product and must not be offered in UA',
  );

  // V češtině se upozornění na jazyk příloh nezobrazuje — čeština je očekávaná.
  assert.equal(getPackageAppendixNotice('cs'), '');
  assert.ok(getPackageAppendixNotice('en'));
  assert.ok(getPackageAppendixNotice('ua'));
  // Neznámé locale spadne na češtinu.
  assert.equal(getPackageAppendixNotice('de'), '');

  // Ceny v nabídce se berou z ceníku, ne z natvrdo psaného textu.
  const enVehicle = getPackageUpsellCopy('vehicle_sale', 'en');
  assert.ok(enVehicle);
  assert.ok(
    enVehicle.body.includes(THEMATIC_PACKAGE_CONFIG.vehicle_sale.priceLabel),
    'the EN upsell must quote the price from the price list',
  );
}

/**
 * Buildery nesmí mít nabídku balíčku napsanou natvrdo — jinak se cizojazyčnému
 * zákazníkovi zobrazí česky, jak se stalo na /auto?lang=en.
 */
function testBuildersDoNotHardcodePackageUpsell() {
  const offenders: string[] = [];
  const builders = [
    'app/auto/page.tsx',
    'app/pracovni/page.tsx',
    'app/najem/page.tsx',
    'app/smlouva-o-dilo/page.tsx',
  ];
  // Věty, které dřív stály natvrdo v JSX cizojazyčně dosažitelných builderů.
  const hardcoded = /V tomto formuláři volíte|Zobrazit balíček →|Zobrazit obsah balíčku →|Nový personální balíček/;

  for (const file of builders) {
    const source = readFileSync(join(ROOT, file), 'utf8');
    source.split(NEWLINE).forEach((line, index) => {
      if (hardcoded.test(line) && !/^\s*(?:\/\/|\*)/.test(line)) {
        offenders.push(`${file}:${index + 1}: ${line.trim().slice(0, 90)}`);
      }
    });
  }

  assert.deepEqual(
    offenders,
    [],
    'package upsell copy must come from lib/i18n, not be hardcoded in the builder:' +
      NEWLINE + offenders.join(NEWLINE),
  );
}

function testAnalyticsEventsRegistered() {
  const required = [
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
    'partner_lead_succeeded',
    'partner_lead_failed',
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

function testPrivacySafeRevenueAttribution() {
  const now = Date.parse('2026-08-26T12:00:00.000Z');
  const validInput = {
    trafficSource: 'blog_article',
    articleSlug: 'kupni-smlouva-na-auto-2026',
    landingPage: '/blog/kupni-smlouva-na-auto-2026',
    capturedAt: '2026-08-26T11:45:00.000Z',
  };
  const valid = normalizeCheckoutAnalyticsAttribution(validInput, now);
  assert.deepEqual(valid, validInput);
  assert.equal(
    normalizeConsentedCheckoutAnalyticsAttribution(false, validInput, now),
    null,
    'a valid acquisition payload must be discarded when analytics consent is absent',
  );
  assert.deepEqual(
    normalizeConsentedCheckoutAnalyticsAttribution(true, validInput, now),
    validInput,
    'consented fresh acquisition attribution should be normalized',
  );
  assert.deepEqual(analyticsAttributionEventParams(valid), {
    traffic_source: 'blog_article',
    article_slug: 'kupni-smlouva-na-auto-2026',
    acquisition_page: '/blog/kupni-smlouva-na-auto-2026',
  });
  assert.equal(attributionViewMatchesSource('blog_article_view', 'blog_article'), true);
  assert.equal(attributionViewMatchesSource('package_page_view', 'package_page'), true);
  assert.equal(attributionViewMatchesSource('situation_page_view', 'situation_page'), true);
  assert.equal(attributionViewMatchesSource('seo_landing_view', 'seo_landing'), true);
  assert.equal(attributionViewMatchesSource('homepage_view', 'homepage'), true);
  assert.equal(attributionViewMatchesSource('builder_view', 'builder_landing'), true);
  assert.equal(
    attributionViewMatchesSource('package_page_view', 'blog_article'),
    false,
    'a package view must not be credited to a previously stored blog attribution',
  );
  assert.equal(
    normalizeCheckoutAnalyticsAttribution({
      ...validInput,
      articleSlug: 'different-article',
    }, now),
    null,
    'article slug must identify the attributed blog landing',
  );
  assert.equal(
    normalizeCheckoutAnalyticsAttribution({ ...validInput, capturedAt: '2026-08-26T11:29:59.000Z' }, now),
    null,
    'client attribution older than 30 minutes must expire',
  );
  assert.ok(
    normalizeStoredCheckoutAnalyticsAttribution(
      { ...validInput, capturedAt: '2026-08-26T11:29:59.000Z' },
      now,
    ),
    'a draft normalized at checkout must remain attributable after a longer Stripe session',
  );
  assert.ok(normalizeCheckoutAnalyticsAttribution({
    trafficSource: 'homepage',
    landingPage: '/',
    capturedAt: validInput.capturedAt,
  }, now));
  assert.ok(normalizeCheckoutAnalyticsAttribution({
    trafficSource: 'builder_landing',
    landingPage: '/auto',
    capturedAt: validInput.capturedAt,
  }, now));
  assert.deepEqual(normalizeCheckoutAnalyticsAttribution({
    trafficSource: 'blog_article',
    articleSlug: 'expat/minimum-wage-dpp-czech-republic-2026-en',
    landingPage: '/blog/expat/minimum-wage-dpp-czech-republic-2026-en',
    capturedAt: validInput.capturedAt,
  }, now), {
    trafficSource: 'blog_article',
    articleSlug: 'expat/minimum-wage-dpp-czech-republic-2026-en',
    landingPage: '/blog/expat/minimum-wage-dpp-czech-republic-2026-en',
    capturedAt: validInput.capturedAt,
  });
  assert.equal(normalizeCheckoutAnalyticsAttribution({
    trafficSource: 'builder_landing',
    landingPage: '/interni/analytics',
    capturedAt: validInput.capturedAt,
  }, now), null);
  for (const landingPage of [
    '/customer@example.test',
    '/blog/article?email=customer@example.test',
    '/blog/article%40customer',
    '/api/checkout',
  ]) {
    assert.equal(
      normalizeCheckoutAnalyticsAttribution({
        trafficSource: 'seo_landing',
        landingPage,
        capturedAt: validInput.capturedAt,
      }, now),
      null,
      `unsafe acquisition page accepted: ${landingPage}`,
    );
  }

  const checkout = readFileSync(join(ROOT, 'app/api/checkout/route.ts'), 'utf8');
  const webhook = readFileSync(join(ROOT, 'app/api/stripe/webhook/route.ts'), 'utf8');
  const reporting = readFileSync(join(ROOT, 'lib/analytics-reporting.ts'), 'utf8');
  const trackView = readFileSync(join(ROOT, 'app/components/analytics/TrackView.tsx'), 'utf8');
  const analyticsClient = readFileSync(join(ROOT, 'lib/analytics.ts'), 'utf8');
  const attributionClient = readFileSync(join(ROOT, 'lib/analytics-attribution.ts'), 'utf8');
  const cookiesBanner = readFileSync(join(ROOT, 'app/components/CookiesBanner.tsx'), 'utf8');
  assert.match(checkout, /normalizeConsentedCheckoutAnalyticsAttribution\(/);
  assert.match(checkout, /analyticsAttributionEventParams\(analyticsAttribution\)/);
  assert.match(webhook, /normalizeStoredCheckoutAnalyticsAttribution\(existing\.analyticsAttribution\)/);
  assert.match(reporting, /revenueAttribution/);
  assert.match(reporting, /params\.acquisition_page/);
  assert.match(reporting, /attributionViewMatchesSource\(event\.event, attributedRevenue\.trafficSource\)/);
  assert.match(trackView, /eventName === 'package_page_view'/);
  assert.match(trackView, /eventName === 'situation_page_view'/);
  assert.ok(
    trackView.indexOf('rememberTrafficAttributionIfEmpty({') < trackView.indexOf('trackEvent(eventName'),
    'package and situation attribution must be stored before their view event is sent',
  );
  assert.match(analyticsClient, /!isProductAnalyticsConsentGranted\(\)/);
  assert.match(attributionClient, /PRODUCT_ANALYTICS_CONSENT_STORAGE_KEY/);
  assert.match(attributionClient, /if \(!granted\) clearTrafficAttribution\(\)/);
  assert.match(cookiesBanner, /Povolit měření/);
  assert.match(cookiesBanner, /Jen nezbytné/);
  assert.match(reporting, /MAX_STORED_ANALYTICS_EVENTS - 1/);
  assert.match(reporting, /partnerConversionsKnown/);
  assert.match(reporting, /partnerImpressions/);
  assert.doesNotMatch(checkout, /sh_journey_id|journeyId|journey_id/);
  assert.doesNotMatch(webhook, /metadata\?\.(?:traffic|landing|article)/i);

  const builders = [
    'auto', 'darovaci', 'dpp', 'kupni', 'najem', 'nda', 'plna-moc',
    'podnajem', 'pracovni', 'pujcka', 'sluzby', 'smlouva-o-dilo',
    'spoluprace', 'uznani-dluhu',
  ];
  for (const builder of builders) {
    const source = readFileSync(join(ROOT, 'app', builder, 'page.tsx'), 'utf8');
    assert.match(
      source,
      /analyticsAttribution:\s*authorization\.analyticsAttribution/,
      `${builder} checkout must propagate safe acquisition attribution`,
    );
    assert.match(
      source,
      /analyticsConsentGranted:\s*authorization\.analyticsConsentGranted/,
      `${builder} checkout must propagate explicit analytics consent independently of attribution freshness`,
    );
  }

  const partnerNextSteps = readFileSync(
    join(ROOT, 'app/components/partners/PartnerNextSteps.tsx'),
    'utf8',
  );
  assert.match(partnerNextSteps, /ORDER_SCOPED_TRACKING\s*=\s*\{\s*inheritAttribution:\s*false\s*\}/);
  assert.match(partnerNextSteps, /trackEvent\('partner_offer_clicked',[\s\S]*ORDER_SCOPED_TRACKING\)/);
}

function testDownloadsAreRecordedOnlyAfterSuccessfulRender() {
  const paid = readFileSync(join(ROOT, 'app/api/contracts/download/route.ts'), 'utf8');
  const free = readFileSync(join(ROOT, 'app/api/contracts/free/download/route.ts'), 'utf8');
  assert.ok(
    paid.indexOf('await renderContractDocx(fullData)') < paid.indexOf('const nextDownloadCount = await nextDownloadSequence'),
    'paid DOCX must render before the download counter changes',
  );
  assert.ok(
    paid.indexOf('await renderContractPdf(fullData)') < paid.indexOf('const nextDownloadCount = await nextDownloadSequence'),
    'paid PDF must render before the download counter changes',
  );
  assert.ok(
    free.indexOf('await renderContractPdf(record.payload)') < free.indexOf("recordAnalyticsEvent('free_document_downloaded'"),
    'free PDF must render before its download event is recorded',
  );
}

function testBuilderCompletionRequiresServerAcceptance() {
  const modal = readFileSync(join(ROOT, 'app/components/PaymentModal.tsx'), 'utf8');
  const checkout = readFileSync(join(ROOT, 'app/api/checkout/route.ts'), 'utf8');
  const freeCreate = readFileSync(join(ROOT, 'app/api/contracts/free/route.ts'), 'utf8');
  assert.doesNotMatch(
    modal,
    /trackEvent\('builder_completed'/,
    'the checkout modal must not report completion before server validation',
  );
  assert.match(checkout, /recordAnalyticsEvent\('builder_completed'/);
  assert.match(freeCreate, /recordAnalyticsEvent\('builder_completed'/);
  assert.match(
    checkout,
    /if \(!isCheckoutAudit && analyticsConsentGranted\) \{\s*await recordAnalyticsEvent\('builder_completed'/,
    'paid completion analytics must require explicit consent even when attribution has expired',
  );
  assert.match(
    freeCreate,
    /if \(analyticsConsentGranted\) \{\s*await Promise\.all/,
    'free completion analytics must require explicit consent even when attribution has expired',
  );

  const webhook = readFileSync(join(ROOT, 'app/api/stripe/webhook/route.ts'), 'utf8');
  const paidDownload = readFileSync(join(ROOT, 'app/api/contracts/download/route.ts'), 'utf8');
  const freeDownload = readFileSync(join(ROOT, 'app/api/contracts/free/download/route.ts'), 'utf8');
  const paidStatus = readFileSync(join(ROOT, 'app/api/contracts/status/route.ts'), 'utf8');
  assert.match(webhook, /if \(analyticsConsentGranted\) \{\s*await recordPaidCheckoutAnalytics/);
  assert.match(paidDownload, /if \(draft\.analyticsConsentGranted === true\) \{\s*await recordAnalyticsEvent\('document_downloaded'/);
  assert.match(freeDownload, /if \(record\.analyticsConsentGranted === true\) \{\s*await recordAnalyticsEvent\('free_document_downloaded'/);
  assert.match(checkout, /monetizationMode:\s*monetizationPolicy\.mode/);
  assert.match(checkout, /experimentId,/);
  assert.match(checkout, /experimentVariant,/);
  assert.match(webhook, /experiment_id:\s*options\.experimentId/);
  assert.match(webhook, /variant:\s*options\.experimentVariant/);
  assert.match(paidDownload, /experiment_id:\s*draft\.experimentId/);
  assert.match(paidDownload, /variant:\s*draft\.experimentVariant/);
  assert.match(paidStatus, /monetizationMode:\s*verifiedDraft\?\.monetizationMode/);
}

function testPrioritySeoArticlesTrackProductCtas() {
  const articles = [
    ['app/blog/dpp-dohoda-provedeni-prace/page.tsx', '/dpp'],
    ['app/blog/kupni-smlouva-na-auto-2026/page.tsx', '/auto'],
    ['app/blog/smlouva-o-sluzbach-2026/page.tsx', '/sluzby'],
    ['app/blog/smlouva-o-zapujcce-2026/page.tsx', '/pujcka'],
  ] as const;
  for (const [file, destination] of articles) {
    const source = readFileSync(join(ROOT, file), 'utf8');
    const trackedCtas = source.match(/eventName="blog_cta_click"/g)?.length ?? 0;
    assert.ok(trackedCtas >= 3, `${file} must track its prominent product CTAs`);
    const escaped = destination.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    assert.doesNotMatch(
      source,
      new RegExp(`<Link\\s+href="${escaped}"`),
      `${file} still has an untracked direct CTA to ${destination}`,
    );
  }
}

/**
 * Do analytiky nesmí prosáknout osobní údaje. Kontroluje se, že nové
 * monetizační komponenty neposílají jména, adresy ani e-maily.
 */
function testNoPiiInMonetizationAnalytics() {
  const files = [
    'app/components/partners/PartnerNextSteps.tsx',
    'app/components/partners/PartnerEditorialOffer.tsx',
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
  testPartnerContextIsCategoricalAndConstructionIsRelevant();
  testRequiredRoleEligibilityMatrix();
  testContextualOffersNeverPointAtDisabledProducts();
  testNoHardcodedPricesInArticles();
  testPagesNeverRenderDisabledPackages();
  testNoBuilderAdvertisesUnavailableSurcharge();
  testFulfilmentEmailIsLocalized();
  testPackageUpsellIsLocalized();
  testBuildersDoNotHardcodePackageUpsell();
  testAnalyticsEventsRegistered();
  testPrivacySafeRevenueAttribution();
  testBuilderCompletionRequiresServerAcceptance();
  testDownloadsAreRecordedOnlyAfterSuccessfulRender();
  testPrioritySeoArticlesTrackProductCtas();
  testNoPiiInMonetizationAnalytics();

  console.log('Monetization audit passed (offers, flags, pricing source, analytics, PII).');
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
