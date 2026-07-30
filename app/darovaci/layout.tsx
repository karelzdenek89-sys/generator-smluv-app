import type { Metadata } from 'next';
import ProductSchemas from '@/app/components/seo/ProductSchemas';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Darovací smlouva 2026 — formulář online',
  description:
    'Vytvořte darovací smlouvu online dle § 2055 OZ. Dárce, obdarovaný, přesný předmět daru i podmínky předání. PDF připravené k podpisu ihned, od 99 Kč.',
  keywords: [
    'vytvořit darovací smlouvu',
    'darovací smlouva formulář',
    'darovací smlouva generátor',
    'darovací smlouva PDF',
  ],
  alternates: { canonical: `${BASE_URL}/darovaci` },
  openGraph: {
    title: 'Darovací smlouva 2026 — formulář online',
    description: 'Darovací smlouva 2026 dle § 2055 OZ. PDF ihned ke stažení. Od 99 Kč.',
    url: `${BASE_URL}/darovaci`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SmlouvaHned - smluvni dokument online' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Darovací smlouva 2026 - formulář online',
    description: 'Darovací smlouva 2026 dle § 2055 OZ. PDF ihned ke stažení. Od 99 Kč.',
    images: ['/og-image.png'],
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
