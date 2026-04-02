import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Vytvořit smlouvu o dílo — formulář online | SmlouvaHned',
  description: 'Formulář pro smlouvu o dílo dle § 2586 OZ. Vyplníte dílo, cenu, termín a sankce — kompletní PDF připravené k podpisu ihned ke stažení. Od 249 Kč.',
  keywords: ['vytvořit smlouvu o dílo', 'smlouva o dílo formulář', 'smlouva o dílo generátor', 'smlouva o dílo PDF'],
  alternates: { canonical: `${BASE_URL}/smlouva-o-dilo` },
  openGraph: {
    title: 'Vytvořit smlouvu o dílo — formulář online | SmlouvaHned',
    description: 'Formulář krok za krokem. Smlouva o dílo s termíny, cenou a sankcemi. PDF ihned. Od 249 Kč.',
    url: `${BASE_URL}/smlouva-o-dilo`,
    type: 'website',
  },
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Smlouva o dílo — formulář online',
  applicationCategory: 'LegalApplication',
  operatingSystem: 'Web',
  url: 'https://smlouvahned.cz/smlouva-o-dilo',
  inLanguage: 'cs',
  offers: {
    '@type': 'Offer',
    price: '249',
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
