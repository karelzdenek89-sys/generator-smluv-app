import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Smlouva o zápůjčce (půjčka) online 2026 | SmlouvaHned',
  description: 'Sestavte smlouvu o zápůjčce peněz online. Splátky, úroky, zajištění — vše zachyceno v PDF. Od 249 Kč.',
  keywords: ['smlouva o zápůjčce', 'půjčka smlouva vzor 2026', 'smlouva o půjčce peněz', 'zápůjčka smlouva online'],
  alternates: { canonical: `${BASE_URL}/pujcka` },
  openGraph: {
    title: 'Smlouva o zápůjčce (půjčka) online 2026 | SmlouvaHned',
    description: 'Sestavte smlouvu o zápůjčce peněz online. Splátky, úroky, zajištění — vše zachyceno v PDF. Od 249 Kč.',
    url: `${BASE_URL}/pujcka`,
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
