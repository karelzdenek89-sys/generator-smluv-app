import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const freeExperiment = process.env.FREE_FUNNEL_EXPERIMENTS_ENABLED === 'true';

function readBuiltHtml(routePath: string): string {
  return readFileSync(resolve('.next/server/app', routePath), 'utf8');
}

function visibleText(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#xA0;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#x27;|&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

const dppHtml = readBuiltHtml('dpp.html');
const dppText = visibleText(dppHtml);
const homeHtml = readBuiltHtml('index.html');
const homeText = visibleText(homeHtml);
const guideText = visibleText(readBuiltHtml('dohoda-o-provedeni-prace.html'));
const mainArticleHtml = readBuiltHtml('blog/dpp-dohoda-provedeni-prace.html');
const mainArticleText = visibleText(mainArticleHtml);
const comparisonArticleText = visibleText(readBuiltHtml('blog/dpp-dpc-porovnani-2026.html'));
const freeTemplateArticleHtml = readBuiltHtml('blog/dpp-vzor-zdarma-2026.html');
const freeTemplateArticleText = visibleText(freeTemplateArticleHtml);
const faqText = visibleText(readBuiltHtml('faq.html'));

assert.match(mainArticleHtml, /<time[^>]+dateTime="2026-03-18"[^>]*>18\. března 2026<\/time>/);
assert.match(mainArticleHtml, /"datePublished":"2026-03-18T/);
assert.match(mainArticleHtml, /"dateModified":"2026-03-18T/);
assert.match(freeTemplateArticleHtml, /<time[^>]+dateTime="2026-05-20"[^>]*>20\. května 2026<\/time>/);
assert.match(freeTemplateArticleHtml, /"datePublished":"2026-05-20T/);
assert.match(freeTemplateArticleHtml, /"dateModified":"2026-05-20T/);

for (const [sourcePath, articleSlug] of [
  ['app/blog/dpp-dpc-porovnani-2026/page.tsx', 'dpp-dpc-porovnani-2026'],
  ['app/blog/dpp-vzor-zdarma-2026/page.tsx', 'dpp-vzor-zdarma-2026'],
] as const) {
  const source = readFileSync(resolve(sourcePath), 'utf8');
  const inlineCtas = source.match(/<ArticleInlineCta\b[\s\S]*?\/>/g) ?? [];
  assert.ok(inlineCtas.length > 0, `${sourcePath} must contain a measured ArticleInlineCta`);
  for (const inlineCta of inlineCtas) {
    assert.ok(
      inlineCta.includes(`articleSlug="${articleSlug}"`),
      `${sourcePath} contains ArticleInlineCta without articleSlug="${articleSlug}"`,
    );
  }
}

assert.match(faqText, /Před dokončením formuláře se můžete vrátit/);
assert.ok(!faqText.includes('Před zaplacením se můžete vrátit'));
assert.match(faqText, /Bez vaší výslovné žádosti a souhlasu data ze smlouvy žádnému konkrétnímu partnerovi nepředáváme/);
assert.ok(!homeText.includes('k 1. 1. 2026'));
assert.ok(!mainArticleText.includes('k 1. 1. 2026'));
assert.ok(!freeTemplateArticleText.includes('k 1. 1. 2026'));

if (freeExperiment) {
  assert.match(dppHtml, /<title>DPP 2026 zdarma/);
  assert.match(dppHtml, /"lowPrice":"0"/);
  assert.match(dppText, /Základní dokument Zdarma/);
  assert.match(dppText, /Vygenerovat základní DPP zdarma/);
  assert.match(dppText, /Základní PDF ke stažení zdarma, bez platby a bez registrace/);
  assert.match(dppText, /Dostanu základní DPP opravdu zdarma\?/);
  assert.match(dppText, /základní PDF zdarma vygenerujete po dokončení formuláře/);
  assert.match(dppText, /Dokument připraven k vygenerování/);

  const paidBasicClaims = [
    'Základní dokument 99 Kč',
    'Okamžité PDF ke stažení po zaplacení',
    'Stažení ihned po ověřené platbě',
    'Po zaplacení získáte výstup odpovídající zvolené variantě',
    'Náhled před platbou',
    'Dostanu dokument ihned po zaplacení?',
    'Dostupnost odkazu ke stažení 7 dní',
    'PDF odemknete až po dokončení objednávky',
    'Dokument připraven k odemknutí',
    'po zaplacení',
  ];
  for (const claim of paidBasicClaims) {
    assert.ok(
      !dppText.toLocaleLowerCase('cs').includes(claim.toLocaleLowerCase('cs')),
      `free SSR still contains paid Basic claim: ${claim}`,
    );
  }

  assert.match(homeText, /DPP — Dohoda o provedení práce .*? Zdarma/);
  assert.match(homeHtml, /základní DPP zdarma, další dokumenty od 99 Kč/i);
  assert.ok(!guideText.includes('Od 99 Kč · PDF ke stažení'));
  assert.match(guideText, /Základní PDF 0 Kč · rozšířená varianta 199 Kč/);
  assert.ok(!mainArticleText.includes('Od 99 Kč · Dle ZP'));
  assert.match(mainArticleText, /Základní PDF 0 Kč · rozšířená varianta 199 Kč/);
  assert.ok(!comparisonArticleText.includes('PDF ke stažení od 99 Kč'));
  assert.match(comparisonArticleText, /Základní PDF 0 Kč · rozšířená varianta 199 Kč/);
  assert.ok(!freeTemplateArticleText.includes('PDF ihned ke stažení po platbě'));
  assert.match(freeTemplateArticleText, /Základní PDF ihned ke stažení zdarma, bez registrace/);
  assert.match(faqText, /Základní DPP je v aktivním experimentu zdarma/);
  assert.match(faqText, /Údaje pro bezplatnou základní DPP jsou v šifrovaném úložišti automaticky smazány po 24 hodinách/);
} else {
  assert.match(dppHtml, /<title>DPP online 2026/);
  assert.match(dppHtml, /"lowPrice":"99"/);
  assert.match(dppText, /Základní dokument 99 Kč/);
  assert.match(dppText, /Okamžité PDF ke stažení po zaplacení/);
  assert.match(dppText, /Dostanu dokument ihned po zaplacení\?/);
  assert.match(dppText, /Dokument připraven k odemknutí/);
  assert.match(dppText, /PDF odemknete až po dokončení objednávky/);
  assert.ok(!dppText.includes('Vygenerovat základní DPP zdarma'));
  assert.ok(!dppHtml.includes('"lowPrice":"0"'));

  assert.match(homeText, /DPP — Dohoda o provedení práce .*? od 99 Kč/);
  assert.match(guideText, /99–199 Kč · PDF ke stažení/);
  assert.match(mainArticleText, /99–199 Kč · Dle ZP/);
  assert.match(comparisonArticleText, /99–199 Kč/);
  assert.match(freeTemplateArticleText, /PDF ihned ke stažení po platbě/);
  assert.match(faqText, /Základní dokument 99 Kč/);
}

console.log(`DPP SSR consistency tests passed (${freeExperiment ? 'free_experiment' : 'paid'}).`);
