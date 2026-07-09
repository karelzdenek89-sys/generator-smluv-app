import type { AppLocale, ExpatContractType } from '@/lib/locale';

export type ExpatBuilderLandingBlock = {
  benefits: { icon: string; text: string }[];
  contents: string[];
  whenSuitable: string[];
  whenOther: { label: string; href: string; text: string }[];
  faq: { q: string; a: string }[];
  guideHref: string;
};

export type ExpatBuilderPageExtras = {
  placeholders: Record<string, string>;
  defaults: Record<string, string>;
  hints: {
    managerRole: string;
    trialMaxWarning: (max: number) => string;
    contractCompliant: string;
    dppOk?: string;
  };
  sidebarMissing: Record<string, string>;
};

type LocaleTriple<T> = { cs: T; en: T; ua: T };

function pick<T>(locale: AppLocale, triple: LocaleTriple<T>): T {
  if (locale === 'en') return triple.en;
  if (locale === 'ua') return triple.ua;
  return triple.cs;
}

function paymentFaq(locale: AppLocale): { q: string; a: string } {
  return pick(locale, {
    cs: {
      q: 'Dostanu dokument ihned po zaplacení?',
      a: 'Ano, PDF je k dispozici ke stažení okamžitě po dokončení platby.',
    },
    en: {
      q: 'Will I get the document right after payment?',
      a: 'Yes — the PDF is available for download immediately after payment.',
    },
    ua: {
      q: 'Отримаю документ одразу після оплати?',
      a: 'Так — PDF доступний для завантаження одразу після оплати.',
    },
  });
}

const EMPLOYMENT_LANDING: LocaleTriple<ExpatBuilderLandingBlock> = {
  cs: {
    guideHref: '/pracovni-smlouva',
    benefits: [
      { icon: '⚖️', text: 'Sestaveno dle § 33–65 zákoníku práce (zákon č. 262/2006 Sb.)' },
      { icon: '📄', text: 'PDF ke stažení ihned po ověřené platbě' },
      { icon: '👔', text: 'Splňuje zákonné náležitosti — druh práce, místo, nástup' },
      { icon: '🔒', text: 'Pokrývá zkušební dobu, odměnu i podmínky ukončení' },
    ],
    contents: [
      'Identifikaci zaměstnavatele a zaměstnance',
      'Druh práce a pracovní náplň',
      'Místo výkonu práce',
      'Den nástupu do práce',
      'Mzdu nebo plat a způsob odměňování',
      'Délku zkušební doby',
      'Pracovní dobu a rozvržení směn',
      'Podmínky ukončení pracovního poměru',
      'Závěrečná ustanovení a GDPR',
    ],
    whenSuitable: [
      'Vznik standardního pracovního poměru (HPP nebo zkrácený úvazek)',
      'Uzavření pracovní smlouvy na dobu určitou nebo neurčitou',
      'Situace, kdy je třeba formálně zaměstnat fyzickou osobu',
      'Případy se zkušební dobou nebo specifickým místem výkonu práce',
    ],
    whenOther: [
      {
        label: 'Dohoda o provedení práce (DPP)',
        href: '/dpp',
        text: 'Pro krátkodobé nebo brigádnické úkoly do 300 hodin ročně — bez vzniku plného pracovního poměru.',
      },
      {
        label: 'Smlouva o poskytování služeb',
        href: '/sluzby',
        text: 'Pro spolupráci s OSVČ nebo firmou mimo pracovněprávní vztah.',
      },
    ],
    faq: [
      {
        q: 'Jaké jsou povinné náležitosti pracovní smlouvy?',
        a: 'Zákoník práce vyžaduje tři povinné náležitosti: druh práce, místo výkonu práce a den nástupu. Chybí-li některá z nich, smlouva není platná.',
      },
      {
        q: 'Jak dlouhá může být zkušební doba?',
        a: 'U řadových zaměstnanců maximálně 4 měsíce, u vedoucích zaměstnanců maximálně 8 měsíců (§ 35 zákoníku práce).',
      },
      {
        q: 'Lze uzavřít pracovní smlouvu na dobu určitou?',
        a: 'Ano, ale zákon ji omezuje — maximálně 3 roky a nejvýše dvě opakování u téhož zaměstnavatele.',
      },
      {
        q: 'Musí být pracovní smlouva podepsána před nástupem?',
        a: 'Zákoník práce vyžaduje uzavření pracovní smlouvy před začátkem výkonu práce.',
      },
      paymentFaq('cs'),
    ],
  },
  en: {
    guideHref: '/blog/expat/employment-contract-guide-en',
    benefits: [
      { icon: '⚖️', text: 'Built for Czech Labour Code § 33–65 (Act No. 262/2006 Coll.)' },
      { icon: '📄', text: 'PDF download right after verified payment' },
      { icon: '👔', text: 'Covers mandatory elements — job type, place, start date' },
      { icon: '🔒', text: 'Probation, pay, working time and termination clauses' },
    ],
    contents: [
      'Employer and employee identification',
      'Job title and description',
      'Place of work',
      'Start date',
      'Salary or wage and pay terms',
      'Probation period',
      'Working hours and schedule',
      'Termination-related terms',
      'Final provisions and GDPR',
    ],
    whenSuitable: [
      'Standard employment (full-time or part-time)',
      'Fixed-term or indefinite employment',
      'Hiring an individual as an employee in the Czech Republic',
      'Cases with probation or a specific place of work',
    ],
    whenOther: [
      {
        label: 'Agreement to perform work (DPP)',
        href: '/dpp?lang=en',
        text: 'For short tasks up to 300 hours/year with one employer — not full employment.',
      },
      {
        label: 'Services agreement',
        href: '/sluzby?lang=en',
        text: 'For cooperation with a self-employed contractor or company outside employment law.',
      },
    ],
    faq: [
      {
        q: 'What must a Czech employment contract include?',
        a: 'Three mandatory elements under the Labour Code: type of work, place of work, and start date. Missing any of these makes the contract invalid.',
      },
      {
        q: 'How long can probation last?',
        a: 'Up to 4 months for regular employees and up to 8 months for managerial employees (§ 35).',
      },
      {
        q: 'Can I use a fixed-term contract?',
        a: 'Yes, but Czech law limits fixed-term contracts (max. 3 years, repeated at most twice with the same employer).',
      },
      {
        q: 'Must the contract be signed before the first day?',
        a: 'The Labour Code requires a written contract before work begins.',
      },
      paymentFaq('en'),
    ],
  },
  ua: {
    guideHref: '/blog/expat/employment-contract-guide-ua',
    benefits: [
      { icon: '⚖️', text: 'За § 33–65 трудового кодексу Чехії (закон № 262/2006 Sb.)' },
      { icon: '📄', text: 'PDF одразу після підтвердженої оплати' },
      { icon: '👔', text: 'Обов’язкові елементи — вид роботи, місце, день виходу' },
      { icon: '🔒', text: 'Випробувальний строк, зарплата, робочий час' },
    ],
    contents: [
      'Дані роботодавця та працівника',
      'Посада та опис роботи',
      'Місце виконання',
      'День виходу на роботу',
      'Зарплата та порядок виплати',
      'Випробувальний строк',
      'Робочий час і графік',
      'Умови припинення',
      'Заключні положення та GDPR',
    ],
    whenSuitable: [
      'Стандартне працевлаштування (повна чи неповна зайнятість)',
      'Строковий або безстроковий договір',
      'Формальне наймання фізичної особи в ЧР',
      'Випробувальний строк або особливе місце роботи',
    ],
    whenOther: [
      {
        label: 'Договір DPP',
        href: '/dpp?lang=ua',
        text: 'Для коротких завдань до 300 год/рік — без повного трудового договору.',
      },
      {
        label: 'Договір про надання послуг',
        href: '/sluzby?lang=ua',
        text: 'Для співпраці з ФОП або фірмою поза трудовим правом.',
      },
    ],
    faq: [
      {
        q: 'Що обов’язково в трудовому договорі в Чехії?',
        a: 'Три обов’язкові елементи: вид роботи, місце виконання та день виходу на роботу.',
      },
      {
        q: 'Яка максимальна тривалість випробувального строку?',
        a: 'До 4 міс. для рядових працівників і до 8 міс. для керівників (§ 35).',
      },
      {
        q: 'Чи можна строковий договір?',
        a: 'Так, але закон обмежує строкові договори (макс. 3 роки, не більше двох повторень).',
      },
      {
        q: 'Чи потрібен підпис до першого робочого дня?',
        a: 'Трудовий кодекс вимагає письмовий договір до початку роботи.',
      },
      paymentFaq('ua'),
    ],
  },
};

const EMPLOYMENT_EXTRAS: LocaleTriple<ExpatBuilderPageExtras> = {
  cs: {
    placeholders: {
      employerName: 'ABC s.r.o.',
      employerIco: '12345678',
      employerAddress: 'Náměstí 1, Praha 1',
      employerEmail: 'hr@firma.cz',
      employeeName: 'Jana Nováková',
      employeeBirth: '15.03.1995',
      employeeAddress: 'Ulice 5, Brno',
      employeeEmail: 'jana@email.cz',
      jobTitle: 'Programátor / Účetní / Skladník',
      workPlace: 'Praha 1, sídlo firmy',
      jobDescription: 'Vývoj a správa webových aplikací, účast na code review…',
      workSchedule: 'Po–Pá, 8:00–17:00',
      salary: '45000',
      hourlyRate: '250',
      bonusDesc: 'Roční bonus dle hodnocení, max. 2 měsíční platy',
    },
    defaults: {
      workSchedule: 'pondělí–pátek, 8:00–17:00',
      trialPeriodMonths: '3',
      noticePeriod: '2',
      workHours: '40',
      breakMinutes: '30',
      vacationWeeks: '4',
      payDay: '15',
      nonCompetePeriod: '12',
      breachPenalty: '50000',
    },
    hints: {
      managerRole:
        'Vedoucí pracovní místo dle § 11 ZP. Zkušební doba může být až 8 měsíců (§ 35 ZP). Smlouva bude upravena pro vedoucího zaměstnance.',
      trialMaxWarning: (max) => `Zákonné maximum je ${max} měsíce (§ 35 ZP).`,
      contractCompliant: '✓ Smlouva splňuje povinné náležitosti ZP.',
    },
    sidebarMissing: {
      employerName: 'Název zaměstnavatele',
      employeeName: 'Jméno zaměstnance',
      jobTitle: 'Pracovní pozice',
    },
  },
  en: {
    placeholders: {
      employerName: 'ABC s.r.o.',
      employerIco: '12345678',
      employerAddress: 'Wenceslas Square 1, Prague 1',
      employerEmail: 'hr@company.cz',
      employeeName: 'Jane Novak',
      employeeBirth: '15/03/1995',
      employeeAddress: 'Street 5, Brno',
      employeeEmail: 'jane@email.com',
      jobTitle: 'Developer / Accountant / Warehouse clerk',
      workPlace: 'Prague 1, company HQ',
      jobDescription: 'Web application development, code review, client communication…',
      workSchedule: 'Mon–Fri, 8:00–17:00',
      salary: '45000',
      hourlyRate: '250',
      bonusDesc: 'Annual bonus per performance review',
    },
    defaults: {
      workSchedule: 'Monday–Friday, 8:00–17:00',
      trialPeriodMonths: '3',
      noticePeriod: '2',
      workHours: '40',
      breakMinutes: '30',
      vacationWeeks: '4',
      payDay: '15',
      nonCompetePeriod: '12',
      breachPenalty: '50000',
    },
    hints: {
      managerRole:
        'Managerial position under § 11 Labour Code. Probation may be up to 8 months (§ 35). Contract text is adjusted for managers.',
      trialMaxWarning: (max) => `Legal maximum is ${max} months (§ 35).`,
      contractCompliant: '✓ Mandatory Labour Code elements are covered.',
    },
    sidebarMissing: {
      employerName: 'Employer name',
      employeeName: 'Employee name',
      jobTitle: 'Job title',
    },
  },
  ua: {
    placeholders: {
      employerName: 'ABC s.r.o.',
      employerIco: '12345678',
      employerAddress: 'Вацлавська пл. 1, Прага 1',
      employerEmail: 'hr@firma.cz',
      employeeName: 'Олена Новакова',
      employeeBirth: '15.03.1995',
      employeeAddress: 'вул. Прикладна 5, Брно',
      employeeEmail: 'olena@email.cz',
      jobTitle: 'Розробник / Бухгалтер / Комірник',
      workPlace: 'Прага 1, офіс компанії',
      jobDescription: 'Розробка веб-додатків, code review, комунікація з клієнтами…',
      workSchedule: 'Пн–Пт, 8:00–17:00',
      salary: '45000',
      hourlyRate: '250',
      bonusDesc: 'Річний бонус за результатами оцінки',
    },
    defaults: {
      workSchedule: 'понеділок–п’ятниця, 8:00–17:00',
      trialPeriodMonths: '3',
      noticePeriod: '2',
      workHours: '40',
      breakMinutes: '30',
      vacationWeeks: '4',
      payDay: '15',
      nonCompetePeriod: '12',
      breachPenalty: '50000',
    },
    hints: {
      managerRole:
        'Керівна посада за § 11 трудового кодексу. Випробувальний строк до 8 міс. (§ 35). Текст договору адаптовано для керівника.',
      trialMaxWarning: (max) => `Законний максимум — ${max} міс. (§ 35).`,
      contractCompliant: '✓ Обов’язкові елементи трудового кодексу враховано.',
    },
    sidebarMissing: {
      employerName: 'Назва роботодавця',
      employeeName: 'ПІБ працівника',
      jobTitle: 'Посада',
    },
  },
};

const DPP_LANDING: LocaleTriple<ExpatBuilderLandingBlock> = {
  cs: {
    guideHref: '/dohoda-o-provedeni-prace',
    benefits: [
      { icon: '⚖️', text: 'Sestaveno dle § 75–76 zákoníku práce (zákon č. 262/2006 Sb.)' },
      { icon: '📄', text: 'Okamžité PDF ke stažení po zaplacení' },
      { icon: '👷', text: 'Vhodné pro brigády, výpomoci a jednorázové úkoly' },
      { icon: '🔒', text: 'Jasně vymezený rozsah práce, odměna a termín splnění' },
    ],
    contents: [
      'Identifikaci zaměstnavatele a zaměstnance (brigádníka)',
      'Přesné vymezení pracovního úkolu',
      'Odměnu za provedení práce',
      'Časový rozsah a termín dokončení',
      'Místo výkonu práce',
      'Podmínky platby odměny',
      'Závěrečná ustanovení a GDPR',
    ],
    whenSuitable: [
      'Brigáda, sezónní výpomoc nebo jednorázový úkol',
      'Rozsah do 300 hodin ročně u jednoho zaměstnavatele',
      'Situace, kdy není vhodný plný pracovní poměr',
    ],
    whenOther: [
      {
        label: 'Pracovní smlouva',
        href: '/pracovni',
        text: 'Pokud jde o pravidelný pracovní poměr s pevnou pracovní dobou.',
      },
      {
        label: 'Smlouva o poskytování služeb',
        href: '/sluzby',
        text: 'Pokud spolupracujete s OSVČ nebo firmou mimo pracovněprávní vztah.',
      },
    ],
    faq: [
      {
        q: 'Jaký je rozdíl mezi DPP a pracovní smlouvou?',
        a: 'DPP je pro příležitostné úkoly (max. 300 hodin ročně u jednoho zaměstnavatele). Pracovní smlouva zakládá trvalý pracovní poměr.',
      },
      {
        q: 'Jaký je limit hodin u DPP?',
        a: 'Maximálně 300 hodin ročně u jednoho zaměstnavatele.',
      },
      {
        q: 'Musí být DPP písemná?',
        a: 'Ano, § 77 zákoníku práce vyžaduje písemnou formu.',
      },
      paymentFaq('cs'),
    ],
  },
  en: {
    guideHref: '/blog/expat/dpp-guide-en',
    benefits: [
      { icon: '⚖️', text: 'Czech Labour Code § 75–76 (Act No. 262/2006 Coll.)' },
      { icon: '📄', text: 'PDF download immediately after payment' },
      { icon: '👷', text: 'For gigs, seasonal help and one-off tasks' },
      { icon: '🔒', text: 'Clear scope, pay and completion deadline' },
    ],
    contents: [
      'Employer and worker identification',
      'Precise task description',
      'Remuneration for the work',
      'Duration and deadline',
      'Place of work',
      'Payment terms',
      'Final provisions and GDPR',
    ],
    whenSuitable: [
      'Side jobs, seasonal help or one-off tasks',
      'Up to 300 hours per year with one employer',
      'When full employment is not appropriate',
    ],
    whenOther: [
      {
        label: 'Employment contract',
        href: '/pracovni?lang=en',
        text: 'For regular employment with a fixed working schedule.',
      },
      {
        label: 'Services agreement',
        href: '/sluzby?lang=en',
        text: 'For cooperation with a contractor outside employment law.',
      },
    ],
    faq: [
      {
        q: 'DPP vs employment contract?',
        a: 'DPP is for occasional work (max. 300 hours/year per employer). Employment creates a full employment relationship.',
      },
      {
        q: 'Hour limit for DPP?',
        a: 'Maximum 300 hours per calendar year with one employer.',
      },
      {
        q: 'Must DPP be in writing?',
        a: 'Yes — § 77 Labour Code requires a written agreement.',
      },
      paymentFaq('en'),
    ],
  },
  ua: {
    guideHref: '/blog/expat/dpp-guide-ua',
    benefits: [
      { icon: '⚖️', text: '§ 75–76 трудового кодексу Чехії' },
      { icon: '📄', text: 'PDF одразу після оплати' },
      { icon: '👷', text: 'Для підробітків і разових завдань' },
      { icon: '🔒', text: 'Чіткий обсяг роботи, оплата та термін' },
    ],
    contents: [
      'Дані роботодавця та працівника',
      'Точний опис завдання',
      'Винагорода',
      'Строк і дедлайн',
      'Місце роботи',
      'Умови виплати',
      'Заключні положення та GDPR',
    ],
    whenSuitable: [
      'Підробіток або разове завдання',
      'До 300 годин на рік у одного роботодавця',
      'Коли повний трудовий договір не потрібен',
    ],
    whenOther: [
      { label: 'Трудовий договір', href: '/pracovni?lang=ua', text: 'Для регулярної роботи з фіксованим графіком.' },
      { label: 'Договір послуг', href: '/sluzby?lang=ua', text: 'Для співпраці з ФОП поза трудовим правом.' },
    ],
    faq: [
      {
        q: 'Чим DPP відрізняється від трудового договору?',
        a: 'DPP — для епізодичної роботи (макс. 300 год/рік). Трудовий договір — повне працевлаштування.',
      },
      { q: 'Ліміт годин?', a: 'Максимум 300 годин на календарний рік у одного роботодавця.' },
      { q: 'Чи потрібна письмова форма?', a: 'Так — § 77 вимагає письмового договору.' },
      paymentFaq('ua'),
    ],
  },
};

const DPP_EXTRAS: LocaleTriple<ExpatBuilderPageExtras> = {
  cs: {
    placeholders: {
      employerName: 'ABC s.r.o.',
      employerIco: '12345678',
      employerAddress: 'Náměstí 1, Praha 1',
      employerEmail: 'info@firma.cz',
      employeeName: 'Tomáš Pokorný',
      employeeBirth: '15.06.2002',
      employeeAddress: 'Ulice 5, Brno',
      employeeEmail: 'tomas@email.cz',
      taskDescription: 'Obsluha letní akce, roznos letáků…',
      taskDetails: 'Překlady z angličtiny, přibl. 10 000 slov…',
      workPlace: 'Praha nebo vzdáleně',
      estimatedHours: '20',
      totalRemuneration: '5000',
      hourlyRate: '180',
      paymentAccount: '123456789/0800',
    },
    defaults: { paymentDays: '15' },
    hints: {
      managerRole: '',
      trialMaxWarning: () => '',
      contractCompliant: '✓ DPP je v pořádku.',
      dppOk: '✓ DPP je v pořádku.',
    },
    sidebarMissing: {
      employerName: 'Název zaměstnavatele',
      employeeName: 'Jméno zaměstnance',
      taskDescription: 'Popis pracovního úkolu',
    },
  },
  en: {
    placeholders: {
      employerName: 'ABC s.r.o.',
      employerIco: '12345678',
      employerAddress: 'Square 1, Prague',
      employerEmail: 'info@company.cz',
      employeeName: 'Thomas Smith',
      employeeBirth: '15/06/2002',
      employeeAddress: 'Street 5, Brno',
      employeeEmail: 'thomas@email.com',
      taskDescription: 'Event staffing, flyer distribution…',
      taskDetails: 'Translation EN→CZ, approx. 10,000 words…',
      workPlace: 'Prague or remote',
      estimatedHours: '20',
      totalRemuneration: '5000',
      hourlyRate: '180',
      paymentAccount: '123456789/0800',
    },
    defaults: { paymentDays: '15' },
    hints: {
      managerRole: '',
      trialMaxWarning: () => '',
      contractCompliant: '✓ DPP looks complete.',
      dppOk: '✓ DPP looks complete.',
    },
    sidebarMissing: {
      employerName: 'Employer name',
      employeeName: 'Worker name',
      taskDescription: 'Task description',
    },
  },
  ua: {
    placeholders: {
      employerName: 'ABC s.r.o.',
      employerIco: '12345678',
      employerAddress: 'Прага 1',
      employerEmail: 'info@firma.cz',
      employeeName: 'Томаш Покорний',
      employeeBirth: '15.06.2002',
      employeeAddress: 'Брно',
      employeeEmail: 'tomas@email.cz',
      taskDescription: 'Обслуговування заходу, роздача листівок…',
      taskDetails: 'Переклад EN→CZ, близько 10 000 слів…',
      workPlace: 'Прага або віддалено',
      estimatedHours: '20',
      totalRemuneration: '5000',
      hourlyRate: '180',
      paymentAccount: '123456789/0800',
    },
    defaults: { paymentDays: '15' },
    hints: {
      managerRole: '',
      trialMaxWarning: () => '',
      contractCompliant: '✓ DPP виглядає повним.',
      dppOk: '✓ DPP виглядає повним.',
    },
    sidebarMissing: {
      employerName: 'Роботодавець',
      employeeName: 'Працівник',
      taskDescription: 'Опис завдання',
    },
  },
};

const SUBLEASE_LANDING: LocaleTriple<ExpatBuilderLandingBlock> = {
  cs: {
    guideHref: '/podnajemni-smlouva',
    benefits: [
      { icon: '⚖️', text: 'Sestaveno dle § 2274–2278 OZ (podnájem bytu)' },
      { icon: '📄', text: 'PDF ke stažení ihned po ověřené platbě' },
      { icon: '🏠', text: 'Vhodné pro podnájem celého bytu i jeho části' },
      { icon: '🔒', text: 'Jasně vymezená práva a povinnosti podnájemce' },
    ],
    contents: [
      'Identifikaci nájemce (jako pronajímatele) a podnájemce',
      'Popis předmětu podnájmu',
      'Výši podnájemného a způsob platby',
      'Dobu podnájmu a podmínky ukončení',
      'Práva a povinnosti podnájemce',
      'Podmínky užívání společných prostor',
      'Závěrečná ustanovení a GDPR',
    ],
    whenSuitable: [
      'Jste nájemcem bytu a chcete část nebo celý byt přenechat podnájemci',
      'Spolubydlení — pronájem pokoje',
      'Dočasné přenechání bytu',
      'Máte souhlas pronajímatele s podnájmem',
    ],
    whenOther: [
      {
        label: 'Nájemní smlouva',
        href: '/najem',
        text: 'Pokud jste vlastník nemovitosti a uzavíráte nájem přímo s nájemcem.',
      },
    ],
    faq: [
      {
        q: 'Potřebuji souhlas pronajímatele k podnájmu?',
        a: 'Obecně ano — § 2274 OZ vyžaduje souhlas pronajímatele, pokud v bytě nájemce sám nebydlí.',
      },
      {
        q: 'Jaký je rozdíl mezi podnájmem a nájmem?',
        a: 'Podnájem vzniká, když nájemce přenechá byt třetí osobě. Podnájemce nemá přímý vztah k vlastníkovi.',
      },
      {
        q: 'Co se stane, když skončí nájemní smlouva?',
        a: 'Ukončením nájemní smlouvy zaniká i podnájemní smlouva.',
      },
      paymentFaq('cs'),
    ],
  },
  en: {
    guideHref: '/blog/expat/sublease-guide-en',
    benefits: [
      { icon: '⚖️', text: 'Civil Code § 2274–2278 (sublease of flat)' },
      { icon: '📄', text: 'PDF after verified payment' },
      { icon: '🏠', text: 'Whole flat or a room' },
      { icon: '🔒', text: 'Clear rights and duties of the subtenant' },
    ],
    contents: [
      'Sublessor and subtenant identification',
      'Description of the subleased premises',
      'Sublease rent and payment',
      'Term and termination',
      'Subtenant rights and duties',
      'Common areas',
      'Final provisions and GDPR',
    ],
    whenSuitable: [
      'You rent a flat and sublet part or all of it',
      'Room rental while you live there',
      'Temporary sublet while away',
      'You have the landlord’s consent where required',
    ],
    whenOther: [
      {
        label: 'Lease agreement',
        href: '/najem?lang=en',
        text: 'If you own the property and lease directly to a tenant.',
      },
    ],
    faq: [
      {
        q: 'Do I need the landlord’s consent?',
        a: 'Generally yes under § 2274 unless you live in the flat and take in a roommate (with notice to the landlord).',
      },
      {
        q: 'Sublease vs lease?',
        a: 'Sublease is when the tenant sublets to a third party; the subtenant has no direct relationship with the owner.',
      },
      {
        q: 'What if the main lease ends?',
        a: 'The sublease ends when the main lease ends.',
      },
      paymentFaq('en'),
    ],
  },
  ua: {
    guideHref: '/blog/expat/sublease-guide-ua',
    benefits: [
      { icon: '⚖️', text: '§ 2274–2278 цивільного кодексу (піднайм)' },
      { icon: '📄', text: 'PDF після оплати' },
      { icon: '🏠', text: 'Квартира або кімната' },
      { icon: '🔒', text: 'Права та обов’язки піднаймача' },
    ],
    contents: [
      'Дані піднаймодавця та піднаймача',
      'Опис приміщення',
      'Плата за піднайм',
      'Строк і розірвання',
      'Права та обов’язки',
      'Спільні приміщення',
      'Заключні положення та GDPR',
    ],
    whenSuitable: [
      'Ви орендуєте квартиру і здаєте частину або всю',
      'Кімната співмешканцю',
      'Тимчасовий піднайм',
      'Є згода орендодавця за потреби',
    ],
    whenOther: [
      { label: 'Договір оренди', href: '/najem?lang=ua', text: 'Якщо ви власник і здаєте безпосередньо орендарю.' },
    ],
    faq: [
      { q: 'Чи потрібна згода орендодавця?', a: 'Зазвичай так за § 2274, якщо ви самі не проживаєте в квартирі.' },
      { q: 'Піднайм чи оренда?', a: 'Піднайм — коли орендар здає третій особі.' },
      { q: 'Що якщо основна оренда закінчиться?', a: 'Піднайм припиняється разом з основною орендою.' },
      paymentFaq('ua'),
    ],
  },
};

const POA_LANDING: LocaleTriple<ExpatBuilderLandingBlock> = {
  cs: {
    guideHref: '/plna-moc-online',
    benefits: [
      { icon: '⚖️', text: 'Sestaveno dle § 441–456 OZ — zastoupení na základě plné moci' },
      { icon: '📄', text: 'Okamžité PDF ke stažení po zaplacení' },
      { icon: '🔒', text: 'Obecná i speciální plná moc (nemovitost, soud, banka)' },
      { icon: '📅', text: 'Jasně vymezená platnost a omezení zmocnění' },
    ],
    contents: [
      'Identifikaci zmocnitele a zmocněnce',
      'Rozsah zmocnění',
      'Dobu platnosti',
      'Podmínky substituce',
      'Platnost pro jednorázové nebo opakované jednání',
      'Závěrečná ustanovení a GDPR',
    ],
    whenSuitable: [
      'Zastupování při prodeji nebo koupi nemovitosti',
      'Zastupování v soudním nebo správním řízení',
      'Správa bankovního účtu v nepřítomnosti',
      'Jednání jménem firmy',
    ],
    whenOther: [
      {
        label: 'Smlouva o spolupráci',
        href: '/spoluprace',
        text: 'Pokud potřebujete dlouhodobý rámec spolupráce, nikoli jednorázové zmocnění.',
      },
    ],
    faq: [
      {
        q: 'Kdy je nutné ověřit podpis?',
        a: 'Úřední ověření je vyžadováno tam, kde to zákon nebo příjemce stanoví — typicky u nemovitostí a bank.',
      },
      {
        q: 'Jak dlouho platí plná moc?',
        a: 'Po dobu uvedenou v dokumentu, nebo do odvolání zmocnitelem.',
      },
      {
        q: 'Může zmocněnec přenést zmocnění?',
        a: 'Pouze pokud to plná moc výslovně umožňuje (substituce).',
      },
      {
        q: 'Je generální plná moc riskantní?',
        a: 'Doporučujeme vždy přesně vymezit rozsah zmocnění.',
      },
      paymentFaq('cs'),
    ],
  },
  en: {
    guideHref: '/blog/expat/power-of-attorney-guide-en',
    benefits: [
      { icon: '⚖️', text: 'Civil Code § 441–456 — representation by power of attorney' },
      { icon: '📄', text: 'PDF immediately after payment' },
      { icon: '🔒', text: 'General and special POA (property, court, bank)' },
      { icon: '📅', text: 'Clear validity period and limits' },
    ],
    contents: [
      'Principal and agent identification',
      'Scope of authority',
      'Validity period',
      'Substitution rules',
      'One-off or repeated acts',
      'Final provisions and GDPR',
    ],
    whenSuitable: [
      'Property sale or purchase representation',
      'Court or administrative proceedings',
      'Bank account management while abroad',
      'Acting on behalf of a company',
    ],
    whenOther: [
      {
        label: 'Cooperation agreement',
        href: '/spoluprace?lang=en',
        text: 'For an ongoing cooperation framework, not a one-off mandate.',
      },
    ],
    faq: [
      {
        q: 'When is signature verification required?',
        a: 'Where law or the recipient requires it — typically real estate and bank matters.',
      },
      {
        q: 'How long is a POA valid?',
        a: 'For the period stated in the document or until revoked by the principal.',
      },
      {
        q: 'Can the agent delegate?',
        a: 'Only if the POA expressly allows substitution.',
      },
      {
        q: 'Is a general POA risky?',
        a: 'We recommend defining the scope of authority precisely.',
      },
      paymentFaq('en'),
    ],
  },
  ua: {
    guideHref: '/blog/expat/power-of-attorney-guide-ua',
    benefits: [
      { icon: '⚖️', text: '§ 441–456 цивільного кодексу' },
      { icon: '📄', text: 'PDF одразу після оплати' },
      { icon: '🔒', text: 'Загальна та спеціальна довіреність' },
      { icon: '📅', text: 'Строк дії та обмеження' },
    ],
    contents: [
      'Дані довірителя та повіреного',
      'Обсяг повноважень',
      'Строк дії',
      'Субституція',
      'Разові чи повторні дії',
      'Заключні положення та GDPR',
    ],
    whenSuitable: [
      'Угоди з нерухомістю',
      'Судові або адміністративні справи',
      'Банківський рахунок',
      'Дії від імені компанії',
    ],
    whenOther: [
      { label: 'Договір співпраці', href: '/spoluprace?lang=ua', text: 'Для тривалої співпраці, а не разового доручення.' },
    ],
    faq: [
      { q: 'Коли потрібне засвідчення підпису?', a: 'Де це вимагає закон або отримувач — зазвичай нерухомість і банк.' },
      { q: 'Скільки діє довіреність?', a: 'До зазначеного строку або відкликання.' },
      { q: 'Чи можна передоручити?', a: 'Лише якщо це прямо дозволено.' },
      { q: 'Чи небезпечна загальна довіреність?', a: 'Рекомендуємо чітко обмежити повноваження.' },
      paymentFaq('ua'),
    ],
  },
};

const CAR_LANDING: LocaleTriple<ExpatBuilderLandingBlock> = {
  cs: {
    guideHref: '/blog/kupni-smlouva-auto-kupujici-2026',
    benefits: [
      { icon: '⚖️', text: 'Sestaveno dle § 2079 a násl. OZ (kupní smlouva)' },
      { icon: '📄', text: 'PDF ke stažení ihned po platbě' },
      { icon: '🚗', text: 'Prodej mezi soukromými osobami' },
      { icon: '🔒', text: 'Identifikace vozidla, cena a předání' },
    ],
    contents: [
      'Identifikaci prodávajícího a kupujícího',
      'Popis vozidla (VIN, SPZ, stav)',
      'Kupní cenu a způsob platby',
      'Termín předání a převodu',
      'Prohlášení o stavu vozidla',
      'Závěrečná ustanovení',
    ],
    whenSuitable: [
      'Prodej ojetého vozidla mezi fyzickými osobami',
      'Převod vozidla bez autobazaru',
      'Potřeba písemné smlouvy pro úřady a pojišťovnu',
    ],
    whenOther: [
      {
        label: 'Smlouva o dílo',
        href: '/smlouva-o-dilo',
        text: 'Pokud jde o opravu vozidla, nikoli jeho prodej.',
      },
    ],
    faq: [
      {
        q: 'Co musí obsahovat kupní smlouva na auto?',
        a: 'Identifikaci stran, vozidla (VIN), cenu a podmínky předání. Pro registraci je potřeba technický průkaz a další doklady dle MV.',
      },
      {
        q: 'Je smlouva platná bez ověření podpisů?',
        a: 'Ano pro soukromý prodej — ověření není obecně povinné, pokud to nevyžaduje konkrétní úřad.',
      },
      paymentFaq('cs'),
    ],
  },
  en: {
    guideHref: '/blog/expat/car-sale-guide-en',
    benefits: [
      { icon: '⚖️', text: 'Civil Code § 2079+ (purchase agreement)' },
      { icon: '📄', text: 'PDF after payment' },
      { icon: '🚗', text: 'Private party sale' },
      { icon: '🔒', text: 'Vehicle ID, price and handover' },
    ],
    contents: [
      'Seller and buyer identification',
      'Vehicle description (VIN, plate, condition)',
      'Price and payment method',
      'Handover date',
      'Statements on vehicle condition',
      'Final provisions',
    ],
    whenSuitable: [
      'Used car sale between individuals',
      'Transfer without a dealer',
      'Written contract for authorities and insurance',
    ],
    whenOther: [
      { label: 'Work contract', href: '/smlouva-o-dilo?lang=en', text: 'For vehicle repair, not sale.' },
    ],
    faq: [
      {
        q: 'What must a car sale contract include?',
        a: 'Parties, vehicle (VIN), price and handover terms. Registration requires technical documents per Czech rules.',
      },
      {
        q: 'Are verified signatures required?',
        a: 'Not generally for private sales unless a specific authority requires it.',
      },
      paymentFaq('en'),
    ],
  },
  ua: {
    guideHref: '/blog/expat/car-sale-guide-ua',
    benefits: [
      { icon: '⚖️', text: '§ 2079+ цивільного кодексу' },
      { icon: '📄', text: 'PDF після оплати' },
      { icon: '🚗', text: 'Продаж між фізособами' },
      { icon: '🔒', text: 'VIN, ціна, передача' },
    ],
    contents: [
      'Продавець і покупець',
      'Опис авто (VIN, номер)',
      'Ціна та оплата',
      'Дата передачі',
      'Заяви про стан',
      'Заключні положення',
    ],
    whenSuitable: [
      'Продаж вживаного авто між фізособами',
      'Без автосалону',
      'Письмовий договір для органів',
    ],
    whenOther: [{ label: 'Договір підряду', href: '/smlouva-o-dilo?lang=ua', text: 'Для ремонту, не продажу.' }],
    faq: [
      { q: 'Що має бути в договорі?', a: 'Сторони, VIN, ціна та передача.' },
      { q: 'Чи потрібне засвідчення підписів?', a: 'Зазвичай ні для приватного продажу.' },
      paymentFaq('ua'),
    ],
  },
};

const LANDING: Record<
  Exclude<ExpatContractType, 'lease'>,
  LocaleTriple<ExpatBuilderLandingBlock>
> = {
  employment: EMPLOYMENT_LANDING,
  dpp: DPP_LANDING,
  sublease: SUBLEASE_LANDING,
  power_of_attorney: POA_LANDING,
  car_sale: CAR_LANDING,
};

const EXTRAS: Partial<
  Record<Exclude<ExpatContractType, 'lease'>, LocaleTriple<ExpatBuilderPageExtras>>
> = {
  employment: EMPLOYMENT_EXTRAS,
  dpp: DPP_EXTRAS,
};

const EMPTY_EXTRAS: ExpatBuilderPageExtras = {
  placeholders: {},
  defaults: {},
  hints: {
    managerRole: '',
    trialMaxWarning: () => '',
    contractCompliant: '✓',
  },
  sidebarMissing: {},
};

export function getExpatBuilderLanding(
  contract: Exclude<ExpatContractType, 'lease'>,
  locale: AppLocale,
): ExpatBuilderLandingBlock {
  return pick(locale, LANDING[contract]);
}

export function getExpatBuilderPageExtras(
  contract: Exclude<ExpatContractType, 'lease'>,
  locale: AppLocale,
): ExpatBuilderPageExtras {
  const triple = EXTRAS[contract];
  if (!triple) return EMPTY_EXTRAS;
  return pick(locale, triple);
}
