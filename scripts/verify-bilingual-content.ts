/**
 * Round-trip verification: for each contract x active foreign-locale PDF, parse
 * text back out and assert key locale-specific phrases are present.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { FOREIGN_LOCALES } from '../lib/i18n/locales';
import { extractPdfText } from '../lib/pdf-text';

const PDF_DIR = path.join(process.cwd(), 'tmp', 'pdf-test');

const DISCLAIMERS: Record<string, RegExp> = {
  en: /Czech wording prevails|not a certified or official translation/i,
  ua: /переваг[ау]\s+має\s+чеськ|не\s+є\s+офіційн/i,
};

const CONTRACT_KEYWORDS: Record<string, Record<string, RegExp>> = {
  lease: { en: /Landlord:/i, ua: /Орендодавець/i },
  sublease: { en: /sub-tenant/i, ua: /Підорендар|піднайм/i },
  dpp: { en: /work-completion agreement|DPP/i, ua: /угода про виконання роботи|DPP/i },
  employment: { en: /Employee:/i, ua: /Працівник/i },
  power_of_attorney: { en: /PRINCIPAL/i, ua: /ДОВІРИТЕЛЬ/i },
  car_sale: { en: /Seller:/i, ua: /Продавець/i },
};

const CZECH_BODY: Record<string, RegExp> = {
  lease: /nájemní|pronajímatel/i,
  sublease: /podnájem|podnájemce/i,
  dpp: /dohoda o provedení|provedení práce/i,
  employment: /pracovní smlouva|zaměstnavatel/i,
  power_of_attorney: /plná moc|zmocnitel/i,
  car_sale: /kupní smlouva|prodávající/i,
};

async function readPdfText(file: string): Promise<string> {
  return extractPdfText(await readFile(file));
}

async function run() {
  let total = 0;
  let failed = 0;

  for (const contract of Object.keys(CONTRACT_KEYWORDS)) {
    console.log(`\n-- ${contract} --`);
    for (const loc of FOREIGN_LOCALES) {
      const file = path.join(PDF_DIR, `${contract}-${loc}.pdf`);
      const text = await readPdfText(file);
      const checks: Array<[string, boolean]> = [
        [`${loc} disclaimer`, DISCLAIMERS[loc].test(text)],
        [`${loc} body keyword`, CONTRACT_KEYWORDS[contract][loc].test(text)],
        ['Czech contract body', CZECH_BODY[contract].test(text)],
        ['no risky legally-binding translation claim', !/legally binding version|certified translation guaranteed/i.test(text)],
      ];

      for (const [, ok] of checks) {
        total++;
        if (!ok) failed++;
      }

      const allOk = checks.every((c) => c[1]);
      console.log(
        `  ${allOk ? 'OK' : 'FAIL'} ${loc.padEnd(3)} ${checks
          .map(([name, ok]) => `${ok ? 'OK' : 'MISS'} ${name}`)
          .join(' | ')}`,
      );
    }
  }

  console.log(`\n${total - failed}/${total} checks passed.`);
  if (failed > 0) process.exit(1);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
