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

// Typography
const INK_R  = 15,  INK_G  = 15,  INK_B  = 15;   // near-black headings
const BODY_R = 30,  BODY_G = 30,  BODY_B = 30;   // body text
const META_R = 105, META_G = 105, META_B = 105;   // running headers, captions
const RULE_R = 190, RULE_G = 190, RULE_B = 190;   // light neutral rules
const SIGN_R = 100, SIGN_G = 100, SIGN_B = 100;   // signature lines

// Summary box — neutral warm white, no gold accent bar
const BOX_BG_R = 246, BOX_BG_G = 246, BOX_BG_B = 244;
const BOX_BD_R = 210, BOX_BD_G = 210, BOX_BD_B = 208;

// TOC alternating row — very subtle
const TOC_R = 250, TOC_G = 250, TOC_B = 249;

// Page layout
const MARGIN    = 25;           // professional legal margin (was 20)
const BODY_LEAD = 6.0;          // body line height mm (was 5.5)
const SECTION_GAP = 7;          // space between sections (was 5)

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

function isLeaseProtocol(title: string): boolean {
  return title.toUpperCase().includes('PŘEDÁVACÍ PROTOKOL K NÁJEMNÍ SMLOUVĚ');
}

function tierLabel(tier?: string): string {
  if (tier === 'complete')     return 'Kompletní';
  if (tier === 'professional') return 'Rozšířená';
  return 'Základní';
}

// ─────────────────────────────────────────────
//  PAGE HEADER
// ─────────────────────────────────────────────

/**
 * First-page header: centred title with generous top margin and a clean double rule.
 * Subsequent pages: small running title (left) + docId (right), thin rule below.
 */
function drawHeader(doc: jsPDF, title: string, isFirstPage: boolean, docId?: string): void {
  const pageWidth = doc.internal.pageSize.getWidth();

  if (isFirstPage) {
    // Generous top breathing room
    const titleY = 28;

    doc.setFont('Roboto', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(INK_R, INK_G, INK_B);
    doc.text(title.toUpperCase(), pageWidth / 2, titleY, { align: 'center' });

    // Double thin rule beneath title — professional legal look
    const ruleY1 = titleY + 5;
    const ruleY2 = ruleY1 + 1.5;
    doc.setDrawColor(INK_R, INK_G, INK_B);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, ruleY1, pageWidth - MARGIN, ruleY1);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, ruleY2, pageWidth - MARGIN, ruleY2);

    // Reset
    doc.setDrawColor(RULE_R, RULE_G, RULE_B);
    doc.setLineWidth(0.2);
  } else {
    // Running header — left: abbreviated title, right: docId
    doc.setFont('Roboto', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(META_R, META_G, META_B);
    doc.text(title.toUpperCase(), MARGIN, 10);
    if (docId) {
      doc.text(docId, pageWidth - MARGIN, 10, { align: 'right' });
    }

    // Single thin neutral rule
    doc.setDrawColor(RULE_R, RULE_G, RULE_B);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, 13, pageWidth - MARGIN, 13);
  }
}

// ─────────────────────────────────────────────
//  FOOTER
// ─────────────────────────────────────────────

function drawFooter(doc: jsPDF, docId?: string, hash?: string, tier?: string): void {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const tierText = tier ? `  ·  ${tierLabel(tier)}` : '';
  const footerLine2 = hash ? `Otisk: ${hash}${tierText}` : '';

  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    doc.setFont('Roboto', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(META_R, META_G, META_B);

    // Thin rule above footer
    doc.setDrawColor(RULE_R, RULE_G, RULE_B);
    doc.setLineWidth(0.15);
    doc.line(MARGIN, pageHeight - 15, pageWidth - MARGIN, pageHeight - 15);

    // Line 1: ID (left) · page (centre) · date (right)
    const dateStr = new Date().toLocaleDateString('cs-CZ');
    doc.text(docId ? `ID: ${docId}` : '', MARGIN, pageHeight - 10);
    doc.text(`— ${i} / ${pageCount} —`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    doc.text(`Generováno ${dateStr}`, pageWidth - MARGIN, pageHeight - 10, { align: 'right' });

    // Line 2: hash + tier — very small, muted
    if (footerLine2) {
      doc.setFontSize(6);
      doc.text(footerLine2, MARGIN, pageHeight - 5.5);
    }

    doc.setTextColor(0);
  }
}

// ─────────────────────────────────────────────
//  SUMMARY BOX  (metadata section, first page)
// ─────────────────────────────────────────────

/**
 * Two-column metadata block: parties (left column) + key identifiers (right column).
 * Neutral light background, no gold accent bar — looks like a document header, not a widget.
 */
function drawSummaryBox(
  doc: jsPDF,
  data: StoredContractData,
  contractType: ContractType,
  startY: number,
): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - MARGIN * 2;

  // Collect party lines
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

  // Right-column identifiers
  const identLines: string[] = [];

  const dateStr = data.contractDate
    ? new Date(data.contractDate as string).toLocaleDateString('cs-CZ')
    : new Date().toLocaleDateString('cs-CZ');
  identLines.push(`Datum uzavření: ${dateStr}`);

  const amount = (data.price ?? data.loanAmount ?? data.rentAmount ?? data.debtAmount ?? data.totalPrice ?? data.monthlyFee ?? data.salary ?? data.totalRemuneration ?? data.hourlyRate) as number | undefined;
  if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
    const amountLabel =
      data.monthlyFee ? 'Měsíční paušál' :
      data.salary ? 'Mzda (hrubá/měs.)' :
      data.rentAmount && contractType === 'lease' ? 'Nájemné' :
      data.rentAmount && contractType === 'sublease' ? 'Podnájemné' :
      data.loanAmount ? 'Výše zápůjčky' :
      data.debtAmount ? 'Výše dluhu' :
      'Sjednaná částka';
    identLines.push(`${amountLabel}: ${Number(amount).toLocaleString('cs-CZ')} Kč`);
  }

  switch (contractType) {
    case 'lease':
    case 'sublease': {
      const addr = (data.propertyAddress ?? data.flatAddress) as string | undefined;
      if (addr) identLines.push(`Nemovitost: ${addr}`);
      break;
    }
    case 'car_sale': {
      const vin = data.carVIN as string | undefined;
      const spz = data.carPlate as string | undefined;
      if (vin || spz) identLines.push(`Vozidlo: VIN ${vin ?? '—'}  SPZ ${spz ?? '—'}`);
      break;
    }
    case 'employment':
    case 'dpp': {
      const job = data.jobTitle as string | undefined;
      if (job) identLines.push(`Pracovní pozice: ${job}`);
      break;
    }
    case 'loan': {
      const repDate = data.repaymentDate as string | undefined;
      if (repDate) identLines.push(`Splatnost: ${new Date(repDate).toLocaleDateString('cs-CZ')}`);
      break;
    }
    case 'nda': {
      const dur = data.ndaDuration as string | undefined;
      if (dur) identLines.push(`Doba mlčenlivosti: ${dur}`);
      break;
    }
    default:
      break;
  }

  const partyLines = partyPairs.filter(([name]) => !!name);
  if (partyLines.length === 0 && identLines.length === 0) return startY;

  const rowH    = 5.5;
  const padV    = 5;
  const padH    = 6;
  const rowCount = Math.max(partyLines.length, identLines.length);
  const boxH    = rowCount * rowH + padV * 2 + 2;  // +2 for label row

  const colW = (contentWidth - 1) / 2;  // 1 mm gap between columns

  // Background
  doc.setFillColor(BOX_BG_R, BOX_BG_G, BOX_BG_B);
  doc.setDrawColor(BOX_BD_R, BOX_BD_G, BOX_BD_B);
  doc.setLineWidth(0.25);
  doc.roundedRect(MARGIN, startY, contentWidth, boxH, 1.5, 1.5, 'FD');

  // Column divider
  doc.setDrawColor(BOX_BD_R, BOX_BD_G, BOX_BD_B);
  doc.setLineWidth(0.2);
  doc.line(MARGIN + colW + 0.5, startY + 2, MARGIN + colW + 0.5, startY + boxH - 2);

  // Column headers
  const labelY = startY + padV + 1.5;
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(META_R, META_G, META_B);
  doc.text('SMLUVNÍ STRANY', MARGIN + padH, labelY);
  doc.text('IDENTIFIKACE DOKUMENTU', MARGIN + colW + padH + 1, labelY);

  let rowY = labelY + rowH;
  doc.setFont('Roboto', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(BODY_R, BODY_G, BODY_B);

  for (let i = 0; i < rowCount; i++) {
    const [name, role] = partyLines[i] ?? [undefined, undefined];
    if (name && role) {
      // Role label in muted
      doc.setFont('Roboto', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(META_R, META_G, META_B);
      doc.text(`${role}:`, MARGIN + padH, rowY);
      doc.setFont('Roboto', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(BODY_R, BODY_G, BODY_B);
      const nameMaxW = colW - padH - 4;
      const nameTrimmed = doc.splitTextToSize(name, nameMaxW)[0] as string;
      doc.text(nameTrimmed, MARGIN + padH + doc.getTextWidth(`${role}: `), rowY);
    }

    const identLine = identLines[i];
    if (identLine) {
      doc.setFont('Roboto', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(BODY_R, BODY_G, BODY_B);
      const identMaxW = colW - padH - 4;
      const identTrimmed = doc.splitTextToSize(identLine, identMaxW)[0] as string;
      doc.text(identTrimmed, MARGIN + colW + padH + 1, rowY);
    }

    rowY += rowH;
  }

  doc.setTextColor(0);
  doc.setDrawColor(RULE_R, RULE_G, RULE_B);
  doc.setLineWidth(0.2);

  return startY + boxH + 7;
}

// ─────────────────────────────────────────────
//  TABLE OF CONTENTS
// ─────────────────────────────────────────────

async function measureSectionPages(
  data: StoredContractData,
  sections: ReturnType<typeof buildContractSections>,
  meta: ReturnType<typeof getContractMeta>,
  labelLeft: string,
  labelRight: string,
): Promise<Map<string, number>> {
  const scratch = new jsPDF({ unit: 'mm', format: 'a4', compress: false });
  await ensurePdfFonts(scratch);

  const pageWidth = scratch.internal.pageSize.getWidth();
  const contentWidth = pageWidth - MARGIN * 2;
  const pageMap = new Map<string, number>();

  drawHeader(scratch, meta.title, true);
  let y = 40;
  y = drawSummaryBox(scratch, data, data.contractType, y);
  let inProtocol = false;

  for (const section of sections) {
    if (isProtocolSection(section.title) && !inProtocol) {
      inProtocol = true;
      scratch.addPage();
      drawHeader(scratch, meta.title, false);
      y = 22;
    }

    if (isSignatureSection(section.title)) {
      y = drawSignatureSection(scratch, section.title, labelLeft, labelRight, y, meta.title);
      continue;
    }

    const orphanBuffer = section.body.length > 0 ? 32 : 20;
    if (y + orphanBuffer > 272) {
      scratch.addPage();
      drawHeader(scratch, meta.title, false);
      y = 22;
    }

    y += 4;
    pageMap.set(
      section.title,
      (scratch.internal as unknown as { getCurrentPageInfo: () => { pageNumber: number } }).getCurrentPageInfo().pageNumber,
    );

    y = drawSectionTitle(scratch, section.title, y, contentWidth, inProtocol);

    const bodyLines = section.body.slice(0, 80);
    for (let i = 0; i < bodyLines.length; i++) {
      const raw = bodyLines[i] != null ? String(bodyLines[i]) : '';
      const safe = raw.length > 800 ? raw.substring(0, 800) + '…' : (raw.trim() || ' ');
      const split = scratch.splitTextToSize(safe, contentWidth);
      const lh = split.length * BODY_LEAD + 2;
      const isLast = i === bodyLines.length - 1;
      if (isLast ? y + lh > 272 : y + lh + 8 > 272) {
        scratch.addPage();
        drawHeader(scratch, meta.title, false);
        y = 22;
      }
      scratch.text(split, MARGIN, y, { align: 'justify', maxWidth: contentWidth });
      y += lh;
    }
    y += SECTION_GAP;
  }

  return pageMap;
}

function estimateTocPageCount(sections: { title: string }[]): number {
  const visible = sections.filter(s => !isSignatureSection(s.title));
  let y = 40;
  let pages = 1;
  for (const _ of visible) {
    y += 7;
    if (y > 270) { pages++; y = 29; }
  }
  return pages;
}

function drawTableOfContents(
  doc: jsPDF,
  sections: { title: string }[],
  title: string,
  docId: string,
  pageMap?: Map<string, number>,
  tocOffset = 0,
  startY?: number,
): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - MARGIN * 2;

  let y: number;
  if (startY !== undefined) {
    // Inline mode — continue on current page (cover page), no addPage
    y = startY + 6;
    doc.setDrawColor(RULE_R, RULE_G, RULE_B);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, y - 3, MARGIN + contentWidth, y - 3);
  } else {
    doc.addPage();
    drawHeader(doc, title, false, docId);
    y = 22;
  }

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(INK_R, INK_G, INK_B);
  doc.text('OBSAH', MARGIN, y);
  y += 2;

  doc.setDrawColor(INK_R, INK_G, INK_B);
  doc.setLineWidth(0.35);
  doc.line(MARGIN, y, MARGIN + contentWidth, y);
  doc.setLineWidth(0.2);
  doc.setDrawColor(RULE_R, RULE_G, RULE_B);
  y += 7;

  const visibleSections = sections.filter(s => !isSignatureSection(s.title));
  const total = visibleSections.length;

  visibleSections.forEach((section, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(TOC_R, TOC_G, TOC_B);
      doc.rect(MARGIN, y - 4, contentWidth, 7, 'F');
    }

    doc.setFont('Roboto', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(BODY_R, BODY_G, BODY_B);
    doc.text(section.title, MARGIN + 3, y);

    doc.setFontSize(8);
    doc.setTextColor(META_R, META_G, META_B);

    let numText: string;
    if (pageMap && pageMap.has(section.title)) {
      numText = `str. ${(pageMap.get(section.title) ?? 0) + tocOffset}`;
    } else {
      numText = `${idx + 1} / ${total}`;
    }

    const numW  = doc.getTextWidth(numText);
    const titW  = doc.getTextWidth(section.title) + MARGIN + 3;
    const dotsX = Math.min(titW + 4, pageWidth - MARGIN - numW - 10);
    const avail = pageWidth - MARGIN - numW - 4 - dotsX;
    if (avail > 10) {
      const dots = ' · · · · · · · · · · · · · · · · · ·';
      doc.text(dots.substring(0, Math.floor(avail / 2)), dotsX, y);
    }
    doc.text(numText, pageWidth - MARGIN - numW, y);

    y += 7;
    if (y > 270) {
      doc.addPage();
      drawHeader(doc, title, false, docId);
      y = 22;
    }
  });

  doc.setTextColor(0);
  return y;
}

// ─────────────────────────────────────────────
//  SECTION HEADING
// ─────────────────────────────────────────────

/**
 * Full-width neutral thin rule beneath heading — replaces the short gold underline.
 * Returns new Y after heading.
 */
function drawSectionTitle(
  doc: jsPDF,
  title: string,
  y: number,
  contentWidth: number,
  isProtocol = false,
): number {
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(isProtocol ? 10.5 : 11);
  doc.setTextColor(INK_R, INK_G, INK_B);

  const titleLines = doc.splitTextToSize(title, contentWidth);
  doc.text(titleLines, MARGIN, y);
  y += titleLines.length * 6;

  // Full-width thin rule — clean, no decorative accent
  doc.setDrawColor(RULE_R, RULE_G, RULE_B);
  doc.setLineWidth(0.2);
  doc.line(MARGIN, y, pageWidth - MARGIN, y);
  y += 4;

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(BODY_R, BODY_G, BODY_B);

  return y;
}

function drawEndOfTextMarker(doc: jsPDF, y: number, contractTitle = ''): number {
  const pageWidth = doc.internal.pageSize.getWidth();

  if (y > 245) {
    doc.addPage();
    drawHeader(doc, contractTitle, false);
    y = 22;
  }

  y += 3;
  doc.setDrawColor(RULE_R, RULE_G, RULE_B);
  doc.setLineWidth(0.2);
  doc.line(MARGIN, y, pageWidth - MARGIN, y);
  y += 8;

  doc.setTextColor(0);
  return y;
}

// ─────────────────────────────────────────────
//  LEASE HANDOVER PROTOCOL FORM
// ─────────────────────────────────────────────

/**
 * Renders the handover protocol as a structured form with grid sections,
 * checkbox rows for room conditions, and a formal signature block.
 * Called instead of the generic body renderer when the section title
 * matches the lease protocol sentinel.
 */
function drawLeaseProtocolForm(
  doc: jsPDF,
  data: StoredContractData,
  contractTitle: string,
  docId: string,
): void {
  const pageWidth    = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - MARGIN * 2;

  // ── New page, protocol header ──────────────────────────────────────────
  doc.addPage();
  drawHeader(doc, contractTitle, false, docId);
  let y = 20;

  // Protocol title block
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(INK_R, INK_G, INK_B);
  doc.text('PŘÍLOHA Č. 1', MARGIN, y);
  y += 6;
  doc.setFontSize(11);
  doc.text('PROTOKOL O PŘEDÁNÍ A PŘEVZETÍ BYTU', MARGIN, y);
  y += 3;
  doc.setDrawColor(INK_R, INK_G, INK_B);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, y, pageWidth - MARGIN, y);
  doc.setLineWidth(0.2);
  doc.setDrawColor(RULE_R, RULE_G, RULE_B);
  y += 7;

  // Subtitle
  doc.setFont('Roboto', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(META_R, META_G, META_B);
  doc.text('Nedílná součást nájemní smlouvy — vyplní se při fyzickém předání bytu', MARGIN, y);
  y += 8;

  // ── Helper: draw a labelled field box ───────────────────────────────────
  const asT = (v: unknown, fb = '') => {
    if (v === null || v === undefined) return fb;
    const s = String(v).trim();
    return s || fb;
  };

  const drawField = (label: string, value: string, x: number, fw: number, fy: number, fh = 7): number => {
    doc.setFont('Roboto', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(META_R, META_G, META_B);
    doc.text(label.toUpperCase(), x, fy);
    fy += 2.5;
    // Box
    doc.setDrawColor(BOX_BD_R, BOX_BD_G, BOX_BD_B);
    doc.setLineWidth(0.2);
    doc.rect(x, fy, fw, fh);
    if (value) {
      doc.setFont('Roboto', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(BODY_R, BODY_G, BODY_B);
      const trimmed = doc.splitTextToSize(value, fw - 4)[0] as string;
      doc.text(trimmed, x + 2.5, fy + fh - 2.5);
    }
    return fy + fh + 4;
  };

  // ── Section A: Identifikace ──────────────────────────────────────────────
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(INK_R, INK_G, INK_B);
  doc.text('A  IDENTIFIKACE', MARGIN, y);
  y += 1.5;
  doc.setDrawColor(RULE_R, RULE_G, RULE_B);
  doc.setLineWidth(0.15);
  doc.line(MARGIN, y, pageWidth - MARGIN, y);
  y += 4;

  const halfW = (contentWidth - 4) / 2;
  const addrMaxW = contentWidth;
  const propertyAddr = asT(data.propertyAddress || data.flatAddress, '');

  // Address full width
  drawField('Adresa bytu', propertyAddr, MARGIN, addrMaxW, y, 8);
  y += 15;

  // Landlord / Tenant side by side
  const landlordName = asT(data.landlordName, '');
  const tenantName   = asT(data.tenantName, '');
  drawField('Pronajímatel', landlordName, MARGIN, halfW, y, 8);
  drawField('Nájemce', tenantName, MARGIN + halfW + 4, halfW, y, 8);
  y += 15;

  // Handover date / contract ref
  const handoverDate = asT(data.handoverDate, '');
  const handoverDateDisplay = (() => {
    if (!handoverDate) return '';
    const m = handoverDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return m ? `${parseInt(m[3], 10)}. ${parseInt(m[2], 10)}. ${m[1]}` : handoverDate;
  })();
  drawField('Datum předání a převzetí', handoverDateDisplay, MARGIN, halfW, y, 8);
  drawField('Čas předání (vyplní se ručně)', '', MARGIN + halfW + 4, halfW, y, 8);
  y += 15;

  // ── Section B: Klíče ──────────────────────────────────────────────────────
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(INK_R, INK_G, INK_B);
  doc.text('B  PŘEDANÉ KLÍČE A PŘÍSTUPOVÉ PROSTŘEDKY', MARGIN, y);
  y += 1.5;
  doc.setDrawColor(RULE_R, RULE_G, RULE_B);
  doc.setLineWidth(0.15);
  doc.line(MARGIN, y, pageWidth - MARGIN, y);
  y += 5;

  const keyTypes = [
    { label: 'Klíče od bytu', field: 'keysCount' },
    { label: 'Klíče od vchodu / domovní', field: '' },
    { label: 'Klíče od schránky', field: '' },
    { label: 'Klíče od sklepa / garážového stání', field: '' },
    { label: 'Přístupový čip / karta', field: '' },
  ];
  const keyColW = contentWidth / keyTypes.length;

  keyTypes.forEach((kt, idx) => {
    const kx = MARGIN + idx * keyColW;
    doc.setFont('Roboto', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(META_R, META_G, META_B);
    const labelLines = doc.splitTextToSize(kt.label, keyColW - 2);
    doc.text(labelLines, kx, y);
    const labelH = labelLines.length * 4;
    // Small count box
    doc.setDrawColor(BOX_BD_R, BOX_BD_G, BOX_BD_B);
    doc.setLineWidth(0.2);
    doc.rect(kx, y + labelH, keyColW - 3, 8);
    const prefilled = kt.field ? asT((data as any)[kt.field], '') : '';
    if (prefilled) {
      doc.setFont('Roboto', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(BODY_R, BODY_G, BODY_B);
      doc.text(`${prefilled} ks`, kx + 2, y + labelH + 5.5);
    } else {
      doc.setFont('Roboto', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(META_R, META_G, META_B);
      doc.text('_____ ks', kx + 2, y + labelH + 5.5);
    }
  });
  y += 22;

  // ── Section C: Stav měřidel ───────────────────────────────────────────────
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(INK_R, INK_G, INK_B);
  doc.text('C  STAV MĚŘIDEL KE DNI PŘEDÁNÍ', MARGIN, y);
  y += 1.5;
  doc.setDrawColor(RULE_R, RULE_G, RULE_B);
  doc.setLineWidth(0.15);
  doc.line(MARGIN, y, pageWidth - MARGIN, y);
  y += 5;

  const meters = [
    {
      label: 'Elektroměr',
      serial: asT(data.electricityMeterSerial, ''),
      value: asT(data.electricityMeter, ''),
      unit: 'kWh',
    },
    {
      label: 'Plynoměr',
      serial: asT(data.gasMeterSerial, ''),
      value: asT(data.gasMeter, ''),
      unit: 'm³',
    },
    {
      label: 'Vodoměr — studená',
      serial: asT(data.waterMeterSerial, ''),
      value: asT(data.waterMeter, ''),
      unit: 'm³',
    },
    {
      label: 'Vodoměr — teplá',
      serial: asT(data.hotWaterMeterSerial, ''),
      value: asT(data.hotWaterMeter, ''),
      unit: 'm³',
    },
  ];

  const mColW  = contentWidth / meters.length;
  const mBoxH  = 22;

  meters.forEach((m, idx) => {
    const mx = MARGIN + idx * mColW;
    // Outer box
    doc.setFillColor(BOX_BG_R, BOX_BG_G, BOX_BG_B);
    doc.setDrawColor(BOX_BD_R, BOX_BD_G, BOX_BD_B);
    doc.setLineWidth(0.2);
    doc.rect(mx, y, mColW - 2, mBoxH, 'FD');
    // Label
    doc.setFont('Roboto', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(META_R, META_G, META_B);
    doc.text(m.label.toUpperCase(), mx + 2.5, y + 4.5);
    // Serial
    doc.setFont('Roboto', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(META_R, META_G, META_B);
    doc.text(`č. ${m.serial || '_______________'}`, mx + 2.5, y + 9);
    // Value — large
    doc.setFont('Roboto', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(m.value ? BODY_R : META_R, m.value ? BODY_G : META_G, m.value ? BODY_B : META_B);
    doc.text(m.value || '_____________', mx + 2.5, y + 16.5);
    // Unit
    doc.setFont('Roboto', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(META_R, META_G, META_B);
    doc.text(m.unit, mx + mColW - 6, y + mBoxH - 3);
  });
  y += mBoxH + 6;

  // ── Section D: Vybavení a inventář ────────────────────────────────────────
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(INK_R, INK_G, INK_B);
  doc.text('D  PŘEDÁVANÉ VYBAVENÍ A INVENTÁŘ', MARGIN, y);
  y += 1.5;
  doc.setDrawColor(RULE_R, RULE_G, RULE_B);
  doc.setLineWidth(0.15);
  doc.line(MARGIN, y, pageWidth - MARGIN, y);
  y += 4;

  const equipText = asT(data.equipmentList, 'Bez předávaného vybavení / dle samostatného soupisu připojeného k tomuto protokolu.');
  const equipLines = doc.splitTextToSize(equipText, contentWidth - 5);
  const equipBoxH  = Math.max(equipLines.length * 5.5 + 6, 16);
  doc.setFillColor(BOX_BG_R, BOX_BG_G, BOX_BG_B);
  doc.setDrawColor(BOX_BD_R, BOX_BD_G, BOX_BD_B);
  doc.setLineWidth(0.2);
  doc.rect(MARGIN, y, contentWidth, equipBoxH, 'FD');
  doc.setFont('Roboto', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(BODY_R, BODY_G, BODY_B);
  doc.text(equipLines, MARGIN + 2.5, y + 5);
  y += equipBoxH + 6;

  // ── Section E: Stav místností ─────────────────────────────────────────────
  // Check if enough space; if not, new page
  const roomsNeeded = 80;
  if (y + roomsNeeded > 272) {
    doc.addPage();
    drawHeader(doc, contractTitle, false, docId);
    y = 20;
  }

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(INK_R, INK_G, INK_B);
  doc.text('E  STAV MÍSTNOSTÍ', MARGIN, y);
  y += 1.5;
  doc.setDrawColor(RULE_R, RULE_G, RULE_B);
  doc.setLineWidth(0.15);
  doc.line(MARGIN, y, pageWidth - MARGIN, y);
  y += 4;

  // Column headers
  const roomLabelW  = 52;
  const ratingW     = (contentWidth - roomLabelW - 2) / 4;
  const ratings     = ['VÝBORNÝ', 'DOBRÝ', 'PŘIJATELNÝ', 'OPRAVY'];

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(META_R, META_G, META_B);
  doc.text('MÍSTNOST', MARGIN, y + 4);
  ratings.forEach((r, i) => {
    doc.text(r, MARGIN + roomLabelW + 2 + i * ratingW + ratingW / 2, y + 4, { align: 'center' });
  });

  // Thin header rule
  doc.setDrawColor(RULE_R, RULE_G, RULE_B);
  doc.setLineWidth(0.15);
  doc.line(MARGIN, y + 6, pageWidth - MARGIN, y + 6);
  y += 8;

  const rooms = [
    'Obývací pokoj', 'Ložnice', 'Kuchyně', 'Koupelna',
    'WC / koupelna s WC', 'Chodba / předsíň',
    'Sklep / komora / lodžie',
  ];

  rooms.forEach((room, ridx) => {
    const rowY = y + ridx * 10;
    // Alternating stripe
    if (ridx % 2 === 0) {
      doc.setFillColor(TOC_R, TOC_G, TOC_B);
      doc.rect(MARGIN, rowY - 3, contentWidth, 10, 'F');
    }
    // Room name
    doc.setFont('Roboto', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(BODY_R, BODY_G, BODY_B);
    doc.text(room, MARGIN, rowY + 3.5);
    // Checkbox squares
    ratings.forEach((_, ci) => {
      const cx = MARGIN + roomLabelW + 2 + ci * ratingW + ratingW / 2 - 3.5;
      doc.setDrawColor(SIGN_R, SIGN_G, SIGN_B);
      doc.setLineWidth(0.2);
      doc.rect(cx, rowY, 7, 7);
    });
  });
  y += rooms.length * 10 + 6;

  // Poznámky ke stavu místností
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(META_R, META_G, META_B);
  doc.text('POZNÁMKY KE STAVU MÍSTNOSTÍ', MARGIN, y);
  y += 3;
  doc.setDrawColor(BOX_BD_R, BOX_BD_G, BOX_BD_B);
  doc.setLineWidth(0.2);
  doc.rect(MARGIN, y, contentWidth, 20, 'D');
  y += 24;

  // ── Section F: Vady a poškození ───────────────────────────────────────────
  if (y + 50 > 272) {
    doc.addPage();
    drawHeader(doc, contractTitle, false, docId);
    y = 20;
  }

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(INK_R, INK_G, INK_B);
  doc.text('F  ZJIŠTĚNÉ VADY A POŠKOZENÍ', MARGIN, y);
  y += 1.5;
  doc.setDrawColor(RULE_R, RULE_G, RULE_B);
  doc.setLineWidth(0.15);
  doc.line(MARGIN, y, pageWidth - MARGIN, y);
  y += 4;

  const defects = asT(data.knownDefects, 'Byt se předává bez zjevných vad přesahujících obvyklé opotřebení.');
  const defectLines = doc.splitTextToSize(defects, contentWidth - 5);
  const defectBoxH  = Math.max(defectLines.length * 5.5 + 6, 20);
  doc.setFillColor(BOX_BG_R, BOX_BG_G, BOX_BG_B);
  doc.setDrawColor(BOX_BD_R, BOX_BD_G, BOX_BD_B);
  doc.setLineWidth(0.2);
  doc.rect(MARGIN, y, contentWidth, defectBoxH, 'FD');
  doc.setFont('Roboto', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(BODY_R, BODY_G, BODY_B);
  doc.text(defectLines, MARGIN + 2.5, y + 5);
  y += defectBoxH + 5;

  // Extra blank notes space
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(META_R, META_G, META_B);
  doc.text('DOPLŇUJÍCÍ POZNÁMKY (vyplní strany ručně)', MARGIN, y);
  y += 3;
  doc.setDrawColor(BOX_BD_R, BOX_BD_G, BOX_BD_B);
  doc.setLineWidth(0.2);
  doc.rect(MARGIN, y, contentWidth, 18, 'D');
  y += 22;

  // ── Section G: Celkový stav ────────────────────────────────────────────────
  if (y + 40 > 272) {
    doc.addPage();
    drawHeader(doc, contractTitle, false, docId);
    y = 20;
  }

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(INK_R, INK_G, INK_B);
  doc.text('G  CELKOVÉ HODNOCENÍ BYTU', MARGIN, y);
  y += 1.5;
  doc.setDrawColor(RULE_R, RULE_G, RULE_B);
  doc.setLineWidth(0.15);
  doc.line(MARGIN, y, pageWidth - MARGIN, y);
  y += 5;

  const overallRatings = ['VÝBORNÝ', 'DOBRÝ', 'PŘIJATELNÝ', 'VYŽADUJE OPRAVY'];
  const orW = contentWidth / overallRatings.length;
  overallRatings.forEach((r, i) => {
    const ox = MARGIN + i * orW;
    doc.setDrawColor(SIGN_R, SIGN_G, SIGN_B);
    doc.setLineWidth(0.25);
    doc.rect(ox, y, 9, 9);
    doc.setFont('Roboto', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(BODY_R, BODY_G, BODY_B);
    doc.text(r, ox + 12, y + 6.5);
  });
  y += 16;

  // ── Section H: Potvrzení a podpisy ────────────────────────────────────────
  if (y + 65 > 272) {
    doc.addPage();
    drawHeader(doc, contractTitle, false, docId);
    y = 20;
  }

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(INK_R, INK_G, INK_B);
  doc.text('H  POTVRZENÍ A PODPISY', MARGIN, y);
  y += 1.5;
  doc.setDrawColor(RULE_R, RULE_G, RULE_B);
  doc.setLineWidth(0.15);
  doc.line(MARGIN, y, pageWidth - MARGIN, y);
  y += 6;

  // Confirmation text
  doc.setFont('Roboto', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(BODY_R, BODY_G, BODY_B);
  const confirmText =
    'Smluvní strany potvrzují, že byt byl předán a převzat v souladu s nájemní smlouvou ' +
    'a v rozsahu uvedeném v tomto protokolu. Podepsáním tohoto protokolu berou strany na vědomí ' +
    'jeho obsah a souhlasí s ním.';
  const confirmLines = doc.splitTextToSize(confirmText, contentWidth);
  doc.text(confirmLines, MARGIN, y);
  y += confirmLines.length * 5 + 8;

  // Place / date line + signature columns
  const colW   = (contentWidth - 10) / 2;
  const rightX = MARGIN + colW + 10;

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(BODY_R, BODY_G, BODY_B);
  doc.text('V', MARGIN, y);
  doc.setDrawColor(SIGN_R, SIGN_G, SIGN_B);
  doc.setLineWidth(0.25);
  doc.line(MARGIN + 5, y, MARGIN + colW * 0.52, y);
  doc.text('dne', MARGIN + colW * 0.55, y);
  doc.line(MARGIN + colW * 0.64, y, MARGIN + colW, y);
  doc.text('V', rightX, y);
  doc.line(rightX + 5, y, rightX + colW * 0.52, y);
  doc.text('dne', rightX + colW * 0.55, y);
  doc.line(rightX + colW * 0.64, y, rightX + colW, y);
  doc.setLineWidth(0.2);
  doc.setDrawColor(RULE_R, RULE_G, RULE_B);
  y += 14;

  // Signature lines
  doc.setDrawColor(50, 50, 50);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, MARGIN + colW, y);
  doc.line(rightX, y, rightX + colW, y);
  y += 4;

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(META_R, META_G, META_B);
  doc.text('(vlastnoruční podpis)', MARGIN + colW / 2, y, { align: 'center' });
  doc.text('(vlastnoruční podpis)', rightX + colW / 2, y, { align: 'center' });
  y += 6;

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(INK_R, INK_G, INK_B);
  doc.text('PRONAJÍMATEL', MARGIN + colW / 2, y, { align: 'center' });
  doc.text('NÁJEMCE', rightX + colW / 2, y, { align: 'center' });

  // Names below role labels
  y += 5;
  const lName = asT(data.landlordName, '');
  const tName = asT(data.tenantName, '');
  doc.setFont('Roboto', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(META_R, META_G, META_B);
  if (lName) doc.text(lName, MARGIN + colW / 2, y, { align: 'center' });
  if (tName) doc.text(tName, rightX + colW / 2, y, { align: 'center' });

  doc.setTextColor(0);
}

// ─────────────────────────────────────────────
//  SIGNATURE SECTION
// ─────────────────────────────────────────────

function drawSignatureSection(
  doc: jsPDF,
  sectionTitle: string,
  labelLeft: string,
  labelRight: string,
  y: number,
  contractTitle = '',
): number {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Needs ~65 mm — break early if not enough space
  if (y > 215) {
    doc.addPage();
    drawHeader(doc, contractTitle, false);
    y = 22;
  }

  // Section heading
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(INK_R, INK_G, INK_B);
  doc.text(sectionTitle, MARGIN, y);

  doc.setDrawColor(RULE_R, RULE_G, RULE_B);
  doc.setLineWidth(0.2);
  doc.line(MARGIN, y + 2, pageWidth - MARGIN, y + 2);
  y += 12;

  // Two equal signature columns
  const colW    = (pageWidth - MARGIN * 2 - 10) / 2;
  const leftX   = MARGIN;
  const rightX  = MARGIN + colW + 10;

  // "V ____ dne ____" — place and date line
  doc.setFont('Roboto', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(BODY_R, BODY_G, BODY_B);

  doc.text('V', leftX, y);
  doc.setDrawColor(SIGN_R, SIGN_G, SIGN_B);
  doc.setLineWidth(0.25);
  doc.line(leftX + 5, y, leftX + colW * 0.52, y);
  doc.text('dne', leftX + colW * 0.55, y);
  doc.line(leftX + colW * 0.64, y, leftX + colW, y);

  doc.text('V', rightX, y);
  doc.line(rightX + 5, y, rightX + colW * 0.52, y);
  doc.text('dne', rightX + colW * 0.55, y);
  doc.line(rightX + colW * 0.64, y, rightX + colW, y);
  doc.setLineWidth(0.2);
  doc.setDrawColor(RULE_R, RULE_G, RULE_B);
  y += 13;

  // "Jméno hůlkovým písmem" label + line
  doc.setFont('Roboto', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(META_R, META_G, META_B);
  doc.text('Jméno a příjmení (hůlkovým písmem):', leftX, y);
  doc.text('Jméno a příjmení (hůlkovým písmem):', rightX, y);
  y += 4;

  doc.setDrawColor(SIGN_R, SIGN_G, SIGN_B);
  doc.setLineWidth(0.25);
  doc.line(leftX, y, leftX + colW, y);
  doc.line(rightX, y, rightX + colW, y);
  doc.setLineWidth(0.2);
  doc.setDrawColor(RULE_R, RULE_G, RULE_B);
  y += 14;

  // Main signature line — slightly heavier, prominent
  doc.setDrawColor(50, 50, 50);
  doc.setLineWidth(0.5);
  doc.line(leftX, y, leftX + colW, y);
  doc.line(rightX, y, rightX + colW, y);
  y += 4;

  // "(vlastnoruční podpis)"
  doc.setFont('Roboto', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(META_R, META_G, META_B);
  doc.text('(vlastnoruční podpis)', leftX + colW / 2, y, { align: 'center' });
  doc.text('(vlastnoruční podpis)', rightX + colW / 2, y, { align: 'center' });
  y += 7;

  // Role labels
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(INK_R, INK_G, INK_B);
  doc.text(labelLeft.toUpperCase(), leftX + colW / 2, y, { align: 'center' });
  doc.text(labelRight.toUpperCase(), rightX + colW / 2, y, { align: 'center' });
  y += 10;

  // Closing note — plain, concise
  doc.setFont('Roboto', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(META_R, META_G, META_B);
  const note =
    'Smlouva nabývá platnosti podpisem obou smluvních stran. Je-li podepisována elektronicky, platí přiměřeně nařízení EU č. 910/2014 (eIDAS).';
  const noteLines = doc.splitTextToSize(note, pageWidth - MARGIN * 2);
  doc.text(noteLines, MARGIN, y);
  doc.setTextColor(0);

  return y + noteLines.length * 4.5 + 6;
}

// ─────────────────────────────────────────────
//  COMPLETE-TIER APPENDIX PAGES
// ─────────────────────────────────────────────

function getSigningInstructions(contractType: ContractType): string[] {
  const common = [
    'PRŮVODNÍ POKYNY K PODPISU A ARCHIVACI',
    '',
    'Tento dokument obsahuje doporučený postup pro správné podepsání, ověření a archivaci vaší smlouvy.',
    '',
    '1. PŘÍPRAVA PŘED PODPISEM',
    '• Pečlivě přečtěte celý text smlouvy včetně příloh.',
    '• Ověřte správnost všech údajů: jména, adresy, částky, data.',
    '• Přílohy (předávací protokol apod.) připravte k podpisu současně se smlouvou.',
    '• Zajistěte, aby obě strany měly dostatek času na prostudování dokumentu.',
    '',
    '2. PODPIS',
    '• Smlouvu podepisujte v minimálně dvou vyhotoveních — po jednom pro každou stranu.',
    '• Podpis umístěte na vyhrazené podpisové řádky na konci smlouvy.',
    '• Použijte trvanlivý inkoust (kuličkové pero).',
    '• U vícestránkových smluv doporučujeme parafovat každou stranu.',
    '• Datum a místo podpisu vyplňte v den skutečného podpisu.',
    '',
    '3. ÚŘEDNÍ OVĚŘENÍ (VOLITELNÉ)',
    '• U smluv s vyšší hodnotou (nad 50 000 Kč) zvažte ověření podpisů na Czech POINTu nebo u notáře.',
    '• Ověření zvyšuje důkazní hodnotu dokumentu. Cena: přibližně 30 Kč za podpis na Czech POINTu.',
    '',
    '4. ARCHIVACE',
    '• Originál uchovejte po celou dobu platnosti smlouvy a nejméně 3 roky po jejím skončení (§ 629 OZ).',
    '• Pořiďte si digitální zálohu (scan nebo fotografie).',
    '',
    '5. ELEKTRONICKÝ PODPIS',
    '• Smlouvu lze podepsat elektronicky dle nařízení EU č. 910/2014 (eIDAS) a zák. č. 297/2016 Sb.',
    '• Kvalifikovaný elektronický podpis (QES) má účinky vlastnoručního podpisu; je plně uznáván soudy i orgány EU.',
    '• Zaručený elektronický podpis (AES) je platný, avšak jeho důkazní síla v případě sporu je nižší než u QES.',
    '• Poskytovatelé: Signi.cz, iSmlouva.cz, DocuSign, Adobe Sign — ověřte soulad s eIDAS.',
    '• Smlouvy vyžadující notářsky ověřený podpis (nemovitosti, katastrální vklad) je elektronicky možné uzavřít pouze s QES.',
  ];

  const specific: Record<string, string[]> = {
    lease: [
      '',
      '6. ZVLÁŠTNÍ POKYNY PRO NÁJEMNÍ SMLOUVU',
      '• Současně s podpisem smlouvy proveďte předání bytu a sepište předávací protokol.',
      '• Zdokumentujte stav nemovitosti fotografiemi (měřidla, stěny, podlahy, spotřebiče).',
      '• Nájemce obdrží veškeré klíče; jejich počet zapište do předávacího protokolu.',
      '• Jistota (kauce) musí být převedena dohodnutým způsobem; uchovejte doklad o úhradě.',
    ],
    car_sale: [
      '',
      '6. ZVLÁŠTNÍ POKYNY PRO KUPNÍ SMLOUVU NA VOZIDLO',
      '• Současně s podpisem předejte velký i malý technický průkaz.',
      '• Změnu vlastníka oznamte příslušnému úřadu do 10 pracovních dnů.',
      '• Zdokumentujte stav tachometru a celkový stav vozidla fotografiemi.',
      '• Ověřte, zda na vozidle nevázne zákaz převodu (registr vozidel).',
    ],
    employment: [
      '',
      '6. ZVLÁŠTNÍ POKYNY PRO PRACOVNÍ SMLOUVU',
      '• Zaměstnanec musí obdržet jedno vyhotovení smlouvy nejpozději v den nástupu do práce.',
      '• Zaměstnavatel je povinen přihlásit zaměstnance na ČSSZ a příslušnou zdravotní pojišťovnu.',
    ],
    gift: [
      '',
      '6. ZVLÁŠTNÍ POKYNY PRO DAROVACÍ SMLOUVU',
      '• NEMOVITOST: Podpisy obou stran musí být úředně ověřeny (notář nebo Czech POINT). Bez ověření katastr vklad zamítne.',
      '• U movitých věcí a peněz dochází k převodu vlastnictví předáním nebo převodem na účet.',
      '• Obdarovaný může být povinen uvést dar v daňovém přiznání; ověřte podmínky osvobození.',
    ],
  };

  return [...common, ...(specific[contractType] || [])];
}

function getPreSignChecklist(contractType: ContractType): string[] {
  const common = [
    'KONTROLNÍ SEZNAM PŘED PODPISEM',
    '',
    'Před podpisem smlouvy ověřte každý z níže uvedených bodů:',
    '',
    '☐  Jména a příjmení všech smluvních stran jsou správně uvedena',
    '☐  Adresy trvalého bydliště / sídla jsou aktuální',
    '☐  Data narození / IČO jsou bez překlepů',
    '☐  Předmět smlouvy je jasně a jednoznačně vymezen',
    '☐  Finanční podmínky (cena, nájem, mzda) odpovídají dohodě stran',
    '☐  Datum účinnosti smlouvy je správné',
    '☐  Doba trvání a výpovědní podmínky odpovídají dohodě',
    '☐  Platební podmínky jsou jasné a úplné',
    '☐  Práva a povinnosti obou stran jsou vyvážená',
    '☐  Smluvní pokuty jsou přiměřené a nepřekračují zákonné limity',
    '☐  Způsob řešení sporů je uveden',
    '☐  Smlouva neobsahuje nevyplněná pole',
    '☐  Počet vyhotovení odpovídá počtu smluvních stran',
    '☐  Veškeré přílohy jsou přiloženy a kompletní',
  ];

  const specific: Record<string, string[]> = {
    lease: [
      '',
      'SPECIFICKY PRO NÁJEMNÍ SMLOUVU:',
      '☐  Adresa a dispozice bytu odpovídají skutečnosti',
      '☐  Výše nájemného a záloh na služby je správná',
      '☐  Výše jistoty nepřekračuje trojnásobek měsíčního nájemného (§ 2254 OZ)',
      '☐  Způsob vyúčtování služeb je upraven',
      '☐  Předávací protokol je připraven k podpisu',
    ],
    car_sale: [
      '',
      'SPECIFICKY PRO KUPNÍ SMLOUVU NA VOZIDLO:',
      '☐  VIN kód odpovídá údajům v technickém průkazu',
      '☐  Stav tachometru je zaznamenán',
      '☐  Jsou uvedeny veškeré známé vady vozidla',
      '☐  Způsob předání technického průkazu je sjednán',
    ],
    employment: [
      '',
      'SPECIFICKY PRO PRACOVNÍ SMLOUVU:',
      '☐  Druh práce odpovídá skutečně zastávané pozici',
      '☐  Místo výkonu práce je správně uvedeno',
      '☐  Den nástupu je reálný',
      '☐  Mzdové podmínky odpovídají dohodě',
      '☐  Zkušební doba nepřesahuje zákonné maximum',
    ],
    loan: [
      '',
      'SPECIFICKY PRO SMLOUVU O ZÁPŮJČCE:',
      '☐  Výše zápůjčky odpovídá skutečně předávané částce',
      '☐  Ujednané úroky jsou v souladu se zákonem',
      '☐  Termín splatnosti je reálný a jednoznačný',
      '☐  Způsob vrácení (jednorázově / splátky) je jasný',
    ],
  };

  return [...common, ...(specific[contractType] || [])];
}

function drawCompleteTierPages(
  doc: jsPDF,
  contractType: ContractType,
  contentWidth: number,
  title: string,
  docId: string,
): void {
  const pageWidth = doc.internal.pageSize.getWidth();

  // --- Průvodní pokyny ---
  doc.addPage();
  drawHeader(doc, title, false, docId);
  let y = 22;

  doc.setDrawColor(RULE_R, RULE_G, RULE_B);
  doc.setLineWidth(0.2);
  doc.line(MARGIN, y, pageWidth - MARGIN, y);
  y += 6;

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(META_R, META_G, META_B);
  doc.text('PŘÍLOHA K DOKUMENTU — PRŮVODNÍ POKYNY', MARGIN, y);
  y += 8;

  const instructions = getSigningInstructions(contractType);
  for (const line of instructions) {
    if (!line) { y += 3; continue; }
    const isHeading = /^\d+\.\s/.test(line) || (line === line.toUpperCase() && line.length > 4);
    if (isHeading) {
      doc.setFont('Roboto', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(INK_R, INK_G, INK_B);
    } else {
      doc.setFont('Roboto', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(BODY_R, BODY_G, BODY_B);
    }
    const split = doc.splitTextToSize(line, contentWidth);
    if (y + split.length * 5 > 272) {
      doc.addPage();
      drawHeader(doc, title, false, docId);
      y = 22;
    }
    doc.text(split, MARGIN, y);
    y += split.length * 5 + 1;
  }

  // --- Kontrolní seznam ---
  doc.addPage();
  drawHeader(doc, title, false, docId);
  y = 22;

  doc.setDrawColor(RULE_R, RULE_G, RULE_B);
  doc.setLineWidth(0.2);
  doc.line(MARGIN, y, pageWidth - MARGIN, y);
  y += 6;

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(META_R, META_G, META_B);
  doc.text('PŘÍLOHA K DOKUMENTU — KONTROLNÍ SEZNAM', MARGIN, y);
  y += 8;

  const checklist = getPreSignChecklist(contractType);
  for (const line of checklist) {
    if (!line) { y += 3; continue; }
    const isHeading = !line.startsWith('☐') && (line === line.toUpperCase() || line.includes('SPECIFICKY'));
    if (isHeading) {
      doc.setFont('Roboto', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(INK_R, INK_G, INK_B);
    } else {
      doc.setFont('Roboto', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(BODY_R, BODY_G, BODY_B);
    }
    const split = doc.splitTextToSize(line, contentWidth);
    if (y + split.length * 5 > 272) {
      doc.addPage();
      drawHeader(doc, title, false, docId);
      y = 22;
    }
    doc.text(split, MARGIN, y);
    y += split.length * 5 + 1.5;
  }
}

// ─────────────────────────────────────────────
//  MAIN RENDER
// ─────────────────────────────────────────────

export async function renderContractPdf(data: StoredContractData): Promise<Buffer> {
  const meta      = getContractMeta(data.contractType);
  const sections  = buildContractSections(data);
  const [labelLeft, labelRight] = getSignatureLabels(data.contractType, data);
  const { hasPremiumClauses, hasCompletePages } = resolveTierFeatures(data);
  const tier      = (data.tier as string) ?? (data.notaryUpsell ? 'professional' : 'basic');
  const { docId, hash } = buildDocumentTrace(data);

  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  await ensurePdfFonts(doc);

  const generatedDate = new Date().toLocaleDateString('cs-CZ');
  (doc as any).setProperties({
    title:    meta.title,
    subject:  `Smlouva vygenerovaná na SmlouvaHned.cz – ${generatedDate} – ${docId}`,
    author:   'SmlouvaHned.cz',
    keywords: `smlouva, ${data.contractType}, česká republika`,
    creator:  'SmlouvaHned.cz',
  });

  const pageWidth    = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - MARGIN * 2;

  // ── First page ──
  drawHeader(doc, meta.title, true, docId);

  // First-page body starts with generous breathing room below header
  let y = 40;
  y = drawSummaryBox(doc, data, data.contractType, y);

  let inProtocol   = false;
  let endOfTextDrawn = false;

  // ── TOC (premium tiers) — merged onto cover page (page 1), content starts page 2 ──
  if (hasPremiumClauses) {
    const sectionPageMap = await measureSectionPages(data, sections, meta, labelLeft, labelRight);
    // tocOffset=1: scratch page numbers start at 1; real content starts at page 2 → offset by 1
    drawTableOfContents(doc, sections, meta.title, docId, sectionPageMap, 1, y);
    doc.addPage();
    drawHeader(doc, meta.title, false, docId);
    y = 22;
  }

  // ── Contract body ──
  for (const section of sections) {
    // Lease handover protocol → custom form renderer (replaces generic body)
    if (isLeaseProtocol(section.title)) {
      drawLeaseProtocolForm(doc, data, meta.title, docId);
      inProtocol = true;
      continue;
    }

    // Other protocol / annex sections → forced new page + thin rule header
    if (isProtocolSection(section.title) && !inProtocol) {
      inProtocol = true;
      doc.addPage();
      drawHeader(doc, meta.title, false, docId);
      y = 22;
      doc.setDrawColor(RULE_R, RULE_G, RULE_B);
      doc.setLineWidth(0.2);
      doc.line(MARGIN, y, pageWidth - MARGIN, y);
      doc.setLineWidth(0.2);
      y += 8;
    }

    if (isSignatureSection(section.title)) {
      if (!endOfTextDrawn) {
        y = drawEndOfTextMarker(doc, y, meta.title);
        endOfTextDrawn = true;
      }
      y = drawSignatureSection(doc, section.title, labelLeft, labelRight, y, meta.title);
      continue;
    }

    // Orphan guard
    const orphanBuffer = section.body.length > 0 ? 32 : 20;
    if (y + orphanBuffer > 272) {
      doc.addPage();
      drawHeader(doc, meta.title, false, docId);
      y = 22;
      doc.setFont('Roboto', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(BODY_R, BODY_G, BODY_B);
    }

    y += 4;
    y = drawSectionTitle(doc, section.title, y, contentWidth, inProtocol);

    const bodyLines = section.body.slice(0, 80);
    for (let i = 0; i < bodyLines.length; i++) {
      const raw  = bodyLines[i] != null ? String(bodyLines[i]) : '';
      const safe = raw.length > 800 ? raw.substring(0, 800) + '…' : (raw.trim() || ' ');
      const split = doc.splitTextToSize(safe, contentWidth);

      const lh     = split.length * BODY_LEAD + 2;
      const isLast = i === bodyLines.length - 1;
      const needsBreak = isLast ? y + lh > 272 : y + lh + 8 > 272;

      if (needsBreak) {
        doc.addPage();
        drawHeader(doc, meta.title, false, docId);
        y = 22;
        doc.setFont('Roboto', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(BODY_R, BODY_G, BODY_B);
      }

      doc.text(split, MARGIN, y, { align: 'justify', maxWidth: contentWidth });
      y += lh;
    }

    y += SECTION_GAP;
  }

  // ── Complete-tier appendix pages ──
  if (hasCompletePages) {
    drawCompleteTierPages(doc, data.contractType, contentWidth, meta.title, docId);
  }

  // ── Footers (post-processing pass) ──
  drawFooter(doc, docId, hash, tier);

  return Buffer.from(doc.output('arraybuffer'));
}
