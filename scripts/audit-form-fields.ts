/**
 * Audit form fields against fields read by lib/contracts.ts.
 *
 * The goal is to catch two practical problems:
 * - visible form inputs that never affect the generated document
 * - contract fields that the generator can use, but the form does not expose
 *
 * The audit intentionally ignores system/defaulted fields and known aliases
 * where the UI name differs from the canonical generator name.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';

const FORM_TO_BUILDER: Array<{ form: string; builder: string; contractType: string }> = [
  { form: 'app/najem/page.tsx', builder: 'buildLeaseContractSections', contractType: 'lease' },
  { form: 'app/auto/page.tsx', builder: 'buildCarContractSections', contractType: 'car_sale' },
  { form: 'app/darovaci/page.tsx', builder: 'buildGiftContractSections', contractType: 'gift' },
  { form: 'app/dpp/page.tsx', builder: 'buildDppContractSections', contractType: 'dpp' },
  { form: 'app/pujcka/page.tsx', builder: 'buildLoanContractSections', contractType: 'loan' },
  { form: 'app/nda/page.tsx', builder: 'buildNdaContractSections', contractType: 'nda' },
  { form: 'app/pracovni/page.tsx', builder: 'buildEmploymentContractSections', contractType: 'employment' },
  { form: 'app/spoluprace/page.tsx', builder: 'buildCooperationContractSections', contractType: 'cooperation' },
  { form: 'app/sluzby/page.tsx', builder: 'buildServiceContractSections', contractType: 'service' },
  { form: 'app/podnajem/page.tsx', builder: 'buildSubleaseContractSections', contractType: 'sublease' },
  { form: 'app/plna-moc/page.tsx', builder: 'buildPowerOfAttorneyContractSections', contractType: 'power_of_attorney' },
  { form: 'app/uznani-dluhu/page.tsx', builder: 'buildDebtAcknowledgmentSections', contractType: 'debt_acknowledgment' },
  { form: 'app/kupni/page.tsx', builder: 'buildGeneralSaleContractSections', contractType: 'general_sale' },
  { form: 'app/smlouva-o-dilo/page.tsx', builder: 'buildWorkContractSections', contractType: 'work_contract' },
];

const SYSTEM_FIELDS = new Set([
  'contractType',
  'tier',
  'notaryUpsell',
  'draftId',
  'email',
  'paid',
  'createdAt',
  'paidAt',
  'stripeSessionId',
  'paymentStatus',
  'customerEmail',
  'payload',
  'downloadCount',
  'downloadToken',
  'lastDownloadAt',
  'packageKey',
  'addOns',
  'archiveDays',
  'includedItems',
  'leaseDuration',
  'lang',
]);

const DEFAULTED_FIELDS = new Set(['contractDate']);

const ALIASES: Record<string, Record<string, string[]>> = {
  lease: {
    propertyAddress: ['flatAddress'],
    propertyLayout: ['flatLayout'],
    approxArea: ['flatArea'],
    utilitiesAmount: ['utilityAmount'],
    rentIndexationMode: ['includeInflationIndexation'],
  },
  car_sale: {
    purchasePrice: ['priceAmount'],
    keysAndDocs: ['documentsIncluded'],
  },
  employment: {
    isExecutive: ['isManager'],
    isLeader: ['isManager'],
  },
};

function extractFormFields(content: string): Set<string> {
  const fields = new Set<string>();

  for (const m of content.matchAll(/\bname=["']([a-zA-Z][\w]*)["']/g)) fields.add(m[1]);
  for (const m of content.matchAll(/(?<![\w.])(?:formData|form)\.([a-zA-Z][\w]*)/g)) fields.add(m[1]);
  for (const m of content.matchAll(/\bupdateField\(["']([a-zA-Z][\w]*)["']/g)) fields.add(m[1]);
  for (const m of content.matchAll(/\bset\(["']([a-zA-Z][\w]*)["']/g)) fields.add(m[1]);

  return fields;
}

function extractBuilderBody(builderName: string, contracts: string): string {
  const startMatch = contracts.match(new RegExp(`function\\s+${builderName}\\b`));
  if (!startMatch || startMatch.index === undefined) return '';

  const start = startMatch.index;
  const restAfter = contracts.slice(start + 1);
  const nextMatch = restAfter.match(/\nfunction\s+build/);
  const end = nextMatch && nextMatch.index !== undefined ? start + 1 + nextMatch.index : contracts.length;

  return contracts.slice(start, end);
}

function extractBuilderFields(builderName: string, contracts: string): Set<string> {
  const body = extractBuilderBody(builderName, contracts);
  const fields = new Set<string>();

  for (const m of body.matchAll(/\bd\.([a-zA-Z][\w]*)/g)) fields.add(m[1]);
  if (body.includes('disputeClause(d)')) fields.add('disputeResolution');

  return fields;
}

function normalizeFields(contractType: string, formFields: Set<string>, builderFields: Set<string>) {
  for (const field of [...SYSTEM_FIELDS, ...DEFAULTED_FIELDS]) {
    formFields.delete(field);
    builderFields.delete(field);
  }

  const aliases = ALIASES[contractType] ?? {};
  for (const [builderField, formAliases] of Object.entries(aliases)) {
    if (builderFields.has(builderField) && formAliases.some((alias) => formFields.has(alias))) {
      builderFields.delete(builderField);
    }
  }
}

const root = process.cwd();
const contractsSrc = readFileSync(path.join(root, 'lib', 'contracts.ts'), 'utf8');

console.log('FORM <-> CONTRACT GENERATOR FIELD MAPPING\n' + '='.repeat(60));

let totalIssues = 0;
for (const { form, builder, contractType } of FORM_TO_BUILDER) {
  let formSrc: string;
  try {
    formSrc = readFileSync(path.join(root, form), 'utf8');
  } catch {
    console.log(`\nWARN ${contractType} (${form} not found)`);
    continue;
  }

  const formFields = extractFormFields(formSrc);
  const builderFields = extractBuilderFields(builder, contractsSrc);
  normalizeFields(contractType, formFields, builderFields);

  const inFormNotInBuilder = [...formFields].filter((field) => !builderFields.has(field)).sort();
  const inBuilderNotInForm = [...builderFields].filter((field) => !formFields.has(field)).sort();

  const issues = inFormNotInBuilder.length + inBuilderNotInForm.length;
  totalIssues += issues;

  const status = issues === 0 ? 'OK' : 'WARN';
  console.log(`\n${status} ${contractType.padEnd(20)} (${formFields.size} form, ${builderFields.size} builder)`);
  if (inFormNotInBuilder.length) {
    console.log(`   form only (${inFormNotInBuilder.length}): ${inFormNotInBuilder.join(', ')}`);
  }
  if (inBuilderNotInForm.length) {
    console.log(`   generator only (${inBuilderNotInForm.length}): ${inBuilderNotInForm.join(', ')}`);
  }
}

console.log('\n' + '='.repeat(60));
console.log(`Total mismatches: ${totalIssues}.`);
