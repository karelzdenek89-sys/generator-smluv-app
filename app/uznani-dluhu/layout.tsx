import type { Metadata } from 'next';
import ProductSchemas from '@/app/components/seo/ProductSchemas';
import { SITE_URL } from '@/lib/seo/site';

const BASE_URL = SITE_URL;

export const metadata: Metadata = {
  title: 'Uznání dluhu online 2026',
  description:
    'Vytvořte uznání dluhu online dle § 2053 OZ. Obnoví desetiletou promlčecí dobu, umožní sjednat splátky i smluvní pokutu. PDF ihned ke stažení, od 99 Kč.',
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
  twitter: {
    card: 'summary_large_image',
    title: 'Uznání dluhu online 2026',
    description: 'Uznání dluhu dle § 2053 OZ se splátkovým kalendářem. PDF ihned. Od 99 Kč.',
    images: ['/og-image.png'],
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
