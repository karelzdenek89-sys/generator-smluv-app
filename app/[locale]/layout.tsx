import { notFound } from 'next/navigation';
import ExpatLocaleSchemas from '@/app/components/seo/ExpatLocaleSchemas';
import { getPublicLocalePath, normalizeLocale } from '@/lib/locale';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function ExpatLocaleLayout({ children, params }: Props) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);
  const publicLocale = getPublicLocalePath(locale);
  if (locale !== 'en' && locale !== 'ua') notFound();
  if (rawLocale !== publicLocale) notFound();

  return (
    <>
      <ExpatLocaleSchemas locale={locale} />
      {children}
    </>
  );
}
