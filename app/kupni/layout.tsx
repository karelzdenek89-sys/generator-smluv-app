import type { Metadata } from 'next';
import ProductSchemas from '@/app/components/seo/ProductSchemas';
import { SITE_URL } from '@/lib/seo/site';

const BASE_URL = SITE_URL;

export const metadata: Metadata = {
  title: 'Kupní smlouva na věc 2026 — formulář online',
  description:
    'Vytvořte kupní smlouvu na movitou věc online dle § 2079 OZ. Strany, popis věci, kupní cena, předání i odpovědnost za vady. PDF ihned, od 99 Kč.',
  keywords: [
    'vytvořit kupní smlouvu',
    'kupní smlouva formulář',
    'kupní smlouva movitá věc generátor',
    'kupní smlouva PDF',
  ],
  alternates: { canonical: `${BASE_URL}/kupni` },
  openGraph: {
    title: 'Kupní smlouva na věc 2026 — formulář online',
    description: 'Kupní smlouva na movitou věc 2026 v PDF ihned. Od 99 Kč.',
    url: `${BASE_URL}/kupni`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SmlouvaHned - smluvni dokument online' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kupní smlouva na věc 2026 - formulář online',
    description: 'Kupní smlouva na movitou věc 2026 v PDF ihned. Od 99 Kč.',
    images: ['/og-image.png'],
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
