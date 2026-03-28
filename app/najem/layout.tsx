import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Nájemní smlouva online 2026 | SmlouvaHned',
  description: 'Vytvořte nájemní smlouvu na byt nebo dům online. Formulář krok za krokem, PDF ihned ke stažení. Aktualizováno pro legislativu 2026. Od 249 Kč.',
  keywords: ['nájemní smlouva online', 'nájemní smlouva vzor 2026', 'nájemní smlouva byt', 'nájemní smlouva ke stažení'],
  alternates: { canonical: `${BASE_URL}/najem` },
  openGraph: {
    title: 'Nájemní smlouva online 2026 | SmlouvaHned',
    description: 'Vytvořte nájemní smlouvu na byt nebo dům online. Formulář krok za krokem, PDF ihned ke stažení. Aktualizováno pro legislativu 2026. Od 249 Kč.',
    url: `${BASE_URL}/najem`,
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
