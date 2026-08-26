import type { Metadata } from 'next';
import ProductSchemas from '@/app/components/seo/ProductSchemas';
import { SITE_URL } from '@/lib/seo/site';

const BASE_URL = SITE_URL;

export const metadata: Metadata = {
  title: 'Smlouva o spolupráci online 2026',
  description:
    'Vytvořte smlouvu o spolupráci pro OSVČ i firmy online. Předmět spolupráce, odměna, autorská práva, mlčenlivost a ukončení. PDF ihned, od 99 Kč.',
  keywords: [
    'smlouva o spolupráci vzor 2026',
    'smlouva o spolupráci OSVČ',
    'smlouva o spolupráci online',
    'smlouva o obchodní spolupráci',
  ],
  alternates: { canonical: `${BASE_URL}/spoluprace` },
  openGraph: {
    title: 'Smlouva o spolupráci online 2026',
    description: 'Smlouva o spolupráci s IP právy a exit klauzulemi. PDF ihned. Od 99 Kč.',
    url: `${BASE_URL}/spoluprace`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SmlouvaHned - smluvni dokument online' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smlouva o spolupráci online 2026',
    description: 'Smlouva o spolupráci s IP právy a exit klauzulemi. PDF ihned. Od 99 Kč.',
    images: ['/og-image.png'],
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
