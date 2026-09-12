/**
 * Inline skripty vložené přes dangerouslySetInnerHTML musí být platný JavaScript.
 *
 * Regrese: v `LOCALE_BOOTSTRAP_SCRIPT` byl regulární výraz zapsaný jako `/\/$/`
 * uvnitř template literalu. Tam se `\/` vyhodnotí jako `/`, takže se do stránky
 * vypsalo `replace(//$/,"")` — a `//` v JavaScriptu začíná řádkový komentář.
 * Výraz zůstal neuzavřený, skript spadl na „Unexpected end of input“ a přestal
 * srovnávat `<html lang>` na každé stránce webu. Prohlížeč to hlásí jen v konzoli,
 * takže si toho nikdo nevšiml.
 */
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { LOCALE_BOOTSTRAP_SCRIPT } from '../lib/locale-bootstrap';

const ROOT = process.cwd();

function assertParses(name: string, source: string) {
  try {
    // Jen parsuje, nespouští: konstruktor vyhodí SyntaxError na neplatném vstupu.
    new Function(source);
  } catch (error) {
    assert.fail(`${name} není platný JavaScript: ${(error as Error).message}`);
  }
}

assertParses('LOCALE_BOOTSTRAP_SCRIPT', LOCALE_BOOTSTRAP_SCRIPT);

// `//` uvozující komentář uvnitř výrazu je přesně ta past, na kterou se narazilo.
assert.ok(
  !/\(\/\//.test(LOCALE_BOOTSTRAP_SCRIPT),
  'LOCALE_BOOTSTRAP_SCRIPT obsahuje `(//` — zpětné lomítko se ztratilo při escapování',
);

// Skript musí skutečně useknout koncové lomítko, jinak `/najem/` nedostane lang.
assert.match(
  LOCALE_BOOTSTRAP_SCRIPT,
  /replace\(\/\\\/\$\/,""\)/,
  'chybí regulární výraz pro useknutí koncového lomítka',
);

// Chování: spuštěný skript nastaví lang podle cesty.
for (const [pathname, search, expected] of [
  ['/', '', 'cs'],
  ['/najem/', '', 'cs'],
  ['/en/rental-agreement-czech-republic', '', 'en'],
  ['/ua/car-sale-agreement-czech-republic', '', 'uk'],
  ['/blog/expat/deposit-return-czechia-2026-guide-ua', '', 'uk'],
  ['/blog/expat/deposit-return-czechia-2026-guide-en', '', 'en'],
  ['/najem', '?lang=en', 'en'],
  ['/najem', '?lang=ua', 'uk'],
  ['/dpp', '?lang=ukr', 'uk'],
] as const) {
  const documentElement = { lang: '' };
  const sandbox = {
    location: { pathname, search },
    document: { documentElement },
    URLSearchParams,
    Set,
  };
  new Function('location', 'document', 'URLSearchParams', 'Set', LOCALE_BOOTSTRAP_SCRIPT)(
    sandbox.location,
    sandbox.document,
    sandbox.URLSearchParams,
    sandbox.Set,
  );
  assert.equal(documentElement.lang, expected, `${pathname}${search} → očekáváno ${expected}`);
}


// ── JSON-LD vkládané přes dangerouslySetInnerHTML musí escapovat `<` ────────
//
// `JSON.stringify` neescapuje `<`, takže řetězec obsahující `</script>` ukončí
// script tag dřív, než má. Na webu, kde se v odpovědích běžně píšou ceny a
// porovnání, to není teoretické. `jsonLdScript()` z lib/schemas.ts to řeší;
// tenhle test hlídá, že ho nikdo neobejde přímým `JSON.stringify`.

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return walk(path);
    return /\.tsx?$/.test(entry) ? [path] : [];
  });
}

/** Vrátí celý výraz `dangerouslySetInnerHTML={{ … }}` párováním složených závorek. */
function extractInjection(source: string, start: number): string {
  let depth = 0;
  for (let i = source.indexOf('{', start); i < source.length; i += 1) {
    if (source[i] === '{') depth += 1;
    else if (source[i] === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  return source.slice(start);
}

/**
 * Vkládání, u kterých se `<` escapovat nemusí: hodnota pochází z uzavřené
 * množiny, ne z obsahu stránky.
 */
const ESCAPE_EXEMPT = new Set(['app/[locale]/layout.tsx']);

const unescaped: string[] = [];
for (const file of walk(join(ROOT, 'app'))) {
  const rel = relative(ROOT, file).split('\\').join('/');
  if (ESCAPE_EXEMPT.has(rel)) continue;
  const source = readFileSync(file, 'utf8');
  for (let i = source.indexOf('dangerouslySetInnerHTML'); i !== -1; i = source.indexOf('dangerouslySetInnerHTML', i + 1)) {
    const expr = extractInjection(source, i);
    if (!expr.includes('JSON.stringify')) continue;
    if (expr.includes('jsonLdScript') || expr.includes('u003c')) continue;
    unescaped.push(`${rel} (offset ${i})`);
  }
}
assert.deepEqual(
  unescaped,
  [],
  `JSON-LD vkládané bez escapování \`<\`; použij jsonLdScript(): ${unescaped.join(', ')}`,
);

// ── Deploy-readiness IndexNow ──────────────────────────────────────────────
//
// Workflow dřív čekal na statický klíčový soubor IndexNow, který je napříč
// deploymenty identický — kontrola prošla okamžitě a odeslala starou sitemapu.
// Musí čekat na commit, který se právě nasazuje.
const indexNowWorkflow = readFileSync(join(ROOT, '.github/workflows/seznam-indexnow.yml'), 'utf8');
assert.match(indexNowWorkflow, /\/api\/version/, 'IndexNow musí ověřit nasazený commit přes /api/version');
assert.match(indexNowWorkflow, /EXPECTED_COMMIT/, 'IndexNow musí znát očekávaný commit');
assert.match(
  indexNowWorkflow,
  /Refusing to submit a stale sitemap/,
  'IndexNow nesmí odeslat sitemapu ze starého buildu',
);
assert.ok(
  readFileSync(join(ROOT, 'app/api/version/route.ts'), 'utf8').includes('VERCEL_GIT_COMMIT_SHA'),
  '/api/version musí vracet nasazený commit',
);

console.log('Inline script tests passed (parsovatelnost, escapování, mapování lang, JSON-LD, IndexNow).');
