import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import {
  APP_LOCALES,
  EXPAT_CONTRACT_ROUTES,
  getExpatContractCapability,
  getPublicLocalePath,
  normalizeLocale,
  withLocale,
  type AppLocale,
} from '@/lib/locale';
import {
  getLocalizedBuilderCopy,
  getOtherContractsForLocale,
  OTHER_CONTRACTS_CZECH_ONLY_HINT,
  type ExpatContractType,
} from '@/lib/i18n/expat-locale-copy';
import { getExpatSeoHref } from '@/lib/i18n/expat-seo-landings';
import ExpatLocaleSchemas from '@/app/components/seo/ExpatLocaleSchemas';
import { LANDINGS } from '@/lib/i18n/landings';

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

const pageCopy: Record<Exclude<AppLocale, 'cs'>, {
  eyebrow: string;
  title: string;
  subtitle: string;
  coreHeading: string;
  coreSub: string;
  otherHeading: string;
  supportedBadge: string;
  czechBadge: string;
  cta: string;
  learnMore?: string;
  legalStrip?: string;
}> = {
  en: {
    learnMore: 'Learn more',
    eyebrow: 'Contracts for foreigners in the Czech Republic',
    title: 'SmlouvaHned for expats',
    subtitle:
      'Create core Czech contracts with English form guidance. The Czech wording remains primary; selected core contracts may include an explanatory English translation in the PDF (not certified or official).',
    coreHeading: 'Most used contracts for foreigners in the Czech Republic',
    coreSub: 'Housing, work, representation and buying a car are covered first. Other documents stay available in Czech.',
    otherHeading: 'Other Czech documents available',
    supportedBadge: 'English-guided form · Czech contract PDF',
    czechBadge: 'Available in Czech',
    cta: 'Open form',
  },
  ua: {
    eyebrow: 'Документи для іноземців у Чехії',
    title: 'SmlouvaHned для іноземців',
    subtitle:
      'Основні чеські договори з підказками українською. Чеське формулювання залишається основним; для оренди — пояснювальний український додаток у PDF (не офіційний).',
    coreHeading: 'Найпотрібніші договори для іноземців у Чехії',
    coreSub: 'Житло, робота, довіреність і купівля авто — на першому місці.',
    otherHeading: 'Інші документи лише чеською',
    supportedBadge: 'Форма українською · PDF чеською',
    czechBadge: 'Доступно чеською',
    cta: 'Відкрити форму',
    learnMore: 'Детальніше',
    legalStrip:
      'Не юридична консультація. Не імміграційна консультація. Не офіційний переклад. Перевага має чеське формулювання.',
  },
};

const localeLinks = [
  { locale: 'en', href: '/en', flag: '🇬🇧', label: 'EN' },
  { locale: 'ua', href: '/ua', flag: '🇺🇦', label: 'UA' },
] as const;

const coreContracts = (
  [
    'lease',
    'sublease',
    'employment',
    'dpp',
    'power_of_attorney',
    'car_sale',
  ] as const
).map((capabilityKey) => ({
  href: EXPAT_CONTRACT_ROUTES[capabilityKey],
  capabilityKey,
  seoHrefEn: getExpatSeoHref('en', capabilityKey),
  seoHrefUa: getExpatSeoHref('ua', capabilityKey),
}));

function coreContractCopy(locale: AppLocale, key: ExpatContractType) {
  if (locale === 'en' || locale === 'ua') {
    const localized = getLocalizedBuilderCopy(key, locale);
    if (localized) return { title: localized.title, description: localized.description };
  }
  const fallback = getLocalizedBuilderCopy(key, 'en');
  return {
    title: fallback?.title ?? key,
    description: fallback?.description ?? '',
  };
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);
  const publicLocale = getPublicLocalePath(locale);
  if (locale === 'cs' || ![locale, publicLocale].includes(rawLocale as AppLocale)) return { title: 'SmlouvaHned' };
  const landing = LANDINGS[locale];
  return {
    title: landing.htmlTitle,
    description: landing.metaDescription,
    keywords: landing.keywords,
    alternates: {
      canonical: `https://smlouvahned.cz/${publicLocale}`,
      languages: {
        cs: 'https://smlouvahned.cz',
        en: 'https://smlouvahned.cz/en',
        uk: 'https://smlouvahned.cz/ua',
        'x-default': 'https://smlouvahned.cz',
      },
    },
    openGraph: {
      title: landing.ogTitle,
      description: landing.ogDescription,
      url: `https://smlouvahned.cz/${publicLocale}`,
      type: 'website',
    },
  };
}

export function generateStaticParams() {
  return APP_LOCALES
    .filter((locale) => locale !== 'cs')
    .map((locale) => ({ locale: getPublicLocalePath(locale) }));
}

export default async function LocaleLandingPage({ params }: LocalePageProps) {
  const { locale: rawLocale } = await params;
  if (rawLocale === 'vi' || rawLocale === 'vn' || rawLocale === 'ru' || rawLocale === 'de') redirect('/en');
  if (rawLocale === 'uk') redirect('/ua');
  const locale = normalizeLocale(rawLocale);
  const publicLocale = getPublicLocalePath(locale);
  if (locale === 'cs' || rawLocale !== publicLocale) notFound();
  const copy = pageCopy[locale];
  const otherContracts =
    locale === 'en' || locale === 'ua'
      ? getOtherContractsForLocale(locale)
      : getOtherContractsForLocale('en');
  const otherContractsHint =
    locale === 'en' || locale === 'ua'
      ? OTHER_CONTRACTS_CZECH_ONLY_HINT[locale]
      : OTHER_CONTRACTS_CZECH_ONLY_HINT.en;

  return (
    <>
      <ExpatLocaleSchemas locale={locale} />
      <main className="min-h-screen bg-[#040c1a] text-slate-200">
      <section className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-16">
        <nav className="mb-16 flex items-center justify-between">
          <Link href="/" className="font-serif italic text-lg font-semibold text-white">
            SmlouvaHned.cz
          </Link>
          <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
            {localeLinks.map((item) => (
              <Link
                key={item.locale}
                href={item.href}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 transition ${
                  item.locale === locale
                    ? 'border-[#c9a852]/50 bg-[#c9a852]/10 text-[#c9a852]'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                <span className="text-sm leading-none" aria-hidden="true">{item.flag}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="max-w-3xl">
          <p className="site-kicker mb-4">{copy.eyebrow}</p>
          <h1 className="font-serif italic text-5xl font-bold tracking-tight text-white md:text-7xl">
            {copy.title}
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
            {copy.subtitle}
          </p>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400">
            {copy.legalStrip ??
              'Not legal advice. Not immigration advice. Not a certified or official translation. Czech wording prevails.'}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12 md:px-10">
        <div className="mb-8">
          <p className="site-kicker mb-2">Foreigner / Expat Pack</p>
          <h2 className="font-serif italic text-4xl font-bold text-white">{copy.coreHeading}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">{copy.coreSub}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {coreContracts.map((contract) => {
            const card = coreContractCopy(locale, contract.capabilityKey);
            return (
            <div
              key={contract.href}
              className="group rounded-2xl border border-[#c9a852]/25 bg-[#0c1426] p-6 transition hover:border-[#c9a852]/60"
            >
              <p className="mb-3 text-[10px] font-bold leading-snug tracking-wide text-emerald-200">
                {locale === 'en' || locale === 'ua'
                  ? getExpatContractCapability(locale, contract.capabilityKey)
                  : copy.supportedBadge}
              </p>
              <h3 className="text-xl font-bold text-white group-hover:text-[#c9a852]">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{card.description}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={withLocale(contract.href, locale)}
                  className="text-sm font-bold text-[#c9a852] hover:text-[#e8d5a8]"
                >
                  {copy.cta} →
                </Link>
                {(locale === 'en' || locale === 'ua') ? (
                  <Link
                    href={locale === 'ua' ? contract.seoHrefUa : contract.seoHrefEn}
                    className="text-sm font-semibold text-slate-400 hover:text-white"
                  >
                    {copy.learnMore ?? 'Learn more'}
                  </Link>
                ) : null}
              </div>
            </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-10 md:px-10">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-bold text-white">
            {locale === 'en' ? 'Blog guides for foreigners' : 'Блог для іноземців'}
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-400">
            {locale === 'en'
              ? 'Step-by-step articles linking to each English-guided contract form.'
              : 'Покрокові статті з посиланнями на форми українською.'}
          </p>
          <Link
            href={
              locale === 'en'
                ? '/blog/expat/foreigners-czech-contracts-guide-en'
                : '/blog/expat/foreigners-czech-contracts-guide-ua'
            }
            className="mt-4 inline-flex text-sm font-bold text-[#c9a852] hover:text-[#e8d5a8]"
          >
            {locale === 'en' ? 'Read all guides →' : 'Усі гіди →'}
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 md:px-10">
        <div className="mb-6">
          <h2 className="font-serif italic text-3xl font-bold text-white">{copy.otherHeading}</h2>
          <p className="mt-2 text-sm leading-7 text-slate-500">{otherContractsHint}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {otherContracts.map(({ title, href }) => (
            <Link
              key={href}
              href={withLocale(href, locale)}
              className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300 transition hover:border-white/20 hover:text-white"
            >
              <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {copy.czechBadge}
              </div>
              {title}
            </Link>
          ))}
        </div>
      </section>
    </main>
    </>
  );
}
