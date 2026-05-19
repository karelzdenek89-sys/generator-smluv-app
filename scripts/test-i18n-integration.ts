/**
 * Integration tests for the foreigner localisation surface.
 * Validates routes, hreflang correctness, sitemap consistency, BCP-47 aliasing,
 * canonical URLs and language-switcher targets — all against a live dev server.
 *
 *   npm run dev                 # in one shell
 *   npx tsx scripts/test-i18n-integration.ts   # in another
 *
 * Exits non-zero on any failure.
 */

import { ALL_LOCALES, FOREIGN_LOCALES, LOCALE_META, type Locale } from '../lib/i18n/locales';

const BASE = process.env.TEST_BASE_URL || 'http://localhost:3000';
// Next.js metadata API resolves alternates against `metadataBase`, which is
// the production base URL even in dev. Compare against that for hreflang/canonical.
const PROD_BASE = (process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz').replace(/\/$/, '');
const failures: string[] = [];
let total = 0;

function check(name: string, ok: boolean, details?: string) {
  total++;
  if (ok) {
    console.log(`✓ ${name}`);
  } else {
    failures.push(name + (details ? `\n    ${details}` : ''));
    console.log(`✗ ${name}${details ? `\n    ${details}` : ''}`);
  }
}

async function fetchHtml(p: string, init?: RequestInit): Promise<{ status: number; html: string; headers: Headers; finalUrl: string }> {
  const r = await fetch(`${BASE}${p}`, { ...init, redirect: 'manual' });
  return { status: r.status, html: await r.text(), headers: r.headers, finalUrl: r.url };
}

async function run() {
  // ─── 1. All locale routes return 200 with correct <html lang> ────────────
  for (const loc of ALL_LOCALES) {
    const path = loc === 'cs' ? '/' : `/${LOCALE_META[loc].segment}`;
    const r = await fetchHtml(path);
    check(`GET ${path} returns 200`, r.status === 200, `got ${r.status}`);
    const langMatch = r.html.match(/<html[^>]*lang="([^"]+)"/);
    check(
      `<html lang> on ${path} === ${LOCALE_META[loc].htmlLang}`,
      langMatch?.[1] === LOCALE_META[loc].htmlLang,
      `expected lang="${LOCALE_META[loc].htmlLang}", got lang="${langMatch?.[1]}"`,
    );
  }

  // ─── 2. /vi 308-redirects to /vn (BCP-47 alias) ──────────────────────────
  {
    const r = await fetchHtml('/vi');
    check('/vi returns 308 redirect', r.status === 308, `got ${r.status}`);
    const loc = r.headers.get('location') || '';
    check('/vi Location header points to /en', loc.endsWith('/en') || loc.includes('/en'), `Location: ${loc}`);
  }
  {
    const r = await fetchHtml('/vi/najem');
    check('/vi/<path> also redirects to /en/<path>', r.status === 308 && (r.headers.get('location') || '').includes('/en'));
  }

  // ─── 3. Each foreign landing has correct canonical + hreflang links ─────
  // Next.js Metadata API emits camelCase `hrefLang=` attribute and resolves
  // URLs against `metadataBase` (production), not the dev origin.
  for (const loc of FOREIGN_LOCALES) {
    const meta = LOCALE_META[loc];
    const r = await fetchHtml(`/${meta.segment}`);
    const expectedCanonical = `${PROD_BASE}/${meta.segment}`;
    check(
      `canonical on /${meta.segment} === ${expectedCanonical}`,
      r.html.includes(`rel="canonical"`) && r.html.includes(`href="${expectedCanonical}"`),
    );
    for (const other of ALL_LOCALES) {
      const m = LOCALE_META[other];
      const expectedHref = m.segment ? `${PROD_BASE}/${m.segment}` : PROD_BASE;
      const ok = new RegExp(`hreflang="${m.htmlLang}"[^>]*href="${expectedHref.replace(/[/.]/g, x => `\\${x}`)}"`, 'i').test(r.html);
      check(`/${meta.segment} contains hreflang="${m.htmlLang}" → ${expectedHref}`, ok);
    }
    check(`/${meta.segment} contains hreflang="x-default"`, /hreflang="x-default"/i.test(r.html));
  }

  // ─── 4. No locale uses bare "vn" as hreflang (must be "vi", BCP-47) ─────
  for (const loc of FOREIGN_LOCALES) {
    const r = await fetchHtml(`/${LOCALE_META[loc].segment}`);
    check(
      `/${LOCALE_META[loc].segment} does NOT contain hreflang="vn" (BCP-47 violation)`,
      !/hreflang="vn"/i.test(r.html),
    );
  }

  // ─── 5. Sitemap contains entries for all locales + hreflang alternates ──
  {
    const r = await fetchHtml('/sitemap.xml');
    check('sitemap.xml returns 200', r.status === 200);
    for (const loc of FOREIGN_LOCALES) {
      check(`sitemap.xml lists /${LOCALE_META[loc].segment}`, r.html.includes(`/${LOCALE_META[loc].segment}<`) || r.html.includes(`/${LOCALE_META[loc].segment}"`));
      check(`sitemap.xml has hreflang="${LOCALE_META[loc].htmlLang}"`, r.html.includes(`hreflang="${LOCALE_META[loc].htmlLang}"`));
    }
    check('sitemap.xml does NOT use bare hreflang="vn"', !r.html.includes('hreflang="vn"'));
    check('sitemap.xml contains x-default', r.html.includes('hreflang="x-default"'));
  }

  // ─── 6. CZ home advertises every locale via hreflang alternates ─────────
  // (The language switcher button is a client component — dropdown items are
  // only rendered after hydration, so we check the SEO surface in the head.)
  {
    const r = await fetchHtml('/');
    for (const loc of ALL_LOCALES) {
      const m = LOCALE_META[loc];
      const expectedHref = m.segment ? `${PROD_BASE}/${m.segment}` : PROD_BASE;
      const ok = new RegExp(`hreflang="${m.htmlLang}"[^>]*href="${expectedHref.replace(/[/.]/g, x => `\\${x}`)}"`, 'i').test(r.html);
      check(`CZ homepage advertises hreflang="${m.htmlLang}" → ${expectedHref}`, ok);
    }
    check('CZ homepage <button> for language switcher present', /aria-haspopup="listbox"/.test(r.html));
  }

  // ─── 7. Prevailing-language disclaimer copy is present on each landing ──
  // Each landing must show the new safer wording (not "legally binding").
  const SAFER_PHRASE: Record<Exclude<Locale, 'cs'>, RegExp> = {
    en: /prevail|not a certified or official translation/i,
    ua: /переважа|переваг[ау] має|не є офіційним|не офіційний/i,
  };
  for (const loc of FOREIGN_LOCALES) {
    const r = await fetchHtml(`/${LOCALE_META[loc].segment}`);
    check(`/${LOCALE_META[loc].segment} uses prevailing-language wording (no risky "legally binding")`, SAFER_PHRASE[loc].test(r.html));
    check(`/${LOCALE_META[loc].segment} does NOT contain phrase "legally binding"`, !/legally binding/i.test(r.html));
  }

  // ─── 8. Immigration / certified-translation disclaimers present ─────────
  for (const loc of FOREIGN_LOCALES) {
    const r = await fetchHtml(`/${LOCALE_META[loc].segment}`);
    const text = r.html;
    const immigrationMarker: Record<Exclude<Locale, 'cs'>, RegExp> = {
      en: /immigration advice/i,
      ua: /імміграц/,
    };
    check(`/${LOCALE_META[loc].segment} mentions immigration-advice disclaimer`, immigrationMarker[loc].test(text));

    const certifiedMarker: Record<Exclude<Locale, 'cs'>, RegExp> = {
      en: /certified|soudní tlumočník/i,
      ua: /засвідч|не офіційний|soudní tlumočník/i,
    };
    check(`/${LOCALE_META[loc].segment} mentions certified-translation disclaimer`, certifiedMarker[loc].test(text));
  }

  // ─── Summary ────────────────────────────────────────────────────────────
  console.log(`\n${total - failures.length}/${total} checks passed.`);
  if (failures.length) {
    console.error(`\nFAILURES:`);
    for (const f of failures) console.error(' - ' + f);
    process.exit(1);
  }
}

run().catch(err => { console.error('FAILED:', err); process.exit(1); });
