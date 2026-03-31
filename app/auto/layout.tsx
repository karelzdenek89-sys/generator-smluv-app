import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Kupní smlouva na auto online 2026 | SmlouvaHned',
  description: 'Vytvořte kupní smlouvu na vozidlo za 249 Kč. Pokrývá VIN, STK, emise, historii auta i stav tachometru. Profesionální PDF ihned ke stažení.',
  keywords: ['kupní smlouva auto', 'kupní smlouva vozidlo 2026', 'smlouva prodej auta', 'kupní smlouva ojetý vůz', 'kupní smlouva online'],
  alternates: { canonical: `${BASE_URL}/auto` },
  openGraph: {
    title: 'Kupní smlouva na auto online 2026 | SmlouvaHned',
    description: 'Vytvořte kupní smlouvu na vozidlo za 249 Kč. Pokrývá VIN, STK, emise, historii auta i stav tachometru. Profesionální PDF ihned ke stažení.',
    url: `${BASE_URL}/auto`,
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
