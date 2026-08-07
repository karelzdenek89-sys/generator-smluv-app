/** Czech SEO copy and FAQ for /najem builder — shared between layout schema and landing UI. */

export type LeaseSeoFaqItem = { q: string; a: string };

export const LEASE_CS_LANDING_FAQ: readonly LeaseSeoFaqItem[] = [
  {
    q: 'Co je rozdíl mezi nájemní a podnájemní smlouvou?',
    a: 'Nájemní smlouva se uzavírá přímo s vlastníkem nemovitosti. Podnájemní smlouva se používá, pokud nájemce dál pronajímá byt nebo jeho část — zpravidla se souhlasem pronajímatele.',
  },
  {
    q: 'Je nutná písemná nájemní smlouva?',
    a: 'U nájmu bytu nebo domu zákon vyžaduje písemnou formu. Písemné znění pomáhá oběma stranám přehledně zachytit nájemné, kauci, služby i pravidla užívání.',
  },
  {
    q: 'Jak vysoká může být kauce?',
    a: 'Podle § 2254 OZ nesmí jistota a právo na smluvní pokutu v souhrnu přesáhnout trojnásobek měsíčního nájemného. Po skončení nájmu má pronajímatel jistotu vrátit, případně započíst řádně specifikované dluhy nájemce.',
  },
  {
    q: 'Jaký je rozdíl mezi nájmem na dobu určitou a neurčitou?',
    a: 'U nájmu na dobu určitou nájem zpravidla končí uplynutím sjednané doby, pokud strany nedohodnou prodloužení. U nájmu na dobu neurčitou platí výpovědní pravidla dle zákona — u bytu zpravidla tříměsíční výpovědní lhůta.',
  },
  {
    q: 'Potřebuji předávací protokol k nájemní smlouvě?',
    a: 'Zákon ho jako samostatný dokument nevyžaduje, ale v praxi výrazně snižuje riziko sporů o stav bytu, měřidla a klíče. Dává smysl ho mít při podpisu nebo při předání bytu.',
  },
  {
    q: 'Dostanu dokument ihned po zaplacení?',
    a: 'Ano. PDF je k dispozici ke stažení po dokončení platby. Editovatelný formát DOCX lze volitelně přidat v checkoutu.',
  },
  {
    q: 'Musí smlouvu ověřit notář?',
    a: 'U běžného pronájmu bytu nebo domu notářské ověření není vyžadováno. Postačí podpisy obou stran na stejném znění dokumentu.',
  },
  {
    q: 'Nahrazuje generátor právní poradenství?',
    a: 'Ne. Výstup je standardizovaný dokument podle vámi zadaných údajů. U nestandardních situací, sporů nebo složitějších ujednání je vhodné obrátit se na advokáta.',
  },
];

export type LeaseSeoSection = {
  id: string;
  title: string;
  paragraphs: string[];
  links?: { href: string; label: string }[];
};

export const LEASE_CS_SEO_SECTIONS: readonly LeaseSeoSection[] = [
  {
    id: 'kdy-pouzit',
    title: 'Kdy použít nájemní smlouvu',
    paragraphs: [
      'Nájemní smlouva dává smysl, když pronajímáte byt, dům nebo jeho část jiné osobě a chcete mít písemně zachycené podmínky nájmu. Typicky ji uzavírá vlastník nemovitosti s nájemcem — ať už jde o dlouhodobý pronájem, pronájem pokoje nebo pronájem na dobu určitou.',
      'Písemná forma je u nájmu bytu nebo domu zákonným standardem. Pomáhá předejít nejasnostem ohledně výše nájemného, záloh na služby, kauce, pravidel užívání i ukončení nájmu.',
    ],
  },
  {
    id: 'co-obsahovat',
    title: 'Co musí nájemní smlouva obsahovat',
    paragraphs: [
      'V praxi by smlouva měla jasně identifikovat pronajímatele a nájemce, popsat pronajímaný byt nebo dům, uvést výši nájemného a způsob platby, rozlišit vlastní nájemné a zálohy na služby a zachytit výši jistoty (kauce).',
      'Dále je vhodné mít v dokumentu dobu nájmu, pravidla užívání (např. domácí zvířata, kouření, podnájem), stav při předání a základní ustanovení o ukončení nájmu.',
    ],
    links: [
      { href: '/blog/najemni-smlouva-vzor-2026', label: 'Co musí obsahovat nájemní smlouva — podrobný přehled' },
      { href: '/blog/najem-na-dobu-urcitou-neurcitou-2026', label: 'Nájem na dobu určitou, nebo neurčitou' },
    ],
  },
  {
    id: 'doba-urcita-neurcita',
    title: 'Nájemní smlouva na dobu určitou vs. neurčitou',
    paragraphs: [
      'U nájmu na dobu určitou strany sjednají konec nájmu konkrétním datem. Po jeho uplynutí nájem zpravidla končí, pokud se strany nedohodnou na prodloužení nebo nové smlouvě.',
      'U nájmu na dobu neurčitou platí zákonná pravidla výpovědi. Nájemce může vypovědět bez udání důvodu; pronajímatel jen ze zákonných důvodů. U bytu bývá výpovědní lhůta tři měsíce — přesné podmínky závisí na konkrétní situaci a znění smlouvy.',
    ],
  },
  {
    id: 'najemne-kauce',
    title: 'Nájemné, služby a kauce',
    paragraphs: [
      'Nájemné a zálohy na služby (voda, teplo, elektřina ve společných prostorách apod.) je praktické v smlouvě oddělit. Ujasní to, co je samotné nájemné a co se vyúčtovává zvlášť.',
      'Jistota (kauce) nesmí přesáhnout trojnásobek měsíčního nájemného. Ve smlouvě by mělo být uvedeno, za jakých podmínek se vrací a z čeho lze případně započítat nedoplatky. O vrácení kauce a potvrzení o jejím převzetí píšeme v samostatném článku.',
    ],
    links: [
      { href: '/blog/kauce-pronajem-bytu-2026', label: 'Kauce při pronájmu bytu — praktický průvodce' },
    ],
  },
  {
    id: 'predavaci-protokol',
    title: 'Předávací protokol k nájmu',
    paragraphs: [
      'Předávací protokol zachycuje faktický stav bytu při předání — odečty měřidel, předané klíče, vybavení a viditelné závady. Není náhradou nájemní smlouvy, ale doplňuje ji tam, kde smlouva sama o sobě nestačí prokázat, v jakém stavu byl byt předán.',
      'U nového pronájmu dává smysl protokol sepísat při předání bytu a nechat podepsat obě strany. Více o tom, co do protokolu zapsat, najdete v článku o předání bytu nájemci.',
    ],
    links: [
      { href: '/blog/predani-bytu-najemci-2026', label: 'Jak správně předat byt nájemci' },
    ],
  },
  {
    id: 'vypoved',
    title: 'Výpověď z nájmu',
    paragraphs: [
      'Ukončení nájmu se řídí tím, zda jde o nájem na dobu určitou nebo neurčitou, kdo dává výpověď a z jakého důvodu. Výpověď musí být písemná a dodržet zákonnou nebo smluvní výpovědní lhůtu.',
      'Podmínky ukončení je vhodné mít v nájemní smlouvě nastavené předem — sníží to riziko sporů o platnost výpovědi nebo termín skončení nájmu. Přehled základních pravidel najdete v článku o výpovědi z nájmu bytu.',
    ],
    links: [
      { href: '/blog/vypoved-z-najmu-bytu-2026', label: 'Výpověď z nájmu bytu — lhůty a důvody' },
    ],
  },
  {
    id: 'caste-chyby',
    title: 'Nejčastější chyby v nájemní smlouvě',
    paragraphs: [
      'Mezi časté chyby patří nejasné rozlišení nájemného a záloh, chybějící nebo příliš vysoká kauce, neurčité pravidlo pro zvýšení nájmu, absence předávacího protokolu a vágní ustanovení o ukončení nájmu.',
      'U pronájmu v roce 2026 často řešíte i valorizační doložku nebo způsob, jak ve smlouvě promítnout růst nákladů na energie. I zde platí, že čím přesnější je znění, tím méně prostoru zůstává pro pozdější neshody.',
    ],
    links: [
      { href: '/blog/valorizace-najemneho-2026', label: 'Valorizace nájemného ve smlouvě' },
    ],
  },
];

export const LEASE_CS_GUIDE_LINKS = [
  { href: '/blog/najemni-smlouva-vzor-2026', label: 'Vzor a obsah nájemní smlouvy 2026' },
  { href: '/blog/kauce-pronajem-bytu-2026', label: 'Kauce při pronájmu' },
  { href: '/blog/predani-bytu-najemci-2026', label: 'Předání bytu a protokol' },
  { href: '/blog/vypoved-z-najmu-bytu-2026', label: 'Výpověď z nájmu' },
  { href: '/blog/valorizace-najemneho-2026', label: 'Valorizace nájemného' },
] as const;
