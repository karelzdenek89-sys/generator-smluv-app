/**
 * Round-trip verification: for each contract × foreign locale PDF, parse text
 * back out with pdf-parse and assert key locale-specific phrases are present.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { PDFParse } from 'pdf-parse';

const PDF_DIR = path.join(process.cwd(), 'tmp', 'pdf-test');

// Locale-specific phrases we expect to see in each contract's bilingual PDF.
// Updated to match the post-audit prevailing-language wording (no longer the
// risky "legally binding" formulation). PDF text extraction can introduce
// line breaks inside the disclaimer, so we match across whitespace.
const DISCLAIMERS: Record<string, RegExp> = {
  en: /Czech wording prevails/,
  uk: /переважає\s+чеська/,
  ru: /преимущественную\s+силу\s+имеет\s+чешская/,
  vn: /tiếng Séc\s+được\s+ưu\s+tiên\s+áp\s+dụng/,
  de: /tschechische\s+Wortlaut\s+maßgebend/,
};

const CONTRACT_KEYWORDS: Record<string, Record<string, RegExp>> = {
  lease: { en: /Landlord:/, uk: /Орендодавець/, ru: /Наймодатель/, vn: /Bên cho thuê/, de: /Vermieter/ },
  sublease: { en: /sub-tenant/i, uk: /Суборендар/, ru: /Поднаниматель/, vn: /Bên thuê lại/, de: /Untermieter/ },
  dpp: { en: /work-completion agreement|DPP/, uk: /угода про виконання роботи|DPP/i, ru: /соглашение о выполнении работы|DPP/i, vn: /thỏa thuận thực hiện công việc|DPP/i, de: /Arbeitsleistungsvereinbarung|DPP/ },
  employment: { en: /Employee:/, uk: /Працівник/, ru: /Работник/, vn: /Người lao động/, de: /Arbeitnehmer/ },
  power_of_attorney: { en: /PRINCIPAL/, uk: /ДОВІРИТЕЛЬ/, ru: /ДОВЕРИТЕЛЬ/, vn: /BÊN ỦY QUYỀN/, de: /VOLLMACHTGEBER/ },
  car_sale: { en: /Seller:/, uk: /Продавець/, ru: /Продавец/, vn: /Người bán/, de: /Verkäufer/ },
};

async function readPdfText(file: string): Promise<string> {
  const buf = await readFile(file);
  const parser = new PDFParse({ data: new Uint8Array(buf) });
  const { text } = await parser.getText();
  return text;
}

async function run() {
  let total = 0, failed = 0;
  for (const contract of Object.keys(CONTRACT_KEYWORDS)) {
    console.log(`\n── ${contract} ──`);
    for (const loc of Object.keys(DISCLAIMERS)) {
      const file = path.join(PDF_DIR, `${contract}-${loc}.pdf`);
      const text = await readPdfText(file);
      const checks: Array<[string, boolean]> = [
        [`${loc} disclaimer`, DISCLAIMERS[loc].test(text)],
        [`${loc} body keyword`, CONTRACT_KEYWORDS[contract][loc].test(text)],
        ['CZ prevailing disclaimer', /rozhodující české znění/.test(text)],
        ['CZ "not certified translation" disclaimer', /nejedná se o úřední ani ověřený překlad/.test(text)],
      ];
      for (const [, ok] of checks) {
        total++;
        if (!ok) failed++;
      }
      const allOk = checks.every(c => c[1]);
      console.log(`  ${allOk ? '✓' : '✗'} ${loc.padEnd(4)} ${checks.map(c => (c[1] ? '✓' : '✗') + c[0]).join('  ')}`);
    }
  }
  console.log(`\n${total - failed}/${total} checks passed.`);
  if (failed > 0) process.exit(1);
}

run().catch(e => { console.error(e); process.exit(1); });
