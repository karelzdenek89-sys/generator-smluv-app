export type ContractType = 'lease' | 'car_sale' | 'gift' | 'work_contract' | 'loan' | 'nda';

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

const today = () => new Date().toLocaleDateString('cs-CZ');

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
    case 'loan':
      return { title: 'Smlouva o zápůjčce', fileName: 'Smlouva_o_zapujcce_2026.pdf' };
    case 'nda':
      return { title: 'Smlouva o mlčenlivosti (NDA)', fileName: 'NDA_smlouva_2026.pdf' };
  }
}

// ─────────────────────────────────────────────
//  DAROVACÍ SMLOUVA
// ─────────────────────────────────────────────
function buildGiftContractSections(d: StoredContractData): ContractSection[] {
  const giftSubject = () => {
    switch (d.giftType) {
      case 'money':
        return `peněžní částku ve výši ${formatAmount(d.amount)} ${asText(d.currency, 'Kč')} (slovy: ${asText(d.amountWords, '__________')})`;
      case 'car':
        return `motorové vozidlo tovární značky ${asText(d.carMake, '')} ${asText(d.carModel, '')}, VIN: ${asText(d.carVIN, '__________')}, SPZ: ${asText(d.carPlate, '__________')}, rok výroby ${asText(d.carYear, '____')}, stav tachometru ke dni podpisu smlouvy: ${asText(d.carMileage, '__________')} km`;
      case 'property':
        return `nemovitou věc — byt/pozemek na adrese ${asText(d.propertyAddress, '__________')}, zapsanou na listu vlastnictví č. ${asText(d.propertyLV, '__________')}, katastrální území ${asText(d.propertyCadastre, '__________')}, u Katastrálního úřadu pro ${asText(d.cadastralOffice, '__________')}`;
      default:
        return `movitou věc: ${asText(d.thingDescription, 'specifikována níže')}`;
    }
  };

  const premiumContent: ContractSection[] = d.notaryUpsell ? [
    {
      title: 'IV. PROHLÁŠENÍ O BEZDLUHOVOSTI A PRÁVNÍM STAVU',
      body: [
        'Dárce prohlašuje, že předmět daru:',
        'a) není zatížen zástavním právem, věcným břemenem ani jiným omezením, pokud není výslovně uvedeno jinak,',
        'b) na předmět daru neváže žádné rozhodnutí soudu, exekuce ani jiné omezení dispozičních práv,',
        'c) darovaná věc/prostředky jsou ve výlučném vlastnictví dárce, případně byl udělen souhlas druhého manžela/ky v souladu s § 714 OZ,',
        d.giftType === 'car'
          ? 'd) vozidlo není předmětem leasingu, financování ani jiného závazkového vztahu omezujícího převod vlastnictví.'
          : 'd) darovaná věc nepochází z trestné činnosti.',
      ],
    },
    {
      title: 'V. PODMÍNKY VRÁCENÍ DARU',
      body: [
        'Dárce si vyhrazuje právo požadovat vrácení daru (§ 2068 a násl. OZ) v případě, že se obdarovaný chová k dárci nebo jeho blízkým tak, že tím hrubě porušuje dobré mravy.',
        d.withReservation
          ? `Podmínka vázající dar: ${asText(d.reservationDescription)}. Nedojde-li ke splnění podmínky ve lhůtě do ${asText(d.conditionDeadline, '__________')}, smlouva se od počátku ruší.`
          : 'Dar je poskytován bez dalších podmínek a výminek.',
        'Právo na vrácení daru se promlčuje ve lhůtě tří let ode dne, kdy se dárce dozvěděl o důvodu pro vrácení.',
      ],
    },
  ] : [];

  const sections: ContractSection[] = [
    {
      title: 'ZÁHLAVÍ SMLOUVY',
      body: [
        'Tato darovací smlouva (dále jen „smlouva") je uzavírána podle § 2055 a násl. zákona č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů (dále jen „OZ").',
        `Datum uzavření smlouvy: ${d.giftDate ? asText(d.giftDate) : today()}`,
      ],
    },
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Dárce: ${asText(d.donorName)}, nar./IČO: ${asText(d.donorId, '__________')}, bytem/sídlo: ${asText(d.donorAddress)}`,
        d.donorEmail ? `E-mail dárce: ${asText(d.donorEmail)}` : '',
        `Obdarovaný: ${asText(d.doneeName)}, nar./IČO: ${asText(d.doneeId, '__________')}, bytem/sídlo: ${asText(d.doneeAddress)}`,
        d.doneeEmail ? `E-mail obdarovaného: ${asText(d.doneeEmail)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. PŘEDMĚT A ROZSAH DAROVÁNÍ',
      body: [
        'Dárce tímto bezplatně a dobrovolně daruje obdarovanému:',
        giftSubject(),
        'Obdarovaný dar výslovně a bez výhrad přijímá.',
        d.giftType === 'money'
          ? `Peněžní prostředky budou ${d.transferMethod === 'transfer' ? `převedeny bankovním převodem na účet obdarovaného č. ${asText(d.bankAccount, '__________')}` : 'předány v hotovosti při podpisu smlouvy'}.`
          : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. PROHLÁŠENÍ SMLUVNÍCH STRAN',
      body: [
        'Smluvní strany prohlašují, že:',
        'a) smlouvu uzavírají svobodně, vážně, určitě a srozumitelně, nikoli v tísni ani za nápadně nevýhodných podmínek,',
        'b) jsou plně způsobilé k právnímu jednání a nejsou jim známy žádné skutečnosti, které by uzavření smlouvy bránily,',
        'c) jsou jim srozumitelné veškeré podmínky a důsledky této smlouvy.',
        d.withReservation
          ? `Dar je poskytován s výminkou: ${asText(d.reservationDescription)}.`
          : 'Dar je poskytován bez výminek a bez právních vad.',
      ],
    },
    ...premiumContent,
    {
      title: `${d.notaryUpsell ? 'VI' : 'IV'}. ZÁVĚREČNÁ USTANOVENÍ`,
      body: [
        'Tato smlouva se řídí právním řádem České republiky, zejména zákonem č. 89/2012 Sb., občanský zákoník.',
        'Případné spory budou řešeny přednostně smírnou cestou, jinak věcně a místně příslušným soudem České republiky.',
        'Smlouva je vyhotovena ve dvou stejnopisech, přičemž každá smluvní strana obdrží po jednom vyhotovení.',
        'Jakékoli změny nebo doplnění smlouvy jsou platné pouze ve formě písemného dodatku podepsaného oběma smluvními stranami.',
        d.giftType === 'property'
          ? 'Vlastnické právo k nemovité věci přechází na obdarovaného vkladem do katastru nemovitostí na základě pravomocného rozhodnutí katastrálního úřadu.'
          : d.giftType === 'car'
          ? 'Vlastnické právo k vozidlu přechází na obdarovaného okamžikem podpisu této smlouvy. Smluvní strany jsou povinny neprodleně oznámit změnu vlastníka příslušnému obecnímu úřadu obce s rozšířenou působností.'
          : 'Vlastnické právo k předmětu daru přechází na obdarovaného okamžikem předání.',
      ],
    },
  ];

  sections.push({
    title: `${d.notaryUpsell ? 'VII' : 'V'}. PODPISY`,
    body: [],
  });

  return sections;
}

// ─────────────────────────────────────────────
//  SMLOUVA O DÍLO
// ─────────────────────────────────────────────
function buildWorkContractSections(d: StoredContractData): ContractSection[] {
  const materialProvider =
    d.materialBy === 'contractor'
      ? 'Zhotovitel'
      : d.materialBy === 'client'
        ? 'Objednatel'
        : 'Obě strany dle dohody';

  const paymentDesc =
    d.paymentType === 'with_deposit'
      ? `Záloha ve výši ${formatAmount(d.depositAmount)} ${asText(d.currency, 'Kč')} je splatná do ${asText(d.depositDueDays, '5')} pracovních dnů od podpisu smlouvy, nejpozději však před zahájením prací. Doplatek ve výši rozdílu je splatný do ${asText(d.finalPaymentDays, '14')} dnů od řádného předání díla bez vad a nedodělků.`
      : d.paymentType === 'milestones'
        ? `Cena bude hrazena průběžně na základě odsouhlasených dílčích faktur ke každé etapě díla (splatnost faktury ${asText(d.invoiceDueDays, '14')} dnů od doručení). Poslední splátka je splatná po řádném předání celého díla.`
        : `Celková cena je splatná jednorázově do ${asText(d.finalPaymentDays, '14')} dnů od řádného předání díla bez vad a nedodělků, na základě faktury vystavené zhotovitelem.`;

  const premiumContent: ContractSection[] = d.notaryUpsell ? [
    {
      title: 'VIII. VÍCEPRÁCE A ZMĚNY ROZSAHU',
      body: [
        `Vícepráce (tj. práce nad rámec sjednaného rozsahu díla) může zhotovitel provést pouze na základě písemného odsouhlasení objednatelem, a to formou číslovaného Změnového listu podepsaného oběma stranami (§ 2597 OZ).`,
        'Ústní dohody o rozšíření rozsahu díla jsou neúčinné.',
        'Každý Změnový list musí obsahovat: popis víceprací, jejich cenu a dopad na harmonogram.',
        'Zhotovitel nemá nárok na úhradu nepovolených víceprací.',
      ],
    },
    {
      title: 'IX. POJIŠTĚNÍ A ODPOVĚDNOST ZA ŠKODU',
      body: [
        d.insuranceRequired
          ? `Zhotovitel je povinen po celou dobu provádění díla udržovat pojištění odpovědnosti za škodu způsobenou třetím osobám při výkonu podnikatelské činnosti, a to s pojistným limitem minimálně ${asText(d.insuranceLimit, '1 000 000')} Kč. Na výzvu objednatele předloží platné pojistné osvědčení.`
          : 'Zhotovitel odpovídá za škody způsobené při provádění díla v rozsahu stanoveném obecně závaznými právními předpisy.',
        'Zhotovitel odpovídá objednateli za škody způsobené svými zaměstnanci, subdodavateli i třetími osobami, jichž k provádění díla využil.',
      ],
    },
  ] : [];

  const sections: ContractSection[] = [
    {
      title: 'ZÁHLAVÍ SMLOUVY',
      body: [
        'Tato smlouva o dílo (dále jen „smlouva") je uzavírána podle § 2586 a násl. zákona č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů (dále jen „OZ").',
        `Datum uzavření smlouvy: ${today()}`,
      ],
    },
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Objednatel: ${asText(d.clientName)}, IČO: ${asText(d.clientRegNo, '__________')}, adresa: ${asText(d.clientAddress)}`,
        d.clientEmail ? `E-mail objednatele: ${asText(d.clientEmail)}` : '',
        `Zhotovitel: ${asText(d.contractorName)}, IČO: ${asText(d.contractorRegNo, '__________')}, adresa: ${asText(d.contractorAddress)}`,
        d.contractorEmail ? `E-mail zhotovitele: ${asText(d.contractorEmail)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. PŘEDMĚT DÍLA A ROZSAH PLNĚNÍ',
      body: [
        `Zhotovitel se zavazuje provést pro objednatele dílo: „${asText(d.workTitle)}"`,
        `Podrobný popis díla: ${asText(d.workDescription)}`,
        `Místo provádění díla: ${asText(d.workLocation)}`,
        `Materiál a pracovní pomůcky zajišťuje: ${materialProvider}.`,
        d.technicalSpecs ? `Technická specifikace / projektová dokumentace: ${asText(d.technicalSpecs)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. CENA DÍLA A PLATEBNÍ PODMÍNKY',
      body: [
        `Celková cena díla (vč. materiálu, pokud zajišťuje zhotovitel) je sjednána dohodou na ${formatAmount(d.priceAmount)} ${asText(d.currency, 'Kč')} ${d.vatIncluded ? '(cena včetně DPH)' : '(cena bez DPH; DPH bude účtováno dle platných předpisů)'}.`,
        paymentDesc,
        d.bankAccount ? `Bankovní spojení zhotovitele: ${asText(d.bankAccount)}, VS: ${asText(d.variableSymbol, '__________')}.` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'IV. HARMONOGRAM A TERMÍNY PLNĚNÍ',
      body: [
        `Zahájení prací: ${asText(d.startDate, '__________')}`,
        `Dokončení a předání díla nejpozději dne: ${asText(d.endDate, '__________')}`,
        d.milestones ? `Průběžné milníky: ${asText(d.milestones)}` : '',
        'Termíny jsou závazné. Zhotovitel je povinen neprodleně informovat objednatele o okolnostech, které by mohly ohrozit jejich splnění.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'V. ODPOVĚDNOST ZA VADY, ZÁRUKA A SMLUVNÍ SANKCE',
      body: [
        `Záruka za jakost díla: ${asText(d.warrantyMonths, '24')} měsíců od řádného předání díla (§ 2619 OZ).`,
        `Smluvní pokuta za prodlení zhotovitele s předáním díla: ${asText(d.delayPenaltyPerDay, '0,05')} % z celkové ceny díla za každý den prodlení, max. ${asText(d.maxPenaltyPercent, '15')} % z ceny díla.`,
        `Smluvní pokuta za prodlení objednatele s úhradou: ${asText(d.clientPenaltyPerDay, '0,05')} % z dlužné částky za každý den prodlení.`,
        `Smluvní pokuta za neodstranění vad v přiměřené lhůtě: ${asText(d.defectPenaltyPercent, '10')} % z ceny díla.`,
        'Zaplacením smluvní pokuty není dotčen nárok na náhradu škody.',
      ],
    },
    {
      title: 'VI. PŘEDÁNÍ DÍLA A PROTOKOL O PŘEJÍMCE',
      body: [
        d.handoverProtocol
          ? 'Dílo bude předáno objednateli na základě písemného předávacího a přejímacího protokolu podepsaného oběma smluvními stranami. Protokol musí obsahovat soupis případných vad a nedodělků a lhůtu pro jejich odstranění.'
          : 'Dílo bude předáno objednateli faktickým předáním na místě plnění. O předání bude proveden záznam.',
        'Objednatel je povinen dílo převzít, nemá-li podstatné vady. Drobné vady a nedodělky, které nebrání užívání, jsou řešeny zápisem s lhůtou odstranění.',
        'Odmítne-li objednatel bezdůvodně dílo převzít, nastávají účinky předání dnem bezdůvodného odepření převzetí.',
      ],
    },
    {
      title: 'VII. ODSTOUPENÍ OD SMLOUVY',
      body: [
        d.withdrawalRight
          ? 'Každá ze smluvních stran je oprávněna od smlouvy odstoupit v případě podstatného porušení smluvních povinností druhou stranou (§ 2002 OZ). Za podstatné porušení se považuje zejména: prodlení zhotovitele s předáním díla o více než 30 dnů, prodlení objednatele s úhradou ceny o více než 14 dnů, nebo existence vad bránících řádnému užívání díla.'
          : 'Odstoupení od smlouvy se řídí ustanoveními OZ. Účinky odstoupení jsou ex nunc (do budoucna).',
        'Odstoupení od smlouvy musí být provedeno písemnou formou a doručeno druhé straně.',
        'V případě odstoupení je zhotovitel oprávněn požadovat úhradu za řádně provedené práce ke dni účinnosti odstoupení.',
        ...premiumContent,
      ].filter(Boolean) as string[],
    },
    ...premiumContent,
    {
      title: `${d.notaryUpsell ? 'X' : 'VIII'}. ZÁVĚREČNÁ USTANOVENÍ`,
      body: [
        'Tato smlouva se řídí právním řádem České republiky.',
        'Případné spory budou řešeny přednostně smírnou cestou. Nedojde-li k dohodě, bude spor řešen věcně a místně příslušným soudem.',
        'Smlouva je vyhotovena ve dvou stejnopisech, z nichž každá smluvní strana obdrží jedno.',
        'Změny smlouvy jsou platné pouze ve formě písemných, číslovaných a podepsaných dodatků.',
        'Neplatnost jednotlivého ustanovení smlouvy nemá vliv na platnost ostatních ustanovení.',
      ],
    },
  ];

  sections.push({
    title: `${d.notaryUpsell ? 'XI' : 'IX'}. PODPISY`,
    body: [],
  });

  return sections;
}

// ─────────────────────────────────────────────
//  KUPNÍ SMLOUVA NA VOZIDLO
// ─────────────────────────────────────────────
function buildCarContractSections(d: StoredContractData): ContractSection[] {
  const paymentText =
    d.paymentMethod === 'cash'
      ? `V hotovosti při podpisu smlouvy, nejpozději však při fyzickém předání vozidla.`
      : `Bankovním převodem na účet prodávajícího č. ${asText(d.bankAccount, '__________')}, VS: ${asText(d.variableSymbol, '__________')}, do ${asText(d.paymentDueDays, '3')} pracovních dnů od podpisu smlouvy.`;

  const ownershipTransfer =
    d.ownershipTransferMoment === 'payment'
      ? 'Vlastnické právo přechází na kupujícího okamžikem úplné úhrady kupní ceny.'
      : 'Vlastnické právo přechází na kupujícího okamžikem fyzického předání vozidla.';

  const premiumContent: ContractSection[] = d.notaryUpsell ? [
    {
      title: 'VI. PODROBNÝ STAV VOZIDLA A PŘEDÁVANÉ DOKLADY',
      body: [
        `Barva vozidla: ${asText(d.carColor, '__________')}, typ paliva: ${asText(d.fuelType, '__________')}, objem motoru: ${asText(d.engineCapacity, '__________')} ccm, výkon: ${asText(d.powerKW, '__________')} kW.`,
        `Platnost STK do: ${asText(d.stkValidUntil, '__________')}, platnost emisí do: ${asText(d.emissionsValidUntil, '__________')}.`,
        `Počet předchozích vlastníků: ${asText(d.previousOwnersCount, '__________')}, původ vozidla: ${asText(d.vehicleOrigin, '__________')}.`,
        `Servisní kniha / historie: ${d.serviceHistory ? 'ano, předávána spolu s vozidlem' : 'není k dispozici'}.`,
        `Historie havárie: ${d.accidentHistory ? 'vozidlo bylo havarované, opravy dle servisní dokumentace' : 'prodávající prohlašuje, že mu není známa žádná havárie ani závažná oprava karoserie'}.`,
        `Předávaná výbava a příslušenství: ${asText(d.equipmentIncluded, 'Dle fyzického stavu při předání')}.`,
        `Pneumatiky: ${asText(d.tiresInfo, '__________')}.`,
        `Předávané doklady: ${asText(d.documentsIncluded, 'Velký technický průkaz, Osvědčení o registraci vozidla (malý TP)')}`,
        `Počet předaných klíčů: ${asText(d.keysCount, '__________')}.`,
      ],
    },
  ] : [];

  const sections: ContractSection[] = [
    {
      title: 'ZÁHLAVÍ SMLOUVY',
      body: [
        'Tato kupní smlouva (dále jen „smlouva") je uzavírána podle § 2079 a násl. zákona č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů (dále jen „OZ").',
        `Datum uzavření smlouvy: ${today()}`,
      ],
    },
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Prodávající: ${asText(d.sellerName)}, nar./IČO: ${asText(d.sellerId, '__________')}, bytem/sídlo: ${asText(d.sellerAddress)}`,
        d.sellerOP ? `Číslo OP prodávajícího: ${asText(d.sellerOP)}` : '',
        d.sellerEmail ? `E-mail prodávajícího: ${asText(d.sellerEmail)}` : '',
        d.sellerPhone ? `Telefon prodávajícího: ${asText(d.sellerPhone)}` : '',
        `Kupující: ${asText(d.buyerName)}, nar./IČO: ${asText(d.buyerId, '__________')}, bytem/sídlo: ${asText(d.buyerAddress)}`,
        d.buyerOP ? `Číslo OP kupujícího: ${asText(d.buyerOP)}` : '',
        d.buyerEmail ? `E-mail kupujícího: ${asText(d.buyerEmail)}` : '',
        d.buyerPhone ? `Telefon kupujícího: ${asText(d.buyerPhone)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. PŘEDMĚT KOUPĚ',
      body: [
        `Předmětem koupě je motorové vozidlo tovární značky ${asText(d.carMake, '__________')}, model ${asText(d.carModel, '__________')}.`,
        `VIN (číslo karoserie): ${asText(d.carVIN, '____________________')}, SPZ: ${asText(d.carPlate, '__________')}`,
        `Stav tachometru ke dni podpisu: ${formatAmount(d.carMileage)} km. Rok výroby: ${asText(d.carYear, '____')}.`,
        d.carFirstRegistration ? `Datum první registrace: ${asText(d.carFirstRegistration)}.` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. KUPNÍ CENA, PLATBA A PŘECHOD VLASTNICTVÍ',
      body: [
        `Kupní cena vozidla je sjednána ve výši ${formatAmount(d.priceAmount ?? d.purchasePrice)} Kč (slovy: ${asText(d.priceWords, '__________')}).`,
        `Způsob úhrady: ${paymentText}`,
        ownershipTransfer,
        d.handoverDate ? `Sjednané datum fyzického předání vozidla: ${asText(d.handoverDate)}.` : '',
        d.handoverPlace ? `Místo předání: ${asText(d.handoverPlace)}.` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'IV. TECHNICKÝ STAV, PROHLÁŠENÍ PRODÁVAJÍCÍHO A ZÁRUKY',
      body: [
        d.buyerInspectedVehicle === false
          ? 'Kupující bere na vědomí, že se neměl možnost v plném rozsahu seznámit s technickým stavem vozidla.'
          : 'Kupující potvrzuje, že se před podpisem smlouvy řádně seznámil s technickým stavem vozidla, a vozidlo v tomto stavu přijímá.',
        `Prodávající prohlašuje, že mu jsou známy tyto vady a omezení vozidla: ${asText(d.knownDefects, 'Žádné zjevné vady nad rámec běžného opotřebení odpovídajícího stáří a najetým km')}.`,
        d.odometerGuaranteed === false
          ? 'Prodávající výslovně negarantuje správnost stavu tachometru.'
          : 'Prodávající prohlašuje, že údaj o stavu tachometru odpovídá jeho nejlepší vědomosti a nebyl neoprávněně upraven.',
        `Vozidlo je/není předmětem zástavního práva: ${yesNo(d.isPledged)}.`,
        `Vozidlo je/není předmětem leasingu nebo jiného financování: ${yesNo(d.isInLeasing)}.`,
        `Na vozidlo váží/neváží práva třetích osob: ${yesNo(d.hasThirdPartyRights)}.`,
        d.strictWarranties
          ? 'Prodávající poskytuje smluvní záruku za jakost v délce 6 měsíců od předání. V záruční době odpovídá prodávající za vady, které existovaly v době přechodu nebezpečí škody.'
          : 'Vozidlo je prodáváno ve stavu „jak stojí a leží" odpovídajícím jeho stáří a najetým km. Prodávající neposkytuje záruku za jakost nad zákonný rámec.',
      ],
    },
    {
      title: 'V. POVINNOSTI PO PŘEDÁNÍ A PŘEPIS VOZIDLA',
      body: [
        'Smluvní strany jsou povinny neprodleně, nejpozději do 10 pracovních dnů od přechodu vlastnictví, oznámit změnu vlastníka vozidla příslušnému obecnímu úřadu obce s rozšířenou působností (§ 8 odst. 2 zákona č. 56/2001 Sb.).',
        'Prodávající je povinen kupujícímu předat veškeré doklady od vozidla, klíče a vybavení dle soupisu v této smlouvě.',
        'Povinná zákonná odpovědnost (POV/povinné ručení) a havarijní pojištění vozidla přecházejí ke dni přechodu vlastnictví na kupujícího; kupující je povinen zajistit nové pojistné smlouvy.',
      ],
    },
    ...premiumContent,
    {
      title: `${d.notaryUpsell ? 'VII' : 'VI'}. ZÁVĚREČNÁ USTANOVENÍ`,
      body: [
        'Tato smlouva se řídí právním řádem České republiky, zejména zákonem č. 89/2012 Sb., OZ.',
        'Případné spory budou řešeny přednostně smírnou cestou; jinak věcně a místně příslušným soudem.',
        'Smlouva je vyhotovena ve dvou stejnopisech, z nichž každá smluvní strana obdrží jedno.',
        'Případné změny smlouvy jsou platné pouze ve formě písemných dodatků podepsaných oběma stranami.',
      ],
    },
  ];

  sections.push({
    title: `${d.notaryUpsell ? 'VIII' : 'VII'}. PODPISY`,
    body: [],
  });

  return sections;
}

// ─────────────────────────────────────────────
//  NÁJEMNÍ SMLOUVA
// ─────────────────────────────────────────────
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
          ? `určitou, a to do ${asText(d.endDate, '__________')}`
          : 'určitou do ____________';

  const monthlyTotal = (Number(d.rentAmount || 0) + Number(utilitiesAmount || 0)).toString();

  const premiumContent: ContractSection[] = d.notaryUpsell ? [
    {
      title: 'X. DORUČOVÁNÍ PÍSEMNOSTÍ',
      body: [
        `Písemnosti pronajímateli budou doručovány na adresu: ${asText(d.landlordAddress)}, případně na e-mail: ${asText(d.landlordEmail, '__________')}.`,
        `Písemnosti nájemci budou doručovány na adresu pronajatého bytu: ${propertyAddress}, případně na e-mail: ${asText(d.tenantEmail, '__________')}.`,
        'Písemnost se považuje za doručenou: (a) osobním předáním, (b) dnem doručení doporučenou zásilkou, nebo (c) 3. dnem po odeslání e-mailu, nevykazuje-li automatická zpráva o nedoručení.',
        'V případě, že adresát odmítne zásilku převzít nebo si ji nevyzvedne, má se za doručenou 10. dnem uložení u doručovatele.',
      ],
    },
    {
      title: 'XI. NOTÁŘSKÝ ZÁPIS SE SVOLENÍM K VYKONATELNOSTI',
      body: [
        'V rámci prémiového balíčku se pronajímateli doporučuje uzavřít s nájemcem notářský zápis se svolením k přímé vykonatelnosti (§ 71b notářského řádu) týkající se povinnosti nájemce vyklidit byt a uhradit dlužné nájemné po skončení nájmu.',
        'Notářský zápis výrazně zjednodušuje a urychluje vymáhání práv pronajímatele bez nutnosti podávat žalobu.',
        'Doporučujeme sjednat notářský zápis ve lhůtě 30 dnů od podpisu nájemní smlouvy.',
      ],
    },
  ] : [];

  const sections: ContractSection[] = [
    {
      title: 'ZÁHLAVÍ SMLOUVY',
      body: [
        'Tato nájemní smlouva (dále jen „smlouva") je uzavírána podle § 2201 a násl. zákona č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů (dále jen „OZ"), a v souladu s § 2235 a násl. OZ (nájem bytu).',
        `Datum uzavření smlouvy: ${today()}`,
      ],
    },
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Pronajímatel: ${asText(d.landlordName)}, nar./IČO: ${asText(d.landlordId, '__________')}, bytem/sídlo: ${asText(d.landlordAddress)}`,
        d.landlordOP ? `Číslo OP pronajímatele: ${asText(d.landlordOP)}` : '',
        d.landlordEmail ? `E-mail pronajímatele: ${asText(d.landlordEmail)}` : '',
        d.landlordPhone ? `Telefon pronajímatele: ${asText(d.landlordPhone)}` : '',
        `Nájemce: ${asText(d.tenantName)}, nar./IČO: ${asText(d.tenantId, '__________')}, bytem/sídlo: ${asText(d.tenantAddress)}`,
        d.tenantOP ? `Číslo OP nájemce: ${asText(d.tenantOP)}` : '',
        d.tenantEmail ? `E-mail nájemce: ${asText(d.tenantEmail)}` : '',
        d.tenantPhone ? `Telefon nájemce: ${asText(d.tenantPhone)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. PŘEDMĚT NÁJMU',
      body: [
        `Pronajímatel přenechává nájemci za úplatu do dočasného užívání byt/nebytový prostor nacházející se na adrese: ${propertyAddress}.`,
        `Dispozice: ${propertyLayout}.`,
        d.flatUnitNumber ? `Číslo bytové jednotky: ${asText(d.flatUnitNumber)}.` : '',
        d.cadastralArea ? `Katastrální území: ${asText(d.cadastralArea)}, číslo parcely: ${asText(d.parcelNumber, '__________')}.` : '',
        d.ownershipSheet ? `List vlastnictví č.: ${asText(d.ownershipSheet)}.` : '',
        d.floor ? `Podlaží: ${asText(d.floor)}.` : '',
        d.approxArea ? `Přibližná podlahová plocha: ${asText(d.approxArea)} m².` : '',
        'Nájemce potvrzuje, že se před podpisem smlouvy seznámil se stavem předmětu nájmu a přebírá jej v tomto stavu, podrobně popsaném v přiloženém předávacím protokolu.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. DOBA NÁJMU',
      body: [
        `Nájem se sjednává na dobu: ${leaseDuration}.`,
        d.startDate ? `Počátek nájmu: ${asText(d.startDate)}.` : '',
        d.handoverDate ? `Datum fyzického předání bytu: ${asText(d.handoverDate)}.` : '',
        d.duration === 'fixed'
          ? 'Po uplynutí sjednané doby nájmu nájem končí, nedohodnou-li se strany písemně jinak. Pokračuje-li nájemce v užívání bytu po dobu delší než tři měsíce po skončení nájmu bez námitek pronajímatele, platí, že byl nájem znovu ujednán na tutéž dobu (max. 2 roky) a za týchž podmínek (§ 2230 OZ).'
          : 'Nájem sjednaný na dobu neurčitou může pronajímatel vypovědět v tříměsíční výpovědní době, a to pouze z důvodů stanovených zákonem (§ 2288 OZ). Nájemce může nájem vypovědět s tříměsíční výpovědní dobou bez udání důvodu.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'IV. NÁJEMNÉ A ÚHRADY ZA PLNĚNÍ SPOJENÁ S UŽÍVÁNÍM BYTU',
      body: [
        `Měsíční nájemné činí ${formatAmount(d.rentAmount)} Kč.`,
        `Měsíční zálohy na plnění spojená s užíváním bytu (služby) činí ${formatAmount(utilitiesAmount)} Kč.`,
        `Celková měsíční platba (nájemné + zálohy) činí ${formatAmount(monthlyTotal)} Kč.`,
        `Nájemné a zálohy na služby jsou splatné vždy do ${paymentDay}. dne příslušného měsíce předem.`,
        d.bankAccount ? `Bankovní účet pronajímatele: ${asText(d.bankAccount)}.` : '',
        d.variableSymbol ? `Variabilní symbol: ${asText(d.variableSymbol)}.` : '',
        d.utilitiesIncludedText
          ? `Specifikace zahrnutých služeb a záloh: ${asText(d.utilitiesIncludedText)}.`
          : 'Zálohy na služby zahrnují: vodné/stočné, teplo/TUV, společné prostory, odpad — dle skutečných nákladů správce/pronajímatele.',
        'Pronajímatel je povinen jedenkrát ročně provést vyúčtování skutečných nákladů na plnění spojená s užíváním a doručit je nájemci do 4 měsíců od skončení zúčtovacího období (§ 7 zákona č. 67/2013 Sb.).',
        `Pronajímatel je oprávněn jednostranně zvýšit nájemné vždy nejdříve po 12 měsících od posledního zvýšení, nejvýše však o ${asText(d.maxRentIncrease, '10')} %, a to písemným oznámením doručeným nájemci nejpozději 3 měsíce před navrhovaným zvýšením.`,
      ].filter(Boolean) as string[],
    },
    {
      title: 'V. JISTOTA (KAUCE)',
      body: [
        `Nájemce je povinen před převzetím bytu (nejpozději při podpisu smlouvy) složit pronajímateli peněžitou jistotu ve výši ${formatAmount(d.depositAmount)} Kč (tj. ${asText(d.depositMonths, '__')} násobek měsíčního nájemného).`,
        'Jistota slouží k zajištění pohledávek pronajímatele vzniklých z nájmu (dlužné nájemné a zálohy, náhrada škody, náklady nezbytné opravy či uvedení bytu do původního stavu, smluvní pokuty).',
        'Pronajímatel je povinen vrátit nevyčerpanou část jistoty nejpozději do 1 měsíce od ukončení nájmu a předání bytu, po odečtení prokázaných pohledávek.',
        'Jistota je uložena na samostatném bankovním účtu pronajímatele a nepřináší nájemci úroky.',
      ],
    },
    {
      title: 'VI. PRAVIDLA UŽÍVÁNÍ BYTU',
      body: [
        d.maxOccupants ? `Maximální počet osob trvale užívajících byt: ${asText(d.maxOccupants)} (vč. nájemce). Přihlášení dalších osob je podmíněno písemným souhlasem pronajímatele.` : '',
        `Domácí zvířata: ${d.allowPets ? 'povolena, nájemce odpovídá za veškeré škody jimi způsobené' : 'zakázána bez předchozího písemného souhlasu pronajímatele'}.`,
        `Kouření v bytě a společných prostorách: ${d.allowSmoking ? 'povoleno' : 'zakázáno'}.`,
        `Krátkodobý podnájem (Airbnb, Booking.com apod.): ${d.allowAirbnb ? 'povolen, nájemce odpovídá za případné škody a zajistí splnění všech zákonných povinností' : 'zakázán bez předchozího písemného souhlasu pronajímatele'}.`,
        `Podnikání v bytě: ${d.businessUseAllowed ? 'povoleno' : 'zakázáno bez předchozího písemného souhlasu pronajímatele'}.`,
        d.inspectionAllowed
          ? 'Pronajímatel je oprávněn po předchozím písemném (e-mailovém) oznámení s předstihem min. 24 hodin zkontrolovat stav bytu; kontrola nesmí být prováděna nevhodným způsobem (§ 2219 OZ).'
          : 'Právo pronajímatele vstoupit do bytu se řídí zákonnou úpravou (§ 2219 OZ).',
        d.strictPenalties
          ? 'Za opakované porušení klidu, čistoty nebo pořádku v domě je pronajímatel oprávněn požadovat smluvní pokutu ve výši 1 000 Kč za každý prokázaný případ a po třetím porušení podat výpověď z nájmu bez výpovědní doby (§ 2291 OZ).'
          : '',
        'Nájemce je povinen: řádně udržovat byt a zařízení v provozuschopném stavu, bez zbytečného odkladu hlásit pronajímateli závady a havárie, umožnit nezbytné opravy, hradit drobné opravy a náklady spojené s běžnou údržbou (§ 2257 OZ), neprovádět stavební úpravy bez souhlasu pronajímatele.',
        'Nájemce není oprávněn přenechat byt nebo jeho část do podnájmu třetí osobě bez předchozího písemného souhlasu pronajímatele.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'VII. PŘEDÁNÍ BYTU A PŘEDÁVACÍ PROTOKOL',
      body: [
        d.keysCount ? `Pronajímatel předá nájemci celkem ${asText(d.keysCount)} sada/sad klíčů.` : '',
        d.electricityMeter ? `Stav elektroměru při předání: ${asText(d.electricityMeter)} kWh.` : '',
        d.gasMeter ? `Stav plynoměru při předání: ${asText(d.gasMeter)} m³.` : '',
        d.waterMeter ? `Stav vodoměru při předání: ${asText(d.waterMeter)} m³.` : '',
        d.equipmentList ? `Inventář předávaného vybavení a zařízení: ${asText(d.equipmentList)}.` : '',
        d.knownDefects
          ? `Pronajímatelem přiznané vady a závady: ${asText(d.knownDefects)}.`
          : 'Byt se předává bez výslovně oznámených vad nad rámec běžného opotřebení.',
        'Podrobný předávací protokol je přílohou č. 1 této smlouvy a tvoří její nedílnou součást.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'VIII. UKONČENÍ NÁJMU A PŘEDÁNÍ BYTU PO SKONČENÍ',
      body: [
        d.duration === 'indefinite'
          ? 'Nájem na dobu neurčitou lze ukončit výpovědí (§ 2231, § 2286 a násl. OZ), dohodou nebo jiným způsobem stanoveným zákonem.'
          : 'Nájem na dobu určitou končí uplynutím sjednané doby. Pronajímatel i nájemce mohou nájem vypovědět z důvodů stanovených zákonem.',
        'Při skončení nájmu je nájemce povinen: (a) vyklidit byt a odstranit veškeré své movité věci, (b) uvést byt do stavu, v jakém jej převzal, s přihlédnutím k obvyklému opotřebení, (c) odevzdat všechny klíče pronajímateli a (d) umožnit provedení protokolárního předání.',
        `V případě, že nájemce neodevzdá byt řádně a včas, je povinen hradit pronajímateli za každý den prodlení částku ve výši ${asText(d.lateVacatePenalty, 'jednodenního nájemného')}.`,
      ],
    },
    {
      title: 'IX. HAVÁRIE A OPRAVY',
      body: [
        'Nájemce je povinen neprodleně, nejpozději do 24 hodin, oznámit pronajímateli havárii nebo závadu, která by mohla způsobit škodu (únik vody, porucha topení, elektroinstalace apod.).',
        'Havárie je nájemce povinen zabezpečit v nezbytném rozsahu i bez předchozího souhlasu pronajímatele a neprodleně pronajímatele informovat.',
        'Drobné opravy a náklady spojené s běžnou údržbou nese nájemce v rozsahu stanoveném nařízením vlády č. 308/2015 Sb. (jednotlivá oprava do 1 000 Kč, celkově max. 100 Kč/m²/rok).',
        'Větší opravy a rekonstrukce jsou povinností pronajímatele, pokud není dohodnuto jinak.',
      ],
    },
    ...premiumContent,
    {
      title: `${d.notaryUpsell ? 'XII' : 'X'}. ZÁVĚREČNÁ USTANOVENÍ`,
      body: [
        'Tato smlouva se řídí právním řádem České republiky.',
        'Případné spory budou řešeny přednostně smírnou cestou; jinak věcně a místně příslušným soudem.',
        'Smlouva je vyhotovena ve dvou stejnopisech; každá smluvní strana obdrží jedno.',
        'Změny jsou platné pouze ve formě písemných číslovaných dodatků podepsaných oběma stranami.',
        'Přílohou č. 1 smlouvy je předávací protokol, který tvoří nedílnou součást smlouvy.',
      ],
    },
  ];

  sections.push({
    title: `${d.notaryUpsell ? 'XIII' : 'XI'}. PODPISY`,
    body: [],
  });

  // Předávací protokol jako příloha
  sections.push({
    title: `PŘÍLOHA Č. 1 – PŘEDÁVACÍ PROTOKOL K NÁJEMNÍ SMLOUVĚ`,
    body: [
      `Adresa bytu: ${propertyAddress}`,
      d.handoverDate ? `Datum předání: ${asText(d.handoverDate)}` : 'Datum předání: __________________',
      `Pronajímatel: ${asText(d.landlordName)}`,
      `Nájemce: ${asText(d.tenantName)}`,
      '',
      '1. STAV MĚŘIČŮ A ENERGIÍ:',
      `   Elektroměr (č. ________): ${asText(d.electricityMeter, '____________________')} kWh`,
      `   Plynoměr (č. ________): ${asText(d.gasMeter, '____________________')} m³`,
      `   Vodoměr studená voda (č. ________): ${asText(d.waterMeter, '____________________')} m³`,
      '   Vodoměr teplá voda (č. ________): ____________________ m³',
      '',
      `2. PŘEDANÉ KLÍČE: ${asText(d.keysCount, '____')} sada/sad (bytové: ___, domovní: ___, schránka: ___, sklep: ___)`,
      '',
      '3. PŘEDÁVANÉ VYBAVENÍ A INVENTÁŘ:',
      `   ${asText(d.equipmentList, 'Bez vybavení / dle přiloženého soupisu')}`,
      '',
      '4. ZJIŠTĚNÉ VADY, POŠKOZENÍ A POZNÁMKY:',
      `   ${asText(d.knownDefects, 'Bez zjevných vad a poškození nad rámec běžného opotřebení.')}`,
      '',
      '5. STAV BYTU (zakroužkujte):    VÝBORNÝ  /  DOBRÝ  /  PŘIJATELNÝ  /  VYŽADUJE OPRAVY',
      '',
      'Smluvní strany potvrzují, že byt byl předán/převzat v souladu s touto smlouvou a v rozsahu uvedeném v tomto protokolu.',
      '',
      'V ________________________ dne __________________',
      '',
      '_______________________________          _______________________________',
      'Pronajímatel (podpis + tisk. jméno)        Nájemce (podpis + tisk. jméno)',
    ],
  });

  return sections;
}

// ─────────────────────────────────────────────
//  SMLOUVA O ZÁPŮJČCE
// ─────────────────────────────────────────────
function buildLoanContractSections(d: StoredContractData): ContractSection[] {
  const interestDesc =
    d.interestRate && Number(d.interestRate) > 0
      ? `Zápůjčka je úročená. Úroková sazba činí ${asText(d.interestRate)} % p.a. Úroky jsou splatné ${d.interestPayment === 'monthly' ? 'měsíčně spolu s jistinou' : 'jednorázově spolu se splacením celé jistiny'}.`
      : 'Zápůjčka je bezúročná (§ 1793 OZ).';

  const repaymentDesc =
    d.repaymentType === 'installments'
      ? `Vydlužitel se zavazuje vrátit zápůjčku ve ${asText(d.installmentCount, '__________')} pravidelných měsíčních splátkách po ${formatAmount(d.installmentAmount)} Kč, splatných vždy ${asText(d.paymentDay, '15')}. dne každého měsíce, počínaje ${asText(d.firstPaymentDate, '__________')}.`
      : `Vydlužitel se zavazuje vrátit celou zápůjčku jednorázově nejpozději dne ${asText(d.repaymentDate, '__________')}.`;

  const premiumContent: ContractSection[] = d.notaryUpsell ? [
    {
      title: 'VI. ZAJIŠTĚNÍ POHLEDÁVKY',
      body: [
        d.securityType === 'guarantee'
          ? `Závazek vydlužitele je zajištěn osobním ručením třetí osoby: ${asText(d.guarantorName, '__________')}, nar. ${asText(d.guarantorId, '__________')}, bytem ${asText(d.guarantorAddress, '__________')}. Ručitel se zavazuje splnit závazek vydlužitele v případě, že tak vydlužitel neučiní.`
          : d.securityType === 'pledge'
          ? `Závazek vydlužitele je zajištěn zástavním právem k věci: ${asText(d.pledgeDescription, '__________')}. Zástavní smlouva je sepsána samostatně.`
          : d.securityType === 'bill'
          ? 'Závazek vydlužitele je zajištěn vlastní směnkou vystavenou vydlužitelem na věřitele, splatnou ke dni splatnosti zápůjčky.'
          : 'Zápůjčka je poskytnuta bez zvláštního zajištění.',
        'V případě nesplacení pohledávky je věřitel oprávněn uplatnit zajišťovací instrumenty v souladu s platnými právními předpisy.',
      ],
    },
    {
      title: 'VII. PŘEDČASNÉ SPLACENÍ A POSTOUPENÍ',
      body: [
        'Vydlužitel je oprávněn zápůjčku nebo její část splatit předčasně bez sankcí, pokud je zápůjčka bezúročná.',
        d.interestRate && Number(d.interestRate) > 0
          ? `Při předčasném splacení úročené zápůjčky je vydlužitel povinen zaplatit věřiteli poplatek ve výši ${asText(d.prepaymentFee, '1')} % z předčasně splacené jistiny.`
          : '',
        'Věřitel je oprávněn postoupit svou pohledávku třetí osobě; vydlužitel s tím souhlasí.',
      ].filter(Boolean) as string[],
    },
  ] : [];

  const sections: ContractSection[] = [
    {
      title: 'ZÁHLAVÍ SMLOUVY',
      body: [
        'Tato smlouva o zápůjčce (dále jen „smlouva") je uzavírána podle § 2390 a násl. zákona č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů (dále jen „OZ").',
        `Datum uzavření smlouvy: ${today()}`,
      ],
    },
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Věřitel (půjčující): ${asText(d.lenderName)}, nar./IČO: ${asText(d.lenderId, '__________')}, bytem/sídlo: ${asText(d.lenderAddress)}`,
        d.lenderEmail ? `E-mail věřitele: ${asText(d.lenderEmail)}` : '',
        `Dlužník (vydlužitel): ${asText(d.borrowerName)}, nar./IČO: ${asText(d.borrowerId, '__________')}, bytem/sídlo: ${asText(d.borrowerAddress)}`,
        d.borrowerEmail ? `E-mail dlužníka: ${asText(d.borrowerEmail)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. PŘEDMĚT ZÁPŮJČKY',
      body: [
        `Věřitel přenechává vydlužiteli do vlastnictví peněžní částku ve výši ${formatAmount(d.loanAmount)} Kč (slovy: ${asText(d.loanAmountWords, '__________')}).`,
        d.transferMethod === 'transfer'
          ? `Peněžní prostředky budou poukázány bankovním převodem na účet vydlužitele č. ${asText(d.borrowerBankAccount, '__________')}, a to do ${asText(d.disbursementDays, '5')} pracovních dnů od podpisu smlouvy.`
          : 'Peněžní prostředky budou předány vydlužiteli v hotovosti při podpisu smlouvy, o čemž bude sepsána stvrzenka.',
        `Účel použití zápůjčky: ${asText(d.loanPurpose, 'není omezen — vydlužitel může použít prostředky libovolně')}.`,
      ],
    },
    {
      title: 'III. ÚROKY',
      body: [interestDesc],
    },
    {
      title: 'IV. SPLÁCENÍ A SPLATNOST',
      body: [
        repaymentDesc,
        d.bankAccount ? `Platby budou zasílány na bankovní účet věřitele č. ${asText(d.bankAccount)}, VS: ${asText(d.variableSymbol, '__________')}.` : '',
        `Smluvní pokuta za prodlení se splátkou: ${asText(d.latePenaltyRate, '0,05')} % z dlužné částky za každý den prodlení, min. ${asText(d.minLatePenalty, '100')} Kč.`,
        'Věřitel je oprávněn prohlásit celou zápůjčku okamžitě za splatnou, pokud vydlužitel nezaplatí 2 po sobě jdoucí splátky nebo porušuje jinou podstatnou povinnost ze smlouvy (§ 2399 OZ).',
      ].filter(Boolean) as string[],
    },
    {
      title: 'V. PROHLÁŠENÍ SMLUVNÍCH STRAN',
      body: [
        'Vydlužitel prohlašuje, že finanční prostředky potřebuje a přijímá je dobrovolně.',
        'Věřitel prohlašuje, že prostředky přenechává dobrovolně a je oprávněn jimi disponovat.',
        'Smluvní strany prohlašují, že smlouvu uzavírají svobodně, vážně a bez tísně.',
      ],
    },
    ...premiumContent,
    {
      title: `${d.notaryUpsell ? 'VIII' : 'VI'}. ZÁVĚREČNÁ USTANOVENÍ`,
      body: [
        'Smlouva se řídí právním řádem České republiky.',
        'Případné spory budou řešeny věcně a místně příslušným soudem.',
        'Smlouva je vyhotovena ve dvou stejnopisech; každá strana obdrží jedno.',
        'Změny jsou platné pouze ve formě písemných dodatků.',
      ],
    },
  ];

  sections.push({
    title: `${d.notaryUpsell ? 'IX' : 'VII'}. PODPISY`,
    body: [],
  });

  return sections;
}

// ─────────────────────────────────────────────
//  SMLOUVA O MLČENLIVOSTI (NDA)
// ─────────────────────────────────────────────
function buildNdaContractSections(d: StoredContractData): ContractSection[] {
  const ndaType =
    d.ndaType === 'bilateral'
      ? 'oboustranná (obě strany si vzájemně poskytují důvěrné informace)'
      : 'jednostranná (pouze Poskytující strana zpřístupňuje Přijímající straně důvěrné informace)';

  const penaltyText = d.penaltyAmount
    ? `Za každé jednotlivé prokázané porušení mlčenlivosti je Přijímající strana povinna zaplatit Poskytující straně smluvní pokutu ve výši ${formatAmount(d.penaltyAmount)} Kč. Zaplacení pokuty nezbavuje Přijímající stranu povinnosti nahradit škodu v plném rozsahu.`
    : 'Porušení povinnosti mlčenlivosti zakládá nárok na náhradu veškeré způsobené škody dle OZ.';

  const premiumContent: ContractSection[] = d.notaryUpsell ? [
    {
      title: 'VII. AUDIT A KONTROLA NAKLÁDÁNÍ S INFORMACEMI',
      body: [
        'Poskytující strana má právo kdykoli v průběhu platnosti smlouvy provést audit způsobu uložení a zpracování důvěrných informací u Přijímající strany, a to po předchozím písemném oznámení s předstihem minimálně 5 pracovních dnů.',
        'Přijímající strana je povinna vést evidenci osob, které mají přístup k důvěrným informacím, a tuto evidenci na žádost předložit.',
        'Na žádost Poskytující strany je Přijímající strana povinna přijmout technická nebo organizační opatření ke zvýšení bezpečnosti důvěrných informací.',
      ],
    },
    {
      title: 'VIII. ZVLÁŠTNÍ KATEGORIE CHRÁNĚNÝCH INFORMACÍ',
      body: [
        `Mezi zvláště chráněné informace patří zejména: ${asText(d.specialInfoCategories, 'obchodní tajemství, know-how, zdrojové kódy, databáze zákazníků, obchodní plány, finanční výsledky, technické výkresy a specifikace')}`,
        'Přijímající strana je povinna tuto kategorii informací chránit s nejvyšší péčí, minimálně se stejnou úrovní zabezpečení, jakou používá pro ochranu vlastních nejcitlivějších informací.',
      ],
    },
  ] : [];

  const sections: ContractSection[] = [
    {
      title: 'ZÁHLAVÍ SMLOUVY',
      body: [
        'Tato smlouva o mlčenlivosti a ochraně důvěrných informací (dále jen „NDA" nebo „smlouva") je uzavírána podle § 1724 a násl. zákona č. 89/2012 Sb., občanský zákoník, a § 504 OZ (obchodní tajemství).',
        `Typ NDA: ${ndaType}.`,
        `Datum uzavření smlouvy: ${today()}`,
      ],
    },
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Poskytující strana: ${asText(d.disclosingName)}, IČO/nar.: ${asText(d.disclosingId, '__________')}, adresa: ${asText(d.disclosingAddress)}`,
        d.disclosingEmail ? `E-mail: ${asText(d.disclosingEmail)}` : '',
        `Přijímající strana: ${asText(d.receivingName)}, IČO/nar.: ${asText(d.receivingId, '__________')}, adresa: ${asText(d.receivingAddress)}`,
        d.receivingEmail ? `E-mail: ${asText(d.receivingEmail)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. DEFINICE DŮVĚRNÝCH INFORMACÍ',
      body: [
        `„Důvěrnými informacemi" se pro účely této smlouvy rozumí veškeré informace, data, dokumenty a materiály označené jako důvěrné nebo jejichž povaha jejich důvěrnost zjevně zakládá, zejména: ${asText(d.confidentialInfoDesc, 'obchodní plány, finanční informace, databáze, know-how, technické specifikace, zdrojové kódy, zákaznické seznamy, výsledky výzkumu a vývoje, marketingové strategie')}.`,
        `Účel zpřístupnění informací: ${asText(d.purposeOfDisclosure, '__________')}`,
        'Za důvěrné se nepovažují informace, které: (a) jsou nebo se stanou veřejně dostupnými bez zavinění Přijímající strany; (b) Přijímající strana prokazatelně znala před jejich zpřístupněním; (c) Přijímající strana obdržela od třetí strany, která nebyla vázána povinností mlčenlivosti; (d) musí být zveřejněny na základě závazného právního předpisu nebo rozhodnutí soudu.',
      ],
    },
    {
      title: 'III. POVINNOSTI PŘIJÍMAJÍCÍ STRANY',
      body: [
        'Přijímající strana se zavazuje:',
        'a) zachovat přísnou mlčenlivost o všech důvěrných informacích a neprozradit je žádné třetí osobě bez předchozího písemného souhlasu Poskytující strany;',
        'b) použít důvěrné informace výhradně pro účel stanovený touto smlouvou;',
        'c) omezit přístup k důvěrným informacím jen na ty zaměstnance a spolupracovníky, kteří je nezbytně potřebují pro plnění stanoveného účelu, a zajistit, aby byli vázáni stejnou povinností mlčenlivosti;',
        'd) chránit důvěrné informace přinejmenším se stejnou mírou péče, s jakou chrání vlastní citlivé informace, minimálně však s péčí řádného hospodáře;',
        'e) nepořizovat kopie ani výpisy z důvěrných informací nad rozsah nezbytně nutný pro stanovený účel.',
      ],
    },
    {
      title: 'IV. DOBA TRVÁNÍ A PLATNOST MLČENLIVOSTI',
      body: [
        `Tato smlouva nabývá účinnosti dnem podpisu a je sjednána na dobu ${asText(d.ndaDuration, '3 let')}.`,
        `Povinnost mlčenlivosti trvá ${asText(d.confidentialityAfterTermination, '5 let')} po skončení platnosti smlouvy nebo po ukončení spolupráce stran.`,
        'Po uplynutí doby mlčenlivosti nebo na písemnou výzvu Poskytující strany je Přijímající strana povinna bez zbytečného odkladu vrátit nebo nevratně zničit veškeré důvěrné informace a jejich kopie a písemně toto potvrdit.',
      ],
    },
    {
      title: 'V. SANKCE ZA PORUŠENÍ SMLOUVY',
      body: [penaltyText],
    },
    {
      title: 'VI. ZVLÁŠTNÍ UJEDNÁNÍ',
      body: [
        d.nonSolicitation
          ? `Po dobu platnosti smlouvy a ${asText(d.nonSolicitationPeriod, '12 měsíců')} po jejím skončení se Přijímající strana zavazuje nepřetahovat zaměstnance, klíčové obchodní partnery ani zákazníky Poskytující strany.`
          : '',
        d.nonCompete
          ? `Po dobu platnosti smlouvy a ${asText(d.nonCompetePeriod, '24 měsíců')} po jejím skončení se Přijímající strana zavazuje nevyvíjet přímou konkurenční činnost vůči Poskytující straně v oblasti: ${asText(d.nonCompeteScope, '__________')}.`
          : '',
        'Smlouva neomezuje Poskytující stranu v uzavírání podobných smluv s dalšími subjekty.',
      ].filter(Boolean) as string[],
    },
    ...premiumContent,
    {
      title: `${d.notaryUpsell ? 'IX' : 'VII'}. ZÁVĚREČNÁ USTANOVENÍ`,
      body: [
        'Smlouva se řídí právním řádem České republiky.',
        'Spory budou řešeny věcně a místně příslušným soudem.',
        'Smlouva je vyhotovena ve dvou stejnopisech; každá strana obdrží jedno.',
        'Změny jsou platné pouze ve formě písemných, číslovaných dodatků.',
        'Je-li jakékoli ustanovení smlouvy neplatné, ostatní ustanovení zůstávají v platnosti.',
      ],
    },
  ];

  sections.push({
    title: `${d.notaryUpsell ? 'X' : 'VIII'}. PODPISY`,
    body: [],
  });

  return sections;
}

// ─────────────────────────────────────────────
//  DISPATCHER
// ─────────────────────────────────────────────
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
    case 'loan':
      return buildLoanContractSections(data);
    case 'nda':
      return buildNdaContractSections(data);
  }
}
