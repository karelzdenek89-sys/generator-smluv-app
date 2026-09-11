import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  GSC_PAGE_SNAPSHOTS,
  classifyGscSnapshot,
  hasEnoughTrafficForExperiment,
  monthlyClickRate,
} from '../lib/gsc-monetization-candidates';
import { freeDocumentTokenMatches } from '../lib/free-documents';
import { getMonetizationPolicy } from '../lib/monetization-policy';
import { getFreeBasicPdfCopy } from '../lib/monetization-copy';
import { getAvailableCheckoutAddons, getCheckoutAddonIncludedItems } from '../lib/checkout-addons';
import { getFulfilmentContractName } from '../lib/i18n/fulfilment-email';

const enabled = { FREE_FUNNEL_EXPERIMENTS_ENABLED: 'true' };
const disabled = { FREE_FUNNEL_EXPERIMENTS_ENABLED: 'false' };

// Experiment gsc_dpp_free_2026_08 je ukončen. Placený režim teď platí i při
// zapnutém globálním flagu — jinak by DPP znovu zdarma zapnula samotná
// existence proměnné v prostředí, bez nového rozhodnutí.
assert.equal(getMonetizationPolicy('dpp', 'cs', enabled).mode, 'paid');
assert.equal(getMonetizationPolicy('dpp', 'cs', disabled).mode, 'paid');
assert.match(getMonetizationPolicy('dpp', 'cs', enabled).reason, /ukončen/);
assert.equal(getMonetizationPolicy('dpp', 'en', enabled).mode, 'paid');
assert.equal(getMonetizationPolicy('dpp', 'ua', enabled).mode, 'paid');
assert.equal(getMonetizationPolicy('employment', 'cs', enabled).mode, 'paid');
assert.match(getMonetizationPolicy('dpp', 'en', enabled).reason, /^Default paid mode/);
assert.match(getMonetizationPolicy('dpp', 'ua', enabled).reason, /^Стандартний платний режим/);
assert.equal(getFreeBasicPdfCopy('en').priceLabel, 'Free');
assert.equal(getFreeBasicPdfCopy('ua').priceLabel, 'Безкоштовно');
assert.doesNotMatch(getFreeBasicPdfCopy('en').generateCta, /Zdarma|Vygenerovat/);
assert.doesNotMatch(getFreeBasicPdfCopy('ua').generateCta, /Zdarma|Vygenerovat/);
assert.equal(getFulfilmentContractName('dpp', 'en'), 'Czech agreement to perform work (DPP)');
assert.equal(getFulfilmentContractName('dpp', 'ua'), 'Чеська угода про виконання роботи (DPP)');
assert.equal(getAvailableCheckoutAddons('dpp', 'basic', null, 'en')[0]?.title, 'Editable DOCX version');
assert.equal(getAvailableCheckoutAddons('dpp', 'basic', null, 'ua')[0]?.title, 'Редагована версія DOCX');
assert.equal(getCheckoutAddonIncludedItems(['docx'], 'en')[0], 'Editable DOCX version of the document');
// Blogový článek nesmí založit cenový experiment: cena dokumentu neovlivní,
// jak často lidé kliknou na článek ve výsledcích hledání.
for (const snapshot of GSC_PAGE_SNAPSHOTS) {
  assert.equal(classifyGscSnapshot(snapshot), 'out_of_scope');
  assert.equal(snapshot.pageKind, 'blog');
  // Každý snapshot musí nést období, jinak ho nelze s ničím porovnat.
  assert.ok(snapshot.observedAt, `${snapshot.page}: chybí observedAt`);
  assert.ok(snapshot.observedDays, `${snapshot.page}: chybí observedDays`);
  // A musí mít dost provozu, aby experiment vůbec mohl něco změřit.
  assert.equal(hasEnoughTrafficForExperiment(snapshot), false);
}

// Produktová stránka se slabým CTR na dosah první strany je platný kandidát.
assert.equal(
  classifyGscSnapshot({
    page: '/nejaky-generator',
    impressions: 4000,
    clicks: 8,
    ctrPercent: 0.2,
    averagePosition: 8,
    source: 'test',
    observedAt: '2026-09-11',
    observedDays: 30,
    pageKind: 'product',
  }),
  'free_experiment_candidate',
);

// Málo dat zůstává málo dat i u produktu.
assert.equal(
  classifyGscSnapshot({
    page: '/nejaky-generator',
    impressions: 58,
    clicks: 0,
    ctrPercent: 0,
    averagePosition: 9,
    source: 'test',
    observedAt: '2026-09-11',
    observedDays: 32,
    pageKind: 'product',
  }),
  'low_data',
);

assert.equal(monthlyClickRate({
  page: '/x', impressions: 100, clicks: 30, ctrPercent: 30, averagePosition: 5,
  source: 'test', observedAt: '2026-09-11', observedDays: 30,
}), 30);
assert.equal(monthlyClickRate({
  page: '/x', impressions: 100, clicks: 30, ctrPercent: 30, averagePosition: 5,
  source: 'test', observedAt: null,
}), null);
assert.equal(freeDocumentTokenMatches('7ec95f1f-token', '7ec95f1f-token'), true);
assert.equal(freeDocumentTokenMatches('7ec95f1f-token', '7ec95f1f-other'), false);
assert.equal(freeDocumentTokenMatches('short', 'longer'), false);

const freeCreate = readFileSync(resolve('app/api/contracts/free/route.ts'), 'utf8');
const freeDownload = readFileSync(resolve('app/api/contracts/free/download/route.ts'), 'utf8');
const paidDownload = readFileSync(resolve('app/api/contracts/download/route.ts'), 'utf8');
const secureDownloadPage = readFileSync(resolve('app/stahnout/page.tsx'), 'utf8');
const successPage = readFileSync(resolve('app/success/page.tsx'), 'utf8');

assert.match(freeCreate, /readFirstPartyJson/);
assert.match(freeCreate, /validateContractPayload/);
assert.match(freeCreate, /validateCurrentCheckoutConsent/);
assert.match(freeCreate, /takeRateLimit/);
assert.match(freeCreate, /isFreeBasicPolicy/);
assert.doesNotMatch(freeCreate, /stripe\.checkout/);
assert.match(freeDownload, /freeDocumentTokenMatches/);
assert.match(freeDownload, /record\.tier !== 'basic'/);
assert.match(freeDownload, /Cache-Control': 'no-store/);
assert.doesNotMatch(freeDownload, /renderContractDocx/);
assert.match(paidDownload, /session\.payment_status === 'paid'/);
assert.match(paidDownload, /stripe\.checkout\.sessions\.retrieve/);
assert.match(secureDownloadPage, /Secure document download/);
assert.match(secureDownloadPage, /Безпечне завантаження документа/);
assert.match(successPage, /Payment received/);
assert.match(successPage, /Платіж отримано/);

console.log('Monetization policy/free-flow security tests passed.');
