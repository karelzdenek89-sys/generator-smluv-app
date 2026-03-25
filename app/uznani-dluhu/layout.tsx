import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Uznání dluhu online — § 2053 OZ | SmlouvaHned',
  description: 'Vygenerujte uznání dluhu s obnovenením promlčecí lhůty (10 let). Splátky, exekuční doložka, silná ochrana věřitele. Od 299 Kč, PDF ihned.',
  openGraph: {
    title: 'Uznání dluhu online — od 299 Kč | SmlouvaHned',
    description: 'Uznání dluhu dle § 2053 OZ. Obnoví promlčecí lhůtu, silný vymáhací nástroj.',
    url: 'https://smlouvahned.cz/uznani-dluhu',
    siteName: 'SmlouvaHned',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
