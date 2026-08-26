import type { Metadata } from 'next';
import ProductSchemas from '@/app/components/seo/ProductSchemas';
import { SITE_URL } from '@/lib/seo/site';

const BASE_URL = SITE_URL;

export const metadata: Metadata = {
  title: 'Smlouva o poskytování služeb online 2026 | PDF ke stažení',
  description:
    'Vytvořte smlouvu o poskytování služeb online. Praktický dokument pro jednorázové i opakované služby s výstupem PDF a volitelně DOCX.',
  keywords: [
    'smlouva o poskytování služeb',
    'smlouva o službách vzor 2026',
    'freelancer smlouva',
    'smlouva o službách online',
  ],
  alternates: { canonical: `${BASE_URL}/sluzby` },
  openGraph: {
    title: 'Smlouva o poskytování služeb online 2026 | PDF ke stažení',
    description:
      'Vytvořte smlouvu o poskytování služeb online. Praktický dokument pro jednorázové i opakované služby s výstupem PDF a volitelně DOCX.',
    url: `${BASE_URL}/sluzby`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SmlouvaHned - smluvni dokument online' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smlouva o poskytování služeb online 2026 | PDF ke stažení',
    description: 'Vytvořte smlouvu o poskytování služeb online pro jednorázové i opakované služby.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProductSchemas
        appName="Smlouva o poskytování služeb — formulář online"
        slug="/sluzby"
        description="Online generátor smlouvy o poskytování služeb dle § 2430 OZ. SLA, fakturace, mlčenlivost, IP."
        breadcrumbLabel="Smlouva o poskytování služeb"
      />
      {children}
    </>
  );
}
