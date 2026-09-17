import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Platba přijata — stažení dokumentu',
  robots: { index: false, follow: false, noarchive: true },
};

export default function SuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
