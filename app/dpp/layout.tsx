import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Dohoda o provedení práce (DPP) online 2026 | SmlouvaHned',
  description: 'DPP pro brigády a jednorázové práce. Max. 300 hod./rok. Formulář, PDF ke stažení. Zákoník práce 2026. Od 249 Kč.',
  keywords: ['DPP 2026', 'dohoda o provedení práce vzor', 'DPP online', 'dohoda o provedení práce formulář'],
  alternates: { canonical: `${BASE_URL}/dpp` },
  openGraph: {
    title: 'Dohoda o provedení práce (DPP) online 2026 | SmlouvaHned',
    description: 'DPP pro brigády a jednorázové práce. Max. 300 hod./rok. Formulář, PDF ke stažení. Zákoník práce 2026. Od 249 Kč.',
    url: `${BASE_URL}/dpp`,
    type: 'website',
  },
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Dohoda o provedení práce (DPP) — formulář online',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: 'https://smlouvahned.cz/dpp',
  inLanguage: 'cs',
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '249',
    highPrice: '749',
    priceCurrency: 'CZK',
  },
};


const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'SmlouvaHned',
      item: 'https://smlouvahned.cz',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Dohoda o provedení práce (DPP)',
      item: 'https://smlouvahned.cz/dpp',
    },
  ],
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }}
      />
      {children}
    </>
  );
}
