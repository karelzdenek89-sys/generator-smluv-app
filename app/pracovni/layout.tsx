import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Vytvořit pracovní smlouvu — formulář online | SmlouvaHned',
  description: 'Formulář pro pracovní smlouvu dle zákoníku práce. Zadáte mzdu, pracovní dobu a zkušební lhůtu — PDF ke stažení ihned. Od 249 Kč.',
  keywords: ['vytvořit pracovní smlouvu', 'pracovní smlouva formulář', 'pracovní smlouva generátor', 'pracovní smlouva PDF'],
  alternates: { canonical: `${BASE_URL}/pracovni` },
  openGraph: {
    title: 'Vytvořit pracovní smlouvu — formulář online | SmlouvaHned',
    description: 'Formulář krok za krokem. Pracovní smlouva dle zákoníku práce v PDF ihned. Od 249 Kč.',
    url: `${BASE_URL}/pracovni`,
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
