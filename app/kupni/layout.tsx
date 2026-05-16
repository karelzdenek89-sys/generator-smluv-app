import type { Metadata } from 'next';
import ProductSchemas from '@/app/components/seo/ProductSchemas';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Vytvořit kupní smlouvu na věc — formulář | SmlouvaHned',
  description:
    'Formulář pro kupní smlouvu na movitou věc. Strany, popis věci, cena, předání — PDF ihned. Od 99 Kč.',
  keywords: [
    'vytvořit kupní smlouvu',
    'kupní smlouva formulář',
    'kupní smlouva movitá věc generátor',
    'kupní smlouva PDF',
  ],
  alternates: { canonical: `${BASE_URL}/kupni` },
  openGraph: {
    title: 'Vytvořit kupní smlouvu na věc — formulář | SmlouvaHned',
    description: 'Kupní smlouva na movitou věc v PDF ihned. Od 99 Kč.',
    url: `${BASE_URL}/kupni`,
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProductSchemas
        appName="Kupní smlouva na věc — formulář online"
        slug="/kupni"
        description="Online generátor kupní smlouvy na movitou věc dle § 2079 OZ. Popis věci, cena, předání."
        breadcrumbLabel="Kupní smlouva na věc"
      />
      {children}
    </>
  );
}
