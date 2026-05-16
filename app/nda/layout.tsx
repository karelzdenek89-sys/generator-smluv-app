import type { Metadata } from 'next';
import ProductSchemas from '@/app/components/seo/ProductSchemas';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Smlouva o mlčenlivosti (NDA) online 2026 | SmlouvaHned',
  description:
    'NDA online — jednostranná nebo oboustranná smlouva o mlčenlivosti s vymezením rozsahu. PDF ihned. Od 99 Kč.',
  keywords: [
    'smlouva o mlčenlivosti',
    'NDA smlouva vzor 2026',
    'NDA online česky',
    'smlouva o mlčenlivosti formulář',
  ],
  alternates: { canonical: `${BASE_URL}/nda` },
  openGraph: {
    title: 'Smlouva o mlčenlivosti (NDA) online 2026 | SmlouvaHned',
    description:
      'Sestavte NDA online. Jednostranná nebo oboustranná, s vymezením rozsahu. PDF ihned. Od 99 Kč.',
    url: `${BASE_URL}/nda`,
    type: 'website',
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
