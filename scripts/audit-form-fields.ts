/**
 * Audit: porovná pole použitá v UI formulářích s tím, co PDF generátor reálně
 * čte z dat. Hlásí:
 *   A) Pole použitá ve formuláři, ale nikde nečtená v contracts.ts (= mrtvý input)
 *   B) Pole čtená v contracts.ts, ale chybějící ve formuláři (= prázdné v PDF)
 *
 * Whitelist: některá pole jsou systémová (tier, contractType, draftId) — ignoruje je.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';

const FORM_TO_BUILDER: Array<{ form: string; builder: string; contractType: string }> = [
  { form: 'app/najem/page.tsx',         builder: 'buildLeaseContractSections',          contractType: 'lease' },
  { form: 'app/auto/page.tsx',          builder: 'buildCarContractSections',            contractType: 'car_sale' },
  { form: 'app/darovaci/page.tsx',      builder: 'buildGiftContractSections',           contractType: 'gift' },
  { form: 'app/dpp/page.tsx',           builder: 'buildDppContractSections',            contractType: 'dpp' },
  { form: 'app/pujcka/page.tsx',        builder: 'buildLoanContractSections',           contractType: 'loan' },
  { form: 'app/nda/page.tsx',           builder: 'buildNdaContractSections',            contractType: 'nda' },
  { form: 'app/pracovni/page.tsx',      builder: 'buildEmploymentContractSections',     contractType: 'employment' },
  { form: 'app/spoluprace/page.tsx',    builder: 'buildCooperationContractSections',    contractType: 'cooperation' },
  { form: 'app/sluzby/page.tsx',        builder: 'buildServiceContractSections',        contractType: 'service' },
  { form: 'app/podnajem/page.tsx',      builder: 'buildSubleaseContractSections',       contractType: 'sublease' },
  { form: 'app/plna-moc/page.tsx',      builder: 'buildPowerOfAttorneyContractSections',contractType: 'power_of_attorney' },
  { form: 'app/uznani-dluhu/page.tsx',  builder: 'buildDebtAcknowledgmentSections',       contractType: 'debt_acknowledgment' },
  { form: 'app/kupni/page.tsx',         builder: 'buildGeneralSaleContractSections',    contractType: 'general_sale' },
  { form: 'app/smlouva-o-dilo/page.tsx',builder: 'buildWorkContractSections',           contractType: 'work_contract' },
];

const SYSTEM_FIELDS = new Set([
  'contractType', 'tier', 'notaryUpsell', 'draftId', 'email', 'paid', 'createdAt',
  'paidAt', 'stripeSessionId', 'paymentStatus', 'customerEmail', 'payload',
  'downloadCount', 'leaseDuration', // legacy
]);

function extractFormFields(content: string): Set<string> {
  const fields = new Set<string>();
  // name="fieldName"
  for (const m of content.matchAll(/name="([a-zA-Z][\w]*)"/g)) fields.add(m[1]);
  // formData.fieldName
  for (const m of content.matchAll(/formData\.([a-zA-Z][\w]*)/g)) fields.add(m[1]);
  return fields;
}

function extractBuilderFields(builderName: string, contracts: string): Set<string> {
  const fields = new Set<string>();
  // Najdi začátek funkce
  const startMatch = contracts.match(new RegExp(`function\\s+${builderName}\\b`));
  if (!startMatch || startMatch.index === undefined) return fields;
  const start = startMatch.index;
  // Najdi další `function build` po current
  const restAfter = contracts.slice(start + 1);
  const nextMatch = restAfter.match(/\nfunction\s+build/);
  const end = nextMatch && nextMatch.index !== undefined ? start + 1 + nextMatch.index : contracts.length;
  const body = contracts.slice(start, end);
  // Hledej `d.fieldName` (čtení vstupu)
  for (const m of body.matchAll(/\bd\.([a-zA-Z][\w]*)/g)) fields.add(m[1]);
  return fields;
}

const root = process.cwd();
const contractsSrc = readFileSync(path.join(root, 'lib', 'contracts.ts'), 'utf8');

console.log('FORM ↔ PDF GENERATOR FIELD MAPPING\n' + '='.repeat(60));

let totalIssues = 0;
for (const { form, builder, contractType } of FORM_TO_BUILDER) {
  let formSrc: string;
  try {
    formSrc = readFileSync(path.join(root, form), 'utf8');
  } catch {
    console.log(`\n⚠️  ${contractType} (${form} not found)`);
    continue;
  }
  const formFields = extractFormFields(formSrc);
  const builderFields = extractBuilderFields(builder, contractsSrc);

  // Filtruj systémová pole
  for (const sf of SYSTEM_FIELDS) {
    formFields.delete(sf);
    builderFields.delete(sf);
  }

  const inFormNotInBuilder = [...formFields].filter((f) => !builderFields.has(f)).sort();
  const inBuilderNotInForm = [...builderFields].filter((f) => !formFields.has(f)).sort();

  const issues = inFormNotInBuilder.length + inBuilderNotInForm.length;
  totalIssues += issues;

  const status = issues === 0 ? '✅' : '⚠️ ';
  console.log(`\n${status} ${contractType.padEnd(20)} (${formFields.size} form, ${builderFields.size} builder)`);
  if (inFormNotInBuilder.length) {
    console.log(`   ▸ Ve formuláři, nepoužito v PDF (${inFormNotInBuilder.length}): ${inFormNotInBuilder.join(', ')}`);
  }
  if (inBuilderNotInForm.length) {
    console.log(`   ▸ V PDF, chybí ve formuláři (${inBuilderNotInForm.length}): ${inBuilderNotInForm.join(', ')}`);
  }
}

console.log('\n' + '='.repeat(60));
console.log(`Celkem ${totalIssues} mismatchů.`);
