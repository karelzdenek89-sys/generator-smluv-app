import type { Metadata } from 'next';
import ProductSchemas from '@/app/components/seo/ProductSchemas';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Vytvořit darovací smlouvu — formulář online | SmlouvaHned',
  description:
    'Formulář pro darovací smlouvu dle § 2055 OZ. Dárce, obdarovaný, předmět daru — PDF ihned. Od 99 Kč.',
  keywords: [
    'vytvořit darovací smlouvu',
    'darovací smlouva formulář',
    'darovací smlouva generátor',
    'darovací smlouva PDF',
  ],
  alternates: { canonical: `${BASE_URL}/darovaci` },
  openGraph: {
    title: 'Vytvořit darovací smlouvu — formulář online | SmlouvaHned',
    description: 'Darovací smlouva dle § 2055 OZ. PDF ihned ke stažení. Od 99 Kč.',
    url: `${BASE_URL}/darovaci`,
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProductSchemas
        appName="Darovací smlouva — formulář online"
        slug="/darovaci"
        description="Online generátor darovací smlouvy dle § 2055 OZ. Předmět daru, podmínky, předání."
        breadcrumbLabel="Darovací smlouva"
      />
      {children}
    </>
  );
}
