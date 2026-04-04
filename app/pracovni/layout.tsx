import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Vytvořit pracovní smlouvu — formulář online | SmlouvaHned',
  description: 'Formulář pro pracovní smlouvu dle zákoníku práce. Zadáte mzdu, pracovní dobu a zkušební lhůtu — PDF ke stažení ihned. Od 249 Kč.',
  keywords: ['vytvořit pracovní smlouvu', 'pracovní smlouva formulář', 'pracovní smlouva generátor', 'pracovní smlouva PDF'],
  alternates: { canonical: `${BASE_URL}/pracovni` },
  openGraph: {
    title: 'Vytvořit pracovní smlouvu — formulář online | SmlouvaHned',
    description: 'Formulář krok za krokem. Pracovní smlouva dle zákoníku práce v PDF ke stažení po ověřené platbě. Od 249 Kč.',
    url: `${BASE_URL}/pracovni`,
    type: 'website',
  },
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Pracovní smlouva — formulář online',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: 'https://smlouvahned.cz/pracovni',
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
      name: 'Pracovní smlouva',
      item: 'https://smlouvahned.cz/pracovni',
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
