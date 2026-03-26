import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kupní smlouva na auto online — vzor 2026',
  description: 'Profesionální kupní smlouva na ojeté vozidlo dle § 2079 a násl. OZ. Ochrana prodávajícího i kupujícího. PDF okamžitě za 249 Kč.',
  openGraph: {
    title: 'Kupní smlouva na auto — vzor 2026 | SmlouvaHned',
    description: 'Kupní smlouva na vozidlo s prohlášením o stavu, VIN, km a přechodem vlastnictví. Od 249 Kč.',
  },
};

export default function AutoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
