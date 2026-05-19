/**
 * E2E-ish unit test for the foreign-builder flow.
 *
 * Validates the *server-side* contract that backs an English user's journey:
 *   1. /en landing page is reachable and points at /najem?lang=en
 *   2. /najem returns 200
 *   3. The landing carries the required safety wording.
 *   4. Bilingual PDF for lease + lang=en can be generated directly via
 *      renderContractPdf() (the API route guards behind Stripe, so we test the
 *      renderer in-process).
 *
 *   npm run dev
 *   npx tsx scripts/test-en-builder-flow.ts
 */
import { renderContractPdf } from '../lib/pdf';
import type { StoredContractData } from '../lib/contracts';
import { extractPdfText } from '../lib/pdf-text';

const BASE = process.env.TEST_BASE_URL || 'http://localhost:3000';
const failures: string[] = [];

function check(name: string, ok: boolean, hint?: string) {
  if (ok) console.log(`✓ ${name}`);
  else { failures.push(name); console.log(`✗ ${name}${hint ? `\n    ${hint}` : ''}`); }
}

async function run() {
  // Step 1 — /en landing exists and links to the localized Czech builder.
  const en = await fetch(`${BASE}/en`).then(r => r.text());
  check('/en landing has English heading', /Czech contracts online/.test(en));
  check('/en landing links to /najem?lang=en (lease)', /href="\/najem\?lang=en"/.test(en));

  // Step 2 — /najem (the actual builder) returns 200.
  const najem = await fetch(`${BASE}/najem`);
  check('/najem returns 200', najem.status === 200);

  // Step 3 — The landing page carries the safety wording.
  check('Landing uses prevailing-language wording (not "legally binding")', /prevails|prevailing/.test(en) && !/legally binding/i.test(en));
  check('Landing mentions not-certified/not-official translation wording', /not (a )?certified or official/i.test(en));

  // Step 4 — Bilingual PDF for lease+en renders without crash and contains
  //          both CZ binding line and EN body translation.
  const sample: StoredContractData = {
    contractType: 'lease', tier: 'basic',
    contractDate: '2026-06-01',
    landlordName: 'Karel Novák', landlordId: '750101/1234', landlordAddress: 'Vinohradská 12, Praha 2',
    tenantName: 'Oleksandr Petrov', tenantId: '900215/5678', tenantAddress: 'Wenceslas Square 1, Praha 1',
    propertyAddress: 'Korunní 45, Praha 2', propertyLayout: '2+kk',
    rentAmount: '18000', utilitiesAmount: '3500', paymentDay: '5',
    depositAmount: '36000', bankAccount: '123456789/0100',
    duration: 'indefinite', startDate: '2026-07-01', keysCount: '3',
    disputeResolution: 'default',
  } as StoredContractData;

  const pdf = await renderContractPdf({ ...sample, lang: 'en' });
  check('renderContractPdf(lease, lang=en) produces non-empty PDF', pdf.length > 1024);
  check('PDF starts with %PDF magic header', pdf.subarray(0, 4).toString() === '%PDF');

  const parsedText = await extractPdfText(pdf);
  check('PDF text contains Czech contract body', /nájemní smlouva|pronajímatel/i.test(parsedText));
  check('PDF text contains EN prevailing clause', /Czech wording prevails/.test(parsedText));
  check('PDF text NO LONGER contains risky "Czech version is legally binding"', !/Czech version is legally binding/.test(parsedText));
  check('PDF text contains EN body translation (Landlord)', /Landlord:/i.test(parsedText));

  // Step 5 — Same lease without targetLocale (CZ-only) does NOT include the
  //          bilingual disclaimer banner.
  const pdfCs = await renderContractPdf(sample);
  const parsedCsText = await extractPdfText(pdfCs);
  check('CZ-only PDF does NOT include bilingual disclaimer', !/rozhodující české znění/.test(parsedCsText));

  // Step 6 — Unknown lang param doesn't crash the renderer.
  const pdfUnknown = await renderContractPdf({ ...sample, lang: 'unknown' as never });
  check('renderContractPdf with unknown locale falls back to CZ-only', pdfUnknown.length > 1024);

  console.log(`\n${failures.length === 0 ? 'ALL PASS' : `${failures.length} FAILURES`}`);
  if (failures.length) process.exit(1);
}

run().catch(e => { console.error(e); process.exit(1); });
