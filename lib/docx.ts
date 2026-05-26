import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  HeadingLevel,
  Packer,
  PageNumber,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import {
  buildContractSections,
  getContractMeta,
  type ContractSection,
  type ContractType,
  type StoredContractData,
} from './contracts';

const PAGE_MARGIN_TWIPS = 1440;
const BODY_SIZE = 22;
const MUTED = '666666';
const INK = '1F2937';

function textRun(text: string, options: Record<string, unknown> = {}): TextRun {
  return new TextRun({
    font: 'Aptos',
    color: INK,
    size: BODY_SIZE,
    ...options,
    text,
  });
}

function paragraph(
  text: string,
  options: Record<string, unknown> = {},
): Paragraph {
  return new Paragraph({
    spacing: { after: 140, line: 300 },
    children: [textRun(text)],
    ...options,
  } as ConstructorParameters<typeof Paragraph>[0]);
}

function mutedParagraph(text: string): Paragraph {
  return new Paragraph({
    spacing: { after: 160, line: 280 },
    children: [textRun(text, { color: MUTED, italics: true, size: 19 })],
  });
}

function titleParagraph(text: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 260 },
    children: [
      textRun(text.toUpperCase(), {
        bold: true,
        size: 34,
        characterSpacing: 20,
      }),
    ],
  });
}

function sectionHeading(text: string, pageBreakBefore = false): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    pageBreakBefore,
    spacing: { before: 260, after: 120 },
    children: [
      textRun(text, {
        bold: true,
        size: 26,
      }),
    ],
  });
}

function normalizeLine(value: unknown): string {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function isSignatureSection(title: string): boolean {
  return title.toUpperCase().includes('PODPISY') || title.toUpperCase().includes('SIGNATURES');
}

function isAppendixSection(title: string): boolean {
  const upper = title.toUpperCase();
  return upper.includes('PŘÍLOHA') || upper.includes('PREDAVACI') || upper.includes('PŘEDÁVACÍ') || upper.includes('PROTOKOL');
}

function signatureLabels(contractType: ContractType): [string, string] {
  switch (contractType) {
    case 'lease': return ['Pronajímatel', 'Nájemce'];
    case 'car_sale':
    case 'general_sale': return ['Prodávající', 'Kupující'];
    case 'gift': return ['Dárce', 'Obdarovaný'];
    case 'work_contract': return ['Zhotovitel', 'Objednatel'];
    case 'loan':
    case 'debt_acknowledgment': return ['Věřitel', 'Dlužník'];
    case 'nda': return ['Poskytující strana', 'Přijímající strana'];
    case 'employment':
    case 'dpp': return ['Zaměstnavatel', 'Zaměstnanec'];
    case 'service': return ['Poskytovatel', 'Objednatel'];
    case 'sublease': return ['Podnajímatel', 'Podnájemce'];
    case 'power_of_attorney': return ['Zmocnitel', 'Zmocněnec'];
    case 'cooperation': return ['Strana A', 'Strana B'];
  }
}

function cell(children: Paragraph[], widthPercent: number): TableCell {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    margins: { top: 140, bottom: 140, left: 80, right: 80 },
    borders: {
      top: { style: BorderStyle.NIL },
      bottom: { style: BorderStyle.NIL },
      left: { style: BorderStyle.NIL },
      right: { style: BorderStyle.NIL },
    },
    children,
  });
}

function signatureBlock(data: StoredContractData): Table {
  const [left, right] = signatureLabels(data.contractType);
  const line = '________________________________';
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          cell([paragraph('V __________________ dne ________________')], 50),
          cell([paragraph('V __________________ dne ________________')], 50),
        ],
      }),
      new TableRow({
        children: [
          cell([paragraph(line), paragraph(left)], 50),
          cell([paragraph(line), paragraph(right)], 50),
        ],
      }),
    ],
  });
}

function appendixPlaceholder(section: ContractSection): Paragraph[] {
  const title = section.title.toUpperCase();
  const protocolText = title.includes('PROTOKOL')
    ? 'Tato příloha je určena k vyplnění při předání. Doplňte skutečný stav, datum, místo, předané věci, případné vady a podpisy stran.'
    : 'Tato příloha je součástí dokumentu a je připravena k doplnění podle konkrétní situace.';

  return [
    mutedParagraph(protocolText),
    paragraph('Datum: ______________________________'),
    paragraph('Místo: ______________________________'),
    paragraph('Poznámky: ______________________________________________________________________'),
    paragraph('Podpis strany 1: ____________________________'),
    paragraph('Podpis strany 2: ____________________________'),
  ];
}

function buildSummaryTable(data: StoredContractData, title: string): Table {
  const rows = [
    ['Dokument', title],
    ['Typ', String(data.contractType)],
    ['Varianta', String(data.tier ?? 'basic')],
    ['Vygenerováno', new Date().toLocaleDateString('cs-CZ')],
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'D1D5DB' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'D1D5DB' },
      left: { style: BorderStyle.SINGLE, size: 1, color: 'D1D5DB' },
      right: { style: BorderStyle.SINGLE, size: 1, color: 'D1D5DB' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
    },
    rows: rows.map(([label, value]) =>
      new TableRow({
        children: [
          new TableCell({
            width: { size: 28, type: WidthType.PERCENTAGE },
            shading: { fill: 'F9FAFB' },
            children: [paragraph(label, { children: [textRun(label, { bold: true, size: 20 })] })],
          }),
          new TableCell({
            width: { size: 72, type: WidthType.PERCENTAGE },
            children: [paragraph(value, { children: [textRun(value, { size: 20 })] })],
          }),
        ],
      }),
    ),
  });
}

export async function renderContractDocx(data: StoredContractData): Promise<Buffer> {
  const meta = getContractMeta(data.contractType);
  const sections = buildContractSections(data);

  const children: Array<Paragraph | Table> = [
    titleParagraph(meta.title),
    mutedParagraph('Editovatelná verze dokumentu vygenerovaného na SmlouvaHned.cz. Před podpisem zkontrolujte věcné údaje a případně doplňte prázdná místa.'),
    buildSummaryTable(data, meta.title),
  ];

  sections.forEach((section, index) => {
    const forcePageBreak = index > 0 && (isSignatureSection(section.title) || isAppendixSection(section.title));
    children.push(sectionHeading(section.title, forcePageBreak));

    if (isSignatureSection(section.title)) {
      children.push(signatureBlock(data));
      return;
    }

    if (section.body.length === 0) {
      if (isAppendixSection(section.title)) {
        children.push(...appendixPlaceholder(section));
      } else {
        children.push(mutedParagraph('Tato část neobsahuje další text k doplnění.'));
      }
      return;
    }

    for (const line of section.body) {
      const text = normalizeLine(line);
      if (text) children.push(paragraph(text));
    }
  });

  const doc = new Document({
    creator: 'SmlouvaHned.cz',
    title: meta.title,
    description: 'Editovatelná verze dokumentu vygenerovaného na SmlouvaHned.cz',
    styles: {
      default: {
        document: {
          run: { font: 'Aptos', size: BODY_SIZE, color: INK },
          paragraph: { spacing: { line: 300, after: 120 } },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: PAGE_MARGIN_TWIPS,
              right: PAGE_MARGIN_TWIPS,
              bottom: PAGE_MARGIN_TWIPS,
              left: PAGE_MARGIN_TWIPS,
            },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  textRun('SmlouvaHned.cz · strana ', { size: 18, color: MUTED }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 18, color: MUTED }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });

  return Buffer.from(await Packer.toBuffer(doc));
}
