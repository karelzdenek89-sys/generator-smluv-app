import type { Metadata } from 'next';
import ProductSchemas from '@/app/components/seo/ProductSchemas';
import { getExpatContractHreflangAlternates } from '@/lib/i18n/expat-hreflang';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.smlouvahned.cz';

const PAGE_TITLE = 'Nájemní smlouva online 2026 | Formulář a PDF ihned';
const PAGE_DESCRIPTION =
  'Vyplňte nájemní smlouvu na byt nebo dům online. Doplníte strany, nájemné, kauci a pravidla, poté stáhnete hotové PDF nebo DOCX bez registrace a předplatného.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    'nájemní smlouva online',
    'nájemní smlouva formulář',
    'vytvořit nájemní smlouvu',
    'generátor nájemní smlouvy',
    'nájemní smlouva PDF',
    'nájemní smlouva na byt online',
    'formulář nájemní smlouvy',
    'nájemní smlouva ihned ke stažení',
    'rental agreement Czech Republic',
    'lease Prague foreigners',
  ],
  alternates: getExpatContractHreflangAlternates('lease'),
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: `${BASE_URL}/najem`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SmlouvaHned - smluvni dokument online' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProductSchemas
        appName="Nájemní smlouva — formulář online"
        slug="/najem"
        description="Online generátor nájemní smlouvy na byt dle § 2235 a násl. OZ. Kauce, nájemné, valorizace, předávací protokol."
        breadcrumbLabel="Nájemní smlouva"
      />
      {children}
    </>
  );
}
