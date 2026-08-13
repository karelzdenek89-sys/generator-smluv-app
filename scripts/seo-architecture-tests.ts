import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import sitemap from '../app/sitemap';
import {
  CONTENT_CONSOLIDATION_REDIRECTS,
  RETIRED_CONTENT_PATHS,
} from '../lib/seo/content-consolidation-redirects';
import {
  getExpatBuilderCanonicalAlternates,
  getExpatHreflangLanguages,
} from '../lib/i18n/expat-hreflang';

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
      'DPP 2026: vzor dohody, limity, odvody a pravidla',
    'app/blog/zkusebni-doba-2026/page.tsx':
      'Zkušební doba 2026: 4 a 8 měsíců, prodloužení',
    'app/blog/plna-moc-2026/page.tsx':
      'Plná moc 2026: vzor, náležitosti a ověření podpisu',
    'app/blog/smlouva-o-dilo-2026/page.tsx':
      'Smlouva o dílo 2026: vzor, náležitosti a chyby',
  };
  for (const [path, copy] of Object.entries(expectedCopy)) {
    assert.match(readFileSync(join(ROOT, path), 'utf8'), new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
}

assertSitemapArchitecture();
assertRedirectArchitecture();
assertNoInternalRedirectHops();
assertCanonicalHostSources();
assertPriorityCtrCopy();

console.log('SEO architecture tests passed (redirects, sitemap, www host, hreflang, links and CTR copy).');
