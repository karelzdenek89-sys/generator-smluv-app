import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Smlouva o mlčenlivosti (NDA) online 2026 | SmlouvaHned',
  description: 'Sestavte NDA smlouvu o mlčenlivosti online. Jednostranná nebo oboustranná, s vymezením rozsahu. PDF ihned. Od 249 Kč.',
  keywords: ['smlouva o mlčenlivosti', 'NDA smlouva vzor 2026', 'NDA online česky', 'smlouva o mlčenlivosti formulář'],
  alternates: { canonical: `${BASE_URL}/nda` },
  openGraph: {
    title: 'Smlouva o mlčenlivosti (NDA) online 2026 | SmlouvaHned',
    description: 'Sestavte NDA smlouvu o mlčenlivosti online. Jednostranná nebo oboustranná, s vymezením rozsahu. PDF ihned. Od 249 Kč.',
    url: `${BASE_URL}/nda`,
    type: 'website',
  },
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Smlouva o mlčenlivosti (NDA) — formulář online',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: 'https://smlouvahned.cz/nda',
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
      name: 'Smlouva o mlčenlivosti (NDA)',
      item: 'https://smlouvahned.cz/nda',
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
      {children}
    </>
  );
}
