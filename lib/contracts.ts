import {
  ZP_TRIAL_MONTHS_STANDARD,
  ZP_TRIAL_MONTHS_LEADERSHIP,
  DPP_THRESHOLD_NOTE,
  DPP_VACATION_NOTE,
  LEASE_MINOR_REPAIRS_NOTE,
  LOAN_ASSIGNMENT_CONSUMER_SAFE,
} from './legal-constants-2026';
import { hasCheckoutAddon } from './checkout-addons';

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

import { buildLeaseTranslationsBySection } from './contracts-i18n/lease';
import { buildSubleaseTranslationsBySection } from './contracts-i18n/sublease';
import { buildDppTranslationsBySection } from './contracts-i18n/dpp';
import { buildEmploymentTranslationsBySection } from './contracts-i18n/employment';
import { buildPowerOfAttorneyTranslationsBySection } from './contracts-i18n/power-of-attorney';
import { buildCarTranslationsBySection } from './contracts-i18n/car';
import { formatRemoteWorkForContract } from './i18n/employment-remote-work';

function attachTranslations(sections: ContractSection[], translations: Array<NonNullable<ContractSection['translations']>>): ContractSection[] {
  for (let i = 0; i < sections.length; i++) {
    if (translations[i]) sections[i].translations = translations[i];
  }
  return sections;
}

export type ContractSection = {
  title: string;
  body: string[];
  /**
   * Optional translations for the section.
   *
   * Each locale key holds the foreign-language version of `title` and `body`.
   * When present, the PDF renderer emits a bilingual layout: the Czech text is
   * the legally binding version; the foreign translation is rendered under
   * each Czech paragraph in smaller gray italic for the reader's convenience.
   *
   * Translation lines should align 1:1 with `body` indices. Missing entries
   * fall back to Czech-only rendering for that paragraph.
   *
   * NOTE: All existing builders return Czech only. Translations are intended
   * to be populated later by a translator with Czech legal background.
   */
  translations?: Partial<Record<'en' | 'ua', {
    title?: string;
    body?: string[];
  }>>;
};

// ═══════════════════════════════════════════════════════════════════════
// TIER FEATURE MAP — jediný autoritativní zdroj pro obsah balíčků
// ═══════════════════════════════════════════════════════════════════════
//
//  basic        (99 Kč)   → základní smlouva dle OZ
//  professional (199 Kč)  → + rozšířené klauzule, smluvní pokuty, zajišťovací ujednání
//  complete              → vše výše + instrukce, checklist, 30denní archivace
//
// PRAVIDLO: Obsah smlouvy (premium sekce) se řídí výhradně zaplaceným tierem.
// `notaryUpsell` je pouze UI/stavový údaj a nikdy nesmí sám odemykat placený obsah.
// ═══════════════════════════════════════════════════════════════════════

export type TierFeatures = {
  /** Zákazník zaplatil za Professional nebo Complete → dostane premium sekce */
  hasPremiumClauses: boolean;
  /** Zákazník zaplatil za Complete → dostane instrukce + checklist stránky v PDF */
  hasCompletePages: boolean;
  /** Archivace dokumentu v Redisu: 7 (basic), 14 (professional), 30 (complete), 90 (addon) */
  archiveDays: 7 | 14 | 30 | 90;
};

export function resolveTierFeatures(d: StoredContractData): TierFeatures {
  const tier = String(d.tier ?? 'basic').toLowerCase() as Tier;
  const isThematicPackage = Boolean(d.packageKey);
  const hasPremiumClauses =
    isThematicPackage || tier === 'professional' || tier === 'complete';
  const hasCompletePages =
    isThematicPackage || tier === 'complete' || hasCheckoutAddon(d, 'signing_checklist');
  const archiveDays = hasCheckoutAddon(d, 'extended_archive')
    ? 90
    : isThematicPackage || tier === 'complete'
      ? 30
      : tier === 'professional'
        ? 14
        : 7;
  return { hasPremiumClauses, hasCompletePages, archiveDays };
}

// Univerzální fallback pro nevyplněná pole. Typografická pomlčka „em dash" je
// standardní český zápis pro „údaj neuveden / neaplikováno" v právních a
// administrativních dokumentech — nepůsobí jako nedodělek (na rozdíl od 20
// podtržítek nebo doslovného „(neuvedeno)").
const emptyLine = '—';

const formatAmount = (amount?: unknown) => {
  if (amount === null || amount === undefined || amount === '') return '—';
  const num = Number(amount);
  if (!Number.isFinite(num)) return '—';
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
 * Česká pluralizace pro počet měsíců (a obdobné jednotky).
 * 1 → „1 měsíc", 2-4 → „X měsíce", 5+ → „X měsíců".
 */
const pluralMonths = (count: number): string => {
  const n = Math.abs(Math.trunc(count));
  if (n === 1) return `${count} měsíc`;
  if (n >= 2 && n <= 4) return `${count} měsíce`;
  return `${count} měsíců`;
};

/**
 * Formátuje desetinné číslo s českou desetinnou čárkou.
 * Pokud vstup není parsovatelné číslo, vrátí input jako string s nahrazením tečky.
 */
const formatCsNumber = (value: unknown, fractionDigits?: number): string => {
  if (value === null || value === undefined || value === '') return '—';
  const num = Number(String(value).replace(',', '.'));
  if (!Number.isFinite(num)) return String(value).replace('.', ',');
  return num.toLocaleString('cs-CZ', {
    minimumFractionDigits: fractionDigits ?? 0,
    maximumFractionDigits: fractionDigits ?? 6,
  });
};

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
      return 'Smluvní strany se zavazují řešit případné spory nejprve smírnou cestou. Nedojde-li k dohodě, může kterákoli ze stran využít mediaci dle zákona č. 202/2012 Sb., o mediaci, nebo se obrátit na věcně a místně příslušný soud České republiky.';
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
      case 'car': {
        const parts = [
          `motorové vozidlo tovární značky ${asText(d.carMake, '')} ${asText(d.carModel, '')}`.trim(),
          d.carVIN ? `VIN: ${asText(d.carVIN)}` : '',
          d.carPlate ? `SPZ: ${asText(d.carPlate)}` : '',
          d.carYear ? `rok výroby ${asText(d.carYear)}` : '',
          d.carMileage ? `stav tachometru ke dni podpisu smlouvy: ${asText(d.carMileage)} km` : '',
        ].filter(Boolean);
        return parts.join(', ');
      }
      case 'property': {
        const parts = [
          `nemovitou věc — byt/pozemek na adrese ${asText(d.propertyAddress)}`,
          d.propertyLV ? `zapsanou na listu vlastnictví č. ${asText(d.propertyLV)}` : '',
          d.propertyCadastre ? `katastrální území ${asText(d.propertyCadastre)}` : '',
          d.cadastralOffice ? `u Katastrálního úřadu pro ${asText(d.cadastralOffice)}` : '',
        ].filter(Boolean);
        return parts.join(', ');
      }
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
        'Dárce má právo požadovat vrácení daru (§ 2068 a násl. OZ) v případě, že se obdarovaný k dárci nebo jeho osobám blízkým (manžel, rodiče, děti, sourozenci, dlouhodobý partner) chová tak, že tím zjevně porušuje dobré mravy a nevděčí dárci za poskytnutý dar (tzv. nevděk obdarovaného).',
        'Za zjevné porušení dobrých mravů se zpravidla považuje zejména: úmyslné fyzické napadení dárce nebo osoby jemu blízké, hrubé verbální či veřejné urážky, úmyslné poškozování majetku dárce, zanedbání pomoci v tíživé situaci, jíž je obdarovaný schopen poskytnout, nebo spáchání úmyslného trestného činu vůči dárci či osobě jemu blízké.',
        'Dárce uplatní právo na vrácení daru písemnou výzvou doručenou obdarovanému, s uvedením konkrétního důvodu. Nevyhoví-li obdarovaný výzvě dobrovolně ve lhůtě 30 dnů od doručení, je dárce oprávněn domáhat se vrácení daru soudní cestou.',
        d.withReservation
          ? `Podmínka vázající dar: ${asText(d.reservationDescription)}. Nedojde-li ke splnění podmínky ve lhůtě do ${asText(d.conditionDeadline, 'sjednané smluvními stranami')}, smlouva se od počátku ruší a obdarovaný je povinen předmět daru vrátit.`
          : 'Dar je poskytován bez dalších podmínek a výminek; tím není dotčeno právo dárce na vrácení daru pro nevděk dle předchozích odstavců.',
        'Právo na vrácení daru se promlčuje ve lhůtě tří let ode dne, kdy se dárce dozvěděl o důvodu pro vrácení (§ 629 odst. 1 OZ).',
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
        'Obdarovaný dar přijímá.',
        d.giftType === 'money'
          ? (() => {
              if (d.transferMethod === 'transfer') {
                return d.bankAccount
                  ? `Peněžní prostředky budou převedeny bankovním převodem na účet obdarovaného č. ${asText(d.bankAccount)}.`
                  : 'Peněžní prostředky budou převedeny bankovním převodem na účet obdarovaného sdělený při podpisu smlouvy.';
              }
              return Number(d.amount ?? 0) > 270000
                ? 'Pozor: peněžitý dar přesahuje 270 000 Kč; předání v hotovosti je vyloučeno (§ 4 zák. č. 254/2004 Sb., o omezení plateb v hotovosti). Strany jsou povinny zvolit bezhotovostní převod.'
                : 'Peněžní prostředky budou předány v hotovosti při podpisu smlouvy. Strany berou na vědomí, že předání v hotovosti nad 270 000 Kč je dle zák. č. 254/2004 Sb. vyloučeno.';
            })()
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
        'Smlouva je vyhotovena ve dvou stejnopisech; dárce a obdarovaný obdrží po jednom stejnopisu.',
        'Jakékoli změny nebo doplnění smlouvy jsou platné pouze ve formě písemného, číslovaného a podepsaného dodatku.',
        'Neplatnost jednotlivého ustanovení smlouvy nemá vliv na platnost ostatních ustanovení.',
        d.giftType === 'property'
          ? 'Vlastnické právo k nemovité věci přechází na obdarovaného vkladem do katastru nemovitostí na základě pravomocného rozhodnutí katastrálního úřadu. Upozornění: podpisy obou smluvních stran na darovací smlouvě týkající se nemovitostí musí být úředně ověřeny (notář nebo Czech POINT); bez ověření katastrální úřad návrh na vklad zamítne.'
          : d.giftType === 'car'
          ? 'Vlastnické právo k vozidlu přechází na obdarovaného okamžikem podpisu této smlouvy. Smluvní strany jsou povinny do 10 pracovních dnů od přechodu vlastnického práva podat žádost o zápis změny vlastníka příslušnému obecnímu úřadu obce s rozšířenou působností (§ 8 odst. 2 zákona č. 56/2001 Sb.).'
          : 'Vlastnické právo k předmětu daru přechází na obdarovaného okamžikem předání.',
        'Zpracování osobních údajů probíhá v souladu s nařízením EU 2016/679 (GDPR) a zákonem č. 110/2019 Sb. o zpracování osobních údajů. Osobní údaje uvedené v této smlouvě jsou zpracovávány výhradně za účelem uzavření, plnění a případného vymáhání práv z tohoto smluvního vztahu. Správcem osobních údajů je každá ze smluvních stran v rozsahu údajů, které zpracovává o druhé straně. Každá ze stran má právo na přístup ke svým osobním údajům, jejich opravu nebo výmaz, jakož i právo podat stížnost u Úřadu pro ochranu osobních údajů (www.uoou.cz). Osobní údaje budou uchovávány po dobu trvání smluvního vztahu a dále po dobu stanovenou právními předpisy, zpravidla 10 let od jeho skončení.',
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
    ? 'Není-li povaha výsledku vylučující, poskytuje zhotovitel objednateli k vytvořenému dílu výhradní, časově, územně a množstevně neomezené oprávnění k jeho užití v plném rozsahu, a to okamžikem úplného zaplacení ceny. Je-li to vzhledem k povaze výstupu možné, zavazuje se zhotovitel převést na objednatele i převoditelná majetková práva k výsledku v rozsahu připouštěném právními předpisy.'
    : 'Zhotovitel si zachovává práva duševního vlastnictví k vytvořenému dílu a uděluje objednateli nevýhradní, časově neomezenou a teritoriálně neomezenou licenci k jeho užívání pro vlastní potřebu (§ 2358 OZ).';

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
        'Tato smlouva představuje úplné ujednání o provedení díla a nahrazuje veškerá předchozí ujednání a přísliby týkající se rozsahu díla, ceny a harmonogramu.',
        'Smlouva je vyhotovena ve dvou stejnopisech; objednatel a zhotovitel obdrží po jednom stejnopisu.',
        'Změny smlouvy jsou platné pouze ve formě písemných, číslovaných a podepsaných dodatků.',
        'Neplatnost jednotlivého ustanovení smlouvy nemá vliv na platnost ostatních ustanovení.',
        'Zpracování osobních údajů probíhá v souladu s nařízením EU 2016/679 (GDPR) a zákonem č. 110/2019 Sb. o zpracování osobních údajů. Osobní údaje uvedené v této smlouvě jsou zpracovávány výhradně za účelem uzavření, plnění a případného vymáhání práv z tohoto smluvního vztahu. Správcem osobních údajů je každá ze smluvních stran v rozsahu údajů, které zpracovává o druhé straně. Každá ze stran má právo na přístup ke svým osobním údajům, jejich opravu nebo výmaz, jakož i právo podat stížnost u Úřadu pro ochranu osobních údajů (www.uoou.cz). Osobní údaje budou uchovávány po dobu trvání smluvního vztahu a dále po dobu stanovenou právními předpisy, zpravidla 10 let od jeho skončení.',
        'Za vyšší moc se považuje i plošný výpadek kritické internetové infrastruktury nebo kybernetický útok vedený proti systémům smluvní strany, která prokáže, že měla přijata přiměřená organizační a technická bezpečnostní opatření. Vyšší moc se nevztahuje na povinnost zaplatit peněžitou částku. Strana postižená vyšší mocí je povinna neprodleně písemně informovat druhou stranu a po odpadnutí překážky neprodleně pokračovat v plnění.',
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
  const includeVehicleHandoverProtocol = Boolean(d.packageKey) || hasCheckoutAddon(d, 'handover_protocol');
  // Limit hotovosti dle zák. č. 254/2004 Sb. — při ceně přesahující 270 000 Kč
  // se hotovostní úhrada nesmí použít; PDF na to upozorní v textu.
  const cashOverLimit = d.paymentMethod === 'cash'
    && Number(d.priceAmount ?? d.purchasePrice ?? 0) > 270000;
  const paymentText =
    d.paymentMethod === 'cash'
      ? cashOverLimit
        ? 'Pozor: kupní cena přesahuje 270 000 Kč; platba v hotovosti je vyloučena (§ 4 zák. č. 254/2004 Sb., o omezení plateb v hotovosti). Strany jsou povinny zvolit bezhotovostní úhradu před podpisem smlouvy.'
        : 'V hotovosti při podpisu smlouvy, nejpozději však při fyzickém předání vozidla. Strany berou na vědomí, že platba v hotovosti nad 270 000 Kč je dle zák. č. 254/2004 Sb. vyloučena.'
      : d.bankAccount
        ? `Bankovním převodem na účet prodávajícího č. ${asText(d.bankAccount)}${d.variableSymbol ? `, VS: ${asText(d.variableSymbol)}` : ''}, do ${asText(d.paymentDueDays, '3')} pracovních dnů od podpisu smlouvy.`
        : `Bankovním převodem na účet prodávajícího, jehož údaje budou kupujícímu sděleny při podpisu smlouvy, do ${asText(d.paymentDueDays, '3')} pracovních dnů od podpisu.`;

  const ownershipTransfer =
    d.ownershipTransferMoment === 'payment'
      ? 'Vlastnické právo přechází na kupujícího okamžikem úplné úhrady kupní ceny.'
      : 'Vlastnické právo přechází na kupujícího okamžikem fyzického předání vozidla.';

  const premiumContent: ContractSection[] = hasPremiumClauses ? [
    {
      title: 'VI. PODROBNÝ STAV VOZIDLA A PŘEDÁVANÉ DOKLADY',
      body: ([
        // Technické údaje — každý parametr volitelný; spojené do jedné věty pouze pokud vyplněno.
        (() => {
          const parts = [
            d.carColor ? `barva ${asText(d.carColor)}` : '',
            d.fuelType ? `palivo ${asText(d.fuelType)}` : '',
            d.engineCapacity ? `objem motoru ${asText(d.engineCapacity)} ccm` : '',
            d.powerKW ? `výkon ${asText(d.powerKW)} kW` : '',
            d.techCardNumber ? `číslo technického průkazu ${asText(d.techCardNumber)}` : '',
          ].filter(Boolean);
          return parts.length ? `Technické údaje vozidla: ${parts.join(', ')}.` : '';
        })(),
        (() => {
          const parts = [
            d.stkValidUntil ? `STK platná do ${asText(d.stkValidUntil)}` : '',
            d.emissionsValidUntil ? `emise platné do ${asText(d.emissionsValidUntil)}` : '',
          ].filter(Boolean);
          return parts.length ? `Platnost technické a emisní kontroly: ${parts.join(', ')}.` : '';
        })(),
        (() => {
          const parts = [
            d.previousOwnersCount ? `počet předchozích vlastníků: ${asText(d.previousOwnersCount)}` : '',
            d.vehicleOrigin ? `původ vozidla: ${asText(d.vehicleOrigin)}` : '',
          ].filter(Boolean);
          return parts.length ? `Historie vozidla — ${parts.join(', ')}.` : '';
        })(),
        `Servisní kniha / historie: ${d.serviceHistory ? 'ano, předávána spolu s vozidlem' : 'není k dispozici'}.`,
        `Historie havárie: ${d.accidentHistory ? 'vozidlo bylo havarované, opravy dle servisní dokumentace' : 'prodávajícímu nejsou známy žádné havárie ani závažné opravy karoserie'}.`,
        d.equipmentIncluded ? `Předávaná výbava a příslušenství: ${asText(d.equipmentIncluded)}.` : 'Předávaná výbava a příslušenství: dle fyzického stavu při předání.',
        d.tiresInfo ? `Pneumatiky: ${asText(d.tiresInfo)}.` : '',
        d.documentsIncluded ? `Předávané doklady: ${asText(d.documentsIncluded)}.` : 'Předávané doklady: technický průkaz, osvědčení o registraci vozidla.',
        d.keysCount ? `Počet předaných klíčů: ${asText(d.keysCount)}.` : '',
      ] as string[]).filter(Boolean),
    },
    {
      title: 'VII. SMLUVNÍ POKUTY A ODPOVĚDNOST ZA ZATAJENÉ VADY',
      body: [
        'Prodávající odpovídá kupujícímu za vady, které měla věc při přechodu nebezpečí škody na kupujícího, i když se projeví až později; u spotřebitelských vztahů se použije i zvláštní právní úprava ochrany spotřebitele.',
        d.hiddenDefectPenalty && Number(d.hiddenDefectPenalty) > 0
          ? `Zatají-li prodávající vědomě vadu, na niž neupozornil, je povinen zaplatit kupujícímu smluvní pokutu ve výši ${formatAmount(d.hiddenDefectPenalty)} Kč. Zaplacením pokuty není dotčen nárok na náhradu škody ani právo z vad.`
          : 'Zatají-li prodávající vědomě vadu, na niž neupozornil, je povinen nahradit kupujícímu vzniklou škodu v plném rozsahu, včetně nákladů na odstranění vady; tím není dotčeno právo z vadného plnění dle § 1914 a násl. OZ.',
        `Smluvní pokuta za prodlení kupujícího s úhradou kupní ceny: ${asText(d.buyerLatePenalty, '0,05')} % z dlužné částky za každý den prodlení.`,
        d.sellerLatePenalty && Number(d.sellerLatePenalty) > 0
          ? `Smluvní pokuta za prodlení prodávajícího s předáním vozidla po sjednané lhůtě: ${formatAmount(d.sellerLatePenalty)} Kč za každý den prodlení.`
          : 'Při prodlení prodávajícího s předáním vozidla po sjednané lhůtě je kupující oprávněn požadovat náhradu škody (zejména nákladů na náhradní dopravu a uvedení vozidla do provozu) v prokazatelně vynaložené výši.',
        'Prodávající prohlašuje, že dle jeho nejlepšího vědomí není vozidlo předmětem exekuce, zástavního práva ani jiného omezení dispozice; za pravdivost tohoto prohlášení odpovídá v rozsahu předsmluvní odpovědnosti dle § 1728 a násl. OZ.',
      ],
    },
    {
      title: 'VIII. POJISTNÉ UDÁLOSTI, BEZDLUHOVOST A SANKCE PŘI PŘEPISU',
      body: [
        'Smluvní strany se vzájemně zmocňují k zastupování ve věci přepisu vlastnictví vozidla v registru silničních vozidel. Nedostaví-li se jedna ze stran v dohodnutém termínu k provedení přepisu, je druhá strana oprávněna provést přepis sama na základě této smlouvy a plné moci, která se uděluje touto smlouvou pro tento účel.',
        'Nedostaví-li se prodávající bez vážného důvodu k přepisu vlastnictví ve lhůtě dle čl. V, je povinen uhradit kupujícímu smluvní pokutu ve výši 200 Kč za každý den prodlení a nahradit účelně vynaložené náklady spojené s uplatněním práv.',
        'Kupující je povinen od okamžiku přechodu vlastnictví sjednat na vozidlo nové povinné ručení. Prodávající zajistí ukončení stávajícího pojištění odpovědnosti z provozu vozidla ke dni přechodu vlastnictví.',
        'Prodávající prohlašuje, že na vozidle nevázne žádný dosud nevypořádaný závazek vůči leasingové společnosti, bance ani jiné třetí osobě vyplývající z dřívějšího financování vozidla.',
        'Prodávající dále prohlašuje, že mu nejsou známy probíhající ani nevypořádané pojistné události týkající se vozidla ke dni podpisu této smlouvy.',
        d.declarationPenalty && Number(d.declarationPenalty) > 0
          ? `V případě nepravdivosti výše uvedených prohlášení je prodávající povinen uhradit kupujícímu prokazatelně vzniklou škodu a smluvní pokutu ve výši ${formatAmount(d.declarationPenalty)} Kč.`
          : 'V případě nepravdivosti výše uvedených prohlášení je prodávající povinen uhradit kupujícímu prokazatelně vzniklou škodu, včetně účelně vynaložených nákladů na uplatnění práv.',
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
        `Předmětem koupě je motorové vozidlo tovární značky ${asText(d.carMake)}${d.carModel ? `, model ${asText(d.carModel)}` : ''}.`,
        (() => {
          const parts = [
            d.carVIN ? `VIN (číslo karoserie): ${asText(d.carVIN)}` : '',
            d.carPlate ? `SPZ: ${asText(d.carPlate)}` : '',
          ].filter(Boolean);
          return parts.join(', ');
        })(),
        (() => {
          const parts = [
            d.carMileage ? `Stav tachometru ke dni podpisu: ${formatAmount(d.carMileage)} km` : '',
            d.carYear ? `rok výroby: ${asText(d.carYear)}` : '',
          ].filter(Boolean);
          return parts.length ? `${parts.join('. ')}.` : '';
        })(),
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
        (() => {
          if (d.buyerInspectedVehicle === false) {
            return 'Kupující bere na vědomí, že se neměl možnost v plném rozsahu seznámit s technickým stavem vozidla před podpisem smlouvy; tato skutečnost byla při sjednání kupní ceny zohledněna.';
          }
          const details: string[] = ['Kupující potvrzuje, že se před podpisem smlouvy řádně seznámil s technickým stavem vozidla'];
          if (d.testDriveCompleted) details.push('absolvoval zkušební jízdu');
          if (d.mechanicInspectionOffered) details.push('měl možnost nechat vozidlo prověřit vlastním mechanikem nebo diagnostikou');
          return details.join(', ') + '; vozidlo v tomto stavu přijímá (§ 2104 OZ).';
        })(),
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
          : 'Vozidlo je prodáváno jako ojeté, ve stavu odpovídajícím jeho stáří, dosavadnímu užívání a najetým kilometrům. Prodávající neposkytuje smluvní záruku za jakost nad zákonný rámec a odpovídá pouze za vady v rozsahu stanoveném právními předpisy a touto smlouvou.',
      ],
    },
    {
      title: 'V. POVINNOSTI PO PŘEDÁNÍ A PŘEPIS VOZIDLA',
      body: [
        'Smluvní strany jsou povinny neprodleně, nejpozději do 10 pracovních dnů od přechodu vlastnického práva, podat žádost o zápis změny vlastníka vozidla příslušnému obecnímu úřadu obce s rozšířenou působností (§ 8 odst. 2 zákona č. 56/2001 Sb.).',
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
        'Smlouva je vyhotovena ve dvou stejnopisech; prodávající a kupující obdrží po jednom stejnopisu.',
        'Veškeré změny smlouvy jsou platné pouze ve formě písemných, číslovaných a podepsaných dodatků.',
        'Neplatnost jednotlivého ustanovení smlouvy nemá vliv na platnost ostatních ustanovení.',
        'Zpracování osobních údajů probíhá v souladu s nařízením EU 2016/679 (GDPR) a zákonem č. 110/2019 Sb. o zpracování osobních údajů. Osobní údaje uvedené v této smlouvě jsou zpracovávány výhradně za účelem uzavření, plnění a případného vymáhání práv z tohoto smluvního vztahu. Správcem osobních údajů je každá ze smluvních stran v rozsahu údajů, které zpracovává o druhé straně. Každá ze stran má právo na přístup ke svým osobním údajům, jejich opravu nebo výmaz, jakož i právo podat stížnost u Úřadu pro ochranu osobních údajů (www.uoou.cz). Osobní údaje budou uchovávány po dobu trvání smluvního vztahu a dále po dobu stanovenou právními předpisy, zpravidla 10 let od jeho skončení.',
        'Žádná ze smluvních stran neodpovídá za nesplnění nepeněžitých povinností způsobené vyšší mocí (vis maior), tj. událostí mimořádnou, nepředvídatelnou a nepřekonatelnou (§ 2913 odst. 2 OZ). Vyšší moc se nevztahuje na povinnost zaplatit peněžitou částku. Strana postižená vyšší mocí je povinna neprodleně písemně informovat druhou stranu a po odpadnutí překážky neprodleně pokračovat v plnění.',
      ],
    },
  ];

  sections.push({
    title: `${hasPremiumClauses ? 'X' : 'VII'}. PODPISY`,
    body: [],
  });

  if (includeVehicleHandoverProtocol) {
    sections.push({
      title: 'PŘÍLOHA Č. 1 – PŘEDÁVACÍ PROTOKOL K VOZIDLU',
      body: [
        `Prodávající předává kupujícímu vozidlo: ${asText(d.carMake)} ${asText(d.carModel)}.`,
        `VIN: ${asText(d.carVIN)}.`,
        d.carPlate ? `Registrační značka: ${asText(d.carPlate)}.` : '',
        d.carMileage ? `Stav tachometru při předání: ${formatAmount(d.carMileage)} km.` : '',
        d.handoverDate ? `Datum předání: ${formatDate(d.handoverDate)}.` : '',
        d.handoverPlace ? `Místo předání: ${asText(d.handoverPlace)}.` : '',
        `Předané klíče a doklady: ${asText(d.keysAndDocs, 'klíče od vozidla a dostupné doklady k vozidlu')}.`,
        `Zjištěné vady při předání: ${asText(d.knownDefects, 'bez zjevných vad nad rámec běžného opotřebení')}.`,
        'Smluvní strany potvrzují, že vozidlo, klíče a doklady byly předány ve výše uvedeném stavu.',
      ].filter(Boolean) as string[],
    });
  }

  return attachTranslations(sections, buildCarTranslationsBySection(d, hasPremiumClauses));
}

// ─────────────────────────────────────────────
//  NÁJEMNÍ SMLOUVA
// ─────────────────────────────────────────────
function buildLeaseContractSections(d: StoredContractData): ContractSection[] {
  const { hasPremiumClauses } = resolveTierFeatures(d);
  const includeLeaseHandoverProtocol = Boolean(d.packageKey) || hasCheckoutAddon(d, 'handover_protocol');
  const propertyAddress = asText(d.propertyAddress || d.flatAddress);
  const propertyLayout = asText(d.propertyLayout || d.flatLayout, 'neuvedeno');
  const utilitiesAmount = d.utilitiesAmount ?? d.utilityAmount ?? '';
  const paymentDay =
    d.paymentDay !== undefined && d.paymentDay !== null && String(d.paymentDay).trim() !== ''
      ? String(d.paymentDay).replace(/\D/g, '')
      : '5';

  // Doba určitá vyžaduje konkrétní endDate; pokud chybí, smlouva tiše degraduje
  // na neurčitou (lepší než zaplacené PDF s prázdným podtržítkem).
  const isFixedTerm = d.duration === 'fixed' && Boolean(d.endDate);
  const leaseDuration = d.leaseDuration
    ? asText(d.leaseDuration)
    : isFixedTerm
      ? `určitou, a to do ${formatDate(d.endDate)}`
      : 'neurčitou';
  const hasDeposit = d.depositAmount !== undefined && d.depositAmount !== null && String(d.depositAmount).trim() !== '' && Number(d.depositAmount) > 0;
  const hasUtilities = utilitiesAmount !== '' && utilitiesAmount !== undefined && utilitiesAmount !== null && Number(utilitiesAmount) > 0;

  const monthlyTotal = (Number(d.rentAmount || 0) + Number(utilitiesAmount || 0)).toString();
  const useInflationIndexation = hasPremiumClauses && (d.includeInflationIndexation === true || d.rentIndexationMode === 'cpi' || d.rentIndexationMode === 'inflation');

  const premiumContent: ContractSection[] = hasPremiumClauses ? [
    {
      title: 'XI. PROVOZNÍ A DOKUMENTAČNÍ UJEDNÁNÍ',
      body: [
        'Veškeré skutečnosti podstatné pro vznik, změnu nebo zánik práv a povinností z tohoto nájemního vztahu (hlášení závad a havárií, předání a vrácení klíčů, změny v obsazení domácnosti, dohody o termínech předání bytu a záznamy o provedených opravách) budou mezi stranami potvrzovány prokazatelným způsobem — přednostně formou e-mailové korespondence na adresy uvedené v čl. X, případně doporučenou zásilkou.',
        'Při skončení nájmu bude o předání bytu sepsán protokol o předání a převzetí (Příloha č. 1 této smlouvy), jehož součástí jsou: stav měřidel ke dni předání, seznam předaných klíčů a přístupových karet, soupis předávaného vybavení a posouzení stavu každé místnosti. Pořízená fotodokumentace může být připojena jako nedílná součást protokolu.',
        'Vznikne-li spor o rozsah poškození přesahujícího obvyklé opotřebení, zavazují se strany nejprve usilovat o smírné určení výše škody. Nedospějí-li ke shodě, jsou oprávněny přizvat odborného znalce nebo odhadce; náklady posouzení nese strana, jejíž tvrzení se ukáže jako neodůvodněné.',
        'Nájemce odpovídá za škodu způsobenou na bytě nebo společných částech domu osobami, jimž umožnil přístup do bytu.',
      ],
    },
    {
      title: 'XII. ZVLÁŠTNÍ USTANOVENÍ PŘI SKONČENÍ NÁJMU',
      body: [
        'Smluvní strany si nejpozději 5 pracovních dnů před plánovaným skončením nájmu písemně potvrdí přesný termín a čas protokolárního předání bytu. Nedojde-li k dohodě o termínu, je pronajímatel oprávněn určit termín jednostranně v pracovní době, a to s předstihem alespoň 3 pracovních dnů.',
        'Pronajímatel je povinen vrátit jistotu nebo její nevyčerpanou část postupem dle čl. V odst. 3 smlouvy. Součástí vrácení jistoty je vždy písemný výkaz zúčtování, v němž jsou jednotlivé uplatněné pohledávky specifikovány co do důvodu, rozsahu a výše. Bez takového výkazu nelze jistotu nebo její část jednostranně zadržet nad zákonný rámec.',
        'Vyžaduje-li stav bytu po skončení nájmu provedení oprav nebo odborného úklidu na náklady nájemce, pronajímatel nájemce o tom písemně vyrozumí před zahájením prací, sdělí mu předpokládané náklady a poskytne mu přiměřenou lhůtu k vyjádření, nejméně 5 pracovních dnů. Tím nejsou dotčena práva pronajímatele při naléhavých nebo havarijních opravách.',
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
        (d.flatArea || d.approxArea) ? `Podlahová plocha bytu: ${asText(d.flatArea || d.approxArea)} m².` : '',
        'Pronajímatel prohlašuje, že je oprávněn byt přenechat nájemci do užívání a že mu nejsou známy právní nebo faktické překážky, které by bránily řádnému užívání bytu nájemcem podle této smlouvy.',
        'Nájemce potvrzuje, že se před podpisem smlouvy seznámil se stavem předmětu nájmu a přebírá jej v tomto stavu, podrobně popsaném v přiloženém předávacím protokolu.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. DOBA NÁJMU',
      body: [
        `Nájem se sjednává na dobu: ${leaseDuration}.`,
        d.startDate ? `Počátek nájmu: ${formatDate(d.startDate)}.` : '',
        d.handoverDate ? `Datum fyzického předání bytu: ${formatDate(d.handoverDate)}.` : '',
        isFixedTerm
          ? 'Nájem skončí uplynutím sjednané doby, nedohodnou-li se smluvní strany písemně jinak. Výpověď nájmu před uplynutím sjednané doby je možná pouze z důvodů stanovených zákonem nebo touto smlouvou. Pokračuje-li nájemce v užívání bytu po dobu delší než tři měsíce po skončení nájmu bez námitek pronajímatele, platí, že byl nájem znovu ujednán na tutéž dobu (max. 2 roky) a za týchž podmínek (§ 2230 OZ).'
          : 'Nájemce může nájem vypovědět s tříměsíční výpovědní dobou bez udání důvodu. Pronajímatel může nájem vypovědět v tříměsíční výpovědní době, a to pouze z důvodů stanovených zákonem (§ 2288 OZ).',
      ].filter(Boolean) as string[],
    },
    {
      title: 'IV. NÁJEMNÉ A ÚHRADY ZA PLNĚNÍ SPOJENÁ S UŽÍVÁNÍM BYTU',
      body: [
        `Měsíční nájemné činí ${formatAmount(d.rentAmount)} Kč.`,
        hasUtilities
          ? `Měsíční zálohy na plnění spojená s užíváním bytu (služby) činí ${formatAmount(utilitiesAmount)} Kč.`
          : 'Měsíční zálohy na plnění spojená s užíváním bytu (služby) nebyly samostatně sjednány; náklady na služby si nájemce hradí samostatně přímo poskytovatelům nebo na základě vyúčtování pronajímatele.',
        hasUtilities ? `Celková měsíční platba (nájemné + zálohy) činí ${formatAmount(monthlyTotal)} Kč.` : '',
        `Nájemné${hasUtilities ? ' a zálohy na služby jsou splatné' : ' je splatné'} vždy do ${paymentDay}. dne příslušného měsíce předem.`,
        d.bankAccount ? `Bankovní účet pronajímatele: ${asText(d.bankAccount)}.` : '',
        d.variableSymbol ? `Variabilní symbol: ${asText(d.variableSymbol)}.` : '',
        d.utilitiesIncludedText
          ? `Specifikace zahrnutých služeb a záloh: ${asText(d.utilitiesIncludedText)}.`
          : hasUtilities
            ? 'Zálohy na služby zahrnují: vodné/stočné, teplo/TUV, společné prostory, odpad — dle skutečných nákladů správce/pronajímatele.'
            : '',
        hasUtilities ? 'Pronajímatel je povinen jedenkrát ročně provést vyúčtování skutečných nákladů na plnění spojená s užíváním a doručit je nájemci do 4 měsíců od skončení zúčtovacího období (§ 7 zákona č. 67/2013 Sb.).' : '',
        useInflationIndexation
          ? 'Smluvní strany sjednávají, že pronajímatel je oprávněn vždy k 1. dubnu kalendářního roku jednostranně zvýšit nájemné o míru inflace vyjádřenou přírůstkem průměrného ročního indexu spotřebitelských cen za předchozí kalendářní rok, vyhlášenou Českým statistickým úřadem. Oznámení o zvýšení nájemného musí být nájemci doručeno písemně nejpozději 30 dnů před první splatností takto zvýšeného nájemného.'
          : 'Pronajímatel může nájemci písemně navrhnout zvýšení nájemného v souladu se zákonem, zejména s ohledem na obvyklé nájemné v místě a na omezení vyplývající z § 2249 OZ. Nedohodnou-li se strany na zvýšení nájemného, postupuje se podle příslušných ustanovení občanského zákoníku.',
        'Elektřina a plyn odebírané přímo nájemcem na základě vlastní smlouvy s dodavatelem nejsou součástí výše uvedených záloh na služby a hradí je nájemce samostatně.',
        'V případě prodlení nájemce s úhradou nájemného nebo zálohy na služby je pronajímatel oprávněn požadovat zákonný úrok z prodlení ve výši stanovené nařízením vlády č. 351/2013 Sb., a to ode dne splatnosti do dne úhrady.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'V. JISTOTA (KAUCE)',
      body: hasDeposit
        ? [
            `Nájemce je povinen před převzetím bytu (nejpozději při podpisu smlouvy) složit pronajímateli peněžitou jistotu ve výši ${formatAmount(d.depositAmount)} Kč${(d.rentAmount && Number(d.rentAmount) > 0) ? ` (tj. ${Math.round(Number(d.depositAmount) / Number(d.rentAmount))}× měsíční nájemné)` : ''}.`,
            'Jistota slouží k zajištění pohledávek pronajímatele vzniklých z nájmu, zejména dlužného nájemného, záloh na služby, náhrady škody a nákladů na odstranění poškození bytu nad rámec obvyklého opotřebení.',
            'Při skončení nájmu je pronajímatel povinen vrátit jistotu nebo její nevyčerpanou část nájemci spolu s úroky ve výši zákonné sazby (§ 2254 odst. 2 OZ), po odečtení prokázaných a řádně specifikovaných pohledávek pronajímatele. Smluvní strany doporučeně sjednávají, že pronajímatel předá vyúčtování jistoty bez zbytečného odkladu po vyklizení bytu a zjištění stavu předávaných prostor.',
            'Pronajímatel je oprávněn z jistoty započíst své splatné a řádně specifikované pohledávky vzniklé z nájmu. O provedeném zápočtu je povinen nájemce bez zbytečného odkladu písemně vyrozumět a připojit přehled započtených položek.',
            'Peněžitá jistota a případné právo pronajímatele na zaplacení smluvní pokuty nesmí v souhrnu přesáhnout trojnásobek měsíčního nájemného (§ 2254 OZ).',
          ]
        : [
            'Peněžitá jistota (kauce) nebyla mezi smluvními stranami sjednána.',
          ],
    },
    {
      title: 'VI. PRAVIDLA UŽÍVÁNÍ BYTU',
      body: [
        d.maxOccupants ? `Maximální počet osob trvale užívajících byt je ${asText(d.maxOccupants)} (vč. nájemce). Nájemce je povinen bez zbytečného odkladu oznámit pronajímateli zvýšení počtu osob žijících v bytě; pronajímatel může požadovat pouze takový počet osob, který je přiměřený velikosti bytu a obvyklým hygienickým podmínkám.` : '',
        `Domácí zvířata: ${d.allowPets ? 'chov zvířat je mezi stranami výslovně vzat na vědomí; nájemce odpovídá za veškeré škody a zvýšené náklady způsobené chovem' : 'nájemce je oprávněn chovat v bytě zvíře, pokud tím nepůsobí pronajímateli nebo ostatním obyvatelům domu obtíže nepřiměřené poměrům v domě; o chovu zvířete je povinen pronajímatele předem informovat'}.`,
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
        'Nájemce je oprávněn přenechat část bytu do podnájmu jiné osobě, pokud v bytě sám trvale bydlí; o takovém podnájmu je povinen pronajímatele bez zbytečného odkladu informovat. Přenechat byt v celku nebo jeho část do podnájmu v případě, kdy nájemce v bytě sám trvale nebydlí, může jen s předchozím písemným souhlasem pronajímatele.',
        'Nájemce je povinen na písemnou výzvu pronajímatele doložit do 7 dnů existenci platného pojištění domácnosti zahrnujícího odpovědnost za škodu způsobenou třetím osobám v souvislosti s užíváním bytu (doporučený limit odpovědnosti min. 500 000 Kč). Nepředloží-li nájemce doklad o pojištění ve stanovené lhůtě, je pronajímatel oprávněn jej k tomu opakovaně písemně vyzvat; opakované nevyhovění výzvě se považuje za porušení povinností ze smlouvy.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'VII. PŘEDÁNÍ BYTU A PŘEDÁVACÍ PROTOKOL',
      body: [
        d.keysCount ? `Pronajímatel předá nájemci klíče v počtu ${asText(d.keysCount)} ks (včetně klíčů od vchodových dveří, schránky a dalšího příslušenství dle předávacího protokolu).` : '',
        'Nájemce není oprávněn zhotovovat kopie klíčů bez předchozího souhlasu pronajímatele. V případě ztráty nebo odcizení klíčů je nájemce povinen tuto skutečnost bez zbytečného odkladu písemně oznámit pronajímateli. Náklady na výměnu cylindrické vložky nebo zámku hradí v takovém případě nájemce.',
        d.electricityMeter
          ? `Stav elektroměru při předání: ${asText(d.electricityMeter)} kWh${d.electricityMeterSerial ? `, výrobní číslo ${asText(d.electricityMeterSerial)}` : ''}.`
          : '',
        d.gasMeter
          ? `Stav plynoměru při předání: ${asText(d.gasMeter)} m³${d.gasMeterSerial ? `, výrobní číslo ${asText(d.gasMeterSerial)}` : ''}.`
          : '',
        d.waterMeter
          ? `Stav vodoměru při předání: ${asText(d.waterMeter)} m³${d.waterMeterSerial ? `, výrobní číslo ${asText(d.waterMeterSerial)}` : ''}.`
          : '',
        d.hotWaterMeter
          ? `Stav vodoměru teplé vody při předání: ${asText(d.hotWaterMeter)} m³${d.hotWaterMeterSerial ? `, výrobní číslo ${asText(d.hotWaterMeterSerial)}` : ''}.`
          : '',
        d.equipmentList ? `Inventář předávaného vybavení a zařízení: ${asText(d.equipmentList)}.` : '',
        d.knownDefects
          ? `Pronajímatelem přiznané vady a závady: ${asText(d.knownDefects)}.`
          : 'Byt se předává bez výslovně oznámených vad nad rámec běžného opotřebení.',
        includeLeaseHandoverProtocol
          ? 'Podrobný předávací protokol je přílohou č. 1 této smlouvy a tvoří její nedílnou součást.'
          : '',
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
        LEASE_MINOR_REPAIRS_NOTE,
        'Větší opravy a rekonstrukce hradí pronajímatel, nejde-li o poškození způsobené nájemcem nebo osobami, kterým nájemce umožnil přístup do bytu.',
      ],
    },
    {
      title: 'X. DORUČOVÁNÍ PÍSEMNOSTÍ',
      body: [
        `Písemnosti pronajímateli budou doručovány na adresu: ${asText(d.landlordAddress)}${d.landlordEmail ? `, případně na e-mail: ${asText(d.landlordEmail)}` : ''}.`,
        `Písemnosti nájemci budou doručovány na adresu pronajatého bytu: ${propertyAddress}${d.tenantEmail ? `, případně na e-mail: ${asText(d.tenantEmail)}` : ''}.`,
        'Právní jednání směřující ke změně nebo ukončení nájmu se doručují osobně, doporučenou zásilkou, datovou schránkou nebo jiným prokazatelným způsobem. E-mail lze použít zejména pro běžnou provozní komunikaci a pro zasílání oznámení, pokud druhá strana takovou adresu sdělila a komunikaci tímto způsobem dlouhodobě používá.',
        'Odmítne-li adresát zásilku převzít, považuje se za doručenou dnem odmítnutí. Nevyzvedne-li si uloženou zásilku ve lhůtě stanovené doručovatelem, považuje se za doručenou posledním dnem úložní doby, připouští-li to právní předpis a povaha doručované písemnosti.',
      ],
    },
    ...premiumContent,
    {
      title: `${hasPremiumClauses ? 'XIII' : 'XI'}. ZÁVĚREČNÁ USTANOVENÍ`,
      body: [
        'Tato smlouva se řídí právním řádem České republiky, zejména zákonem č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů, a zákonem č. 67/2013 Sb. (vyúčtování služeb).',
        disputeClause(d),
        'Smlouva je vyhotovena ve dvou stejnopisech; pronajímatel a nájemce obdrží po jednom stejnopisu.',
        'Změny jsou platné pouze ve formě písemných, číslovaných a podepsaných dodatků.',
        'Neplatnost jednotlivého ustanovení smlouvy nemá vliv na platnost ostatních ustanovení.',
        includeLeaseHandoverProtocol
          ? 'Přílohou č. 1 smlouvy je předávací protokol, který tvoří nedílnou součást smlouvy.'
          : '',
        'Změna vlastníka pronajaté věci sama o sobě nájemní vztah neruší; nabyvatel vstupuje do práv a povinností pronajímatele ode dne nabytí vlastnictví (§ 2221 OZ).',
        'Zpracování osobních údajů probíhá v souladu s nařízením EU 2016/679 (GDPR) a zákonem č. 110/2019 Sb. o zpracování osobních údajů. Osobní údaje uvedené v této smlouvě jsou zpracovávány výhradně za účelem uzavření, plnění a případného vymáhání práv z tohoto smluvního vztahu. Správcem osobních údajů je každá ze smluvních stran v rozsahu údajů, které zpracovává o druhé straně. Každá ze stran má právo na přístup ke svým osobním údajům, jejich opravu nebo výmaz, jakož i právo podat stížnost u Úřadu pro ochranu osobních údajů (www.uoou.cz). Osobní údaje budou uchovávány po dobu trvání smluvního vztahu a dále po dobu stanovenou právními předpisy, zpravidla 10 let od jeho skončení.',
        'Žádná ze smluvních stran neodpovídá za nesplnění nepeněžitých povinností způsobené vyšší mocí (vis maior), tj. událostí mimořádnou, nepředvídatelnou a nepřekonatelnou (§ 2913 odst. 2 OZ). Vyšší moc se nevztahuje na povinnost zaplatit peněžitou částku. Strana postižená vyšší mocí je povinna neprodleně písemně informovat druhou stranu a po odpadnutí překážky neprodleně pokračovat v plnění.',
      ].filter(Boolean) as string[],
    },
  ];

  sections.push({
    title: `${hasPremiumClauses ? 'XIV' : 'XII'}. PODPISY`,
    body: [],
  });

  // Předávací protokol — body je záměrně prázdné.
  // PDF renderer detekuje titul a volá drawLeaseProtocolForm(), která čte data přímo.
  if (includeLeaseHandoverProtocol) {
    sections.push({
    title: `PŘÍLOHA Č. 1 – PŘEDÁVACÍ PROTOKOL K NÁJEMNÍ SMLOUVĚ`,
    body: [],
    });
  }

  // Attach foreign-language translations (EN populated; UK/RU/VN/DE are
  // skeletons waiting for a translator). Index-aligned with each section's
  // post-filter body by construction.
  const translations = buildLeaseTranslationsBySection(d, hasPremiumClauses, includeLeaseHandoverProtocol);
  for (let i = 0; i < sections.length; i++) {
    if (translations[i]) sections[i].translations = translations[i];
  }

  return sections;
}

// ─────────────────────────────────────────────
//  SMLOUVA O ZÁPŮJČCE
// ─────────────────────────────────────────────
function buildLoanContractSections(d: StoredContractData): ContractSection[] {
  const { hasPremiumClauses } = resolveTierFeatures(d);
  const isInterestBearing = Boolean(d.interestRate && Number(d.interestRate) > 0);
  const interestDesc = isInterestBearing
    ? `Zápůjčka je úročená. Úroková sazba činí ${formatCsNumber(d.interestRate)} % p. a. Úroky jsou splatné ${d.interestPayment === 'monthly' ? 'měsíčně spolu s jistinou' : 'jednorázově spolu se splacením celé jistiny'}.`
    : 'Zápůjčka je sjednána jako bezúplatná (bezúročná). Vydlužitel je povinen vrátit věřiteli pouze zapůjčenou jistinu (§ 2390 odst. 1 OZ).';
  // Předčasné splacení — sjednocená jediná varianta dle volby uživatele.
  // Defaultně bez sankce (férovější u soukromé zápůjčky); při explicitně sjednaném
  // poplatku se aplikuje pouze pro úročenou zápůjčku.
  const hasPrepaymentFee = isInterestBearing && Boolean(d.prepaymentFee && Number(d.prepaymentFee) > 0);
  const prepaymentDesc = hasPrepaymentFee
    ? `Vydlužitel je oprávněn splatit zápůjčku nebo její část předčasně. V takovém případě je povinen uhradit věřiteli sjednaný poplatek ve výši ${formatCsNumber(d.prepaymentFee)} % z předčasně splacené jistiny.`
    : 'Vydlužitel je oprávněn splatit zápůjčku nebo její část předčasně bez sankce.';

  const repaymentDesc =
    d.repaymentType === 'installments'
      ? `Vydlužitel se zavazuje vrátit zápůjčku v ${asText(d.installmentCount, 'neuvedeno')} pravidelných měsíčních ${Number(d.installmentCount) === 1 ? 'splátce' : 'splátkách'} po ${formatAmount(d.installmentAmount)} Kč, ${Number(d.installmentCount) === 1 ? 'splatné' : 'splatných vždy'} ${asText(d.paymentDay, '15')}. dne ${Number(d.installmentCount) === 1 ? 'příslušného' : 'každého'} měsíce, počínaje ${formatDate(d.firstPaymentDate, 'neuvedeno')}.`
      : `Vydlužitel se zavazuje vrátit celou zápůjčku jednorázově nejpozději dne ${formatDate(d.repaymentDate, 'neuvedeno')}.`;

  const hasSecurity = d.securityType && d.securityType !== 'none' && d.securityType !== '';
  const hasGuarantor = d.securityType === 'guarantee' && Boolean(d.guarantorName);
  const premiumContent: ContractSection[] = hasPremiumClauses ? [
    // Sekce ZAJIŠTĚNÍ se vykresluje pouze pokud user explicitně zvolil zajištění.
    // Pro nezajištěné zápůjčky by jinak vznikla prázdná sekce s jedinou větou.
    ...(hasSecurity ? [{
      title: 'VI. ZAJIŠTĚNÍ POHLEDÁVKY',
      body: [
        hasGuarantor
          ? `Závazek vydlužitele je zajištěn osobním ručením třetí osoby: ${asText(d.guarantorName)}${d.guarantorId ? `, nar./IČO: ${asText(d.guarantorId)}` : ''}${d.guarantorAddress ? `, bytem: ${asText(d.guarantorAddress)}` : ''}. Ručitel se zavazuje splnit závazek vydlužitele v případě, že tak vydlužitel neučiní (§ 2018 a násl. OZ).`
          : d.securityType === 'guarantee'
          ? 'Závazek vydlužitele je zajištěn osobním ručením třetí osoby; identifikační údaje ručitele a samostatné prohlášení ručitele tvoří přílohu této smlouvy (§ 2018 a násl. OZ).'
          : d.securityType === 'pledge'
          ? d.pledgeDescription
            ? `Závazek vydlužitele je zajištěn zástavním právem k věci: ${asText(d.pledgeDescription)}. Zástavní smlouva je sepsána samostatně (§ 1309 a násl. OZ).`
            : 'Závazek vydlužitele je zajištěn zástavním právem; popis zastavené věci a podmínky zástavy upravuje samostatná zástavní smlouva (§ 1309 a násl. OZ).'
          : d.securityType === 'bill'
          ? 'Závazek vydlužitele je zajištěn vlastní směnkou vystavenou vydlužitelem na věřitele, splatnou ke dni splatnosti zápůjčky; směnka se řídí zákonem směnečným a šekovým (191/1950 Sb.).'
          : '',
        // Akceptační prohlášení ručitele — bez něj je ručitelský závazek bez právního účinku.
        hasGuarantor
          ? 'Ručitel prohlašuje, že se seznámil s obsahem této smlouvy, zejména s výší zápůjčky, úroky, dobou splatnosti, smluvní pokutou a podmínkami ztráty výhody splátek, a tyto podmínky bere na vědomí. Ručitel přijímá ručení a zavazuje se uspokojit pohledávku věřitele včetně příslušenství, nesplní-li ji vydlužitel řádně a včas po písemné výzvě věřitele (§ 2021 OZ).'
          : '',
        // Rozsah ručení — explicitně, aby nedocházelo k nejasnostem ohledně smluvní pokuty.
        hasGuarantor
          ? 'Ručení se vztahuje na jistinu zápůjčky, sjednané úroky, zákonný úrok z prodlení a účelně vynaložené náklady spojené s uplatněním pohledávky. Ručení se nevztahuje na smluvní pokutu, není-li výslovně sjednáno jinak.'
          : '',
        'V případě nesplacení pohledávky je věřitel oprávněn uplatnit zajišťovací prostředky v souladu s platnými právními předpisy, není-li zákonem stanoveno jinak.',
        'Zajištění zůstává v platnosti po celou dobu trvání závazku a zaniká teprve úplným uhrazením pohledávky včetně příslušenství.',
      ].filter(Boolean) as string[],
    }] : []),
    {
      title: 'VII. PŘEDČASNÉ SPLACENÍ, ZRYCHLENÍ SPLATNOSTI A POSTOUPENÍ',
      body: [
        prepaymentDesc,
        'Bylo-li ujednáno plnění ve splátkách a vydlužitel neuhradí některou splátku řádně a včas, je věřitel oprávněn požadovat zaplacení celé zbývající pohledávky (ztráta výhody splátek), pokud toto právo uplatní nejpozději do splatnosti nejbližší následující splátky (§ 1931 OZ). Věřitel uplatní toto právo písemnou výzvou doručenou vydlužiteli; ve výzvě uvede výši zbývající jistiny, přirostlých úroků a lhůtu k zaplacení.',
        'Při podstatném porušení smlouvy vydlužitelem (§ 2002 OZ), zejména při opakovaném prodlení se splátkami nebo nepravdivosti prohlášení uvedených v čl. V, je věřitel oprávněn od smlouvy odstoupit; účinky odstoupení nastávají dnem doručení písemného oznámení vydlužiteli.',
        LOAN_ASSIGNMENT_CONSUMER_SAFE,
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
          ? d.borrowerBankAccount
            ? `Peněžní prostředky budou poukázány bankovním převodem na účet vydlužitele č. ${asText(d.borrowerBankAccount)}, a to do ${asText(d.disbursementDays, '5')} pracovních dnů od podpisu smlouvy.`
            : `Peněžní prostředky budou poukázány bankovním převodem na účet vydlužitele sdělený při podpisu smlouvy, a to do ${asText(d.disbursementDays, '5')} pracovních dnů od podpisu.`
          : 'Peněžní prostředky budou předány vydlužiteli v hotovosti při podpisu smlouvy, o čemž bude sepsána stvrzenka.',
        `Účel použití zápůjčky: ${asText(d.loanPurpose, 'není omezen — vydlužitel může použít prostředky libovolně')}.`,
      ],
    },
    {
      title: 'III. ÚROKY A NÁKLADY ZÁPŮJČKY',
      body: [
        interestDesc,
        isInterestBearing
          ? `Úroky se počítají z nesplacené jistiny. Roční úroková sazba ${formatCsNumber(d.interestRate)} % odpovídá denní sazbě ${formatCsNumber(Number(d.interestRate) / 365, 4)} %.`
          : 'Věřitel nenárokuje žádné poplatky, provize ani jiné odměny v souvislosti s poskytnutím bezúročné zápůjčky.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'IV. SPLÁCENÍ A SPLATNOST',
      body: [
        repaymentDesc,
        d.repaymentType === 'installments' && isInterestBearing
          ? 'Každá splátka se použije nejprve na úhradu splatných úroků a teprve zbývající část na snížení jistiny (§ 1932 OZ).'
          : '',
        d.repaymentType === 'installments' && isInterestBearing
          ? 'Výše poslední splátky bude upravena tak, aby odpovídala skutečně nesplacené jistině a přirostlým úrokům ke dni její splatnosti.'
          : '',
        d.bankAccount ? `Platby budou zasílány na bankovní účet věřitele č. ${asText(d.bankAccount)}${d.variableSymbol ? `, VS: ${asText(d.variableSymbol)}` : ''}.` : '',
        d.minLatePenalty && Number(d.minLatePenalty) > 0
          ? `Smluvní pokuta za prodlení se splátkou činí ${formatCsNumber(d.latePenaltyRate ?? '0,05')} % z dlužné částky za každý den prodlení, nejméně však ${formatCsNumber(d.minLatePenalty)} Kč; minimální výše pokuty byla sjednána s ohledem na výši zápůjčky a strany ji považují za přiměřenou.`
          : `Smluvní pokuta za prodlení se splátkou činí ${formatCsNumber(d.latePenaltyRate ?? '0,05')} % z dlužné částky za každý den prodlení.`,
        // Pravidla pro ztrátu výhody splátek a předčasné splacení jsou systematicky
        // v premium sekci VII; v Basic tieru je zde shrnutí ve zjednodušené formě.
        ...(hasPremiumClauses ? [] : [
          'Bylo-li ujednáno plnění ve splátkách a vydlužitel neuhradí některou splátku řádně a včas, je věřitel oprávněn požadovat zaplacení celé zbývající pohledávky, pokud toto právo uplatní nejpozději do splatnosti nejbližší následující splátky (§ 1931 OZ). Věřitel uplatní toto právo písemnou výzvou doručenou vydlužiteli.',
          prepaymentDesc,
        ]),
      ].filter(Boolean) as string[],
    },
    {
      title: 'V. PROHLÁŠENÍ SMLUVNÍCH STRAN',
      body: [
        'Věřitel prohlašuje, že je oprávněn s poskytovanými prostředky disponovat a že na nich nevázne právo třetí osoby, které by bránilo jejich přenechání vydlužiteli.',
        'Smluvní strany prohlašují, že smlouvu uzavírají svobodně, vážně, určitě a nikoli v tísni ani za nápadně nevýhodných podmínek (§ 1796 OZ).',
        'Věřitel prohlašuje, že tuto zápůjčku neposkytuje v rámci své podnikatelské činnosti ani opakovaně či soustavně jako finanční službu spotřebitelům. Tato smlouva není určena pro poskytování spotřebitelského úvěru ve smyslu zákona č. 257/2016 Sb., o spotřebitelském úvěru; v takových případech podléhá činnost dohledu České národní banky a vyžaduje oprávnění podle uvedeného zákona.',
      ],
    },
    ...premiumContent,
    {
      title: `${hasPremiumClauses ? 'VIII' : 'VI'}. ZÁVĚREČNÁ USTANOVENÍ`,
      body: [
        'Smlouva se řídí právním řádem České republiky, zejména zákonem č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů.',
        disputeClause(d),
        hasGuarantor
          ? 'Smlouva je vyhotovena ve třech stejnopisech; věřitel, vydlužitel i ručitel obdrží po jednom stejnopisu.'
          : 'Smlouva je vyhotovena ve dvou stejnopisech; věřitel a vydlužitel obdrží po jednom stejnopisu.',
        'Změny a doplnění smlouvy jsou platné pouze ve formě písemných, číslovaných a podepsaných dodatků.',
        'Neplatnost jednotlivého ustanovení smlouvy nemá vliv na platnost ostatních ustanovení.',
        'Zpracování osobních údajů probíhá v souladu s nařízením EU 2016/679 (GDPR) a zákonem č. 110/2019 Sb. o zpracování osobních údajů. Osobní údaje uvedené v této smlouvě jsou zpracovávány výhradně za účelem uzavření, plnění a případného vymáhání práv z tohoto smluvního vztahu. Správcem osobních údajů je každá ze smluvních stran v rozsahu údajů, které zpracovává o druhé straně. Každá ze stran má právo na přístup ke svým osobním údajům, jejich opravu nebo výmaz, jakož i právo podat stížnost u Úřadu pro ochranu osobních údajů (www.uoou.cz). Osobní údaje budou uchovávány po dobu trvání smluvního vztahu a dále po dobu stanovenou právními předpisy, zpravidla 10 let od jeho skončení.',
        'Žádná ze smluvních stran neodpovídá za nesplnění nepeněžitých povinností způsobené vyšší mocí (vis maior), tj. událostí mimořádnou, nepředvídatelnou a nepřekonatelnou (§ 2913 odst. 2 OZ). Vyšší moc se nevztahuje na povinnost zaplatit peněžitou částku. Strana postižená vyšší mocí je povinna neprodleně písemně informovat druhou stranu a po odpadnutí překážky neprodleně pokračovat v plnění.',
      ],
    },
  ];

  sections.push({
    title: `${hasPremiumClauses ? 'IX' : 'VII'}. PODPISY`,
    body: [],
  });

  // Přílohy — vykreslují se v PDF specializovaným rendererem podle titulu.
  const { hasCompletePages } = resolveTierFeatures(d);
  if (hasCompletePages) {
    // Potvrzení o předání peněz — pouze u hotovostního převodu.
    if (d.transferMethod !== 'transfer') {
      sections.push({
        title: 'PŘÍLOHA Č. 1 – POTVRZENÍ O PŘEDÁNÍ PENĚŽNÍCH PROSTŘEDKŮ',
        body: [],
      });
    }
    // Splátkový kalendář — u úročené zápůjčky se splátkami má reálnou hodnotu.
    const hasSchedule = d.repaymentType === 'installments'
      && Number(d.installmentCount) > 0
      && Number(d.installmentAmount) > 0
      && Number(d.loanAmount) > 0;
    if (hasSchedule) {
      sections.push({
        title: d.transferMethod !== 'transfer'
          ? 'PŘÍLOHA Č. 2 – SPLÁTKOVÝ KALENDÁŘ'
          : 'PŘÍLOHA Č. 1 – SPLÁTKOVÝ KALENDÁŘ',
        body: [],
      });
    }
  }

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
    : 'Porušení povinnosti mlčenlivosti zakládá nárok na náhradu prokazatelně způsobené škody dle obecné úpravy občanského zákoníku.';

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
        'Poskytující strana je oprávněna provést audit způsobu uložení a zpracování důvěrných informací u Přijímající strany, a to nejvýše jednou za 12 měsíců po předchozím písemném oznámení s předstihem minimálně 5 pracovních dnů. Náklady auditu nese Poskytující strana; je-li auditem zjištěno porušení smlouvy, nese náklady auditu Přijímající strana.',
        'Přijímající strana je povinna vést evidenci osob, které mají přístup k důvěrným informacím (jméno, role, datum udělení a odebrání přístupu), a tuto evidenci na žádost Poskytující strany do 5 pracovních dnů předložit.',
        'Přijímající strana je povinna bez zbytečného odkladu, nejpozději do 72 hodin od zjištění, písemně oznámit Poskytující straně jakýkoli bezpečnostní incident nebo důvodné podezření z úniku důvěrných informací a poskytnout součinnost při řešení následků.',
      ],
    },
    {
      title: 'IX. TECHNICKÁ A ORGANIZAČNÍ OPATŘENÍ K OCHRANĚ INFORMACÍ',
      body: [
        `Přijímající strana je povinna zavést a udržovat přiměřená technická a organizační opatření k ochraně důvěrných informací, zejména: (a) šifrování důvěrných dat v klidu i při přenosu (TLS/HTTPS, šifrování úložišť), (b) vícefaktorové ověřování pro přístupy k systémům obsahujícím důvěrné informace, (c) segregaci přístupů podle principu nejnižšího nezbytného oprávnění, (d) průběžnou aktualizaci bezpečnostních záplat a antimalware ochranu.`,
        `Mezi zvláště chráněné kategorie informací patří zejména: ${asText(d.specialInfoCategories, 'obchodní tajemství, know-how, zdrojové kódy, databáze zákazníků, obchodní plány, finanční výsledky, technické výkresy a specifikace')}. Pro tyto kategorie zavede Přijímající strana zvýšenou úroveň ochrany, včetně logování přístupů s minimální dobou uchování záznamů 12 měsíců.`,
        'Přijímající strana zajistí, aby všechny osoby, které mají přístup k důvěrným informacím, byly písemně vázány mlčenlivostí v rozsahu nejméně odpovídajícím této smlouvě.',
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
        'Tato smlouva představuje úplné ujednání o jejím předmětu a nahrazuje veškerá předchozí ujednání, prohlášení a přísliby týkající se důvěrných informací a jejich ochrany.',
        'Smlouva je vyhotovena ve dvou stejnopisech; Poskytující strana a Přijímající strana obdrží po jednom stejnopisu.',
        'Změny jsou platné pouze ve formě písemných, číslovaných a podepsaných dodatků.',
        'Je-li jakékoli ustanovení smlouvy neplatné nebo nevymahatelné, ostatní ustanovení zůstávají v plné platnosti a účinnosti.',
        'Zpracování osobních údajů probíhá v souladu s nařízením EU 2016/679 (GDPR) a zákonem č. 110/2019 Sb. o zpracování osobních údajů. Osobní údaje uvedené v této smlouvě jsou zpracovávány výhradně za účelem uzavření, plnění a případného vymáhání práv z tohoto smluvního vztahu. Správcem osobních údajů je každá ze smluvních stran v rozsahu údajů, které zpracovává o druhé straně. Každá ze stran má právo na přístup ke svým osobním údajům, jejich opravu nebo výmaz, jakož i právo podat stížnost u Úřadu pro ochranu osobních údajů (www.uoou.cz). Osobní údaje budou uchovávány po dobu trvání smluvního vztahu a dále po dobu stanovenou právními předpisy, zpravidla 10 let od jeho skončení.',
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
  const subjectDesc = (() => {
    if (d.itemType === 'car') {
      const parts = [
        `motorové vozidlo tovární značky ${asText(d.carMake)}${d.carModel ? ` ${asText(d.carModel)}` : ''}`.trim(),
        d.carVIN ? `VIN: ${asText(d.carVIN)}` : '',
        d.carPlate ? `SPZ: ${asText(d.carPlate)}` : '',
        d.carYear ? `rok výroby: ${asText(d.carYear)}` : '',
        d.carMileage ? `stav tachometru: ${asText(d.carMileage)} km` : '',
      ].filter(Boolean);
      return parts.join(', ');
    }
    if (d.itemType === 'electronics') {
      const parts = [
        `elektronické zařízení: ${asText(d.itemDescription)}`,
        d.serialNumber ? `výrobní číslo / sériové číslo: ${asText(d.serialNumber)}` : '',
      ].filter(Boolean);
      return parts.join(', ');
    }
    return `${asText(d.itemDescription, 'movitá věc specifikovaná dle dohody smluvních stran')}`;
  })();

  const defectsClause = d.knownDefects
    ? `Prodávající upozornil kupujícího na tyto jemu známé vady předmětu prodeje: ${asText(d.knownDefects)}. Kupující tyto vady bere na vědomí a kupní cena je s ohledem na ně sjednána.`
    : 'Prodávající prohlašuje, že mu nejsou známy žádné skryté vady předmětu prodeje nad rámec běžného opotřebení.';

  const paymentDesc =
    d.paymentMethod === 'transfer'
      ? d.sellerBankAccount
        ? `Kupní cena bude uhrazena bankovním převodem na účet prodávajícího č. ${asText(d.sellerBankAccount)}${d.variableSymbol ? `, VS: ${asText(d.variableSymbol)}` : ''}, a to do ${asText(d.paymentDays, '5')} pracovních dnů od podpisu smlouvy.`
        : `Kupní cena bude uhrazena bankovním převodem na účet prodávajícího sdělený při podpisu smlouvy, a to do ${asText(d.paymentDays, '5')} pracovních dnů od podpisu smlouvy.`
      : d.paymentMethod === 'escrow'
      ? `Kupní cena bude uhrazena prostřednictvím advokátní/notářské úschovy. Podmínky úschovy jsou sjednány samostatně.`
      : Number(d.price ?? 0) > 270000
      ? `Pozor: kupní cena přesahuje 270 000 Kč; platba v hotovosti je vyloučena (§ 4 zák. č. 254/2004 Sb., o omezení plateb v hotovosti). Strany jsou povinny zvolit bezhotovostní úhradu.`
      : `Kupní cena bude uhrazena v hotovosti při podpisu smlouvy / předání předmětu prodeje. Strany berou na vědomí, že platba v hotovosti nad 270 000 Kč je dle zák. č. 254/2004 Sb. vyloučena.`;

  const warrantyClause = d.warrantyMonths && Number(d.warrantyMonths) > 0
    ? `Prodávající poskytuje kupujícímu smluvní záruku za jakost v délce ${asText(d.warrantyMonths)} měsíců ode dne předání, přesahující zákonný rámec. V záruční době odpovídá prodávající za to, že předmět prodeje bude mít vlastnosti sjednané touto smlouvou.`
    : d.buyerType === 'business'
    ? 'Na předmět prodeje se ve vztazích mezi podnikateli uplatní obecná úprava práv z vadného plnění podle § 2099 a násl. OZ; kupující je povinen věc prohlédnout co nejdříve po přechodu nebezpečí škody a zjištěné vady vytknout bez zbytečného odkladu.'
    : 'Je-li kupující spotřebitelem, použije se vedle obecné úpravy i zvláštní právní úprava spotřebitelské koupě; kupující je oprávněn vytknout vadu, která se projeví do 24 měsíců od převzetí věci, bez dotčení povinnosti oznámit zjištěnou vadu bez zbytečného odkladu.';

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
        `Kupní cena je sjednána dohodou smluvních stran ve výši ${formatAmount(d.price)} ${asText(d.currency, 'Kč')}${d.priceWords ? ` (slovy: ${asText(d.priceWords)})` : ''}.`,
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
        'Smlouva je vyhotovena ve dvou stejnopisech; prodávající a kupující obdrží po jednom stejnopisu.',
        'Jakékoli změny jsou platné pouze ve formě písemných, číslovaných a podepsaných dodatků.',
        'Neplatnost jednotlivého ustanovení smlouvy nemá vliv na platnost ostatních ustanovení.',
        'Zpracování osobních údajů probíhá v souladu s nařízením EU 2016/679 (GDPR) a zákonem č. 110/2019 Sb. o zpracování osobních údajů. Osobní údaje uvedené v této smlouvě jsou zpracovávány výhradně za účelem uzavření, plnění a případného vymáhání práv z tohoto smluvního vztahu. Správcem osobních údajů je každá ze smluvních stran v rozsahu údajů, které zpracovává o druhé straně. Každá ze stran má právo na přístup ke svým osobním údajům, jejich opravu nebo výmaz, jakož i právo podat stížnost u Úřadu pro ochranu osobních údajů (www.uoou.cz). Osobní údaje budou uchovávány po dobu trvání smluvního vztahu a dále po dobu stanovenou právními předpisy, zpravidla 10 let od jeho skončení.',
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
  const leadershipRole = /vedouc|ředitel|manager|director/i.test(String(d.jobTitle ?? '')) || Boolean(d.isManager || d.isExecutive || d.isLeader);
  const requestedTrialMonths = Number(d.trialPeriodMonths || 0);
  // § 35 zákoníku práce ve znění novely č. 120/2025 Sb. (flexinovela, účinnost 1. 6. 2025):
  // max. zkušební doba 4 měsíce / 8 měsíců u vedoucího zaměstnance.
  // U pracovního poměru na dobu určitou zároveň max. 1/2 sjednané doby trvání (§ 35 odst. 5 ZP).
  const maxTrialMonths = leadershipRole ? ZP_TRIAL_MONTHS_LEADERSHIP : ZP_TRIAL_MONTHS_STANDARD;
  const effectiveTrialMonths = Number.isFinite(requestedTrialMonths) && requestedTrialMonths > 0
    ? Math.min(requestedTrialMonths, maxTrialMonths)
    : 0;

  const trialPeriodClause = effectiveTrialMonths > 0
    ? `Sjednává se zkušební doba v délce ${pluralMonths(effectiveTrialMonths)} ode dne vzniku pracovního poměru (§ 35 ZP ve znění novely č. 120/2025 Sb.). U pracovního poměru sjednaného na dobu určitou nesmí zkušební doba přesáhnout polovinu sjednané doby jeho trvání. V průběhu zkušební doby může pracovní poměr zrušit kterákoliv ze stran kdykoli, a to i bez udání důvodu.`
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
    // Sekce KONKURENČNÍ DOLOŽKA se vykresluje pouze pokud ji strany sjednaly.
    // Jinak by v premium tieru byla prázdná sekce s jednou větou „nesjednává se".
    ...(d.nonCompete ? [{
      title: 'VIII. KONKURENČNÍ DOLOŽKA',
      body: [
        `Zaměstnanec se zavazuje, že po dobu ${asText(d.nonCompetePeriod, '12')} měsíců od skončení pracovního poměru nebude vykonávat výdělečnou činnost, která by byla shodná s předmětem podnikání zaměstnavatele nebo která by měla vůči zaměstnavateli soutěžní povahu (§ 310 ZP).`,
        'Za dodržení tohoto závazku náleží zaměstnanci peněžité vyrovnání ve výši alespoň poloviny průměrného měsíčního výdělku za každý měsíc plnění závazku. Vyrovnání je splatné měsíčně pozadu, vždy do 15. dne kalendářního měsíce následujícího po měsíci, za který náleží.',
        'Konkurenční doložka je věcně, časově i územně vymezena s ohledem na povahu informací, k nimž měl zaměstnanec přístup. Zaměstnavatel je oprávněn od konkurenční doložky odstoupit po dobu trvání pracovního poměru zaměstnance (§ 310 odst. 4 ZP).',
        'Při porušení konkurenční doložky je zaměstnanec povinen vrátit obdržené peněžité vyrovnání připadající na měsíce, ve kterých závazek nedodržel; tím není dotčen nárok zaměstnavatele na náhradu prokazatelně vzniklé škody.',
      ],
    }] : []),
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
        d.remoteWork
          ? `Možnost práce na dálku (home office): ${asText(formatRemoteWorkForContract(String(d.remoteWork), 'cs'))}`
          : '',
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
        'Smlouva je vyhotovena ve dvou stejnopisech; zaměstnavatel a zaměstnanec obdrží po jednom stejnopisu (§ 37 ZP).',
        'Změny pracovní smlouvy jsou platné pouze ve formě písemných, číslovaných a podepsaných dodatků (§ 564 OZ).',
        'Neplatnost jednotlivého ustanovení smlouvy nemá vliv na platnost ostatních ustanovení.',
        'Zpracování osobních údajů zaměstnance probíhá v souladu s nařízením EU 2016/679 (GDPR), zákonem č. 110/2019 Sb. a § 316 zákoníku práce. Osobní údaje jsou zpracovávány za účelem vzniku, trvání, změny a skončení pracovněprávního vztahu, plnění zákonných povinností zaměstnavatele (mzdy, pojistné, daně) a ochrany oprávněných zájmů zaměstnavatele. Zaměstnanec má právo na přístup ke svým osobním údajům, jejich opravu, výmaz nebo omezení zpracování v rozsahu stanoveném právními předpisy, a právo podat stížnost u ÚOOÚ (www.uoou.cz). Osobní údaje budou uchovávány po dobu pracovněprávního vztahu a dále po dobu stanovenou zákonem (zejm. zákon č. 582/1991 Sb., zákon č. 235/2004 Sb.).',
        'Žádná ze smluvních stran neodpovídá za nesplnění nepeněžitých povinností způsobené vyšší mocí (vis maior), tj. událostí mimořádnou, nepředvídatelnou a nepřekonatelnou (§ 2913 odst. 2 OZ). Vyšší moc se nevztahuje na povinnost zaplatit peněžitou částku. Strana postižená vyšší mocí je povinna neprodleně písemně informovat druhou stranu a po odpadnutí překážky neprodleně pokračovat v plnění.',
      ],
    },
  ];

  sections.push({ title: `${hasPremiumClauses ? 'XI' : 'IX'}. PODPISY`, body: [] });
  return attachTranslations(sections, buildEmploymentTranslationsBySection(d, hasPremiumClauses));
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

  const taxNote = `Odměna z dohody o provedení práce nepodléhá odvodům na sociální a zdravotní pojištění, pokud u jednoho zaměstnavatele v kalendářním měsíci nepřesáhne zákonem stanovenou rozhodnou částku pro účast na pojištění. ${DPP_THRESHOLD_NOTE} Zaměstnavatel současně vykazuje zaměstnance na DPP v pravidelném měsíčním hlášení dle aktuální metodiky ČSSZ.`;

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
        'Zaměstnanec uděluje zaměstnavateli souhlas k úpravám, zpracování, spojení s jiným dílem, zařazení do díla souborného a dalším změnám vytvořených výstupů v rozsahu potřebném pro jejich obvyklé užití zaměstnavatelem, není-li takový postup v rozporu s dobrými mravy nebo oprávněnými osobnostními právy autora (§ 11 zákona č. 121/2000 Sb., autorský zákon).',
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
      title: 'III. DOBA TRVÁNÍ A UKONČENÍ DOHODY',
      body: [
        `Dohoda se uzavírá na dobu: ${d.durationType === 'fixed' && d.startDate && d.endDate ? `určitou od ${formatDate(d.startDate)} do ${formatDate(d.endDate)}` : 'neurčitou'}`,
        d.deadline ? `Pracovní úkol musí být splněn nejpozději do: ${asText(d.deadline)}` : '',
        'Dohodu lze ukončit písemnou dohodou smluvních stran. Není-li sjednáno jinak, může kterákoli ze stran dohodu vypovědět z jakéhokoli důvodu nebo bez uvedení důvodu s patnáctidenní výpovědní dobou, která začíná dnem doručení výpovědi druhé straně.',
        'Dohoda dále zaniká způsoby stanovenými zákoníkem práce, zejména splněním sjednaného pracovního úkolu, uplynutím sjednané doby, dohodou stran nebo okamžitým zrušením z důvodů stanovených zákonem.',
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
        `Na dohodu o provedení práce se v základním rozsahu nevztahují ustanovení zákoníku práce o pracovní době, odstupném a dalších nárocích typických pro hlavní pracovní poměr (§ 77 odst. 2 ZP). ${DPP_VACATION_NOTE}`,
        'Zaměstnavatel je povinen předem rozvrhnout pracovní dobu zaměstnance v písemném rozvrhu směn a seznámit s ním zaměstnance nejpozději 3 dny před začátkem směny nebo období, na které je pracovní doba rozvržena, pokud se strany písemně nedohodnou na jiné době seznámení.',
        'Práce může být vykonávána v sídle zaměstnavatele, na sjednaném místě výkonu práce dle čl. II nebo vzdáleně z místa zvoleného zaměstnancem, pokud to povaha úkolu umožňuje a pokud zaměstnanec dodrží požadavky zaměstnavatele na ochranu důvěrných informací, bezpečnost dat a předávání výstupů.',
        d.toolsProvided === 'employer'
          ? 'Pracovní pomůcky, nástroje a vybavení nutné pro výkon práce zajišťuje zaměstnavatel.'
          : d.toolsProvided === 'employee'
          ? 'Zaměstnanec zajišťuje pracovní pomůcky, nástroje a vybavení na vlastní náklady; zaměstnavatel mu uhradí prokazatelně vynaložené náklady pouze tehdy, bylo-li to předem písemně dohodnuto.'
          : 'Pracovní pomůcky a vybavení potřebné pro výkon práce zajišťují strany dle vzájemné dohody.',
      ],
    },
    ...premiumContent,
    {
      title: `${hasPremiumClauses ? 'IX' : 'VI'}. ZÁVĚREČNÁ USTANOVENÍ`,
      body: [
        'Dohoda se řídí zákonem č. 262/2006 Sb., zákoník práce, ve znění pozdějších předpisů, a subsidiárně zákonem č. 89/2012 Sb., občanský zákoník.',
        disputeClause(d, true),
        'Dohoda je vyhotovena ve dvou stejnopisech; zaměstnavatel a zaměstnanec obdrží po jednom stejnopisu (§ 77 odst. 1 ZP).',
        'Změny dohody jsou platné pouze ve formě písemných, číslovaných a podepsaných dodatků.',
        'Neplatnost jednotlivého ustanovení nemá vliv na platnost ostatních ustanovení dohody.',
        'Zpracování osobních údajů pracovníka probíhá v souladu s nařízením EU 2016/679 (GDPR), zákonem č. 110/2019 Sb. a § 316 zákoníku práce. Osobní údaje jsou zpracovávány za účelem uzavření a plnění dohody o provedení práce, plnění zákonných povinností zaměstnavatele (odvod daně, sociální a zdravotní pojistné) a ochrany oprávněných zájmů stran. Pracovník má právo na přístup ke svým osobním údajům, jejich opravu nebo výmaz, a právo podat stížnost u ÚOOÚ (www.uoou.cz).',
        'Žádná ze smluvních stran neodpovídá za nesplnění nepeněžitých povinností způsobené vyšší mocí (vis maior), tj. událostí mimořádnou, nepředvídatelnou a nepřekonatelnou (§ 2913 odst. 2 OZ). Vyšší moc se nevztahuje na povinnost zaplatit peněžitou částku. Strana postižená vyšší mocí je povinna neprodleně písemně informovat druhou stranu a po odpadnutí překážky neprodleně pokračovat v plnění.',
      ],
    },
  ];

  sections.push({ title: `${hasPremiumClauses ? 'X' : 'VII'}. PODPISY`, body: [] });

  // Professional+ příloha: předávací a akceptační protokol výstupů.
  if (hasPremiumClauses) {
    sections.push({
      title: 'PŘÍLOHA Č. 1 – PŘEDÁVACÍ A AKCEPTAČNÍ PROTOKOL VÝSTUPŮ',
      body: [],
    });
  }

  return attachTranslations(sections, buildDppTranslationsBySection(d, hasPremiumClauses));
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
    ? 'Poskytovatel poskytuje objednateli k výstupům vytvořeným v rámci plnění této smlouvy výhradní, časově, územně a množstevně neomezené oprávnění k jejich užití, a to okamžikem úplného zaplacení ceny. Je-li to vzhledem k povaze výstupu možné, zavazuje se poskytovatel převést na objednatele i převoditelná majetková práva k výsledku v rozsahu připouštěném právními předpisy.'
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
        'Tato smlouva představuje úplné ujednání o poskytování služeb, ceně, výstupech a IP režimu a nahrazuje veškerá předchozí ujednání a přísliby stran v tomto rozsahu.',
        'Smlouva je vyhotovena ve dvou stejnopisech; poskytovatel a objednatel obdrží po jednom stejnopisu.',
        'Změny jsou platné pouze ve formě písemných, číslovaných a podepsaných dodatků.',
        'Neplatnost jednotlivého ustanovení smlouvy nemá vliv na platnost ostatních ustanovení.',
        'Zpracování osobních údajů probíhá v souladu s nařízením EU 2016/679 (GDPR) a zákonem č. 110/2019 Sb. o zpracování osobních údajů. Osobní údaje uvedené v této smlouvě jsou zpracovávány výhradně za účelem uzavření, plnění a případného vymáhání práv z tohoto smluvního vztahu. Správcem osobních údajů je každá ze smluvních stran v rozsahu údajů, které zpracovává o druhé straně. Každá ze stran má právo na přístup ke svým osobním údajům, jejich opravu nebo výmaz, jakož i právo podat stížnost u Úřadu pro ochranu osobních údajů (www.uoou.cz). Osobní údaje budou uchovávány po dobu trvání smluvního vztahu a dále po dobu stanovenou právními předpisy, zpravidla 10 let od jeho skončení.',
        'Za vyšší moc se považuje i plošný výpadek kritické internetové infrastruktury nebo kybernetický útok vedený proti systémům smluvní strany, která prokáže, že měla přijata přiměřená organizační a technická bezpečnostní opatření. Vyšší moc se nevztahuje na povinnost zaplatit peněžitou částku. Strana postižená vyšší mocí je povinna neprodleně písemně informovat druhou stranu a po odpadnutí překážky neprodleně pokračovat v plnění.',
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
    ? `Souhlas pronajímatele s podnájmem byl udělen písemně dne ${asText(d.consentDate, 'neuvedeno')}.`
    : 'Upozornění: Vyžaduje-li konkrétní situace souhlas pronajímatele s podnájmem, je nájemce povinen si jej zajistit před uzavřením této smlouvy. U podnájmu části bytu se postup řídí zejména § 2274 a § 2275 OZ podle toho, zda nájemce v bytě sám trvale bydlí.';

  const premiumContent: ContractSection[] = hasPremiumClauses ? [
    {
      title: 'IX. ZVLÁŠTNÍ SMLUVNÍ UJEDNÁNÍ A VZTAH K HLAVNÍMU NÁJMU',
      body: [
        `Podnájemce bere na vědomí, že nájemce (jeho smluvní protistrana) je vůči vlastníkovi nemovitosti vázán nájemní smlouvou ze dne ${asText(d.mainLeaseDate, 'neuvedeno')}. V případě zániku hlavního nájmu zaniká i podnájem (§ 2277 OZ).`,
        'Podnájemce se zavazuje neporušovat podmínky hlavní nájemní smlouvy, se kterou byl před podpisem této smlouvy řádně seznámen a jejíž relevantní části mu byly předány.',
        'Nájemce je povinen neprodleně informovat podnájemce o jakékoli změně hlavní nájemní smlouvy, která by mohla mít vliv na práva a povinnosti podnájemce.',
        'Podnájemce není oprávněn dát podnajatý prostor do dalšího podnájmu třetí osobě bez předchozího písemného souhlasu nájemce i pronajímatele.',
        d.breachPenalty && Number(d.breachPenalty) > 0
          ? `Smluvní pokuta za neoprávněné další podnajímání nebo jiné porušení podmínek hlavní nájemní smlouvy: ${formatAmount(d.breachPenalty)} Kč.`
          : 'Při neoprávněném dalším podnájmu nebo jiném porušení podmínek hlavní nájemní smlouvy je podnájemce povinen nahradit nájemci veškerou prokazatelně vzniklou škodu, včetně škody způsobené pronajímatelem uplatněné vůči nájemci.',
      ],
    },
    {
      title: 'X. SMLUVNÍ POKUTY A SANKCE',
      body: [
        `Prodlení podnájemce s úhradou podnájemného: smluvní pokuta ve výši 0,1 % z dlužné částky za každý den prodlení${d.minLatePenalty && Number(d.minLatePenalty) > 0 ? ` (min. ${formatAmount(d.minLatePenalty)} Kč/den)` : ''}.`,
        (Number(d.rentAmount) || 0) > 0
          ? `Prodlení podnájemce s vyklizením po skončení podnájmu: smluvní pokuta ve výši odpovídající 1/15 měsíčního podnájemného (tj. ${formatAmount(Math.round(Number(d.rentAmount) * 2 / 30))} Kč) za každý den prodlení.`
          : 'Prodlení podnájemce s vyklizením po skončení podnájmu: smluvní pokuta ve výši 1/15 měsíčního podnájemného za každý den prodlení.',
        d.damagePenalty && Number(d.damagePenalty) > 0
          ? `Neoprávněná změna nebo poškození prostor bez souhlasu nájemce: smluvní pokuta ${formatAmount(d.damagePenalty)} Kč a náhrada skutečné škody.`
          : 'Neoprávněná změna nebo poškození prostor bez souhlasu nájemce: podnájemce odpovídá za škodu v plném rozsahu a je povinen uvést prostory do původního stavu na vlastní náklady.',
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
        d.depositAmount ? `Jistota (kauce): ${formatAmount(d.depositAmount)} Kč. Nájemce je povinen jistotu vrátit do 30 dnů od skončení podnájmu a předání prostor, po odečtení řádně specifikovaných a prokázaných pohledávek.` : '',
        `Podnájemné je splatné vždy do ${asText(d.paymentDay, '15')}. dne příslušného měsíce ${d.bankAccount ? `na bankovní účet nájemce č. ${asText(d.bankAccount)}` : 'v hotovosti nebo bankovním převodem'}.`,
        'V případě prodlení podnájemce s úhradou podnájemného nebo zálohy na služby je nájemce oprávněn požadovat zákonný úrok z prodlení ode dne splatnosti.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'V. PRAVIDLA PODNÁJMU',
      body: [
        'Podnájemce je povinen: užívat prostory pouze ke sjednanému účelu, udržovat pořádek, nečinit úpravy bez souhlasu nájemce, nepoškozovat majetek a řídit se domovním řádem.',
        `Maximální počet osob v bytě: ${asText(d.maxOccupants, '2')}`,
        `Domácí zvířata: ${d.allowPets ? 'jejich chov je mezi stranami vzat na vědomí; podnájemce odpovídá za škody a zvýšené náklady jimi způsobené' : 'podnájemce je oprávněn chovat zvíře jen tehdy, pokud tím nepůsobí nájemci, pronajímateli nebo ostatním obyvatelům domu nepřiměřené obtíže; o chovu zvířete je povinen nájemce předem informovat'}`,
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
        'Drobné opravy a běžnou údržbu spojenou s užíváním prostor hradí podnájemce v rozsahu stanoveném nařízením vlády č. 308/2015 Sb., ve znění pozdějších předpisů. Větší opravy a rekonstrukce hradí nájemce, nejde-li o poškození způsobené podnájemcem nebo osobami, kterým podnájemce umožnil přístup do prostor.',
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
        'Smlouva je vyhotovena ve dvou stejnopisech; podnajímatel a podnájemce obdrží po jednom stejnopisu.',
        'Veškeré změny jsou platné pouze ve formě písemných, číslovaných a podepsaných dodatků.',
        'Neplatnost jednotlivého ustanovení smlouvy nemá vliv na platnost ostatních ustanovení.',
        'Zpracování osobních údajů probíhá v souladu s nařízením EU 2016/679 (GDPR) a zákonem č. 110/2019 Sb. o zpracování osobních údajů. Osobní údaje uvedené v této smlouvě jsou zpracovávány výhradně za účelem uzavření, plnění a případného vymáhání práv z tohoto smluvního vztahu. Správcem osobních údajů je každá ze smluvních stran v rozsahu údajů, které zpracovává o druhé straně. Každá ze stran má právo na přístup ke svým osobním údajům, jejich opravu nebo výmaz, jakož i právo podat stížnost u Úřadu pro ochranu osobních údajů (www.uoou.cz). Osobní údaje budou uchovávány po dobu trvání smluvního vztahu a dále po dobu stanovenou právními předpisy, zpravidla 10 let od jeho skončení.',
        'Žádná ze smluvních stran neodpovídá za nesplnění nepeněžitých povinností způsobené vyšší mocí (vis maior), tj. událostí mimořádnou, nepředvídatelnou a nepřekonatelnou (§ 2913 odst. 2 OZ). Vyšší moc se nevztahuje na povinnost zaplatit peněžitou částku. Strana postižená vyšší mocí je povinna neprodleně písemně informovat druhou stranu a po odpadnutí překážky neprodleně pokračovat v plnění.',
      ],
    },
  ];

  sections.push({ title: `${hasPremiumClauses ? 'XIII' : 'X'}. PODPISY`, body: [] });
  return attachTranslations(sections, buildSubleaseTranslationsBySection(d, hasPremiumClauses));
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
        hasPremiumClauses ? 'Pravost podpisu zmocnitele je ověřena notářem nebo v systému Czech POINT. Úřední ověření podpisu významně zvyšuje použitelnost plné moci vůči třetím osobám; některé instituce však mohou i přesto vyžadovat vlastní formulář nebo splnění dalších podmínek podle zvláštních předpisů či interních pravidel.' : '',
        'd) zmocněnec je povinen jednat s péčí řádného hospodáře a v nejlepším zájmu zmocnitele; o každém právním jednání učiněném v rámci zmocnění je zmocněnec povinen zmocnitele bez zbytečného odkladu informovat.',
        'e) zmocnitel může tuto plnou moc kdykoli písemně odvolat; odvolání je účinné okamžikem, kdy se o něm zmocněnec dozví (§ 448 odst. 1 OZ). Zmocněnec je povinen po odvolání neprodleně vrátit originál plné moci zmocniteli.',
      ].filter(Boolean) as string[],
    },
  ];

  const premiumContent: ContractSection[] = hasPremiumClauses ? [
    {
      title: 'VI. ÚŘEDNÍ OVĚŘENÍ PODPISU A PRÁVNÍ ÚČINKY VŮČI TŘETÍM STRANÁM',
      body: [
        'Úřední ověření podpisu zmocnitele provede notář, kontaktní místo Czech POINT nebo matrika obecního úřadu pověřeného vedením matrik. Ověření je povinné zejména pro: právní jednání týkající se nemovitostí zapisovaných do katastru nemovitostí (§ 6 zák. č. 256/2013 Sb.), zastupování v řízení před soudy a orgány veřejné moci, nakládání s bankovními účty a finančními prostředky.',
        'Originál plné moci uchovává zmocnitel. Zmocněnec je oprávněn předkládat třetím osobám originál nebo úředně ověřenou kopii; po skončení zmocnění nebo na výzvu zmocnitele je povinen originál bez zbytečného odkladu vrátit a všechny své kopie zničit.',
        'Zmocnitel je oprávněn plnou moc kdykoli odvolat; odvolání nabývá účinků vůči zmocněnci dnem doručení a vůči třetím osobám okamžikem, kdy se o něm dozvěděly. Pro vyloučení pochybností doporučujeme oznámit odvolání plné moci písemně i třetím osobám, u kterých byla plná moc dříve uplatněna.',
        'Tato plná moc je sepsána ve dvou stejnopisech; jeden si ponechá zmocnitel, druhý obdrží zmocněnec jako průkazní listinu. Zmocnitel je oprávněn pořídit další úředně ověřené stejnopisy podle potřeby.',
      ],
    },
    {
      title: 'VII. SANKCE PŘI PŘEKROČENÍ ZMOCNĚNÍ A ZÁKAZ STŘETU ZÁJMŮ',
      body: [
        'Zmocněnec nesmí jednat ve věci, ve které je sám stranou nebo má na výsledku přímý či nepřímý zájem (zákaz tzv. self-dealing). Toto omezení neplatí, pokud zmocnitel udělil k takovému jednání předchozí výslovný písemný souhlas s vědomím všech relevantních okolností.',
        'Zmocněnec nesmí udělit substituci (postoupení plné moci na třetí osobu) bez předchozího písemného souhlasu zmocnitele. Pokud substituci udělí v rozporu s tímto ustanovením, odpovídá za jednání substituta jako za své vlastní.',
        d.agentPenalty && Number(d.agentPenalty) > 0
          ? `Za škodu způsobenou překročením rozsahu zmocnění nebo nedbalým výkonem plné moci odpovídá zmocněnec zmocniteli za prokazatelně způsobenou škodu (§ 2913 OZ). Dojde-li k vědomému překročení rozsahu zmocnění, je zmocněnec povinen zaplatit zmocniteli smluvní pokutu ve výši ${formatAmount(d.agentPenalty)} Kč; zaplacením pokuty není dotčen nárok na náhradu vzniklé škody.`
          : 'Za škodu způsobenou překročením rozsahu zmocnění nebo nedbalým výkonem plné moci odpovídá zmocněnec zmocniteli za prokazatelně způsobenou škodu (§ 2913 OZ). Při vědomém překročení zmocnění je zmocněnec povinen vrátit přijatá plnění a nahradit zmocniteli vzniklou škodu, včetně účelně vynaložených nákladů na uplatnění práv.',
        'Překročí-li zmocněnec rozsah zmocnění, není přesah pro zmocnitele závazný, ledaže jej zmocnitel dodatečně schválí (§ 440 OZ). Třetí osoba, která jednala se zmocněncem v dobré víře, má nárok na náhradu prokazatelné škody vůči zmocněnci.',
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

  return attachTranslations(sections, buildPowerOfAttorneyTranslationsBySection(d, hasPremiumClauses));
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
        'Dlužník výslovně souhlasí s tím, aby toto uznání dluhu bylo na výzvu věřitele sepsáno formou notářského zápisu se svolením k přímé vykonatelnosti podle § 71b zákona č. 358/1992 Sb., notářský řád. Tato listina sama o sobě přímou vykonatelnost nezakládá; tu zakládá až notářský zápis pořízený dle tohoto ujednání.',
        'Dlužník se zavazuje dostavit se k notáři určenému dohodou stran (popř. zvolenému věřitelem) do 30 dnů od písemné výzvy věřitele a poskytnout součinnost potřebnou k sepsání notářského zápisu, včetně předložení dokladu totožnosti a podkladů osvědčujících existenci a výši dluhu.',
        'Nedostaví-li se dlužník bez vážného důvodu nebo neposkytne-li součinnost ve lhůtě dle předchozího odstavce, je věřitel oprávněn požadovat náhradu účelně vynaložených nákladů na pořízení zápisu a sjednání náhradního termínu.',
        'Na základě notářského zápisu se svolením k přímé vykonatelnosti je věřitel oprávněn navrhnout exekuci pro vymožení pohledávky bez nutnosti předchozího nalézacího soudního řízení (§ 274 odst. 1 písm. e) o. s. ř.). Nedojde-li k sepsání notářského zápisu, není dotčeno právo věřitele uplatnit pohledávku v běžném soudním řízení.',
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
        `Dlužník tímto výslovně uznává co do důvodu i výše, že dluží věřiteli peněžitou částku ve výši ${formatAmount(d.debtAmount)} ${asText(d.currency, 'Kč')}${d.debtAmountWords ? ` (slovy: ${d.debtAmountWords})` : ''}.`,
        debtOrigin,
        interestClause,
        'Dlužník prohlašuje, že dluh existuje, jeho výše ke dni sepsání listiny je správná a že mu ke dni sepsání nejsou známy pohledávky vůči věřiteli způsobilé k započtení (§ 1982 OZ), kterými by byl oprávněn výši uznaného dluhu snížit.',
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
        'Listina je vyhotovena ve dvou stejnopisech; věřitel a dlužník obdrží po jednom stejnopisu.',
        'Tato listina je sama o sobě závazná a není podmíněna splněním žádné jiné podmínky. Dílčí plnění dluhu tuto listinu neruší a nemá vliv na platnost uznání zbývající části dluhu.',
        'Neplatnost jednotlivého ustanovení nemá vliv na platnost ostatních ustanovení listiny.',
        'Zpracování osobních údajů probíhá v souladu s nařízením EU 2016/679 (GDPR) a zákonem č. 110/2019 Sb. o zpracování osobních údajů. Osobní údaje uvedené v této smlouvě jsou zpracovávány výhradně za účelem uzavření, plnění a případného vymáhání práv z tohoto smluvního vztahu. Správcem osobních údajů je každá ze smluvních stran v rozsahu údajů, které zpracovává o druhé straně. Každá ze stran má právo na přístup ke svým osobním údajům, jejich opravu nebo výmaz, jakož i právo podat stížnost u Úřadu pro ochranu osobních údajů (www.uoou.cz). Osobní údaje budou uchovávány po dobu trvání smluvního vztahu a dále po dobu stanovenou právními předpisy, zpravidla 10 let od jeho skončení.',
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
        d.ndaPenalty && Number(d.ndaPenalty) > 0
          ? `Za každý případ porušení mlčenlivosti je porušující strana povinna zaplatit druhé straně smluvní pokutu ve výši ${formatAmount(d.ndaPenalty)} Kč.`
          : 'Za každý případ porušení mlčenlivosti odpovídá porušující strana druhé straně za vzniklou škodu v plném rozsahu, včetně ušlého zisku a účelně vynaložených nákladů na zjednání nápravy.',
        d.nonCompete ? `Po dobu trvání smlouvy a ${asText(d.nonCompetePeriod, '12')} měsíců po jejím skončení se každá ze smluvních stran zavazuje nepřistupovat ke klíčovým zaměstnancům, zákazníkům ani dodavatelům druhé strany za účelem navázání přímé spolupráce mimo rámec této smlouvy (non-solicitation / zákaz přetahování).` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'IX. ŘEŠENÍ SPORŮ — DVOUSTUPŇOVÁ ESKALACE',
      body: [
        '1. stupeň — eskalace na statutární zástupce: vznikne-li mezi stranami spor, oznámí jej strana písemně druhé straně; statutární zástupci obou stran (nebo jimi pověřené osoby s rozhodovací pravomocí) jsou povinni do 15 pracovních dnů od oznámení vyvinout úsilí o smírné vyřešení.',
        '2. stupeň — mediace nebo soudní řízení: nedojde-li ke smírnému vyřešení v rámci 1. stupně do 30 dnů od oznámení sporu, mohou strany využít mediaci dle zákona č. 202/2012 Sb. nebo se obrátit na věcně a místně příslušný soud České republiky.',
        d.disputeResolution === 'arbitration'
          ? 'Strany výslovně sjednaly, že spory mohou být alternativně rozhodnuty v rozhodčím řízení dle disputeClause v závěrečných ustanoveních; tato rozhodčí doložka byla sjednána individuálně a svobodně.'
          : 'Tímto ujednáním není dotčeno právo kterékoli strany domáhat se předběžných opatření u soudu, je-li to potřebné k ochraně jejích práv.',
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
        // V premium režimu je řešení sporů již samostatně v IX. — zde by duplikovalo.
        ...(hasPremiumClauses ? [] : [disputeClause(d)]),
        'Tato smlouva představuje úplné ujednání o spolupráci, rozdělení výnosů, rozhodování a IP režimu a nahrazuje veškerá předchozí ujednání stran v tomto rozsahu.',
        'Smlouva je vyhotovena ve dvou stejnopisech; Strana A a Strana B obdrží po jednom stejnopisu.',
        'Veškeré změny jsou platné pouze ve formě písemných, číslovaných a podepsaných dodatků.',
        'Je-li jakékoli ustanovení smlouvy neplatné nebo nevymahatelné, ostatní ustanovení zůstávají v plné platnosti a účinnosti.',
        'Zpracování osobních údajů probíhá v souladu s nařízením EU 2016/679 (GDPR) a zákonem č. 110/2019 Sb. o zpracování osobních údajů. Osobní údaje uvedené v této smlouvě jsou zpracovávány výhradně za účelem uzavření, plnění a případného vymáhání práv z tohoto smluvního vztahu. Správcem osobních údajů je každá ze smluvních stran v rozsahu údajů, které zpracovává o druhé straně. Každá ze stran má právo na přístup ke svým osobním údajům, jejich opravu nebo výmaz, jakož i právo podat stížnost u Úřadu pro ochranu osobních údajů (www.uoou.cz). Osobní údaje budou uchovávány po dobu trvání smluvního vztahu a dále po dobu stanovenou právními předpisy, zpravidla 10 let od jeho skončení.',
        'Za vyšší moc se považuje i plošný výpadek kritické internetové infrastruktury nebo kybernetický útok vedený proti systémům smluvní strany, která prokáže, že měla přijata přiměřená organizační a technická bezpečnostní opatření. Vyšší moc se nevztahuje na povinnost zaplatit peněžitou částku. Strana postižená vyšší mocí je povinna neprodleně písemně informovat druhou stranu a po odpadnutí překážky neprodleně pokračovat v plnění.',
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
