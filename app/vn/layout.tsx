import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Redirecting',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://www.smlouvahned.cz/en' },
};

export default function VnLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
