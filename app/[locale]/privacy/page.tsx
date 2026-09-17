import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LegalDocumentPage from '@/app/components/legal/LegalDocumentPage';
import { getPrivacyDocument } from '@/lib/legal/privacy-i18n';
import { getPublicLocalePath, normalizeLocale } from '@/lib/locale';
import { SITE_URL } from '@/lib/seo/site';

type Props = { params: Promise<{ locale: string }> };

function resolveLocale(rawLocale: string): 'en' | 'ua' | null {
  const locale = normalizeLocale(rawLocale);
  if (locale === 'cs') return null;
  if (rawLocale !== getPublicLocalePath(locale)) return null;
  return locale;
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ua' }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  if (!locale) return { title: 'SmlouvaHned' };
  const document = getPrivacyDocument(locale);
  return {
    title: document.metaTitle,
    description: document.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/${locale}/privacy`,
      languages: {
        cs: `${SITE_URL}/gdpr`,
        en: `${SITE_URL}/en/privacy`,
        uk: `${SITE_URL}/ua/privacy`,
        'x-default': `${SITE_URL}/gdpr`,
      },
    },
    openGraph: {
      title: document.metaTitle,
      description: document.metaDescription,
      url: `${SITE_URL}/${locale}/privacy`,
      siteName: 'SmlouvaHned',
      type: 'website',
      locale: locale === 'ua' ? 'uk_UA' : 'en_US',
    },
  };
}

export default async function LocalizedPrivacyPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  if (!locale) notFound();
  return <LegalDocumentPage document={getPrivacyDocument(locale)} />;
}
