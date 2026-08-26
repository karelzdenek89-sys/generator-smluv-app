import type { Metadata } from 'next';
import ProductSchemas from '@/app/components/seo/ProductSchemas';
import { getExpatContractHreflangAlternates } from '@/lib/i18n/expat-hreflang';
import { SITE_URL } from '@/lib/seo/site';

const BASE_URL = SITE_URL;

export const metadata: Metadata = {
  title: 'Pracovní smlouva 2026 — formulář online',
  description:
    'Pracovní smlouva 2026 dle zákoníku práce. Mzda, pracovní doba, zkušební lhůta — PDF ihned. English & Ukrainian guided forms for foreigners.',
  keywords: [
    'vytvořit pracovní smlouvu',
    'pracovní smlouva formulář',
    'pracovní smlouva generátor',
    'pracovní smlouva PDF',
    'Czech employment contract',
    'pracovní smlouva English',
  ],
  alternates: getExpatContractHreflangAlternates('employment'),
  openGraph: {
    title: 'Pracovní smlouva 2026 — formulář online',
    description: 'Pracovní smlouva 2026 dle zákoníku práce v PDF ihned. Od 99 Kč.',
    url: `${BASE_URL}/pracovni`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SmlouvaHned - smluvni dokument online' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pracovní smlouva 2026 - formulář online',
    description: 'Pracovní smlouva 2026 dle zákoníku práce v PDF ihned. Od 99 Kč.',
    images: ['/og-image.png'],
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
