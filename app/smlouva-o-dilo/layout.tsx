import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Smlouva o dílo online 2026 | SmlouvaHned',
  description: 'Smlouva o dílo pro řemeslníky i objednatele. Cena, termín, sankce, předání. PDF ihned ke stažení. Od 249 Kč.',
  keywords: ['smlouva o dílo online', 'smlouva o dílo vzor 2026', 'smlouva o dílo formulář', 'smlouva o dílo ke stažení'],
  alternates: { canonical: `${BASE_URL}/smlouva-o-dilo` },
  openGraph: {
    title: 'Smlouva o dílo online 2026 | SmlouvaHned',
    description: 'Smlouva o dílo pro řemeslníky i objednatele. Cena, termín, sankce, předání. PDF ihned ke stažení. Od 249 Kč.',
    url: `${BASE_URL}/smlouva-o-dilo`,
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
