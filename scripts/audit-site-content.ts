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
  const literalTitle = src.match(/export const metadata[\s\S]*?\n\s*title:\s*['"]([^'"]+)['"]/);
  const constantTitle = src.match(/const\s+PAGE_TITLE\s*=\s*['"]([^'"]+)['"]/);
  const title = literalTitle?.[1] ?? constantTitle?.[1];
  assert.ok(title, `${path}: metadata.title not found`);
  assert.ok(!title.includes('| SmlouvaHned'), `${path}: metadata title duplicates root title template brand`);
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
    const match = src.match(/export const metadata[\s\S]*?\n\s*title:\s*['"]([^'"]+)['"]/);
    if (!match) continue;
    assert.ok(
      !match[1].includes('| SmlouvaHned'),
      `${fullPath}: metadata.title duplicates root title template brand`,
    );
  }
}

/**
 * SERP truncation guards.
 *
 * The root layout appends the `%s | SmlouvaHned` template to every page title,
 * so an over-long title loses its own keywords — not just the brand suffix.
 * Descriptions outside this band either get cut off or waste snippet space.
 */
const MAX_TITLE_LENGTH = 60;
const MIN_DESCRIPTION_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 165;

/** Pulls the literal title/description a page actually ships to Next metadata. */
function extractMetadataStrings(src: string): { title?: string; description?: string } {
  const title =
    src.match(/blogArticlePageMetadata\(\s*['"][^'"]+['"]\s*,\s*\{[\s\S]{0,200}?title:\s*['"]([^'"]+)['"]/)?.[1] ??
    src.match(/landingPageMetadata\(\{[\s\S]{0,300}?title:\s*['"]([^'"]+)['"]/)?.[1] ??
    src.match(/const\s+PAGE_TITLE\s*=\s*['"]([^'"]+)['"]/)?.[1] ??
    src.match(/export const metadata[\s\S]{0,200}?\n\s*title:\s*['"]([^'"]+)['"]/)?.[1];

  const description =
    src.match(/const\s+PAGE_DESCRIPTION\s*=\s*\n?\s*['"]([^'"]+)['"]/)?.[1] ??
    src.match(/(?:blogArticlePageMetadata|landingPageMetadata)\([\s\S]{0,400}?description:\s*\n?\s*['"]([^'"]+)['"]/)?.[1] ??
    src.match(/export const metadata[\s\S]{0,400}?\n\s*description:\s*\n?\s*['"]([^'"]+)['"]/)?.[1];

  return { title, description };
}

function assertMetadataLengths() {
  for (const fullPath of walkAppFiles()) {
    if (!/[\\/](page|layout)\.tsx$/.test(fullPath)) continue;
    // Internal dashboards are robots-disallowed, so SERP limits do not apply.
    if (/[\\/]interni[\\/]/.test(fullPath)) continue;

    const rel = fullPath.slice(ROOT.length + 1).replace(/\\/g, '/');
    const { title, description } = extractMetadataStrings(readFileSync(fullPath, 'utf8'));

    if (title !== undefined) {
      assert.ok(
        title.length <= MAX_TITLE_LENGTH,
        `${rel}: metadata.title is ${title.length} chars (max ${MAX_TITLE_LENGTH}); it will be truncated in search results once the brand template is appended`,
      );
    }
    if (description !== undefined) {
      assert.ok(
        description.length >= MIN_DESCRIPTION_LENGTH && description.length <= MAX_DESCRIPTION_LENGTH,
        `${rel}: metadata.description is ${description.length} chars (expected ${MIN_DESCRIPTION_LENGTH}-${MAX_DESCRIPTION_LENGTH})`,
      );
    }
  }
}

/**
 * Articles that call blogArticlePageMetadata(slug) without overrides inherit their
 * title/excerpt from the registry, so the registry is subject to the same limits.
 */
function assertBlogRegistryLengths() {
  const src = read('lib/blog-articles.ts');
  const entries = [...src.matchAll(/slug:\s*'([^']+)',\s*\n\s*title:\s*'([^']+)'/g)];
  assert.ok(entries.length > 0, 'lib/blog-articles.ts: no article entries found');

  for (const [, slug, title] of entries) {
    assert.ok(
      title.length <= MAX_TITLE_LENGTH,
      `lib/blog-articles.ts (${slug}): title is ${title.length} chars (max ${MAX_TITLE_LENGTH})`,
    );
  }
}

/**
 * EN/UA expat landings set `title: { absolute: ... }`, so the brand suffix is part
 * of the string instead of coming from the root template — but the SERP budget is
 * the same. These are the best-converting pages, so guard them explicitly.
 */
function assertExpatLandingLengths() {
  const src = read('lib/i18n/expat-seo-landings.ts');
  const packs = [
    ...src.matchAll(
      /const\s+([A-Z_]+):\s*LocalePack\s*=\s*\{[\s\S]*?metadata:\s*\{\s*title:\s*'([^']+)',\s*\n\s*description:\s*\n?\s*'([^']+)'/g,
    ),
  ];
  assert.ok(packs.length > 0, 'lib/i18n/expat-seo-landings.ts: no locale packs found');

  for (const [, name, title, description] of packs) {
    assert.ok(
      title.length <= MAX_TITLE_LENGTH,
      `expat landing ${name}: title is ${title.length} chars (max ${MAX_TITLE_LENGTH})`,
    );
    assert.ok(
      description.length >= MIN_DESCRIPTION_LENGTH && description.length <= MAX_DESCRIPTION_LENGTH,
      `expat landing ${name}: description is ${description.length} chars (expected ${MIN_DESCRIPTION_LENGTH}-${MAX_DESCRIPTION_LENGTH})`,
    );
  }
}

function assertSeoMetadata(path: string) {
  const src = read(path);
  assert.match(src, /alternates:\s*\{\s*canonical:/, `${path}: missing canonical metadata`);
  assert.match(src, /openGraph:\s*\{[\s\S]*images:\s*\[\{ url: '\/og-image\.png'/, `${path}: missing og:image metadata`);
  assert.match(src, /twitter:\s*\{[\s\S]*card:\s*'summary_large_image'/, `${path}: missing Twitter large-card metadata`);
}

function main() {
  assertNoDirectMetadataBrandTitles();
  assertMetadataLengths();
  assertBlogRegistryLengths();
  assertExpatLandingLengths();

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
  assertSeoMetadata('app/obchodni-podminky/page.tsx');
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
  assertSeoMetadata('app/gdpr/page.tsx');
  assert.match(gdpr, /double opt-in/, 'GDPR must document newsletter double opt-in');
  assert.match(gdpr, /Kontaktní formulář/, 'GDPR must document contact-form processing');
  assert.match(gdpr, /90 dní s doplňkem archivace/, 'GDPR must mention 90-day archive add-on');
  assert.match(gdpr, /Newsletter \(tipy a novinky\)/, 'GDPR must document newsletter consent');

  const footer = read('app/components/Footer.tsx');
  assert.match(footer, /NewsletterSignup/, 'Footer must include newsletter signup');
  assert.ok(existsSync(join(ROOT, 'app/api/newsletter/subscribe/route.ts')), 'Newsletter API route must exist');
  const newsletterApi = read('app/api/newsletter/subscribe/route.ts');
  assert.match(newsletterApi, /consent === true/, 'Newsletter API must require explicit consent');
  assert.match(read('lib/resend-contacts.ts'), /RESEND_NEWSLETTER_SEGMENT_ID/, 'Resend contacts helper must support segment ID');
  assert.ok(existsSync(join(ROOT, 'lib/newsletter-subscribers.ts')), 'Newsletter Redis storage must exist');
  assert.match(newsletterApi, /createNewsletterConfirmation/, 'Newsletter must create a pending double-opt-in record first');
  assert.ok(existsSync(join(ROOT, 'app/api/newsletter/confirm/route.ts')), 'Newsletter confirmation route must exist');
  assert.ok(existsSync(join(ROOT, 'app/newsletter/potvrdit/page.tsx')), 'Newsletter confirmation page must exist');
  const newsletterConfirm = read('app/api/newsletter/confirm/route.ts');
  assert.match(newsletterConfirm, /saveNewsletterSubscriber/, 'Newsletter must save consent only after confirmation');
  assert.match(newsletterConfirm, /subscribeNewsletterContact/, 'Newsletter must sync to Resend only after confirmation');
  assert.match(newsletterConfirm, /export async function POST/, 'Newsletter confirmation must require POST');
  assert.match(read('app/newsletter/potvrdit/page.tsx'), /url\.hash/, 'Newsletter token must be read from a URL fragment');

  const layout = read('app/layout.tsx');
  assert.match(layout, /SiteAnalytics/, 'Root layout must include Vercel Analytics');
  assert.match(read('lib/analytics.ts'), /checkout_completed/, 'Product analytics must track completed purchases');
  assert.match(read('lib/analytics.ts'), /seo_landing_view/, 'Product analytics must track SEO landing views');
  assert.match(read('lib/internal-reporting-auth.ts'), /INTERNAL_REPORTING_COOKIE/, 'Internal reporting must support cookie auth');
  assert.match(read('lib/analytics.ts'), /newsletter_subscribed/, 'Product analytics must track newsletter signups');
  const gdprCookies = read('app/gdpr/page.tsx');
  assert.match(gdprCookies, /Vercel Web Analytics/, 'GDPR must mention Vercel Web Analytics');

  assertSeoMetadata('app/kontakt/page.tsx');

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
  const routeChrome = read('app/components/RouteChrome.tsx');
  const siteHeader = read('app/components/SiteHeader.tsx');
  assert.doesNotMatch(rootLayout, /alternates:\s*\{[\s\S]*canonical:\s*BASE_URL/, 'Root layout must not force homepage canonical on child pages');
  assert.match(rootLayout, /<RouteChrome \/>/, 'Root layout must render route-aware shared chrome');
  assert.match(routeChrome, /<SiteHeader \/>/, 'Non-home public pages should use the shared site header');
  for (const label of ['Smlouvy', 'Postup', 'Blog', 'FAQ', 'Moje dokumenty']) {
    assert.match(siteHeader, new RegExp(label), `Shared site header missing ${label}`);
  }

  assert.ok(existsSync(join(ROOT, 'app/slovnik/page.tsx')), '/slovnik page must exist');

  assert.ok(!existsSync(join(ROOT, 'app/robots.ts')), 'Use public/robots.txt as the single robots source of truth');
  const robots = read('public/robots.txt');
  for (const disallowedPath of ['/api/', '/success', '/interni/', '/navrh-redesignu', '/zakaznicka-zona']) {
    assert.match(robots, new RegExp(disallowedPath.replace(/\//g, '\\/')), `robots.txt must disallow ${disallowedPath}`);
  }

  const sitemap = read('app/sitemap.ts');
  assert.match(sitemap, /DEFAULT_SITEMAP_IMAGE/, 'Sitemap should include the default OG image');
  assert.match(sitemap, /images: entry\.images \?\? \[DEFAULT_SITEMAP_IMAGE\]/, 'Sitemap entries should include image sitemap data');
  assert.match(sitemap, /czechBlogSitemapEntries/, 'Sitemap should derive Czech blog URLs from the article registry');
  assert.match(
    read('lib/seo/sitemap-blog.ts'),
    /flexinovela-zakoniku-prace-2026/,
    '2026 blog cluster slugs should be pillar priority in sitemap',
  );
  assert.match(
    read('next.config.ts'),
    /LEGACY_EXPAT_BLOG_REDIRECTS/,
    'Legacy expat blog redirects should be wired in next.config',
  );
  assert.match(read('next.config.ts'), /og-image\.png/, 'next.config should rewrite legacy OG image path');
  assert.match(read('app/opengraph-image.tsx'), /renderBrandOgImage/, 'Root OG image route must exist');
  for (const path of ['/pro-pronajimatele', '/prodej-vozidla', '/balicek-pronajimatel', '/balicek-prodej-vozidla']) {
    assert.match(sitemap, new RegExp(path.replace(/\//g, '\\/')), `Sitemap missing ${path}`);
  }

  assert.match(read('app/zakaznicka-zona/layout.tsx'), /index: false/, 'Customer zone must be noindex');
  const proxy = read('proxy.ts');
  assert.match(proxy, /CANONICAL_HOST/, 'Proxy should redirect apex domain to www');
  assert.match(proxy, /LOCALIZED_BUILDER_PATHS/, 'Proxy should only reset locale cookies on relevant builder routes');
  assert.match(read('vercel.json'), /www\.smlouvahned\.cz/, 'vercel.json should redirect apex host to www');

  console.log('Site content audit passed (prices, legal copy, metadata, /najem UX, /slovnik).');
}

main();
