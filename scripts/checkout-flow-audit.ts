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
  const checkoutValidation = read('lib/checkout-validation.ts');
  for (const type of CHECKOUT_TYPES) {
    assert.match(checkoutValidation, new RegExp(`'${type}'`), `checkout validation missing contract type ${type}`);
  }
  assert.match(checkout, /packageKey/);
  assert.match(checkout, /getStripePriceIdForCheckout/);
  const packages = read('lib/packages.ts');
  assert.match(packages, /STRIPE_PRICE_ID_PACKAGE/);
  assert.match(packages, /STRIPE_PRICE_ID_EMPLOYER_START/);
  assert.match(packages, /normalizeThematicPackageKeyForContract/);
  // Nový checkout smí balíček přijmout jen přes variantu, která kontroluje
  // dostupnost produktu; odbavení zaplacené objednávky ji záměrně nepoužívá.
  assert.match(checkout, /resolvePurchasablePackageKeyForContract/);
  assert.match(checkout, /packageVersion/);
  assert.doesNotMatch(
    packages,
    /STRIPE_PRICE_ID_PACKAGE\s*\?\?\s*process\.env\.STRIPE_PRICE_ID_PREMIUM/,
    '299 Kč packages must not fall back to the 199 Kč complete tier price',
  );
  assert.match(read('.env.example'), /STRIPE_PRICE_ID_PACKAGE/);
  assert.match(read('.env.example'), /STRIPE_PRICE_ID_EMPLOYER_START/);
  assert.match(checkout, /CANCEL_URLS/);
  assert.match(checkout, /downloadToken/);
  assert.match(checkout, /Neplatný JSON požadavek/);
  assert.match(checkout, /Neplatný typ dokumentu/);
  assert.match(checkout, /normalizeCheckoutAddons/);
  assert.match(checkout, /price_data/);
  assert.match(checkout, /getCheckoutAddonMetadata/);
  assert.match(checkout, /builder_completed/);
  assert.match(checkout, /stripe_checkout_started/);
  assert.match(checkout, /recordAnalyticsEvent/);
  assert.match(checkout, /CHECKOUT_AUDIT_SECRET/);
  assert.match(checkout, /timingSafeEqual/);
  assert.match(
    checkout,
    /if\s*\(!isCheckoutAudit && analyticsConsentGranted\)\s*\{\s*await recordAnalyticsEvent\('builder_completed', acceptedCheckoutParams\)/,
    'Accepted paid builders must record completion only with explicit analytics consent and outside audit mode',
  );
  assert.match(
    checkout,
    /if\s*\(!isCheckoutAudit && analyticsConsentGranted\)\s*\{\s*await recordAnalyticsEvent\('stripe_checkout_started', acceptedCheckoutParams\)/,
    'Stripe checkout starts must be recorded only with explicit analytics consent and outside audit mode',
  );
  assert.match(checkout, /normalizeConsentedCheckoutAnalyticsAttribution\(/);
  assert.match(checkout, /getMonetizationPolicy\(contractType, lang\)/);
  assert.match(checkout, /experiment_id:\s*experimentId/);
  assert.match(checkout, /variant:\s*experimentVariant/);
  const draftPersistIndex = checkout.indexOf('`contract:draft:${draftId}`');
  const builderCompletedIndex = checkout.indexOf("recordAnalyticsEvent('builder_completed', acceptedCheckoutParams)");
  const stripeCreateIndex = checkout.indexOf('stripe.checkout.sessions.create(sessionParams)');
  const stripeStartedIndex = checkout.indexOf("recordAnalyticsEvent('stripe_checkout_started', acceptedCheckoutParams)");
  assert.ok(
    draftPersistIndex >= 0
      && draftPersistIndex < builderCompletedIndex
      && builderCompletedIndex < stripeCreateIndex
      && stripeCreateIndex < stripeStartedIndex,
    'Completion must follow safe draft persistence, while checkout start must follow Stripe acceptance',
  );
  assert.match(checkout, /if\s*\(!isCheckoutAudit\)\s*\{\s*const rateLimit/);
  assert.match(checkout, /amountTotal:\s*session\.amount_total/);
  assert.doesNotMatch(
    checkout,
    /deliveryEmail\s*===\s*['"]checkout-audit@/,
    'Live audit authorization must use a server secret, never a spoofable email address',
  );
  assert.match(checkout, /Redis draft save failed/);
  assert.doesNotMatch(checkout, /Redis draft save fail-open/);
  assert.match(checkout, /validateContractPayload/);
  assert.match(checkout, /deliveryEmail/);
  assert.match(checkout, /CHECKOUT_TERMS_VERSION/);
  assert.doesNotMatch(checkout, /const rawEmail = typeof body\.email/);
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
    assert.match(src, /deliveryEmail:\s*authorization\.deliveryEmail/, `${page} must send delivery email`);
    assert.match(src, /consent:\s*authorization\.consent/, `${page} must send consent proof`);
    assert.match(
      src,
      /analyticsConsentGranted:\s*authorization\.analyticsConsentGranted/,
      `${page} must send the explicit analytics consent choice`,
    );
    assert.match(
      src,
      /analyticsAttribution:\s*authorization\.analyticsAttribution/,
      `${page} must send privacy-safe acquisition attribution when available`,
    );
    if (hasLang) {
      assert.match(src, /lang:\s*builderLocale/, `${page} must pass builderLocale as lang`);
      assert.match(src, /annexLanguage:\s*authorization\.annexLanguage/, `${page} must pass selected annex language`);
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
  const secureDownload = read('app/stahnout/page.tsx');
  const portal = read('lib/orders-portal.ts');
  const contracts = read('lib/contracts.ts');

  assert.match(webhook, /checkout\.session\.completed/);
  assert.match(webhook, /checkout\.session\.async_payment_succeeded/);
  assert.match(webhook, /session\.payment_status !== 'paid'/);
  assert.match(webhook, /downloadToken/);
  assert.match(webhook, /checkout_completed/);
  assert.match(webhook, /checkout_addon_purchased/);
  assert.match(webhook, /experiment_id:\s*options\.experimentId/);
  assert.match(webhook, /variant:\s*options\.experimentVariant/);
  assert.match(webhook, /normalizeStoredCheckoutAddons/);
  assert.match(webhook, /contract:draft:/);
  assert.match(webhook, /webhook:fulfilled:/);
  assert.match(webhook, /webhook:fulfillment-lock:/);
  assert.match(webhook, /RELEASE_LOCK_IF_OWNER/);
  assert.match(webhook, /customer_details\?\.email/);
  assert.match(webhook, /Idempotency-Key/);
  assert.doesNotMatch(webhook, /webhook:paid:/);
  assert.match(download, /session\.metadata\?\.draftId/);
  assert.match(download, /payment_status === 'paid'/);
  assert.match(download, /format.*docx/);
  assert.match(download, /hasCheckoutAddon\(fullData, 'docx'\)/);
  assert.match(download, /Neplatný nebo chybějící bezpečnostní token/);
  assert.match(download, /expiresAt/);
  assert.match(download, /remainingTtl/);
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
  assert.match(success, /method:\s*'POST'/);
  assert.match(success, /\/stahnout\?/);
  assert.match(success, /format=docx/);
  assert.doesNotMatch(success, /\/api\/contracts\/download\?/);
  assert.match(secureDownload, /request\.kind === 'free'/);
  assert.match(secureDownload, /'\/api\/contracts\/free\/download'/);
  assert.match(secureDownload, /'\/api\/contracts\/download'/);
  assert.match(secureDownload, /method:\s*'POST'/);
  assert.match(secureDownload, /token:\s*request\.token/);
  assert.match(secureDownload, /window\.history\.replaceState/);
  assert.match(orders, /downloadToken/);
  assert.match(orders, /export async function POST/);
  assert.match(orders, /addOns/);
  assert.match(orders, /includedItems/);
  assert.match(webhook, /response\.ok/);
  assert.match(webhook, /Resend API error/);
  assert.match(portal, /ttlSeconds/);
  assert.doesNotMatch(portal, /orders:portal:email:/);
  assert.doesNotMatch(portal, /PORTAL_TTL_SEC\s*=\s*60 \* 60 \* 24 \* 30/);
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
  console.log('Checkout flow audit passed (14 contract types, annex language, packageKey, webhook/download).');
}

main();
