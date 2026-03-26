import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { jsPDF } from 'jspdf';
import { getContractMeta, buildContractSections, type StoredContractData, type ContractType } from './contracts';

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
  const pdfDoc = doc as any;
  if (!pdfDoc.internal.vFS) {
    pdfDoc.internal.vFS = {};
  }

  // Load fonts fresh every call — safe for serverless environments
  const [regular, bold] = await Promise.all([
    loadFontBase64('Roboto-Regular.ttf'),
    loadFontBase64('Roboto-Bold.ttf'),
  ]);

  pdfDoc.addFileToVFS('Roboto-Regular.ttf', regular);
  pdfDoc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
  pdfDoc.addFileToVFS('Roboto-Bold.ttf', bold);
  pdfDoc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');

  doc.setFont('Roboto', 'normal');
}

function getSignatureLabels(contractType: ContractType): [string, string] {
  switch (contractType) {
    case 'lease':
      return ['Pronajímatel', 'Nájemce'];
    case 'car_sale':
      return ['Prodávající', 'Kupující'];
    case 'gift':
      return ['Dárce', 'Obdarovaný'];
    case 'work_contract':
      return ['Objednatel', 'Zhotovitel'];
    case 'loan':
      return ['Věřitel (půjčující)', 'Dlužník (příjemce)'];
    case 'nda':
      return ['Strana poskytující informace', 'Strana přijímající informace'];
    case 'general_sale':
      return ['Prodávající', 'Kupující'];
    case 'employment':
      return ['Zaměstnavatel', 'Zaměstnanec'];
    case 'dpp':
      return ['Zaměstnavatel', 'Zaměstnanec'];
    case 'service':
      return ['Poskytovatel', 'Objednatel'];
    case 'sublease':
      return ['Nájemce (podnajímatel)', 'Podnájemce'];
    case 'power_of_attorney':
      return ['Zmocnitel', 'Zmocněnec'];
    case 'debt_acknowledgment':
      return ['Věřitel', 'Dlužník'];
    case 'cooperation':
      return ['Strana A', 'Strana B'];
    default:
      return ['Smluvní strana I.', 'Smluvní strana II.'];
  }
}

function drawHeader(doc: jsPDF, title: string): void {
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(20, 20, 20);
  doc.text(title.toUpperCase(), pageWidth / 2, 20, { align: 'center' });

  doc.setDrawColor(200, 160, 40);
  doc.setLineWidth(0.7);
  doc.line(20, 26, pageWidth - 20, 26);
  doc.setLineWidth(0.2);
  doc.setDrawColor(180, 180, 180);
}

function drawFooter(doc: jsPDF): void {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    doc.setFont('Roboto', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Strana ${i} z ${pageCount}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
    doc.text('SmlouvaHned.cz', 20, pageHeight - 8);
    doc.text('Generováno ' + new Date().toLocaleDateString('cs-CZ'), pageWidth - 20, pageHeight - 8, { align: 'right' });
    doc.setTextColor(0);
  }
}

function isSignatureSection(title: string): boolean {
  return title.toUpperCase().includes('PODPISY');
}

function isProtocolSection(title: string): boolean {
  return title.toUpperCase().includes('PŘEDÁVACÍ PROTOKOL') || title.toUpperCase().includes('PŘÍLOHA');
}

export async function renderContractPdf(data: StoredContractData): Promise<Buffer> {
  const meta = getContractMeta(data.contractType);
  const sections = buildContractSections(data);
  const [labelLeft, labelRight] = getSignatureLabels(data.contractType);

  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  await ensurePdfFonts(doc);

  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;

  let y = 35;
  let inProtocol = false;

  drawHeader(doc, meta.title);

  for (const section of sections) {
    // Start protocol/annex on a new page
    if (isProtocolSection(section.title) && !inProtocol) {
      inProtocol = true;
      doc.addPage();
      drawHeader(doc, meta.title);
      y = 35;
      // Reset font state after drawHeader
      doc.setFont('Roboto', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);

      // Protocol separator line
      doc.setDrawColor(200, 160, 40);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      doc.setLineWidth(0.2);
      doc.setDrawColor(180, 180, 180);
      y += 8;
    }

    if (y > 255) {
      doc.addPage();
      drawHeader(doc, meta.title);
      y = 35;
      doc.setFont('Roboto', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
    }

    if (isSignatureSection(section.title)) {
      if (y > 230) {
        doc.addPage();
        drawHeader(doc, meta.title);
        y = 35;
        doc.setFont('Roboto', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(30, 30, 30);
      }

      // Signature section heading
      doc.setFont('Roboto', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(20, 20, 20);
      doc.text(section.title, margin, y);
      y += 10;

      // Date/place line
      doc.setFont('Roboto', 'normal');
      doc.setFontSize(10);
      const dateLine = 'V ________________________ dne __________________';
      doc.text(dateLine, margin, y);
      y += 18;

      // Two signature lines
      const lineWidth = 70;
      const leftX = margin;
      const rightX = pageWidth - margin - lineWidth;

      doc.setDrawColor(80);
      doc.setLineWidth(0.4);
      doc.line(leftX, y, leftX + lineWidth, y);
      doc.line(rightX, y, rightX + lineWidth, y);
      y += 6;

      doc.setFont('Roboto', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(60);
      doc.text(labelLeft, leftX + lineWidth / 2, y, { align: 'center' });
      doc.text(labelRight, rightX + lineWidth / 2, y, { align: 'center' });
      doc.setFont('Roboto', 'normal');
      doc.setTextColor(0);

      y += 14;
      continue;
    }

    // Extra spacing before section heading for visual separation
    y += 2;

    // Protocol sections use slightly different styling
    if (inProtocol) {
      doc.setFont('Roboto', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(40, 40, 40);
    } else {
      doc.setFont('Roboto', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(20, 20, 20);
    }

    const titleLines = doc.splitTextToSize(section.title, contentWidth);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 6 + 1;

    doc.setFont('Roboto', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);

    for (const line of section.body) {
      const safeLine = line?.trim() ? line : ' ';
      const splitLines = doc.splitTextToSize(safeLine, contentWidth);

      if (y + splitLines.length * 5.5 > 275) {
        doc.addPage();
        drawHeader(doc, meta.title);
        y = 35;
        // Reset font state — drawHeader leaves font as Bold 18pt
        doc.setFont('Roboto', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(30, 30, 30);
      }

      doc.text(splitLines, margin, y, { align: 'justify', maxWidth: contentWidth });
      y += splitLines.length * 5.5 + 3;
    }

    y += 7;
  }

  drawFooter(doc);

  return Buffer.from(doc.output('arraybuffer'));
}
