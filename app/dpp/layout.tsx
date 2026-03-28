import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Dohoda o provedení práce (DPP) online 2026 | SmlouvaHned',
  description: 'DPP pro brigády a jednorázové práce. Max. 300 hod./rok. Formulář, PDF ke stažení. Zákoník práce 2026. Od 249 Kč.',
  keywords: ['DPP 2026', 'dohoda o provedení práce vzor', 'DPP online', 'dohoda o provedení práce formulář'],
  alternates: { canonical: `${BASE_URL}/dpp` },
  openGraph: {
    title: 'Dohoda o provedení práce (DPP) online 2026 | SmlouvaHned',
    description: 'DPP pro brigády a jednorázové práce. Max. 300 hod./rok. Formulář, PDF ke stažení. Zákoník práce 2026. Od 249 Kč.',
    url: `${BASE_URL}/dpp`,
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
