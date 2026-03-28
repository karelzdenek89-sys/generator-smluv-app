import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Uznání dluhu online 2026 | SmlouvaHned',
  description: 'Uznání dluhu s promlčecí lhůtou 10 let. Splátky, smluvní pokuta, exekuční doložka. PDF ihned. Od 249 Kč.',
  keywords: ['uznání dluhu vzor 2026', 'uznání dluhu online', 'uznání dluhu formulář', 'uznání závazku smlouva'],
  alternates: { canonical: `${BASE_URL}/uznani-dluhu` },
  openGraph: {
    title: 'Uznání dluhu online 2026 | SmlouvaHned',
    description: 'Uznání dluhu s promlčecí lhůtou 10 let. Splátky, smluvní pokuta, exekuční doložka. PDF ihned. Od 249 Kč.',
    url: `${BASE_URL}/uznani-dluhu`,
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
