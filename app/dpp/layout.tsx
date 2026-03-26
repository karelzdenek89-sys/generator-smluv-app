import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dohoda o provedení práce (DPP) online — § 75 ZP | SmlouvaHned',
  description: 'Vygenerujte dohodu o provedení práce rychle a správně. Brigády, jednorázové úkoly, max. 300 hod./rok. Dle zákoníku práce 2026. Od 249 Kč.',
  openGraph: {
    title: 'DPP — Dohoda o provedení práce online | SmlouvaHned',
    description: 'Právně správná DPP dle § 75 ZP. Vyplňte formulář, stáhněte PDF ihned.',
    url: 'https://smlouvahned.cz/dpp',
    siteName: 'SmlouvaHned',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
