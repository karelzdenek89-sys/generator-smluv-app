import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { jsPDF } from 'jspdf';
import { getContractMeta, buildContractSections, resolveTierFeatures, type StoredContractData, type ContractType } from './contracts';

// ─────────────────────────────────────────────
//  FONT LOADER & CACHE
// ─────────────────────────────────────────────

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

let _fontCache: { regular: string; bold: string } | null = null;

async function getFonts(): Promise<{ regular: string; bold: string }> {
  if (_fontCache) return _fontCache;
  const [regular, bold] = await Promise.all([
    loadFontBase64('Roboto-Regular.ttf'),
    loadFontBase64('Roboto-Bold.ttf'),
  ]);
  _fontCache = { regular, bold };
  return _fontCache;
}

async function ensurePdfFonts(doc: jsPDF): Promise<void> {
  const pdfDoc = doc as any;
  if (!pdfDoc.internal.vFS) {
    pdfDoc.internal.vFS = {};
  }
  const { regular, bold } = await getFonts();
  pdfDoc.addFileToVFS('Roboto-Regular.ttf', regular);
  pdfDoc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
  pdfDoc.addFileToVFS('Roboto-Bold.ttf', bold);
  pdfDoc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');
  doc.setFont('Roboto', 'normal');
}

// ─────────────────────────────────────────────
//  DESIGN TOKENS
// ─────────────────────────────────────────────

// Gold accent  — primary brand colour
const GOLD_R = 200, GOLD_G = 160, GOLD_B = 40;
// Dark text
const DARK_R = 20,  DARK_G = 20,  DARK_B = 20;
// Body text
const BODY_R = 35,  BODY_G = 35,  BODY_B = 35;
// Muted / caption text
const MUTED_R = 120, MUTED_G = 120, MUTED_B = 120;
// Light rule
const RULE_R = 200, RULE_G = 200, RULE_B = 200;
// Summary box background
const BOX_R = 248, BOX_G = 246, BOX_B = 240;
// TOC stripe
const TOC_R = 252, TOC_G = 251, TOC_B = 247;

// Tier badge colours
const TIER_COLORS: Record<string, [number, number, number]> = {
  basic:        [120, 120, 120],
  professional: [50,  110, 180],
  complete:     [170, 120,  20],
};

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────

function stableSerialize(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) return `[${value.map(stableSerialize).join(',')}]`;
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
    return `{${entries.map(([k, v]) => `${k}:${stableSerialize(v)}`).join(',')}}`;
  }
  return String(value);
}

function buildDocumentTrace(data: StoredContractData): { docId: string; hash: string } {
  const hash = createHash('sha256').update(stableSerialize(data)).digest('hex').toUpperCase();
  const year = new Date().getFullYear();
  const shortHash = hash.slice(0, 12);
  return {
    docId: `SH-${year}-${shortHash.slice(0, 8)}`,
    hash: shortHash,
  };
}

function getSignatureLabels(contractType: ContractType, data?: StoredContractData): [string, string] {
  switch (contractType) {
    case 'lease':               return ['Pronajímatel', 'Nájemce'];
    case 'car_sale':            return ['Prodávající', 'Kupující'];
    case 'gift':                return ['Dárce', 'Obdarovaný'];
    case 'work_contract':       return ['Zhotovitel', 'Objednatel'];
    case 'loan':                return ['Věřitel', 'Vydlužitel'];
    case 'nda':                 return ['Poskytující strana', 'Přijímající strana'];
    case 'general_sale':        return ['Prodávající', 'Kupující'];
    case 'employment':          return ['Zaměstnavatel', 'Zaměstnanec'];
    case 'dpp':                 return ['Zaměstnavatel', 'Zaměstnanec'];
    case 'service':             return ['Poskytovatel', 'Objednatel'];
    case 'sublease':            return ['Podnajímatel', 'Podnájemce'];
    case 'power_of_attorney':   return ['Zmocnitel', 'Zmocněnec'];
    case 'debt_acknowledgment': return ['Věřitel', 'Dlužník'];
    case 'cooperation':         return [
      (data?.partyAName as string) || 'Strana A',
      (data?.partyBName as string) || 'Strana B',
    ];
    default:                    return ['Smluvní strana I.', 'Smluvní strana II.'];
  }
}

function isSignatureSection(title: string): boolean {
  return title.toUpperCase().includes('PODPISY');
}

function isProtocolSection(title: string): boolean {
  return title.toUpperCase().includes('PŘEDÁVACÍ PROTOKOL') || title.toUpperCase().includes('PŘÍLOHA');
}

function tierLabel(tier?: string): string {
  if (tier === 'complete')     return 'KOMPLETNÍ';
  if (tier === 'professional') return 'ROZŠÍŘENÁ';
  return 'ZÁKLADNÍ';
}

// ─────────────────────────────────────────────
//  PAGE HEADER  (every page)
// ─────────────────────────────────────────────

/**
 * First-page header: large centred title + thick gold rule.
 * Subsequent-page header: compact running title (10pt) + thin rule.
 */
function drawHeader(doc: jsPDF, title: string, isFirstPage = false): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;

  if (isFirstPage) {
    doc.setFont('Roboto', 'bold');
    doc.setFontSize(19);
    doc.setTextColor(DARK_R, DARK_G, DARK_B);
    doc.text(title.toUpperCase(), pageWidth / 2, 21, { align: 'center' });

    // thick gold accent line
    doc.setDrawColor(GOLD_R, GOLD_G, GOLD_B);
    doc.setLineWidth(0.9);
    doc.line(margin, 27, pageWidth - margin, 27);
    doc.setLineWidth(0.2);
    doc.setDrawColor(RULE_R, RULE_G, RULE_B);
  } else {
    // Running header — compact
    doc.setFont('Roboto', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(MUTED_R, MUTED_G, MUTED_B);
    doc.text(title.toUpperCase(), margin, 10);
    doc.text('SmlouvaHned.cz', pageWidth - margin, 10, { align: 'right' });

    // thin gold separator
    doc.setDrawColor(GOLD_R, GOLD_G, GOLD_B);
    doc.setLineWidth(0.35);
    doc.line(margin, 13, pageWidth - margin, 13);
    doc.setLineWidth(0.2);
    doc.setDrawColor(RULE_R, RULE_G, RULE_B);
  }
}

// ─────────────────────────────────────────────
//  FOOTER  (all pages, added in post-processing)
// ─────────────────────────────────────────────

function drawFooter(doc: jsPDF, docId?: string, hash?: string): void {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    doc.setFont('Roboto', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(MUTED_R, MUTED_G, MUTED_B);

    // thin separator line above footer
    doc.setDrawColor(RULE_R, RULE_G, RULE_B);
    doc.setLineWidth(0.2);
    doc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);

    doc.text(docId ? `ID: ${docId}` : 'SmlouvaHned.cz', margin, pageHeight - 10);
    doc.text(`Strana ${i} z ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    doc.text(
      'Generováno ' + new Date().toLocaleDateString('cs-CZ'),
      pageWidth - margin,
      pageHeight - 10,
      { align: 'right' },
    );

    if (hash) {
      doc.setFontSize(6.5);
      doc.text(`Otisk dokumentu: ${hash}`, margin, pageHeight - 5);
      doc.setFontSize(7.5);
    }
    doc.setTextColor(0);
  }
}

// ─────────────────────────────────────────────
//  TIER BADGE  (top-right of first page)
// ─────────────────────────────────────────────

function drawTierBadge(doc: jsPDF, tier: string): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const label = tierLabel(tier);
  const [r, g, b] = TIER_COLORS[tier] ?? TIER_COLORS.basic;

  const badgeX = pageWidth - 20;
  const badgeY = 8;

  // Filled pill
  const textWidth = 26;
  doc.setFillColor(r, g, b);
  doc.roundedRect(badgeX - textWidth, badgeY - 4, textWidth, 6, 1.5, 1.5, 'F');

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text(label, badgeX - textWidth / 2, badgeY + 0.3, { align: 'center' });
  doc.setTextColor(0);
}

// ─────────────────────────────────────────────
//  SUMMARY BOX  (first page, below header)
// ─────────────────────────────────────────────

/**
 * Draws a lightly shaded info box summarising the contract parties,
 * date and tier.  Returns the Y-position directly after the box.
 */
function drawSummaryBox(
  doc: jsPDF,
  data: StoredContractData,
  contractType: ContractType,
  startY: number,
): number {
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;

  // Collect key info lines
  const lines: string[] = [];

  // Parties — pick the right fields per contract type
  const partyPairs: [string | undefined, string | undefined][] = (() => {
    switch (contractType) {
      case 'lease':
        return [[data.landlordName as string, 'Pronajímatel'], [data.tenantName as string, 'Nájemce']];
      case 'car_sale':
        return [[data.sellerName as string, 'Prodávající'], [data.buyerName as string, 'Kupující']];
      case 'gift':
        return [[data.donorName as string, 'Dárce'], [(data.doneeName ?? data.recipientName) as string, 'Obdarovaný']];
      case 'work_contract':
        return [[data.clientName as string, 'Objednatel'], [data.contractorName as string, 'Zhotovitel']];
      case 'loan':
        return [[data.lenderName as string, 'Věřitel'], [data.borrowerName as string, 'Dlužník']];
      case 'nda':
        return [[data.disclosingName as string, 'Poskytující strana'], [data.receivingName as string, 'Přijímající strana']];
      case 'general_sale':
        return [[data.sellerName as string, 'Prodávající'], [data.buyerName as string, 'Kupující']];
      case 'employment':
        return [[data.employerName as string, 'Zaměstnavatel'], [data.employeeName as string, 'Zaměstnanec']];
      case 'dpp':
        return [[data.employerName as string, 'Zaměstnavatel'], [data.employeeName as string, 'Zaměstnanec']];
      case 'service':
        return [[data.providerName as string, 'Poskytovatel'], [data.clientName as string, 'Objednatel']];
      case 'sublease':
        return [[(data.landlordName ?? data.tenantName) as string, 'Nájemce (podnajímatel)'], [data.tenantName as string, 'Podnájemce']];
      case 'power_of_attorney':
        return [[data.principalName as string, 'Zmocnitel'], [data.agentName as string, 'Zmocněnec']];
      case 'debt_acknowledgment':
        return [[data.creditorName as string, 'Věřitel'], [data.debtorName as string, 'Dlužník']];
      case 'cooperation':
        return [[data.partyAName as string, 'Strana A'], [data.partyBName as string, 'Strana B']];
      default:
        return [];
    }
  })();

  for (const [name, role] of partyPairs) {
    if (name) lines.push(`${role}: ${name}`);
  }

  // Date
  const dateStr = data.contractDate
    ? new Date(data.contractDate as string).toLocaleDateString('cs-CZ')
    : new Date().toLocaleDateString('cs-CZ');
  lines.push(`Datum uzavření: ${dateStr}`);

  // Key amount — covers all 14 contract types
  const amount = (data.price ?? data.loanAmount ?? data.rentAmount ?? data.debtAmount ?? data.totalPrice ?? data.monthlyFee ?? data.salary ?? data.totalRemuneration ?? data.hourlyRate) as number | undefined;
  if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
    const amountLabel = data.monthlyFee ? 'Měsíční paušál' : data.salary ? 'Měsíční mzda (hrubá)' : data.hourlyRate && !data.price && !data.totalPrice ? 'Hodinová sazba' : data.rentAmount && contractType === 'lease' ? 'Měsíční nájemné' : data.rentAmount && contractType === 'sublease' ? 'Měsíční podnájemné' : data.loanAmount ? 'Výše zápůjčky' : data.debtAmount ? 'Výše uznaného dluhu' : 'Sjednaná částka';
    lines.push(`${amountLabel}: ${Number(amount).toLocaleString('cs-CZ')} Kč`);
  }

  // Contract-specific key identifiers
  switch (contractType) {
    case 'lease':
    case 'sublease': {
      const addr = (data.propertyAddress ?? data.flatAddress) as string | undefined;
      if (addr) lines.push(`Adresa bytu: ${addr}`);
      break;
    }
    case 'car_sale': {
      const vin = data.carVIN as string | undefined;
      const spz = data.carPlate as string | undefined;
      if (vin || spz) lines.push(`Vozidlo: VIN ${vin ?? '—'}, SPZ ${spz ?? '—'}`);
      break;
    }
    case 'employment':
    case 'dpp': {
      const job = data.jobTitle as string | undefined;
      if (job) lines.push(`Pozice: ${job}`);
      break;
    }
    case 'loan': {
      const repDate = data.repaymentDate as string | undefined;
      if (repDate) lines.push(`Splatnost: ${new Date(repDate).toLocaleDateString('cs-CZ')}`);
      break;
    }
    case 'nda': {
      const dur = data.ndaDuration as string | undefined;
      if (dur) lines.push(`Doba mlčenlivosti: ${dur}`);
      break;
    }
    default:
      break;
  }

  if (lines.length === 0) return startY;

  const lineHeight = 5.5;
  const paddingV = 5;
  const paddingH = 7;
  const boxHeight = lines.length * lineHeight + paddingV * 2;

  // Box background
  doc.setFillColor(BOX_R, BOX_G, BOX_B);
  doc.setDrawColor(GOLD_R, GOLD_G, GOLD_B);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, startY, contentWidth, boxHeight, 2, 2, 'FD');

  // Left accent bar
  doc.setFillColor(GOLD_R, GOLD_G, GOLD_B);
  doc.rect(margin, startY, 2.5, boxHeight, 'F');

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(BODY_R, BODY_G, BODY_B);

  let y = startY + paddingV + 3.5;
  for (const line of lines) {
    doc.text(line, margin + paddingH, y);
    y += lineHeight;
  }

  doc.setTextColor(0);
  doc.setDrawColor(RULE_R, RULE_G, RULE_B);
  doc.setLineWidth(0.2);

  return startY + boxHeight + 6;
}

// ─────────────────────────────────────────────
//  TABLE OF CONTENTS  (professional / complete)
// ─────────────────────────────────────────────

/**
 * Two-pass helper: renders contract body on a scratch doc (no TOC) to
 * measure the actual starting page for each section. Returns a Map of
 * sectionTitle → 1-based page number in the scratch document.
 * Call before rendering the final PDF; add the TOC-page offset when displaying.
 */
async function measureSectionPages(
  data: StoredContractData,
  sections: ReturnType<typeof buildContractSections>,
  meta: ReturnType<typeof getContractMeta>,
  labelLeft: string,
  labelRight: string,
): Promise<Map<string, number>> {
  const scratch = new jsPDF({ unit: 'mm', format: 'a4', compress: false });
  await ensurePdfFonts(scratch);

  const margin = 20;
  const pageWidth = scratch.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;
  const pageMap = new Map<string, number>();

  // Mirror the first-page setup (same as renderContractPdf, no TOC)
  drawHeader(scratch, meta.title, true);
  let y = 32;
  y = drawSummaryBox(scratch, data, data.contractType, y);
  let inProtocol = false;

  for (const section of sections) {
    if (isProtocolSection(section.title) && !inProtocol) {
      inProtocol = true;
      scratch.addPage();
      drawHeader(scratch, meta.title, false);
      y = 22;
      scratch.setFont('Roboto', 'normal');
      scratch.setFontSize(10);
      scratch.setTextColor(BODY_R, BODY_G, BODY_B);
      scratch.setDrawColor(GOLD_R, GOLD_G, GOLD_B);
      scratch.setLineWidth(0.5);
      scratch.line(margin, y, pageWidth - margin, y);
      scratch.setLineWidth(0.2);
      scratch.setDrawColor(RULE_R, RULE_G, RULE_B);
      y += 8;
    }

    if (isSignatureSection(section.title)) {
      y = drawSignatureSection(scratch, section.title, labelLeft, labelRight, margin, y, meta.title);
      continue;
    }

    // Mirror same orphan guard as main render
    const orphanBuffer = section.body.length > 0 ? 30 : 18;
    if (y + orphanBuffer > 275) {
      scratch.addPage();
      drawHeader(scratch, meta.title, false);
      y = 22;
      scratch.setFont('Roboto', 'normal');
      scratch.setFontSize(10);
      scratch.setTextColor(BODY_R, BODY_G, BODY_B);
    }

    y += 3;
    // Record which page this section starts on
    pageMap.set(section.title, (scratch.internal as unknown as { getCurrentPageInfo: () => { pageNumber: number } }).getCurrentPageInfo().pageNumber);

    y = drawSectionTitle(scratch, section.title, margin, y, contentWidth, inProtocol);

    const bodyLines = section.body.slice(0, 80);
    for (let lineIdx = 0; lineIdx < bodyLines.length; lineIdx++) {
      const line = bodyLines[lineIdx];
      const rawLine = line != null ? String(line) : '';
      const safeLine = rawLine.length > 800 ? rawLine.substring(0, 800) + '…' : (rawLine.trim() || ' ');
      const splitLines = scratch.splitTextToSize(safeLine, contentWidth);

      const lineH = splitLines.length * 5.5 + 2.5;
      const isLast = lineIdx === bodyLines.length - 1;
      const needsBreak = isLast ? y + lineH > 275 : y + lineH + 8 > 275;

      if (needsBreak) {
        scratch.addPage();
        drawHeader(scratch, meta.title, false);
        y = 22;
        scratch.setFont('Roboto', 'normal');
        scratch.setFontSize(10);
        scratch.setTextColor(BODY_R, BODY_G, BODY_B);
      }

      scratch.text(splitLines, margin, y, { align: 'justify', maxWidth: contentWidth });
      y += lineH;
    }

    y += 5;
  }

  return pageMap;
}

/**
 * Estimates the number of pages the TOC will occupy (usually 1).
 */
function estimateTocPageCount(sections: { title: string }[]): number {
  const visibleSections = sections.filter(s => !isSignatureSection(s.title));
  let y = 32 + 7; // header 22 + heading block ~10 + first row offset
  let pages = 1;
  for (const _ of visibleSections) {
    y += 7;
    if (y > 270) { pages++; y = 29; }
  }
  return pages;
}

function drawTableOfContents(
  doc: jsPDF,
  sections: { title: string }[],
  title: string,
  pageMap?: Map<string, number>,
  tocOffset = 0,
): void {
  doc.addPage();
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;

  drawHeader(doc, title, false);
  let y = 22;

  // Section heading
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(DARK_R, DARK_G, DARK_B);
  doc.text('OBSAH SMLOUVY', margin, y);
  y += 3;

  // Underline
  doc.setDrawColor(GOLD_R, GOLD_G, GOLD_B);
  doc.setLineWidth(0.6);
  doc.line(margin, y, margin + 60, y);
  doc.setLineWidth(0.2);
  doc.setDrawColor(RULE_R, RULE_G, RULE_B);
  y += 7;

  // Filter visible sections (exclude PODPISY)
  const visibleSections = sections.filter(s => !isSignatureSection(s.title));
  const totalSections = visibleSections.length;

  let rowIndex = 0;
  for (const section of visibleSections) {
    const sectionNum = rowIndex + 1;

    // Alternating row background
    if (rowIndex % 2 === 0) {
      doc.setFillColor(TOC_R, TOC_G, TOC_B);
      doc.rect(margin, y - 4, contentWidth, 7, 'F');
    }

    // Section title
    doc.setFont('Roboto', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(BODY_R, BODY_G, BODY_B);
    doc.text(section.title, margin + 3, y);

    // Dotted leader + right-side page/section info
    doc.setFont('Roboto', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(MUTED_R, MUTED_G, MUTED_B);
    const dots = ' · · · · · · · · · · · · · · · · · ·';

    let numText: string;
    if (pageMap && pageMap.has(section.title)) {
      // Real page number from two-pass measurement
      const actualPage = (pageMap.get(section.title) ?? 0) + tocOffset;
      numText = `str. ${actualPage}`;
    } else {
      // Fallback: section index
      numText = `${sectionNum} / ${totalSections}`;
    }

    const numWidth = doc.getTextWidth(numText);
    const titleWidth = doc.getTextWidth(section.title) + margin + 3;
    const dotsX = Math.min(titleWidth + 4, pageWidth - margin - numWidth - 10);
    const availDotsWidth = pageWidth - margin - numWidth - 4 - dotsX;
    if (availDotsWidth > 10) {
      const truncDots = dots.substring(0, Math.floor(availDotsWidth / 2));
      doc.text(truncDots, dotsX, y);
    }
    doc.text(numText, pageWidth - margin - numWidth, y);

    y += 7;
    rowIndex++;

    if (y > 270) {
      doc.addPage();
      drawHeader(doc, title, false);
      y = 22;
    }
  }

  doc.setTextColor(0);
}

// ─────────────────────────────────────────────
//  SECTION HEADING RENDERER
// ─────────────────────────────────────────────

/**
 * Draws a section title with a thin gold underline accent.
 * Returns new Y after the heading.
 */
function drawSectionTitle(
  doc: jsPDF,
  title: string,
  x: number,
  y: number,
  contentWidth: number,
  isProtocol = false,
): number {
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(isProtocol ? 40 : DARK_R, isProtocol ? 40 : DARK_G, isProtocol ? 40 : DARK_B);

  const titleLines = doc.splitTextToSize(title, contentWidth);
  doc.text(titleLines, x, y);
  const titleBlockH = titleLines.length * 6;
  y += titleBlockH;

  // Thin gold underline under heading
  doc.setDrawColor(GOLD_R, GOLD_G, GOLD_B);
  doc.setLineWidth(0.35);
  doc.line(x, y, x + Math.min(contentWidth * 0.45, 80), y);
  doc.setLineWidth(0.2);
  doc.setDrawColor(RULE_R, RULE_G, RULE_B);
  y += 3;

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(BODY_R, BODY_G, BODY_B);

  return y;
}

function drawEndOfTextMarker(doc: jsPDF, margin: number, y: number, contractTitle = ''): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;

  if (y > 245) {
    doc.addPage();
    drawHeader(doc, contractTitle, false);
    y = 22;
  }

  y += 2;
  doc.setDrawColor(RULE_R, RULE_G, RULE_B);
  doc.setLineWidth(0.25);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(MUTED_R, MUTED_G, MUTED_B);
  doc.text('### KONEC TEXTU SMLOUVY ###', margin + contentWidth / 2, y, { align: 'center' });
  y += 4;

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(MUTED_R, MUTED_G, MUTED_B);
  doc.text('Za tímto označením již následuje pouze podpisová část a případné přílohy.', margin + contentWidth / 2, y, { align: 'center' });
  doc.setTextColor(0);

  return y + 6;
}

// ─────────────────────────────────────────────
//  SIGNATURE SECTION RENDERER
// ─────────────────────────────────────────────

function drawSignatureSection(
  doc: jsPDF,
  sectionTitle: string,
  labelLeft: string,
  labelRight: string,
  margin: number,
  y: number,
  contractTitle = '',
): number {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Signature block needs ~55mm — break early if insufficient space
  if (y > 220) {
    doc.addPage();
    drawHeader(doc, contractTitle, false);
    y = 22;
  }

  // Section heading
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(DARK_R, DARK_G, DARK_B);
  doc.text(sectionTitle, margin, y);

  // Gold underline under heading
  doc.setDrawColor(GOLD_R, GOLD_G, GOLD_B);
  doc.setLineWidth(0.35);
  doc.line(margin, y + 2, margin + 45, y + 2);
  doc.setLineWidth(0.2);
  doc.setDrawColor(RULE_R, RULE_G, RULE_B);
  y += 10;

  // Date/location line
  doc.setFont('Roboto', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(BODY_R, BODY_G, BODY_B);
  doc.text('Místo a datum podpisu:', margin, y);
  y += 5;
  doc.setDrawColor(160, 160, 160);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + 100, y);
  doc.setLineWidth(0.2);
  doc.setDrawColor(RULE_R, RULE_G, RULE_B);
  y += 10;

  const lineWidth = 72;
  const leftX = margin;
  const rightX = pageWidth - margin - lineWidth;

  // Printed name label + line
  doc.setFont('Roboto', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(MUTED_R, MUTED_G, MUTED_B);
  doc.text('Jméno a příjmení (hůlkovým písmem):', leftX, y);
  doc.text('Jméno a příjmení (hůlkovým písmem):', rightX, y);
  y += 4;

  doc.setDrawColor(160, 160, 160);
  doc.setLineWidth(0.3);
  doc.line(leftX, y, leftX + lineWidth, y);
  doc.line(rightX, y, rightX + lineWidth, y);
  doc.setLineWidth(0.2);
  doc.setDrawColor(RULE_R, RULE_G, RULE_B);
  y += 10;

  // Signature lines
  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(0.45);
  doc.line(leftX, y, leftX + lineWidth, y);
  doc.line(rightX, y, rightX + lineWidth, y);
  y += 4;

  // "(podpis)" labels
  doc.setFont('Roboto', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(MUTED_R, MUTED_G, MUTED_B);
  doc.text('(vlastnoruční podpis)', leftX + lineWidth / 2, y, { align: 'center' });
  doc.text('(vlastnoruční podpis)', rightX + lineWidth / 2, y, { align: 'center' });
  y += 6;

  // Role labels in bold
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);
  doc.text(labelLeft, leftX + lineWidth / 2, y, { align: 'center' });
  doc.text(labelRight, rightX + lineWidth / 2, y, { align: 'center' });
  y += 7;

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(MUTED_R, MUTED_G, MUTED_B);
  const digitalNote = 'Tento dokument byl vytvořen digitálně a je určen k vlastnoručnímu podpisu nebo k podpisu s využitím uznávaného elektronického podpisu.';
  const noteLines = doc.splitTextToSize(digitalNote, pageWidth - margin * 2);
  doc.text(noteLines, margin, y);
  doc.setTextColor(0);

  return y + noteLines.length * 4 + 6;
}

// ─────────────────────────────────────────────
//  COMPLETE-TIER PAGES (instrukce + checklist)
// ─────────────────────────────────────────────

function getSigningInstructions(contractType: ContractType): string[] {
  const common = [
    'PRŮVODNÍ INSTRUKCE K PODPISU A ARCHIVACI',
    '',
    'Tento dokument obsahuje doporučený postup pro správné podepsání, ověření a archivaci vaší smlouvy.',
    '',
    '1. PŘÍPRAVA PŘED PODPISEM',
    '• Pečlivě si přečtěte celý text smlouvy včetně všech příloh.',
    '• Ověřte, že všechny údaje (jména, adresy, částky, data) jsou správné.',
    '• Pokud smlouva obsahuje přílohy (předávací protokol apod.), připravte si je k podpisu současně.',
    '• Zajistěte, aby obě smluvní strany měly dostatek času na prostudování dokumentu.',
    '',
    '2. PODPIS SMLOUVY',
    '• Smlouvu podepisujte v minimálně 2 vyhotoveních — jedno pro každou smluvní stranu.',
    '• Podpis umístěte na vyhrazené podpisové řádky na konci smlouvy.',
    '• K podpisu použijte trvanlivý inkoust (kuličkové pero, ne fixu).',
    '• Pokud je smlouva vícestránková, doporučujeme parafovat (podepsat zkratkou) každou stranu.',
    '• Datum a místo podpisu vyplňte v den skutečného podpisu.',
    '',
    '3. OVĚŘENÍ PODPISŮ (VOLITELNÉ)',
    '• U smluv s vyšší hodnotou (nad 50 000 Kč) zvažte úřední ověření podpisů na Czech POINTu nebo u notáře.',
    '• Ověření podpisů zvyšuje důkazní hodnotu smlouvy v případném sporu.',
    '• Cena ověření: cca 30 Kč za jeden podpis na Czech POINTu.',
    '',
    '4. ARCHIVACE',
    '• Originál smlouvy uchovejte na bezpečném místě (ideálně v uzamykatelné skříni).',
    '• Vytvořte si digitální kopii (sken/foto) jako zálohu.',
    '• Smlouvu archivujte minimálně po celou dobu její platnosti + 3 roky po jejím skončení (obecná promlčecí lhůta dle § 629 OZ).',
    '',
    '5. ELEKTRONICKÝ PODPIS (ALTERNATIVA)',
    '• Smlouvu je možné podepsat i elektronicky v souladu s nařízením EU č. 910/2014 (eIDAS) a zákonem č. 297/2016 Sb., o službách vytvářejících důvěru.',
    '• Kvalifikovaný elektronický podpis (QES) má právní účinky vlastnoručního podpisu a je plně uznáván soudy i orgány veřejné moci v celé EU.',
    '• Zaručený elektronický podpis (AES) je rovněž platný; důkazní síla v případě sporu je však nižší než u QES.',
    '• Služby: Signi.cz, iSmlouva.cz, DocuSign, Adobe Sign — ověřte, zda poskytovatel splňuje požadavky eIDAS.',
    '• Pro smlouvy vyžadující úředně ověřený podpis (nemovitosti, plné moci pro katastr) je elektronická forma využitelná pouze s kvalifikovaným elektronickým podpisem.',
  ];

  const specific: Record<string, string[]> = {
    lease: [
      '',
      '6. SPECIFICKÉ POKYNY PRO NÁJEMNÍ SMLOUVU',
      '• Současně s podpisem smlouvy proveďte předání bytu a sepište předávací protokol.',
      '• Zdokumentujte stav bytu fotografiemi (vodoměry, elektroměr, stav zdí, podlah, spotřebičů).',
      '• Ověřte, že nájemce obdržel všechny klíče a zapsal stavy měřidel.',
      '• Pokud je jistota (kauce), převeďte ji dohodnutým způsobem a uchovejte doklad.',
    ],
    car_sale: [
      '',
      '6. SPECIFICKÉ POKYNY PRO KUPNÍ SMLOUVU NA VOZIDLO',
      '• Současně s podpisem předejte velký a malý technický průkaz.',
      '• Zapište změnu vlastníka na příslušném úřadě do 10 pracovních dnů.',
      '• Zdokumentujte stav tachometru a stav vozidla fotografiemi.',
      '• Ověřte, že vozidlo nemá zákaz převodu (registr vozidel).',
    ],
    employment: [
      '',
      '6. SPECIFICKÉ POKYNY PRO PRACOVNÍ SMLOUVU',
      '• Zaměstnanec musí obdržet jedno vyhotovení smlouvy.',
      '• Pracovní smlouvu je nutné uzavřít nejpozději v den nástupu do práce.',
      '• Zaměstnavatel je povinen přihlásit zaměstnance na ČSSZ a zdravotní pojišťovnu.',
    ],
    gift: [
      '',
      '6. SPECIFICKÉ POKYNY PRO DAROVACÍ SMLOUVU',
      '• NEMOVITOST (POVINNÉ): Obě smluvní strany musí podepsat smlouvu s úředně ověřenými podpisy (notář nebo Czech POINT). Bez ověření katastr nemovitostí vklad zamítne.',
      '• U movitých věcí a peněz dochází k převodu vlastnictví předáním daru nebo převodem na bankovní účet.',
      '• Obdarovaný je povinen přiznat dar v daňovém přiznání, pokud nepodléhá daňovému osvobození.',
    ],
  };

  return [...common, ...(specific[contractType] || [])];
}

function getPreSignChecklist(contractType: ContractType): string[] {
  const common = [
    'CHECKLIST: CO ZKONTROLOVAT PŘED PODPISEM',
    '',
    'Projděte si následující body a ujistěte se, že je vše v pořádku:',
    '',
    '☐  Jména a příjmení všech smluvních stran jsou správně uvedena',
    '☐  Adresy trvalého bydliště / sídla jsou aktuální',
    '☐  Data narození / IČO jsou bez překlepů',
    '☐  Předmět smlouvy je jasně a jednoznačně definován',
    '☐  Finanční částky (cena, nájem, mzda) odpovídají dohodě',
    '☐  Datum účinnosti smlouvy je správné',
    '☐  Doba trvání / výpovědní lhůta odpovídá dohodě',
    '☐  Platební podmínky (termín, způsob) jsou jasné',
    '☐  Práva a povinnosti obou stran jsou vyvážené',
    '☐  Sankce a smluvní pokuty jsou přiměřené',
    '☐  Způsob řešení sporů je uveden',
    '☐  Smlouva neobsahuje prázdná / nevyplněná pole',
    '☐  Počet vyhotovení odpovídá počtu smluvních stran',
    '☐  Všechny přílohy jsou připojeny a kompletní',
  ];

  const specific: Record<string, string[]> = {
    lease: [
      '',
      'SPECIFICKY PRO NÁJEMNÍ SMLOUVU:',
      '☐  Přesná adresa a dispozice bytu odpovídají skutečnosti',
      '☐  Výše nájemného a záloh na služby je správná',
      '☐  Výše jistoty a případných smluvních pokut nepřesahuje trojnásobek měsíčního nájemného (zákonný limit dle § 2254 OZ)',
      '☐  Je uveden způsob vyúčtování služeb',
      '☐  Předávací protokol je připraven k podpisu',
    ],
    car_sale: [
      '',
      'SPECIFICKY PRO KUPNÍ SMLOUVU NA VOZIDLO:',
      '☐  VIN kód odpovídá údajům v technickém průkazu',
      '☐  Stav tachometru je zapsán',
      '☐  Jsou uvedeny známé vady vozidla',
      '☐  Je sjednán způsob předání technického průkazu',
    ],
    employment: [
      '',
      'SPECIFICKY PRO PRACOVNÍ SMLOUVU:',
      '☐  Druh práce odpovídá skutečné pozici',
      '☐  Místo výkonu práce je správné',
      '☐  Den nástupu do práce je reálný',
      '☐  Mzdové podmínky odpovídají dohodě',
      '☐  Zkušební doba nepřesahuje zákonné maximum',
    ],
    loan: [
      '',
      'SPECIFICKY PRO SMLOUVU O ZÁPŮJČCE:',
      '☐  Výše zápůjčky odpovídá skutečně předávané částce',
      '☐  Úrok (pokud je sjednán) nepřekračuje zákonný limit',
      '☐  Termín splatnosti je reálný a jasný',
      '☐  Je uveden způsob vrácení (jednorázově / ve splátkách)',
    ],
  };

  return [...common, ...(specific[contractType] || [])];
}

function drawCompleteTierPages(
  doc: jsPDF,
  contractType: ContractType,
  margin: number,
  contentWidth: number,
  title: string,
): void {
  // --- Instrukce ---
  doc.addPage();
  drawHeader(doc, title, false);
  let y = 22;

  doc.setDrawColor(GOLD_R, GOLD_G, GOLD_B);
  doc.setLineWidth(0.5);
  doc.line(margin, y, margin + contentWidth, y);
  doc.setLineWidth(0.2);
  doc.setDrawColor(RULE_R, RULE_G, RULE_B);
  y += 5;

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(MUTED_R, MUTED_G, MUTED_B);
  doc.text('PŘÍLOHA — KOMPLETNÍ BALÍČEK SMLOUVAHNED', margin, y);
  y += 8;

  const instructions = getSigningInstructions(contractType);
  for (const line of instructions) {
    if (!line) { y += 3; continue; }
    const isHeading = /^\d+\.\s/.test(line) || line === line.toUpperCase();
    if (isHeading) {
      doc.setFont('Roboto', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(DARK_R, DARK_G, DARK_B);
    } else {
      doc.setFont('Roboto', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(BODY_R, BODY_G, BODY_B);
    }
    const splitLines = doc.splitTextToSize(line, contentWidth);
    if (y + splitLines.length * 5 > 275) {
      doc.addPage();
      drawHeader(doc, title, false);
      y = 22;
      doc.setFont('Roboto', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(BODY_R, BODY_G, BODY_B);
    }
    doc.text(splitLines, margin, y);
    y += splitLines.length * 5 + 1;
  }

  // --- Checklist ---
  doc.addPage();
  drawHeader(doc, title, false);
  y = 22;

  doc.setDrawColor(GOLD_R, GOLD_G, GOLD_B);
  doc.setLineWidth(0.5);
  doc.line(margin, y, margin + contentWidth, y);
  doc.setLineWidth(0.2);
  doc.setDrawColor(RULE_R, RULE_G, RULE_B);
  y += 5;

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(MUTED_R, MUTED_G, MUTED_B);
  doc.text('PŘÍLOHA — CHECKLIST PŘED PODPISEM', margin, y);
  y += 8;

  const checklist = getPreSignChecklist(contractType);
  for (const line of checklist) {
    if (!line) { y += 3; continue; }
    const isHeading = !line.startsWith('☐') && (line === line.toUpperCase() || line.includes('SPECIFICKY'));
    if (isHeading) {
      doc.setFont('Roboto', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(DARK_R, DARK_G, DARK_B);
    } else {
      doc.setFont('Roboto', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(BODY_R, BODY_G, BODY_B);
    }
    const splitLines = doc.splitTextToSize(line, contentWidth);
    if (y + splitLines.length * 5 > 275) {
      doc.addPage();
      drawHeader(doc, title, false);
      y = 22;
      doc.setFont('Roboto', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(BODY_R, BODY_G, BODY_B);
    }
    doc.text(splitLines, margin, y);
    y += splitLines.length * 5 + 1.5;
  }
}

// ─────────────────────────────────────────────
//  MAIN RENDER
// ─────────────────────────────────────────────

export async function renderContractPdf(data: StoredContractData): Promise<Buffer> {
  const meta = getContractMeta(data.contractType);
  const sections = buildContractSections(data);
  const [labelLeft, labelRight] = getSignatureLabels(data.contractType, data);
  const { hasPremiumClauses, hasCompletePages } = resolveTierFeatures(data);
  const tier = (data.tier as string) ?? (data.notaryUpsell ? 'professional' : 'basic');
  const { docId, hash } = buildDocumentTrace(data);

  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  await ensurePdfFonts(doc);

  // Document metadata
  const generatedDate = new Date().toLocaleDateString('cs-CZ');
  (doc as any).setProperties({
    title: meta.title,
    subject: `Smlouva vygenerovaná na SmlouvaHned.cz – ${generatedDate} – ${docId}`, 
    author: 'SmlouvaHned.cz',
    keywords: `smlouva, ${data.contractType}, česká republika, ${tier}`,
    creator: 'SmlouvaHned.cz – online generátor smluv',
  });

  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;

  // ── First page ──
  drawHeader(doc, meta.title, true);
  drawTierBadge(doc, tier);

  let y = 32;
  y = drawSummaryBox(doc, data, data.contractType, y);

  let inProtocol = false;
  let endOfTextDrawn = false;

  // ── TOC for professional / complete — two-pass for real page numbers ──
  if (hasPremiumClauses) {
    // Pass 1: measure section pages on a scratch doc (body without TOC)
    const sectionPageMap = await measureSectionPages(data, sections, meta, labelLeft, labelRight);
    // The TOC occupies N pages; body starts after those pages
    const tocPageCount = estimateTocPageCount(sections);
    // tocOffset: sections in pass-1 start on page X; in final doc, page X + tocPageCount
    drawTableOfContents(doc, sections, meta.title, sectionPageMap, tocPageCount);
    // Continue contract body on a new page after TOC
    doc.addPage();
    drawHeader(doc, meta.title, false);
    y = 22;
  }

  // ── Contract body ──
  for (const section of sections) {
    // Protocol / annex → new page
    if (isProtocolSection(section.title) && !inProtocol) {
      inProtocol = true;
      doc.addPage();
      drawHeader(doc, meta.title, false);
      y = 22;
      doc.setFont('Roboto', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(BODY_R, BODY_G, BODY_B);

      doc.setDrawColor(GOLD_R, GOLD_G, GOLD_B);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      doc.setLineWidth(0.2);
      doc.setDrawColor(RULE_R, RULE_G, RULE_B);
      y += 8;
    }

    // PODPISY section
    if (isSignatureSection(section.title)) {
      if (!endOfTextDrawn) {
        y = drawEndOfTextMarker(doc, margin, y, meta.title);
        endOfTextDrawn = true;
      }
      y = drawSignatureSection(doc, section.title, labelLeft, labelRight, margin, y, meta.title);
      continue;
    }

    // Orphan guard — ensure heading + at least first body line fits before starting section
    // Heading block: 3mm pre-space + ~11mm title + 3mm underline gap + first body line ~8mm = ~25mm
    const orphanBuffer = section.body.length > 0 ? 30 : 18;
    if (y + orphanBuffer > 275) {
      doc.addPage();
      drawHeader(doc, meta.title, false);
      y = 22;
      doc.setFont('Roboto', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(BODY_R, BODY_G, BODY_B);
    }

    // Extra spacing before heading
    y += 3;

    y = drawSectionTitle(doc, section.title, margin, y, contentWidth, inProtocol);

    // Body lines
    const bodyLines = section.body.slice(0, 80);
    for (let lineIdx = 0; lineIdx < bodyLines.length; lineIdx++) {
      const line = bodyLines[lineIdx];
      const rawLine = line != null ? String(line) : '';
      const safeLine = rawLine.length > 800 ? rawLine.substring(0, 800) + '…' : (rawLine.trim() || ' ');
      const splitLines = doc.splitTextToSize(safeLine, contentWidth);

      // Widow guard: if this paragraph doesn't fully fit and it's not the last, leave ≥8mm
      const lineH = splitLines.length * 5.5 + 2.5;
      const isLast = lineIdx === bodyLines.length - 1;
      const needsBreak = isLast
        ? y + lineH > 275
        : y + lineH + 8 > 275; // ensure at least one more line fits after this paragraph

      if (needsBreak) {
        doc.addPage();
        drawHeader(doc, meta.title, false);
        y = 22;
        doc.setFont('Roboto', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(BODY_R, BODY_G, BODY_B);
      }

      doc.text(splitLines, margin, y, { align: 'justify', maxWidth: contentWidth });
      y += lineH;
    }

    y += 5;
  }

  // ── Complete-tier appendix pages ──
  if (hasCompletePages) {
    drawCompleteTierPages(doc, data.contractType, margin, contentWidth, meta.title);
  }

  // ── Footer on all pages (post-processing) ──
  drawFooter(doc, docId, hash);

  return Buffer.from(doc.output('arraybuffer'));
}
