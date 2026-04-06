import type { Metadata } from 'next';
import GuideLandingPage from '@/app/components/GuideLandingPage';

export const metadata: Metadata = {
  title: 'Darovací smlouva vzor 2026 | SmlouvaHned',
  description:
    'Průvodce darovací smlouvou pro rok 2026. Co dokument obvykle obsahuje, pro jaké situace je vhodný a kdy už je lepší řešit věc individuálně.',
  keywords: ['darovací smlouva', 'darovací smlouva vzor', 'darovací smlouva 2026', 'darovací smlouva online'],
  alternates: { canonical: 'https://smlouvahned.cz/darovaci-smlouva' },
  openGraph: {
    title: 'Darovací smlouva vzor 2026 | SmlouvaHned',
    description: 'Průvodcová stránka k darovací smlouvě pro běžné převody mezi známými nebo rodinnými příslušníky.',
    url: 'https://smlouvahned.cz/darovaci-smlouva',
    type: 'website',
  },
};

const faq = [
  {
    q: 'Kdy je vhodné mít darovací smlouvu písemně?',
    a: 'Písemná forma je vhodná vždy, když chcete mít převod hodnotnější věci nebo peněz přehledně doložený a nechcete spoléhat jen na ústní dohodu.',
  },
  {
    q: 'Hodí se i pro darování auta nebo peněz?',
    a: 'Ano. Dokument může sloužit pro darování peněz, vozidla i běžné movité věci, pokud potřebujete zachytit základní podmínky převodu.',
  },
  {
    q: 'Kdy už je situace nestandardní?',
    a: 'Pokud řešíte nemovitost, věcná břemena, spory mezi členy rodiny, větší majetkové souvislosti nebo daňové otázky, doporučujeme konzultaci s advokátem nebo daňovým poradcem.',
  },
  {
    q: 'Je po zaplacení výstup k dispozici hned?',
    a: 'Ano. Po dokončení platby získáte standardizovaný digitální dokument určený ke kontrole a podpisu.',
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
    { '@type': 'ListItem', position: 2, name: 'Darovací smlouva', item: 'https://smlouvahned.cz/darovaci-smlouva' },
  ],
};

export default function DarovaciSmlouvaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }}
      />
      <GuideLandingPage
        breadcrumbLabel="Darovací smlouva"
        kicker="Průvodce dokumentem"
        title="Darovací smlouva"
        accent="pro běžné převody mezi stranami"
        description="Průvodcová stránka k darovací smlouvě pro běžné situace, kdy chcete přehledně zachytit bezúplatný převod peněz, vozidla nebo jiné věci. Pomůže vám pochopit základní rámec dokumentu i jeho limity."
        primaryCta={{ href: '/darovaci', label: 'Vytvořit darovací smlouvu' }}
        secondaryCta={{ href: '/blog/darovaci-smlouva-2026', label: 'Přečíst detailní průvodce' }}
        summary={[
          'Vhodné pro běžné darování peněz, vozidla nebo jiné movité věci mezi stranami, které se shodly na podmínkách převodu.',
          'Pomáhá přehledně zachytit dárce, obdarovaného, předmět daru a potvrzení o přijetí daru.',
          'U složitějších majetkových souvislostí, nemovitostí nebo sporných rodinných vztahů je vhodné řešit situaci individuálně.',
        ]}
        suitableFor={[
          {
            title: 'Darování peněz',
            text: 'Když potřebujete písemně doložit bezúplatný převod peněžní částky mezi stranami.',
          },
          {
            title: 'Darování vozidla nebo jiné movité věci',
            text: 'Když chcete zachytit základní údaje o darované věci, jejím stavu a okamžiku předání.',
          },
          {
            title: 'Běžná rodinná nebo osobní situace',
            text: 'Nejlépe funguje tam, kde je převod mezi stranami dohodnutý a nepotřebujete individuálně upravovat složitější majetkové vazby.',
          },
        ]}
        contents={[
          {
            title: 'Dárce a obdarovaný',
            text: 'Identifikaci obou stran a základní údaje potřebné pro jasné určení účastníků smlouvy.',
          },
          {
            title: 'Předmět daru',
            text: 'Přesný popis darované věci nebo částky, aby bylo zřejmé, co je převáděno.',
          },
          {
            title: 'Potvrzení o darování a přijetí',
            text: 'Vyjádření, že dárce bezúplatně dar poskytuje a obdarovaný jej přijímá.',
          },
          {
            title: 'Datum a předání',
            text: 'Zachycení okamžiku uzavření dokumentu a případně i doplňujících podkladů k předání.',
          },
        ]}
        mistakesTitle="Na co si dát u darovací smlouvy pozor"
        mistakes={[
          'Neurčitý popis darované věci nebo chybějící identifikace stran.',
          'Použití obecného vzoru i pro situace s vyšší hodnotou nebo majetkovou návazností.',
          'Podcenění daňových a evidenčních souvislostí u specifických převodů.',
          'Chybějící písemný doklad o darování vyšší částky nebo vozidla.',
        ]}
        faq={faq}
        bottomLinks={[
          { href: '/darovaci', label: 'Formulář darovací smlouvy' },
          { href: '/blog/darovaci-smlouva-2026', label: 'Detailní článek k darovací smlouvě' },
          { href: '/kupni-smlouva', label: 'Kupní smlouva' },
        ]}
      />
    </>
  );
}

