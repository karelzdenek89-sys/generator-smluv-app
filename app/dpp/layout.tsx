import type { Metadata } from 'next';
import ProductSchemas from '@/app/components/seo/ProductSchemas';
import { getExpatContractHreflangAlternates } from '@/lib/i18n/expat-hreflang';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Dohoda o provedení práce (DPP) online 2026',
  description:
    'DPP pro brigády a jednorázové práce. Max. 300 hod./rok. Formulář, PDF ke stažení dle zákoníku práce 2026. English & Ukrainian guided forms.',
  keywords: [
    'DPP 2026',
    'dohoda o provedení práce vzor',
    'DPP online',
    'dohoda o provedení práce formulář',
    'DPP agreement Czech Republic',
    'dohoda o provedení práce English',
  ],
  alternates: getExpatContractHreflangAlternates('dpp'),
  openGraph: {
    title: 'Dohoda o provedení práce (DPP) online 2026',
    description: 'DPP pro brigády do 300 hod./rok. PDF dle zákoníku práce 2026. Od 99 Kč.',
    url: `${BASE_URL}/dpp`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SmlouvaHned - smluvni dokument online' }],
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
