import type { AppLocale, ExpatContractType } from '@/lib/locale';
import { LEGAL_NOTICE } from '@/lib/locale';
import { getEmploymentWorkEligibilityNotice } from '@/lib/i18n/safety-copy';
import type { ExpatLabelPack } from '@/lib/i18n/expat-form-field-labels';
import {
  CAR_LABELS_EN,
  CAR_LABELS_UA,
  POA_LABELS_EN,
  POA_LABELS_UA,
  SUBLEASE_LABELS_EN,
  SUBLEASE_LABELS_UA,
} from '@/lib/i18n/expat-form-field-labels';

export type ExpatBuilderFormUi = {
  locale: AppLocale;
  isLocalized: boolean;
  header: { brand: string; docType: string; close: string };
  notices: { legal: string; workEligibility?: string; leaseUse?: string };
  landing: {
    badge: string;
    h1Main: string;
    h1Accent: string;
    subtitle: string;
    ctaLabel: string;
    guideLabel: string;
  };
  form: {
    title: string;
    requiredHint: string;
    generate: string;
    previewHint: string;
    analysisTitle: string;
    scoreOf: string;
    fillToContinue: string;
    documentLabel: string;
    paymentError: string;
    validationPrefix: string;
  };
  sections: Record<string, { title: string; subtitle?: string }>;
  fields: Record<string, string>;
  options: Record<string, string>;
  risk: { good: string; average: string; needsWork: string };
};

const SHARED_EN: Omit<ExpatBuilderFormUi, 'locale' | 'isLocalized' | 'landing' | 'sections' | 'fields' | 'options' | 'notices'> & {
  notices: ExpatBuilderFormUi['notices'];
} = {
  header: { brand: 'SmlouvaHned', docType: 'Contract builder', close: 'Close' },
  notices: { legal: LEGAL_NOTICE.en, workEligibility: getEmploymentWorkEligibilityNotice('en') },
  form: {
    title: 'Fill in the document details',
    requiredHint: 'Required fields are marked *',
    generate: 'Generate contract →',
    previewHint: 'A preview will open before payment',
    analysisTitle: 'Contract check',
    scoreOf: 'out of 100',
    fillToContinue: 'Complete to continue:',
    documentLabel: 'Contract',
    paymentError: 'Payment gateway error.',
    validationPrefix: 'This contract requires:',
  },
  risk: { good: 'Good setup', average: 'Average protection', needsWork: 'Recommended fixes' },
};

const SHARED_UA: typeof SHARED_EN = {
  header: { brand: 'SmlouvaHned', docType: 'Конструктор договорів', close: 'Закрити' },
  notices: { legal: LEGAL_NOTICE.ua, workEligibility: getEmploymentWorkEligibilityNotice('ua') },
  form: {
    title: 'Заповніть дані документа',
    requiredHint: 'Обов’язкові поля позначені *',
    generate: 'Згенерувати договір →',
    previewHint: 'Перед оплатою відкриється попередній перегляд',
    analysisTitle: 'Перевірка договору',
    scoreOf: 'з 100',
    fillToContinue: 'Для продовження заповніть:',
    documentLabel: 'Договір',
    paymentError: 'Помилка платіжного шлюзу.',
    validationPrefix: 'Договір вимагає:',
  },
  risk: { good: 'Добре налаштовано', average: 'Середній захист', needsWork: 'Рекомендовані доповнення' },
};

function employmentUi(locale: AppLocale): ExpatBuilderFormUi {
  const isLocalized = locale !== 'cs';
  if (locale === 'ua') {
    return {
      locale,
      isLocalized,
      ...SHARED_UA,
      landing: {
        badge: '§ 33 та наст. трудовий кодекс ЧР',
        h1Main: 'Трудовий договір',
        h1Accent: 'онлайн',
        subtitle:
          'Чеський трудовий договір з формою українською. У PDF — основний чеський текст і пояснювальний український додаток.',
        ctaLabel: 'Створити трудовий договір',
        guideLabel: 'Гід з трудового договору',
      },
      sections: {
        employer: { title: 'Роботодавець', subtitle: 'IČO та адреса' },
        employee: { title: 'Працівник' },
        job: { title: 'Вид і місце роботи', subtitle: 'Обов’язкові елементи § 34' },
        term: { title: 'Строк трудових відносин' },
        hours: { title: 'Робочий час і відпустка' },
        pay: { title: 'Зарплата' },
        extra: { title: 'Додаткові умови' },
      },
      fields: {
        employerName: 'Назва / ПІБ *',
        employerIco: 'IČO *',
        employerAddress: 'Адреса *',
        employerEmail: 'E-mail HR',
        employeeName: 'ПІБ працівника *',
        employeeBirth: 'Дата народження *',
        employeeAddress: 'Адреса *',
        employeeEmail: 'E-mail працівника',
        jobTitle: 'Посада (вид роботи) *',
        workPlace: 'Місце виконання *',
        jobDescription: 'Опис роботи',
        remoteWork: 'Віддалена робота',
        employmentType: 'Тип строку',
        startDate: 'Дата виходу *',
        endDate: 'Дата закінчення *',
        trialMonths: 'Випробувальний строк (міс., 0 = ні)',
        noticePeriod: 'Строк попередження (міс.)',
        isManager: 'Керівна посада',
        workHours: 'Тижневий час (год.)',
        workSchedule: 'Графік',
        breakMinutes: 'Перерва (хв)',
        vacationWeeks: 'Відпустка (тиж./рік)',
        salaryType: 'Тип зарплати',
        salary: 'Брутто на місяць (Kč)',
        hourlyRate: 'Погодинна (Kč/год)',
        payDay: 'День виплати',
        bonusDesc: 'Бонуси',
        nonCompete: 'Конкурентна угода',
        nonCompetePeriod: 'Тривалість (міс.)',
      },
      options: {
        indefinite: 'На невизначений строк',
        fixed: 'На визначений строк',
        monthly: 'Місячна',
        hourly: 'Погодинна',
        remoteEmpty: '— не вказано —',
        remoteFull: 'Повний remote',
        remoteHybrid: 'Гібрид',
        remoteNo: 'Не дозволено',
      },
    };
  }
  if (locale === 'en') {
    return {
      locale,
      isLocalized,
      ...SHARED_EN,
      landing: {
        badge: 'Czech Labour Code § 33 et seq.',
        h1Main: 'Employment contract',
        h1Accent: 'online',
        subtitle:
          'Czech employment contract with an English-guided form. PDF: primary Czech wording plus an explanatory English annex.',
        ctaLabel: 'Create employment contract',
        guideLabel: 'Employment contract guide',
      },
      sections: {
        employer: { title: 'Employer', subtitle: 'Company ID and address required' },
        employee: { title: 'Employee' },
        job: { title: 'Job and workplace', subtitle: 'Mandatory under Section 34 LC' },
        term: { title: 'Employment term' },
        hours: { title: 'Working time and holiday' },
        pay: { title: 'Pay' },
        extra: { title: 'Additional clauses' },
      },
      fields: {
        employerName: 'Company / name *',
        employerIco: 'Company ID *',
        employerAddress: 'Address *',
        employerEmail: 'HR e-mail',
        employeeName: 'Employee full name *',
        employeeBirth: 'Date of birth *',
        employeeAddress: 'Address *',
        employeeEmail: 'Employee e-mail',
        jobTitle: 'Job title (type of work) *',
        workPlace: 'Place of work *',
        jobDescription: 'Job description',
        remoteWork: 'Remote work',
        employmentType: 'Term type',
        startDate: 'Start date *',
        endDate: 'End date *',
        trialMonths: 'Probation (months, 0 = none)',
        noticePeriod: 'Notice period (months)',
        isManager: 'Management position',
        workHours: 'Weekly hours',
        workSchedule: 'Schedule',
        breakMinutes: 'Break (minutes)',
        vacationWeeks: 'Holiday (weeks/year)',
        salaryType: 'Pay type',
        salary: 'Gross monthly (CZK)',
        hourlyRate: 'Hourly rate (CZK)',
        payDay: 'Pay day',
        bonusDesc: 'Bonuses',
        nonCompete: 'Non-compete clause',
        nonCompetePeriod: 'Duration (months)',
      },
      options: {
        indefinite: 'Indefinite',
        fixed: 'Fixed term',
        monthly: 'Monthly',
        hourly: 'Hourly',
        remoteEmpty: '— not set —',
        remoteFull: 'Full remote',
        remoteHybrid: 'Hybrid',
        remoteNo: 'Not allowed',
      },
    };
  }
  return {
    locale: 'cs',
    isLocalized: false,
    header: { brand: 'SmlouvaHned Builder', docType: 'Pracovní smlouva — § 34 zákoníku práce', close: 'Zavřít' },
    notices: { legal: LEGAL_NOTICE.cs },
    landing: {
      badge: '§ 33 a násl. zákoníku práce',
      h1Main: 'Pracovní smlouva',
      h1Accent: 'online',
      subtitle:
        'Vytvořte pracovní smlouvu pro vznik pracovního poměru. Dokument splňuje zákonem stanovené náležitosti.',
      ctaLabel: 'Vytvořit pracovní smlouvu',
      guideLabel: 'Průvodce pracovní smlouvou',
    },
    form: {
      title: 'Vyplňte údaje dokumentu',
      requiredHint: 'Všechna povinná pole jsou označena *',
      generate: 'Vygenerovat smlouvu →',
      previewHint: 'Zobrazí se náhled dokumentu připraveného k odemčení',
      analysisTitle: 'Analýza smlouvy',
      scoreOf: 'ze 100 bodů',
      fillToContinue: 'Vyplňte pro pokračování:',
      documentLabel: 'Pracovní smlouva',
      paymentError: 'Chyba platební brány.',
      validationPrefix: 'Pracovní smlouva podle § 34 ZP vyžaduje:',
    },
    sections: {
      employer: { title: 'Zaměstnavatel', subtitle: 'IČO, sídlo a kontakt' },
      employee: { title: 'Zaměstnanec' },
      job: { title: 'Druh a místo práce', subtitle: 'Povinné náležitosti dle § 34 ZP' },
      term: { title: 'Trvání pracovního poměru' },
      hours: { title: 'Pracovní doba a dovolená' },
      pay: { title: 'Mzda a odměňování' },
      extra: { title: 'Doplňující ustanovení', subtitle: 'Konkurenční doložka' },
    },
    fields: {
      employerName: 'Název firmy / jméno *',
      employerIco: 'IČO *',
      employerAddress: 'Sídlo / adresa *',
      employerEmail: 'E-mail HR',
      employeeName: 'Jméno a příjmení *',
      employeeBirth: 'Datum narození *',
      employeeAddress: 'Trvalé bydliště *',
      employeeEmail: 'E-mail zaměstnance',
      jobTitle: 'Pracovní pozice (druh práce) *',
      workPlace: 'Místo výkonu práce *',
      jobDescription: 'Pracovní náplň',
      remoteWork: 'Možnost home office',
      employmentType: 'Druh poměru',
      startDate: 'Datum nástupu *',
      endDate: 'Datum konce *',
      trialMonths: 'Zkušební doba (měsíce, 0 = bez)',
      noticePeriod: 'Výpovědní doba (měsíce)',
      isManager: 'Vedoucí zaměstnanec',
      workHours: 'Týdenní pracovní doba (hod.)',
      workSchedule: 'Rozvrh pracovní doby',
      breakMinutes: 'Přestávka (minut)',
      vacationWeeks: 'Dovolená (týdny/rok)',
      salaryType: 'Typ mzdy',
      salary: 'Hrubá měsíční mzda (Kč)',
      hourlyRate: 'Hodinová mzda (Kč/hod.)',
      payDay: 'Výplatní termín',
      bonusDesc: 'Bonusy / prémie',
      nonCompete: 'Konkurenční doložka',
      nonCompetePeriod: 'Délka zákazu (měsíce)',
    },
    options: {
      indefinite: 'Na dobu neurčitou',
      fixed: 'Na dobu určitou',
      monthly: 'Měsíční',
      hourly: 'Hodinová',
      remoteEmpty: '— nevyplněno —',
      remoteFull: 'Plný remote (100 %)',
      remoteHybrid: 'Hybridní (dle dohody)',
      remoteNo: 'Není povoleno',
    },
    risk: { good: 'Dobré nastavení', average: 'Průměrná ochrana', needsWork: 'Doporučená doplnění' },
  };
}

function dppUi(locale: AppLocale): ExpatBuilderFormUi {
  const base = locale === 'ua' ? { ...SHARED_UA } : locale === 'en' ? { ...SHARED_EN } : null;
  const cs: ExpatBuilderFormUi = {
    locale: 'cs',
    isLocalized: false,
    header: { brand: 'SmlouvaHned', docType: 'Dohoda o provedení práce (DPP)', close: 'Zavřít' },
    notices: { legal: LEGAL_NOTICE.cs },
    landing: {
      badge: '§ 75 zákoníku práce',
      h1Main: 'Dohoda o provedení práce',
      h1Accent: '(DPP)',
      subtitle: 'Krátkodobá práce do 300 hodin ročně u jednoho zaměstnavatele.',
      ctaLabel: 'Vytvořit DPP',
      guideLabel: 'Průvodce DPP',
    },
    form: {
      title: 'Vyplňte údaje dokumentu',
      requiredHint: 'Povinná pole *',
      generate: 'Vygenerovat smlouvu →',
      previewHint: 'Náhled před platbou',
      analysisTitle: 'Analýza smlouvy',
      scoreOf: 'ze 100',
      fillToContinue: 'Vyplňte:',
      documentLabel: 'Dohoda o provedení práce',
      paymentError: 'Chyba platební brány.',
      validationPrefix: 'Dohoda o provedení práce dle § 75 ZP vyžaduje:',
    },
    sections: {
      employer: { title: 'Zaměstnavatel' },
      employee: { title: 'Zaměstnanec' },
      task: { title: 'Pracovní úkol' },
      term: { title: 'Doba trvání' },
      pay: { title: 'Odměna' },
    },
    fields: {
      employerName: 'Zaměstnavatel *',
      employeeName: 'Zaměstnanec *',
      taskDescription: 'Popis úkolu *',
      workPlace: 'Místo výkonu *',
      estimatedHours: 'Počet hodin',
      totalRemuneration: 'Odměna celkem (Kč)',
      hourlyRate: 'Sazba (Kč/hod)',
    },
    options: {},
    risk: { good: 'Bez rizik', average: 'Drobná rizika', needsWork: 'Doporučená doplnění' },
  };
  if (!base) return cs;
  return {
    ...cs,
    locale,
    isLocalized: true,
    header: base.header,
    notices: base.notices,
    landing:
      locale === 'en'
        ? {
            badge: 'Czech Labour Code § 75',
            h1Main: 'Agreement to perform work',
            h1Accent: '(DPP)',
            subtitle: 'Czech DPP with English form; PDF includes explanatory English annex. Max. 300 hours/year.',
            ctaLabel: 'Create DPP agreement',
            guideLabel: 'DPP guide',
          }
        : {
            badge: '§ 75 трудовий кодекс ЧР',
            h1Main: 'Договір DPP',
            h1Accent: '',
            subtitle: 'Чеський DPP з формою українською; у PDF — пояснювальний додаток. Макс. 300 год/рік.',
            ctaLabel: 'Створити DPP',
            guideLabel: 'Гід DPP',
          },
    form: { ...cs.form, ...base.form, documentLabel: locale === 'en' ? 'DPP agreement' : 'Договір DPP' },
    sections:
      locale === 'en'
        ? {
            employer: { title: 'Employer' },
            employee: { title: 'Worker' },
            task: { title: 'Task' },
            term: { title: 'Duration' },
            pay: { title: 'Remuneration' },
          }
        : {
            employer: { title: 'Роботодавець' },
            employee: { title: 'Працівник' },
            task: { title: 'Завдання' },
            term: { title: 'Строк' },
            pay: { title: 'Винагорода' },
          },
    fields:
      locale === 'en'
        ? {
            employerName: 'Employer *',
            employeeName: 'Worker *',
            taskDescription: 'Task description *',
            workPlace: 'Place of work *',
            estimatedHours: 'Estimated hours',
            totalRemuneration: 'Lump sum (CZK)',
            hourlyRate: 'Hourly rate (CZK)',
          }
        : {
            employerName: 'Роботодавець *',
            employeeName: 'Працівник *',
            taskDescription: 'Опис завдання *',
            workPlace: 'Місце *',
            estimatedHours: 'Години',
            totalRemuneration: 'Сума (Kč)',
            hourlyRate: 'Ставка (Kč/год)',
          },
    options: {},
    risk: base.risk,
  };
}

function genericUi(
  locale: AppLocale,
  cs: ExpatBuilderFormUi,
  enLanding: ExpatBuilderFormUi['landing'],
  uaLanding: ExpatBuilderFormUi['landing'],
  labels?: { en: ExpatLabelPack; ua: ExpatLabelPack },
): ExpatBuilderFormUi {
  if (locale === 'cs') return cs;
  const base = locale === 'en' ? SHARED_EN : SHARED_UA;
  const pack = locale === 'en' ? labels?.en : labels?.ua;
  return {
    ...cs,
    locale,
    isLocalized: true,
    header: { ...cs.header, docType: (locale === 'en' ? enLanding : uaLanding).h1Main },
    notices: base.notices,
    landing: locale === 'en' ? enLanding : uaLanding,
    form: { ...cs.form, ...base.form, documentLabel: cs.form.documentLabel },
    sections: pack?.sections ?? cs.sections,
    fields: pack?.fields ?? cs.fields,
    options: pack?.options ?? cs.options,
    risk: base.risk,
  };
}

const subleaseUi = (locale: AppLocale) =>
  genericUi(
    locale,
    {
      locale: 'cs',
      isLocalized: false,
      header: { brand: 'SmlouvaHned', docType: 'Podnájemní smlouva', close: 'Zavřít' },
      notices: { legal: LEGAL_NOTICE.cs },
      landing: {
        badge: '§ 2274 OZ',
        h1Main: 'Podnájemní smlouva',
        h1Accent: 'online',
        subtitle: 'Podnájem bytu nebo části bytu s souhlasem pronajímatele.',
        ctaLabel: 'Vytvořit podnájem',
        guideLabel: 'Průvodce podnájmem',
      },
      form: {
        title: 'Vyplňte údaje dokumentu',
        requiredHint: 'Povinná pole *',
        generate: 'Vygenerovat smlouvu →',
        previewHint: 'Náhled před platbou',
        analysisTitle: 'Analýza smlouvy',
        scoreOf: 'ze 100',
        fillToContinue: 'Vyplňte:',
        documentLabel: 'Podnájemní smlouva',
        paymentError: 'Chyba platební brány.',
        validationPrefix: 'Smlouva vyžaduje:',
      },
      sections: {},
      fields: {},
      options: {},
      risk: { good: 'Dobré', average: 'Průměrné', needsWork: 'Doplnit' },
    },
    {
      badge: 'Civil Code § 2274',
      h1Main: 'Sublease agreement',
      h1Accent: 'online',
      subtitle: 'Czech sublease with English form and explanatory English PDF annex.',
      ctaLabel: 'Create sublease',
      guideLabel: 'Sublease guide',
    },
    {
      badge: '§ 2274 цивільний кодекс',
      h1Main: 'Піднайм',
      h1Accent: 'онлайн',
      subtitle: 'Чеський піднайм з формою українською та пояснювальним додатком у PDF.',
      ctaLabel: 'Створити піднайм',
      guideLabel: 'Гід з піднайму',
    },
    { en: SUBLEASE_LABELS_EN, ua: SUBLEASE_LABELS_UA },
  );

const carUi = (locale: AppLocale) =>
  genericUi(
    locale,
    {
      locale: 'cs',
      isLocalized: false,
      header: { brand: 'SmlouvaHned', docType: 'Kupní smlouva na vozidlo', close: 'Zavřít' },
      notices: { legal: LEGAL_NOTICE.cs },
      landing: {
        badge: '§ 2079 OZ',
        h1Main: 'Kupní smlouva',
        h1Accent: 'na auto',
        subtitle: 'Prodej vozidla mezi soukromými osobami.',
        ctaLabel: 'Vytvořit smlouvu',
        guideLabel: 'Průvodce koupí auta',
      },
      form: {
        title: 'Vyplňte údaje dokumentu',
        requiredHint: 'Povinná pole *',
        generate: 'Vygenerovat smlouvu →',
        previewHint: 'Náhled před platbou',
        analysisTitle: 'Analýza smlouvy',
        scoreOf: 'ze 100',
        fillToContinue: 'Vyplňte:',
        documentLabel: 'Kupní smlouva na vozidlo',
        paymentError: 'Chyba platební brány.',
        validationPrefix: 'Smlouva vyžaduje:',
      },
      sections: {},
      fields: {},
      options: {},
      risk: { good: 'Dobré', average: 'Průměrné', needsWork: 'Doplnit' },
    },
    {
      badge: 'Civil Code § 2079',
      h1Main: 'Vehicle purchase',
      h1Accent: 'agreement',
      subtitle: 'Czech car sale contract with English form and explanatory English PDF annex.',
      ctaLabel: 'Create contract',
      guideLabel: 'Car sale guide',
    },
    {
      badge: '§ 2079 OZ',
      h1Main: 'Купівля авто',
      h1Accent: '',
      subtitle: 'Чеська угода з формою українською та пояснювальним додатком у PDF.',
      ctaLabel: 'Створити договір',
      guideLabel: 'Гід',
    },
    { en: CAR_LABELS_EN, ua: CAR_LABELS_UA },
  );

const poaUi = (locale: AppLocale) =>
  genericUi(
    locale,
    {
      locale: 'cs',
      isLocalized: false,
      header: { brand: 'SmlouvaHned', docType: 'Plná moc', close: 'Zavřít' },
      notices: { legal: LEGAL_NOTICE.cs },
      landing: {
        badge: '§ 441 OZ',
        h1Main: 'Plná moc',
        h1Accent: 'online',
        subtitle: 'Zmocnění k jednání za jinou osobu.',
        ctaLabel: 'Vytvořit plnou moc',
        guideLabel: 'Průvodce plnou mocí',
      },
      form: {
        title: 'Vyplňte údaje dokumentu',
        requiredHint: 'Povinná pole *',
        generate: 'Vygenerovat smlouvu →',
        previewHint: 'Náhled před platbou',
        analysisTitle: 'Analýza dokumentu',
        scoreOf: 'ze 100',
        fillToContinue: 'Vyplňte:',
        documentLabel: 'Plná moc',
        paymentError: 'Chyba platební brány.',
        validationPrefix: 'Dokument vyžaduje:',
      },
      sections: {},
      fields: {},
      options: {},
      risk: { good: 'Dobré', average: 'Průměrné', needsWork: 'Doplnit' },
    },
    {
      badge: 'Civil Code § 441',
      h1Main: 'Power of attorney',
      h1Accent: 'online',
      subtitle: 'Czech power of attorney with English form and explanatory English PDF annex.',
      ctaLabel: 'Create power of attorney',
      guideLabel: 'POA guide',
    },
    {
      badge: '§ 441 OZ',
      h1Main: 'Довіреність',
      h1Accent: 'онлайн',
      subtitle: 'Чеська довіреність з формою українською та пояснювальним додатком у PDF.',
      ctaLabel: 'Створити довіреність',
      guideLabel: 'Гід',
    },
    { en: POA_LABELS_EN, ua: POA_LABELS_UA },
  );

const UI_GETTERS: Record<Exclude<ExpatContractType, 'lease'>, (locale: AppLocale) => ExpatBuilderFormUi> = {
  employment: employmentUi,
  dpp: dppUi,
  sublease: subleaseUi,
  power_of_attorney: poaUi,
  car_sale: carUi,
};

export function getExpatBuilderFormUi(
  contractType: Exclude<ExpatContractType, 'lease'>,
  locale: AppLocale,
): ExpatBuilderFormUi {
  return UI_GETTERS[contractType](locale);
}

export function getEmploymentFormUi(locale: AppLocale): ExpatBuilderFormUi {
  return employmentUi(locale);
}

export function getDppFormUi(locale: AppLocale): ExpatBuilderFormUi {
  return dppUi(locale);
}

export function getSubleaseFormUi(locale: AppLocale): ExpatBuilderFormUi {
  return subleaseUi(locale);
}

export function getPoaFormUi(locale: AppLocale): ExpatBuilderFormUi {
  return poaUi(locale);
}

export function getCarFormUi(locale: AppLocale): ExpatBuilderFormUi {
  return carUi(locale);
}
