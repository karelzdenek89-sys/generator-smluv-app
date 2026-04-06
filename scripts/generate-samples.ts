// Skript pro generovĂˇnĂ­ vzorovĂ˝ch PDF smluv
// SpuĹˇtÄ›nĂ­: node --experimental-strip-types scripts/generate-samples.ts

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { jsPDF } from 'jspdf';
import { getContractMeta, buildContractSections } from '../lib/contracts.ts';
import type { StoredContractData, ContractType, Tier } from '../lib/contracts.ts';

const projectDir = process.cwd();
const outputDir = path.join(projectDir, 'vzory-smluv');

// â”€â”€ VzorovĂˇ data pro kaĹľdĂ˝ typ smlouvy â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const today = new Date().toISOString().split('T')[0];

const SAMPLES: Array<{ data: StoredContractData; tier: Tier; label: string }> = [
  // 1. NĂJEMNĂŤ SMLOUVA
  {
    tier: 'complete',
    label: '01_Najemni_smlouva',
    data: {
      contractType: 'lease',
      notaryUpsell: true,
      tier: 'complete',
      landlordName: 'Jan NovĂˇk',
      landlordId: '15. 3. 1975',
      landlordAddress: 'DlouhĂˇ 12, Praha 1, 110 00',
      landlordEmail: 'jan.novak@email.cz',
      landlordPhone: '+420 777 123 456',
      tenantName: 'Marie HorĂˇkovĂˇ',
      tenantId: '20. 7. 1990',
      tenantAddress: 'KrĂˇtkĂˇ 5, Brno, 602 00',
      tenantEmail: 'marie.horakova@email.cz',
      tenantPhone: '+420 605 987 654',
      propertyAddress: 'VeselĂˇ 8, Praha 2, 120 00',
      propertyLayout: '2+1',
      flatUnitNumber: 'Byt ÄŤ. 14, 3. patro',
      rentAmount: '18000',
      utilitiesAmount: '3000',
      depositAmount: '54000',
      paymentDay: '5',
      duration: 'fixed',
      endDate: '2026-12-31',
      petsAllowed: true,
      smokingAllowed: false,
      airbnbAllowed: false,
      leaseDuration: 'urÄŤitou, a to do 31. 12. 2026',
    },
  },
  // 2. KUPNĂŤ SMLOUVA NA VOZIDLO
  {
    tier: 'complete',
    label: '02_Kupni_smlouva_auto',
    data: {
      contractType: 'car_sale',
      notaryUpsell: true,
      tier: 'complete',
      sellerName: 'Petr Svoboda',
      sellerId: '10. 1. 1980',
      sellerAddress: 'NovĂˇ 3, Ostrava, 702 00',
      buyerName: 'TomĂˇĹˇ DvoĹ™Ăˇk',
      buyerId: '5. 9. 1985',
      buyerAddress: 'StarĂˇ 7, PlzeĹ, 301 00',
      carMake: 'Ĺ koda',
      carModel: 'Octavia',
      carYear: '2018',
      carVIN: 'TMBEG7NE9J0123456',
      carPlate: '1P2 3456',
      carMileage: '87500',
      carColor: 'StĹ™Ă­brnĂˇ metalĂ­za',
      carEngineCC: '1598',
      carSTK: '2025-11-30',
      carPrice: '285000',
      carPriceWords: 'dvÄ›stÄ› osmdesĂˇt pÄ›t tisĂ­c',
      paymentMethod: 'transfer',
      knownDefects: 'DrobnĂˇ koroze na prazĂ­ch, jinak bez vad.',
    },
  },
  // 3. DAROVACĂŤ SMLOUVA
  {
    tier: 'complete',
    label: '03_Darovaci_smlouva',
    data: {
      contractType: 'gift',
      notaryUpsell: true,
      tier: 'complete',
      donorName: 'Alena MarkovĂˇ',
      donorId: '3. 6. 1955',
      donorAddress: 'LipovĂˇ 22, Olomouc, 772 00',
      donorEmail: 'alena.markova@email.cz',
      doneeName: 'LukĂˇĹˇ Marko',
      doneeId: '18. 4. 1985',
      doneeAddress: 'PolnĂ­ 11, Hradec KrĂˇlovĂ©, 500 02',
      doneeEmail: 'lukas.marko@email.cz',
      giftType: 'money',
      amount: '250000',
      amountWords: 'dvÄ›stÄ› padesĂˇt tisĂ­c',
      currency: 'KÄŤ',
      transferMethod: 'transfer',
      bankAccount: '1234567890/0800',
      giftDate: today,
      withReservation: false,
    },
  },
  // 4. SMLOUVA O DĂŤLO
  {
    tier: 'complete',
    label: '04_Smlouva_o_dilo',
    data: {
      contractType: 'work_contract',
      notaryUpsell: true,
      tier: 'complete',
      clientName: 'Stavby s.r.o.',
      clientId: '12345678',
      clientAddress: 'PrĹŻmyslovĂˇ 4, Praha 9, 190 00',
      contractorName: 'Josef TesaĹ™',
      contractorId: '87654321',
      contractorAddress: 'ĹemeslnĂˇ 6, Kladno, 272 01',
      workDescription: 'Rekonstrukce koupelny v bytÄ› ÄŤ. 5 na adrese VeselĂˇ 8, Praha 2 â€” bouracĂ­ prĂˇce, obklĂˇdĂˇnĂ­, instalatĂ©rskĂ© prĂˇce, elektroinstalace, sĂˇdrokarton.',
      workPrice: '180000',
      workPriceWords: 'sto osmdesĂˇt tisĂ­c',
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
  // 5. SMLOUVA O ZĂPĹ®JÄŚCE
  {
    tier: 'complete',
    label: '05_Smlouva_o_zapujcce',
    data: {
      contractType: 'loan',
      notaryUpsell: true,
      tier: 'complete',
      lenderName: 'Robert Fiala',
      lenderId: '22. 11. 1965',
      lenderAddress: 'LipovĂˇ 3, Liberec, 460 01',
      borrowerName: 'Simona ÄŚervenkovĂˇ',
      borrowerId: '30. 8. 1988',
      borrowerAddress: 'LuÄŤnĂ­ 9, Pardubice, 530 02',
      loanAmount: '150000',
      loanAmountWords: 'sto padesĂˇt tisĂ­c',
      interestRate: '5',
      repaymentType: 'installments',
      installmentAmount: '5000',
      installmentDay: '15',
      repaymentDate: '2028-12-31',
      hasSecurity: true,
      securityDescription: 'ZĂˇstavnĂ­ prĂˇvo k osobnĂ­mu automobilu Ĺ koda Fabia, RZ: 1L2 3456, VIN: TMBEA6NE8G0000001',
      latePenaltyRate: '0,05',
      minLatePenalty: '100',
    },
  },
  // 6. NDA â€” SMLOUVA O MLÄŚENLIVOSTI
  {
    tier: 'complete',
    label: '06_NDA_smlouva',
    data: {
      contractType: 'nda',
      notaryUpsell: true,
      tier: 'complete',
      disclosingPartyName: 'TechStart s.r.o.',
      disclosingPartyId: '09876543',
      disclosingPartyAddress: 'TechnologickĂˇ 1, Praha 6, 160 00',
      receivingPartyName: 'Martin KubĂ­k',
      receivingPartyId: '12. 2. 1982',
      receivingPartyAddress: 'SadovĂˇ 14, Brno, 612 00',
      ndaType: 'unilateral',
      purpose: 'PosouzenĂ­ moĹľnosti obchodnĂ­ spoluprĂˇce pĹ™i vĂ˝voji mobilnĂ­ aplikace pro sprĂˇvu nemovitostĂ­.',
      confidentialInfo: 'ObchodnĂ­ strategie, zdrojovĂ˝ kĂłd, databĂˇze klientĹŻ, finanÄŤnĂ­ vĂ˝kazy a veĹˇkerĂ© technickĂ© dokumentace.',
      durationYears: '3',
      nonCompete: true,
      nonSolicitation: true,
      jurisdiction: 'Praha',
    },
  },
  // 7. KUPNĂŤ SMLOUVA (obecnĂˇ)
  {
    tier: 'complete',
    label: '07_Kupni_smlouva_obecna',
    data: {
      contractType: 'general_sale',
      notaryUpsell: true,
      tier: 'complete',
      sellerName: 'Eva ProchĂˇzkovĂˇ',
      sellerId: '7. 7. 1972',
      sellerAddress: 'NĂˇdraĹľnĂ­ 18, ÄŚeskĂ© BudÄ›jovice, 370 01',
      buyerName: 'Karel Zeman',
      buyerId: '14. 3. 1990',
      buyerAddress: 'PolnĂ­ 33, Jihlava, 586 01',
      itemDescription: 'Notebook Apple MacBook Pro 14" (2023), sĂ©riovĂ© ÄŤĂ­slo: C02XXXXXXX, v dobrĂ©m stavu.',
      price: '45000',
      priceWords: 'ÄŤtyĹ™icet pÄ›t tisĂ­c',
      currency: 'KÄŤ',
      paymentMethod: 'cash',
      handoverDate: today,
      warrantyMonths: '12',
      knownDefects: 'DrobnĂ© ĹˇkrĂˇbance na krytu, jinak plnÄ› funkÄŤnĂ­.',
    },
  },
  // 8. PRACOVNĂŤ SMLOUVA
  {
    tier: 'complete',
    label: '08_Pracovni_smlouva',
    data: {
      contractType: 'employment',
      notaryUpsell: true,
      tier: 'complete',
      employerName: 'DigitĂˇlnĂ­ MĂ©dia s.r.o.',
      employerIco: '11223344',
      employerAddress: 'VĂˇclavskĂ© nĂˇmÄ›stĂ­ 1, Praha 1, 110 00',
      employeeName: 'OndĹ™ej Blaha',
      employeeId: '4. 12. 1995',
      employeeAddress: 'BotanickĂˇ 7, Praha 6, 160 00',
      jobTitle: 'Senior Software Developer',
      workLocation: 'Praha 1, VĂˇclavskĂ© nĂˇmÄ›stĂ­ 1 (moĹľnost home office)',
      startDate: '2026-04-01',
      contractType2: 'indefinite',
      grossSalary: '85000',
      trialPeriodMonths: '3',
      weeklyHours: '40',
      vacationDays: '25',
      noticePeriodMonths: '2',
    },
  },
  // 9. DOHODA O PROVEDENĂŤ PRĂCE
  {
    tier: 'complete',
    label: '09_DPP',
    data: {
      contractType: 'dpp',
      notaryUpsell: true,
      tier: 'complete',
      employerName: 'VydavatelstvĂ­ KniĹľnĂ­ svÄ›t s.r.o.',
      employerIco: '55667788',
      employerAddress: 'KorunnĂ­ 23, Praha 2, 120 00',
      employeeName: 'Petra VlÄŤkovĂˇ',
      employeeId: '25. 5. 1998',
      employeeAddress: 'MĂˇnesova 5, Praha 2, 120 00',
      workDescription: 'PĹ™eklad odbornĂ©ho textu z angliÄŤtiny do ÄŤeĹˇtiny, redakÄŤnĂ­ korektura â€” rozsah cca 80 normostran.',
      hourlyRate: '350',
      estimatedHours: '120',
      totalReward: '42000',
      startDate: '2026-04-01',
      endDate: '2026-05-31',
      maxHoursPerYear: '300',
    },
  },
  // 10. SMLOUVA O POSKYTOVĂNĂŤ SLUĹ˝EB
  {
    tier: 'complete',
    label: '10_Smlouva_o_sluzbach',
    data: {
      contractType: 'service',
      notaryUpsell: true,
      tier: 'complete',
      providerName: 'WebStudio Praha s.r.o.',
      providerId: '98765432',
      providerAddress: 'KorunnĂ­ 15, Praha 2, 120 00',
      clientName: 'Restaurace U Karla',
      clientId: '11334455',
      clientAddress: 'NĂˇmÄ›stĂ­ MĂ­ru 8, Praha 2, 120 00',
      serviceDescription: 'SprĂˇva a provoz webovĂ˝ch strĂˇnek, SEO optimalizace, sprĂˇva sociĂˇlnĂ­ch sĂ­tĂ­ (Facebook, Instagram) a pravidelnĂ˝ reporting.',
      monthlyFee: '12000',
      contractDurationMonths: '12',
      startDate: '2026-04-01',
      noticePeriodDays: '60',
      deliveryDeadlineDays: '14',
    },
  },
  // 11. PODNĂJEMNĂŤ SMLOUVA
  {
    tier: 'complete',
    label: '11_Podnajem_smlouva',
    data: {
      contractType: 'sublease',
      notaryUpsell: true,
      tier: 'complete',
      tenantName: 'Barbora SouÄŤkovĂˇ',
      tenantId: '19. 9. 1982',
      tenantAddress: 'MĂˇnesova 5, Praha 2, 120 00',
      subtenantName: 'Radek NovotnĂ˝',
      subtenantId: '28. 2. 1996',
      subtenantAddress: 'HoleÄŤkova 3, Praha 5, 150 00',
      propertyAddress: 'MĂˇnesova 5, Praha 2, 120 00 â€” pokoj ÄŤ. 2',
      roomDescription: 'Pokoj o vĂ˝mÄ›Ĺ™e 18 mÂ˛, sdĂ­lenĂ­ kuchynÄ› a koupelny.',
      monthlyRent: '9500',
      utilitiesIncluded: true,
      depositAmount: '19000',
      startDate: '2026-04-01',
      endDate: '2026-09-30',
      landlordConsent: true,
    },
  },
  // 12. PLNĂ MOC
  {
    tier: 'complete',
    label: '12_Plna_moc',
    data: {
      contractType: 'power_of_attorney',
      notaryUpsell: true,
      tier: 'complete',
      principalName: 'VÄ›ra HorĂˇÄŤkovĂˇ',
      principalId: '11. 11. 1960',
      principalAddress: 'TĂˇborskĂˇ 22, Praha 4, 140 00',
      agentName: 'JUDr. Michal Svoboda',
      agentId: '5. 3. 1975',
      agentAddress: 'PrĂˇvnickĂˇ 3, Praha 1, 110 00',
      poaType: 'property',
      propertyAddress: 'TĂˇborskĂˇ 22, Praha 4, LV ÄŤ. 1234, k. Ăş. Nusle',
      singleUse: false,
      allowSubstitution: false,
    },
  },
  // 13. UZNĂNĂŤ DLUHU
  {
    tier: 'complete',
    label: '13_Uznani_dluhu',
    data: {
      contractType: 'debt_acknowledgment',
      notaryUpsell: true,
      tier: 'complete',
      creditorName: 'Ing. Filip StarĂ˝',
      creditorId: '22. 4. 1968',
      creditorAddress: 'VinohradskĂˇ 30, Praha 2, 120 00',
      debtorName: 'Jakub Ĺ imĂˇnek',
      debtorId: '16. 6. 1990',
      debtorAddress: 'KorunnĂ­ 7, Praha 2, 120 00',
      debtAmount: '85000',
      debtAmountWords: 'osmdesĂˇt pÄ›t tisĂ­c',
      debtOrigin: 'NezaplacenĂˇ faktura ÄŤ. 2025/0089 ze dne 15. 9. 2025 za provedenĂ© stavebnĂ­ prĂˇce.',
      repaymentDate: '2026-09-30',
      interestRate: '5',
      installmentPlan: true,
      installmentAmount: '10000',
      installmentDay: '28',
    },
  },
  // 14. SMLOUVA O SPOLUPRĂCI
  {
    tier: 'complete',
    label: '14_Smlouva_o_spolupraci',
    data: {
      contractType: 'cooperation',
      notaryUpsell: true,
      tier: 'complete',
      partyAName: 'CreativeLab s.r.o.',
      partyAId: '22334455',
      partyAAddress: 'JugoslĂˇvskĂˇ 14, Praha 2, 120 00',
      partyARepresentative: 'Jana MrĂˇzkovĂˇ, jednatelka',
      partyBName: 'DataAnalytics s.r.o.',
      partyBId: '66778899',
      partyBAddress: 'AmerickĂˇ 5, Praha 2, 120 00',
      partyBRepresentative: 'Ing. Pavel HornĂ­k, jednatel',
      cooperationScope: 'SpoleÄŤnĂ˝ vĂ˝voj a prodej analytickĂ©ho softwaru pro e-commerce segment. Strana A zajistĂ­ design a frontend, strana B zajistĂ­ backend a datovĂ© modely.',
      profitSplitA: '50',
      profitSplitB: '50',
      durationMonths: '24',
      startDate: '2026-04-01',
      exclusivity: true,
      nonCompetePeriodMonths: '12',
    },
  },
];

// â”€â”€ Font loading â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// â”€â”€ Minimal PDF renderer (same logic as lib/pdf.ts) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
    doc.text('GenerovĂˇno ' + new Date().toLocaleDateString('cs-CZ'), pageWidth - 20, pageHeight - 8, { align: 'right' });
    doc.setTextColor(0);
  }
}

function getSignatureLabels(contractType: ContractType): [string, string] {
  const labels: Record<ContractType, [string, string]> = {
    lease: ['PronajĂ­matel', 'NĂˇjemce'],
    car_sale: ['ProdĂˇvajĂ­cĂ­', 'KupujĂ­cĂ­'],
    gift: ['DĂˇrce', 'ObdarovanĂ˝'],
    work_contract: ['Objednatel', 'Zhotovitel'],
    loan: ['VÄ›Ĺ™itel (pĹŻjÄŤujĂ­cĂ­)', 'DluĹľnĂ­k (pĹ™Ă­jemce)'],
    nda: ['Strana poskytujĂ­cĂ­ informace', 'Strana pĹ™ijĂ­majĂ­cĂ­ informace'],
    general_sale: ['ProdĂˇvajĂ­cĂ­', 'KupujĂ­cĂ­'],
    employment: ['ZamÄ›stnavatel', 'ZamÄ›stnanec'],
    dpp: ['ZamÄ›stnavatel', 'ZamÄ›stnanec'],
    service: ['Poskytovatel', 'Objednatel'],
    sublease: ['NĂˇjemce (podnajĂ­matel)', 'PodnĂˇjemce'],
    power_of_attorney: ['Zmocnitel', 'ZmocnÄ›nec'],
    debt_acknowledgment: ['VÄ›Ĺ™itel', 'DluĹľnĂ­k'],
    cooperation: ['Strana A', 'Strana B'],
  };
  return labels[contractType] ?? ['SmluvnĂ­ strana I.', 'SmluvnĂ­ strana II.'];
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
    const isProtocol = section.title.toUpperCase().includes('PĹEDĂVACĂŤ PROTOKOL') || section.title.toUpperCase().includes('PĹĂŤLOHA');

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
        drawHeader(doc