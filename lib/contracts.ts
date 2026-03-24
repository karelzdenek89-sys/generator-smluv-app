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

const emptyLine = '____________________';

const formatAmount = (amount?: unknown) => {
  if (amount === null || amount === undefined || amount === '') return '__________';
  const num = Number(amount);
  if (Number.isNaN(num)) return String(amount);
  return num.toLocaleString('cs-CZ');
};

const asText = (value: unknown, fallback = emptyLine) => {
  if (value === null || value === undefined) return fallback;
  const str = String(value).trim();
  return str === '' ? fallback : str;
};

const yesNo = (value: unknown, yes = 'ano', no = 'ne') => (value ? yes : no);

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
        return `peněžní částku ve výši ${formatAmount(d.amount)} ${asText(d.currency, 'Kč')}`;
      case 'car':
        return `motorové vozidlo ${asText(d.carMake, '')} ${asText(d.carModel, '')}, VIN: ${asText(d.carVIN, '__________')}, SPZ: ${asText(d.carPlate, '__________')}, rok výroby ${asText(d.carYear, '____')}`;
      case 'property':
        return `nemovitost na adrese ${asText(d.propertyAddress, '__________')}, list vlastnictví č. ${asText(d.propertyLV, '__________')}, katastrální území ${asText(d.propertyCadastre, '__________')}`;
      default:
        return `movitou věc: ${asText(d.thingDescription, 'specifikována níže')}`;
    }
  };

  const sections: ContractSection[] = [
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Dárce: ${asText(d.donorName)}, nar. ${asText(d.donorId, '__________')}, bytem ${asText(d.donorAddress)}`,
        `Obdarovaný: ${asText(d.doneeName)}, nar. ${asText(d.doneeId, '__________')}, bytem ${asText(d.doneeAddress)}`,
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
          ? `Dar je poskytován s výminkem: ${asText(d.reservationDescription)}`
          : 'Dar je poskytován bez výminků a bez právních vad.',
        d.giftDate ? `Smlouva byla uzavřena dne ${asText(d.giftDate)}.` : 'Smlouva byla uzavřena dne __________________.',
        'Smluvní strany prohlašují, že smlouvu uzavírají svobodně, vážně a že jejímu obsahu rozumí.',
      ],
    },
  ];

  if (d.notaryUpsell) {
    sections.push({
      title: 'IV. DOPORUČENÍ K OVĚŘENÍ PODPISŮ',
      body: [
        'V rámci rozšířeného balíčku se doporučuje úřední ověření podpisů smluvních stran, zejména při převodu majetku vyšší hodnoty nebo nemovitostí.',
        'Ověření podpisů lze provést samostatně u notáře nebo na kontaktním místě veřejné správy.',
      ],
    });
  }

  sections.push({
    title: d.notaryUpsell ? 'V. PODPISY' : 'IV. PODPISY',
    body: [
      'V ________________________ dne __________________',
      '\n\n_______________________________          _______________________________',
      'Dárce                                      Obdarovaný',
    ],
  });

  return sections;
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
      ? `Záloha ve výši ${formatAmount(d.depositAmount)} ${asText(d.currency, 'Kč')} je splatná před zahájením prací. Doplatek je splatný po řádném předání díla bez vad.`
      : d.paymentType === 'milestones'
        ? 'Cena bude hrazena průběžně na základě odsouhlasených dílčích faktur nebo etapového plnění.'
        : 'Celková cena je splatná jednorázově po řádném předání díla bez vad a nedodělků.';

  const sections: ContractSection[] = [
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Objednatel: ${asText(d.clientName)}`,
        `IČO: ${asText(d.clientRegNo, '__________')}, adresa: ${asText(d.clientAddress)}`,
        `Zhotovitel: ${asText(d.contractorName)}`,
        `IČO: ${asText(d.contractorRegNo, '__________')}, adresa: ${asText(d.contractorAddress)}`,
      ],
    },
    {
      title: 'II. PŘEDMĚT DÍLA',
      body: [
        `Zhotovitel se zavazuje provést dílo: "${asText(d.workTitle)}"`,
        `Popis díla: ${asText(d.workDescription)}`,
        `Místo plnění: ${asText(d.workLocation)}`,
        `Materiál zajišťuje: ${materialProvider}.`,
      ],
    },
    {
      title: 'III. CENA A PLATEBNÍ PODMÍNKY',
      body: [
        `Celková cena díla činí ${formatAmount(d.priceAmount)} ${asText(d.currency, 'Kč')}.`,
        paymentDesc,
      ],
    },
    {
      title: 'IV. TERMÍNY PLNĚNÍ',
      body: [
        `Zahájení prací: ${asText(d.startDate, '__________')}`,
        `Dokončení a předání díla: ${asText(d.endDate, '__________')}`,
      ],
    },
    {
      title: 'V. ODPOVĚDNOST, ZÁRUKA A SANKCE',
      body: [
        `Záruka za jakost: ${asText(d.warrantyMonths, '24')} měsíců.`,
        `Smluvní pokuta za prodlení: ${asText(d.delayPenaltyPerDay, '0,05')} % z ceny díla za každý den prodlení.`,
        `Smluvní pokuta za vady: ${asText(d.defectPenaltyPercent, '10')} % z ceny díla, pokud vady nejsou odstraněny v přiměřené lhůtě.`,
      ],
    },
    {
      title: 'VI. ZÁVĚREČNÁ USTANOVENÍ',
      body: [
        d.handoverProtocol ? 'Předání díla proběhne písemným protokolem o předání a převzetí.' : '',
        d.insuranceRequired ? 'Zhotovitel má po dobu provádění díla sjednáno pojištění odpovědnosti za škodu.' : '',
        d.withdrawalRight ? 'Smluvní strany sjednávají možnost odstoupení od smlouvy v případech stanovených smlouvou a právními předpisy.' : '',
        'Smlouva se řídí ustanoveními § 2586 a násl. občanského zákoníku.',
      ].filter(Boolean) as string[],
    },
  ];

  if (d.notaryUpsell) {
    sections.push({
      title: 'VII. ROZŠÍŘENÁ DŮKAZNÍ OCHRANA',
      body: [
        'V rámci rozšířeného balíčku se doporučuje využít úřední ověření podpisů a důslednou evidenci změn rozsahu díla, víceprací, termínů a předání.',
        'Stranám se doporučuje všechny dodatky, předávací protokoly a odsouhlasené vícepráce zachytit v písemné podobě.',
      ],
    });
  }

  sections.push({
    title: d.notaryUpsell ? 'VIII. PODPISY' : 'VII. PODPISY',
    body: [
      'V ________________________ dne __________________',
      '\n\n_______________________________          _______________________________',
      'Objednatel                                      Zhotovitel',
    ],
  });

  return sections;
}

function buildCarContractSections(d: StoredContractData): ContractSection[] {
  const paymentText =
    d.paymentMethod === 'cash'
      ? 'V hotovosti při podpisu smlouvy'
      : 'Bankovním převodem na účet prodávajícího';

  const sections: ContractSection[] = [
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Prodávající: ${asText(d.sellerName)}, nar./IČO: ${asText(d.sellerId, '__________')}, bytem/sídlo: ${asText(d.sellerAddress)}`,
        `Kupující: ${asText(d.buyerName)}, nar./IČO: ${asText(d.buyerId, '__________')}, bytem/sídlo: ${asText(d.buyerAddress)}`,
      ],
    },
    {
      title: 'II. PŘEDMĚT KOUPĚ',
      body: [
        `Předmětem koupě je motorové vozidlo tovární značky ${asText(d.carMake, '__________')}, model ${asText(d.carModel, '__________')}.`,
        `VIN: ${asText(d.carVIN, '____________________')}, SPZ: ${asText(d.carPlate, '__________')}`,
        `Stav tachometru: ${formatAmount(d.carMileage)} km. Rok výroby: ${asText(d.carYear, '____')}`,
      ],
    },
    {
      title: 'III. KUPNÍ CENA A PŘEDÁNÍ',
      body: [
        `Kupní cena je stanovena dohodou na ${formatAmount(d.priceAmount ?? d.purchasePrice)} Kč.`,
        `Platba proběhne: ${paymentText}.`,
        d.handoverDate ? `Datum předání: ${asText(d.handoverDate)}.` : '',
        d.handoverPlace ? `Místo předání: ${asText(d.handoverPlace)}.` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'IV. TECHNICKÝ STAV A PROHLÁŠENÍ STRAN',
      body: [
        d.buyerInspectedVehicle === false
          ? 'Kupující nepotvrzuje, že se seznámil s technickým stavem vozidla.'
          : 'Kupující potvrzuje, že se seznámil s technickým stavem vozidla.',
        `Známé vady: ${asText(d.knownDefects, 'Žádné zjevné vady nad rámec běžného opotřebení')}.`,
        d.odometerGuaranteed === false
          ? 'Prodávající negarantuje stav tachometru.'
          : 'Prodávající prohlašuje, že údaj o stavu tachometru odpovídá jeho vědomosti.',
        `Zástava / právní omezení: ${yesNo(d.isPledged)}.`,
        `Leasing / financování: ${yesNo(d.isInLeasing)}.`,
        `Práva třetích osob: ${yesNo(d.hasThirdPartyRights)}.`,
      ],
    },
  ];

  if (d.notaryUpsell) {
    sections.push({
      title: 'V. ROZŠÍŘENÁ OCHRANA A DOPORUČENÍ',
      body: [
        'Součástí rozšířeného balíčku jsou doporučené doplňkové podklady k předání vozidla, evidenci stavu tachometru a shrnutí předaných dokladů a příslušenství.',
        'Stranám se doporučuje detailně potvrdit technický stav, stav kilometrů a předané vybavení i v samostatném předávacím protokolu.',
      ],
    });
  }

  sections.push({
    title: d.notaryUpsell ? 'VI. PODPISY' : 'V. PODPISY',
    body: [
      'V ________________________ dne __________________',
      '\n\n_______________________________          _______________________________',
      'Prodávající                                      Kupující',
    ],
  });

  return sections;
}

function buildLeaseContractSections(d: StoredContractData): ContractSection[] {
  const propertyAddress = asText(d.propertyAddress || d.flatAddress);
  const propertyLayout = asText(d.propertyLayout || d.flatLayout, '__________');
  const utilitiesAmount = d.utilitiesAmount ?? d.utilityAmount ?? '';
  const paymentDay =
    d.paymentDay !== undefined && d.paymentDay !== null && String(d.paymentDay).trim() !== ''
      ? String(d.paymentDay).replace(/\D/g, '')
      : '5';

  const leaseDuration =
    d.leaseDuration
      ? asText(d.leaseDuration)
      : d.duration === 'indefinite'
        ? 'neurčitou'
        : d.duration === 'fixed'
          ? `určitou do ${asText(d.endDate, '__________')}`
          : 'určitou do ____________';

  const monthlyTotal =
    (Number(d.rentAmount || 0) + Number(utilitiesAmount || 0)).toString();

  const sections: ContractSection[] = [
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Pronajímatel: ${asText(d.landlordName)}, nar./IČO: ${asText(d.landlordId, '__________')}, bytem: ${asText(d.landlordAddress)}`,
        d.landlordOP ? `Číslo OP pronajímatele: ${asText(d.landlordOP)}` : '',
        d.landlordEmail ? `E-mail pronajímatele: ${asText(d.landlordEmail)}` : '',
        d.landlordPhone ? `Telefon pronajímatele: ${asText(d.landlordPhone)}` : '',
        `Nájemce: ${asText(d.tenantName)}, nar./IČO: ${asText(d.tenantId, '__________')}, bytem: ${asText(d.tenantAddress)}`,
        d.tenantOP ? `Číslo OP nájemce: ${asText(d.tenantOP)}` : '',
        d.tenantEmail ? `E-mail nájemce: ${asText(d.tenantEmail)}` : '',
        d.tenantPhone ? `Telefon nájemce: ${asText(d.tenantPhone)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. PŘEDMĚT NÁJMU',
      body: [
        `Pronajímatel přenechává nájemci do užívání byt/prostory na adrese: ${propertyAddress}.`,
        `Dispozice: ${propertyLayout}.`,
        d.flatUnitNumber ? `Číslo jednotky: ${asText(d.flatUnitNumber)}.` : '',
        d.cadastralArea ? `Katastrální území: ${asText(d.cadastralArea)}.` : '',
        d.ownershipSheet ? `List vlastnictví: ${asText(d.ownershipSheet)}.` : '',
        d.floor ? `Podlaží / patro: ${asText(d.floor)}.` : '',
        'Nájemce potvrzuje, že se seznámil se stavem bytu a přebírá jej ve stavu popsaném touto smlouvou a předávacím protokolem.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. DOBA NÁJMU',
      body: [
        `Nájem se sjednává na dobu: ${leaseDuration}.`,
        d.startDate ? `Začátek nájmu: ${asText(d.startDate)}.` : '',
        d.handoverDate ? `Předání bytu: ${asText(d.handoverDate)}.` : '',
        d.duration === 'fixed'
          ? 'Po uplynutí sjednané doby nájmu nájem končí, nebude-li prodloužen novou dohodou stran.'
          : 'Nájem je sjednán na dobu neurčitou a může být ukončen v souladu se smlouvou a příslušnými právními předpisy.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'IV. NÁJEMNÉ A ÚHRADY ZA SLUŽBY',
      body: [
        `Měsíční nájemné činí ${formatAmount(d.rentAmount)} Kč.`,
        `Měsíční zálohy na služby činí ${formatAmount(utilitiesAmount)} Kč.`,
        `Celková pravidelná měsíční platba činí ${formatAmount(monthlyTotal)} Kč.`,
        `Nájemné a zálohy jsou splatné vždy do ${paymentDay}. dne příslušného měsíce.`,
        d.bankAccount ? `Bankovní účet pronajímatele: ${asText(d.bankAccount)}.` : '',
        d.variableSymbol ? `Variabilní symbol: ${asText(d.variableSymbol)}.` : '',
        d.utilitiesIncludedText
          ? `Specifikace služeb a záloh: ${asText(d.utilitiesIncludedText)}`
          : 'Specifikace služeb a záloh odpovídá obvyklému rozsahu plnění spojených s užíváním bytu.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'V. JISTOTA (KAUCE)',
      body: [
        `Nájemce skládá pronajímateli jistotu (kauci) ve výši ${formatAmount(d.depositAmount)} Kč.`,
        'Jistota slouží k zajištění pohledávek pronajímatele vzniklých z nájmu, zejména dluhů na nájemném, službách, náhradě škody, smluvních pokutách a nákladů spojených s neřádným odevzdáním bytu.',
        'Nevyčerpaná část jistoty bude nájemci vrácena po skončení nájmu a vypořádání všech závazků.',
      ],
    },
    {
      title: 'VI. PRAVIDLA UŽÍVÁNÍ BYTU',
      body: [
        d.maxOccupants ? `Maximální počet osob užívajících byt: ${asText(d.maxOccupants)}.` : '',
        `Domácí zvířata: ${d.allowPets ? 'povolena' : 'nepovolena'}.`,
        `Kouření v bytě: ${d.allowSmoking ? 'povoleno' : 'zakázáno'}.`,
        `Airbnb / krátkodobý podnájem: ${d.allowAirbnb ? 'povolen' : 'zakázán'}.`,
        `Podnikání v bytě: ${d.businessUseAllowed ? 'povoleno' : 'zakázáno'}.`,
        d.inspectionAllowed
          ? 'Pronajímatel je oprávněn po předchozím oznámení provést přiměřenou kontrolu stavu bytu.'
          : 'Právo pravidelné kontroly bytu není výslovně sjednáno.',
        d.strictPenalties
          ? 'Strany sjednávají přísnější režim odpovědnosti nájemce za porušení smluvních povinností.'
          : 'Smlouva neobsahuje rozšířený režim smluvních sankcí nad rámec základních povinností.',
        'Nájemce je povinen užívat byt řádně, šetrně a v souladu s účelem nájmu, předcházet vzniku škod a bez zbytečného odkladu hlásit závady a havárie.',
        'Nájemce není oprávněn přenechat byt ani jeho část do podnájmu třetí osobě bez předchozího písemného souhlasu pronajímatele, není-li zákonem stanoveno jinak.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'VII. PŘEDÁNÍ BYTU A VYBAVENÍ',
      body: [
        d.keysCount ? `Počet předávaných klíčů: ${asText(d.keysCount)}.` : '',
        d.electricityMeter ? `Stav elektroměru při předání: ${asText(d.electricityMeter)}.` : '',
        d.gasMeter ? `Stav plynoměru při předání: ${asText(d.gasMeter)}.` : '',
        d.waterMeter ? `Stav vodoměru při předání: ${asText(d.waterMeter)}.` : '',
        d.equipmentList ? `Předávané vybavení bytu: ${asText(d.equipmentList)}` : '',
        d.knownDefects
          ? `Známé vady a poznámky: ${asText(d.knownDefects)}`
          : 'Byt je předáván bez výslovně uvedených vad nad rámec běžného opotřebení.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'VIII. UKONČENÍ NÁJMU',
      body: [
        d.duration === 'indefinite'
          ? 'Nájem na dobu neurčitou může být ukončen dohodou stran, výpovědí nebo jiným způsobem stanoveným právními předpisy.'
          : 'Nájem na dobu určitou končí uplynutím sjednané doby, nedohodnou-li se strany jinak nebo nestanoví-li právní předpisy odlišně.',
        'Při skončení nájmu je nájemce povinen byt vyklidit, odstranit své věci a odevzdat jej pronajímateli řádně a včas.',
      ],
    },
  ];

  if (d.notaryUpsell) {
    sections.push({
      title: 'IX. ROZŠÍŘENÁ OCHRANA PRONAJÍMATELE',
      body: [
        'Součástí rozšířeného balíčku je doporučené zesílení vymahatelnosti práv pronajímatele formou podkladů pro samostatný notářský zápis se svolením k vykonatelnosti, pokud se pro tento postup strany rozhodnou.',
        'Nájemce bere na vědomí, že po skončení nájmu je povinen byt včas a řádně vyklidit a odevzdat ve stavu odpovídajícím smlouvě a běžnému opotřebení.',
        'Rozšířený balíček současně doporučuje důsledné písemné zachycení předání bytu, stavu měřidel, vybavení a případných vad pro případ pozdějšího sporu.',
      ],
    });
  }

  sections.push({
    title: d.notaryUpsell ? 'X. PODPISY' : 'IX. PODPISY',
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
      d.handoverDate ? `Datum předání: ${asText(d.handoverDate)}` : 'Datum předání: __________________',
      `Pronajímatel: ${asText(d.landlordName)}`,
      `Nájemce: ${asText(d.tenantName)}`,
      '',
      '1. Stav měřidel:',
      `- Elektroměr: ${asText(d.electricityMeter, '____________________')}`,
      `- Plynoměr: ${asText(d.gasMeter, '____________________')}`,
      `- Vodoměr: ${asText(d.waterMeter, '____________________')}`,
      '',
      `2. Počet předaných klíčů: ${asText(d.keysCount, '____________________')}`,
      '',
      '3. Předané vybavení:',
      `${asText(d.equipmentList, '____________________')}`,
      '',
      '4. Zjištěné vady / poškození / poznámky:',
      `${asText(d.knownDefects, 'Bez zjevných vad.')}`,
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