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
  /** Archivace dokumentu v Redisu: 7 (basic), 14 (professional), 30 (complete) */
  archiveDays: 7 | 14 | 30;
};

export function resolveTierFeatures(d: StoredContractData): TierFeatures {
  const tier = String(d.tier ?? 'basic').toLowerCase() as Tier;
  // notaryUpsell je fallback pro starší drafty uložené před zavedením tierů
  const legacyPremium = Boolean(d.notaryUpsell); // záměrně d.notaryUpsell — ne hasPremiumClauses
  const hasPremiumClauses = legacyPremium || tier === 'professional' || tier === 'complete';
  const hasCompletePages = tier === 'complete';
  const archiveDays = tier === 'complete' ? 30 : tier === 'professional' ? 14 : 7;
  return { hasPremiumClauses, hasCompletePages, archiveDays };
}

const emptyLine = '____________________';

const formatAmount = (amount?: unknown) => {
  if (amount === null || amount === undefined || amount === '') return '(neuvedeno)';
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

/**
 * Vrátí klauzuli o řešení sporů dle volby uživatele.
 * isLaborLaw=true → pevná formulace pro ZP spory (soudy, nelze rozhodčí)
 */
function disputeClause(d: StoredContractData, isLaborLaw = false): string {
  if (isLaborLaw) {
    return 'Pracovní spory řeší věcně příslušný soud dle § 9 odst. 1 zákona č. 99/1963 Sb., občanský soudní řád. Strany jsou povinny před podáním žaloby pokusit se o smírné vyřešení sporu.';
  }
  switch (d.disputeResolution) {
    case 'mediation':
      return 'Veškeré spory vzniklé z této smlouvy nebo v souvislosti s ní budou smluvní strany řešit přednostně mediací dle zákona č. 202/2012 Sb., o mediaci, za pomoci mediátora zvoleného dohodou stran. Nedojde-li k dohodě o mediaci do 15 dnů od písemné výzvy nebo není-li spor vyřešen do 30 dnů od zahájení mediace, budou spory řešeny věcně a místně příslušným soudem České republiky.';
    case 'arbitration':
      return 'Veškeré spory vzniklé z této smlouvy nebo v souvislosti s ní budou s konečnou platností rozhodnuty v rozhodčím řízení před Rozhodčím soudem při Hospodářské komoře České republiky a Agrární komoře České republiky dle jeho Řádu, jedním rozhodcem jmenovaným předsedou Rozhodčího soudu. Místo konání: Praha. Jazyk řízení: český (zákon č. 216/1994 Sb., o rozhodčím řízení). Smluvní strany se vzdávají práva na projednání věci obecným soudem, na které je sjednána tato doložka.';
    default:
      return 'Případné spory budou řešeny přednostně smírnou cestou. Nedojde-li k dohodě, bude spor řešen věcně a místně příslušným soudem České republiky.';
  }
}

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
        return `peněžní částku ve výši ${formatAmount(d.amount)} ${asText(d.currency, 'Kč')}${d.amountWords ? ` (slovy: ${d.amountWords})` : ''}`;
      case 'car':
        return `motorové vozidlo tovární značky ${asText(d.carMake, '')} ${asText(d.carModel, '')}, VIN: ${asText(d.carVIN, 'neuvedeno')}, SPZ: ${asText(d.carPlate, 'neuvedeno')}, rok výroby ${asText(d.carYear, 'neuvedeno')}, stav tachometru ke dni podpisu smlouvy: ${asText(d.carMileage, 'neuvedeno')} km`;
      case 'property':
        return `nemovitou věc — byt/pozemek na adrese ${asText(d.propertyAddress, 'neuvedeno')}, zapsanou na listu vlastnictví č. ${asText(d.propertyLV, 'neuvedeno')}, katastrální území ${asText(d.propertyCadastre, 'neuvedeno')}, u Katastrálního úřadu pro ${asText(d.cadastralOffice, 'neuvedeno')}`;
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
          ? `Podmínka vázající dar: ${asText(d.reservationDescription)}. Nedojde-li ke splnění podmínky ve lhůtě do ${asText(d.conditionDeadline, 'neuvedeno')}, smlouva se od počátku ruší.`
          : 'Dar je poskytován bez dalších podmínek a výminek.',
        'Právo na vrácení daru se promlčuje ve lhůtě tří let ode dne, kdy se dárce dozvěděl o důvodu pro vrácení.',
      ],
    },
  ] : [];

  const sections: ContractSection[] = [
    {
      title: 'PREAMBULE',
      body: [
        'Tato darovací smlouva (dále jen „smlouva") je uzavírána podle § 2055 a násl. zákona č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů (dále jen „OZ").',
        `Datum uzavření smlouvy: ${d.giftDate ? formatDate(d.giftDate) : today()}`,
      ],
    },
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Dárce: ${asText(d.donorName)}, nar./IČO: ${asText(d.donorId, '—')}, bytem/sídlo: ${asText(d.donorAddress)}`,
        d.donorEmail ? `E-mail dárce: ${asText(d.donorEmail)}` : '',
        `Obdarovaný: ${asText(d.doneeName)}, nar./IČO: ${asText(d.doneeId, '—')}, bytem/sídlo: ${asText(d.doneeAddress)}`,
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
          ? `Peněžní prostředky budou ${d.transferMethod === 'transfer' ? `převedeny bankovním převodem na účet obdarovaného č. ${asText(d.bankAccount, 'neuvedeno')}` : 'předány v hotovosti při podpisu smlouvy'}.`
          : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. PROHLÁŠENÍ SMLUVNÍCH STRAN',
      body: [
        'Smluvní strany prohlašují, že:',
        'a) smlouvu uzavírají svobodně, vážně, určitě a srozumitelně, nikoli v tísni ani za nápadně nevýhodných podmínek,',
        'b) jsou plně způsobilé k právnímu jednání a nejsou jim známy žádné skutečnosti, které by uzavření smlouvy bránily,',
        'c) jsou jim srozumitelné veškeré podmínky a důsledky této smlouvy,',
        'd) dar je poskytován a přijímán dobrovolně, bez nátlaku a bez skrytého závazku — není-li výslovně sjednána výminka dle čl. V této smlouvy.',
        'Upozornění k dani z příjmů: Dar přijatý od osoby v přímé příbuzenské linii (rodiče, děti, prarodiče) nebo od manžela/manželky je zpravidla osvobozen od daně z příjmů (§ 4a zákona č. 586/1992 Sb., ZDP). Dar od jiných osob může být zdanitelným příjmem obdarovaného; při pochybnostech doporučujeme ověřit aktuální podmínky u daňového poradce nebo na webu Finanční správy (financnisprava.cz).',
      ],
    },
    ...premiumContent,
    {
      title: `${hasPremiumClauses ? 'VI' : 'IV'}. ZÁVĚREČNÁ USTANOVENÍ`,
      body: [
        'Tato smlouva se řídí právním řádem České republiky, zejména zákonem č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů.',
        disputeClause(d),
        'Smlouva je vyhotovena ve dvou stejnopisech; každá smluvní strana obdrží jedno.',
        'Jakékoli změny nebo doplnění smlouvy jsou platné pouze ve formě písemného, číslovaného a podepsaného dodatku.',
        'Neplatnost jednotlivého ustanovení smlouvy nemá vliv na platnost ostatních ustanovení.',
        d.giftType === 'property'
          ? 'Vlastnické právo k nemovité věci přechází na obdarovaného vkladem do katastru nemovitostí na základě pravomocného rozhodnutí katastrálního úřadu. Upozornění: podpisy obou smluvních stran na darovací smlouvě týkající se nemovitostí musí být úředně ověřeny (notář nebo Czech POINT); bez ověření katastrální úřad návrh na vklad zamítne.'
          : d.giftType === 'car'
          ? 'Vlastnické právo k vozidlu přechází na obdarovaného okamžikem podpisu této smlouvy. Smluvní strany jsou povinny do 10 pracovních dnů od podpisu oznámit změnu vlastníka příslušnému obecnímu úřadu obce s rozšířenou působností a zajistit přepis vozidla v registru silničních vozidel.'
          : 'Vlastnické právo k předmětu daru přechází na obdarovaného okamžikem předání.',
        'Zpracování osobních údajů probíhá v souladu s nařízením EU 2016/679 (GDPR) a zákonem č. 110/2019 Sb. Osobní údaje jsou zpracovávány výhradně za účelem uzavření a plnění tohoto smluvního vztahu.',
        'Žádná ze smluvních stran neodpovídá za nesplnění nepeněžitých povinností způsobené vyšší mocí (vis maior), tj. událostí mimořádnou, nepředvídatelnou a nepřekonatelnou (§ 2913 odst. 2 OZ). Vyšší moc se nevztahuje na povinnost zaplatit peněžitou částku. Strana postižená vyšší mocí je povinna neprodleně písemně informovat druhou stranu a po odpadnutí překážky neprodleně pokračovat v plnění.',
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

  const ipClause = d.ipAssignment === 'full'
    ? 'Veškerá práva duševního vlastnictví k vytvořenému dílu (včetně konceptů, návrhů, zdrojových kódů, dokumentace a všech ostatních výstupů) přecházejí na objednatele okamžikem vytvoření a úplného zaplacení ceny. Zhotovitel se vzdává všech autorských a průmyslových práv k dílu.'
    : 'Zhotovitel si zachovává práva duševního vlastnictví k vytvorenému dílu a uděluje objednateli nevýhradní, časově neomezenou a teritoriálně neomezenou licenci k jeho užívání pro vlastní potřebu (§ 2358 OZ).';

  const premiumContent: ContractSection[] = hasPremiumClauses ? [
    {
      title: 'VIII. PRÁVA DUŠEVNÍHO VLASTNICTVÍ',
      body: [ipClause],
    },
    {
      title: 'IX. VÍCEPRÁCE A ZMĚNY ROZSAHU',
      body: [
        `Vícepráce (tj. práce nad rámec sjednaného rozsahu díla) může zhotovitel provést pouze na základě písemného odsouhlasení objednatelem, a to formou číslovaného Změnového listu podepsaného oběma stranami (§ 2597 OZ).`,
        'Ústní dohody o rozšíření rozsahu díla jsou neúčinné.',
        'Každý Změnový list musí obsahovat: popis víceprací, jejich cenu a dopad na harmonogram.',
        'Zhotovitel nemá nárok na úhradu nepovolených víceprací.',
      ],
    },
    {
      title: 'X. POJIŠTĚNÍ A ODPOVĚDNOST ZA ŠKODU',
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
      title: 'PREAMBULE',
      body: [
        'Tato smlouva o dílo (dále jen „smlouva") je uzavírána podle § 2586 a násl. zákona č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů (dále jen „OZ").',
        `Datum uzavření smlouvy: ${d.contractDate ? formatDate(d.contractDate) : today()}`,
      ],
    },
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Objednatel: ${asText(d.clientName)}, IČO: ${asText(d.clientRegNo, '—')}, adresa: ${asText(d.clientAddress)}`,
        d.clientEmail ? `E-mail objednatele: ${asText(d.clientEmail)}` : '',
        `Zhotovitel: ${asText(d.contractorName)}, IČO: ${asText(d.contractorRegNo, '—')}, adresa: ${asText(d.contractorAddress)}`,
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
        d.bankAccount ? `Bankovní spojení zhotovitele: ${asText(d.bankAccount)}, VS: ${asText(d.variableSymbol, '—')}.` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'IV. HARMONOGRAM A TERMÍNY PLNĚNÍ',
      body: [
        `Zahájení prací: ${formatDate(d.startDate, 'neuvedeno')}`,
        `Dokončení a předání díla nejpozději dne: ${formatDate(d.endDate, 'neuvedeno')}`,
        d.milestones ? `Průběžné milníky: ${asText(d.milestones)}` : '',
        'Termíny jsou závazné. Zhotovitel je povinen neprodleně informovat objednatele o okolnostech, které by mohly ohrozit jejich splnění.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'V. ODPOVĚDNOST ZA VADY, ZÁRUKA A SMLUVNÍ SANKCE',
      body: [
        `Záruka za jakost díla: ${asText(d.warrantyMonths, '24')} měsíců od řádného předání a akceptace díla (§ 2619 OZ). Záruční lhůta počíná běžet ode dne podpisu předávacího protokolu. Upozornění: u stavebního díla (stavba, přístavba, nástavba, rekonstrukce) platí zákonná minimální záruční lhůta 5 let — tj. 60 měsíců (§ 2629 OZ); smluvní záruční lhůta nesmí být kratší.`,
        `Smluvní pokuta za prodlení zhotovitele s předáním díla: ${asText(d.delayPenaltyPerDay, '0,05')} % z celkové ceny díla za každý den prodlení, max. ${asText(d.maxPenaltyPercent, '15')} % z ceny díla. Smluvní pokuta se neuplatní, bylo-li prodlení způsobeno výlučně okolností vyšší moci nebo prodlením objednatele s poskytnutím součinnosti.`,
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
          : 'Odstoupení od smlouvy se řídí ustanoveními § 2001 a násl. OZ.',
        'Odstoupení od smlouvy musí být provedeno písemnou formou a doručeno druhé straně. Účinky odstoupení nastávají dnem doručení písemného projevu vůle.',
        'Odstoupení od smlouvy o dílo se týká pouze dosud nesplněné části; zhotovitel je oprávněn požadovat přiměřenou úhradu za řádně provedenou část díla ke dni účinnosti odstoupení (§ 2005 odst. 2 OZ).',
        // BUG FIX: premiumContent jsou ContractSection objekty, nikoli stringy —
        // nesmí být uvnitř body[]. Patří pouze jako ...premiumContent níže.
      ].filter(Boolean) as string[],
    },
    ...premiumContent,
    {
      title: `${hasPremiumClauses ? 'XI' : 'VIII'}. ZÁVĚREČNÁ USTANOVENÍ`,
      body: [
        'Tato smlouva se řídí právním řádem České republiky, zejména zákonem č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů.',
        disputeClause(d),
        'Smlouva je vyhotovena ve dvou stejnopisech; každá smluvní strana obdrží jedno.',
        'Změny smlouvy jsou platné pouze ve formě písemných, číslovaných a podepsaných dodatků.',
        'Neplatnost jednotlivého ustanovení smlouvy nemá vliv na platnost ostatních ustanovení.',
        'Zpracování osobních údajů probíhá v souladu s nařízením EU 2016/679 (GDPR) a zákonem č. 110/2019 Sb. Osobní údaje jsou zpracovávány výhradně za účelem uzavření a plnění tohoto smluvního vztahu.',
        'Žádná ze smluvních stran neodpovídá za nesplnění nepeněžitých povinností způsobené vyšší mocí (vis maior), tj. událostí mimořádnou, nepředvídatelnou a nepřekonatelnou (§ 2913 odst. 2 OZ). Vyšší moc se nevztahuje na povinnost zaplatit peněžitou částku. Strana postižená vyšší mocí je povinna neprodleně písemně informovat druhou stranu a po odpadnutí překážky neprodleně pokračovat v plnění.',
      ],
    },
  ];

  sections.push({
    title: `${hasPremiumClauses ? 'XII' : 'IX'}. PODPISY`,
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
      : `Bankovním převodem na účet prodávajícího č. ${asText(d.bankAccount, 'neuvedeno')}, VS: ${asText(d.variableSymbol, '—')}, do ${asText(d.paymentDueDays, '3')} pracovních dnů od podpisu smlouvy.`;

  const ownershipTransfer =
    d.ownershipTransferMoment === 'payment'
      ? 'Vlastnické právo přechází na kupujícího okamžikem úplné úhrady kupní ceny.'
      : 'Vlastnické právo přechází na kupujícího okamžikem fyzického předání vozidla.';

  const premiumContent: ContractSection[] = hasPremiumClauses ? [
    {
      title: 'VI. PODROBNÝ STAV VOZIDLA A PŘEDÁVANÉ DOKLADY',
      body: [
        `Barva vozidla: ${asText(d.carColor, 'neuvedeno')}, typ paliva: ${asText(d.fuelType, 'neuvedeno')}, objem motoru: ${asText(d.engineCapacity, 'neuvedeno')} ccm, výkon: ${asText(d.powerKW, 'neuvedeno')} kW.`,
        `Platnost STK do: ${asText(d.stkValidUntil, 'neuvedeno')}, platnost emisí do: ${asText(d.emissionsValidUntil, 'neuvedeno')}.`,
        `Počet předchozích vlastníků: ${asText(d.previousOwnersCount, 'neuvedeno')}, původ vozidla: ${asText(d.vehicleOrigin, 'neuvedeno')}.`,
        `Servisní kniha / historie: ${d.serviceHistory ? 'ano, předávána spolu s vozidlem' : 'není k dispozici'}.`,
        `Historie havárie: ${d.accidentHistory ? 'vozidlo bylo havarované, opravy dle servisní dokumentace' : 'prodávající prohlašuje, že mu není známa žádná havárie ani závažná oprava karoserie'}.`,
        `Předávaná výbava a příslušenství: ${asText(d.equipmentIncluded, 'Dle fyzického stavu při předání')}.`,
        `Pneumatiky: ${asText(d.tiresInfo, 'neuvedeno')}.`,
        `Předávané doklady: ${asText(d.documentsIncluded, 'Velký technický průkaz, Osvědčení o registraci vozidla (malý TP)')}`,
        `Počet předaných klíčů: ${asText(d.keysCount, 'neuvedeno')}.`,
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
      title: 'PREAMBULE',
      body: [
        'Tato kupní smlouva (dále jen „smlouva") je uzavírána podle § 2079 a násl. zákona č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů (dále jen „OZ").',
        `Datum uzavření smlouvy: ${d.contractDate ? formatDate(d.contractDate) : today()}`,
      ],
    },
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Prodávající: ${asText(d.sellerName)}, nar./IČO: ${asText(d.sellerId, '—')}, bytem/sídlo: ${asText(d.sellerAddress)}`,
        d.sellerOP ? `Číslo OP prodávajícího: ${asText(d.sellerOP)}` : '',
        d.sellerEmail ? `E-mail prodávajícího: ${asText(d.sellerEmail)}` : '',
        d.sellerPhone ? `Telefon prodávajícího: ${asText(d.sellerPhone)}` : '',
        `Kupující: ${asText(d.buyerName)}, nar./IČO: ${asText(d.buyerId, '—')}, bytem/sídlo: ${asText(d.buyerAddress)}`,
        d.buyerOP ? `Číslo OP kupujícího: ${asText(d.buyerOP)}` : '',
        d.buyerEmail ? `E-mail kupujícího: ${asText(d.buyerEmail)}` : '',
        d.buyerPhone ? `Telefon kupujícího: ${asText(d.buyerPhone)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. PŘEDMĚT KOUPĚ',
      body: [
        `Předmětem koupě je motorové vozidlo tovární značky ${asText(d.carMake, 'neuvedeno')}, model ${asText(d.carModel, 'neuvedeno')}.`,
        `VIN (číslo karoserie): ${asText(d.carVIN, 'neuvedeno')}, SPZ: ${asText(d.carPlate, 'neuvedeno')}`,
        `Stav tachometru ke dni podpisu: ${formatAmount(d.carMileage)} km. Rok výroby: ${asText(d.carYear, 'neuvedeno')}.`,
        d.carFirstRegistration ? `Datum první registrace: ${asText(d.carFirstRegistration)}.` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. KUPNÍ CENA, PLATBA A PŘECHOD VLASTNICTVÍ',
      body: [
        `Kupní cena vozidla je sjednána ve výši ${formatAmount(d.priceAmount ?? d.purchasePrice)} Kč${d.priceWords ? ` (slovy: ${d.priceWords})` : ''}.`,
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
        d.isPledged
          ? 'Prodávající uvádí, že na vozidle VÁŽE zástavní právo — podrobnosti jsou sjednány samostatně nebo jsou součástí příloh.'
          : 'Prodávající prohlašuje, že vozidlo NENÍ předmětem žádného zástavního práva.',
        d.isInLeasing
          ? 'Prodávající uvádí, že vozidlo JE předmětem leasingu nebo jiného závazku vůči finanční instituci — podrobnosti sjednány samostatně.'
          : 'Prodávající prohlašuje, že vozidlo NENÍ předmětem leasingu ani jiného závazku vůči finanční instituci.',
        d.hasThirdPartyRights
          ? 'Na vozidlo VÁŽÍ práva třetích osob — podrobnosti sjednány samostatně.'
          : 'Prodávající prohlašuje, že na vozidlo NEVÁŽÍ žádná práva třetích osob.',
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
        'Kupující je povinen po převzetí vozidla provést jeho přiměřenou prohlídku a zjevné vady oznámit prodávajícímu písemně bez zbytečného odkladu, nejpozději do 5 pracovních dnů od převzetí (§ 2104 OZ). Práva z vad zjistitelných při přiměřené prohlídce, která nebyla řádně a včas oznámena, nemusí soud přiznat.',
      ],
    },
    ...premiumContent,
    {
      title: `${hasPremiumClauses ? 'IX' : 'VI'}. ZÁVĚREČNÁ USTANOVENÍ`,
      body: [
        'Tato smlouva se řídí právním řádem České republiky, zejména zákonem č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů.',
        disputeClause(d),
        'Smlouva je vyhotovena ve dvou stejnopisech; každá smluvní strana obdrží jedno.',
        'Veškeré změny smlouvy jsou platné pouze ve formě písemných, číslovaných a podepsaných dodatků.',
        'Neplatnost jednotlivého ustanovení smlouvy nemá vliv na platnost ostatních ustanovení.',
        'Zpracování osobních údajů probíhá v souladu s nařízením EU 2016/679 (GDPR) a zákonem č. 110/2019 Sb. Osobní údaje jsou zpracovávány výhradně za účelem uzavření a plnění tohoto smluvního vztahu.',
        'Žádná ze smluvních stran neodpovídá za nesplnění nepeněžitých povinností způsobené vyšší mocí (vis maior), tj. událostí mimořádnou, nepředvídatelnou a nepřekonatelnou (§ 2913 odst. 2 OZ). Vyšší moc se nevztahuje na povinnost zaplatit peněžitou částku. Strana postižená vyšší mocí je povinna neprodleně písemně informovat druhou stranu a po odpadnutí překážky neprodleně pokračovat v plnění.',
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
  const propertyLayout = asText(d.propertyLayout || d.flatLayout, 'neuvedeno');
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
          ? `určitou, a to do ${formatDate(d.endDate, 'neuvedeno')}`
          : 'určitou do ____________';

  const monthlyTotal = (Number(d.rentAmount || 0) + Number(utilitiesAmount || 0)).toString();

  const premiumContent: ContractSection[] = hasPremiumClauses ? [
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
        'Nájemce odpovídá pronajímateli za škodu způsobenou na předmětu nájmu, na zařízení bytu, na společných částech domu i na majetku třetích osob, a to v souladu s § 2913 a násl. OZ. Způsobili-li škodu osoby, které nájemce vpustil do bytu (návštěvy, podnájemci, zhotovitelé nájemce), odpovídá za tuto škodu nájemce jako by ji způsobil sám.',
        'Nad rámec zákonné odpovědnosti se nájemce zavazuje, že na vlastní náklady sjedná a po celou dobu trvání nájmu udržuje pojištění domácnosti zahrnující: (a) odpovědnost za škodu způsobenou třetím osobám při užívání bytu, a to s pojistným limitem min. 500 000 Kč, (b) pojištění věcí v bytě. Doklad o pojištění předloží nájemce na výzvu pronajímatele do 7 dnů.',
        'Smluvní strany se dohodly, že při ukončení nájmu pronajímatel provede soupis škod přesahujících obvyklé opotřebení a předloží nájemci písemný přehled s vyčíslenou náhradou. Nájemce je povinen tuto náhradu uhradit do 14 dnů od doručení přehledu, jinak je pronajímatel oprávněn provést zápočet vůči složené jistotě.',
        'Je-li výše škody sporná a přesahuje-li odhadovaná škoda 10 000 Kč, může pronajímatel navrhnout posouzení škody soudním znalcem. Náklady znalce nese ta strana, jejíž odhad výše škody se od znaleckého posudku odchýlil o více než 30 %. Nedohodnou-li se strany jinak, zálohu na znalce hradí pronajímatel jako navrhovatel.',
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
      title: 'PREAMBULE',
      body: [
        'Tato nájemní smlouva (dále jen „smlouva") je uzavírána podle § 2201 a násl. zákona č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů (dále jen „OZ"), a v souladu s § 2235 a násl. OZ (nájem bytu).',
        `Datum uzavření smlouvy: ${d.contractDate ? formatDate(d.contractDate) : today()}`,
      ],
    },
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Pronajímatel: ${asText(d.landlordName)}, nar./IČO: ${asText(d.landlordId, '—')}, bytem/sídlo: ${asText(d.landlordAddress)}`,
        d.landlordOP ? `Číslo OP pronajímatele: ${asText(d.landlordOP)}` : '',
        d.landlordEmail ? `E-mail pronajímatele: ${asText(d.landlordEmail)}` : '',
        d.landlordPhone ? `Telefon pronajímatele: ${asText(d.landlordPhone)}` : '',
        `Nájemce: ${asText(d.tenantName)}, nar./IČO: ${asText(d.tenantId, '—')}, bytem/sídlo: ${asText(d.tenantAddress)}`,
        d.tenantOP ? `Číslo OP nájemce: ${asText(d.tenantOP)}` : '',
        d.tenantEmail ? `E-mail nájemce: ${asText(d.tenantEmail)}` : '',
        d.tenantPhone ? `Telefon nájemce: ${asText(d.tenantPhone)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. PŘEDMĚT NÁJMU',
      body: [
        `Pronajímatel přenechává nájemci za úplatu do dočasného užívání byt nacházející se na adrese: ${propertyAddress}.`,
        `Dispozice: ${propertyLayout}.`,
        d.flatUnitNumber ? `Číslo bytové jednotky: ${asText(d.flatUnitNumber)}.` : '',
        d.cadastralArea ? `Katastrální území: ${asText(d.cadastralArea)}, číslo parcely: ${asText(d.parcelNumber, 'neuvedeno')}.` : '',
        d.ownershipSheet ? `List vlastnictví č.: ${asText(d.ownershipSheet)}.` : '',
        d.floor ? `Podlaží: ${asText(d.floor)}.` : '',
        d.approxArea ? `Přibližná podlahová plocha: ${asText(d.approxArea)} m².` : '',
        'Pronajímatel prohlašuje, že je oprávněn byt přenechat do nájmu, a že na bytě neváznou práva třetích osob ani jiné právní vady, které by bránily řádnému užívání nájemcem.',
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
        `Pronajímatel je oprávněn navrhnout zvýšení nájemného, a to nejdříve po uplynutí 12 měsíců od posledního zvýšení, nejvýše o ${asText(d.maxRentIncrease, '10')} % ročně. Návrh musí být nájemci doručen písemně. Nesouhlasí-li nájemce se zvýšením do 2 měsíců od doručení návrhu, je pronajímatel oprávněn se do 3 měsíců od uplynutí této lhůty domáhat určení výše nájemného u soudu (§ 2249 OZ).`,
        'Elektřina a plyn odebírané přímo nájemcem na základě vlastní smlouvy s dodavatelem nejsou součástí výše uvedených záloh na služby a hradí je nájemce samostatně.',
        'V případě prodlení nájemce s úhradou nájemného nebo zálohy na služby je pronajímatel oprávněn požadovat zákonný úrok z prodlení ve výši stanovené nařízením vlády č. 351/2013 Sb., a to ode dne splatnosti do dne úhrady.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'V. JISTOTA (KAUCE)',
      body: [
        `Nájemce je povinen před převzetím bytu (nejpozději při podpisu smlouvy) složit pronajímateli peněžitou jistotu ve výši ${formatAmount(d.depositAmount)} Kč${(d.depositAmount && d.rentAmount && Number(d.rentAmount) > 0) ? ` (tj. ${Math.round(Number(d.depositAmount) / Number(d.rentAmount))}× měsíční nájemné)` : ''}.`,
        'Jistota slouží k zajištění pohledávek pronajímatele vzniklých z nájmu (dlužné nájemné a zálohy, náhrada škody, náklady nezbytné opravy či uvedení bytu do původního stavu, smluvní pokuty).',
        'Pronajímatel je povinen vrátit jistotu nebo její nevyčerpanou část nájemci nejpozději do 1 měsíce od skončení nájmu a vyklizení bytu, a to s úroky ve výši zákonné sazby (§ 2254 odst. 2 OZ), po odečtení prokázaných pohledávek pronajímatele.',
        'Pronajímatel je oprávněn z jistoty odečíst pouze pohledávky, o nichž nájemce přijal nebo o nichž bylo pravomocně rozhodnuto. O provedeném zápočtu je pronajímatel povinen nájemce písemně informovat.',
      ],
    },
    {
      title: 'VI. PRAVIDLA UŽÍVÁNÍ BYTU',
      body: [
        d.maxOccupants ? `Maximální počet osob trvale užívajících byt je ${asText(d.maxOccupants)} (vč. nájemce). Nájemce je oprávněn přijmout do bytu dalšího člena své domácnosti; je povinen tuto skutečnost bez zbytečného odkladu písemně oznámit pronajímateli spolu se jménem a trvalým bydlištěm nové osoby (§ 2272 OZ). Souhlas pronajímatele se nevyžaduje pro osoby blízké ve smyslu § 22 OZ.` : '',
        `Domácí zvířata: ${d.allowPets ? 'povolena, nájemce odpovídá za veškeré škody jimi způsobené' : 'zakázána bez předchozího písemného souhlasu pronajímatele'}.`,
        `Kouření v bytě a společných prostorách: ${d.allowSmoking ? 'povoleno' : 'zakázáno'}.`,
        `Krátkodobé ubytování třetích osob za úplatu prostřednictvím platforem (Airbnb, Booking.com apod.) se považuje za podnájem a je ${d.allowAirbnb ? 'sjednáno jako povolené; nájemce odpovídá za veškeré škody a je povinen splnit zákonné povinnosti provozovatele ubytování' : 'zakázáno bez předchozího písemného souhlasu pronajímatele'}.`,
        `Podnikatelská a pracovní činnost v bytě: ${d.businessUseAllowed ? 'povolena za podmínky, že nezvyšuje opotřebení bytu ani domu nad obvyklou míru a neobtěžuje ostatní obyvatele domu' : 'dovolena pouze tehdy, nezvyšuje-li opotřebení bytu ani domu nad obvyklou míru a neobtěžuje-li ostatní obyvatele; činnosti, které tato kritéria nesplňují, vyžadují předchozí písemný souhlas pronajímatele (§ 2255 OZ)'}.`,
        d.inspectionAllowed
          ? 'Pronajímatel je oprávněn po předchozím písemném (e-mailovém) oznámení s předstihem min. 24 hodin zkontrolovat stav bytu; kontrola nesmí být prováděna nevhodným způsobem (§ 2219 OZ).'
          : 'Právo pronajímatele vstoupit do bytu se řídí zákonnou úpravou (§ 2219 OZ).',
        d.strictPenalties
          ? 'Pronajímatel je oprávněn nájemci písemně vytknout závažné nebo opakované porušování povinností (zejm. narušování klidu, znečišťování společných prostor, poškozování nemovitosti) a vyzvat ho k nápravě. Neodstraní-li nájemce závadný stav, může pronajímatel dát výpověď z nájmu z důvodu hrubého porušování povinností (§ 2288 odst. 1 písm. a) OZ) nebo — dosahuje-li porušení zvlášť závažné intenzity poškozující pronajímatele nebo jiné obyvatele domu — výpověď bez výpovědní doby (§ 2291 OZ).'
          : '',
        'Nájemce je povinen: řádně udržovat byt a zařízení v provozuschopném stavu, bez zbytečného odkladu hlásit pronajímateli závady a havárie, umožnit nezbytné opravy, hradit drobné opravy a náklady spojené s běžnou údržbou (§ 2257 OZ), neprovádět stavební úpravy bez souhlasu pronajímatele.',
        'Nájemce je oprávněn přenechat část bytu do podnájmu jiné osobě za podmínky, že v bytě sám trvale bydlí, a to po předchozím písemném souhlasu pronajímatele (§ 2274 OZ). Přenechat byt v celku do podnájmu bez souhlasu pronajímatele je zakázáno. Nájemce, který v bytě sám netrvale bydlí, nesmí přenechat žádnou jeho část třetí osobě bez souhlasu pronajímatele.',
        'Nájemci je doporučeno sjednat pojištění domácnosti zahrnující odpovědnost za škodu způsobenou třetím osobám při užívání bytu (min. limit 500 000 Kč). Doklad o pojištění předloží nájemce na výzvu pronajímatele do 7 dnů.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'VII. PŘEDÁNÍ BYTU A PŘEDÁVACÍ PROTOKOL',
      body: [
        d.keysCount ? `Pronajímatel předá nájemci klíče v počtu ${asText(d.keysCount)} ks (včetně klíčů od vchodových dveří, schránky a dalšího příslušenství dle předávacího protokolu).` : '',
        'Nájemce není oprávněn zhotovovat kopie klíčů bez předchozího souhlasu pronajímatele. V případě ztráty nebo odcizení klíčů je nájemce povinen tuto skutečnost bez zbytečného odkladu písemně oznámit pronajímateli. Náklady na výměnu cylindrické vložky nebo zámku hradí v takovém případě nájemce.',
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
    {
      title: 'X. DORUČOVÁNÍ PÍSEMNOSTÍ',
      body: [
        `Písemnosti pronajímateli budou doručovány na adresu: ${asText(d.landlordAddress)}, případně na e-mail: ${asText(d.landlordEmail, 'neuvedeno')}.`,
        `Písemnosti nájemci budou doručovány na adresu pronajatého bytu: ${propertyAddress}, případně na e-mail: ${asText(d.tenantEmail, 'neuvedeno')}.`,
        'Písemnost se považuje za doručenou: (a) osobním předáním, (b) dnem doručení doporučenou zásilkou, nebo (c) 3. dnem po odeslání e-mailu, nevykazuje-li automatická zpráva o nedoručení.',
        'V případě, že adresát odmítne zásilku převzít nebo si ji nevyzvedne, má se za doručenou 10. dnem uložení u doručovatele.',
      ],
    },
    ...premiumContent,
    {
      title: `${hasPremiumClauses ? 'XV' : 'XI'}. ZÁVĚREČNÁ USTANOVENÍ`,
      body: [
        'Tato smlouva se řídí právním řádem České republiky, zejména zákonem č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů, a zákonem č. 67/2013 Sb. (vyúčtování služeb).',
        disputeClause(d),
        'Smlouva je vyhotovena ve dvou stejnopisech; každá smluvní strana obdrží jedno.',
        'Změny jsou platné pouze ve formě písemných, číslovaných a podepsaných dodatků.',
        'Neplatnost jednotlivého ustanovení smlouvy nemá vliv na platnost ostatních ustanovení.',
        'Přílohou č. 1 smlouvy je předávací protokol, který tvoří nedílnou součást smlouvy.',
        'Změna vlastníka pronajaté věci sama o sobě nájemní vztah neruší; nabyvatel vstupuje do práv a povinností pronajímatele ode dne nabytí vlastnictví (§ 2221 OZ).',
        'Zpracování osobních údajů probíhá v souladu s nařízením EU 2016/679 (GDPR) a zákonem č. 110/2019 Sb. Osobní údaje jsou zpracovávány výhradně za účelem uzavření a plnění tohoto smluvního vztahu.',
        'Žádná ze smluvních stran neodpovídá za nesplnění nepeněžitých povinností způsobené vyšší mocí (vis maior), tj. událostí mimořádnou, nepředvídatelnou a nepřekonatelnou (§ 2913 odst. 2 OZ). Vyšší moc se nevztahuje na povinnost zaplatit peněžitou částku. Strana postižená vyšší mocí je povinna neprodleně písemně informovat druhou stranu a po odpadnutí překážky neprodleně pokračovat v plnění.',
      ],
    },
  ];

  sections.push({
    title: `${hasPremiumClauses ? 'XVI' : 'XII'}. PODPISY`,
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
      `2. PŘEDANÉ KLÍČE: celkem ${asText(d.keysCount, '?')} ks (bytové: ___ ks, domovní: ___ ks, schránka: ___ ks, sklep: ___ ks)`,
      '',
      '3. PŘEDÁVANÉ VYBAVENÍ A INVENTÁŘ:',
      `   ${asText(d.equipmentList, 'Bez vybavení / dle přiloženého soupisu')}`,
      '',
      '4. STAV MÍSTNOSTÍ (zakroužkujte u každé místnosti: VÝBORNÝ / DOBRÝ / PŘIJATELNÝ / VYŽADUJE OPRAVY):',
      '   Obývací pokoj:    VÝBORNÝ  /  DOBRÝ  /  PŘIJATELNÝ  /  VYŽADUJE OPRAVY',
      '   Poznámky: _________________________________________________________________',
      '   Ložnice:          VÝBORNÝ  /  DOBRÝ  /  PŘIJATELNÝ  /  VYŽADUJE OPRAVY',
      '   Poznámky: _________________________________________________________________',
      '   Kuchyně:          VÝBORNÝ  /  DOBRÝ  /  PŘIJATELNÝ  /  VYŽADUJE OPRAVY',
      '   Poznámky: _________________________________________________________________',
      '   Koupelna:         VÝBORNÝ  /  DOBRÝ  /  PŘIJATELNÝ  /  VYŽADUJE OPRAVY',
      '   Poznámky: _________________________________________________________________',
      '   WC:               VÝBORNÝ  /  DOBRÝ  /  PŘIJATELNÝ  /  VYŽADUJE OPRAVY',
      '   Poznámky: _________________________________________________________________',
      '   Chodba/předsíň:   VÝBORNÝ  /  DOBRÝ  /  PŘIJATELNÝ  /  VYŽADUJE OPRAVY',
      '   Poznámky: _________________________________________________________________',
      '   Sklep/komora/lodžie (je-li součástí): VÝBORNÝ  /  DOBRÝ  /  PŘIJATELNÝ  /  VYŽADUJE OPRAVY',
      '   Poznámky: _________________________________________________________________',
      '',
      '5. ZJIŠTĚNÉ VADY, POŠKOZENÍ A POZNÁMKY (nad rámec jednotlivých místností):',
      `   ${asText(d.knownDefects, 'Bez zjevných vad a poškození nad rámec běžného opotřebení.')}`,
      '',
      '6. CELKOVÝ STAV BYTU (zakroužkujte):    VÝBORNÝ  /  DOBRÝ  /  PŘIJATELNÝ  /  VYŽADUJE OPRAVY',
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
      : 'Zápůjčka je sjednána jako bezúplatná (bezúročná). Vydlužitel je povinen vrátit věřiteli pouze zapůjčenou jistinu (§ 2390 odst. 1 OZ).';

  const repaymentDesc =
    d.repaymentType === 'installments'
      ? `Vydlužitel se zavazuje vrátit zápůjčku v ${asText(d.installmentCount, 'neuvedeno')} pravidelných měsíčních ${Number(d.installmentCount) === 1 ? 'splátce' : 'splátkách'} po ${formatAmount(d.installmentAmount)} Kč, ${Number(d.installmentCount) === 1 ? 'splatné' : 'splatných vždy'} ${asText(d.paymentDay, '15')}. dne ${Number(d.installmentCount) === 1 ? 'příslušného' : 'každého'} měsíce, počínaje ${formatDate(d.firstPaymentDate, 'neuvedeno')}.`
      : `Vydlužitel se zavazuje vrátit celou zápůjčku jednorázově nejpozději dne ${formatDate(d.repaymentDate, 'neuvedeno')}.`;

  const premiumContent: ContractSection[] = hasPremiumClauses ? [
    {
      title: 'VI. ZAJIŠTĚNÍ POHLEDÁVKY',
      body: [
        d.securityType === 'guarantee'
          ? `Závazek vydlužitele je zajištěn osobním ručením třetí osoby: ${asText(d.guarantorName, 'neuvedeno')}, nar. ${asText(d.guarantorId, 'neuvedeno')}, bytem ${asText(d.guarantorAddress, 'neuvedeno')}. Ručitel se zavazuje splnit závazek vydlužitele v případě, že tak vydlužitel neučiní.`
          : d.securityType === 'pledge'
          ? `Závazek vydlužitele je zajištěn zástavním právem k věci: ${asText(d.pledgeDescription, 'neuvedeno')}. Zástavní smlouva je sepsána samostatně.`
          : d.securityType === 'bill'
          ? 'Závazek vydlužitele je zajištěn vlastní směnkou vystavenou vydlužitelem na věřitele, splatnou ke dni splatnosti zápůjčky.'
          : 'Zápůjčka je poskytnuta bez zvláštního zajištění.',
        'V případě nesplacení pohledávky je věřitel oprávněn uplatnit zajišťovací instrumenty v souladu s platnými právními předpisy.',
      ],
    },
    {
      title: 'VII. PŘEDČASNÉ SPLACENÍ, ZRYCHLENÍ SPLATNOSTI A POSTOUPENÍ',
      body: [
        'Vydlužitel je oprávněn zápůjčku nebo její část splatit předčasně bez sankcí, pokud je zápůjčka bezúročná.',
        d.interestRate && Number(d.interestRate) > 0
          ? `Při předčasném splacení úročené zápůjčky je vydlužitel povinen zaplatit věřiteli poplatek ve výši ${asText(d.prepaymentFee, '1')} % z předčasně splacené jistiny.`
          : '',
        'Věřitel je oprávněn prohlásit celou zbývající jistinu zápůjčky okamžitě splatnou, nezaplatí-li vydlužitel 2 po sobě jdoucí splátky nebo poruší-li jinou podstatnou povinnost ze smlouvy (§ 2399 OZ).',
        'Věřitel je oprávněn postoupit svou pohledávku třetí osobě; vydlužitel s tím souhlasí.',
      ].filter(Boolean) as string[],
    },
  ] : [];

  const sections: ContractSection[] = [
    {
      title: 'PREAMBULE',
      body: [
        'Tato smlouva o zápůjčce (dále jen „smlouva") je uzavírána podle § 2390 a násl. zákona č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů (dále jen „OZ").',
        `Datum uzavření smlouvy: ${d.contractDate ? formatDate(d.contractDate) : today()}`,
      ],
    },
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Věřitel (půjčující): ${asText(d.lenderName)}, nar./IČO: ${asText(d.lenderId, '—')}, bytem/sídlo: ${asText(d.lenderAddress)}`,
        d.lenderEmail ? `E-mail věřitele: ${asText(d.lenderEmail)}` : '',
        `Dlužník (vydlužitel): ${asText(d.borrowerName)}, nar./IČO: ${asText(d.borrowerId, '—')}, bytem/sídlo: ${asText(d.borrowerAddress)}`,
        d.borrowerEmail ? `E-mail dlužníka: ${asText(d.borrowerEmail)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. PŘEDMĚT ZÁPŮJČKY',
      body: [
        `Věřitel přenechává vydlužiteli do vlastnictví peněžní částku ve výši ${formatAmount(d.loanAmount)} Kč${d.loanAmountWords ? ` (slovy: ${d.loanAmountWords})` : ''}.`,
        d.transferMethod === 'transfer'
          ? `Peněžní prostředky budou poukázány bankovním převodem na účet vydlužitele č. ${asText(d.borrowerBankAccount, 'neuvedeno')}, a to do ${asText(d.disbursementDays, '5')} pracovních dnů od podpisu smlouvy.`
          : 'Peněžní prostředky budou předány vydlužiteli v hotovosti při podpisu smlouvy, o čemž bude sepsána stvrzenka.',
        `Účel použití zápůjčky: ${asText(d.loanPurpose, 'není omezen — vydlužitel může použít prostředky libovolně')}.`,
      ],
    },
    {
      title: 'III. ÚROKY A NÁKLADY ZÁPŮJČKY',
      body: [
        interestDesc,
        d.interestRate && Number(d.interestRate) > 0
          ? `Úroky se počítají z nesplacené jistiny a jsou splatné dle sjednaného způsobu splácení. Roční úroková sazba ${asText(d.interestRate)} % odpovídá denní sazbě ${(Number(d.interestRate) / 365).toFixed(4)} %.`
          : 'Věřitel nenárokuje žádné poplatky, provize ani jiné odměny v souvislosti s poskytnutím bezúročné zápůjčky.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'IV. SPLÁCENÍ A SPLATNOST',
      body: [
        repaymentDesc,
        d.bankAccount ? `Platby budou zasílány na bankovní účet věřitele č. ${asText(d.bankAccount)}, VS: ${asText(d.variableSymbol, '—')}.` : '',
        d.repaymentType === 'installments' && d.interestRate && Number(d.interestRate) > 0
          ? 'Každá splátka se použije nejprve na úhradu splatných úroků a teprve zbývající část na snížení jistiny (§ 1932 OZ).'
          : '',
        `Smluvní pokuta za prodlení se splátkou: ${asText(d.latePenaltyRate, '0,05')} % z dlužné částky za každý den prodlení, min. ${asText(d.minLatePenalty, '100')} Kč.`,
        'Věřitel je oprávněn prohlásit celou zbývající jistinu za okamžitě splatnou (ztráta výhody splátek dle § 1977 OZ), prodlí-li vydlužitel se splátkou déle než 30 dnů nebo poruší-li jinou podstatnou povinnost z této smlouvy.',
        'Předčasné splacení části nebo celé jistiny je bez sankcí povoleno, není-li dohodnuto jinak.',
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
        'Smlouva se řídí právním řádem České republiky, zejména zákonem č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů.',
        disputeClause(d),
        'Smlouva je vyhotovena ve dvou stejnopisech; každá strana obdrží jedno.',
        'Změny a doplnění smlouvy jsou platné pouze ve formě písemných, číslovaných a podepsaných dodatků.',
        'Neplatnost jednotlivého ustanovení smlouvy nemá vliv na platnost ostatních ustanovení.',
        'Zpracování osobních údajů probíhá v souladu s nařízením EU 2016/679 (GDPR) a zákonem č. 110/2019 Sb. Osobní údaje jsou zpracovávány výhradně za účelem uzavření a plnění tohoto smluvního vztahu.',
        'Žádná ze smluvních stran neodpovídá za nesplnění nepeněžitých povinností způsobené vyšší mocí (vis maior), tj. událostí mimořádnou, nepředvídatelnou a nepřekonatelnou (§ 2913 odst. 2 OZ). Vyšší moc se nevztahuje na povinnost zaplatit peněžitou částku. Strana postižená vyšší mocí je povinna neprodleně písemně informovat druhou stranu a po odpadnutí překážky neprodleně pokračovat v plnění.',
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
      title: 'VII. ZVLÁŠTNÍ UJEDNÁNÍ — NON-COMPETE A NON-SOLICITATION',
      body: [
        d.nonSolicitation
          ? `Po dobu platnosti smlouvy a ${asText(d.nonSolicitationPeriod, '12 měsíců')} po jejím skončení se Přijímající strana zavazuje nepřetahovat zaměstnance, klíčové obchodní partnery ani zákazníky Poskytující strany.`
          : '',
        d.nonCompete
          ? `Po dobu platnosti smlouvy a ${asText(d.nonCompetePeriod, '12 měsíců')} po jejím skončení se Přijímající strana zavazuje nevyvíjet přímou konkurenční činnost vůči Poskytující straně v oblasti: ${asText(d.nonCompeteScope, 'neuvedeno')}, na území: ${asText(d.nonCompeteTerritory, 'České republiky')}. Zákaz konkurence je věcně, časově i územně vymezen tak, aby byl soudně vymahatelný.`
          : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'VIII. AUDIT A KONTROLA NAKLÁDÁNÍ S INFORMACEMI',
      body: [
        'Poskytující strana má právo kdykoli v průběhu platnosti smlouvy provést audit způsobu uložení a zpracování důvěrných informací u Přijímající strany, a to po předchozím písemném oznámení s předstihem minimálně 5 pracovních dnů.',
        'Přijímající strana je povinna vést evidenci osob, které mají přístup k důvěrným informacím, a tuto evidenci na žádost předložit.',
        'Na žádost Poskytující strany je Přijímající strana povinna přijmout technická nebo organizační opatření ke zvýšení bezpečnosti důvěrných informací.',
      ],
    },
    {
      title: 'IX. ZVLÁŠTNÍ KATEGORIE CHRÁNĚNÝCH INFORMACÍ',
      body: [
        `Mezi zvláště chráněné informace patří zejména: ${asText(d.specialInfoCategories, 'obchodní tajemství, know-how, zdrojové kódy, databáze zákazníků, obchodní plány, finanční výsledky, technické výkresy a specifikace')}`,
        'Přijímající strana je povinna tuto kategorii informací chránit s nejvyšší péčí, minimálně se stejnou úrovní zabezpečením, jakou používá pro ochranu vlastních nejcitlivějších informací.',
      ],
    },
  ] : [];

  const sections: ContractSection[] = [
    {
      title: 'PREAMBULE',
      body: [
        'Tato smlouva o mlčenlivosti a ochraně důvěrných informací (dále jen „NDA" nebo „smlouva") je uzavírána podle § 1724 a násl. zákona č. 89/2012 Sb., občanský zákoník, a § 504 OZ (obchodní tajemství).',
        `Typ NDA: ${ndaType}.`,
        `Datum uzavření smlouvy: ${d.contractDate ? formatDate(d.contractDate) : today()}`,
      ],
    },
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Poskytující strana: ${asText(d.disclosingName)}, IČO/nar.: ${asText(d.disclosingId, '—')}, adresa: ${asText(d.disclosingAddress)}`,
        d.disclosingEmail ? `E-mail: ${asText(d.disclosingEmail)}` : '',
        `Přijímající strana: ${asText(d.receivingName)}, IČO/nar.: ${asText(d.receivingId, '—')}, adresa: ${asText(d.receivingAddress)}`,
        d.receivingEmail ? `E-mail: ${asText(d.receivingEmail)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. DEFINICE DŮVĚRNÝCH INFORMACÍ',
      body: [
        `„Důvěrnými informacemi" se pro účely této smlouvy rozumí veškeré informace, data, dokumenty a materiály označené jako důvěrné nebo jejichž povaha jejich důvěrnost zjevně zakládá, zejména: ${asText(d.confidentialInfoDesc, 'obchodní plány, finanční informace, databáze, know-how, technické specifikace, zdrojové kódy, zákaznické seznamy, výsledky výzkumu a vývoje, marketingové strategie')}.`,
        `Účel zpřístupnění informací: ${asText(d.purposeOfDisclosure, 'neuvedeno')}`,
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
        'e) nepořizovat kopie ani výpisy z důvěrných informací nad rozsah nezbytně nutný pro stanovený účel;',
        'f) neprovádět zpětnou analýzu (reverse engineering), dekompilaci ani jiné technické metody extrakce důvěrných informací z předaných produktů, softwaru nebo materiálů;',
        'g) nevkládat důvěrné informace do systémů umělé inteligence, jazykových modelů ani jiných automatizovaných systémů třetích stran, u nichž nelze zaručit ochranu zpracovávaných dat.',
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
        'Po skončení platnosti smlouvy nebo na písemnou výzvu Poskytující strany je Přijímající strana povinna neprodleně vrátit nebo nevratně zničit veškeré nosiče obsahující důvěrné informace (dokumenty, USB, e-mailové přílohy) a písemně potvrdit provedení.',
        'Smlouva neomezuje Poskytující stranu v uzavírání podobných smluv s dalšími subjekty.',
      ],
    },
    ...premiumContent,
    {
      title: `${hasPremiumClauses ? 'X' : 'VII'}. ZÁVĚREČNÁ USTANOVENÍ`,
      body: [
        'Smlouva se řídí právním řádem České republiky, zejména zákonem č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů.',
        disputeClause(d),
        'Smlouva je vyhotovena ve dvou stejnopisech; každá strana obdrží jedno.',
        'Změny jsou platné pouze ve formě písemných, číslovaných a podepsaných dodatků.',
        'Je-li jakékoli ustanovení smlouvy neplatné nebo nevymahatelné, ostatní ustanovení zůstávají v plné platnosti a účinnosti.',
        'Zpracování osobních údajů probíhá v souladu s nařízením EU 2016/679 (GDPR) a zákonem č. 110/2019 Sb. Osobní údaje jsou zpracovávány výhradně za účelem uzavření a plnění tohoto smluvního vztahu.',
        'Žádná ze smluvních stran neodpovídá za nesplnění nepeněžitých povinností způsobené vyšší mocí (vis maior), tj. událostí mimořádnou, nepředvídatelnou a nepřekonatelnou (§ 2913 odst. 2 OZ). Vyšší moc se nevztahuje na povinnost zaplatit peněžitou částku. Strana postižená vyšší mocí je povinna neprodleně písemně informovat druhou stranu a po odpadnutí překážky neprodleně pokračovat v plnění.',
      ],
    },
  ];

  sections.push({
    title: `${hasPremiumClauses ? 'XI' : 'VIII'}. PODPISY`,
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
      ? `motorové vozidlo tovární značky ${asText(d.carMake)} ${asText(d.carModel)}, VIN: ${asText(d.carVIN, 'neuvedeno')}, SPZ: ${asText(d.carPlate, 'neuvedeno')}, rok výroby: ${asText(d.carYear, 'neuvedeno')}, stav tachometru: ${asText(d.carMileage, 'neuvedeno')} km`
      : d.itemType === 'electronics'
      ? `elektronické zařízení: ${asText(d.itemDescription)}, výrobní číslo / sériové číslo: ${asText(d.serialNumber, 'neuvedeno')}`
      : `${asText(d.itemDescription, 'movitá věc specifikovaná dle dohody smluvních stran')}`;

  const defectsClause = d.knownDefects
    ? `Prodávající upozornil kupujícího na tyto jemu známé vady předmětu prodeje: ${asText(d.knownDefects)}. Kupující tyto vady bere na vědomí a kupní cena je s ohledem na ně sjednána.`
    : 'Prodávající prohlašuje, že mu nejsou známy žádné skryté vady předmětu prodeje nad rámec běžného opotřebení.';

  const paymentDesc =
    d.paymentMethod === 'transfer'
      ? `Kupní cena bude uhrazena bankovním převodem na účet prodávajícího č. ${asText(d.sellerBankAccount, 'neuvedeno')}, VS: ${asText(d.variableSymbol, '—')}, a to do ${asText(d.paymentDays, '5')} pracovních dnů od podpisu smlouvy.`
      : d.paymentMethod === 'escrow'
      ? `Kupní cena bude uhrazena prostřednictvím advokátní/notářské úschovy. Podmínky úschovy jsou sjednány samostatně.`
      : `Kupní cena bude uhrazena v hotovosti při podpisu smlouvy / předání předmětu prodeje.`;

  const warrantyClause = d.warrantyMonths && Number(d.warrantyMonths) > 0
    ? `Prodávající poskytuje kupujícímu smluvní záruku za jakost v délce ${asText(d.warrantyMonths)} měsíců ode dne předání, přesahující zákonný rámec. V záruční době odpovídá prodávající za to, že předmět prodeje bude mít vlastnosti sjednané touto smlouvou.`
    : d.buyerType === 'business'
    ? 'Na předmět prodeje se vztahuje zákonná odpovědnost za vady dle § 2099 a násl. OZ. Právo z vadného plnění musí být uplatněno bez zbytečného odkladu po zjištění vady, nejpozději do 6 měsíců od převzetí (§ 2165 odst. 1 OZ — vztah B2B mezi podnikateli).'
    : 'Na předmět prodeje se vztahuje zákonná odpovědnost za vady dle § 2161 a násl. OZ. Kupující — spotřebitel — je oprávněn uplatnit právo z vady do 24 měsíců od převzetí (§ 2165 odst. 1 OZ). Právo z vadného plnění musí být uplatněno bez zbytečného odkladu po zjištění vady.';

  const premiumContent: ContractSection[] = hasPremiumClauses ? [
    {
      title: 'VI. ROZŠÍŘENÁ ZÁRUKA A REKLAMAČNÍ ŘÍZENÍ',
      body: [
        `Prodávající poskytuje kupujícímu smluvní záruku za jakost v délce ${asText(d.warrantyMonths, '24')} měsíců od převzetí věci, nad rámec zákonné odpovědnosti za vady.`,
        'V záruční době prodávající odpovídá za to, že předmět prodeje: (a) má vlastnosti sjednané smlouvou a obvyklé pro daný typ věci, (b) odpovídá nabídce a popisu při prodeji, (c) není zatížen právy třetích osob, pokud není výslovně dohodnuto jinak.',
        'Kupující má právo na bezplatnou opravu, výměnu věci, přiměřenou slevu z ceny, nebo — je-li vada podstatným porušením smlouvy — na odstoupení od smlouvy (§ 2106 OZ).',
        'Reklamaci je kupující povinen uplatnit písemně u prodávajícího. Prodávající se zavazuje reklamaci vyřídit do 30 dnů od jejího doručení a kupujícího o výsledku písemně informovat.',
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
      title: 'PREAMBULE',
      body: [
        'Tato kupní smlouva (dále jen „smlouva") je uzavírána podle § 2079 a násl. zákona č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů (dále jen „OZ").',
        `Datum uzavření smlouvy: ${d.contractDate ? formatDate(d.contractDate) : today()}`,
      ],
    },
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Prodávající: ${asText(d.sellerName)}, nar./IČO: ${asText(d.sellerId, '—')}, bytem/sídlo: ${asText(d.sellerAddress)}`,
        d.sellerEmail ? `E-mail prodávajícího: ${asText(d.sellerEmail)}` : '',
        d.sellerPhone ? `Telefon prodávajícího: ${asText(d.sellerPhone)}` : '',
        `Kupující: ${asText(d.buyerName)}, nar./IČO: ${asText(d.buyerId, '—')}, bytem/sídlo: ${asText(d.buyerAddress)}`,
        d.buyerEmail ? `E-mail kupujícího: ${asText(d.buyerEmail)}` : '',
        d.buyerPhone ? `Telefon kupujícího: ${asText(d.buyerPhone)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. PŘEDMĚT KUPNÍ SMLOUVY',
      body: [
        `Prodávající se touto smlouvou zavazuje převést na kupujícího vlastnické právo k: ${subjectDesc}.`,
        d.itemCondition ? `Stav předmětu prodeje: ${asText(d.itemCondition)}.` : '',
        'Prodávající prohlašuje, že je oprávněn předmět prodeje převést a že na něm neváznou práva třetích osob, zástavní právo, věcné břemeno ani jiné omezení dispozice, o němž by prodávající věděl.',
        `Kupující se zavazuje předmět koupit a zaplatit za něj kupní cenu.`,
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. KUPNÍ CENA A ZPŮSOB ÚHRADY',
      body: [
        `Kupní cena je sjednána dohodou smluvních stran ve výši ${formatAmount(d.price)} ${asText(d.currency, 'Kč')} (slovy: ${asText(d.priceWords, '')}).`,
        paymentDesc,
        'Vlastnické právo k předmětu prodeje přechází na kupujícího okamžikem úplného zaplacení kupní ceny, není-li dohodnuto jinak.',
      ],
    },
    {
      title: 'IV. PŘEDÁNÍ PŘEDMĚTU PRODEJE',
      body: [
        d.handoverDate
          ? `Prodávající se zavazuje předat předmět prodeje kupujícímu dne ${formatDate(d.handoverDate)} na adrese: ${asText(d.handoverPlace, 'neuvedeno')}.`
          : `Předání předmětu prodeje proběhne dohodnutým způsobem po úhradě kupní ceny.`,
        'O předání bude sepsán předávací protokol podepsaný oběma smluvními stranami.',
        d.itemType === 'car'
          ? 'Prodávající předá kupujícímu: technický průkaz vozidla, osvědčení o registraci vozidla, servisní knihu (je-li k dispozici) a veškeré klíče.'
          : 'Prodávající předá kupujícímu veškerou dokumentaci a příslušenství náležející k předmětu prodeje.',
      ],
    },
    {
      title: 'V. PROHLÍDKA, PŘIJETÍ A ODPOVĚDNOST ZA VADY',
      body: [
        d.itemType === 'car'
          ? 'Kupující prohlašuje, že před podpisem smlouvy měl možnost vozidlo prohlédnout a případně nechat posoudit znalcem nebo autorizovaným servisem. Vady zjistitelné při přiměřené prohlídce nelze uplatnit jako vady skryté (§ 2104 OZ).'
          : 'Kupující prohlašuje, že před podpisem smlouvy měl možnost předmět prodeje prohlédnout. Vady zjistitelné při přiměřené prohlídce nelze uplatnit jako vady skryté (§ 2104 OZ).',
        'Kupující je povinen předmět při převzetí zkontrolovat a zjevné vady oznámit prodávajícímu bez zbytečného odkladu (§ 2104 OZ).',
        defectsClause,
        warrantyClause,
      ],
    },
    ...premiumContent,
    {
      title: `${hasPremiumClauses ? 'VIII' : 'VI'}. ZÁVĚREČNÁ USTANOVENÍ`,
      body: [
        'Smlouva se řídí právním řádem České republiky, zejména zákonem č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů.',
        disputeClause(d),
        'Smlouva je vyhotovena ve dvou stejnopisech; každá smluvní strana obdrží jedno.',
        'Jakékoli změny jsou platné pouze ve formě písemných, číslovaných a podepsaných dodatků.',
        'Neplatnost jednotlivého ustanovení smlouvy nemá vliv na platnost ostatních ustanovení.',
        'Zpracování osobních údajů probíhá v souladu s nařízením EU 2016/679 (GDPR) a zákonem č. 110/2019 Sb. Osobní údaje jsou zpracovávány výhradně za účelem uzavření a plnění tohoto smluvního vztahu.',
        'Žádná ze smluvních stran neodpovídá za nesplnění nepeněžitých povinností způsobené vyšší mocí (vis maior), tj. událostí mimořádnou, nepředvídatelnou a nepřekonatelnou (§ 2913 odst. 2 OZ). Vyšší moc se nevztahuje na povinnost zaplatit peněžitou částku. Strana postižená vyšší mocí je povinna neprodleně písemně informovat druhou stranu a po odpadnutí překážky neprodleně pokračovat v plnění.',
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
    ? `na dobu určitou do ${formatDate(d.endDate, 'neuvedeno')} (§ 39 ZP)`
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
        'Za škodu způsobenou zaměstnancem porušením povinnosti mlčenlivosti odpovídá zaměstnanec v rozsahu stanoveném § 257 ZP. V případě úmyslného způsobení škody nebo škody způsobené pod vlivem alkoholu nebo jiných návykových látek odpovídá zaměstnanec za škodu v plném rozsahu (§ 257 odst. 3 ZP). Poznámka: smluvní pokuta k tíži zaměstnance se v pracovněprávním vztahu nesjednává (§ 346d ZP).',
      ],
    },
  ] : [];

  const sections: ContractSection[] = [
    {
      title: 'PREAMBULE',
      body: [
        'Tato pracovní smlouva (dále jen „smlouva") je uzavírána podle § 34 a násl. zákona č. 262/2006 Sb., zákoník práce, ve znění pozdějších předpisů (dále jen „ZP").',
        `Datum uzavření smlouvy: ${d.contractDate ? formatDate(d.contractDate) : today()}`,
      ],
    },
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Zaměstnavatel: ${asText(d.employerName)}, IČO: ${asText(d.employerIco, '—')}, sídlo: ${asText(d.employerAddress)}`,
        d.employerEmail ? `E-mail zaměstnavatele: ${asText(d.employerEmail)}` : '',
        `Zaměstnanec: ${asText(d.employeeName)}, nar.: ${asText(d.employeeBirth, '—')}, bytem: ${asText(d.employeeAddress)}`,
        d.employeeEmail ? `E-mail zaměstnance: ${asText(d.employeeEmail)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. DRUH A MÍSTO VÝKONU PRÁCE',
      body: [
        `Druh práce (pracovní pozice): ${asText(d.jobTitle, 'neuvedeno')}`,
        `Popis pracovní náplně: ${asText(d.jobDescription, 'dle aktuálního popisu pracovního místa')}`,
        `Místo výkonu práce: ${asText(d.workPlace, 'neuvedeno')}`,
        d.remoteWork ? `Možnost práce na dálku (home office): ${asText(d.remoteWork)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. VZNIK PRACOVNÍHO POMĚRU A TRVÁNÍ',
      body: [
        `Pracovní poměr vzniká dnem nástupu do práce: ${formatDate(d.startDate, 'neuvedeno')}`,
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
        'b) dodržovat předpisy BOZP, pracovní řád zaměstnavatele a absolvovat zákonem vyžadovaná školení BOZP (§ 103 ZP); zaměstnavatel je povinen tato školení zajistit na svůj náklad,',
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
        'Pracovní smlouva se řídí zákonem č. 262/2006 Sb., zákoník práce, ve znění pozdějších předpisů, a subsidiárně zákonem č. 89/2012 Sb., občanský zákoník.',
        'Zaměstnavatel je povinen uzavřít pracovní smlouvu před nástupem zaměstnance do práce (§ 34 odst. 3 ZP). Zaměstnanec nesmí nastoupit do práce, dokud nebyla smlouva podepsána.',
        disputeClause(d, true),
        'Smlouva je vyhotovena ve dvou stejnopisech; zaměstnavatel i zaměstnanec obdrží po jednom vyhotovení (§ 37 ZP).',
        'Změny pracovní smlouvy jsou platné pouze ve formě písemných, číslovaných a podepsaných dodatků (§ 564 OZ).',
        'Neplatnost jednotlivého ustanovení smlouvy nemá vliv na platnost ostatních ustanovení.',
        'Zpracování osobních údajů zaměstnance probíhá v souladu s nařízením EU 2016/679 (GDPR), zákonem č. 110/2019 Sb. a § 316 ZP. Osobní údaje jsou zpracovávány výhradně za účelem vzniku, trvání a skončení pracovního poměru.',
        'Žádná ze smluvních stran neodpovídá za nesplnění nepeněžitých povinností způsobené vyšší mocí (vis maior), tj. událostí mimořádnou, nepředvídatelnou a nepřekonatelnou (§ 2913 odst. 2 OZ). Vyšší moc se nevztahuje na povinnost zaplatit peněžitou částku. Strana postižená vyšší mocí je povinna neprodleně písemně informovat druhou stranu a po odpadnutí překážky neprodleně pokračovat v plnění.',
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
    : d.remunerationType === 'fixed' || d.totalRemuneration
    ? `Sjednaná odměna za provedení celého úkolu/práce činí ${formatAmount(d.totalRemuneration)} Kč. Odměna bude vyplacena po splnění sjednaného úkolu.`
    : 'Výše odměny bude stanovena dohodou smluvních stran před zahájením práce a bude uvedena v písemném dodatku k této dohodě.';

  const taxNote = 'Odměna z dohody o provedení práce u jednoho zaměstnavatele nepodléhá odvodům na sociální a zdravotní pojištění, nepřesahuje-li v daném kalendářním měsíci 10 000 Kč (§ 75 ZP). Upozornění: má-li zaměstnanec souběžně dohody u více zaměstnavatelů a jeho celková odměna ze všech dohod v měsíci překročí 17 500 Kč (tj. 1/4 průměrné mzdy), mohou vzniknout odvody u všech zaměstnavatelů (zákon č. 349/2023 Sb., účinný od 1. 7. 2024). Zaměstnanec je povinen tuto skutečnost zaměstnavateli bez odkladu oznámit. Doporučujeme ověřit aktuální podmínky na webu ČSSZ (cssz.cz).';

  const premiumContent: ContractSection[] = hasPremiumClauses ? [
    {
      title: 'VI. MLČENLIVOST A OCHRANA INFORMACÍ',
      body: [
        'Zaměstnanec je povinen zachovávat mlčenlivost o všech skutečnostech, s nimiž se v rámci plnění dohody seznámí a které jsou označeny jako důvěrné nebo jejichž povaha jejich důvěrnost zakládá (obchodní strategie, ceny, zákaznické databáze, interní procesy, osobní údaje zaměstnanců a zákazníků).',
        'Tato povinnost mlčenlivosti trvá i po skončení dohody, a to po dobu 2 let od jejího skončení.',
        'Za škodu způsobenou porušením povinnosti mlčenlivosti odpovídá zaměstnanec v rozsahu stanoveném § 257 ZP. Smluvní pokuta k tíži zaměstnance se v dohodě o provedení práce nesjednává (§ 346d ZP). Zaměstnavatel je oprávněn domáhat se náhrady prokázané škody v zákonném rozsahu.',
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
      title: 'VIII. ODPOVĚDNOST ZA ŘÁDNÉ PLNĚNÍ A NÁHRADA ŠKODY',
      body: [
        'Nesplní-li zaměstnanec sjednaný pracovní úkol řádně a včas bez závažného důvodu na straně zaměstnavatele, odpovídá za škodu, která zaměstnavateli prokazatelně vznikla, a to v rozsahu stanoveném § 257 ZP.',
        'Nesplní-li zaměstnanec sjednaný pracovní úkol v dohodnutém termínu nebo v odpovídající kvalitě, je zaměstnavatel oprávněn písemně uplatnit výhradu kvality do 5 pracovních dnů od odevzdání a požadovat bezplatné odstranění vad ve lhůtě 10 pracovních dnů. Není-li vada odstraněna ani v přiměřené náhradní lhůtě, zaměstnavatel má nárok na náhradu prokázané škody v rozsahu § 257 ZP.',
        'Smluvní pokuta k tíži zaměstnance se v dohodě o provedení práce nesjednává (§ 346d ZP). Zaměstnavatel může uplatnit náhradu škody v zákonném rozsahu.',
      ],
    },
  ] : [];

  const sections: ContractSection[] = [
    {
      title: 'PREAMBULE',
      body: [
        'Tato dohoda o provedení práce (dále jen „dohoda") je uzavírána podle § 75 a násl. zákona č. 262/2006 Sb., zákoník práce, ve znění pozdějších předpisů (dále jen „ZP").',
        `Datum uzavření dohody: ${d.contractDate ? formatDate(d.contractDate) : today()}`,
        'Upozornění: Rozsah práce na základě dohody o provedení práce nesmí být větší než 300 hodin v kalendářním roce u jednoho zaměstnavatele (§ 75 odst. 2 ZP).',
      ],
    },
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Zaměstnavatel: ${asText(d.employerName)}, IČO: ${asText(d.employerIco, '—')}, sídlo: ${asText(d.employerAddress)}`,
        d.employerEmail ? `E-mail zaměstnavatele: ${asText(d.employerEmail)}` : '',
        `Zaměstnanec: ${asText(d.employeeName)}, nar.: ${asText(d.employeeBirth, '—')}, bytem: ${asText(d.employeeAddress)}`,
        d.employeeEmail ? `E-mail zaměstnance: ${asText(d.employeeEmail)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. PŘEDMĚT DOHODY — POPIS PRACOVNÍHO ÚKOLU',
      body: [
        `Zaměstnanec se zavazuje pro zaměstnavatele provést tento pracovní úkol (druh práce): ${asText(d.taskDescription, 'neuvedeno')}`,
        d.taskDetails ? `Podrobný popis: ${asText(d.taskDetails)}` : '',
        `Místo výkonu práce: ${asText(d.workPlace, 'neuvedeno')}`,
        `Předpokládaný rozsah práce: ${asText(d.estimatedHours, 'neuvedeno')} hodin (max. 300 hod./rok u jednoho zaměstnavatele).`,
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. DOBA TRVÁNÍ A TERMÍN SPLNĚNÍ',
      body: [
        `Dohoda se uzavírá na dobu: ${d.durationType === 'fixed' ? `určitou od ${formatDate(d.startDate, 'neuvedeno')} do ${formatDate(d.endDate, 'neuvedeno')}` : 'neurčitou (lze ukončit dohodou nebo výpovědí s 15denní výpovědní dobou)'}`,
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
        'Na dohodu o provedení práce se nevztahují ustanovení zákoníku práce o pracovní době, dovolené, odstupném a dalších nárocích typických pro hlavní pracovní poměr (§ 77 odst. 2 ZP). Zaměstnanec pracující na základě DPP má nárok na dovolenou, pokud pracovní poměr trvá nepřetržitě alespoň 4 týdny a zaměstnanec odpracoval alespoň 4násobek stanovené týdenní pracovní doby (§ 77a ZP, účinné od 1. 1. 2024).',
        d.toolsProvided === 'employer'
          ? 'Pracovní pomůcky, nástroje a vybavení nutné pro výkon práce zajišťuje zaměstnavatel.'
          : d.toolsProvided === 'employee'
          ? 'Zaměstnanec zajišťuje pracovní pomůcky, nástroje a vybavení na vlastní náklady; zaměstnavatel mu uhradí prokazatelně vynaložené náklady pouze tehdy, bylo-li to předem písemně dohodnuto.'
          : 'Pracovní pomůcky a vybavení potřebné pro výkon práce zajišťují strany dle vzájemné dohody.',
        'Zaměstnanec není povinen práci osobně vykonávat na pracovišti zaměstnavatele, pokud není výslovně dohodnuto jinak.',
      ],
    },
    ...premiumContent,
    {
      title: `${hasPremiumClauses ? 'IX' : 'VI'}. ZÁVĚREČNÁ USTANOVENÍ`,
      body: [
        'Dohoda se řídí zákonem č. 262/2006 Sb., zákoník práce, ve znění pozdějších předpisů, a subsidiárně zákonem č. 89/2012 Sb., občanský zákoník.',
        disputeClause(d, true),
        'Dohoda je vyhotovena ve dvou stejnopisech; každá strana obdrží jedno (§ 77 odst. 1 ZP).',
        'Změny dohody jsou platné pouze ve formě písemných, číslovaných a podepsaných dodatků.',
        'Neplatnost jednotlivého ustanovení nemá vliv na platnost ostatních ustanovení dohody.',
        'Zpracování osobních údajů zaměstnance probíhá v souladu s nařízením EU 2016/679 (GDPR), zákonem č. 110/2019 Sb. a § 316 ZP. Osobní údaje jsou zpracovávány výhradně za účelem vzniku a plnění dohody o provedení práce.',
        'Žádná ze smluvních stran neodpovídá za nesplnění nepeněžitých povinností způsobené vyšší mocí (vis maior), tj. událostí mimořádnou, nepředvídatelnou a nepřekonatelnou (§ 2913 odst. 2 OZ). Vyšší moc se nevztahuje na povinnost zaplatit peněžitou částku. Strana postižená vyšší mocí je povinna neprodleně písemně informovat druhou stranu a po odpadnutí překážky neprodleně pokračovat v plnění.',
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

  const basicIpClause = d.ipOwnership === 'client'
    ? 'Veškerá práva duševního vlastnictví vzniklá v rámci poskytování služeb (foreground IP) přecházejí na objednatele okamžikem jejich vzniku a úplného zaplacení ceny. Poskytovatel se tímto vzdává práva dílo kdykoli odvolat. Objednatel je oprávněn dílo upravovat, šířit a používat bez omezení.'
    : 'Poskytovatel si zachovává veškerá práva duševního vlastnictví k vytvořeným výstupům; objednateli uděluje nevýhradní, časově neomezenou a teritoriálně neomezenou licenci k jejich využití pro vlastní potřebu (§ 2358 OZ).';

  const premiumContent: ContractSection[] = hasPremiumClauses ? [
    ...(d.ipOwnership === 'split' ? [{
      title: 'VIII. PRÁVA DUŠEVNÍHO VLASTNICTVÍ — SPLIT MODEL',
      body: [
        'Předexistující práva duševního vlastnictví každé strany (background IP — nástroje, frameworky, know-how vytvořené před uzavřením smlouvy) zůstávají výhradním vlastnictvím dané strany. Práva k výstupům vzniklým přímo v rámci plnění této smlouvy (foreground IP) přecházejí na objednatele po úplném zaplacení ceny. Poskytovatel si zachovává právo foreground IP anonymizovaně uvést ve vlastním portfoliu.',
      ],
    }] : []),
    {
      title: `${d.ipOwnership === 'split' ? 'IX' : 'VIII'}. SLA — ÚROVEŇ POSKYTOVÁNÍ SLUŽEB`,
      body: [
        `Poskytovatel se zavazuje dosahovat těchto klíčových ukazatelů výkonnosti: dostupnost ${asText(d.uptime, '99')} % v pracovních dnech; doba reakce na hlášenou chybu/incident maximálně ${asText(d.responseTime, '24')} hodin.`,
        `Za každou hodinu prodlení nad sjednaný limit náleží objednateli sleva z ceny ve výši ${asText(d.slaDiscount, '0,5')} % z měsíčního paušálu, celkem však nejvýše ${asText(d.maxDiscount, '20')} %.`,
        'Výpadek způsobený vyšší mocí (výpadek energie, havárie infrastruktury mimo vliv poskytovatele) se do doby nedostupnosti nezapočítává.',
      ],
    },
    {
      title: `${d.ipOwnership === 'split' ? 'X' : 'IX'}. MLČENLIVOST A OCHRANA OBCHODNÍHO TAJEMSTVÍ`,
      body: [
        'Poskytovatel se zavazuje zachovávat mlčenlivost o veškerých informacích objednatele, se kterými se v rámci plnění smlouvy seznámí, a to po dobu platnosti smlouvy i po dobu 3 let po jejím skončení.',
        'Za porušení povinnosti mlčenlivosti je poskytovatel povinen zaplatit smluvní pokutu ve výši 50 000 Kč za každý případ porušení, a to bez ohledu na vznik skutečné škody.',
      ],
    },
  ] : [];

  const sections: ContractSection[] = [
    {
      title: 'PREAMBULE',
      body: [
        'Tato smlouva o poskytování služeb (dále jen „smlouva") je uzavírána podle § 1746 odst. 2 zákona č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů (dále jen „OZ").',
        `Datum uzavření smlouvy: ${d.contractDate ? formatDate(d.contractDate) : today()}`,
      ],
    },
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Poskytovatel: ${asText(d.providerName)}, IČO: ${asText(d.providerIco, '—')}, sídlo: ${asText(d.providerAddress)}`,
        d.providerEmail ? `E-mail poskytovatele: ${asText(d.providerEmail)}` : '',
        d.providerPhone ? `Telefon poskytovatele: ${asText(d.providerPhone)}` : '',
        `Objednatel: ${asText(d.clientName)}, IČO/nar.: ${asText(d.clientId, '—')}, sídlo/bytem: ${asText(d.clientAddress)}`,
        d.clientEmail ? `E-mail objednatele: ${asText(d.clientEmail)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. PŘEDMĚT SMLOUVY — ROZSAH SLUŽEB',
      body: [
        `Poskytovatel se zavazuje poskytovat objednateli tyto služby: ${asText(d.serviceDescription, 'neuvedeno')}`,
        d.serviceDetails ? `Podrobná specifikace: ${asText(d.serviceDetails)}` : '',
        d.deliverables ? `Výstupy/dodávky: ${asText(d.deliverables)}` : '',
        `Zahájení poskytování služeb: ${formatDate(d.startDate, 'neuvedeno')}`,
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. TRVÁNÍ SMLOUVY',
      body: [
        d.durationType === 'fixed'
          ? `Smlouva se uzavírá na dobu určitou do ${formatDate(d.endDate, 'neuvedeno')}.`
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
      title: 'V. POVINNOSTI SMLUVNÍCH STRAN A AKCEPTACE',
      body: [
        'Poskytovatel je povinen:',
        'a) poskytovat služby s odbornou péčí, řádně a včas,',
        'b) informovat objednatele o pokroku, překážkách a odchylkách od sjednaného rozsahu,',
        'c) chránit data, informace a podklady objednatele.',
        'Objednatel je povinen:',
        'd) poskytnout poskytovateli nezbytnou součinnost, přístupy a podklady,',
        'e) uhradit cenu za poskytnuté služby ve sjednaném termínu.',
        d.deliverables
          ? `Akceptační procedura: Každý výstup (deliverable) se považuje za akceptovaný, nevznese-li objednatel písemné zdůvodněné výhrady do ${asText(d.acceptanceDays, '10')} pracovních dnů od jeho předání poskytovatelem. Výhrady musí obsahovat odkaz na sjednanou specifikaci a popis konkrétního nedostatku — obecné výhrady bez odůvodnění se považují za akceptaci. Poskytovatel je povinen opodstatněné vady bezplatně odstranit do 10 pracovních dnů od doručení výhrad, nedohodnou-li se strany jinak.`
          : 'Výstupy a dodávky jsou považovány za akceptované, nevznese-li objednatel písemné zdůvodněné výhrady do 10 pracovních dnů od jejich předání.',
      ],
    },
    {
      title: 'VI. ODPOVĚDNOST A SANKCE',
      body: [
        `Za prodlení s předáním výstupu/poskytnutím služby je poskytovatel povinen zaplatit objednateli smluvní pokutu ve výši ${asText(d.penaltyRate, '0,05')} % z ceny za každý den prodlení.`,
        'Celková výše smluvní pokuty nepřesáhne 15 % z celkové ceny dle smlouvy.',
        'Zaplacení smluvní pokuty nezbavuje žádnou ze stran povinnosti nahradit způsobenou škodu.',
        'Smluvní pokuta a náhrada škody za prodlení se neuplatní, bylo-li prodlení výhradně způsobeno okolností vyšší moci (§ 2913 odst. 2 OZ) nebo prodlením objednatele s poskytnutím nezbytné součinnosti.',
      ],
    },
    {
      title: 'VII. PRÁVA DUŠEVNÍHO VLASTNICTVÍ',
      body: [basicIpClause],
    },
    ...premiumContent,
    {
      title: `${hasPremiumClauses ? (d.ipOwnership === 'split' ? 'XI' : 'X') : 'VIII'}. ZÁVĚREČNÁ USTANOVENÍ`,
      body: [
        'Smlouva se řídí právním řádem České republiky, zejména zákonem č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů.',
        disputeClause(d),
        'Smlouva je vyhotovena ve dvou stejnopisech; každá strana obdrží jedno.',
        'Změny jsou platné pouze ve formě písemných, číslovaných a podepsaných dodatků.',
        'Neplatnost jednotlivého ustanovení smlouvy nemá vliv na platnost ostatních ustanovení.',
        'Zpracování osobních údajů probíhá v souladu s nařízením EU 2016/679 (GDPR) a zákonem č. 110/2019 Sb. Osobní údaje jsou zpracovávány výhradně za účelem uzavření a plnění tohoto smluvního vztahu.',
        'Žádná ze smluvních stran neodpovídá za nesplnění nepeněžitých povinností způsobené vyšší mocí (vis maior), tj. událostí mimořádnou, nepředvídatelnou a nepřekonatelnou (§ 2913 odst. 2 OZ). Vyšší moc se nevztahuje na povinnost zaplatit peněžitou částku. Strana postižená vyšší mocí je povinna neprodleně písemně informovat druhou stranu a po odpadnutí překážky neprodleně pokračovat v plnění.',
      ],
    },
  ];

  sections.push({ title: `${hasPremiumClauses ? (d.ipOwnership === 'split' ? 'XII' : 'XI') : 'IX'}. PODPISY`, body: [] });
  return sections;
}

// ─────────────────────────────────────────────
//  PODNÁJEMNÍ SMLOUVA
// ─────────────────────────────────────────────
function buildSubleaseContractSections(d: StoredContractData): ContractSection[] {
  const { hasPremiumClauses } = resolveTierFeatures(d);
  const consentNote = d.landlordConsent === 'yes'
    ? `Souhlas pronajímatele (vlastníka) se subpronajatou věcí byl udělen písemně dne ${asText(d.consentDate, 'neuvedeno')} (§ 2274 OZ).`
    : 'Upozornění: Podnájem bez souhlasu pronajímatele je v případě bytu zakázán (§ 2274 OZ). Nájemce prohlašuje, že souhlas si zajistí nebo jej již má.';

  const premiumContent: ContractSection[] = hasPremiumClauses ? [
    {
      title: 'IX. ZVLÁŠTNÍ SMLUVNÍ UJEDNÁNÍ A VZTAH K HLAVNÍMU NÁJMU',
      body: [
        `Podnájemce bere na vědomí, že nájemce (jeho smluvní protistrana) je vůči vlastníkovi nemovitosti vázán nájemní smlouvou ze dne ${asText(d.mainLeaseDate, 'neuvedeno')}. V případě zániku hlavního nájmu zaniká i podnájem (§ 2277 OZ).`,
        'Podnájemce se zavazuje neporušovat podmínky hlavní nájemní smlouvy, se kterou byl před podpisem této smlouvy řádně seznámen a jejíž relevantní části mu byly předány.',
        'Nájemce je povinen neprodleně informovat podnájemce o jakékoli změně hlavní nájemní smlouvy, která by mohla mít vliv na práva a povinnosti podnájemce.',
        'Podnájemce není oprávněn dát podnajatý prostor do dalšího podnájmu třetí osobě bez předchozího písemného souhlasu nájemce i pronajímatele.',
        `Smluvní pokuta za neoprávněné další podnajímání nebo jiné porušení podmínek hlavní nájemní smlouvy: ${formatAmount(d.breachPenalty || 50000)} Kč.`,
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
      title: 'PREAMBULE',
      body: [
        'Tato podnájemní smlouva (dále jen „smlouva") je uzavírána podle § 2274 a násl. zákona č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů (dále jen „OZ").',
        consentNote,
        `Datum uzavření smlouvy: ${d.contractDate ? formatDate(d.contractDate) : today()}`,
      ],
    },
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Nájemce (podnajímatel): ${asText(d.landlordName)}, nar./IČO: ${asText(d.landlordId, '—')}, bytem/sídlo: ${asText(d.landlordAddress)}`,
        d.landlordEmail ? `E-mail nájemce: ${asText(d.landlordEmail)}` : '',
        `Podnájemce: ${asText(d.tenantName)}, nar./IČO: ${asText(d.tenantId, '—')}, bytem/sídlo: ${asText(d.tenantAddress)}`,
        d.tenantEmail ? `E-mail podnájemce: ${asText(d.tenantEmail)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. PŘEDMĚT PODNÁJMU',
      body: [
        `Nájemce přenechává podnájemci do podnájmu: byt/prostor na adrese ${asText(d.flatAddress, 'neuvedeno')}, ${asText(d.flatLayout, '')}, ${d.flatUnitNumber ? `číslo jednotky ${asText(d.flatUnitNumber)}, ` : ''}${d.floor ? `${asText(d.floor)}. podlaží, ` : ''}katastrální území ${asText(d.cadastralArea, 'neuvedeno')}.`,
        d.subleaseArea ? `Podlahová plocha podnajímaného prostoru: ${asText(d.subleaseArea)} m²` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. DOBA PODNÁJMU',
      body: [
        d.duration === 'fixed'
          ? `Podnájem se sjednává na dobu určitou od ${formatDate(d.startDate, 'neuvedeno')} do ${formatDate(d.endDate, 'neuvedeno')}.`
          : `Podnájem se sjednává na dobu neurčitou od ${formatDate(d.startDate, 'neuvedeno')}.`,
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
        d.depositAmount ? `Jistota (kauce): ${formatAmount(d.depositAmount)} Kč (max. trojnásobek měsíčního podnájemného dle § 2274 OZ). Nájemce je povinen jistotu vrátit do 30 dnů od skončení podnájmu a předání prostor, po odečtení prokázaných pohledávek.` : '',
        `Podnájemné je splatné vždy do ${asText(d.paymentDay, '15')}. dne příslušného měsíce ${d.bankAccount ? `na bankovní účet nájemce č. ${asText(d.bankAccount)}` : 'v hotovosti nebo bankovním převodem'}.`,
        'V případě prodlení podnájemce s úhradou podnájemného nebo zálohy na služby je nájemce oprávněn požadovat zákonný úrok z prodlení ode dne splatnosti.',
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
        `Předání prostor proběhne dne ${formatDate(d.handoverDate, 'neuvedeno')}.`,
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
        !isNaN(Number(d.rentAmount)) && Number(d.rentAmount) > 0
          ? `Za každý den prodlení s vyklizením je podnájemce povinen platit náhradu ve výši ${Math.round(Number(d.rentAmount) / 30)} Kč/den (tj. 1/30 sjednaného měsíčního podnájemného).`
          : 'Za každý den prodlení s vyklizením je podnájemce povinen platit náhradu ve výši 1/30 sjednaného měsíčního podnájemného za každý den prodlení.',
        'Kauce bude vrácena do 30 dnů od předání prostor, po odečtení eventuálních pohledávek nájemce.',
      ],
    },
    {
      title: 'VIII. OPRAVY, HAVÁRIE A ÚDRŽBA',
      body: [
        'Drobné opravy a náklady na běžnou údržbu podnajatých prostor hradí podnájemce (v rozsahu přiměřeném charakteru podnájmu). Za opravy způsobené opotřebením přesahujícím běžné užívání odpovídá podnájemce v plném rozsahu.',
        'Větší opravy (nad 1 000 Kč) hradí nájemce, pokud nejsou způsobeny zaviněním nebo nedbalostí podnájemce nebo osob, které vpustil do prostor.',
        'Podnájemce je povinen neprodleně — nejpozději do 24 hodin — hlásit nájemci veškeré havárie, poruchy nebo poškození (úniky vody, výpadky elektřiny, poruchy topení apod.). V případě bezprostředního ohrožení je oprávněn provést nutná zabezpečovací opatření i bez souhlasu nájemce.',
        'Podnájemce nesmí provádět žádné stavební úpravy, přestavby ani jiné zásahy do prostor bez předchozího písemného souhlasu nájemce, a v případě stavebních úprav i pronajímatele. Provedené nepovolené úpravy je podnájemce povinen na vlastní náklady uvést do původního stavu.',
      ],
    },
    ...premiumContent,
    {
      title: `${hasPremiumClauses ? 'XII' : 'IX'}. ZÁVĚREČNÁ USTANOVENÍ`,
      body: [
        'Smlouva se řídí právním řádem České republiky, zejména zákonem č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů.',
        disputeClause(d),
        'Smlouva je vyhotovena ve dvou stejnopisech; každá smluvní strana obdrží jedno.',
        'Veškeré změny jsou platné pouze ve formě písemných, číslovaných a podepsaných dodatků.',
        'Neplatnost jednotlivého ustanovení smlouvy nemá vliv na platnost ostatních ustanovení.',
        'Zpracování osobních údajů probíhá v souladu s nařízením EU 2016/679 (GDPR) a zákonem č. 110/2019 Sb. Osobní údaje jsou zpracovávány výhradně za účelem uzavření a plnění tohoto smluvního vztahu.',
        'Žádná ze smluvních stran neodpovídá za nesplnění nepeněžitých povinností způsobené vyšší mocí (vis maior), tj. událostí mimořádnou, nepředvídatelnou a nepřekonatelnou (§ 2913 odst. 2 OZ). Vyšší moc se nevztahuje na povinnost zaplatit peněžitou částku. Strana postižená vyšší mocí je povinna neprodleně písemně informovat druhou stranu a po odpadnutí překážky neprodleně pokračovat v plnění.',
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
        return `veškeré právní jednání ve věci převodu, koupě, prodeje, pronájmu nebo jiného nakládání s nemovitou věcí na adrese/v katastrálním území: ${asText(d.propertyAddress, 'neuvedeno')}, zejména: podpis kupní smlouvy, smlouvy o smlouvě budoucí, nájemní smlouvy, darovací smlouvy; zastupování před katastrem nemovitostí, finančními institucemi a orgány veřejné moci. UPOZORNĚNÍ: Tato plná moc vyžaduje úředně ověřený podpis zmocnitele (notář nebo Czech POINT). Bez ověřeného podpisu nebude akceptována katastrem nemovitostí ani finančními institucemi.`;
      case 'court':
        return `zastupování zmocnitele ve věci vedené u ${asText(d.courtName, 'neuvedeno')}, sp. zn. ${asText(d.caseNumber, 'neuvedeno')}, včetně přijímání zásilek, podávání opravných prostředků a uzavírání smírů. UPOZORNĚNÍ: Plná moc pro zastoupení v soudním řízení doporučujeme opatřit úředně ověřeným podpisem. V řízeních, kde je povinné zastoupení advokátem (§ 27 OSŘ), musí být zmocněncem advokát.`;
      case 'company':
        return `zastupování zmocnitele jako společníka/jednatele/akcionáře společnosti ${asText(d.companyName, 'neuvedeno')}, IČO ${asText(d.companyIco, 'neuvedeno')}, v rámci těchto jednání: ${asText(d.companyScope, 'valná hromada, jednání s orgány státní správy, obchodní jednání')}`;
      case 'bank':
        return `zastupování na bankách a finančních institucích, zejména nakládání s účtem č. ${asText(d.bankAccount, 'neuvedeno')} vedeným u ${asText(d.bankName, 'neuvedeno')}, vč. výběrů, vkladů a správy účtu. UPOZORNĚNÍ: Banky zpravidla vyžadují vlastní formulář plné moci nebo úředně ověřený podpis. Ověřte u své banky, zda tento dokument akceptuje.`;
      default:
        return `${asText(d.customScope, 'neuvedeno')}`;
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
        `Datum narození / IČO: ${asText(d.principalId, '—')}`,
        `Trvalé bydliště / sídlo: ${asText(d.principalAddress)}`,
        d.principalEmail ? `E-mail: ${asText(d.principalEmail)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. ZMOCNĚNEC',
      body: [
        `Jméno a příjmení / název: ${asText(d.agentName)}`,
        `Datum narození / IČO: ${asText(d.agentId, '—')}`,
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
        'd) zmocněnec je povinen jednat s péčí řádného hospodáře a v nejlepším zájmu zmocnitele; o každém právním jednání učiněném v rámci zmocnění je zmocněnec povinen zmocnitele bez zbytečného odkladu informovat.',
        'e) zmocnitel může tuto plnou moc kdykoli písemně odvolat; odvolání je účinné okamžikem, kdy se o něm zmocněnec dozví (§ 448 odst. 1 OZ). Zmocněnec je povinen po odvolání neprodleně vrátit originál plné moci zmocniteli.',
      ].filter(Boolean) as string[],
    },
  ];

  const premiumContent: ContractSection[] = hasPremiumClauses ? [
    {
      title: 'VI. ÚŘEDNÍ OVĚŘENÍ PODPISU A PRÁVNÍ ÚČINKY VŮČI TŘETÍM STRANÁM',
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
        `Za škodu způsobenou překročením rozsahu zmocnění nebo nedbalým výkonem plné moci odpovídá zmocněnec zmocniteli v plné výši (§ 437 OZ). Dojde-li k vědomému překročení rozsahu zmocnění, je zmocněnec povinen zaplatit zmocniteli smluvní pokutu ve výši ${formatAmount(d.agentPenalty || 50000)} Kč; zaplacením pokuty není dotčen nárok na náhradu vzniklé škody.`,
      ],
    },
  ] : [];

  sections.push(...premiumContent);
  sections.push({
    title: `${hasPremiumClauses ? 'VIII' : 'VI'}. ZÁVĚREČNÁ USTANOVENÍ`,
    body: [
      'Tato listina se řídí právním řádem České republiky, zejména zákonem č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů.',
      'Plná moc nabývá účinnosti podpisem zmocnitele a zaniká splněním zmocnění, uplynutím doby, odvoláním zmocnitelem nebo smrtí některé ze stran (§ 448 OZ).',
      'Zmocnitel může tuto plnou moc kdykoli písemně odvolat doručením odvolání zmocněnci. Odvolání je účinné okamžikem, kdy se o něm zmocněnec dozví.',
      'Omezení nebo rozšíření rozsahu zmocnění je platné pouze písemnou formou.',
      'Neplatnost jednotlivého ustanovení nemá vliv na platnost ostatních ustanovení.',
      'Zpracování osobních údajů probíhá v souladu s nařízením EU 2016/679 (GDPR) a zákonem č. 110/2019 Sb. Osobní údaje jsou zpracovávány výhradně za účelem udělení a plnění zmocnění.',
    ],
  });
  sections.push({ title: `${hasPremiumClauses ? 'IX' : 'VII'}. PODPISY`, body: [] });

  return sections;
}

// ─────────────────────────────────────────────
//  UZNÁNÍ DLUHU
// ─────────────────────────────────────────────
function buildDebtAcknowledgmentSections(d: StoredContractData): ContractSection[] {
  const { hasPremiumClauses } = resolveTierFeatures(d);
  const debtOrigin = d.debtOrigin === 'loan'
    ? `Dluh vznikl na základě smlouvy o zápůjčce / půjčky ze dne ${formatDate(d.debtDate, 'neuvedeno')}.`
    : d.debtOrigin === 'invoice'
    ? `Dluh vznikl nezaplacením faktury č. ${asText(d.invoiceNumber, 'neuvedeno')} ze dne ${formatDate(d.debtDate, 'neuvedeno')}.`
    : d.debtOrigin === 'damage'
    ? `Dluh vznikl jako náhrada škody způsobené dne ${formatDate(d.debtDate, 'neuvedeno')}.`
    : `Dluh vznikl z titulu: ${asText(d.debtOriginCustom, 'neuvedeno')} (dne ${formatDate(d.debtDate, 'neuvedeno')}).`;

  const repaymentDesc = d.repaymentType === 'installments'
    ? `Dlužník se zavazuje splácet dluh v ${asText(d.installmentCount, 'neuvedeno')} pravidelných měsíčních ${Number(d.installmentCount) === 1 ? 'splátce' : 'splátkách'} po ${formatAmount(d.installmentAmount)} Kč, ${Number(d.installmentCount) === 1 ? 'splatné' : 'splatných vždy'} k ${asText(d.paymentDay, '15')}. dni ${Number(d.installmentCount) === 1 ? 'příslušného' : 'každého'} měsíce, počínaje ${formatDate(d.firstPaymentDate, 'neuvedeno')}.`
    : `Dlužník se zavazuje uhradit celou dlužnou částku nejpozději dne ${formatDate(d.repaymentDate, 'neuvedeno')} jednorázově.`;

  const interestClause = d.interestRate && Number(d.interestRate) > 0
    ? `Na dlužnou jistinu se sjednává úrok z prodlení ve výši ${asText(d.interestRate)} % p.a. ode dne ${formatDate(d.debtDate, 'neuvedeno')}.`
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
      title: 'PREAMBULE',
      body: [
        'Toto uznání dluhu (dále jen „listina") je sepsáno podle § 2053 zákona č. 89/2012 Sb., občanský zákoník (dále jen „OZ").',
        'Uznáním dluhu se promlčecí doba obnovuje a počíná běžet nová desetiletá promlčecí lhůta ode dne uznání (§ 639 OZ).',
        `Datum sepsání listiny: ${d.contractDate ? formatDate(d.contractDate) : today()}`,
      ],
    },
    {
      title: 'I. ÚČASTNÍCI',
      body: [
        `Věřitel: ${asText(d.creditorName)}, nar./IČO: ${asText(d.creditorId, '—')}, bytem/sídlo: ${asText(d.creditorAddress)}`,
        d.creditorEmail ? `E-mail věřitele: ${asText(d.creditorEmail)}` : '',
        `Dlužník: ${asText(d.debtorName)}, nar./IČO: ${asText(d.debtorId, '—')}, bytem/sídlo: ${asText(d.debtorAddress)}`,
        d.debtorEmail ? `E-mail dlužníka: ${asText(d.debtorEmail)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. UZNÁNÍ DLUHU',
      body: [
        `Dlužník tímto výslovně a bez výhrad uznává, že dluží věřiteli peněžitou částku ve výši ${formatAmount(d.debtAmount)} ${asText(d.currency, 'Kč')}${d.debtAmountWords ? ` (slovy: ${d.debtAmountWords})` : ''}.`,
        debtOrigin,
        interestClause,
        'Dlužník prohlašuje, že dluh existuje, jeho výše ke dni sepsání listiny je správná a nemá vůči věřiteli žádné pohledávky způsobilé k započtení (§ 1982 OZ), kterými by byl oprávněn výši uznaného dluhu snížit.',
      ],
    },
    {
      title: 'III. ZPŮSOB A TERMÍN SPLACENÍ',
      body: [
        repaymentDesc,
        d.bankAccount ? `Platby budou zasílány na bankovní účet věřitele č. ${asText(d.bankAccount)}, VS: ${asText(d.variableSymbol, '—')}.` : '',
        d.repaymentType === 'installments' ? 'Každá splátka se použije nejprve na úhradu splatných příslušenství (úroku z prodlení, smluvní pokuty) a teprve zbývající část na snížení jistiny (§ 1932 OZ).' : '',
        `Při prodlení s úhradou sjednané splátky nebo celkové dlužné částky je dlužník povinen zaplatit věřiteli smluvní pokutu ve výši ${asText(d.latePenalty, '0,05')} % z dlužné částky za každý den prodlení.`,
        'Věřitel je oprávněn prohlásit celý zbývající dluh za okamžitě splatný, prodlí-li dlužník s úhradou déle než 30 dnů.',
      ].filter(Boolean) as string[],
    },
    ...premiumContent,
    {
      title: `${hasPremiumClauses ? 'VI' : 'IV'}. ZÁVĚREČNÁ USTANOVENÍ`,
      body: [
        'Tato listina se řídí právním řádem České republiky, zejména zákonem č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů.',
        disputeClause(d),
        'Listina je vyhotovena ve dvou stejnopisech; každá strana obdrží jedno.',
        'Tato listina je sama o sobě závazná a není podmíněna splněním žádné jiné podmínky. Dílčí plnění dluhu tuto listinu neruší a nemá vliv na platnost uznání zbývající části dluhu.',
        'Neplatnost jednotlivého ustanovení nemá vliv na platnost ostatních ustanovení listiny.',
        'Zpracování osobních údajů probíhá v souladu s nařízením EU 2016/679 (GDPR) a zákonem č. 110/2019 Sb. Osobní údaje jsou zpracovávány výhradně za účelem uzavření a plnění tohoto smluvního vztahu.',
        'Platební neschopnost ani finanční obtíže dlužníka nepředstavují okolnost vyšší moci a nezbavují dlužníka povinnosti uhradit uznaný dluh.',
        'Změny a doplnění této listiny jsou platné pouze ve formě písemného, číslovaného a oběma stranami podepsaného dodatku.',
      ],
    },
  ];

  sections.push({ title: `${hasPremiumClauses ? 'VII' : 'V'}. PODPISY`, body: [] });
  return sections;
}

// ─────────────────────────────────────────────
//  SMLOUVA O SPOLUPRÁCI
// ─────────────────────────────────────────────
function buildCooperationContractSections(d: StoredContractData): ContractSection[] {
  const { hasPremiumClauses } = resolveTierFeatures(d);
  const revenueDesc = d.revenueModel === 'revenue_share'
    ? `Smluvní strany si rozdělí příjmy z předmětu spolupráce v poměru ${asText(d.revenueShareA, '50')} % pro ${asText(d.partyAName, 'Stranu A')} a ${asText(d.revenueShareB, '50')} % pro ${asText(d.partyBName, 'Stranu B')}. Základem pro výpočet jsou skutečně přijaté platby (bez DPH) za příslušné zúčtovací období. Vyúčtování se provádí ${asText(d.settlementPeriod, 'měsíčně')}, vždy do 15. dne kalendářního měsíce následujícího po skončení zúčtovacího období.`
    : d.revenueModel === 'fixed_fee'
    ? `Za spolupráci náleží ${asText(d.partyBName, 'Straně B')} pevná odměna ve výši ${formatAmount(d.fixedFee)} Kč/měsíčně (bez DPH).`
    : `Způsob odměňování: ${asText(d.revenueDesc, 'neuvedeno')}`;

  const ipClause = d.ipSharing === 'joint'
    ? 'Veškerá práva duševního vlastnictví vzniklá společnou spoluprací jsou ve společném vlastnictví smluvních stran ve stejném podílu, není-li dohodnuto jinak.'
    : d.ipSharing === 'partyA'
    ? `Práva duševního vlastnictví vzniklá spoluprací přísluší straně ${asText(d.partyAName, 'A')}.`
    : `Každá strana si zachovává výhradní vlastnictví k těm výsledkům, které vytvořila samostatně. Ke společně vytvořeným výsledkům mají strany právo společně.`;

  const premiumContent: ContractSection[] = hasPremiumClauses ? [
    {
      title: 'VIII. OCHRANA OBCHODNÍHO TAJEMSTVÍ A NON-SOLICITATION',
      body: [
        'Každá ze smluvních stran je povinna zachovávat mlčenlivost o důvěrných informacích druhé strany, a to po dobu trvání smlouvy a dále 3 roky po jejím skončení.',
        `Za každý případ porušení mlčenlivosti je porušující strana povinna zaplatit druhé straně smluvní pokutu ve výši ${formatAmount(d.ndaPenalty || 100000)} Kč.`,
        d.nonCompete ? `Po dobu trvání smlouvy a ${asText(d.nonCompetePeriod, '12')} měsíců po jejím skončení se každá ze smluvních stran zavazuje nepřistupovat ke klíčovým zaměstnancům, zákazníkům ani dodavatelům druhé strany za účelem navázání přímé spolupráce mimo rámec této smlouvy (non-solicitation / zákaz přetahování).` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'IX. ŘEŠENÍ SPORŮ A ROZHODČÍ DOLOŽKA',
      body: [
        disputeClause(d),
        d.disputeResolution === 'arbitration'
          ? 'Smluvní strany výslovně potvrzují, že tato rozhodčí doložka byla sjednána individuálně a svobodně.'
          : 'Smluvní strany se zavazují před zahájením soudního řízení pokusit se o smírné vyřešení sporu, a to po dobu nejméně 30 dnů od doručení písemné výzvy.',
      ],
    },
  ] : [];

  const sections: ContractSection[] = [
    {
      title: 'PREAMBULE',
      body: [
        'Tato smlouva o spolupráci (dále jen „smlouva") je uzavírána podle § 1746 odst. 2 zákona č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů (dále jen „OZ").',
        `Datum uzavření smlouvy: ${d.contractDate ? formatDate(d.contractDate) : today()}`,
      ],
    },
    {
      title: 'I. SMLUVNÍ STRANY',
      body: [
        `Strana A: ${asText(d.partyAName)}, IČO/nar.: ${asText(d.partyAId, '—')}, sídlo/bytem: ${asText(d.partyAAddress)}`,
        d.partyAEmail ? `E-mail Strany A: ${asText(d.partyAEmail)}` : '',
        `Strana B: ${asText(d.partyBName)}, IČO/nar.: ${asText(d.partyBId, '—')}, sídlo/bytem: ${asText(d.partyBAddress)}`,
        d.partyBEmail ? `E-mail Strany B: ${asText(d.partyBEmail)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. PŘEDMĚT SPOLUPRÁCE',
      body: [
        `Smluvní strany se dohodly na spolupráci v oblasti: ${asText(d.cooperationScope, 'neuvedeno')}`,
        d.cooperationDetails ? `Podrobný popis předmětu spolupráce: ${asText(d.cooperationDetails)}` : '',
        `Cíl spolupráce: ${asText(d.cooperationGoal, 'neuvedeno')}`,
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
        'Smluvní strany se zavazují rozhodovat o klíčových otázkách spolupráce konsensuálně. Každá strana má jeden hlas; v případě rovnosti hlasů se strany zavazují do 10 pracovních dnů hledat smírné řešení.',
        d.coordinatorName ? `Koordinátor/vedoucí spolupráce: ${asText(d.coordinatorName)}. Koordinátor je oprávněn činit operativní rozhodnutí v rozsahu sjednaném touto smlouvou.` : '',
        'Každá strana je oprávněna jednat jménem spolupráce (tj. uzavírat smlouvy a přijímat závazky s dopadem na obě strany) pouze v rozsahu, který byl výslovně předem písemně odsouhlasen druhou stranou.',
        'Strany se zavazují konat pravidelné koordinační schůzky, a to alespoň jednou za kalendářní měsíc, a vést zápis z každé schůzky.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'VI. TRVÁNÍ A UKONČENÍ SMLOUVY',
      body: [
        d.durationType === 'fixed'
          ? `Smlouva se uzavírá na dobu určitou do ${formatDate(d.endDate, 'neuvedeno')}.`
          : `Smlouva se uzavírá na dobu neurčitou. Každá strana ji může vypovědět s výpovědní dobou ${asText(d.noticePeriod, '3')} měsíce.`,
        'Smlouva může být ukončena okamžitě vzájemnou dohodou nebo při podstatném porušení povinností jednou ze stran.',
        'V případě ukončení spolupráce se strany vypořádají vzájemné pohledávky, dluhy a nedokončené výstupy do 60 dnů od zániku smlouvy. Každá strana je oprávněna ze vzájemného vypořádání odečíst prokázané pohledávky vůči druhé straně (§ 1982 OZ).',
      ],
    },
    {
      title: 'VII. PRÁVA DUŠEVNÍHO VLASTNICTVÍ',
      body: [
        ipClause,
        'Předexistující práva duševního vlastnictví každé strany (background IP — software, databáze, know-how, metodiky vytvořené před uzavřením smlouvy) zůstávají výhradním vlastnictvím dané strany a touto smlouvou nepřecházejí na druhou stranu.',
        'Při ukončení spolupráce z jakéhokoli důvodu si každá strana zachovává práva k výsledkům, které vytvořila samostatně. K výsledkům vzniklým společně si strany navzájem udělují trvalou, nevýhradní a bezúplatnou licenci k jejich dalšímu využití v rozsahu, v jakém byly v rámci spolupráce využívány. Podrobné vypořádání společně vzniklého IP bude dohodnuto písemně do 30 dnů od zániku smlouvy.',
      ],
    },
    ...premiumContent,
    {
      title: `${hasPremiumClauses ? 'X' : 'VIII'}. ZÁVĚREČNÁ USTANOVENÍ`,
      body: [
        'Smlouva se řídí právním řádem České republiky, zejména zákonem č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů.',
        disputeClause(d),
        'Smlouva je vyhotovena ve dvou stejnopisech; každá strana obdrží jedno.',
        'Veškeré změny jsou platné pouze ve formě písemných, číslovaných a podepsaných dodatků.',
        'Je-li jakékoli ustanovení smlouvy neplatné nebo nevymahatelné, ostatní ustanovení zůstávají v plné platnosti a účinnosti.',
        'Zpracování osobních údajů probíhá v souladu s nařízením EU 2016/679 (GDPR) a zákonem č. 110/2019 Sb. Osobní údaje jsou zpracovávány výhradně za účelem uzavření a plnění tohoto smluvního vztahu.',
        'Žádná ze smluvních stran neodpovídá za nesplnění nepeněžitých povinností způsobené vyšší mocí (vis maior), tj. událostí mimořádnou, nepředvídatelnou a nepřekonatelnou (§ 2913 odst. 2 OZ). Vyšší moc se nevztahuje na povinnost zaplatit peněžitou částku. Strana postižená vyšší mocí je povinna neprodleně písemně informovat druhou stranu a po odpadnutí překážky neprodleně pokračovat v plnění.',
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
