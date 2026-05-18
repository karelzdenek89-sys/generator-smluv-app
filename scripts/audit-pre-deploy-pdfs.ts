/**
 * Audit all PDFs in sample-pdfs/pre-deploy-expat — structure, Czech body, annex, sample data.
 * Run: npx tsx scripts/audit-pre-deploy-pdfs.ts
 */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import type { ExpatContractType } from '../lib/locale';
import { extractPdfText } from '../lib/pdf-text';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

const DIR = path.join(process.cwd(), 'sample-pdfs', 'pre-deploy-expat');

const CZECH_BODY: Record<ExpatContractType, RegExp> = {
  lease: /nájemní|pronajímatel/i,
  employment: /pracovní smlouva|zaměstnavatel/i,
  dpp: /dohoda o provedení|provedení práce/i,
  sublease: /podnájem|podnájemce/i,
  power_of_attorney: /plná moc|zmocnitel/i,
  car_sale: /kupní smlouva|prodávající/i,
};

/** Sample field values from pre-deploy-expat-check SAMPLES — must appear in Czech body. */
const SAMPLE_SNIPPETS: Record<ExpatContractType, string[]> = {
  lease: ['Jan Novák', 'John Doe', 'Praha 1', '20'],
  employment: ['ACME', 'Jane Worker', 'Developer', 'Praha'],
  dpp: ['ACME', 'Jan Brigádník', 'IT support', '40'],
  sublease: ['Main Tenant', 'Sub Tenant', 'Vinohradská'],
  power_of_attorney: ['Anna Principal', 'Bob Agent'],
  car_sale: ['Seller Test', 'Buyer Test', 'Octavia', 'TMB12345678901234'],
};

const EN_ANNEX = [
  /explanatory english translation annex/i,
  /not a certified or official translation/i,
  /czech wording prevails|the czech wording prevails/i,
];

const UA_ANNEX_DEFAULT = [
  /пояснювальний додаток українською|огляд основних умов/i,
  /переваг[ау] має чеське формулювання/i,
  /засвідченим чи офіційним|не повний переклад/i,
];

const UA_DPP_EXTRA = [
  /огляд основних умов/i,
  /не повний переклад/i,
  /не перевіряє, чи має іноземець право працювати/i,
];

const EN_ANNEX_SECTIONS: Record<ExpatContractType, RegExp> = {
  lease: /i\. parties|preamble/i,
  employment: /i\. parties|preamble/i,
  dpp: /i\. parties|preamble|task/i,
  sublease: /i\. parties|preamble/i,
  power_of_attorney: /i\. parties|principal/i,
  car_sale: /i\. parties|seller/i,
};

const UA_ANNEX_SECTIONS: Record<ExpatContractType, RegExp> = {
  lease: /i\. сторони|преамбула/i,
  employment: /i\. сторони|преамбула/i,
  dpp: /i\. сторони|преамбула/i,
  sublease: /i\. сторони|преамбула/i,
  power_of_attorney: /i\. сторони|преамбула/i,
  car_sale: /i\. сторони|преамбула/i,
};

const FORBIDDEN = [
  /юридично обов.?язков/i,
  /legally binding version/i,
  /certified translation guaranteed/i,
];

type Issue = { file: string; level: 'error' | 'warn'; msg: string };

function parseName(fname: string): { contract: ExpatContractType; lang: 'cs' | 'en' | 'ua' } | null {
  const m = /^(.+)-(cs|en|ua)\.pdf$/i.exec(fname);
  if (!m) return null;
  const contract = m[1] as ExpatContractType;
  if (!(contract in CZECH_BODY)) return null;
  return { contract, lang: m[2] as 'cs' | 'en' | 'ua' };
}

async function main() {
  const files = (await readdir(DIR)).filter((f) => f.endsWith('.pdf')).sort();
  const issues: Issue[] = [];
  const rows: string[] = [];

  if (files.length !== 18) {
    issues.push({ file: '*', level: 'warn', msg: `Expected 18 PDFs, found ${files.length}` });
  }

  for (const fname of files) {
    const parsed = parseName(fname);
    if (!parsed) {
      issues.push({ file: fname, level: 'error', msg: 'Unrecognized filename' });
      continue;
    }
    const { contract, lang } = parsed;
    const buf = await readFile(path.join(DIR, fname));
    const header = buf.subarray(0, 5).toString('ascii');
    const tail = buf.subarray(Math.max(0, buf.length - 32)).toString('latin1');
    const hasEof = tail.includes('%%EOF');

    if (!header.startsWith('%PDF')) {
      issues.push({ file: fname, level: 'error', msg: `Invalid header: ${header}` });
    }
    if (!hasEof) {
      issues.push({ file: fname, level: 'error', msg: 'Missing %%EOF' });
    }
    if (buf.length < 2000) {
      issues.push({ file: fname, level: 'error', msg: `Too small: ${buf.length} B` });
    }

    const parsedPdf = await pdfParse(buf);
    const pages = parsedPdf.numpages;
    const text = await extractPdfText(buf);
    const lower = text.toLowerCase();

    if (text.length < 200) {
      issues.push({ file: fname, level: 'error', msg: `Extracted text too short (${text.length} chars)` });
    }

    if (!CZECH_BODY[contract].test(lower)) {
      issues.push({ file: fname, level: 'error', msg: 'Missing Czech contract body markers' });
    }

    for (const snippet of SAMPLE_SNIPPETS[contract]) {
      if (!lower.includes(snippet.toLowerCase())) {
        issues.push({ file: fname, level: 'warn', msg: `Sample data not found in text: "${snippet}"` });
      }
    }

    if (lang === 'cs') {
      if (/explanatory english translation annex/i.test(lower)) {
        issues.push({ file: fname, level: 'error', msg: 'CS PDF should not contain EN annex title' });
      }
      if (/пояснювальний|огляд основних умов/i.test(lower)) {
        issues.push({ file: fname, level: 'error', msg: 'CS PDF should not contain UA annex' });
      }
    } else if (lang === 'en') {
      for (const re of EN_ANNEX) {
        if (!re.test(lower)) {
          issues.push({ file: fname, level: 'error', msg: `EN annex marker missing: ${re}` });
        }
      }
      if (!EN_ANNEX_SECTIONS[contract].test(lower)) {
        issues.push({ file: fname, level: 'error', msg: 'EN translation annex sections missing' });
      }
    } else {
      const uaMarkers =
        contract === 'dpp' ? [...UA_ANNEX_DEFAULT, ...UA_DPP_EXTRA] : UA_ANNEX_DEFAULT;
      for (const re of uaMarkers) {
        if (!re.test(lower)) {
          issues.push({ file: fname, level: 'error', msg: `UA marker missing: ${re}` });
        }
      }
      if (!UA_ANNEX_SECTIONS[contract].test(lower)) {
        issues.push({ file: fname, level: 'error', msg: 'UA translation/overview sections missing' });
      }
      if (contract === 'dpp' && /юридично обов.?язков/i.test(text)) {
        issues.push({ file: fname, level: 'error', msg: 'DPP UA must not claim legally binding UA version' });
      }
      if (['employment', 'dpp'].includes(contract)) {
        if (!/neověřuje, zda má cizinec/i.test(lower)) {
          issues.push({ file: fname, level: 'warn', msg: 'Missing CZ work-eligibility notice' });
        }
        if (!/не перевіряє, чи має іноземець/i.test(lower)) {
          issues.push({ file: fname, level: 'warn', msg: 'Missing UA work-eligibility notice' });
        }
      }
    }

    for (const re of FORBIDDEN) {
      if (re.test(text)) {
        issues.push({ file: fname, level: 'error', msg: `Forbidden phrase: ${re}` });
      }
    }

    const enLarger = lang !== 'cs';
    const annexNote = lang === 'cs' ? 'CZ only' : lang === 'en' ? 'CZ+EN annex' : contract === 'dpp' ? 'CZ+UA overview' : 'CZ+UA annex';
    const status = issues.filter((i) => i.file === fname && i.level === 'error').length === 0 ? 'OK' : 'FAIL';
    rows.push(
      `${status.padEnd(5)} ${fname.padEnd(28)} ${(buf.length / 1024).toFixed(1).padStart(6)} KB  ${String(pages).padStart(2)} pg  ${annexNote}`,
    );
  }

  console.log('\n=== Audit: sample-pdfs/pre-deploy-expat ===\n');
  console.log('Status File                           Size    Pages  Notes');
  console.log('-'.repeat(72));
  for (const row of rows) console.log(row);

  const errors = issues.filter((i) => i.level === 'error');
  const warns = issues.filter((i) => i.level === 'warn');

  if (warns.length) {
    console.log('\n--- Warnings ---');
    for (const w of warns) console.log(`  [${w.file}] ${w.msg}`);
  }
  if (errors.length) {
    console.log('\n--- Errors ---');
    for (const e of errors) console.log(`  [${e.file}] ${e.msg}`);
    process.exit(1);
  }

  console.log(`\nAll ${files.length} PDFs passed structural and content checks.`);
  if (warns.length) console.log(`${warns.length} warning(s) — review above.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
