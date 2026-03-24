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
        return `motorové vozidlo ${String(d.carMake || '')} ${String(d.carModel || '')}, VIN: ${String(d.carVIN || '__________')}, SPZ: ${String(d.carPlate || '__________')}, rok výroby ${String(d.carYear || '____')}`;
      case 'property':
        return `nemovitost na adrese ${String(d.propertyAddress || '__________')}, list vlastnictví č. ${String(d.propertyLV || '__________')}, katastrální území ${String(d.propertyCadastre || '__________')}`;
      default:
        return `movitou věc: ${String(d.thingDescription || 'specifikována níže')}`;
    }
  };

  const premiumSection: ContractSection[] = d.notaryUpsell
    ? [
        {
          title: 'V. ROZŠÍŘENÁ DOPORUČENÍ K PODPISU',
          body: [
            'V rámci rozšířeného balíčku se doporučuje podpisy smluvních stran úředně ověřit, zejména pokud jde o darování majetku vyšší hodnoty nebo nemovitosti.',
            'Strany berou na vědomí, že samotné ověření podpisů může být provedeno samostatně u notáře nebo na kontaktním místě veřejné správy.',
          ],
        },
      ]
    : [];

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
        d.giftDate ? `Smlouva byla uzavřena dne ${String(d.giftDate)}.` : 'Smlouva byla uzavřena dne __________________.',
        'Smluvní strany prohlašují, že smlouvu uzavírají dobrovolně a že jejímu obsahu rozumí.',
      ],
    },
    {
      title: 'IV. PODPISY',
      body: [
        'V ________________________ dne __________________',
        '\n\n_______________________________          _______________________________',
        'Dárce                                      Obdarovaný',
      ],
    },
    ...premiumSection,
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
    d.withdrawalRight ? 'Smluvní strany sjednávají možnost odstoupení od smlouvy v případech stanovených smlouvou a právními předpisy.' : '',
    'Smlouva se řídí ustanoveními § 2586 a násl. občanského zákoníku.',
  ].filter(Boolean) as string[];

  const premiumSection: ContractSection[] = d.notaryUpsell
    ? [
        {
          title: 'VIII. ROZŠÍŘENÁ DOPORUČENÍ K PODPISU',
          body: [
            'V rámci rozšířeného balíčku se doporučuje využít úřední ověření podpisů nebo samostatné přílohy pro posílení důkazní jistoty smluvních stran.',
            'Doporučuje se také důsledně evidovat předání díla, vícepráce, změny rozsahu a veškerou komunikaci o termínech a vadách.',
          ],
        },
      ]
    : [];

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
    ...premiumSection,
  ];
}

function buildCarContractSections(d: StoredContractData): ContractSection[] {
  const paymentText =
    d.paymentMethod === 'cash'
      ? 'V hotovosti při podpisu smlouvy'
      : 'Bankovním převodem na účet prodávajícího';

  const premiumSection: ContractSection[] = d.notaryUpsell
    ? [
        {
          title: 'VII. ROZŠÍŘENÁ OCHRANA A DOPORUČENÍ',
          body: [
            'Součástí rozšířeného balíčku jsou doporučené doplňkové podklady k předání vozidla, evidenci stavu tachometru a shrnutí klíčových údajů pro bezpečnější převod.',
            'Stranám se doporučuje potvrdit technický stav, předané doklady, příslušenství a stav kilometrů i v samostatném předávacím protokolu.',
          ],
        },
      ]
    : [];

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
        `Kupní cena je stanovena dohodou na ${formatAmount(d.priceAmount ?? d.purchasePrice)} Kč.`,
        `Platba proběhne: ${paymentText}.`,
        d.handoverDate ? `Datum předání: ${String(d.handoverDate)}.` : '',
        d.handoverPlace ? `Místo předání: ${String(d.handoverPlace)}.` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'IV. TECHNICKÝ STAV',
      body: [
        d.buyerInspectedVehicle === false
          ? 'Kupující nepotvrzuje, že se seznámil s technickým stavem vozidla.'
          : 'Kupující se seznámil s technickým stavem vozidla a absolvoval zkušební jízdu.',
        `Známé vady: ${String(d.knownDefects || 'Žádné zjevné vady nad rámec běžného opotřebení')}.`,
        d.odometerGuaranteed === false
          ? 'Prodávající negarantuje stav tachometru.'
          : 'Prodávající prohlašuje, že údaje o stavu tachometru odpovídají jeho vědomosti.',
      ],
    },
    {
      title: 'V. PRÁVNÍ PROHLÁŠENÍ',
      body: [
        `Zástava / právní omezení: ${d.isPledged ? 'ano' : 'ne'}.`,
        `Leasing / financování: ${d.isInLeasing ? 'ano' : 'ne'}.`,
        `Práva třetích osob: ${d.hasThirdPartyRights ? 'ano' : 'ne'}.`,
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
    ...premiumSection,
  ];
}

function buildLeaseContractSections(d: StoredContractData): ContractSection[] {
  const propertyAddress = String(d.propertyAddress || d.flatAddress || '____________________');
  const propertyLayout = String(d.propertyLayout || d.flatLayout || '__________');
  const utilitiesAmount = d.utilitiesAmount ?? d.utilityAmount ?? '';
  const paymentDay =
    d.paymentDay !== undefined && d.paymentDay !== null && String(d.paymentDay).trim() !== ''
      ? String(d.paymentDay)
      : '5';

  const leaseDuration =
    d.leaseDuration
      ? String(d.leaseDuration)
      : d.duration === 'indefinite'
        ? 'neurčitou'
        : d.duration === 'fixed'
          ? `určitou do ${String(d.endDate || '__________')}`
          : 'určitou do ____________';

  const animalsText = d.allowPets ? 'povolena' : 'nepovolena';
  const smokingText = d.allowSmoking ? 'povoleno' : 'zakázáno';
  const airbnbText = d.allowAirbnb ? 'povolen' : 'zakázán';
  const businessText = d.businessUseAllowed ? 'povoleno' : 'zakázáno';
  const inspectionText = d.inspectionAllowed
    ? 'Pronajímatel je oprávněn po předchozím oznámení provést přiměřenou kontrolu stavu bytu.'
    : 'Právo pravidelné kontroly bytu není výslovně sjednáno.';
  const penaltiesText = d.strictPenalties
    ? 'Strany sjednávají přísnější režim odpovědnosti nájemce za porušení povinností vyplývajících ze smlouvy a právních předpisů.'
    : 'Smlouva neobsahuje rozšířený režim smluvních sankcí nad rámec základních povinností.';

  const sections: ContractSection[] = [
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Pronajímatel: ${String(d.landlordName || '____________________')}, nar./IČO: ${String(d.landlordId || '__________')}, bytem: ${String(d.landlordAddress || '____________________')}`,
        d.landlordOP ? `Číslo OP pronajímatele: ${String(d.landlordOP)}` : '',
        d.landlordEmail ? `E-mail pronajímatele: ${String(d.landlordEmail)}` : '',
        d.landlordPhone ? `Telefon pronajímatele: ${String(d.landlordPhone)}` : '',
        `Nájemce: ${String(d.tenantName || '____________________')}, nar./IČO: ${String(d.tenantId || '__________')}, bytem: ${String(d.tenantAddress || '____________________')}`,
        d.tenantOP ? `Číslo OP nájemce: ${String(d.tenantOP)}` : '',
        d.tenantEmail ? `E-mail nájemce: ${String(d.tenantEmail)}` : '',
        d.tenantPhone ? `Telefon nájemce: ${String(d.tenantPhone)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. PŘEDMĚT NÁJMU',
      body: [
        `Pronajímatel přenechává nájemci do užívání byt/prostory na adrese: ${propertyAddress}.`,
        `Dispozice: ${propertyLayout}.`,
        d.flatUnitNumber ? `Číslo jednotky: ${String(d.flatUnitNumber)}.` : '',
        d.cadastralArea ? `Katastrální území: ${String(d.cadastralArea)}.` : '',
        d.ownershipSheet ? `List vlastnictví: ${String(d.ownershipSheet)}.` : '',
        d.floor ? `Podlaží / patro: ${String(d.floor)}.` : '',
        'Nájemce prohlašuje, že se seznámil se stavem bytu a přebírá jej ve stavu popsaném ve smlouvě a předávacím protokolu.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. DOBA NÁJMU',
      body: [
        `Nájem se sjednává na dobu: ${leaseDuration}.`,
        d.startDate ? `Začátek nájmu: ${String(d.startDate)}.` : '',
        d.handoverDate ? `Předání bytu: ${String(d.handoverDate)}.` : '',
        d.duration === 'fixed'
          ? 'Po uplynutí sjednané doby nájmu nájem končí, nebude-li prodloužen novou dohodou stran.'
          : 'Nájem je sjednán na dobu neurčitou a může být ukončen způsobem stanoveným smlouvou a právními předpisy.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'IV. NÁJEMNÉ A ÚHRADY ZA SLUŽBY',
      body: [
        `Měsíční nájemné činí ${formatAmount(d.rentAmount)} Kč.`,
        `Měsíční zálohy na služby činí ${formatAmount(utilitiesAmount)} Kč.`,
        `Celková pravidelná měsíční platba činí ${formatAmount((Number(d.rentAmount || 0) + Number(utilitiesAmount || 0)).toString())} Kč.`,
        `Nájemné a zálohy jsou splatné vždy do ${paymentDay}. dne příslušného měsíce.`,
        d.bankAccount ? `Bankovní účet pronajímatele: ${String(d.bankAccount)}.` : '',
        d.variableSymbol ? `Variabilní symbol: ${String(d.variableSymbol)}.` : '',
        d.utilitiesIncludedText
          ? `Specifikace služeb a záloh: ${String(d.utilitiesIncludedText)}`
          : 'Specifikace služeb a záloh bude určena podle skutečného rozsahu poskytovaných plnění.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'V. JISTOTA (KAUCE)',
      body: [
        `Nájemce skládá pronajímateli jistotu (kauci) ve výši ${formatAmount(d.depositAmount)} Kč.`,
        'Jistota slouží k zajištění pohledávek pronajímatele vzniklých z nájmu, zejména dluhů na nájemném, službách, náhradě škody, smluvních pokutách a nákladech spojených s neřádným odevzdáním bytu.',
        'Po skončení nájmu bude nevyčerpaná část jistoty vrácena nájemci po vypořádání všech závazků.',
      ],
    },
    {
      title: 'VI. PRAVIDLA UŽÍVÁNÍ BYTU',
      body: [
        d.maxOccupants ? `Maximální počet osob užívajících byt: ${String(d.maxOccupants)}.` : '',
        `Domácí zvířata: ${animalsText}.`,
        `Kouření v bytě: ${smokingText}.`,
        `Airbnb / krátkodobý podnájem: ${airbnbText}.`,
        `Podnikání v bytě: ${businessText}.`,
        inspectionText,
        penaltiesText,
        'Nájemce je povinen užívat byt řádně, šetrně a v souladu s účelem nájmu, předcházet vzniku škod a bez zbytečného odkladu hlásit závady a havárie.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'VII. PŘEDÁNÍ BYTU A VYBAVENÍ',
      body: [
        d.keysCount ? `Počet předávaných klíčů: ${String(d.keysCount)}.` : '',
        d.electricityMeter ? `Stav elektroměru při předání: ${String(d.electricityMeter)}.` : '',
        d.gasMeter ? `Stav plynoměru při předání: ${String(d.gasMeter)}.` : '',
        d.waterMeter ? `Stav vodoměru při předání: ${String(d.waterMeter)}.` : '',
        d.equipmentList ? `Předávané vybavení bytu: ${String(d.equipmentList)}` : '',
        d.knownDefects ? `Známé vady a poznámky: ${String(d.knownDefects)}` : 'Byt je předáván bez výslovně uvedených vad nad rámec běžného opotřebení.',
      ].filter(Boolean) as string[],
    },
  ];

  if (d.notaryUpsell) {
    sections.push({
      title: 'VIII. ROZŠÍŘENÁ OCHRANA PRONAJÍMATELE',
      body: [
        'Strany berou na vědomí, že součástí rozšířeného balíčku je doporučené zesílení vymahatelnosti práv pronajímatele formou samostatných podkladů pro notářský zápis se svolením k vykonatelnosti, pokud se pro tento postup rozhodnou.',
        'Nájemce prohlašuje, že si je vědom své povinnosti byt po skončení nájmu včas a řádně vyklidit a odevzdat jej ve stavu odpovídajícím smlouvě a běžnému opotřebení.',
        'Rozšířený balíček doporučuje i důsledné doložení předání bytu, stavu měřidel, vybavení a případných vad pro případ pozdějšího sporu.',
      ],
    });
  }

  sections.push({
    title: d.notaryUpsell ? 'IX. PODPISY' : 'VIII. PODPISY',
    body: [
      'V ________________________ dne __________________',
      '\n\n_______________________________          _______________________________',
      'Pronajímatel                                      Nájemce',
    ],
  });

  sections.push({
    title: d.notaryUpsell ? 'PŘÍLOHA Č. 1 – PŘEDÁVACÍ PROTOKOL' : 'PŘÍLOHA – PŘEDÁVACÍ PROTOKOL',
    body: [
      `Adresa bytu: ${propertyAddress}`,
      d.handoverDate ? `Datum předání: ${String(d.handoverDate)}` : 'Datum předání: __________________',
      `Pronajímatel: ${String(d.landlordName || '____________________')}`,
      `Nájemce: ${String(d.tenantName || '____________________')}`,
      '',
      '1. Stav měřidel:',
      `- Elektroměr: ${String(d.electricityMeter || '____________________')}`,
      `- Plynoměr: ${String(d.gasMeter || '____________________')}`,
      `- Vodoměr: ${String(d.waterMeter || '____________________')}`,
      '',
      `2. Počet předaných klíčů: ${String(d.keysCount || '____________________')}`,
      '',
      '3. Předané vybavení:',
      `${String(d.equipmentList || '____________________')}`,
      '',
      '4. Zjištěné vady / poškození / poznámky:',
      `${String(d.knownDefects || 'Bez zjevných vad.')}`,
      '',
      'Potvrzujeme, že byt byl předán / převzat v rozsahu uvedeném v tomto protokolu.',
      '\n\n_______________________________          _______________________________',
      'Pronajímatel                                      Nájemce',
    ],
  });

  return sections;
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