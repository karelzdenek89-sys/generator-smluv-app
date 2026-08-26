import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { NextRequest } from 'next/server';
import sitemap from '../app/sitemap';
import { proxy, resolveContentLanguage } from '../proxy';
import {
  CONTENT_CONSOLIDATION_REDIRECTS,
  RETIRED_CONTENT_PATHS,
} from '../lib/seo/content-consolidation-redirects';
import {
  getExpatBuilderCanonicalAlternates,
  getExpatHreflangLanguages,
} from '../lib/i18n/expat-hreflang';
import { getExpatBlogArticle } from '../lib/i18n/expat-blog-articles';
import { getBlogHreflangAlternates } from '../lib/seo/blog-hreflang-clusters';
import { SITE_URL } from '../lib/seo/site';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CANONICAL_ORIGIN = 'https://www.smlouvahned.cz';
const RETIRED_ROUTE_DIRS = new Set([
  'app/najemni-smlouva',
  'app/pracovni-smlouva',
  'app/dohoda-o-provedeni-prace',
  'app/smlouva-o-spolupraci',
]);
const SOURCE_ALLOWLIST = new Set([
  'lib/analytics-reporting.ts',
  'lib/marketing/differentiation.ts',
  'lib/seo/content-consolidation-redirects.ts',
]);

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : /\.(?:ts|tsx)$/.test(entry) ? [path] : [];
  });
}

function repoPath(path: string): string {
  return relative(ROOT, path).replace(/\\/g, '/');
}

function assertCanonicalUrl(url: string, context: string) {
  const parsed = new URL(url);
  assert.equal(parsed.origin, CANONICAL_ORIGIN, `${context}: non-canonical origin ${parsed.origin}`);
  assert.equal(parsed.search, '', `${context}: query parameters are not allowed`);
  assert.equal(parsed.hash, '', `${context}: fragments are not allowed`);
}

function assertSitemapArchitecture() {
  const entries = sitemap();
  assert.ok(entries.length > 0, 'sitemap must not be empty');
  assert.equal(new Set(entries.map(({ url }) => url)).size, entries.length, 'sitemap contains duplicate URLs');

  for (const entry of entries) {
    assertCanonicalUrl(entry.url, `sitemap ${entry.url}`);
    const path = new URL(entry.url).pathname.replace(/\/$/, '') || '/';
    assert.ok(!RETIRED_CONTENT_PATHS.includes(path), `retired URL remains in sitemap: ${path}`);

    for (const [language, alternate] of Object.entries(entry.alternates?.languages ?? {})) {
      assertCanonicalUrl(String(alternate), `sitemap hreflang ${language} for ${entry.url}`);
    }
  }

  for (const [path, contract] of [
    ['/podnajemni-smlouva', 'sublease'],
    ['/plna-moc-online', 'power_of_attorney'],
    ['/prodej-vozidla', 'car_sale'],
  ] as const) {
    const entry = entries.find(({ url }) => url === `${CANONICAL_ORIGIN}${path}`);
    assert.deepEqual(
      entry?.alternates?.languages,
      getExpatHreflangLanguages(contract),
      `${path}: Czech SEO landing must expose the reciprocal sitemap hreflang cluster`,
    );
  }
}

function assertRedirectArchitecture() {
  assert.deepEqual(CONTENT_CONSOLIDATION_REDIRECTS, [
    { source: '/najemni-smlouva', destination: '/najem', permanent: true },
    { source: '/pracovni-smlouva', destination: '/pracovni', permanent: true },
    { source: '/dohoda-o-provedeni-prace', destination: '/dpp', permanent: true },
    { source: '/smlouva-o-spolupraci', destination: '/spoluprace', permanent: true },
  ]);

  const expectedCzechAlternates = {
    lease: `${CANONICAL_ORIGIN}/najem`,
    employment: `${CANONICAL_ORIGIN}/pracovni`,
    dpp: `${CANONICAL_ORIGIN}/dpp`,
  } as const;
  for (const [contract, expected] of Object.entries(expectedCzechAlternates)) {
    const languages = getExpatHreflangLanguages(contract as keyof typeof expectedCzechAlternates);
    assert.equal(languages.cs, expected, `${contract}: wrong consolidated Czech hreflang`);
    assert.deepEqual(
      getExpatBuilderCanonicalAlternates(contract as keyof typeof expectedCzechAlternates).languages,
      languages,
      `${contract}: builder metadata must expose reciprocal hreflang`,
    );
    Object.entries(languages).forEach(([language, url]) =>
      assertCanonicalUrl(url, `${contract} hreflang ${language}`),
    );
  }

  const apexResponse = proxy(new NextRequest(
    'https://smlouvahned.cz/blog/dpp-dohoda-provedeni-prace',
    { headers: { host: 'smlouvahned.cz' } },
  ));
  assert.equal(apexResponse.status, 308, 'apex host must redirect permanently');
  assert.equal(
    apexResponse.headers.get('location'),
    `${CANONICAL_ORIGIN}/blog/dpp-dohoda-provedeni-prace`,
    'apex host must redirect directly to the canonical www URL',
  );
}

function assertContentLanguageArchitecture() {
  assert.equal(resolveContentLanguage('/blog/expat/rental-guide-en', null), 'en');
  assert.equal(resolveContentLanguage('/blog/expat/rental-guide-ua', null), 'uk');
  assert.equal(resolveContentLanguage('/en/car-sale-agreement-czech-republic', null), 'en');
  assert.equal(resolveContentLanguage('/ua/car-sale-agreement-czech-republic', null), 'uk');
  assert.equal(resolveContentLanguage('/auto', 'en'), 'en');
  assert.equal(resolveContentLanguage('/auto', 'ua'), 'uk');
  assert.equal(resolveContentLanguage('/blog/dpp-dohoda-provedeni-prace', null), 'cs');

  const localizedBuilder = proxy(new NextRequest(
    `${CANONICAL_ORIGIN}/auto?lang=en`,
    { headers: { host: 'www.smlouvahned.cz' } },
  ));
  assert.equal(localizedBuilder.headers.get('content-language'), 'en');
  assert.equal(localizedBuilder.headers.get('x-robots-tag'), 'noindex, follow');
}

function assertNoInternalRedirectHops() {
  const files = [...walk(join(ROOT, 'app')), ...walk(join(ROOT, 'lib'))];
  for (const file of files) {
    const rel = repoPath(file);
    if (SOURCE_ALLOWLIST.has(rel) || [...RETIRED_ROUTE_DIRS].some((dir) => rel.startsWith(`${dir}/`))) {
      continue;
    }
    const source = readFileSync(file, 'utf8');
    for (const retiredPath of RETIRED_CONTENT_PATHS) {
      const escaped = retiredPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const activeLink = new RegExp(`(?:href|guideHref)\\s*(?:=|:)\\s*['"]${escaped}['"]`);
      assert.doesNotMatch(source, activeLink, `${rel}: internal link still targets ${retiredPath}`);
    }
  }
}

function assertCanonicalHostSources() {
  assert.equal(SITE_URL, CANONICAL_ORIGIN, 'canonical SEO origin must not depend on deployment env');
  const sourceFiles = [...walk(join(ROOT, 'app')), ...walk(join(ROOT, 'lib'))];
  for (const file of sourceFiles) {
    const source = readFileSync(file, 'utf8');
    assert.doesNotMatch(source, /https:\/\/smlouvahned\.cz(?:\/|['"`])/, `${repoPath(file)}: apex absolute URL found`);
  }

  const robots = readFileSync(join(ROOT, 'public/robots.txt'), 'utf8');
  assert.match(robots, /Sitemap: https:\/\/www\.smlouvahned\.cz\/sitemap\.xml/);
  assert.doesNotMatch(robots, /https:\/\/smlouvahned\.cz/);

  const vercel = readFileSync(join(ROOT, 'vercel.json'), 'utf8');
  assert.match(vercel, /"destination": "https:\/\/www\.smlouvahned\.cz\/:path\*"/);
}

function assertPriorityCtrCopy() {
  const expectedCopy: Record<string, string> = {
    'app/dpp/layout.tsx': 'DPP online 2026 — dohoda o provedení práce v PDF',
    'app/blog/dpp-dohoda-provedeni-prace/page.tsx':
      'DPP 2026: limit 300 hodin, odvody a povinnosti',
    'app/blog/zkusebni-doba-2026/page.tsx':
      'Zkušební doba 2026: 4 a 8 měsíců, prodloužení',
    'app/blog/plna-moc-2026/page.tsx':
      'Plná moc 2026: vzor, náležitosti a ověření podpisu',
    'app/blog/smlouva-o-dilo-2026/page.tsx':
      'Smlouva o dílo 2026: vzor, náležitosti a chyby',
    'app/blog/minimalni-mzda-dpp-pracovni-smlouva-2026/page.tsx':
      'Minimální mzda 2026: částky a DPP',
    'app/blog/valorizace-najemneho-2026/page.tsx':
      'Valorizace nájemného 2026: inflační doložka',
    'app/blog/vraceni-kauce-po-skonceni-najmu-2026/page.tsx':
      'Vrácení kauce 2026: lhůta, zápočty a úroky',
    'app/blog/kupni-smlouva-na-auto-2026/page.tsx':
      'Co má obsahovat kupní smlouva na auto v roce 2026?',
  };
  for (const [path, copy] of Object.entries(expectedCopy)) {
    assert.match(readFileSync(join(ROOT, path), 'utf8'), new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  const minimumWageSlug = 'minimum-wage-dpp-czechia-2026-guide-en';
  const minimumWageArticle = getExpatBlogArticle(minimumWageSlug);
  assert.ok(minimumWageArticle?.seoTitle, 'EN minimum-wage guide needs a focused SERP title');
  assert.ok(minimumWageArticle?.seoDescription, 'EN minimum-wage guide needs a focused SERP description');
  assert.ok(`${minimumWageArticle.seoTitle} | SmlouvaHned.cz`.length <= 60, 'EN minimum-wage title is too long');
  assert.ok(minimumWageArticle.seoDescription.length <= 160, 'EN minimum-wage description is too long');

  const expectedMinimumWageAlternates = {
    cs: `${CANONICAL_ORIGIN}/blog/minimalni-mzda-dpp-pracovni-smlouva-2026`,
    en: `${CANONICAL_ORIGIN}/blog/expat/minimum-wage-dpp-czechia-2026-guide-en`,
    uk: `${CANONICAL_ORIGIN}/blog/expat/minimum-wage-dpp-czechia-2026-guide-ua`,
    'x-default': `${CANONICAL_ORIGIN}/blog/minimalni-mzda-dpp-pracovni-smlouva-2026`,
  };
  for (const slug of [
    'minimalni-mzda-dpp-pracovni-smlouva-2026',
    'minimum-wage-dpp-czechia-2026-guide-en',
    'minimum-wage-dpp-czechia-2026-guide-ua',
  ]) {
    assert.deepEqual(getBlogHreflangAlternates(slug), expectedMinimumWageAlternates);
  }
}

assertSitemapArchitecture();
assertRedirectArchitecture();
assertContentLanguageArchitecture();
assertNoInternalRedirectHops();
assertCanonicalHostSources();
assertPriorityCtrCopy();

console.log('SEO architecture tests passed (redirects, sitemap, www host, hreflang, links and CTR copy).');
