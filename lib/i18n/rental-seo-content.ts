import type { AppLocale } from '@/lib/locale';

export type RentalSeoContent = {
  builderHref: string;
  canonical: string;
  metadata: {
    title: string;
    description: string;
    keywords: string[];
    openGraphTitle: string;
    openGraphDescription: string;
    openGraphLocale: string;
  };
  breadcrumbLabel: string;
  kicker: string;
  h1: string;
  subtitle: string;
  cta: string;
  backToExpats: string;
  faq: { q: string; a: string }[];
  legalBullets: string[];
};

const RENTAL_SEO_EN: RentalSeoContent = {
  builderHref: '/najem?lang=en',
  canonical: 'https://smlouvahned.cz/en/rental-agreement-czech-republic',
  metadata: {
    title: 'Rental Agreement in the Czech Republic | English-Guided Czech Lease | SmlouvaHned',
    description:
      'Create a Czech rental agreement for foreigners and landlords in the Czech Republic. Fill in the form in English and download a Czech contract PDF with an explanatory English translation annex. Not certified or official.',
    keywords: [
      'rental agreement Czech Republic',
      'lease agreement Czech Republic foreigners',
      'Prague rental contract',
      'Czech rental agreement English',
    ],
    openGraphTitle: 'Rental Agreement in the Czech Republic | SmlouvaHned',
    openGraphDescription:
      'English-guided Czech rental agreement with explanatory English translation annex. Czech wording prevails.',
    openGraphLocale: 'en_US',
  },
  breadcrumbLabel: 'Rental agreement',
  kicker: 'Foreigners & landlords in Czechia',
  h1: 'Rental Agreement in the Czech Republic',
  subtitle:
    'Fill in the rental form in English and generate a Czech rental agreement with an explanatory English translation annex. The Czech wording prevails. The translation is not certified or official.',
  cta: 'Create rental agreement',
  backToExpats: 'All expat contracts',
  faq: [
    {
      q: 'Is this a certified or official English translation?',
      a: 'No. SmlouvaHned generates a Czech rental agreement as the primary document. An explanatory English translation annex may be included. It is not certified or official. In case of discrepancy, the Czech wording prevails.',
    },
    {
      q: 'Can I use this contract with the foreign police or for a visa?',
      a: 'SmlouvaHned does not guarantee acceptance by any authority. Requirements may differ. This is a software tool, not a law firm, and we do not provide legal or immigration advice.',
    },
    {
      q: 'Who is this for?',
      a: 'Foreign tenants and landlords in the Czech Republic who want an English-guided form and a Czech contract PDF.',
    },
    {
      q: 'What do I receive after payment?',
      a: 'A PDF with the Czech lease as the main contract, followed by an Explanatory English Translation Annex.',
    },
  ],
  legalBullets: [
    'SmlouvaHned is a software tool that helps you assemble documents from your inputs.',
    'We are not a law firm and do not provide legal advice or immigration advice.',
    'The generated contract is primarily in Czech. An explanatory English translation annex may be included; it is not a certified or official translation.',
    'In case of discrepancy, the Czech wording prevails.',
    'SmlouvaHned does not guarantee acceptance by any authority.',
  ],
};

const RENTAL_SEO_UK: RentalSeoContent = {
  builderHref: '/najem?lang=ua',
  canonical: 'https://smlouvahned.cz/ua/rental-agreement-czech-republic',
  metadata: {
    title: 'Договір оренди в Чехії | Форма українською | SmlouvaHned',
    description:
      'Створіть чеський договір оренди для іноземців та орендодавців. Заповніть форму українською та завантажте PDF з пояснювальним українським перекладом. Не офіційний і не засвідчений переклад.',
    keywords: [
      'договір оренди Чехія',
      'оренда квартири Прага',
      'чеський договір оренди українською',
      'найм житла Чехія',
    ],
    openGraphTitle: 'Договір оренди в Чехії | SmlouvaHned',
    openGraphDescription:
      'Чеський договір оренди з пояснювальним українським додатком. Перевага має чеське формулювання.',
    openGraphLocale: 'uk_UA',
  },
  breadcrumbLabel: 'Договір оренди',
  kicker: 'Іноземці та орендодавці в Чехії',
  h1: 'Договір оренди в Чехії',
  subtitle:
    'Заповніть форму оренди українською та отримайте чеський договір оренди з пояснювальним українським додатком. Перевага має чеське формулювання. Переклад не є засвідченим чи офіційним.',
  cta: 'Створити договір оренди',
  backToExpats: 'Усі договори для іноземців',
  faq: [
    {
      q: 'Чи це засвідчений або офіційний переклад?',
      a: 'Ні. SmlouvaHned формує чеський договір оренди як основний документ. Може бути додано пояснювальний український переклад. Він не є засвідченим чи офіційним. У разі розбіжностей перевага має чеське формулювання.',
    },
    {
      q: 'Чи підійде договір для візи чи іноземної поліції?',
      a: 'SmlouvaHned не гарантує прийняття будь-яким органом. Вимоги можуть відрізнятися. Це програмний інструмент, а не юридична фірма.',
    },
    {
      q: 'Для кого це?',
      a: 'Для іноземних орендарів і орендодавців у Чехії, зокрема в Празі, які хочуть форму українською.',
    },
    {
      q: 'Що я отримаю після оплати?',
      a: 'PDF з чеським договором оренди та пояснювальним додатком українською.',
    },
  ],
  legalBullets: [
    'SmlouvaHned — програмний інструмент для складання документів з ваших даних.',
    'Ми не є юридичною фірмою і не надаємо юридичних чи імміграційних консультацій.',
    'Договір генерується переважно чеською. Український додаток — пояснювальний, не офіційний.',
    'У разі розбіжностей перевага має чеське формулювання.',
    'SmlouvaHned не гарантує прийняття будь-яким органом.',
  ],
};

export function getRentalSeoContent(locale: AppLocale): RentalSeoContent | null {
  if (locale === 'en') return RENTAL_SEO_EN;
  if (locale === 'ua') return RENTAL_SEO_UK;
  return null;
}

export const RENTAL_SEO_LOCALES = ['en', 'ua'] as const;
