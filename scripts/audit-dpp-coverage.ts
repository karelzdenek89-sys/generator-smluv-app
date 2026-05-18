/**
 * Compare Czech DPP sections vs Ukrainian overview coverage in sample PDFs.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { buildContractSections } from '../lib/contracts';
import { buildDppContractSectionsUa } from '../lib/i18n/dpp-contract-ua';
import { extractPdfText } from '../lib/pdf-text';
import type { StoredContractData } from '../lib/contracts';

const SAMPLE: StoredContractData = {
  contractType: 'dpp',
  tier: 'basic',
  lang: 'ua',
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
  contractDate: '2026-05-18',
};

const DIR = path.join(process.cwd(), 'sample-pdfs', 'pre-deploy-expat');

function sectionSummary(sections: { title: string; body: string[] }[]) {
  return sections.map((s) => ({
    title: s.title,
    lines: s.body.length,
    chars: s.body.join(' ').length,
  }));
}

async function main() {
  const csSections = buildContractSections({ ...SAMPLE, lang: 'cs' });
  const uaSections = buildDppContractSectionsUa(SAMPLE);

  console.log('=== Czech DPP (source) ===');
  for (const s of sectionSummary(csSections)) {
    console.log(`  ${s.title}: ${s.lines} paragraphs, ~${s.chars} chars`);
  }
  console.log(`  TOTAL body paragraphs: ${csSections.reduce((n, s) => n + s.body.length, 0)}`);
  console.log(`  TOTAL chars: ${csSections.reduce((n, s) => n + s.body.join(' ').length, 0)}`);

  console.log('\n=== Ukrainian overview (source) ===');
  for (const s of sectionSummary(uaSections)) {
    console.log(`  ${s.title}: ${s.lines} paragraphs, ~${s.chars} chars`);
  }
  console.log(`  TOTAL body paragraphs: ${uaSections.reduce((n, s) => n + s.body.length, 0)}`);
  console.log(`  TOTAL chars: ${uaSections.reduce((n, s) => n + s.body.join(' ').length, 0)}`);

  const csPdf = await extractPdfText(await readFile(path.join(DIR, 'dpp-cs.pdf')));
  const uaPdf = await extractPdfText(await readFile(path.join(DIR, 'dpp-ua.pdf')));

  const csTitles = csSections.map((s) => s.title);
  const uaAnnexStart = uaPdf.search(/ПОЯСНЮВАЛЬНИЙ ОГЛЯД|ПРЕАМБУЛА/);
  const uaAnnex = uaAnnexStart >= 0 ? uaPdf.slice(uaAnnexStart) : uaPdf;

  console.log('\n=== Czech topics in UA annex PDF? ===');
  const topics: { label: string; cz: RegExp; ua: RegExp }[] = [
    { label: '300 hodin limit', cz: /300 hodin/i, ua: /300 годин/i },
    { label: 'odměna 40 000', cz: /40[\s\u00a0]?000/i, ua: /40[\s\u00a0]?000/i },
    { label: '12 000 threshold', cz: /12[\s\u00a0]?000/i, ua: /12[\s\u00a0]?000/i },
    { label: '15 dní výpověď', cz: /patnáctidenní|15.denní/i, ua: /15.denn/i },
    { label: 'dovolená §77a', cz: /dovolenou|§ 77a/i, ua: /dovolen|77a/i },
    { label: 'rozvrh směn', cz: /rozvrh směn/i, ua: /rozvrh|směn/i },
    { label: 'GDPR', cz: /GDPR|ÚOOÚ/i, ua: /GDPR|316/i },
    { label: 'vyšší moc', cz: /vyšší moc|vis maior/i, ua: /форс-мажор|2913/i },
    { label: 'vzdálená práce', cz: /vzdáleně/i, ua: /віддален/i },
    { label: 'eIDAS', cz: /eIDAS/i, ua: /eIDAS/i },
    { label: 'work eligibility', cz: /neověřuje/i, ua: /не перевіряє/i },
    { label: 'Czech prevails', cz: /zákoník práce/i, ua: /переваг[ау] має чеське/i },
  ];

  for (const t of topics) {
    const inCz = t.cz.test(csPdf);
    const inUa = t.ua.test(uaAnnex);
    const flag = inCz && !inUa ? 'MISSING in UA' : inCz && inUa ? 'OK' : inCz ? 'n/a' : '—';
    console.log(`  ${t.label.padEnd(22)} CZ:${inCz ? 'yes' : 'no '}  UA:${inUa ? 'yes' : 'no '}  ${flag}`);
  }

  console.log('\n=== Forbidden / required phrases in dpp-ua.pdf ===');
  const checks = [
    { ok: !/юридично обов.?язков/i.test(uaPdf), msg: 'no legally binding UA claim' },
    { ok: /не повний переклад/i.test(uaPdf), msg: 'states not full translation' },
    { ok: /огляд основних умов/i.test(uaPdf), msg: 'overview title' },
    { ok: /переваг[ау] має чеське/i.test(uaPdf), msg: 'Czech prevails' },
    { ok: !/\b1\/6\/2026\b/.test(uaAnnex), msg: 'no slash dates in annex' },
    { ok: /1\.\s*6\.\s*2026/.test(uaAnnex), msg: 'dot dates in annex' },
    { ok: !/40,000/.test(uaAnnex), msg: 'no comma amounts' },
  ];
  for (const c of checks) console.log(`  ${c.ok ? 'OK' : 'FAIL'}: ${c.msg}`);

  console.log('\n=== CS section titles not mirrored in UA overview ===');
  for (const title of csTitles) {
    if (/PODPIS/i.test(title)) continue;
    const simplified = title.replace(/^[IVX]+\.\s*/, '').slice(0, 12);
    const inUa = uaAnnex.toLowerCase().includes(simplified.toLowerCase().slice(0, 8));
    console.log(`  ${title.padEnd(40)} mirrored loosely: ${inUa ? 'partial' : 'NO'}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
