import type { ContractSection, StoredContractData } from '@/lib/contracts';
import { resolveTierFeatures } from '@/lib/contracts';
import {
  asText,
  disputeClauseLaborEn,
  formatAmount,
  formatDate,
  pluralMonthsEn,
  today,
} from '@/lib/i18n/expat-contract-helpers';
import { EMPLOYMENT_WORK_ELIGIBILITY_NOTICE_EN } from '@/lib/i18n/safety-copy';
import { ZP_TRIAL_MONTHS_LEADERSHIP, ZP_TRIAL_MONTHS_STANDARD } from '@/lib/legal-constants-2026';

/** Explanatory English translation of the Czech employment contract — not certified or official. */
export function buildEmploymentContractSectionsEn(d: StoredContractData): ContractSection[] {
  const { hasPremiumClauses } = resolveTierFeatures(d);
  const leadershipRole =
    /vedouc|ředitel|manager|director/i.test(String(d.jobTitle ?? '')) ||
    Boolean(d.isManager || d.isExecutive || d.isLeader);
  const requestedTrialMonths = Number(d.trialPeriodMonths || 0);
  const maxTrialMonths = leadershipRole ? ZP_TRIAL_MONTHS_LEADERSHIP : ZP_TRIAL_MONTHS_STANDARD;
  const effectiveTrialMonths =
    Number.isFinite(requestedTrialMonths) && requestedTrialMonths > 0
      ? Math.min(requestedTrialMonths, maxTrialMonths)
      : 0;

  const trialPeriodClause =
    effectiveTrialMonths > 0
      ? `A probation period of ${pluralMonthsEn(effectiveTrialMonths)} from the start of employment is agreed (Section 35 of the Labour Code as amended by Act No. 120/2025 Coll.). For a fixed-term contract, probation may not exceed half of the agreed term. During probation either party may end the employment at any time, even without stating a reason.`
      : 'No probation period is agreed.';

  const durationClause =
    d.employmentType === 'fixed'
      ? `for a fixed term until ${formatDate(d.endDate, 'not stated')}`
      : 'for an indefinite period';

  const salaryDesc =
    d.salaryType === 'monthly'
      ? `The employee is entitled to gross monthly pay of CZK ${formatAmount(d.salary)}. Pay is due on the regular payday, i.e. the ${asText(d.payDay, '15')}th day of the calendar month following the month for which pay is due, by bank transfer to the employee’s account.`
      : `The employee is entitled to gross hourly pay of CZK ${formatAmount(d.hourlyRate)}/hour.`;

  const workTimeClause = d.workHours
    ? `Agreed weekly working time: ${asText(d.workHours)} hours. Schedule: ${asText(d.workSchedule, 'Monday–Friday, 8:00–17:00')}.`
    : 'Weekly working time is 40 hours (Section 79 of the Labour Code). Schedule: Monday–Friday, 8:00–17:00.';

  const premiumContent: ContractSection[] = hasPremiumClauses
    ? [
        ...(d.nonCompete
          ? [
              {
                title: 'VIII. NON-COMPETE CLAUSE',
                body: [
                  `The employee undertakes that for ${asText(d.nonCompetePeriod, '12')} months after termination they will not perform gainful activity identical to the employer’s business or competitive towards the employer (Section 310 of the Labour Code).`,
                  'For compliance, monetary compensation of at least half of average monthly earnings is due for each month of the restriction.',
                  'The non-compete is limited in subject, time and territory with regard to information the employee accessed. The employer may withdraw the clause during employment (Section 310(4)).',
                  'If breached, the employee must return compensation for months in breach; the employer may claim proven damage.',
                ],
              },
            ]
          : []),
        {
          title: 'IX. CONFIDENTIALITY AND TRADE SECRETS',
          body: [
            'The employee must keep confidential all facts learned in connection with work that are marked confidential or are confidential by nature.',
            'The duty lasts during employment and for 3 years after termination.',
            'Damage caused by breach is governed by Section 257 of the Labour Code. Contractual penalties to the employee’s detriment are not agreed in employment relations (Section 346d).',
          ],
        },
      ]
    : [];

  const sections: ContractSection[] = [
    {
      title: 'PREAMBLE',
      body: [
        'This employment contract (the “Contract”) is concluded under Sections 34 et seq. of Act No. 262/2006 Coll., the Labour Code (the “LC”).',
        `Date of conclusion: ${d.contractDate ? formatDate(d.contractDate) : today()}`,
        'If this translation differs from the Czech text of the contract, the Czech wording prevails.',
        EMPLOYMENT_WORK_ELIGIBILITY_NOTICE_EN,
      ],
    },
    {
      title: 'I. PARTIES',
      body: [
        `Employer: ${asText(d.employerName)}, Company ID: ${asText(d.employerIco, '—')}, registered office: ${asText(d.employerAddress)}`,
        d.employerEmail ? `Employer e-mail: ${asText(d.employerEmail)}` : '',
        `Employee: ${asText(d.employeeName)}, born: ${asText(d.employeeBirth, '—')}, address: ${asText(d.employeeAddress)}`,
        d.employeeEmail ? `Employee e-mail: ${asText(d.employeeEmail)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. TYPE AND PLACE OF WORK',
      body: [
        `Job title / type of work: ${asText(d.jobTitle, 'not stated')}`,
        `Job description: ${asText(d.jobDescription, 'as per current job description')}`,
        `Place of work: ${asText(d.workPlace, 'not stated')}`,
        d.remoteWork ? `Remote work (home office): ${asText(d.remoteWork)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. START AND DURATION',
      body: [
        `Employment starts on: ${formatDate(d.startDate, 'not stated')}`,
        `The employment relationship is agreed ${durationClause}.`,
        trialPeriodClause,
      ],
    },
    {
      title: 'IV. WORKING TIME',
      body: [
        workTimeClause,
        `Meal/rest break: ${asText(d.breakMinutes, '30')} minutes under Section 88 of the LC.`,
        `Holiday: ${asText(d.vacationWeeks, '4')} weeks per calendar year under Section 212 of the LC.`,
      ],
    },
    {
      title: 'V. PAY',
      body: [
        salaryDesc,
        d.bonusDesc ? `Variable pay (bonuses) may be granted: ${asText(d.bonusDesc)}.` : '',
        'The employer shall provide a written pay slip with wage components and deductions.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'VI. EMPLOYEE DUTIES',
      body: [
        'The employee shall:',
        'a) personally perform work under this Contract and observe working time,',
        'b) follow OHS rules, internal rules and required training (employer pays),',
        'c) report obstacles to work without undue delay,',
        'd) keep confidential information confidential,',
        'e) protect employer property and not use alcohol or drugs at work.',
      ],
    },
    {
      title: 'VII. TERMINATION',
      body: [
        'Employment may end by agreement, notice, immediate termination or expiry of the agreed term (Section 48 LC).',
        `Notice period under Section 51 LC: ${asText(d.noticePeriod, '2')} months, starting the first day of the month following delivery of notice.`,
        'Employer’s notice must be justified (Section 52 LC). Employee’s notice may be given for any or no stated reason.',
      ],
    },
    ...premiumContent,
    {
      title: `${hasPremiumClauses ? 'X' : 'VIII'}. FINAL PROVISIONS`,
      body: [
        'This Contract is governed by Act No. 262/2006 Coll., the Labour Code, and subsidiarily by the Civil Code.',
        'The employer must conclude the Contract before the employee starts work (Section 34(3) LC).',
        disputeClauseLaborEn(),
        'The Contract is executed in two copies; each party receives one (Section 37 LC).',
        'Amendments must be in writing, numbered and signed (Section 564 Civil Code).',
        'Invalidity of one provision does not affect the rest.',
        'Personal data are processed under GDPR, Act No. 110/2019 Coll. and Section 316 LC for the employment relationship and legal obligations.',
        'Neither party is liable for non-monetary failure due to force majeure (Section 2913(2) Civil Code); monetary obligations remain due.',
      ],
    },
    { title: `${hasPremiumClauses ? 'XI' : 'IX'}. SIGNATURES`, body: [] },
  ];

  return sections;
}
