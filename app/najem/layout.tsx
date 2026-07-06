import type { Metadata } from 'next';
import ProductSchemas from '@/app/components/seo/ProductSchemas';
import { getExpatContractHreflangAlternates } from '@/lib/i18n/expat-hreflang';
import { LEASE_CS_LANDING_FAQ } from '@/lib/seo/lease-builder-seo';
import { faqPageSchema, jsonLdScript } from '@/lib/schemas';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.smlouvahned.cz';

const PAGE_TITLE = 'Nájemní smlouva online 2026 | PDF/DOCX ke stažení';
const PAGE_DESCRIPTION =
  'Vytvořte nájemní smlouvu na byt nebo dům online. Praktický vzor pro rok 2026 s výstupem ve formátu PDF a volitelně DOCX, bez registrace a bez předplatného.';

export const metadata: Metadata = {
  title: 'Nájemní smlouva online 2026 | PDF/DOCX ke stažení',
  description: PAGE_DESCRIPTION,
  keywords: [
    'nájemní smlouva 2026',
    'vzor nájemní smlouvy 2026',
    'nájemní smlouva na byt 2026',
    'nájemní smlouva online',
    'nájemní smlouva vzor 2026',
    'nájemní smlouva PDF ke stažení',
    'nájemní smlouva Word',
    'vzor nájemní smlouvy',
    'nájemní smlouva na dům',
    'rental agreement Czech Republic',
  ],
  alternates: getExpatContractHreflangAlternates('lease'),
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: `${BASE_URL}/najem`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SmlouvaHned - smluvni dokument online' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ['/og-image.png'],
  },
};

const leaseFaqSchema = faqPageSchema(
  LEASE_CS_LANDING_FAQ.map((item) => ({ question: item.q, answer: item.a })),
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProductSchemas
        appName="Nájemní smlouva — formulář online"
        slug="/najem"
        description="Online generátor nájemní smlouvy na byt dle § 2235 a násl. OZ. Kauce, nájemné, valorizace, předávací protokol."
        breadcrumbLabel="Nájemní smlouva"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(leaseFaqSchema) }}
      />
      {children}
    </>
  );
}
