import type { Metadata } from 'next';
import ProductSchemas from '@/app/components/seo/ProductSchemas';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Smlouva o poskytování služeb online 2026 | SmlouvaHned',
  description:
    'Smlouva o poskytování služeb pro freelancery a agentury. SLA, IP práva, mlčenlivost. Od 99 Kč.',
  keywords: [
    'smlouva o poskytování služeb',
    'smlouva o službách vzor 2026',
    'freelancer smlouva',
    'smlouva o službách online',
  ],
  alternates: { canonical: `${BASE_URL}/sluzby` },
  openGraph: {
    title: 'Smlouva o poskytování služeb online 2026 | SmlouvaHned',
    description: 'Smlouva o službách s SLA, IP právy a mlčenlivostí. PDF ihned. Od 99 Kč.',
    url: `${BASE_URL}/sluzby`,
    type: 'website',
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
