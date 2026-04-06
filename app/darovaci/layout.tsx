import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Vytvořit darovací smlouvu — formulář online | SmlouvaHned',
  description: 'Formulář pro darovací smlouvu dle § 2055 OZ. Zadáte dárce, obdarovaného a předmět daru — kompletní PDF ke stažení ihned. Od 99 Kč.',
  keywords: ['vytvořit darovací smlouvu', 'darovací smlouva formulář', 'darovací smlouva generátor', 'darovací smlouva PDF'],
  alternates: { canonical: `${BASE_URL}/darovaci` },
  openGraph: {
    title: 'Vytvořit darovací smlouvu — formulář online | SmlouvaHned',
    description: 'Formulář krok za krokem. Darovací smlouva dle § 2055 OZ. PDF ihned ke stažení. Od 99 Kč.',
    url: `${BASE_URL}/darovaci`,
    type: 'website',
  },
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Darovací smlouva — formulář online',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: 'https://smlouvahned.cz/darovaci',
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
