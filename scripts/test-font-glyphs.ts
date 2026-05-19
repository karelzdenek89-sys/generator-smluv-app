/**
 * Direct glyph-coverage check for the production PDF font.
 *
 * jsPDF emits squares (□) for code points not present in the embedded font.
 * pdf-parse extracts the rendered text as Unicode — if the actual code points
 * come back, the font has the glyph and renders correctly.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { jsPDF } from 'jspdf';
import { extractPdfText } from '../lib/pdf-text';

const OUT_DIR = path.join(process.cwd(), 'tmp', 'pdf-test');

type JsPdfWithFonts = jsPDF & {
  addFileToVFS(fileName: string, fileData: string): void;
  addFont(fileName: string, fontName: string, fontStyle: string): void;
};

const samples: Array<{ label: string; text: string; expect: RegExp }> = [
  { label: 'UK (Ukrainian)', text: 'Привіт, це договір оренди. ї є щ', expect: /Привіт/ },
  { label: 'RU (Russian)',   text: 'Привет, это договор аренды. ё ы ъ', expect: /Привет/ },
  { label: 'VN (Vietnamese)', text: 'Xin chào, đây là hợp đồng thuê nhà. ờ ụ ặ', expect: /Xin chào/ },
  { label: 'DE (German)',    text: 'Guten Tag, das ist der Mietvertrag. ä ö ü ß', expect: /Mietvertrag/ },
  { label: 'CS (Czech)',     text: 'Dobrý den, toto je nájemní smlouva. ě š č ř ž ý á í é', expect: /nájemní/ },
];

async function loadB64(fileName: string): Promise<string> {
  const buf = await readFile(path.join(process.cwd(), 'public', 'fonts', fileName));
  return buf.toString('base64');
}

async function run() {
  await mkdir(OUT_DIR, { recursive: true });

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const regular = await loadB64('Roboto-Regular.ttf');
  const bold = await loadB64('Roboto-Bold.ttf');
  const pdfDoc = doc as JsPdfWithFonts;
  pdfDoc.addFileToVFS('Roboto-Regular.ttf', regular);
  pdfDoc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
  pdfDoc.addFileToVFS('Roboto-Bold.ttf', bold);
  pdfDoc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');
  doc.setFont('Roboto', 'normal');
  doc.setFontSize(14);

  let y = 20;
  doc.text('Roboto glyph coverage probe', 20, y);
  y += 12;
  doc.setFontSize(11);
  for (const s of samples) {
    doc.setFont('Roboto', 'bold');
    doc.text(s.label + ':', 20, y);
    y += 6;
    doc.setFont('Roboto', 'normal');
    doc.text(s.text, 20, y);
    y += 12;
  }

  const file = path.join(OUT_DIR, 'font-glyph-probe.pdf');
  await writeFile(file, Buffer.from(doc.output('arraybuffer')));
  console.log(`Wrote ${file}`);

  // Now parse it back and check that Unicode round-trips.
  const buf = await readFile(file);
  const text = await extractPdfText(buf);
  console.log('\nExtracted text:');
  console.log('───────────────');
  console.log(text);
  console.log('───────────────\n');

  let failures = 0;
  for (const s of samples) {
    const ok = s.expect.test(text);
    console.log(`${ok ? '✓' : '✗'}  ${s.label.padEnd(18)} regex: ${s.expect}`);
    if (!ok) failures++;
  }
  if (failures > 0) {
    console.error(`\n${failures} sample(s) FAILED — glyphs did not round-trip.`);
    process.exit(1);
  }
  console.log('\nAll glyph samples round-tripped through PDF → text. ✓');
}

run().catch(err => {
  console.error('FAILED:', err);
  process.exit(1);
});
