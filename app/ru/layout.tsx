import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Redirecting | SmlouvaHned',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://smlouvahned.cz/en' },
};

export default function RuLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
