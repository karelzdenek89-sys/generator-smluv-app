import type { Metadata } from 'next';
import ProductSchemas from '@/app/components/seo/ProductSchemas';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Smlouva o spolupráci online 2026 | SmlouvaHned',
  description:
    'Smlouva o spolupráci OSVČ nebo firem. Podíl na výnosech, IP práva, mlčenlivost, exit klauzule. Od 99 Kč.',
  keywords: [
    'smlouva o spolupráci vzor 2026',
    'smlouva o spolupráci OSVČ',
    'smlouva o spolupráci online',
    'smlouva o obchodní spolupráci',
  ],
  alternates: { canonical: `${BASE_URL}/spoluprace` },
  openGraph: {
    title: 'Smlouva o spolupráci online 2026 | SmlouvaHned',
    description: 'Smlouva o spolupráci s IP právy a exit klauzulemi. PDF ihned. Od 99 Kč.',
    url: `${BASE_URL}/spoluprace`,
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProductSchemas
        appName="Smlouva o spolupráci — formulář online"
        slug="/spoluprace"
        description="Online generátor smlouvy o spolupráci. Odměna, podíl, IP, mlčenlivost, ukončení."
        breadcrumbLabel="Smlouva o spolupráci"
      />
      {children}
    </>
  );
}
