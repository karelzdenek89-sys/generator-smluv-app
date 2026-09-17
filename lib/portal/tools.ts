import type { PortalSituationKey } from '@/lib/analytics';
import type { PortalLink } from './situations';

/**
 * Bezplatné nástroje portálu. Každý nástroj dává použitelný výsledek bez
 * zadání e-mailu: checklist se dá projít a vytisknout, průvodce vrátí
 * doporučení s vysvětlením. Uložení / pokračování do dokumentu je až za tím.
 */

export type ChecklistItem = {
  key: string;
  label: string;
  detail?: string;
  /** Odkaz na dokument nebo návod, který položku vyřeší. */
  link?: PortalLink;
};

export type ChecklistSection = {
  title: string;
  items: readonly ChecklistItem[];
};

export type WizardOption = {
  label: string;
  /** Klíč další otázky, nebo klíč výsledku (prefix `result:`). */
  next: string;
};

export type WizardQuestion = {
  key: string;
  question: string;
  help?: string;
  options: readonly WizardOption[];
};

export type WizardOutcome = {
  key: string;
  title: string;
  summary: string;
  explanation: readonly string[];
  /** Kdy zobrazit doporučení individuálního posouzení. */
  caution?: string;
  documents: readonly PortalLink[];
  related: readonly PortalLink[];
};

export type ToolBase = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  situation: PortalSituationKey;
  /** Stručná odpověď na začátku stránky (answer-first). */
  answer: string;
  legalNote?: string;
  sources: readonly { label: string; href: string }[];
  /** Dokument, ke kterému nástroj přirozeně vede. */
  primaryDocument: PortalLink;
  related: readonly PortalLink[];
  updatedAt: string;
};

export type ChecklistTool = ToolBase & { kind: 'checklist'; sections: readonly ChecklistSection[] };
export type WizardTool = ToolBase & {
  kind: 'wizard';
  start: string;
  questions: readonly WizardQuestion[];
  outcomes: readonly WizardOutcome[];
};
export type PortalTool = ChecklistTool | WizardTool;

const UPDATED = '2026-09-17';
const OZ = { label: 'Občanský zákoník (zákon č. 89/2012 Sb.) — e-Sbírka', href: 'https://www.e-sbirka.cz/sb/2012/89' };
const ZP = { label: 'Zákoník práce (zákon č. 262/2006 Sb.) — e-Sbírka', href: 'https://www.e-sbirka.cz/sb/2006/262' };

export const PORTAL_TOOLS: readonly PortalTool[] = [
  // ── Zakázka ─────────────────────────────────────────────────────────────
  {
    kind: 'checklist',
    slug: 'checklist-pred-smlouvou-o-dilo',
    title: 'Checklist před smlouvou o dílo',
    shortTitle: 'Před smlouvou o dílo',
    description: 'Co si ujasnit a dohodnout, než podepíšete smlouvu o dílo s řemeslníkem, dodavatelem nebo klientem.',
    metaTitle: 'Checklist před smlouvou o dílo: co ohlídat před podpisem',
    metaDescription:
      'Bezplatný checklist před podpisem smlouvy o dílo: rozsah, cena, termín, platby, vícepráce, záruka, předání. Projděte body a pokračujte rovnou k dokumentu.',
    situation: 'zakazka',
    answer:
      'Dobrá smlouva o dílo má jasně popsané dílo, cenu a její režim, termín, platební podmínky, pravidla pro změny a vícepráce, způsob předání a záruku. Bez písemného rozsahu a pravidel pro změny vzniká většina sporů.',
    legalNote: 'Smlouva o dílo se řídí § 2586 a násl. občanského zákoníku. Písemná forma není povinná, ale bez ní se obsah dohody těžko prokazuje.',
    sources: [OZ],
    primaryDocument: { href: '/smlouva-o-dilo', label: 'Vytvořit smlouvu o dílo' },
    related: [
      { href: '/zakazka/smlouva-s-remeslnikem', label: 'Smlouva s řemeslníkem — co si ohlídat' },
      { href: '/nastroje/pruvodce-vicepracemi', label: 'Průvodce vícepracemi' },
      { href: '/balicek-zakazka', label: 'Zakázka Plus — celá dokumentace' },
    ],
    updatedAt: UPDATED,
    sections: [
      {
        title: 'Strany a dílo',
        items: [
          { key: 'parties', label: 'Mám přesnou identifikaci obou stran (jméno/název, adresa, IČO u podnikatelů).' },
          { key: 'scope', label: 'Dílo je popsané tak, aby šlo poznat, co je a co není v ceně.', detail: 'Rozsah, materiál, kdo co dodává, technické parametry, místo plnění.' },
          { key: 'docs', label: 'Podklady (projekt, výkaz výměr, nabídka) jsou přílohou smlouvy nebo se na ně smlouva odkazuje.', link: { href: '/nastroje/podklady-k-zakazce', label: 'Seznam podkladů' } },
        ],
      },
      {
        title: 'Cena a platby',
        items: [
          { key: 'price', label: 'Je jasné, zda je cena pevná, podle rozpočtu, nebo odhadem — a zda včetně DPH.' },
          { key: 'payments', label: 'Platební režim: po dokončení, záloha, nebo milníky s podmínkami vzniku nároku.' },
          { key: 'invoice', label: 'Splatnost faktur a bankovní účet zhotovitele.' },
          { key: 'penalty', label: 'Smluvní pokuta za prodlení s platbou i s dokončením — přiměřená a vzájemná.' },
        ],
      },
      {
        title: 'Termín a změny',
        items: [
          { key: 'deadline', label: 'Termín zahájení a dokončení, případně milníky.' },
          { key: 'changes', label: 'Změny rozsahu a vícepráce jen písemně a předem — změnový list / potvrzení víceprací.', link: { href: '/blog/viceprace-smlouva-o-dilo-2026', label: 'Vícepráce' } },
          { key: 'delays', label: 'Co se stane při zpoždění (posun, pokuta, právo odstoupit).' },
        ],
      },
      {
        title: 'Předání, záruka a spory',
        items: [
          { key: 'handover', label: 'Předání díla protokolem s možností výhrad.', link: { href: '/blog/predavaci-protokol-vzor-2026', label: 'Předávací protokol' } },
          { key: 'warranty', label: 'Délka záruky a způsob uplatnění vad.' },
          { key: 'insurance', label: 'Pojištění odpovědnosti zhotovitele u větších zakázek.' },
          { key: 'ip', label: 'U tvůrčích děl: komu patří autorská práva / licence.', link: { href: '/blog/autorska-prava-smlouva-o-dilo-2026', label: 'Autorská práva' } },
        ],
      },
    ],
  },
  {
    kind: 'checklist',
    slug: 'checklist-predani-zakazky',
    title: 'Checklist předání zakázky',
    shortTitle: 'Předání zakázky',
    description: 'Jak převzít nebo předat dílo tak, aby byl jasný stav, vady a začátek záruky.',
    metaTitle: 'Checklist předání zakázky: převzetí díla bez sporů',
    metaDescription:
      'Bezplatný checklist k předání a převzetí díla: prohlídka, výhrady, protokol, lhůty k odstranění vad, doplatek a záruka. Předávací protokol rovnou v zakázce.',
    situation: 'zakazka',
    answer:
      'Dílo se předává společnou prohlídkou a písemným protokolem. Objednatel převezme dílo bez výhrad, nebo s výhradami (soupis vad a lhůta k odstranění). Vady, které mohl při převzetí zjistit a nevytkl, později zpravidla neuplatní.',
    legalNote: 'Předání a převzetí díla upravuje § 2604–2606 OZ, práva z vad § 2615 a násl. OZ. U stavby nelze odmítnout převzetí pro ojedinělé drobné vady (§ 2628 OZ).',
    sources: [OZ],
    primaryDocument: { href: '/zakazka#moje-zakazka', label: 'Připravit předávací protokol v zakázce' },
    related: [
      { href: '/blog/predavaci-protokol-vzor-2026', label: 'Předávací protokol — průvodce' },
      { href: '/zakazka/reklamace-dila', label: 'Reklamace díla a vady po předání' },
    ],
    updatedAt: UPDATED,
    sections: [
      {
        title: 'Před prohlídkou',
        items: [
          { key: 'date', label: 'Domluvený termín a místo předání, obě strany přítomné nebo zastoupené.' },
          { key: 'contract', label: 'Mám u sebe smlouvu, odsouhlasené změny a vícepráce.' },
          { key: 'checklist', label: 'Seznam, co má dílo obsahovat (podle smlouvy a příloh).' },
        ],
      },
      {
        title: 'Při prohlídce',
        items: [
          { key: 'inspect', label: 'Projít celé dílo, vyzkoušet funkčnost, porovnat s rozsahem.' },
          { key: 'photos', label: 'Fotografie stavu a případných vad s datem.' },
          { key: 'defects', label: 'Soupis vad a nedodělků, u každé lhůta k odstranění.' },
          { key: 'decision', label: 'Rozhodnutí: převzít bez výhrad / s výhradami / nepřevzít pro podstatné vady.' },
        ],
      },
      {
        title: 'Po předání',
        items: [
          { key: 'protocol', label: 'Podepsaný protokol má každá strana.' },
          { key: 'payment', label: 'Doplatek a fakturace podle smlouvy (případně zádržné do odstranění vad).' },
          { key: 'warranty', label: 'Poznamenat začátek záruky a uložit dokumentaci.' },
          { key: 'reminder', label: 'Nastavit si připomínku kontroly odstranění vad.' },
        ],
      },
    ],
  },
  {
    kind: 'checklist',
    slug: 'pruvodce-vicepracemi',
    title: 'Průvodce vícepracemi',
    shortTitle: 'Vícepráce',
    description: 'Kdy má zhotovitel nárok na úhradu prací navíc a jak vícepráce správně odsouhlasit.',
    metaTitle: 'Vícepráce ve smlouvě o dílo: kdy je platit a jak odsouhlasit',
    metaDescription:
      'Průvodce vícepracemi: pevná cena vs. rozpočet, oznamovací povinnost, písemné odsouhlasení, dopad na termín. Potvrzení víceprací nebo změnový list v zakázce.',
    situation: 'zakazka',
    answer:
      'Práce navíc je bezpečné provádět až po písemném odsouhlasení rozsahu, ceny a dopadu na termín. Při pevné ceně nebo zaručeném rozpočtu nelze cenu jednostranně zvýšit; u rozpočtu s výhradou nezávaznosti musí zhotovitel potřebu prací navíc oznámit bez zbytečného odkladu.',
    legalNote: 'Cena díla a rozpočet: § 2620–2622 OZ. Změna smlouvy sjednané písemně: § 564 OZ.',
    sources: [OZ],
    primaryDocument: { href: '/zakazka#moje-zakazka', label: 'Připravit potvrzení víceprací v zakázce' },
    related: [
      { href: '/blog/viceprace-smlouva-o-dilo-2026', label: 'Vícepráce — podrobný článek' },
      { href: '/blog/smlouva-o-dilo-cena-a-platby', label: 'Cena a platby ve smlouvě o dílo' },
    ],
    updatedAt: UPDATED,
    sections: [
      {
        title: 'Zjistěte, jaký cenový režim máte',
        items: [
          { key: 'fixed', label: 'Pevná cena: bez dohody se nemění, i když si dílo vyžádalo víc práce.' },
          { key: 'budget', label: 'Rozpočet zaručený jako úplný: totéž — překročení jde k tíži zhotovitele.' },
          { key: 'estimate', label: 'Rozpočet s výhradou nezávaznosti/neúplnosti: zhotovitel může žádat zvýšení, jen pokud potřebu oznámí bez zbytečného odkladu.' },
        ],
      },
      {
        title: 'Než se práce navíc provedou',
        items: [
          { key: 'describe', label: 'Popsat, co je nad rámec smlouvy a proč (požadavek objednatele / zjištěná skutečnost).' },
          { key: 'price', label: 'Cena víceprací včetně informace o DPH.' },
          { key: 'time', label: 'Dopad na termín dokončení a nový termín.' },
          { key: 'sign', label: 'Podpis obou stran — potvrzení víceprací nebo změnový list.' },
        ],
      },
      {
        title: 'Po odsouhlasení',
        items: [
          { key: 'invoice', label: 'Vícepráce fakturovat samostatně nebo je doplnit do platebního harmonogramu.' },
          { key: 'deadline', label: 'Aktualizovat termín a připomínky v zakázce.' },
        ],
      },
    ],
  },
  {
    kind: 'checklist',
    slug: 'podklady-k-zakazce',
    title: 'Seznam podkladů k zakázce',
    shortTitle: 'Podklady k zakázce',
    description: 'Co si připravit, aby smlouva o dílo vznikla rychle a bez dohadování.',
    metaTitle: 'Podklady k zakázce: co připravit před smlouvou o dílo',
    metaDescription:
      'Seznam podkladů před sepsáním smlouvy o dílo: identifikace stran, popis díla, rozpočet, termíny, platební podmínky. Odškrtejte a pokračujte k dokumentu.',
    situation: 'zakazka',
    answer:
      'Připravte si identifikaci stran, popis díla s podklady, cenu a platební režim, termíny a informaci o materiálu. S těmito údaji vyplníte smlouvu o dílo během několika minut.',
    sources: [OZ],
    primaryDocument: { href: '/smlouva-o-dilo', label: 'Vytvořit smlouvu o dílo' },
    related: [{ href: '/nastroje/checklist-pred-smlouvou-o-dilo', label: 'Checklist před smlouvou o dílo' }],
    updatedAt: UPDATED,
    sections: [
      {
        title: 'Identifikace',
        items: [
          { key: 'client', label: 'Objednatel: jméno/název, adresa, IČO, e-mail.' },
          { key: 'contractor', label: 'Zhotovitel: jméno/název, adresa, IČO, e-mail, bankovní účet.' },
        ],
      },
      {
        title: 'Dílo',
        items: [
          { key: 'title', label: 'Název a stručný popis díla.' },
          { key: 'spec', label: 'Technická specifikace, projekt nebo nabídka (příloha).' },
          { key: 'place', label: 'Místo plnění.' },
          { key: 'material', label: 'Kdo dodává materiál.' },
        ],
      },
      {
        title: 'Cena, platby, termíny',
        items: [
          { key: 'price', label: 'Cena a zda je včetně DPH.' },
          { key: 'payment', label: 'Platební režim (po dokončení / záloha / milníky) a splatnost.' },
          { key: 'dates', label: 'Datum zahájení a dokončení.' },
          { key: 'warranty', label: 'Délka záruky a případné pojištění.' },
        ],
      },
    ],
  },

  // ── Zaměstnávání ────────────────────────────────────────────────────────
  {
    kind: 'wizard',
    slug: 'jaky-vztah-potrebuji',
    title: 'Jaký vztah potřebuji?',
    shortTitle: 'Jaký vztah potřebuji',
    description: 'Pracovní smlouva, DPP, DPČ, nebo spolupráce s OSVČ? Několik otázek a doporučení s vysvětlením.',
    metaTitle: 'Pracovní smlouva, DPP, nebo OSVČ? Průvodce výběrem vztahu',
    metaDescription:
      'Bezplatný průvodce pro zaměstnavatele: podle délky spolupráce, řízení práce a rozsahu hodin doporučí pracovní smlouvu, DPP, DPČ nebo smlouvu s OSVČ.',
    situation: 'zamestnavam',
    answer:
      'Dlouhodobá práce, kterou řídíte a určujete její dobu i místo, je závislá práce — patří do pracovní smlouvy (nebo DPČ/DPP v omezeném rozsahu). Samostatný podnikatel s vlastními prostředky, riziky a více klienty může spolupracovat na obchodní smlouvě. Rozhoduje skutečný průběh vztahu, ne název smlouvy.',
    legalNote: 'Závislou práci definuje § 2 zákoníku práce a smí být vykonávána jen v pracovněprávním vztahu (§ 3 ZP). Skrytý pracovní poměr („švarcsystém“) je nelegální prací podle zákona o zaměstnanosti.',
    sources: [ZP, { label: 'Zákon o zaměstnanosti (zákon č. 435/2004 Sb.) — e-Sbírka', href: 'https://www.e-sbirka.cz/sb/2004/435' }],
    primaryDocument: { href: '/zamestnavam', label: 'Zaměstnávám — přehled řešení' },
    related: [
      { href: '/nastroje/dpp-vs-pracovni-smlouva', label: 'DPP vs. pracovní smlouva' },
      { href: '/blog/svarcsystem-osvc-2026', label: 'Švarcsystém — rizika' },
    ],
    updatedAt: UPDATED,
    start: 'duration',
    questions: [
      {
        key: 'duration',
        question: 'Potřebujete člověka dlouhodobě a pravidelně?',
        help: 'Dlouhodobě = měsíce až roky, práce se opakuje každý týden.',
        options: [
          { label: 'Ano, dlouhodobě a pravidelně', next: 'control' },
          { label: 'Ne, jde o jednorázovou nebo omezenou spolupráci', next: 'hours' },
        ],
      },
      {
        key: 'control',
        question: 'Určujete mu pracovní dobu, místo a způsob práce a pracuje pod vaším vedením?',
        help: 'Typicky: docházka, pokyny nadřízeného, práce vaším jménem a na vaši odpovědnost.',
        options: [
          { label: 'Ano', next: 'result:employment' },
          { label: 'Ne — pracuje samostatně, vlastními prostředky, pro více klientů', next: 'independent' },
        ],
      },
      {
        key: 'independent',
        question: 'Nese vlastní podnikatelské riziko a fakturuje jako podnikatel (IČO)?',
        options: [
          { label: 'Ano', next: 'result:cooperation' },
          { label: 'Ne / nejsem si jistý', next: 'result:employment_caution' },
        ],
      },
      {
        key: 'hours',
        question: 'Kolik hodin ročně u vás odpracuje?',
        options: [
          { label: 'Nejvýše 300 hodin za rok', next: 'result:dpp' },
          { label: 'Více než 300 hodin, ale v průměru nejvýše polovina běžné pracovní doby', next: 'result:dpc' },
          { label: 'Nevím / půjde o samostatnou zakázku s výsledkem', next: 'oneoff' },
        ],
      },
      {
        key: 'oneoff',
        question: 'Objednáváte konkrétní výsledek (dílo, projekt), který dodá samostatně a na vlastní odpovědnost?',
        options: [
          { label: 'Ano', next: 'result:work_contract' },
          { label: 'Ne, potřebuji, aby pracoval podle mých pokynů', next: 'result:dpp' },
        ],
      },
    ],
    outcomes: [
      {
        key: 'employment',
        title: 'Pro tuto situaci pravděpodobně hledáte pracovní smlouvu',
        summary: 'Dlouhodobá práce pod vaším vedením je závislá práce. Pracovní poměr dává oběma stranám nejjasnější pravidla.',
        explanation: [
          'Sjednejte druh práce, místo výkonu a den nástupu; zkušební dobu až 4 měsíce (vedoucí 8).',
          'Zaměstnanci předejte písemnou informaci o obsahu pracovního poměru podle § 37 ZP.',
          'Nezapomeňte na přihlášení k pojištění a jednotné měsíční hlášení zaměstnavatele.',
        ],
        documents: [
          { href: '/pracovni', label: 'Pracovní smlouva online' },
          { href: '/balicek-zamestnavatel', label: 'Zaměstnavatel Start 2026 (smlouva + § 37 + nástup)' },
        ],
        related: [{ href: '/zamestnavam/pracovni-smlouva', label: 'Pracovní smlouva — kdy a jak' }],
      },
      {
        key: 'employment_caution',
        title: 'Situace ukazuje spíše na pracovní poměr — pozor na švarcsystém',
        summary: 'Dlouhodobá, řízená práce bez vlastního podnikatelského rizika je zpravidla závislá práce, i kdyby ji člověk fakturoval.',
        explanation: [
          'Fakturace „na IČO“ za práci pod vaším vedením může být posouzena jako nelegální práce s pokutou pro obě strany.',
          'Bezpečná cesta je pracovní smlouva, případně DPČ nebo DPP při menším rozsahu.',
        ],
        caution: 'Pokud se vztah nachází na hranici, může vyžadovat individuální posouzení podle skutečného fungování spolupráce.',
        documents: [
          { href: '/pracovni', label: 'Pracovní smlouva online' },
          { href: '/dpp', label: 'Dohoda o provedení práce' },
        ],
        related: [{ href: '/blog/svarcsystem-osvc-2026', label: 'Švarcsystém — rizika a hranice' }],
      },
      {
        key: 'cooperation',
        title: 'Pro tuto situaci pravděpodobně hledáte smlouvu o spolupráci nebo o dílo',
        summary: 'Samostatný podnikatel s vlastními prostředky, riziky a klienty může spolupracovat na obchodní smlouvě.',
        explanation: [
          'Popište výsledek nebo službu, odměnu, termíny, mlčenlivost a ukončení spolupráce.',
          'Vyhněte se prvkům závislé práce: pevná pracovní doba, docházka, pokyny jako u zaměstnance.',
        ],
        caution: 'Hranice mezi spoluprací a závislou prací závisí na skutečném průběhu vztahu, nikoli na názvu smlouvy.',
        documents: [
          { href: '/spoluprace', label: 'Smlouva o spolupráci online' },
          { href: '/sluzby', label: 'Smlouva o poskytování služeb' },
        ],
        related: [{ href: '/zamestnavam/osvc', label: 'Spolupráce s OSVČ bez švarcsystému' }],
      },
      {
        key: 'dpp',
        title: 'Pro tuto situaci pravděpodobně hledáte dohodu o provedení práce (DPP)',
        summary: 'Do 300 hodin ročně u jednoho zaměstnavatele je DPP nejjednodušší pracovněprávní vztah.',
        explanation: [
          'Odměna nejméně ve výši minimální hodinové mzdy (2026: 134,40 Kč).',
          'Při měsíční odměně od 12 000 Kč (2026) vzniká účast na pojištění a odvody.',
          'DPP musí být písemná; evidujte odpracované hodiny.',
        ],
        documents: [{ href: '/dpp', label: 'Dohoda o provedení práce online' }],
        related: [
          { href: '/zamestnavam/dpp', label: 'DPP — limity a povinnosti' },
          { href: '/nastroje/dpp-vs-pracovni-smlouva', label: 'DPP vs. pracovní smlouva' },
        ],
      },
      {
        key: 'dpc',
        title: 'Pro tuto situaci pravděpodobně hledáte dohodu o pracovní činnosti (DPČ)',
        summary: 'Nad 300 hodin ročně, ale v průměru nejvýše polovina stanovené týdenní pracovní doby, je DPČ.',
        explanation: [
          'DPČ zakládá odvody již od nižšího příjmu než DPP; počítejte s administrativou podobnou pracovnímu poměru.',
          'Pokud rozsah roste k plnému úvazku, zvažte pracovní smlouvu.',
        ],
        caution: 'Generátor DPČ zatím nenabízíme; pro pravidelnou práci ve větším rozsahu doporučujeme pracovní smlouvu.',
        documents: [{ href: '/pracovni', label: 'Pracovní smlouva online' }],
        related: [{ href: '/blog/dpp-dpc-porovnani-2026', label: 'DPP vs. DPČ — porovnání' }],
      },
      {
        key: 'work_contract',
        title: 'Pro tuto situaci pravděpodobně hledáte smlouvu o dílo',
        summary: 'Objednáváte konkrétní výsledek, který dodavatel provede samostatně a na vlastní odpovědnost.',
        explanation: [
          'Popište dílo, cenu, termín, předání a záruku.',
          'Dodavatel pracuje vlastními prostředky a nese riziko výsledku.',
        ],
        documents: [{ href: '/smlouva-o-dilo', label: 'Smlouva o dílo online' }],
        related: [{ href: '/blog/smlouva-o-dilo-vs-dpp-2026', label: 'Smlouva o dílo vs. DPP' }],
      },
    ],
  },
  {
    kind: 'checklist',
    slug: 'dpp-vs-pracovni-smlouva',
    title: 'DPP vs. pracovní smlouva',
    shortTitle: 'DPP vs. pracovní smlouva',
    description: 'Porovnání limitů, odvodů a povinností. Zaškrtněte, co platí pro vaši situaci, a uvidíte, kam to vede.',
    metaTitle: 'DPP vs. pracovní smlouva 2026: limity, odvody, povinnosti',
    metaDescription:
      'Porovnání DPP a pracovní smlouvy pro rok 2026: 300 hodin, rozhodná částka 12 000 Kč, minimální mzda, dovolená, výpověď. Vyberte správný dokument.',
    situation: 'zamestnavam',
    answer:
      'DPP je pro práci do 300 hodin ročně u jednoho zaměstnavatele; odvody vznikají od měsíční odměny 12 000 Kč (2026). Pracovní smlouva je pro pravidelnou práci bez limitu hodin, s plnou ochranou zaměstnance i s povinnostmi zaměstnavatele (dovolená, výpovědní doba, informace podle § 37 ZP).',
    legalNote: 'DPP: § 74–77 ZP. Pracovní poměr: § 33 a násl. ZP. Rozhodná částka pro pojištění u DPP se vyhlašuje každoročně.',
    sources: [ZP, { label: 'MPSV — Minimální mzda', href: 'https://mpsv.gov.cz/minimalni-mzda' }],
    primaryDocument: { href: '/dpp', label: 'Vytvořit DPP' },
    related: [
      { href: '/pracovni', label: 'Pracovní smlouva online' },
      { href: '/blog/dpp-dohoda-provedeni-prace', label: 'DPP 2026: limit 300 hodin, odvody' },
      { href: '/nastroje/jaky-vztah-potrebuji', label: 'Průvodce: Jaký vztah potřebuji?' },
    ],
    updatedAt: UPDATED,
    sections: [
      {
        title: 'Rozsah práce',
        items: [
          { key: 'hours', label: 'Práce nepřesáhne 300 hodin za kalendářní rok u jednoho zaměstnavatele → DPP je možná.' },
          { key: 'regular', label: 'Práce je pravidelná a dlouhodobá (každý týden, celý rok) → spíše pracovní smlouva.' },
        ],
      },
      {
        title: 'Odměna a odvody',
        items: [
          { key: 'minwage', label: 'Odměna nejméně 134,40 Kč/h (minimální mzda 2026) — platí pro DPP i pracovní poměr.' },
          { key: 'threshold', label: 'Měsíční odměna z DPP dosáhne 12 000 Kč → vzniká účast na pojištění a odvody.' },
          { key: 'salary', label: 'U pracovní smlouvy odvody vždy; mzda nejméně ve výši minimální mzdy (zaručená mzda podle skupin prací v podnikatelské sféře od 1. 1. 2025 neplatí).' },
        ],
      },
      {
        title: 'Povinnosti zaměstnavatele',
        items: [
          { key: 'written', label: 'Písemná forma (DPP i pracovní smlouva).' },
          { key: 'info37', label: 'Pracovní smlouva: písemná informace o obsahu pracovního poměru podle § 37 ZP.', link: { href: '/balicek-zamestnavatel', label: 'Zaměstnavatel Start 2026' } },
          { key: 'vacation', label: 'Dovolená: u pracovní smlouvy vždy; u DPP při splnění podmínek (28 dní trvání a 80 hodin).', link: { href: '/blog/dovolena-dpp-2026', label: 'Dovolená u DPP' } },
          { key: 'notice', label: 'Ukončení: DPP dohodou nebo výpovědí s 15denní výpovědní dobou; pracovní poměr podle § 48 a násl. ZP.' },
          { key: 'jmhz', label: 'Jednotné měsíční hlášení zaměstnavatele (od 2026) — pro pracovní poměr i dohody.', link: { href: '/zmeny-2027/zamestnavatele', label: 'Změny 2027 pro zaměstnavatele' } },
        ],
      },
    ],
  },
  {
    kind: 'checklist',
    slug: 'checklist-nastupu-zamestnance',
    title: 'Checklist nástupu zaměstnance',
    shortTitle: 'Nástup zaměstnance',
    description: 'Dokumenty a povinnosti při nástupu nového zaměstnance — před nástupem, v den nástupu a do konce měsíce.',
    metaTitle: 'Checklist nástupu zaměstnance 2026: dokumenty a povinnosti',
    metaDescription:
      'Bezplatný checklist nástupu zaměstnance: pracovní smlouva, informace podle § 37 ZP, přihlášení k pojištění, lékařská prohlídka, BOZP a měsíční hlášení.',
    situation: 'zamestnavam',
    answer:
      'Před nástupem podepište pracovní smlouvu a zajistěte vstupní lékařskou prohlídku. V den nástupu proveďte školení BOZP a předejte informaci podle § 37 ZP. Do 8 dnů přihlaste zaměstnance k pojištění a od roku 2026 hlaste údaje jednotným měsíčním hlášením.',
    legalNote: 'Informace o obsahu pracovního poměru: § 37 ZP (do 7 dnů od vzniku). Přihláška k nemocenskému pojištění: do 8 dnů. JMHZ: zákon č. 323/2025 Sb.',
    sources: [ZP, { label: 'ČSSZ — Co je JMHZ', href: 'https://www.cssz.gov.cz/co-je-jmhz-' }],
    primaryDocument: { href: '/balicek-zamestnavatel', label: 'Připravit balíček Zaměstnavatel Start' },
    related: [
      { href: '/pracovni', label: 'Pracovní smlouva online' },
      { href: '/zamestnavam/pracovni-smlouva', label: 'Pracovní smlouva — kdy a jak' },
    ],
    updatedAt: UPDATED,
    sections: [
      {
        title: 'Před nástupem',
        items: [
          { key: 'contract', label: 'Podepsaná pracovní smlouva (druh práce, místo, den nástupu, zkušební doba).', link: { href: '/pracovni', label: 'Pracovní smlouva' } },
          { key: 'medical', label: 'Vstupní lékařská prohlídka u poskytovatele pracovnělékařských služeb.' },
          { key: 'docs', label: 'Doklady zaměstnance: občanský průkaz, číslo účtu, zápočtový list, prohlášení poplatníka.' },
          { key: 'foreigner', label: 'U cizince: oprávnění k pobytu a k práci, případně informační povinnost vůči úřadu práce.' },
        ],
      },
      {
        title: 'V den nástupu',
        items: [
          { key: 'bozp', label: 'Školení BOZP a PO, seznámení s vnitřními předpisy.' },
          { key: 'info37', label: 'Písemná informace o obsahu pracovního poměru podle § 37 ZP (nejpozději do 7 dnů).' },
          { key: 'equipment', label: 'Předání vybavení protokolem; u home office dohoda o práci na dálku.' },
        ],
      },
      {
        title: 'Do 8 dnů a průběžně',
        items: [
          { key: 'cssz', label: 'Přihlášení k nemocenskému pojištění (ČSSZ) do 8 dnů.' },
          { key: 'zp', label: 'Oznámení zdravotní pojišťovně do 8 dnů.' },
          { key: 'jmhz', label: 'Jednotné měsíční hlášení zaměstnavatele za první měsíc.' },
          { key: 'payroll', label: 'Založit mzdový list a evidenci pracovní doby.' },
        ],
      },
    ],
  },
  {
    kind: 'checklist',
    slug: 'kontrola-pripravenosti-2027',
    title: 'Kontrola připravenosti na změny 2027',
    shortTitle: 'Připravenost 2027',
    description: 'Projděte, zda máte vyřešené změny, které se zaměstnavatelů a podnikatelů týkají v přechodu na rok 2027.',
    metaTitle: 'Kontrola připravenosti na změny 2027: zaměstnavatel a OSVČ',
    metaDescription:
      'Bezplatná kontrola připravenosti: minimální mzda 2027, jednotné měsíční hlášení, limity DPP, zálohy OSVČ, paušální daň. Každý bod s oficiálním zdrojem.',
    situation: 'zamestnavam',
    answer:
      'Většina změn pro rok 2027 navazuje na už účinné předpisy (JMHZ, valorizace minimální mzdy, snížení minima OSVČ). Nové hodnoty pro rok 2027 se vyhlašují na podzim 2026 — zkontrolujte smlouvy a nastavení mzdového systému, jakmile budou známy.',
    sources: [
      { label: 'MPSV — Minimální mzda', href: 'https://mpsv.gov.cz/minimalni-mzda' },
      { label: 'ČSSZ — JMHZ', href: 'https://www.cssz.gov.cz/co-je-jmhz-' },
    ],
    primaryDocument: { href: '/zmeny-2027', label: 'Otevřít legislativní radar 2027' },
    related: [
      { href: '/zmeny-2027/zamestnavatele', label: 'Změny 2027 pro zaměstnavatele' },
      { href: '/zmeny-2027/osvc-a-podnikatele', label: 'Změny 2027 pro OSVČ' },
    ],
    updatedAt: UPDATED,
    sections: [
      {
        title: 'Zaměstnavatel',
        items: [
          { key: 'jmhz', label: 'Podáváme jednotné měsíční hlášení zaměstnavatele a máme potvrzení o podání.', link: { href: '/zmeny-2027/zamestnavatele#jmhz-jednotne-mesicni-hlaseni', label: 'JMHZ' } },
          { key: 'minwage', label: 'Hodinové sazby v DPP a mzdy sledují minimální mzdu; po vyhlášení částky pro 2027 je přepočítáme.', link: { href: '/zmeny-2027/zamestnavatele#minimalni-mzda-2027', label: 'Minimální mzda 2027' } },
          { key: 'dpp', label: 'U DPP hlídáme rozhodnou částku pro pojištění (12 000 Kč v roce 2026).', link: { href: '/zmeny-2027/zamestnavatele#dpp-rozhodna-castka-2026', label: 'DPP 2026' } },
          { key: 'flexi', label: 'Vzory pracovních smluv odpovídají flexinovele (zkušební doba, doručování).', link: { href: '/zmeny-2027/zamestnavatele#flexinovela-zakoniku-prace', label: 'Flexinovela' } },
        ],
      },
      {
        title: 'OSVČ a podnikatel',
        items: [
          { key: 'osvc', label: 'Zálohy na pojistné od července 2026 odpovídají novému minimu (35 % průměrné mzdy).', link: { href: '/zmeny-2027/osvc-a-podnikatele#osvc-minimalni-zalohy-35-procent', label: 'Zálohy OSVČ' } },
          { key: 'pausal', label: 'Do 10. 1. 2027 rozhodnu o vstupu do paušálního režimu nebo změně pásma.', link: { href: '/zmeny-2027/osvc-a-podnikatele#pausalni-dan-2027', label: 'Paušální daň' } },
          { key: 'accounting', label: 'Sleduji projednávání nového zákona o účetnictví (zatím beze změny povinností).', link: { href: '/zmeny-2027/osvc-a-podnikatele#novy-zakon-o-ucetnictvi', label: 'Zákon o účetnictví' } },
        ],
      },
      {
        title: 'Smlouvy a spotřebitelé',
        items: [
          { key: 'consumer', label: 'Prodáváme-li spotřebitelům, sledujeme novelu ochrany spotřebitele (právo na opravu, záruka po opravě).', link: { href: '/zmeny-2027/spotrebitele', label: 'Změny pro spotřebitele' } },
          { key: 'esign', label: 'Máme jasno, kdy stačí prostý elektronický podpis a kdy potřebujeme ověřený.', link: { href: '/zmeny-2027/smlouvy-online', label: 'Smlouvy online' } },
        ],
      },
    ],
  },

  // ── Auto ────────────────────────────────────────────────────────────────
  {
    kind: 'checklist',
    slug: 'checklist-prodeje-auta',
    title: 'Checklist prodeje auta',
    shortTitle: 'Prodej auta',
    description: 'Od inzerátu po přepis: co připravit, co uvést do smlouvy a co si pohlídat při předání.',
    metaTitle: 'Checklist prodeje auta 2026: smlouva, předání, přepis',
    metaDescription:
      'Bezplatný checklist pro prodávajícího: doklady, popis stavu a vad, kupní smlouva s VIN a tachometrem, předání, přepis do 10 dnů, pojištění.',
    situation: 'auto',
    answer:
      'Prodávající potřebuje technický průkaz, doklad totožnosti a poctivý popis stavu vozidla. Kupní smlouva má obsahovat VIN, stav tachometru, cenu a známé vady. Po předání je nutné do 10 pracovních dnů zapsat změnu vlastníka v registru vozidel.',
    legalNote: 'Kupní smlouva: § 2079 a násl. OZ. Zápis změny vlastníka do 10 pracovních dnů: zákon č. 56/2001 Sb., o podmínkách provozu vozidel na pozemních komunikacích.',
    sources: [OZ, { label: 'Zákon č. 56/2001 Sb. — e-Sbírka', href: 'https://www.e-sbirka.cz/sb/2001/56' }],
    primaryDocument: { href: '/auto', label: 'Vytvořit kupní smlouvu na vozidlo' },
    related: [
      { href: '/blog/prodej-auta-prodavjici-2026', label: 'Prodej auta z pohledu prodávajícího' },
      { href: '/blog/doklady-pri-prodeji-auta-2026', label: 'Doklady při prodeji auta' },
      { href: '/balicek-prodej-vozidla', label: 'Balíček pro prodej vozidla' },
    ],
    updatedAt: UPDATED,
    sections: [
      {
        title: 'Před prodejem',
        items: [
          { key: 'docs', label: 'Technický průkaz / osvědčení o registraci, servisní kniha, doklad o STK.' },
          { key: 'condition', label: 'Sepsaný stav vozidla a známé vady (poctivě — skryté vady jdou za prodávajícím).' },
          { key: 'history', label: 'Připravená historie: nájezd, nehody, počet majitelů.' },
        ],
      },
      {
        title: 'Smlouva',
        items: [
          { key: 'vin', label: 'VIN, SPZ, stav tachometru, datum první registrace.' },
          { key: 'price', label: 'Cena a způsob úhrady; hotovost nad 270 000 Kč není dovolena.' },
          { key: 'defects', label: 'Výslovně uvedené vady a prohlášení o stavu.' },
          { key: 'transfer', label: 'Kdo a do kdy zajistí přepis; plná moc, pokud přepis vyřídí kupující.', link: { href: '/plna-moc', label: 'Plná moc' } },
        ],
      },
      {
        title: 'Předání a po prodeji',
        items: [
          { key: 'protocol', label: 'Předávací protokol s klíči, doklady a stavem tachometru.', link: { href: '/blog/predani-vozidla-kupujicimu-2026', label: 'Předání vozidla' } },
          { key: 'registry', label: 'Zápis změny vlastníka do 10 pracovních dnů (Portál dopravy nebo úřad).', link: { href: '/nastroje/prepis-vozidla-co-potrebuji', label: 'Přepis vozidla' } },
          { key: 'insurance', label: 'Ukončit povinné ručení až po přepisu; kupující musí mít sjednané své (úřad si ho ověří, zelená karta se nepředkládá).' },
        ],
      },
    ],
  },
  {
    kind: 'checklist',
    slug: 'checklist-koupe-auta',
    title: 'Checklist koupě auta',
    shortTitle: 'Koupě auta',
    description: 'Co prověřit před koupí ojetého auta a co musí být ve smlouvě, abyste se dovolali práv z vad.',
    metaTitle: 'Checklist koupě ojetého auta 2026: prověření, smlouva, vady',
    metaDescription:
      'Bezplatný checklist pro kupujícího: prověření VIN a historie, prohlídka, zkušební jízda, smlouva s tachometrem a vadami, přepis a pojištění.',
    situation: 'auto',
    answer:
      'Před koupí prověřte VIN, historii a technický stav, do smlouvy nechte zapsat stav tachometru, známé vady a prohlášení prodávajícího. Po převzetí zařiďte přepis do 10 pracovních dnů a povinné ručení od prvního dne.',
    legalNote: 'Práva z vadného plnění při koupi od podnikatele: § 2165 a násl. OZ; mezi soukromými osobami § 2099 a násl. OZ.',
    sources: [OZ],
    primaryDocument: { href: '/auto', label: 'Vytvořit kupní smlouvu na vozidlo' },
    related: [
      { href: '/blog/kupni-smlouva-auto-kupujici-2026', label: 'Kupní smlouva z pohledu kupujícího' },
      { href: '/prodej-vozidla/vady-ojeteho-auta', label: 'Vady ojetého auta' },
    ],
    updatedAt: UPDATED,
    sections: [
      {
        title: 'Prověření',
        items: [
          { key: 'vin', label: 'Ověřit VIN v registru vozidel a historii (nehody, nájezd, zástavy).' },
          { key: 'owner', label: 'Prodávající je zapsaný vlastník, nebo má plnou moc.' },
          { key: 'inspection', label: 'Prohlídka v servisu nebo s nezávislým technikem, zkušební jízda.' },
        ],
      },
      {
        title: 'Smlouva',
        items: [
          { key: 'mileage', label: 'Stav tachometru a prohlášení o původnosti nájezdu.' },
          { key: 'defects', label: 'Vyjmenované vady; obecné „prodává se jak stojí a leží“ nezbavuje odpovědnosti za zamlčené vady.' },
          { key: 'price', label: 'Cena, způsob úhrady a okamžik přechodu vlastnictví.' },
          { key: 'handover', label: 'Předání klíčů, dokladů a příslušenství v protokolu.' },
        ],
      },
      {
        title: 'Po koupi',
        items: [
          { key: 'insurance', label: 'Povinné ručení od okamžiku převzetí.' },
          { key: 'registry', label: 'Přepis do 10 pracovních dnů.', link: { href: '/nastroje/prepis-vozidla-co-potrebuji', label: 'Přepis vozidla' } },
          { key: 'defects_notice', label: 'Objevené vady oznámit prodávajícímu bez zbytečného odkladu, písemně.' },
        ],
      },
    ],
  },
  {
    kind: 'checklist',
    slug: 'prepis-vozidla-co-potrebuji',
    title: 'Přepis vozidla — co potřebuji',
    shortTitle: 'Přepis vozidla',
    description: 'Doklady, lhůta a postup zápisu změny vlastníka vozidla — online přes Portál dopravy nebo na úřadě.',
    metaTitle: 'Přepis vozidla 2026: doklady, lhůta 10 dnů, online postup',
    metaDescription:
      'Doklady k přepisu vozidla, lhůta 10 pracovních dnů, společná žádost prodávajícího a kupujícího, plná moc. Pojištění a evidenční kontrolu ověří úřad sám.',
    situation: 'auto',
    answer:
      'Změnu vlastníka zapisuje kterýkoli obecní úřad obce s rozšířenou působností (nebo online Portál dopravy) na společnou žádost prodávajícího a kupujícího do 10 pracovních dnů od převodu. Předkládáte doklady totožnosti, osvědčení o registraci a technický průkaz (byl-li vydán). Povinné ručení kupujícího i platnou evidenční kontrolu ověří úřad sám — zelená karta se nepředkládá. Evidenční kontrola platí od 1. 7. 2025 dva roky a u osobního auta s platnou pravidelnou STK ji nahrazuje protokol z STK; samostatně ji řešíte u ojetiny mladší čtyř let. Za nepřítomnou stranu jedná zmocněnec s plnou mocí.',
    legalNote: 'Zákon č. 56/2001 Sb., § 8 a násl. (zápis změny vlastníka). Plná moc pro zápis vyžaduje úředně ověřený podpis, není-li podána elektronicky s uznávaným podpisem. Postup a doklady podle Ministerstva dopravy (ověřeno 2026-09-17).',
    sources: [
      { label: 'Zákon č. 56/2001 Sb. — e-Sbírka', href: 'https://www.e-sbirka.cz/sb/2001/56' },
      { label: 'Ministerstvo dopravy — Změna vlastníka vozidla (životní situace)', href: 'https://md.gov.cz/Zivotni-situace/Registr-vozidel/zmena-vlastnika' },
      { label: 'Ministerstvo dopravy — Prodloužená platnost evidenční kontroly (od 1. 7. 2025)', href: 'https://md.gov.cz/Media/Media-a-tiskove-zpravy/Prodlouzena-platnost-evidencni-kontroly-osobnich-a' },
    ],
    primaryDocument: { href: '/plna-moc', label: 'Vytvořit plnou moc k přepisu' },
    related: [
      { href: '/blog/prepis-vozidla-2026', label: 'Přepis vozidla 2026 — průvodce' },
      { href: '/blog/prepis-auta-online-portal-dopravy-2026', label: 'Přepis online přes Portál dopravy' },
    ],
    updatedAt: UPDATED,
    sections: [
      {
        title: 'Doklady',
        items: [
          { key: 'id', label: 'Doklad totožnosti obou stran (nebo zmocněnce).' },
          { key: 'tp', label: 'Technický průkaz / osvědčení o registraci vozidla.' },
          { key: 'insurance', label: 'Povinné ručení sjednané kupujícím — úřad je ověří u České kanceláře pojistitelů, zelená karta se nepředkládá.' },
          { key: 'inspection', label: 'Platná evidenční kontrola: platí 2 roky; u auta s platnou pravidelnou STK ji nahrazuje protokol z STK, u ojetiny mladší 4 let ji nechte udělat.' },
          { key: 'poa', label: 'Plná moc s úředně ověřeným podpisem, pokud jedna strana není přítomna.', link: { href: '/plna-moc', label: 'Plná moc' } },
        ],
      },
      {
        title: 'Postup',
        items: [
          { key: 'deadline', label: 'Podat žádost do 10 pracovních dnů od převodu vlastnictví.' },
          { key: 'where', label: 'Kterýkoli úřad obce s rozšířenou působností, nebo online přes Portál dopravy (obě strany s elektronickou identitou).' },
          { key: 'fee', label: 'Uhradit správní poplatek.' },
        ],
      },
    ],
  },

  // ── Pronájem ────────────────────────────────────────────────────────────
  {
    kind: 'checklist',
    slug: 'checklist-uzavreni-najmu',
    title: 'Checklist uzavření nájmu',
    shortTitle: 'Uzavření nájmu',
    description: 'Co si dohodnout a ověřit před podpisem nájemní smlouvy na byt nebo dům.',
    metaTitle: 'Checklist uzavření nájmu bytu 2026: smlouva, kauce, předání',
    metaDescription:
      'Checklist před podpisem nájemní smlouvy: doba nájmu, nájemné a služby, kauce do 3 nájmů, zvířata, předávací protokol a energie. Pro pronajímatele i nájemce.',
    situation: 'pronajimam',
    answer:
      'Nájemní smlouva na byt musí být písemná a musí být jasné, co se pronajímá, za kolik a na jak dlouho. Kauce smí být nejvýše trojnásobek měsíčního nájemného. Předání bytu zachyťte protokolem se stavem měřidel.',
    legalNote: 'Nájem bytu: § 2235 a násl. OZ. Jistota (kauce) nejvýše trojnásobek nájemného: § 2254 OZ.',
    sources: [OZ],
    primaryDocument: { href: '/najem', label: 'Vytvořit nájemní smlouvu' },
    related: [
      { href: '/blog/najemni-smlouva-vzor-2026', label: 'Nájemní smlouva 2026 — co musí obsahovat' },
      { href: '/blog/kauce-pronajem-bytu-2026', label: 'Kauce při pronájmu' },
      { href: '/balicek-pronajimatel', label: 'Balíček pro pronajímatele' },
    ],
    updatedAt: UPDATED,
    sections: [
      {
        title: 'Ověření',
        items: [
          { key: 'owner', label: 'Pronajímatel je vlastník (katastr) nebo má souhlas k podnájmu.' },
          { key: 'tenant', label: 'Totožnost nájemce; u více nájemců společný nájem.' },
        ],
      },
      {
        title: 'Smlouva',
        items: [
          { key: 'subject', label: 'Přesné označení bytu a příslušenství.' },
          { key: 'term', label: 'Doba určitá / neurčitá a případné prodloužení.', link: { href: '/blog/najem-na-dobu-urcitou-neurcitou-2026', label: 'Doba určitá vs. neurčitá' } },
          { key: 'rent', label: 'Nájemné, zálohy na služby a způsob vyúčtování.' },
          { key: 'deposit', label: 'Kauce nejvýše 3 nájmy; potvrzení o převzetí.' },
          { key: 'rules', label: 'Zvířata, kouření, drobné opravy, úpravy bytu.' },
          { key: 'indexation', label: 'Inflační doložka, pokud chcete nájemné zvyšovat.', link: { href: '/blog/valorizace-najemneho-2026', label: 'Valorizace nájemného' } },
        ],
      },
      {
        title: 'Předání',
        items: [
          { key: 'protocol', label: 'Předávací protokol se stavem bytu, vybavením a měřidly.', link: { href: '/nastroje/checklist-predani-bytu', label: 'Checklist předání bytu' } },
          { key: 'keys', label: 'Počet předaných klíčů.' },
          { key: 'energy', label: 'Převod nebo přepis energií a internetu.' },
        ],
      },
    ],
  },
  {
    kind: 'checklist',
    slug: 'checklist-predani-bytu',
    title: 'Checklist předání bytu',
    shortTitle: 'Předání bytu',
    description: 'Jak předat byt nájemci (nebo ho převzít zpět), aby nevznikl spor o stav, vybavení a kauci.',
    metaTitle: 'Checklist předání bytu 2026: protokol, měřidla, vybavení',
    metaDescription:
      'Bezplatný checklist k předání bytu: stav místností, vybavení, stavy měřidel, klíče, fotodokumentace, podpis protokolu. Vhodné pro nastěhování i vrácení bytu.',
    situation: 'pronajimam',
    answer:
      'Předání bytu zachyťte písemným protokolem: stav každé místnosti, vybavení, stavy měřidel, počet klíčů a fotografie. Stejný protokol použijte při vrácení — podle něj se posuzuje běžné opotřebení a započtení kauce.',
    legalNote: 'Nájemce odevzdá byt ve stavu, v jakém jej převzal, s přihlédnutím k běžnému opotřebení (§ 2293 OZ). Pronajímatel vrátí jistotu při skončení nájmu se započtením dluhů (§ 2254 OZ).',
    sources: [OZ],
    primaryDocument: { href: '/balicek-pronajimatel', label: 'Nájemní smlouva s předávacím protokolem' },
    related: [
      { href: '/blog/predani-bytu-najemci-2026', label: 'Jak správně předat byt nájemci' },
      { href: '/blog/vraceni-kauce-po-skonceni-najmu-2026', label: 'Vrácení kauce' },
    ],
    updatedAt: UPDATED,
    sections: [
      {
        title: 'Před předáním',
        items: [
          { key: 'clean', label: 'Byt vyklizený a uklizený; drobné závady opravené nebo zapsané.' },
          { key: 'keys', label: 'Sada klíčů pro nájemce připravená a spočítaná.' },
        ],
      },
      {
        title: 'Při předání',
        items: [
          { key: 'rooms', label: 'Projít každou místnost, zapsat stav podlah, stěn, oken, dveří.' },
          { key: 'equipment', label: 'Seznam vybavení a spotřebičů se stavem.' },
          { key: 'meters', label: 'Stavy elektroměru, plynoměru, vodoměrů, případně tepla.' },
          { key: 'photos', label: 'Fotografie s datem jako příloha protokolu.' },
          { key: 'sign', label: 'Podpis obou stran, každá má vyhotovení.' },
        ],
      },
      {
        title: 'Po předání',
        items: [
          { key: 'energy', label: 'Nahlásit stavy měřidel dodavatelům / přepsat odběr.' },
          { key: 'deposit', label: 'Potvrzení o převzetí kauce.' },
        ],
      },
    ],
  },
  {
    kind: 'checklist',
    slug: 'checklist-ukonceni-najmu',
    title: 'Checklist ukončení nájmu',
    shortTitle: 'Ukončení nájmu',
    description: 'Výpověď nebo dohoda, převzetí bytu zpět, vyúčtování služeb a vrácení kauce — krok za krokem.',
    metaTitle: 'Checklist ukončení nájmu bytu 2026: výpověď, předání, kauce',
    metaDescription:
      'Checklist ukončení nájmu: písemná výpověď s důvodem a poučením, výpovědní doba, převzetí bytu protokolem, vyúčtování služeb a vrácení kauce.',
    situation: 'pronajimam',
    answer:
      'Nájem končí dohodou, uplynutím doby nebo výpovědí. Výpověď musí být písemná; pronajímatel může vypovědět jen ze zákonných důvodů a musí nájemce poučit o právu namítat neoprávněnost. Byt se vrací protokolem, kauce se vrací po skončení nájmu se započtením dluhů.',
    legalNote: 'Výpověď nájmu bytu: § 2286–2291 OZ (výpovědní doba zpravidla 3 měsíce). Vrácení jistoty: § 2254 OZ.',
    sources: [OZ],
    primaryDocument: { href: '/najem', label: 'Nájemní smlouva online' },
    related: [
      { href: '/blog/vypoved-z-najmu-bytu-2026', label: 'Výpověď z nájmu bytu' },
      { href: '/blog/vraceni-kauce-po-skonceni-najmu-2026', label: 'Vrácení kauce po skončení nájmu' },
      { href: '/pro-pronajimatele/neplaceni-najemneho', label: 'Nájemce neplatí nájem' },
    ],
    updatedAt: UPDATED,
    sections: [
      {
        title: 'Ukončení',
        items: [
          { key: 'how', label: 'Zvolit způsob: dohoda / uplynutí doby / výpověď se zákonným důvodem.' },
          { key: 'notice', label: 'Písemná výpověď s důvodem a poučením, prokazatelně doručená.' },
          { key: 'period', label: 'Správně spočítaná výpovědní doba (běží od prvního dne následujícího měsíce).' },
        ],
      },
      {
        title: 'Vrácení bytu',
        items: [
          { key: 'protocol', label: 'Převzetí bytu protokolem a porovnání s protokolem z nastěhování.', link: { href: '/nastroje/checklist-predani-bytu', label: 'Checklist předání bytu' } },
          { key: 'meters', label: 'Stavy měřidel a odhlášení energií.' },
          { key: 'keys', label: 'Vrácení všech klíčů.' },
        ],
      },
      {
        title: 'Peníze',
        items: [
          { key: 'services', label: 'Vyúčtování služeb za poslední období.' },
          { key: 'deposit', label: 'Vrátit kauci se započtením prokazatelných dluhů a případných úroků.' },
          { key: 'domicile', label: 'Ověřit ukončení trvalého pobytu nájemce, pokud byl hlášen.' },
        ],
      },
    ],
  },
];

export function getPortalTool(slug: string): PortalTool | null {
  return PORTAL_TOOLS.find((tool) => tool.slug === slug) ?? null;
}

export function getPortalToolsForSituation(situation: PortalSituationKey): PortalTool[] {
  return PORTAL_TOOLS.filter((tool) => tool.situation === situation);
}
