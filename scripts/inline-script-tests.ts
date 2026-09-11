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
import { LOCALE_BOOTSTRAP_SCRIPT } from '../lib/locale-bootstrap';

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

console.log('Inline script tests passed (parsovatelnost, escapování, mapování lang).');
