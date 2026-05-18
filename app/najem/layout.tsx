import type { Metadata } from 'next';
import ProductSchemas from '@/app/components/seo/ProductSchemas';
import { getExpatContractHreflangAlternates } from '@/lib/i18n/expat-hreflang';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Nájemní smlouva online 2026 — vzor, formulář, PDF ihned | SmlouvaHned',
  description:
    'Nájemní smlouva na byt 2026. Vyplníte strany, nájemné, kauci a pravidla — dostanete PDF dle občanského zákoníku. English & Ukrainian guided forms for foreigners.',
  keywords: [
    'nájemní smlouva 2026',
    'vzor nájemní smlouvy 2026',
    'nájemní smlouva na byt 2026',
    'vzor nájemní smlouvy na byt 2026',
    'nájemní smlouva online',
    'nájemní smlouva vzor 2026',
    'nájemní smlouva formulář',
    'nájemní smlouva PDF ke stažení',
    'rental agreement Czech Republic',
    'lease Prague foreigners',
  ],
  alternates: getExpatContractHreflangAlternates('lease'),
  openGraph: {
    title: 'Nájemní smlouva online 2026 — vzor, formulář, PDF ihned | SmlouvaHned',
    description:
      'Nájemní smlouva na byt 2026 dle občanského zákoníku. Formulář → PDF připravené k podpisu. Od 99 Kč.',
    url: `${BASE_URL}/najem`,
    type: 'website',
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
