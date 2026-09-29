/**
 * Employment contract (pracovní smlouva) — full EN and UA translations.
 *
 * Mirrors buildEmploymentContractSections in lib/contracts.ts section by section
 * and paragraph by paragraph, including the Employer Start package annexes.
 * scripts/translation-parity-tests.ts enforces the alignment and completeness.
 * The Czech text remains the legally binding version.
 */
import type { ContractSection, StoredContractData } from '../contracts';
import { formatRemoteWorkForContract } from '../i18n/employment-remote-work';
import { getEffectiveTrialPeriodMonths } from '../labor-law-validation';
import { amt, buildBilingualTranslations, dateIn, disputeClauseIn, todayIn, txt, type ParaPair } from './helpers';

type L = 'en' | 'ua';

function monthsIn(locale: L, count: number): string {
  if (locale === 'en') return `${count} ${Math.abs(count) === 1 ? 'month' : 'months'}`;
  const n = Math.abs(Math.trunc(count));
  const lastTwo = n % 100;
  const last = n % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return `${count} місяців`;
  if (last === 1) return `${count} місяць`;
  if (last >= 2 && last <= 4) return `${count} місяці`;
  return `${count} місяців`;
}

function shared(d: StoredContractData) {
  const isEmployerStart = d.packageKey === 'employer_start';
  const requestedNoticeMonths = Number(d.noticePeriod || 2);
  const effectiveNoticeMonths = Number.isFinite(requestedNoticeMonths) ? Math.max(2, requestedNoticeMonths) : 2;
  const leadershipRole = /vedouc|ředitel|manager|director/i.test(String(d.jobTitle ?? '')) || Boolean(d.isManager || d.isExecutive || d.isLeader);
  const effectiveTrialMonths = getEffectiveTrialPeriodMonths({ ...d, isManager: leadershipRole });
  const remoteWorkValue = String(d.remoteWork ?? '');
  const usesRemoteWork = Boolean(remoteWorkValue) && !['remote_none', 'není povoleno'].includes(remoteWorkValue);
  return { isEmployerStart, effectiveNoticeMonths, effectiveTrialMonths, remoteWorkValue, usesRemoteWork };
}

function clauses(locale: L, d: StoredContractData) {
  const s = shared(d);
  const en = locale === 'en';
  const trialPeriodClause = s.effectiveTrialMonths > 0
    ? en
      ? `A probationary period of ${monthsIn('en', s.effectiveTrialMonths)} from the date the employment arises is agreed (§ 35 of the Labour Code as amended by Act No. 120/2025 Coll.). In employment agreed for a fixed term, the probationary period may not exceed half of the agreed duration of the employment. During the probationary period, either party may terminate the employment at any time, even without stating a reason.`
      : `Погоджується випробувальний строк тривалістю ${monthsIn('ua', s.effectiveTrialMonths)} з дня виникнення трудових відносин (§ 35 ТК у редакції Закону № 120/2025 Sb.). У трудових відносинах, укладених на визначений строк, випробувальний строк не може перевищувати половини погодженої тривалості цих відносин. Протягом випробувального строку будь-яка зі сторін може будь-коли розірвати трудові відносини, навіть без зазначення причини.`
    : en ? 'No probationary period is agreed.' : 'Випробувальний строк не погоджується.';
  const durationClause = d.employmentType === 'fixed'
    ? en
      ? `for a fixed term until ${dateIn('en', d.endDate, 'not specified')} (§ 39 of the Labour Code)`
      : `на визначений строк до ${dateIn('ua', d.endDate, 'не зазначено')} (§ 39 ТК)`
    : en ? 'for an indefinite term' : 'на невизначений строк';
  const salaryDesc = d.salaryType === 'monthly'
    ? en
      ? `The Employee is entitled to a monthly wage of CZK ${amt(d.salary)} gross. The wage is payable on the regular pay date, i.e. on day ${txt(d.payDay, '15')} of the calendar month following the month for which the wage is due, by bank transfer to the Employee's bank account.`
      : `Працівнику належить місячна заробітна плата в розмірі ${amt(d.salary)} крон брутто. Заробітна плата виплачується в регулярний строк виплати, тобто ${txt(d.payDay, '15')}-го числа календарного місяця, що настає за місяцем, за який вона належить, безготівковим переказом на банківський рахунок працівника.`
    : en
      ? `The Employee is entitled to an hourly wage of CZK ${amt(d.hourlyRate)} per hour gross.`
      : `Працівнику належить погодинна заробітна плата в розмірі ${amt(d.hourlyRate)} крон за годину брутто.`;
  const workTimeClause = d.workHours
    ? en
      ? `The agreed weekly working time is ${txt(d.workHours)} hours. Schedule of working time: ${txt(d.workSchedule, 'Monday–Friday, 8:00–17:00')}.`
      : `Погоджений тижневий робочий час становить ${txt(d.workHours)} годин. Розклад робочого часу: ${txt(d.workSchedule, 'понеділок–п’ятниця, 8:00–17:00')}.`
    : en
      ? 'The weekly working time is set at 40 hours (§ 79 of the Labour Code). Schedule of working time: Monday–Friday, 8:00–17:00.'
      : 'Тижневий робочий час встановлено тривалістю 40 годин (§ 79 ТК). Розклад робочого часу: понеділок–п’ятниця, 8:00–17:00.';
  const remoteCostClause = (() => {
    switch (d.remoteWorkCostMode) {
      case 'actual':
        return en
          ? 'The Employer shall reimburse the Employee for the proven costs incurred in connection with remote work under § 190a(1)(a) of the Labour Code, on the next regular pay date after they have been duly documented.'
          : 'Роботодавець відшкодує працівнику підтверджені витрати, що виникли у зв’язку з дистанційною роботою, відповідно до § 190a ч. 1 п. a) ТК у найближчий регулярний строк виплати після їх належного документального підтвердження.';
      case 'flat_rate':
        return en
          ? 'For each commenced hour of remote work the Employee is entitled to a flat-rate reimbursement of costs in the amount set by the current decree of the Ministry of Labour and Social Affairs under § 190a(3) to (6) of the Labour Code, unless the Employer sets a higher amount in writing.'
          : 'За кожну розпочату годину дистанційної роботи працівнику належить паушальне відшкодування витрат у розмірі, встановленому чинним указом Міністерства праці та соціальних справ відповідно до § 190a ч. 3–6 ТК, якщо роботодавець письмово не встановив вищу суму.';
      case 'none':
        return en
          ? 'The contracting parties agree in writing in advance that the Employee is not entitled to reimbursement of costs in connection with remote work (§ 190a(2) of the Labour Code). This does not affect compensation for wear and tear of the Employee’s own equipment if separately agreed under § 190 of the Labour Code.'
          : 'Сторони договору заздалегідь письмово домовляються, що працівнику не належить відшкодування витрат у зв’язку з дистанційною роботою (§ 190a ч. 2 ТК). Це не зачіпає компенсацій за зношення власного обладнання, якщо їх окремо погоджено відповідно до § 190 ТК.';
      default:
        return en
          ? 'Reimbursement of costs for remote work is governed by § 190a of the Labour Code and by the written agreement of the contracting parties.'
          : 'Відшкодування витрат під час дистанційної роботи регулюється § 190a ТК та письмовою домовленістю сторін договору.';
    }
  })();
  return { ...s, trialPeriodClause, durationClause, salaryDesc, workTimeClause, remoteCostClause };
}

// ── EN ─────────────────────────────────────────────────────────────────────
function en(d: StoredContractData, hasPremium: boolean): ParaPair[] {
  const c = clauses('en', d);

  const premium: ParaPair[] = hasPremium ? [
    ...(d.nonCompete ? [{
      title: 'VIII. NON-COMPETE CLAUSE',
      body: [
        `The Employee undertakes that, for ${txt(d.nonCompetePeriod, '12')} months after the end of the employment, the Employee will not carry out any gainful activity identical to the Employer's business or of a competitive nature towards the Employer (§ 310 of the Labour Code).`,
        'For complying with this undertaking the Employee is entitled to monetary compensation of at least half of the average monthly earnings for each month of compliance. The compensation is payable monthly in arrears, always by the 15th day of the calendar month following the month for which it is due.',
        'The non-compete clause is limited in subject matter, time and territory with regard to the nature of the information to which the Employee had access. The Employer is entitled to withdraw from the non-compete clause during the Employee’s employment (§ 310(4) of the Labour Code).',
        'In the event of a breach of the non-compete clause, the Employee shall return the monetary compensation received for the months in which the undertaking was not complied with; this does not affect the Employer’s claim for compensation for demonstrably incurred damage.',
      ],
    }] : []),
    {
      title: 'IX. CONFIDENTIALITY AND PROTECTION OF TRADE SECRETS',
      body: [
        'The Employee shall maintain confidentiality about all facts learned in connection with the performance of the Employee’s job that are marked as confidential or whose nature obviously makes them confidential.',
        'The duty of confidentiality lasts for the duration of the employment and for a further 3 years after its end.',
        'For damage caused by the Employee through a breach of the duty of confidentiality, the Employee is liable to the extent laid down in § 257 of the Labour Code. Where the damage was caused intentionally or under the influence of alcohol or other addictive substances, the Employee is liable for the damage in full (§ 257(3) of the Labour Code). Note: a contractual penalty to the detriment of the employee is not agreed in an employment relationship (§ 346d of the Labour Code).',
      ],
    },
  ] : [];

  const sections: ParaPair[] = [
    {
      title: 'PREAMBLE',
      body: [
        'This employment contract (the "Contract") is concluded under § 34 et seq. of Act No. 262/2006 Coll., the Labour Code, as amended (the "Labour Code").',
        `Date of conclusion of the Contract: ${d.contractDate ? dateIn('en', d.contractDate) : todayIn('en')}`,
      ],
    },
    {
      title: 'I. CONTRACTING PARTIES',
      body: [
        `Employer: ${txt(d.employerName)}, Company ID (IČO): ${txt(d.employerIco)}, registered office: ${txt(d.employerAddress)}`,
        d.employerEmail ? `Employer's e-mail: ${txt(d.employerEmail)}` : '',
        `Employee: ${txt(d.employeeName)}, date of birth: ${txt(d.employeeBirth)}, residing at: ${txt(d.employeeAddress)}`,
        d.employeeEmail ? `Employee's e-mail: ${txt(d.employeeEmail)}` : '',
      ],
    },
    {
      title: 'II. TYPE AND PLACE OF WORK',
      body: [
        `Type of work (job position): ${txt(d.jobTitle, 'not specified')}`,
        `Description of duties: ${txt(d.jobDescription, 'according to the current job description')}`,
        `Place of work: ${txt(d.workPlace, 'not specified')}`,
        d.remoteWork ? `Possibility of remote work (home office): ${txt(formatRemoteWorkForContract(String(d.remoteWork), 'en'))}` : '',
      ],
    },
    {
      title: 'III. COMMENCEMENT AND DURATION OF EMPLOYMENT',
      body: [
        `The employment arises on the day of commencement of work: ${dateIn('en', d.startDate, 'not specified')}`,
        `The employment is agreed ${c.durationClause}.`,
        c.trialPeriodClause,
      ],
    },
    {
      title: 'IV. WORKING TIME',
      body: [
        c.workTimeClause,
        `Break for meals and rest: ${txt(d.breakMinutes, '30')} minutes under § 88 of the Labour Code.`,
        `Holiday: the Employee is entitled to holiday of ${txt(d.vacationWeeks, '4')} weeks per calendar year under § 212 of the Labour Code.`,
      ],
    },
    {
      title: 'V. WAGE AND REMUNERATION',
      body: [
        c.salaryDesc,
        d.bonusDesc ? `The Employee may be granted variable wage components (bonuses): ${txt(d.bonusDesc)}.` : '',
        'On payment of the wage the Employer shall provide the Employee with a written statement (payslip) showing the individual wage components and the deductions made.',
      ],
    },
    {
      title: 'VI. RIGHTS AND OBLIGATIONS OF THE EMPLOYEE',
      body: [
        'The Employee shall:',
        'a) personally perform the work under the employment contract and observe the working time,',
        'b) comply with occupational health and safety regulations and the Employer’s work rules, and complete the occupational health and safety training required by law (§ 103 of the Labour Code); the Employer shall provide this training at its own expense,',
        'c) notify the Employer of obstacles to work (illness, care of a family member) without undue delay,',
        'd) maintain confidentiality about information marked as confidential,',
        'e) protect the Employer’s property and not consume alcohol or other addictive substances at the workplace.',
      ],
    },
    {
      title: 'VII. TERMINATION OF EMPLOYMENT',
      body: [
        'The employment may be terminated: by agreement, by notice, by immediate termination or by expiry of the agreed term (§ 48 of the Labour Code).',
        `The notice period is ${monthsIn('en', c.effectiveNoticeMonths)} and begins on the day the notice is delivered to the other party; it ends on the day whose number corresponds to that day, or on the last day of the month (§ 51 of the Labour Code). For notice given by the Employer on the grounds under § 52(f) to (h) of the Labour Code it is at least one month. A different running or length may be agreed only in writing and on the same terms for both parties, except for an advantage for the Employee permitted by law.`,
        'Notice given by the Employer must state its grounds (§ 52 of the Labour Code). Notice given by the Employee may be given for any reason or without stating a reason.',
      ],
    },
    ...premium,
    {
      title: `${hasPremium ? 'X' : 'VIII'}. FINAL PROVISIONS`,
      body: [
        'The employment contract is governed by Act No. 262/2006 Coll., the Labour Code, as amended, and subsidiarily by Act No. 89/2012 Coll., the Civil Code.',
        'The employment contract must be in writing and each contracting party must receive one copy (§ 34(2) and (5) of the Labour Code). The parties conclude it no later than on the agreed day of commencement of work.',
        disputeClauseIn('en', d, true),
        'The Contract is executed in two counterparts; the Employer and the Employee each receive one counterpart (§ 34(5) of the Labour Code).',
        'Amendments to the employment contract are valid only in the form of written, numbered and signed addenda (§ 564 of the Civil Code).',
        'The invalidity of any individual provision of the Contract does not affect the validity of the other provisions.',
        'Neither contracting party is liable for failure to perform non-monetary obligations caused by force majeure (vis maior), i.e. an extraordinary, unforeseeable and insurmountable event (§ 2913(2) of the Civil Code). Force majeure does not apply to the obligation to pay a sum of money. A party affected by force majeure shall inform the other party in writing without delay and resume performance without delay once the obstacle has ceased.',
      ],
    },
    { title: `${hasPremium ? 'XI' : 'IX'}. SIGNATURES`, body: [] },
  ];

  if (c.isEmployerStart) {
    sections.push({
      title: 'ANNEX NO. 1 – INFORMATION ON THE CONTENT OF THE EMPLOYMENT UNDER § 37 OF THE LABOUR CODE',
      body: [
        `Employer: ${txt(d.employerName)}, registered office / address: ${txt(d.employerAddress)}`,
        `Employee: ${txt(d.employeeName)}, residence: ${txt(d.employeeAddress)}`,
        'The Employer hereby informs the Employee in writing of the particulars under § 37(1) of the Labour Code, to the extent they are not fully contained directly in the employment contract. The information must be provided no later than 7 days after the employment arises.',
        `a) Name and registered office of the Employer: ${txt(d.employerName)}, ${txt(d.employerAddress)}.`,
        `b) More detailed designation of the type and place of work: ${txt(d.jobTitle)}; ${txt(d.jobDescription, 'according to the current job description')}; place of work ${txt(d.workPlace)}.`,
        `c) Holiday and how it is determined: ${txt(d.vacationWeeks, '4')} weeks per calendar year; the entitlement to holiday and its calculation are governed by § 211 to 223 of the Labour Code.`,
        `d) Probationary period: ${c.trialPeriodClause}`,
        `e) Termination of employment: by agreement, by notice, by immediate termination, by termination during the probationary period or in other ways provided by law. Notice and other unilateral legal acts must be in writing and delivered to the other party. Notice period: ${monthsIn('en', c.effectiveNoticeMonths)}; its running and the statutory exceptions are governed in particular by § 50 to 54 of the Labour Code.`,
        `f) Professional development provided by the Employer: ${txt(d.professionalDevelopment)}.`,
        `g) Weekly working time, its scheduling and overtime: ${c.workTimeClause} ${txt(d.overtimeRules)}`,
        `h) Rest and breaks: the break for meals and rest is ${txt(d.breakMinutes, '30')} minutes; minimum daily and weekly rest and the granting of breaks are governed in particular by § 88, § 90 and § 92 of the Labour Code.`,
        `i) Wage, its due date, pay date, place and method of payment: ${c.salaryDesc} Method and place of payment: ${txt(d.payMethod)}.`,
        `j) Collective agreements: ${txt(d.collectiveAgreement)}.`,
        `k) Social security authority to which the Employer pays contributions: ${txt(d.socialSecurityAuthority)}.`,
        'The Employee confirms receipt of this information. If the above particulars change, the Employer shall inform the Employee in writing without undue delay, at the latest on the day the change takes effect (§ 37(3) of the Labour Code).',
        'Date of handover: ................................  Employer’s signature: ................................  Employee’s signature: ................................',
      ],
    });

    let nextAppendix = 2;
    if (c.usesRemoteWork) {
      sections.push({
        title: `ANNEX NO. ${nextAppendix} – REMOTE WORK AGREEMENT`,
        body: [
          'This agreement is concluded in writing under § 317 of the Labour Code as a supplement to the employment contract between the Employer and the Employee named above.',
          `Remote work arrangement: ${txt(formatRemoteWorkForContract(c.remoteWorkValue, 'en'))}. Place of remote work: ${txt(d.remoteWorkPlace)}. Extent and rules of use: ${txt(d.remoteWorkSchedule)}.`,
          'The Employee performs remote work within the scheduled working time, is available through the agreed communication channels and keeps records of working time to the extent determined by the Employer. Overtime, work on public holidays or at night is subject to the Employer’s prior instruction or consent where required by law.',
          `Work equipment intended for remote work: ${txt(d.workEquipment, 'no separately handed-over equipment')}. The Employee shall protect the equipment, use it primarily for work purposes and report any damage, loss or security incident without undue delay.`,
          c.remoteCostClause,
          'The Employee confirms that the chosen place is suitable for performing the work and undertakes to comply with instructions on occupational health and safety, fire protection, personal data protection and information security. The Employer shall provide the necessary information and training; any inspection of the place will take place only by prior agreement and with respect for the Employee’s privacy.',
          'The obligation under this agreement may be terminated by written agreement as of the agreed day, or by written notice for any reason or without stating a reason with a fifteen-day notice period beginning on the day of delivery to the other party (§ 317(2) of the Labour Code).',
          'Date: ................................  Employer’s signature: ................................  Employee’s signature: ................................',
        ],
      });
      nextAppendix += 1;
    }

    sections.push({
      title: `ANNEX NO. ${nextAppendix} – PROTOCOL ON THE HANDOVER OF WORK EQUIPMENT`,
      body: [
        `The Employer hands over the following work equipment to the Employee: ${txt(d.workEquipment)}.`,
        `Condition of the equipment and accessories at handover: ${txt(d.equipmentCondition, 'functional, without apparent defects; add any deviations when signing')}.`,
        'The Employee confirms receipt of the above equipment, undertakes to take proper care of it, to protect access credentials and to use the equipment in accordance with work instructions. The Employee shall inform the Employer of any fault, loss or security incident without undue delay.',
        'On termination of the employment or at the Employer’s request, the Employee shall return the equipment and all accessories in a condition corresponding to ordinary wear and tear. This protocol does not in itself constitute an agreement on liability for loss of entrusted items under § 252 of the Labour Code.',
        'Date and place of handover: ................................  Identification / serial numbers: ................................................',
        'Signature of the person handing over: ................................  Signature of the person taking over: ................................',
      ],
    });
    nextAppendix += 1;

    sections.push({
      title: `ANNEX NO. ${nextAppendix} – EMPLOYER’S ONBOARDING CHECKLIST`,
      body: [
        '[ ] The employment contract was signed no later than on the day of commencement and each party received one copy.',
        '[ ] The information under § 37 of the Labour Code was provided to the Employee no later than 7 days after the employment arose and proof of handover is filed.',
        '[ ] The pre-employment occupational medical examination was verified, where required by the type of work and the current legislation.',
        '[ ] On commencement, the Employee was acquainted with the work rules, internal regulations, the collective agreement, occupational health and safety and fire protection (§ 37(5) of the Labour Code).',
        '[ ] The Employer’s current registration, record-keeping and notification obligations towards the social security authorities and other competent institutions were fulfilled.',
        '[ ] Wage and bank details, the pay date, the working time schedule, holiday and a contact person were communicated to the Employee.',
        '[ ] For remote work, a written agreement under § 317 of the Labour Code was signed and the cost reimbursement regime under § 190a of the Labour Code was set.',
        '[ ] Equipment, access rights, keys and security authorisations handed over were recorded and the Employee confirmed receipt.',
        '[ ] The Employee received a contact for reporting obstacles to work, workplace accidents, technical faults and security incidents.',
        'Check carried out by: ................................  Date: ................................  Signature: ................................',
      ],
    });
  }
  return sections;
}

// ── UA ─────────────────────────────────────────────────────────────────────
function ua(d: StoredContractData, hasPremium: boolean): ParaPair[] {
  const c = clauses('ua', d);

  const premium: ParaPair[] = hasPremium ? [
    ...(d.nonCompete ? [{
      title: 'VIII. ЗАСТЕРЕЖЕННЯ ПРО НЕКОНКУРЕНЦІЮ',
      body: [
        `Працівник зобов’язується протягом ${txt(d.nonCompetePeriod, '12')} місяців після припинення трудових відносин не здійснювати прибуткову діяльність, яка була б тотожною предмету діяльності роботодавця або мала б щодо роботодавця конкурентний характер (§ 310 ТК).`,
        'За дотримання цього зобов’язання працівнику належить грошова компенсація в розмірі щонайменше половини середнього місячного заробітку за кожен місяць виконання зобов’язання. Компенсація виплачується щомісяця за минулий період, щоразу до 15-го числа календарного місяця, що настає за місяцем, за який вона належить.',
        'Застереження про неконкуренцію обмежене за предметом, часом і територією з урахуванням характеру інформації, до якої працівник мав доступ. Роботодавець має право відмовитися від застереження про неконкуренцію протягом тривалості трудових відносин працівника (§ 310 ч. 4 ТК).',
        'У разі порушення застереження про неконкуренцію працівник зобов’язаний повернути отриману грошову компенсацію за місяці, протягом яких він не дотримувався зобов’язання; це не зачіпає права роботодавця на відшкодування доведено завданої шкоди.',
      ],
    }] : []),
    {
      title: 'IX. КОНФІДЕНЦІЙНІСТЬ ТА ЗАХИСТ КОМЕРЦІЙНОЇ ТАЄМНИЦІ',
      body: [
        'Працівник зобов’язаний зберігати конфіденційність щодо всіх фактів, про які він дізнався у зв’язку з виконанням своєї роботи і які позначені як конфіденційні або конфіденційність яких очевидно випливає з їхнього характеру.',
        'Обов’язок конфіденційності діє протягом тривалості трудових відносин і ще 3 роки після їх припинення.',
        'За шкоду, заподіяну працівником порушенням обов’язку конфіденційності, працівник відповідає в обсязі, встановленому § 257 ТК. У разі умисного заподіяння шкоди або шкоди, заподіяної в стані алкогольного чи іншого наркотичного сп’яніння, працівник відповідає за шкоду в повному обсязі (§ 257 ч. 3 ТК). Примітка: договірний штраф на шкоду працівнику в трудових відносинах не погоджується (§ 346d ТК).',
      ],
    },
  ] : [];

  const sections: ParaPair[] = [
    {
      title: 'ПРЕАМБУЛА',
      body: [
        'Цей трудовий договір (далі — «Договір») укладається відповідно до § 34 і наступних Закону № 262/2006 Sb., Трудовий кодекс, з наступними змінами (далі — «ТК»).',
        `Дата укладення Договору: ${d.contractDate ? dateIn('ua', d.contractDate) : todayIn('ua')}`,
      ],
    },
    {
      title: 'I. СТОРОНИ ДОГОВОРУ',
      body: [
        `Роботодавець: ${txt(d.employerName)}, IČO: ${txt(d.employerIco)}, місцезнаходження: ${txt(d.employerAddress)}`,
        d.employerEmail ? `E-mail роботодавця: ${txt(d.employerEmail)}` : '',
        `Працівник: ${txt(d.employeeName)}, дата народження: ${txt(d.employeeBirth)}, місце проживання: ${txt(d.employeeAddress)}`,
        d.employeeEmail ? `E-mail працівника: ${txt(d.employeeEmail)}` : '',
      ],
    },
    {
      title: 'II. ВИД І МІСЦЕ ВИКОНАННЯ РОБОТИ',
      body: [
        `Вид роботи (посада): ${txt(d.jobTitle, 'не зазначено')}`,
        `Опис трудових обов’язків: ${txt(d.jobDescription, 'відповідно до чинного опису робочого місця')}`,
        `Місце виконання роботи: ${txt(d.workPlace, 'не зазначено')}`,
        d.remoteWork ? `Можливість дистанційної роботи (home office): ${txt(formatRemoteWorkForContract(String(d.remoteWork), 'ua'))}` : '',
      ],
    },
    {
      title: 'III. ВИНИКНЕННЯ ТА ТРИВАЛІСТЬ ТРУДОВИХ ВІДНОСИН',
      body: [
        `Трудові відносини виникають у день початку роботи: ${dateIn('ua', d.startDate, 'не зазначено')}`,
        `Трудові відносини укладаються ${c.durationClause}.`,
        c.trialPeriodClause,
      ],
    },
    {
      title: 'IV. РОБОЧИЙ ЧАС',
      body: [
        c.workTimeClause,
        `Перерва для харчування та відпочинку: ${txt(d.breakMinutes, '30')} хвилин відповідно до § 88 ТК.`,
        `Відпустка: працівнику належить відпустка тривалістю ${txt(d.vacationWeeks, '4')} тижнів за календарний рік відповідно до § 212 ТК.`,
      ],
    },
    {
      title: 'V. ЗАРОБІТНА ПЛАТА ТА ВИНАГОРОДА',
      body: [
        c.salaryDesc,
        d.bonusDesc ? `Працівнику можуть бути призначені змінні складові заробітної плати (премії/бонуси): ${txt(d.bonusDesc)}.` : '',
        'Під час виплати заробітної плати роботодавець зобов’язаний надати працівнику письмовий документ (розрахунковий листок) із даними про окремі складові заробітної плати та здійснені утримання.',
      ],
    },
    {
      title: 'VI. ПРАВА ТА ОБОВ’ЯЗКИ ПРАЦІВНИКА',
      body: [
        'Працівник зобов’язаний:',
        'a) особисто виконувати роботу відповідно до трудового договору та дотримуватися робочого часу,',
        'b) дотримуватися правил охорони праці, правил внутрішнього трудового розпорядку роботодавця та проходити передбачені законом інструктажі з охорони праці (§ 103 ТК); роботодавець зобов’язаний забезпечити ці інструктажі за свій рахунок,',
        'c) без зайвої затримки повідомляти роботодавця про перешкоди в роботі (хвороба, догляд за членом сім’ї),',
        'd) зберігати конфіденційність щодо інформації, позначеної як конфіденційна,',
        'e) захищати майно роботодавця та не вживати алкоголь чи інші наркотичні речовини на робочому місці.',
      ],
    },
    {
      title: 'VII. ПРИПИНЕННЯ ТРУДОВИХ ВІДНОСИН',
      body: [
        'Трудові відносини можуть бути припинені: за згодою сторін, шляхом розірвання за повідомленням (výpověď), негайного розірвання або закінчення погодженого строку (§ 48 ТК).',
        `Строк попередження становить ${monthsIn('ua', c.effectiveNoticeMonths)} і починається в день доставки повідомлення про розірвання іншій стороні; він закінчується в день, число якого збігається з цим днем, або в останній день місяця (§ 51 ТК). У разі розірвання роботодавцем з підстав, передбачених § 52 п. f)–h) ТК, він становить щонайменше один місяць. Інший порядок перебігу або іншу тривалість можна погодити лише письмово та на однакових умовах для обох сторін, за винятком дозволеного законом покращення становища працівника.`,
        'Розірвання з боку роботодавця має бути обґрунтованим (§ 52 ТК). Розірвання з боку працівника може бути здійснене з будь-якої причини або без зазначення причини.',
      ],
    },
    ...premium,
    {
      title: `${hasPremium ? 'X' : 'VIII'}. ПРИКІНЦЕВІ ПОЛОЖЕННЯ`,
      body: [
        'Трудовий договір регулюється Законом № 262/2006 Sb., Трудовий кодекс, з наступними змінами, та субсидіарно Законом № 89/2012 Sb., Цивільний кодекс.',
        'Трудовий договір має бути укладений у письмовій формі, і кожна сторона договору повинна отримати один примірник (§ 34 ч. 2 і 5 ТК). Сторони укладають його не пізніше дня погодженого початку роботи.',
        disputeClauseIn('ua', d, true),
        'Договір складено у двох однакових примірниках; роботодавець і працівник отримують по одному примірнику (§ 34 ч. 5 ТК).',
        'Зміни трудового договору дійсні лише у формі письмових, пронумерованих і підписаних додаткових угод (§ 564 ЦК).',
        'Недійсність окремого положення Договору не впливає на дійсність інших положень.',
        'Жодна зі сторін не відповідає за невиконання негрошових обов’язків, спричинене непереборною силою (vis maior), тобто надзвичайною, непередбачуваною та непереборною подією (§ 2913 ч. 2 ЦК). Непереборна сила не поширюється на обов’язок сплатити грошову суму. Сторона, яка зазнала дії непереборної сили, зобов’язана негайно письмово повідомити іншу сторону та після усунення перешкоди негайно продовжити виконання.',
      ],
    },
    { title: `${hasPremium ? 'XI' : 'IX'}. ПІДПИСИ`, body: [] },
  ];

  if (c.isEmployerStart) {
    sections.push({
      title: 'ДОДАТОК № 1 – ІНФОРМАЦІЯ ПРО ЗМІСТ ТРУДОВИХ ВІДНОСИН ВІДПОВІДНО ДО § 37 ТК',
      body: [
        `Роботодавець: ${txt(d.employerName)}, місцезнаходження / адреса: ${txt(d.employerAddress)}`,
        `Працівник: ${txt(d.employeeName)}, місце проживання: ${txt(d.employeeAddress)}`,
        'Роботодавець цим письмово інформує працівника про відомості відповідно до § 37 ч. 1 Трудового кодексу, якщо вони в повному обсязі не містяться безпосередньо в трудовому договорі. Інформацію необхідно надати не пізніше ніж через 7 днів після виникнення трудових відносин.',
        `a) Найменування та місцезнаходження роботодавця: ${txt(d.employerName)}, ${txt(d.employerAddress)}.`,
        `b) Детальніше визначення виду та місця виконання роботи: ${txt(d.jobTitle)}; ${txt(d.jobDescription, 'відповідно до чинного опису робочого місця')}; місце виконання роботи ${txt(d.workPlace)}.`,
        `c) Відпустка та спосіб її визначення: ${txt(d.vacationWeeks, '4')} тижнів за календарний рік; виникнення та обчислення права на відпустку регулюються § 211–223 ТК.`,
        `d) Випробувальний строк: ${c.trialPeriodClause}`,
        `e) Припинення трудових відносин: за згодою сторін, шляхом розірвання за повідомленням, негайного розірвання, розірвання під час випробувального строку або іншими встановленими законом способами. Повідомлення про розірвання та інші односторонні юридичні дії мають бути письмовими та доставленими іншій стороні. Строк попередження: ${monthsIn('ua', c.effectiveNoticeMonths)}; його перебіг і встановлені законом винятки регулюються, зокрема, § 50–54 ТК.`,
        `f) Професійний розвиток, який забезпечує роботодавець: ${txt(d.professionalDevelopment)}.`,
        `g) Тижневий робочий час, його розподіл і надурочна робота: ${c.workTimeClause} ${txt(d.overtimeRules)}`,
        `h) Відпочинок і перерви: перерва для харчування та відпочинку становить ${txt(d.breakMinutes, '30')} хвилин; мінімальний щоденний і щотижневий відпочинок та надання перерв регулюються, зокрема, § 88, § 90 і § 92 ТК.`,
        `i) Заробітна плата, строк її виплати, день, місце та спосіб виплати: ${c.salaryDesc} Спосіб і місце виплати: ${txt(d.payMethod)}.`,
        `j) Колективні договори: ${txt(d.collectiveAgreement)}.`,
        `k) Орган соціального забезпечення, якому роботодавець сплачує внески: ${txt(d.socialSecurityAuthority)}.`,
        'Працівник підтверджує отримання цієї інформації. У разі зміни зазначених відомостей роботодавець письмово повідомить працівника без зайвої затримки, не пізніше дня набрання зміною чинності (§ 37 ч. 3 ТК).',
        'Дата передачі: ................................  Підпис роботодавця: ................................  Підпис працівника: ................................',
      ],
    });

    let nextAppendix = 2;
    if (c.usesRemoteWork) {
      sections.push({
        title: `ДОДАТОК № ${nextAppendix} – УГОДА ПРО ДИСТАНЦІЙНУ РОБОТУ`,
        body: [
          'Ця угода укладена в письмовій формі відповідно до § 317 Трудового кодексу як доповнення до трудового договору між зазначеними вище роботодавцем і працівником.',
          `Режим дистанційної роботи: ${txt(formatRemoteWorkForContract(c.remoteWorkValue, 'ua'))}. Місце дистанційної роботи: ${txt(d.remoteWorkPlace)}. Обсяг і правила використання: ${txt(d.remoteWorkSchedule)}.`,
          'Працівник виконує дистанційну роботу в межах розподіленого робочого часу, є доступним через погоджені канали зв’язку та веде облік робочого часу в обсязі, визначеному роботодавцем. Надурочна робота, робота у святкові дні або вночі потребує попередньої вказівки чи згоди роботодавця, якщо цього вимагає закон.',
          `Робоче обладнання, призначене для дистанційної роботи: ${txt(d.workEquipment, 'без окремо переданого обладнання')}. Працівник зобов’язаний берегти обладнання, використовувати його насамперед для робочих цілей і без зайвої затримки повідомляти про пошкодження, втрату чи інцидент безпеки.`,
          c.remoteCostClause,
          'Працівник підтверджує, що обране місце придатне для виконання роботи, і зобов’язується дотримуватися вказівок щодо охорони праці, пожежної безпеки, захисту персональних даних та інформаційної безпеки. Роботодавець забезпечить необхідну інформацію та навчання; можлива перевірка місця відбудеться лише за попередньою домовленістю та з повагою до приватного життя працівника.',
          'Зобов’язання за цією угодою можна припинити письмовою угодою з погодженого дня або письмовим повідомленням про розірвання з будь-якої причини чи без зазначення причини з п’ятнадцятиденним строком попередження, який починається в день доставки іншій стороні (§ 317 ч. 2 ТК).',
          'Дата: ................................  Підпис роботодавця: ................................  Підпис працівника: ................................',
        ],
      });
      nextAppendix += 1;
    }

    sections.push({
      title: `ДОДАТОК № ${nextAppendix} – АКТ ПЕРЕДАЧІ РОБОЧОГО ОБЛАДНАННЯ`,
      body: [
        `Роботодавець передає працівнику таке робоче обладнання: ${txt(d.workEquipment)}.`,
        `Стан обладнання та приладдя під час передачі: ${txt(d.equipmentCondition, 'справне, без очевидних дефектів; можливі відхилення доповніть під час підписання')}.`,
        'Працівник підтверджує отримання зазначеного обладнання, зобов’язується дбайливо з ним поводитися, захищати облікові дані для доступу та використовувати обладнання відповідно до робочих вказівок. Про несправність, втрату чи інцидент безпеки він без зайвої затримки повідомляє роботодавця.',
        'Після припинення трудових відносин або на вимогу роботодавця працівник повертає обладнання та все приладдя в стані, що відповідає звичайному зношенню. Цей акт сам по собі не є угодою про відповідальність за втрату довірених речей відповідно до § 252 ТК.',
        'Дата та місце передачі: ................................  Ідентифікація / серійні номери: ................................................',
        'Підпис особи, яка передає: ................................  Підпис особи, яка приймає: ................................',
      ],
    });
    nextAppendix += 1;

    sections.push({
      title: `ДОДАТОК № ${nextAppendix} – ЧЕК-ЛИСТ РОБОТОДАВЦЯ ПРИ ПРИЙОМІ НА РОБОТУ`,
      body: [
        '[ ] Трудовий договір підписано не пізніше дня початку роботи, і кожна сторона отримала один примірник.',
        '[ ] Інформацію відповідно до § 37 ТК передано працівнику не пізніше ніж через 7 днів після виникнення трудових відносин, і підтвердження передачі збережено.',
        '[ ] Перевірено проходження попереднього медичного огляду з питань гігієни праці, якщо його вимагають вид роботи та чинне законодавство.',
        '[ ] Під час прийому на роботу працівника ознайомлено з правилами внутрішнього трудового розпорядку, внутрішніми нормативними актами, колективним договором, охороною праці та пожежною безпекою (§ 37 ч. 5 ТК).',
        '[ ] Виконано чинні реєстраційні, облікові та повідомні обов’язки роботодавця щодо органів соціального забезпечення та інших компетентних установ.',
        '[ ] Працівнику повідомлено дані щодо заробітної плати та банківські реквізити, день виплати, розклад робочого часу, відпустку та контактну особу.',
        '[ ] Для дистанційної роботи підписано письмову угоду відповідно до § 317 ТК і встановлено режим відшкодування витрат відповідно до § 190a ТК.',
        '[ ] Передане обладнання, доступи, ключі та дозволи безпеки зафіксовано, і працівник підтвердив їх отримання.',
        '[ ] Працівник отримав контакт для повідомлення про перешкоди в роботі, нещасні випадки на виробництві, технічні несправності та інциденти безпеки.',
        'Перевірку здійснив(ла): ................................  Дата: ................................  Підпис: ................................',
      ],
    });
  }
  return sections;
}

export function buildEmploymentTranslationsBySection(d: StoredContractData, hasPremium: boolean): Array<NonNullable<ContractSection['translations']>> {
  return buildBilingualTranslations({
    en: () => en(d, hasPremium),
    ua: () => ua(d, hasPremium),
  });
}
