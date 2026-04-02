import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Smlouva o spolupráci online 2026 | SmlouvaHned',
  description: 'Smlouva o spolupráci OSVČ nebo firem. Podíl na výnosech, IP práva, mlčenlivost, exit klauzule. Od 249 Kč.',
  keywords: ['smlouva o spolupráci vzor 2026', 'smlouva o spolupráci OSVČ', 'smlouva o spolupráci online', 'smlouva o obchodní spolupráci'],
  alternates: { canonical: `${BASE_URL}/spoluprace` },
  openGraph: {
    title: 'Smlouva o spolupráci online 2026 | SmlouvaHned',
    description: 'Smlouva o spolupráci OSVČ nebo firem. Podíl na výnosech, IP práva, mlčenlivost, exit klauzule. Od 249 Kč.',
    url: `${BASE_URL}/spoluprace`,
    type: 'website',
  },
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Smlouva o spolupráci — formulář online',
  applicationCategory: 'LegalApplication',
  operatingSystem: 'Web',
  url: 'https://smlouvahned.cz/spoluprace',
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
