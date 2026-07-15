import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Potvrzení odběru',
  robots: { index: false, follow: false },
};

export default function NewsletterConfirmationLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
