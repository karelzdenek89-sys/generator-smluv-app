import type { ExpatBlogArticle, ExpatBlogSection } from '@/lib/i18n/expat-blog-articles';

const HUB_EN = 'foreigners-czech-contracts-guide-en';
const HUB_UA = 'foreigners-czech-contracts-guide-ua';
const SLUG_EN = 'why-smlouvahned-not-template-2026-guide-en';
const SLUG_UA = 'why-smlouvahned-not-template-2026-guide-ua';
const DATE_EN = '1 July 2026';
const DATE_TIME = '2026-07-01';
const DATE_UA = '1 липня 2026';

const SECTIONS_EN: ExpatBlogSection[] = [
  {
    id: 'why-people-search',
    title: 'Why people still download contract templates',
    paragraphs: [
      'Most searches start with “Czech rental agreement template” or “employment contract sample”. A static Word or PDF file looks fast — until you realise it does not know your parties, amounts, dates or the clauses you actually agreed on.',
      'Templates from forums and document libraries are written for nobody in particular. You copy-paste names and hope you did not miss deposit rules, notice periods or mandatory labour-law wording.',
    ],
  },
  {
    id: 'template-limits',
    title: 'What a downloaded template cannot do',
    paragraphs: [
      'A blank template does not assemble a document from your answers. It does not warn you when you pick an unusual penalty, skip landlord consent for sublease, or set a DPP schedule that conflicts with statutory caps.',
      'It also rarely cites the Civil Code (OZ) or Labour Code (ZP) next to the clause — so you sign text without seeing which legal section it refers to.',
    ],
    bullets: [
      'Manual editing — easy to leave placeholders or inconsistent dates',
      'No preview of the final PDF before you commit',
      'Usually one document type, no structured handover or annex where needed',
      'No English or Ukrainian guidance while the contract stays in Czech',
    ],
  },
  {
    id: 'generic-generators',
    title: '“One-click” generators — typical blind spots',
    paragraphs: [
      'Many online tools output generic Czech text without linking clauses to § OZ or § ZP. Some hide important provisions behind upsells. Others never show you a full preview until you finish checkout.',
      'For foreigners in Czechia the gap is wider: the form is Czech-only, the PDF is Czech-only, and nobody explains what you are signing before you print it.',
    ],
  },
  {
    id: 'smlouvahned-approach',
    title: 'How SmlouvaHned works differently',
    paragraphs: [
      'SmlouvaHned is document automation software — not a law firm. It is built for typical situations where both sides already agreed on the basics and want them captured in writing.',
      'You complete a structured form first. Important choices trigger in-form notices (informational, not legal advice). You review a preview, then download a Czech PDF assembled from your inputs.',
    ],
    bullets: [
      '§ references next to key clauses in the PDF (Civil Code / Labour Code context)',
      'Form hints for choices that are often disputed — high penalties, missing consent, unusual terms',
      'Extended document tiers include clauses people often forget (deposit, handover, warranties)',
      'English or Ukrainian form guidance where offered; primary contract wording remains Czech',
      'Fourteen contract types in one tool — rental, employment, DPP, car sale, NDA, and more',
    ],
  },
  {
    id: 'comparison',
    title: 'Practical comparison',
    paragraphs: ['Neither a template nor a generic generator replaces an attorney for disputes or non-standard deals. For everyday private contracts the difference is workflow and transparency:'],
    bullets: [
      'Template from the web → you edit; SmlouvaHned → PDF built from your form',
      'Generic generator → often no § citations; SmlouvaHned → § shown at clauses',
      'Both alternatives → rarely warn during input; SmlouvaHned → notices at risky choices',
      'Template → unknown final text until you finish editing; SmlouvaHned → preview before download',
    ],
  },
  {
    id: 'when-lawyer',
    title: 'When to use an attorney instead',
    paragraphs: [
      'Choose a registered Czech advokát for commercial leases, collective bargaining, immigration filings that need certified documents, insolvency, criminal liability, or any active dispute.',
      'SmlouvaHned explicitly does not provide legal services under Act No. 85/1996 Coll., on the legal profession.',
    ],
  },
];

const SECTIONS_UA: ExpatBlogSection[] = [
  {
    id: 'why-people-search',
    title: 'Чому люди досі шукають «шаблон договору»',
    paragraphs: [
      'Більшість запитів починається з «зразок договору оренди Чехія» або «трудовий договір зразок». Статичний Word чи PDF здається швидким рішенням — доки не стає зрозуміло, що файл не знає ваших сторін, сум, термінів і домовленостей.',
      'Шаблони з форумів написані «для всіх і ні для кого». Ви вручну дописуєте імена та сподіваєтесь, що не пропустили kauci, строки повідомлення чи обов’язкові формулювання трудового права.',
    ],
  },
  {
    id: 'template-limits',
    title: 'Чого не вміє завантажений шаблон',
    paragraphs: [
      'Порожній шаблон не збирає документ із ваших відповідей. Не попереджає про незвичну штрафну санкцію, відсутність згоди орендодавця на піднайм чи графік DPP, що суперечить закону.',
      'Рідко вказує § OZ або § ZP біля пункту — ви підписуєте текст без контексту норми.',
    ],
    bullets: [
      'Ручне редагування — легко залишити «XXX» або суперечливі дати',
      'Немає попереднього перегляду PDF до завершення',
      'Зазвичай один тип документа, без протоколу передачі чи додатків',
      'Форма лише чеською — без пояснень українською до підпису',
    ],
  },
  {
    id: 'generic-generators',
    title: 'Генератори «в один клік» — типові прогалини',
    paragraphs: [
      'Багато сервісів видають загальний чеський текст без посилань на § OZ чи § ZP. Важливі пункти інколи продаються окремо. Повний перегляд часто недоступний до кінця процесу.',
      'Для іноземців у Чехії це критично: форма чеською, PDF чеською, а зміст пояснюють лише після друку.',
    ],
  },
  {
    id: 'smlouvahned-approach',
    title: 'Чим SmlouvaHned відрізняється',
    paragraphs: [
      'SmlouvaHned — програмний інструмент автоматизації документів, не адвокатська фірма. Він для типових ситуацій, коли сторони домовились і хочуть зафіксувати умови письмово.',
      'Спочатку структурована форма. На ризикових виборах — інформаційні підказки (не юридична консультація). Потім перегляд і PDF чеською з ваших даних.',
    ],
    bullets: [
      '§ біля ключових пунктів у PDF (контекст OZ / ZP)',
      'Підказки у формі для спірних виборів — високі штрафи, згода орендодавця тощо',
      'Розширені варіанти з пунктами, про які часто забувають (kauce, передача, гарантії)',
      'Форма українською де доступно; основний текст договору — чеською',
      '14 типів договорів в одному інструменті',
    ],
  },
  {
    id: 'comparison',
    title: 'Практичне порівняння',
    paragraphs: [
      'Ні шаблон, ні загальний генератор не замінюють адвоката при спорах чи нестандартних угодах. Для звичайних приватних договорів різниця — у процесі та прозорості:',
    ],
    bullets: [
      'Шаблон з інтернету → ви редагуєте; SmlouvaHned → PDF із форми',
      'Загальний генератор → часто без §; SmlouvaHned → § біля пунктів',
      'Обидва → рідко попереджають під час введення; SmlouvaHned → notices',
      'Шаблон → невідомий фінальний текст; SmlouvaHned → перегляд перед завантаженням',
    ],
  },
  {
    id: 'when-lawyer',
    title: 'Коли потрібен advokát',
    paragraphs: [
      'Зверніться до зареєстрованого чеського advokát при комерційній оренді, колективних угодах, імміграції з офіційним перекладом, банкрутстві, кримінальній відповідальності або активному спорі.',
      'SmlouvaHned не надає юридичних послуг у розумінні закону ЧР № 85/1996 Зб. про адвокатуру.',
    ],
  },
];

export const EXPAT_BLOG_WHY_SMOLOUVAHNED: ExpatBlogArticle[] = [
  {
    slug: SLUG_EN,
    audience: 'en',
    contractKey: 'hub',
    category: 'For foreigners (EN)',
    readTime: '9 min',
    dateLabel: DATE_EN,
    dateTime: DATE_TIME,
    title: 'Why Choose SmlouvaHned Over a Downloaded Czech Contract Template (2026)',
    excerpt:
      'Compare static templates, generic one-click generators and SmlouvaHned — § citations in PDF, in-form notices, preview before download, and English-guided forms with Czech output.',
    intro:
      'If you live or work in Czechia, you still sign Czech contracts in most cases. Before you print a random template, here is how structured document automation differs — and where an attorney still belongs.',
    keywords: [
      'SmlouvaHned vs template',
      'Czech contract generator foreigners',
      'rental agreement Czech Republic not template',
      'employment contract Czechia online',
      'Czech PDF contract English form',
      'why not download contract template Czechia',
    ],
    builderHref: '/en',
    expatHubHref: '/en',
    toc: SECTIONS_EN.map((s, i) => ({ href: `#${s.id}`, label: `${i + 1}. ${s.title}` })),
    sections: SECTIONS_EN,
    primaryCta: {
      title: 'See supported contracts in English',
      body: 'Open the English overview, pick your document type, and walk through the form with preview before you download the Czech PDF.',
      buttonLabel: 'Open /en contract overview →',
    },
    finalCta: {
      title: 'Start with housing or work',
      body: 'Most expats begin with a rental agreement or employment contract. Guides explain Czech practice; forms can be filled in English where supported.',
      buttonLabel: 'Czech contracts for foreigners →',
      href: '/en',
    },
    trustBox: {
      generatorSuitable:
        'Standard rental, employment, DPP, sublease, power of attorney or private car sale when terms are already agreed.',
      lawyerSuitable:
        'Commercial leases, immigration filings needing certified documents, disputes, insolvency or non-standard employment schemes.',
    },
    disclaimer: {
      heading: 'Informational content — not legal services',
      body:
        'This article compares typical workflows. SmlouvaHned does not provide legal services within the meaning of Czech Act No. 85/1996 Coll., on the legal profession.',
      lawyerNote: 'For individual assessment consult a registered Czech attorney (advokát).',
    },
    ui: {
      breadcrumbBlog: 'Blog',
      readTime: 'read',
      tocTitle: 'Contents',
      relatedHub: 'All guides for foreigners',
      backToExpats: 'Expat contract overview',
      contractLinksTitle: 'Create a document',
    },
    relatedSlugs: [HUB_EN, 'rental-agreement-czech-republic-guide-en', 'minimum-wage-dpp-czechia-2026-guide-en'],
  },
  {
    slug: SLUG_UA,
    audience: 'ua',
    contractKey: 'hub',
    category: 'Для іноземців (UA)',
    readTime: '9 хв',
    dateLabel: DATE_UA,
    dateTime: DATE_TIME,
    title: 'Чому обрати SmlouvaHned замість завантаженого шаблону договору (2026)',
    excerpt:
      'Порівняння статичних шаблонів, загальних генераторів і SmlouvaHned — § у PDF, підказки у формі, перегляд перед завантаженням, форма українською та PDF чеською.',
    intro:
      'У Чехії ви зазвичай підписуєте договори чеською. Перед тим як друкувати випадковий зразок, розберімо, чим відрізняється структурована автоматизація документів — і коли потрібен advokát.',
    keywords: [
      'SmlouvaHned vs шаблон',
      'генератор договорів Чехія іноземці',
      'договір оренди Чехія не шаблон',
      'трудовий договір Чехія онлайн',
      'чеський PDF договір українська форма',
      'чому не завантажувати шаблон договору',
    ],
    builderHref: '/ua',
    expatHubHref: '/ua',
    toc: SECTIONS_UA.map((s, i) => ({ href: `#${s.id}`, label: `${i + 1}. ${s.title}` })),
    sections: SECTIONS_UA,
    primaryCta: {
      title: 'Переглянути договори українською',
      body: 'Відкрийте огляд /ua, оберіть тип документа, пройдіть форму з переглядом перед завантаженням PDF чеською.',
      buttonLabel: 'Відкрити огляд /ua →',
    },
    finalCta: {
      title: 'Почніть з житла або роботи',
      body: 'Більшість іноземців оформлюють оренду або трудовий договір. Гіди пояснюють чеську практику; форму можна заповнити українською.',
      buttonLabel: 'Договори для іноземців →',
      href: '/ua',
    },
    trustBox: {
      generatorSuitable:
        'Типова оренда, праця, DPP, піднайм, довіреність або продаж авто між фізособами за домовленими умовами.',
      lawyerSuitable:
        'Комерційна оренда, імміграція з офіційним перекладом, спори, банкрутство або нестандартне працевлаштування.',
    },
    disclaimer: {
      heading: 'Інформаційний матеріал — не юридичні послуги',
      body:
        'Стаття порівнює типові робочі процеси. SmlouvaHned не надає юридичних послуг у розумінні закону ЧР № 85/1996 Зб. про адвокатуру.',
      lawyerNote: 'Для індивідуальної оцінки зверніться до зареєстрованого чеського advokát.',
    },
    ui: {
      breadcrumbBlog: 'Блог',
      readTime: 'читання',
      tocTitle: 'Зміст',
      relatedHub: 'Усі гіди для іноземців',
      backToExpats: 'Огляд договорів для іноземців',
      contractLinksTitle: 'Створити документ',
    },
    relatedSlugs: [HUB_UA, 'rental-agreement-czech-republic-guide-ua', 'minimum-wage-dpp-czechia-2026-guide-ua'],
  },
];
