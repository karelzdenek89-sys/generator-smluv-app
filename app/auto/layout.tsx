import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Kupní smlouva na auto online 2026 | SmlouvaHned',
  description: 'Vytvořte kupní smlouvu na vozidlo za 249 Kč. Pokrývá VIN, STK, emise, historii auta i stav tachometru. PDF ke stažení ihned po platbě.',
  keywords: ['kupní smlouva auto', 'kupní smlouva vozidlo 2026', 'smlouva prodej auta', 'kupní smlouva ojetý vůz', 'kupní smlouva online'],
  alternates: { canonical: `${BASE_URL}/auto` },
  openGraph: {
    title: 'Kupní smlouva na auto online 2026 | SmlouvaHned',
    description: 'Vytvořte kupní smlouvu na vozidlo za 249 Kč. Pokrývá VIN, STK, emise, historii auta i stav tachometru. PDF ke stažení ihned po platbě.',
    url: `${BASE_URL}/auto`,
    type: 'website',
  },
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Kupní smlouva na auto — formulář online',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: 'https://smlouvahned.cz/auto',
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
      name: 'Kupní smlouva na auto',
      item: 'https://smlouvahned.cz/auto',
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
