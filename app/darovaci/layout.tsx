import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Vytvořit darovací smlouvu — formulář online | SmlouvaHned',
  description: 'Formulář pro darovací smlouvu dle § 2055 OZ. Zadáte dárce, obdarovaného a předmět daru — kompletní PDF ke stažení ihned. Od 249 Kč.',
  keywords: ['vytvořit darovací smlouvu', 'darovací smlouva formulář', 'darovací smlouva generátor', 'darovací smlouva PDF'],
  alternates: { canonical: `${BASE_URL}/darovaci` },
  openGraph: {
    title: 'Vytvořit darovací smlouvu — formulář online | SmlouvaHned',
    description: 'Formulář krok za krokem. Darovací smlouva dle § 2055 OZ. PDF ihned ke stažení. Od 249 Kč.',
    url: `${BASE_URL}/darovaci`,
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
