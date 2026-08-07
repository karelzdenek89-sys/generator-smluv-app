import assert from 'node:assert/strict';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import { buildContractSections, type StoredContractData } from '../lib/contracts';
import { renderContractDocx } from '../lib/docx';
import { renderContractPdf } from '../lib/pdf';
import { extractPdfText } from '../lib/pdf-text';
import { packageIncludesDocx, THEMATIC_PACKAGE_CONFIG } from '../lib/packages';

const baseEmployment: StoredContractData = {
  contractType: 'employment',
  packageKey: 'employer_start',
  tier: 'complete',
  employerName: 'Testovací zaměstnavatel s.r.o.',
  employerIco: '23660295',
  employerAddress: 'Václavské náměstí 1, Praha 1',
  employeeName: 'Jana Nováková',
  employeeBirth: '1990-01-01',
  employeeAddress: 'Dlouhá 10, Praha 1',
  jobTitle: 'Projektová specialistka',
  jobDescription: 'Koordinace klientských projektů',
  workPlace: 'Praha',
  startDate: '2026-09-01',
  employmentType: 'indefinite',
  trialPeriod: '4',
  noticePeriod: '2',
  workHours: '40',
  workSchedule: 'pondělí až pátek, 8:30–17:00',
  breakMinutes: '30',
  vacationWeeks: '5',
  salaryType: 'monthly',
  salary: '55000',
  payDay: '15',
  professionalDevelopment: 'Vstupní zaškolení a průběžná odborná školení.',
  overtimeRules: 'Práci přesčas lze konat pouze na pokyn nebo se souhlasem zaměstnavatele.',
  collectiveAgreement: 'U zaměstnavatele není uzavřena kolektivní smlouva.',
  socialSecurityAuthority: 'Pražská správa sociálního zabezpečení',
  payMethod: 'bezhotovostním převodem na účet zaměstnance',
  workEquipment: 'notebook Lenovo, napájecí adaptér a mobilní telefon',
  equipmentCondition: 'nové a funkční',
};

function combinedText(data: StoredContractData) {
  return buildContractSections(data)
    .flatMap((section) => [section.title, ...section.body])
    .join('\n');
}

async function main() {
  assert.equal(THEMATIC_PACKAGE_CONFIG.employer_start.priceCzk, 599);
  assert.equal(packageIncludesDocx('employer_start'), true);

  const withoutRemote = combinedText({ ...baseEmployment, remoteWork: 'remote_none' });
  assert.match(withoutRemote, /INFORMACE O OBSAHU PRACOVNÍHO POMĚRU PODLE § 37 ZP/i);
  assert.match(withoutRemote, /PROTOKOL O PŘEDÁNÍ PRACOVNÍHO VYBAVENÍ/i);
  assert.match(withoutRemote, /NÁSTUPNÍ CHECKLIST ZAMĚSTNAVATELE/i);
  assert.doesNotMatch(withoutRemote, /DOHODA O PRÁCI NA DÁLKU/i);

  const remoteData: StoredContractData = {
    ...baseEmployment,
    remoteWork: 'remote_hybrid',
    remoteWorkPlace: 'Bydliště zaměstnance v České republice po předchozím schválení',
    remoteWorkSchedule: 'nejvýše dva pracovní dny týdně po dohodě s nadřízeným',
    remoteWorkCostMode: 'flat_rate',
  };
  const withRemote = combinedText(remoteData);
  assert.match(withRemote, /DOHODA O PRÁCI NA DÁLKU/i);
  assert.match(withRemote, /§ 317/);
  assert.match(withRemote, /paušální náhrada nákladů/i);
  assert.match(withRemote, /patnáctidenní výpovědní dobou/i);
  assert.match(withRemote, /nezakládá dohodu o odpovědnosti.*§ 252 ZP/is);

  const pdf = await renderContractPdf(remoteData);
  const parsed = await pdfParse(pdf);
  const pdfText = await extractPdfText(pdf);
  assert.ok(parsed.numpages >= 6, 'employer package PDF should contain the contract and appendices');
  assert.match(pdfText, /INFORMACE O OBSAHU PRACOVNÍHO POMĚRU/i);
  assert.match(pdfText, /DOHODA O PRÁCI NA DÁLKU/i);

  const docx = await renderContractDocx(remoteData);
  assert.ok(docx.length > 10_000, 'employer package DOCX should be non-empty');

  console.log('Employer package audit passed (§ 37, remote work, equipment, checklist, PDF/DOCX).');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
