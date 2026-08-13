import { EXPAT_BLOG_META } from '@/lib/i18n/expat-blog-articles';

export type BlogClusterKey = 'landlord' | 'vehicle' | 'general' | 'expat';

export type BlogAudience = 'cs' | 'en' | 'ua';

export type BlogArticleMeta = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  cluster: BlogClusterKey;
  href: string;
  /** Expat guides: en / ua. Czech articles omit this field. */
  audience?: BlogAudience;
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
    slug: 'dovolena-dpp-2026',
    title: 'Dovolená u DPP 2026: nárok, 80 hodin a výpočet',
    excerpt:
      'Kdy u dohody o provedení práce vzniká dovolená, proč rozhoduje 28 dní a 80 hodin a jak se nárok počítá z fiktivní 20hodinové týdenní pracovní doby.',
    category: 'Práce a zaměstnání',
    readTime: '8 min',
    date: '13. srpna 2026',
    cluster: 'general',
    href: '/blog/dovolena-dpp-2026',
  },
  {
    slug: 'vypovedni-doba-pracovni-pomer-2026',
    title: 'Výpovědní doba 2026: kdy začíná a jak dlouho trvá',
    excerpt:
      'Výpovědní doba po flexinovele zpravidla běží už ode dne doručení. Přehled dvouměsíčního pravidla, jednoměsíčních výjimek a starších smluvních ujednání.',
    category: 'Práce a zaměstnání',
    readTime: '9 min',
    date: '13. srpna 2026',
    cluster: 'general',
    href: '/blog/vypovedni-doba-pracovni-pomer-2026',
  },
  {
    slug: 'trvaly-pobyt-v-najmu-2026',
    title: 'Trvalý pobyt v nájmu 2026: souhlas a pravidla pro cizince',
    excerpt:
      'Kdy českému nájemci stačí platná nájemní smlouva, proč zákaz trvalého pobytu neúčinkuje a jak se liší doklad o ubytování pro cizince.',
    category: 'Bydlení',
    readTime: '9 min',
    date: '13. srpna 2026',
    cluster: 'landlord',
    href: '/blog/trvaly-pobyt-v-najmu-2026',
  },
  {
    slug: 'vraceni-kauce-po-skonceni-najmu-2026',
    title: 'Vrácení kauce po skončení nájmu 2026: lhůty a úroky',
    excerpt:
      'Jistota (kauce) se vrací při skončení nájmu. Jaký platí limit, co si smí pronajímatel započíst, jak je to s úroky z jistoty a jak předejít sporům při vracení.',
    category: 'Bydlení',
    readTime: '8 min',
    date: '29. července 2026',
    cluster: 'landlord',
    href: '/blog/vraceni-kauce-po-skonceni-najmu-2026',
  },
  {
    slug: 'odstoupeni-od-smlouvy-2026',
    title: 'Odstoupení od smlouvy 2026: kdy lze a jaké má důsledky',
    excerpt:
      'Odstoupit lze jen ze zákona nebo z ujednání — obecné právo „vycouvat" ze smlouvy neexistuje. Jak se liší odstoupení, výpověď a dohoda a kdy platí 14denní lhůta.',
    category: 'Obecné a praktické',
    readTime: '9 min',
    date: '29. července 2026',
    cluster: 'general',
    href: '/blog/odstoupeni-od-smlouvy-2026',
  },
  {
    slug: 'urok-z-prodleni-2026',
    title: 'Úrok z prodlení 2026: výše, výpočet a nárok u faktury',
    excerpt:
      'Úrok z prodlení plyne ze zákona i bez ujednání. Jak se počítá podle repo sazby ČNB, jak se liší od smluvní pokuty a jaká je paušální náhrada nákladů.',
    category: 'Osobní a finanční',
    readTime: '8 min',
    date: '29. července 2026',
    cluster: 'general',
    href: '/blog/urok-z-prodleni-2026',
  },
  {
    slug: 'zkusebni-doba-2026',
    title: 'Zkušební doba 2026: 4 a 8 měsíců, prodloužení',
    excerpt:
      'Aktuální pravidla pro zkušební dobu po flexinovele zákoníku práce: kdy ji sjednat, jaké platí limity pro dobu určitou a kdy ji lze písemně prodloužit.',
    category: 'Práce a zaměstnání',
    readTime: '7 min',
    date: '9. července 2026',
    cluster: 'general',
    href: '/blog/zkusebni-doba-2026',
  },
  {
    slug: 'prodej-auta-prodavjici-2026',
    title: 'Prodej auta 2026: checklist pro prodávajícího',
    excerpt:
      'Co připravit před prodejem vozidla, co přesně zachytit v kupní smlouvě a předávacím protokolu a jak navázat na zápis změny vlastníka.',
    category: 'Vozidla',
    readTime: '8 min',
    date: '9. července 2026',
    cluster: 'vehicle',
    href: '/blog/prodej-auta-prodavjici-2026',
  },
  {
    slug: 'najem-na-dobu-urcitou-neurcitou-2026',
    title: 'Nájem na dobu určitou, nebo neurčitou 2026: co vybrat',
    excerpt:
      'Jak se liší nájem na dobu určitou a neurčitou, co uvést do smlouvy a na co myslet u prodloužení nebo budoucího ukončení nájmu.',
    category: 'Bydlení',
    readTime: '8 min',
    date: '9. července 2026',
    cluster: 'landlord',
    href: '/blog/najem-na-dobu-urcitou-neurcitou-2026',
  },
  {
    slug: 'proc-smlouvahned-misto-vzoru-2026',
    title: 'Proč zvolit SmlouvaHned místo staženého vzoru smlouvy (2026)',
    excerpt:
      'Srovnání staženého vzoru, generického generátoru a SmlouvaHned — paragrafy u klauzulí, upozornění ve formuláři, náhled před stažením PDF. Informativní průvodce pro rok 2026.',
    category: 'Obecné a praktické',
    readTime: '9 min',
    date: '1. července 2026',
    cluster: 'general',
    href: '/blog/proc-smlouvahned-misto-vzoru-2026',
  },
  {
    slug: 'predavaci-protokol-vzor-2026',
    title: 'Předávací protokol 2026: co musí obsahovat',
    excerpt:
      'Praktický průvodce předávacím protokolem při pronájmu bytu, prodeji auta nebo předání movité věci. Co zachytit písemně, aby nevznikl spor o stav nebo rozsah plnění.',
    category: 'Obecné a praktické',
    readTime: '8 min',
    date: '1. července 2026',
    cluster: 'general',
    href: '/blog/predavaci-protokol-vzor-2026',
  },
  {
    slug: 'smlouva-o-dilo-freelancer-2026',
    title: 'Smlouva o dílo pro freelancera 2026: ochrana a práva',
    excerpt:
      'Jak OSVČ nebo freelancer sestaví smlouvu o dílo tak, aby bylo jasné, co se dodává, kdy se platí, kdo vlastní výsledek a jak řešit vícepráce.',
    category: 'Podnikání a zakázky',
    readTime: '9 min',
    date: '1. července 2026',
    cluster: 'general',
    href: '/blog/smlouva-o-dilo-freelancer-2026',
  },
  {
    slug: 'smlouva-o-dilo-vs-dpp-2026',
    title: 'Smlouva o dílo, nebo DPP 2026: kdy co použít',
    excerpt:
      'Rozdíl mezi dohodou o provedení práce a smlouvou o dílo z pohledu OSVČ, zaměstnavatele i odběratele. Limity, rizika a praktická rozhodovací logika.',
    category: 'Práce a podnikání',
    readTime: '8 min',
    date: '1. července 2026',
    cluster: 'general',
    href: '/blog/smlouva-o-dilo-vs-dpp-2026',
  },
  {
    slug: 'kupni-smlouva-auto-kupujici-2026',
    title: 'Kupní smlouva na auto pro kupujícího 2026: na co pozor',
    excerpt:
      'Průvodce pro kupující ojetého nebo nového vozu — VIN, servisní historie, známé vady, předání dokladů a kroky po podpisu smlouvy.',
    category: 'Vozidla',
    readTime: '8 min',
    date: '1. července 2026',
    cluster: 'vehicle',
    href: '/blog/kupni-smlouva-auto-kupujici-2026',
  },
  {
    slug: 'smluvni-pokuta-vzor-2026',
    title: 'Smluvní pokuta 2026: jak ji sjednat a kdy je neplatná',
    excerpt:
      'Co je smluvní pokuta, jak se liší od náhrady škody, jak ji formulovat v nájemní nebo jiné smlouvě a jakým chybám se vyhnout.',
    category: 'Obecné a praktické',
    readTime: '7 min',
    date: '1. července 2026',
    cluster: 'general',
    href: '/blog/smluvni-pokuta-vzor-2026',
  },
  {
    slug: 'minimalni-mzda-dpp-pracovni-smlouva-2026',
    title: 'Minimální mzda 2026: 22 400 Kč, DPP a pracovní smlouva',
    excerpt:
      'Aktuální přehled minimální mzdy v roce 2026, dopadů na DPP a pracovní smlouvy a praktických bodů, které zkontrolovat před podpisem dokumentu.',
    category: 'Práce a zaměstnání',
    readTime: '7 min',
    date: '13. června 2026',
    cluster: 'general',
    href: '/blog/minimalni-mzda-dpp-pracovni-smlouva-2026',
  },
  {
    slug: 'prepis-auta-online-portal-dopravy-2026',
    title: 'Přepis auta online přes Portál dopravy 2026',
    excerpt:
      'Jak v roce 2026 navázat kupní smlouvu, předávací protokol a plnou moc na digitální žádost o změnu vlastníka vozidla přes Portál dopravy.',
    category: 'Vozidla',
    readTime: '8 min',
    date: '13. června 2026',
    cluster: 'vehicle',
    href: '/blog/prepis-auta-online-portal-dopravy-2026',
  },
  {
    slug: 'elektronicky-podpis-elegalizace-2026',
    title: 'Elektronický podpis a eLegalizace 2026: kdy stačí',
    excerpt:
      'Praktický přehled elektronického podpisu, eLegalizace a ověřeného podpisu v roce 2026 pro smlouvy, plné moci a úřední úkony.',
    category: 'Osobní a právní',
    readTime: '8 min',
    date: '13. června 2026',
    cluster: 'general',
    href: '/blog/elektronicky-podpis-elegalizace-2026',
  },
  {
    slug: 'flexinovela-zakoniku-prace-2026',
    title: 'Flexinovela zákoníku práce 2026: co se mění',
    excerpt:
      'Přehled hlavních změn, které do pracovněprávních vztahů přinesla novela zákoníku práce (tzv. flexinovela) — povinnosti zaměstnavatelů u DPP, nové oznamovací povinnosti, dopady na zaměstnance.',
    category: 'Práce a zaměstnání',
    readTime: '11 min',
    date: '29. května 2026',
    cluster: 'general',
    href: '/blog/flexinovela-zakoniku-prace-2026',
  },
  {
    slug: 'energeticky-stitek-najemne-2026',
    title: 'Energetický štítek PENB a nájemné 2026: co vědět',
    excerpt:
      'Průkaz energetické náročnosti budovy, jeho povinné předložení nájemci, dopad na výši nájemného a vyúčtování energií. Praktický průvodce pro pronajímatele i nájemce.',
    category: 'Bydlení',
    readTime: '9 min',
    date: '29. května 2026',
    cluster: 'landlord',
    href: '/blog/energeticky-stitek-najemne-2026',
  },
  {
    slug: 'svarcsystem-osvc-2026',
    title: 'Švarcsystém 2026: kdy hrozí a jaká jsou rizika',
    excerpt:
      'Co je švarcsystém, jaké znaky závislé práce sleduje inspekce práce a v čem se liší skutečná OSVČ od zastřeného zaměstnance. Praktický průvodce pro OSVČ i odběratele.',
    category: 'Práce a podnikání',
    readTime: '10 min',
    date: '29. května 2026',
    cluster: 'general',
    href: '/blog/svarcsystem-osvc-2026',
  },
  {
    slug: 'viceprace-smlouva-o-dilo-2026',
    title: 'Vícepráce a změny díla 2026: jak předejít sporu o cenu',
    excerpt:
      'Jak ve smlouvě o dílo upravit vícepráce, změnové listy, fixaci ceny a předávací protokol. Praktický průvodce pro objednatele i zhotovitele — stavba, rekonstrukce, software, design.',
    category: 'Podnikání a zakázky',
    readTime: '9 min',
    date: '29. května 2026',
    cluster: 'general',
    href: '/blog/viceprace-smlouva-o-dilo-2026',
  },
  {
    slug: 'autorska-prava-smlouva-o-dilo-2026',
    title: 'Autorská práva ve smlouvě o dílo 2026: kdo vlastní dílo',
    excerpt:
      'Jak ve smlouvě s freelancerem nebo agenturou ošetřit autorská práva k softwaru, designu, textům nebo fotografiím. Licence vs. převod, výhradnost, dílo zaměstnanecké.',
    category: 'Podnikání a spolupráce',
    readTime: '10 min',
    date: '29. května 2026',
    cluster: 'general',
    href: '/blog/autorska-prava-smlouva-o-dilo-2026',
  },
  {
    slug: 'kratkodoby-pronajem-airbnb-2026',
    title: 'Krátkodobý pronájem a Airbnb 2026: co sjednat ve smlouvě',
    excerpt:
      'Krátkodobé ubytování přes Airbnb nebo Booking — podnájem, ubytovací služba nebo porušení účelu nájmu. Co ve smlouvě výslovně upravit a proč nestačí ústní dohoda.',
    category: 'Bydlení',
    readTime: '7 min',
    date: '29. května 2026',
    cluster: 'landlord',
    href: '/blog/kratkodoby-pronajem-airbnb-2026',
  },
  {
    slug: 'valorizace-najemneho-2026',
    title: 'Valorizace nájemného 2026: Jak ji správně sjednat ve smlouvě',
    excerpt:
      'Inflační doložka, valorizace nájemného a roční zvyšování nájmu v roce 2026. Co zákon umožňuje, jak klauzuli formulovat a jakým chybám se vyhnout.',
    category: 'Bydlení',
    readTime: '8 min',
    date: '2. května 2026',
    cluster: 'landlord',
    href: '/blog/valorizace-najemneho-2026',
  },
  {
    slug: 'vypoved-z-najmu-bytu-2026',
    title: 'Výpověď z nájmu bytu 2026: výpovědní lhůty, důvody a forma',
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
    title: 'DPP nebo DPČ 2026: přehled rozdílů, limitů a kdy co použít',
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
    title: 'Smlouva o dílo: cena, záloha a platby 2026 | Praktický návod',
    excerpt:
      'Jak správně nastavit cenu, zálohu, splatnost a vícepráce ve smlouvě o dílo. Praktický přehled pro rok 2026.',
    category: 'Podnikání a zakázky',
    readTime: '7 min',
    date: '15. dubna 2026',
    cluster: 'general',
    href: '/blog/smlouva-o-dilo-cena-a-platby',
  },
  {
    slug: 'predani-bytu-najemci-2026',
    title: 'Předání bytu nájemci 2026: co zachytit v protokolu',
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
    title: 'Kauce při pronájmu bytu 2026: jak ji správně sjednat',
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
    title: 'Chyby při pronájmu bytu 2026: na co si dát pozor',
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
    title: 'Nájemní smlouva vzor 2026: co musí obsahovat',
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
    title: 'Předání vozidla kupujícímu 2026: protokol a doklady',
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
    title: 'Doklady při prodeji auta 2026: kompletní přehled',
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
    title: 'Přepis vozidla 2026: na co dát pozor po podpisu',
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
    title: 'Kupní smlouva na auto 2026: co musí obsahovat',
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
    title: 'Uznání dluhu 2026: co musí obsahovat a proč je důležité',
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
    title: 'Smlouva o poskytování služeb 2026: vzor a náležitosti',
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
    title: 'Plná moc 2026: vzor, náležitosti a ověření podpisu',
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
    title: 'Podnájemní smlouva 2026: obsah a souhlas pronajímatele',
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
    title: 'Smlouva o zápůjčce 2026: vzor a nejčastější chyby',
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
    title: 'Darovací smlouva vzor 2026 | Auto, peníze i movité věci',
    excerpt:
      'Kdy použít darovací smlouvu, co má obsahovat a na co si dát pozor při darování auta, peněz nebo nemovitosti.',
    category: 'Osobní a majetkové',
    readTime: '7 min',
    date: '20. března 2026',
    cluster: 'general',
    href: '/blog/darovaci-smlouva-2026',
  },
  {
    slug: 'dpp-dohoda-provedeni-prace',
    title: 'DPP 2026: vzor dohody, limity, odvody a pravidla',
    excerpt:
      'Praktický přehled, kdy je dohoda o provedení práce vhodná, jak nastavit odměnu a na co si dát pozor.',
    category: 'Práce a zaměstnání',
    readTime: '7 min',
    date: '18. března 2026',
    cluster: 'general',
    href: '/blog/dpp-dohoda-provedeni-prace',
  },
  {
    slug: 'dpp-vzor-zdarma-2026',
    title: 'DPP vzor zdarma 2026 — co v něm chybí a proč na tom záleží',
    excerpt:
      'Stáhnete vzor DPP zdarma — ale je správně pro rok 2026? Porovnáme, co volné šablony vynechávají a kdy se vyplatí použít generátor s citacemi zákoníku práce.',
    category: 'Práce a zaměstnání',
    readTime: '8 min',
    date: '20. května 2026',
    cluster: 'general',
    href: '/blog/dpp-vzor-zdarma-2026',
  },
  {
    slug: 'kupni-smlouva-movita-vec',
    title: 'Kupní smlouva na movitou věc 2026: obsah a chyby',
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
    title: 'NDA smlouva o mlčenlivosti 2026: co musí obsahovat',
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
    title: 'Pracovní smlouva vzor 2026 | Co musí obsahovat',
    excerpt:
      'Co musí obsahovat pracovní smlouva v roce 2026, na co si dát pozor před podpisem a kdy použít pracovní smlouvu místo DPP.',
    category: 'Práce a zaměstnání',
    readTime: '8 min',
    date: '12. března 2026',
    cluster: 'general',
    href: '/blog/pracovni-smlouva-2026',
  },
  {
    slug: 'smlouva-o-dilo-2026',
    title: 'Smlouva o dílo 2026: vzor, náležitosti a chyby',
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
    title: 'Smlouva o spolupráci OSVČ 2026: co musí obsahovat',
    excerpt:
      'Co ve smlouvě o spolupráci vymezit, jak pracovat s odměnou, odpovědností a průběhem spolupráce.',
    category: 'Podnikání a spolupráce',
    readTime: '8 min',
    date: '9. března 2026',
    cluster: 'general',
    href: '/blog/smlouva-o-spolupraci-2026',
  },
  {
    slug: 'plna-moc-zastupovani-cizincu-2026',
    title: 'Plná moc pro cizince 2026: náležitosti a ověření',
    excerpt:
      'Kdy cizinec potřebuje plnou moc v ČR, rozdíl mezi generální a speciální plnou mocí a jak na úřední ověření podpisu na Czech POINTu.',
    category: 'Osobní a právní',
    readTime: '6 min',
    date: '21. května 2026',
    cluster: 'general',
    href: '/blog/plna-moc-zastupovani-cizincu-2026',
  },
  {
    slug: 'prodej-auta-prepis-cizinec-2026',
    title: 'Prodej auta cizinci 2026: smlouva a přepis vozidla',
    excerpt:
      'Jak cizinec kupuje či prodává auto v ČR, jaké doklady a povolení k pobytu potřebuje pro registr a na co si dát pozor při přepisu do 10 pracovních dnů od převodu.',
    category: 'Vozidla',
    readTime: '7 min',
    date: '21. května 2026',
    cluster: 'vehicle',
    href: '/blog/prodej-auta-prepis-cizinec-2026',
  },
  {
    slug: 'podnajem-vs-najem-cizinci-2026',
    title: 'Podnájem vs. nájem pro cizince 2026: rozdíly a rizika',
    excerpt:
      'Rozdíl mezi nájmem a podnájmem v ČR z pohledu cizince. Kdy hrozí zamítnutí víza na OAMP kvůli chybějícímu souhlasu vlastníka a jaké doklady o ubytování potřebujete.',
    category: 'Bydlení',
    readTime: '7 min',
    date: '21. května 2026',
    cluster: 'general',
    href: '/blog/podnajem-vs-najem-cizinci-2026',
  },
  ...EXPAT_BLOG_META,
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
  const direct = BLOG_ARTICLES.find((article) => article.slug === slug);
  if (direct) return direct;
  return null;
}

export const CZECH_BLOG_ARTICLES = BLOG_ARTICLES.filter((a) => !a.audience || a.audience === 'cs');

export const EXPAT_BLOG_ARTICLES_LIST = BLOG_ARTICLES.filter(
  (a): a is BlogArticleMeta & { audience: 'en' | 'ua' } =>
    a.audience === 'en' || a.audience === 'ua',
);

export const EXPAT_BLOG_HUB_EN = BLOG_ARTICLES.find(
  (a) => a.slug === 'expat/foreigners-czech-contracts-guide-en',
);
export const EXPAT_BLOG_HUB_UA = BLOG_ARTICLES.find(
  (a) => a.slug === 'expat/foreigners-czech-contracts-guide-ua',
);
