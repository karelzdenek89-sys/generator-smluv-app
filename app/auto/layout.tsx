import type { Metadata } from 'next';
import ProductSchemas from '@/app/components/seo/ProductSchemas';
import { getExpatContractHreflangAlternates } from '@/lib/i18n/expat-hreflang';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Kupní smlouva na auto online 2026 | SmlouvaHned',
  description:
    'Kupní smlouva na vozidlo — VIN, STK, emise, historie, tachometr. PDF ihned. English & Ukrainian guided forms for private car sales.',
  keywords: [
    'kupní smlouva auto',
    'kupní smlouva vozidlo 2026',
    'smlouva prodej auta',
    'car sale agreement Czech Republic',
    'kupní smlouva auto English',
  ],
  alternates: getExpatContractHreflangAlternates('car_sale'),
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
