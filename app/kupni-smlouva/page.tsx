import type { Metadata } from 'next';
import GuideLandingPage from '@/app/components/GuideLandingPage';

export const metadata: Metadata = {
  title: 'Kupní smlouva vzor 2026 | SmlouvaHned',
  description:
    'Průvodce kupní smlouvou pro rok 2026. Co dokument obvykle obsahuje, kdy je vhodný pro prodej vozidla nebo jiné věci a kdy už nestačí standardní postup.',
  keywords: ['kupní smlouva', 'kupní smlouva vzor', 'kupní smlouva 2026', 'kupní smlouva auto'],
  alternates: { canonical: 'https://smlouvahned.cz/kupni-smlouva' },
  openGraph: {
    title: 'Kupní smlouva vzor 2026 | SmlouvaHned',
    description: 'Přehledná průvodcová stránka ke kupní smlouvě pro běžné převody movitých věcí a vozidel.',
    url: 'https://smlouvahned.cz/kupni-smlouva',
    type: 'website',
  },
};

const faq = [
  {
    q: 'K čemu kupní smlouva slouží?',
    a: 'Pomáhá přehledně upravit převod věci mezi prodávajícím a kupujícím, zejména identifikaci věci, cenu, stav a způsob předání.',
  },
  {
    q: 'Je jiná kupní smlouva na auto a jiná na běžnou věc?',
    a: 'Ano. U vozidla je vhodné zachytit navíc VIN, stav kilometrů, technické údaje a související doklady. Proto má samostatnou produktovou stránku.',
  },
  {
    q: 'Kdy už je lepší řešit situaci individuálně?',
    a: 'Pokud řešíte spor o vady, převod podnikatelského majetku, vyšší hodnotu, zástavu nebo jinou nestandardní podmínku, je vhodné obrátit se na advokáta.',
  },
  {
    q: 'Co po zaplacení získám?',
    a: 'Standardizovaný digitální dokument sestavený podle vyplněných údajů, určený ke kontrole a podpisu.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'SmlouvaHned', item: 'https://smlouvahned.cz' },
    { '@type': 'ListItem', position: 2, name: 'Kupní smlouva', item: 'https://smlouvahned.cz/kupni-smlouva' },
  ],
};

export default function KupniSmlouvaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }}
      />
      <GuideLandingPage
        breadcrumbLabel="Kupní smlouva"
        kicker="Průvodce dokumentem"
        title="Kupní smlouva"
        accent="pro převod vozidla nebo jiné věci"
        description="Průvodcová stránka ke kupní smlouvě pro běžné převody movitých věcí. Pomůže vám rychle posoudit, co dokument obvykle obsahuje, kdy se hodí a kdy je vhodné řešit situaci individuálně."
        primaryCta={{ href: '/kupni', label: 'Vytvořit kupní smlouvu' }}
        secondaryCta={{ href: '/auto', label: 'Kupní smlouva na vozidlo' }}
        summary={[
          'Vhodné pro běžný prodej mezi stranami, které se shodly na ceně, stavu věci a základních podmínkách předání.',
          'Pomáhá přehledně zachytit identifikaci věci, cenu, stav a potvrzení o předání.',
          'U vozidla, vyšší hodnoty nebo sporného stavu je vhodné věnovat větší pozornost rozsahu ujednání nebo zvolit individuální řešení.',
        ]}
        suitableFor={[
          {
            title: 'Prodej běžné movité věci',
            text: 'Například elektroniky, vybavení, nábytku nebo jiného majetku, kde je potřeba písemně zachytit cenu a stav.',
          },
          {
            title: 'Převod vozidla',
            text: 'Pro automobil, motocykl nebo přívěs je vhodnější specializovaná stránka kupní smlouvy na vozidlo s odpovídajícími poli a strukturou.',
          },
          {
            title: 'Situace bez zásadního sporu',
            text: 'Nejlépe funguje tam, kde se strany shodly na hlavních podmínkách a potřebují je přehledně zachytit v jednom dokumentu.',
          },
        ]}
        contents={[
          {
            title: 'Identifikace stran',
            text: 'Prodávajícího a kupujícího včetně základních identifikačních údajů a kontaktních informací.',
          },
          {
            title: 'Přesný popis věci',
            text: 'Popis předmětu koupě, jeho stavu, případných vad a dalších údajů důležitých pro předání.',
          },
          {
            title: 'Kupní cena a úhrada',
            text: 'Výši kupní ceny, způsob a okamžik úhrady a případné potvrzení o zaplacení.',
          },
          {
            title: 'Předání a závěrečná ujednání',
            text: 'Datum a místo předání, převzaté doklady nebo příslušenství a závěrečné potvrzení stran.',
          },
        ]}
        mistakesTitle="Na co si dát u kupní smlouvy pozor"
        mistakes={[
          'Příliš obecný popis prodávané věci nebo jejího stavu.',
          'Chybějící informace o vadách, příslušenství nebo předání.',
          'Nejasný způsob úhrady kupní ceny a okamžik převzetí.',
          'Použití stejného vzoru pro auto i běžnou věc bez odpovídajícího přizpůsobení.',
        ]}
        faq={faq}
        bottomLinks={[
          { href: '/auto', label: 'Kupní smlouva na vozidlo' },
          { href: '/kupni', label: 'Formulář kupní smlouvy' },
          { href: '/blog/kupni-smlouva-na-auto-2026', label: 'Detailní článek ke kupní smlouvě na auto' },
        ]}
      />
    </>
  );
}

