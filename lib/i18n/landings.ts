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
const UK: LandingContent = {
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
    'SmlouvaHned генерує стандартні чеські юридичні договори безпосередньо зі структурованої форми. Результатом є чеський PDF, який приймають чеські установи, банки, роботодавці та іноземна поліція (cizinecká policie). Створено для українців, експатів та студентів, які живуть у Празі, Брно, Плзні, Остраві та інших містах Чехії.',
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
    { title: 'Довіреність (plná moc)', blurb: 'Уповноваження діяти від вашого імені — наприклад, в іноземній поліції, банку, реєстрі.' },
  ]),
  howItWorksHeading: 'Як це працює',
  howItWorks: [
    { title: '1. Оберіть договір.', description: 'Виберіть один із 14 стандартних типів документів.' },
    { title: '2. Заповніть форму.', description: 'Введіть сторони, суми, дати та опційні пункти. Підписи полів поки що чеською — використовуйте перекладач браузера (права кнопка → Перекласти).' },
    { title: '3. Оплатіть і завантажте.', description: 'Оплата карткою через Stripe (в чеських кронах). Двомовний PDF (чеська + українська) одразу до завантаження. Посилання чинне 7–30 днів.' },
    { title: '4. Підпишіть на папері.', description: 'Роздрукуйте, обидві сторони підписують, кожен залишає собі примірник. Нотаріальне засвідчення зазвичай не потрібне (виняток — нерухомість, корпоративні акти).' },
  ],
  whyHeading: 'Чому іноземці обирають SmlouvaHned',
  whyBullets: [
    '✓ Двомовний PDF — чеська (переважне формулювання) + українська поруч, щоб ви розуміли, що підписуєте.',
    '✓ Чеський PDF приймають орендодавці, роботодавці, банки, ліцензійне управління, іноземна поліція.',
    '✓ Шаблони побудовані на Цивільному кодексі (§ 89/2012 Sb.) та Трудовому кодексі — посилання на параграфи в документі.',
    '✓ Шифроване тимчасове сховище даних — автоматичне видалення через 7–30 днів.',
    '✓ Оплата в чеських кронах через Stripe. Без підписки, тільки за договір.',
    '✓ Створено та обслуговується в Чехії: Karel Zdeněk, IČ 23660295.',
  ],
  faqHeading: 'Часті питання',
  faq: [
    { q: 'Я не розмовляю чеською. Чи можу я користуватися SmlouvaHned?', a: 'Так. PDF двомовний (чеська + ваша мова). Інтерфейс форми перекладаємо поступово — оренда та ДПП в першу чергу. Для інших договорів використовуйте перекладач браузера. У разі будь-яких розбіжностей між мовними версіями переважає чеська — переклад надається лише для зручності і не є офіційним або засвідченим перекладом.' },
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

// ─── RUSSIAN ───────────────────────────────────────────────────────────────
const RU: LandingContent = {
  htmlTitle: 'Чешские договоры онлайн — аренда, трудоустройство, NDA за 5 минут | SmlouvaHned',
  metaDescription:
    'Создавайте чешские юридические договоры онлайн без адвоката. Договор аренды, ДПП, трудовой договор, NDA, доверенность и другие — заполните форму, получите чешский PDF, готовый к подписи. Для иностранцев, живущих в Чехии.',
  keywords: [
    'договор найма Чехия',
    'аренда квартиры Прага',
    'трудовой договор Чехия',
    'ДПП договор русский',
    'NDA Чехия',
    'доверенность Чехия',
  ],
  ogTitle: 'Чешские договоры онлайн — аренда, работа, NDA за 5 минут',
  ogDescription:
    'Генератор чешских юридических договоров онлайн. Аренда, ДПП, работа, NDA. Для иностранцев в Чехии.',
  kicker: 'Для иностранцев, живущих в Чехии',
  h1Line1: 'Чешские договоры онлайн —',
  h1Line2: 'аренда, работа, NDA за 5 минут',
  intro:
    'SmlouvaHned генерирует стандартные чешские юридические договоры прямо из структурированной формы. Результат — чешский PDF, который принимают чешские учреждения, банки, работодатели и иностранная полиция (cizinecká policie). Сделано для экспатов, студентов и иностранных специалистов, живущих в Праге, Брно, Плзне, Остраве и других городах Чехии.',
  ctaPrimary: 'Создать договор аренды →',
  ctaSecondary: 'Создать ДПП',
  warningBanner:
    '⚠ Интерфейс формы пока на чешском. Русская локализация в активной разработке — первыми будут аренда и ДПП. Чешская формулировка PDF имеет преимущественную силу; русский перевод прилагается исключительно для удобства и не является официальным или заверенным переводом.',
  contractsHeading: 'Доступные договоры',
  openCzechForm: 'Открыть чешскую форму →',
  contracts: withContracts([
    { title: 'Договор найма (nájemní smlouva)', blurb: 'Аренда квартиры по § 2235 ГК Чехии. Залог, индексация, акт приёма-передачи.' },
    { title: 'Договор поднайма (podnájemní smlouva)', blurb: 'Сдача в субаренду квартиры или комнаты, которую вы снимаете. Нужно согласие собственника.' },
    { title: 'ДПП — соглашение о выполнении работы (dohoda o provedení práce)', blurb: 'Малый объём работы до 300 часов в год у одного работодателя.' },
    { title: 'Трудовой договор (pracovní smlouva)', blurb: 'Стандартное трудоустройство по Трудовому кодексу Чехии.' },
    { title: 'Договор купли-продажи (kupní smlouva)', blurb: 'Продажа движимого имущества — универсальный договор.' },
    { title: 'Договор купли-продажи автомобиля', blurb: 'Продажа подержанного авто с актом приёма-передачи.' },
    { title: 'Договор дарения (darovací smlouva)', blurb: 'Дарение движимого или недвижимого имущества.' },
    { title: 'Договор займа (smlouva o zápůjčce)', blurb: 'Денежный заём с условиями возврата.' },
    { title: 'Признание долга (uznání dluhu)', blurb: 'Формальное признание существующего долга.' },
    { title: 'Соглашение о неразглашении (NDA)', blurb: 'Защита конфиденциальной деловой информации.' },
    { title: 'Договор подряда (smlouva o dílo)', blurb: 'Заказная работа, строительство, ПО, ремонт.' },
    { title: 'Договор оказания услуг (smlouva o poskytování služeb)', blurb: 'Периодические или разовые услуги.' },
    { title: 'Договор о сотрудничестве (smlouva o spolupráci)', blurb: 'B2B-сотрудничество между независимыми предпринимателями.' },
    { title: 'Доверенность (plná moc)', blurb: 'Уполномочить другое лицо действовать от вашего имени — в иностранной полиции, банке, реестре.' },
  ]),
  howItWorksHeading: 'Как это работает',
  howItWorks: [
    { title: '1. Выберите договор.', description: 'Выберите один из 14 стандартных типов документов.' },
    { title: '2. Заполните форму.', description: 'Введите стороны, суммы, даты и опциональные пункты. Подписи полей пока на чешском — используйте переводчик браузера (правая кнопка → Перевести).' },
    { title: '3. Оплатите и скачайте.', description: 'Оплата картой через Stripe (в чешских кронах). Двуязычный PDF (чешский + русский) сразу к скачиванию. Ссылка действует 7–30 дней.' },
    { title: '4. Подпишите на бумаге.', description: 'Распечатайте, обе стороны подписывают, у каждой остаётся экземпляр. Нотариальное заверение обычно не требуется (кроме недвижимости и корпоративных актов).' },
  ],
  whyHeading: 'Почему иностранцы выбирают SmlouvaHned',
  whyBullets: [
    '✓ Двуязычный PDF — чешский (преимущественная формулировка) + русский рядом, чтобы вы понимали, что подписываете.',
    '✓ Чешский PDF принимают арендодатели, работодатели, банки, лицензионное управление, иностранная полиция.',
    '✓ Шаблоны построены на ГК (§ 89/2012 Sb.) и Трудовом кодексе — ссылки на параграфы в документе.',
    '✓ Шифрованное временное хранилище — автоматическое удаление через 7–30 дней.',
    '✓ Оплата в чешских кронах через Stripe. Без подписки, оплата за договор.',
    '✓ Создано и обслуживается в Чехии: Karel Zdeněk, IČ 23660295.',
  ],
  faqHeading: 'Частые вопросы',
  faq: [
    { q: 'Я не говорю по-чешски. Можно ли пользоваться SmlouvaHned?', a: 'Да. PDF двуязычный (чешский + ваш язык). Интерфейс формы переводим постепенно — аренда и ДПП в первую очередь. Для других договоров используйте переводчик браузера. В случае любых расхождений между языковыми версиями преимущественную силу имеет чешская — перевод предоставляется исключительно для удобства и не является официальным или заверенным переводом.' },
    { q: 'Действителен ли договор в Чехии?', a: 'Да. Каждый шаблон построен на соответствующих положениях ГК Чехии (закон № 89/2012 Sb.) или Трудового кодекса. Ссылки на параграфы есть в документе.' },
    { q: 'SmlouvaHned — это адвокатская контора?', a: 'Нет. SmlouvaHned — программный инструмент, генерирующий стандартные шаблонные договоры. Это не юридическая консультация и не замена адвоката.' },
    { q: 'Как работает оплата?', a: 'После заполнения формы выберите тариф и оплатите картой через Stripe. Платёж в чешских кронах (CZK).' },
    { q: 'Сколько доступно скачивание PDF?', a: 'Ссылка действует 7 дней (базовый документ) или 30 дней (расширенный). Данные хранятся зашифрованными только этот период и затем удаляются автоматически.' },
  ],
  disclaimerHeading: 'Дисклеймер — не адвокатская контора',
  disclaimerBody:
    'SmlouvaHned — программный инструмент, а не адвокатская контора. Сгенерированные документы — стандартные шаблоны для типичных ситуаций. Они не заменяют индивидуальной юридической консультации. Для нестандартных или сложных случаев обратитесь к чешскому адвокату (advokát).',
  legalNotes: [
    'SmlouvaHned не предоставляет юридических консультаций и не имеет разрешения на адвокатскую деятельность в Чешской Республике.',
    'SmlouvaHned не предоставляет иммиграционных консультаций. По вопросам виз, разрешения на проживание или иностранной полиции обратитесь в МВД ЧР (OAMP), к иммиграционному адвокату или в некоммерческую организацию, поддерживающую иностранцев.',
    'Переводы договора на иностранные языки предоставляются исключительно для удобства. Они не являются заверенными (úředně ověřené) переводами и могут не быть приняты чешскими учреждениями как официальные. Если заверенный перевод требуется по закону, договору или учреждению, его необходимо получить у судебного переводчика (soudní tlumočník).',
  ],
  switchToCzech: '← Česká verze (чешская версия)',
  alsoAvailableIn: 'Также доступно',
};

// ─── VIETNAMESE ────────────────────────────────────────────────────────────
const VN: LandingContent = {
  htmlTitle: 'Hợp đồng tiếng Séc trực tuyến — thuê nhà, lao động, NDA trong 5 phút | SmlouvaHned',
  metaDescription:
    'Tạo hợp đồng pháp lý tiếng Séc trực tuyến mà không cần luật sư. Hợp đồng thuê nhà, DPP, hợp đồng lao động, NDA, giấy ủy quyền — điền biểu mẫu và nhận PDF tiếng Séc sẵn sàng để ký. Dành cho người nước ngoài sống tại Cộng hòa Séc.',
  keywords: [
    'hợp đồng thuê nhà Séc',
    'hợp đồng thuê nhà Praha',
    'hợp đồng lao động Séc',
    'DPP tiếng Việt',
    'NDA Séc',
    'giấy ủy quyền Séc',
  ],
  ogTitle: 'Hợp đồng tiếng Séc trực tuyến — thuê nhà, lao động, NDA',
  ogDescription:
    'Trình tạo hợp đồng pháp lý tiếng Séc trực tuyến. Thuê nhà, DPP, lao động, NDA. Dành cho người nước ngoài tại Séc.',
  kicker: 'Dành cho người nước ngoài sống tại Cộng hòa Séc',
  h1Line1: 'Hợp đồng tiếng Séc trực tuyến —',
  h1Line2: 'thuê nhà, lao động, NDA trong 5 phút',
  intro:
    'SmlouvaHned tạo các hợp đồng pháp lý tiếng Séc tiêu chuẩn trực tiếp từ một biểu mẫu có cấu trúc. Đầu ra là PDF tiếng Séc đáp ứng yêu cầu của cơ quan nhà nước Séc, ngân hàng, người sử dụng lao động và cảnh sát người nước ngoài (cizinecká policie). Dành cho cộng đồng người Việt, du học sinh và người nước ngoài sống tại Praha, Brno, Plzeň, Ostrava và các thành phố khác ở Séc.',
  ctaPrimary: 'Tạo hợp đồng thuê nhà →',
  ctaSecondary: 'Tạo DPP',
  warningBanner:
    '⚠ Giao diện biểu mẫu hiện vẫn bằng tiếng Séc. Bản dịch tiếng Việt đang được phát triển — hợp đồng thuê nhà và DPP sẽ có trước. Bản tiếng Séc của PDF có giá trị ưu tiên; bản dịch tiếng Việt được kèm theo chỉ để tiện theo dõi và không phải là bản dịch chính thức hoặc có công chứng.',
  contractsHeading: 'Các hợp đồng hiện có',
  openCzechForm: 'Mở biểu mẫu tiếng Séc →',
  contracts: withContracts([
    { title: 'Hợp đồng thuê nhà (nájemní smlouva)', blurb: 'Thuê căn hộ theo § 2235 Bộ luật Dân sự Séc. Tiền đặt cọc, điều chỉnh giá thuê, biên bản bàn giao.' },
    { title: 'Hợp đồng cho thuê lại (podnájemní smlouva)', blurb: 'Cho thuê lại căn hộ hoặc phòng bạn đang thuê. Cần sự đồng ý của chủ nhà.' },
    { title: 'DPP — thỏa thuận thực hiện công việc (dohoda o provedení práce)', blurb: 'Công việc nhỏ tối đa 300 giờ mỗi năm cho mỗi người sử dụng lao động.' },
    { title: 'Hợp đồng lao động (pracovní smlouva)', blurb: 'Lao động tiêu chuẩn theo Bộ luật Lao động Séc.' },
    { title: 'Hợp đồng mua bán (kupní smlouva)', blurb: 'Bán động sản — hợp đồng mua bán phổ thông.' },
    { title: 'Hợp đồng mua bán xe ô tô', blurb: 'Bán xe đã qua sử dụng kèm biên bản bàn giao.' },
    { title: 'Hợp đồng tặng cho (darovací smlouva)', blurb: 'Tặng cho động sản hoặc bất động sản.' },
    { title: 'Hợp đồng cho vay (smlouva o zápůjčce)', blurb: 'Cho vay tiền với điều khoản hoàn trả.' },
    { title: 'Xác nhận nợ (uznání dluhu)', blurb: 'Xác nhận chính thức một khoản nợ đang tồn tại.' },
    { title: 'Thỏa thuận bảo mật (NDA)', blurb: 'Bảo vệ thông tin kinh doanh bí mật.' },
    { title: 'Hợp đồng thực hiện công trình (smlouva o dílo)', blurb: 'Công việc theo đặt hàng, xây dựng, phần mềm, sửa chữa.' },
    { title: 'Hợp đồng cung cấp dịch vụ (smlouva o poskytování služeb)', blurb: 'Dịch vụ định kỳ hoặc một lần.' },
    { title: 'Hợp đồng hợp tác (smlouva o spolupráci)', blurb: 'Hợp tác B2B giữa các doanh nghiệp độc lập.' },
    { title: 'Giấy ủy quyền (plná moc)', blurb: 'Ủy quyền người khác hành động thay bạn — ví dụ tại cảnh sát người nước ngoài, ngân hàng, cơ quan đăng ký.' },
  ]),
  howItWorksHeading: 'Cách hoạt động',
  howItWorks: [
    { title: '1. Chọn hợp đồng.', description: 'Chọn một trong 14 loại tài liệu tiêu chuẩn.' },
    { title: '2. Điền biểu mẫu.', description: 'Nhập các bên, số tiền, ngày tháng và các điều khoản tùy chọn. Nhãn trường hiện bằng tiếng Séc — sử dụng trình dịch của trình duyệt (chuột phải → Dịch).' },
    { title: '3. Thanh toán và tải về.', description: 'Thanh toán bằng thẻ qua Stripe (bằng CZK). Tải về PDF song ngữ (tiếng Séc + tiếng Việt) ngay lập tức. Liên kết có hiệu lực 7–30 ngày.' },
    { title: '4. Ký trên giấy.', description: 'In ra, hai bên ký, mỗi bên giữ một bản. Hợp đồng Séc thường không cần công chứng (trừ bất động sản và các văn bản doanh nghiệp cụ thể).' },
  ],
  whyHeading: 'Tại sao người nước ngoài chọn SmlouvaHned',
  whyBullets: [
    '✓ PDF song ngữ — tiếng Séc (bản ưu tiên) + tiếng Việt bên cạnh, để bạn hiểu mình đang ký gì.',
    '✓ PDF tiếng Séc được chủ nhà, người sử dụng lao động, ngân hàng, sở giấy phép kinh doanh và cảnh sát người nước ngoài chấp nhận.',
    '✓ Mẫu được xây dựng theo Bộ luật Dân sự (§ 89/2012 Sb.) và Bộ luật Lao động — có tham chiếu điều khoản.',
    '✓ Lưu trữ dữ liệu mã hóa tạm thời — tự động xóa sau 7–30 ngày.',
    '✓ Thanh toán bằng korun Séc qua Stripe. Không đăng ký thuê bao, trả tiền cho từng hợp đồng.',
    '✓ Được xây dựng và vận hành tại Séc bởi Karel Zdeněk, IČ 23660295.',
  ],
  faqHeading: 'Câu hỏi thường gặp',
  faq: [
    { q: 'Tôi không nói tiếng Séc. Tôi vẫn có thể dùng SmlouvaHned không?', a: 'Có. PDF song ngữ (tiếng Séc + tiếng của bạn). Giao diện biểu mẫu được dịch dần — hợp đồng thuê nhà và DPP trước. Với các hợp đồng khác, dùng trình dịch của trình duyệt khi điền. Trong trường hợp có bất kỳ sự khác biệt nào giữa các phiên bản ngôn ngữ, bản tiếng Séc được ưu tiên áp dụng — bản dịch chỉ để tiện theo dõi và không phải là bản dịch chính thức hoặc có công chứng.' },
    { q: 'Hợp đồng có hợp pháp tại Séc không?', a: 'Có. Mỗi mẫu được xây dựng theo các quy định liên quan của Bộ luật Dân sự Séc (Luật số 89/2012 Coll.) hoặc Bộ luật Lao động. Các tham chiếu điều khoản có trong tài liệu.' },
    { q: 'SmlouvaHned có phải là công ty luật không?', a: 'Không. SmlouvaHned là một công cụ phần mềm tạo các hợp đồng mẫu tiêu chuẩn. Đây không phải tư vấn pháp lý và không thay thế luật sư Séc (advokát).' },
    { q: 'Thanh toán hoạt động như thế nào?', a: 'Sau khi điền biểu mẫu, chọn gói và thanh toán bằng thẻ qua Stripe. Thanh toán bằng korun Séc (CZK).' },
    { q: 'PDF có thể tải về trong bao lâu?', a: 'Liên kết có hiệu lực 7 ngày (tài liệu cơ bản) hoặc 30 ngày (tài liệu mở rộng). Dữ liệu được lưu mã hóa trong thời gian này rồi tự động xóa.' },
  ],
  disclaimerHeading: 'Tuyên bố miễn trừ — không phải công ty luật',
  disclaimerBody:
    'SmlouvaHned là một công cụ phần mềm, không phải công ty luật. Tài liệu được tạo là các mẫu tiêu chuẩn cho các tình huống thông thường. Chúng không thay thế tư vấn pháp lý cá nhân. Với các vấn đề phức tạp hoặc bất thường, vui lòng tham khảo luật sư Séc (advokát).',
  legalNotes: [
    'SmlouvaHned không cung cấp tư vấn pháp lý và không được phép hành nghề luật tại Cộng hòa Séc.',
    'SmlouvaHned không cung cấp tư vấn về di trú. Đối với các vấn đề thị thực, giấy phép cư trú hoặc cảnh sát người nước ngoài, vui lòng liên hệ Bộ Nội vụ Séc (OAMP), luật sư về di trú, hoặc tổ chức phi lợi nhuận hỗ trợ người nước ngoài.',
    'Bản dịch hợp đồng sang tiếng nước ngoài chỉ được cung cấp để tiện theo dõi. Chúng không phải là bản dịch có công chứng (úředně ověřené) và có thể không được các cơ quan Séc chấp nhận làm bản dịch chính thức. Khi pháp luật, hợp đồng hoặc cơ quan yêu cầu bản dịch có công chứng, bạn phải có được nó từ một biên dịch viên do tòa án bổ nhiệm (soudní tlumočník).',
  ],
  switchToCzech: '← Česká verze (phiên bản tiếng Séc)',
  alsoAvailableIn: 'Cũng có sẵn',
};

// ─── GERMAN ────────────────────────────────────────────────────────────────
const DE: LandingContent = {
  htmlTitle: 'Tschechische Verträge online — Mietvertrag, Arbeit, NDA in 5 Minuten | SmlouvaHned',
  metaDescription:
    'Tschechische Rechtsverträge online ohne Anwalt erstellen. Mietvertrag, DPP, Arbeitsvertrag, NDA, Vollmacht und mehr — Formular ausfüllen, fertige tschechische PDF zum Unterschreiben erhalten. Für Ausländer in Tschechien.',
  keywords: [
    'Mietvertrag Tschechien',
    'Wohnung mieten Prag',
    'Arbeitsvertrag Tschechien',
    'DPP Vertrag Deutsch',
    'NDA Tschechien',
    'Vollmacht Tschechien',
  ],
  ogTitle: 'Tschechische Verträge online — Mietvertrag, Arbeit, NDA in 5 Minuten',
  ogDescription:
    'Generator für tschechische Rechtsverträge online. Miete, DPP, Arbeit, NDA. Für Ausländer in Tschechien.',
  kicker: 'Für Ausländer in Tschechien',
  h1Line1: 'Tschechische Verträge online —',
  h1Line2: 'Miete, Arbeit, NDA in 5 Minuten',
  intro:
    'SmlouvaHned erstellt tschechische Standard-Rechtsverträge direkt aus einem strukturierten Formular. Ausgabe ist eine tschechische PDF, die von Behörden, Banken, Arbeitgebern und der Ausländerpolizei (cizinecká policie) anerkannt wird. Für Expats, Studierende und internationale Fachkräfte in Prag, Brno, Pilsen, Ostrava und anderswo in Tschechien.',
  ctaPrimary: 'Mietvertrag starten →',
  ctaSecondary: 'DPP-Vertrag starten',
  warningBanner:
    '⚠ Das Formular ist derzeit auf Tschechisch. Die deutsche Lokalisierung ist in Arbeit — Mietvertrag und DPP zuerst. Bei Abweichungen zwischen den Sprachfassungen ist der tschechische Wortlaut der PDF maßgebend; die deutsche Übersetzung dient ausschließlich zur Verständlichkeit und ist keine beglaubigte oder amtliche Übersetzung.',
  contractsHeading: 'Verfügbare Verträge',
  openCzechForm: 'Tschechisches Formular öffnen →',
  contracts: withContracts([
    { title: 'Mietvertrag (nájemní smlouva)', blurb: 'Wohnungsmiete nach § 2235 tschechisches BGB. Kaution, Indexierung, Übergabeprotokoll.' },
    { title: 'Untermietvertrag (podnájemní smlouva)', blurb: 'Untervermietung einer gemieteten Wohnung oder eines Zimmers. Zustimmung des Vermieters erforderlich.' },
    { title: 'DPP — Vereinbarung zur Arbeitsleistung (dohoda o provedení práce)', blurb: 'Kleinarbeit bis zu 300 Stunden pro Kalenderjahr und Arbeitgeber.' },
    { title: 'Arbeitsvertrag (pracovní smlouva)', blurb: 'Standardarbeitsverhältnis nach tschechischem Arbeitsgesetzbuch.' },
    { title: 'Kaufvertrag (kupní smlouva)', blurb: 'Verkauf beweglicher Sachen — allgemeiner Kaufvertrag.' },
    { title: 'Kfz-Kaufvertrag', blurb: 'Verkauf eines Gebrauchtwagens mit Übergabeprotokoll.' },
    { title: 'Schenkungsvertrag (darovací smlouva)', blurb: 'Schenkung beweglicher oder unbeweglicher Sachen.' },
    { title: 'Darlehensvertrag (smlouva o zápůjčce)', blurb: 'Gelddarlehen mit Rückzahlungsbedingungen.' },
    { title: 'Schuldanerkenntnis (uznání dluhu)', blurb: 'Formelle Anerkennung einer bestehenden Schuld.' },
    { title: 'Geheimhaltungsvereinbarung (NDA)', blurb: 'Schutz vertraulicher Geschäftsinformationen.' },
    { title: 'Werkvertrag (smlouva o dílo)', blurb: 'Maßgeschneiderte Arbeit, Bau, Software, Reparaturen.' },
    { title: 'Dienstleistungsvertrag (smlouva o poskytování služeb)', blurb: 'Wiederkehrende oder einmalige Dienstleistungen.' },
    { title: 'Kooperationsvertrag (smlouva o spolupráci)', blurb: 'B2B-Zusammenarbeit zwischen selbstständigen Unternehmen.' },
    { title: 'Vollmacht (plná moc)', blurb: 'Ermächtigung Dritter, in Ihrem Namen zu handeln — z. B. bei der Ausländerpolizei, Bank, im Register.' },
  ]),
  howItWorksHeading: 'So funktioniert es',
  howItWorks: [
    { title: '1. Vertrag wählen.', description: 'Wählen Sie aus 14 Standard-Dokumenttypen.' },
    { title: '2. Formular ausfüllen.', description: 'Tragen Sie Parteien, Beträge, Daten und optionale Klauseln ein. Feldbeschriftungen sind derzeit Tschechisch — nutzen Sie den Browser-Übersetzer (Rechtsklick → Übersetzen).' },
    { title: '3. Bezahlen und herunterladen.', description: 'Kartenzahlung über Stripe (in CZK). Zweisprachige PDF (Tschechisch + Deutsch) sofort verfügbar. Link 7–30 Tage gültig.' },
    { title: '4. Auf Papier unterschreiben.', description: 'Drucken, beide Parteien unterschreiben, jede behält ein Exemplar. Tschechische Verträge erfordern in der Regel keine notarielle Beglaubigung (außer Immobilien und bestimmte Gesellschaftsakte).' },
  ],
  whyHeading: 'Warum Ausländer SmlouvaHned nutzen',
  whyBullets: [
    '✓ Zweisprachige PDF — Tschechisch (der maßgebliche Wortlaut) + Deutsch daneben, damit Sie verstehen, was Sie unterschreiben.',
    '✓ Tschechische PDF wird von Vermietern, Arbeitgebern, Banken, Gewerbeamt und Ausländerpolizei akzeptiert.',
    '✓ Vorlagen orientieren sich am tschechischen BGB (§ 89/2012 Slg.) und Arbeitsgesetzbuch — mit Paragraphenverweisen.',
    '✓ Verschlüsselte temporäre Datenspeicherung — automatische Löschung nach 7–30 Tagen.',
    '✓ Zahlung in tschechischen Kronen über Stripe. Kein Abo, pro Vertrag.',
    '✓ Entwickelt und betrieben in Tschechien durch Karel Zdeněk, IČ 23660295.',
  ],
  faqHeading: 'Häufige Fragen',
  faq: [
    { q: 'Ich spreche kein Tschechisch. Kann ich SmlouvaHned trotzdem nutzen?', a: 'Ja. Die PDF ist zweisprachig (Tschechisch + Ihre Sprache). Die Formular-Oberfläche wird schrittweise übersetzt — Mietvertrag und DPP zuerst. Für andere Verträge nutzen Sie den Browser-Übersetzer. Bei Abweichungen zwischen den Sprachfassungen ist der tschechische Wortlaut maßgebend — die Übersetzung dient nur der Verständlichkeit und ist keine beglaubigte oder amtliche Übersetzung.' },
    { q: 'Ist der Vertrag in Tschechien rechtsgültig?', a: 'Ja. Jede Vorlage stützt sich auf die einschlägigen Bestimmungen des tschechischen BGB (Gesetz Nr. 89/2012 Slg.) oder Arbeitsgesetzbuchs. Paragraphenverweise erscheinen im Dokument.' },
    { q: 'Ist SmlouvaHned eine Anwaltskanzlei?', a: 'Nein. SmlouvaHned ist ein Software-Tool zur Erstellung von Standard-Vorlageverträgen. Es ist keine Rechtsberatung und ersetzt keinen tschechischen Anwalt (advokát).' },
    { q: 'Wie funktioniert die Zahlung?', a: 'Nach dem Ausfüllen wählen Sie ein Paket und zahlen per Karte über Stripe. Zahlung in tschechischen Kronen (CZK).' },
    { q: 'Wie lange ist mein PDF zum Download verfügbar?', a: 'Der Link ist 7 Tage (Basis-Dokument) bzw. 30 Tage (erweitertes Dokument) gültig. Ihre Formulardaten werden nur für diesen Zeitraum verschlüsselt gespeichert und dann automatisch gelöscht.' },
  ],
  disclaimerHeading: 'Haftungsausschluss — keine Anwaltskanzlei',
  disclaimerBody:
    'SmlouvaHned ist ein Software-Tool, keine Anwaltskanzlei. Die erstellten Dokumente sind Standard-Vorlagen für typische Situationen. Sie ersetzen keine individuelle Rechtsberatung. Für nicht standardisierte oder komplexe Sachverhalte konsultieren Sie bitte einen tschechischen Anwalt (advokát).',
  legalNotes: [
    'SmlouvaHned bietet keine Rechtsberatung an und ist nicht zur Ausübung der Rechtsanwaltschaft in der Tschechischen Republik berechtigt.',
    'SmlouvaHned bietet keine Aufenthalts- oder Visumsberatung an. Für Visum-, Aufenthaltstitel- oder Ausländerpolizeiangelegenheiten wenden Sie sich an die tschechische Migrationsbehörde (OAMP), einen Migrationsanwalt oder eine gemeinnützige Organisation zur Unterstützung von Ausländern.',
    'Übersetzungen des Vertrags in Fremdsprachen werden ausschließlich zur Verständlichkeit bereitgestellt. Sie sind keine beglaubigten (úředně ověřené) Übersetzungen und werden von tschechischen Behörden möglicherweise nicht als amtliche Übersetzungen akzeptiert. Wenn eine beglaubigte Übersetzung gesetzlich, vertraglich oder behördlich gefordert wird, ist sie von einem gerichtlich bestellten Übersetzer (soudní tlumočník) einzuholen.',
  ],
  switchToCzech: '← Česká verze (tschechische Version)',
  alsoAvailableIn: 'Auch verfügbar in',
};

export const LANDINGS: Record<Exclude<Locale, 'cs'>, LandingContent> = {
  en: EN,
  ua: UK,
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
