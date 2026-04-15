export type BlogClusterKey = 'landlord' | 'vehicle' | 'general';

export type BlogArticleMeta = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  cluster: BlogClusterKey;
  href: string;
};

export type BlogClusterMeta = {
  key: Exclude<BlogClusterKey, 'general'>;
  title: string;
  description: string;
  situationHref: string;
  packageHref: string;
  packageLabel: string;
};

export const BLOG_ARTICLES: readonly BlogArticleMeta[] = [
  {
    slug: 'vypoved-z-najmu-bytu-2026',
    title: 'Výpověď z nájmu bytu: výpovědní lhůty, důvody a forma',
    excerpt:
      'Kdy a jak může pronajímatel nebo nájemce ukončit nájem výpovědí. Zákonné důvody, tříměsíční lhůta a co mít v nájemní smlouvě předem ošetřeno.',
    category: 'Bydlení',
    readTime: '7 min',
    date: '15. dubna 2026',
    cluster: 'landlord',
    href: '/blog/vypoved-z-najmu-bytu-2026',
  },
  {
    slug: 'dpp-dpc-porovnani-2026',
    title: 'DPP nebo DPČ: přehled rozdílů, limitů a kdy co použít',
    excerpt:
      'Srovnání dohody o provedení práce a dohody o pracovní činnosti — hodinové limity, limity pro odvody a kdy která dohoda dává smysl.',
    category: 'Práce a zaměstnání',
    readTime: '6 min',
    date: '15. dubna 2026',
    cluster: 'general',
    href: '/blog/dpp-dpc-porovnani-2026',
  },
  {
    slug: 'smlouva-o-dilo-cena-a-platby',
    title: 'Smlouva o dílo: jak zachytit cenu, zálohy a platební podmínky',
    excerpt:
      'Pevná cena nebo položkový rozpočet, zálohy, platební milníky a vícepráce. Co ve smlouvě o dílo písemně sjednat, aby platby fungovaly v praxi.',
    category: 'Podnikání a zakázky',
    readTime: '7 min',
    date: '15. dubna 2026',
    cluster: 'general',
    href: '/blog/smlouva-o-dilo-cena-a-platby',
  },
  {
    slug: 'predani-bytu-najemci-2026',
    title: 'Jak správně předat byt nájemci: Co zachytit v protokolu a na co nezapomenout',
    excerpt:
      'Přehledný postup pro předání bytu nájemci, odečty měřidel, stav vybavení, klíče a praktické body, které je vhodné písemně potvrdit.',
    category: 'Bydlení',
    readTime: '7 min',
    date: '6. dubna 2026',
    cluster: 'landlord',
    href: '/blog/predani-bytu-najemci-2026',
  },
  {
    slug: 'kauce-pronajem-bytu-2026',
    title: 'Kauce při pronájmu bytu 2026: Jak ji správně sjednat a potvrdit',
    excerpt:
      'Kdy se používá jistota, co je vhodné uvést do smlouvy, jak řešit převzetí kauce a kdy ji po skončení nájmu vracet.',
    category: 'Bydlení',
    readTime: '7 min',
    date: '6. dubna 2026',
    cluster: 'landlord',
    href: '/blog/kauce-pronajem-bytu-2026',
  },
  {
    slug: 'chyby-pri-pronajmu-bytu-2026',
    title: 'Nejčastější chyby při pronájmu bytu: Na co si dát pozor před podpisem',
    excerpt:
      'Shrnutí nejčastějších pochybení při pronájmu bytu, od nejasné kauce po chybějící předávací protokol a nepřesná pravidla užívání.',
    category: 'Bydlení',
    readTime: '8 min',
    date: '6. dubna 2026',
    cluster: 'landlord',
    href: '/blog/chyby-pri-pronajmu-bytu-2026',
  },
  {
    slug: 'najemni-smlouva-vzor-2026',
    title: 'Nájemní smlouva 2026: Co musí obsahovat a jak se vyhnout běžným chybám',
    excerpt:
      'Co do nájemní smlouvy patří, kdy řešit kauci, služby, předání bytu a pravidla užívání.',
    category: 'Bydlení',
    readTime: '8 min',
    date: '1. března 2026',
    cluster: 'landlord',
    href: '/blog/najemni-smlouva-vzor-2026',
  },
  {
    slug: 'predani-vozidla-kupujicimu-2026',
    title: 'Jak správně předat vozidlo kupujícímu: Protokol, klíče, doklady a stav vozu',
    excerpt:
      'Praktický přehled toho, co si při předání vozidla písemně potvrdit a jak předejít sporům o stav vozu nebo rozsah předaných dokladů.',
    category: 'Vozidla',
    readTime: '7 min',
    date: '6. dubna 2026',
    cluster: 'vehicle',
    href: '/blog/predani-vozidla-kupujicimu-2026',
  },
  {
    slug: 'doklady-pri-prodeji-auta-2026',
    title: 'Jaké doklady předat při prodeji auta: Přehled pro běžný převod vozidla',
    excerpt:
      'Co bývá vhodné předat spolu s vozidlem, jak pracovat s technickými doklady a jak předejít nedorozumění po podpisu smlouvy.',
    category: 'Vozidla',
    readTime: '6 min',
    date: '6. dubna 2026',
    cluster: 'vehicle',
    href: '/blog/doklady-pri-prodeji-auta-2026',
  },
  {
    slug: 'prepis-vozidla-2026',
    title: 'Přepis vozidla 2026: Na co si dát pozor po podpisu kupní smlouvy',
    excerpt:
      'Co řešit po podpisu kupní smlouvy na vozidlo, jaké kroky následují při přepisu a proč je vhodné mít předání i doklady zachycené písemně.',
    category: 'Vozidla',
    readTime: '7 min',
    date: '6. dubna 2026',
    cluster: 'vehicle',
    href: '/blog/prepis-vozidla-2026',
  },
  {
    slug: 'kupni-smlouva-na-auto-2026',
    title: 'Kupní smlouva na auto 2026: Co musí obsahovat a na co si dát pozor',
    excerpt:
      'VIN, stav tachometru, známé vady, předání vozidla a další údaje, které mají být zachyceny písemně.',
    category: 'Vozidla',
    readTime: '9 min',
    date: '5. března 2026',
    cluster: 'vehicle',
    href: '/blog/kupni-smlouva-na-auto-2026',
  },
  {
    slug: 'uznani-dluhu-2026',
    title: 'Uznání dluhu 2026: Co to je, co musí obsahovat a proč je důležité',
    excerpt:
      'Co je uznání dluhu, jak ovlivňuje promlčení a kdy dává smysl mít ho sepsané písemně.',
    category: 'Osobní a finanční',
    readTime: '7 min',
    date: '2. dubna 2026',
    cluster: 'general',
    href: '/blog/uznani-dluhu-2026',
  },
  {
    slug: 'smlouva-o-sluzbach-2026',
    title: 'Smlouva o poskytování služeb 2026: Vzor, náležitosti a praktické použití',
    excerpt:
      'Kdy použít smlouvu o službách, jak vymezit cenu, odpovědnost a průběžné plnění.',
    category: 'Podnikání a OSVČ',
    readTime: '8 min',
    date: '2. dubna 2026',
    cluster: 'general',
    href: '/blog/smlouva-o-sluzbach-2026',
  },
  {
    slug: 'plna-moc-2026',
    title: 'Plná moc 2026: Kdy ji potřebujete a co musí obsahovat',
    excerpt:
      'Kdy stačí prostá písemná forma, kdy je vhodný ověřený podpis a jak plnou moc přesně vymezit.',
    category: 'Osobní a právní',
    readTime: '7 min',
    date: '2. dubna 2026',
    cluster: 'general',
    href: '/blog/plna-moc-2026',
  },
  {
    slug: 'podnajemni-smlouva-2026',
    title: 'Podnájemní smlouva 2026: Co musí obsahovat a kdy je potřeba souhlas pronajímatele',
    excerpt:
      'Praktické vysvětlení rozdílu mezi nájmem a podnájmem a jak správně vymezit podmínky užívání bytu.',
    category: 'Bydlení',
    readTime: '8 min',
    date: '2. dubna 2026',
    cluster: 'general',
    href: '/blog/podnajemni-smlouva-2026',
  },
  {
    slug: 'smlouva-o-zapujcce-2026',
    title: 'Smlouva o zápůjčce 2026: Vzor, náležitosti a jak ji nastavit přehledně',
    excerpt:
      'Jak správně zachytit půjčku peněz, splátky, úrok a podmínky vrácení.',
    category: 'Osobní a finanční',
    readTime: '8 min',
    date: '28. března 2026',
    cluster: 'general',
    href: '/blog/smlouva-o-zapujcce-2026',
  },
  {
    slug: 'darovaci-smlouva-2026',
    title: 'Darovací smlouva 2026: Co musí obsahovat a kdy ji sepsat písemně',
    excerpt:
      'Kdy darovací smlouvu uzavřít písemně, jak popsat předmět daru a proč je vhodné řešit předání a případná omezení.',
    category: 'Osobní a majetkové',
    readTime: '7 min',
    date: '20. března 2026',
    cluster: 'general',
    href: '/blog/darovaci-smlouva-2026',
  },
  {
    slug: 'dpp-dohoda-provedeni-prace',
    title: 'DPP 2026: Kdy použít dohodu o provedení práce a co má obsahovat',
    excerpt:
      'Praktický přehled, kdy je dohoda o provedení práce vhodná, jak nastavit odměnu a na co si dát pozor.',
    category: 'Práce a zaměstnání',
    readTime: '7 min',
    date: '18. března 2026',
    cluster: 'general',
    href: '/blog/dpp-dohoda-provedeni-prace',
  },
  {
    slug: 'kupni-smlouva-movita-vec',
    title: 'Kupní smlouva na movitou věc: Kdy stačí obecná kupní smlouva a co má obsahovat',
    excerpt:
      'Jak pracovat s obecnou kupní smlouvou na movitou věc, kdy stačí jednoduché řešení a kdy je vhodné jít do detailnější úpravy.',
    category: 'Osobní a majetkové',
    readTime: '7 min',
    date: '17. března 2026',
    cluster: 'general',
    href: '/blog/kupni-smlouva-movita-vec',
  },
  {
    slug: 'nda-smlouva-mlcenlivost',
    title: 'NDA a smlouva o mlčenlivosti 2026: Kdy ji použít a co má obsahovat',
    excerpt:
      'Kdy má smysl NDA, jak vymezit důvěrné informace a proč nestačí jen obecná domluva o mlčenlivosti.',
    category: 'Podnikání a spolupráce',
    readTime: '7 min',
    date: '14. března 2026',
    cluster: 'general',
    href: '/blog/nda-smlouva-mlcenlivost',
  },
  {
    slug: 'pracovni-smlouva-2026',
    title: 'Pracovní smlouva 2026: Co musí obsahovat a jak ji nastavit přehledně',
    excerpt:
      'Základní náležitosti pracovní smlouvy, jak vymezit druh práce, místo výkonu a den nástupu.',
    category: 'Práce a zaměstnání',
    readTime: '8 min',
    date: '12. března 2026',
    cluster: 'general',
    href: '/blog/pracovni-smlouva-2026',
  },
  {
    slug: 'smlouva-o-dilo-2026',
    title: 'Smlouva o dílo 2026: Kdy ji použít a jak popsat předmět díla',
    excerpt:
      'Jak přesně vymezit dílo, cenu, termíny a předání tak, aby smlouva fungovala i v běžné praxi.',
    category: 'Podnikání a zakázky',
    readTime: '8 min',
    date: '10. března 2026',
    cluster: 'general',
    href: '/blog/smlouva-o-dilo-2026',
  },
  {
    slug: 'smlouva-o-spolupraci-2026',
    title: 'Smlouva o spolupráci 2026: Jak ji nastavit přehledně a prakticky',
    excerpt:
      'Co ve smlouvě o spolupráci vymezit, jak pracovat s odměnou, odpovědností a průběhem spolupráce.',
    category: 'Podnikání a spolupráce',
    readTime: '8 min',
    date: '9. března 2026',
    cluster: 'general',
    href: '/blog/smlouva-o-spolupraci-2026',
  },
] as const;

export const BLOG_CLUSTERS: readonly BlogClusterMeta[] = [
  {
    key: 'landlord',
    title: 'Pronájem a podklady pro pronajímatele',
    description:
      'Články k nájemní smlouvě, předání bytu, kauci a nejčastějším chybám při standardním pronájmu.',
    situationHref: '/pro-pronajimatele',
    packageHref: '/balicek-pronajimatel',
    packageLabel: 'Balíček pro pronajímatele',
  },
  {
    key: 'vehicle',
    title: 'Prodej vozidla a předání auta',
    description:
      'Články ke kupní smlouvě na vozidlo, předání auta, dokladům a krokům po podpisu smlouvy.',
    situationHref: '/prodej-vozidla',
    packageHref: '/balicek-prodej-vozidla',
    packageLabel: 'Balíček pro prodej vozidla',
  },
] as const;

export function getBlogArticleBySlug(slug: string) {
  return BLOG_ARTICLES.find((article) => article.slug === slug) ?? null;
}
