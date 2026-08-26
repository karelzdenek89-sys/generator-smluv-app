import type { Metadata } from 'next';
import ProductSchemas from '@/app/components/seo/ProductSchemas';
import { SITE_URL } from '@/lib/seo/site';

const BASE_URL = SITE_URL;

export const metadata: Metadata = {
  title: 'Smlouva o dílo 2026 — formulář online',
  description:
    'Vytvořte smlouvu o dílo online dle § 2586 OZ. Vymezení díla, cena, termín, předání i sankce za prodlení. PDF připravené k podpisu ihned, od 99 Kč.',
  keywords: [
    'vytvořit smlouvu o dílo',
    'smlouva o dílo formulář',
    'smlouva o dílo generátor',
    'smlouva o dílo PDF',
  ],
  alternates: { canonical: `${BASE_URL}/smlouva-o-dilo` },
  openGraph: {
    title: 'Smlouva o dílo 2026 — formulář online',
    description: 'Smlouva o dílo 2026 s termíny, cenou a sankcemi. PDF ihned. Od 99 Kč.',
    url: `${BASE_URL}/smlouva-o-dilo`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SmlouvaHned - smluvni dokument online' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smlouva o dílo 2026 - formulář online',
    description: 'Smlouva o dílo 2026 s termíny, cenou a sankcemi. PDF ihned. Od 99 Kč.',
    images: ['/og-image.png'],
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
