/**
 * Output quality smoke for generated PDF and DOCX files.
 *
 * This is not a legal review. It catches product-quality regressions:
 * broken renderers, empty output, missing add-on appendices, mojibake,
 * undefined/null leaks, and DOCX files that are not structured documents.
 *
 * Run: npx tsx scripts/audit-output-quality.ts
 */
import assert from 'node:assert/strict';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import { renderContractPdf } from '../lib/pdf';
import { renderContractDocx } from '../lib/docx';
import { extractPdfText } from '../lib/pdf-text';
import type { ContractType, StoredContractData, Tier } from '../lib/contracts';

const CONTRACT_TYPES: ContractType[] = [
  'lease',
  'car_sale',
  'gift',
  'work_contract',
  'loan',
  'nda',
  'general_sale',
  'employment',
  'dpp',
  'service',
  'sublease',
  'power_of_attorney',
  'debt_acknowledgment',
  'cooperation',
];

const TIERS: Tier[] = ['basic', 'professional', 'complete'];

const FORBIDDEN_OUTPUT = [
  /\bundefined\b/i,
  /\bnull\b/i,
  /\bNaN\b/i,
  /\[object Object\]/i,
  /\bTODO\b|\bFIXME\b/i,
  /MĂ|ÄŤ|Ĺ™|Đ[^\s<]{1,4}/,
];

const TITLE_MARKERS: Record<ContractType, RegExp> = {
  lease: /nájemní smlouva/i,
  car_sale: /kupní smlouva na vozidlo/i,
  gift: /darovací smlouva/i,
  work_contract: /smlouva o dílo/i,
  loan: /smlouva o zápůjčce/i,
  nda: /smlouva o mlčenlivosti|nda/i,
  general_sale: /kupní smlouva/i,
  employment: /pracovní smlouva/i,
  dpp: /dohoda o provedení práce/i,
  service: /smlouva o poskytování služeb/i,
  sublease: /podnájemní smlouva/i,
  power_of_attorney: /plná moc/i,
  debt_acknowledgment: /uznání dluhu/i,
  cooperation: /smlouva o spolupráci/i,
};

function sample(type: ContractType): StoredContractData {
  const base = {
    contractDate: '2026-05-26',
    disputeResolution: 'mediation',
  } satisfies Partial<StoredContractData>;

  switch (type) {
    case 'lease':
      return {
        ...base,
        contractType: type,
        landlordName: 'Jan Novák',
        landlordId: '800101/1234',
        landlordAddress: 'Praha 1',
        tenantName: 'Petr Svoboda',
        tenantId: '900101/1234',
        tenantAddress: 'Praha 2',
        propertyAddress: 'Vinohradská 1, Praha',
        propertyLayout: '2+kk',
        rentAmount: '18000',
        utilitiesAmount: '3500',
        depositAmount: '36000',
        startDate: '2026-06-01',
        duration: 'fixed',
        endDate: '2027-05-31',
        paymentDay: '5',
        handoverDate: '2026-06-01',
        keysCount: '2',
      };
    case 'car_sale':
      return {
        ...base,
        contractType: type,
        sellerName: 'Seller Test',
        sellerId: '800101/1234',
        sellerAddress: 'Praha',
        buyerName: 'Buyer Test',
        buyerId: '900101/1234',
        buyerAddress: 'Brno',
        carMake: 'Škoda',
        carModel: 'Octavia',
        carVIN: 'TMB12345678901234',
        carMileage: '120000',
        priceAmount: '250000',
        paymentMethod: 'transfer',
        paymentDueDays: '3',
        handoverDate: '2026-06-15',
      };
    case 'gift':
      return { ...base, contractType: type, donorName: 'Anna Dárkyně', doneeName: 'Boris Obdarovaný', giftType: 'money', amount: '50000', currency: 'Kč' };
    case 'work_contract':
      return { ...base, contractType: type, clientName: 'Objednatel s.r.o.', contractorName: 'Zhotovitel s.r.o.', workTitle: 'Rekonstrukce koupelny', workDescription: 'Kompletní rekonstrukce koupelny', workLocation: 'Praha', priceAmount: '120000', currency: 'Kč', startDate: '2026-06-01', endDate: '2026-07-15' };
    case 'loan':
      return { ...base, contractType: type, lenderName: 'Marie Věřitelová', borrowerName: 'Lukáš Dlužník', loanAmount: '100000', repaymentType: 'installments', installmentCount: '10', installmentAmount: '10000', firstPaymentDate: '2026-07-01', paymentDay: '1', securityType: 'guarantee', guarantorName: 'Eva Ručitelová' };
    case 'nda':
      return { ...base, contractType: type, disclosingParty: 'Alfa s.r.o.', receivingParty: 'Beta s.r.o.', purpose: 'Obchodní spolupráce', confidentialityDurationYears: '3' };
    case 'general_sale':
      return { ...base, contractType: type, sellerName: 'Prodávající Test', buyerName: 'Kupující Test', itemDescription: 'Notebook Lenovo ThinkPad', price: '25000', currency: 'Kč', priceWords: 'dvacet pět tisíc korun českých' };
    case 'employment':
      return { ...base, contractType: type, employerName: 'ACME s.r.o.', employerIco: '12345678', employerAddress: 'Praha', employeeName: 'Jane Worker', employeeBirth: '1990-01-01', employeeAddress: 'Brno', jobTitle: 'Developer', workPlace: 'Praha', startDate: '2026-06-01', salary: '60000', salaryType: 'monthly', employmentType: 'indefinite' };
    case 'dpp':
      return { ...base, contractType: type, employerName: 'ACME s.r.o.', employerIco: '12345678', employerAddress: 'Praha', employeeName: 'Jan Brigádník', employeeBirth: '1995-05-05', employeeAddress: 'Brno', taskDescription: 'IT support', workPlace: 'Praha', estimatedHours: '80', remunerationType: 'fixed', totalRemuneration: '40000', durationType: 'fixed', startDate: '2026-06-01', endDate: '2026-12-31', toolsProvided: 'employer' };
    case 'service':
      return { ...base, contractType: type, providerName: 'Poskytovatel s.r.o.', clientName: 'Klient s.r.o.', serviceDescription: 'Marketingové konzultace', priceModel: 'monthly', monthlyFee: '15000', startDate: '2026-06-01' };
    case 'sublease':
      return { ...base, contractType: type, landlordName: 'Hlavní nájemce', landlordId: '800101/1234', landlordAddress: 'Praha', tenantName: 'Podnájemce', tenantId: '900101/1234', tenantAddress: 'Brno', flatAddress: 'Vinohradská 1, Praha', rentAmount: '15000', startDate: '2026-06-01', duration: 'fixed', endDate: '2027-05-31', landlordConsent: 'yes', consentDate: '2026-05-01' };
    case 'power_of_attorney':
      return { ...base, contractType: type, principalName: 'Anna Zmocnitelka', principalId: '800101/1234', principalAddress: 'Praha', agentName: 'Bob Zmocněnec', agentId: '900101/1234', agentAddress: 'Brno', poaType: 'general', customScope: 'Zastupování před českými úřady', validUntil: '2026-12-31' };
    case 'debt_acknowledgment':
      return { ...base, contractType: type, creditorName: 'Věřitel Test', debtorName: 'Dlužník Test', debtAmount: '50000', currency: 'Kč', repaymentType: 'single', repaymentDate: '2027-05-15', debtOrigin: 'loan', debtDate: '2026-01-15' };
    case 'cooperation':
      return { ...base, contractType: type, partyAName: 'Alfa s.r.o.', partyBName: 'Beta s.r.o.', cooperationDescription: 'Společný marketingový projekt', cooperationScope: 'Marketing', cooperationGoal: 'Zvýšení prodeje', feeMode: 'fixed', fixedFee: '20000' };
  }
}

function assertNoForbidden(text: string, label: string) {
  for (const re of FORBIDDEN_OUTPUT) {
    assert.doesNotMatch(text, re, `${label}: forbidden output artefact ${re}`);
  }
}

async function auditPdf(data: StoredContractData, label: string) {
  const pdf = await renderContractPdf(data);
  assert.ok(pdf.subarray(0, 5).toString('ascii') === '%PDF-', `${label}: invalid PDF header`);
  assert.ok(pdf.subarray(Math.max(0, pdf.length - 64)).toString('latin1').includes('%%EOF'), `${label}: missing EOF`);
  assert.ok(pdf.length > 25_000, `${label}: suspiciously small PDF (${pdf.length} B)`);

  const parsed = await pdfParse(pdf);
  assert.ok(parsed.numpages >= 1, `${label}: no pages`);

  const text = await extractPdfText(pdf);
  assert.ok(text.length > 600, `${label}: extracted PDF text too short`);
  assert.match(text, TITLE_MARKERS[data.contractType], `${label}: missing document title marker`);
  assertNoForbidden(text, label);
  return { bytes: pdf.length, pages: parsed.numpages };
}

async function auditDocx(data: StoredContractData, label: string) {
  const docx = await renderContractDocx(data);
  assert.ok(docx.length > 7_000, `${label}: suspiciously small DOCX (${docx.length} B)`);

  const mod = await import('jszip');
  const JSZip = mod.default;
  const zip = await JSZip.loadAsync(docx);
  const documentXml = await zip.file('word/document.xml')?.async('string');
  assert.ok(documentXml, `${label}: missing word/document.xml`);
  assert.match(documentXml, /<w:tbl>/, `${label}: DOCX should contain structured tables`);
  assert.match(documentXml, /SmlouvaHned\.cz/, `${label}: missing generator footer/notice`);

  const text = documentXml.replace(/<[^>]+>/g, ' ');
  assert.match(text, TITLE_MARKERS[data.contractType], `${label}: missing DOCX title marker`);
  assertNoForbidden(text, label);
  return { bytes: docx.length };
}

async function main() {
  const rows: string[] = [];

  for (const contractType of CONTRACT_TYPES) {
    for (const tier of TIERS) {
      const data = { ...sample(contractType), tier };
      const pdf = await auditPdf(data, `${contractType}/${tier}/pdf`);
      rows.push(`PDF  ${contractType.padEnd(20)} ${tier.padEnd(12)} ${String(pdf.pages).padStart(2)} pages ${(pdf.bytes / 1024).toFixed(1).padStart(6)} KB`);
    }

    const docx = await auditDocx({ ...sample(contractType), tier: 'basic' }, `${contractType}/docx`);
    rows.push(`DOCX ${contractType.padEnd(20)} ${'basic'.padEnd(12)} ${(docx.bytes / 1024).toFixed(1).padStart(9)} KB`);
  }

  const leaseHandover = await auditPdf({ ...sample('lease'), addOns: ['handover_protocol'] }, 'lease/handover-addon/pdf');
  const carHandover = await auditPdf({ ...sample('car_sale'), addOns: ['handover_protocol'] }, 'car_sale/handover-addon/pdf');
  const leaseAnnex = await auditPdf({ ...sample('lease'), lang: 'en', addOns: ['bilingual_annex'] }, 'lease/bilingual-addon/pdf');
  rows.push(`ADD  ${'lease handover'.padEnd(20)} ${String(leaseHandover.pages).padStart(2)} pages`);
  rows.push(`ADD  ${'car handover'.padEnd(20)} ${String(carHandover.pages).padStart(2)} pages`);
  rows.push(`ADD  ${'lease bilingual'.padEnd(20)} ${String(leaseAnnex.pages).padStart(2)} pages`);

  console.log('\nOutput quality audit passed\n');
  for (const row of rows) console.log(row);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
