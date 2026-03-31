import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Vytvořit kupní smlouvu na věc — formulář | SmlouvaHned',
  description: 'Formulář pro kupní smlouvu na movitou věc. Zadáte strany, popis věci, cenu a podmínky předání — výsledkem je PDF ke stažení ihned. Od 249 Kč.',
  keywords: ['vytvořit kupní smlouvu', 'kupní smlouva formulář', 'kupní smlouva movitá věc generátor', 'kupní smlouva PDF'],
  alternates: { canonical: `${BASE_URL}/kupni` },
  openGraph: {
    title: 'Vytvořit kupní smlouvu na věc — formulář | SmlouvaHned',
    description: 'Formulář krok za krokem. Kupní smlouva na movitou věc v PDF ihned. Od 249 Kč.',
    url: `${BASE_URL}/kupni`,
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
