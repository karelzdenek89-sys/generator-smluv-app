import type { Metadata } from 'next';
import GuideLandingPage from '@/app/components/GuideLandingPage';

export const metadata: Metadata = {
  title: 'NDA smlouva vzor 2026 | SmlouvaHned',
  description:
    'Průvodce NDA smlouvou pro rok 2026. Co dokument obvykle obsahuje, kdy je vhodný a kdy už je lepší řešit situaci individuálně.',
  keywords: [
    'NDA smlouva',
    'smlouva o mlčenlivosti',
    'NDA vzor',
    'NDA 2026',
    'smlouva o mlčenlivosti online',
  ],
  alternates: { canonical: 'https://smlouvahned.cz/nda-smlouva' },
  openGraph: {
    title: 'NDA smlouva vzor 2026 | SmlouvaHned',
    description:
      'Přehledná průvodcová stránka k NDA smlouvě pro běžné situace, kdy potřebujete zachytit mlčenlivost a ochranu důvěrných informací.',
    url: 'https://smlouvahned.cz/nda-smlouva',
    type: 'website',
  },
};

const faq = [
  {
    q: 'Kdy se NDA smlouva běžně používá?',
    a: 'Typicky při jednání o spolupráci, při sdílení interních podkladů, know-how, klientských dat nebo jiných důvěrných informací mezi dvěma stranami.',
  },
  {
    q: 'Je rozdíl mezi jednostrannou a oboustrannou NDA?',
    a: 'Ano. U jednostranné NDA se k mlčenlivosti zavazuje jen příjemce informací. U oboustranné NDA se zavazují obě strany navzájem.',
  },
  {
    q: 'Co dokument obvykle řeší?',
    a: 'Vymezení důvěrných informací, účel jejich sdílení, zákaz dalšího šíření, dobu trvání mlčenlivosti a případné sankce za porušení.',
  },
  {
    q: 'Kdy už standardizovaný dokument nestačí?',
    a: 'Pokud řešíte mezinárodní vztah, velmi citlivé obchodní know-how, navazující licenční režim nebo spor o porušení mlčenlivosti, je vhodné obrátit se na advokáta.',
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
    { '@type': 'ListItem', position: 2, name: 'NDA smlouva', item: 'https://smlouvahned.cz/nda-smlouva' },
  ],
};

export default function NdaSmlouvaGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }}
      />
      <GuideLandingPage
        breadcrumbLabel="NDA smlouva"
        kicker="Průvodce dokumentem"
        title="NDA smlouva"
        accent="pro ochranu důvěrných informací"
        description="Průvodcová stránka k NDA smlouvě pro typické situace, kdy potřebujete zachytit mlčenlivost a ochranu důvěrných informací mezi dvěma stranami. Pomůže vám zorientovat se v tom, co dokument obvykle obsahuje a kdy už je vhodné řešit věc individuálně."
        primaryCta={{ href: '/nda', label: 'Vytvořit NDA smlouvu' }}
        secondaryCta={{ href: '/blog/nda-smlouva-mlcenlivost', label: 'Přečíst detailní průvodce' }}
        summary={[
          'Vhodné pro běžné obchodní nebo podnikatelské situace, kdy je potřeba zachytit povinnost mlčenlivosti písemně.',
          'Pomáhá přehledně upravit rozsah důvěrných informací, účel sdílení, dobu trvání i základní sankce.',
          'Výstup je určen ke kontrole a podpisu. Nejde o individuální právní poradenství ani o poskytování advokátních služeb.',
        ]}
        suitableFor={[
          {
            title: 'Jednání o spolupráci',
            text: 'Když sdílíte citlivé podklady před uzavřením smlouvy a potřebujete vymezit, jak s nimi druhá strana může nakládat.',
          },
          {
            title: 'Dodavatelé, freelanceři a partneři',
            text: 'Když poskytujete interní informace, cenové podklady, know-how nebo přístup k neveřejným datům.',
          },
          {
            title: 'Běžné podnikatelské situace',
            text: 'Nejlíp funguje tam, kde potřebujete standardizovaně zachytit mlčenlivost bez složitých mezinárodních nebo sporných prvků.',
          },
        ]}
        contents={[
          {
            title: 'Smluvní strany',
            text: 'Identifikaci obou stran a základní údaje potřebné pro přehledné vymezení závazku mlčenlivosti.',
          },
          {
            title: 'Rozsah důvěrných informací',
            text: 'Vymezení, jaké informace mají být chráněny a k jakému účelu se sdílejí.',
          },
          {
            title: 'Doba trvání a povinnosti',
            text: 'Délku závazku mlčenlivosti, zákaz dalšího šíření a základní pravidla zacházení s informacemi.',
          },
          {
            title: 'Sankce a závěrečná ustanovení',
            text: 'Možnosti sjednání smluvní pokuty a další standardní ustanovení obvyklá pro tento typ dokumentu.',
          },
        ]}
        mistakesTitle="Na co si dát u NDA smlouvy pozor"
        mistakes={[
          'Příliš vágní vymezení důvěrných informací, ze kterého není jasné, co má být chráněno.',
          'Chybějící určení účelu sdílení informací nebo doby trvání mlčenlivosti.',
          'Použití standardního dokumentu pro situaci, která zahrnuje spor, zahraniční prvek nebo složitější transakci.',
          'Ponechání nejasností ohledně sankcí nebo způsobu nakládání s informacemi po skončení spolupráce.',
        ]}
        faq={faq}
        bottomLinks={[
          { href: '/nda', label: 'Formulář NDA smlouvy' },
          { href: '/spoluprace', label: 'Smlouva o spolupráci' },
          { href: '/blog/nda-smlouva-mlcenlivost', label: 'Detailní článek k NDA smlouvě' },
        ]}
      />
    </>
  );
}
