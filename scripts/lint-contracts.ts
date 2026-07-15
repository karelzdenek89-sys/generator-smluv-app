/**
 * Content-lint pro generátor smluv.
 *
 * Kombinuje dva druhy kontrol:
 *   A) STATICKÁ analýza zdrojového kódu lib/contracts.ts — hledá zakázané
 *      vzory, které by mohly tiše prosáknout do hotového PDF (literální
 *      „(neuvedeno)", podtržítkové placeholdery, magic numbers v pokutách).
 *   B) SMOKE TEST generátoru — pro každou z 14 smluv × 3 tiery se pokusí
 *      vyrenderovat PDF a hlásí runtime chyby.
 *
 * Spuštění:   npx tsx scripts/lint-contracts.ts
 * Exit code:  0 = OK, 1 = nalezeny problémy
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { renderContractPdf } from '../lib/pdf';
import type { ContractType, StoredContractData, Tier } from '../lib/contracts';

type Finding = { rule: string; file: string; line: number; snippet: string };

// ─────────────────────────────────────────────────────────────────────────
//  A. STATIC LINT
// ─────────────────────────────────────────────────────────────────────────

const FORBIDDEN_PATTERNS: Array<{ rule: string; pattern: RegExp; whitelist?: RegExp[] }> = [
  {
    rule: 'literal-neuvedeno-in-string',
    // Literál „(neuvedeno)" v textu, který poteče do PDF.
    // Whitelist: komentáře, kdekoliv obsahující slovo „komentář" nebo
    // „dokumentace" nejsou výstupem (typicky JSDoc / inline poznámky).
    pattern: /\(neuvedeno\)/,
    whitelist: [/^\s*\/\//, /^\s*\*/, /\/\*/],
  },
  {
    rule: 'underscore-placeholder',
    // 8+ podtržítek za sebou — placeholder, který by neměl prosáknout do PDF.
    pattern: /_{8,}/,
    whitelist: [/^\s*\/\//, /^\s*\*/],
  },
  {
    rule: 'hardcoded-penalty-fallback',
    // d.something || NNNN — magic číslo jako fallback pokuty (zakázáno).
    // Whitelist: matematické formule (Math.round / Math.max / Math.min) jsou
    // legitimní formulace vázané na hodnotu smlouvy a tudíž OK.
    pattern: /\bd\.\w+(?:Penalty|Fee|Damage)\w*\s*\|\|\s*\d{3,}/,
    whitelist: [/Math\.(round|max|min)/],
  },
  {
    rule: 'consumer-arbitration-clause',
    pattern: /case ['"]arbitration['"]|vzdávají práva na projednání věci obecným soudem/,
  },
  {
    rule: 'stale-five-year-work-warranty',
    pattern: /zákonná minimální záruční lhůta 5 let/,
  },
  {
    rule: 'stale-gift-revocation-period',
    pattern: /Právo na vrácení daru se promlčuje ve lhůtě tří let/,
  },
  {
    rule: 'stale-employment-notice-start',
    pattern: /Výpovědní doba počíná prvním dnem kalendářního měsíce/,
  },
  {
    rule: 'false-insurance-transfer',
    pattern: /pojištění vozidla přecházejí ke dni přechodu vlastnictví/,
  },
];

function lintSource(file: string): Finding[] {
  const content = readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const findings: Finding[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    // Přeskoč radek s definicí formatAmount — tam je '(neuvedeno)' historicky
    // a aktuálně nahrazeno '—'; pravidlo nesmí falešně padat.
    for (const rule of FORBIDDEN_PATTERNS) {
      if (rule.pattern.test(line)) {
        if (rule.whitelist?.some((wl) => wl.test(line))) continue;
        findings.push({
          rule: rule.rule,
          file: path.relative(process.cwd(), file),
          line: i + 1,
          snippet: line.trim().slice(0, 160),
        });
      }
    }
  }
  return findings;
}

// ─────────────────────────────────────────────────────────────────────────
//  B. SMOKE TEST — každý typ × tier
// ─────────────────────────────────────────────────────────────────────────

const CONTRACT_TYPES: ContractType[] = [
  'lease', 'car_sale', 'gift', 'work_contract', 'loan', 'nda',
  'general_sale', 'employment', 'dpp', 'service', 'sublease',
  'power_of_attorney', 'debt_acknowledgment', 'cooperation',
];
const TIERS: Tier[] = ['basic', 'professional', 'complete'];

/** Minimální plausibilní vstup pro daný typ smlouvy (aby šla PDF vygenerovat). */
function minimalInput(type: ContractType): Partial<StoredContractData> {
  const base = {
    contractDate: '2026-05-15',
    disputeResolution: 'mediation',
  } as Partial<StoredContractData>;
  switch (type) {
    case 'lease':
      return { ...base, landlordName: 'A', tenantName: 'B', propertyAddress: 'Praha', rentAmount: '10000', duration: 'fixed', endDate: '2027-12-31', paymentDay: '15' };
    case 'car_sale':
      return { ...base, sellerName: 'A', buyerName: 'B', carMake: 'Škoda', carModel: 'Octavia', carVIN: 'TMBJB41Z9C2123456', priceAmount: '150000' };
    case 'gift':
      return { ...base, donorName: 'A', doneeName: 'B', giftType: 'money', amount: '50000', currency: 'Kč' };
    case 'work_contract':
      return { ...base, clientName: 'A', contractorName: 'B', workTitle: 'Rekonstrukce koupelny', workDescription: '...', workLocation: 'Praha', priceAmount: '120000', currency: 'Kč' };
    case 'loan':
      return { ...base, lenderName: 'A', borrowerName: 'B', loanAmount: '100000', repaymentType: 'single', repaymentDate: '2027-05-15' };
    case 'nda':
      return { ...base, disclosingParty: 'A', receivingParty: 'B', purpose: 'Spolupráce', confidentialityDurationYears: '3' };
    case 'general_sale':
      return { ...base, sellerName: 'A', buyerName: 'B', itemDescription: 'Notebook Lenovo', price: '25000', currency: 'Kč', priceWords: 'dvacet pět tisíc' };
    case 'employment':
      return { ...base, employerName: 'A', employerIco: '12345678', employeeName: 'B', employeeBirth: '1.1.1990', jobTitle: 'Vývojář', workPlace: 'Praha', startDate: '2026-06-01', salary: '60000', salaryType: 'monthly' };
    case 'dpp':
      return { ...base, employerName: 'A', employerIco: '12345678', employeeName: 'B', employeeBirth: '1.1.1990', taskDescription: 'Vývoj', workPlace: 'Praha', remunerationType: 'hourly', hourlyRate: '500', estimatedHours: '50' };
    case 'service':
      return { ...base, providerName: 'A', clientName: 'B', serviceDescription: 'Konzultace', priceModel: 'monthly', monthlyFee: '15000' };
    case 'sublease':
      return { ...base, landlordName: 'A', tenantName: 'B', propertyAddress: 'Praha', rentAmount: '8000', startDate: '2026-06-01', duration: 'fixed', endDate: '2027-05-31' };
    case 'power_of_attorney':
      return { ...base, principalName: 'A', agentName: 'B', scope: 'Zastupování při převodu vozidla' };
    case 'debt_acknowledgment':
      return { ...base, creditorName: 'A', debtorName: 'B', debtAmount: '50000', currency: 'Kč', repaymentType: 'single', repaymentDate: '2027-05-15' };
    case 'cooperation':
      return { ...base, partyAName: 'A s.r.o.', partyBName: 'B s.r.o.', cooperationDescription: 'Marketing', feeMode: 'fixed', fixedFee: '20000' };
  }
}

async function smokeTest(): Promise<Finding[]> {
  const findings: Finding[] = [];
  for (const type of CONTRACT_TYPES) {
    for (const tier of TIERS) {
      const data = { ...minimalInput(type), contractType: type, tier } as StoredContractData;
      try {
        const pdf = await renderContractPdf(data);
        if (!pdf || pdf.length < 5_000) {
          findings.push({
            rule: 'smoke-pdf-too-small',
            file: `${type}/${tier}`,
            line: 0,
            snippet: `PDF má jen ${pdf?.length ?? 0} B — pravděpodobně chybí obsah.`,
          });
        }
      } catch (err) {
        findings.push({
          rule: 'smoke-runtime-error',
          file: `${type}/${tier}`,
          line: 0,
          snippet: String((err as Error).message ?? err).slice(0, 200),
        });
      }
    }
  }
  return findings;
}

// ─────────────────────────────────────────────────────────────────────────
//  RUNNER
// ─────────────────────────────────────────────────────────────────────────

async function main() {
  const sourceFile = path.join(process.cwd(), 'lib', 'contracts.ts');
  const staticFindings = lintSource(sourceFile);
  const runtimeFindings = await smokeTest();
  const all = [...staticFindings, ...runtimeFindings];

  if (all.length === 0) {
    console.log(`✅ Content-lint čistý: ${CONTRACT_TYPES.length}×${TIERS.length} = ${CONTRACT_TYPES.length * TIERS.length} kombinací vygenerováno bez chyb.`);
    process.exit(0);
  }

  console.error(`❌ Nalezeno ${all.length} problémů:\n`);
  const grouped: Record<string, Finding[]> = {};
  for (const f of all) {
    (grouped[f.rule] ??= []).push(f);
  }
  for (const [rule, items] of Object.entries(grouped)) {
    console.error(`▶ ${rule} (${items.length}×)`);
    for (const f of items.slice(0, 10)) {
      console.error(`    ${f.file}:${f.line}  ${f.snippet}`);
    }
    if (items.length > 10) console.error(`    … (+${items.length - 10} dalších)`);
    console.error('');
  }
  process.exit(1);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(2);
});
