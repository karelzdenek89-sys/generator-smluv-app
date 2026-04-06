import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Uznání dluhu online 2026 | SmlouvaHned',
  description: 'Uznání dluhu dle § 2053 OZ — obnoví 10letou promlčecí dobu. Splátkový kalendář, smluvní pokuta za prodlení a jasné potvrzení závazku. Od 99 Kč.',
  keywords: ['uznání dluhu vzor 2026', 'uznání dluhu online', 'uznání dluhu formulář', 'uznání závazku smlouva'],
  alternates: { canonical: `${BASE_URL}/uznani-dluhu` },
  openGraph: {
    title: 'Uznání dluhu online 2026 | SmlouvaHned',
    description: 'Uznání dluhu dle § 2053 OZ — obnoví 10letou promlčecí dobu. Splátkový kalendář, smluvní pokuta za prodlení a jasné potvrzení závazku. Od 99 Kč.',
    url: `${BASE_URL}/uznani-dluhu`,
    type: 'website',
  },
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Uznání dluhu — formulář online',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: 'https://smlouvahned.cz/uznani-dluhu',
  inLanguage: 'cs',
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '99',
    highPrice: '199',
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
