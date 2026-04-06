import type { Metadata } from 'next';
import GuideLandingPage from '@/app/components/GuideLandingPage';

export const metadata: Metadata = {
  title: 'Nájemní smlouva vzor 2026 | SmlouvaHned',
  description:
    'Průvodce nájemní smlouvou pro rok 2026. Co dokument obvykle obsahuje, pro jaké situace je vhodný a kdy už je lepší obrátit se na advokáta.',
  keywords: [
    'nájemní smlouva',
    'nájemní smlouva vzor',
    'nájemní smlouva 2026',
    'nájemní smlouva online',
    'smlouva o nájmu bytu',
  ],
  alternates: { canonical: 'https://smlouvahned.cz/najemni-smlouva' },
  openGraph: {
    title: 'Nájemní smlouva vzor 2026 | SmlouvaHned',
    description:
      'Co obvykle obsahuje nájemní smlouva, kdy se hodí a kdy už je vhodné řešit situaci individuálně.',
    url: 'https://smlouvahned.cz/najemni-smlouva',
    type: 'website',
  },
};

const faq = [
  {
    q: 'Kdy zvolit základní dokument za 99 Kč?',
    a: 'Pokud potřebujete samotnou nájemní smlouvu pro běžnou standardní situaci a neřešíte navazující podklady k předání bytu.',
  },
  {
    q: 'Kdy zvolit komplexní balíček za 199 Kč?',
    a: 'Pokud chcete širší rozsah nájemní smlouvy, více variant ustanovení a praktičtější podklady k jejímu použití.',
  },
  {
    q: 'Kdy dává smysl balíček pro pronajímatele za 299 Kč?',
    a: 'Pokud vedle nájemní smlouvy řešíte i předání bytu, zachycení jeho stavu a potvrzení o převzetí kauce.',
  },
  {
    q: 'Musí být nájemní smlouva písemná?',
    a: 'Písemná forma je v běžné praxi velmi doporučená. Umožňuje přesně zachytit nájemné, kauci, služby i předání bytu a předejít pozdějším nejasnostem.',
  },
  {
    q: 'Co bývá nejčastěji sporné?',
    a: 'Nejčastěji vznikají spory o výši záloh, vrácení kauce, stav bytu při předání a pravidla užívání. Proto je důležité mít podmínky zachycené přehledně a písemně.',
  },
  {
    q: 'Kdy už nestačí standardizovaný dokument?',
    a: 'Pokud řešíte více spolunájemců, neobvyklé užívání bytu, probíhající spor, firemní nájem nebo jinou nestandardní situaci, je vhodné obrátit se na advokáta.',
  },
  {
    q: 'Co po dokončení objednávky získám?',
    a: 'Digitální výstup podle zadaných údajů. U vyšší varianty nebo balíčku mohou být součástí i navazující podklady podle zvolené cesty.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'SmlouvaHned', item: 'https://smlouvahned.cz' },
    { '@type': 'ListItem', position: 2, name: 'Nájemní smlouva', item: 'https://smlouvahned.cz/najemni-smlouva' },
  ],
};

export default function NajemniSmlouvaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }}
      />
      <GuideLandingPage
        breadcrumbLabel="Nájemní smlouva"
        kicker="Průvodce dokumentem"
        title="Nájemní smlouva"
        accent="pro běžný pronájem bytu nebo domu"
        description="Průvodcová stránka k nájemní smlouvě pro typické situace. Pomůže vám zorientovat se v tom, co dokument obvykle obsahuje, kdy je vhodný a kdy už je potřeba řešit věc individuálně."
        primaryCta={{ href: '/najem', label: 'Vytvořit nájemní smlouvu' }}
        secondaryCta={{ href: '/blog/najemni-smlouva-vzor-2026', label: 'Přečíst detailní průvodce' }}
        summary={[
          'Vhodné pro běžný pronájem bytu nebo domu mezi stranami, které se shodly na základních podmínkách.',
          'Pomáhá přehledně zachytit nájemné, zálohy, kauci, dobu nájmu i základní pravidla užívání.',
          'Výstup je určen ke kontrole a podpisu. Nejde o individuální právní poradenství ani řešení sporných případů.',
        ]}
        decisionGuide={{
          label: 'Kdy zvolit co',
          title: 'Samostatný dokument, širší varianta nebo celé řešení pronájmu',
          intro:
            'Pokud řešíte jen samotnou nájemní smlouvu, stačí samostatný dokument. Pokud potřebujete širší rozsah nebo i navazující podklady k předání bytu a kauci, dává smysl vyšší cesta.',
          note:
            'Balíček pro pronajímatele je určen pro situace, kdy vedle nájemní smlouvy potřebujete i podklady k předání bytu a převzetí kauce.',
          items: [
            {
              key: 'lease-basic',
              title: 'Základní dokument',
              priceLabel: '99 Kč',
              description: 'Pro běžný pronájem, kdy potřebujete jeden konkrétní dokument se standardním rozsahem.',
              href: '/najem',
              cta: 'Pokračovat k nájemní smlouvě →',
            },
            {
              key: 'lease-complete',
              title: 'Rozšířený dokument',
              priceLabel: '199 Kč',
              description: 'Pro širší rozsah nájemní smlouvy, více praktických ustanovení a doprovodné podklady k podpisu.',
              href: '/najem',
              cta: 'Vybrat rozšířenou variantu →',
              badge: 'Širší rozsah',
              highlight: true,
            },
            {
              key: 'lease-package',
              title: 'Tematický balíček',
              priceLabel: '299 Kč',
              description: 'Pro řešení celé situace kolem pronájmu, předání bytu a potvrzení o převzetí kauce.',
              href: '/balicek-pronajimatel',
              cta: 'Zobrazit balíček pro pronajímatele →',
              badge: 'Celá situace',
            },
          ],
        }}
        trustBlock={{
          label: 'Co získáte po dokončení objednávky',
          title: 'Výstup odpovídající zvolené cestě',
          intro:
            'Po dokončení objednávky získáte standardizovaný digitální výstup podle údajů, které zadáte do formuláře. Rozsah se odvíjí od zvolené varianty nebo balíčku pro pronajímatele.',
          items: [
            'Nájemní smlouvu připravenou podle zadaných údajů.',
            'U komplexní varianty širší rozsah ustanovení a praktičtější podklady k použití dokumentu.',
            'U balíčku pro pronajímatele také navazující podklady k předání bytu a převzetí kauce.',
            'Výstup určený k závěrečné kontrole a podpisu.',
          ],
          note:
            'Pokud řešíte nestandardní podmínky nájmu nebo spor mezi stranami, je vhodné situaci posoudit individuálně s advokátem.',
        }}
        suitableFor={[
          {
            title: 'Pronajímatel bytu nebo domu',
            text: 'Když potřebujete písemně upravit nájemné, zálohy, kauci, dobu nájmu a základní pravidla užívání.',
          },
          {
            title: 'Nájemce, který chce mít podmínky jasně sepsané',
            text: 'Když chcete mít přehledně zachycené podmínky bydlení, plateb a předání bytu.',
          },
          {
            title: 'Standardní dlouhodobý pronájem',
            text: 'Nejlépe funguje pro běžné bytové nájmy, kde není potřeba individuální úprava složitějších právních vztahů.',
          },
        ]}
        contents={[
          {
            title: 'Smluvní strany a předmět nájmu',
            text: 'Identifikaci pronajímatele a nájemce, adresu, popis bytu a základní údaje o předmětu nájmu.',
          },
          {
            title: 'Nájemné a zálohy',
            text: 'Výši nájemného, záloh na služby, splatnost a způsob úhrady.',
          },
          {
            title: 'Kauce a předání',
            text: 'Ujednání o kauci, jejím vrácení a navazující podklady k předání bytu podle zvolené varianty.',
          },
          {
            title: 'Doba nájmu a ukončení',
            text: 'Základní nastavení nájmu na dobu určitou nebo neurčitou a navazující podmínky ukončení.',
          },
        ]}
        mistakesTitle="Na co si dát u nájemní smlouvy pozor"
        mistakes={[
          'Nejasně popsaný byt nebo chybějící příslušenství a vybavení.',
          'Chybějící rozlišení mezi nájemným a zálohami na služby.',
          'Neupravené předání bytu, stavu měřidel a vybavení.',
          'Použití obecného vzoru bez přizpůsobení konkrétním údajům stran a bytu.',
        ]}
        faq={faq}
        bottomLinks={[
          { href: '/najem', label: 'Formulář nájemní smlouvy' },
          { href: '/pro-pronajimatele', label: 'Dokumenty pro pronajímatele' },
          { href: '/balicek-pronajimatel', label: 'Balíček pro pronajímatele' },
          { href: '/podnajem', label: 'Podnájemní smlouva' },
          { href: '/blog/najemni-smlouva-vzor-2026', label: 'Detailní článek k nájemní smlouvě' },
        ]}
      />
    </>
  );
}

