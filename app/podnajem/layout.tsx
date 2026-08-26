import type { Metadata } from 'next';
import ProductSchemas from '@/app/components/seo/ProductSchemas';
import { getExpatContractHreflangAlternates } from '@/lib/i18n/expat-hreflang';
import { SITE_URL } from '@/lib/seo/site';

const BASE_URL = SITE_URL;

export const metadata: Metadata = {
  title: 'Podnájemní smlouva online 2026',
  description:
    'Podnájemní smlouva pro nájemce přenechávající byt podnájemci. Souhlas pronajímatele, kauce, PDF. English & Ukrainian guided forms.',
  keywords: [
    'podnájemní smlouva online',
    'podnájemní smlouva vzor 2026',
    'podnájem bytu smlouva',
    'sublease agreement Czech Republic',
    'podnájemní smlouva English',
  ],
  alternates: getExpatContractHreflangAlternates('sublease'),
  openGraph: {
    title: 'Podnájemní smlouva online 2026',
    description: 'Podnájemní smlouva pro přenechání bytu podnájemci. PDF ihned. Od 99 Kč.',
    url: `${BASE_URL}/podnajem`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SmlouvaHned - smluvni dokument online' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Podnájemní smlouva online 2026',
    description: 'Podnájemní smlouva pro přenechání bytu podnájemci. PDF ihned. Od 99 Kč.',
    images: ['/og-image.png'],
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
