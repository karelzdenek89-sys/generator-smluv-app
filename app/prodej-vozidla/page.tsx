import type { Metadata } from 'next';
import TrackView from '@/app/components/analytics/TrackView';
import GuideLandingPage from '@/app/components/GuideLandingPage';
import { getSituationLandingConfig } from '@/lib/situations';

const situation = getSituationLandingConfig('vehicle_sale');

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

export default function ProdejVozidlaPage() {
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
          situation_key: 'vehicle_sale',
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
        trackingContext={{ pageType: 'situation', pageKey: 'vehicle_sale' }}
        mistakesTitle="Kdy obvykle není potřeba řešit celý balíček"
        mistakes={[
          'Pokud potřebujete pouze samotnou kupní smlouvu na vozidlo bez navazujících podkladů k předání.',
          'Pokud neřešíte motorové vozidlo, ale jinou movitou věc.',
          'Pokud je situace nestandardní, sporná nebo právně komplikovanější.',
        ]}
        faq={[...situation.faq]}
        bottomLinks={[...situation.bottomLinks]}
      />
    </>
  );
}
