import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { GSC_PAGE_SNAPSHOTS, classifyGscSnapshot } from '../lib/gsc-monetization-candidates';
import { freeDocumentTokenMatches } from '../lib/free-documents';
import { getMonetizationPolicy } from '../lib/monetization-policy';

const enabled = { FREE_FUNNEL_EXPERIMENTS_ENABLED: 'true' };
const disabled = { FREE_FUNNEL_EXPERIMENTS_ENABLED: 'false' };

assert.equal(getMonetizationPolicy('dpp', 'cs', enabled).mode, 'free_experiment');
assert.equal(getMonetizationPolicy('dpp', 'cs', disabled).mode, 'paid');
assert.equal(getMonetizationPolicy('dpp', 'en', enabled).mode, 'paid');
assert.equal(getMonetizationPolicy('employment', 'cs', enabled).mode, 'paid');
assert.equal(classifyGscSnapshot(GSC_PAGE_SNAPSHOTS[0]), 'free_experiment_candidate');
assert.equal(freeDocumentTokenMatches('7ec95f1f-token', '7ec95f1f-token'), true);
assert.equal(freeDocumentTokenMatches('7ec95f1f-token', '7ec95f1f-other'), false);
assert.equal(freeDocumentTokenMatches('short', 'longer'), false);

const freeCreate = readFileSync(resolve('app/api/contracts/free/route.ts'), 'utf8');
const freeDownload = readFileSync(resolve('app/api/contracts/free/download/route.ts'), 'utf8');
const paidDownload = readFileSync(resolve('app/api/contracts/download/route.ts'), 'utf8');

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

console.log('Monetization policy/free-flow security tests passed.');
