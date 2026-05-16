import type { Metadata } from 'next';
import ProductSchemas from '@/app/components/seo/ProductSchemas';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Dohoda o provedení práce (DPP) online 2026 | SmlouvaHned',
  description:
    'DPP pro brigády a jednorázové práce. Max. 300 hod./rok. Formulář, PDF ke stažení dle zákoníku práce 2026.',
  keywords: [
    'DPP 2026',
    'dohoda o provedení práce vzor',
    'DPP online',
    'dohoda o provedení práce formulář',
  ],
  alternates: { canonical: `${BASE_URL}/dpp` },
  openGraph: {
    title: 'Dohoda o provedení práce (DPP) online 2026 | SmlouvaHned',
    description: 'DPP pro brigády do 300 hod./rok. PDF dle zákoníku práce 2026. Od 99 Kč.',
    url: `${BASE_URL}/dpp`,
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProductSchemas
        appName="Dohoda o provedení práce (DPP) — formulář online"
        slug="/dpp"
        description="Online generátor DPP dle § 75 a násl. zákoníku práce. Hodinová odměna, doba trvání, druh práce."
        breadcrumbLabel="Dohoda o provedení práce (DPP)"
      />
      {children}
    </>
  );
}
