import type { Metadata } from 'next';
import TrackView from '@/app/components/analytics/TrackView';
import GuideLandingPage from '@/app/components/GuideLandingPage';
import { getSituationLandingConfig } from '@/lib/situations';

const situation = getSituationLandingConfig('landlord');

export const metadata: Metadata = {
  title: situation.metadataTitle,
  description: situation.metadataDescription,
  alternates: { canonical: `https://smlouvahned.cz${situation.href}` },
  openGraph: {
    title: situation.openGraphTitle,
    description: situation.openGraphDescription,
    url: `https://smlouvahned.cz${situation.href}`,
    type: 'website',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: situation.faq.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
};

export default function ProPronajimatelePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }}
      />
      <TrackView
        eventName="situation_page_view"
        eventParams={{
          source: 'situation_page',
          surface: 'situation_page',
          situation_key: 'landlord',
        }}
      />
      <GuideLandingPage
        breadcrumbLabel={situation.breadcrumbLabel}
        kicker={situation.kicker}
        title={situation.title}
        accent={situation.accent}
        description={situation.description}
        primaryCta={situation.primaryCta}
        secondaryCta={situation.secondaryCta}
        summary={[...situation.summary]}
        suitableSectionLabel={situation.suitableSectionLabel}
        suitableSectionTitle={situation.suitableSectionTitle}
        contentsSectionLabel={situation.contentsSectionLabel}
        contentsSectionTitle={situation.contentsSectionTitle}
        suitableFor={[...situation.suitableFor]}
        contents={[...situation.contents]}
        decisionGuide={situation.decisionGuide}
        trustBlock={situation.trustBlock}
        trackingContext={{ pageType: 'situation', pageKey: 'landlord' }}
        mistakesTitle="Kdy obvykle není potřeba řešit celý balíček"
        mistakes={[
          'Pokud potřebujete pouze samotnou nájemní smlouvu bez navazujících podkladů.',
          'Pokud řešíte podnájem nebo jiný odlišný typ právního vztahu.',
          'Pokud je situace nestandardní nebo mezi stranami už vznikl spor.',
        ]}
        faq={[...situation.faq]}
        finalCtaTitle="Vyberte cestu podle rozsahu pronájmu"
        finalCtaBody="Pokud řešíte jen samotnou smlouvu, pokračujte do builderu nájemní smlouvy. Pokud potřebujete i podklady k předání bytu a ke kauci, bývá vhodnější tematický balíček."
        bottomLinks={[...situation.bottomLinks]}
      />
    </>
  );
}
