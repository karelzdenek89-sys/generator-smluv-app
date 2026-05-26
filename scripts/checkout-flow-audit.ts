/**
 * Statický audit platebního flow: mapování builder → checkout → webhook → download.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), 'utf8');
}

const CHECKOUT_TYPES = [
  'lease',
  'car_sale',
  'gift',
  'work_contract',
  'loan',
  'nda',
  'general_sale',
  'employment',
  'dpp',
  'service',
  'sublease',
  'power_of_attorney',
  'debt_acknowledgment',
  'cooperation',
] as const;

const BUILDER_CHECKOUT: { page: string; contractType: string; hasLang?: boolean }[] = [
  { page: 'app/najem/page.tsx', contractType: 'lease', hasLang: true },
  { page: 'app/auto/page.tsx', contractType: 'car_sale', hasLang: true },
  { page: 'app/darovaci/page.tsx', contractType: 'gift' },
  { page: 'app/smlouva-o-dilo/page.tsx', contractType: 'work_contract' },
  { page: 'app/pujcka/page.tsx', contractType: 'loan' },
  { page: 'app/nda/page.tsx', contractType: 'nda' },
  { page: 'app/kupni/page.tsx', contractType: 'general_sale' },
  { page: 'app/pracovni/page.tsx', contractType: 'employment', hasLang: true },
  { page: 'app/dpp/page.tsx', contractType: 'dpp', hasLang: true },
  { page: 'app/sluzby/page.tsx', contractType: 'service' },
  { page: 'app/podnajem/page.tsx', contractType: 'sublease', hasLang: true },
  { page: 'app/plna-moc/page.tsx', contractType: 'power_of_attorney', hasLang: true },
  { page: 'app/uznani-dluhu/page.tsx', contractType: 'debt_acknowledgment' },
  { page: 'app/spoluprace/page.tsx', contractType: 'cooperation' },
];

const EXPAT_BUILDERS = ['najem', 'pracovni', 'dpp', 'podnajem', 'plna-moc', 'auto'] as const;

function testCheckoutRouteCoverage() {
  const checkout = read('app/api/checkout/route.ts');
  for (const type of CHECKOUT_TYPES) {
    assert.match(checkout, new RegExp(`'${type}'`), `checkout missing contract type ${type}`);
  }
  assert.match(checkout, /packageKey/);
  assert.match(checkout, /getStripePriceIdForCheckout/);
  const packages = read('lib/packages.ts');
  assert.match(packages, /STRIPE_PRICE_ID_PACKAGE/);
  assert.match(packages, /normalizeThematicPackageKeyForContract/);
  assert.doesNotMatch(
    packages,
    /STRIPE_PRICE_ID_PACKAGE\s*\?\?\s*process\.env\.STRIPE_PRICE_ID_PREMIUM/,
    '299 Kč packages must not fall back to the 199 Kč complete tier price',
  );
  assert.match(read('.env.example'), /STRIPE_PRICE_ID_PACKAGE/);
  assert.match(checkout, /CANCEL_URLS/);
  assert.match(checkout, /downloadToken/);
  assert.match(checkout, /Neplatný JSON požadavek/);
  assert.match(checkout, /Neplatný typ dokumentu/);
  assert.match(checkout, /normalizeCheckoutAddons/);
  assert.match(checkout, /price_data/);
  assert.match(checkout, /getCheckoutAddonMetadata/);
  assert.match(checkout, /Redis draft save failed/);
  assert.doesNotMatch(checkout, /Redis draft save fail-open/);
}

function testBuilderPayloads() {
  for (const { page, contractType, hasLang } of BUILDER_CHECKOUT) {
    const src = read(page);
    assert.match(
      src,
      new RegExp(`contractType:\\s*'${contractType}'`),
      `${page} must send contractType ${contractType}`,
    );
    assert.match(src, /fetch\('\/api\/checkout'/, `${page} must call /api/checkout`);
    assert.match(src, /tier:/, `${page} must send tier`);
    assert.match(src, /addOns/, `${page} must pass selected checkout add-ons`);
    if (hasLang) {
      assert.match(src, /lang:\s*builderLocale/, `${page} must pass builderLocale as lang`);
    }
  }
}

function testExpatLangInPayload() {
  for (const slug of EXPAT_BUILDERS) {
    const src = read(`app/${slug}/page.tsx`);
    assert.match(
      src,
      /lang:\s*builderLocale/,
      `expat builder /${slug} must pass lang to checkout and payload`,
    );
  }
}

function testWebhookAndDownload() {
  const webhook = read('app/api/stripe/webhook/route.ts');
  const download = read('app/api/contracts/download/route.ts');
  const status = read('app/api/contracts/status/route.ts');
  const success = read('app/success/page.tsx');
  const orders = read('app/api/orders/route.ts');
  const contracts = read('lib/contracts.ts');

  assert.match(webhook, /checkout\.session\.completed/);
  assert.match(webhook, /session\.payment_status !== 'paid'/);
  assert.match(webhook, /downloadToken/);
  assert.match(webhook, /checkout_addon_purchased/);
  assert.match(webhook, /normalizeStoredCheckoutAddons/);
  assert.match(webhook, /contract:draft:/);
  assert.match(download, /session\.metadata\?\.draftId/);
  assert.match(download, /payment_status === 'paid'/);
  assert.match(download, /format.*docx/);
  assert.match(download, /hasCheckoutAddon\(fullData, 'docx'\)/);
  assert.match(download, /Neplatný nebo chybějící bezpečnostní token/);
  assert.doesNotMatch(download, /reconstructing from Stripe metadata/);
  assert.match(status, /addOns/);
  assert.match(status, /includedItems/);
  assert.match(status, /archiveDays/);
  assert.match(status, /getEffectivePriceLabel/);
  assert.match(status, /ratelimit:contract-status/);
  assert.match(status, /formatStripeAmount/);
  assert.match(status, /session\.amount_total/);
  assert.match(status, /statusTokenMatches/);
  assert.match(success, /\/api\/contracts\/status/);
  assert.match(success, /token=.*\/api\/contracts\/status|tokenQuery/);
  assert.match(success, /\/api\/contracts\/download/);
  assert.match(success, /format=docx/);
  assert.match(success, /tokenQuery/);
  assert.match(orders, /downloadToken/);
  assert.match(orders, /addOns/);
  assert.match(orders, /includedItems/);
  assert.match(webhook, /response\.ok/);
  assert.match(webhook, /Resend API error/);
  assert.doesNotMatch(
    contracts,
    /legacyPremium|Boolean\(d\.notaryUpsell\)/,
    'notaryUpsell must not unlock paid clauses',
  );
}

function testPokladnaAlias() {
  const pokladna = read('app/api/pokladna/route.ts');
  assert.match(pokladna, /checkout\/route/);
}

function main() {
  testCheckoutRouteCoverage();
  testBuilderPayloads();
  testExpatLangInPayload();
  testWebhookAndDownload();
  testPokladnaAlias();
  console.log('Checkout flow audit passed (14 contract types, expat lang, packageKey, webhook/download).');
}

main();
