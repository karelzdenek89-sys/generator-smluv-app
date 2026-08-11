/**
 * Ověření mapování cenových pásem → Stripe Price ID → výstup dokumentu.
 */
import assert from 'node:assert/strict';
import {
  getAvailableThematicPackages,
  getEffectivePriceBand,
  getStripePriceIdForCheckout,
  isThematicPackageAvailable,
  normalizeThematicPackageKeyForContract,
  packageIncludesDocx,
  resolvePurchasablePackageKeyForContract,
  THEMATIC_PACKAGES,
} from '../lib/packages';
import { getAvailableAnnualPlans, isAnnualPlanAvailable } from '../lib/annual-plans';
import { normalizePricingTier } from '../lib/pricing';
import type { PriceBand } from '../lib/analytics';
import {
  getAvailableCheckoutAddons,
  getCheckoutAddonsTotalCzk,
  normalizeCheckoutAddons,
  normalizeAnnexLanguage,
} from '../lib/checkout-addons';
import { resolveTierFeatures } from '../lib/contracts';

function withEnv() {
  process.env.STRIPE_PRICE_ID_BASIC = 'price_basic';
  process.env.STRIPE_PRICE_ID_PREMIUM = 'price_premium';
  process.env.STRIPE_PRICE_ID_COMPLETE = 'price_complete_fallback';
  process.env.STRIPE_PRICE_ID_PACKAGE = 'price_package';
  process.env.STRIPE_PRICE_ID_EMPLOYER_START = 'price_employer_start';
  process.env.STRIPE_PRICE_ID_WORK_ORDER = 'price_work_order';
  // Balíček za flagem musí být v auditu zapnutý, jinak by se testovala
  // pouze jeho nedostupnost.
  process.env.NEXT_PUBLIC_FEATURE_ZAKAZKA_PLUS = 'true';
}

function testStripePriceMapping() {
  assert.equal(getStripePriceIdForCheckout('basic', null), 'price_basic');
  assert.equal(getStripePriceIdForCheckout('complete', null), 'price_premium');
  assert.equal(
    getStripePriceIdForCheckout(normalizePricingTier('professional'), null),
    'price_premium',
  );
  assert.equal(getStripePriceIdForCheckout('complete', 'landlord'), 'price_package');
  assert.equal(getStripePriceIdForCheckout('basic', 'landlord'), 'price_package');
  assert.doesNotMatch(
    getStripePriceIdForCheckout('complete', 'landlord') ?? '',
    /price_premium/,
    '299 Kč package must not use 199 Kč Stripe price',
  );
  assert.equal(
    getStripePriceIdForCheckout('complete', 'employer_start'),
    'price_employer_start',
  );
  assert.notEqual(
    getStripePriceIdForCheckout('complete', 'employer_start'),
    'price_package',
    '599 Kč employer package must use its own Stripe price',
  );
  assert.equal(getEffectivePriceBand('complete', 'employer_start'), '599');

  assert.equal(
    getStripePriceIdForCheckout('complete', 'work_order'),
    'price_work_order',
  );
  assert.notEqual(
    getStripePriceIdForCheckout('complete', 'work_order'),
    'price_package',
    '399 Kč work-order package must use its own Stripe price',
  );
  assert.notEqual(
    getStripePriceIdForCheckout('complete', 'work_order'),
    'price_premium',
    '399 Kč work-order package must not be charged as a 199 Kč document',
  );
  assert.equal(getEffectivePriceBand('complete', 'work_order'), '399');
  // Balíček nesmí zlevnit tím, že si klient pošle nižší tier.
  assert.equal(getStripePriceIdForCheckout('basic', 'work_order'), 'price_work_order');
}

/**
 * Každý balíček musí mít vlastní Stripe Price ID, jakmile jeho cena vybočí
 * ze sdíleného pásma 299 Kč. Kdyby chybělo, checkout by tiše účtoval cizí cenu.
 */
function testEveryPackageHasDistinctPrice() {
  const sharedBandCzk = 299;
  const seen = new Map<string, string>();
  // Reporting sčítá výkon podle pásem; cena mimo tento výčet by se v dashboardu
  // ztratila, aniž by cokoli spadlo.
  const knownBands: readonly PriceBand[] = ['99', '199', '299', '399', '599'];

  for (const pkg of THEMATIC_PACKAGES) {
    const priceId = getStripePriceIdForCheckout('complete', pkg.key);
    assert.ok(priceId, `package ${pkg.key} has no Stripe price mapping`);
    const band = getEffectivePriceBand('complete', pkg.key);
    assert.equal(
      band,
      String(pkg.priceCzk),
      `package ${pkg.key} reports a price band different from its price`,
    );
    assert.ok(
      knownBands.includes(band),
      `package ${pkg.key} uses price band ${band}, which reporting does not know`,
    );

    if (pkg.priceCzk === sharedBandCzk) continue;

    const previous = seen.get(priceId as string);
    assert.equal(
      previous,
      undefined,
      `package ${pkg.key} shares Stripe price ${priceId} with ${previous}`,
    );
    seen.set(priceId as string, pkg.key);
  }
}

/**
 * Vypnutý balíček nesmí projít validací NOVÉHO checkoutu. Ručně poslaný
 * `packageKey` tak neotevře platbu za produkt, který není v provozu.
 *
 * Odbavení už zaplacené objednávky se naopak řídí `normalizeThematicPackage…`,
 * které dostupnost nekontroluje — viz purchased-package-immutability-tests.
 */
function testFeatureFlagGate() {
  process.env.NEXT_PUBLIC_FEATURE_ZAKAZKA_PLUS = 'false';
  assert.equal(isThematicPackageAvailable('work_order'), false);
  assert.equal(
    resolvePurchasablePackageKeyForContract('work_order', 'work_contract'),
    null,
    'disabled package must not survive checkout normalization',
  );
  assert.equal(
    getAvailableThematicPackages().some((pkg) => pkg.key === 'work_order'),
    false,
  );

  process.env.NEXT_PUBLIC_FEATURE_ZAKAZKA_PLUS = 'true';
  assert.equal(isThematicPackageAvailable('work_order'), true);
  assert.equal(
    resolvePurchasablePackageKeyForContract('work_order', 'work_contract'),
    'work_order',
  );
  // Balíček zůstává vázaný na svůj typ dokumentu i po zapnutí.
  assert.equal(resolvePurchasablePackageKeyForContract('work_order', 'lease'), null);
  assert.equal(normalizeThematicPackageKeyForContract('work_order', 'lease'), null);

  // Balíčky bez flagu jsou dostupné vždy.
  assert.equal(isThematicPackageAvailable('landlord'), true);
  assert.equal(isThematicPackageAvailable('employer_start'), true);
}

/** Roční plán se nesmí stát dostupným jen zapnutím flagu bez recurring ceny. */
function testAnnualPlanStaysOff() {
  delete process.env.STRIPE_PRICE_ID_LANDLORD_ANNUAL;
  process.env.NEXT_PUBLIC_FEATURE_LANDLORD_ANNUAL = 'true';
  assert.equal(
    isAnnualPlanAvailable('landlord_annual'),
    false,
    'annual plan must stay unavailable without a recurring Stripe price',
  );
  assert.deepEqual(getAvailableAnnualPlans(), []);
  process.env.NEXT_PUBLIC_FEATURE_LANDLORD_ANNUAL = 'false';
}

function testPackageContractGuard() {
  assert.equal(normalizeThematicPackageKeyForContract('landlord', 'lease'), 'landlord');
  assert.equal(normalizeThematicPackageKeyForContract('landlord', 'car_sale'), null);
  assert.equal(normalizeThematicPackageKeyForContract('vehicle_sale', 'car_sale'), 'vehicle_sale');
  assert.equal(normalizeThematicPackageKeyForContract('employer_start', 'employment'), 'employer_start');
  assert.equal(normalizeThematicPackageKeyForContract('employer_start', 'dpp'), null);
}

function testAddonMatrix() {
  const basicLease = getAvailableCheckoutAddons('lease', 'basic', null, 'cs').map((a) => a.key);
  assert.ok(basicLease.includes('docx'));
  assert.ok(basicLease.includes('handover_protocol'));
  assert.ok(basicLease.includes('extended_archive'));
  assert.ok(basicLease.includes('signing_checklist'));

  const completeLease = getAvailableCheckoutAddons('lease', 'complete', null, 'cs').map((a) => a.key);
  assert.ok(!completeLease.includes('signing_checklist'));

  const packageLease = getAvailableCheckoutAddons('lease', 'complete', 'landlord', 'cs').map(
    (a) => a.key,
  );
  assert.ok(!packageLease.includes('handover_protocol'));
  assert.ok(packageLease.includes('extended_archive'), '90d archive upsell stays available on 30d packages');

  const enLease = getAvailableCheckoutAddons('lease', 'basic', null, 'en').map((a) => a.key);
  assert.ok(enLease.includes('bilingual_annex'));
  assert.ok(basicLease.includes('bilingual_annex'));

  const employerPackage = getAvailableCheckoutAddons(
    'employment',
    'complete',
    'employer_start',
    'cs',
  ).map((a) => a.key);
  assert.ok(!employerPackage.includes('docx'), 'DOCX already included in employer package');
  assert.equal(packageIncludesDocx('employer_start'), true);
  assert.equal(normalizeAnnexLanguage('en'), 'en');
  assert.equal(normalizeAnnexLanguage('uk'), 'ua');
  assert.equal(normalizeAnnexLanguage('cs'), null);

  assert.deepEqual(
    normalizeCheckoutAddons(['handover_protocol', 'docx'], 'gift', 'basic', null, 'cs'),
    ['docx'],
  );

  assert.equal(getCheckoutAddonsTotalCzk(['docx', 'extended_archive']), 49 + 39);
}

function testTierFeaturesForPackages() {
  const basicPackage = resolveTierFeatures({
    contractType: 'lease',
    tier: 'basic',
    packageKey: 'landlord',
  });
  assert.equal(basicPackage.hasPremiumClauses, true, 'package must unlock complete-tier clauses');
  assert.equal(basicPackage.archiveDays, 30);
}

function main() {
  withEnv();
  testStripePriceMapping();
  testEveryPackageHasDistinctPrice();
  testPackageContractGuard();
  testAddonMatrix();
  testTierFeaturesForPackages();
  testFeatureFlagGate();
  testAnnualPlanStaysOff();
  console.log('Pricing matrix audit passed (99 / 199 / 299 / 399 / 599 + add-ons + flag gates).');
}

main();
