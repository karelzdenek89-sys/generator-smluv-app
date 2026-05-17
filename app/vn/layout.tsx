import type { Metadata } from 'next';
import { makeLandingMetadata } from '@/lib/i18n/landings';

export const metadata: Metadata = makeLandingMetadata('vn');

export default function VnLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
