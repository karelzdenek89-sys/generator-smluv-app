import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Darovací smlouva online — vzor 2026',
  description: 'Darovací smlouva na peníze, auto i nemovitost dle § 2055 OZ. Právně čistý převod majetku. PDF ke stažení za 299 Kč.',
  openGraph: {
    title: 'Darovací smlouva — vzor 2026 | SmlouvaHned',
    description: 'Bezpečný převod peněz, auta nebo nemovitosti. § 2055 OZ. Od 299 Kč.',
  },
};

export default function DarovaciLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
