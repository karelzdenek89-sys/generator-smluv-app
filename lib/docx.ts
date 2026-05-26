import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from 'docx';
import {
  buildContractSections,
  getContractMeta,
  type StoredContractData,
} from './contracts';

function paragraph(text: string): Paragraph {
  return new Paragraph({
    spacing: { after: 160 },
    children: [
      new TextRun({
        text,
        size: 22,
      }),
    ],
  });
}

function heading(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 160 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 26,
      }),
    ],
  });
}

export async function renderContractDocx(data: StoredContractData): Promise<Buffer> {
  const meta = getContractMeta(data.contractType);
  const sections = buildContractSections(data);

  const children: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 360 },
      children: [
        new TextRun({
          text: meta.title.toUpperCase(),
          bold: true,
          size: 34,
        }),
      ],
    }),
  ];

  for (const section of sections) {
    children.push(heading(section.title));

    if (section.body.length === 0) {
      if (section.title.toUpperCase().includes('PODPISY')) {
        children.push(paragraph('Místo a datum: ______________________________'));
        children.push(paragraph('Podpis strany 1: ____________________________'));
        children.push(paragraph('Podpis strany 2: ____________________________'));
      }
      continue;
    }

    for (const line of section.body) {
      const text = String(line ?? '').trim();
      if (text) children.push(paragraph(text));
    }
  }

  const doc = new Document({
    creator: 'SmlouvaHned.cz',
    title: meta.title,
    description: 'Editovatelná verze dokumentu vygenerovaného na SmlouvaHned.cz',
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  return Buffer.from(await Packer.toBuffer(doc));
}

