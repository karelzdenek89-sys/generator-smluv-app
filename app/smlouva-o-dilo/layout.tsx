import type { Metadata } from 'next';
import ProductSchemas from '@/app/components/seo/ProductSchemas';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Smlouva o dílo 2026 — formulář online | SmlouvaHned',
  description:
    'Smlouva o dílo 2026 dle § 2586 OZ. Dílo, cena, termín a sankce — PDF ihned ke stažení. Od 99 Kč.',
  keywords: [
    'vytvořit smlouvu o dílo',
    'smlouva o dílo formulář',
    'smlouva o dílo generátor',
    'smlouva o dílo PDF',
  ],
  alternates: { canonical: `${BASE_URL}/smlouva-o-dilo` },
  openGraph: {
    title: 'Smlouva o dílo 2026 — formulář online | SmlouvaHned',
    description: 'Smlouva o dílo 2026 s termíny, cenou a sankcemi. PDF ihned. Od 99 Kč.',
    url: `${BASE_URL}/smlouva-o-dilo`,
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProductSchemas
        appName="Smlouva o dílo — formulář online"
        slug="/smlouva-o-dilo"
        description="Online generátor smlouvy o dílo dle § 2586 OZ. Dílo, cena, termíny, přejímka, vady."
        breadcrumbLabel="Smlouva o dílo"
      />
      {children}
    </>
  );
}
