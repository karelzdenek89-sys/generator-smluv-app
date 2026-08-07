/**
 * Ověření mapování cenových pásem → Stripe Price ID → výstup dokumentu.
 */
import assert from 'node:assert/strict';
import {
  getEffectivePriceBand,
  getStripePriceIdForCheckout,
  normalizeThematicPackageKeyForContract,
  packageIncludesDocx,
} from '../lib/packages';
import { normalizePricingTier } from '../lib/pricing';
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
  testPackageContractGuard();
  testAddonMatrix();
  testTierFeaturesForPackages();
  console.log('Pricing matrix audit passed (99 / 199 / 299 / 599 + add-ons).');
}

main();
