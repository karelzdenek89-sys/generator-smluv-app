import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Vytvořit nájemní smlouvu — formulář online | SmlouvaHned',
  description: 'Formulář pro nájemní smlouvu krok za krokem. Vyplníte strany, nájemné, kausi a pravidla — výsledkem je kompletní PDF připravené k podpisu. Od 249 Kč.',
  keywords: ['vytvořit nájemní smlouvu', 'nájemní smlouva formulář', 'nájemní smlouva generátor', 'nájemní smlouva PDF ke stažení'],
  alternates: { canonical: `${BASE_URL}/najem` },
  openGraph: {
    title: 'Vytvořit nájemní smlouvu — formulář online | SmlouvaHned',
    description: 'Formulář krok za krokem. Kompletní nájemní smlouva v PDF — ihned ke stažení. Od 249 Kč.',
    url: `${BASE_URL}/najem`,
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
