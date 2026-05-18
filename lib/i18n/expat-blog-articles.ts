import type { ExpatContractType } from '@/lib/i18n/expat-locale-copy';
import { EXPAT_CONTRACT_ROUTES, withLocale, type AppLocale } from '@/lib/locale';

export type ExpatBlogAudience = 'en' | 'ua';

export type ExpatBlogContractKey = ExpatContractType | 'hub';

export type ExpatBlogSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type ExpatBlogArticle = {
  slug: string;
  audience: ExpatBlogAudience;
  contractKey: ExpatBlogContractKey;
  category: string;
  readTime: string;
  dateLabel: string;
  dateTime: string;
  title: string;
  excerpt: string;
  intro: string;
  keywords: string[];
  builderHref: string;
  seoLandingHref?: string;
  expatHubHref: string;
  toc: { href: string; label: string }[];
  sections: ExpatBlogSection[];
  primaryCta: { title: string; body: string; buttonLabel: string };
  finalCta: { title: string; body: string; buttonLabel: string };
  trustBox: { generatorSuitable: string; lawyerSuitable: string };
  disclaimer: { heading: string; body: string; lawyerNote: string };
  ui: {
    breadcrumbBlog: string;
    readTime: string;
    tocTitle: string;
    relatedHub: string;
    backToExpats: string;
    contractLinksTitle?: string;
  };
  relatedSlugs: string[];
};

const BASE = 'https://smlouvahned.cz';

function builder(locale: AppLocale, contract: ExpatContractType): string {
  return withLocale(EXPAT_CONTRACT_ROUTES[contract], locale);
}

function hub(locale: AppLocale): string {
  return `/${locale}`;
}

function rentalSeo(locale: AppLocale): string {
  return `/${locale}/rental-agreement-czech-republic`;
}

const SAFETY_EN = [
  'SmlouvaHned is a software tool, not a law firm or attorney.',
  'This article is informational only — not legal services (Act No. 85/1996 Coll., on the legal profession) and not immigration advice.',
  'Documents are generated primarily in Czech. Where offered, translations are explanatory only, not certified or official.',
  'If the text differs, the Czech wording prevails.',
];

const SAFETY_UA = [
  'SmlouvaHned — програмний інструмент, не адвокатська фірма.',
  'Стаття лише для інформації — не юридичні послуги (закон ЧР № 85/1996 Зб. про адвокатуру) і не імміграційна консультація.',
  'Документи формуються насамперед чеською. Пояснювальний переклад не є офіційним.',
  'У разі розбіжностей перевага має чеське формулювання.',
];

function uiEn(): ExpatBlogArticle['ui'] {
  return {
    breadcrumbBlog: 'Blog',
    readTime: 'read',
    tocTitle: 'Contents',
    relatedHub: 'All guides for foreigners',
    backToExpats: 'Expat contract overview',
  };
}

function uiUa(): ExpatBlogArticle['ui'] {
  return {
    breadcrumbBlog: 'Блог',
    readTime: 'читання',
    tocTitle: 'Зміст',
    relatedHub: 'Усі гіди для іноземців',
    backToExpats: 'Огляд договорів для іноземців',
  };
}

function disclaimerEn(): ExpatBlogArticle['disclaimer'] {
  return {
    heading: 'Informational content — not legal services',
    body:
      'This article explains typical Czech contract practice in plain language. SmlouvaHned does not provide legal services within the meaning of Czech Act No. 85/1996 Coll., on the legal profession. It is not a substitute for individual advice from a Czech attorney (advokát).',
    lawyerNote:
      'For disputes, complex employment, immigration filings or high-value transactions, consult a registered Czech attorney.',
  };
}

function disclaimerUa(): ExpatBlogArticle['disclaimer'] {
  return {
    heading: 'Інформаційний матеріал — не юридичні послуги',
    body:
      'Стаття пояснює типову чеську практику. SmlouvaHned не надає юридичних послуг у розумінні закону ЧР № 85/1996 Зб. про адвокатуру. Це не заміна індивідуальної консультації чеського адвоката (advokát).',
    lawyerNote:
      'При спорах, складному працевлаштуванні, імміграції або дорогих угодах зверніться до зареєстрованого чеського адвоката.',
  };
}

function contractArticleEn(
  contract: ExpatContractType,
  opts: {
    slug: string;
    title: string;
    excerpt: string;
    intro: string;
    keywords: string[];
    readTime: string;
    sections: ExpatBlogSection[];
    primaryCta: ExpatBlogArticle['primaryCta'];
    trust: ExpatBlogArticle['trustBox'];
    relatedSlugs: string[];
    seoLanding?: boolean;
  },
): ExpatBlogArticle {
  const leaseExtras =
    contract === 'lease'
      ? {
          seoLandingHref: rentalSeo('en'),
          sections: [
            ...opts.sections,
            {
              id: 'translation-annex',
              title: 'Czech contract + English translation annex',
              paragraphs: [
                'For rental agreements, the PDF contains the primary Czech lease wording first, then an explanatory English translation annex.',
                'The translation helps you understand clauses before signing; it is not a certified translation for authorities.',
              ],
              bullets: SAFETY_EN,
            },
          ],
        }
      : { sections: opts.sections };

  return {
    slug: opts.slug,
    audience: 'en',
    contractKey: contract,
    category: 'For foreigners (EN)',
    readTime: opts.readTime,
    dateLabel: '17 May 2026',
    dateTime: '2026-05-17',
    title: opts.title,
    excerpt: opts.excerpt,
    intro: opts.intro,
    keywords: opts.keywords,
    builderHref: builder('en', contract),
    seoLandingHref: opts.seoLanding ? rentalSeo('en') : leaseExtras.seoLandingHref,
    expatHubHref: hub('en'),
    toc: opts.sections.map((s, i) => ({
      href: `#${s.id}`,
      label: `${i + 1}. ${s.title}`,
    })),
    sections: leaseExtras.sections,
    primaryCta: opts.primaryCta,
    finalCta: {
      title: opts.primaryCta.title,
      body: 'Open the English-guided form, fill in your details, and download the PDF after payment.',
      buttonLabel: opts.primaryCta.buttonLabel,
    },
    trustBox: opts.trust,
    disclaimer: disclaimerEn(),
    ui: { ...uiEn(), contractLinksTitle: 'Create this document' },
    relatedSlugs: opts.relatedSlugs,
  };
}

function contractArticleUa(
  contract: ExpatContractType,
  opts: {
    slug: string;
    title: string;
    excerpt: string;
    intro: string;
    keywords: string[];
    readTime: string;
    sections: ExpatBlogSection[];
    primaryCta: ExpatBlogArticle['primaryCta'];
    trust: ExpatBlogArticle['trustBox'];
    relatedSlugs: string[];
  },
): ExpatBlogArticle {
  const sections =
    contract === 'lease'
      ? [
          ...opts.sections,
          {
            id: 'translation-annex',
            title: 'Чеський договір + український пояснювальний додаток',
            paragraphs: [
              'У PDF спочатку основний чеський договір оренди, потім пояснювальний український додаток.',
              'Додаток допомагає зрозуміти умови перед підписом; це не офіційний переклад для органів.',
            ],
            bullets: SAFETY_UA,
          },
        ]
      : opts.sections;

  return {
    slug: opts.slug,
    audience: 'ua',
    contractKey: contract,
    category: 'Pro cizince (UA)',
    readTime: opts.readTime,
    dateLabel: '17. května 2026',
    dateTime: '2026-05-17',
    title: opts.title,
    excerpt: opts.excerpt,
    intro: opts.intro,
    keywords: opts.keywords,
    builderHref: builder('ua', contract),
    seoLandingHref: contract === 'lease' ? rentalSeo('ua') : undefined,
    expatHubHref: hub('ua'),
    toc: sections.map((s, i) => ({ href: `#${s.id}`, label: `${i + 1}. ${s.title}` })),
    sections,
    primaryCta: opts.primaryCta,
    finalCta: {
      title: opts.primaryCta.title,
      body: 'Відкрийте форму українською, заповніть дані та завантажте PDF після оплати.',
      buttonLabel: opts.primaryCta.buttonLabel,
    },
    trustBox: opts.trust,
    disclaimer: disclaimerUa(),
    ui: { ...uiUa(), contractLinksTitle: 'Створити документ' },
    relatedSlugs: opts.relatedSlugs,
  };
}

const HUB_GUIDE_EN = 'foreigners-czech-contracts-guide-en';
const HUB_GUIDE_UA = 'foreigners-czech-contracts-guide-ua';

const EXPAT_BLOG_ARTICLES: ExpatBlogArticle[] = [
  {
    slug: HUB_GUIDE_EN,
    audience: 'en',
    contractKey: 'hub',
    category: 'For foreigners (EN)',
    readTime: '6 min',
    dateLabel: '17 May 2026',
    dateTime: '2026-05-17',
    title: 'Czech contracts for foreigners: which document to use in 2026',
    excerpt:
      'Housing, work, car purchase and power of attorney in the Czech Republic — overview of core contracts with English-guided forms and Czech PDF output.',
    intro:
      'If you live or work in Czechia, you still sign Czech contracts in most cases. SmlouvaHned helps foreigners fill forms in English (or Ukrainian on separate guides) while the generated document stays primarily in Czech.',
    keywords: [
      'Czech contracts foreigners',
      'contracts Czech Republic English',
      'expat documents Czechia',
    ],
    expatHubHref: hub('en'),
    toc: [
      { href: '#how-it-works', label: '1. How it works' },
      { href: '#contracts', label: '2. Core contracts' },
      { href: '#safety', label: '3. Important limits' },
    ],
    sections: [
      {
        id: 'how-it-works',
        title: 'How it works',
        paragraphs: [
          'Choose a contract type below. The online form can be filled in English where supported.',
          'After payment you receive a PDF assembled from your inputs. For the rental agreement, an explanatory English translation annex is included — in case of discrepancy, the Czech wording prevails.',
        ],
      },
      {
        id: 'contracts',
        title: 'Core contracts with English guidance',
        paragraphs: ['Open the guide for your situation, then start the form:'],
        bullets: [
          'Rental agreement — lease + handover protocol (+ translation annex)',
          'Employment contract — Czech employment relationship',
          'DPP agreement — short-term work up to statutory limits',
          'Sublease — room or apartment with landlord consent',
          'Power of attorney — representation for authorities or transactions',
          'Car purchase agreement — private sale with VIN and handover',
        ],
      },
      {
        id: 'safety',
        title: 'Important limits',
        paragraphs: SAFETY_EN,
      },
    ],
    builderHref: builder('en', 'lease'),
    seoLandingHref: rentalSeo('en'),
    primaryCta: {
      title: 'Start with housing',
      body: 'Most expats begin with a rental agreement. Read the dedicated guide or open the form directly.',
      buttonLabel: 'Rental agreement form (EN) →',
    },
    finalCta: {
      title: 'All expat contracts',
      body: 'See every supported contract type on the English landing page.',
      buttonLabel: 'Open /en overview →',
    },
    trustBox: {
      generatorSuitable:
        'Standard rental, employment, DPP, sublease, power of attorney or car sale between private parties with clear terms.',
      lawyerSuitable:
        'Commercial leases, collective bargaining, insolvency, criminal liability or immigration filings that need certified documents.',
    },
    disclaimer: disclaimerEn(),
    ui: {
      ...uiEn(),
      contractLinksTitle: 'Guides & forms',
    },
    relatedSlugs: [
      'rental-agreement-czech-republic-guide-en',
      'employment-contract-czech-republic-guide-en',
    ],
  },
  {
    slug: HUB_GUIDE_UA,
    audience: 'ua',
    contractKey: 'hub',
    category: 'Pro cizince (UA)',
    readTime: '6 хв',
    dateLabel: '17. května 2026',
    dateTime: '2026-05-17',
    title: 'Чеські договори для іноземців: який документ обрати у 2026',
    excerpt:
      'Житло, робота, купівля авто та довіреність у Чехії — огляд основних договорів з формою українською та PDF чеською.',
    intro:
      'У Чехії ви зазвичай підписуєте договори чеською. SmlouvaHned допомагає заповнити форму українською, а згенерований документ залишається переважно чеською.',
    keywords: ['чеські договори іноземці', 'договір оренди Чехія', 'документи для іноземців'],
    builderHref: builder('ua', 'lease'),
    seoLandingHref: rentalSeo('ua'),
    expatHubHref: hub('ua'),
    toc: [
      { href: '#how-it-works', label: '1. Як це працює' },
      { href: '#contracts', label: '2. Основні договори' },
      { href: '#safety', label: '3. Важливі обмеження' },
    ],
    sections: [
      {
        id: 'how-it-works',
        title: 'Як це працює',
        paragraphs: [
          'Оберіть тип договору нижче. Форму можна заповнити українською.',
          'Після оплати — PDF з ваших даних. Для оренди додається пояснювальний український додаток; основним є чеське формулювання.',
        ],
      },
      {
        id: 'contracts',
        title: 'Основні договори',
        paragraphs: ['Відкрийте гід або форму:'],
        bullets: [
          'Договір оренди — + протокол передачі (+ український додаток)',
          'Трудовий договір',
          'DPP — короткострокова праця',
          'Піднайм',
          'Довіреність',
          'Купівля авто',
        ],
      },
      {
        id: 'safety',
        title: 'Важливі обмеження',
        paragraphs: SAFETY_UA,
      },
    ],
    primaryCta: {
      title: 'Почніть з житла',
      body: 'Більшість іноземців спочатку оформлюють оренду.',
      buttonLabel: 'Форма договору оренди (UA) →',
    },
    finalCta: {
      title: 'Усі договори',
      body: 'Повний огляд на українській landing сторінці.',
      buttonLabel: 'Відкрити /ua →',
    },
    trustBox: {
      generatorSuitable: 'Типова оренда, праця, DPP, піднайм, довіреність або продаж авто між фізособами.',
      lawyerSuitable: 'Комерційна оренда, колективні угоди, банкрутство, кримінальна відповідальність, імміграція з офіційним перекладом.',
    },
    disclaimer: disclaimerUa(),
    ui: { ...uiUa(), contractLinksTitle: 'Гіди та форми' },
    relatedSlugs: [
      'rental-agreement-czech-republic-guide-ua',
      'employment-contract-czech-republic-guide-ua',
    ],
  },

  contractArticleEn('lease', {
    slug: 'rental-agreement-czech-republic-guide-en',
    title: 'Rental agreement in the Czech Republic for foreigners (2026)',
    excerpt:
      'How Czech leases work, what to check before signing, and how to generate a Czech rental PDF with an English-guided form and translation annex.',
    intro:
      'Whether you rent in Prague, Brno or elsewhere, the lease is almost always in Czech. You can still prepare it using an English form and receive an explanatory translation annex alongside the primary Czech wording.',
    keywords: [
      'rental agreement Czech Republic',
      'lease contract Prague foreigners',
      'Czech rental agreement English',
    ],
    readTime: '8 min',
    sections: [
      {
        id: 'basics',
        title: 'What the lease must cover',
        paragraphs: [
          'Czech apartment leases are governed by the Civil Code (especially § 2235 et seq.). Written form is standard practice.',
          'Key points: parties, apartment address, rent and utilities, deposit, term, rules (pets, subletting), and handover.',
        ],
        bullets: [
          'Deposit (kauce) — often up to three months’ rent; return rules should be clear',
          'Notice periods — differ for fixed vs indefinite term',
          'Handover protocol — meter readings and defects; keep photos',
        ],
      },
      {
        id: 'before-signing',
        title: 'Before you sign',
        paragraphs: [
          'Read the Czech PDF carefully even if you use the English annex. Compare rent, fees and end date with what you agreed verbally.',
          'Ask for energy certificate (PENB) when relevant and confirm who registers your address if needed.',
        ],
      },
    ],
    primaryCta: {
      title: 'Create your Czech rental agreement',
      body: 'English-guided form → Czech PDF + explanatory English translation annex + handover protocol.',
      buttonLabel: 'Open rental form (EN) →',
    },
    trust: {
      generatorSuitable: 'Standard apartment lease between landlord and tenant with clear rent, deposit and house rules.',
      lawyerSuitable: 'Commercial units, rent control disputes, eviction conflicts or employer-provided housing schemes.',
    },
    relatedSlugs: [HUB_GUIDE_EN, 'employment-contract-czech-republic-guide-en'],
    seoLanding: true,
  }),

  contractArticleUa('lease', {
    slug: 'rental-agreement-czech-republic-guide-ua',
    title: 'Договір оренди в Чехії для іноземців (2026)',
    excerpt:
      'Як працює чеська оренда, на що звернути увагу перед підписом і як отримати PDF з формою українською та пояснювальним додатком.',
    intro:
      'Оренда квартири в Празі чи іншому місті майже завжди оформлюється чеською. Форму можна заповнити українською, а в PDF буде основний чеський договір і пояснювальний український додаток.',
    keywords: ['договір оренди Чехія', 'оренда квартири Прага іноземці', 'чеський договір оренди'],
    readTime: '8 хв',
    sections: [
      {
        id: 'basics',
        title: 'Що має бути в договорі',
        paragraphs: [
          'Оренда житла регулюється цивільним кодексом (§ 2235 та наст.). Письмова форма — стандарт.',
          'Ключове: сторони, адреса, оренда і комунальні, застава, строк, правила (тварини, піднайм), передача.',
        ],
        bullets: [
          'Застава (kauce) — часто до 3 місяців оренди',
          'Строки попередження — залежать від строкового чи безстрокового договору',
          'Протокол передачі — лічильники та вади; збережіть фото',
        ],
      },
      {
        id: 'before-signing',
        title: 'Перед підписом',
        paragraphs: [
          'Уважно прочитайте чеський PDF навіть із українським додатком. Звірте оренду, платежі та дату закінчення.',
        ],
      },
    ],
    primaryCta: {
      title: 'Створити договір оренди',
      body: 'Форма українською → чеський PDF + пояснювальний український додаток + протокол передачі.',
      buttonLabel: 'Відкрити форму оренди (UA) →',
    },
    trust: {
      generatorSuitable: 'Типова оренда квартири між орендодавцем і орендарем.',
      lawyerSuitable: 'Комерційні приміщення, спори про виселення або складні корпоративні схеми.',
    },
    relatedSlugs: [HUB_GUIDE_UA, 'employment-contract-czech-republic-guide-ua'],
  }),

  contractArticleEn('employment', {
    slug: 'employment-contract-czech-republic-guide-en',
    title: 'Employment contract in the Czech Republic for foreign workers',
    excerpt:
      'Mandatory elements under the Labour Code, probation and working time — plus an English-guided form for a Czech employment PDF.',
    intro:
      'A Czech employer must document the employment relationship in writing. Foreign employees need to understand the Czech text even if the form is filled in English.',
    keywords: ['employment contract Czech Republic', 'work contract foreigners Czechia'],
    readTime: '7 min',
    sections: [
      {
        id: 'mandatory',
        title: 'Mandatory content',
        paragraphs: [
          'The Labour Code requires type of work, place of work and day of starting work as minimum essentials.',
          'Salary, working time, probation and benefits are typically added — unclear clauses cause disputes.',
        ],
      },
      {
        id: 'foreigners',
        title: 'If you are a foreign employee',
        paragraphs: [
          'Work permits and employee cards are handled with authorities separately — the employment contract alone does not grant residence.',
          'Keep copies in Czech; you may ask for a summary translation for your own understanding.',
        ],
        bullets: SAFETY_EN,
      },
    ],
    primaryCta: {
      title: 'Generate a Czech employment contract',
      body: 'English form guidance; PDF generated in Czech.',
      buttonLabel: 'Open employment form (EN) →',
    },
    trust: {
      generatorSuitable: 'Standard employment with one employer, clear job title, workplace and wage.',
      lawyerSuitable: 'Executives, stock options, cross-border posting or collective agreements.',
    },
    relatedSlugs: [HUB_GUIDE_EN, 'dpp-agreement-czech-republic-guide-en'],
  }),

  contractArticleUa('employment', {
    slug: 'employment-contract-czech-republic-guide-ua',
    title: 'Трудовий договір у Чехії для іноземних працівників',
    excerpt:
      'Обов’язкові елементи за трудовим кодексом і форма українською для чеського PDF.',
    intro:
      'Роботодавець у Чехії оформлює трудові відносини письмово. Іноземцям важливо розуміти чеський текст договору.',
    keywords: ['трудовий договір Чехія', 'робота іноземці Чехія'],
    readTime: '7 хв',
    sections: [
      {
        id: 'mandatory',
        title: 'Обов’язковий зміст',
        paragraphs: [
          'Трудовий кодекс вимагає вид роботи, місце виконання та день виходу на роботу.',
          'Додайте зарплату, робочий час і випробувальний строк чітко.',
        ],
      },
      {
        id: 'foreigners',
        title: 'Для іноземних працівників',
        paragraphs: [
          'Дозвіл на роботу та карти оформлюються в органах окремо — договір сам по собі не дає residence.',
        ],
        bullets: SAFETY_UA,
      },
    ],
    primaryCta: {
      title: 'Створити трудовий договір',
      body: 'Форма українською; PDF чеською.',
      buttonLabel: 'Відкрити форму (UA) →',
    },
    trust: {
      generatorSuitable: 'Стандартне працевлаштування з одним роботодавцем.',
      lawyerSuitable: 'Керівники, публікація за кордон, колективні договори.',
    },
    relatedSlugs: [HUB_GUIDE_UA, 'dpp-agreement-czech-republic-guide-ua'],
  }),

  contractArticleEn('dpp', {
    slug: 'dpp-agreement-czech-republic-guide-en',
    title: 'DPP agreement in Czechia: short-term work for foreigners',
    excerpt:
      'When to use a “agreement to perform work” (DPP), hourly limits, and the English-guided Czech form.',
    intro:
      'DPP suits occasional work but has an annual hours cap per employer. The document is in Czech; the form can guide you in English.',
    keywords: ['DPP Czech Republic', 'agreement to perform work foreigners'],
    readTime: '6 min',
    sections: [
      {
        id: 'limits',
        title: 'Statutory limits',
        paragraphs: [
          'DPP is limited to 300 hours per calendar year with the same employer unless law provides otherwise.',
          'Above limits you may need a different contract type — misclassification carries risk.',
        ],
      },
      {
        id: 'content',
        title: 'What to put in the agreement',
        paragraphs: ['Describe the task, place, duration, hourly or piece rate and payment details clearly.'],
        bullets: SAFETY_EN,
      },
    ],
    primaryCta: {
      title: 'Create a Czech DPP agreement',
      body: 'English-guided form → Czech PDF.',
      buttonLabel: 'Open DPP form (EN) →',
    },
    trust: {
      generatorSuitable: 'Occasional work within hourly limits with clear task description.',
      lawyerSuitable: 'Regular full-time disguised as DPP, agency chains or inspection disputes.',
    },
    relatedSlugs: [HUB_GUIDE_EN, 'employment-contract-czech-republic-guide-en'],
  }),

  contractArticleUa('dpp', {
    slug: 'dpp-agreement-czech-republic-guide-ua',
    title: 'Договір DPP у Чехії: короткострокова праця',
    excerpt: 'Коли використовувати DPP, ліміт годин і форма українською для чеського PDF.',
    intro: 'DPP підходить для випадкової праці, але є річний ліміт годин у одного роботодавця.',
    keywords: ['DPP Чехія', 'договір про виконання роботи'],
    readTime: '6 хв',
    sections: [
      {
        id: 'limits',
        title: 'Ліміти',
        paragraphs: ['DPP — до 300 годин на рік у одного роботодавця, якщо закон не передбачає інше.'],
      },
      {
        id: 'content',
        title: 'Зміст договору',
        paragraphs: ['Опишіть роботу, місце, строк, оплату.'],
        bullets: SAFETY_UA,
      },
    ],
    primaryCta: {
      title: 'Створити DPP',
      body: 'Форма українською → PDF чеською.',
      buttonLabel: 'Форма DPP (UA) →',
    },
    trust: {
      generatorSuitable: 'Випадкова праця в межах ліміту годин.',
      lawyerSuitable: 'Постійна повна зайнятість під виглядом DPP.',
    },
    relatedSlugs: [HUB_GUIDE_UA, 'employment-contract-czech-republic-guide-ua'],
  }),

  contractArticleEn('sublease', {
    slug: 'sublease-agreement-czech-republic-guide-en',
    title: 'Sublease in the Czech Republic: room or apartment',
    excerpt:
      'Landlord consent, main lease relationship, and generating a Czech sublease with English form help.',
    intro:
      'Subletting part of an apartment requires attention to the main lease and often written landlord consent.',
    keywords: ['sublease Czech Republic', 'sublet apartment Prague'],
    readTime: '6 min',
    sections: [
      {
        id: 'consent',
        title: 'Landlord consent',
        paragraphs: [
          'Your main lease may require permission to sublet. Without consent you risk breach of the main contract.',
          'Record consent date and scope in the sublease.',
        ],
      },
      {
        id: 'payments',
        title: 'Rent and deposit',
        paragraphs: ['Mirror how rent, utilities and deposit are handled between sublandlord and subtenant.'],
        bullets: SAFETY_EN,
      },
    ],
    primaryCta: {
      title: 'Create a Czech sublease agreement',
      body: 'English-guided form → Czech PDF.',
      buttonLabel: 'Open sublease form (EN) →',
    },
    trust: {
      generatorSuitable: 'Room or flat sublet with documented consent and clear payments.',
      lawyerSuitable: 'Entire flat sublet against lease ban or commercial subletting business.',
    },
    relatedSlugs: [HUB_GUIDE_EN, 'rental-agreement-czech-republic-guide-en'],
  }),

  contractArticleUa('sublease', {
    slug: 'sublease-agreement-czech-republic-guide-ua',
    title: 'Піднайм у Чехії: кімната чи квартира',
    excerpt: 'Згода орендодавця, зв’язок з основним договором, форма українською.',
    intro: 'Піднайм потребує уваги до основної оренди та часто письмової згоди орендодавця.',
    keywords: ['піднайм Чехія', 'суборенда квартири'],
    readTime: '6 хв',
    sections: [
      {
        id: 'consent',
        title: 'Згода орендодавця',
        paragraphs: ['Основний договір може вимагати дозволу на піднайм. Зафіксуйте дату та обсяг згоди.'],
      },
      {
        id: 'payments',
        title: 'Платежі',
        paragraphs: ['Оренда, комунальні та застава між сторонами піднайму.'],
        bullets: SAFETY_UA,
      },
    ],
    primaryCta: {
      title: 'Договір піднайму',
      body: 'Форма українською → PDF чеською.',
      buttonLabel: 'Форма піднайму (UA) →',
    },
    trust: {
      generatorSuitable: 'Типовий піднайм із згодою та чіткими платежами.',
      lawyerSuitable: 'Піднайм заборонений основним договором.',
    },
    relatedSlugs: [HUB_GUIDE_UA, 'rental-agreement-czech-republic-guide-ua'],
  }),

  contractArticleEn('power_of_attorney', {
    slug: 'power-of-attorney-czech-republic-guide-en',
    title: 'Power of attorney in the Czech Republic for foreigners',
    excerpt:
      'General vs special power of attorney, when a certified signature is needed, and the English-guided Czech form.',
    intro:
      'A power of attorney lets someone act on your behalf before offices, banks or in a specific transaction. Wording must match the intended scope.',
    keywords: ['power of attorney Czech Republic', 'plna moc foreigners'],
    readTime: '6 min',
    sections: [
      {
        id: 'types',
        title: 'Scope and form',
        paragraphs: [
          'Special power of attorney — limited to one act (e.g. car sale at registry).',
          'General power — broader; institutions may require recent or certified form.',
        ],
      },
      {
        id: 'tips',
        title: 'Practical tips',
        paragraphs: ['Define validity period, whether substitution is allowed and ID details of both parties.'],
        bullets: SAFETY_EN,
      },
    ],
    primaryCta: {
      title: 'Create a Czech power of attorney',
      body: 'English-guided form → Czech PDF.',
      buttonLabel: 'Open power of attorney form (EN) →',
    },
    trust: {
      generatorSuitable: 'Clear mandate for a defined authority or transaction.',
      lawyerSuitable: 'Child custody, company statutes or foreign apostille requirements.',
    },
    relatedSlugs: [HUB_GUIDE_EN, 'car-sale-agreement-czech-republic-guide-en'],
  }),

  contractArticleUa('power_of_attorney', {
    slug: 'power-of-attorney-czech-republic-guide-ua',
    title: 'Довіреність у Чехії для іноземців',
    excerpt: 'Загальна чи спеціальна довіреність, засвідчений підпис, форма українською.',
    intro: 'Довіреність дозволяє діяти від вашого імені в органах, банках або угоді. Обсяг має бути точним.',
    keywords: ['довіреність Чехія', 'plná moc'],
    readTime: '6 хв',
    sections: [
      {
        id: 'types',
        title: 'Обсяг і форма',
        paragraphs: [
          'Спеціальна — для однієї дії (наприклад, продаж авто).',
          'Загальна — ширша; установи можуть вимагати засвідчення.',
        ],
      },
      {
        id: 'tips',
        title: 'Поради',
        paragraphs: ['Строк дії, чи можна передовіряти, дані обох сторін.'],
        bullets: SAFETY_UA,
      },
    ],
    primaryCta: {
      title: 'Створити довіреність',
      body: 'Форма українською → PDF чеською.',
      buttonLabel: 'Форма довіреності (UA) →',
    },
    trust: {
      generatorSuitable: 'Чіткий мандат для конкретної установи або угоди.',
      lawyerSuitable: 'Опіка, корпоративні статути, апостиль.',
    },
    relatedSlugs: [HUB_GUIDE_UA, 'car-sale-agreement-czech-republic-guide-ua'],
  }),

  contractArticleEn('car_sale', {
    slug: 'car-sale-agreement-czech-republic-guide-en',
    title: 'Car purchase agreement in the Czech Republic for foreigners',
    excerpt:
      'VIN, mileage, defects, handover and documents when buying a used car — with an English-guided Czech contract.',
    intro:
      'Private car sales use a purchase agreement under the Civil Code. The registration transfer is a separate step at the vehicle registry.',
    keywords: ['car purchase agreement Czech Republic', 'buy car Czechia contract'],
    readTime: '7 min',
    sections: [
      {
        id: 'essentials',
        title: 'Contract essentials',
        paragraphs: [
          'Identify seller and buyer, VIN, registration plate, mileage and price.',
          'List known defects and which documents are handed over.',
        ],
      },
      {
        id: 'after',
        title: 'After signing',
        paragraphs: [
          'Transfer liability insurance and complete registry transfer within statutory deadlines.',
          'Keep the signed contract and handover record.',
        ],
        bullets: SAFETY_EN,
      },
    ],
    primaryCta: {
      title: 'Create a Czech car sale agreement',
      body: 'English-guided form → Czech PDF.',
      buttonLabel: 'Open car sale form (EN) →',
    },
    trust: {
      generatorSuitable: 'Private used-car sale with clear price and handover.',
      lawyerSuitable: 'Dealer warranties, cross-border import or secured finance.',
    },
    relatedSlugs: [HUB_GUIDE_EN, 'power-of-attorney-czech-republic-guide-en'],
  }),

  contractArticleUa('car_sale', {
    slug: 'car-sale-agreement-czech-republic-guide-ua',
    title: 'Купівля авто в Чехії: договір для іноземців',
    excerpt: 'VIN, пробіг, вади, передача документів — форма українською для чеського PDF.',
    intro: 'Приватний продаж авто — купівельна угода за цивільним кодексом. Перепис — окремо в реєстрі.',
    keywords: ['купівля авто Чехія', 'договір продажу авто'],
    readTime: '7 хв',
    sections: [
      {
        id: 'essentials',
        title: 'Зміст договору',
        paragraphs: ['Сторони, VIN, номер, пробіг, ціна, вади, документи.'],
      },
      {
        id: 'after',
        title: 'Після підпису',
        paragraphs: ['Страхування відповідальності та перепис у встановлені строки.'],
        bullets: SAFETY_UA,
      },
    ],
    primaryCta: {
      title: 'Купівельна угода на авто',
      body: 'Форма українською → PDF чеською.',
      buttonLabel: 'Форма купівлі авто (UA) →',
    },
    trust: {
      generatorSuitable: 'Приватний продаж б/у авто з чіткою ціною.',
      lawyerSuitable: 'Дилер, імпорт, кредит під заставою.',
    },
    relatedSlugs: [HUB_GUIDE_UA, 'power-of-attorney-czech-republic-guide-ua'],
  }),
];

export const EXPAT_BLOG_CONTRACT_LINKS: Record<
  ExpatBlogAudience,
  { contract: ExpatContractType; guideSlug: string; labelEn: string; labelUa: string }[]
> = {
  en: [
    { contract: 'lease', guideSlug: 'rental-agreement-czech-republic-guide-en', labelEn: 'Rental agreement', labelUa: '' },
    { contract: 'employment', guideSlug: 'employment-contract-czech-republic-guide-en', labelEn: 'Employment contract', labelUa: '' },
    { contract: 'dpp', guideSlug: 'dpp-agreement-czech-republic-guide-en', labelEn: 'DPP agreement', labelUa: '' },
    { contract: 'sublease', guideSlug: 'sublease-agreement-czech-republic-guide-en', labelEn: 'Sublease', labelUa: '' },
    { contract: 'power_of_attorney', guideSlug: 'power-of-attorney-czech-republic-guide-en', labelEn: 'Power of attorney', labelUa: '' },
    { contract: 'car_sale', guideSlug: 'car-sale-agreement-czech-republic-guide-en', labelEn: 'Car purchase', labelUa: '' },
  ],
  ua: [
    { contract: 'lease', guideSlug: 'rental-agreement-czech-republic-guide-ua', labelEn: '', labelUa: 'Договір оренди' },
    { contract: 'employment', guideSlug: 'employment-contract-czech-republic-guide-ua', labelEn: '', labelUa: 'Трудовий договір' },
    { contract: 'dpp', guideSlug: 'dpp-agreement-czech-republic-guide-ua', labelEn: '', labelUa: 'DPP' },
    { contract: 'sublease', guideSlug: 'sublease-agreement-czech-republic-guide-ua', labelEn: '', labelUa: 'Піднайм' },
    { contract: 'power_of_attorney', guideSlug: 'power-of-attorney-czech-republic-guide-ua', labelEn: '', labelUa: 'Довіреність' },
    { contract: 'car_sale', guideSlug: 'car-sale-agreement-czech-republic-guide-ua', labelEn: '', labelUa: 'Купівля авто' },
  ],
};

export function getAllExpatBlogSlugs(): string[] {
  return EXPAT_BLOG_ARTICLES.map((a) => a.slug);
}

export function getExpatBlogArticle(slug: string): ExpatBlogArticle | null {
  return EXPAT_BLOG_ARTICLES.find((a) => a.slug === slug) ?? null;
}

export function getExpatBlogCanonical(slug: string): string {
  return `${BASE}/blog/expat/${slug}`;
}

export function expatBlogToBlogMeta(article: ExpatBlogArticle) {
  return {
    slug: `expat/${article.slug}`,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    readTime: article.readTime,
    date: article.dateLabel,
    cluster: 'expat' as const,
    href: `/blog/expat/${article.slug}`,
    audience: article.audience,
  };
}

export const EXPAT_BLOG_META = EXPAT_BLOG_ARTICLES.map(expatBlogToBlogMeta);
