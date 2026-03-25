import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Smlouva o zápůjčce online — vzor 2026',
  description: 'Smlouva o půjčce / zápůjčce peněz dle § 2390 OZ. Úroky, splátkový plán a zajištění pohledávky. PDF za 299 Kč.',
  openGraph: {
    title: 'Smlouva o zápůjčce (půjčka) — vzor 2026 | SmlouvaHned',
    description: 'Bezpečná smlouva o půjčce s úroky, splátkovým kalendářem a zajištěním. § 2390 OZ. Od 299 Kč.',
  },
};

export default function PujckaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
