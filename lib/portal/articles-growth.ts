import type { AnswerFirstArticle } from './articles';

/**
 * Growth Engine — druhá vlna answer-first obsahu (2026-09-17).
 *
 * Každá stránka odpovídá na jeden konkrétní dotaz lidí v situaci zakázky,
 * zaměstnávání nebo prodeje auta a vede: odpověď → postup → nástroj →
 * dokument → případ. Témata, která už pokrývá blog nebo nástroj, tu nejsou
 * duplikována — odkazují se z `related`.
 */

const UPDATED = '2026-09-17';
const OZ = { label: 'Občanský zákoník (zákon č. 89/2012 Sb.) — e-Sbírka', href: 'https://www.e-sbirka.cz/sb/2012/89' };
const ZP = { label: 'Zákoník práce (zákon č. 262/2006 Sb.) — e-Sbírka', href: 'https://www.e-sbirka.cz/sb/2006/262' };
const ZOZ = { label: 'Zákon o zaměstnanosti (zákon č. 435/2004 Sb.) — e-Sbírka', href: 'https://www.e-sbirka.cz/sb/2004/435' };
const MPSV_MZDA = { label: 'MPSV — Minimální mzda', href: 'https://mpsv.gov.cz/minimalni-mzda' };
const CSSZ_JMHZ = { label: 'ČSSZ — Co je JMHZ', href: 'https://www.cssz.gov.cz/co-je-jmhz-' };
const VOZIDLA = { label: 'Zákon č. 56/2001 Sb., o podmínkách provozu vozidel — e-Sbírka', href: 'https://www.e-sbirka.cz/sb/2001/56' };
const HOTOVOST = { label: 'Zákon č. 254/2004 Sb., o omezení plateb v hotovosti — e-Sbírka', href: 'https://www.e-sbirka.cz/sb/2004/254' };

export const GROWTH_ARTICLES: readonly AnswerFirstArticle[] = [
  // ── Zakázka ─────────────────────────────────────────────────────────────
  {
    slug: 'zaloha-remeslnikovi',
    section: 'zakazka',
    situation: 'zakazka',
    title: 'Záloha řemeslníkovi: kolik, kdy a jak ji ošetřit ve smlouvě',
    metaTitle: 'Záloha řemeslníkovi: kolik, kdy a jak ji ošetřit',
    metaDescription:
      'Kolik zálohy dát řemeslníkovi, na co ji vázat, jak ji zapsat do smlouvy o dílo a co s ní bude, když se zakázka neuskuteční. Odpověď s odkazy na OZ.',
    question: 'Mám dát řemeslníkovi zálohu?',
    answer:
      'Záloha není povinná ze zákona — vzniká jen dohodou. Rozumná je záloha na materiál nebo na první etapu (typicky 20–40 % ceny), vždy písemně, s uvedením účelu a s tím, na co se započte. Zbytek plaťte po dokončení etap nebo po převzetí díla. Bez smlouvy je záloha jen důvěra bez pravidel.',
    context: [
      'Právo na zaplacení ceny vzniká zhotoviteli provedením díla (§ 2610 OZ). Provádí-li se dílo po částech nebo se značnými náklady a strany si zálohy nesjednaly, může zhotovitel žádat přiměřenou část ceny během provádění (§ 2611 OZ).',
      'Záloha je plnění před splatností — započítává se na cenu. Pokud smlouva zanikne (odstoupení), řeší se vypořádání záloh podle smlouvy, jinak podle pravidel o bezdůvodném obohacení (§ 2991 a násl. OZ).',
    ],
    steps: [
      { title: 'Určete účel a výši zálohy', text: 'Na materiál (podle nabídky), nebo na první etapu. U menších zakázek stačí 20–30 %, u zakázek s drahým materiálem se sjednává i více — ale vždy s doložením účelu.' },
      { title: 'Zapište zálohu do smlouvy', text: 'Částka, splatnost, účet, na co se započte a co se s ní stane při odstoupení. Vyžádejte zálohovou fakturu nebo potvrzení o přijetí.' },
      { title: 'Vážte platby na milníky', text: 'Zbývající platby navažte na dokončení etap nebo převzetí díla protokolem; poslední část (5–10 %) lze držet do odstranění vad z předání.' },
      { title: 'Zaznamenejte platby v zakázce', text: 'V Moje zakázka si evidujte termíny a platby, aby bylo jasné, co bylo uhrazeno a kdy.' },
    ],
    risks: [
      { title: 'Vysoká záloha bez vazby na plnění', text: 'Záloha 50 % a více bez milníků přenáší celé riziko na objednatele. Pokud zhotovitel nezačne, vymáhání zálohy trvá měsíce.' },
      { title: 'Záloha „na ruku“ bez dokladu', text: 'Bez písemného potvrzení neprokážete, že jste zaplatili. Hotovostní platby nad 270 000 Kč jsou navíc zakázané (zákon č. 254/2004 Sb.).' },
      { title: 'Záloha místo smlouvy', text: 'Zaplacená záloha smlouvu nenahrazuje. Rozsah, cena a termín musí být sjednány, jinak vzniká spor o to, co bylo dohodnuto.' },
    ],
    faq: [
      { q: 'Můžu zálohu chtít zpět, když řemeslník nezačal?', a: 'Ano. Po marné dodatečné lhůtě odstupte od smlouvy a požadujte vrácení zálohy; nevrácená záloha je bezdůvodné obohacení. Písemná výzva a doklad o platbě jsou klíčové.' },
      { q: 'Je záloha totéž co smluvní pokuta nebo zádržné?', a: 'Ne. Záloha je část ceny placená předem. Zádržné je část ceny, kterou objednatel drží do odstranění vad. Smluvní pokuta je sankce za porušení povinnosti.' },
    ],
    documents: [
      { href: '/smlouva-o-dilo', label: 'Vytvořit smlouvu o dílo se zálohou a milníky' },
      { href: '/balicek-zakazka', label: 'Zakázka Plus — s platebním harmonogramem' },
    ],
    tools: [
      { href: '/nastroje/checklist-pred-smlouvou-o-dilo', label: 'Checklist před smlouvou o dílo' },
      { href: '/nastroje/podklady-k-zakazce', label: 'Seznam podkladů k zakázce' },
    ],
    related: [
      { href: '/zakazka/smlouva-s-remeslnikem', label: 'Smlouva s řemeslníkem — co si ohlídat' },
      { href: '/blog/smlouva-o-dilo-cena-a-platby', label: 'Cena a platby ve smlouvě o dílo' },
      { href: '/zakazka/remeslnik-nedodrzel-termin', label: 'Řemeslník nedodržel termín' },
    ],
    sources: [OZ, HOTOVOST],
    updatedAt: UPDATED,
    verifiedAt: UPDATED,
  },
  {
    slug: 'viceprace-bez-souhlasu',
    section: 'zakazka',
    situation: 'zakazka',
    title: 'Vícepráce bez souhlasu: musím je zaplatit?',
    metaTitle: 'Vícepráce bez souhlasu objednatele: musím je zaplatit?',
    metaDescription:
      'Řemeslník provedl práce navíc bez odsouhlasení a chce je zaplatit. Kdy nárok má, kdy ne, co říká OZ o rozpočtu a pevné ceně a jak postupovat, aby se spor nevyhrotil.',
    question: 'Musím zaplatit vícepráce, které jsem neodsouhlasil?',
    answer:
      'Zpravidla ne. Při pevné ceně nebo zaručeném rozpočtu nemůže zhotovitel žádat víc jen proto, že práce byla náročnější (§ 2620 OZ). U rozpočtu s výhradou neúplnosti či nezávaznosti může žádat zvýšení jen za nepředvídatelné práce, které včas oznámil (§ 2621–2622 OZ). Práce provedené bez souhlasu a bez oznámení smluvní nárok nezakládají; zhotovitel se může nanejvýš domáhat vydání bezdůvodného obohacení, což je pro obě strany nejistá cesta.',
    context: [
      'Rozhodující je, jak je ve smlouvě určena cena: pevně, podle rozpočtu, nebo odhadem. Odhad může zhotovitel podstatně překročit jen po včasném oznámení (§ 2612 OZ).',
      'Změna rozsahu díla je změna smlouvy — u písemné smlouvy platí jen písemný dodatek nebo změnový list (§ 564 OZ).',
    ],
    steps: [
      { title: 'Zjistěte cenový režim ve smlouvě', text: 'Pevná cena / rozpočet / odhad. U rozpočtu zkontrolujte, zda je označen jako závazný a úplný, nebo s výhradou.' },
      { title: 'Vyžádejte si písemné vysvětlení', text: 'Popis prací, proč byly nutné, kdy vznikla potřeba a proč nebyly oznámeny předem. Bez toho nic neplaťte.' },
      { title: 'Rozlište nutné a vyžádané práce', text: 'Práce, které jste sami požadovali (byť ústně), poctivě uznejte a odsouhlaste dodatečně změnovým listem. Práce, které jste nechtěli, odmítněte písemně.' },
      { title: 'Zaznamenejte dohodu', text: 'Cokoli uznáte, potvrďte změnovým listem s cenou; předejdete tím opakování sporu při předání.' },
    ],
    risks: [
      { title: 'Ústní odsouhlasení na stavbě', text: 'Pokud jste práce ústně schválili a nechali provést, může soud dovodit dohodu nebo obohacení. Písemná pravidla pro změny chrání obě strany.' },
      { title: 'Zadržení celé platby', text: 'Spor o vícepráce neopravňuje k nezaplacení sjednané ceny za původní rozsah. Plaťte nesporné, rozporujte sporné.' },
      { title: 'Spotřebitel vs. podnikatel', text: 'Jako spotřebitel máte silnější ochranu; podnikatelé si mohou sjednat volnější režim změn.' },
    ],
    faq: [
      { q: 'Co když bez víceprací nešlo dílo dokončit?', a: 'Nepředvídatelné práce nutné k dokončení musí zhotovitel oznámit bez zbytečného odkladu, jinak nárok na zvýšení ceny nemá (§ 2622 OZ). Oznámil-li je včas a vy jste nereagovali, pozice se mění — reagujte proto na oznámení vždy písemně.' },
    ],
    documents: [
      { href: '/zakazka#moje-zakazka', label: 'Připravit změnový list nebo potvrzení víceprací v zakázce' },
      { href: '/balicek-zakazka', label: 'Zakázka Plus — formulář víceprací v ceně' },
    ],
    tools: [{ href: '/nastroje/pruvodce-vicepracemi', label: 'Průvodce vícepracemi' }],
    related: [
      { href: '/zakazka/jak-potvrdit-viceprace', label: 'Jak správně potvrdit vícepráce' },
      { href: '/zakazka/zmena-ceny-dila', label: 'Změna ceny díla' },
      { href: '/blog/viceprace-smlouva-o-dilo-2026', label: 'Vícepráce ve smlouvě o dílo — článek' },
    ],
    sources: [OZ],
    escalation: 'Při vyšších částkách, hrozbě zadržení díla nebo pokud zhotovitel odmítá pokračovat, doporučujeme individuální právní posouzení.',
    updatedAt: UPDATED,
    verifiedAt: UPDATED,
  },
  {
    slug: 'jak-potvrdit-viceprace',
    section: 'zakazka',
    situation: 'zakazka',
    title: 'Jak správně potvrdit vícepráce, aby byly zaplacené i vymahatelné',
    metaTitle: 'Jak potvrdit vícepráce: postup a písemné odsouhlasení',
    metaDescription:
      'Kdy a jak vícepráce oznámit, co musí obsahovat potvrzení (popis, cena, DPH, termín), kdo podepisuje a jak je fakturovat. Postup pro obě strany.',
    question: 'Jak potvrdit vícepráce?',
    answer:
      'Před provedením: písemně popsat práce navíc, jejich cenu (a zda včetně DPH), důvod a dopad na termín — a nechat obě strany podepsat. Teprve potom práce provést a fakturovat samostatně nebo je doplnit do platebního harmonogramu. Potvrzení víceprací je pro objednatele jistota ceny, pro zhotovitele jistota zaplacení.',
    context: [
      'Zhotovitel, který zjistí potřebu prací nad rámec rozpočtu, ji musí oznámit bez zbytečného odkladu, jinak právo na zvýšení ceny ztrácí (§ 2622 OZ).',
      'Písemné odsouhlasení je změna smlouvy (§ 564 OZ); u díla s pevnou cenou jde o jediný způsob, jak cenu legitimně navýšit (§ 2620 OZ).',
    ],
    steps: [
      { title: 'Oznamte potřebu prací navíc hned', text: 'E-mailem nebo zápisem ve stavebním deníku: co, proč, odhad ceny a času. Datum oznámení je důkaz včasnosti.' },
      { title: 'Připravte potvrzení víceprací', text: 'Číslo, datum, popis prací, důvod (požadavek objednatele / zjištěná skutečnost), cena a DPH, posun termínu, nový termín.' },
      { title: 'Podepište oběma stranami', text: 'Elektronicky nebo na papíře. Potvrzení bez podpisu objednatele je jen nabídka.' },
      { title: 'Fakturujte a aktualizujte zakázku', text: 'Vícepráce fakturujte samostatně nebo je doplňte do harmonogramu; v zakázce posuňte termín a připomínky.' },
    ],
    risks: [
      { title: 'Potvrzení po provedení', text: 'Dodatečné potvrzení je možné, ale objednatel může odmítnout; před provedením má zhotovitel silnější pozici.' },
      { title: 'Nejasná cena', text: '„Podle skutečnosti“ bez sazby nebo stropu vede ke sporu. Uveďte pevnou částku nebo hodinovou sazbu a maximální rozsah.' },
      { title: 'Zapomenutý dopad na termín', text: 'Vícepráce prodlužují realizaci; bez posunu termínu hrozí spor o prodlení a smluvní pokutu.' },
    ],
    documents: [
      { href: '/zakazka#moje-zakazka', label: 'Vytvořit potvrzení víceprací v zakázce' },
      { href: '/balicek-zakazka', label: 'Zakázka Plus — formulář víceprací a změnový list' },
    ],
    tools: [{ href: '/nastroje/pruvodce-vicepracemi', label: 'Průvodce vícepracemi' }],
    related: [
      { href: '/zakazka/viceprace-bez-souhlasu', label: 'Vícepráce bez souhlasu' },
      { href: '/blog/viceprace-smlouva-o-dilo-2026', label: 'Vícepráce ve smlouvě o dílo' },
      { href: '/zakazka/remeslnik-nedodrzel-termin', label: 'Řemeslník nedodržel termín' },
    ],
    sources: [OZ],
    updatedAt: UPDATED,
    verifiedAt: UPDATED,
  },
  {
    slug: 'zmena-ceny-dila',
    section: 'zakazka',
    situation: 'zakazka',
    title: 'Změna ceny díla: kdy je možná a jak ji sjednat',
    metaTitle: 'Změna ceny díla: pevná cena, rozpočet, odhad a dodatek',
    metaDescription:
      'Kdy může zhotovitel zvýšit cenu díla a kdy objednatel žádat snížení: pevná cena, rozpočet s výhradou, odhad, doložky a písemný dodatek podle OZ.',
    question: 'Lze změnit cenu díla po podpisu smlouvy?',
    answer:
      'Jen dohodou, nebo v případech, které smlouva či zákon výslovně připouští. Pevnou cenu ani zaručený rozpočet nelze jednostranně měnit (§ 2620 OZ). Cenu odhadem lze podstatně překročit jen po včasném oznámení a objednatel může odstoupit (§ 2612 OZ). U rozpočtu s výhradou lze žádat navýšení za nepředvídané práce; překročí-li 10 %, může objednatel odstoupit (§ 2622 OZ). Každá dohodnutá změna patří do písemného dodatku.',
    context: [
      'Cenový režim určuje smlouva. Pokud cena není sjednána vůbec, platí cena obvyklá v době uzavření smlouvy (§ 2586 odst. 2 OZ).',
      'Změnu okolností (drahý materiál, inflace) OZ zohledňuje jen výjimečně (§ 1765 a násl.) — proto se pro delší zakázky sjednává inflační nebo materiálová doložka předem.',
    ],
    steps: [
      { title: 'Určete, co je důvodem změny', text: 'Změna rozsahu (vícepráce/méněpráce), změna technického řešení, nepředvídatelné práce, nebo změna cen vstupů. Každý důvod má jiná pravidla.' },
      { title: 'Ověřte cenový režim', text: 'Pevná cena / rozpočet závazný / rozpočet s výhradou / odhad. Podle toho zjistíte, zda vůbec vzniká nárok na změnu.' },
      { title: 'Sjednejte dodatek', text: 'Změnový list s původním a novým stavem, dopadem na cenu a termín, podpisy obou stran.' },
      { title: 'Při nesouhlasu využijte zákonná práva', text: 'Objednatel může při podstatném překročení odhadu nebo rozpočtu o více než 10 % odstoupit; zhotovitel bez včasného oznámení nárok ztrácí.' },
    ],
    risks: [
      { title: 'Méněpráce bez snížení ceny', text: 'Zúží-li se rozsah, má objednatel právo na přiměřené snížení ceny — sjednejte to změnovým listem stejně jako vícepráce.' },
      { title: 'Doložka „cena se může změnit“', text: 'Neurčitá doložka nedává zhotoviteli právo cenu libovolně zvýšit; soud ji vyloží ve prospěch slabší strany.' },
      { title: 'Spotřebitelská smlouva', text: 'Ujednání, které podnikateli umožňuje jednostranně měnit cenu nebo podmínky bez práva spotřebitele odstoupit, je vůči spotřebiteli zakázané (§ 1814 OZ).' },
    ],
    documents: [
      { href: '/zakazka#moje-zakazka', label: 'Připravit změnový list v zakázce' },
      { href: '/smlouva-o-dilo', label: 'Smlouva o dílo s jasným cenovým režimem' },
    ],
    tools: [{ href: '/nastroje/pruvodce-vicepracemi', label: 'Průvodce vícepracemi' }],
    related: [
      { href: '/blog/smlouva-o-dilo-cena-a-platby', label: 'Cena a platby ve smlouvě o dílo' },
      { href: '/zakazka/jak-potvrdit-viceprace', label: 'Jak potvrdit vícepráce' },
      { href: '/zakazka/odstoupeni-od-smlouvy-o-dilo', label: 'Odstoupení od smlouvy o dílo' },
    ],
    sources: [OZ],
    updatedAt: UPDATED,
    verifiedAt: UPDATED,
  },
  {
    slug: 'predavaci-protokol-stavby',
    section: 'zakazka',
    situation: 'zakazka',
    title: 'Předávací protokol stavby: co musí obsahovat a kdy převzetí odmítnout',
    metaTitle: 'Předávací protokol stavby: obsah, drobné vady, zádržné',
    metaDescription:
      'Co zapsat do předávacího protokolu stavby, proč nelze odmítnout převzetí pro drobné vady (§ 2628 OZ), jak pracovat se zádržným a kdy začíná záruka.',
    question: 'Co musí obsahovat předávací protokol stavby?',
    answer:
      'Datum a místo, identifikaci stran a díla, rozsah skutečně provedených prací, soupis vad a nedodělků s lhůtami, výsledek přejímky (bez výhrad / s výhradami / nepřevzato) a podpisy. U stavby nemůžete odmítnout převzetí kvůli ojedinělým drobným vadám, které nebrání užívání (§ 2628 OZ) — zapište je s lhůtou a případně držte zádržné.',
    context: [
      'Dílo je provedeno dokončením a předáním (§ 2604 OZ); objednatel převezme dílo s výhradami nebo bez výhrad (§ 2605 OZ). Vady zjevné při převzetí, které nevytkne, později zpravidla neuplatní.',
      'Skryté vady stavby lze oznámit nejpozději do 5 let od převzetí (§ 2629 OZ); běžné dílo do 2 let (§ 2618 OZ).',
    ],
    steps: [
      { title: 'Připravte podklady k přejímce', text: 'Smlouva, projekt, změnové listy a vícepráce, revizní zprávy, prohlášení o shodě, návody. Bez nich nelze rozsah zkontrolovat.' },
      { title: 'Projděte stavbu společně a zapisujte', text: 'Místnost po místnosti; každou vadu s popisem, fotografií a lhůtou k odstranění. Odlište drobné vady od podstatných.' },
      { title: 'Rozhodněte o převzetí', text: 'Drobné vady → převzít s výhradami. Vady bránící užívání → nepřevzít a stanovit termín nové přejímky.' },
      { title: 'Vyřešte platby a záruku', text: 'Doplatek podle smlouvy, případně zádržné do odstranění vad; zapište datum, od kterého běží záruka.' },
    ],
    risks: [
      { title: 'Převzetí bez výhrad „aby byl klid“', text: 'Zjevné vady, které nezapíšete, se považují za nevytknuté. Vždy zapisujte i drobnosti.' },
      { title: 'Odmítnutí převzetí pro drobné vady', text: 'U stavby to zákon neumožňuje; bezdůvodné odepření převzetí může vyvolat účinky předání a prodlení objednatele.' },
      { title: 'Chybějící revize a doklady', text: 'Bez revizí (elektro, plyn, komín) nelze stavbu bezpečně užívat ani kolaudovat; jejich předání zapište do protokolu.' },
    ],
    faq: [
      { q: 'Co je zádržné a musí být ve smlouvě?', a: 'Zádržné je část ceny (typicky 5–10 %), kterou objednatel uhradí až po odstranění vad z předání. Funguje jen tehdy, je-li sjednáno ve smlouvě; jinak jde o prodlení s platbou.' },
    ],
    documents: [
      { href: '/zakazka#moje-zakazka', label: 'Připravit předávací protokol v zakázce' },
      { href: '/balicek-zakazka', label: 'Zakázka Plus — protokol s evidencí vad v ceně' },
    ],
    tools: [{ href: '/nastroje/checklist-predani-zakazky', label: 'Checklist předání zakázky' }],
    related: [
      { href: '/blog/predavaci-protokol-vzor-2026', label: 'Předávací protokol — obecný průvodce' },
      { href: '/zakazka/prevzeti-dila-s-vadami', label: 'Převzetí díla s vadami' },
      { href: '/zakazka/reklamace-dila', label: 'Reklamace díla' },
    ],
    sources: [OZ],
    escalation: 'U staveb vyšší hodnoty, sporných vad nebo odmítnutého převzetí doporučujeme přizvat technický dozor a zvážit individuální právní posouzení.',
    updatedAt: UPDATED,
    verifiedAt: UPDATED,
  },
  {
    slug: 'prevzeti-dila-s-vadami',
    section: 'zakazka',
    situation: 'zakazka',
    title: 'Převzetí díla s vadami: jak převzít s výhradami a neztratit práva',
    metaTitle: 'Převzetí díla s vadami: výhrady, lhůty a doplatek',
    metaDescription:
      'Jak převzít dílo s výhradami: co zapsat, jaké lhůty stanovit, kdy převzetí odmítnout, jak řešit doplatek a co dělat, když zhotovitel vady neodstraní.',
    question: 'Můžu převzít dílo, i když má vady?',
    answer:
      'Ano — převezměte je s výhradami. Do protokolu zapište každou vadu, dohodněte lhůtu k odstranění a způsob nápravy; tím jsou vady včas vytknuté a záruka běží. Nepřevzít můžete jen dílo s podstatnými vadami, které brání užívání. Doplatek můžete podle smlouvy vázat na odstranění vad (zádržné), nesporná část ceny je ale splatná.',
    context: [
      'Objednatel převezme dokončené dílo s výhradami nebo bez výhrad (§ 2605 OZ). Neoznámí-li zjevné vady při převzetí, soud mu práva z nich nepřizná, namítne-li zhotovitel opožděnost (§ 2605 odst. 2, § 2618 OZ).',
      'Právo z vad: odstranění, sleva, u podstatných vad odstoupení (§ 2615 ve spojení s § 2106–2107 OZ).',
    ],
    steps: [
      { title: 'Zapište vady konkrétně', text: 'Kde, co, rozsah, fotografie. „Nekvalitní práce“ nestačí — popište, co konkrétně neodpovídá smlouvě nebo normě.' },
      { title: 'Dohodněte lhůtu a způsob nápravy', text: 'Oprava do konkrétního data, nebo sleva; u vad, které nelze odstranit, sleva z ceny.' },
      { title: 'Ošetřete doplatek', text: 'Podle smlouvy: zádržné do odstranění vad, jinak zaplaťte nespornou část a sporné vyčíslete.' },
      { title: 'Po odstranění vad potvrďte', text: 'Krátkým zápisem o odstranění; nezůstane-li nic nedořešené, uzavřete zakázku a uložte dokumentaci na dobu záruky.' },
    ],
    risks: [
      { title: 'Nevytknutá zjevná vada', text: 'Po převzetí bez výhrad ji už zpravidla neuplatníte. Zapište i drobné vady.' },
      { title: 'Neurčitá lhůta „co nejdříve“', text: 'Bez konkrétního data nelze zhotovitele dostat do prodlení. Uveďte datum.' },
      { title: 'Zadržení celé ceny', text: 'Zadržet lze jen sjednané zádržné nebo přiměřenou část odpovídající vadám; jinak se do prodlení dostáváte vy.' },
    ],
    documents: [
      { href: '/zakazka#moje-zakazka', label: 'Připravit předávací protokol nebo zápis o vadách v zakázce' },
    ],
    tools: [{ href: '/nastroje/checklist-predani-zakazky', label: 'Checklist předání zakázky' }],
    related: [
      { href: '/zakazka/predavaci-protokol-stavby', label: 'Předávací protokol stavby' },
      { href: '/zakazka/reklamace-dila', label: 'Reklamace díla a vady po předání' },
      { href: '/zakazka/odpovednost-za-vady-dila', label: 'Odpovědnost za vady díla' },
    ],
    sources: [OZ],
    updatedAt: UPDATED,
    verifiedAt: UPDATED,
  },
  {
    slug: 'odpovednost-za-vady-dila',
    section: 'zakazka',
    situation: 'zakazka',
    title: 'Odpovědnost za vady díla: zákonná práva, záruka a lhůty',
    metaTitle: 'Odpovědnost za vady díla: práva z vad, záruka, lhůty',
    metaDescription:
      'Rozdíl mezi zákonnou odpovědností za vady a zárukou u smlouvy o dílo, lhůty pro oznámení vad (2 roky, u stavby 5 let) a co si sjednat ve smlouvě.',
    question: 'Jak dlouho odpovídá zhotovitel za vady díla?',
    answer:
      'Ze zákona odpovídá za vady, které mělo dílo při předání; objednatel je musí oznámit bez zbytečného odkladu po zjištění, nejpozději do 2 let od předání, u stavby jde skryté vady oznámit až 5 let. Záruka za jakost je něco navíc: sjednaný závazek, že dílo bude určitou dobu způsobilé — její délku a podmínky určuje smlouva.',
    context: [
      'Zákonná odpovědnost: § 2615–2619 OZ (přiměřeně se použijí pravidla kupní smlouvy). Oznámení vad: § 2618 OZ (do 2 let od předání), skryté vady stavby: § 2629 OZ (5 let).',
      'Záruka za jakost: § 2619 OZ odkazuje na § 2113–2117 OZ; záruku lze sjednat ve smlouvě nebo prohlášením zhotovitele.',
    ],
    steps: [
      { title: 'Sjednejte záruku ve smlouvě', text: 'Délka (typicky 24 měsíců, u staveb i déle), od kdy běží (od převzetí), co pokrývá a jak se uplatňuje.' },
      { title: 'Vytýkejte vady včas a písemně', text: 'Zjevné při převzetí, skryté bez zbytečného odkladu po zjištění. Datum oznámení je rozhodující.' },
      { title: 'Zvolte právo z vady', text: 'Odstranění, sleva, u podstatné vady odstoupení; volbu sdělte zhotoviteli (§ 2106 OZ).' },
      { title: 'Dokumentujte průběh', text: 'Oznámení, odpovědi, termíny oprav a jejich převzetí — v zakázce nebo zápisem.' },
    ],
    risks: [
      { title: 'Záruka není totéž co zákonná odpovědnost', text: 'I bez sjednané záruky máte práva z vad, které dílo mělo při předání; záruka jen rozšiřuje ochranu na vady vzniklé později.' },
      { title: 'Vyloučení odpovědnosti ve smlouvě', text: 'Vůči spotřebiteli je nepřípustné (§ 1814 OZ); mezi podnikateli lze rozsah odpovědnosti sjednat, ale ne pro vady lstivě zastřené.' },
      { title: 'Vada z podkladů objednatele', text: 'Za vady způsobené nevhodnými podklady nebo pokyny objednatele zhotovitel neodpovídá, pokud na jejich nevhodnost upozornil (§ 2594–2595 OZ).' },
    ],
    documents: [
      { href: '/smlouva-o-dilo', label: 'Smlouva o dílo se sjednanou zárukou' },
      { href: '/zakazka#moje-zakazka', label: 'Oznámení vad a výzva k odstranění v zakázce' },
    ],
    tools: [{ href: '/nastroje/checklist-predani-zakazky', label: 'Checklist předání zakázky' }],
    related: [
      { href: '/zakazka/reklamace-dila', label: 'Reklamace díla' },
      { href: '/zakazka/prevzeti-dila-s-vadami', label: 'Převzetí díla s vadami' },
      { href: '/blog/smluvni-pokuta-vzor-2026', label: 'Smluvní pokuta' },
    ],
    sources: [OZ],
    escalation: 'Spory o příčinu vady (materiál vs. provedení vs. podklady) často vyžadují znalecký posudek a individuální právní posouzení.',
    updatedAt: UPDATED,
    verifiedAt: UPDATED,
  },
  {
    slug: 'odstoupeni-od-smlouvy-o-dilo',
    section: 'zakazka',
    situation: 'zakazka',
    title: 'Odstoupení od smlouvy o dílo: kdy je možné a jak ho provést',
    metaTitle: 'Odstoupení od smlouvy o dílo: důvody, postup, vypořádání',
    metaDescription:
      'Kdy může objednatel nebo zhotovitel odstoupit od smlouvy o dílo, jak odstoupení doručit a jak vypořádat provedené práce a zálohy. Postup podle OZ.',
    question: 'Kdy lze odstoupit od smlouvy o dílo?',
    answer:
      'Když to připouští smlouva nebo zákon: při podstatném porušení (např. dílo se vůbec neprovádí), po marné dodatečné lhůtě u nepodstatného porušení, provádí-li zhotovitel dílo v rozporu se smlouvou a nápravu ani po výzvě nezjedná (§ 2593 OZ), nebo při podstatném překročení ceny odhadem či rozpočtu o více než 10 % (§ 2612, § 2622 OZ). Odstoupení musí být písemné a doručené; poté se vypořádají provedené práce a zálohy.',
    context: [
      'Obecná pravidla: § 2001–2005 OZ (odstoupení), § 1977–1978 OZ (podstatné vs. nepodstatné porušení, dodatečná lhůta). Odstoupením se smlouva ruší od počátku, ale u částečně provedeného díla se plnění vypořádá (§ 2004–2005, § 2993 OZ).',
      'Zhotovitel může odstoupit zejména při neposkytnutí součinnosti objednatele po výzvě (§ 2591 OZ) nebo při trvání na nevhodném pokynu (§ 2595 OZ).',
    ],
    steps: [
      { title: 'Ověřte důvod a splňte podmínky', text: 'U nepodstatného porušení nejdřív písemná výzva s dodatečnou lhůtou; u vadného provádění výzva k nápravě.' },
      { title: 'Odstupte písemně', text: 'Uveďte důvod, odkaz na smlouvu a zákon, datum. Doručte prokazatelně (doporučeně, datovou schránkou, e-mailem podle smlouvy).' },
      { title: 'Vypořádejte provedené práce', text: 'Zdokumentujte stav díla (fotografie, zápis), vyčíslete hodnotu provedených prací a započtěte zaplacené zálohy.' },
      { title: 'Uplatněte pokuty a škodu', text: 'Sjednaná smluvní pokuta za prodlení a náhrada škody (např. dražší dokončení jinou firmou) odstoupením nezanikají (§ 2005 OZ).' },
    ],
    risks: [
      { title: 'Předčasné odstoupení', text: 'Bez splnění podmínek je odstoupení neplatné a vy se dostáváte do prodlení. U nepodstatného porušení vždy nejdřív lhůta.' },
      { title: 'Nezdokumentovaný stav díla', text: 'Bez fotografií a zápisu ke dni odstoupení se špatně prokazuje, co bylo provedeno a v jaké kvalitě.' },
      { title: 'Spotřebitel a smlouva na dálku', text: 'Spotřebitel má u smluv uzavřených na dálku 14denní právo odstoupit i bez důvodu (§ 1829 OZ), pokud plnění nezačalo s jeho výslovným souhlasem.' },
    ],
    documents: [
      { href: '/zakazka#moje-zakazka', label: 'Otevřít zakázku a připravit oznámení vad či výzvu' },
      { href: '/smlouva-o-dilo', label: 'Smlouva o dílo s jasnými podmínkami odstoupení' },
    ],
    tools: [{ href: '/nastroje/checklist-pred-smlouvou-o-dilo', label: 'Checklist před smlouvou o dílo' }],
    related: [
      { href: '/zakazka/remeslnik-nedodrzel-termin', label: 'Řemeslník nedodržel termín' },
      { href: '/blog/odstoupeni-od-smlouvy-2026', label: 'Odstoupení od smlouvy — obecně' },
      { href: '/zakazka/zmena-ceny-dila', label: 'Změna ceny díla' },
    ],
    sources: [OZ],
    escalation: 'Odstoupení je krok s významnými finančními důsledky. U zakázek vyšší hodnoty nebo při riziku protinároků doporučujeme individuální právní posouzení před doručením.',
    updatedAt: UPDATED,
    verifiedAt: UPDATED,
  },

  // ── Zaměstnávám ─────────────────────────────────────────────────────────
  {
    slug: 'pracovni-smlouva-2027',
    section: 'zamestnavam',
    situation: 'zamestnavam',
    title: 'Pracovní smlouva 2027: co se mění a co zkontrolovat ve vzoru',
    metaTitle: 'Pracovní smlouva 2027: co se mění a co zkontrolovat',
    metaDescription:
      'Co platí pro pracovní smlouvy v roce 2027: zkušební doba a doručování po flexinovele, jednotné měsíční hlášení, nová minimální mzda a informace podle § 37 ZP.',
    question: 'Co se mění u pracovní smlouvy v roce 2027?',
    answer:
      'Náležitosti pracovní smlouvy zůstávají stejné (druh práce, místo, den nástupu). Co je nové proti starším vzorům: zkušební doba až 4 měsíce (vedoucí 8) a výpovědní doba běžící od doručení po flexinovele, jednotné měsíční hlášení zaměstnavatele od roku 2026 a nová minimální mzda pro rok 2027, kterou MPSV vyhlásí na podzim 2026. Vzory z roku 2024 a starší proto zkontrolujte.',
    context: [
      'Flexinovela (zákon č. 120/2025 Sb.) je účinná od 1. 6. 2025 — PLATÍ. JMHZ (zákon č. 323/2025 Sb.) — PLATÍ od 1. 1. 2026.',
      'Minimální mzda 2027: valorizační mechanismus § 111 ZP; koeficienty pro roky 2027 a 2028 stanoví vláda nařízením v roce 2026 — PROJEDNÁVÁ SE. Pro rok 2026 činí 22 400 Kč / 134,40 Kč za hodinu.',
    ],
    steps: [
      { title: 'Zkontrolujte zkušební dobu a doručování', text: 'Zkušební doba nejvýše 4 měsíce (8 u vedoucích), u doby určité nejvýše polovina sjednané doby; ujednání o doručování sladit s § 334 a násl. ZP.' },
      { title: 'Aktualizujte informaci podle § 37 ZP', text: 'Písemná informace do 7 dnů od vzniku pracovního poměru — pokud ji vzor neobsahuje, doplňte samostatný dokument.' },
      { title: 'Připravte mzdové sazby na 2027', text: 'Po vyhlášení minimální mzdy pro rok 2027 přepočítejte hodinové sazby a zaručené mzdy; dokud není vyhlášena, počítejte s růstem.' },
      { title: 'Ověřte procesy hlášení', text: 'Nástup a změny hlaste jednotným měsíčním hlášením; mzdový software musí umět podání i potvrzení.' },
    ],
    risks: [
      { title: 'Starší vzor s výpovědní dobou od 1. dne měsíce', text: 'Po flexinovele běží zpravidla ode dne doručení; staré formulace matou obě strany.' },
      { title: 'Zkušební doba sjednaná po nástupu', text: 'Lze ji sjednat nejpozději v den nástupu; pozdější ujednání je neplatné.' },
      { title: 'Mzda pod minimální/zaručenou', text: 'Nová hodnota pro 2027 platí od 1. 1. 2027; nezapomeňte na zaručenou mzdu podle skupiny prací.' },
    ],
    documents: [
      { href: '/pracovni', label: 'Vytvořit pracovní smlouvu (aktuální vzor)' },
      { href: '/balicek-zamestnavatel', label: 'Zaměstnavatel Start 2026 — smlouva + § 37 + nástup' },
    ],
    tools: [
      { href: '/nastroje/kontrola-pripravenosti-2027', label: 'Kontrola připravenosti na změny 2027' },
      { href: '/nastroje/checklist-nastupu-zamestnance', label: 'Checklist nástupu zaměstnance' },
    ],
    related: [
      { href: '/zmeny-2027/zamestnavatele', label: 'Změny 2027 pro zaměstnavatele (radar)' },
      { href: '/zamestnavam/pracovni-smlouva', label: 'Pracovní smlouva — kdy a co musí obsahovat' },
      { href: '/blog/flexinovela-zakoniku-prace-2026', label: 'Flexinovela — podrobně' },
    ],
    sources: [ZP, MPSV_MZDA, CSSZ_JMHZ],
    updatedAt: UPDATED,
    verifiedAt: UPDATED,
  },
  {
    slug: 'dpp-2027',
    section: 'zamestnavam',
    situation: 'zamestnavam',
    title: 'DPP 2027: limit hodin, rozhodná částka a co se mění',
    metaTitle: 'DPP 2027: limit 300 hodin, rozhodná částka, minimální mzda',
    metaDescription:
      'DPP v roce 2027: limit 300 hodin zůstává, rozhodná částka a minimální hodinová mzda se vyhlásí na podzim 2026, dovolená, výpověď a hlášení. Ověřené zdroje.',
    question: 'Co platí pro DPP v roce 2027?',
    answer:
      'Limit 300 hodin ročně u jednoho zaměstnavatele zůstává (§ 75 ZP). Rozhodná částka pro účast na pojištění (2026: 12 000 Kč měsíčně) a minimální hodinová mzda (2026: 134,40 Kč) se pro rok 2027 vyhlásí na podzim 2026 — sledujte sdělení MPSV. Písemná forma, evidence hodin, nárok na dovolenou při 28 dnech a 80 hodinách a jednotné měsíční hlášení platí dál.',
    context: [
      'Rozhodná částka se odvozuje od průměrné mzdy a vyhlašuje se každoročně; pro rok 2027 zatím není známa — PROJEDNÁVÁ SE. Minimální mzda 2027 vzejde z nařízení vlády a sdělení MPSV.',
      'DPP a JMHZ: dohody se od roku 2026 hlásí jednotným měsíčním hlášením stejně jako pracovní poměry.',
    ],
    steps: [
      { title: 'Naplánujte rozsah hodin na rok', text: 'Součet hodin u vás nesmí přesáhnout 300; při větším rozsahu zvolte DPČ nebo pracovní smlouvu.' },
      { title: 'Nastavte odměnu s rezervou', text: 'Hodinová odměna nejméně na úrovni minimální mzdy; pro leden 2027 počítejte s novou hodnotou.' },
      { title: 'Hlídejte měsíční odměnu', text: 'Od rozhodné částky vzniká účast na pojištění a odvody; sledujte nově vyhlášenou hodnotu pro 2027.' },
      { title: 'Evidujte a hlaste', text: 'Evidence odpracované doby, jednotné měsíční hlášení, dovolená při splnění podmínek.' },
    ],
    risks: [
      { title: 'DPP na celoroční práci', text: 'Pravidelná práce každý týden po celý rok je znakem pracovního poměru; DPP tu neobstojí.' },
      { title: 'Více DPP u jednoho zaměstnavatele', text: 'Hodiny ze všech dohod u téhož zaměstnavatele se sčítají do limitu 300.' },
      { title: 'Ukončení', text: 'Výpověď bez důvodu s 15denní výpovědní dobou; sjednané odchylky musí být písemné.' },
    ],
    documents: [{ href: '/dpp', label: 'Vytvořit dohodu o provedení práce' }],
    tools: [
      { href: '/nastroje/dpp-vs-pracovni-smlouva', label: 'DPP vs. pracovní smlouva' },
      { href: '/nastroje/jaky-vztah-potrebuji', label: 'Průvodce: Jaký vztah potřebuji?' },
    ],
    related: [
      { href: '/zamestnavam/dpp', label: 'DPP 2026: limity a povinnosti' },
      { href: '/zmeny-2027/zamestnavatele', label: 'Změny 2027 pro zaměstnavatele' },
      { href: '/blog/dpp-dpc-porovnani-2026', label: 'DPP vs. DPČ' },
    ],
    sources: [ZP, MPSV_MZDA, { label: 'MPSV — Legislativní změny účinné od 1. 1. 2026', href: 'https://mpsv.gov.cz/prehledne-legislativni-zmeny-z-gesce-mpsv-ucinne-od-1-ledna-2026' }],
    updatedAt: UPDATED,
    verifiedAt: UPDATED,
  },
  {
    slug: 'nastup-zamestnance',
    section: 'zamestnavam',
    situation: 'zamestnavam',
    title: 'Nástup zaměstnance: povinnosti zaměstnavatele krok za krokem',
    metaTitle: 'Nástup zaměstnance: povinnosti, lhůty a dokumenty',
    metaDescription:
      'Povinnosti při nástupu zaměstnance: smlouva, vstupní prohlídka, BOZP, informace podle § 37 ZP do 7 dnů, přihlášení k pojištění do 8 dnů, měsíční hlášení.',
    question: 'Co musím udělat při nástupu zaměstnance?',
    answer:
      'Před nástupem podepsat pracovní smlouvu a zajistit vstupní lékařskou prohlídku; v den nástupu školení BOZP; do 7 dnů písemnou informaci podle § 37 ZP; do 8 dnů přihlášení k nemocenskému pojištění a oznámení zdravotní pojišťovně; od roku 2026 jednotné měsíční hlášení. U cizinců navíc oprávnění k pobytu a práci.',
    context: [
      'Pracovní smlouva musí být uzavřena písemně nejpozději v den nástupu (§ 34 ZP). Informace o obsahu pracovního poměru: § 37 ZP. Vstupní prohlídka: zákon o specifických zdravotních službách.',
      'JMHZ (zákon č. 323/2025 Sb.) nahrazuje řadu dřívějších oznámení; údaje o nástupu se hlásí elektronicky.',
    ],
    steps: [
      { title: 'Před nástupem', text: 'Podepsaná smlouva, vstupní prohlídka, doklady zaměstnance (OP, účet, zápočtový list, prohlášení poplatníka), u cizince pobyt a pracovní oprávnění.' },
      { title: 'V den nástupu', text: 'Školení BOZP a PO, seznámení s vnitřními předpisy, předání vybavení protokolem, u home office dohoda o práci na dálku.' },
      { title: 'Do 7 a 8 dnů', text: 'Informace podle § 37 ZP (7 dnů), přihláška k nemocenskému pojištění a oznámení zdravotní pojišťovně (8 dnů).' },
      { title: 'Průběžně', text: 'Jednotné měsíční hlášení, mzdový list, evidence pracovní doby.' },
    ],
    risks: [
      { title: 'Nástup bez vstupní prohlídky', text: 'Zaměstnanec bez prohlídky je považován za zdravotně nezpůsobilého; pokuta od inspekce práce.' },
      { title: 'Chybějící informace podle § 37', text: 'Častá chyba u malých zaměstnavatelů; lze splnit samostatným dokumentem (součást balíčku Zaměstnavatel Start).' },
      { title: 'Zmeškané přihlášení k pojištění', text: 'Osmidenní lhůta běží ode dne nástupu; opožděné přihlášení je správní delikt.' },
    ],
    documents: [
      { href: '/balicek-zamestnavatel', label: 'Zaměstnavatel Start 2026 — smlouva, § 37, nástupní podklady' },
      { href: '/pracovni', label: 'Pracovní smlouva online' },
    ],
    tools: [{ href: '/nastroje/checklist-nastupu-zamestnance', label: 'Checklist nástupu zaměstnance' }],
    related: [
      { href: '/zamestnavam/pracovni-smlouva', label: 'Pracovní smlouva — kdy a jak' },
      { href: '/zamestnavam/pracovni-smlouva-2027', label: 'Pracovní smlouva 2027' },
      { href: '/zmeny-2027/zamestnavatele', label: 'Změny 2027 pro zaměstnavatele' },
    ],
    sources: [ZP, CSSZ_JMHZ],
    updatedAt: UPDATED,
    verifiedAt: UPDATED,
  },
  {
    slug: 'dohoda-o-skonceni-pracovniho-pomeru',
    section: 'zamestnavam',
    situation: 'zamestnavam',
    title: 'Dohoda o skončení pracovního poměru: kdy ji použít a co musí obsahovat',
    metaTitle: 'Dohoda o skončení pracovního poměru: obsah, odstupné, rizika',
    metaDescription:
      'Kdy je dohoda o skončení pracovního poměru lepší než výpověď, co musí obsahovat, kdy náleží odstupné a na co si dát pozor u nátlaku a podpory.',
    question: 'Jak ukončit pracovní poměr dohodou?',
    answer:
      'Dohoda je nejjednodušší způsob skončení: musí být písemná a musí v ní být sjednán den skončení. Důvod se uvádí, požaduje-li to zaměstnanec — a je důležitý pro odstupné: končí-li se dohodou z organizačních důvodů, náleží zaměstnanci stejné odstupné jako u výpovědi. Každá strana dostane jedno vyhotovení.',
    context: [
      'Dohoda o rozvázání pracovního poměru: § 49 ZP (písemná forma, den skončení). Odstupné při dohodě z důvodů podle § 52 písm. a) až d) ZP: § 67 ZP.',
      'Dohoda nemá výpovědní dobu ani ochrannou dobu — proto ji lze uzavřít i v době nemoci, ale jen se skutečným souhlasem zaměstnance.',
    ],
    steps: [
      { title: 'Dohodněte den skončení', text: 'Konkrétní datum; lze i okamžité skončení. Sjednejte předání práce a vybavení.' },
      { title: 'Uveďte důvod, je-li relevantní', text: 'Při organizačních důvodech uveďte odkaz na § 52 písm. a)–c) ZP kvůli odstupnému; zaměstnanec může uvedení důvodu vždy požadovat.' },
      { title: 'Vypořádejte nároky', text: 'Mzda, nevyčerpaná dovolená, odstupné, zápočtový list, potvrzení o zdanitelných příjmech.' },
      { title: 'Odhlaste zaměstnance', text: 'Odhlášení z pojištění a jednotné měsíční hlášení za poslední měsíc.' },
    ],
    risks: [
      { title: 'Dohoda pod nátlakem', text: 'Dohoda podepsaná pod hrozbou výpovědi „na hodinu“ může být napadena pro neplatnost; dejte zaměstnanci čas na rozmyšlení.' },
      { title: 'Zamlčený organizační důvod', text: 'Pokud je skutečným důvodem rušení místa a v dohodě chybí, hrozí spor o odstupné.' },
      { title: 'Vliv na podporu v nezaměstnanosti', text: 'Způsob a důvod skončení může ovlivnit výši podpory podle zákona o zaměstnanosti; zaměstnance na to upozorněte.' },
    ],
    documents: [{ href: '/pracovni', label: 'Pracovní smlouva online' }],
    tools: [],
    related: [
      { href: '/zamestnavam/ukonceni', label: 'Ukončení pracovního poměru — přehled' },
      { href: '/blog/vypovedni-doba-pracovni-pomer-2026', label: 'Výpovědní doba 2026' },
    ],
    sources: [ZP, ZOZ],
    escalation: 'U vedoucích zaměstnanců, při souběhu s nemocí nebo hrozbě soudního sporu doporučujeme individuální právní posouzení znění dohody.',
    updatedAt: UPDATED,
    verifiedAt: UPDATED,
  },

  // ── Auto ────────────────────────────────────────────────────────────────
  {
    slug: 'postup-prodeje-auta',
    section: 'prodej-vozidla',
    situation: 'auto',
    title: 'Prodej auta krok za krokem: od inzerátu po přepis',
    metaTitle: 'Prodej auta postup 2026: doklady, smlouva, předání, přepis',
    metaDescription:
      'Prodej auta v šesti krocích: doklady, inzerát a prohlídka, kupní smlouva s VIN a vadami, platba, předávací protokol, přepis do 10 pracovních dnů a pojištění.',
    question: 'Jak prodat auto správně a bezpečně?',
    answer:
      'Připravte doklady a poctivý popis stavu, sepište kupní smlouvu s VIN, stavem tachometru a známými vadami, přijměte platbu (hotovost nejvýše 270 000 Kč), předejte vozidlo protokolem a do 10 pracovních dnů zajistěte zápis změny vlastníka v registru — společně s kupujícím nebo plnou mocí. Povinné ručení ukončete až po přepisu.',
    context: [
      'Kupní smlouva: § 2079 a násl. OZ. Prodávající odpovídá za vady, které vozidlo mělo při předání a nebyly uvedeny (§ 2099 a násl. OZ).',
      'Zápis změny vlastníka do 10 pracovních dnů od převodu: zákon č. 56/2001 Sb. Omezení hotovosti 270 000 Kč: zákon č. 254/2004 Sb.',
    ],
    steps: [
      { title: 'Doklady a stav', text: 'Technický průkaz / ORV, servisní kniha, STK, evidenční kontrola (ne starší než 1 rok). Sepište známé vady a historii.' },
      { title: 'Inzerát a prohlídka', text: 'Uveďte VIN, rok, nájezd, výbavu a vady; umožněte prohlídku v servisu. Zamlčená vada se vrací jako reklamace.' },
      { title: 'Kupní smlouva', text: 'Identifikace stran, VIN, SPZ, stav tachometru, cena a způsob úhrady, výčet vad, kdo a do kdy zajistí přepis.' },
      { title: 'Platba', text: 'Převodem před předáním, nebo hotově do 270 000 Kč proti podpisu. Nepředávejte vozidlo bez uhrazené ceny.' },
      { title: 'Předání', text: 'Předávací protokol: klíče, doklady, stav tachometru, datum a čas; od té chvíle přechází riziko na kupujícího.' },
      { title: 'Přepis a pojištění', text: 'Zápis změny vlastníka do 10 pracovních dnů (Portál dopravy nebo úřad); povinné ručení ukončete až po přepisu.' },
    ],
    risks: [
      { title: 'Auto předáno, přepis nikdy', text: 'Dokud jste zapsaným vlastníkem, chodí vám pokuty a povinnost pojištění. Přepis udělejte společně nebo si vyhraďte plnou moc.' },
      { title: 'Zamlčené vady', text: 'Doložka „jak stojí a leží“ nechrání před odpovědností za zamlčené vady (§ 2103 OZ).' },
      { title: 'Prodej „na plnou moc“ přes překupníka', text: 'Zůstáváte vlastníkem a odpovídáte za vozidlo, dokud není přepsáno; trvejte na přepisu.' },
    ],
    documents: [
      { href: '/auto', label: 'Vytvořit kupní smlouvu na vozidlo' },
      { href: '/balicek-prodej-vozidla', label: 'Balíček pro prodej vozidla — smlouva + protokol + podklady' },
      { href: '/plna-moc', label: 'Plná moc k přepisu' },
    ],
    tools: [
      { href: '/nastroje/checklist-prodeje-auta', label: 'Checklist prodeje auta' },
      { href: '/nastroje/prepis-vozidla-co-potrebuji', label: 'Přepis vozidla — co potřebuji' },
    ],
    related: [
      { href: '/blog/prodej-auta-prodavjici-2026', label: 'Prodej auta z pohledu prodávajícího — podrobně' },
      { href: '/blog/doklady-pri-prodeji-auta-2026', label: 'Doklady při prodeji auta' },
      { href: '/prodej-vozidla/odpovednost-prodavajiciho-za-vady', label: 'Odpovědnost prodávajícího za vady' },
    ],
    sources: [OZ, VOZIDLA, HOTOVOST],
    updatedAt: UPDATED,
    verifiedAt: UPDATED,
  },
  {
    slug: 'koupe-ojeteho-auta',
    section: 'prodej-vozidla',
    situation: 'auto',
    title: 'Koupě ojetého auta: co prověřit a jak se chránit smlouvou',
    metaTitle: 'Koupě ojetého auta: prověření, smlouva, práva z vad',
    metaDescription:
      'Postup při koupi ojetého auta: prověření VIN a historie, prohlídka, kupní smlouva se stavem tachometru a vadami, platba, přepis do 10 dnů a práva z vad.',
    question: 'Na co si dát pozor při koupi ojetého auta?',
    answer:
      'Prověřte VIN v registru a historii vozidla, nechte auto prohlédnout v servisu a do smlouvy zapište stav tachometru, známé vady a prohlášení prodávajícího o původnosti nájezdu a nehodovosti. Od podnikatele máte práva z vad nejméně 12 měsíců, od soukromé osoby odpovídá prodávající za vady, které auto mělo při převzetí a nebyly ve smlouvě. Přepis zajistěte do 10 pracovních dnů.',
    context: [
      'Koupě od podnikatele (bazaru): práva z vad podle § 2165 a násl. OZ; u použité věci lze dobu zkrátit nejvýše na polovinu (§ 2168 OZ). Koupě mezi soukromými osobami: § 2099 a násl. OZ.',
      'Stočený tachometr nebo zamlčená havárie je vada, o které prodávající věděl — doložka „jak stojí a leží“ ji nekryje (§ 2103 OZ).',
    ],
    steps: [
      { title: 'Prověřte historii', text: 'VIN v registru vozidel, placené historie nájezdu a nehod, zástavní rejstřík, ověření, že prodávající je zapsaný vlastník.' },
      { title: 'Prohlídka a jízda', text: 'Nezávislý technik nebo servis; kontrola laku, podvozku, elektroniky, chybových kódů.' },
      { title: 'Smlouva', text: 'VIN, SPZ, stav tachometru, prohlášení o nájezdu a nehodách, vyjmenované vady, cena, okamžik přechodu vlastnictví, kdo zajistí přepis.' },
      { title: 'Předání a pojištění', text: 'Protokol s klíči a doklady; povinné ručení od okamžiku převzetí.' },
      { title: 'Přepis', text: 'Do 10 pracovních dnů společně nebo plnou mocí; potřebujete zelenou kartu a evidenční kontrolu.' },
    ],
    risks: [
      { title: 'Koupě bez smlouvy nebo s minimální smlouvou', text: 'Bez zapsaného stavu tachometru a vad prokazujete zamlčení jen těžko.' },
      { title: 'Prodávající není vlastník', text: 'Překupník s plnou mocí: ověřte plnou moc a kdo skutečně odpovídá za vady.' },
      { title: 'Zástava nebo leasing', text: 'Auto může být zajištěno úvěrem; ověřte rejstřík zástav a technický průkaz.' },
    ],
    documents: [
      { href: '/auto', label: 'Vytvořit kupní smlouvu na vozidlo' },
      { href: '/plna-moc', label: 'Plná moc k přepisu' },
    ],
    tools: [
      { href: '/nastroje/checklist-koupe-auta', label: 'Checklist koupě auta' },
      { href: '/nastroje/prepis-vozidla-co-potrebuji', label: 'Přepis vozidla — co potřebuji' },
    ],
    related: [
      { href: '/blog/kupni-smlouva-auto-kupujici-2026', label: 'Kupní smlouva z pohledu kupujícího' },
      { href: '/prodej-vozidla/skryta-vada-auta', label: 'Skrytá vada auta' },
      { href: '/prodej-vozidla/vady-ojeteho-auta', label: 'Vady ojetého auta — reklamace' },
    ],
    sources: [OZ, VOZIDLA],
    updatedAt: UPDATED,
    verifiedAt: UPDATED,
  },
  {
    slug: 'odpovednost-prodavajiciho-za-vady',
    section: 'prodej-vozidla',
    situation: 'auto',
    title: 'Odpovědnost prodávajícího za vady auta: za co ručíte a jak se poctivě chránit',
    metaTitle: 'Odpovědnost prodávajícího za vady auta: co platí',
    metaDescription:
      'Za jaké vady odpovídá prodávající ojetého auta, co znamená „jak stojí a leží“, kdy lze práva z vad písemně omezit a proč je poctivý popis vad nejlepší ochrana.',
    question: 'Za co odpovídám, když prodám ojeté auto?',
    answer:
      'Za vady, které auto mělo při předání a které nebyly kupujícímu známy — nikoli za běžné opotřebení odpovídající stáří a nájezdu. Nejlepší ochrana je popsat známé vady a stav ve smlouvě: co je uvedeno, není vada. Mezi soukromými osobami lze práva z vad omezit jen výslovným písemným ujednáním, nikdy ne pro vady, které zatajíte.',
    context: [
      'Prodávající odpovídá za vady, které má věc při přechodu nebezpečí škody (§ 2100 OZ). Kupující nemá práva z vady, kterou musel s obvyklou pozorností poznat, ledaže prodávající vadu lstivě zastřel nebo ujistil, že věc je bez vad (§ 2103 OZ).',
      'Předem se vzdát práv z vad lze jen písemně (§ 1916 odst. 2 OZ). Podnikatel vůči spotřebiteli práva z vad omezit nemůže (§ 1814 OZ).',
    ],
    steps: [
      { title: 'Sepište stav a vady poctivě', text: 'Nájezd, nehody, opravy, známé závady, co nefunguje. Přiložte servisní historii.' },
      { title: 'Uveďte prohlášení do smlouvy', text: 'Prohlášení o původnosti nájezdu a o tom, že kupující byl seznámen se stavem; výčet vad jako příloha.' },
      { title: 'Umožněte prohlídku', text: 'Prohlídka v servisu před koupí snižuje riziko pozdějších sporů o „skryté“ vady.' },
      { title: 'Uchovejte doklady', text: 'Smlouvu, protokol, fotografie stavu při předání a komunikaci — pro případ reklamace.' },
    ],
    risks: [
      { title: '„Jak stojí a leží“ jako univerzální štít', text: 'Doložka se týká věcí prodávaných úhrnkem a nekryje zamlčené vady ani slíbené vlastnosti (§ 1918, § 2103 OZ).' },
      { title: 'Ujištění „bez vad“', text: 'Výslovné ujištění zakládá odpovědnost i za vady, které kupující mohl poznat sám.' },
      { title: 'Prodej jako podnikatel', text: 'Prodáváte-li v rámci podnikání, platí spotřebitelská ochrana včetně minimálně 12měsíční odpovědnosti u použité věci.' },
    ],
    documents: [
      { href: '/auto', label: 'Kupní smlouva na vozidlo s výčtem vad' },
      { href: '/balicek-prodej-vozidla', label: 'Balíček pro prodej vozidla' },
    ],
    tools: [{ href: '/nastroje/checklist-prodeje-auta', label: 'Checklist prodeje auta' }],
    related: [
      { href: '/prodej-vozidla/vady-ojeteho-auta', label: 'Vady ojetého auta z pohledu kupujícího' },
      { href: '/prodej-vozidla/skryta-vada-auta', label: 'Skrytá vada auta' },
      { href: '/blog/prodej-auta-prodavjici-2026', label: 'Prodej auta z pohledu prodávajícího' },
    ],
    sources: [OZ],
    updatedAt: UPDATED,
    verifiedAt: UPDATED,
  },
  {
    slug: 'skryta-vada-auta',
    section: 'prodej-vozidla',
    situation: 'auto',
    title: 'Skrytá vada auta: co to je, jak ji prokázat a co můžete žádat',
    metaTitle: 'Skrytá vada auta: definice, důkaz, lhůty a nároky',
    metaDescription:
      'Co je skrytá vada ojetého auta, jak ji odlišit od opotřebení a prokázat, do kdy ji oznámit (nejpozději 2 roky) a co žádat: opravu, slevu, nebo odstoupení.',
    question: 'Co dělat, když se u koupeného auta objevila skrytá vada?',
    answer:
      'Skrytá vada je vada, kterou auto mělo už při převzetí, ale nešla zjistit ani při pečlivé prohlídce (např. skrytá koroze po havárii, stočený tachometr). Oznamte ji prodávajícímu písemně bez zbytečného odkladu po zjištění, nejpozději do 2 let od převzetí, doložte ji posudkem nebo servisní zprávou a uveďte, co žádáte: opravu, slevu, nebo u podstatné vady odstoupení.',
    context: [
      'Oznámení skryté vady: bez zbytečného odkladu po zjištění, nejpozději do dvou let po odevzdání věci (§ 2112 OZ). Práva z vad: § 2106–2107 OZ (podstatné / nepodstatné porušení).',
      'Vada musí existovat v době přechodu nebezpečí (§ 2100 OZ) — proto je klíčové prokázat, že nevznikla až provozem kupujícího.',
    ],
    steps: [
      { title: 'Zastavte používání a zdokumentujte', text: 'Fotografie, popis projevu vady, datum zjištění. Neopravujte před posouzením — zničíte důkaz.' },
      { title: 'Nechte vadu posoudit', text: 'Servisní zpráva nebo znalecký posudek určí příčinu a to, zda vada existovala při prodeji.' },
      { title: 'Oznamte vadu a zvolte nárok', text: 'Písemně, prokazatelně; oprava, sleva, nebo odstoupení u podstatné vady (např. zatajená havárie).' },
      { title: 'Při odmítnutí', text: 'Spotřebitel: mimosoudní řešení u ČOI. Jinak předžalobní výzva a soud; u stočeného tachometru zvažte i trestní oznámení.' },
    ],
    risks: [
      { title: 'Záměna s opotřebením', text: 'Opotřebená spojka po 200 000 km není skrytá vada. Rozhoduje, co bylo slíbeno a co odpovídá stáří.' },
      { title: 'Oprava před oznámením', text: 'Po opravě se příčina prokazuje těžko; nejdřív posudek, potom oprava.' },
      { title: 'Pozdní oznámení', text: 'Odkládání oznámení může vést ke ztrátě práva, namítne-li prodávající opožděnost.' },
    ],
    faq: [
      { q: 'Platí to i při koupi od bazaru?', a: 'Ano, a navíc máte jako spotřebitel silnější postavení: minimálně 12 měsíců u použité věci a možnost mimosoudního řešení u ČOI.' },
    ],
    documents: [{ href: '/auto', label: 'Kupní smlouva na vozidlo s prohlášením o stavu' }],
    tools: [{ href: '/nastroje/checklist-koupe-auta', label: 'Checklist koupě auta' }],
    related: [
      { href: '/prodej-vozidla/vady-ojeteho-auta', label: 'Vady ojetého auta — reklamace' },
      { href: '/prodej-vozidla/koupe-ojeteho-auta', label: 'Koupě ojetého auta — postup' },
      { href: '/zmeny-2027/spotrebitele', label: 'Změny 2027 pro spotřebitele' },
    ],
    sources: [OZ],
    escalation: 'U dražších vozů, podezření na podvod nebo odmítnuté reklamace doporučujeme znalecký posudek a individuální právní posouzení.',
    updatedAt: UPDATED,
    verifiedAt: UPDATED,
  },
  {
    slug: 'plna-moc-prepis-auta',
    section: 'prodej-vozidla',
    situation: 'auto',
    title: 'Plná moc k přepisu auta: co musí obsahovat a kdy stačí bez ověření',
    metaTitle: 'Plná moc k přepisu auta: obsah, ověřený podpis, vzor',
    metaDescription:
      'Kdy potřebujete plnou moc k přepisu vozidla, co musí obsahovat (VIN, rozsah), kdy je nutný úředně ověřený podpis a jak přepis online zvládnout bez plné moci.',
    question: 'Potřebuji k přepisu auta plnou moc?',
    answer:
      'Jen když jedna ze stran není při podání žádosti přítomna. Žádost o zápis změny vlastníka podávají prodávající a kupující společně; za nepřítomnou stranu jedná zmocněnec na základě písemné plné moci s úředně ověřeným podpisem zmocnitele (nebo podepsané uznávaným elektronickým podpisem). Plná moc musí označit vozidlo (VIN, SPZ) a rozsah — zápis změny vlastníka.',
    context: [
      'Plná moc obecně: § 441 a násl. OZ (forma odpovídá formě právního jednání). Pro zápis v registru vozidel vyžaduje zákon č. 56/2001 Sb. úředně ověřený podpis zmocnitele na plné moci, není-li podána elektronicky s uznávaným podpisem.',
      'Podání online přes Portál dopravy vyžaduje elektronickou identitu obou stran — plná moc pak není potřeba.',
    ],
    steps: [
      { title: 'Rozhodněte, kdo přepis vyřídí', text: 'Nejčastěji kupující; prodávající mu dá plnou moc. Nebo obráceně, případně třetí osoba.' },
      { title: 'Sepište plnou moc', text: 'Zmocnitel, zmocněnec (jméno, datum narození, adresa), vozidlo (tovární značka, VIN, SPZ), rozsah (podání žádosti o zápis změny vlastníka, převzetí dokladů), datum a podpis.' },
      { title: 'Ověřte podpis', text: 'Czech POINT, notář, obecní úřad; nebo podepište uznávaným elektronickým podpisem.' },
      { title: 'Podejte žádost do 10 pracovních dnů', text: 'S plnou mocí, doklady totožnosti, technickým průkazem, zelenou kartou a evidenční kontrolou.' },
    ],
    risks: [
      { title: 'Neověřený podpis', text: 'Úřad plnou moc bez ověřeného podpisu odmítne; lhůta 10 dnů běží dál.' },
      { title: 'Příliš široká plná moc', text: 'Generální plná moc k „všem úkonům s vozidlem“ umožní i další dispozice; omezte ji na zápis změny vlastníka.' },
      { title: 'Prodej „na plnou moc“ bez přepisu', text: 'Plná moc není převod vlastnictví; dokud není přepsáno, odpovídáte za vozidlo vy.' },
    ],
    documents: [
      { href: '/plna-moc', label: 'Vytvořit plnou moc k přepisu vozidla' },
      { href: '/balicek-prodej-vozidla', label: 'Balíček pro prodej vozidla — s plnou mocí k přepisu' },
    ],
    tools: [{ href: '/nastroje/prepis-vozidla-co-potrebuji', label: 'Přepis vozidla — co potřebuji' }],
    related: [
      { href: '/blog/prepis-vozidla-2026', label: 'Přepis vozidla 2026' },
      { href: '/blog/prepis-auta-online-portal-dopravy-2026', label: 'Přepis online přes Portál dopravy' },
      { href: '/blog/plna-moc-2026', label: 'Plná moc 2026 — obecně' },
    ],
    sources: [OZ, VOZIDLA],
    updatedAt: UPDATED,
    verifiedAt: UPDATED,
  },
];
