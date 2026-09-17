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

  const htmlLang = locale === 'ua' ? 'uk' : 'en';

  /**
   * Jazyk obsahu je v odpovědi serveru, ne až po spuštění JavaScriptu.
   *
   * Kořenový <html lang> je staticky „cs“, protože celý web sdílí jeden root
   * layout a udělat ho závislým na requestu by zrušilo statické generování
   * všech českých stránek. Skript v <head> (LOCALE_BOOTSTRAP_SCRIPT) srovná
   * <html lang> hned při parsování, tenhle wrapper navíc nese správný jazyk
   * i bez JavaScriptu — odečítačky obrazovky a překladače berou nejbližší
   * nadřazený `lang`, takže /en a /ua se už nečtou jako česká stránka.
   */
  return (
    <div lang={htmlLang} data-locale-root={locale}>
      <ExpatLocaleSchemas locale={locale} />
      {children}
    </div>
  );
}
