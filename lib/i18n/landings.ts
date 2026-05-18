/**
 * Landing-page copy per foreign locale.
 *
 * NOTE: Translations are first-pass and should be reviewed by a native speaker
 * familiar with Czech legal terminology before going live. Czech references
 * ("§ 2235 OZ", "DPP", "OZ") are intentionally kept untranslated where they
 * function as legal identifiers.
 */

import type { Locale } from './locales';

export type LandingFaqItem = { q: string; a: string };
export type LandingHowStep = { title: string; description: string };
export type LandingContract = { href: string; title: string; blurb: string };

export type LandingContent = {
  htmlTitle: string;
  metaDescription: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  kicker: string;
  h1Line1: string;
  h1Line2: string;
  intro: string;
  ctaPrimary: string;
  ctaSecondary: string;
  warningBanner: string;
  contractsHeading: string;
  openCzechForm: string;
  contracts: LandingContract[];
  howItWorksHeading: string;
  howItWorks: LandingHowStep[];
  whyHeading: string;
  whyBullets: string[];
  faqHeading: string;
  faq: LandingFaqItem[];
  disclaimerHeading: string;
  disclaimerBody: string;
  /**
   * Additional legal disclaimers shown in the bottom panel, one bullet each.
   * Each locale lists at least: (1) not a law firm, (2) not immigration
   * advice, (3) translation is for convenience only — not certified/official.
   */
  legalNotes: string[];
  switchToCzech: string;
  alsoAvailableIn: string;
};

const CONTRACTS_BASE: Array<Pick<LandingContract, 'href'>> = [
  { href: '/najem' },
  { href: '/podnajem' },
  { href: '/dpp' },
  { href: '/pracovni' },
  { href: '/kupni' },
  { href: '/auto' },
  { href: '/darovaci' },
  { href: '/pujcka' },
  { href: '/uznani-dluhu' },
  { href: '/nda' },
  { href: '/smlouva-o-dilo' },
  { href: '/sluzby' },
  { href: '/spoluprace' },
  { href: '/plna-moc' },
];

function withContracts(c: Array<Omit<LandingContract, 'href'>>): LandingContract[] {
  return CONTRACTS_BASE.map((b, i) => ({ ...b, ...c[i] }));
}

// ─── ENGLISH ───────────────────────────────────────────────────────────────
const EN: LandingContent = {
  htmlTitle: 'Czech contracts online — rental, employment, NDA in 5 minutes | SmlouvaHned',
  metaDescription:
    'Generate Czech legal contracts online without a lawyer. Rental agreement, DPP work agreement, employment contract, NDA, power of attorney and more — fill the form, get a Czech PDF ready to sign. Made for foreigners living in the Czech Republic.',
  keywords: [
    'rental agreement Czech Republic',
    'lease contract Prague',
    'DPP agreement English',
    'Czech employment contract template',
    'NDA Czech Republic',
    'flat rental contract Czechia',
    'sublease agreement Prague',
    'power of attorney Czech Republic',
  ],
  ogTitle: 'Czech contracts online — rental, employment, NDA in 5 minutes',
  ogDescription:
    'Generate Czech legal contracts online. Rental, DPP, employment, NDA. Built for foreigners living in the Czech Republic.',
  kicker: 'For foreigners living in the Czech Republic',
  h1Line1: 'Czech contracts online —',
  h1Line2: 'rental, employment, NDA in 5 minutes',
  intro:
    'SmlouvaHned helps foreigners in the Czech Republic create standard Czech contract templates from a structured form. The PDF is generated primarily in Czech; selected core contracts may include an explanatory English annex (not certified or official). Requirements of authorities or third parties may differ.',
  ctaPrimary: 'Start a rental agreement →',
  ctaSecondary: 'Start a DPP agreement',
  warningBanner:
    '⚠ The form interface is currently in Czech. The English UI is in active development — rental agreement and DPP are the first builders we will translate. The Czech wording of the PDF is the prevailing version; an English translation is included alongside for convenience only and is not a certified or official translation.',
  contractsHeading: 'Available contracts',
  openCzechForm: 'Open Czech form →',
  contracts: withContracts([
    { title: 'Rental agreement (nájemní smlouva)', blurb: 'Flat lease under § 2235 Czech Civil Code. Deposit, rent indexation, handover protocol.' },
    { title: 'Sublease agreement (podnájemní smlouva)', blurb: 'Sublet a flat or room you currently rent. Requires landlord consent.' },
    { title: 'DPP — agreement to complete a job (dohoda o provedení práce)', blurb: 'Small-volume work up to 300 hours per calendar year per employer.' },
    { title: 'Employment contract (pracovní smlouva)', blurb: 'Standard employment under the Czech Labour Code (zákoník práce).' },
    { title: 'Purchase agreement (kupní smlouva)', blurb: 'Sale of movable property — generic purchase contract.' },
    { title: 'Car purchase agreement (kupní smlouva na auto)', blurb: 'Used-car sale with vehicle handover record.' },
    { title: 'Gift agreement (darovací smlouva)', blurb: 'Donate movable or immovable property.' },
    { title: 'Loan agreement (smlouva o zápůjčce)', blurb: 'Lend money to another person with repayment terms.' },
    { title: 'Debt acknowledgement (uznání dluhu)', blurb: 'Formal acknowledgement of an existing debt.' },
    { title: 'Non-disclosure agreement (NDA)', blurb: 'Protect confidential business information.' },
    { title: 'Contract for work (smlouva o dílo)', blurb: 'Tailor-made work, construction, software, repairs.' },
    { title: 'Service agreement (smlouva o poskytování služeb)', blurb: 'Recurring or one-off service provision.' },
    { title: 'Cooperation agreement (smlouva o spolupráci)', blurb: 'B2B cooperation between independent businesses.' },
    { title: 'Power of attorney (plná moc)', blurb: 'Authorise another person to act on your behalf — e.g. at a bank, office, or registry (check whether notarisation is required).' },
  ]),
  howItWorksHeading: 'How it works',
  howItWorks: [
    { title: '1. Pick a contract.', description: 'Choose from 14 standard document types above.' },
    { title: '2. Fill the form.', description: 'Enter the parties, amounts, dates, and any optional clauses. Field labels are currently in Czech — if you get stuck, use a browser translator (right-click → Translate to English).' },
    { title: '3. Pay and download.', description: 'Pay by card via Stripe (CZK). Download your Czech PDF immediately; supported contracts may include an explanatory English annex. The link stays valid for 7–30 days.' },
    { title: '4. Sign on paper.', description: 'Print, both parties sign, keep one copy each. Czech contracts generally do not require notarisation unless they concern real estate transfer or specific corporate acts.' },
  ],
  whyHeading: 'Why foreigners use SmlouvaHned',
  whyBullets: [
    '✓ Czech contract PDF with optional explanatory translation for supported document types (Czech wording prevails).',
    '✓ Templates reference the Czech Civil Code and Labour Code where relevant.',
    '✓ Templates built around the Czech Civil Code (§ 89/2012 Sb.) and the Labour Code — paragraph references are included.',
    '✓ Encrypted, temporary data storage — deleted automatically after 7–30 days.',
    '✓ Payment in Czech crowns via Stripe. No subscription, you pay per contract.',
    '✓ Built and operated in the Czech Republic by Karel Zdeněk, IČ 23660295.',
  ],
  faqHeading: 'Frequently asked questions',
  faq: [
    { q: 'I do not speak Czech. Can I still use SmlouvaHned?', a: 'Yes for supported contracts: the PDF is primarily Czech and may include an explanatory translation annex. Other forms are Czech-only for now — use your browser translator while filling. The translation is not certified or official; Czech wording prevails.' },
    { q: 'Is the contract legally valid in the Czech Republic?', a: 'Yes. Each template is built around the relevant provisions of the Czech Civil Code (Občanský zákoník, Act No. 89/2012 Coll.) or the Labour Code. Section references appear in the document.' },
    { q: 'Is SmlouvaHned a law firm?', a: 'No. SmlouvaHned is a software tool that generates standard template contracts. It is not legal advice and does not replace consultation with a Czech attorney (advokát).' },
    { q: 'How do payments work?', a: 'After you fill the form you can choose a tier and pay by card via Stripe. Payments are processed in Czech crowns (CZK).' },
    { q: 'How long is my generated PDF available to download?', a: 'The download link is valid for 7 days (basic document) or 30 days (extended document). Your form data is stored encrypted only for this period and is then deleted automatically.' },
  ],
  disclaimerHeading: 'Disclaimer — not a law firm',
  disclaimerBody:
    'SmlouvaHned is a software tool, not a law firm. Generated documents are standard templates for typical situations. They are not a substitute for individual legal advice. For non-standard or complex matters please consult a Czech attorney (advokát).',
  legalNotes: [
    'SmlouvaHned does not provide legal advice and is not authorised to practise law in the Czech Republic.',
    'SmlouvaHned does not provide immigration advice. For visa, residence-permit or foreign-police matters please contact OAMP, an immigration attorney, or a non-profit organisation that supports foreigners.',
    'Foreign-language translations of the contract are provided for convenience only. They are not certified (úředně ověřené) translations and may not be accepted by Czech authorities as official translations. Where a certified translation is required by law, contract or an authority, you must obtain one from a court-appointed translator (soudní tlumočník).',
  ],
  switchToCzech: '← Česká verze (Czech version)',
  alsoAvailableIn: 'Also available in',
};

// ─── UKRAINIAN ─────────────────────────────────────────────────────────────
const UA: LandingContent = {
  htmlTitle: 'Чеські договори онлайн — оренда, працевлаштування, NDA за 5 хвилин | SmlouvaHned',
  metaDescription:
    'Створюйте чеські юридичні договори онлайн без адвоката. Договір оренди, ДПП, трудовий договір, NDA, довіреність та інші — заповнюєте форму, отримуєте чеський PDF, готовий до підпису. Для іноземців, які живуть у Чехії.',
  keywords: [
    'договір оренди Чехія',
    'оренда квартири Прага',
    'трудовий договір Чехія',
    'ДПП договір українською',
    'NDA Чехія',
    'довіреність Чехія',
  ],
  ogTitle: 'Чеські договори онлайн — оренда, праця, NDA за 5 хвилин',
  ogDescription:
    'Генератор чеських юридичних договорів онлайн. Оренда, ДПП, праця, NDA. Для іноземців у Чехії.',
  kicker: 'Для іноземців, які живуть у Чехії',
  h1Line1: 'Чеські договори онлайн —',
  h1Line2: 'оренда, праця, NDA за 5 хвилин',
  intro:
    'SmlouvaHned допомагає іноземцям у Чехії створювати стандартні чеські шаблони договорів із структурованої форми. PDF переважно чеською; для обраних договорів може бути пояснювальний український додаток (не офіційний переклад). Вимоги установ або третіх осіб можуть відрізнятися.',
  ctaPrimary: 'Створити договір оренди →',
  ctaSecondary: 'Створити ДПП',
  warningBanner:
    '⚠ Інтерфейс форми поки що чеською мовою. Українська локалізація в активній розробці — першими будуть оренда та ДПП. Чеське формулювання PDF є переважним; український переклад додається лише для зручності і не є офіційним або засвідченим перекладом.',
  contractsHeading: 'Доступні договори',
  openCzechForm: 'Відкрити чеську форму →',
  contracts: withContracts([
    { title: 'Договір оренди (nájemní smlouva)', blurb: 'Оренда квартири за § 2235 Цивільного кодексу Чехії. Завдаток, індексація, акт прийому-передачі.' },
    { title: 'Договір суборенди (podnájemní smlouva)', blurb: 'Суборенда квартири чи кімнати, яку ви орендуєте. Потрібна згода власника.' },
    { title: 'ДПП — угода про виконання роботи (dohoda o provedení práce)', blurb: 'Дрібна робота до 300 годин на рік у одного роботодавця.' },
    { title: 'Трудовий договір (pracovní smlouva)', blurb: 'Стандартне працевлаштування за Трудовим кодексом Чехії.' },
    { title: 'Договір купівлі-продажу (kupní smlouva)', blurb: 'Продаж рухомого майна — універсальний договір.' },
    { title: 'Договір купівлі-продажу автомобіля', blurb: 'Продаж вживаного авто з актом прийому-передачі.' },
    { title: 'Договір дарування (darovací smlouva)', blurb: 'Дарування рухомого чи нерухомого майна.' },
    { title: 'Договір позики (smlouva o zápůjčce)', blurb: 'Грошова позика з умовами повернення.' },
    { title: 'Визнання боргу (uznání dluhu)', blurb: 'Формальне визнання наявного боргу.' },
    { title: 'Договір про нерозголошення (NDA)', blurb: 'Захист конфіденційної ділової інформації.' },
    { title: 'Договір підряду (smlouva o dílo)', blurb: 'Замовлена робота, будівництво, ПЗ, ремонт.' },
    { title: 'Договір про надання послуг (smlouva o poskytování služeb)', blurb: 'Періодичні або одноразові послуги.' },
    { title: 'Договір про співпрацю (smlouva o spolupráci)', blurb: 'B2B співпраця між незалежними підприємцями.' },
    { title: 'Довіреність (plná moc)', blurb: 'Уповноваження діяти від вашого імені — наприклад, у банку, на установі чи в реєстрі (перевірте, чи потрібна нотаріальна форма).' },
  ]),
  howItWorksHeading: 'Як це працює',
  howItWorks: [
    { title: '1. Оберіть договір.', description: 'Виберіть один із 14 стандартних типів документів.' },
    { title: '2. Заповніть форму.', description: 'Введіть сторони, суми, дати та опційні пункти. Підписи полів поки що чеською — використовуйте перекладач браузера (права кнопка → Перекласти).' },
    { title: '3. Оплатіть і завантажте.', description: 'Оплата карткою через Stripe (CZK). Завантажте чеський PDF одразу; для підтримуваних договорів можливий пояснювальний український додаток. Посилання чинне 7–30 днів.' },
    { title: '4. Підпишіть на папері.', description: 'Роздрукуйте, обидві сторони підписують, кожен залишає собі примірник. Нотаріальне засвідчення зазвичай не потрібне (виняток — нерухомість, корпоративні акти).' },
  ],
  whyHeading: 'Чому іноземці обирають SmlouvaHned',
  whyBullets: [
    '✓ Чеський PDF із пояснювальним перекладом для підтримуваних типів договорів (переважає чеська версія).',
    '✓ Шаблони посилаються на Цивільний та Трудовий кодекси Чехії, де це доречно.',
    '✓ У документі є посилання на відповідні параграфи законів.',
    '✓ Шифроване тимчасове сховище даних — автоматичне видалення через 7–30 днів.',
    '✓ Оплата в чеських кронах через Stripe. Без підписки, тільки за договір.',
    '✓ Створено та обслуговується в Чехії: Karel Zdeněk, IČ 23660295.',
  ],
  faqHeading: 'Часті питання',
  faq: [
    { q: 'Я не розмовляю чеською. Чи можу я користуватися SmlouvaHned?', a: 'Так для підтримуваних договорів: PDF переважно чеською, можливий пояснювальний український додаток. Інші форми поки лише чеською — скористайтеся перекладачем браузера. Переклад не є офіційним; переважає чеська версія.' },
    { q: 'Чи дійсний договір у Чехії?', a: 'Так. Кожен шаблон побудований на відповідних положеннях Цивільного кодексу Чехії (закон № 89/2012 Sb.) або Трудового кодексу. Посилання на параграфи містяться в документі.' },
    { q: 'SmlouvaHned — це адвокатська контора?', a: 'Ні. SmlouvaHned — програмний інструмент, який генерує стандартні шаблонні договори. Це не юридична консультація і не замінює адвоката.' },
    { q: 'Як працює оплата?', a: 'Після заповнення форми оберіть тариф і оплатіть карткою через Stripe. Платіж у чеських кронах (CZK).' },
    { q: 'Скільки часу доступне завантаження PDF?', a: 'Посилання дійсне 7 днів (базовий документ) або 30 днів (розширений). Ваші дані зберігаються зашифрованими лише цей період і потім автоматично видаляються.' },
  ],
  disclaimerHeading: 'Дисклеймер — не адвокатська контора',
  disclaimerBody:
    'SmlouvaHned — програмний інструмент, а не адвокатська контора. Згенеровані документи є стандартними шаблонами для типових ситуацій. Вони не замінюють індивідуальної юридичної консультації. Для нестандартних чи складних справ зверніться до чеського адвоката (advokát).',
  legalNotes: [
    'SmlouvaHned не надає юридичних консультацій і не має дозволу займатися адвокатською діяльністю у Чеській Республіці.',
    'SmlouvaHned не надає імміграційних консультацій. У питаннях віз, дозволу на проживання або іноземної поліції зверніться до МВС ČR (OAMP), імміграційного адвоката або до некомерційної організації, що підтримує іноземців.',
    'Іншомовні переклади договору надаються лише для зручності. Вони не є засвідченими (úředně ověřené) перекладами і можуть не бути прийняті чеськими установами як офіційні. Якщо засвідчений переклад вимагається законом, договором чи установою, його необхідно отримати від судового перекладача (soudní tlumočník).',
  ],
  switchToCzech: '← Česká verze (чеська версія)',
  alsoAvailableIn: 'Також доступно',
};

export const LANDINGS: Record<Exclude<Locale, 'cs'>, LandingContent> = {
  en: EN,
  ua: UA,
};

import type { Metadata } from 'next';
import { FOREIGN_LOCALES, LOCALE_META } from './locales';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export function makeLandingMetadata(locale: Exclude<Locale, 'cs'> | 'uk' | 'ru' | 'vn' | 'de'): Metadata {
  const resolved: Exclude<Locale, 'cs'> =
    locale === 'uk' ? 'ua' : locale === 'en' || locale === 'ua' ? locale : 'en';
  const content = LANDINGS[resolved];
  const meta = LOCALE_META[resolved];
  const url = `${BASE_URL}/${meta.segment}`;

  const languages: Record<string, string> = {
    cs: BASE_URL,
    'x-default': BASE_URL,
  };
  for (const l of FOREIGN_LOCALES) {
    languages[LOCALE_META[l].htmlLang] = `${BASE_URL}/${LOCALE_META[l].segment}`;
  }

  return {
    title: content.htmlTitle,
    description: content.metaDescription,
    keywords: content.keywords,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      type: 'website',
      locale: meta.ogLocale,
      alternateLocale: ['cs_CZ', ...FOREIGN_LOCALES.filter(l => l !== locale).map(l => LOCALE_META[l].ogLocale)],
      url,
      siteName: 'SmlouvaHned',
      title: content.ogTitle,
      description: content.ogDescription,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'SmlouvaHned',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.ogTitle,
      description: content.ogDescription,
      images: ['/og-image.png'],
    },
  };
}
