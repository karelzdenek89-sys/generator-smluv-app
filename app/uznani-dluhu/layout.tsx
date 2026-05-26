import type { Metadata } from 'next';
import ProductSchemas from '@/app/components/seo/ProductSchemas';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Uznání dluhu online 2026',
  description:
    'Uznání dluhu dle § 2053 OZ — obnoví 10letou promlčecí dobu. Splátky a smluvní pokuta. Od 99 Kč.',
  keywords: [
    'uznání dluhu vzor 2026',
    'uznání dluhu online',
    'uznání dluhu formulář',
    'uznání závazku smlouva',
  ],
  alternates: { canonical: `${BASE_URL}/uznani-dluhu` },
  openGraph: {
    title: 'Uznání dluhu online 2026',
    description: 'Uznání dluhu dle § 2053 OZ se splátkovým kalendářem. PDF ihned. Od 99 Kč.',
    url: `${BASE_URL}/uznani-dluhu`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SmlouvaHned - smluvni dokument online' }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProductSchemas
        appName="Uznání dluhu — formulář online"
        slug="/uznani-dluhu"
        description="Online generátor uznání dluhu dle § 2053 OZ. Splátky, úrok z prodlení, smluvní pokuta."
        breadcrumbLabel="Uznání dluhu"
      />
      {children}
    </>
  );
}
