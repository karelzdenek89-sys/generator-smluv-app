import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Redirecting | SmlouvaHned',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://www.smlouvahned.cz/en' },
};

export default function DeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
