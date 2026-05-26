/**
 * Static site-content audit for the public marketing/legal surface.
 *
 * This catches regressions that are easy to miss in TypeScript tests:
 * price drift, stale legal copy, missing social images and checkout UX leaks.
 */
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function read(path: string): string {
  return readFileSync(join(ROOT, path), 'utf8');
}

function assertNoOldPriceCopy(path: string) {
  const src = read(path);
  assert.doesNotMatch(src, /\b249 Kč\b|\b399 Kč\b|\b749 Kč\b/, `${path}: contains stale 249/399/749 Kč copy`);
}

function assertMetadataTitleHasNoBrand(src: string, path: string) {
  const match = src.match(/export const metadata[\s\S]*?\n\s*title:\s*['"]([^'"]+)['"]/);
  assert.ok(match, `${path}: metadata.title not found`);
  assert.ok(!match[1].includes('| SmlouvaHned'), `${path}: metadata title duplicates root title template brand`);
}

function walkAppFiles(dir = join(ROOT, 'app')): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) return walkAppFiles(fullPath);
    return /\.(tsx|ts)$/.test(entry) ? [fullPath] : [];
  });
}

function assertNoDirectMetadataBrandTitles() {
  for (const fullPath of walkAppFiles()) {
    const src = readFileSync(fullPath, 'utf8');
    assert.doesNotMatch(
      src,
      /title:\s*['"][^'"\n]*\|\s*SmlouvaHned(?:\.cz)?[^'"\n]*['"]/,
      `${fullPath}: direct metadata title includes SmlouvaHned; use the root template or an absolute title`,
    );
  }
}

function main() {
  assertNoDirectMetadataBrandTitles();

  const publicFiles = [
    'app/page.tsx',
    'app/faq/page.tsx',
    'app/obchodni-podminky/page.tsx',
    'app/gdpr/page.tsx',
    'app/najem/layout.tsx',
    'app/najem/page.tsx',
    'lib/pricing.ts',
    'lib/packages.ts',
  ];
  publicFiles.forEach(assertNoOldPriceCopy);

  const terms = read('app/obchodni-podminky/page.tsx');
  assert.match(terms, /PRICING_TIER_CONFIG\.basic\.priceLabel/, 'Terms must use configured basic price');
  assert.match(terms, /PRICING_TIER_CONFIG\.complete\.priceLabel/, 'Terms must use configured extended price');
  assert.match(terms, /THEMATIC_PACKAGE_CONFIG\.landlord\.priceLabel/, 'Terms must show configured package price');
  assert.match(terms, /CHECKOUT_ADDON_CONFIG/, 'Terms must list checkout add-ons');
  assert.match(terms, /není plátcem DPH/, 'Terms must clarify non-VAT-payer status');
  assert.match(terms, /90 dní/, 'Terms must mention 90-day archive add-on');
  assert.doesNotMatch(terms, /vč\. DPH/i, 'Terms must not say prices include VAT');

  const faq = read('app/faq/page.tsx');
  assert.match(faq, /Základní dokument 99 Kč/, 'FAQ must mention 99 Kč basic price');
  assert.match(faq, /Rozšířený dokument[^']*199 Kč/, 'FAQ must mention 199 Kč extended price');
  assert.match(faq, /299 Kč/, 'FAQ must mention 299 Kč package price');
  assert.match(faq, /90 dní s doplňkem archivace/, 'FAQ must mention 90-day archive add-on');
  assert.doesNotMatch(faq, /DIČ/, 'FAQ invoice copy must not promise VAT ID on tax invoice');
  assert.match(faq, /images: \[\{ url: '\/og-image\.png'/, 'FAQ must define og:image');
  assert.match(faq, /twitter: \{/, 'FAQ must define page-specific Twitter metadata');

  const gdpr = read('app/gdpr/page.tsx');
  assert.match(gdpr, /90 dní s doplňkem archivace/, 'GDPR must mention 90-day archive add-on');

  const leaseLayout = read('app/najem/layout.tsx');
  assert.match(leaseLayout, /images: \[\{ url: '\/og-image\.png'/, '/najem must define og:image');
  assert.match(leaseLayout, /twitter: \{/, '/najem must define page-specific Twitter metadata');
  assertMetadataTitleHasNoBrand(leaseLayout, '/najem');

  const productLayouts = [
    'app/auto/layout.tsx',
    'app/darovaci/layout.tsx',
    'app/dpp/layout.tsx',
    'app/kupni/layout.tsx',
    'app/najem/layout.tsx',
    'app/nda/layout.tsx',
    'app/plna-moc/layout.tsx',
    'app/podnajem/layout.tsx',
    'app/pracovni/layout.tsx',
    'app/pujcka/layout.tsx',
    'app/sluzby/layout.tsx',
    'app/smlouva-o-dilo/layout.tsx',
    'app/spoluprace/layout.tsx',
    'app/uznani-dluhu/layout.tsx',
  ];

  for (const path of productLayouts) {
    const src = read(path);
    assert.match(src, /images: \[\{ url: '\/og-image\.png'/, `${path}: missing og:image`);
    assertMetadataTitleHasNoBrand(src, path);
  }

  const leaseUi = read('lib/i18n/lease-form.ts');
  assert.match(
    leaseUi,
    /Potřebujete také předávací protokol, odečty měřidel a potvrzení o kauci\?/,
    'Czech lease form must not show English landlord-package CTA',
  );

  const leasePage = read('app/najem/page.tsx');
  assert.doesNotMatch(leasePage, /<pre\b/, '/najem preview must not use pre/code block rendering');
  assert.match(leasePage, /disabled=\{!canOpenCheckout\}/, '/najem checkout CTA must be disabled until required fields are present');
  assert.doesNotMatch(leasePage, /formData\.paymentDay,\s*\n\s*formData\.bankAccount,\s*\n\s*formData\.maxOccupants/, '/najem empty progress must not count default payment day/max occupants');

  const rootLayout = read('app/layout.tsx');
  const siteHeader = read('app/components/SiteHeader.tsx');
  assert.match(rootLayout, /<SiteHeader \/>/, 'Non-home public pages should use the shared site header');
  for (const label of ['Smlouvy', 'Postup', 'Blog', 'FAQ', 'Moje dokumenty']) {
    assert.match(siteHeader, new RegExp(label), `Shared site header missing ${label}`);
  }

  assert.ok(existsSync(join(ROOT, 'app/slovnik/page.tsx')), '/slovnik page must exist');

  console.log('Site content audit passed (prices, legal copy, metadata, /najem UX, /slovnik).');
}

main();
