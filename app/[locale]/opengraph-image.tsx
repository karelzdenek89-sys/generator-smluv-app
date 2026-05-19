import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderExpatHubOgImage,
} from '@/lib/og-image-template';
import { getPublicLocalePath, normalizeLocale } from '@/lib/locale';

export const alt = 'SmlouvaHned expat contract hub';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ua' }];
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function OgImage({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);
  const publicLocale = getPublicLocalePath(locale);
  if (locale === 'cs' || rawLocale !== publicLocale) {
    return new Response(null, { status: 404 });
  }

  return renderExpatHubOgImage(locale);
}
