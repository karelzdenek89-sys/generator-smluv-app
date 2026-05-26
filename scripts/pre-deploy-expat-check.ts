/**
 * Pre-deploy smoke: PDF generation for all expat contract types (cs/en/ua).
 * Run: npx tsx scripts/pre-deploy-expat-check.ts
 */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { StoredContractData } from '../lib/contracts';
import type { ExpatContractType } from '../lib/locale';
import { renderContractPdf } from '../lib/pdf';
import { extractPdfText } from '../lib/pdf-text';

const OUT = path.join(process.cwd(), 'sample-pdfs', 'pre-deploy-expat');

const SAMPLES: Record<ExpatContractType, StoredContractData> = {
  lease: {
    contractType: 'lease',
    tier: 'basic',
    landlordName: 'Jan Novák',
    tenantName: 'John Doe',
    flatAddress: 'Praha 1',
    rentAmount: '20000',
    startDate: '2026-06-01',
    handoverDate: '2026-06-01',
    duration: 'fixed',
    endDate: '2027-05-31',
  },
  employment: {
    contractType: 'employment',
    tier: 'basic',
    employerName: 'ACME s.r.o.',
    employerIco: '12345678',
    employerAddress: 'Praha',
    employeeName: 'Jane Worker',
    employeeBirth: '1990-01-01',
    employeeAddress: 'Brno',
    jobTitle: 'Developer',
    workPlace: 'Praha',
    startDate: '2026-06-01',
    salary: '50000',
    salaryType: 'monthly',
    employmentType: 'indefinite',
  },
  dpp: {
    contractType: 'dpp',
    tier: 'basic',
    employerName: 'ACME s.r.o.',
    employerIco: '12345678',
    employerAddress: 'Praha',
    employeeName: 'Jan Brigádník',
    employeeBirth: '1995-05-05',
    employeeAddress: 'Brno',
    taskDescription: 'IT support and documentation',
    workPlace: 'Praha',
    estimatedHours: '80',
    totalRemuneration: '40000',
    remunerationType: 'fixed',
    durationType: 'fixed',
    startDate: '2026-06-01',
    endDate: '2026-12-31',
  },
  sublease: {
    contractType: 'sublease',
    tier: 'basic',
    landlordName: 'Main Tenant',
    landlordId: '1.1.1990',
    landlordAddress: 'Praha',
    tenantName: 'Sub Tenant',
    tenantId: '2.2.1992',
    tenantAddress: 'Brno',
    flatAddress: 'Vinohradská 1, Praha',
    rentAmount: '15000',
    startDate: '2026-06-01',
    duration: 'fixed',
    endDate: '2027-05-31',
    landlordConsent: 'yes',
    consentDate: '2026-05-01',
  },
  power_of_attorney: {
    contractType: 'power_of_attorney',
    tier: 'basic',
    principalName: 'Anna Principal',
    principalId: '1.1.1980',
    principalAddress: 'Praha',
    agentName: 'Bob Agent',
    agentId: '2.2.1985',
    agentAddress: 'Brno',
    poaType: 'general',
    customScope: 'Representation at Czech authorities for registration matters',
    validUntil: '2026-12-31',
  },
  car_sale: {
    contractType: 'car_sale',
    tier: 'basic',
    sellerName: 'Seller Test',
    sellerId: '1.1.1970',
    sellerAddress: 'Praha',
    buyerName: 'Buyer Test',
    buyerId: '2.2.1988',
    buyerAddress: 'Brno',
    carMake: 'Škoda',
    carModel: 'Octavia',
    carVIN: 'TMB12345678901234',
    carMileage: '120000',
    priceAmount: '250000',
    paymentMethod: 'transfer',
    handoverDate: '2026-06-15',
  },
};

const ANNEX_MARKERS: Record<'en' | 'ua', RegExp[]> = {
  en: [
    /explanatory english translation annex/i,
    /not a certified or official translation/i,
    /czech wording prevails/i,
    /i\. parties|preamble/i,
  ],
  ua: [
    /пояснювальний додаток українською/i,
    /засвідченим чи офіційним/i,
    /i\. сторони|преамбула/i,
  ],
};

const DPP_UA_ANNEX_MARKERS: RegExp[] = [
  /огляд основних умов/i,
  /не повний переклад/i,
  /переваг[ау] має чеське формулювання/i,
  /не перевіряє, чи має іноземець право працювати/i,
  /i\. сторони|преамбула/i,
];

function annexMarkersFor(contract: ExpatContractType, lang: 'en' | 'ua'): RegExp[] {
  if (lang === 'en') return ANNEX_MARKERS.en;
  if (contract === 'dpp') return DPP_UA_ANNEX_MARKERS;
  return ANNEX_MARKERS.ua;
}

const CZECH_BODY_MARKERS: Record<ExpatContractType, RegExp> = {
  lease: /nájemní|smluvní strany|pronajímatel/i,
  employment: /pracovní smlouva|zaměstnavatel|zákoník práce/i,
  dpp: /dohoda o provedení|provedení práce/i,
  sublease: /podnájem|podnájemní/i,
  power_of_attorney: /plná moc|zmocnitel/i,
  car_sale: /kupní smlouva|prodávající/i,
};

async function checkPdf(
  contract: ExpatContractType,
  lang: 'cs' | 'en' | 'ua',
): Promise<{ bytes: number; text: string }> {
  const data: StoredContractData = {
    ...SAMPLES[contract],
    lang,
    tier: 'basic',
    addOns: lang === 'cs' ? [] : ['bilingual_annex'],
  };
  const pdf = await renderContractPdf(data);
  assert.ok(pdf.length > 2000, `${contract}/${lang}: PDF too small (${pdf.length} B)`);

  const text = await extractPdfText(pdf);
  assert.ok(text.length > 200, `${contract}/${lang}: extracted text too short`);

  const lower = text.toLowerCase();
  assert.match(lower, CZECH_BODY_MARKERS[contract], `${contract}/${lang}: missing Czech body markers`);

  if (lang === 'cs') {
    for (const re of ANNEX_MARKERS.en) {
      if (re.source.includes('explanatory english')) {
        assert.ok(!lower.includes('explanatory english translation annex'), `${contract}/cs: unexpected EN annex`);
      }
    }
    assert.ok(!lower.includes('пояснювальний додаток'), `${contract}/cs: unexpected UA annex title`);
  } else {
    for (const re of annexMarkersFor(contract, lang)) {
      assert.match(lower, re, `${contract}/${lang}: annex marker failed: ${re}`);
    }
  }

  const fname = `${contract}-${lang}.pdf`;
  await writeFile(path.join(OUT, fname), pdf);
  return { bytes: pdf.length, text: lower };
}

async function compareSizes() {
  const leaseCs = (await renderContractPdf({ ...SAMPLES.lease, lang: 'cs' })).length;
  const leaseEn = (await renderContractPdf({ ...SAMPLES.lease, lang: 'en', addOns: ['bilingual_annex'] })).length;
  assert.ok(leaseEn > leaseCs + 3000, 'Lease EN should be larger than CS (annex)');

  const empCs = (await renderContractPdf({ ...SAMPLES.employment, lang: 'cs' })).length;
  const empEn = (await renderContractPdf({ ...SAMPLES.employment, lang: 'en', addOns: ['bilingual_annex'] })).length;
  assert.ok(empEn > empCs + 2000, 'Employment EN should be larger than CS (annex)');
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const results: string[] = [];

  for (const contract of Object.keys(SAMPLES) as ExpatContractType[]) {
    for (const lang of ['cs', 'en', 'ua'] as const) {
      const { bytes } = await checkPdf(contract, lang);
      results.push(`  OK  ${contract.padEnd(18)} ${lang}  ${(bytes / 1024).toFixed(1)} KB`);
    }
  }

  await compareSizes();

  console.log('Pre-deploy expat PDF checks passed\n');
  console.log(`Samples written to: ${OUT}\n`);
  for (const line of results) console.log(line);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
