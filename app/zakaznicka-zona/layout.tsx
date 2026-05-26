import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Moje dokumenty',
  robots: { index: false, follow: false },
};

export default function CustomerZoneLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="min-h-screen bg-[#05080f]" />}>{children}</Suspense>;
}
