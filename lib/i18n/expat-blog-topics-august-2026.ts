import type {
  ExpatBlogArticle,
  ExpatBlogContractKey,
  ExpatBlogSection,
} from '@/lib/i18n/expat-blog-articles';
import { getExpatSeoHref } from '@/lib/i18n/expat-seo-landings';
import { withLocale } from '@/lib/locale';

const HUB_EN = 'foreigners-czech-contracts-guide-en';
const HUB_UA = 'foreigners-czech-contracts-guide-ua';
const DATE_TIME = '2026-08-13';

const LABOUR_CODE_URL = 'https://e-sbirka.gov.cz/sb/2006/262/2026-01-01';
const DPP_MPSV_URL = 'https://mpsv.gov.cz/slovnik-pojmu-dohoda-o-provedeni-prace';
const DPP_HOLIDAY_MPSV_URL = 'https://mpsv.gov.cz/novinky-v-pracovnim-pravu';
const FLEX_AMENDMENT_MPSV_URL =
  'https://mpsv.gov.cz/jake-zmeny-prinasi-flexibilni-novela-zakoniku-prace-';
const PERMANENT_ADDRESS_GOV_URL =
  'https://portal.gov.cz/rozcestniky/najem-a-trvaly-pobyt-RZC-96';
const ADDRESS_CHANGE_GOV_URL =
  'https://portal.gov.cz/sluzby-vs/ohlaseni-zmeny-mista-trvaleho-pobytu-S605';
const FOREIGNER_ACCOMMODATION_URL =
  'https://ipc.gov.cz/formulare-a-dokumenty/nalezitosti-dokumenty/doklad-o-ubytovani/';

type TopicOptions = {
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
  officialSources: NonNullable<ExpatBlogArticle['officialSources']>;
};

function topicEn(contractKey: ExpatBlogContractKey, opts: TopicOptions): ExpatBlogArticle {
  return {
    slug: opts.slug,
    audience: 'en',
    contractKey,
    category: 'For foreigners (EN)',
    readTime: opts.readTime,
    dateLabel: '13 August 2026',
    dateTime: DATE_TIME,
    title: opts.title,
    excerpt: opts.excerpt,
    intro: opts.intro,
    keywords: opts.keywords,
    builderHref: opts.builderHref,
    seoLandingHref: opts.seoLandingHref,
    expatHubHref: '/en',
    toc: opts.sections.map((section, index) => ({
      href: `#${section.id}`,
      label: `${index + 1}. ${section.title}`,
    })),
    sections: opts.sections,
    primaryCta: opts.primaryCta,
    finalCta:
      opts.finalCta ?? {
        title: opts.primaryCta.title,
        body: 'Open the English-guided form, fill in your details and download the Czech PDF after payment.',
        buttonLabel: opts.primaryCta.buttonLabel,
      },
    trustBox: opts.trust,
    disclaimer: {
      heading: 'Informational content — not legal services',
      body:
        'This article summarizes current official Czech information in plain language. SmlouvaHned is a software tool, not a law firm, and does not provide legal or immigration advice.',
      lawyerNote:
        'For a dispute, dismissal, residence proceeding or non-standard facts, consult a registered Czech attorney or the competent authority.',
    },
    officialSources: opts.officialSources,
    ui: {
      breadcrumbBlog: 'Blog',
      readTime: 'read',
      tocTitle: 'Contents',
      relatedHub: 'Related guides',
      backToExpats: 'Expat contract overview',
      contractLinksTitle: 'Create this document',
    },
    relatedSlugs: opts.relatedSlugs,
  };
}

function topicUa(contractKey: ExpatBlogContractKey, opts: TopicOptions): ExpatBlogArticle {
  return {
    slug: opts.slug,
    audience: 'ua',
    contractKey,
    category: 'Для іноземців (UA)',
    readTime: opts.readTime,
    dateLabel: '13 серпня 2026',
    dateTime: DATE_TIME,
    title: opts.title,
    excerpt: opts.excerpt,
    intro: opts.intro,
    keywords: opts.keywords,
    builderHref: opts.builderHref,
    seoLandingHref: opts.seoLandingHref,
    expatHubHref: '/ua',
    toc: opts.sections.map((section, index) => ({
      href: `#${section.id}`,
      label: `${index + 1}. ${section.title}`,
    })),
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
        'Стаття простою мовою узагальнює актуальну офіційну інформацію Чехії. SmlouvaHned — програмний інструмент, а не юридична фірма, і не надає юридичних чи імміграційних консультацій.',
      lawyerNote:
        'Для спору, звільнення, провадження щодо перебування або нестандартних обставин зверніться до чеського адвоката чи компетентного органу.',
    },
    officialSources: opts.officialSources,
    ui: {
      breadcrumbBlog: 'Блог',
      readTime: 'читання',
      tocTitle: 'Зміст',
      relatedHub: 'Пов’язані гіди',
      backToExpats: 'Огляд договорів для іноземців',
      contractLinksTitle: 'Створити документ',
    },
    relatedSlugs: opts.relatedSlugs,
  };
}

export const EXPAT_BLOG_TOPICS_AUGUST_2026: ExpatBlogArticle[] = [
  topicEn('dpp', {
    slug: 'dpp-holiday-czechia-2026-guide-en',
    title: 'DPP Holiday in Czechia 2026: 28 Days and 80 Hours',
    excerpt:
      'When paid holiday arises under a Czech DPP, why 28 calendar days and 80 hours matter, and how employers calculate the entitlement from a notional 20-hour week.',
    intro:
      'A Czech agreement to complete a job (DPP) can create a statutory right to paid holiday. The right is not written off merely because the worker is a “contractor”: in 2026 the decisive tests are the continuous duration of the DPP and hours counted for holiday purposes. This guide explains the official MPSV rules without mixing them with insurance thresholds.',
    keywords: [
      'DPP holiday Czech Republic 2026',
      'DPP paid leave Czechia',
      '80 hours DPP holiday',
      'Czech DPP vacation calculation',
    ],
    readTime: '8 min',
    builderHref: withLocale('/dpp', 'en'),
    seoLandingHref: getExpatSeoHref('en', 'dpp'),
    sections: [
      {
        id: 'eligibility',
        title: 'The two conditions: 28 days and 80 hours',
        paragraphs: [
          'Holiday arises only if the DPP relationship lasts continuously for at least 28 calendar days in the same calendar year and the worker completes at least four notional weeks for holiday purposes. For DPP and DPČ, the notional weekly working time is 20 hours, so the threshold is 80 hours.',
          'Both conditions must be met. A worker with 82 hours under a DPP that lasts only 25 days does not pass the duration test; a three-month DPP with 70 counted hours does not pass the hours test.',
        ],
      },
      {
        id: 'calculation',
        title: 'How the holiday is calculated',
        paragraphs: [
          'MPSV uses this formula: whole multiples of 20 counted hours ÷ 52 × 20 × annual holiday allowance in weeks. The result is rounded up to a whole hour.',
          'Example: 215 counted hours contain 10 whole multiples of 20. With a four-week annual allowance, 10 ÷ 52 × 20 × 4 equals 15.38, rounded up to 16 hours of holiday. The calculation can include certain substitute periods, not only hours physically worked.',
        ],
      },
      {
        id: 'taking-and-payment',
        title: 'Taking holiday and payment when the DPP ends',
        paragraphs: [
          'The employer normally schedules holiday and should not automatically postpone the issue until the end of every long-running DPP. If a short DPP ends with unused holiday, compensation may be paid under the Labour Code.',
          'Holiday hours and certain substitute periods do not reduce the DPP limit of 300 hours of actual work per calendar year for one employer. Keep the 300-hour work limit and the separate holiday calculation in different records.',
        ],
      },
      {
        id: 'contract-checklist',
        title: 'What to record in the DPP and payroll process',
        bullets: [
          'Use a written DPP and give one copy to the worker.',
          'State or separately provide the required information about holiday and how it is determined.',
          'Keep reliable working-time records so the 80-hour threshold and calculation are auditable.',
          'Do not confuse holiday eligibility with monthly social-insurance or tax thresholds.',
        ],
        paragraphs: [],
      },
    ],
    primaryCta: {
      title: 'Prepare a Czech DPP with English guidance',
      body: 'Fill in the work, term, hours and remuneration in English; the generated agreement is primarily in Czech.',
      buttonLabel: 'Open DPP form (EN) →',
    },
    trust: {
      generatorSuitable:
        'A standard DPP where the job, expected hours, duration and remuneration are clear and the employer keeps separate time and holiday records.',
      lawyerSuitable:
        'A disputed holiday balance, chained agreements, unclear continuity, dismissal retaliation or a broader payroll and insurance dispute.',
    },
    relatedSlugs: [
      HUB_EN,
      'dpp-agreement-czech-republic-guide-en',
      'minimum-wage-dpp-czechia-2026-guide-en',
    ],
    officialSources: [
      { label: 'MPSV: Agreement to complete a job (DPP)', href: DPP_MPSV_URL },
      { label: 'MPSV: Employment-law Q&A on DPP holiday and examples', href: DPP_HOLIDAY_MPSV_URL },
      { label: 'e-Sbírka: Act No. 262/2006 Coll., Labour Code', href: LABOUR_CODE_URL },
    ],
  }),

  topicUa('dpp', {
    slug: 'dpp-holiday-czechia-2026-guide-ua',
    title: 'Відпустка за DPP у Чехії 2026: 28 днів і 80 годин',
    excerpt:
      'Коли за чеською DPP виникає оплачувана відпустка, чому важливі 28 календарних днів і 80 годин та як роботодавець рахує право з умовного 20-годинного тижня.',
    intro:
      'Чеська dohoda o provedení práce (DPP) може давати законне право на оплачувану відпустку. Воно не зникає лише тому, що робота виконується за «угодою»: у 2026 році вирішальними є безперервна тривалість DPP і години, зараховані для відпустки. Нижче — правила MPSV без змішування з порогами страхових внесків.',
    keywords: [
      'відпустка DPP Чехія 2026',
      'оплачувана відпустка DPP',
      '80 годин DPP відпустка',
      'розрахунок відпустки Чехія DPP',
    ],
    readTime: '8 хв',
    builderHref: withLocale('/dpp', 'ua'),
    seoLandingHref: getExpatSeoHref('ua', 'dpp'),
    sections: [
      {
        id: 'eligibility',
        title: 'Дві умови: 28 днів і 80 годин',
        paragraphs: [
          'Право виникає, якщо відносини за DPP безперервно тривають щонайменше 28 календарних днів у тому самому календарному році та працівник набрав щонайменше чотири умовні тижні для відпустки. Для DPP і DPČ умовний тижневий час становить 20 годин, тому поріг дорівнює 80 годинам.',
          'Потрібні обидві умови. 82 години за DPP тривалістю лише 25 днів не виконують умову тривалості; тримісячна DPP із 70 зарахованими годинами не виконує погодинну умову.',
        ],
      },
      {
        id: 'calculation',
        title: 'Як розраховується відпустка',
        paragraphs: [
          'MPSV наводить формулу: повні кратні 20 зарахованим годинам ÷ 52 × 20 × річна тривалість відпустки в тижнях. Результат округлюється вгору до цілої години.',
          'Приклад: 215 зарахованих годин містять 10 повних двадцятигодинних блоків. За чотиритижневої річної відпустки 10 ÷ 52 × 20 × 4 = 15,38, тобто 16 годин. До розрахунку можуть входити певні замінні періоди, а не лише фактично відпрацьований час.',
        ],
      },
      {
        id: 'taking-and-payment',
        title: 'Використання та компенсація після завершення DPP',
        paragraphs: [
          'Зазвичай час відпустки визначає роботодавець; у довготривалій DPP не варто автоматично відкладати все до завершення угоди. Якщо коротка DPP закінчилася з невикористаною відпусткою, за Кодексом праці можлива грошова компенсація.',
          'Години відпустки та деякі замінні періоди не зменшують ліміт DPP у 300 годин фактичної роботи на рік в одного роботодавця. Ліміт роботи й розрахунок відпустки слід вести окремо.',
        ],
      },
      {
        id: 'contract-checklist',
        title: 'Що зафіксувати в DPP та обліку',
        bullets: [
          'Укладіть DPP письмово та передайте працівникові один примірник.',
          'Зазначте або окремо надайте обов’язкову інформацію про відпустку та спосіб її визначення.',
          'Ведіть надійний облік робочого часу для перевірки порога 80 годин і розрахунку.',
          'Не плутайте право на відпустку з місячними порогами внесків чи оподаткування.',
        ],
        paragraphs: [],
      },
    ],
    primaryCta: {
      title: 'Підготуйте чеську DPP із підказками українською',
      body: 'Заповніть роботу, строк, години й винагороду українською; згенерована угода буде переважно чеською.',
      buttonLabel: 'Відкрити форму DPP (UA) →',
    },
    trust: {
      generatorSuitable:
        'Стандартна DPP із чіткою роботою, очікуваними годинами, строком і винагородою та окремим обліком часу й відпустки.',
      lawyerSuitable:
        'Спір про залишок відпустки, ланцюг угод, незрозуміла безперервність, помста через реалізацію прав або ширший спір щодо зарплати й внесків.',
    },
    relatedSlugs: [
      HUB_UA,
      'dpp-agreement-czech-republic-guide-ua',
      'minimum-wage-dpp-czechia-2026-guide-ua',
    ],
    officialSources: [
      { label: 'MPSV: dohoda o provedení práce (DPP)', href: DPP_MPSV_URL },
      { label: 'MPSV: запитання й приклади щодо відпустки за DPP', href: DPP_HOLIDAY_MPSV_URL },
      { label: 'e-Sbírka: закон № 262/2006 Зб., Кодекс праці', href: LABOUR_CODE_URL },
    ],
  }),

  topicEn('employment', {
    slug: 'employment-notice-period-czechia-2026-guide-en',
    title: 'Czech Employment Notice Period 2026: When It Starts and Ends',
    excerpt:
      'Since the flex amendment, Czech notice usually starts on delivery. See the two-month rule, one-month exceptions and older contract clauses.',
    intro:
      'A common Czech employment myth says notice always starts on the first day of the next month. That is no longer the statutory default for notices delivered from 1 June 2025. In 2026 the exact delivery date usually starts the clock, but a written employment-contract clause may change the result and MPSV notes that expert opinion is not fully uniform.',
    keywords: [
      'Czech employment notice period 2026',
      'resignation Czech Republic notice',
      'Czech flex amendment notice period',
      'ending employment Czechia',
    ],
    readTime: '9 min',
    builderHref: withLocale('/pracovni', 'en'),
    seoLandingHref: getExpatSeoHref('en', 'employment'),
    sections: [
      {
        id: 'start',
        title: 'The statutory clock starts on delivery',
        paragraphs: [
          'For notice delivered from 1 June 2025, § 51 of the Labour Code generally starts the notice period on the day the other party receives it. It ends on the day with the same number in the final month; if that date does not exist, it ends on that month’s last day.',
          'Example: a standard two-month notice delivered on 15 August generally ends on 15 October. Delivery evidence therefore matters for both employer and employee.',
        ],
      },
      {
        id: 'length',
        title: 'Two months is typical; some employer grounds use one month',
        paragraphs: [
          'The ordinary minimum notice period is at least two months. The flex amendment introduced a minimum one-month period for employer notice under § 52(f), (g) and (h), covering certain failures to meet requirements, breaches of duties and related grounds.',
          'An employee may resign without stating a reason. An employer may give notice only for a statutory reason and must describe it so it cannot later be substituted by a different reason.',
        ],
      },
      {
        id: 'contract-clause',
        title: 'Check older wording in the employment contract',
        paragraphs: [
          'The Labour Code permits a written agreement on a different notice period or its course. MPSV considers an older clause stating “from the first day of the following month to the last day” capable of taking priority, but explicitly notes that experts do not fully agree.',
          'If the contract only refers generally to § 51 or the Labour Code, MPSV says the current statutory rule applies. In a disputed termination, do not rely on a calculator alone—have the contract and delivery reviewed.',
        ],
      },
      {
        id: 'form-and-risk',
        title: 'Form, delivery and situations needing individual advice',
        bullets: [
          'Notice must be in writing and effectively delivered.',
          'Do not confuse notice with a mutual termination agreement, which can set an agreed end date.',
          'Protected periods, organisational changes and allegations of misconduct require extra care.',
          'Challenges to invalid termination have short procedural deadlines; obtain legal advice promptly.',
        ],
        paragraphs: [],
      },
    ],
    primaryCta: {
      title: 'Prepare a clear Czech employment contract',
      body: 'Use English guidance to set the role, workplace, start date, pay and employment term in a Czech document.',
      buttonLabel: 'Open employment form (EN) →',
    },
    trust: {
      generatorSuitable:
        'A standard new employment relationship where the role, workplace, pay and duration need to be recorded clearly.',
      lawyerSuitable:
        'An actual dismissal, disputed delivery, protected period, organisational change, alleged misconduct or uncertainty over an older notice clause.',
    },
    relatedSlugs: [
      HUB_EN,
      'employment-contract-czech-republic-guide-en',
      'flexinovela-labor-law-czechia-2026-guide-en',
    ],
    officialSources: [
      { label: 'MPSV: Flex amendment to the Labour Code — detailed Q&A', href: FLEX_AMENDMENT_MPSV_URL },
      { label: 'e-Sbírka: Act No. 262/2006 Coll., Labour Code', href: LABOUR_CODE_URL },
    ],
  }),

  topicUa('employment', {
    slug: 'employment-notice-period-czechia-2026-guide-ua',
    title: 'Строк звільнення в Чехії 2026: початок і кінець',
    excerpt:
      'Після flexinovela строк попередження зазвичай починається в день вручення. Двомісячне правило, одномісячні винятки та старі умови договору.',
    intro:
      'Поширений міф стверджує, що в Чехії строк попередження завжди починається першого дня наступного місяця. Для повідомлень, вручених від 1 червня 2025 року, це вже не загальне правило. У 2026 році відлік зазвичай починається в точну дату вручення, однак письмова умова трудового договору може змінити результат, а MPSV прямо вказує на відсутність повної єдності серед фахівців.',
    keywords: [
      'строк звільнення Чехія 2026',
      'звільнення з роботи Чехія попередження',
      'flexinovela строк попередження',
      'припинення трудового договору Чехія',
    ],
    readTime: '9 хв',
    builderHref: withLocale('/pracovni', 'ua'),
    seoLandingHref: getExpatSeoHref('ua', 'employment'),
    sections: [
      {
        id: 'start',
        title: 'Законний відлік починається з вручення',
        paragraphs: [
          'Для повідомлення, врученого від 1 червня 2025 року, § 51 Кодексу праці зазвичай запускає строк у день, коли інша сторона його отримала. Він закінчується в день із тим самим числом останнього місяця; якщо такого числа немає — в останній день місяця.',
          'Приклад: стандартний двомісячний строк після вручення 15 серпня зазвичай завершується 15 жовтня. Тому доказ дати вручення важливий і для роботодавця, і для працівника.',
        ],
      },
      {
        id: 'length',
        title: 'Зазвичай два місяці; іноді для роботодавця один',
        paragraphs: [
          'Звичайний мінімальний строк становить щонайменше два місяці. Flexinovela запровадила мінімум в один місяць для звільнення роботодавцем за § 52 літ. f), g) і h): певна невідповідність вимогам, порушення обов’язків та пов’язані підстави.',
          'Працівник може подати заяву без пояснення причини. Роботодавець може звільнити лише із законної підстави та повинен описати її так, щоб потім не замінити іншою.',
        ],
      },
      {
        id: 'contract-clause',
        title: 'Перевірте старе формулювання трудового договору',
        paragraphs: [
          'Кодекс праці дозволяє письмово погодити іншу тривалість або перебіг строку. MPSV вважає, що старе положення «з першого дня наступного місяця до останнього дня» може мати перевагу, але прямо зазначає, що фахівці не повністю одностайні.',
          'Якщо договір лише загально посилається на § 51 або Кодекс праці, за позицією MPSV діє актуальне законне правило. У спорі не покладайтеся лише на календар — перевірте договір і вручення.',
        ],
      },
      {
        id: 'form-and-risk',
        title: 'Форма, вручення та випадки для індивідуальної допомоги',
        bullets: [
          'Повідомлення має бути письмовим і належно врученим.',
          'Не плутайте одностороннє повідомлення з угодою про припинення, де сторони узгоджують дату.',
          'Захисні періоди, організаційні зміни та звинувачення в порушеннях потребують особливої уваги.',
          'Для оскарження недійсного звільнення діють короткі процесуальні строки — швидко зверніться до адвоката.',
        ],
        paragraphs: [],
      },
    ],
    primaryCta: {
      title: 'Підготуйте зрозумілий чеський трудовий договір',
      body: 'За підказками українською визначте посаду, місце роботи, дату початку, оплату та строк у чеському документі.',
      buttonLabel: 'Відкрити трудовий договір (UA) →',
    },
    trust: {
      generatorSuitable:
        'Стандартне нове працевлаштування, де потрібно чітко зафіксувати посаду, місце роботи, оплату та тривалість.',
      lawyerSuitable:
        'Фактичне звільнення, спір про вручення, захисний період, організаційна зміна, звинувачення в порушенні або невизначеність старої умови.',
    },
    relatedSlugs: [
      HUB_UA,
      'employment-contract-czech-republic-guide-ua',
      'flexinovela-labor-law-czechia-2026-guide-ua',
    ],
    officialSources: [
      { label: 'MPSV: докладні запитання й відповіді про flexinovela', href: FLEX_AMENDMENT_MPSV_URL },
      { label: 'e-Sbírka: закон № 262/2006 Зб., Кодекс праці', href: LABOUR_CODE_URL },
    ],
  }),

  topicEn('lease', {
    slug: 'registered-address-rental-czechia-2026-guide-en',
    title: 'Registered Address in a Czech Rental 2026: Landlord Consent',
    excerpt:
      'A valid lease can support a Czech citizen’s permanent-address registration. Foreign nationals follow separate proof-of-accommodation rules.',
    intro:
      '“Trvalý pobyt” can mean two different things in everyday conversation. For Czech citizens it is an official address in the population register, not a right to the flat. For foreign nationals, proof of accommodation is a separate document requirement in many visa and residence proceedings. Mixing the two systems causes avoidable problems for tenants and landlords.',
    keywords: [
      'registered address Czech rental 2026',
      'landlord consent permanent address Czechia',
      'proof of accommodation Czech Republic',
      'rental agreement residence permit Czechia',
    ],
    readTime: '9 min',
    builderHref: withLocale('/najem', 'en'),
    seoLandingHref: getExpatSeoHref('en', 'lease'),
    sections: [
      {
        id: 'czech-citizens',
        title: 'For Czech citizens: a valid lease proves the right to use the flat',
        paragraphs: [
          'A Czech citizen can normally report a permanent-address change with a valid lease, sublease or similar contract proving the right to use the dwelling. A separate landlord consent is not required when that right is already documented.',
          'Official guidance says a clause banning permanent-address registration is ineffective. The registration is evidentiary only: it does not create ownership, extend the lease or give the tenant a new right to remain after the lease ends.',
        ],
      },
      {
        id: 'landlord',
        title: 'What the landlord can do after the lease ends',
        paragraphs: [
          'A landlord cannot prevent registration while the tenant has a valid right to use the flat. After that right ends and the former tenant no longer lives there, the landlord may ask the registration office to cancel the address.',
          'Official guidance requires both conditions: the use right has ended and the person no longer actually lives at the address. A terminated lease and handover protocol are useful evidence.',
        ],
      },
      {
        id: 'foreign-nationals',
        title: 'For foreign nationals: proof of accommodation is a different process',
        paragraphs: [
          'Many long-term visa and residence applications require proof of accommodation. The Interior Ministry’s portal lists a landlord confirmation, a lease or sublease, or proof of ownership as possible forms, with requirements depending on the filing.',
          'A valid lease signed by both parties can generally be submitted without officially verified signatures, although the authority recommends an officially certified copy because it is kept in the file. A sublease also needs documents showing the link between the owner and the sublessor.',
        ],
      },
      {
        id: 'checklist',
        title: 'Practical document checklist',
        bullets: [
          'Use the correct, current address and identify the flat clearly in the lease.',
          'If the lease is fixed-term, keep the current extension or addendum with it.',
          'For a sublease, prepare the main lease or another document proving the sublessor’s authority.',
          'Check the exact current Interior Ministry requirements for your residence application; this article is not immigration advice.',
        ],
        paragraphs: [],
      },
    ],
    primaryCta: {
      title: 'Create a clear Czech rental agreement',
      body: 'English-guided form → Czech lease PDF with the parties, flat, duration, rent and handover terms.',
      buttonLabel: 'Open rental form (EN) →',
    },
    trust: {
      generatorSuitable:
        'A standard residential lease where the owner, tenant, flat, duration and use rights are clear.',
      lawyerSuitable:
        'A residence refusal, disputed authority to sublet, an uncooperative owner, false address data or any contested occupancy right.',
    },
    relatedSlugs: [
      HUB_EN,
      'rental-agreement-czech-republic-guide-en',
      'sublease-vs-lease-czechia-guide-en',
    ],
    officialSources: [
      { label: 'gov.cz: Rental and permanent-address registration', href: PERMANENT_ADDRESS_GOV_URL },
      { label: 'gov.cz: Reporting a permanent-address change', href: ADDRESS_CHANGE_GOV_URL },
      { label: 'Interior Ministry information portal: proof of accommodation', href: FOREIGNER_ACCOMMODATION_URL },
    ],
  }),

  topicUa('lease', {
    slug: 'registered-address-rental-czechia-2026-guide-ua',
    title: 'Адреса проживання в оренді у Чехії 2026: згода власника',
    excerpt:
      'Чинний договір може підтверджувати адресу trvalý pobyt громадянина Чехії. Для іноземців у справах про перебування діють окремі правила доказу житла.',
    intro:
      'У побуті “trvalý pobyt” може означати дві різні речі. Для громадян Чехії це офіційна адреса в реєстрі населення, а не право на квартиру. Для іноземців doklad o ubytování — окрема вимога в багатьох візових і побутових провадженнях. Змішування цих систем створює зайві проблеми для орендарів і власників.',
    keywords: [
      'адреса проживання оренда Чехія 2026',
      'згода власника trvalý pobyt Чехія',
      'doklad o ubytování Чехія',
      'договір оренди дозвіл на проживання Чехія',
    ],
    readTime: '9 хв',
    builderHref: withLocale('/najem', 'ua'),
    seoLandingHref: getExpatSeoHref('ua', 'lease'),
    sections: [
      {
        id: 'czech-citizens',
        title: 'Для громадян Чехії: чинний договір підтверджує право користування',
        paragraphs: [
          'Громадянин Чехії зазвичай може заявити зміну trvalý pobyt на підставі чинного договору оренди, піднайму чи подібного документа, що підтверджує право користування житлом. Окрема згода власника не потрібна, якщо це право вже доведене.',
          'За офіційними роз’ясненнями, заборона реєстрації в договорі не має дії. Реєстрація має лише облікове значення: не створює власності, не продовжує оренду і не дає нового права залишатися після її завершення.',
        ],
      },
      {
        id: 'landlord',
        title: 'Що може зробити власник після завершення оренди',
        paragraphs: [
          'Власник не може перешкоджати реєстрації, поки орендар має чинне право користуватися квартирою. Коли право припинилося і колишній орендар там уже не живе, власник може просити ohlašovna скасувати адресу.',
          'За офіційною інформацією потрібні обидві умови: право користування припинилося і особа фактично більше не проживає за адресою. Завершений договір і протокол передачі допомагають це довести.',
        ],
      },
      {
        id: 'foreign-nationals',
        title: 'Для іноземців: доказ житла — окрема процедура',
        paragraphs: [
          'Для багатьох заяв на довгострокову візу чи дозвіл на проживання потрібен doklad o ubytování. Портал МВС називає можливими формами підтвердження власника, договір оренди чи піднайму або документ про власність; точні вимоги залежать від заяви.',
          'Чинний договір оренди, підписаний обома сторонами, зазвичай не потребує офіційно засвідчених підписів, хоча орган рекомендує засвідчену копію, бо документ залишиться у справі. До піднайму потрібен і документ про зв’язок між власником та особою, яка надає житло.',
        ],
      },
      {
        id: 'checklist',
        title: 'Практичний список документів',
        bullets: [
          'Укажіть у договорі правильну актуальну адресу та чітко визначте квартиру.',
          'Для строкової оренди зберігайте чинне продовження або додаток разом із договором.',
          'Для піднайму підготуйте основний договір оренди чи інший доказ повноваження піднаймодавця.',
          'Перевірте точні актуальні вимоги МВС для своєї заяви; ця стаття не є імміграційною консультацією.',
        ],
        paragraphs: [],
      },
    ],
    primaryCta: {
      title: 'Створіть зрозумілий чеський договір оренди',
      body: 'Форма українською → чеський PDF із сторонами, квартирою, строком, платою та умовами передачі.',
      buttonLabel: 'Відкрити форму оренди (UA) →',
    },
    trust: {
      generatorSuitable:
        'Стандартна житлова оренда, де чітко визначені власник, орендар, квартира, строк і право користування.',
      lawyerSuitable:
        'Відмова у справі про перебування, спірне право піднайму, відмова власника співпрацювати, неправдиві дані про адресу чи спір про користування.',
    },
    relatedSlugs: [
      HUB_UA,
      'rental-agreement-czech-republic-guide-ua',
      'sublease-vs-lease-czechia-guide-ua',
    ],
    officialSources: [
      { label: 'gov.cz: оренда та реєстрація trvalý pobyt', href: PERMANENT_ADDRESS_GOV_URL },
      { label: 'gov.cz: повідомлення про зміну trvalý pobyt', href: ADDRESS_CHANGE_GOV_URL },
      { label: 'Інформаційний портал МВС: doklad o ubytování', href: FOREIGNER_ACCOMMODATION_URL },
    ],
  }),
];
