import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Smlouva o dílo online — vzor 2026',
  description: 'Smlouva o dílo pro řemeslníky i objednatele dle § 2586 OZ. Termíny, sankce, záruky a předání díla. PDF za 299 Kč.',
  openGraph: {
    title: 'Smlouva o dílo — vzor 2026 | SmlouvaHned',
    description: 'Profesionální smlouva o dílo s termíny, sankcemi a zárukou. § 2586 OZ. Od 299 Kč.',
  },
};

export default function SmlouvaODiloLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
