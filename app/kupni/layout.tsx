import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Kupní smlouva na movitou věc online 2026 | SmlouvaHned',
  description: 'Kupní smlouva na elektroniku, nábytek, kolo nebo jinou movitou věc. Záruka, vady, předání. Od 249 Kč.',
  keywords: ['kupní smlouva movitá věc', 'kupní smlouva vzor 2026', 'kupní smlouva online', 'kupní smlouva ke stažení'],
  alternates: { canonical: `${BASE_URL}/kupni` },
  openGraph: {
    title: 'Kupní smlouva na movitou věc online 2026 | SmlouvaHned',
    description: 'Kupní smlouva na elektroniku, nábytek, kolo nebo jinou movitou věc. Záruka, vady, předání. Od 249 Kč.',
    url: `${BASE_URL}/kupni`,
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
