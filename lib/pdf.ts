import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { jsPDF } from 'jspdf';
import { getContractMeta, buildContractSections, type StoredContractData, type ContractType, type Tier } from './contracts';

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

/** Kompletní balíček (749 Kč) — průvodní instrukce k podpisu a archivaci */
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
  ];

  // Contract-type specific tips
  const specific: Record<string, string[]> = {
    lease: [
      '',
      '5. SPECIFICKÉ POKYNY PRO NÁJEMNÍ SMLOUVU',
      '• Současně s podpisem smlouvy proveďte předání bytu a sepište předávací protokol.',
      '• Zdokumentujte stav bytu fotografiemi (vodoměry, elektroměr, stav zdí, podlah, spotřebičů).',
      '• Ověřte, že nájemce obdržel všechny klíče a zapsal stavy měřidel.',
      '• Pokud je jistota (kauce), převeďte ji dohodnutým způsobem a uchovejte doklad.',
    ],
    car_sale: [
      '',
      '5. SPECIFICKÉ POKYNY PRO KUPNÍ SMLOUVU NA VOZIDLO',
      '• Současně s podpisem předejte velký a malý technický průkaz.',
      '• Zapište změnu vlastníka na příslušném úřadě do 10 pracovních dnů.',
      '• Zdokumentujte stav tachometru a stav vozidla fotografiemi.',
      '• Ověřte, že vozidlo nemá zákaz převodu (registr vozidel).',
    ],
    employment: [
      '',
      '5. SPECIFICKÉ POKYNY PRO PRACOVNÍ SMLOUVU',
      '• Zaměstnanec musí obdržet jedno vyhotovení smlouvy.',
      '• Pracovní smlouvu je nutné uzavřít nejpozději v den nástupu do práce.',
      '• Zaměstnavatel je povinen přihlásit zaměstnance na ČSSZ a zdravotní pojišťovnu.',
    ],
    gift: [
      '',
      '5. SPECIFICKÉ POKYNY PRO DAROVACÍ SMLOUVU',
      '• U nemovitostí je nutný vklad do katastru nemovitostí — smlouva musí mít ověřené podpisy.',
      '• U movitých věcí dochází k převodu vlastnictví předáním daru.',
      '• Obdarovaný je povinen přiznat dar v daňovém přiznání, pokud nepodléhá osvobození.',
    ],
  };

  return [...common, ...(specific[contractType] || [])];
}

/** Kompletní balíček (749 Kč) — checklist co zkontrolovat před podpisem */
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
      '☐  Výše jistoty (kauce) nepřesahuje trojnásobek měsíčního nájemného',
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

/** Přidá extra stránky pro Kompletní balíček (749 Kč) */
function drawCompleteTierPages(doc: jsPDF, contractType: ContractType, margin: number, contentWidth: number, title: string): void {
  // --- Page: Průvodní instrukce ---
  doc.addPage();
  drawHeader(doc, title);
  let y = 35;

  // Decorative separator
  doc.setDrawColor(200, 160, 40);
  doc.setLineWidth(0.5);
  doc.line(margin, y, margin + contentWidth, y);
  doc.setLineWidth(0.2);
  doc.setDrawColor(180, 180, 180);
  y += 5;

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text('PŘÍLOHA — KOMPLETNÍ BALÍČEK SMLOUVAHNED', margin, y);
  y += 8;

  const instructions = getSigningInstructions(contractType);
  for (const line of instructions) {
    if (!line) { y += 3; continue; }

    const isHeading = /^\d+\.\s/.test(line) || line === line.toUpperCase();
    if (isHeading) {
      doc.setFont('Roboto', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(20, 20, 20);
    } else {
      doc.setFont('Roboto', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(40, 40, 40);
    }

    const splitLines = doc.splitTextToSize(line, contentWidth);
    if (y + splitLines.length * 5 > 275) {
      doc.addPage();
      drawHeader(doc, title);
      y = 35;
      doc.setFont('Roboto', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(40, 40, 40);
    }
    doc.text(splitLines, margin, y);
    y += splitLines.length * 5 + 1;
  }

  // --- Page: Checklist ---
  doc.addPage();
  drawHeader(doc, title);
  y = 35;

  doc.setDrawColor(200, 160, 40);
  doc.setLineWidth(0.5);
  doc.line(margin, y, margin + contentWidth, y);
  doc.setLineWidth(0.2);
  doc.setDrawColor(180, 180, 180);
  y += 5;

  doc.setFont('Roboto', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text('PŘÍLOHA — CHECKLIST PŘED PODPISEM', margin, y);
  y += 8;

  const checklist = getPreSignChecklist(contractType);
  for (const line of checklist) {
    if (!line) { y += 3; continue; }

    const isHeading = !line.startsWith('☐') && (line === line.toUpperCase() || line.includes('SPECIFICKY'));
    if (isHeading) {
      doc.setFont('Roboto', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(20, 20, 20);
    } else {
      doc.setFont('Roboto', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(40, 40, 40);
    }

    const splitLines = doc.splitTextToSize(line, contentWidth);
    if (y + splitLines.length * 5 > 275) {
      doc.addPage();
      drawHeader(doc, title);
      y = 35;
      doc.setFont('Roboto', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(40, 40, 40);
    }
    doc.text(splitLines, margin, y);
    y += splitLines.length * 5 + 1.5;
  }
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

  // Kompletní balíček (749 Kč) — extra přílohy: instrukce + checklist
  const tier: Tier = (data.tier as Tier) || 'basic';
  if (tier === 'complete') {
    drawCompleteTierPages(doc, data.contractType, margin, contentWidth, meta.title);
  }

  drawFooter(doc);

  return Buffer.from(doc.output('arraybuffer'));
}
