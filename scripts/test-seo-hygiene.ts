import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sitemap from '../app/sitemap';
import { getLegacyLangRedirect } from '../lib/seo/legacy-lang-query';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function walkSource(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walkSource(path) : /\.(?:ts|tsx)$/.test(entry) ? [path] : [];
  });
}

function assertLangRedirect(source: string, expected: string, expectedLocale: 'cs' | 'en' | 'ua' | null) {
  const url = new URL(source);
  const result = getLegacyLangRedirect(url.pathname, url.searchParams);
  assert.ok(result, `${source}: expected redirect decision`);
  url.search = result.search;
  assert.equal(url.toString(), expected, `${source}: wrong canonical target`);
  assert.equal(result.preferredLocale, expectedLocale, `${source}: wrong locale preference`);
}

function main() {
  assertLangRedirect(
    'https://www.smlouvahned.cz/najem?lang=en',
    'https://www.smlouvahned.cz/najem',
    'en',
  );
  assertLangRedirect(
    'https://www.smlouvahned.cz/auto?package=vehicle_sale&lang=uk',
    'https://www.smlouvahned.cz/auto?package=vehicle_sale',
    'ua',
  );
  assertLangRedirect(
    'https://www.smlouvahned.cz/smlouva-o-dilo?lang=unsupported',
    'https://www.smlouvahned.cz/smlouva-o-dilo',
    null,
  );

  const successUrl = new URL(
    'https://www.smlouvahned.cz/success?session_id=test&lang=en',
  );
  assert.equal(
    getLegacyLangRedirect(successUrl.pathname, successUrl.searchParams),
    null,
    '/success must keep transactional lang query data',
  );

  const sitemapEntries = sitemap();
  assert.ok(sitemapEntries.length > 0, 'sitemap must not be empty');
  for (const entry of sitemapEntries) {
    assert.ok(!entry.url.includes('?'), `sitemap query URL found: ${entry.url}`);
  }

  const source = walkSource(join(ROOT, 'app'))
    .concat(walkSource(join(ROOT, 'lib')))
    .map((path) => readFileSync(path, 'utf8'))
    .join('\n');
  assert.doesNotMatch(
    source,
    /Závěrečná\s+[\u0400-\u04ff]+/u,
    'Czech “Závěrečná ustanovení” copy contains Cyrillic contamination',
  );

  const terms = readFileSync(join(ROOT, 'app/obchodni-podminky/page.tsx'), 'utf8');
  assert.doesNotMatch(terms, /consumers\/odr|platform[auy]?\s+(?:pro\s+)?online\s+řešení\s+sporů/i);
  assert.match(terms, /Českou obchodní inspekci \(ČOI\)/);
  assert.match(terms, /https:\/\/adr\.coi\.cz/);

  const landing = readFileSync(join(ROOT, 'app/components/ContractLandingSection.tsx'), 'utf8');
  assert.match(landing, /whenUnsuitable/);
  assert.match(landing, /Co dostanete/);
  assert.match(landing, /poslední doložené věcné právní revize/);
  assert.match(landing, /faqPageSchema/);

  console.log('SEO/legal hygiene tests passed (lang redirects, sitemap, Czech copy, ADR and trust blocks).');
}

main();
