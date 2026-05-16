import type { Metadata } from 'next';
import ProductSchemas from '@/app/components/seo/ProductSchemas';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Podnájemní smlouva online 2026 | SmlouvaHned',
  description:
    'Podnájemní smlouva pro nájemce přenechávající byt podnájemci. Práva, povinnosti a ukončení. Od 99 Kč.',
  keywords: ['podnájemní smlouva online', 'podnájemní smlouva vzor 2026', 'podnájem bytu smlouva'],
  alternates: { canonical: `${BASE_URL}/podnajem` },
  openGraph: {
    title: 'Podnájemní smlouva online 2026 | SmlouvaHned',
    description: 'Podnájemní smlouva pro přenechání bytu podnájemci. PDF ihned. Od 99 Kč.',
    url: `${BASE_URL}/podnajem`,
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProductSchemas
        appName="Podnájemní smlouva — formulář online"
        slug="/podnajem"
        description="Online generátor podnájemní smlouvy dle § 2274 OZ. Souhlas pronajímatele, doba, podmínky."
        breadcrumbLabel="Podnájemní smlouva"
      />
      {children}
    </>
  );
}
