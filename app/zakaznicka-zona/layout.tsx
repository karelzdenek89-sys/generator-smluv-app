import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zákaznická zóna — vaše dokumenty | SmlouvaHned',
  robots: { index: false, follow: false },
};

export default function ZakaznickaZonaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
