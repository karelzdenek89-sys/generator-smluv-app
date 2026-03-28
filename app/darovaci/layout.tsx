import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Darovací smlouva online 2026 | SmlouvaHned',
  description: 'Darovací smlouva na peníze, auto nebo nemovitost. Formulář, PDF ihned ke stažení. Aktualizováno pro OZ 2026. Od 249 Kč.',
  keywords: ['darovací smlouva online', 'darovací smlouva vzor 2026', 'darovací smlouva peníze', 'darovací smlouva auto'],
  alternates: { canonical: `${BASE_URL}/darovaci` },
  openGraph: {
    title: 'Darovací smlouva online 2026 | SmlouvaHned',
    description: 'Darovací smlouva na peníze, auto nebo nemovitost. Formulář, PDF ihned ke stažení. Aktualizováno pro OZ 2026. Od 249 Kč.',
    url: `${BASE_URL}/darovaci`,
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
