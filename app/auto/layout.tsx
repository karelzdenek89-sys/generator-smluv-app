import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Kupní smlouva na auto online 2026 | SmlouvaHned',
  description: 'Sestavte kupní smlouvu na ojeté vozidlo online. Stav auta, vady, kilometry — vše správně zachyceno v PDF. Od 249 Kč.',
  keywords: ['kupní smlouva auto', 'kupní smlouva vozidlo 2026', 'smlouva prodej auta', 'kupní smlouva ojetý vůz'],
  alternates: { canonical: `${BASE_URL}/auto` },
  openGraph: {
    title: 'Kupní smlouva na auto online 2026 | SmlouvaHned',
    description: 'Sestavte kupní smlouvu na ojeté vozidlo online. Stav auta, vady, kilometry — vše správně zachyceno v PDF. Od 249 Kč.',
    url: `${BASE_URL}/auto`,
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
