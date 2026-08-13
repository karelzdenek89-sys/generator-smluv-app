import type { Metadata } from 'next';
import ProductSchemas from '@/app/components/seo/ProductSchemas';
import { MonetizationPolicyProvider } from '@/app/components/useMonetizationPolicy';
import { getExpatContractHreflangAlternates } from '@/lib/i18n/expat-hreflang';
import { getMonetizationPolicy } from '@/lib/monetization-policy';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.smlouvahned.cz';
const DPP_POLICY = getMonetizationPolicy('dpp', 'cs');
const FREE_BASIC_DPP = DPP_POLICY.mode === 'free_experiment';

export const metadata: Metadata = {
  title: FREE_BASIC_DPP
    ? 'DPP 2026 zdarma — dohoda o provedení práce online v PDF'
    : 'DPP online 2026 — dohoda o provedení práce v PDF',
  description:
    FREE_BASIC_DPP
      ? 'Vytvořte základní DPP 2026 online zdarma. Formulář pokryje limit 300 hodin, odměnu i povinné náležitosti; PDF stáhnete bez registrace.'
      : 'Vytvořte DPP online pro brigádu nebo jednorázovou práci. Formulář pokryje limit 300 hodin, odměnu i povinné náležitosti; hotové PDF stáhnete ihned.',
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
    title: FREE_BASIC_DPP ? 'DPP 2026 zdarma — online v PDF' : 'DPP online 2026 — dohoda o provedení práce v PDF',
    description: FREE_BASIC_DPP
      ? 'Základní DPP pro brigády do 300 hod./rok zdarma. PDF dle zákoníku práce 2026, bez registrace.'
      : 'DPP pro brigády do 300 hod./rok. PDF dle zákoníku práce 2026. Od 99 Kč.',
    url: `${BASE_URL}/dpp`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SmlouvaHned - smluvni dokument online' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: FREE_BASIC_DPP ? 'DPP 2026 zdarma — online v PDF' : 'DPP online 2026 — dohoda o provedení práce v PDF',
    description: FREE_BASIC_DPP
      ? 'Základní DPP pro brigády do 300 hod./rok zdarma. PDF dle zákoníku práce 2026, bez registrace.'
      : 'DPP pro brigády do 300 hod./rok. PDF dle zákoníku práce 2026. Od 99 Kč.',
    images: ['/og-image.png'],
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
        freeBasic={FREE_BASIC_DPP}
      />
      <MonetizationPolicyProvider initialPolicy={DPP_POLICY}>
        {children}
      </MonetizationPolicyProvider>
    </>
  );
}
