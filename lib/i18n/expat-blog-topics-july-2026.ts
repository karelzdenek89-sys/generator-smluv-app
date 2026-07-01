import type { ExpatBlogArticle, ExpatBlogContractKey, ExpatBlogSection } from '@/lib/i18n/expat-blog-articles';
import { getExpatSeoHref } from '@/lib/i18n/expat-seo-landings';
import { withLocale } from '@/lib/locale';
import {
  DPP_MAX_HOURS_PER_YEAR,
  DPP_MONTHLY_THRESHOLD_2026_CZK,
  MIN_WAGE_HOURLY_2026_CZK,
  MIN_WAGE_MONTHLY_2026_CZK,
} from '@/lib/legal-constants-2026';

const HUB_EN = 'foreigners-czech-contracts-guide-en';
const HUB_UA = 'foreigners-czech-contracts-guide-ua';
const DATE_EN = '1 July 2026';
const DATE_TIME = '2026-07-01';
const DATE_UA = '1 липня 2026';

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

/** EN + UA guides aligned with July 2026 Czech blog cluster (min wage, portal, e-sign, handover, freelancer, buyer). */
export const EXPAT_BLOG_TOPICS_JULY_2026: ExpatBlogArticle[] = [
  topicEn('employment', {
    slug: 'minimum-wage-dpp-czechia-2026-guide-en',
    title: 'Minimum Wage 2026 in Czech Work Contracts and DPP: What to Check Before Signing',
    excerpt:
      `From 1 January 2026 the Czech minimum wage is CZK ${MIN_WAGE_MONTHLY_2026_CZK.toLocaleString('en-US')} monthly (CZK ${MIN_WAGE_HOURLY_2026_CZK} per hour at a 40-hour week). It affects employment contracts and DPP agreements — not only the headline amount but also hours, reporting and insurance thresholds.`,
    intro:
      `If you work in Czechia on an employment contract or DPP (agreement to perform work), your gross pay must meet the legal minimum where the law applies. For 2026, verify the monthly minimum (CZK ${MIN_WAGE_MONTHLY_2026_CZK.toLocaleString('en-US')}), hourly rate, the ${DPP_MAX_HOURS_PER_YEAR}-hour annual DPP cap per employer, and the CZK ${DPP_MONTHLY_THRESHOLD_2026_CZK.toLocaleString('en-US')} monthly threshold that can trigger social/health insurance on DPP.`,
    keywords: [
      'minimum wage Czech Republic 2026',
      'DPP agreement foreigners Czechia',
      'hourly wage Czechia 2026',
      'employment contract minimum wage',
    ],
    readTime: '7 min',
    builderHref: withLocale('/dpp', 'en'),
    seoLandingHref: getExpatSeoHref('en', 'dpp'),
    sections: [
      {
        id: 'amounts-2026',
        title: '2026 minimum wage figures',
        paragraphs: [
          `Monthly minimum for full-time work: CZK ${MIN_WAGE_MONTHLY_2026_CZK.toLocaleString('en-US')} gross.`,
          `Hourly minimum (40-hour week): CZK ${MIN_WAGE_HOURLY_2026_CZK}. Part-time rates are proportional to agreed working time.`,
        ],
      },
      {
        id: 'dpp-rules',
        title: 'DPP for foreign workers',
        paragraphs: [
          `DPP is capped at ${DPP_MAX_HOURS_PER_YEAR} hours per calendar year with one employer. Written schedule and ČSSZ reporting duties apply.`,
          `If gross pay from DPP with one employer reaches CZK ${DPP_MONTHLY_THRESHOLD_2026_CZK.toLocaleString('en-US')} in a month, insurance participation rules may apply — plan hours and pay accordingly.`,
        ],
      },
      {
        id: 'before-signing',
        title: 'Checklist before you sign',
        bullets: [
          'Is pay stated clearly (monthly, hourly or calculable)?',
          'Does the hourly rate meet the 2026 minimum?',
          'For DPP: will you stay under the annual hour cap?',
          'Does the document type match the relationship (employment vs DPP vs B2B)?',
        ],
        paragraphs: [],
      },
    ],
    primaryCta: {
      title: 'Create a DPP agreement with 2026 Labour Code elements',
      body: 'English-guided form — Czech PDF with schedule, limits and mandatory clauses.',
      buttonLabel: 'Open DPP form (EN) →',
    },
    trust: {
      generatorSuitable: 'Standard DPP or employment for typical hiring in Czechia.',
      lawyerSuitable: 'Labour inspection, multiple employers, pay disputes or reclassification to employment.',
    },
    finalCta: {
      title: 'Need a full employment contract instead?',
      body: 'English-guided employment form — Czech PDF with mandatory Labour Code elements for 2026.',
      buttonLabel: 'Open employment contract form (EN) →',
      href: withLocale('/pracovni', 'en'),
    },
    relatedSlugs: [HUB_EN, 'dpp-agreement-czech-republic-guide-en', 'flexinovela-labor-law-czechia-2026-guide-en'],
  }),

  topicUa('employment', {
    slug: 'minimum-wage-dpp-czechia-2026-guide-ua',
    title: 'Мінімальна зарплата 2026 у чеських договорах і DPP: що перевірити перед підписом',
    excerpt:
      `З 1 січня 2026 мінімальна зарплата в Чехії — ${MIN_WAGE_MONTHLY_2026_CZK.toLocaleString('cs-CZ')} Kč на місяць (${MIN_WAGE_HOURLY_2026_CZK} Kč/год при 40-годинному тижні). Це стосується трудових договорів і DPP — не лише суми, а й годин, обліку та порогів страхування.`,
    intro:
      `Якщо ви працюєте в Чехії за трудовим договором або DPP, брутто-оплата має відповідати закону. На 2026 рік перевірте місячний мінімум (${MIN_WAGE_MONTHLY_2026_CZK.toLocaleString('cs-CZ')} Kč), погодинну ставку, річний ліміт ${DPP_MAX_HOURS_PER_YEAR} годин DPP у одного роботодавця та поріг ${DPP_MONTHLY_THRESHOLD_2026_CZK.toLocaleString('cs-CZ')} Kč/міс., після якого можуть виникнути зобов’язання зі страхування.`,
    keywords: ['мінімальна зарплата Чехія 2026', 'DPP іноземці', 'трудовий договір Чехія', 'погодинна оплата 2026'],
    readTime: '7 хв',
    builderHref: withLocale('/dpp', 'ua'),
    seoLandingHref: getExpatSeoHref('ua', 'dpp'),
    sections: [
      {
        id: 'amounts-2026',
        title: 'Суми на 2026 рік',
        paragraphs: [
          `Місячний мінімум при повному робочому часі: ${MIN_WAGE_MONTHLY_2026_CZK.toLocaleString('cs-CZ')} Kč брутто.`,
          `Погодинний мінімум (40 год/тиждень): ${MIN_WAGE_HOURLY_2026_CZK} Kč. При неповному — пропорційно.`,
        ],
      },
      {
        id: 'dpp-rules',
        title: 'DPP для іноземних працівників',
        paragraphs: [
          `Ліміт DPP — ${DPP_MAX_HOURS_PER_YEAR} годин на рік у одного роботодавця. Потрібен письмовий розклад і повідомлення до ČSSZ.`,
          `При досягненні ${DPP_MONTHLY_THRESHOLD_2026_CZK.toLocaleString('cs-CZ')} Kč брутто на місяць у одного роботодавця можуть виникнути правила страхування — плануйте години та оплату.`,
        ],
      },
      {
        id: 'before-signing',
        title: 'Чеклист перед підписом',
        bullets: [
          'Чи чітко вказана оплата (місячна, погодинна)?',
          'Чи відповідає ставка мінімуму 2026?',
          'Для DPP: чи не перевищите річний ліміт годин?',
          'Чи тип документа відповідає відносинам (найм vs DPP vs B2B)?',
        ],
        paragraphs: [],
      },
    ],
    primaryCta: {
      title: 'Створити DPP з елементами трудового кодексу 2026',
      body: 'Форма українською → чеський PDF з розкладом і лімітами.',
      buttonLabel: 'Форма DPP (UA) →',
    },
    trust: {
      generatorSuitable: 'Типовий DPP або трудовий договір у Чехії.',
      lawyerSuitable: 'Інспекція праці, кілька роботодавців, спори про оплату або перекваліфікація.',
    },
    finalCta: {
      title: 'Потрібен класичний трудовий договір?',
      body: 'Форма трудового договору українською → чеський PDF з обов’язковими елементами на 2026 рік.',
      buttonLabel: 'Форма трудового договору (UA) →',
      href: withLocale('/pracovni', 'ua'),
    },
    relatedSlugs: [HUB_UA, 'dpp-agreement-czech-republic-guide-ua', 'flexinovela-labor-law-czechia-2026-guide-ua'],
  }),

  topicEn('car_sale', {
    slug: 'car-registration-online-portal-dopravy-2026-guide-en',
    title: 'Online Car Registration via Czech Transport Portal 2026: What Foreign Buyers Need',
    excerpt:
      'How to link a Czech purchase contract, handover protocol, power of attorney and digital owner-change request after buying a car in Czechia.',
    intro:
      'The Czech citizen portal (Portál dopravy) lets you submit a holder/owner change digitally if you have bank ID or a data box. For foreigners buying or selling a car, the online form does not replace a proper Czech purchase contract (kupní smlouva), handover record or — when needed — a notarised or Czech POINT–verified power of attorney.',
    keywords: [
      'car registration Czech Republic foreigners',
      'vehicle transfer online Czechia',
      'buying car Czechia registration',
      'Portál dopravy car',
    ],
    readTime: '8 min',
    builderHref: withLocale('/auto', 'en'),
    seoLandingHref: getExpatSeoHref('en', 'car_sale'),
    sections: [
      {
        id: 'online-scope',
        title: 'What you can do online',
        paragraphs: [
          'Submit a request to change the registered holder/owner, check registration status and reduce visits to the vehicle registry office.',
          'You still need contract data: seller, buyer, VIN, registration plate and transfer date.',
        ],
      },
      {
        id: 'deadline',
        title: '10 working days and documents',
        paragraphs: [
          'The new holder must report the change within 10 working days of becoming holder — usually the date in the purchase contract.',
          'Prepare: purchase contract, small technical certificate, ID documents, handover confirmation, power of attorney if someone acts for you.',
        ],
      },
      {
        id: 'why-contract',
        title: 'Why the online form is not enough',
        paragraphs: [
          'Registration fixes the administrative record; the purchase contract defines price, defects, mileage and when ownership risk passes.',
          'A handover protocol records keys, documents and vehicle condition — critical if a dispute arises later.',
        ],
      },
    ],
    primaryCta: {
      title: 'Create a Czech car purchase contract',
      body: 'English-guided form — VIN, mileage, known defects, Czech PDF output.',
      buttonLabel: 'Open car sale form (EN) →',
    },
    finalCta: {
      title: 'Need a power of attorney for registration?',
      body: 'Special or general POA in Czech — with guidance on when verification is required.',
      buttonLabel: 'Open power of attorney form (EN) →',
      href: withLocale('/plna-moc', 'en'),
    },
    trust: {
      generatorSuitable: 'Private sale between individuals — contract, handover and registration checklist.',
      lawyerSuitable: 'Liens on vehicle, cross-border sale, disputes over condition or ownership.',
    },
    relatedSlugs: [HUB_EN, 'buying-car-foreigner-czechia-2026-guide-en', 'car-sale-agreement-czech-republic-guide-en'],
  }),

  topicUa('car_sale', {
    slug: 'car-registration-online-portal-dopravy-2026-guide-ua',
    title: 'Онлайн переоформлення авто через Portál dopravy 2026: що потрібно іноземцям',
    excerpt:
      'Як поєднати чеський договір купівлі-продажу, протокол передачі, довіреність і цифрову заявку на зміну власника після купівлі авто в Чехії.',
    intro:
      'Portál dopravy дозволяє подати зміну власника/тримача онлайн за наявності bank ID або datové schránky. Для іноземців онлайн-форма не замінює договір купівлі-продажу (kupní smlouva), протокол передачі або — за потреби — довіреність з ověřením podpisu на Czech POINT.',
    keywords: ['переоформлення авто Чехія', 'купівля авто іноземець', 'Portál dopravy', 'реєстрація авто 2026'],
    readTime: '8 хв',
    builderHref: withLocale('/auto', 'ua'),
    seoLandingHref: getExpatSeoHref('ua', 'car_sale'),
    sections: [
      {
        id: 'online-scope',
        title: 'Що можна зробити онлайн',
        paragraphs: [
          'Подати заявку на зміну тримача/власника, перевірити статус реєстрації, зменшити візити до úřad.',
          'Потрібні дані з договору: продавець, покупець, VIN, SPZ, дата передачі.',
        ],
      },
      {
        id: 'deadline',
        title: '10 робочих днів і документи',
        paragraphs: [
          'Новий тримач має повідомити зміну протягом 10 робочих днів — зазвичай від дати в договорі.',
          'Підготуйте: договір купівлі-продажу, технічний паспорт, документи особи, протокол передачі, довіреність за потреби.',
        ],
      },
      {
        id: 'why-contract',
        title: 'Чому однієї онлайн-форми недостатньо',
        paragraphs: [
          'Реєстрація — адміністративний крок; договір визначає ціну, вади, пробіг і момент передачі ризиків.',
          'Протокол передачі фіксує ключі, документи та стан авто.',
        ],
      },
    ],
    primaryCta: {
      title: 'Створити договір купівлі-продажу авто',
      body: 'Форма українською → чеський PDF з VIN, пробігом і відомими вадами.',
      buttonLabel: 'Форма купівлі авто (UA) →',
    },
    finalCta: {
      title: 'Потрібна довіреність для переоформлення?',
      body: 'Спеціальна або генеральна довіреність чеською — з поясненням, коли потрібне засвідчення.',
      buttonLabel: 'Форма довіреності (UA) →',
      href: withLocale('/plna-moc', 'ua'),
    },
    trust: {
      generatorSuitable: 'Приватний продаж між фізособами — договір, передача, чеклист реєстрації.',
      lawyerSuitable: 'Обтяження авто, транскордонний продаж, спори про стан або власність.',
    },
    relatedSlugs: [HUB_UA, 'buying-car-foreigner-czechia-2026-guide-ua', 'car-sale-agreement-czech-republic-guide-ua'],
  }),

  topicEn('power_of_attorney', {
    slug: 'electronic-signature-elegalization-czechia-2026-guide-en',
    title: 'Electronic Signatures and eLegalizace in Czechia 2026: When Online Signing Is Enough',
    excerpt:
      'Plain-language guide to simple, advanced and qualified electronic signatures, eLegalizace and Czech POINT verification for contracts and powers of attorney.',
    intro:
      'Foreigners in Czechia often need to sign leases, car contracts or powers of attorney (plná moc). Czech law recognises several signature levels under eIDAS. Some authorities still require a verified (Czech POINT or notarial) signature — especially for vehicle registration or immigration-related POAs.',
    keywords: [
      'electronic signature Czech Republic',
      'eLegalizace Czechia',
      'power of attorney foreigners Czechia',
      'qualified electronic signature',
    ],
    readTime: '8 min',
    builderHref: withLocale('/plna-moc', 'en'),
    seoLandingHref: getExpatSeoHref('en', 'power_of_attorney'),
    sections: [
      {
        id: 'three-levels',
        title: 'Three practical signature levels',
        paragraphs: [
          'Simple handwritten signature on paper — most common for private leases and car sales between individuals.',
          'Advanced electronic signature (AES) — higher identity assurance; used in B2B online signing.',
          'Qualified electronic signature (QES) — legal effect similar to handwritten signature under eIDAS; required for some official acts.',
        ],
      },
      {
        id: 'elegalizace',
        title: 'What eLegalizace does',
        paragraphs: [
          'eLegalizace helps verify an electronic signature or electronic copy online — useful for remote B2B deals.',
          'It does not replace Czech POINT verification where an office explicitly requires úředně ověřený podpis for a power of attorney.',
        ],
      },
      {
        id: 'when-verify',
        title: 'When to verify your signature',
        bullets: [
          'Vehicle registry acts through a representative.',
          'Some immigration or landlord requirements for housing proof.',
          'High-value deals where the other party insists on verification.',
        ],
        paragraphs: [],
      },
    ],
    primaryCta: {
      title: 'Create a Czech power of attorney',
      body: 'English-guided form — scope, vehicle or authority, Czech PDF for printing or signing.',
      buttonLabel: 'Open POA form (EN) →',
    },
    trust: {
      generatorSuitable: 'Standard POA, private contracts, lease and car sale documents.',
      lawyerSuitable: 'Notarial acts, land registry, contested validity of signature.',
    },
    finalCta: {
      title: 'Signing a lease or car contract?',
      body: 'English-guided rental or car sale form — Czech PDF ready to print and sign.',
      buttonLabel: 'Open car sale form (EN) →',
      href: withLocale('/auto', 'en'),
    },
    relatedSlugs: [HUB_EN, 'power-of-attorney-foreigners-2026-guide-en', 'power-of-attorney-czech-republic-guide-en'],
  }),

  topicUa('power_of_attorney', {
    slug: 'electronic-signature-elegalization-czechia-2026-guide-ua',
    title: 'Електронний підпис і eLegalizace в Чехії 2026: коли достатньо онлайн-підпису',
    excerpt:
      'Практичний огляд рівнів електронного підпису, eLegalizace та засвідчення на Czech POINT для договорів і довіреностей.',
    intro:
      'Іноземцям у Чехії часто потрібно підписувати договори оренди, купівлі авто або довіреності (plná moc). Чеське право визнає кілька рівнів підпису згідно з eIDAS. Деякі органи все ще вимагають ověřený podpis — особливо для переоформлення авто або довіреностей для імміграції.',
    keywords: ['електронний підпис Чехія', 'eLegalizace', 'довіреність іноземці', 'кvalifikovaný podpis'],
    readTime: '8 хв',
    builderHref: withLocale('/plna-moc', 'ua'),
    seoLandingHref: getExpatSeoHref('ua', 'power_of_attorney'),
    sections: [
      {
        id: 'three-levels',
        title: 'Три рівні підпису',
        paragraphs: [
          'Звичайний власноручний підпис на папері — найпоширеніший для оренди та купівлі авто між фізособами.',
          'Zaručený elektronický podpis (AES) — вища достовірність ідентичності; B2B онлайн.',
          'Kvalifikovaný elektronický podpis (QES) — ефект подібний до власноручного підпису за eIDAS.',
        ],
      },
      {
        id: 'elegalizace',
        title: 'Навіщо eLegalizace',
        paragraphs: [
          'eLegalizace допомагає перевірити електронний підпис або копію документа онлайн.',
          'Не замінює ověření podpisu на Czech POINT, якщо орган цього вимагає.',
        ],
      },
      {
        id: 'when-verify',
        title: 'Коли засвідчити підпис',
        bullets: [
          'Переоформлення авто через представника.',
          'Окремі вимоги орендодавця або OAMP до житла.',
          'Дорогі угоди, де контрагент наполягає на засвідченні.',
        ],
        paragraphs: [],
      },
    ],
    primaryCta: {
      title: 'Створити чеську довіреність',
      body: 'Форма українською → чеський PDF для друку або підпису.',
      buttonLabel: 'Форма довіреності (UA) →',
    },
    trust: {
      generatorSuitable: 'Типова довіреність, приватні договори, оренда та купівля авто.',
      lawyerSuitable: 'Нотаріальні дії, кадастр, спори про дійсність підпису.',
    },
    finalCta: {
      title: 'Підписуєте оренду або договір купівлі авто?',
      body: 'Форма оренди або купівлі авто українською → чеський PDF для друку та підпису.',
      buttonLabel: 'Форма купівлі авто (UA) →',
      href: withLocale('/auto', 'ua'),
    },
    relatedSlugs: [HUB_UA, 'power-of-attorney-foreigners-2026-guide-ua', 'power-of-attorney-czech-republic-guide-ua'],
  }),

  topicEn('lease', {
    slug: 'handover-protocol-czechia-2026-guide-en',
    title: 'Handover Protocol in Czechia 2026: Apartment and Car — What to Put in Writing',
    excerpt:
      'Why a předávací protokol matters after a lease or car purchase contract — meters, keys, condition, documents.',
    intro:
      'A handover protocol (předávací protokol) records the moment a flat or car is physically transferred. The main contract sets rights and price; the protocol proves condition and what was handed over. For foreigners, clear Czech paperwork also supports residence and registration processes.',
    keywords: ['handover protocol Czech Republic', 'apartment handover Prague', 'car handover Czechia', 'rental protocol foreigners'],
    readTime: '7 min',
    builderHref: withLocale('/najem', 'en'),
    seoLandingHref: getExpatSeoHref('en', 'lease'),
    sections: [
      {
        id: 'purpose',
        title: 'What the protocol is for',
        paragraphs: [
          'Documents date, parties, condition, meter readings (flat) or mileage (car), keys and documents received.',
          'Without it, disputes about damage, missing items or deposit return are harder to resolve.',
        ],
      },
      {
        id: 'flat',
        title: 'Flat handover',
        bullets: [
          'Meter readings for electricity, gas, water.',
          'Photos of existing damage.',
          'List of keys and equipment.',
          'Link to deposit (kauce) conditions in the lease.',
        ],
        paragraphs: [],
      },
      {
        id: 'car',
        title: 'Car handover',
        bullets: [
          'Mileage and visible defects.',
          'Keys, remote, technical certificate.',
          'Cross-check VIN with purchase contract.',
        ],
        paragraphs: [],
      },
    ],
    primaryCta: {
      title: 'Create a Czech rental agreement with handover support',
      body: 'English-guided lease — Czech PDF; extended tiers include handover elements.',
      buttonLabel: 'Open rental form (EN) →',
    },
    finalCta: {
      title: 'Selling or buying a car?',
      body: 'Purchase contract plus handover checklist — Czech PDF.',
      buttonLabel: 'Open car sale form (EN) →',
      href: withLocale('/auto', 'en'),
    },
    trust: {
      generatorSuitable: 'Standard move-in/move-out or private car transfer.',
      lawyerSuitable: 'Major damage claims, commercial lease, contested deposit.',
    },
    relatedSlugs: [HUB_EN, 'rental-agreement-czech-republic-guide-en', 'buying-car-foreigner-czechia-2026-guide-en'],
  }),

  topicUa('lease', {
    slug: 'handover-protocol-czechia-2026-guide-ua',
    title: 'Протокол передачі в Чехії 2026: квартира та авто — що зафіксувати письмово',
    excerpt:
      'Навіщо потрібен předávací protokol після договору оренди або купівлі авто — лічильники, ключі, стан, документи.',
    intro:
      'Протокол передачі фіксує момент фактичної передачі квартири або авто. Основний договір визначає права та ціну; протокол доводить стан і передані речі. Для іноземців чіткі чеські документи також допомагають при підтвердженні проживання та реєстрації.',
    keywords: ['протокол передачі Чехія', 'передача квартири іноземець', 'передача авто', 'оренда протокол'],
    readTime: '7 хв',
    builderHref: withLocale('/najem', 'ua'),
    seoLandingHref: getExpatSeoHref('ua', 'lease'),
    sections: [
      {
        id: 'purpose',
        title: 'Навіщо протокол',
        paragraphs: [
          'Фіксує дату, сторони, стан, показники лічильників або пробіг, ключі та документи.',
          'Без протоколу складніше вирішувати спори про пошкодження, відсутні речі або повернення kauce.',
        ],
      },
      {
        id: 'flat',
        title: 'Передача квартири',
        bullets: [
          'Показники електрики, газу, води.',
          'Фото існуючих пошкоджень.',
          'Список ключів і обладнання.',
          'Зв’язок з kauce в договорі оренди.',
        ],
        paragraphs: [],
      },
      {
        id: 'car',
        title: 'Передача авто',
        bullets: [
          'Пробіг і видимі вади.',
          'Ключі, пульт, технічний паспорт.',
          'Перевірка VIN з договором.',
        ],
        paragraphs: [],
      },
    ],
    primaryCta: {
      title: 'Створити договір оренди з підтримкою передачі',
      body: 'Форма українською → чеський PDF; розширені варіанти включають елементи передачі.',
      buttonLabel: 'Форма оренди (UA) →',
    },
    finalCta: {
      title: 'Купуєте або продаєте авто?',
      body: 'Договір купівлі-продажу та чеклист передачі — PDF чеською.',
      buttonLabel: 'Форма купівлі авто (UA) →',
      href: withLocale('/auto', 'ua'),
    },
    trust: {
      generatorSuitable: 'Типове вселення/виселення або передача авто між фізособами.',
      lawyerSuitable: 'Серйозні претензії щодо шкоди, комерційна оренда, спір про kauce.',
    },
    relatedSlugs: [HUB_UA, 'rental-agreement-czech-republic-guide-ua', 'buying-car-foreigner-czechia-2026-guide-ua'],
  }),

  topicEn('hub', {
    slug: 'freelancer-work-contract-czechia-2026-guide-en',
    title: 'Work Contract for Freelancers in Czechia 2026: Smlouva o dílo vs DPP',
    excerpt:
      'When to use a Czech work contract (smlouva o dílo) versus DPP — and how to avoid dependent-work (švarcsystém) risk as a foreign freelancer or client.',
    intro:
      'Foreign freelancers and employers often confuse DPP (short employment agreement) with smlouva o dílo (contract for work with a deliverable). The wrong label can trigger labour inspection, back payments and penalties. Match the document to how work is actually performed.',
    keywords: [
      'freelancer contract Czech Republic',
      'smlouva o dílo foreigners',
      'DPP vs work contract Czechia',
      'švarcsystém foreigners',
    ],
    readTime: '8 min',
    builderHref: withLocale('/smlouva-o-dilo', 'en'),
    sections: [
      {
        id: 'difference',
        title: 'Deliverable vs hours',
        paragraphs: [
          'Smlouva o dílo: specific result (website, design, translation) — Civil Code, invoice, copyright clauses.',
          'DPP: work performed under employer direction — Labour Code, hour limits, minimum wage, ČSSZ reporting.',
        ],
      },
      {
        id: 'freelancer-clauses',
        title: 'What freelancers should contract',
        bullets: [
          'Clear scope and acceptance criteria.',
          'Payment milestones and late-payment interest.',
          'Copyright licence or transfer.',
          'Written change orders for extra scope.',
        ],
        paragraphs: [],
      },
      {
        id: 'schwarz',
        title: 'Dependent-work risk',
        paragraphs: [
          'If you are subordinate, use employer tools, fixed “salary” and one client only, inspectors may treat the relationship as illegal employment — not B2B.',
          'When in doubt, use employment/DPP or a genuinely independent work contract with deliverables.',
        ],
      },
    ],
    primaryCta: {
      title: 'Create a smlouva o dílo (work contract)',
      body: 'Czech PDF with scope, price, deadlines and handover.',
      buttonLabel: 'Open work contract form →',
    },
    finalCta: {
      title: 'Is it actually short-term employment?',
      body: 'DPP with 2026 Labour Code elements — English guidance, Czech PDF.',
      buttonLabel: 'Open DPP form (EN) →',
      href: withLocale('/dpp', 'en'),
    },
    trust: {
      generatorSuitable: 'Project-based freelance work or legitimate short DPP assignments.',
      lawyerSuitable: 'Inspection proceedings, reclassification, large back-payment claims.',
    },
    relatedSlugs: [HUB_EN, 'dependent-work-b2b-czechia-2026-guide-en', 'freelancer-copyright-czechia-2026-guide-en'],
  }),

  topicUa('hub', {
    slug: 'freelancer-work-contract-czechia-2026-guide-ua',
    title: 'Договір для фрілансера в Чехії 2026: smlouva o dílo чи DPP',
    excerpt:
      'Коли використовувати договір підряду (smlouva o dílo), а коли DPP — і як уникнути ризику залежної праці (švarcsystém) для іноземця-фрілансера.',
    intro:
      'Іноземці-фрілансери часто плутають DPP із smlouva o dílo (конкретний результат). Неправильний тип документа може призвести до перевірки інспекції праці, донарахувань і штрафів. Документ має відповідати реальному характеру роботи.',
    keywords: ['фрілансер договір Чехія', 'smlouva o dílo іноземці', 'DPP чи підряд', 'шварц-система'],
    readTime: '8 хв',
    builderHref: withLocale('/smlouva-o-dilo', 'ua'),
    sections: [
      {
        id: 'difference',
        title: 'Результат чи години',
        paragraphs: [
          'Smlouva o dílo: конкретний результат (сайт, дизайн, текст) — цивільний кодекс, рахунок, авторські права.',
          'DPP: робота за вказівками роботодавця — трудовий кодекс, ліміти годин, мінімальна зарплата, ČSSZ.',
        ],
      },
      {
        id: 'freelancer-clauses',
        title: 'Що прописати фрілансеру',
        bullets: [
          'Чіткий обсяг і критерії приймання.',
          'Етапи оплати та відсоток за прострочення.',
          'Ліцензія або передача авторських прав.',
          'Письмові зміни обсягу (vícepráce).',
        ],
        paragraphs: [],
      },
      {
        id: 'schwarz',
        title: 'Ризик залежної праці',
        paragraphs: [
          'Якщо є підпорядкування, інструменти замовника, фіксована «зарплата» і один клієнт — інспекція може вважати це незаконним наймом.',
          'У сумніві — трудовий договір/DPP або справжній B2B з результатом.',
        ],
      },
    ],
    primaryCta: {
      title: 'Створити smlouva o dílo (договір підряду)',
      body: 'PDF чеською з обсягом, ціною, термінами та передачею.',
      buttonLabel: 'Форма договору підряду →',
    },
    finalCta: {
      title: 'Це фактично короткострокова робота?',
      body: 'DPP з елементами трудового кодексу 2026 — форма українською, PDF чеською.',
      buttonLabel: 'Форма DPP (UA) →',
      href: withLocale('/dpp', 'ua'),
    },
    trust: {
      generatorSuitable: 'Проектна фріланс-робота або законний короткий DPP.',
      lawyerSuitable: 'Перевірка інспекції, перекваліфікація, великі донарахування.',
    },
    relatedSlugs: [HUB_UA, 'dependent-work-b2b-czechia-2026-guide-ua', 'freelancer-copyright-czechia-2026-guide-ua'],
  }),

  topicEn('car_sale', {
    slug: 'car-buyer-checklist-czechia-2026-guide-en',
    title: 'Buying a Used Car in Czechia 2026: Buyer Checklist Before You Sign',
    excerpt:
      'VIN check, service history, known defects, documents and registration steps for foreign buyers of Czech cars.',
    intro:
      'As a foreign buyer, you need the same Czech purchase contract (kupní smlouva) as a local — but pay extra attention to residence-related documents, registration within 10 working days and whether you need a verified power of attorney if you cannot visit the registry office.',
    keywords: ['buy used car Czech Republic', 'car buyer checklist Czechia', 'VIN check Czechia', 'foreigner buy car Prague'],
    readTime: '8 min',
    builderHref: withLocale('/auto', 'en'),
    seoLandingHref: getExpatSeoHref('en', 'car_sale'),
    sections: [
      {
        id: 'before-viewing',
        title: 'Before viewing',
        bullets: [
          'Verify VIN against technical certificate and online history if available.',
          'Check STK validity and outstanding fees.',
          'Confirm seller identity matches registration documents.',
        ],
        paragraphs: [],
      },
      {
        id: 'contract-points',
        title: 'In the purchase contract',
        paragraphs: [
          'State mileage, known defects and transfer date explicitly.',
          'Avoid vague “as is” wording without your own inspection notes.',
        ],
      },
      {
        id: 'after-signing',
        title: 'After signing',
        paragraphs: [
          'Handover protocol with keys and small technical certificate.',
          'Register as holder within 10 working days — Portál dopravy or office visit.',
          'Consider POA if a friend registers the car for you — scope must name the vehicle.',
        ],
      },
    ],
    primaryCta: {
      title: 'Generate a Czech car purchase contract',
      body: 'English form — Czech PDF with VIN, price and defect clauses.',
      buttonLabel: 'Open car sale form (EN) →',
    },
    finalCta: {
      title: 'Registering the car through a representative?',
      body: 'Special POA naming the vehicle — Czech PDF with guidance on verified signature.',
      buttonLabel: 'Open power of attorney form (EN) →',
      href: withLocale('/plna-moc', 'en'),
    },
    trust: {
      generatorSuitable: 'Private used-car purchase with standard due diligence.',
      lawyerSuitable: 'Odometer fraud suspicion, encumbrances, dealer warranty disputes.',
    },
    relatedSlugs: [HUB_EN, 'buying-car-foreigner-czechia-2026-guide-en', 'car-registration-online-portal-dopravy-2026-guide-en'],
  }),

  topicUa('car_sale', {
    slug: 'car-buyer-checklist-czechia-2026-guide-ua',
    title: 'Купівля вживаного авто в Чехії 2026: чеклист покупця перед підписом',
    excerpt:
      'Перевірка VIN, сервісна історія, відомі вади, документи та кроки реєстрації для іноземних покупців.',
    intro:
      'Іноземцю потрібен той самий чеський договір kupní smlouva — але варто додатково перевірити документи для проживання, реєстрацію протягом 10 робочих днів і чи потрібна довіреність з ověřením podpisu, якщо ви не можете відвідати úřad.',
    keywords: ['купівля авто Чехія іноземець', 'чеклист покупця авто', 'перевірка VIN', 'б/в авто Прага'],
    readTime: '8 хв',
    builderHref: withLocale('/auto', 'ua'),
    seoLandingHref: getExpatSeoHref('ua', 'car_sale'),
    sections: [
      {
        id: 'before-viewing',
        title: 'Перед оглядом',
        bullets: [
          'Перевірте VIN за техпаспортом та історією, якщо доступна.',
          'Перевірте STK та заборгованості.',
          'Особа продавця має відповідати документам.',
        ],
        paragraphs: [],
      },
      {
        id: 'contract-points',
        title: 'У договорі',
        paragraphs: [
          'Явно вкажіть пробіг, відомі вади та дату передачі.',
          'Уникайте розмитого «as is» без власних нотаток з огляду.',
        ],
      },
      {
        id: 'after-signing',
        title: 'Після підпису',
        paragraphs: [
          'Протокол передачі з ключами та техпаспортом.',
          'Реєстрація тримача за 10 робочих днів — Portál dopravy або úřad.',
          'Довіреність, якщо реєструє друг — має називати конкретне авто.',
        ],
      },
    ],
    primaryCta: {
      title: 'Створити договір купівлі-продажу авто',
      body: 'Форма українською → чеський PDF з VIN, ціною та вадами.',
      buttonLabel: 'Форма купівлі авто (UA) →',
    },
    finalCta: {
      title: 'Реєструєте авто через представника?',
      body: 'Спеціальна довіреність з назвою авто — PDF чеською з поясненням ověřením podpisu.',
      buttonLabel: 'Форма довіреності (UA) →',
      href: withLocale('/plna-moc', 'ua'),
    },
    trust: {
      generatorSuitable: 'Приватна купівля б/в авто зі стандартною перевіркою.',
      lawyerSuitable: 'Підозра на скручений пробіг, обтяження, спори з дилером.',
    },
    relatedSlugs: [HUB_UA, 'buying-car-foreigner-czechia-2026-guide-ua', 'car-registration-online-portal-dopravy-2026-guide-ua'],
  }),
];
