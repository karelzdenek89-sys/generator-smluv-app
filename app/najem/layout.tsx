import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Vytvořit nájemní smlouvu — formulář online | SmlouvaHned',
  description: 'Formulář pro nájemní smlouvu krok za krokem. Vyplníte strany, nájemné, kausi a pravidla — výsledkem je kompletní PDF připravené k podpisu. Od 99 Kč.',
  keywords: ['vytvořit nájemní smlouvu', 'nájemní smlouva formulář', 'nájemní smlouva generátor', 'nájemní smlouva PDF ke stažení'],
  alternates: { canonical: `${BASE_URL}/najem` },
  openGraph: {
    title: 'Vytvořit nájemní smlouvu — formulář online | SmlouvaHned',
    description: 'Formulář krok za krokem. Kompletní nájemní smlouva v PDF — ihned ke stažení. Od 99 Kč.',
    url: `${BASE_URL}/najem`,
    type: 'website',
  },
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Nájemní smlouva — formulář online',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: 'https://smlouvahned.cz/najem',
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


