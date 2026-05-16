import type { Metadata } from 'next';
import ProductSchemas from '@/app/components/seo/ProductSchemas';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Kupní smlouva na auto online 2026 | SmlouvaHned',
  description:
    'Vytvořte kupní smlouvu na vozidlo od 99 Kč. Pokrývá VIN, STK, emise, historii i tachometr. PDF ihned ke stažení.',
  keywords: [
    'kupní smlouva auto',
    'kupní smlouva vozidlo 2026',
    'smlouva prodej auta',
    'kupní smlouva ojetý vůz',
    'kupní smlouva online',
  ],
  alternates: { canonical: `${BASE_URL}/auto` },
  openGraph: {
    title: 'Kupní smlouva na auto online 2026 | SmlouvaHned',
    description:
      'Kupní smlouva na vozidlo s VIN, STK, emisemi i prohlášením o vadách. PDF ihned. Od 99 Kč.',
    url: `${BASE_URL}/auto`,
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProductSchemas
        appName="Kupní smlouva na auto — formulář online"
        slug="/auto"
        description="Online generátor kupní smlouvy na vozidlo. VIN, STK, emise, prohlášení o vadách, tematický balíček pro prodej vozidla."
        breadcrumbLabel="Kupní smlouva na auto"
      />
      {children}
    </>
  );
}
