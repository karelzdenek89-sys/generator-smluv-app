import type {
  ExpatBlogArticle,
  ExpatBlogContractKey,
  ExpatBlogSection,
} from '@/lib/i18n/expat-blog-articles';
import { getExpatSeoHref } from '@/lib/i18n/expat-seo-landings';
import { withLocale } from '@/lib/locale';

const HUB_EN = 'foreigners-czech-contracts-guide-en';
const HUB_UA = 'foreigners-czech-contracts-guide-ua';
const DATE_EN = '29 July 2026';
const DATE_TIME = '2026-07-29';
const DATE_UA = '29 липня 2026';

function topicEn(
  contractKey: ExpatBlogContractKey,
  opts: {
    slug: string;
    title: string;
    excerpt: string;
    intro: string;
    keywords: string[];
    readTime: string;
    builderHref: string;
    seoLandingHref?: string;
    sections: ExpatBlogSection[];
    primaryCta: ExpatBlogArticle['primaryCta'];
    finalCta?: ExpatBlogArticle['finalCta'];
    trust: ExpatBlogArticle['trustBox'];
    relatedSlugs: string[];
  },
): ExpatBlogArticle {
  return {
    slug: opts.slug,
    audience: 'en',
    contractKey,
    category: 'For foreigners (EN)',
    readTime: opts.readTime,
    dateLabel: DATE_EN,
    dateTime: DATE_TIME,
    title: opts.title,
    excerpt: opts.excerpt,
    intro: opts.intro,
    keywords: opts.keywords,
    builderHref: opts.builderHref,
    seoLandingHref: opts.seoLandingHref,
    expatHubHref: '/en',
    toc: opts.sections.map((s, i) => ({ href: `#${s.id}`, label: `${i + 1}. ${s.title}` })),
    sections: opts.sections,
    primaryCta: opts.primaryCta,
    finalCta:
      opts.finalCta ?? {
        title: opts.primaryCta.title,
        body: 'Open the English-guided form, fill in your details, and download the Czech PDF after payment.',
        buttonLabel: opts.primaryCta.buttonLabel,
      },
    trustBox: opts.trust,
    disclaimer: {
      heading: 'Informational content — not legal services',
      body:
        'This article explains typical Czech contract practice in plain language. SmlouvaHned does not provide legal services within the meaning of Czech Act No. 85/1996 Coll., on the legal profession. It is not a substitute for individual advice from a Czech attorney (advokát).',
      lawyerNote:
        'For disputes, complex employment, immigration filings or high-value transactions, consult a registered Czech attorney.',
    },
    ui: {
      breadcrumbBlog: 'Blog',
      readTime: 'read',
      tocTitle: 'Contents',
      relatedHub: 'All guides for foreigners',
      backToExpats: 'Expat contract overview',
      contractLinksTitle: 'Create this document',
    },
    relatedSlugs: opts.relatedSlugs,
  };
}

function topicUa(
  contractKey: ExpatBlogContractKey,
  opts: {
    slug: string;
    title: string;
    excerpt: string;
    intro: string;
    keywords: string[];
    readTime: string;
    builderHref: string;
    seoLandingHref?: string;
    sections: ExpatBlogSection[];
    primaryCta: ExpatBlogArticle['primaryCta'];
    finalCta?: ExpatBlogArticle['finalCta'];
    trust: ExpatBlogArticle['trustBox'];
    relatedSlugs: string[];
  },
): ExpatBlogArticle {
  return {
    slug: opts.slug,
    audience: 'ua',
    contractKey,
    category: 'Для іноземців (UA)',
    readTime: opts.readTime,
    dateLabel: DATE_UA,
    dateTime: DATE_TIME,
    title: opts.title,
    excerpt: opts.excerpt,
    intro: opts.intro,
    keywords: opts.keywords,
    builderHref: opts.builderHref,
    seoLandingHref: opts.seoLandingHref,
    expatHubHref: '/ua',
    toc: opts.sections.map((s, i) => ({ href: `#${s.id}`, label: `${i + 1}. ${s.title}` })),
    sections: opts.sections,
    primaryCta: opts.primaryCta,
    finalCta:
      opts.finalCta ?? {
        title: opts.primaryCta.title,
        body: 'Відкрийте форму українською, заповніть дані та завантажте PDF чеською після оплати.',
        buttonLabel: opts.primaryCta.buttonLabel,
      },
    trustBox: opts.trust,
    disclaimer: {
      heading: 'Інформаційний матеріал — не юридичні послуги',
      body:
        'Стаття пояснює типову чеську практику. SmlouvaHned не надає юридичних послуг у розумінні закону ЧР № 85/1996 Зб. про адвокатуру. Це не заміна індивідуальної консультації чеського адвоката (advokát).',
      lawyerNote:
        'При спорах, складному працевлаштуванні, імміграції або дорогих угодах зверніться до зареєстрованого чеського адвоката.',
    },
    ui: {
      breadcrumbBlog: 'Блог',
      readTime: 'читання',
      tocTitle: 'Зміст',
      relatedHub: 'Усі гіди для іноземців',
      backToExpats: 'Огляд договорів для іноземців',
      contractLinksTitle: 'Створити документ',
    },
    relatedSlugs: opts.relatedSlugs,
  };
}

/**
 * EN + UA guides mirroring the July 2026 Czech cluster on money protections:
 * deposit return (§ 2254 OZ), withdrawal from contract (§ 2001 / § 1829 OZ)
 * and default interest (Government Regulation No. 351/2013 Coll.).
 */
export const EXPAT_BLOG_TOPICS_PROTECTIONS_2026: ExpatBlogArticle[] = [
  topicEn('lease', {
    slug: 'deposit-return-czechia-2026-guide-en',
    title: 'Getting Your Rental Deposit Back in Czechia 2026: Rules, Set-offs and Interest',
    excerpt:
      'How the security deposit (jistota/kauce) works when a Czech lease ends — the three-month cap, what a landlord may deduct, your right to interest and how to avoid disputes.',
    intro:
      'The deposit (jistota, commonly kauce) is easy to pay at move-in but often disputed at move-out. Czech law (§ 2254 of the Civil Code) caps the deposit, entitles the tenant to its return at the end of the lease and adds a right to interest. Knowing these rules helps foreign tenants get their money back without conflict.',
    keywords: [
      'rental deposit return Czech Republic',
      'kauce return Prague foreigners',
      'security deposit Czechia lease',
      'get deposit back Czech Republic',
    ],
    readTime: '8 min',
    builderHref: withLocale('/najem', 'en'),
    seoLandingHref: getExpatSeoHref('en', 'lease'),
    sections: [
      {
        id: 'deposit-basics',
        title: 'What the deposit is and the legal cap',
        paragraphs: [
          'The deposit secures rent and other lease obligations. It is not a prepayment — the landlord holds it and returns it after the lease ends.',
          'Under § 2254 of the Civil Code, the deposit together with any contractual penalty may not exceed three times the monthly rent. The cap is calculated from rent itself, not rent plus utility advances.',
        ],
      },
      {
        id: 'when-returned',
        title: 'When and how it is returned',
        paragraphs: [
          'The right to return arises when the lease ends. In practice the deposit is returned without undue delay once you hand over the flat and any claims are clear.',
          'Agree the timing and method (bank transfer, against signature) in the lease so both sides know what to expect.',
        ],
      },
      {
        id: 'set-offs',
        title: 'What the landlord may deduct',
        bullets: [
          'Unpaid rent and utility arrears may be set off against the deposit.',
          'Damage beyond normal wear must be documented — a handover protocol and photos help.',
          'Ordinary wear and tear (minor scuffs, worn carpet) is not a reason to reduce the deposit.',
          'A proportionate part is sometimes kept until utilities are billed; holding the whole deposit for months has no clear legal basis.',
        ],
        paragraphs: [],
      },
      {
        id: 'interest',
        title: 'Your right to interest',
        paragraphs: [
          'Under § 2254(2) the tenant is entitled to interest on the deposit from when it was provided, at least at the statutory rate, paid together with the returned deposit.',
          'Because the exact statutory rate for deposits is interpreted differently, it is practical to agree the interest rate (or method) directly in the lease.',
        ],
      },
    ],
    primaryCta: {
      title: 'Create a Czech rental agreement with clear deposit terms',
      body: 'English-guided form → Czech PDF; set the deposit amount, interest and return conditions.',
      buttonLabel: 'Open rental form (EN) →',
    },
    trust: {
      generatorSuitable: 'Standard apartment lease where the deposit and return conditions are agreed and put in writing.',
      lawyerSuitable: 'A landlord refusing to return a high-value deposit, unclear utility billing or a contested set-off.',
    },
    relatedSlugs: [HUB_EN, 'rental-agreement-czech-republic-guide-en', 'handover-protocol-czechia-2026-guide-en'],
  }),

  topicUa('lease', {
    slug: 'deposit-return-czechia-2026-guide-ua',
    title: 'Повернення застави за оренду в Чехії 2026: правила, утримання та відсотки',
    excerpt:
      'Як працює застава (jistota/kauce) при завершенні чеської оренди — ліміт у три місячні оренди, що може утримати орендодавець, право на відсотки та як уникнути спорів.',
    intro:
      'Заставу (jistota, зазвичай kauce) легко внести при вселенні, але саме при виселенні виникає найбільше спорів. Чеське право (§ 2254 Цивільного кодексу) обмежує розмір застави, гарантує її повернення після завершення оренди та додає право на відсотки. Знання цих правил допомагає іноземним орендарям повернути гроші без конфлікту.',
    keywords: [
      'повернення застави оренда Чехія',
      'kauce повернення Прага іноземці',
      'застава квартири Чехія',
      'повернути заставу Чехія',
    ],
    readTime: '8 хв',
    builderHref: withLocale('/najem', 'ua'),
    seoLandingHref: getExpatSeoHref('ua', 'lease'),
    sections: [
      {
        id: 'deposit-basics',
        title: 'Що таке застава і законний ліміт',
        paragraphs: [
          'Застава забезпечує оренду та інші зобов’язання з договору. Це не передоплата — орендодавець тримає її та повертає після завершення оренди.',
          'За § 2254 Цивільного кодексу застава разом із можливою договірною штрафною санкцією не може перевищувати трикратний місячний розмір оренди. Ліміт рахується від самої оренди, а не з авансами на комунальні.',
        ],
      },
      {
        id: 'when-returned',
        title: 'Коли і як повертається',
        paragraphs: [
          'Право на повернення виникає при завершенні оренди. На практиці заставу повертають без зайвого зволікання після передачі квартири, коли зрозумілі можливі претензії.',
          'Узгодьте строк і спосіб повернення (переказ на рахунок, під підпис) у договорі, щоб обидві сторони знали умови.',
        ],
      },
      {
        id: 'set-offs',
        title: 'Що може утримати орендодавець',
        bullets: [
          'Несплачену оренду та борги за комунальні можна зарахувати проти застави.',
          'Пошкодження понад звичайний знос має бути задокументоване — допоможе протокол передачі та фото.',
          'Звичайний знос (дрібні подряпини, витертий килим) не є підставою зменшувати заставу.',
          'Пропорційну частину інколи тримають до розрахунку комунальних; утримання всієї застави на місяці не має чіткої опори в законі.',
        ],
        paragraphs: [],
      },
      {
        id: 'interest',
        title: 'Ваше право на відсотки',
        paragraphs: [
          'За § 2254(2) орендар має право на відсотки із застави від моменту її надання, щонайменше у законному розмірі, які виплачуються разом із поверненням застави.',
          'Оскільки точний законний розмір для застави тлумачать по-різному, практично узгодити ставку відсотків (або спосіб розрахунку) прямо в договорі.',
        ],
      },
    ],
    primaryCta: {
      title: 'Створити договір оренди з чіткими умовами застави',
      body: 'Форма українською → чеський PDF; вкажіть розмір застави, відсотки та умови повернення.',
      buttonLabel: 'Відкрити форму оренди (UA) →',
    },
    trust: {
      generatorSuitable: 'Типовий договір оренди, де застава та умови повернення узгоджені й зафіксовані письмово.',
      lawyerSuitable: 'Орендодавець відмовляється повернути велику заставу, незрозумілий розрахунок комунальних або спірне зарахування.',
    },
    relatedSlugs: [HUB_UA, 'rental-agreement-czech-republic-guide-ua', 'handover-protocol-czechia-2026-guide-ua'],
  }),

  topicEn('hub', {
    slug: 'withdrawal-from-contract-czechia-2026-guide-en',
    title: 'Withdrawing from a Contract in Czechia 2026: When You Can and the 14-Day Myth',
    excerpt:
      'You cannot cancel a signed Czech contract just because you changed your mind. When withdrawal (odstoupení) is allowed, its effects, and when the consumer 14-day right actually applies.',
    intro:
      'Foreigners often assume every contract has a 14-day cooling-off period. Under Czech law you can withdraw (odstoupit) only where the parties agreed it or the law allows it (§ 2001 of the Civil Code). The consumer 14-day right (§ 1829) is a specific protection — not a general escape from any deal.',
    keywords: [
      'withdraw from contract Czech Republic',
      'odstoupení od smlouvy foreigners',
      '14 day cooling off Czechia',
      'cancel contract Czech Republic',
    ],
    readTime: '8 min',
    builderHref: '/en',
    sections: [
      {
        id: 'no-general-right',
        title: 'There is no general right to walk away',
        paragraphs: [
          'A signed contract binds you. Withdrawal is possible only if the parties agreed on it or a statute provides for it (§ 2001).',
          'This differs from termination (výpověď), which ends an ongoing relationship for the future, and from a mutual cancellation agreement.',
        ],
      },
      {
        id: 'when-allowed',
        title: 'When withdrawal is allowed',
        paragraphs: [
          'A common statutory ground is a material breach by the other party (§ 2002) — for example the seller fails to deliver or the buyer fails to pay.',
          'Parties can also agree their own grounds in the contract, such as delay beyond a set number of days. Writing these grounds down avoids argument later.',
        ],
      },
      {
        id: 'effects',
        title: 'What withdrawal does',
        paragraphs: [
          'Withdrawal cancels the obligation from the outset (§ 2004(1)). The parties generally return what they already exchanged — goods for money.',
          'The right to a contractual penalty or to damages caused by the breach usually survives. Withdraw in writing and keep proof of delivery.',
        ],
      },
      {
        id: 'consumer-14-days',
        title: 'The consumer 14-day right (§ 1829)',
        bullets: [
          'Applies to consumers for distance contracts (e-shops, phone) or off-premises contracts (doorstep, sales events).',
          'Does not apply to an in-person deal between two private individuals, nor between businesses.',
          'The 14 days usually run from receipt of goods; an unsolicited visit or promotional event extends it to 30 days.',
          'Some contracts are excluded — for example goods made to order (§ 1837).',
        ],
        paragraphs: [],
      },
    ],
    primaryCta: {
      title: 'See supported contracts in English',
      body: 'Open the English overview, pick a document type and set clear withdrawal grounds before you sign.',
      buttonLabel: 'Open /en contract overview →',
    },
    trust: {
      generatorSuitable: 'Standard private contracts where both sides want clear, written grounds for ending the deal.',
      lawyerSuitable: 'A disputed withdrawal, high-value transaction or the other side refusing to accept your withdrawal.',
    },
    relatedSlugs: [HUB_EN, 'why-smlouvahned-not-template-2026-guide-en', 'late-payment-interest-czechia-2026-guide-en'],
  }),

  topicUa('hub', {
    slug: 'withdrawal-from-contract-czechia-2026-guide-ua',
    title: 'Відмова (відступлення) від договору в Чехії 2026: коли можна і міф про 14 днів',
    excerpt:
      'Підписаний чеський договір не можна скасувати лише тому, що ви передумали. Коли можлива відмова (odstoupení), її наслідки та коли справді діє споживче право на 14 днів.',
    intro:
      'Іноземці часто вважають, що в кожного договору є 14 днів на роздуми. За чеським правом відмовитися (odstoupit) можна лише там, де це узгодили сторони або дозволяє закон (§ 2001 Цивільного кодексу). Споживче право на 14 днів (§ 1829) — це окремий захист, а не загальний спосіб вийти з будь-якої угоди.',
    keywords: [
      'відмова від договору Чехія',
      'odstoupení від договору іноземці',
      '14 днів на повернення Чехія',
      'скасувати договір Чехія',
    ],
    readTime: '8 хв',
    builderHref: '/ua',
    sections: [
      {
        id: 'no-general-right',
        title: 'Загального права «вийти» з договору немає',
        paragraphs: [
          'Підписаний договір зобов’язує. Відмова можлива лише якщо сторони це узгодили або передбачає закон (§ 2001).',
          'Це відрізняється від розірвання (výpověď), яке припиняє тривалі відносини на майбутнє, і від угоди про скасування за згодою сторін.',
        ],
      },
      {
        id: 'when-allowed',
        title: 'Коли відмова можлива',
        paragraphs: [
          'Типова законна підстава — істотне порушення другою стороною (§ 2002): наприклад продавець не передає річ або покупець не платить.',
          'Сторони також можуть узгодити власні підстави в договорі, наприклад прострочення понад визначену кількість днів. Записані підстави уникають суперечок пізніше.',
        ],
      },
      {
        id: 'effects',
        title: 'Наслідки відмови',
        paragraphs: [
          'Відмова скасовує зобов’язання від початку (§ 2004(1)). Сторони зазвичай повертають те, що вже надали, — річ за гроші.',
          'Право на договірну штрафну санкцію чи відшкодування шкоди від порушення зазвичай зберігається. Відмовляйтеся письмово та зберігайте підтвердження доставки.',
        ],
      },
      {
        id: 'consumer-14-days',
        title: 'Споживче право на 14 днів (§ 1829)',
        bullets: [
          'Діє для споживачів при дистанційних договорах (інтернет-магазини, телефон) або поза торговими приміщеннями (на порозі, презентації).',
          'Не діє при особистій угоді між двома фізособами і між підприємцями.',
          '14 днів зазвичай рахуються від отримання товару; невитребувана візита або презентація подовжують строк до 30 днів.',
          'Деякі договори виключені — наприклад товар, виготовлений на замовлення (§ 1837).',
        ],
        paragraphs: [],
      },
    ],
    primaryCta: {
      title: 'Переглянути договори українською',
      body: 'Відкрийте огляд /ua, оберіть тип документа та узгодьте чіткі підстави відмови до підпису.',
      buttonLabel: 'Відкрити огляд /ua →',
    },
    trust: {
      generatorSuitable: 'Типові приватні договори, де сторони хочуть чіткі письмові підстави для завершення угоди.',
      lawyerSuitable: 'Спірна відмова, дорога угода або друга сторона не визнає вашу відмову.',
    },
    relatedSlugs: [HUB_UA, 'why-smlouvahned-not-template-2026-guide-ua', 'late-payment-interest-czechia-2026-guide-ua'],
  }),

  topicEn('hub', {
    slug: 'late-payment-interest-czechia-2026-guide-en',
    title: 'Late-Payment Interest in Czechia 2026: What You Can Claim on an Unpaid Invoice',
    excerpt:
      'Default interest (úrok z prodlení) arises by law even without a clause. How it is calculated from the ČNB repo rate, how it differs from a penalty, and the flat cost of recovery.',
    intro:
      'If a client or debtor pays late, Czech law gives the creditor a right to default interest (úrok z prodlení) — even if the contract says nothing about it. For foreign freelancers and businesses in Czechia, this is a practical tool against unpaid invoices. The rate is set by Government Regulation No. 351/2013 Coll.',
    keywords: [
      'late payment interest Czech Republic',
      'úrok z prodlení unpaid invoice',
      'default interest Czechia freelancer',
      'unpaid invoice Czech Republic',
    ],
    readTime: '8 min',
    builderHref: withLocale('/smlouva-o-dilo', 'en'),
    sections: [
      {
        id: 'what-it-is',
        title: 'What default interest is',
        paragraphs: [
          'Default interest is a statutory sanction for paying a monetary debt late. Under § 1970 of the Civil Code, a creditor who met their own duties may claim it from a debtor in delay.',
          'The right arises by law — it does not need to be in the contract. Interest accrues from the day after the due date for each day of delay, so a clear due date on the invoice matters.',
        ],
      },
      {
        id: 'how-calculated',
        title: 'How the amount is calculated',
        paragraphs: [
          'The annual rate equals the ČNB repo rate set for the first day of the half-year in which the delay began, plus 8 percentage points (Government Regulation No. 351/2013 Coll.).',
          'Once fixed, the rate does not change for the whole delay. Formula: debt × annual rate × days of delay ÷ 365. Check the ČNB for the repo rate at the start of the delay.',
        ],
      },
      {
        id: 'vs-penalty',
        title: 'Interest vs contractual penalty',
        paragraphs: [
          'Default interest comes from the law and concerns monetary debt; a contractual penalty must be agreed and can secure non-monetary duties too. Both can apply alongside each other.',
          'Between businesses the interest rate can be agreed differently, but a consumer may not be given a rate lower than the statutory one.',
        ],
      },
      {
        id: 'flat-cost',
        title: 'Flat cost of recovery and enforcement',
        bullets: [
          'For mutual obligations between businesses, a minimum flat compensation of CZK 1,200 per claim applies (Regulation No. 351/2013).',
          'Send a written reminder stating the debt and the accruing interest.',
          'An acknowledgment of debt with an instalment plan can make the next steps easier.',
        ],
        paragraphs: [],
      },
    ],
    primaryCta: {
      title: 'Protect payment in a Czech work contract',
      body: 'English-guided smlouva o dílo → Czech PDF with scope, price and clear payment terms.',
      buttonLabel: 'Open work contract form (EN) →',
    },
    trust: {
      generatorSuitable: 'Freelance or business contracts where you want clear payment terms and a basis for default interest.',
      lawyerSuitable: 'A disputed claim, defending against a demand, or court recovery of a larger amount.',
    },
    relatedSlugs: [HUB_EN, 'freelancer-work-contract-czechia-2026-guide-en', 'withdrawal-from-contract-czechia-2026-guide-en'],
  }),

  topicUa('hub', {
    slug: 'late-payment-interest-czechia-2026-guide-ua',
    title: 'Відсотки за прострочення в Чехії 2026: на що ви маєте право за несплаченою фактурою',
    excerpt:
      'Відсотки за прострочення (úrok z prodlení) виникають за законом навіть без пункту в договорі. Як їх рахують від репо-ставки ČNB, чим відрізняються від штрафу та паушальна компенсація витрат.',
    intro:
      'Якщо клієнт чи боржник платить із запізненням, чеське право дає кредитору право на відсотки за прострочення (úrok z prodlení) — навіть якщо в договорі про це нічого немає. Для іноземних фрілансерів і бізнесу в Чехії це практичний інструмент проти несплачених фактур. Розмір визначає постанова уряду № 351/2013 Зб.',
    keywords: [
      'відсотки за прострочення Чехія',
      'úrok z prodlení несплачена фактура',
      'законні відсотки Чехія фрілансер',
      'несплачена фактура Чехія',
    ],
    readTime: '8 хв',
    builderHref: withLocale('/smlouva-o-dilo', 'ua'),
    sections: [
      {
        id: 'what-it-is',
        title: 'Що таке відсотки за прострочення',
        paragraphs: [
          'Це законна санкція за пізню сплату грошового боргу. За § 1970 Цивільного кодексу кредитор, який сам виконав свої обов’язки, може вимагати їх від боржника у простроченні.',
          'Право виникає за законом — його не треба прописувати в договорі. Відсотки нараховуються від дня після строку оплати за кожен день прострочення, тож чіткий строк оплати у фактурі важливий.',
        ],
      },
      {
        id: 'how-calculated',
        title: 'Як рахується сума',
        paragraphs: [
          'Річна ставка дорівнює репо-ставці ČNB, встановленій на перший день півріччя, коли почалося прострочення, плюс 8 процентних пунктів (постанова уряду № 351/2013 Зб.).',
          'Після фіксації ставка не змінюється протягом усього прострочення. Формула: борг × річна ставка × дні прострочення ÷ 365. Перевірте репо-ставку ČNB на початок прострочення.',
        ],
      },
      {
        id: 'vs-penalty',
        title: 'Відсотки vs договірна штрафна санкція',
        paragraphs: [
          'Відсотки за прострочення випливають із закону і стосуються грошового боргу; договірна санкція має бути узгоджена і може забезпечувати й негрошові обов’язки. Обидва можна застосувати разом.',
          'Між підприємцями ставку можна узгодити інакше, але споживачеві не можна встановити ставку, нижчу за законну.',
        ],
      },
      {
        id: 'flat-cost',
        title: 'Паушальна компенсація витрат і стягнення',
        bullets: [
          'Для взаємних зобов’язань між підприємцями діє мінімальна паушальна компенсація 1 200 Kč за кожну вимогу (постанова № 351/2013).',
          'Надішліть письмове нагадування із зазначенням боргу та відсотків, що нараховуються.',
          'Визнання боргу з графіком розстрочки полегшує наступні кроки.',
        ],
        paragraphs: [],
      },
    ],
    primaryCta: {
      title: 'Захистіть оплату в чеському договорі підряду',
      body: 'Форма smlouva o dílo українською → чеський PDF з обсягом, ціною та чіткими умовами оплати.',
      buttonLabel: 'Відкрити форму договору підряду (UA) →',
    },
    trust: {
      generatorSuitable: 'Фріланс- або бізнес-договори, де потрібні чіткі умови оплати та підстава для відсотків за прострочення.',
      lawyerSuitable: 'Спірна вимога, захист проти претензії або судове стягнення більшої суми.',
    },
    relatedSlugs: [HUB_UA, 'freelancer-work-contract-czechia-2026-guide-ua', 'withdrawal-from-contract-czechia-2026-guide-ua'],
  }),
];
