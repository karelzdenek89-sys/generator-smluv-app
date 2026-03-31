import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Uznání dluhu online 2026 | SmlouvaHned',
  description: 'Uznání dluhu dle § 2053 OZ — obnoví 10letou promlčecí dobu. Splátkový kalendář, smluvní pokuta za prodlení a jasné potvrzení závazku. Od 249 Kč.',
  keywords: ['uznání dluhu vzor 2026', 'uznání dluhu online', 'uznání dluhu formulář', 'uznání závazku smlouva'],
  alternates: { canonical: `${BASE_URL}/uznani-dluhu` },
  openGraph: {
    title: 'Uznání dluhu online 2026 | SmlouvaHned',
    description: 'Uznání dluhu dle § 2053 OZ — obnoví 10letou promlčecí dobu. Splátkový kalendář, smluvní pokuta za prodlení a jasné potvrzení závazku. Od 249 Kč.',
    url: `${BASE_URL}/uznani-dluhu`,
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
