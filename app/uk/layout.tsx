import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Redirecting | SmlouvaHned',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://smlouvahned.cz/ua' },
};

export default function UkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
