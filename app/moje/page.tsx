import type { Metadata } from 'next';
import AccountHub from './AccountHub';

export const metadata: Metadata = {
  title: 'Můj účet',
  description: 'Dobrovolný zákaznický účet SmlouvaHned pro bezpečný přístup k dokumentům, případům a nastavení profilu.',
  robots: { index: false, follow: false, noarchive: true, googleBot: { index: false, follow: false, noarchive: true } },
};

export default function AccountPage() {
  return <AccountHub />;
}
