import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { jsPDF } from 'jspdf';
import { getContractMeta, buildContractSections, type StoredContractData } from './contracts';

let fontsLoaded = false;

async function loadFontBase64(fileName: string): Promise<string> {
  const filePath = path.join(process.cwd(), 'public', 'fonts', fileName);

  try {
    const file = await readFile(filePath);
    return file.toString('base64');
  } catch (error) {
    console.error(`Nepodařilo se načíst font ${fileName} z cesty ${filePath}:`, error);
    throw new Error(`Font ${fileName} nebyl nalezen.`);
  }
}

async function ensurePdfFonts(doc: jsPDF): Promise<void> {
  const internal = (doc as any).internal;

  if (!internal.vFS) {
    internal.vFS = {};
  }

  if (fontsLoaded) {
    doc.setFont('Roboto', 'normal');
    return;
  }

  const [regular, bold] = await Promise.all([
    loadFontBase64('Roboto-Regular.ttf'),
    loadFontBase64('Roboto-Bold.ttf'),
  ]);

  const pdfDoc = doc as any;

  pdfDoc.addFileToVFS('Roboto-Regular.ttf', regular);
  pdfDoc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');

  pdfDoc.addFileToVFS('Roboto-Bold.ttf', bold);
  pdfDoc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');

  fontsLoaded = true;
  doc.setFont('Roboto', 'normal');
}

function drawHeader(doc: jsPDF, title: string): void {
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(20);
  doc.text(title.toUpperCase(), pageWidth / 2, 20, { align: 'center' });

  doc.setDrawColor(185);
  doc.line(20, 27, pageWidth - 20, 27);
}

function drawFooter(doc: jsPDF): void {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    doc.setFont('Roboto', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(110);
    doc.text(`Strana ${i} z ${pageCount}`, pageWidth / 2, pageHeight - 8, {
      align: 'center',
    });
    doc.setTextColor(0);
  }
}

function isSignatureSection(title: string): boolean {
  return title.toUpperCase().includes('PODPISY');
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

  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();

  let y = 35;

  drawHeader(doc, meta.title);

  for (const section of sections) {
    if (y > 255) {
      doc.addPage();
      drawHeader(doc, meta.title);
      y = 35;
    }

    if (isSignatureSection(section.title)) {
      if (y > 235) {
        doc.addPage();
        drawHeader(doc, meta.title);
        y = 35;
      }

      doc.setFont('Roboto', 'bold');
      doc.setFontSize(12);
      doc.text(section.title, margin, y);
      y += 10;

      doc.setFont('Roboto', 'normal');
      doc.setFontSize(10);

      const dateLine =
        section.body.find((line) => line.includes('V __________________')) ||
        'V ________________________ dne __________________';

      const splitDateLine = doc.splitTextToSize(dateLine, pageWidth - margin * 2);
      doc.text(splitDateLine, margin, y);
      y += splitDateLine.length * 5 + 14;

      const lineWidth = 60;
      const leftX = margin;
      const rightX = pageWidth - margin - lineWidth;

      doc.setDrawColor(0);
      doc.line(leftX, y, leftX + lineWidth, y);
      doc.line(rightX, y, rightX + lineWidth, y);

      y += 6;

      doc.setFontSize(9);
      doc.text('Pronajímatel / smluvní strana', leftX, y);
      doc.text('Nájemce / smluvní strana', rightX, y);

      y += 14;
      continue;
    }

    doc.setFont('Roboto', 'bold');
    doc.setFontSize(12);
    doc.text(section.title, margin, y);
    y += 7;

    doc.setFont('Roboto', 'normal');
    doc.setFontSize(10);

    for (const line of section.body) {
      const safeLine = line?.trim() ? line : ' ';
      const splitLines = doc.splitTextToSize(safeLine, pageWidth - margin * 2);

      if (y + splitLines.length * 5 > 275) {
        doc.addPage();
        drawHeader(doc, meta.title);
        y = 35;
      }

      doc.text(splitLines, margin, y);
      y += splitLines.length * 5 + 3;
    }

    y += 4;
  }

  drawFooter(doc);

  return Buffer.from(doc.output('arraybuffer'));
}