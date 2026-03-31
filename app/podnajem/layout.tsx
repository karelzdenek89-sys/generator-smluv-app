import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Podnájemní smlouva online 2026 | SmlouvaHned',
  description: 'Podnájemní smlouva pro nájemce, kteří přenechávají byt nebo pokoj podnájemci. Jasná práva, povinnosti a podmínky ukončení. Od 249 Kč.',
  keywords: ['podnájemní smlouva online', 'podnájemní smlouva vzor 2026', 'podnájem bytu smlouva'],
  alternates: { canonical: `${BASE_URL}/podnajem` },
  openGraph: {
    title: 'Podnájemní smlouva online 2026 | SmlouvaHned',
    description: 'Podnájemní smlouva pro nájemce přenechávající byt podnájemci. Od 249 Kč.',
    url: `${BASE_URL}/podnajem`,
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
