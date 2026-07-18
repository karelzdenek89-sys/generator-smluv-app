/**
 * Focused value audit for checkout add-ons.
 *
 * It verifies that each paid add-on is both sellable only when deliverable
 * and represented in the generated output or download entitlement.
 */
import assert from 'node:assert/strict';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import {
  getArchiveDaysWithAddons,
  getAvailableCheckoutAddons,
  getCheckoutAddonIncludedItems,
  getCheckoutAddonsTotalCzk,
  normalizeCheckoutAddons,
} from '../lib/checkout-addons';
import { renderContractPdf } from '../lib/pdf';
import { renderContractDocx } from '../lib/docx';
import { extractPdfText } from '../lib/pdf-text';
import type { StoredContractData } from '../lib/contracts';

const leaseSample: StoredContractData = {
  contractType: 'lease',
  tier: 'basic',
  landlordName: 'Jan Novak',
  landlordId: '800101/1234',
  landlordAddress: 'Praha 1',
  tenantName: 'Petr Svoboda',
  tenantId: '900101/1234',
  tenantAddress: 'Praha 2',
  propertyAddress: 'Vinohradska 1, Praha',
  propertyLayout: '2+kk',
  rentAmount: '18000',
  utilitiesAmount: '3500',
  depositAmount: '36000',
  startDate: '2026-06-01',
  duration: 'fixed',
  endDate: '2027-05-31',
  paymentDay: '5',
  handoverDate: '2026-06-01',
  handoverPlace: 'Vinohradska 1, Praha',
  keysCount: '2',
  electricityMeter: '12345',
  waterMeter: '456',
};

const carSample: StoredContractData = {
  contractType: 'car_sale',
  tier: 'basic',
  sellerName: 'Seller Test',
  sellerId: '800101/1234',
  sellerAddress: 'Praha',
  buyerName: 'Buyer Test',
  buyerId: '900101/1234',
  buyerAddress: 'Brno',
  carMake: 'Skoda',
  carModel: 'Octavia',
  carVIN: 'TMB12345678901234',
  carPlate: '1AB 2345',
  carMileage: '120000',
  priceAmount: '250000',
  paymentMethod: 'transfer',
  paymentDueDays: '3',
  handoverDate: '2026-06-15',
  handoverPlace: 'Praha',
  keysAndDocs: '2 klice, technicky prukaz',
};

function keysFor(contractType: string, tier = 'basic', packageKey: string | null = null, locale = 'cs') {
  return getAvailableCheckoutAddons(contractType, tier as 'basic' | 'complete', packageKey, locale).map(
    (addon) => addon.key,
  );
}

async function pdfOutput(data: StoredContractData) {
  const pdf = await renderContractPdf(data);
  const parsed = await pdfParse(pdf);
  const text = await extractPdfText(pdf);
  return { pdf, pages: parsed.numpages, text };
}

async function main() {
  assert.deepEqual(getCheckoutAddonIncludedItems(['docx']), ['Editovatelná DOCX verze dokumentu']);
  assert.equal(getCheckoutAddonsTotalCzk(['docx', 'handover_protocol']), 128);
  assert.equal(getArchiveDaysWithAddons('basic', null, ['extended_archive']), 90);

  assert.ok(keysFor('lease', 'basic', null, 'cs').includes('handover_protocol'));
  assert.ok(keysFor('car_sale', 'basic', null, 'cs').includes('handover_protocol'));
  assert.ok(!keysFor('gift', 'basic', null, 'cs').includes('handover_protocol'));
  assert.ok(keysFor('lease', 'basic', null, 'en').includes('bilingual_contract'));
  assert.ok(!keysFor('lease', 'basic', null, 'en').includes('bilingual_annex'));
  assert.ok(!keysFor('lease', 'basic', null, 'cs').includes('bilingual_contract'));
  assert.ok(keysFor('employment', 'basic', null, 'ua').includes('bilingual_contract'));
  assert.ok(!keysFor('gift', 'basic', null, 'en').includes('bilingual_annex'));
  assert.ok(!keysFor('lease', 'complete', null, 'cs').includes('signing_checklist'));
  assert.ok(!keysFor('lease', 'basic', 'landlord', 'cs').includes('handover_protocol'));

  assert.deepEqual(
    normalizeCheckoutAddons(['bilingual_annex', 'handover_protocol'], 'gift', 'basic', null, 'en'),
    [],
  );

  const baseLease = await pdfOutput(leaseSample);
  assert.doesNotMatch(baseLease.text, /PROTOKOL O PŘEDÁNÍ A PŘEVZETÍ BYTU/i);

  const leaseHandover = await pdfOutput({ ...leaseSample, addOns: ['handover_protocol'] });
  assert.ok(leaseHandover.pages > baseLease.pages, 'lease handover add-on should add protocol pages');
  assert.match(leaseHandover.text, /PROTOKOL O PŘEDÁNÍ A PŘEVZETÍ BYTU/i);

  const carHandover = await pdfOutput({ ...carSample, addOns: ['handover_protocol'] });
  assert.match(carHandover.text, /PŘEDÁVACÍ PROTOKOL K VOZIDLU/i);

  const checklistPdf = await renderContractPdf({ ...leaseSample, addOns: ['signing_checklist'] });
  const checklistParsed = await pdfParse(checklistPdf);
  const checklistText = await extractPdfText(checklistPdf);
  assert.ok(checklistParsed.numpages >= 2, 'signing checklist add-on should add appendix pages');
  assert.match(checklistText, /KONTROLNÍ SEZNAM/i);

  const noAnnex = await pdfOutput({ ...leaseSample, lang: 'en' });
  const annex = await pdfOutput({ ...leaseSample, lang: 'en', addOns: ['bilingual_annex'] });
  assert.doesNotMatch(noAnnex.text, /Explanatory English Translation Annex/i);
  assert.match(annex.text, /Explanatory English Translation Annex/i);

  const docx = await renderContractDocx({ ...leaseSample, addOns: ['docx'] });
  assert.ok(docx.length > 7_000, 'DOCX add-on should produce a non-empty Word document');

  console.log('Add-on value audit passed (DOCX, checklist, handover, archive, bilingual).');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
