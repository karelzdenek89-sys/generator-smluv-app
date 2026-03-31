import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Darovací smlouva online 2026 | SmlouvaHned',
  description: 'Darovací smlouva na peníze, auto, nemovitost či věc za 249 Kč. Dle § 2055 OZ s volitelným odvoláním daru. PDF ihned ke stažení.',
  keywords: ['darovací smlouva online', 'darovací smlouva vzor 2026', 'darovací smlouva peníze', 'darovací smlouva auto', 'darovací smlouva nemovitost'],
  alternates: { canonical: `${BASE_URL}/darovaci` },
  openGraph: {
    title: 'Darovací smlouva online 2026 | SmlouvaHned',
    description: 'Darovací smlouva na peníze, auto, nemovitost či věc za 249 Kč. Dle § 2055 OZ s volitelným odvoláním daru. PDF ihned ke stažení.',
    url: `${BASE_URL}/darovaci`,
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
