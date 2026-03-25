import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NDA — Smlouva o mlčenlivosti online — vzor 2026',
  description: 'Smlouva o mlčenlivosti (NDA) pro ochranu obchodního tajemství a know-how. Jednostranná i oboustranná. PDF za 299 Kč.',
  openGraph: {
    title: 'NDA smlouva o mlčenlivosti — vzor 2026 | SmlouvaHned',
    description: 'Ochrana know-how, databází a obchodního tajemství. § 504 OZ. Jednostranná i oboustranná NDA. Od 299 Kč.',
  },
};

export default function NdaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
