import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Nájemní smlouva online 2026 — vzor, formulář, PDF ihned | SmlouvaHned',
  description: 'Nájemní smlouva na byt 2026 — vyplníte strany, nájemné, kauci a pravidla, dostanete kompletní PDF připravené k podpisu. Vzor dle aktuálního občanského zákoníku.',
  keywords: [
    'nájemní smlouva 2026',
    'vzor nájemní smlouvy 2026',
    'nájemní smlouva na byt 2026',
    'vzor nájemní smlouvy na byt 2026',
    'nájemní smlouva online',
    'nájemní smlouva vzor 2026',
    'nájemní smlouva formulář',
    'nájemní smlouva PDF ke stažení',
  ],
  alternates: { canonical: `${BASE_URL}/najem` },
  openGraph: {
    title: 'Nájemní smlouva online 2026 — vzor, formulář, PDF ihned | SmlouvaHned',
    description: 'Nájemní smlouva na byt 2026 dle občanského zákoníku. Vyplníte formulář, dostanete PDF připravené k podpisu.',
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


