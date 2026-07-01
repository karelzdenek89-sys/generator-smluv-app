import type { ExpatBlogArticle, ExpatBlogContractKey, ExpatBlogSection } from '@/lib/i18n/expat-blog-articles';
import { getExpatSeoHref } from '@/lib/i18n/expat-seo-landings';
import { withLocale } from '@/lib/locale';

const HUB_EN = 'foreigners-czech-contracts-guide-en';
const HUB_UA = 'foreigners-czech-contracts-guide-ua';
const DATE_EN = '29 May 2026';
const DATE_TIME = '2026-05-29';
const DATE_UA = '29. května 2026';

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
  const sections =
    contractKey === 'lease'
      ? [
          ...opts.sections,
          {
            id: 'translation-annex',
            title: 'Czech contract + English translation annex',
            paragraphs: [
              'For rental agreements, the PDF contains the primary Czech lease first, then an explanatory English annex.',
              'The annex helps you understand clauses before signing; it is not a certified translation for authorities.',
            ],
          },
        ]
      : opts.sections;
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
    toc: sections.map((s, i) => ({ href: `#${s.id}`, label: `${i + 1}. ${s.title}` })),
    sections,
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
  const sections =
    contractKey === 'lease'
      ? [
          ...opts.sections,
          {
            id: 'translation-annex',
            title: 'Чеський договір + український пояснювальний додаток',
            paragraphs: [
              'У PDF спочатку основний чеський договір оренди, потім пояснювальний український додаток.',
              'Додаток допомагає зрозуміти умови перед підписом; це не офіційний переклад для органів.',
            ],
          },
        ]
      : opts.sections;
  return {
    slug: opts.slug,
    audience: 'ua',
    contractKey,
    category: 'Для інозemців (UA)',
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
    toc: sections.map((s, i) => ({ href: `#${s.id}`, label: `${i + 1}. ${s.title}` })),
    sections,
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

/** EN + UA expat guides aligned with May 2026 Czech blog topics. */
export const EXPAT_BLOG_TOPICS_2026: ExpatBlogArticle[] = [
  topicEn('employment', {
    slug: 'flexinovela-labor-law-czechia-2026-guide-en',
    title: 'Czech Labour Code “Flexinovela” 2026: What Foreign Employers and Workers Should Know',
    excerpt:
      'Overview of the 2025 flexinovela (effective 1 June 2025), DPP/DPČ changes, home office rules and 2026 contribution thresholds for foreigners working in Czechia.',
    intro:
      'The Czech labour law reform known as the flexinovela took effect on 1 June 2025. Some rules for agreements outside a standard employment relationship and for remote work also stem from earlier transposition of EU directives. For 2026, employers and workers should track both the flexinovela and ongoing DPP/DPČ limits — not only the nickname of the reform.',
    keywords: [
      'flexinovela Czech Republic',
      'labour code Czechia 2026',
      'DPP agreement foreigners',
      'employment contract Czechia',
    ],
    readTime: '8 min',
    builderHref: withLocale('/dpp', 'en'),
    seoLandingHref: getExpatSeoHref('en', 'employment'),
    sections: [
      {
        id: 'timeline',
        title: 'What changed and when',
        paragraphs: [
          'The 2025 flexinovela changed several Labour Code areas. Some remote-work and information-duty rules also stem from earlier EU-transposition changes, so employers should follow the current Labour Code wording rather than the nickname of the reform.',
          'When you rely on a single label, details can be missed — always verify the statute text as it applies on the date of your agreement.',
        ],
      },
      {
        id: 'dpp-dpc',
        title: 'DPP and DPČ in practice',
        paragraphs: [
          'DPP (agreement to perform work) still has a 300-hour annual cap per employer. Employers must provide a written work schedule in advance and meet electronic reporting duties to the Czech Social Security Administration (ČSSZ).',
          'DPČ (agreement on work activity) remains suitable for regular but part-time collaboration, with its own average weekly hour limits and information duties.',
        ],
        bullets: [
          '2026 indicative threshold for DPP social/health insurance participation: CZK 12,000 gross per month with one employer.',
          'General decisive amount for employment in 2026: CZK 4,500 — verify current figures on ČSSZ and tax authority websites.',
        ],
      },
      {
        id: 'remote-work',
        title: 'Home office and remote work',
        paragraphs: [
          'Remote work should be agreed in writing — place of performance, communication, schedule, cost reimbursement and how the arrangement ends.',
          'Certain groups (e.g. carers, pregnant employees) may request remote work; refusal must be justified in writing where the law applies.',
        ],
      },
    ],
    primaryCta: {
      title: 'Create a DPP agreement (agreement to perform work)',
      body: 'English-guided DPP form — Czech PDF with schedule, limits and 2026 Labour Code elements.',
      buttonLabel: 'Open DPP form (EN) →',
    },
    finalCta: {
      title: 'Need a standard employment contract instead?',
      body: 'Full-time or part-time employment — English guidance, Czech PDF output.',
      buttonLabel: 'Open employment contract form (EN) →',
      href: withLocale('/pracovni', 'en'),
    },
    trust: {
      generatorSuitable:
        'Standard employment contracts and DPP for typical hiring — short assignments, part-time help, ordinary full-time roles.',
      lawyerSuitable:
        'Labour inspections, suspected dependent work, collective issues, international assignments or disputed terminations.',
    },
    relatedSlugs: [HUB_EN, 'employment-contract-czech-republic-guide-en', 'dpp-agreement-czech-republic-guide-en'],
  }),

  topicUa('employment', {
    slug: 'flexinovela-labor-law-czechia-2026-guide-ua',
    title: 'Flexinovela трудового кодексу Чехії 2026: що важливо іноземцям',
    excerpt:
      'Огляд flexinovela (з 1 червня 2025), змін для DPP/DPČ, home office та порогів внесків на 2026 рік для працівників-іноземців у Чехії.',
    intro:
      'Реформа трудового законодавства Чехії (flexinovela) набула чинності 1 червня 2025 року. Частина правил для договорів поза класичним трудовим наймом і для дистанційної роботи також пов’язана з ранішою транспозицією директив ЄС. На 2026 рік варто стежити і за flexinovela, і за лімітами для DPP/DPČ.',
    keywords: ['flexinovela Чехія', 'трудовий кодекс 2026', 'DPP іноземці', 'трудовий договір Чехія'],
    readTime: '8 хв',
    builderHref: withLocale('/dpp', 'ua'),
    seoLandingHref: getExpatSeoHref('ua', 'employment'),
    sections: [
      {
        id: 'timeline',
        title: 'Що змінилося і коли',
        paragraphs: [
          'Flexinovela 2025 змінила кілька сфер трудового кодексу. Частина правил для віддаленої роботи та інформаційних обов’язків походить також з ранішої транспозиції директив ЄС — орієнтуйтеся на актуальний текст закону, а не лише на назву реформи.',
          'Якщо покладатися лише на одну назву, легко пропустити деталі — завжди перевіряйте текст закону на дату укладення договору.',
        ],
      },
      {
        id: 'dpp-dpc',
        title: 'DPP та DPČ на практиці',
        paragraphs: [
          'DPP (договір про виконання роботи) — ліміт 300 годин на рік у одного роботодавця, письмовий розклад роботи та електронні повідомлення до ČSSZ.',
          'DPČ — для регулярної, але неповної зайнятості, з власними лімітами годин та інформаційними обов’язками.',
        ],
        bullets: [
          'Орієнтовний поріг для соціального/медичного страхування з DPP у 2026: 12 000 Kč брутто на місяць у одного роботодавця.',
          'Загальна вирішальна сума для найму у 2026: 4 500 Kč — перевіряйте на сайтах ČSSZ та податкової.',
        ],
      },
      {
        id: 'remote-work',
        title: 'Home office та віддалена робота',
        paragraphs: [
          'Віддалену роботу слід погодити письмово — місце, графік, комунікація, витрати та припинення режиму.',
          'Окремі категорії працівників можуть просити про home office; відмова за певних умов має бути обґрунтована письмово.',
        ],
      },
    ],
    primaryCta: {
      title: 'Створити DPP (договір про виконання роботи)',
      body: 'Форма DPP українською → чеський PDF з розкладом, лімітами та елементами трудового кодексу 2026.',
      buttonLabel: 'Форма DPP (UA) →',
    },
    finalCta: {
      title: 'Потрібен класичний трудовий договір?',
      body: 'Повна або неповна зайнятість — підказки українською, PDF чеською.',
      buttonLabel: 'Форма трудового договору (UA) →',
      href: withLocale('/pracovni', 'ua'),
    },
    trust: {
      generatorSuitable: 'Типовий трудовий договір або DPP для звичайного найму.',
      lawyerSuitable: 'Перевірки інспекції праці, спори про звільнення, міжнародні відрядження.',
    },
    relatedSlugs: [HUB_UA, 'employment-contract-czech-republic-guide-ua', 'dpp-agreement-czech-republic-guide-ua'],
  }),

  topicEn('lease', {
    slug: 'energy-certificate-rental-czechia-2026-guide-en',
    title: 'Energy Performance Certificate (PENB) and Renting in Czechia 2026',
    excerpt:
      'When landlords must show the energy label, how classes A–G affect running costs, and narrow exceptions when PENB is replaced by energy bills.',
    intro:
      'The energy performance certificate (PENB) is standard in Czech rental listings and handovers. For 2026, landlords should know when it is mandatory, how to pass it to tenants, and when a narrow statutory alternative applies instead of a full certificate.',
    keywords: ['PENB Czech Republic', 'energy certificate rental Prague', 'rental apartment Czechia 2026'],
    readTime: '7 min',
    builderHref: withLocale('/najem', 'en'),
    seoLandingHref: getExpatSeoHref('en', 'lease'),
    sections: [
      {
        id: 'what-is-penb',
        title: 'What is PENB',
        paragraphs: [
          'PENB describes the building’s energy efficiency class (A–G). It is usually valid for about ten years unless a major renovation changes the rating.',
          'For rentals, the class must appear in advertisements and the certificate must be handed to the tenant when the lease is signed.',
        ],
      },
      {
        id: 'exceptions',
        title: 'When bills can replace PENB (narrow cases)',
        paragraphs: [
          'For a unit in a building, the owner may sometimes comply by showing energy bills for the last three years — especially if they requested PENB from the HOA/SVJ in writing and did not receive it in time.',
          'For buildings built before 1947, the law allows an agreement between landlord and tenant to use bills instead — if both parties agree in writing. This is not a general exemption for all older buildings.',
        ],
      },
      {
        id: 'tenant-view',
        title: 'Why it matters for expats',
        paragraphs: [
          'Class F or G often means much higher heating costs than class B — compare total monthly cost (rent + utilities), not rent alone.',
          'Your lease should state how utilities are billed and confirm PENB handover where required.',
        ],
      },
    ],
    primaryCta: {
      title: 'Create a Czech rental agreement',
      body: 'English-guided lease form with space for energy class and utility rules — Czech PDF for signing.',
      buttonLabel: 'Open rental form (EN) →',
    },
    trust: {
      generatorSuitable: 'Standard apartment lease where PENB or a lawful alternative is available.',
      lawyerSuitable: 'Disputes over missing PENB, SVJ restrictions, or commercial leases.',
    },
    relatedSlugs: [HUB_EN, 'rental-agreement-czech-republic-guide-en'],
  }),

  topicUa('lease', {
    slug: 'energy-certificate-rental-czechia-2026-guide-ua',
    title: 'Енергетичний сертифікат (PENB) та оренда в Чехії 2026',
    excerpt:
      'Коли потрібен енергетичний štítek, як класи A–G впливають на витрати та вузькі винятки з рахунками за енергію.',
    intro:
      'Průkaz energetické náročnosti budovy (PENB) — стандарт у чеських оголошеннях про оренду. У 2026 році орендодавець має знати, коли сертифікат обов’язковий, як передати його орендарю та коли застосовується вузький законний замінник.',
    keywords: ['PENB Чехія', 'енергетичний сертифікат оренда', 'оренда квартири Прага'],
    readTime: '7 хв',
    builderHref: withLocale('/najem', 'ua'),
    seoLandingHref: getExpatSeoHref('ua', 'lease'),
    sections: [
      {
        id: 'what-is-penb',
        title: 'Що таке PENB',
        paragraphs: [
          'PENB показує клас енергоефективності будівлі (A–G). Зазвичай дійсний близько 10 років.',
          'При оренді клас має бути в оголошенні, а сертифікат — переданий орендарю при підписанні договору.',
        ],
      },
      {
        id: 'exceptions',
        title: 'Коли можуть вистачити рахунків (вузькі випадки)',
        paragraphs: [
          'Для квартири в будинку власник іноді може виконати обов’язок рахунками за енергію за три роки — зокрема якщо письмово вимагав PENB від SVJ і не отримав його вчасно.',
          'Для будівель до 1947 року можлива письмова домовленість сторін про рахунки замість PENB — це не загальна заміна для всіх старих будинків.',
        ],
      },
      {
        id: 'tenant-view',
        title: 'Чому це важливо для іноземців',
        paragraphs: [
          'Клас F або G часто означає значно вищі витрати на опалення — порівнюйте повну місячну суму (оренда + комунальні).',
          'У договорі варто зафіксувати передачу PENB та порядок нарахування комунальних послуг.',
        ],
      },
    ],
    primaryCta: {
      title: 'Створити договір оренди',
      body: 'Форма українською → чеський PDF з місцем для енергетичного класу та комунальних.',
      buttonLabel: 'Форма оренди (UA) →',
    },
    trust: {
      generatorSuitable: 'Типова оренда квартири, коли є PENB або законна альтернатива.',
      lawyerSuitable: 'Спори через відсутній PENB, обмеження SVJ, комерційна оренда.',
    },
    relatedSlugs: [HUB_UA, 'rental-agreement-czech-republic-guide-ua'],
  }),

  topicEn('hub', {
    slug: 'dependent-work-b2b-czechia-2026-guide-en',
    title: '“Schwarz System” and B2B in Czechia 2026: Risks for Foreign Freelancers',
    excerpt:
      'How Czech authorities assess disguised employment when invoicing as a sole trader (OSVČ) — indicators, fines up to CZK 10 million, and how to structure real B2B work.',
    intro:
      'Invoicing as a sole trader while working like an employee is a long-standing enforcement priority in Czechia. One major client alone is not automatically illegal — inspectors look at the full picture: instructions, schedule, integration into the team, and economic dependence.',
    keywords: ['Schwarz system Czech Republic', 'OSVČ vs employee Czechia', 'dependent work Czech labour law'],
    readTime: '8 min',
    builderHref: withLocale('/spoluprace', 'en'),
    sections: [
      {
        id: 'what-it-is',
        title: 'What inspectors are looking for',
        paragraphs: [
          'Dependent work performed outside an employment relationship is prohibited. Signs include fixed personal performance, employer-like control over hours and place, use of employer equipment, and economic dependence on one client.',
          'A genuine B2B relationship usually means defined deliverables, ability to refuse tasks, own tools, multiple clients over time, and invoicing tied to results rather than a fixed monthly “salary”.',
        ],
      },
      {
        id: 'sanctions',
        title: 'Sanctions',
        paragraphs: [
          'Allowing illegal work can lead to a fine of up to CZK 10,000,000 for a legal entity or self-employed person, with a minimum of CZK 50,000, plus retrospective social security and tax assessments.',
        ],
      },
      {
        id: 'contracts',
        title: 'What to put in writing',
        paragraphs: [
          'A cooperation or service agreement should describe scope, deliverables, acceptance, IP, liability and termination — not just a monthly invoice template.',
          'If the relationship is actually employment, use an employment contract or DPP/DPČ instead of pretending it is pure B2B.',
        ],
      },
    ],
    primaryCta: {
      title: 'Structure B2B cooperation in writing',
      body: 'Cooperation agreement (smlouva o spolupráci) — scope, deliverables, acceptance and liability in Czech.',
      buttonLabel: 'Open cooperation agreement form (EN) →',
    },
    finalCta: {
      title: 'Is it actually employment?',
      body: 'If the relationship looks like dependent work, use an employment contract or DPP instead of invoicing as OSVČ.',
      buttonLabel: 'Open DPP form (EN) →',
      href: withLocale('/dpp', 'en'),
    },
    trust: {
      generatorSuitable: 'Clear B2B cooperation with defined outputs; standard employment or DPP where appropriate.',
      lawyerSuitable: 'Ongoing labour inspection, reclassification, large back payments of insurance.',
    },
    relatedSlugs: [HUB_EN, 'employment-contract-czech-republic-guide-en', 'dpp-agreement-czech-republic-guide-en'],
  }),

  topicUa('hub', {
    slug: 'dependent-work-b2b-czechia-2026-guide-ua',
    title: '«Шварц-система» та B2B у Чехії 2026: ризики для іноземних ФОП',
    excerpt:
      'Як інспекція праці оцінює залежну працю під виглядом OSVČ — ознаки, штрафи до 10 млн Kč і як будувати справжню B2B співпрацю.',
    intro:
      'Фактування як OSVČ при фактичному режимі найму — пріоритет перевірок у Чехії. Один клієнт сам по собі не означає автоматично порушення; оцінюється сукупність ознак: інструкції, графік, інтеграція в команду, економічна залежність.',
    keywords: ['шварц-система Чехія', 'OSVČ чи найм', 'залежна праця Чехія'],
    readTime: '8 хв',
    builderHref: withLocale('/spoluprace', 'ua'),
    sections: [
      {
        id: 'what-it-is',
        title: 'На що дивиться інспекція',
        paragraphs: [
          'Заборонено виконувати залежну працю поза трудовим правовідношенням. Ознаки: особисте виконання, контроль часу та місця, обладнання замовника, залежність від одного клієнта.',
          'Справжній B2B — конкретні результати, можливість відмовитися, власні інструменти, кілька клієнтів, оплата за результат, а не фіксована «зарплата» щомісяця.',
        ],
      },
      {
        id: 'sanctions',
        title: 'Санкції',
        paragraphs: [
          'За допущення незаконної праці — штраф до 10 000 000 Kč (мінімум 50 000 Kč), плюс донарахування соціального страхування та податків.',
        ],
      },
      {
        id: 'contracts',
        title: 'Що зафіксувати письмово',
        paragraphs: [
          'Договір про співпрацю або надання послуг має описувати обсяг, приймання результату, IP, відповідальність та розірвання.',
          'Якщо це фактично найм — оформлюйте трудовий договір або DPP/DPČ, а не лише рахунки-фактури.',
        ],
      },
    ],
    primaryCta: {
      title: 'Оформити B2B співпрацю письмово',
      body: 'Договір про співпрацю — обсяг, результат, приймання та відповідальність чеською.',
      buttonLabel: 'Форма договору співпраці (UA) →',
    },
    finalCta: {
      title: 'Це фактично найм?',
      body: 'Якщо відносини схожі на залежну працю — трудовий договір або DPP замість рахунків OSVČ.',
      buttonLabel: 'Форма DPP (UA) →',
      href: withLocale('/dpp', 'ua'),
    },
    trust: {
      generatorSuitable: 'Чітка B2B співпраця з результатом; типовий найм або DPP за потреби.',
      lawyerSuitable: 'Перевірка інспекції, перекваліфікація, великі донарахування.',
    },
    relatedSlugs: [HUB_UA, 'employment-contract-czech-republic-guide-ua', 'dpp-agreement-czech-republic-guide-ua'],
  }),

  topicEn('hub', {
    slug: 'work-contract-variations-czechia-2026-guide-en',
    title: 'Extra Work and Price Changes in Czech Work Contracts (Smlouva o dílo) 2026',
    excerpt:
      'How to contract for variations, binding vs non-binding budgets, and change orders — so price disputes do not destroy your project.',
    intro:
      '“Extra work” (vícepráce) is the most common source of disputes in Czech work contracts — construction, IT, design. The Civil Code distinguishes fixed price, budget-based price, budget with reservation of completeness, and non-binding budget. Wording matters.',
    keywords: ['work contract Czech Republic', 'construction contract Czechia', 'price variation smlouva o dílo'],
    readTime: '7 min',
    builderHref: withLocale('/smlouva-o-dilo', 'en'),
    sections: [
      {
        id: 'budget-types',
        title: 'Budget wording is decisive',
        paragraphs: [
          'If price is based on a budget, state explicitly whether it is binding, non-binding, or with a reservation that quantities are not guaranteed.',
          'Without clear wording, you cannot assume the contractor may unilaterally increase the price — the legal category controls when increases are allowed.',
        ],
      },
      {
        id: 'change-process',
        title: 'Change orders in practice',
        paragraphs: [
          'Use written change orders before extra work starts: scope, price impact, time impact, signatures.',
          'If the contractor must warn you before exceeding a budget, put that duty and a price cap in the contract.',
        ],
      },
    ],
    primaryCta: {
      title: 'Create a Czech work contract (smlouva o dílo)',
      body: 'Structured Czech PDF — describe work, price model, milestones and handover.',
      buttonLabel: 'Open work contract form →',
    },
    trust: {
      generatorSuitable: 'Typical freelance or trade projects with a defined deliverable and price model.',
      lawyerSuitable: 'High-value construction, public procurement, major defect claims.',
    },
    relatedSlugs: [HUB_EN, 'freelancer-copyright-czechia-2026-guide-en'],
  }),

  topicUa('hub', {
    slug: 'work-contract-variations-czechia-2026-guide-ua',
    title: 'Додаткові роботи та зміна ціни в чеському договорі підряду (smlouva o dílo) 2026',
    excerpt:
      'Як оформити vícepráce, зобов’язальний чи незобов’язальний кошторис і змінові листи, щоб уникнути спорів про ціну.',
    intro:
      'Додаткові роботи (vícepráce) — найчастіша причина спорів у договорах підряду в Чехії. Цивільний кодекс розрізняє тверду ціну, ціну за кошторисом, кошторис з застереженням незабезпеченої повноти та незобов’язальний кошторис. Формулювання має значення.',
    keywords: ['договір підряду Чехія', 'vícepráce', 'зміна ціни договір'],
    readTime: '7 хв',
    builderHref: withLocale('/smlouva-o-dilo', 'ua'),
    sections: [
      {
        id: 'budget-types',
        title: 'Тип кошторису вирішує',
        paragraphs: [
          'Якщо ціна за кошторисом — письмово вкажіть: зобов’язальний, незобов’язальний або з застереженням незабезпеченої повноти.',
          'Без чіткої умови не можна автоматично очікувати одностороннього підвищення ціни підрядником.',
        ],
      },
      {
        id: 'change-process',
        title: 'Змінові листи',
        paragraphs: [
          'Письмовий зміновий лист до початку додаткових робіт: обсяг, ціна, термін, підписи.',
          'Зафіксуйте обов’язок попередження та стелю ціни, якщо це важливо для проєкту.',
        ],
      },
    ],
    primaryCta: {
      title: 'Створити smlouva o dílo',
      body: 'Чеський PDF з описом робіт, моделі ціни та передачі результату.',
      buttonLabel: 'Форма договору підряду →',
    },
    trust: {
      generatorSuitable: 'Типовий підряд з визначеним результатом і моделлю ціни.',
      lawyerSuitable: 'Великі будівельні проєкти, публічні закупівлі, серйозні рекламації.',
    },
    relatedSlugs: [HUB_UA, 'freelancer-copyright-czechia-2026-guide-ua'],
  }),

  topicEn('hub', {
    slug: 'freelancer-copyright-czechia-2026-guide-en',
    title: 'Copyright in Czech Freelancer Contracts 2026: Who Owns the Deliverable',
    excerpt:
      'Licence vs transfer, software created to order, and typical mistakes when hiring developers, designers or copywriters in Czechia.',
    intro:
      'Invoices alone do not transfer copyright. Under Czech law you usually need a written licence or transfer of economic rights. Software ordered from an individual author may fall under special rules similar to employee work — but a clear licence clause is still essential in practice.',
    keywords: ['copyright Czech Republic', 'freelancer contract Czechia', 'software licence Czech law'],
    readTime: '8 min',
    builderHref: withLocale('/smlouva-o-dilo', 'en'),
    sections: [
      {
        id: 'licence-vs-transfer',
        title: 'Licence vs “I transfer copyright”',
        paragraphs: [
          'Colloquial “transfer of copyright” is often implemented as an exclusive licence in Czech documents. Specify territory, duration, exclusive/non-exclusive use, modifications and sublicensing.',
          'For marketing assets, define channels (web, ads, social) and whether the client may edit files.',
        ],
      },
      {
        id: 'software',
        title: 'Software ordered from a freelancer',
        paragraphs: [
          'A computer program created by an individual author on commission may be treated similarly to employee work if statutory conditions are met — but you should still regulate source code delivery, updates, open-source components and documentation.',
          'If the supplier is a company, confirm who holds rights from subcontractors.',
        ],
      },
    ],
    primaryCta: {
      title: 'Work contract with IP clauses',
      body: 'Use smlouva o dílo for defined deliverables; add cooperation/NDA where needed for broader projects.',
      buttonLabel: 'Open work contract form →',
    },
    finalCta: {
      title: 'Agency or ongoing collaboration?',
      body: 'Cooperation agreement when the relationship is broader than a single deliverable.',
      buttonLabel: 'Open cooperation agreement form (EN) →',
      href: withLocale('/spoluprace', 'en'),
    },
    trust: {
      generatorSuitable: 'Websites, graphics, copy, standard software modules with clear deliverables.',
      lawyerSuitable: 'Mass distribution, music/stock assets, disputes over additional author remuneration.',
    },
    relatedSlugs: [HUB_EN, 'work-contract-variations-czechia-2026-guide-en'],
  }),

  topicUa('hub', {
    slug: 'freelancer-copyright-czechia-2026-guide-ua',
    title: 'Авторське право у договорах з фрілансерами в Чехії 2026',
    excerpt:
      'Ліцензія чи передача прав, програмне забезпечення на замовлення та типові помилки при наймі розробників і дизайнерів.',
    intro:
      'Рахунок-фактура сам по собі не передає авторські права. У Чехії потрібна письмова ліцензія або передача майнових прав. Програма, створена фізичною особою на замовлення, може підпадати під особливий режим — але чітка ліцензійна умова в договорі все одно необхідна.',
    keywords: ['авторське право Чехія', 'фрілансер договір', 'ліцензія програмне забезпечення'],
    readTime: '8 хв',
    builderHref: withLocale('/smlouva-o-dilo', 'ua'),
    sections: [
      {
        id: 'licence-vs-transfer',
        title: 'Ліцензія vs «передаю авторські права»',
        paragraphs: [
          'Фраза «передаю авторські права» часто означає виключну ліцензію. Вкажіть територію, строк, виключність, право на зміни та субліцензії.',
          'Для маркетингових матеріалів — канали використання (сайт, реклама).',
        ],
      },
      {
        id: 'software',
        title: 'Програмне забезпечення на замовлення',
        paragraphs: [
          'Програма, створена фізичною особою на замовлення, може оцінюватися подібно до твору найманого працівника за певних умов — але все одно регулюйте код, оновлення, open-source та документацію.',
          'Якщо постачальник — компанія, перевірте права субпідрядників.',
        ],
      },
    ],
    primaryCta: {
      title: 'Договір підряду з IP',
      body: 'Smlouva o dílo для результату; за потреби — співпраця та NDA для ширших проєктів.',
      buttonLabel: 'Форма договору підряду →',
    },
    finalCta: {
      title: 'Співпраця з агентством?',
      body: 'Договір про співпрацю, коли відносини ширші за один результат.',
      buttonLabel: 'Форма договору співпраці (UA) →',
      href: withLocale('/spoluprace', 'ua'),
    },
    trust: {
      generatorSuitable: 'Сайти, дизайн, тексти, стандартні IT-модулі з чітким результатом.',
      lawyerSuitable: 'Масове поширення, музика/stock, спори про додаткову винагороду автора.',
    },
    relatedSlugs: [HUB_UA, 'work-contract-variations-czechia-2026-guide-ua'],
  }),

  topicEn('lease', {
    slug: 'short-term-rental-airbnb-czechia-2026-guide-en',
    title: 'Short-Term Rentals and Airbnb in Czechia 2026: What to Put in the Lease',
    excerpt:
      'Short-term letting via Airbnb is not always “just sublease” — lease vs accommodation service, purpose of use, and why oral agreements fail.',
    intro:
      'Letting your flat to guests through Airbnb or Booking may be treated as subletting, breach of the purpose of the lease, or an accommodation-type arrangement — depending on who lets, to whom, and how. The contract with your landlord (or tenant) should say explicitly whether short-term paid letting is allowed.',
    keywords: ['Airbnb Czech Republic lease', 'short term rental Prague', 'sublease foreigners Czechia'],
    readTime: '7 min',
    builderHref: withLocale('/najem', 'en'),
    seoLandingHref: getExpatSeoHref('en', 'lease'),
    sections: [
      {
        id: 'not-always-sublease',
        title: 'Airbnb is not always just sublease',
        paragraphs: [
          'From the landlord–tenant angle, passing the flat to paying guests may be subletting under the Civil Code (usually requiring the owner’s consent unless the lease allows otherwise).',
          'The host–guest relationship may resemble accommodation services rather than a classic lease. Czech case law has addressed tenants using flats for short-term platform letting — outcome depends on facts and contract wording.',
        ],
      },
      {
        id: 'lease-clauses',
        title: 'Clauses to include',
        paragraphs: [
          'Explicitly allow or prohibit short-term paid letting (including platforms).',
          'Rules on number of guests, noise, keys, cleaning, liability for damage, and compliance with house rules / SVJ.',
          'For OAMP residence proof, a standard lease (nájem) with the owner is usually safer than an undocumented sublease chain.',
        ],
      },
    ],
    primaryCta: {
      title: 'Lease with Airbnb clause',
      body: 'Toggle allow/prohibit short-term subletting in the English-guided rental form — Czech PDF output.',
      buttonLabel: 'Open rental form (EN) →',
    },
    trust: {
      generatorSuitable: 'Standard lease where you need clear rules on subletting and guests.',
      lawyerSuitable: 'SVJ disputes, OAMP rejection over housing proof, commercial short-term operations.',
    },
    relatedSlugs: [HUB_EN, 'rental-agreement-czech-republic-guide-en', 'sublease-vs-lease-czechia-guide-en'],
  }),

  topicUa('lease', {
    slug: 'short-term-rental-airbnb-czechia-2026-guide-ua',
    title: 'Короткострокова оренда та Airbnb в Чехії 2026: що прописати в договорі',
    excerpt:
      'Короткострокова здача через Airbnb — не завжди «просто піднайм»; оренда, послуги проживання та ризики для візи.',
    intro:
      'Здача квартири гостям через Airbnb або Booking може оцінюватися як піднайм, порушення мети оренди або режим проживання/послуг — залежно від ситуації. У договорі з власником (або орендарем) варто чітко дозволити або заборонити платне короткострокове розміщення.',
    keywords: ['Airbnb Чехія оренда', 'короткострокова оренда Прага', 'піднайм іноземці'],
    readTime: '7 хв',
    builderHref: withLocale('/najem', 'ua'),
    seoLandingHref: getExpatSeoHref('ua', 'lease'),
    sections: [
      {
        id: 'not-always-sublease',
        title: 'Airbnb — не завжди лише піднайм',
        paragraphs: [
          'З боку відносин орендодавець–орендар передача квартири платним гостям може бути піднаймом (зазвичай потрібна згода власника, якщо договір не дозволяє інше).',
          'Відносини хост–гість можуть наближатися до послуг проживання. Судова практика вже розглядала короткострокову здачу через платформи — результат залежить від обставин і тексту договору.',
        ],
      },
      {
        id: 'lease-clauses',
        title: 'Що прописати',
        paragraphs: [
          'Явно дозволити або заборонити платне короткострокове розміщення (включно з платформами).',
          'Правила щодо гостей, шуму, ключів, прибирання, відповідальності за шкоду, дотримання правил будинку / SVJ.',
          'Для підтвердження проживання в OAMP зазвичай безпечніший прямий договір оренди (nájem) з власником, ніж ланцюжок без документів.',
        ],
      },
    ],
    primaryCta: {
      title: 'Оренда з пунктом про Airbnb',
      body: 'У формі можна дозволити або заборонити короткостроковий піднайм — PDF чеською.',
      buttonLabel: 'Форма оренди (UA) →',
    },
    trust: {
      generatorSuitable: 'Типовий договір оренди з чіткими правилами щодо гостей і піднайму.',
      lawyerSuitable: 'Спори з SVJ, відмова OAMP через житло, комерційна короткострокова здача.',
    },
    relatedSlugs: [HUB_UA, 'rental-agreement-czech-republic-guide-ua', 'sublease-vs-lease-czechia-guide-ua'],
  }),
];
