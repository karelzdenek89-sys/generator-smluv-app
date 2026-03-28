import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Smlouva o mlčenlivosti (NDA) online 2026 | SmlouvaHned',
  description: 'Sestavte NDA smlouvu o mlčenlivosti online. Jednostranná nebo oboustranná, s vymezením rozsahu. PDF ihned. Od 249 Kč.',
  keywords: ['smlouva o mlčenlivosti', 'NDA smlouva vzor 2026', 'NDA online česky', 'smlouva o mlčenlivosti formulář'],
  alternates: { canonical: `${BASE_URL}/nda` },
  openGraph: {
    title: 'Smlouva o mlčenlivosti (NDA) online 2026 | SmlouvaHned',
    description: 'Sestavte NDA smlouvu o mlčenlivosti online. Jednostranná nebo oboustranná, s vymezením rozsahu. PDF ihned. Od 249 Kč.',
    url: `${BASE_URL}/nda`,
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
