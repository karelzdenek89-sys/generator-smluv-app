import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nájemní smlouva online — vzor 2026',
  description: 'Vygenerujte si profesionální nájemní smlouvu dle § 2201 a násl. OZ. Předávací protokol v ceně. Okamžité PDF ke stažení za 249 Kč.',
  openGraph: {
    title: 'Nájemní smlouva online — vzor 2026 | SmlouvaHned',
    description: 'Profesionální nájemní smlouva s předávacím protokolem. § 2201 a násl. OZ. Od 249 Kč.',
  },
};

export default function NajemLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
