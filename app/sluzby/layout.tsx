import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Smlouva o poskytování služeb online 2026 | SmlouvaHned',
  description: 'Smlouva o poskytování služeb pro freelancery a agentury. SLA, IP práva, mlčenlivost. PDF ihned. Od 249 Kč.',
  keywords: ['smlouva o poskytování služeb', 'smlouva o službách vzor 2026', 'freelancer smlouva', 'smlouva o službách online'],
  alternates: { canonical: `${BASE_URL}/sluzby` },
  openGraph: {
    title: 'Smlouva o poskytování služeb online 2026 | SmlouvaHned',
    description: 'Smlouva o poskytování služeb pro freelancery a agentury. SLA, IP práva, mlčenlivost. PDF ihned. Od 249 Kč.',
    url: `${BASE_URL}/sluzby`,
    type: 'website',
  },
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Smlouva o poskytování služeb — formulář online',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: 'https://smlouvahned.cz/sluzby',
  inLanguage: 'cs',
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '249',
    highPrice: '749',
    priceCurrency: 'CZK',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema).replace(/</g, '\\u003c') }}
      />
      {children}
    </>
  );
}
