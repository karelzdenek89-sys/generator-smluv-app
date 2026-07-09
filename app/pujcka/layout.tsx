import type { Metadata } from 'next';
import ProductSchemas from '@/app/components/seo/ProductSchemas';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Smlouva o zápůjčce online 2026 | PDF ke stažení',
  description:
    'Vytvořte smlouvu o zápůjčce online během několika minut. Praktický dokument pro půjčku peněz s výstupem PDF a volitelně DOCX.',
  keywords: [
    'smlouva o zápůjčce',
    'půjčka smlouva vzor 2026',
    'smlouva o půjčce peněz',
    'zápůjčka smlouva online',
  ],
  alternates: { canonical: `${BASE_URL}/pujcka` },
  openGraph: {
    title: 'Smlouva o zápůjčce online 2026 | PDF ke stažení',
    description:
      'Vytvořte smlouvu o zápůjčce online během několika minut. Praktický dokument pro půjčku peněz s výstupem PDF a volitelně DOCX.',
    url: `${BASE_URL}/pujcka`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SmlouvaHned - smluvni dokument online' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smlouva o zápůjčce online 2026 | PDF ke stažení',
    description: 'Vytvořte smlouvu o zápůjčce online během několika minut. PDF a volitelně DOCX.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProductSchemas
        appName="Smlouva o zápůjčce — formulář online"
        slug="/pujcka"
        description="Online generátor smlouvy o zápůjčce dle § 2390 OZ. Jistina, úrok, splátky, zajištění."
        breadcrumbLabel="Smlouva o zápůjčce"
      />
      {children}
    </>
  );
}
