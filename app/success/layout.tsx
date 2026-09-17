import type { Metadata } from 'next';
import { Suspense } from 'react';
import SuccessCaseFollowup from './SuccessCaseFollowup';

export const metadata: Metadata = {
  title: 'Platba přijata — stažení dokumentu',
  robots: { index: false, follow: false, noarchive: true },
};

export default function SuccessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}<Suspense fallback={null}><SuccessCaseFollowup /></Suspense></>;
}
