import type { PortalSituationKey } from '@/lib/analytics';
import type { PortalLink } from './situations';
import { GROWTH_ARTICLES } from './articles-growth';

/**
 * Answer-first obsah portálu: otázka → stručná odpověď → co udělat → na co
 * si dát pozor → oficiální zdroj → dokument / nástroj / případ.
 *
 * Každý článek má datum aktualizace a datum ověření právního stavu.
 * Obsah je informativní, nejde o právní poradenství.
 */

export type ArticleSection = 'zakazka' | 'zamestnavam' | 'pro-pronajimatele' | 'prodej-vozidla';

export type AnswerFirstArticle = {
  slug: string;
  section: ArticleSection;
  situation: PortalSituationKey;
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** Otázka, na kterou stránka odpovídá (zobrazí se jako kicker). */
  question: string;
  answer: string;
  context: readonly string[];
  steps: readonly { title: string; text: string }[];
  risks: readonly { title: string; text: string }[];
  faq?: readonly { q: string; a: string }[];
  documents: readonly PortalLink[];
  tools: readonly PortalLink[];
  related: readonly PortalLink[];
  sources: readonly { label: string; href: string }[];
  escalation?: string;
  updatedAt: string;
  verifiedAt: string;
};

const UPDATED = '2026-09-17';
const OZ = { label: 'Občanský zákoník (zákon č. 89/2012 Sb.) — e-Sbírka', href: 'https://www.e-sbirka.cz/sb/2012/89' };
const ZP = { label: 'Zákoník práce (zákon č. 262/2006 Sb.) — e-Sbírka', href: 'https://www.e-sbirka.cz/sb/2006/262' };
const ZOZ = { label: 'Zákon o zaměstnanosti (zákon č. 435/2004 Sb.) — e-Sbírka', href: 'https://www.e-sbirka.cz/sb/2004/435' };
const MPSV_MZDA = { label: 'MPSV — Minimální mzda', href: 'https://mpsv.gov.cz/minimalni-mzda' };

const CORE_ARTICLES: readonly AnswerFirstArticle[] = [
  // ── Zakázka ─────────────────────────────────────────────────────────────
  {
    slug: 'smlouva-s-remeslnikem',
    section: 'zakazka',
    situation: 'zakazka',
    title: 'Smlouva s řemeslníkem: co si ohlídat, než začne pracovat',
    metaTitle: 'Smlouva s řemeslníkem: co si ohlídat před začátkem prací',
    metaDescription:
      'Co musí obsahovat smlouva o dílo s řemeslníkem: rozsah, cena, zálohy, termín, vícepráce a předání. Praktická odpověď s odkazy na občanský zákoník.',
    question: 'Potřebuji smlouvu s řemeslníkem?',
    answer:
      'Ano, pokud jde o víc než drobnou opravu. Písemná smlouva o dílo s popisem prací, cenou, termínem a pravidly pro změny je jediný spolehlivý způsob, jak později prokázat, co bylo dohodnuto. Ústní dohoda platí také, ale spor o rozsah nebo cenu se bez ní řeší jen tvrzením proti tvrzení.',
    context: [
      'Smlouva o dílo (§ 2586 a násl. OZ) nemusí být písemná, ale bez písemné podoby nedokážete prokázat rozsah, cenu ani termín.',
      'Většina sporů s řemeslníky vzniká ze tří věcí: neurčitý rozsah, nejasný režim ceny (pevná / rozpočet / odhad) a vícepráce dohodnuté jen ústně.',
    ],
    steps: [
      { title: 'Popište dílo tak, aby šlo poznat, co je v ceně', text: 'Rozsah prací, materiál (kdo ho dodává), technické parametry, místo. Nabídku nebo výkaz výměr přiložte ke smlouvě.' },
      { title: 'Rozhodněte režim ceny', text: 'Pevná cena, cena podle rozpočtu (závazného, nebo s výhradou), nebo odhad. Uveďte, zda je včetně DPH.' },
      { title: 'Nastavte platby a termín', text: 'Záloha, milníky, doplatek po předání; splatnost faktur. Termín zahájení i dokončení a co se stane při zpoždění.' },
      { title: 'Dohodněte pravidla pro změny', text: 'Vícepráce a změny rozsahu jen písemně a před provedením — změnovým listem nebo potvrzením víceprací.' },
      { title: 'Dohodněte předání a záruku', text: 'Předávací protokol s možností výhrad, délka záruky a způsob uplatnění vad.' },
    ],
    risks: [
      { title: 'Cena „odhadem“ bez stropu', text: 'U ceny určené odhadem může zhotovitel žádat její podstatné překročení, musí to ale oznámit bez zbytečného odkladu (§ 2612 OZ). Sjednejte pevnou cenu nebo strop.' },
      { title: 'Záloha bez vazby na plnění', text: 'Vysoká záloha bez milníků přenáší riziko na objednatele. Vážte zálohu na materiál nebo na etapy.' },
      { title: 'Chybějící pojištění u větších zakázek', text: 'U rekonstrukcí a staveb si vyžádejte pojištění odpovědnosti zhotovitele.' },
      { title: 'Spotřebitel vs. podnikatel', text: 'Objednáváte-li jako spotřebitel, máte silnější ochranu (např. nemožnost vyloučit práva z vad). Podnikatel může sjednat přísnější podmínky.' },
    ],
    faq: [
      { q: 'Stačí objednávka e-mailem?', a: 'Může vzniknout smlouva, ale bývá neúplná (chybí termín, změny, záruka). Písemná smlouva o dílo je bezpečnější pro obě strany.' },
      { q: 'Kdo nese riziko, že se rozsah ukáže větší?', a: 'Při pevné ceně nebo závazném rozpočtu zhotovitel; u rozpočtu s výhradou nezávaznosti může žádat zvýšení za nepředvídané práce, pokud je včas oznámí (§ 2621–2622 OZ).' },
    ],
    documents: [
      { href: '/smlouva-o-dilo', label: 'Vytvořit smlouvu o dílo' },
      { href: '/balicek-zakazka', label: 'Zakázka Plus — smlouva + protokoly + vícepráce' },
    ],
    tools: [
      { href: '/nastroje/checklist-pred-smlouvou-o-dilo', label: 'Checklist před smlouvou o dílo' },
      { href: '/nastroje/podklady-k-zakazce', label: 'Seznam podkladů k zakázce' },
    ],
    related: [
      { href: '/blog/smlouva-o-dilo-2026', label: 'Smlouva o dílo 2026: vzor a náležitosti' },
      { href: '/blog/smlouva-o-dilo-cena-a-platby', label: 'Cena a platby ve smlouvě o dílo' },
      { href: '/zakazka', label: 'Jak zakázka probíhá od smlouvy po předání' },
    ],
    sources: [OZ],
    updatedAt: UPDATED,
    verifiedAt: UPDATED,
  },
  {
    slug: 'remeslnik-nedodrzel-termin',
    section: 'zakazka',
    situation: 'zakazka',
    title: 'Řemeslník nedodržel termín: co můžete udělat',
    metaTitle: 'Řemeslník nedodržel termín: postup, pokuta, odstoupení',
    metaDescription:
      'Zhotovitel nestíhá termín: písemná výzva s dodatečnou lhůtou, smluvní pokuta, náhrada škody a odstoupení od smlouvy. Postup podle občanského zákoníku.',
    question: 'Co dělat, když řemeslník nedodrží termín?',
    answer:
      'Nejdřív písemně vyzvěte zhotovitele k dokončení v dodatečné přiměřené lhůtě a zaznamenejte, co chybí. Máte-li ve smlouvě smluvní pokutu, můžete ji uplatnit. Pokud ani po dodatečné lhůtě nedokončí, jde zpravidla o podstatné porušení a můžete od smlouvy odstoupit a požadovat náhradu škody.',
    context: [
      'Prodlení zhotovitele je porušení smlouvy (§ 1968 a násl. OZ). Podstatné porušení umožňuje odstoupit bez zbytečného odkladu; u nepodstatného teprve po marném uplynutí dodatečné lhůty (§ 1977–1978 OZ).',
      'Smluvní pokuta za prodlení se uplatní jen, je-li sjednána; bez ní zbývá náhrada škody, kterou je třeba prokázat.',
    ],
    steps: [
      { title: 'Zjistěte příčinu a zapište stav', text: 'Fotografie, e-maily, co je hotové a co chybí. Zjistěte, zda zpoždění nezpůsobily vaše změny nebo chybějící součinnost — pak se termín posouvá.' },
      { title: 'Pošlete písemnou výzvu s dodatečnou lhůtou', text: 'Uveďte, co má být dokončeno a do kdy (přiměřeně, obvykle 7–14 dní). Upozorněte na smluvní pokutu a možnost odstoupení.' },
      { title: 'Uplatněte smluvní pokutu', text: 'Podle smlouvy (např. 0,05 % z ceny za den). Lze ji započíst proti doplatku, pokud to smlouva nevylučuje.' },
      { title: 'Zvažte odstoupení', text: 'Po marném uplynutí lhůty odstupte písemně. Vyúčtujte provedené práce a nechte dokončit jiného zhotovitele; rozdíl v ceně je škoda.' },
    ],
    risks: [
      { title: 'Termín posunuly vaše vícepráce', text: 'Odsouhlasené vícepráce nebo pozdě dodané podklady prodlužují termín. Zkontrolujte změnové listy.' },
      { title: 'Odstoupení bez dodatečné lhůty', text: 'U nepodstatného prodlení je předčasné odstoupení neplatné a můžete se sami dostat do prodlení.' },
      { title: 'Nepřiměřená pokuta', text: 'Soud může nepřiměřeně vysokou smluvní pokutu snížit (§ 2051 OZ).' },
    ],
    faq: [
      { q: 'Můžu zadržet doplatek?', a: 'Splatnou smluvní pokutu lze zpravidla započíst proti doplatku, není-li započtení vyloučeno. Zadržení celé částky bez důvodu je prodlení objednatele.' },
      { q: 'Co když zhotovitel přestal komunikovat?', a: 'Doručte výzvu prokazatelně (doporučeně, datovou schránkou, e-mailem podle smlouvy). Po marné lhůtě odstupte a dokončete dílo jinde.' },
    ],
    documents: [
      { href: '/zakazka#moje-zakazka', label: 'Otevřít zakázku a připravit výzvu / změnový list' },
      { href: '/smlouva-o-dilo', label: 'Smlouva o dílo s termínem a pokutou' },
    ],
    tools: [{ href: '/nastroje/checklist-predani-zakazky', label: 'Checklist předání zakázky' }],
    related: [
      { href: '/blog/smluvni-pokuta-vzor-2026', label: 'Smluvní pokuta — jak ji sjednat' },
      { href: '/blog/odstoupeni-od-smlouvy-2026', label: 'Odstoupení od smlouvy' },
      { href: '/zakazka/reklamace-dila', label: 'Reklamace díla a vady po předání' },
    ],
    sources: [OZ],
    escalation: 'U zakázek vyšší hodnoty, při sporu o příčinu zpoždění nebo při hrozící škodě třetím osobám doporučujeme individuální právní posouzení.',
    updatedAt: UPDATED,
    verifiedAt: UPDATED,
  },
  {
    slug: 'reklamace-dila',
    section: 'zakazka',
    situation: 'zakazka',
    title: 'Reklamace díla: vady po předání a jak je uplatnit',
    metaTitle: 'Reklamace díla: vady po předání, lhůty, oznámení vad',
    metaDescription:
      'Jak uplatnit vady díla po předání: včasné oznámení, volba nápravy (oprava, sleva), lhůty 2 roky a 5 let u stavby, záruka. Postup a oznámení vad v zakázce.',
    question: 'Jak reklamovat vadné dílo?',
    answer:
      'Vady oznamte zhotoviteli písemně bez zbytečného odkladu poté, co jste je zjistili nebo mohli zjistit, a uveďte, jakou nápravu požadujete (nejčastěji odstranění vady, jinak slevu). U běžného díla lze skryté vady vytknout nejpozději do 2 let od předání, u stavby do 5 let. Vady zjevné při převzetí vytkněte rovnou v předávacím protokolu.',
    context: [
      'Práva z vadného plnění u díla se řídí přiměřeně úpravou kupní smlouvy (§ 2615 OZ). Objednatel nemá práva z vady, kterou mohl při převzetí zjistit a nevytkl (§ 2605 odst. 2 OZ).',
      'Oznámení vad: § 2618 OZ — bez zbytečného odkladu, nejpozději do 2 let od předání; u stavby skryté vady do 5 let (§ 2629 OZ).',
    ],
    steps: [
      { title: 'Popište vadu a zdokumentujte ji', text: 'Datum zjištění, fotografie, případně posudek u větších vad.' },
      { title: 'Pošlete písemné oznámení vad', text: 'Uveďte vady, zvolenou nápravu a přiměřenou lhůtu. Doručte prokazatelně (e-mail podle smlouvy, doporučeně).' },
      { title: 'Umožněte odstranění', text: 'Zpřístupněte dílo k opravě a zaznamenejte termíny. Po opravě potvrďte převzetí zápisem.' },
      { title: 'Při nečinnosti uplatněte další práva', text: 'Sleva z ceny, u podstatné vady odstoupení; případně odstranění třetí osobou na náklady zhotovitele, pokud to smlouva nebo zákon umožňuje.' },
    ],
    risks: [
      { title: 'Pozdní oznámení', text: 'Namítne-li zhotovitel opožděné oznámení, soud právo z vady nepřizná (§ 2618 OZ).' },
      { title: 'Vady zjevné při převzetí', text: 'Co jste mohli vidět při převzetí a nevytkli, se za vytknuté nepovažuje. Proto je předávací protokol tak důležitý.' },
      { title: 'Záměna záruky a odpovědnosti za vady', text: 'Záruka za jakost je sjednané plus; zákonná práva z vad platí i bez ní.' },
    ],
    faq: [
      { q: 'Musím dát zhotoviteli šanci opravit?', a: 'Zpravidla ano — odstranění vady je primární náprava, pokud není nemožná nebo nepřiměřeně nákladná. Slevu lze požadovat, když oprava není možná nebo zhotovitel nekoná.' },
      { q: 'Jde vada jako spotřebitel řešit jinak?', a: 'Spotřebitel může využít mimosoudní řešení sporů u ČOI; obchodní podmínky nesmí jeho práva z vad omezit.' },
    ],
    documents: [
      { href: '/zakazka#moje-zakazka', label: 'Připravit oznámení vad a výzvu v zakázce' },
      { href: '/balicek-zakazka', label: 'Zakázka Plus — včetně evidence vad' },
    ],
    tools: [{ href: '/nastroje/checklist-predani-zakazky', label: 'Checklist předání zakázky' }],
    related: [
      { href: '/blog/predavaci-protokol-vzor-2026', label: 'Předávací protokol' },
      { href: '/zakazka/remeslnik-nedodrzel-termin', label: 'Řemeslník nedodržel termín' },
    ],
    sources: [OZ],
    escalation: 'Pokud zhotovitel vady popírá, hrozí škoda na majetku nebo jde o stavbu, může situace vyžadovat individuální právní posouzení a znalecký posudek.',
    updatedAt: UPDATED,
    verifiedAt: UPDATED,
  },

  // ── Zaměstnávám ─────────────────────────────────────────────────────────
  {
    slug: 'pracovni-smlouva',
    section: 'zamestnavam',
    situation: 'zamestnavam',
    title: 'Pracovní smlouva: kdy ji potřebujete a co musí obsahovat',
    metaTitle: 'Pracovní smlouva 2026: kdy ji použít a co musí obsahovat',
    metaDescription:
      'Kdy je nutná pracovní smlouva, tři povinné náležitosti, zkušební doba po flexinovele, informace podle § 37 ZP a nástupní povinnosti zaměstnavatele.',
    question: 'Kdy potřebuji pracovní smlouvu?',
    answer:
      'Pracovní smlouvu potřebujete, když má člověk pracovat pravidelně, podle vašich pokynů a ve vámi určené době — to je závislá práce. Musí být písemná a obsahovat druh práce, místo výkonu a den nástupu; ostatní (mzda, zkušební doba, pracovní doba) se sjedná ve smlouvě nebo v informaci podle § 37 ZP.',
    context: [
      'Závislá práce může být vykonávána jen v pracovněprávním vztahu (§ 3 ZP). Pracovní poměr vzniká pracovní smlouvou (§ 33 ZP), jejíž povinné náležitosti stanoví § 34 ZP.',
      'Po flexinovele (zákon č. 120/2025 Sb.) lze sjednat zkušební dobu až 4 měsíce, u vedoucích 8 měsíců; u poměru na dobu určitou nejvýše polovinu sjednané doby.',
    ],
    steps: [
      { title: 'Sjednejte tři povinné náležitosti', text: 'Druh práce, místo (nebo místa) výkonu práce a den nástupu do práce.' },
      { title: 'Doplňte praktická ujednání', text: 'Mzda (nebo mzdový výměr), zkušební doba, doba trvání (určitá/neurčitá), pracovní doba, home office.' },
      { title: 'Předejte informaci podle § 37 ZP', text: 'Písemně do 7 dnů od vzniku pracovního poměru, pokud údaje nejsou ve smlouvě.' },
      { title: 'Splňte nástupní povinnosti', text: 'Vstupní prohlídka, BOZP, přihlášení k pojištění do 8 dnů, jednotné měsíční hlášení.' },
    ],
    risks: [
      { title: 'Zkušební doba dodatečně', text: 'Zkušební dobu lze sjednat jen nejpozději v den nástupu; později už ne.' },
      { title: 'Doba určitá bez limitu', text: 'Pracovní poměr na dobu určitou lze sjednat nejvýše na 3 roky a opakovat nejvýše dvakrát (§ 39 ZP).' },
      { title: 'Mzda pod minimální mzdou', text: 'Pro rok 2026 je minimální mzda 22 400 Kč / 134,40 Kč za hodinu. Zaručená mzda podle skupin prací v podnikatelské sféře od 1. 1. 2025 neplatí; nejnižší úrovně zaručeného platu zůstávají jen u zaměstnavatelů odměňujících platem (stát, obce, příspěvkové organizace).' },
    ],
    faq: [
      { q: 'Můžu pracovní smlouvu podepsat elektronicky?', a: 'Ano, zákoník práce umožňuje elektronické uzavření; zaměstnanec má právo od takto uzavřené smlouvy do 7 dnů odstoupit, pokud nezačal pracovat.' },
      { q: 'Kdy stačí DPP místo pracovní smlouvy?', a: 'Když rozsah nepřesáhne 300 hodin ročně a nejde o pravidelnou dlouhodobou práci. Viz porovnání DPP vs. pracovní smlouva.' },
    ],
    documents: [
      { href: '/pracovni', label: 'Vytvořit pracovní smlouvu' },
      { href: '/balicek-zamestnavatel', label: 'Zaměstnavatel Start 2026 — smlouva + § 37 + nástup' },
    ],
    tools: [
      { href: '/nastroje/jaky-vztah-potrebuji', label: 'Průvodce: Jaký vztah potřebuji?' },
      { href: '/nastroje/checklist-nastupu-zamestnance', label: 'Checklist nástupu zaměstnance' },
    ],
    related: [
      { href: '/blog/pracovni-smlouva-2026', label: 'Pracovní smlouva 2026 — vzor a náležitosti' },
      { href: '/blog/zkusebni-doba-2026', label: 'Zkušební doba 2026' },
      { href: '/zmeny-2027/zamestnavatele', label: 'Změny 2027 pro zaměstnavatele' },
    ],
    sources: [ZP, MPSV_MZDA],
    updatedAt: UPDATED,
    verifiedAt: UPDATED,
  },
  {
    slug: 'dpp',
    section: 'zamestnavam',
    situation: 'zamestnavam',
    title: 'DPP: limity, odvody a povinnosti zaměstnavatele v roce 2026',
    metaTitle: 'DPP 2026 pro zaměstnavatele: 300 hodin, 12 000 Kč, odvody',
    metaDescription:
      'DPP v roce 2026: limit 300 hodin, rozhodná částka 12 000 Kč pro pojištění, minimální mzda, dovolená, výpověď a měsíční hlášení. Kdy DPP použít a kdy ne.',
    question: 'Kdy použít DPP a co hlídat?',
    answer:
      'DPP je vhodná pro práci do 300 hodin ročně u jednoho zaměstnavatele. Musí být písemná, odměna nesmí být pod minimální hodinovou mzdou (134,40 Kč v roce 2026) a od měsíční odměny 12 000 Kč vzniká účast na pojištění a odvody. Pro pravidelnou celoroční práci DPP nestačí — patří do pracovní smlouvy.',
    context: [
      'DPP upravuje § 75 ZP (limit 300 hodin), společná ustanovení o dohodách § 74 a § 77 ZP.',
      'Rozhodná částka pro účast na pojištění se vyhlašuje každoročně; pro rok 2026 je 12 000 Kč (sdělení MPSV).',
    ],
    steps: [
      { title: 'Ověřte rozsah', text: 'Součet hodin u vás za rok nepřesáhne 300; jinak zvolte DPČ nebo pracovní smlouvu.' },
      { title: 'Sjednejte písemně', text: 'Sjednaná práce, rozsah, odměna, doba trvání; jedno vyhotovení dostane zaměstnanec.' },
      { title: 'Hlídejte měsíční odměnu', text: 'Od 12 000 Kč za měsíc vzniká účast na pojištění a odvody zaměstnavatele i zaměstnance.' },
      { title: 'Evidujte hodiny a hlaste', text: 'Evidence odpracované doby, výplata nejméně v minimální mzdě, jednotné měsíční hlášení.' },
    ],
    risks: [
      { title: 'DPP jako náhrada pracovního poměru', text: 'Celoroční práce každý týden na DPP může být posouzena jako obcházení zákona.' },
      { title: 'Nárok na dovolenou', text: 'Při trvání dohody alespoň 28 dní a odpracování 80 hodin vzniká nárok na dovolenou.' },
      { title: 'Ukončení', text: 'DPP lze vypovědět i bez důvodu s 15denní výpovědní dobou; sjednat lze i jiný způsob.' },
    ],
    documents: [{ href: '/dpp', label: 'Vytvořit dohodu o provedení práce' }],
    tools: [
      { href: '/nastroje/dpp-vs-pracovni-smlouva', label: 'DPP vs. pracovní smlouva' },
      { href: '/nastroje/jaky-vztah-potrebuji', label: 'Průvodce: Jaký vztah potřebuji?' },
    ],
    related: [
      { href: '/blog/dpp-dohoda-provedeni-prace', label: 'DPP 2026: limit 300 hodin, odvody a povinnosti' },
      { href: '/blog/dovolena-dpp-2026', label: 'Dovolená u DPP' },
      { href: '/blog/dpp-dpc-porovnani-2026', label: 'DPP vs. DPČ' },
    ],
    sources: [ZP, MPSV_MZDA, { label: 'MPSV — Legislativní změny účinné od 1. 1. 2026', href: 'https://mpsv.gov.cz/prehledne-legislativni-zmeny-z-gesce-mpsv-ucinne-od-1-ledna-2026' }],
    updatedAt: UPDATED,
    verifiedAt: UPDATED,
  },
  {
    slug: 'osvc',
    section: 'zamestnavam',
    situation: 'zamestnavam',
    title: 'Spolupráce s OSVČ bez švarcsystému',
    metaTitle: 'Spolupráce s OSVČ bez švarcsystému: hranice a smlouva',
    metaDescription:
      'Kdy je spolupráce s OSVČ v pořádku a kdy jde o skrytý pracovní poměr: znaky závislé práce, rizika pokut a jak nastavit smlouvu o spolupráci nebo o dílo.',
    question: 'Můžu s člověkem spolupracovat „na IČO“?',
    answer:
      'Ano, pokud skutečně podniká: pracuje samostatně, vlastními prostředky, na vlastní riziko a typicky pro více klientů. Pokud mu určujete pracovní dobu, místo a způsob práce a pracuje pod vaším vedením, jde o závislou práci — a ta musí být v pracovněprávním vztahu bez ohledu na fakturaci.',
    context: [
      'Znaky závislé práce definuje § 2 ZP: nadřízenost zaměstnavatele, jménem zaměstnavatele, podle jeho pokynů, osobně. Taková práce může být vykonávána jen v pracovním poměru nebo na dohodu (§ 3 ZP).',
      'Výkon závislé práce mimo pracovněprávní vztah je nelegální prací podle zákona o zaměstnanosti s vysokými pokutami pro obě strany.',
    ],
    steps: [
      { title: 'Ověřte, jak spolupráce skutečně probíhá', text: 'Vlastní vybavení, vlastní rozvrh, výsledek místo docházky, možnost mít i jiné klienty, vlastní odpovědnost za výsledek.' },
      { title: 'Zvolte správnou smlouvu', text: 'Smlouva o spolupráci pro opakované služby, smlouva o dílo pro konkrétní výsledek, smlouva o poskytování služeb pro B2B.' },
      { title: 'Nastavte podnikatelské podmínky', text: 'Odměna za výsledek nebo za hodiny s fakturací, mlčenlivost, licence, ukončení spolupráce, odpovědnost.' },
    ],
    risks: [
      { title: 'Zaměstnanec v převleku', text: 'Pevná pracovní doba, pokyny nadřízeného, práce ve vašem systému a jen pro vás — to jsou znaky pracovního poměru.' },
      { title: 'Doměření odvodů a pokuty', text: 'Při kontrole hrozí pokuty a doměření pojistného; smlouva sama o sobě nechrání, rozhoduje skutečnost.' },
    ],
    faq: [
      { q: 'Je problém, když OSVČ pracuje jen pro mě?', a: 'Samo o sobě ne, ale spolu s pokyny, pracovní dobou a vaším vybavením to výrazně zvyšuje riziko posouzení jako závislé práce.' },
    ],
    documents: [
      { href: '/spoluprace', label: 'Vytvořit smlouvu o spolupráci' },
      { href: '/smlouva-o-dilo', label: 'Smlouva o dílo' },
      { href: '/sluzby', label: 'Smlouva o poskytování služeb' },
    ],
    tools: [{ href: '/nastroje/jaky-vztah-potrebuji', label: 'Průvodce: Jaký vztah potřebuji?' }],
    related: [
      { href: '/blog/svarcsystem-osvc-2026', label: 'Švarcsystém 2026 — rizika' },
      { href: '/blog/smlouva-o-spolupraci-2026', label: 'Smlouva o spolupráci 2026' },
    ],
    sources: [ZP, ZOZ],
    escalation: 'Hraniční případy (dlouhodobá spolupráce s jedním klientem, práce v jeho prostorách) mohou vyžadovat individuální posouzení.',
    updatedAt: UPDATED,
    verifiedAt: UPDATED,
  },
  {
    slug: 'mlcenlivost',
    section: 'zamestnavam',
    situation: 'zamestnavam',
    title: 'Mlčenlivost zaměstnanců a spolupracovníků: kdy stačí zákon a kdy potřebujete NDA',
    metaTitle: 'Mlčenlivost zaměstnance a OSVČ: kdy potřebujete NDA',
    metaDescription:
      'Zaměstnanec má mlčenlivost ze zákona, spolupracující OSVČ ne. Kdy sjednat NDA, co do ní patří, smluvní pokuta a obchodní tajemství. Průvodce pro zaměstnavatele.',
    question: 'Potřebuji od zaměstnance nebo OSVČ smlouvu o mlčenlivosti?',
    answer:
      'U zaměstnance plyne základní mlčenlivost ze zákoníku práce a lze ji upřesnit ve smlouvě; samostatná NDA se hodí u citlivého know-how. U spolupracující OSVČ, dodavatele nebo kandidáta žádná zákonná mlčenlivost neplatí — tam je NDA se smluvní pokutou jediná účinná ochrana.',
    context: [
      'Zaměstnanec nesmí jednat v rozporu s oprávněnými zájmy zaměstnavatele (§ 301 ZP) a informace chráněné jako obchodní tajemství chrání § 504 OZ a § 2985 OZ (nekalá soutěž).',
      'Vůči podnikatelům platí jen to, co si sjednáte: vymezení důvěrných informací, doba trvání, výjimky, sankce.',
    ],
    steps: [
      { title: 'Vymezte, co je důvěrné', text: 'Ceníky, zákazníci, technologie, zdrojové kódy — konkrétně, ne „vše“.' },
      { title: 'Určete dobu a výjimky', text: 'Trvání i po skončení spolupráce; výjimky pro veřejně známé informace a zákonné povinnosti.' },
      { title: 'Sjednejte sankci', text: 'Přiměřená smluvní pokuta a právo na náhradu škody nad její rámec.' },
    ],
    risks: [
      { title: 'Konkurenční doložka není mlčenlivost', text: 'Zákaz konkurence u zaměstnance vyžaduje peněžité vyrovnání (§ 310 ZP); NDA jej nenahrazuje.' },
      { title: 'Neurčité vymezení', text: 'NDA na „veškeré informace“ bývá nevymahatelná; popište kategorie.' },
    ],
    documents: [
      { href: '/nda', label: 'Vytvořit smlouvu o mlčenlivosti (NDA)' },
      { href: '/pracovni', label: 'Pracovní smlouva s ujednáním o mlčenlivosti' },
    ],
    tools: [],
    related: [
      { href: '/blog/nda-smlouva-mlcenlivost', label: 'NDA — smlouva o mlčenlivosti' },
      { href: '/zamestnavam/osvc', label: 'Spolupráce s OSVČ' },
    ],
    sources: [ZP, OZ],
    updatedAt: UPDATED,
    verifiedAt: UPDATED,
  },
  {
    slug: 'zmena-podminek',
    section: 'zamestnavam',
    situation: 'zamestnavam',
    title: 'Změna pracovních podmínek: dodatek, mzdový výměr, nebo nová smlouva',
    metaTitle: 'Změna pracovních podmínek: dodatek, mzdový výměr, místo',
    metaDescription:
      'Jak změnit mzdu, místo, druh práce nebo pracovní dobu: kdy stačí mzdový výměr, kdy je nutný písemný dodatek se souhlasem zaměstnance a kdy jde o převedení.',
    question: 'Jak změnit podmínky v pracovní smlouvě?',
    answer:
      'Co je sjednáno ve smlouvě (druh práce, místo, doba trvání, pracovní doba), lze změnit jen písemným dodatkem se souhlasem zaměstnance. Mzdu určenou mzdovým výměrem může zaměstnavatel změnit jednostranně, sjednanou mzdu jen dohodou. Jednostranné převedení na jinou práci je možné jen ve výjimečných zákonných případech.',
    context: [
      'Obsah pracovního poměru lze změnit jen dohodou (§ 40 ZP); změna musí být písemná. Převedení na jinou práci bez souhlasu upravuje § 41 ZP.',
      'Informace podle § 37 ZP se při změně údajů aktualizuje písemně bez zbytečného odkladu.',
    ],
    steps: [
      { title: 'Určete, co se mění', text: 'Sjednané náležitosti (dodatek) vs. jednostranně určené (mzdový výměr, rozvrh směn).' },
      { title: 'Připravte písemný dodatek', text: 'Číslovaný, s odkazem na smlouvu, účinnost a podpisy obou stran.' },
      { title: 'Aktualizujte informaci podle § 37', text: 'Pokud se změní údaje v ní uvedené (např. pracovní doba, dovolená).' },
    ],
    risks: [
      { title: 'Změna „e-mailem“ bez podpisu', text: 'Bez písemné dohody se sjednané podmínky nemění a spor vyhrává původní smlouva.' },
      { title: 'Snížení sjednané mzdy jednostranně', text: 'Sjednanou mzdu nelze snížit bez souhlasu; mzdový výměr ano, ale ne pod minimální mzdu (u zaměstnavatelů odměňujících platem pod zaručený plat).' },
    ],
    documents: [{ href: '/pracovni', label: 'Pracovní smlouva online (nové znění)' }],
    tools: [],
    related: [
      { href: '/zamestnavam/pracovni-smlouva', label: 'Pracovní smlouva — kdy a jak' },
      { href: '/zamestnavam/ukonceni', label: 'Ukončení pracovního poměru' },
    ],
    sources: [ZP],
    updatedAt: UPDATED,
    verifiedAt: UPDATED,
  },
  {
    slug: 'ukonceni',
    section: 'zamestnavam',
    situation: 'zamestnavam',
    title: 'Ukončení pracovního poměru: dohoda, výpověď, zkušební doba',
    metaTitle: 'Ukončení pracovního poměru 2026: dohoda, výpověď, lhůty',
    metaDescription:
      'Jak ukončit pracovní poměr: dohoda, výpověď jen ze zákonných důvodů, výpovědní doba od doručení po flexinovele, zrušení ve zkušební době a odstupné.',
    question: 'Jak ukončit pracovní poměr?',
    answer:
      'Nejjednodušší je písemná dohoda. Výpověď ze strany zaměstnavatele je možná jen ze zákonných důvodů, musí být písemná a doručená; výpovědní doba je zpravidla dva měsíce a po flexinovele běží od doručení. Ve zkušební době lze poměr zrušit bez důvodu. U organizačních důvodů náleží odstupné.',
    context: [
      'Způsoby skončení: § 48 ZP. Výpovědní důvody zaměstnavatele: § 52 ZP. Výpovědní doba: § 51 ZP ve znění zákona č. 120/2025 Sb. Odstupné: § 67 ZP.',
      'Výpověď musí být doručena do vlastních rukou (§ 334 a násl. ZP); vadné doručení znamená neplatnou výpověď.',
    ],
    steps: [
      { title: 'Zvolte způsob ukončení', text: 'Dohoda (nejbezpečnější), výpověď s důvodem, zrušení ve zkušební době, uplynutí doby určité.' },
      { title: 'Připravte písemnost', text: 'Uveďte důvod podle § 52 ZP tak, aby jej nebylo možné zaměnit; u dohody den skončení.' },
      { title: 'Doručte prokazatelně', text: 'Osobně proti podpisu, poštou do vlastních rukou, datovou schránkou nebo elektronicky se souhlasem zaměstnance.' },
      { title: 'Vypořádejte nároky', text: 'Mzda, nevyčerpaná dovolená, odstupné, zápočtový list, potvrzení o zdanitelných příjmech, odhlášení z pojištění.' },
    ],
    risks: [
      { title: 'Výpověď v ochranné době', text: 'Nemoc, těhotenství, rodičovská — výpověď je zakázána (§ 53 ZP) s výjimkami.' },
      { title: 'Neurčitý důvod', text: 'Výpověď bez přesně vymezeného důvodu je neplatná; zaměstnanec se může domáhat pokračování a náhrady mzdy.' },
      { title: 'Nesprávný běh výpovědní doby', text: 'Po flexinovele běží zpravidla ode dne doručení; starší vzory s prvním dnem následujícího měsíce už neplatí.' },
    ],
    documents: [{ href: '/pracovni', label: 'Pracovní smlouva online' }],
    tools: [],
    related: [
      { href: '/blog/vypovedni-doba-pracovni-pomer-2026', label: 'Výpovědní doba 2026' },
      { href: '/blog/flexinovela-zakoniku-prace-2026', label: 'Flexinovela zákoníku práce' },
    ],
    sources: [ZP],
    escalation: 'Výpověď zaměstnavatele je právně citlivý krok — u sporných důvodů, ochranné doby nebo hrozby žaloby doporučujeme individuální právní posouzení.',
    updatedAt: UPDATED,
    verifiedAt: UPDATED,
  },

  // ── Pronájem ────────────────────────────────────────────────────────────
  {
    slug: 'neplaceni-najemneho',
    section: 'pro-pronajimatele',
    situation: 'pronajimam',
    title: 'Nájemce neplatí nájem: co dělat krok za krokem',
    metaTitle: 'Nájemce neplatí nájem: výzva, výpověď, kauce, vyklizení',
    metaDescription:
      'Postup pronajímatele při neplacení nájmu: písemná výzva, kauce, výpověď bez výpovědní doby při dluhu za 3 měsíce, žaloba na vyklizení. Co nikdy nedělat.',
    question: 'Co dělat, když nájemce neplatí?',
    answer:
      'Nejdřív písemně vyzvěte k úhradě s krátkou lhůtou a nabídněte splátky. Dluh za tři měsíce nájemného je hrubé porušení, které umožňuje výpověď bez výpovědní doby (§ 2291 OZ) — ale teprve po výzvě k nápravě. Byt nikdy nevyklízejte svépomocí ani neměňte zámky; pokud se nájemce nevystěhuje, zbývá žaloba na vyklizení.',
    context: [
      'Výpověď pro hrubé porušení povinností (§ 2288 OZ) má tříměsíční výpovědní dobu; při zvlášť závažném porušení — mj. neplacení nájemného a nákladů za dobu alespoň tří měsíců — lze vypovědět bez výpovědní doby (§ 2291 OZ), po předchozí výzvě k odstranění závadného chování.',
      'Kauci lze započíst na dlužné nájemné až při skončení nájmu, nedohodnou-li se strany jinak (§ 2254 OZ).',
    ],
    steps: [
      { title: 'Zaznamenejte dluh a pošlete výzvu', text: 'Přehled dlužných částek, lhůta k úhradě, upozornění na výpověď. Doručte prokazatelně.' },
      { title: 'Nabídněte dohodu', text: 'Splátkový kalendář nebo uznání dluhu s ukončením nájmu dohodou bývá rychlejší než soud.' },
      { title: 'Dejte výpověď', text: 'Písemně, s důvodem a poučením. Při dluhu za 3 měsíce po marné výzvě bez výpovědní doby; jinak s tříměsíční dobou.' },
      { title: 'Převzetí bytu a vyúčtování', text: 'Protokol, započtení kauce, vyúčtování služeb. Při nevystěhování žaloba na vyklizení.' },
    ],
    risks: [
      { title: 'Svépomocné vystěhování', text: 'Výměna zámků nebo vystěhování věcí je nezákonné a může být trestné — i při dluhu.' },
      { title: 'Výpověď bez předchozí výzvy', text: 'Výpověď bez výpovědní doby vyžaduje výzvu k nápravě; bez ní je neplatná.' },
      { title: 'Chybějící poučení', text: 'Výpověď pronajímatele musí obsahovat poučení o právu vznést námitky a navrhnout přezkoumání soudem.' },
    ],
    documents: [
      { href: '/uznani-dluhu', label: 'Uznání dluhu se splátkovým kalendářem' },
      { href: '/najem', label: 'Nájemní smlouva online' },
    ],
    tools: [{ href: '/nastroje/checklist-ukonceni-najmu', label: 'Checklist ukončení nájmu' }],
    related: [
      { href: '/blog/vypoved-z-najmu-bytu-2026', label: 'Výpověď z nájmu bytu' },
      { href: '/blog/vraceni-kauce-po-skonceni-najmu-2026', label: 'Vrácení kauce' },
      { href: '/pro-pronajimatele', label: 'Řešení pro pronajímatele' },
    ],
    sources: [OZ],
    escalation: 'Vyklizení bytu proti vůli nájemce vždy vyžaduje soud; při vyšším dluhu nebo sporu o platnost výpovědi doporučujeme advokáta.',
    updatedAt: UPDATED,
    verifiedAt: UPDATED,
  },

  // ── Auto ────────────────────────────────────────────────────────────────
  {
    slug: 'vady-ojeteho-auta',
    section: 'prodej-vozidla',
    situation: 'auto',
    title: 'Vady ojetého auta: kdy je můžete reklamovat a jak',
    metaTitle: 'Vady ojetého auta: reklamace, lhůty, stočený tachometr',
    metaDescription:
      'Práva kupujícího při vadách ojetého auta: koupě od bazaru vs. od soukromé osoby, skryté vady, stočený tachometr, oznámení vad, sleva nebo odstoupení.',
    question: 'Můžu reklamovat vady ojetého auta?',
    answer:
      'Ano, ale záleží na tom, od koho jste kupovali. Od podnikatele (bazaru) máte jako spotřebitel práva z vad v délce nejméně 12 měsíců u použité věci, podle novely OZ z roku 2023 zpravidla 2 roky s možností zkrácení na 1 rok. Od soukromé osoby odpovídá prodávající za vady, které vozidlo mělo při převzetí a nebyly uvedeny ve smlouvě; opotřebení odpovídající stáří vadou není. Vadu oznamte písemně bez zbytečného odkladu.',
    context: [
      'Koupě od podnikatele: § 2165 a násl. OZ; u použité věci lze dobu pro uplatnění vad zkrátit (§ 2168 OZ). Koupě mezi soukromými osobami: § 2099 a násl. OZ.',
      'Doložka „jak stojí a leží“ se týká věcí prodávaných úhrnkem; u konkrétního vozidla se prodávající nezbaví odpovědnosti za vadu, kterou lstivě zastřel, ani za vlastnost, kterou výslovně slíbil (§ 1918 a § 2103 OZ).',
    ],
    steps: [
      { title: 'Ověřte, co bylo ve smlouvě', text: 'Uvedené vady, prohlášení o stavu, stav tachometru. Co je ve smlouvě, reklamovat nelze.' },
      { title: 'Zdokumentujte vadu', text: 'Servisní zpráva, fotografie, datum zjištění; u tachometru výpis historie.' },
      { title: 'Oznamte vadu prodávajícímu', text: 'Písemně, s volbou nápravy: oprava, sleva, u podstatné vady odstoupení.' },
      { title: 'Při odmítnutí', text: 'Spotřebitel může využít ČOI (mimosoudní řešení); jinak soud, případně znalecký posudek.' },
    ],
    risks: [
      { title: 'Pozdní oznámení', text: 'Vady oznamte bez zbytečného odkladu — opožděné oznámení může právo z vady zmařit.' },
      { title: 'Běžné opotřebení', text: 'Opotřebení odpovídající stáří a nájezdu vadou není; rozhoduje, co bylo slíbeno.' },
      { title: 'Prodej „na plnou moc“ přes překupníka', text: 'Zjistěte, kdo je skutečný prodávající — vůči němu uplatňujete práva.' },
    ],
    documents: [
      { href: '/auto', label: 'Kupní smlouva na vozidlo s vadami a stavem tachometru' },
      { href: '/balicek-prodej-vozidla', label: 'Balíček pro prodej vozidla' },
    ],
    tools: [{ href: '/nastroje/checklist-koupe-auta', label: 'Checklist koupě auta' }],
    related: [
      { href: '/blog/kupni-smlouva-auto-kupujici-2026', label: 'Kupní smlouva z pohledu kupujícího' },
      { href: '/blog/kupni-smlouva-na-auto-2026', label: 'Co má obsahovat kupní smlouva na auto' },
      { href: '/zmeny-2027/spotrebitele', label: 'Změny 2027 pro spotřebitele' },
    ],
    sources: [OZ],
    escalation: 'U dražších vozů, podezření na podvod (stočený tachometr, zamlčená havárie) nebo při odmítnutí reklamace doporučujeme právní pomoc a znalecký posudek.',
    updatedAt: UPDATED,
    verifiedAt: UPDATED,
  },
];

/** První vlna (11) + Growth Engine (17). Pořadí = pořadí v hubech. */
export const ANSWER_FIRST_ARTICLES: readonly AnswerFirstArticle[] = [...CORE_ARTICLES, ...GROWTH_ARTICLES];

export function getAnswerFirstArticle(section: ArticleSection, slug: string): AnswerFirstArticle | null {
  return ANSWER_FIRST_ARTICLES.find((article) => article.section === section && article.slug === slug) ?? null;
}

export function getAnswerFirstArticlesBySection(section: ArticleSection): AnswerFirstArticle[] {
  return ANSWER_FIRST_ARTICLES.filter((article) => article.section === section);
}

export function articleHref(article: Pick<AnswerFirstArticle, 'section' | 'slug'>): string {
  return `/${article.section}/${article.slug}`;
}
