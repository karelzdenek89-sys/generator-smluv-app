export type ContractType = 'lease' | 'car_sale' | 'gift' | 'work_contract';

export type StoredContractData = {
  contractType: ContractType;
  notaryUpsell?: boolean;
  [key: string]: unknown;
};

export type ContractSection = {
  title: string;
  body: string[];
};

const formatAmount = (amount?: unknown) => {
  if (amount === null || amount === undefined || amount === '') return '__________';
  const num = Number(amount);
  if (Number.isNaN(num)) return String(amount);
  return num.toLocaleString('cs-CZ');
};

export function getContractMeta(contractType: ContractType) {
  switch (contractType) {
    case 'gift':
      return { title: 'Darovací smlouva', fileName: 'Darovaci_smlouva_2026.pdf' };
    case 'car_sale':
      return { title: 'Kupní smlouva na vozidlo', fileName: 'Kupni_smlouva_auto_2026.pdf' };
    case 'lease':
      return { title: 'Nájemní smlouva', fileName: 'Najemni_smlouva_2026.pdf' };
    case 'work_contract':
      return { title: 'Smlouva o dílo', fileName: 'Smlouva_o_dilo_2026.pdf' };
  }
}

function buildGiftContractSections(d: StoredContractData): ContractSection[] {
  const giftSubject = () => {
    switch (d.giftType) {
      case 'money':
        return `peněžní částku ve výši ${formatAmount(d.amount)} ${String(d.currency || 'Kč')}`;
      case 'car':
        return `motorové vozidlo ${String(d.carMake || '')} ${String(d.carModel || '')}, VIN: ${String(d.carVIN || '__________')}, SPZ: ${String(d.carPlate || '__________')}`;
      case 'property':
        return `nemovitost na adrese ${String(d.propertyAddress || '__________')}, LV č. ${String(d.propertyLV || '__________')}, k.ú. ${String(d.propertyCadastre || '__________')}`;
      default:
        return `movitou věc: ${String(d.thingDescription || 'specifikována níže')}`;
    }
  };

  return [
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Dárce: ${String(d.donorName || '____________________')}, nar. ${String(d.donorId || '__________')}, bytem ${String(d.donorAddress || '____________________')}`,
        `Obdarovaný: ${String(d.doneeName || '____________________')}, nar. ${String(d.doneeId || '__________')}, bytem ${String(d.doneeAddress || '____________________')}`,
      ],
    },
    {
      title: 'II. PŘEDMĚT DAROVÁNÍ',
      body: [
        'Dárce tímto bezplatně daruje obdarovanému:',
        giftSubject(),
      ],
    },
    {
      title: 'III. DALŠÍ UJEDNÁNÍ',
      body: [
        'Obdarovaný dar přijímá.',
        d.withReservation
          ? `Dar je poskytován s výminkem: ${String(d.reservationDescription || '____________________')}`
          : 'Dar je poskytován bez výminků a bez právních vad.',
        'Smlouva byla uzavřena dobrovolně v plném rozsahu svéprávnosti obou stran.',
      ],
    },
    {
      title: 'IV. PODPISY',
      body: [
        `V ________________________ dne ${String(d.giftDate || '__________________')}`,
        '\n\n_______________________________          _______________________________',
        'Dárce                                      Obdarovaný',
      ],
    },
  ];
}

function buildWorkContractSections(d: StoredContractData): ContractSection[] {
  const materialProvider =
    d.materialBy === 'contractor'
      ? 'Zhotovitel'
      : d.materialBy === 'client'
        ? 'Objednatel'
        : 'Obě strany';

  const paymentDesc =
    d.paymentType === 'with_deposit'
      ? `Záloha ve výši ${formatAmount(d.depositAmount)} ${String(d.currency || 'Kč')} je splatná před zahájením prací. Doplatek po předání díla bez vad.`
      : d.paymentType === 'milestones'
        ? 'Cena bude hrazena průběžně na základě odsouhlasených dílčích faktur.'
        : 'Celková cena je splatná jednorázově po řádném předání díla bez vad a nedodělků.';

  const finalProvisions = [
    d.handoverProtocol ? 'Předání díla proběhne písemným protokolem o předání a převzetí.' : '',
    d.insuranceRequired ? 'Zhotovitel má po celou dobu provádění díla sjednáno pojištění odpovědnosti za škodu.' : '',
    'Smlouva se řídí ustanoveními § 2586 a násl. občanského zákoníku.',
  ].filter(Boolean) as string[];

  return [
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Objednatel: ${String(d.clientName || '____________________')}`,
        `IČO: ${String(d.clientRegNo || '__________')}, Adresa: ${String(d.clientAddress || '____________________')}`,
        `Zhotovitel: ${String(d.contractorName || '____________________')}`,
        `IČO: ${String(d.contractorRegNo || '__________')}, Adresa: ${String(d.contractorAddress || '____________________')}`,
      ],
    },
    {
      title: 'II. PŘEDMĚT DÍLA',
      body: [
        `Zhotovitel se zavazuje provést dílo: "${String(d.workTitle || '____________________')}"`,
        `Popis: ${String(d.workDescription || '____________________')}`,
        `Místo plnění: ${String(d.workLocation || '____________________')}`,
        `Materiál zajišťuje: ${materialProvider}.`,
      ],
    },
    {
      title: 'III. CENA A PLATEBNÍ PODMÍNKY',
      body: [
        `Celková cena díla: ${formatAmount(d.priceAmount)} ${String(d.currency || 'Kč')}`,
        paymentDesc,
      ],
    },
    {
      title: 'IV. TERMÍNY',
      body: [
        `Zahájení prací: ${String(d.startDate || '__________')}`,
        `Dokončení a předání díla: ${String(d.endDate || '__________')}`,
      ],
    },
    {
      title: 'V. ZÁRUKA A SANKCE',
      body: [
        `Záruka za jakost: ${String(d.warrantyMonths || '24')} měsíců`,
        `Smluvní pokuta za prodlení: ${String(d.delayPenaltyPerDay || '0,05')} % z ceny díla za každý den prodlení`,
        `Smluvní pokuta za vady: ${String(d.defectPenaltyPercent || '10')} % z ceny díla`,
      ],
    },
    {
      title: 'VI. ZÁVĚREČNÁ USTANOVENÍ',
      body: finalProvisions,
    },
    {
      title: 'VII. PODPISY',
      body: [
        'V ________________________ dne __________________',
        '\n\n_______________________________          _______________________________',
        'Objednatel                                      Zhotovitel',
      ],
    },
  ];
}

function buildCarContractSections(d: StoredContractData): ContractSection[] {
  return [
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Prodávající: ${String(d.sellerName || '____________________')}, nar./IČO: ${String(d.sellerId || '__________')}, bytem/sídlo: ${String(d.sellerAddress || '____________________')}`,
        `Kupující: ${String(d.buyerName || '____________________')}, nar./IČO: ${String(d.buyerId || '__________')}, bytem/sídlo: ${String(d.buyerAddress || '____________________')}`,
      ],
    },
    {
      title: 'II. PŘEDMĚT KOUPĚ',
      body: [
        `Předmětem koupě je motorové vozidlo tovární značky ${String(d.carMake || '__________')}, model ${String(d.carModel || '__________')}.`,
        `VIN: ${String(d.carVIN || '____________________')}, SPZ: ${String(d.carPlate || '__________')}`,
        `Stav tachometru: ${formatAmount(d.carMileage)} km. Rok výroby: ${String(d.carYear || '____')}`,
      ],
    },
    {
      title: 'III. KUPNÍ CENA A PŘEDÁNÍ',
      body: [
        `Kupní cena je stanovena dohodou na ${formatAmount(d.purchasePrice)} Kč.`,
        `Platba proběhne: ${d.paymentMethod === 'cash' ? 'V hotovosti při podpisu smlouvy' : 'Bankovním převodem na účet prodávajícího'}.`,
      ],
    },
    {
      title: 'IV. TECHNICKÝ STAV',
      body: [
        'Kupující se seznámil s technickým stavem vozidla a absolvoval zkušební jízdu.',
        `Známé vady: ${String(d.knownDefects || 'Žádné zjevné vady nad rámec běžného opotřebení')}.`,
      ],
    },
    {
      title: 'V. ZÁVĚREČNÁ USTANOVENÍ',
      body: [
        'Vlastnické právo přechází na kupujícího úplným zaplacením kupní ceny. Prodávající dodá plnou moc k přepisu v registru vozidel.',
      ],
    },
    {
      title: 'VI. PODPISY',
      body: [
        'V ________________________ dne __________________',
        '\n\n_______________________________          _______________________________',
        'Prodávající                                      Kupující',
      ],
    },
  ];
}

function buildLeaseContractSections(d: StoredContractData): ContractSection[] {
  return [
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Pronajímatel: ${String(d.landlordName || '____________________')}, nar./IČO: ${String(d.landlordId || '__________')}, bytem: ${String(d.landlordAddress || '____________________')}`,
        `Nájemce: ${String(d.tenantName || '____________________')}, nar./IČO: ${String(d.tenantId || '__________')}, bytem: ${String(d.tenantAddress || '____________________')}`,
      ],
    },
    {
      title: 'II. PŘEDMĚT NÁJMU',
      body: [
        `Pronajímatel přenechává nájemci do užívání byt/prostory na adrese: ${String(d.propertyAddress || '____________________')}.`,
        `Dispozice: ${String(d.propertyLayout || '__________')}.`,
      ],
    },
    {
      title: 'III. NÁJEMNÉ A ÚHRADY ZA SLUŽBY',
      body: [
        `Měsíční nájemné činí ${formatAmount(d.rentAmount)} Kč.`,
        `Měsíční zálohy na služby činí ${formatAmount(d.utilitiesAmount)} Kč.`,
        `Nájemné a zálohy jsou splatné vždy do ${String(d.paymentDay || '5.')} dne příslušného měsíce.`,
      ],
    },
    {
      title: 'IV. JISTOTA (KAUCE) A DOBA NÁJMU',
      body: [
        `Nájemce uhradil jistotu (kauci) ve výši ${formatAmount(d.depositAmount)} Kč.`,
        `Nájem se sjednává na dobu: ${String(d.leaseDuration || 'určitou do ____________')}.`,
      ],
    },
    {
      title: 'V. PODPISY',
      body: [
        'V ________________________ dne __________________',
        '\n\n_______________________________          _______________________________',
        'Pronajímatel                                      Nájemce',
      ],
    },
  ];
}

export function buildContractSections(data: StoredContractData): ContractSection[] {
  switch (data.contractType) {
    case 'gift':
      return buildGiftContractSections(data);
    case 'work_contract':
      return buildWorkContractSections(data);
    case 'car_sale':
      return buildCarContractSections(data);
    case 'lease':
      return buildLeaseContractSections(data);
  }
}