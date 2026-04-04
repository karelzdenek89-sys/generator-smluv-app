// Skript pro generování vzorových PDF smluv
// Spuštění: node --experimental-strip-types scripts/generate-samples.ts

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { jsPDF } from 'jspdf';
import { getContractMeta, buildContractSections } from '../lib/contracts.ts';
import type { StoredContractData, ContractType, Tier } from '../lib/contracts.ts';

const projectDir = process.cwd();
const outputDir = path.join(projectDir, 'vzory-smluv');

// ── Vzorová data pro každý typ smlouvy ─────────────────────────────────────

const today = new Date().toISOString().split('T')[0];

const SAMPLES: Array<{ data: StoredContractData; tier: Tier; label: string }> = [
  // 1. NÁJEMNÍ SMLOUVA
  {
    tier: 'professional',
    label: '01_Najemni_smlouva',
    data: {
      contractType: 'lease',
      notaryUpsell: true,
      tier: 'professional',
      landlordName: 'Jan Novák',
      landlordId: '15. 3. 1975',
      landlordAddress: 'Dlouhá 12, Praha 1, 110 00',
      landlordEmail: 'jan.novak@email.cz',
      landlordPhone: '+420 777 123 456',
      tenantName: 'Marie Horáková',
      tenantId: '20. 7. 1990',
      tenantAddress: 'Krátká 5, Brno, 602 00',
      tenantEmail: 'marie.horakova@email.cz',
      tenantPhone: '+420 605 987 654',
      propertyAddress: 'Veselá 8, Praha 2, 120 00',
      propertyLayout: '2+1',
      flatUnitNumber: 'Byt č. 14, 3. patro',
      rentAmount: '18000',
      utilitiesAmount: '3000',
      depositAmount: '54000',
      paymentDay: '5',
      duration: 'fixed',
      endDate: '2026-12-31',
      petsAllowed: true,
      smokingAllowed: false,
      airbnbAllowed: false,
      leaseDuration: 'určitou, a to do 31. 12. 2026',
    },
  },
  // 2. KUPNÍ SMLOUVA NA VOZIDLO
  {
    tier: 'professional',
    label: '02_Kupni_smlouva_auto',
    data: {
      contractType: 'car_sale',
      notaryUpsell: true,
      tier: 'professional',
      sellerName: 'Petr Svoboda',
      sellerId: '10. 1. 1980',
      sellerAddress: 'Nová 3, Ostrava, 702 00',
      buyerName: 'Tomáš Dvořák',
      buyerId: '5. 9. 1985',
      buyerAddress: 'Stará 7, Plzeň, 301 00',
      carMake: 'Škoda',
      carModel: 'Octavia',
      carYear: '2018',
      carVIN: 'TMBEG7NE9J0123456',
      carPlate: '1P2 3456',
      carMileage: '87500',
      carColor: 'Stříbrná metalíza',
      carEngineCC: '1598',
      carSTK: '2025-11-30',
      carPrice: '285000',
      carPriceWords: 'dvěstě osmdesát pět tisíc',
      paymentMethod: 'transfer',
      knownDefects: 'Drobná koroze na prazích, jinak bez vad.',
    },
  },
  // 3. DAROVACÍ SMLOUVA
  {
    tier: 'professional',
    label: '03_Darovaci_smlouva',
    data: {
      contractType: 'gift',
      notaryUpsell: true,
      tier: 'professional',
      donorName: 'Alena Marková',
      donorId: '3. 6. 1955',
      donorAddress: 'Lipová 22, Olomouc, 772 00',
      donorEmail: 'alena.markova@email.cz',
      doneeName: 'Lukáš Marko',
      doneeId: '18. 4. 1985',
      doneeAddress: 'Polní 11, Hradec Králové, 500 02',
      doneeEmail: 'lukas.marko@email.cz',
      giftType: 'money',
      amount: '250000',
      amountWords: 'dvěstě padesát tisíc',
      currency: 'Kč',
      transferMethod: 'transfer',
      bankAccount: '1234567890/0800',
      giftDate: today,
      withReservation: false,
    },
  },
  // 4. SMLOUVA O DÍLO
  {
    tier: 'professional',
    label: '04_Smlouva_o_dilo',
    data: {
      contractType: 'work_contract',
      notaryUpsell: true,
      tier: 'professional',
      clientName: 'Stavby s.r.o.',
      clientId: '12345678',
      clientAddress: 'Průmyslová 4, Praha 9, 190 00',
      contractorName: 'Josef Tesař',
      contractorId: '87654321',
      contractorAddress: 'Řemeslná 6, Kladno, 272 01',
      workDescription: 'Rekonstrukce koupelny v bytě č. 5 na adrese Veselá 8, Praha 2 — bourací práce, obkládání, instalatérské práce, elektroinstalace, sádrokarton.',
      workPrice: '180000',
      workPriceWords: 'sto osmdesát tisíc',
      paymentTerms: 'payment_schedule',
      advancePercent: '30',
      deadlineDate: '2026-06-30',
      warrantyMonths: '60',
      delayPenaltyPerDay: '0,05',
      maxPenaltyPercent: '15',
      clientPenaltyPerDay: '0,05',
      defectPenaltyPercent: '10',
    },
  },
  // 5. SMLOUVA O ZÁPŮJČCE
  {
    tier: 'professional',
    label: '05_Smlouva_o_zapujcce',
    data: {
      contractType: 'loan',
      notaryUpsell: true,
      tier: 'professional',
      lenderName: 'Robert Fiala',
      lenderId: '22. 11. 1965',
      lenderAddress: 'Lipová 3, Liberec, 460 01',
      borrowerName: 'Simona Červenková',
      borrowerId: '30. 8. 1988',
      borrowerAddress: 'Luční 9, Pardubice, 530 02',
      loanAmount: '150000',
      loanAmountWords: 'sto padesát tisíc',
      interestRate: '5',
      repaymentType: 'installments',
      installmentAmount: '5000',
      installmentDay: '15',
      repaymentDate: '2028-12-31',
      hasSecurity: true,
      securityDescription: 'Zástavní právo k osobnímu automobilu Škoda Fabia, RZ: 1L2 3456, VIN: TMBEA6NE8G0000001',
      latePenaltyRate: '0,05',
      minLatePenalty: '100',
    },
  },
  // 6. NDA — SMLOUVA O MLČENLIVOSTI
  {
    tier: 'professional',
    label: '06_NDA_smlouva',
    data: {
      contractType: 'nda',
      notaryUpsell: true,
      tier: 'professional',
      disclosingPartyName: 'TechStart s.r.o.',
      disclosingPartyId: '09876543',
      disclosingPartyAddress: 'Technologická 1, Praha 6, 160 00',
      receivingPartyName: 'Martin Kubík',
      receivingPartyId: '12. 2. 1982',
      receivingPartyAddress: 'Sadová 14, Brno, 612 00',
      ndaType: 'unilateral',
      purpose: 'Posouzení možnosti obchodní spolupráce při vývoji mobilní aplikace pro správu nemovitostí.',
      confidentialInfo: 'Obchodní strategie, zdrojový kód, databáze klientů, finanční výkazy a veškeré technické dokumentace.',
      durationYears: '3',
      nonCompete: true,
      nonSolicitation: true,
      jurisdiction: 'Praha',
    },
  },
  // 7. KUPNÍ SMLOUVA (obecná)
  {
    tier: 'professional',
    label: '07_Kupni_smlouva_obecna',
    data: {
      contractType: 'general_sale',
      notaryUpsell: true,
      tier: 'professional',
      sellerName: 'Eva Procházková',
      sellerId: '7. 7. 1972',
      sellerAddress: 'Nádražní 18, České Budějovice, 370 01',
      buyerName: 'Karel Zeman',
      buyerId: '14. 3. 1990',
      buyerAddress: 'Polní 33, Jihlava, 586 01',
      itemDescription: 'Notebook Apple MacBook Pro 14" (2023), sériové číslo: C02XXXXXXX, v dobrém stavu.',
      price: '45000',
      priceWords: 'čtyřicet pět tisíc',
      currency: 'Kč',
      paymentMethod: 'cash',
      handoverDate: today,
      warrantyMonths: '12',
      knownDefects: 'Drobné škrábance na krytu, jinak plně funkční.',
    },
  },
  // 8. PRACOVNÍ SMLOUVA
  {
    tier: 'professional',
    label: '08_Pracovni_smlouva',
    data: {
      contractType: 'employment',
      notaryUpsell: true,
      tier: 'professional',
      employerName: 'Digitální Média s.r.o.',
      employerIco: '11223344',
      employerAddress: 'Václavské náměstí 1, Praha 1, 110 00',
      employeeName: 'Ondřej Blaha',
      employeeId: '4. 12. 1995',
      employeeAddress: 'Botanická 7, Praha 6, 160 00',
      jobTitle: 'Senior Software Developer',
      workLocation: 'Praha 1, Václavské náměstí 1 (možnost home office)',
      startDate: '2026-04-01',
      contractType2: 'indefinite',
      grossSalary: '85000',
      trialPeriodMonths: '3',
      weeklyHours: '40',
      vacationDays: '25',
      noticePeriodMonths: '2',
    },
  },
  // 9. DOHODA O PROVEDENÍ PRÁCE
  {
    tier: 'professional',
    label: '09_DPP',
    data: {
      contractType: 'dpp',
      notaryUpsell: true,
      tier: 'professional',
      employerName: 'Vydavatelství Knižní svět s.r.o.',
      employerIco: '55667788',
      employerAddress: 'Korunní 23, Praha 2, 120 00',
      employeeName: 'Petra Vlčková',
      employeeId: '25. 5. 1998',
      employeeAddress: 'Mánesova 5, Praha 2, 120 00',
      workDescription: 'Překlad odborného textu z angličtiny do češtiny, redakční korektura — rozsah cca 80 normostran.',
      hourlyRate: '350',
      estimatedHours: '120',
      totalReward: '42000',
      startDate: '2026-04-01',
      endDate: '2026-05-31',
      maxHoursPerYear: '300',
    },
  },
  // 10. SMLOUVA O POSKYTOVÁNÍ SLUŽEB
  {
    tier: 'professional',
    label: '10_Smlouva_o_sluzbach',
    data: {
      contractType: 'service',
      notaryUpsell: true,
      tier: 'professional',
      providerName: 'WebStudio Praha s.r.o.',
      providerId: '98765432',
      providerAddress: 'Korunní 15, Praha 2, 120 00',
      clientName: 'Restaurace U Karla',
      clientId: '11334455',
      clientAddress: 'Náměstí Míru 8, Praha 2, 120 00',
      serviceDescription: 'Správa a provoz webových stránek, SEO optimalizace, správa sociálních sítí (Facebook, Instagram) a pravidelný reporting.',
      monthlyFee: '12000',
      contractDurationMonths: '12',
      startDate: '2026-04-01',
      noticePeriodDays: '60',
      deliveryDeadlineDays: '14',
    },
  },
  // 11. PODNÁJEMNÍ SMLOUVA
  {
    tier: 'professional',
    label: '11_Podnajem_smlouva',
    data: {
      contractType: 'sublease',
      notaryUpsell: true,
      tier: 'professional',
      tenantName: 'Barbora Součková',
      tenantId: '19. 9. 1982',
      tenantAddress: 'Mánesova 5, Praha 2, 120 00',
      subtenantName: 'Radek Novotný',
      subtenantId: '28. 2. 1996',
      subtenantAddress: 'Holečkova 3, Praha 5, 150 00',
      propertyAddress: 'Mánesova 5, Praha 2, 120 00 — pokoj č. 2',
      roomDescription: 'Pokoj o výměře 18 m², sdílení kuchyně a koupelny.',
      monthlyRent: '9500',
      utilitiesIncluded: true,
      depositAmount: '19000',
      startDate: '2026-04-01',
      endDate: '2026-09-30',
      landlordConsent: true,
    },
  },
  // 12. PLNÁ MOC
  {
    tier: 'professional',
    label: '12_Plna_moc',
    data: {
      contractType: 'power_of_attorney',
      notaryUpsell: true,
      tier: 'professional',
      principalName: 'Věra Horáčková',
      principalId: '11. 11. 1960',
      principalAddress: 'Táborská 22, Praha 4, 140 00',
      agentName: 'JUDr. Michal Svoboda',
      agentId: '5. 3. 1975',
      agentAddress: 'Právnická 3, Praha 1, 110 00',
      poaType: 'property',
      propertyAddress: 'Táborská 22, Praha 4, LV č. 1234, k. ú. Nusle',
      singleUse: false,
      allowSubstitution: false,
    },
  },
  // 13. UZNÁNÍ DLUHU
  {
    tier: 'professional',
    label: '13_Uznani_dluhu',
    data: {
      contractType: 'debt_acknowledgment',
      notaryUpsell: true,
      tier: 'professional',
      creditorName: 'Ing. Filip Starý',
      creditorId: '22. 4. 1968',
      creditorAddress: 'Vinohradská 30, Praha 2, 120 00',
      debtorName: 'Jakub Šimánek',
      debtorId: '16. 6. 1990',
      debtorAddress: 'Korunní 7, Praha 2, 120 00',
      debtAmount: '85000',
      debtAmountWords: 'osmdesát pět tisíc',
      debtOrigin: 'Nezaplacená faktura č. 2025/0089 ze dne 15. 9. 2025 za provedené stavební práce.',
      repaymentDate: '2026-09-30',
      interestRate: '5',
      installmentPlan: true,
      installmentAmount: '10000',
      installmentDay: '28',
    },
  },
  // 14. SMLOUVA O SPOLUPRÁCI
  {
    tier: 'professional',
    label: '14_Smlouva_o_spolupraci',
    data: {
      contractType: 'cooperation',
      notaryUpsell: true,
      tier: 'professional',
      partyAName: 'CreativeLab s.r.o.',
      partyAId: '22334455',
      partyAAddress: 'Jugoslávská 14, Praha 2, 120 00',
      partyARepresentative: 'Jana Mrázková, jednatelka',
      partyBName: 'DataAnalytics s.r.o.',
      partyBId: '66778899',
      partyBAddress: 'Americká 5, Praha 2, 120 00',
      partyBRepresentative: 'Ing. Pavel Horník, jednatel',
      cooperationScope: 'Společný vývoj a prodej analytického softwaru pro e-commerce segment. Strana A zajistí design a frontend, strana B zajistí backend a datové modely.',
      profitSplitA: '50',
      profitSplitB: '50',
      durationMonths: '24',
      startDate: '2026-04-01',
      exclusivity: true,
      nonCompetePeriodMonths: '12',
    },
  },
];

// ── Font loading ────────────────────────────────────────────────────────────

async function loadFontBase64(fileName: string): Promise<string> {
  const filePath = path.join(projectDir, 'public', 'fonts', fileName);
  const file = await readFile(filePath);
  return file.toString('base64');
}

async function setupFonts(doc: jsPDF): Promise<void> {
  type PdfWithVfs = jsPDF & { internal: { vFS?: Record<string, string> } };
  const pdfDoc = doc as PdfWithVfs;
  if (!pdfDoc.internal.vFS) pdfDoc.internal.vFS = {};
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

// ── Minimal PDF renderer (same logic as lib/pdf.ts) ────────────────────────

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
  for (let i = 1; i <= pageCount; i++) {
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

function getSignatureLabels(contractType: ContractType): [string, string] {
  const labels: Record<ContractType, [string, string]> = {
    lease: ['Pronajímatel', 'Nájemce'],
    car_sale: ['Prodávající', 'Kupující'],
    gift: ['Dárce', 'Obdarovaný'],
    work_contract: ['Objednatel', 'Zhotovitel'],
    loan: ['Věřitel (půjčující)', 'Dlužník (příjemce)'],
    nda: ['Strana poskytující informace', 'Strana přijímající informace'],
    general_sale: ['Prodávající', 'Kupující'],
    employment: ['Zaměstnavatel', 'Zaměstnanec'],
    dpp: ['Zaměstnavatel', 'Zaměstnanec'],
    service: ['Poskytovatel', 'Objednatel'],
    sublease: ['Nájemce (podnajímatel)', 'Podnájemce'],
    power_of_attorney: ['Zmocnitel', 'Zmocněnec'],
    debt_acknowledgment: ['Věřitel', 'Dlužník'],
    cooperation: ['Strana A', 'Strana B'],
  };
  return labels[contractType] ?? ['Smluvní strana I.', 'Smluvní strana II.'];
}

async function renderSamplePdf(data: StoredContractData): Promise<Buffer> {
  const meta = getContractMeta(data.contractType);
  const sections = buildContractSections(data);
  const [labelLeft, labelRight] = getSignatureLabels(data.contractType);

  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  await setupFonts(doc);

  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;
  let y = 35;

  drawHeader(doc, meta.title);

  for (const section of sections) {
    const isSignature = section.title.toUpperCase().includes('PODPISY');
    const isProtocol = section.title.toUpperCase().includes('PŘEDÁVACÍ PROTOKOL') || section.title.toUpperCase().includes('PŘÍLOHA');

    if (isProtocol && y > 40) {
      doc.addPage();
      drawHeader(doc, meta.title);
      y = 35;
      doc.setFont('Roboto', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
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

    if (isSignature) {
      if (y > 230) {
        doc.addPage();
        drawHeader(doc, meta.title);
        y = 35;
        doc.setFont('Roboto', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(30, 30, 30);
      }
      doc.setFont('Roboto', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(20, 20, 20);
      doc.text(section.title, margin, y);
      y += 10;
      doc.setFont('Roboto', 'normal');
      doc.setFontSize(10);
      doc.text('V ________________________ dne __________________', margin, y);
      y += 18;
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

    y += 2;
    doc.setFont('Roboto', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(20, 20, 20);
    const titleLines = doc.splitTextToSize(section.title, contentWidth);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 6 + 1;

    doc.setFont('Roboto', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);

    for (const line of section.body) {
      const safeLine = (line != null && String(line).trim()) ? String(line) : ' ';
      const splitLines = doc.splitTextToSize(safeLine, contentWidth);
      if (y + splitLines.length * 5.5 > 275) {
        doc.addPage();
        drawHeader(doc, meta.title);
        y = 35;
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

// ── Main ────────────────────────────────────────────────────────────────────

await mkdir(outputDir, { recursive: true });

let ok = 0, fail = 0;
for (const sample of SAMPLES) {
  try {
    process.stdout.write(`  Generuji ${sample.label}...`);
    const pdf = await renderSamplePdf(sample.data);
    const filePath = path.join(outputDir, `${sample.label}.pdf`);
    await writeFile(filePath, pdf);
    process.stdout.write(` ✓ (${pdf.length} B)\n`);
    ok++;
  } catch (err) {
    process.stdout.write(` ✗ ERROR: ${(err as Error).message}\n`);
    fail++;
  }
}

console.log(`\nHotovo: ${ok} OK, ${fail} chyb`);
console.log(`Výstupní složka: ${outputDir}`);
