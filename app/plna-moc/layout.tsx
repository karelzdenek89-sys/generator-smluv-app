import type { Metadata } from 'next';
import ProductSchemas from '@/app/components/seo/ProductSchemas';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Plná moc online 2026 | SmlouvaHned',
  description:
    'Plná moc obecná, jednorázová nebo ověřená pro zastoupení před úřadem, bankou či v obchodní věci. Od 99 Kč.',
  keywords: ['plná moc online', 'plná moc vzor 2026', 'plná moc formulář', 'plná moc ke stažení'],
  alternates: { canonical: `${BASE_URL}/plna-moc` },
  openGraph: {
    title: 'Plná moc online 2026 | SmlouvaHned',
    description: 'Plná moc obecná, jednorázová nebo ověřená. PDF ihned. Od 99 Kč.',
    url: `${BASE_URL}/plna-moc`,
    type: 'website',
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
