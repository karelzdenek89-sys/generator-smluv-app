/**
 * Slovník právních pojmů — informativní obsah.
 *
 * Pravidla pro definice:
 * - Definice je obecná a informativní, NIKOLI aplikace na konkrétní případ.
 * - Cituje platný zákon a paragraf k datu poslední revize.
 * - NEpoužívá formulace „doporučujeme vám…", „ve vašem případě…".
 * - Linkuje na související článek nebo produktovou stránku, pokud existuje.
 *
 * Karel Zdeněk není advokát — viz lib/author.ts. Tento obsah neslouží jako
 * právní poradenství ve smyslu zákona č. 85/1996 Sb.
 */

export type GlossaryCategory =
  | 'bydleni'
  | 'prace'
  | 'koupe-prodej'
  | 'zastoupeni'
  | 'finance'
  | 'obecne';

export type GlossaryEntry = {
  /** Anchor slug, kebab-case, ASCII bez diakritiky */
  slug: string;
  /** Termín v 1. pádě, jak ho hledá uživatel */
  term: string;
  /** Synonyma a alternativní formy (pro vyhledávání i pro DefinedTerm `alternateName`) */
  aliases?: readonly string[];
  category: GlossaryCategory;
  /** 1–3 odstavce textu. Bez personalizovaných formulací. */
  definition: string;
  /** Citace zákonů a paragrafů, např. „§ 2235 OZ" */
  legalReference?: string;
  /** Odkaz na související článek nebo produkt na webu SmlouvaHned */
  relatedHref?: string;
  relatedLabel?: string;
};

export const GLOSSARY_CATEGORIES: Record<GlossaryCategory, string> = {
  bydleni: 'Bydlení a nájem',
  prace: 'Práce a zaměstnání',
  'koupe-prodej': 'Koupě a prodej',
  zastoupeni: 'Zastoupení a plné moci',
  finance: 'Finance a dluhy',
  obecne: 'Obecné pojmy',
};

export const GLOSSARY: readonly GlossaryEntry[] = [
  // — BYDLENÍ —
  {
    slug: 'najemni-smlouva',
    term: 'Nájemní smlouva',
    aliases: ['nájem bytu', 'pronájem'],
    category: 'bydleni',
    definition:
      'Smlouva, kterou pronajímatel přenechává nájemci věc k dočasnému užívání za úplatu. U nájmu bytu jde o zvláštní podtyp s rozšířenou ochranou nájemce — kogentní ustanovení nelze ujednáními zhoršit v jeho neprospěch. Smlouva nevyžaduje formu veřejné listiny, ale doporučuje se písemná forma kvůli prokazatelnosti.',
    legalReference: '§ 2201–2331 zákona č. 89/2012 Sb. (občanský zákoník), zvláště § 2235 a násl. u nájmu bytu',
    relatedHref: '/blog/najemni-smlouva-vzor-2026',
    relatedLabel: 'Průvodce nájemní smlouvou',
  },
  {
    slug: 'kauce-jistota',
    term: 'Kauce (jistota)',
    aliases: ['jistota', 'záloha na nájem'],
    category: 'bydleni',
    definition:
      'Peněžní jistota, kterou nájemce skládá pronajímateli k zajištění úhrady nájemného a dalších povinností. Po skončení nájmu se vrací snížená o případné prokazatelné pohledávky pronajímatele. Maximální výše jistoty u nájmu bytu je zákonem limitována.',
    legalReference: '§ 2254 zákona č. 89/2012 Sb. — max. trojnásobek měsíčního nájemného',
    relatedHref: '/blog/kauce-pronajem-bytu-2026',
    relatedLabel: 'Kauce při pronájmu bytu — průvodce',
  },
  {
    slug: 'valorizace-najemneho',
    term: 'Valorizace nájemného',
    aliases: ['zvyšování nájmu', 'inflační doložka'],
    category: 'bydleni',
    definition:
      'Mechanismus pravidelného úpravy výše nájemného, typicky podle inflace (indexu spotřebitelských cen ČSÚ). Pokud smlouva valorizační doložku neobsahuje, řídí se zvyšování nájmu obecnými pravidly OZ — pronajímatel může navrhnout zvýšení, nájemce má lhůtu na vyjádření, případně rozhoduje soud.',
    legalReference: '§ 2248–2249 zákona č. 89/2012 Sb.',
    relatedHref: '/blog/valorizace-najemneho-2026',
    relatedLabel: 'Valorizace nájemného — průvodce',
  },
  {
    slug: 'vypoved-z-najmu',
    term: 'Výpověď z nájmu',
    aliases: ['ukončení nájmu', 'výpověď nájemní smlouvy'],
    category: 'bydleni',
    definition:
      'Jednostranné právní jednání, kterým jedna strana nájemního vztahu ukončuje nájem. U nájmu bytu jsou výpovědní důvody pronajímatele zákonně omezené a výpověď musí mít písemnou formu s poučením o právu nájemce vznést námitky. Výpovědní doba činí zpravidla 3 měsíce.',
    legalReference: '§ 2287–2296 zákona č. 89/2012 Sb. (nájem bytu)',
    relatedHref: '/blog/vypoved-z-najmu-bytu-2026',
    relatedLabel: 'Výpověď z nájmu bytu — průvodce',
  },
  {
    slug: 'podnajem',
    term: 'Podnájem',
    category: 'bydleni',
    definition:
      'Vztah, ve kterém nájemce přenechává najatou věc do užívání třetí osobě (podnájemci). U nájmu bytu vyžaduje podnájem souhlas pronajímatele, pokud nájemce v bytě sám trvale nebydlí. Pokud v bytě bydlí, postačí oznámení.',
    legalReference: '§ 2274–2278 zákona č. 89/2012 Sb.',
    relatedHref: '/blog/podnajemni-smlouva-2026',
    relatedLabel: 'Podnájemní smlouva — průvodce',
  },
  {
    slug: 'predavaci-protokol',
    term: 'Předávací protokol',
    aliases: ['protokol o předání bytu', 'protokol o předání vozidla'],
    category: 'bydleni',
    definition:
      'Písemný dokument zachycující stav předmětu (bytu, vozidla, díla) v okamžiku jeho předání. Slouží jako důkaz pro pozdější srovnání stavu — zejména u nájmu, prodeje vozidla a u díla. Zákon předávací protokol výslovně nevyžaduje, ale v praxi je zásadním důkazním prostředkem.',
    relatedHref: '/blog/predani-bytu-najemci-2026',
    relatedLabel: 'Předání bytu nájemci — průvodce',
  },

  // — PRÁCE A ZAMĚSTNÁNÍ —
  {
    slug: 'pracovni-smlouva',
    term: 'Pracovní smlouva',
    category: 'prace',
    definition:
      'Smlouva mezi zaměstnavatelem a zaměstnancem, kterou vzniká pracovní poměr. Musí být uzavřena písemně a obsahovat tři podstatné náležitosti: druh práce, místo výkonu práce a den nástupu do práce. Bez nich vzniká pochybnost o platnosti.',
    legalReference: '§ 34 zákona č. 262/2006 Sb. (zákoník práce)',
    relatedHref: '/blog/pracovni-smlouva-2026',
    relatedLabel: 'Pracovní smlouva — průvodce',
  },
  {
    slug: 'dpp',
    term: 'Dohoda o provedení práce (DPP)',
    aliases: ['DPP'],
    category: 'prace',
    definition:
      'Forma vztahu mimo pracovní poměr pro krátkodobou nebo příležitostnou činnost. Roční rozsah práce pro jednoho zaměstnavatele je zákonem limitován na 300 hodin. Po novele zákoníku práce (tzv. flexinovela) platí pro DPP nové oznamovací povinnosti zaměstnavatele vůči ČSSZ a další pravidla.',
    legalReference: '§ 75 zákona č. 262/2006 Sb.',
    relatedHref: '/blog/dpp-dohoda-provedeni-prace',
    relatedLabel: 'DPP — průvodce',
  },
  {
    slug: 'dpc',
    term: 'Dohoda o pracovní činnosti (DPČ)',
    aliases: ['DPČ'],
    category: 'prace',
    definition:
      'Forma vztahu mimo pracovní poměr s vyšším rozsahem než DPP. Rozsah práce nesmí v průměru překročit polovinu stanovené týdenní pracovní doby (typicky 20 hodin týdně) za období nejdéle 52 týdnů. Vhodné pro pravidelnou činnost menšího rozsahu.',
    legalReference: '§ 76 zákona č. 262/2006 Sb.',
    relatedHref: '/blog/dpp-dpc-porovnani-2026',
    relatedLabel: 'DPP nebo DPČ — porovnání',
  },
  {
    slug: 'zkusebni-doba',
    term: 'Zkušební doba',
    category: 'prace',
    definition:
      'Období na začátku pracovního poměru, ve kterém může kterákoli ze stran rozvázat pracovní poměr bez uvedení důvodu, písemně. Od 1. června 2025 činí maximálně čtyři měsíce, u vedoucích zaměstnanců osm měsíců; u pracovního poměru na dobu určitou zároveň nejvýše polovinu sjednané doby. Musí být sjednána písemně, jinak je neplatná.',
    legalReference: '§ 35 zákona č. 262/2006 Sb.',
    relatedHref: '/blog/pracovni-smlouva-2026',
    relatedLabel: 'Pracovní smlouva — průvodce',
  },
  {
    slug: 'svarcsystem',
    term: 'Švarcsystém',
    category: 'prace',
    definition:
      'Zastírání skutečného pracovněprávního vztahu fakturací mezi „OSVČ" a odběratelem. Zákon o zaměstnanosti zakazuje výkon závislé práce mimo pracovněprávní vztah. Inspekce práce může uložit pokutu jak zaměstnavateli, tak OSVČ. Klíčovým znakem závislé práce je výkon dle pokynů, ve jménu zaměstnavatele a v jeho prostorách.',
    legalReference: '§ 3 a § 5 zákona č. 435/2004 Sb. (zákon o zaměstnanosti); § 2 zákona č. 262/2006 Sb.',
  },

  // — KOUPĚ A PRODEJ —
  {
    slug: 'kupni-smlouva',
    term: 'Kupní smlouva',
    category: 'koupe-prodej',
    definition:
      'Smlouva, kterou prodávající převádí na kupujícího vlastnické právo k věci a kupující zaplatí kupní cenu. Smlouva může mít obecně i ústní formu, u nemovitostí je zákonem vyžadována písemná forma s úředně ověřenými podpisy. U vozidel a hodnotných movitých věcí je písemná forma silně doporučená.',
    legalReference: '§ 2079–2183 zákona č. 89/2012 Sb.',
    relatedHref: '/kupni',
    relatedLabel: 'Kupní smlouva online',
  },
  {
    slug: 'vin',
    term: 'VIN (Vehicle Identification Number)',
    category: 'koupe-prodej',
    definition:
      'Sedmnáctimístný alfanumerický kód jednoznačně identifikující konkrétní vozidlo. Najde se na štítku pod čelním sklem, v technickém průkazu a vyražený na karoserii. V kupní smlouvě na vozidlo bývá VIN klíčovou identifikací — umožňuje ověřit historii, zástavní práva i případnou manipulaci s identifikačními údaji.',
    relatedHref: '/blog/kupni-smlouva-na-auto-2026',
    relatedLabel: 'Kupní smlouva na auto — průvodce',
  },
  {
    slug: 'vady-veci',
    term: 'Skryté a zjevné vady',
    aliases: ['odpovědnost za vady', 'reklamace'],
    category: 'koupe-prodej',
    definition:
      'Zjevné vady jsou ty, které lze rozpoznat při běžné prohlídce. Skryté vady se projeví až později. Prodávající odpovídá za vady, které měla věc v době přechodu nebezpečí škody na kupujícího. U spotřebitelů platí zvláštní ochrana — zákonná lhůta pro uplatnění práva z vadného plnění je obvykle 24 měsíců od převzetí věci.',
    legalReference: '§ 2099 a násl., § 2161 a násl. zákona č. 89/2012 Sb. (spotřebitelská záruka)',
  },
  {
    slug: 'darovaci-smlouva',
    term: 'Darovací smlouva',
    category: 'koupe-prodej',
    definition:
      'Smlouva, kterou dárce bezúplatně převádí věc nebo právo na obdarovaného. U darování nemovitosti je nutná písemná forma s úředně ověřenými podpisy. U movitých věcí může postačit ústní forma a předání věci. Darování mezi blízkými příbuznými je obvykle osvobozeno od daně z příjmů.',
    legalReference: '§ 2055–2078 zákona č. 89/2012 Sb.; § 10 zákona č. 586/1992 Sb. (daň z příjmů)',
    relatedHref: '/darovaci',
    relatedLabel: 'Darovací smlouva online',
  },

  // — DÍLO A SLUŽBY —
  {
    slug: 'smlouva-o-dilo',
    term: 'Smlouva o dílo',
    category: 'koupe-prodej',
    definition:
      'Smlouva, kterou se zhotovitel zavazuje provést na svůj náklad a nebezpečí pro objednatele dílo a objednatel se zavazuje dílo převzít a zaplatit cenu. Dílem se rozumí zhotovení určité věci, údržba, oprava nebo úprava věci, anebo činnost s jiným výsledkem.',
    legalReference: '§ 2586–2635 zákona č. 89/2012 Sb.',
    relatedHref: '/smlouva-o-dilo',
    relatedLabel: 'Smlouva o dílo online',
  },
  {
    slug: 'smlouva-o-sluzbach',
    term: 'Smlouva o poskytování služeb',
    category: 'koupe-prodej',
    definition:
      'Obecný typ smlouvy, kterou se poskytovatel zavazuje vykonávat určitou činnost ve prospěch příkazce. Liší se od smlouvy o dílo tím, že nepředpokládá hmotně zachytitelný výsledek — odměna se hradí za činnost, ne za výsledek. Typicky se používá pro freelance, IT služby, marketing.',
    legalReference: '§ 2430–2444 zákona č. 89/2012 Sb. (příkazní smlouva, blízce příbuzná)',
    relatedHref: '/sluzby',
    relatedLabel: 'Smlouva o poskytování služeb online',
  },

  // — ZASTOUPENÍ —
  {
    slug: 'plna-moc',
    term: 'Plná moc',
    category: 'zastoupeni',
    definition:
      'Jednostranné prohlášení zmocnitele, že někoho zmocňuje k zastupování ve vymezeném rozsahu. Forma plné moci závisí na úkonu, ke kterému je udělena — pokud je pro úkon zákonem vyžadována zvláštní forma (např. veřejná listina u prodeje nemovitosti), je tato forma vyžadována i pro plnou moc.',
    legalReference: '§ 441–456 zákona č. 89/2012 Sb.',
    relatedHref: '/plna-moc',
    relatedLabel: 'Plná moc online',
  },
  {
    slug: 'overeny-podpis',
    term: 'Úředně ověřený podpis',
    aliases: ['legalizace podpisu'],
    category: 'zastoupeni',
    definition:
      'Úkon, kterým úředník ověřuje, že podpis na listině učinila konkrétní osoba před ním. Provádí se na CzechPOINTu (Česká pošta, obecní úřad, notář, advokát). U některých právních jednání (např. prodej nemovitosti, vybrané typy plné moci) je úředně ověřený podpis povinný.',
    legalReference: 'Zákon č. 21/2006 Sb., o ověřování',
  },
  {
    slug: 'nda',
    term: 'NDA — smlouva o mlčenlivosti',
    aliases: ['mlčenlivost', 'non-disclosure agreement'],
    category: 'zastoupeni',
    definition:
      'Smluvní ujednání chránící důvěrné informace mezi stranami. Může být jednostranné (chrání informace jedné strany) nebo vzájemné. Smluvní pokuta za porušení mlčenlivosti je obvyklým nástrojem ochrany. NDA neomezuje obecná pravidla obchodního tajemství dle OZ.',
    legalReference: '§ 1730 zákona č. 89/2012 Sb. (předsmluvní mlčenlivost); § 504 OZ (obchodní tajemství)',
    relatedHref: '/nda',
    relatedLabel: 'NDA online',
  },

  // — FINANCE A DLUHY —
  {
    slug: 'zapujcka',
    term: 'Zápůjčka (půjčka peněz)',
    aliases: ['půjčka', 'zápůjčka'],
    category: 'finance',
    definition:
      'Smlouva, kterou zapůjčitel přenechává vydlužiteli zastupitelnou věc (typicky peníze) a vydlužitel se zavazuje vrátit věc stejného druhu. Smlouva může být úročená i bezúročná. U peněz je obvyklá písemná forma jako důkazní prostředek.',
    legalReference: '§ 2390–2394 zákona č. 89/2012 Sb.',
    relatedHref: '/pujcka',
    relatedLabel: 'Smlouva o zápůjčce online',
  },
  {
    slug: 'uznani-dluhu',
    term: 'Uznání dluhu',
    category: 'finance',
    definition:
      'Písemný projev dlužníka, kterým uznává svůj dluh co do důvodu a výše. Má zásadní důkazní a procesní význam — od uznání dluhu běží nová desetiletá promlčecí lhůta. Pro věřitele je důležitým nástrojem před případným vymáháním pohledávky.',
    legalReference: '§ 2053 zákona č. 89/2012 Sb.; § 639 OZ (promlčení po uznání)',
    relatedHref: '/uznani-dluhu',
    relatedLabel: 'Uznání dluhu online',
  },
  {
    slug: 'promlceni',
    term: 'Promlčení',
    category: 'finance',
    definition:
      'Uplynutím promlčecí lhůty oslabuje právo věřitele — dlužník může vznést námitku promlčení a soud k pohledávce nepřihlédne. Obecná promlčecí lhůta činí tři roky a začíná běžet ode dne, kdy mohlo být právo vykonáno poprvé. Uznáním dluhu se promlčecí lhůta obnovuje na deset let.',
    legalReference: '§ 609 a násl. zákona č. 89/2012 Sb.',
  },
  {
    slug: 'smluvni-pokuta',
    term: 'Smluvní pokuta',
    category: 'finance',
    definition:
      'Peněžní částka, kterou je dlužník povinen zaplatit věřiteli pro případ porušení smluvní povinnosti. Zaplacením smluvní pokuty zaniká povinnost porušené smluvní povinnosti, není-li ujednáno jinak. Soud má v odůvodněných případech pravomoc nepřiměřeně vysokou smluvní pokutu snížit.',
    legalReference: '§ 2048–2052 zákona č. 89/2012 Sb.',
  },
  {
    slug: 'urok-z-prodleni',
    term: 'Úrok z prodlení',
    category: 'finance',
    definition:
      'Zákonné peněžité plnění při prodlení s úhradou peněžitého dluhu. Pokud strany neujednají jinou výši, použije se zákonná sazba stanovená nařízením vlády (vychází z repo sazby ČNB plus 8 procentních bodů). Liší se od smluvní pokuty — je sankcí specificky za prodlení s peněžitým plněním.',
    legalReference: '§ 1970 zákona č. 89/2012 Sb.; nařízení vlády č. 351/2013 Sb.',
  },

  // — OBECNÉ —
  {
    slug: 'obcansky-zakonik',
    term: 'Občanský zákoník (OZ)',
    aliases: ['OZ', 'NOZ', 'nový občanský zákoník'],
    category: 'obecne',
    definition:
      'Zákon č. 89/2012 Sb., účinný od 1. ledna 2014, který komplexně upravuje občanské právo — vlastnictví, závazky, dědictví, rodinné právo. Nahradil dřívější zákon č. 40/1964 Sb. V právní praxi je nejčastěji citovaným zákonem u smluv mezi soukromými osobami.',
    legalReference: 'Zákon č. 89/2012 Sb., občanský zákoník',
  },
  {
    slug: 'zakonik-prace',
    term: 'Zákoník práce (ZP)',
    aliases: ['ZP'],
    category: 'obecne',
    definition:
      'Zákon č. 262/2006 Sb. upravující pracovněprávní vztahy mezi zaměstnanci a zaměstnavateli — pracovní smlouvu, dohody o pracích konaných mimo pracovní poměr (DPP, DPČ), mzdu, dovolenou, výpovědi.',
    legalReference: 'Zákon č. 262/2006 Sb., zákoník práce',
  },
  {
    slug: 'kogentni-dispozitivni',
    term: 'Kogentní a dispozitivní ustanovení',
    category: 'obecne',
    definition:
      'Kogentní ustanovení zákona jsou ta, od kterých se strany nemohou smluvně odchýlit (zákaz je obvykle vyjádřen slovy „nelze ujednat jinak" nebo plyne z povahy předpisu). Dispozitivní ustanovení se uplatní pouze tehdy, pokud si strany neujednaly něco jiného. U nájmu bytu nebo spotřebitelských smluv je výrazně více kogentních pravidel.',
    legalReference: '§ 1 odst. 2 zákona č. 89/2012 Sb.',
  },
  {
    slug: 'pisemna-forma',
    term: 'Písemná forma',
    category: 'obecne',
    definition:
      'Právní jednání je v písemné formě, pokud je provedeno listinou s podpisem jednající osoby. Některá právní jednání vyžadují písemnou formu pod sankcí neplatnosti (např. prodej nemovitosti). Elektronický podpis za stanovených podmínek písemnou formu nahrazuje.',
    legalReference: '§ 559–562 zákona č. 89/2012 Sb.; zákon č. 297/2016 Sb. o službách vytvářejících důvěru',
  },
  {
    slug: 'odstoupeni-od-smlouvy',
    term: 'Odstoupení od smlouvy',
    category: 'obecne',
    definition:
      'Jednostranné právní jednání, kterým strana ruší smlouvu se zpětnými účinky. Lze odstoupit, pokud to zákon nebo smlouva umožňuje — typicky při podstatném porušení smlouvy druhou stranou. U spotřebitelských smluv uzavřených na dálku má spotřebitel zákonné právo odstoupit ve 14denní lhůtě bez udání důvodu.',
    legalReference: '§ 2001–2005 zákona č. 89/2012 Sb.; § 1829 OZ (spotřebitel)',
  },
] as const;

export function getGlossaryEntry(slug: string): GlossaryEntry | null {
  return GLOSSARY.find((entry) => entry.slug === slug) ?? null;
}
