import type { Metadata } from 'next';
import ProductSchemas from '@/app/components/seo/ProductSchemas';
import { SITE_URL } from '@/lib/seo/site';

const BASE_URL = SITE_URL;

export const metadata: Metadata = {
  title: 'Smlouva o mlčenlivosti (NDA) online 2026',
  description:
    'Vytvořte NDA online — jednostrannou i oboustrannou smlouvu o mlčenlivosti. Vymezení důvěrných informací, doba trvání i sankce. PDF ihned, od 99 Kč.',
  keywords: [
    'smlouva o mlčenlivosti',
    'NDA smlouva vzor 2026',
    'NDA online česky',
    'smlouva o mlčenlivosti formulář',
  ],
  alternates: { canonical: `${BASE_URL}/nda` },
  openGraph: {
    title: 'Smlouva o mlčenlivosti (NDA) online 2026',
    description:
      'Sestavte NDA online. Jednostranná nebo oboustranná, s vymezením rozsahu. PDF ihned. Od 99 Kč.',
    url: `${BASE_URL}/nda`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SmlouvaHned - smluvni dokument online' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smlouva o mlčenlivosti (NDA) online 2026',
    description: 'Sestavte NDA online. Jednostranná nebo oboustranná, s vymezením rozsahu. PDF ihned. Od 99 Kč.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProductSchemas
        appName="Smlouva o mlčenlivosti (NDA) — formulář online"
        slug="/nda"
        description="Online generátor NDA. Jednostranná nebo vzájemná mlčenlivost, sankce, doba trvání."
        breadcrumbLabel="Smlouva o mlčenlivosti (NDA)"
      />
      {children}
    </>
  );
}
