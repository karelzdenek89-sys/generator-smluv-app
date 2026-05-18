import { Suspense } from 'react';

export default function CustomerZoneLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="min-h-screen bg-[#05080f]" />}>{children}</Suspense>;
}
