/**
 * Guards the foreign-language translation of every expat contract.
 *
 * The EN/UA annex (and the EN/UA preview) is built from the translations that
 * lib/contracts-i18n attaches to each Czech section, paragraph by paragraph.
 * Those builders mirror the Czech conditional logic by hand, so a Czech clause
 * added or changed without its translation would silently drop out of the
 * annex, or shift every later paragraph against the wrong Czech one.
 *
 * Instead of a handful of fixtures, the matrix is derived from the Czech
 * builders themselves: every `d.<field>` they read is filled, blanked and — for
 * booleans and enumerations — flipped through each value they compare against.
 * For every variant, both tiers and both locales, each Czech section must carry
 * a translation with the same number of paragraphs, the same article number,
 * and no paragraph that is missing, left in Czech, or condensed into a summary.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildContractSections, type ContractSection, type StoredContractData } from '../lib/contracts';
import { EXPAT_CONTRACT_TYPES, type ExpatContractType } from '../lib/locale';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = readFileSync(join(ROOT, 'lib/contracts.ts'), 'utf8');

const BUILDER_BY_TYPE: Record<ExpatContractType, string> = {
  lease: 'buildLeaseContractSections',
  car_sale: 'buildCarContractSections',
  employment: 'buildEmploymentContractSections',
  dpp: 'buildDppContractSections',
  sublease: 'buildSubleaseContractSections',
  power_of_attorney: 'buildPowerOfAttorneyContractSections',
};

/** Values the builders branch on outside their own body (shared helpers, checkout). */
const EXTRA_VARIANTS: Array<Partial<StoredContractData>> = [
  { disputeResolution: 'mediation' },
  { disputeResolution: 'court' },
  { addOns: ['handover_protocol'] },
  { addOns: ['bilingual_annex'] },
];
const PACKAGE_BY_TYPE: Partial<Record<ExpatContractType, string[]>> = {
  lease: ['landlord'],
  car_sale: ['vehicle_sale'],
  employment: ['employer_start'],
};

/** A faithful EN/UA rendering of Czech legal prose is rarely under ~75 % of its length. */
const MIN_RATIO = 0.75;
const RATIO_MIN_CZECH_CHARS = 80;

function builderSource(name: string): string {
  const start = SOURCE.indexOf(`function ${name}(`);
  assert.ok(start >= 0, `builder ${name} not found in lib/contracts.ts`);
  const next = SOURCE.indexOf('\nfunction ', start + 10);
  const nextExport = SOURCE.indexOf('\nexport function ', start + 10);
  const end = [next, nextExport].filter((i) => i > 0).reduce((a, b) => Math.min(a, b), SOURCE.length);
  return SOURCE.slice(start, end);
}

type FieldPlan = { name: string; booleans: boolean; enumValues: Set<string> };

function fieldPlan(source: string): FieldPlan[] {
  const fields = new Map<string, FieldPlan>();
  const get = (name: string) => {
    let plan = fields.get(name);
    if (!plan) {
      plan = { name, booleans: false, enumValues: new Set() };
      fields.set(name, plan);
    }
    return plan;
  };
  for (const [, name] of source.matchAll(/\bd\.(\w+)/g)) get(name);
  for (const [, name] of source.matchAll(/\bd\.(\w+)\s*[!=]==\s*(?:true|false)\b/g)) get(name).booleans = true;
  for (const [, name, value] of source.matchAll(/\bd\.(\w+)\s*[!=]==?\s*'([^']*)'/g)) get(name).enumValues.add(value);
  for (const [, list, name] of source.matchAll(/\[([^\]]*)\]\.includes\(\s*(?:String\()?d\.(\w+)/g)) {
    for (const [, value] of list.matchAll(/'([^']*)'/g)) get(name).enumValues.add(value);
  }
  fields.delete('contractType');
  fields.delete('tier');
  return [...fields.values()];
}

function sampleValue(name: string): string {
  if (/date|Date$|Until$|Registration$/.test(name)) return '2026-10-01';
  if (/email/i.test(name)) return 'party@example.com';
  if (/phone/i.test(name)) return '+420 601 123 456';
  if (/(amount|rent|price|salary|rate|fee|penalty|Penalty|deposit|reward|remuneration|Remuneration|limit|Limit|value|Value|Pay$)/i.test(name)) return '25000';
  if (/(hours|Hours|days|Days|months|Months|count|Count|Period|period|Weeks|weeks|Minutes|minutes|Day$|Occupants|year|Year|Mileage|mileage|capacity|kW|Meter$|Percent|percent|Split)/.test(name)) return '12';
  return `Hodnota ${name}`;
}

function fullPayload(type: ExpatContractType, plans: FieldPlan[]): StoredContractData {
  const data: Record<string, unknown> = { contractType: type, lang: 'cs' };
  for (const plan of plans) {
    if (plan.booleans) data[plan.name] = true;
    else if (plan.enumValues.size > 0) data[plan.name] = [...plan.enumValues][0];
    else data[plan.name] = sampleValue(plan.name);
  }
  return data as StoredContractData;
}

function variants(type: ExpatContractType): Array<{ label: string; data: StoredContractData }> {
  const plans = fieldPlan(builderSource(BUILDER_BY_TYPE[type]));
  const full = fullPayload(type, plans);
  const out: Array<{ label: string; data: StoredContractData }> = [
    { label: 'full', data: full },
    { label: 'minimal', data: { contractType: type, lang: 'cs' } as StoredContractData },
  ];
  for (const plan of plans) {
    out.push({ label: `-${plan.name}`, data: { ...full, [plan.name]: undefined } });
    if (plan.booleans) out.push({ label: `${plan.name}=false`, data: { ...full, [plan.name]: false } });
    for (const value of plan.enumValues) out.push({ label: `${plan.name}=${value}`, data: { ...full, [plan.name]: value } });
  }
  for (const extra of EXTRA_VARIANTS) out.push({ label: JSON.stringify(extra), data: { ...full, ...extra } as StoredContractData });
  for (const packageKey of PACKAGE_BY_TYPE[type] ?? []) {
    out.push({ label: `package=${packageKey}`, data: { ...full, packageKey } as StoredContractData });
    out.push({ label: `package=${packageKey},v99`, data: { ...full, packageKey, packageVersion: 99 } as StoredContractData });
    out.push({ label: `package=${packageKey},minimal`, data: { contractType: type, lang: 'cs', packageKey } as StoredContractData });
  }
  return out;
}

const articleNumber = (title: string) => title.trim().match(/^([IVXLC]+)\./)?.[1] ?? null;

type Failure = { key: string; message: string };

function checkSections(type: ExpatContractType, label: string, sections: ContractSection[], failures: Failure[]) {
  for (const section of sections) {
    for (const locale of ['en', 'ua'] as const) {
      const where = `${type} · ${locale} · ${section.title}`;
      const tr = section.translations?.[locale];
      if (!tr) {
        failures.push({ key: `${where} · missing`, message: `${where}: no translation (variant ${label})` });
        continue;
      }
      if (!tr.title?.trim()) failures.push({ key: `${where} · title`, message: `${where}: untranslated title (variant ${label})` });
      else if (articleNumber(section.title) !== articleNumber(tr.title)) {
        failures.push({ key: `${where} · numbering`, message: `${where}: article number differs — "${tr.title}" (variant ${label})` });
      }
      const body = tr.body ?? [];
      if (body.length !== section.body.length) {
        failures.push({
          key: `${where} · count`,
          message: `${where}: ${body.length} translated paragraphs for ${section.body.length} Czech (variant ${label})\n    CS: ${JSON.stringify(section.body.map((p) => p.slice(0, 60)))}\n    ${locale.toUpperCase()}: ${JSON.stringify(body.map((p) => p.slice(0, 60)))}`,
        });
        continue;
      }
      section.body.forEach((cs, i) => {
        const text = body[i] ?? '';
        const key = `${where} · #${i}`;
        if (!text.trim()) failures.push({ key, message: `${key}: empty translation (variant ${label})` });
        else if (cs.length > 30 && text === cs) failures.push({ key, message: `${key}: left in Czech (variant ${label})\n    ${cs}` });
        else if (cs.length >= RATIO_MIN_CZECH_CHARS && text.length / cs.length < MIN_RATIO) {
          failures.push({ key, message: `${key}: condensed to ${Math.round((text.length / cs.length) * 100)} % (variant ${label})\n    CS: ${cs}\n    ${locale.toUpperCase()}: ${text}` });
        }
      });
    }
  }
}

const failures: Failure[] = [];
let checked = 0;
for (const type of EXPAT_CONTRACT_TYPES) {
  for (const { label, data } of variants(type)) {
    for (const tier of ['basic', 'complete'] as const) {
      checkSections(type, `${tier} ${label}`, buildContractSections({ ...data, tier }), failures);
      checked += 1;
    }
  }
}

const unique = new Map<string, string>();
for (const failure of failures) if (!unique.has(failure.key)) unique.set(failure.key, failure.message);

if (unique.size > 0) {
  const only = process.env.PARITY_ONLY;
  const shown = [...unique.values()].filter((message) => !only || message.startsWith(only));
  console.error(shown.join('\n\n'));
  console.error(`\nTranslation parity: ${unique.size} problem(s) across ${checked} contract variants${only ? ` (${shown.length} shown for ${only})` : ''}.`);
  process.exit(1);
}

console.log(`Translation parity tests passed (${EXPAT_CONTRACT_TYPES.length} contract types, ${checked} variants, EN + UA).`);
