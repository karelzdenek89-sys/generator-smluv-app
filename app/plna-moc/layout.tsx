import type { Metadata } from 'next';
import ProductSchemas from '@/app/components/seo/ProductSchemas';
import { getExpatContractHreflangAlternates } from '@/lib/i18n/expat-hreflang';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Plná moc online 2026',
  description:
    'Plná moc obecná, jednorázová nebo ověřená pro zastoupení před úřadem, bankou či v obchodní věci. English & Ukrainian guided forms.',
  keywords: [
    'plná moc online',
    'plná moc vzor 2026',
    'plná moc formulář',
    'power of attorney Czech Republic',
    'plná moc English',
  ],
  alternates: getExpatContractHreflangAlternates('power_of_attorney'),
  openGraph: {
    title: 'Plná moc online 2026',
    description: 'Plná moc obecná, jednorázová nebo ověřená. PDF ihned. Od 99 Kč.',
    url: `${BASE_URL}/plna-moc`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SmlouvaHned - smluvni dokument online' }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProductSchemas
        appName="Plná moc — formulář online"
        slug="/plna-moc"
        description="Online generátor plné moci dle § 441 OZ. Rozsah zmocnění, doba trvání, ověření podpisu."
        breadcrumbLabel="Plná moc"
      />
      {children}
    </>
  );
}
