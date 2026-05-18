import { notFound } from 'next/navigation';
import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderExpatHubOgImage,
} from '@/lib/og-image-template';
import { getPublicLocalePath, normalizeLocale } from '@/lib/locale';

export const runtime = 'edge';
export const alt = 'SmlouvaHned expat contract hub';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function OgImage({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);
  const publicLocale = getPublicLocalePath(locale);
  if (locale === 'cs' || rawLocale !== publicLocale) notFound();

  return renderExpatHubOgImage(locale);
}
