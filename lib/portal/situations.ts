import type { PortalSituationKey } from '@/lib/analytics';

/**
 * Informační architektura SmlouvaHned 2.0 — „Co právě řešíte?“.
 *
 * Situace je vstup podle životní nebo podnikatelské potřeby. Každá vede na
 * hub (odpověď + rozhodnutí), na dokumenty (generátor), na bezplatné nástroje
 * a u zakázky dál na případ. Přímá cesta „Vím, jaký dokument potřebuji“
 * zůstává zachována přes katalog dokumentů.
 */

export const PORTAL_AREAS = [
  { key: 'bydleni', label: 'Bydlení' },
  { key: 'auto', label: 'Auto' },
  { key: 'prace', label: 'Práce a zaměstnávání' },
  { key: 'podnikani', label: 'Podnikání a zakázky' },
  { key: 'penize', label: 'Peníze a dluhy' },
  { key: 'majetek', label: 'Majetek' },
  { key: 'legislativa', label: 'Změny v legislativě' },
] as const;
export type PortalAreaKey = (typeof PORTAL_AREAS)[number]['key'];

export type PortalLink = { href: string; label: string; note?: string };

export type PortalSituation = {
  key: PortalSituationKey;
  area: PortalAreaKey;
  /** Formulace v první osobě pro rozcestník. */
  label: string;
  title: string;
  description: string;
  hubHref: string;
  /** Hlavní CTA vždy znamená skutečnou akci. */
  primaryCta: PortalLink;
  secondaryCta?: PortalLink;
  documents: readonly PortalLink[];
  tools: readonly PortalLink[];
  articles: readonly PortalLink[];
  /** Situace, kde existuje navazující case flow. */
  caseFlow?: { label: string; href: string };
};

export const PORTAL_SITUATIONS: readonly PortalSituation[] = [
  {
    key: 'zakazka',
    area: 'podnikani',
    label: 'Řeším zakázku',
    title: 'Zakázka od smlouvy po předání',
    description:
      'Smlouva o dílo, vícepráce, změny rozsahu, předání a vady — jeden průběh s dokumenty, termíny a připomínkami.',
    hubHref: '/zakazka',
    primaryCta: { href: '/smlouva-o-dilo', label: 'Začít zakázku' },
    secondaryCta: { href: '/zakazka', label: 'Jak zakázka probíhá' },
    documents: [
      { href: '/smlouva-o-dilo', label: 'Smlouva o dílo' },
      { href: '/balicek-zakazka', label: 'Zakázka Plus — celá dokumentace' },
      { href: '/spoluprace', label: 'Smlouva o spolupráci' },
    ],
    tools: [
      { href: '/nastroje/checklist-pred-smlouvou-o-dilo', label: 'Checklist před smlouvou o dílo' },
      { href: '/nastroje/checklist-predani-zakazky', label: 'Checklist předání zakázky' },
      { href: '/nastroje/pruvodce-vicepracemi', label: 'Průvodce vícepracemi' },
      { href: '/nastroje/podklady-k-zakazce', label: 'Seznam podkladů k zakázce' },
    ],
    articles: [
      { href: '/zakazka/smlouva-s-remeslnikem', label: 'Smlouva s řemeslníkem — co si ohlídat' },
      { href: '/zakazka/remeslnik-nedodrzel-termin', label: 'Co dělat, když řemeslník nedodrží termín' },
      { href: '/zakazka/reklamace-dila', label: 'Reklamace díla a vady po předání' },
      { href: '/zakazka/zaloha-remeslnikovi', label: 'Záloha řemeslníkovi — kolik a jak' },
      { href: '/zakazka/viceprace-bez-souhlasu', label: 'Vícepráce bez souhlasu' },
      { href: '/zakazka/jak-potvrdit-viceprace', label: 'Jak potvrdit vícepráce' },
      { href: '/zakazka/zmena-ceny-dila', label: 'Změna ceny díla' },
      { href: '/zakazka/predavaci-protokol-stavby', label: 'Předávací protokol stavby' },
      { href: '/zakazka/prevzeti-dila-s-vadami', label: 'Převzetí díla s vadami' },
      { href: '/zakazka/odpovednost-za-vady-dila', label: 'Odpovědnost za vady díla' },
      { href: '/zakazka/odstoupeni-od-smlouvy-o-dilo', label: 'Odstoupení od smlouvy o dílo' },
    ],
    caseFlow: { label: 'Pokračovat jako zakázka s termíny a připomínkami', href: '/zakazka#moje-zakazka' },
  },
  {
    key: 'zamestnavam',
    area: 'prace',
    label: 'Zaměstnávám',
    title: 'Zaměstnávám — jaký vztah a jaké dokumenty',
    description:
      'Pracovní smlouva, DPP, spolupráce s OSVČ, mlčenlivost, změna podmínek i ukončení. Rozhodovací průvodce místo paragrafů.',
    hubHref: '/zamestnavam',
    primaryCta: { href: '/zamestnavam', label: 'Vyřešit zaměstnávání' },
    secondaryCta: { href: '/nastroje/jaky-vztah-potrebuji', label: 'Jaký vztah potřebuji?' },
    documents: [
      { href: '/pracovni', label: 'Pracovní smlouva' },
      { href: '/dpp', label: 'Dohoda o provedení práce' },
      { href: '/balicek-zamestnavatel', label: 'Zaměstnavatel Start 2026' },
      { href: '/nda', label: 'Smlouva o mlčenlivosti' },
    ],
    tools: [
      { href: '/nastroje/jaky-vztah-potrebuji', label: 'Průvodce: Jaký vztah potřebuji?' },
      { href: '/nastroje/dpp-vs-pracovni-smlouva', label: 'DPP vs. pracovní smlouva' },
      { href: '/nastroje/checklist-nastupu-zamestnance', label: 'Checklist nástupu zaměstnance' },
      { href: '/nastroje/kontrola-pripravenosti-2027', label: 'Kontrola připravenosti na změny 2027' },
    ],
    articles: [
      { href: '/zamestnavam/pracovni-smlouva', label: 'Pracovní smlouva — kdy a jak' },
      { href: '/zamestnavam/dpp', label: 'DPP — limity a povinnosti' },
      { href: '/zamestnavam/osvc', label: 'Spolupráce s OSVČ bez švarcsystému' },
      { href: '/zamestnavam/ukonceni', label: 'Ukončení pracovního poměru' },
      { href: '/zamestnavam/pracovni-smlouva-2027', label: 'Pracovní smlouva 2027' },
      { href: '/zamestnavam/dpp-2027', label: 'DPP 2027' },
      { href: '/zamestnavam/nastup-zamestnance', label: 'Nástup zaměstnance' },
      { href: '/zamestnavam/dohoda-o-skonceni-pracovniho-pomeru', label: 'Dohoda o skončení pracovního poměru' },
    ],
  },
  {
    key: 'pronajimam',
    area: 'bydleni',
    label: 'Pronajímám',
    title: 'Pronájem bytu nebo domu',
    description:
      'Nájemní smlouva, předání bytu, kauce, zvýšení nájemného, prodloužení i ukončení nájmu — celý průběh pronájmu.',
    hubHref: '/pro-pronajimatele',
    primaryCta: { href: '/najem', label: 'Vytvořit nájemní smlouvu' },
    secondaryCta: { href: '/pro-pronajimatele', label: 'Řešení pro pronajímatele' },
    documents: [
      { href: '/najem', label: 'Nájemní smlouva' },
      { href: '/balicek-pronajimatel', label: 'Balíček pro pronajímatele' },
      { href: '/podnajem', label: 'Podnájemní smlouva' },
    ],
    tools: [
      { href: '/nastroje/checklist-uzavreni-najmu', label: 'Checklist uzavření nájmu' },
      { href: '/nastroje/checklist-predani-bytu', label: 'Checklist předání bytu' },
      { href: '/nastroje/checklist-ukonceni-najmu', label: 'Checklist ukončení nájmu' },
    ],
    articles: [
      { href: '/blog/kauce-pronajem-bytu-2026', label: 'Kauce při pronájmu' },
      { href: '/blog/valorizace-najemneho-2026', label: 'Zvýšení nájemného' },
      { href: '/blog/vypoved-z-najmu-bytu-2026', label: 'Výpověď z nájmu' },
      { href: '/pro-pronajimatele/neplaceni-najemneho', label: 'Nájemce neplatí nájem' },
    ],
  },
  {
    key: 'auto',
    area: 'auto',
    label: 'Prodávám nebo kupuji auto',
    title: 'Prodej a koupě auta s jasnými pravidly',
    description:
      'Kupní smlouva na vozidlo, předání, přepis a vady ojetého auta — co potřebujete a v jakém pořadí.',
    hubHref: '/prodej-vozidla',
    primaryCta: { href: '/auto', label: 'Vytvořit kupní smlouvu na auto' },
    secondaryCta: { href: '/prodej-vozidla', label: 'Jak prodej auta probíhá' },
    documents: [
      { href: '/auto', label: 'Kupní smlouva na vozidlo' },
      { href: '/balicek-prodej-vozidla', label: 'Balíček pro prodej vozidla' },
      { href: '/plna-moc', label: 'Plná moc k přepisu' },
    ],
    tools: [
      { href: '/nastroje/checklist-prodeje-auta', label: 'Checklist prodeje auta' },
      { href: '/nastroje/checklist-koupe-auta', label: 'Checklist koupě auta' },
      { href: '/nastroje/prepis-vozidla-co-potrebuji', label: 'Přepis vozidla — co potřebuji' },
    ],
    articles: [
      { href: '/prodej-vozidla/postup-prodeje-auta', label: 'Prodej auta krok za krokem' },
      { href: '/prodej-vozidla/koupe-ojeteho-auta', label: 'Koupě ojetého auta' },
      { href: '/prodej-vozidla/vady-ojeteho-auta', label: 'Vady ojetého auta' },
      { href: '/prodej-vozidla/skryta-vada-auta', label: 'Skrytá vada auta' },
      { href: '/prodej-vozidla/odpovednost-prodavajiciho-za-vady', label: 'Odpovědnost prodávajícího za vady' },
      { href: '/prodej-vozidla/plna-moc-prepis-auta', label: 'Plná moc k přepisu auta' },
      { href: '/blog/prepis-vozidla-2026', label: 'Přepis vozidla 2026' },
      { href: '/blog/predani-vozidla-kupujicimu-2026', label: 'Předání vozidla kupujícímu' },
    ],
  },
  {
    key: 'pujcuji',
    area: 'penize',
    label: 'Půjčuji peníze',
    title: 'Půjčka mezi lidmi a uznání dluhu',
    description:
      'Smlouva o zápůjčce, splátkový kalendář, úrok z prodlení a uznání dluhu, když už dluh existuje.',
    hubHref: '/pujcka-smlouva',
    primaryCta: { href: '/pujcka', label: 'Vytvořit smlouvu o zápůjčce' },
    secondaryCta: { href: '/uznani-dluhu', label: 'Uznání dluhu' },
    documents: [
      { href: '/pujcka', label: 'Smlouva o zápůjčce' },
      { href: '/uznani-dluhu', label: 'Uznání dluhu' },
    ],
    tools: [],
    articles: [
      { href: '/blog/smlouva-o-zapujcce-2026', label: 'Smlouva o zápůjčce 2026' },
      { href: '/blog/uznani-dluhu-2026', label: 'Uznání dluhu' },
      { href: '/blog/urok-z-prodleni-2026', label: 'Úrok z prodlení' },
    ],
  },
  {
    key: 'majetek',
    area: 'majetek',
    label: 'Daruji nebo převádím majetek',
    title: 'Darování a převod movitých věcí',
    description:
      'Darovací smlouva, kupní smlouva na movitou věc a plná moc pro zastoupení při převodu.',
    hubHref: '/darovaci-smlouva',
    primaryCta: { href: '/darovaci', label: 'Vytvořit darovací smlouvu' },
    secondaryCta: { href: '/kupni', label: 'Kupní smlouva' },
    documents: [
      { href: '/darovaci', label: 'Darovací smlouva' },
      { href: '/kupni', label: 'Kupní smlouva' },
      { href: '/plna-moc', label: 'Plná moc' },
    ],
    tools: [],
    articles: [
      { href: '/blog/darovaci-smlouva-2026', label: 'Darovací smlouva 2026' },
      { href: '/blog/kupni-smlouva-movita-vec', label: 'Kupní smlouva na movitou věc' },
      { href: '/blog/plna-moc-2026', label: 'Plná moc 2026' },
    ],
  },
  {
    key: 'zmeny-2027',
    area: 'legislativa',
    label: 'Sleduji změny zákonů',
    title: 'Legislativní radar 2027',
    description:
      'Co platí, co je schválené a co se teprve projednává — pro zaměstnavatele, OSVČ, spotřebitele, řidiče a smlouvy online.',
    hubHref: '/zmeny-2027',
    primaryCta: { href: '/zmeny-2027', label: 'Otevřít radar 2027' },
    documents: [],
    tools: [{ href: '/nastroje/kontrola-pripravenosti-2027', label: 'Kontrola připravenosti na změny 2027' }],
    articles: [],
  },
];

export function getPortalSituation(key: PortalSituationKey): PortalSituation {
  const situation = PORTAL_SITUATIONS.find((item) => item.key === key);
  if (!situation) throw new Error(`Unknown portal situation: ${key}`);
  return situation;
}

/** Primární rozcestník homepage — bez radaru, ten má vlastní sekci. */
export const HOMEPAGE_SITUATIONS = PORTAL_SITUATIONS.filter((situation) => situation.key !== 'zmeny-2027');
