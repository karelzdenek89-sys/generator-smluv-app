import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Pracovní smlouva online 2026 | SmlouvaHned',
  description: 'Pracovní smlouva dle zákoníku práce. Mzda, pracovní doba, zkušební doba — všechny zákonné náležitosti. Od 249 Kč.',
  keywords: ['pracovní smlouva online', 'pracovní smlouva vzor 2026', 'pracovní smlouva formulář', 'pracovní smlouva ke stažení'],
  alternates: { canonical: `${BASE_URL}/pracovni` },
  openGraph: {
    title: 'Pracovní smlouva online 2026 | SmlouvaHned',
    description: 'Pracovní smlouva dle zákoníku práce. Mzda, pracovní doba, zkušební doba — všechny zákonné náležitosti. Od 249 Kč.',
    url: `${BASE_URL}/pracovni`,
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
