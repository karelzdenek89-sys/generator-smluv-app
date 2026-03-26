export type ContractType =
  | 'lease'
  | 'car_sale'
  | 'gift'
  | 'work_contract'
  | 'loan'
  | 'nda'
  | 'general_sale'
  | 'employment'
  | 'dpp'
  | 'service'
  | 'sublease'
  | 'power_of_attorney'
  | 'debt_acknowledgment'
  | 'cooperation';

export type Tier = 'basic' | 'professional' | 'complete';

export type StoredContractData = {
  contractType: ContractType;
  notaryUpsell?: boolean;
  tier?: Tier;
  [key: string]: unknown;
};

export type ContractSection = {
  title: string;
  body: string[];
};

// ═══════════════════════════════════════════════════════════════════════
// TIER FEATURE MAP — jediný autoritativní zdroj pro obsah balíčků
// ═══════════════════════════════════════════════════════════════════════
//
//  basic        (249 Kč)  → základní smlouva dle OZ
//  professional (399 Kč)  → + rozšířené klauzule, smluvní pokuty, zajišťovací ujednání
//  complete     (749 Kč)  → vše výše + instrukce, checklist, 30denní archivace
//
// PRAVIDLO: Obsah smlouvy (premium sekce) se řídí VÝHRADNĚ touto funkcí.
// Nikdy nespoléhej jen na `d.notaryUpsell` — tier je primární zdroj pravdy.
// notaryUpsell je zachován pro zpětnou kompatibilitu a jako fallback.
// ═══════════════════════════════════════════════════════════════════════

export type TierFeatures = {
  /** Zákazník zaplatil za Professional nebo Complete → dostane premium sekce */
  hasPremiumClauses: boolean;
  /** Zákazník zaplatil za Complete → dostane instrukce + checklist stránky v PDF */
  hasCompletePages: boolean;
  /** Archivace dokumentu v Redisu */
  archiveDays: 7 | 30;
};

export function resolveTierFeatures(d: StoredContractData): TierFeatures {
  const tier = String(d.tier ?? 'basic').toLowerCase() as Tier;
  // notaryUpsell je fallback pro starší drafty uložené před zavedením tierů
  const legacyPremium = Boolean(d.notaryUpsell); // záměrně d.notaryUpsell — ne hasPremiumClauses
  const hasPremiumClauses = legacyPremium || tier === 'professional' || tier === 'complete';
  const hasCompletePages = tier === 'complete';
  const archiveDays = tier === 'complete' ? 30 : 7;
  return { hasPremiumClauses, hasCompletePages, archiveDays };
}

const emptyLine = '____________________';

const formatAmount = (amount?: unknown) => {
  if (amount === null || amount === undefined || amount === '') return '__________';
  const num = Number(amount);
  if (Number.isNaN(num)) return String(amount);
  return num.toLocaleString('cs-CZ');
};

const asText = (value: unknown, fallback = emptyLine, maxLength = 1000) => {
  if (value === null || value === undefined) return fallback;
  const str = String(value).trim();
  if (str === '') return fallback;
  // Ochrana proti přetečení textu v PDF — max 1000 znaků na pole
  return str.length > maxLength ? str.substring(0, maxLength) + '…' : str;
};

const yesNo = (value: unknown, yes = 'ano', no = 'ne') => (value ? yes : no);

/** Converts ISO date string (YYYY-MM-DD) from HTML date inputs to Czech format (D. M. YYYY). */
const formatDate = (value: unknown, fallback = emptyLine): string => {
  if (value === null || value === undefined) return fallback;
  const str = String(value).trim();
  if (!str) return fallback;
  const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${parseInt(day, 10)}. ${parseInt(month, 10)}. ${year}`;
  }
  return str;
};

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
    case 'general_sale':
      return { title: 'Kupní smlouva', fileName: 'Kupni_smlouva_2026.pdf' };
    case 'employment':
      return { title: 'Pracovní smlouva', fileName: 'Pracovni_smlouva_2026.pdf' };
    case 'dpp':
      return { title: 'Dohoda o provedení práce', fileName: 'DPP_2026.pdf' };
    case 'service':
      return { title: 'Smlouva o poskytování služeb', fileName: 'Smlouva_o_sluzbach_2026.pdf' };
    case 'sublease':
      return { title: 'Podnájemní smlouva', fileName: 'Podnajem_smlouva_2026.pdf' };
    case 'power_of_attorney':
      return { title: 'Plná moc', fileName: 'Plna_moc_2026.pdf' };
    case 'debt_acknowledgment':
      return { title: 'Uznání dluhu', fileName: 'Uznani_dluhu_2026.pdf' };
    case 'cooperation':
      return { title: 'Smlouva o spolupráci', fileName: 'Smlouva_o_spolupraci_2026.pdf' };
  }
}

// ─────────────────────────────────────────────
//  DAROVACÍ SMLOUVA
// ─────────────────────────────────────────────
function buildGiftContractSections(d: StoredContractData): ContractSection[] {
  const { hasPremiumClauses } = resolveTierFeatures(d);
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

  const premiumContent: ContractSection[] = hasPremiumClauses ? [
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
        `Datum uzavření smlouvy: ${d.giftDate ? formatDate(d.giftDate) : today()}`,
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
      title: `${hasPremiumClauses ? 'VI' : 'IV'}. ZÁVĚREČNÁ USTANOVENÍ`,
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
    title: `${hasPremiumClauses ? 'VII' : 'V'}. PODPISY`,
    body: [],
  });

  return sections;
}

// ─────────────────────────────────────────────
//  SMLOUVA O DÍLO
// ─────────────────────────────────────────────
function buildWorkContractSections(d: StoredContractData): ContractSection[] {
  const { hasPremiumClauses } = resolveTierFeatures(d);
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

  const premiumContent: ContractSection[] = hasPremiumClauses ? [
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
        `Zahájení prací: ${formatDate(d.startDate, '__________')}`,
        `Dokončení a předání díla nejpozději dne: ${formatDate(d.endDate, '__________')}`,
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
        // BUG FIX: premiumContent jsou ContractSection objekty, nikoli stringy —
        // nesmí být uvnitř body[]. Patří pouze jako ...premiumContent níže.
      ].filter(Boolean) as string[],
    },
    ...premiumContent,
    {
      title: `${hasPremiumClauses ? 'X' : 'VIII'}. ZÁVĚREČNÁ USTANOVENÍ`,
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
    title: `${hasPremiumClauses ? 'XI' : 'IX'}. PODPISY`,
    body: [],
  });

  return sections;
}

// ─────────────────────────────────────────────
//  KUPNÍ SMLOUVA NA VOZIDLO
// ─────────────────────────────────────────────
function buildCarContractSections(d: StoredContractData): ContractSection[] {
  const { hasPremiumClauses } = resolveTierFeatures(d);
  const paymentText =
    d.paymentMethod === 'cash'
      ? `V hotovosti při podpisu smlouvy, nejpozději však při fyzickém předání vozidla.`
      : `Bankovním převodem na účet prodávajícího č. ${asText(d.bankAccount, '__________')}, VS: ${asText(d.variableSymbol, '__________')}, do ${asText(d.paymentDueDays, '3')} pracovních dnů od podpisu smlouvy.`;

  const ownershipTransfer =
    d.ownershipTransferMoment === 'payment'
      ? 'Vlastnické právo přechází na kupujícího okamžikem úplné úhrady kupní ceny.'
      : 'Vlastnické právo přechází na kupujícího okamžikem fyzického předání vozidla.';

  const premiumContent: ContractSection[] = hasPremiumClauses ? [
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
    {
      title: 'VII. SMLUVNÍ POKUTY A ODPOVĚDNOST ZA ZATAJENÉ VADY',
      body: [
        'Prodávající odpovídá kupujícímu za vady, které existovaly v době přechodu nebezpečí škody na kupujícího, i když se vada projeví až poté (§ 2161 a násl. OZ).',
        `Zatají-li prodávající vědomě vadu, na niž neupozornil, je povinen zaplatit kupujícímu smluvní pokutu ve výši ${formatAmount(d.hiddenDefectPenalty || 30000)} Kč. Zaplacením pokuty není dotčen nárok na náhradu škody ani právo z vad.`,
        `Smluvní pokuta za prodlení kupujícího s úhradou kupní ceny: ${asText(d.buyerLatePenalty, '0,05')} % z dlužné částky za každý den prodlení.`,
        `Smluvní pokuta za prodlení prodávajícího s předáním vozidla po sjednané lhůtě: ${formatAmount(d.sellerLatePenalty || 500)} Kč za každý den prodlení.`,
        'Prodávající prohlašuje, že vozidlo není předmětem exekuce, zástavního práva, ani jiného omezení dispozice, o němž by nevěděl. Za pravdivost tohoto prohlášení nese plnou odpovědnost.',
      ],
    },
    {
      title: 'VIII. PŘEPIS VOZIDLA, POJISTNÉ UDÁLOSTI A PROHLÁŠENÍ O BEZDLUHOVOSTI',
      body: [
        'Smluvní strany jsou povinny společně, nejpozději do 10 pracovních dnů od podpisu smlouvy, dostavit se na příslušný obecní úřad obce s rozšířenou působností a provést přepis vlastnictví vozidla v registru silničních vozidel (§ 8 odst. 2 zákona č. 56/2001 Sb.).',
        'Kupující je povinen od okamžiku přechodu vlastnictví sjednat na vozidlo nové povinné ručení (POV). Prodávající zajistí ukončení stávajícího POV ke dni přechodu vlastnictví.',
        'Prodávající prohlašuje, že na vozidle nevázne žádný dosud nevypořádaný závazek vůči leasingové společnosti, bance ani jiné třetí osobě vyplývající z dřívějšího financování vozidla.',
        'Prodávající dále prohlašuje, že vozidlo nebylo ke dni podpisu smlouvy přihlášeno k účasti v pojistné události, jejíž likvidace by dosud nebyla ukončena.',
        `V případě nepravdivosti výše uvedených prohlášení je prodávající povinen uhradit kupujícímu veškerou vzniklou škodu a smluvní pokutu ve výši ${formatAmount(d.declarationPenalty || 50000)} Kč.`,
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
        d.handoverDate ? `Sjednané datum fyzického předání vozidla: ${formatDate(d.handoverDate)}.` : '',
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
      title: `${hasPremiumClauses ? 'IX' : 'VI'}. ZÁVĚREČNÁ USTANOVENÍ`,
      body: [
        'Tato smlouva se řídí právním řádem České republiky, zejména zákonem č. 89/2012 Sb., OZ.',
        'Případné spory budou řešeny přednostně smírnou cestou; jinak věcně a místně příslušným soudem.',
        'Smlouva je vyhotovena ve dvou stejnopisech, z nichž každá smluvní strana obdrží jedno.',
        'Případné změny smlouvy jsou platné pouze ve formě písemných dodatků podepsaných oběma stranami.',
      ],
    },
  ];

  sections.push({
    title: `${hasPremiumClauses ? 'X' : 'VII'}. PODPISY`,
    body: [],
  });

  return sections;
}

// ─────────────────────────────────────────────
//  NÁJEMNÍ SMLOUVA
// ─────────────────────────────────────────────
function buildLeaseContractSections(d: StoredContractData): ContractSection[] {
  const { hasPremiumClauses } = resolveTierFeatures(d);
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
          ? `určitou, a to do ${formatDate(d.endDate, '__________')}`
          : 'určitou do ____________';

  const monthlyTotal = (Number(d.rentAmount || 0) + Number(utilitiesAmount || 0)).toString();

  const premiumContent: ContractSection[] = hasPremiumClauses ? [
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
      title: 'XI. SMLUVNÍ POKUTY A SANKCE',
      body: [
        'Smluvní strany sjednávají následující smluvní pokuty (§ 2048 a násl. OZ):',
        `a) Prodlení s platbou nájemného nebo záloh na služby: úrok z prodlení ve výši 0,1 % z dlužné částky za každý den prodlení, a to ode dne splatnosti do dne úhrady.`,
        `b) Neoprávněný podnájem nebo přenechání bytu třetí osobě bez souhlasu pronajímatele: jednorázová smluvní pokuta ve výši 25 000 Kč splatná do 7 dnů od výzvy pronajímatele.`,
        `c) Neoprávněné stavební úpravy nebo zásahy do bytu bez písemného souhlasu pronajímatele: smluvní pokuta ve výši 50 000 Kč a povinnost uvést byt do původního stavu na náklady nájemce.`,
        `d) Prodlení s vyklizením bytu po skončení nájmu: smluvní pokuta ve výši dvojnásobku denního nájemného za každý den prodlení, a to nad rámec náhrady škody.`,
        `e) Porušení zákazu kouření nebo chovu zvířat (bylo-li sjednáno): smluvní pokuta 5 000 Kč za každý prokázaný případ.`,
        'Zaplacením smluvní pokuty nezaniká povinnost uhradit dlužné plnění ani právo na náhradu škody přesahující smluvní pokutu (§ 2050 OZ).',
      ],
    },
    {
      title: 'XII. EXEKUČNÍ OCHRANA PRONAJÍMATELE',
      body: [
        'Nájemce výslovně souhlasí s tím, aby pohledávky pronajímatele vzniklé z tohoto nájemního vztahu — zejména dlužné nájemné, zálohy na služby, smluvní pokuty a náhrada škody — byly zajištěny notářským zápisem se svolením k přímé vykonatelnosti podle § 71b zákona č. 358/1992 Sb., notářský řád.',
        'Nájemce se zavazuje uzavřít takový notářský zápis nejpozději do 30 dnů od podpisu této smlouvy, a to na výzvu pronajímatele. Odmítnutí uzavřít notářský zápis se považuje za podstatné porušení smlouvy opravňující pronajímatele k výpovědi bez výpovědní doby dle § 2291 OZ.',
        'Pro případ prodlení nájemce s úhradou nájemného nebo zálohy na služby po dobu delší než 30 dnů se nájemce zavazuje, že pronajímatel je oprávněn přistoupit k zajištění pohledávky ze složené jistoty (kauce) bez předchozí soudní výzvy, a nájemce je povinen jistotu do 15 dnů doplnit na původní výši.',
        `Pro případ, že nájemce nevyklidí byt po skončení nájmu ve lhůtě stanovené zákonem nebo dohodou, výslovně souhlasí s tím, že pronajímatel je oprávněn obrátit se s návrhem na nařízení exekuce přímo na soudního exekutora na základě notářského zápisu se svolením k vykonatelnosti, a to bez nutnosti předchozího soudního řízení (§ 40 odst. 1 písm. d) exekučního řádu, zákon č. 120/2001 Sb.).`,
        'Nájemce prohlašuje, že si je vědom důsledků tohoto ustanovení, byl poučen o svých právech a podepisuje tuto smlouvu svobodně, vážně a bez nátlaku.',
      ],
    },
    {
      title: 'XIII. ZAJIŠŤOVACÍ MECHANISMY A ODPOVĚDNOST ZA ŠKODU',
      body: [
        'Nájemce odpovídá pronajímateli za veškerou škodu způsobenou na předmětu nájmu, na zařízení bytu, na společných částech domu i na majetku třetích osob, a to bez ohledu na zavinění (objektivní odpovědnost za škodu způsobenou užíváním bytu).',
        'Nad rámec zákonné odpovědnosti se nájemce zavazuje, že na vlastní náklady sjedná a po celou dobu trvání nájmu udržuje pojištění domácnosti zahrnující: (a) odpovědnost za škodu způsobenou třetím osobám při užívání bytu, a to s pojistným limitem min. 500 000 Kč, (b) pojištění věcí v bytě. Doklad o pojištění předloží nájemce na výzvu pronajímatele do 7 dnů.',
        'Smluvní strany se dohodly, že při ukončení nájmu pronajímatel provede soupis škod přesahujících obvyklé opotřebení a předloží nájemci písemný přehled s vyčíslenou náhradou. Nájemce je povinen tuto náhradu uhradit do 14 dnů od doručení přehledu, jinak je pronajímatel oprávněn provést zápočet vůči složené jistotě.',
        `Pronajímatel si vyhrazuje právo nechat provést na náklady nájemce odborné znalecké ocenění škod přesahujících 10 000 Kč. Náklady na znalecký posudek nese nájemce, pokud výsledná škoda přesáhne 70 % znalcem odhadnuté částky.`,
      ],
    },
    {
      title: 'XIV. NOTÁŘSKÝ ZÁPIS SE SVOLENÍM K VYKONATELNOSTI — POSTUP',
      body: [
        'Smluvní strany se výslovně dohodly, že bezprostředně po podpisu této smlouvy (nejpozději do 30 dnů) společně navštíví notáře za účelem sepsání notářského zápisu se svolením nájemce k přímé vykonatelnosti (§ 71b notářského řádu).',
        'Notářský zápis bude obsahovat zejména: (a) identifikaci smluvních stran a předmětu nájmu, (b) výši nájemného a zálohy, (c) závazek nájemce vyklidit byt ke dni skončení nájmu, (d) souhlas nájemce s přímou vykonatelností pro případ nesplnění výše uvedených povinností.',
        'Náklady notářského zápisu se svolením k vykonatelnosti nese pronajímatel.',
        'Odmítne-li nájemce notářský zápis podepsat, je pronajímatel oprávněn od této smlouvy odstoupit nebo podat výpověď z nájmu dle § 2291 OZ bez výpovědní doby, a to písemným oznámením doručeným nájemci.',
        'Notářský zápis se svolením k vykonatelnosti je nejsilnějším nástrojem ochrany pronajímatele v ČR — umožňuje vymáhat pohledávky a zajistit vyklizení bytu bez zdlouhavého soudního řízení (průměrně 3–6 měsíců oproti standardním 1–3 letům).',
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
        d.startDate ? `Počátek nájmu: ${formatDate(d.startDate)}.` : '',
        d.handoverDate ? `Datum fyzického předání bytu: ${formatDate(d.handoverDate)}.` : '',
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
        `Nájemce je povinen před převzetím bytu (nejpozději při podpisu smlouvy) složit pronajímateli peněžitou jistotu ve výši ${formatAmount(d.depositAmount)} Kč (tj. ${(d.depositAmount && d.rentAmount && Number(d.rentAmount) > 0) ? Math.round(Number(d.depositAmount) / Number(d.rentAmount)) : '__'} násobek měsíčního nájemného).`,
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
      title: `${hasPremiumClauses ? 'XV' : 'X'}. ZÁVĚREČNÁ USTANOVENÍ`,
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
    title: `${hasPremiumClauses ? 'XVI' : 'XI'}. PODPISY`,
    body: [],
  });

  // Předávací protokol jako příloha
  sections.push({
    title: `PŘÍLOHA Č. 1 – PŘEDÁVACÍ PROTOKOL K NÁJEMNÍ SMLOUVĚ`,
    body: [
      `Adresa bytu: ${propertyAddress}`,
      d.handoverDate ? `Datum předání: ${formatDate(d.handoverDate)}` : 'Datum předání: __________________',
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
  const { hasPremiumClauses } = resolveTierFeatures(d);
  const interestDesc =
    d.interestRate && Number(d.interestRate) > 0
      ? `Zápůjčka je úročená. Úroková sazba činí ${asText(d.interestRate)} % p.a. Úroky jsou splatné ${d.interestPayment === 'monthly' ? 'měsíčně spolu s jistinou' : 'jednorázově spolu se splacením celé jistiny'}.`
      : 'Zápůjčka je bezúročná (§ 1793 OZ).';

  const repaymentDesc =
    d.repaymentType === 'installments'
      ? `Vydlužitel se zavazuje vrátit zápůjčku ve ${asText(d.installmentCount, '__________')} pravidelných měsíčních splátkách po ${formatAmount(d.installmentAmount)} Kč, splatných vždy ${asText(d.paymentDay, '15')}. dne každého měsíce, počínaje ${formatDate(d.firstPaymentDate, '__________')}.`
      : `Vydlužitel se zavazuje vrátit celou zápůjčku jednorázově nejpozději dne ${formatDate(d.repaymentDate, '__________')}.`;

  const premiumContent: ContractSection[] = hasPremiumClauses ? [
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
      title: `${hasPremiumClauses ? 'VIII' : 'VI'}. ZÁVĚREČNÁ USTANOVENÍ`,
      body: [
        'Smlouva se řídí právním řádem České republiky.',
        'Případné spory budou řešeny věcně a místně příslušným soudem.',
        'Smlouva je vyhotovena ve dvou stejnopisech; každá strana obdrží jedno.',
        'Změny jsou platné pouze ve formě písemných dodatků.',
      ],
    },
  ];

  sections.push({
    title: `${hasPremiumClauses ? 'IX' : 'VII'}. PODPISY`,
    body: [],
  });

  return sections;
}

// ─────────────────────────────────────────────
//  SMLOUVA O MLČENLIVOSTI (NDA)
// ─────────────────────────────────────────────
function buildNdaContractSections(d: StoredContractData): ContractSection[] {
  const { hasPremiumClauses } = resolveTierFeatures(d);
  const ndaType =
    d.ndaType === 'bilateral'
      ? 'oboustranná (obě strany si vzájemně poskytují důvěrné informace)'
      : 'jednostranná (pouze Poskytující strana zpřístupňuje Přijímající straně důvěrné informace)';

  const penaltyText = d.penaltyAmount
    ? `Za každé jednotlivé prokázané porušení mlčenlivosti je Přijímající strana povinna zaplatit Poskytující straně smluvní pokutu ve výši ${formatAmount(d.penaltyAmount)} Kč. Zaplacení pokuty nezbavuje Přijímající stranu povinnosti nahradit škodu v plném rozsahu.`
    : 'Porušení povinnosti mlčenlivosti zakládá nárok na náhradu veškeré způsobené škody dle OZ.';

  const premiumContent: ContractSection[] = hasPremiumClauses ? [
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
      title: `${hasPremiumClauses ? 'IX' : 'VII'}. ZÁVĚREČNÁ USTANOVENÍ`,
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
    title: `${hasPremiumClauses ? 'X' : 'VIII'}. PODPISY`,
    body: [],
  });

  return sections;
}

// ─────────────────────────────────────────────
//  KUPNÍ SMLOUVA (OBECNÁ)
// ─────────────────────────────────────────────
function buildGeneralSaleContractSections(d: StoredContractData): ContractSection[] {
  const { hasPremiumClauses } = resolveTierFeatures(d);
  const subjectDesc =
    d.itemType === 'car'
      ? `motorové vozidlo tovární značky ${asText(d.carMake)} ${asText(d.carModel)}, VIN: ${asText(d.carVIN, '__________')}, SPZ: ${asText(d.carPlate, '__________')}, rok výroby: ${asText(d.carYear, '____')}, stav tachometru: ${asText(d.carMileage, '__________')} km`
      : d.itemType === 'electronics'
      ? `elektronické zařízení: ${asText(d.itemDescription)}, výrobní číslo / sériové číslo: ${asText(d.serialNumber, '__________')}`
      : `${asText(d.itemDescription, 'movitá věc specifikovaná dle dohody smluvních stran')}`;

  const defectsClause = d.knownDefects
    ? `Prodávající upozornil kupujícího na tyto jemu známé vady předmětu prodeje: ${asText(d.knownDefects)}. Kupující tyto vady bere na vědomí a kupní cena je s ohledem na ně sjednána.`
    : 'Prodávající prohlašuje, že mu nejsou známy žádné skryté vady předmětu prodeje nad rámec běžného opotřebení.';

  const paymentDesc =
    d.paymentMethod === 'transfer'
      ? `Kupní cena bude uhrazena bankovním převodem na účet prodávajícího č. ${asText(d.sellerBankAccount, '__________')}, VS: ${asText(d.variableSymbol, '__________')}, a to do ${asText(d.paymentDays, '5')} pracovních dnů od podpisu smlouvy.`
      : d.paymentMethod === 'escrow'
      ? `Kupní cena bude uhrazena prostřednictvím advokátní/notářské úschovy. Podmínky úschovy jsou sjednány samostatně.`
      : `Kupní cena bude uhrazena v hotovosti při podpisu smlouvy / předání předmětu prodeje.`;

  const warrantyClause = d.warrantyMonths && Number(d.warrantyMonths) > 0
    ? `Prodávající poskytuje kupujícímu záruku za jakost v délce ${asText(d.warrantyMonths)} měsíců ode dne předání. V záruční době odpovídá prodávající za to, že předmět prodeje bude mít vlastnosti dle smlouvy.`
    : 'Na předmět prodeje se vztahuje zákonná odpovědnost za vady dle § 2161 a násl. OZ. Právo z vadného plnění musí být uplatněno bez zbytečného odkladu po zjištění vady.';

  const premiumContent: ContractSection[] = hasPremiumClauses ? [
    {
      title: 'VI. ROZŠÍŘENÁ ODPOVĚDNOST ZA VADY A ZÁRUKA',
      body: [
        `Kupující je oprávněn uplatnit práva z vadného plnění do ${asText(d.warrantyMonths, '24')} měsíců od převzetí věci.`,
        'Prodávající odpovídá za to, že předmět prodeje ke dni předání: (a) nemá vlastnosti, které by jej činily neupotřebitelným nebo snižovaly jeho hodnotu pod sjednanou cenu, (b) odpovídá ujednání smlouvy, (c) není zatížen právy třetích osob, pokud není výslovně dohodnuto jinak.',
        'Kupující má právo na přiměřenou slevu z kupní ceny, bezplatnou opravu nebo výměnu, anebo na odstoupení od smlouvy, je-li vada podstatným porušením smlouvy (§ 2106 OZ).',
        'Nárok z vad je třeba uplatnit písemně u prodávajícího. Prodávající se zavazuje vadu vyřídit do 30 dnů od jejího uplatnění.',
      ],
    },
    {
      title: 'VII. PROHLÁŠENÍ O VLASTNICTVÍ A BEZDLUHOVOSTI',
      body: [
        'Prodávající prohlašuje, že:',
        'a) je výhradním vlastníkem prodávaného předmětu a je oprávněn s ním nakládat,',
        'b) předmět prodeje není zatížen zástavním právem, věcným břemenem, leasingem ani jinými právy třetích osob, pokud není výslovně uvedeno jinak,',
        'c) na předmět prodeje neváže žádné soudní rozhodnutí, exekuční příkaz ani jiné omezení dispozičních práv,',
        d.itemType === 'car' ? 'd) vozidlo není předmětem leasingové ani úvěrové smlouvy a není vedeno jako odcizené vozidlo v evidenci Policie ČR.' : 'd) předmět prodeje nepochází z trestné činnosti.',
      ],
    },
  ] : [];

  const sections: ContractSection[] = [
    {
      title: 'ZÁHLAVÍ SMLOUVY',
      body: [
        'Tato kupní smlouva (dále jen „smlouva") je uzavírána podle § 2079 a násl. zákona č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů (dále jen „OZ").',
        `Datum uzavření smlouvy: ${d.contractDate ? formatDate(d.contractDate) : today()}`,
      ],
    },
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Prodávající: ${asText(d.sellerName)}, nar./IČO: ${asText(d.sellerId, '__________')}, bytem/sídlo: ${asText(d.sellerAddress)}`,
        d.sellerEmail ? `E-mail prodávajícího: ${asText(d.sellerEmail)}` : '',
        d.sellerPhone ? `Telefon prodávajícího: ${asText(d.sellerPhone)}` : '',
        `Kupující: ${asText(d.buyerName)}, nar./IČO: ${asText(d.buyerId, '__________')}, bytem/sídlo: ${asText(d.buyerAddress)}`,
        d.buyerEmail ? `E-mail kupujícího: ${asText(d.buyerEmail)}` : '',
        d.buyerPhone ? `Telefon kupujícího: ${asText(d.buyerPhone)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. PŘEDMĚT KUPNÍ SMLOUVY',
      body: [
        `Prodávající se touto smlouvou zavazuje převést na kupujícího vlastnické právo k: ${subjectDesc}.`,
        d.itemCondition ? `Stav předmětu prodeje: ${asText(d.itemCondition)}` : '',
        `Kupující se zavazuje předmět koupit a zaplatit za něj kupní cenu.`,
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. KUPNÍ CENA A ZPŮSOB ÚHRADY',
      body: [
        `Kupní cena je sjednána dohodou smluvních stran ve výši ${formatAmount(d.price)} ${asText(d.currency, 'Kč')} (slovy: ${asText(d.priceWords, '__________')}).`,
        paymentDesc,
        'Vlastnické právo k předmětu prodeje přechází na kupujícího okamžikem úplného zaplacení kupní ceny, není-li dohodnuto jinak.',
      ],
    },
    {
      title: 'IV. PŘEDÁNÍ PŘEDMĚTU PRODEJE',
      body: [
        d.handoverDate
          ? `Prodávající se zavazuje předat předmět prodeje kupujícímu dne ${formatDate(d.handoverDate)} na adrese: ${asText(d.handoverPlace, '__________')}.`
          : `Předání předmětu prodeje proběhne dohodnutým způsobem po úhradě kupní ceny.`,
        'O předání bude sepsán předávací protokol podepsaný oběma smluvními stranami.',
        d.itemType === 'car'
          ? 'Prodávající předá kupujícímu: technický průkaz vozidla, osvědčení o registraci vozidla, servisní knihu (je-li k dispozici) a veškeré klíče.'
          : 'Prodávající předá kupujícímu veškerou dokumentaci a příslušenství náležející k předmětu prodeje.',
      ],
    },
    {
      title: 'V. ODPOVĚDNOST ZA VADY',
      body: [
        defectsClause,
        warrantyClause,
      ],
    },
    ...premiumContent,
    {
      title: `${hasPremiumClauses ? 'VIII' : 'VI'}. ZÁVĚREČNÁ USTANOVENÍ`,
      body: [
        'Smlouva se řídí právním řádem České republiky, zejména zákonem č. 89/2012 Sb., občanský zákoník.',
        'Případné spory budou řešeny přednostně smírnou cestou; jinak věcně a místně příslušným soudem ČR.',
        'Smlouva je vyhotovena ve dvou stejnopisech; každá smluvní strana obdrží jedno.',
        'Jakékoli změny jsou platné pouze ve formě písemných dodatků podepsaných oběma stranami.',
      ],
    },
  ];

  sections.push({ title: `${hasPremiumClauses ? 'IX' : 'VII'}. PODPISY`, body: [] });
  return sections;
}

// ─────────────────────────────────────────────
//  PRACOVNÍ SMLOUVA
// ─────────────────────────────────────────────
function buildEmploymentContractSections(d: StoredContractData): ContractSection[] {
  const { hasPremiumClauses } = resolveTierFeatures(d);
  const trialPeriodClause = d.trialPeriodMonths && Number(d.trialPeriodMonths) > 0
    ? `Sjednává se zkušební doba v délce ${asText(d.trialPeriodMonths)} měsíce/měsíců ode dne vzniku pracovního poměru (§ 35 ZP). V průběhu zkušební doby může pracovní poměr zrušit kterákoliv ze stran kdykoli, a to i bez udání důvodu.`
    : 'Zkušební doba se nesjednává.';

  const durationClause = d.employmentType === 'fixed'
    ? `na dobu určitou do ${formatDate(d.endDate, '__________')} (§ 39 ZP)`
    : 'na dobu neurčitou';

  const salaryDesc = d.salaryType === 'monthly'
    ? `Zaměstnanci náleží měsíční mzda ve výši ${formatAmount(d.salary)} Kč hrubého. Mzda je splatná v pravidelném výplatním termínu, tj. ${asText(d.payDay, '15')}. dne kalendářního měsíce následujícího po měsíci, za který mzda náleží, a to bezhotovostním převodem na bankovní účet zaměstnance.`
    : `Zaměstnanci náleží hodinová mzda ve výši ${formatAmount(d.hourlyRate)} Kč/hod. hrubého.`;

  const workTimeClause = d.workHours
    ? `Sjednaná týdenní pracovní doba činí ${asText(d.workHours)} hodin. Rozvrh pracovní doby: ${asText(d.workSchedule, 'pondělí–pátek, 8:00–17:00')}.`
    : `Týdenní pracovní doba je stanovena v délce 40 hodin (§ 79 ZP). Rozvrh pracovní doby: pondělí–pátek, 8:00–17:00.`;

  const premiumContent: ContractSection[] = hasPremiumClauses ? [
    {
      title: 'VIII. KONKURENČNÍ DOLOŽKA',
      body: [
        d.nonCompete
          ? `Zaměstnanec se zavazuje, že po dobu ${asText(d.nonCompetePeriod, '12')} měsíců od skončení pracovního poměru nebude vykonávat výdělečnou činnost, která by byla shodná s předmětem podnikání zaměstnavatele nebo která by měla vůči zaměstnavateli soutěžní povahu (§ 310 ZP). Za dodržení tohoto závazku náleží zaměstnanci peněžité vyrovnání ve výši alespoň poloviny průměrného měsíčního výdělku za každý měsíc plnění závazku.`
          : 'Konkurenční doložka se nesjednává.',
      ],
    },
    {
      title: 'IX. MLČENLIVOST A OCHRANA OBCHODNÍHO TAJEMSTVÍ',
      body: [
        'Zaměstnanec je povinen zachovávat mlčenlivost o všech skutečnostech, o nichž se dozvěděl v souvislosti s výkonem svého zaměstnání a které jsou označeny jako důvěrné nebo jejichž povaha jejich důvěrnost zjevně zakládá.',
        'Povinnost mlčenlivosti trvá po dobu trvání pracovního poměru a dále po dobu 3 let po jeho skončení.',
        `Za porušení povinnosti mlčenlivosti náleží zaměstnavateli smluvní pokuta ve výši ${formatAmount(d.breachPenalty || 50000)} Kč za každý případ porušení.`,
      ],
    },
  ] : [];

  const sections: ContractSection[] = [
    {
      title: 'ZÁHLAVÍ SMLOUVY',
      body: [
        'Tato pracovní smlouva (dále jen „smlouva") je uzavírána podle § 34 a násl. zákona č. 262/2006 Sb., zákoník práce, ve znění pozdějších předpisů (dále jen „ZP").',
        `Datum uzavření smlouvy: ${d.contractDate ? formatDate(d.contractDate) : today()}`,
      ],
    },
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Zaměstnavatel: ${asText(d.employerName)}, IČO: ${asText(d.employerIco, '__________')}, sídlo: ${asText(d.employerAddress)}`,
        d.employerEmail ? `E-mail zaměstnavatele: ${asText(d.employerEmail)}` : '',
        `Zaměstnanec: ${asText(d.employeeName)}, nar.: ${asText(d.employeeBirth, '__________')}, bytem: ${asText(d.employeeAddress)}`,
        d.employeeEmail ? `E-mail zaměstnance: ${asText(d.employeeEmail)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. DRUH A MÍSTO VÝKONU PRÁCE',
      body: [
        `Druh práce (pracovní pozice): ${asText(d.jobTitle, '__________')}`,
        `Popis pracovní náplně: ${asText(d.jobDescription, 'dle aktuálního popisu pracovního místa')}`,
        `Místo výkonu práce: ${asText(d.workPlace, '__________')}`,
        d.remoteWork ? `Možnost práce na dálku (home office): ${asText(d.remoteWork)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. VZNIK PRACOVNÍHO POMĚRU A TRVÁNÍ',
      body: [
        `Pracovní poměr vzniká dnem nástupu do práce: ${formatDate(d.startDate, '__________')}`,
        `Pracovní poměr se sjednává ${durationClause}.`,
        trialPeriodClause,
      ],
    },
    {
      title: 'IV. PRACOVNÍ DOBA',
      body: [
        workTimeClause,
        `Přestávka na jídlo a oddech: ${asText(d.breakMinutes, '30')} minut dle § 88 ZP.`,
        `Dovolená: Zaměstnanci náleží dovolená v délce ${asText(d.vacationWeeks, '4')} týdnů za kalendářní rok dle § 212 ZP.`,
      ],
    },
    {
      title: 'V. MZDA A ODMĚŇOVÁNÍ',
      body: [
        salaryDesc,
        d.bonusDesc ? `Zaměstnanci mohou být přiznány pohyblivé složky mzdy (prémie/bonusy): ${asText(d.bonusDesc)}.` : '',
        'Zaměstnavatel je povinen zaměstnanci poskytnout při výplatě písemný doklad (výplatní pásku) s údaji o jednotlivých složkách mzdy a provedených srážkách.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'VI. PRÁVA A POVINNOSTI ZAMĚSTNANCE',
      body: [
        'Zaměstnanec je povinen:',
        'a) osobně vykonávat práce podle pracovní smlouvy a dodržovat pracovní dobu,',
        'b) dodržovat předpisy BOZP a pracovní řád zaměstnavatele,',
        'c) oznamovat zaměstnavateli překážky v práci (nemoc, ošetřování) bez zbytečného odkladu,',
        'd) zachovávat mlčenlivost o informacích označených jako důvěrné,',
        'e) chránit majetek zaměstnavatele a nepožívat alkohol ani jiné návykové látky na pracovišti.',
      ],
    },
    {
      title: 'VII. SKONČENÍ PRACOVNÍHO POMĚRU',
      body: [
        'Pracovní poměr může být ukončen: dohodou, výpovědí, okamžitým zrušením nebo uplynutím sjednané doby (§ 48 ZP).',
        `Výpovědní doba v souladu s § 51 ZP činí ${asText(d.noticePeriod, '2')} měsíce. Výpovědní doba počíná prvním dnem kalendářního měsíce následujícího po doručení výpovědi.`,
        'Výpověď ze strany zaměstnavatele musí být odůvodněna (§ 52 ZP). Výpověď ze strany zaměstnance může být dána z jakéhokoli důvodu nebo bez uvedení důvodu.',
      ],
    },
    ...premiumContent,
    {
      title: `${hasPremiumClauses ? 'X' : 'VIII'}. ZÁVĚREČNÁ USTANOVENÍ`,
      body: [
        'Pracovní smlouva se řídí zákonem č. 262/2006 Sb., zákoník práce, a subsidiárně zákonem č. 89/2012 Sb., občanský zákoník.',
        'Pracovní spory řeší věcně příslušný soud dle § 9 odst. 1 zákona č. 99/1963 Sb., občanský soudní řád.',
        'Smlouva je vyhotovena ve dvou stejnopisech; zaměstnavatel i zaměstnanec obdrží po jednom vyhotovení (§ 37 ZP).',
        'Změny pracovní smlouvy jsou platné pouze ve formě písemných číslovaných dodatků podepsaných oběma stranami (§ 564 OZ).',
      ],
    },
  ];

  sections.push({ title: `${hasPremiumClauses ? 'XI' : 'IX'}. PODPISY`, body: [] });
  return sections;
}

// ─────────────────────────────────────────────
//  DOHODA O PROVEDENÍ PRÁCE (DPP)
// ─────────────────────────────────────────────
function buildDppContractSections(d: StoredContractData): ContractSection[] {
  const { hasPremiumClauses } = resolveTierFeatures(d);
  const remunerationDesc = d.remunerationType === 'hourly'
    ? `Sjednaná odměna za provedení práce činí ${formatAmount(d.hourlyRate)} Kč za hodinu. Celková odměna bude vypočtena na základě skutečně odpracovaných hodin.`
    : `Sjednaná odměna za provedení celého úkolu/práce činí ${formatAmount(d.totalRemuneration)} Kč. Odměna bude vyplacena po splnění sjednaného úkolu.`;

  const taxNote = 'Odměna z dohody o provedení práce nepodléhá odvodům pojistného na sociální a zdravotní pojištění, nepřesahuje-li v daném kalendářním měsíci u jednoho zaměstnavatele částku 10 000 Kč (§ 75 a § 6 odst. 4 ZDP). V případě překročení tohoto limitu odměna podléhá srážkám dle platných předpisů.';

  const premiumContent: ContractSection[] = hasPremiumClauses ? [
    {
      title: 'VI. MLČENLIVOST A OCHRANA INFORMACÍ',
      body: [
        'Zaměstnanec je povinen zachovávat mlčenlivost o všech skutečnostech, s nimiž se v rámci plnění dohody seznámí a které jsou označeny jako důvěrné nebo jejichž povaha jejich důvěrnost zakládá (obchodní strategie, ceny, zákaznické databáze, interní procesy, osobní údaje zaměstnanců a zákazníků).',
        'Tato povinnost mlčenlivosti trvá i po skončení dohody, a to po dobu 2 let od jejího skončení.',
        `Za každý prokázaný případ porušení povinnosti mlčenlivosti je zaměstnanec povinen zaplatit zaměstnavateli smluvní pokutu ve výši ${formatAmount(d.ndaPenalty || 50000)} Kč. Zaplacením smluvní pokuty není dotčen nárok zaměstnavatele na náhradu skutečně vzniklé škody.`,
        'Zaměstnanec je povinen po skončení dohody vrátit veškeré dokumenty, nosiče dat a jiné materiály obsahující důvěrné informace a vymazat důvěrné informace ze svých soukromých zařízení.',
      ],
    },
    {
      title: 'VII. DUŠEVNÍ VLASTNICTVÍ',
      body: [
        'Výsledky práce (díla, výtvory, software, texty, grafika, databáze apod.) vytvořené zaměstnancem v rámci plnění dohody jsou zaměstnaneckými díly ve smyslu § 58 zákona č. 121/2000 Sb., autorský zákon. Zaměstnavatel vykonává veškerá majetková autorská práva k těmto dílům ode dne jejich vzniku.',
        'Zaměstnanec se vzdává práva na změnu díla, na nedotknutelnost díla a práva na autorský dohled v rozsahu, který není v rozporu s dobrými mravy.',
        'Výše uvedené platí i pro zaměstnancem vyvinutý software, algoritmy a technická řešení; zaměstnanec je povinen zdrojové kódy, dokumentaci a know-how předat zaměstnavateli nejpozději ke dni skončení dohody.',
      ],
    },
    {
      title: 'VIII. SMLUVNÍ POKUTA ZA PORUŠENÍ DOHODY',
      body: [
        `Nesplní-li zaměstnanec sjednaný pracovní úkol řádně a včas bez závažného důvodu, je povinen zaplatit zaměstnavateli smluvní pokutu ve výši ${formatAmount(d.taskFailPenalty || 5000)} Kč.`,
        `Prodlení zaměstnance s předáním výsledků práce o více než 7 kalendářních dnů: smluvní pokuta ve výši ${formatAmount(d.delayPenaltyPerDay || 500)} Kč za každý den prodlení.`,
        'Zaplacením smluvní pokuty není dotčen nárok zaměstnavatele na náhradu škody, která mu pozdním nebo vadným plněním prokazatelně vznikla.',
        'Smluvní pokuta je splatná do 14 dnů od písemné výzvy zaměstnavatele k jejímu zaplacení.',
      ],
    },
  ] : [];

  const sections: ContractSection[] = [
    {
      title: 'ZÁHLAVÍ DOHODY',
      body: [
        'Tato dohoda o provedení práce (dále jen „dohoda") je uzavírána podle § 75 a násl. zákona č. 262/2006 Sb., zákoník práce, ve znění pozdějších předpisů (dále jen „ZP").',
        `Datum uzavření dohody: ${d.contractDate ? formatDate(d.contractDate) : today()}`,
        'Upozornění: Rozsah práce na základě dohody o provedení práce nesmí být větší než 300 hodin v kalendářním roce u jednoho zaměstnavatele (§ 75 odst. 2 ZP).',
      ],
    },
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Zaměstnavatel: ${asText(d.employerName)}, IČO: ${asText(d.employerIco, '__________')}, sídlo: ${asText(d.employerAddress)}`,
        d.employerEmail ? `E-mail zaměstnavatele: ${asText(d.employerEmail)}` : '',
        `Zaměstnanec: ${asText(d.employeeName)}, nar.: ${asText(d.employeeBirth, '__________')}, bytem: ${asText(d.employeeAddress)}`,
        d.employeeEmail ? `E-mail zaměstnance: ${asText(d.employeeEmail)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. PŘEDMĚT DOHODY — POPIS PRACOVNÍHO ÚKOLU',
      body: [
        `Zaměstnanec se zavazuje pro zaměstnavatele provést tento pracovní úkol (druh práce): ${asText(d.taskDescription, '__________')}`,
        d.taskDetails ? `Podrobný popis: ${asText(d.taskDetails)}` : '',
        `Místo výkonu práce: ${asText(d.workPlace, '__________')}`,
        `Předpokládaný rozsah práce: ${asText(d.estimatedHours, '__________')} hodin (max. 300 hod./rok u jednoho zaměstnavatele).`,
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. DOBA TRVÁNÍ A TERMÍN SPLNĚNÍ',
      body: [
        `Dohoda se uzavírá na dobu: ${d.durationType === 'fixed' ? `určitou od ${formatDate(d.startDate, '__________')} do ${formatDate(d.endDate, '__________')}` : 'neurčitou (lze ukončit dohodou nebo výpovědí s 15denní výpovědní dobou)'}`,
        d.deadline ? `Pracovní úkol musí být splněn nejpozději do: ${asText(d.deadline)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'IV. ODMĚNA A ZPŮSOB VÝPLATY',
      body: [
        remunerationDesc,
        taxNote,
        d.paymentAccount ? `Odměna bude vyplacena na bankovní účet zaměstnance č. ${asText(d.paymentAccount)} do ${asText(d.paymentDays, '15')} dnů po splnění úkolu / po skončení měsíce.` : 'Odměna bude vyplacena v hotovosti nebo bankovním převodem.',
      ],
    },
    {
      title: 'V. PODMÍNKY VÝKONU PRÁCE',
      body: [
        'Zaměstnanec je povinen vykonávat sjednané práce osobně, řádně a v souladu s pokyny zaměstnavatele.',
        'Na dohodu o provedení práce se nevztahují ustanovení zákoníku práce o pracovní době, dovolené, odstupném a dalších nárocích zaměstnanců v hlavním pracovním poměru.',
        'Pracovní pomůcky a vybavení: zaměstnavatel poskytuje / nezajišťuje (dle dohody stran).',
        'Zaměstnanec není povinen práci osobně vykonávat na pracovišti zaměstnavatele, pokud není výslovně dohodnuto jinak.',
      ],
    },
    ...premiumContent,
    {
      title: `${hasPremiumClauses ? 'IX' : 'VI'}. ZÁVĚREČNÁ USTANOVENÍ`,
      body: [
        'Dohoda se řídí zákonem č. 262/2006 Sb., zákoník práce.',
        'Dohoda je vyhotovena ve dvou stejnopisech; každá strana obdrží jedno (§ 77 odst. 1 ZP).',
        'Změny dohody jsou platné pouze ve formě písemných dodatků.',
      ],
    },
  ];

  sections.push({ title: `${hasPremiumClauses ? 'X' : 'VII'}. PODPISY`, body: [] });
  return sections;
}

// ─────────────────────────────────────────────
//  SMLOUVA O POSKYTOVÁNÍ SLUŽEB
// ─────────────────────────────────────────────
function buildServiceContractSections(d: StoredContractData): ContractSection[] {
  const { hasPremiumClauses } = resolveTierFeatures(d);
  const priceDesc = d.pricingType === 'hourly'
    ? `Cena za poskytování služeb se sjednává ve výši ${formatAmount(d.hourlyRate)} Kč/hod. bez DPH. Faktury budou vystavovány ${asText(d.invoicePeriod, 'měsíčně')} na základě výkazu odpracovaných hodin.`
    : d.pricingType === 'monthly_flat'
    ? `Cena za poskytování služeb se sjednává jako měsíční paušál ve výši ${formatAmount(d.monthlyFee)} Kč bez DPH, splatný vždy k ${asText(d.payDay, '15')}. dni kalendářního měsíce.`
    : `Cena za poskytování služeb se sjednává jako pevná (lump-sum) ve výši ${formatAmount(d.totalPrice)} Kč bez DPH, splatná dle sjednaného milníku/termínu.`;

  const vatNote = d.vatPayer === 'yes'
    ? 'Poskytovatel je plátcem DPH. K ceně bude připočtena DPH v zákonem stanovené výši.'
    : 'Poskytovatel není plátcem DPH. Cena je konečná.';

  const ipClause = d.ipOwnership === 'client'
    ? 'Veškerá práva duševního vlastnictví vzniklá v rámci poskytování služeb přecházejí na objednatele okamžikem jejich vzniku. Poskytovatel se tímto vzdává práva dílo kdykoli odvolat. Objednatel je oprávněn dílo upravovat, šířit a používat bez omezení.'
    : 'Poskytovatel si zachovává veškerá práva duševního vlastnictví k vytvořeným výstupům; objednateli uděluje nevýhradní, nepřenosnou licenci k jejich využití pro vlastní potřebu.';

  const premiumContent: ContractSection[] = hasPremiumClauses ? [
    {
      title: 'VIII. SLA — ÚROVEŇ POSKYTOVÁNÍ SLUŽEB',
      body: [
        `Poskytovatel se zavazuje dosahovat těchto klíčových ukazatelů výkonnosti: dostupnost ${asText(d.uptime, '99')} % v pracovních dnech; doba reakce na hlášenou chybu/incident maximálně ${asText(d.responseTime, '24')} hodin.`,
        `Za každou hodinu prodlení nad sjednaný limit náleží objednateli sleva z ceny ve výši ${asText(d.slaDiscount, '0,5')} % z měsíčního paušálu, celkem však nejvýše ${asText(d.maxDiscount, '20')} %.`,
        'Výpadek způsobený vyšší mocí (výpadek energie, havárie infrastruktury mimo vliv poskytovatele) se do doby nedostupnosti nezapočítává.',
      ],
    },
    {
      title: 'IX. MLČENLIVOST A OCHRANA OBCHODNÍHO TAJEMSTVÍ',
      body: [
        'Poskytovatel se zavazuje zachovávat mlčenlivost o veškerých informacích objednatele, se kterými se v rámci plnění smlouvy seznámí, a to po dobu platnosti smlouvy i po dobu 3 let po jejím skončení.',
        'Za porušení povinnosti mlčenlivosti je poskytovatel povinen zaplatit smluvní pokutu ve výši 50 000 Kč za každý případ porušení, a to bez ohledu na vznik skutečné škody.',
      ],
    },
  ] : [];

  const sections: ContractSection[] = [
    {
      title: 'ZÁHLAVÍ SMLOUVY',
      body: [
        'Tato smlouva o poskytování služeb (dále jen „smlouva") je uzavírána podle § 1746 odst. 2 zákona č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů (dále jen „OZ").',
        `Datum uzavření smlouvy: ${d.contractDate ? formatDate(d.contractDate) : today()}`,
      ],
    },
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Poskytovatel: ${asText(d.providerName)}, IČO: ${asText(d.providerIco, '__________')}, sídlo: ${asText(d.providerAddress)}`,
        d.providerEmail ? `E-mail poskytovatele: ${asText(d.providerEmail)}` : '',
        d.providerPhone ? `Telefon poskytovatele: ${asText(d.providerPhone)}` : '',
        `Objednatel: ${asText(d.clientName)}, IČO/nar.: ${asText(d.clientId, '__________')}, sídlo/bytem: ${asText(d.clientAddress)}`,
        d.clientEmail ? `E-mail objednatele: ${asText(d.clientEmail)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. PŘEDMĚT SMLOUVY — ROZSAH SLUŽEB',
      body: [
        `Poskytovatel se zavazuje poskytovat objednateli tyto služby: ${asText(d.serviceDescription, '__________')}`,
        d.serviceDetails ? `Podrobná specifikace: ${asText(d.serviceDetails)}` : '',
        d.deliverables ? `Výstupy/dodávky: ${asText(d.deliverables)}` : '',
        `Zahájení poskytování služeb: ${formatDate(d.startDate, '__________')}`,
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. TRVÁNÍ SMLOUVY',
      body: [
        d.durationType === 'fixed'
          ? `Smlouva se uzavírá na dobu určitou do ${formatDate(d.endDate, '__________')}.`
          : 'Smlouva se uzavírá na dobu neurčitou.',
        d.durationType === 'indefinite'
          ? `Každá strana může smlouvu vypovědět s výpovědní dobou ${asText(d.noticePeriod, '1')} měsíce. Výpovědní doba počíná prvním dnem měsíce následujícího po doručení výpovědi.`
          : '',
        'Smlouva může být ukončena okamžitě v případě podstatného porušení povinností druhou stranou.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'IV. CENA A PLATEBNÍ PODMÍNKY',
      body: [
        priceDesc,
        vatNote,
        `Splatnost faktur: ${asText(d.invoiceDueDays, '14')} dnů od doručení faktury objednateli.`,
        `Při prodlení s úhradou faktury náleží poskytovateli úrok z prodlení ve výši ${asText(d.lateInterest, '0,05')} % z dlužné částky za každý den prodlení.`,
      ],
    },
    {
      title: 'V. POVINNOSTI SMLUVNÍCH STRAN',
      body: [
        'Poskytovatel je povinen:',
        'a) poskytovat služby s odbornou péčí, řádně a včas,',
        'b) informovat objednatele o pokroku, překážkách a odchylkách od sjednaného rozsahu,',
        'c) chránit data, informace a podklady objednatele.',
        'Objednatel je povinen:',
        'd) poskytnout poskytovateli nezbytnou součinnost, přístupy a podklady,',
        'e) uhradit cenu za poskytnuté služby ve sjednaném termínu.',
      ],
    },
    {
      title: 'VI. ODPOVĚDNOST A SANKCE',
      body: [
        `Za prodlení s předáním výstupu/poskytnutím služby je poskytovatel povinen zaplatit objednateli smluvní pokutu ve výši ${asText(d.penaltyRate, '0,05')} % z ceny za každý den prodlení.`,
        'Celková výše smluvní pokuty nepřesáhne 15 % z celkové ceny dle smlouvy.',
        'Zaplacení smluvní pokuty nezbavuje žádnou ze stran povinnosti nahradit způsobenou škodu.',
      ],
    },
    {
      title: 'VII. PRÁVA DUŠEVNÍHO VLASTNICTVÍ',
      body: [ipClause],
    },
    ...premiumContent,
    {
      title: `${hasPremiumClauses ? 'X' : 'VIII'}. ZÁVĚREČNÁ USTANOVENÍ`,
      body: [
        'Smlouva se řídí právním řádem České republiky.',
        'Spory budou řešeny věcně a místně příslušným soudem.',
        'Smlouva je vyhotovena ve dvou stejnopisech.',
        'Změny jsou platné pouze ve formě písemných číslovaných dodatků.',
      ],
    },
  ];

  sections.push({ title: `${hasPremiumClauses ? 'XI' : 'IX'}. PODPISY`, body: [] });
  return sections;
}

// ─────────────────────────────────────────────
//  PODNÁJEMNÍ SMLOUVA
// ─────────────────────────────────────────────
function buildSubleaseContractSections(d: StoredContractData): ContractSection[] {
  const { hasPremiumClauses } = resolveTierFeatures(d);
  const consentNote = d.landlordConsent === 'yes'
    ? `Souhlas pronajímatele (vlastníka) se subpronajatou věcí byl udělen písemně dne ${asText(d.consentDate, '__________')} (§ 2274 OZ).`
    : 'Upozornění: Podnájem bez souhlasu pronajímatele je v případě bytu zakázán (§ 2274 OZ). Nájemce prohlašuje, že souhlas si zajistí nebo jej již má.';

  const premiumContent: ContractSection[] = hasPremiumClauses ? [
    {
      title: 'IX. ZVLÁŠTNÍ SMLUVNÍ UJEDNÁNÍ A VZTAH K HLAVNÍMU NÁJMU',
      body: [
        `Podnájemce bere na vědomí, že nájemce (jeho smluvní protistrana) je vůči vlastníkovi nemovitosti vázán nájemní smlouvou ze dne ${asText(d.mainLeaseDate, '__________')}. V případě zániku hlavního nájmu zaniká i podnájem (§ 2277 OZ).`,
        'Podnájemce se zavazuje neporušovat podmínky hlavní nájemní smlouvy, se kterou byl před podpisem této smlouvy řádně seznámen a jejíž relevantní části mu byly předány.',
        'Nájemce je povinen neprodleně informovat podnájemce o jakékoli změně hlavní nájemní smlouvy, která by mohla mít vliv na práva a povinnosti podnájemce.',
        'Podnájemce není oprávněn dát podnajatý prostor do dalšího podnájmu třetí osobě bez předchozího písemného souhlasu nájemce i pronajímatele.',
        `Smluvní pokuta za neoprávněné dalšípodnajímání nebo jiné porušení podmínek hlavní smlouvy: ${formatAmount(d.breachPenalty || 50000)} Kč.`,
      ],
    },
    {
      title: 'X. SMLUVNÍ POKUTY A SANKCE',
      body: [
        `Prodlení podnájemce s úhradou podnájemného: smluvní pokuta ve výši 0,1 % z dlužné částky za každý den prodlení (min. ${formatAmount(d.minLatePenalty || 200)} Kč/den).`,
        `Prodlení podnájemce s vyklizením po skončení podnájmu: smluvní pokuta ve výši ${formatAmount((Number(d.rentAmount) || 0) > 0 ? Math.round(Number(d.rentAmount) * 2 / 30) : 500)} Kč za každý den prodlení.`,
        `Neoprávněná změna nebo poškození prostor bez souhlasu nájemce: smluvní pokuta ${formatAmount(d.damagePenalty || 10000)} Kč + náhrada skutečné škody.`,
        'Zaplacením smluvní pokuty není dotčen nárok na náhradu vzniklé škody v plné výši.',
        'Nájemce je oprávněn prohlásit smluvní pokutu za okamžitě splatnou a rovněž od smlouvy okamžitě odstoupit, prodlí-li podnájemce s úhradou déle než 30 dnů nebo poruší-li závažně podmínky hlavní nájemní smlouvy.',
      ],
    },
    {
      title: 'XI. DORUČOVÁNÍ PÍSEMNOSTÍ',
      body: [
        'Veškeré písemnosti (výpovědi, oznámení, upomínky, faktury) se doručují na adresy smluvních stran uvedené v této smlouvě, nebo na e-mailové adresy, pokud je strana sdělila.',
        'Písemnost zaslaná doporučeným dopisem se považuje za doručenou třetím pracovním dnem po odeslání, i když ji adresát nepřevzal.',
        'Změnu doručovací adresy je strana povinna oznámit druhé straně písemně bez zbytečného odkladu; do doby doručení oznámení platí původní adresa.',
      ],
    },
  ] : [];

  const sections: ContractSection[] = [
    {
      title: 'ZÁHLAVÍ SMLOUVY',
      body: [
        'Tato podnájemní smlouva (dále jen „smlouva") je uzavírána podle § 2274 a násl. zákona č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů (dále jen „OZ").',
        consentNote,
        `Datum uzavření smlouvy: ${d.contractDate ? formatDate(d.contractDate) : today()}`,
      ],
    },
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Nájemce (podnajímatel): ${asText(d.landlordName)}, nar./IČO: ${asText(d.landlordId, '__________')}, bytem/sídlo: ${asText(d.landlordAddress)}`,
        d.landlordEmail ? `E-mail nájemce: ${asText(d.landlordEmail)}` : '',
        `Podnájemce: ${asText(d.tenantName)}, nar./IČO: ${asText(d.tenantId, '__________')}, bytem/sídlo: ${asText(d.tenantAddress)}`,
        d.tenantEmail ? `E-mail podnájemce: ${asText(d.tenantEmail)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. PŘEDMĚT PODNÁJMU',
      body: [
        `Nájemce přenechává podnájemci do podnájmu: byt/prostor na adrese ${asText(d.flatAddress, '__________')}, ${asText(d.flatLayout, '')}, ${d.flatUnitNumber ? `číslo jednotky ${asText(d.flatUnitNumber)}, ` : ''}${d.floor ? `${asText(d.floor)}. podlaží, ` : ''}katastrální území ${asText(d.cadastralArea, '__________')}.`,
        d.subleaseArea ? `Podlahová plocha podnajímaného prostoru: ${asText(d.subleaseArea)} m²` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. DOBA PODNÁJMU',
      body: [
        d.duration === 'fixed'
          ? `Podnájem se sjednává na dobu určitou od ${formatDate(d.startDate, '__________')} do ${formatDate(d.endDate, '__________')}.`
          : `Podnájem se sjednává na dobu neurčitou od ${formatDate(d.startDate, '__________')}.`,
        d.duration === 'indefinite'
          ? `Výpovědní doba: ${asText(d.noticePeriod, '3')} měsíce; výpovědní doba počíná prvním dnem měsíce následujícího po doručení výpovědi.`
          : '',
        'Podnájem v každém případě skončí nejpozději ke dni skončení hlavního nájmu.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'IV. PODNÁJEMNÉ A PLATBY',
      body: [
        `Měsíční podnájemné je sjednáno ve výši ${formatAmount(d.rentAmount)} Kč.`,
        d.utilityAmount ? `Záloha na služby/energie: ${formatAmount(d.utilityAmount)} Kč/měsíc.` : '',
        `Celková měsíční platba: ${formatAmount((Number(d.rentAmount) || 0) + (Number(d.utilityAmount) || 0))} Kč.`,
        d.depositAmount ? `Kauce: ${formatAmount(d.depositAmount)} Kč (max. trojnásobek měsíčního podnájemného).` : '',
        `Podnájemné je splatné vždy do ${asText(d.paymentDay, '15')}. dne příslušného měsíce ${d.bankAccount ? `na bankovní účet nájemce č. ${asText(d.bankAccount)}` : 'v hotovosti nebo bankovním převodem'}.`,
      ].filter(Boolean) as string[],
    },
    {
      title: 'V. PRAVIDLA PODNÁJMU',
      body: [
        'Podnájemce je povinen: užívat prostory pouze ke sjednanému účelu, udržovat pořádek, nečinit úpravy bez souhlasu nájemce, nepoškozovat majetek a řídit se domovním řádem.',
        `Maximální počet osob v bytě: ${asText(d.maxOccupants, '2')}`,
        `Domácí zvířata: ${yesNo(d.allowPets, 'povolena', 'zakázána')}`,
        `Kouření: ${yesNo(d.allowSmoking, 'povoleno', 'zakázáno')}`,
        `Airbnb / krátkodobý přepodnájem: ${yesNo(d.allowAirbnb, 'povolen', 'zakázán')}`,
        'Podnájemce bere na vědomí podmínky hlavní nájemní smlouvy a zavazuje se je respektovat.',
      ],
    },
    {
      title: 'VI. PŘEDÁNÍ PROSTOR',
      body: [
        `Předání prostor proběhne dne ${formatDate(d.handoverDate, '__________')}.`,
        `Počet předaných klíčů: ${asText(d.keysCount, '1')}`,
        d.equipmentList ? `Předávané vybavení: ${asText(d.equipmentList)}` : '',
        d.knownDefects ? `Známé vady: ${asText(d.knownDefects)}` : 'Prostory jsou předávány bez zjevných vad.',
        'O předání bude sepsán předávací protokol podepsaný oběma stranami.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'VII. UKONČENÍ PODNÁJMU',
      body: [
        'Při skončení podnájmu je podnájemce povinen vyklidit prostory, uvést je do původního stavu (s přihlédnutím k běžnému opotřebení) a odevzdat klíče.',
        `Za každý den prodlení s vyklizením je podnájemce povinen platit podnájemné ve výši ${asText(d.rentAmount, '__________')} Kč/den.`,
        'Kauce bude vrácena do 30 dnů od předání prostor, po odečtení eventuálních pohledávek nájemce.',
      ],
    },
    {
      title: 'VIII. OPRAVY A HAVÁRIE',
      body: [
        'Drobné opravy hradí podnájemce; větší opravy nájemce, pokud nejsou způsobeny podnájemcem.',
        'Havárie musí být podnájemcem hlášena neprodleně.',
      ],
    },
    ...premiumContent,
    {
      title: `${hasPremiumClauses ? 'XII' : 'IX'}. ZÁVĚREČNÁ USTANOVENÍ`,
      body: [
        'Smlouva se řídí zákonem č. 89/2012 Sb., OZ.',
        'Smlouva je vyhotovena ve dvou stejnopisech.',
        'Změny jsou platné pouze ve formě písemných dodatků.',
      ],
    },
  ];

  sections.push({ title: `${hasPremiumClauses ? 'XIII' : 'X'}. PODPISY`, body: [] });
  return sections;
}

// ─────────────────────────────────────────────
//  PLNÁ MOC
// ─────────────────────────────────────────────
function buildPowerOfAttorneyContractSections(d: StoredContractData): ContractSection[] {
  const { hasPremiumClauses } = resolveTierFeatures(d);
  const scopeDesc = () => {
    switch (d.poaType) {
      case 'property':
        return `veškeré právní jednání ve věci převodu, koupě, prodeje, pronájmu nebo jiného nakládání s nemovitou věcí na adrese/v katastrálním území: ${asText(d.propertyAddress, '__________')}, zejména: podpis kupní smlouvy, smlouvy o smlouvě budoucí, nájemní smlouvy, darovací smlouvy; zastupování před katastrem nemovitostí, finančními institucemi a orgány veřejné moci.`;
      case 'court':
        return `zastupování zmocnitele ve věci vedené u ${asText(d.courtName, '__________')}, sp. zn. ${asText(d.caseNumber, '__________')}, včetně přijímání zásilek, podávání opravných prostředků a uzavírání smírů.`;
      case 'company':
        return `zastupování zmocnitele jako společníka/jednatele/akcionáře společnosti ${asText(d.companyName, '__________')}, IČO ${asText(d.companyIco, '__________')}, v rámci těchto jednání: ${asText(d.companyScope, 'valná hromada, jednání s orgány státní správy, obchodní jednání')}`;
      case 'bank':
        return `zastupování na bankách a finančních institucích, zejména nakládání s účtem č. ${asText(d.bankAccount, '__________')} vedený u ${asText(d.bankName, '__________')}, vč. výběrů, vkladů a správy účtu.`;
      default:
        return `${asText(d.customScope, '__________')}`;
    }
  };

  const validityClause = d.validUntil
    ? `Tato plná moc je platná do ${asText(d.validUntil)}.`
    : d.singleUse
    ? 'Tato plná moc je jednorázová a zaniká splněním úkonu, ke kterému byla udělena.'
    : 'Tato plná moc je platná do jejího výslovného odvolání zmocnitelem.';

  const substitutionClause = d.allowSubstitution
    ? 'Zmocněnec je oprávněn udělit substitutovanou plnou moc třetí osobě (substituce).'
    : 'Zmocněnec není oprávněn udělit plnou moc na místo sebe třetí osobě (zákaz substituce).';

  const sections: ContractSection[] = [
    {
      title: 'PLNÁ MOC',
      body: [
        'Tato plná moc je udělována podle § 441 a násl. zákona č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů.',
        `Datum udělení: ${d.contractDate ? formatDate(d.contractDate) : today()}`,
      ],
    },
    {
      title: 'I. ZMOCNITEL',
      body: [
        `Jméno a příjmení / název: ${asText(d.principalName)}`,
        `Datum narození / IČO: ${asText(d.principalId, '__________')}`,
        `Trvalé bydliště / sídlo: ${asText(d.principalAddress)}`,
        d.principalEmail ? `E-mail: ${asText(d.principalEmail)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. ZMOCNĚNEC',
      body: [
        `Jméno a příjmení / název: ${asText(d.agentName)}`,
        `Datum narození / IČO: ${asText(d.agentId, '__________')}`,
        `Trvalé bydliště / sídlo: ${asText(d.agentAddress)}`,
        d.agentEmail ? `E-mail: ${asText(d.agentEmail)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. ROZSAH A PŘEDMĚT ZMOCNĚNÍ',
      body: [
        `Zmocnitel tímto zmocňuje zmocněnce, aby ho zastupoval a jeho jménem a na jeho účet jednal v záležitosti:`,
        scopeDesc(),
        substitutionClause,
      ],
    },
    {
      title: 'IV. PLATNOST PLNÉ MOCI',
      body: [
        validityClause,
        'Plná moc zaniká rovněž smrtí zmocnitele nebo zmocněnce, pokud z povahy věci nevyplývá něco jiného.',
        'Zmocnitel může plnou moc kdykoli odvolat; odvolání nabývá účinnosti doručením zmocněnci.',
      ],
    },
    {
      title: 'V. PROHLÁŠENÍ ZMOCNITELE',
      body: [
        'Zmocnitel prohlašuje, že:',
        'a) uděluje tuto plnou moc svobodně, vážně a bez donucení,',
        'b) je plně způsobilý k právnímu jednání,',
        'c) si je vědom rozsahu udělených oprávnění a jejich právních důsledků.',
        hasPremiumClauses ? 'Pravost podpisu zmocnitele je ověřena notářem/Czech Pointem dle § 74 odst. 1 zákona č. 358/1992 Sb., notářský řád. Ověřená plná moc je uznávána všemi orgány veřejné moci, finančními institucemi a třetími stranami.' : '',
      ].filter(Boolean) as string[],
    },
  ];

  const premiumContent: ContractSection[] = hasPremiumClauses ? [
    {
      title: 'VI. ÚŘEDNÍ OVĚŘENÍ PODPISU A PRÁVNÍ ÚČINKY VŮčI TŘETÍM STRANÁM',
      body: [
        'Tato plná moc je opatřena úředně ověřeným podpisem zmocnitele (notářem nebo Czech Point / matrikou). Ověření podpisu je povinné zejména pro: právní jednání týkající se nemovitostí zapisovaných do katastru nemovitostí, zastupování v řízení před soudy a orgány státní správy, nakládání s bankovními účty a finanční aktiva třetích stran.',
        'Ověřená plná moc je platná i vůči osobám a institucím, které nebyly přítomny jejímu udělení, a nelze ji odmítnout jako nedostatečnou, pokud splňuje zákonem stanovené náležitosti.',
        'Zmocnitel nese plnou odpovědnost za jednání zmocněnce učiněná v mezích udělené plné moci. Překročí-li zmocněnec rozsah zmocnění, je tento přesah závazný pouze tehdy, pokud jej zmocnitel dodatečně schválí (§ 440 OZ).',
        'Plná moc je sepsána ve dvou vyhotoveních: jedno obdrží zmocněnec jako průkazní listinu, druhé si ponechá zmocnitel.',
      ],
    },
    {
      title: 'VII. ODPOVĚDNOST ZMOCNĚNCE A POVINNOST INFORMOVAT',
      body: [
        'Zmocněnec je povinen jednat s péčí řádného hospodáře, v nejlepším zájmu zmocnitele a v souladu s jeho pokyny.',
        'Zmocněnec je povinen zmocnitele neprodleně informovat o každém právním jednání, které jménem zmocnitele učinil, a předat mu veškerou dokumentaci, korespondenci a výnosy.',
        'Zmocněnec nesmí jménem zmocnitele uzavírat smlouvy nebo přijímat závazky přesahující rozsah udělené plné moci, ani převádět, zastavovat nebo jinak zatěžovat majetek zmocnitele nad rámec výslovného zmocnění.',
        `Za škodu způsobenou překročením rozsahu zmocnění nebo nedbalým výkonem plné moci odpovídá zmocněnec zmocniteli v plné výši. Smluvní pokuta za vědomé překročení rozsahu zmocnění: ${formatAmount(d.agentPenalty || 50000)} Kč.`,
      ],
    },
  ] : [];

  sections.push(...premiumContent);
  sections.push({ title: `${hasPremiumClauses ? 'VIII' : 'VI'}. PODPISY`, body: [] });

  return sections;
}

// ─────────────────────────────────────────────
//  UZNÁNÍ DLUHU
// ─────────────────────────────────────────────
function buildDebtAcknowledgmentSections(d: StoredContractData): ContractSection[] {
  const { hasPremiumClauses } = resolveTierFeatures(d);
  const debtOrigin = d.debtOrigin === 'loan'
    ? `Dluh vznikl na základě smlouvy o zápůjčce / půjčky ze dne ${formatDate(d.debtDate, '__________')}.`
    : d.debtOrigin === 'invoice'
    ? `Dluh vznikl nezaplacením faktury č. ${asText(d.invoiceNumber, '__________')} ze dne ${formatDate(d.debtDate, '__________')}.`
    : d.debtOrigin === 'damage'
    ? `Dluh vznikl jako náhrada škody způsobené dne ${formatDate(d.debtDate, '__________')}.`
    : `Dluh vznikl z titulu: ${asText(d.debtOriginCustom, '__________')} (dne ${formatDate(d.debtDate, '__________')}).`;

  const repaymentDesc = d.repaymentType === 'installments'
    ? `Dlužník se zavazuje splácet dluh v ${asText(d.installmentCount, '__________')} pravidelných měsíčních splátkách po ${formatAmount(d.installmentAmount)} Kč, splatných vždy k ${asText(d.paymentDay, '15')}. dni každého měsíce, počínaje ${formatDate(d.firstPaymentDate, '__________')}.`
    : `Dlužník se zavazuje uhradit celou dlužnou částku nejpozději dne ${formatDate(d.repaymentDate, '__________')} jednorázově.`;

  const interestClause = d.interestRate && Number(d.interestRate) > 0
    ? `Na dlužnou jistinu se sjednává úrok z prodlení ve výši ${asText(d.interestRate)} % p.a. ode dne ${formatDate(d.debtDate, '__________')}.`
    : 'Na dlužnou jistinu se neúčtuje úrok (pokud není zákonem stanoveno jinak).';

  const premiumContent: ContractSection[] = hasPremiumClauses ? [
    {
      title: 'V. PŘÍMÁ VYKONATELNOST (EXEKUČNÍ DOLOŽKA)',
      body: [
        'Dlužník prohlašuje, že souhlasí s tím, aby toto uznání dluhu bylo sepsáno formou notářského zápisu s doložkou přímé vykonatelnosti podle § 71b notářského řádu, a to na výzvu věřitele.',
        'Na základě notářského zápisu s doložkou přímé vykonatelnosti může věřitel vymáhat dluh prostřednictvím soudního exekutora bez potřeby předchozího soudního řízení.',
        'Sepsání notářského zápisu bude provedeno u notáře dle dohody stran do 30 dnů od podpisu tohoto uznání.',
      ],
    },
  ] : [];

  const sections: ContractSection[] = [
    {
      title: 'ZÁHLAVÍ — UZNÁNÍ DLUHU',
      body: [
        'Toto uznání dluhu (dále jen „listina") je sepsáno podle § 2053 zákona č. 89/2012 Sb., občanský zákoník (dále jen „OZ").',
        'Uznáním dluhu se promlčecí doba obnovuje a počíná běžet nová desetiletá promlčecí lhůta ode dne uznání (§ 639 OZ).',
        `Datum sepsání listiny: ${d.contractDate ? formatDate(d.contractDate) : today()}`,
      ],
    },
    {
      title: 'I. ÚČASTNÍCI',
      body: [
        `Věřitel: ${asText(d.creditorName)}, nar./IČO: ${asText(d.creditorId, '__________')}, bytem/sídlo: ${asText(d.creditorAddress)}`,
        d.creditorEmail ? `E-mail věřitele: ${asText(d.creditorEmail)}` : '',
        `Dlužník: ${asText(d.debtorName)}, nar./IČO: ${asText(d.debtorId, '__________')}, bytem/sídlo: ${asText(d.debtorAddress)}`,
        d.debtorEmail ? `E-mail dlužníka: ${asText(d.debtorEmail)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. UZNÁNÍ DLUHU',
      body: [
        `Dlužník tímto výslovně a bez výhrad uznává, že dluží věřiteli peněžitou částku ve výši ${formatAmount(d.debtAmount)} ${asText(d.currency, 'Kč')} (slovy: ${asText(d.debtAmountWords, '__________')}).`,
        debtOrigin,
        interestClause,
        'Dlužník prohlašuje, že dluh existuje, jeho výše je správná a nemá vůči věřiteli žádné kompenzační pohledávky, kterými by byl oprávněn dluh snížit.',
      ],
    },
    {
      title: 'III. ZPŮSOB A TERMÍN SPLACENÍ',
      body: [
        repaymentDesc,
        d.bankAccount ? `Platby budou zasílány na bankovní účet věřitele č. ${asText(d.bankAccount)}, VS: ${asText(d.variableSymbol, '__________')}.` : '',
        `Při prodlení s úhradou sjednané splátky nebo celkové dlužné částky je dlužník povinen zaplatit věřiteli smluvní pokutu ve výši ${asText(d.latePenalty, '0,05')} % z dlužné částky za každý den prodlení.`,
        'Věřitel je oprávněn prohlásit celý zbývající dluh za okamžitě splatný, prodlí-li dlužník s úhradou déle než 30 dnů.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'IV. ZÁVĚREČNÁ USTANOVENÍ',
      body: [
        'Tato listina se řídí právním řádem České republiky.',
        'Listina je vyhotovena ve dvou stejnopisech; každá strana obdrží jedno.',
        'Tato listina je sama o sobě závazná a není podmíněna splněním žádné jiné podmínky.',
      ],
    },
    ...premiumContent,
  ];

  sections.push({ title: `${hasPremiumClauses ? 'VI' : 'V'}. PODPISY`, body: [] });
  return sections;
}

// ─────────────────────────────────────────────
//  SMLOUVA O SPOLUPRÁCI
// ─────────────────────────────────────────────
function buildCooperationContractSections(d: StoredContractData): ContractSection[] {
  const { hasPremiumClauses } = resolveTierFeatures(d);
  const revenueDesc = d.revenueModel === 'revenue_share'
    ? `Smluvní strany si rozdělí příjmy z předmětu spolupráce v poměru ${asText(d.revenueShareA, '50')} % pro ${asText(d.partyAName, 'Stranu A')} a ${asText(d.revenueShareB, '50')} % pro ${asText(d.partyBName, 'Stranu B')}.`
    : d.revenueModel === 'fixed_fee'
    ? `Za spolupráci náleží ${asText(d.partyBName, 'Straně B')} pevná odměna ve výši ${formatAmount(d.fixedFee)} Kč/měsíčně (bez DPH).`
    : `Způsob odměňování: ${asText(d.revenueDesc, '__________')}`;

  const ipClause = d.ipSharing === 'joint'
    ? 'Veškerá práva duševního vlastnictví vzniklá společnou spoluprací jsou ve společném vlastnictví smluvních stran ve stejném podílu, není-li dohodnuto jinak.'
    : d.ipSharing === 'partyA'
    ? `Práva duševního vlastnictví vzniklá spoluprací přísluší straně ${asText(d.partyAName, 'A')}.`
    : `Každá strana si zachovává výhradní vlastnictví k těm výsledkům, které vytvořila samostatně. Ke společně vytvořeným výsledkům mají strany právo společně.`;

  const premiumContent: ContractSection[] = hasPremiumClauses ? [
    {
      title: 'VIII. OCHRANA OBCHODNÍHO TAJEMSTVÍ A ZÁKAZ KONKURENCE',
      body: [
        'Každá ze smluvních stran je povinna zachovávat mlčenlivost o důvěrných informacích druhé strany, a to po dobu trvání smlouvy a dále 3 roky po jejím skončení.',
        `Za každý případ porušení mlčenlivosti je porušující strana povinna zaplatit druhé straně smluvní pokutu ve výši ${formatAmount(d.ndaPenalty || 100000)} Kč.`,
        d.nonCompete ? `Smluvní strany se zavazují, že po dobu trvání smlouvy nebudou navzájem přetahovat zaměstnance, klienty ani klíčové dodavatele druhé strany.` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'IX. ŘEŠENÍ SPORŮ A ROZHODČÍ DOLOŽKA',
      body: [
        'Smluvní strany se zavazují řešit veškeré spory vzniklé z této smlouvy nebo v souvislosti s ní přednostně smírnou cestou — vyjednáváním nebo mediací.',
        'Nedojde-li k dohodě do 30 dnů, bude spor řešen věcně a místně příslušným soudem ČR.',
        'Pro urychlené řešení mohou strany písemně dohodnout rozhodčí řízení.',
      ],
    },
  ] : [];

  const sections: ContractSection[] = [
    {
      title: 'ZÁHLAVÍ SMLOUVY',
      body: [
        'Tato smlouva o spolupráci (dále jen „smlouva") je uzavírána podle § 1746 odst. 2 zákona č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů (dále jen „OZ").',
        `Datum uzavření smlouvy: ${d.contractDate ? formatDate(d.contractDate) : today()}`,
      ],
    },
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Strana A: ${asText(d.partyAName)}, IČO/nar.: ${asText(d.partyAId, '__________')}, sídlo/bytem: ${asText(d.partyAAddress)}`,
        d.partyAEmail ? `E-mail Strany A: ${asText(d.partyAEmail)}` : '',
        `Strana B: ${asText(d.partyBName)}, IČO/nar.: ${asText(d.partyBId, '__________')}, sídlo/bytem: ${asText(d.partyBAddress)}`,
        d.partyBEmail ? `E-mail Strany B: ${asText(d.partyBEmail)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. PŘEDMĚT SPOLUPRÁCE',
      body: [
        `Smluvní strany se dohodly na spolupráci v oblasti: ${asText(d.cooperationScope, '__________')}`,
        d.cooperationDetails ? `Podrobný popis předmětu spolupráce: ${asText(d.cooperationDetails)}` : '',
        `Cíl spolupráce: ${asText(d.cooperationGoal, '__________')}`,
        d.startDate ? `Zahájení spolupráce: ${formatDate(d.startDate)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. PŘÍSPĚVKY SMLUVNÍCH STRAN',
      body: [
        `${asText(d.partyAName, 'Strana A')} přispívá: ${asText(d.partyAContribution, 'know-how, obchodní kontakty, pracovní kapacita')}`,
        `${asText(d.partyBName, 'Strana B')} přispívá: ${asText(d.partyBContribution, 'technologie, vybavení, finanční prostředky')}`,
        'Každá strana se zavazuje věnovat spolupráci dohodnutý čas a zdroje a informovat druhou stranu o pokroku i překážkách.',
      ],
    },
    {
      title: 'IV. ODMĚŇOVÁNÍ A ROZDĚLENÍ VÝNOSŮ',
      body: [revenueDesc],
    },
    {
      title: 'V. ŘÍZENÍ A ROZHODOVÁNÍ',
      body: [
        'Smluvní strany se zavazují rozhodovat o klíčových otázkách spolupráce konsensuálně.',
        d.coordinatorName ? `Koordinátor/vedoucí spolupráce: ${asText(d.coordinatorName)}` : '',
        'Každá strana je oprávněna jednat jménem spolupráce pouze v rozsahu, který byl výslovně odsouhlasen druhou stranou.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'VI. TRVÁNÍ A UKONČENÍ SMLOUVY',
      body: [
        d.durationType === 'fixed'
          ? `Smlouva se uzavírá na dobu určitou do ${formatDate(d.endDate, '__________')}.`
          : `Smlouva se uzavírá na dobu neurčitou. Každá strana ji může vypovědět s výpovědní dobou ${asText(d.noticePeriod, '3')} měsíce.`,
        'Smlouva může být ukončena okamžitě vzájemnou dohodou nebo při podstatném porušení povinností jednou ze stran.',
        'V případě ukončení spolupráce se strany vypořádají vzájemné pohledávky a dluhy do 60 dnů od zániku smlouvy.',
      ],
    },
    {
      title: 'VII. PRÁVA DUŠEVNÍHO VLASTNICTVÍ',
      body: [ipClause],
    },
    ...premiumContent,
    {
      title: `${hasPremiumClauses ? 'X' : 'VIII'}. ZÁVĚREČNÁ USTANOVENÍ`,
      body: [
        'Smlouva se řídí právním řádem České republiky.',
        'Smlouva je vyhotovena ve dvou stejnopisech; každá strana obdrží jedno.',
        'Veškeré změny jsou platné pouze ve formě písemných číslovaných dodatků.',
        'Je-li jakékoli ustanovení smlouvy neplatné, ostatní ustanovení zůstávají v plné platnosti.',
      ],
    },
  ];

  sections.push({ title: `${hasPremiumClauses ? 'XI' : 'IX'}. PODPISY`, body: [] });
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
    case 'general_sale':
      return buildGeneralSaleContractSections(data);
    case 'employment':
      return buildEmploymentContractSections(data);
    case 'dpp':
      return buildDppContractSections(data);
    case 'service':
      return buildServiceContractSections(data);
    case 'sublease':
      return buildSubleaseContractSections(data);
    case 'power_of_attorney':
      return buildPowerOfAttorneyContractSections(data);
    case 'debt_acknowledgment':
      return buildDebtAcknowledgmentSections(data);
    case 'cooperation':
      return buildCooperationContractSections(data);
    default: {
      // Exhaustive check — TypeScript zajistí, že při přidání nového ContractType
      // dostaneme chybu kompilace, pokud zapomeneme doplnit case.
      const _exhaustive: never = data.contractType;
      throw new Error(`Neznámý typ smlouvy: ${_exhaustive}`);
    }
  }
}
