import { cookies, headers } from 'next/headers';
import Link from 'next/link';
import {
  getContractTypeByPath,
  getUnsupportedFormNotice,
  isExpatContract,
  normalizeLocale,
  type AppLocale,
} from '@/lib/locale';
import { LOCALE_META } from '@/lib/i18n/locales';
import DismissButtonClient from './ForeignBannerDismissButton';

type ActiveLocale = Exclude<AppLocale, 'cs'>;

type BannerCopy = {
  heading: string;
  body: string;
  detail: string;
  translateHint: string;
  backToLanding: string;
  dismiss: string;
};

const SUPPORTED_COPY: Record<ActiveLocale, BannerCopy> = {
  en: {
    heading: 'You came from the English overview',
    body: 'The form on this page is in Czech.',
    detail:
      'For supported contracts, the PDF includes Czech wording plus an explanatory English annex (not certified or official). In case of discrepancy, the Czech text prevails.',
    translateHint: 'Tip: right-click the page and choose "Translate to English" to fill the form.',
    backToLanding: '← Back to English overview',
    dismiss: 'Got it',
  },
  ua: {
    heading: 'Ви перейшли з українського огляду',
    body: 'Форма на цій сторінці чеською мовою.',
    detail:
      'Для обраних договорів PDF містить чеський текст і пояснювальний український додаток (не офіційний переклад). У разі розбіжностей перевага має чеське формулювання.',
    translateHint: 'Підказка: клацніть правою кнопкою миші і виберіть «Перекласти».',
    backToLanding: '← Назад до українського огляду',
    dismiss: 'Зрозуміло',
  },
};

const CZECH_ONLY_COPY: Record<ActiveLocale, BannerCopy> = {
  en: {
    heading: 'You came from the English overview',
    body: 'This contract form is available in Czech only.',
    detail:
      'The generated PDF will be in Czech. Selected core contracts (rental, employment, DPP, and others) offer English form guidance and an explanatory annex.',
    translateHint: 'Tip: use your browser translator while filling the Czech form.',
    backToLanding: '← Back to English overview',
    dismiss: 'Got it',
  },
  ua: {
    heading: 'Ви перейшли з українського огляду',
    body: 'Ця форма доступна лише чеською.',
    detail:
      'PDF буде чеською. Для основних договорів (оренда, праця, DPP тощо) є підказки українською та пояснювальний додаток у PDF.',
    translateHint: 'Підказка: використайте перекладач браузера під час заповнення.',
    backToLanding: '← Назад до українського огляду',
    dismiss: 'Зрозуміло',
  },
};

function mapCookieToAppLocale(raw: string | undefined): ActiveLocale | null {
  if (!raw) return null;
  const normalized = normalizeLocale(raw);
  return normalized === 'cs' ? null : normalized;
}

export default async function ForeignVisitorBanner() {
  const hdrs = await headers();
  const pathname = hdrs.get('x-pathname') ?? '';

  for (const seg of ['en', 'ua', 'uk', 'ru', 'vn', 'vi', 'de']) {
    if (pathname === `/${seg}` || pathname.startsWith(`/${seg}/`)) return null;
  }

  const cookieStore = await cookies();
  if (cookieStore.get('foreign-banner-dismissed')?.value === '1') return null;

  const locale = mapCookieToAppLocale(cookieStore.get('preferred-locale')?.value);
  if (!locale) return null;

  const contractType = getContractTypeByPath(pathname);
  const supported = contractType ? isExpatContract(contractType) : false;
  const copy = supported ? SUPPORTED_COPY[locale] : CZECH_ONLY_COPY[locale];
  const meta = LOCALE_META[locale];
  const unsupportedNote =
    !supported && contractType ? getUnsupportedFormNotice(locale) : null;

  return (
    <VisitorBannerShell
      locale={locale}
      meta={meta}
      copy={copy}
      unsupportedNote={unsupportedNote}
    />
  );
}

function VisitorBannerShell({
  locale,
  meta,
  copy,
  unsupportedNote,
}: {
  locale: ActiveLocale;
  meta: (typeof LOCALE_META)[ActiveLocale];
  copy: BannerCopy;
  unsupportedNote: string | null;
}) {
  return (
    <div
      lang={meta.htmlLang}
      role="region"
      aria-label={copy.heading}
      className="foreign-banner sticky top-0 z-40 border-b border-amber-400/30 bg-[#1a1410]/95 backdrop-blur supports-[backdrop-filter]:bg-[#1a1410]/85"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2.5 text-sm text-amber-50 md:flex-row md:items-center md:justify-between md:gap-4">
        <div className="min-w-0">
          <div className="font-semibold text-amber-200">
            <span aria-hidden className="mr-1.5">{meta.flag}</span>
            {copy.heading}
          </div>
          <div className="mt-0.5 text-amber-100/90">
            {copy.body} {copy.detail}
          </div>
          {unsupportedNote ? (
            <div className="mt-1 text-xs text-amber-100/80">{unsupportedNote}</div>
          ) : null}
          <div className="mt-0.5 text-xs text-amber-100/70">{copy.translateHint}</div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Link
            href={`/${meta.segment}`}
            className="text-xs uppercase tracking-wider text-amber-200 hover:text-amber-100"
          >
            {copy.backToLanding}
          </Link>
          <DismissButtonClient label={copy.dismiss} />
        </div>
      </div>
    </div>
  );
}
