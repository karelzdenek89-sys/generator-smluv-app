import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Plná moc online 2026 | SmlouvaHned',
  description: 'Plná moc obecná, jednorázová nebo ověřená pro zastoupení před úřadem, bankou nebo v obchodní věci. Od 249 Kč.',
  keywords: ['plná moc online', 'plná moc vzor 2026', 'plná moc formulář', 'plná moc ke stažení'],
  alternates: { canonical: `${BASE_URL}/plna-moc` },
  openGraph: {
    title: 'Plná moc online 2026 | SmlouvaHned',
    description: 'Plná moc obecná, jednorázová nebo ověřená pro zastoupení před úřadem, bankou nebo v obchodní věci. Od 249 Kč.',
    url: `${BASE_URL}/plna-moc`,
    type: 'website',
  },
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Plná moc — formulář online',
  applicationCategory: 'LegalApplication',
  operatingSystem: 'Web',
  url: 'https://smlouvahned.cz/plna-moc',
  inLanguage: 'cs',
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '249',
    highPrice: '749',
    priceCurrency: 'CZK',
  },
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
