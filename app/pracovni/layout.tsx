import type { Metadata } from 'next';
import ProductSchemas from '@/app/components/seo/ProductSchemas';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Pracovní smlouva 2026 — formulář online | SmlouvaHned',
  description:
    'Pracovní smlouva 2026 dle zákoníku práce. Mzda, pracovní doba, zkušební lhůta — PDF ihned ke stažení. Od 99 Kč.',
  keywords: [
    'vytvořit pracovní smlouvu',
    'pracovní smlouva formulář',
    'pracovní smlouva generátor',
    'pracovní smlouva PDF',
  ],
  alternates: { canonical: `${BASE_URL}/pracovni` },
  openGraph: {
    title: 'Pracovní smlouva 2026 — formulář online | SmlouvaHned',
    description: 'Pracovní smlouva 2026 dle zákoníku práce v PDF ihned. Od 99 Kč.',
    url: `${BASE_URL}/pracovni`,
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProductSchemas
        appName="Pracovní smlouva — formulář online"
        slug="/pracovni"
        description="Online generátor pracovní smlouvy dle zákoníku práce. Druh práce, místo, mzda, zkušební doba."
        breadcrumbLabel="Pracovní smlouva"
      />
      {children}
    </>
  );
}
