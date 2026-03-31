import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Nájemní smlouva online 2026 | SmlouvaHned',
  description: 'Nájemní smlouva na byt či dům podle § 2235 OZ. Pokrývá nájemné, kauce, předávací protokol a práva stran. PDF ihned ke stažení. Od 249 Kč.',
  keywords: ['nájemní smlouva online', 'nájemní smlouva vzor 2026', 'nájemní smlouva byt', 'nájemní smlouva ke stažení'],
  alternates: { canonical: `${BASE_URL}/najem` },
  openGraph: {
    title: 'Nájemní smlouva online 2026 | SmlouvaHned',
    description: 'Nájemní smlouva na byt či dům. Právně závazná, podle občanského zákoníku. Od 249 Kč.',
    url: `${BASE_URL}/najem`,
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
