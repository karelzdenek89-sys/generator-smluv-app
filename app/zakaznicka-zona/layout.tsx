import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Moje dokumenty',
  robots: { index: false, follow: false },
};

export default function CustomerZoneLayout({ children }: { children: React.ReactNode }) {
  return children;
}
