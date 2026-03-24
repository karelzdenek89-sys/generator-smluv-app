import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { jsPDF } from 'jspdf';
import { buildContractSections, getContractMeta, type StoredContractData } from './contracts';

let fontsLoaded = false;

async function loadFontBase64(fileName: string): Promise<string> {
  const filePath = path.join(process.cwd(), 'public', 'fonts', fileName);
  const file = await readFile(filePath);
  return file.toString('base64');
}

async function ensurePdfFonts(doc: jsPDF): Promise<void> {
  if (fontsLoaded) {
    doc.setFont('Roboto', 'normal');
    return;
  }

  const [regular, bold] = await Promise.all([
    loadFontBase64('Roboto-Regular.ttf'),
    loadFontBase64('Roboto-Bold.ttf'),
  ]);

  const api = jsPDF.API as unknown as {
    addFileToVFS: (name: string, data: string) => void;
    addFont: (file: string, family: string, style: string) => void;
  };

  api.addFileToVFS('Roboto-Regular.ttf', regular);
  api.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
  api.addFileToVFS('Roboto-Bold.ttf', bold);
  api.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');

  fontsLoaded = true;
  doc.setFont('Roboto', 'normal');
}

function drawHeader(doc: jsPDF, title: string): void {
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(18);
  doc.text(title.toUpperCase(), 105, 22, { align: 'center' });
  doc.setDrawColor(180);
  doc.line(20, 28, 190, 28);
}

function drawFooter(doc: jsPDF): void {
  const pageCount = doc.getNumberOfPages();

  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    doc.setFont('Roboto', 'normal');
    doc.setFontSize(9);
    doc.text(`Strana ${i} z ${pageCount}`, 105, 290, { align: 'center' });
  }
}

export async function renderContractPdf(data: StoredContractData): Promise<Buffer> {
  const meta = getContractMeta(data.contractType);
  const sections = buildContractSections(data);

  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  await ensurePdfFonts(doc);
  drawHeader(doc, meta.title);

  let y = 40;

  for (const section of sections) {
    if (y > 260) {
      doc.addPage();
      drawHeader(doc, meta.title);
      y = 40;
    }

    doc.setFont('Roboto', 'bold');
    doc.setFontSize(12);
    doc.text(section.title, 20, y);
    y += 8;

    doc.setFont('Roboto', 'normal');
    doc.setFontSize(10);

    for (const line of section.body) {
      const lines = doc.splitTextToSize(line, 170);

      if (y + lines.length * 6 > 280) {
        doc.addPage();
        drawHeader(doc, meta.title);
        y = 40;
      }

      doc.text(lines, 20, y);
      y += lines.length * 5.8 + 4;
    }

    y += 8;
  }

  drawFooter(doc);

  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}