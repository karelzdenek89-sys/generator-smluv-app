import type { AppLocale, ExpatContractType } from '@/lib/locale';
import { LEGAL_NOTICE } from '@/lib/locale';
import { getEmploymentWorkEligibilityNotice } from '@/lib/i18n/safety-copy';
import {
  getExpatBuilderLanding,
  getExpatBuilderPageExtras,
  type ExpatBuilderLandingBlock,
  type ExpatBuilderPageExtras,
} from '@/lib/i18n/expat-builder-landing';
import { REMOTE_WORK_KEYS } from '@/lib/i18n/employment-remote-work';
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
  landing: ExpatBuilderLandingBlock & {
    badge: string;
    h1Main: string;
    h1Accent: string;
    subtitle: string;
    ctaLabel: string;
    guideLabel: string;
  };
  page: ExpatBuilderPageExtras;
  remoteWorkValues: { full: string; hybrid: string; none: string };
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

type ExpatBuilderFormUiCore = Omit<ExpatBuilderFormUi, 'landing' | 'page' | 'remoteWorkValues'> & {
  landing: Pick<
    ExpatBuilderFormUi['landing'],
    'badge' | 'h1Main' | 'h1Accent' | 'subtitle' | 'ctaLabel' | 'guideLabel'
  >;
};

function withLandingAndPage(
  contract: Exclude<ExpatContractType, 'lease'>,
  locale: AppLocale,
  ui: ExpatBuilderFormUiCore,
): ExpatBuilderFormUi {
  const block = getExpatBuilderLanding(contract, locale);
  const page = getExpatBuilderPageExtras(contract, locale);
  return {
    ...ui,
    landing: { ...ui.landing, ...block },
    page,
    remoteWorkValues: {
      full: REMOTE_WORK_KEYS.full,
      hybrid: REMOTE_WORK_KEYS.hybrid,
      none: REMOTE_WORK_KEYS.none,
    },
  };
}

const SHARED_EN: Omit<
  ExpatBuilderFormUi,
  'locale' | 'isLocalized' | 'landing' | 'sections' | 'fields' | 'options' | 'notices' | 'page' | 'remoteWorkValues'
> & {
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
    return withLandingAndPage('employment', locale, {
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
        packageFollowup: {
          title: 'Супровідні кадрові документи',
          subtitle: 'Ці дані використовуються в інформаційному листі за § 37 Трудового кодексу, протоколі обладнання та, за потреби, угоді про дистанційну роботу.',
        },
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
        socialSecurityAuthority: 'Орган соціального забезпечення *',
        payMethod: 'Спосіб і місце виплати *',
        professionalDevelopment: 'Професійний розвиток, який забезпечує роботодавець *',
        overtimeRules: 'Правила понаднормової роботи *',
        collectiveAgreement: 'Колективний договір *',
        workEquipment: 'Робоче обладнання, що передається *',
        equipmentCondition: 'Стан обладнання під час передачі',
        remoteWorkPlace: 'Місце дистанційної роботи *',
        remoteWorkSchedule: 'Обсяг і правила дистанційної роботи *',
        remoteWorkCostMode: 'Відшкодування витрат на дистанційну роботу *',
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
        remoteCostFlat: 'Законодавчо встановлена фіксована ставка за кожну розпочату годину',
        remoteCostActual: 'Підтверджені фактичні витрати',
        remoteCostNone: 'Попередня домовленість про відсутність відшкодування витрат',
      },
      risk: { good: 'Добре налаштовано', average: 'Середній захист', needsWork: 'Рекомендовані доповнення' },
    });
  }
  if (locale === 'en') {
    return withLandingAndPage('employment', locale, {
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
        packageFollowup: {
          title: 'Related HR documents',
          subtitle: 'These details are used in the Section 37 information sheet, the equipment record and, where relevant, the remote-work agreement.',
        },
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
        socialSecurityAuthority: 'Social security authority *',
        payMethod: 'Pay method and place *',
        professionalDevelopment: 'Professional development provided by the employer *',
        overtimeRules: 'Overtime rules *',
        collectiveAgreement: 'Collective agreement *',
        workEquipment: 'Work equipment handed over *',
        equipmentCondition: 'Equipment condition at handover',
        remoteWorkPlace: 'Remote-work location *',
        remoteWorkSchedule: 'Remote-work scope and rules *',
        remoteWorkCostMode: 'Remote-work cost reimbursement *',
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
        remoteCostFlat: 'Statutory flat rate for each commenced hour',
        remoteCostActual: 'Documented actual costs',
        remoteCostNone: 'Prior agreement that no cost reimbursement is due',
      },
      risk: { good: 'Good setup', average: 'Average protection', needsWork: 'Recommended fixes' },
    });
  }
  return withLandingAndPage('employment', 'cs', {
    locale: 'cs',
    isLocalized: false,
    header: { brand: 'SmlouvaHned', docType: 'Pracovní smlouva — § 34 zákoníku práce', close: 'Zavřít' },
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
      packageFollowup: {
        title: 'Navazující personální podklady',
        subtitle: 'Tyto údaje se použijí v informačním listu podle § 37 ZP, protokolu k vybavení a případné dohodě o práci na dálku.',
      },
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
      socialSecurityAuthority: 'Orgán sociálního zabezpečení *',
      payMethod: 'Způsob a místo výplaty *',
      professionalDevelopment: 'Odborný rozvoj zajišťovaný zaměstnavatelem *',
      overtimeRules: 'Pravidla práce přesčas *',
      collectiveAgreement: 'Kolektivní smlouva *',
      workEquipment: 'Předávané pracovní vybavení *',
      equipmentCondition: 'Stav vybavení při předání',
      remoteWorkPlace: 'Místo práce na dálku *',
      remoteWorkSchedule: 'Rozsah a pravidla home office *',
      remoteWorkCostMode: 'Náhrada nákladů při práci na dálku *',
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
      remoteCostFlat: 'Zákonný paušál za započatou hodinu podle aktuální vyhlášky MPSV',
      remoteCostActual: 'Prokázané skutečné náklady',
      remoteCostNone: 'Předem sjednat, že náhrada nákladů nepřísluší',
    },
    risk: { good: 'Dobré nastavení', average: 'Průměrná ochrana', needsWork: 'Doporučená doplnění' },
  });
}

function dppUi(locale: AppLocale): ExpatBuilderFormUi {
  const base = locale === 'ua' ? { ...SHARED_UA } : locale === 'en' ? { ...SHARED_EN } : null;
  const cs: ExpatBuilderFormUiCore = {
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
      employerName: 'Název / jméno *',
      employerIco: 'IČO *',
      employerAddress: 'Sídlo / adresa *',
      employerEmail: 'E-mail',
      employeeName: 'Jméno a příjmení *',
      employeeBirth: 'Datum narození *',
      employeeAddress: 'Trvalé bydliště *',
      employeeEmail: 'E-mail',
      taskDescription: 'Druh práce / název úkolu *',
      taskDetails: 'Podrobný popis (nepovinné)',
      workPlace: 'Místo výkonu práce',
      estimatedHours: 'Předpokládaný rozsah (hod.) *',
      toolsProvided: 'Pracovní prostředky',
      durationType: 'Typ trvání',
      startDate: 'Začátek',
      endDate: 'Konec',
      deadline: 'Termín splnění úkolu',
      remunerationType: 'Typ odměny',
      totalRemuneration: 'Celková odměna (Kč) *',
      hourlyRate: 'Hodinová sazba (Kč/hod.) *',
      paymentAccount: 'Číslo účtu (výplata)',
      paymentDays: 'Výplata do (dní po splnění)',
    },
    options: {
      durationFixed: 'Na dobu určitou',
      durationIndefinite: 'Na dobu neurčitou',
      payFixed: 'Paušální (za celý úkol)',
      payHourly: 'Hodinová sazba',
      toolsEmployer: 'Poskytne zaměstnavatel',
      toolsEmployee: 'Zajistí pracovník',
      toolsShared: 'Dohodou stran',
    },
    risk: { good: 'Bez rizik', average: 'Drobná rizika', needsWork: 'Doporučená doplnění' },
  };
  if (!base) return withLandingAndPage('dpp', 'cs', cs);
  return withLandingAndPage('dpp', locale, {
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
            employee: { title: 'Worker (assignee)' },
            task: { title: 'Work task', subtitle: 'Describe precisely to avoid disputes.' },
            term: { title: 'Duration and deadline' },
            pay: { title: 'Remuneration', subtitle: '2026: insurance applies from CZK 12,000 gross/month with one employer.' },
          }
        : {
            employer: { title: 'Роботодавець' },
            employee: { title: 'Працівник' },
            task: { title: 'Завдання', subtitle: 'Опишіть якомога точніше.' },
            term: { title: 'Строк виконання' },
            pay: { title: 'Винагорода', subtitle: '2026: страхування від 12 000 Kč брутто/міс.' },
          },
    fields:
      locale === 'en'
        ? {
            employerName: 'Employer name *',
            employerIco: 'Company ID (IČO) *',
            employerAddress: 'Address *',
            employerEmail: 'E-mail',
            employeeName: 'Worker full name *',
            employeeBirth: 'Date of birth *',
            employeeAddress: 'Address *',
            employeeEmail: 'E-mail',
            taskDescription: 'Task / job title *',
            taskDetails: 'Details (optional)',
            workPlace: 'Place of work',
            estimatedHours: 'Estimated hours *',
            toolsProvided: 'Work tools',
            durationType: 'Duration type',
            startDate: 'Start',
            endDate: 'End',
            deadline: 'Completion deadline',
            remunerationType: 'Pay type',
            totalRemuneration: 'Lump sum (CZK) *',
            hourlyRate: 'Hourly rate (CZK/h) *',
            paymentAccount: 'Bank account',
            paymentDays: 'Pay within (days after completion)',
          }
        : {
            employerName: 'Роботодавець *',
            employerIco: 'IČO *',
            employerAddress: 'Адреса *',
            employerEmail: 'E-mail',
            employeeName: 'ПІБ працівника *',
            employeeBirth: 'Дата народження *',
            employeeAddress: 'Адреса *',
            employeeEmail: 'E-mail',
            taskDescription: 'Опис завдання *',
            taskDetails: 'Деталі (необов’язково)',
            workPlace: 'Місце роботи',
            estimatedHours: 'Години *',
            toolsProvided: 'Робочі засоби',
            durationType: 'Тип строку',
            startDate: 'Початок',
            endDate: 'Кінець',
            deadline: 'Крайній термін',
            remunerationType: 'Тип оплати',
            totalRemuneration: 'Сума (Kč) *',
            hourlyRate: 'Ставка (Kč/год) *',
            paymentAccount: 'Рахунок',
            paymentDays: 'Виплата протягом (днів)',
          },
    options:
      locale === 'en'
        ? {
            durationFixed: 'Fixed term',
            durationIndefinite: 'Indefinite',
            payFixed: 'Lump sum (whole task)',
            payHourly: 'Hourly rate',
            toolsEmployer: 'Provided by the employer',
            toolsEmployee: 'Provided by the worker',
            toolsShared: 'By mutual agreement',
          }
        : {
            durationFixed: 'На визначений строк',
            durationIndefinite: 'На невизначений строк',
            payFixed: 'Паушальна (за все завдання)',
            payHourly: 'Погодинна',
            toolsEmployer: 'Надає роботодавець',
            toolsEmployee: 'Забезпечує працівник',
            toolsShared: 'За домовленістю сторін',
          },
    risk: base.risk,
  });
}

function genericUi(
  contract: Exclude<ExpatContractType, 'lease' | 'employment' | 'dpp'>,
  locale: AppLocale,
  cs: ExpatBuilderFormUiCore,
  enLanding: ExpatBuilderFormUiCore['landing'],
  uaLanding: ExpatBuilderFormUiCore['landing'],
  labels?: { en: ExpatLabelPack; ua: ExpatLabelPack },
): ExpatBuilderFormUi {
  if (locale === 'cs') return withLandingAndPage(contract, 'cs', cs as ExpatBuilderFormUiCore);
  const base = locale === 'en' ? SHARED_EN : SHARED_UA;
  const pack = locale === 'en' ? labels?.en : labels?.ua;
  return withLandingAndPage(contract, locale, {
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
  });
}

const subleaseUi = (locale: AppLocale) =>
  genericUi(
    'sublease',
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
    'car_sale',
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
    'power_of_attorney',
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
