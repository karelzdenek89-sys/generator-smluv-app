import { cookies, headers } from 'next/headers';
import Link from 'next/link';
import { LOCALE_META, type Locale } from '@/lib/i18n/locales';
import DismissButtonClient from './ForeignBannerDismissButton';

type BannerCopy = {
  heading: string;
  body: string;
  pdfNote: string;
  translateHint: string;
  backToLanding: string;
  dismiss: string;
};

const COPY: Record<Exclude<Locale, 'cs'>, BannerCopy> = {
  en: {
    heading: 'You came from the English version',
    body: 'The form on this page is in Czech.',
    pdfNote: 'The PDF you generate will be bilingual: Czech wording prevails, with an English translation alongside for convenience only (not a certified or official translation).',
    translateHint: 'Tip: right-click the page and choose "Translate to English" to fill the form in English.',
    backToLanding: '← Back to English overview',
    dismiss: 'Got it',
  },
  uk: {
    heading: 'Ви прийшли з української версії',
    body: 'Форма на цій сторінці чеською мовою.',
    pdfNote: 'Створене PDF буде двомовним: переважає чеське формулювання, а український переклад надається поруч лише для зручності (не є офіційним або засвідченим перекладом).',
    translateHint: 'Підказка: клацніть правою кнопкою миші і виберіть «Перекласти», щоб заповнити форму українською.',
    backToLanding: '← Назад до української сторінки',
    dismiss: 'Зрозуміло',
  },
  ru: {
    heading: 'Вы пришли с русской версии',
    body: 'Форма на этой странице на чешском языке.',
    pdfNote: 'Сгенерированный PDF будет двуязычным: преимущественную силу имеет чешская формулировка, а русский перевод предоставляется рядом исключительно для удобства (не является официальным или заверенным переводом).',
    translateHint: 'Подсказка: щёлкните правой кнопкой и выберите «Перевести», чтобы заполнить форму по-русски.',
    backToLanding: '← Назад на русскую страницу',
    dismiss: 'Понятно',
  },
  vn: {
    heading: 'Bạn đến từ phiên bản tiếng Việt',
    body: 'Biểu mẫu trên trang này bằng tiếng Séc.',
    pdfNote: 'PDF được tạo sẽ song ngữ: bản tiếng Séc được ưu tiên áp dụng, bản dịch tiếng Việt được cung cấp bên cạnh chỉ để tiện theo dõi (không phải là bản dịch chính thức hoặc có công chứng).',
    translateHint: 'Mẹo: nhấp chuột phải và chọn "Dịch" để điền biểu mẫu bằng tiếng Việt.',
    backToLanding: '← Quay lại trang tiếng Việt',
    dismiss: 'Đã hiểu',
  },
  de: {
    heading: 'Sie kommen aus der deutschen Version',
    body: 'Das Formular auf dieser Seite ist auf Tschechisch.',
    pdfNote: 'Ihre erzeugte PDF wird zweisprachig sein: maßgebend ist der tschechische Wortlaut, eine deutsche Übersetzung wird daneben ausschließlich zur Verständlichkeit beigefügt (keine beglaubigte oder amtliche Übersetzung).',
    translateHint: 'Tipp: Klicken Sie mit der rechten Maustaste und wählen Sie „Übersetzen", um das Formular auf Deutsch auszufüllen.',
    backToLanding: '← Zurück zur deutschen Übersicht',
    dismiss: 'Verstanden',
  },
};

export default async function ForeignVisitorBanner() {
  const hdrs = await headers();
  const pathname = hdrs.get('x-pathname') ?? '';

  // Don't show on the foreign landing pages themselves; only on CZ pages
  // (the form/builder pages where the labels are still Czech).
  for (const seg of ['en', 'uk', 'ru', 'vn', 'de']) {
    if (pathname === `/${seg}` || pathname.startsWith(`/${seg}/`)) return null;
  }

  const cookieStore = await cookies();
  const dismissed = cookieStore.get('foreign-banner-dismissed')?.value === '1';
  if (dismissed) return null;

  const localeCookie = cookieStore.get('preferred-locale')?.value;
  if (!localeCookie || !(localeCookie in COPY)) return null;
  const locale = localeCookie as Exclude<Locale, 'cs'>;
  const copy = COPY[locale];
  const meta = LOCALE_META[locale];

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
            {copy.body} {copy.pdfNote}
          </div>
          <div className="mt-0.5 text-xs text-amber-100/70">
            {copy.translateHint}
          </div>
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
