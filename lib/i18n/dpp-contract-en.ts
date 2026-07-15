import type { ContractSection, StoredContractData } from '@/lib/contracts';
import { resolveTierFeatures } from '@/lib/contracts';
import {
  asText,
  disputeClauseLaborEn,
  DPP_HOURS_LIMIT_EN,
  DPP_THRESHOLD_NOTE_EN,
  formatAmount,
  formatDate,
  today,
} from '@/lib/i18n/expat-contract-helpers';
import { EMPLOYMENT_WORK_ELIGIBILITY_NOTICE_EN } from '@/lib/i18n/safety-copy';

function dppToolsClauseEn(d: StoredContractData): string {
  if (d.toolsProvided === 'employer') {
    return 'The employer provides tools and equipment needed for the work.';
  }
  if (d.toolsProvided === 'employee') {
    return 'The worker provides tools at their own cost; reimbursement only if agreed in writing in advance.';
  }
  return 'Tools and equipment are provided as agreed between the parties.';
}

/** Explanatory English overview of the Czech DPP agreement — not a full clause-by-clause translation. */
export function buildDppContractSectionsEn(d: StoredContractData): ContractSection[] {
  const { hasPremiumClauses } = resolveTierFeatures(d);
  const remunerationDesc =
    d.remunerationType === 'hourly'
      ? `Remuneration is CZK ${formatAmount(d.hourlyRate)} per hour based on hours actually worked.`
      : d.remunerationType === 'fixed' || d.totalRemuneration
        ? `Lump-sum remuneration for the task: CZK ${formatAmount(d.totalRemuneration)}, payable after completion.`
        : 'Remuneration will be agreed in writing before work starts.';

  const premiumContent: ContractSection[] = hasPremiumClauses
    ? [
        {
          title: 'VI. CONFIDENTIALITY',
          body: [
            'The worker must keep confidential all business and personal data learned while performing the agreement.',
            'The duty continues for 2 years after the agreement ends.',
            'Breach liability under Section 257 of the Labour Code; no contractual penalties to the worker’s detriment (Section 346d).',
            'Upon termination the worker must return documents and delete confidential data from private devices.',
          ],
        },
        {
          title: 'VII. INTELLECTUAL PROPERTY',
          body: [
            'Work results created under this agreement are employee works under the Copyright Act; the employer holds economic rights from creation.',
            'The worker consents to modifications and use needed for the employer’s ordinary business.',
            'Source code and know-how must be handed over by the end date.',
          ],
        },
        {
          title: 'VIII. LIABILITY',
          body: [
            'Failure to perform properly without serious employer fault may give rise to damage liability under Section 257 LC.',
            'The employer may raise quality objections within 5 business days and request defect removal within 10 business days.',
            'No contractual penalties to the worker’s detriment; only statutory compensation for proven damage.',
          ],
        },
      ]
    : [];

  const sections: ContractSection[] = [
    {
      title: 'PREAMBLE',
      body: [
        'This agreement to perform work (DPP) is concluded under Sections 75 et seq. of Act No. 262/2006 Coll., the Labour Code.',
        `Date of conclusion: ${d.contractDate ? formatDate(d.contractDate) : today()}`,
        DPP_HOURS_LIMIT_EN,
        'If this overview differs from the Czech text of the agreement, the Czech wording prevails.',
        EMPLOYMENT_WORK_ELIGIBILITY_NOTICE_EN,
      ],
    },
    {
      title: 'I. PARTIES',
      body: [
        `Employer: ${asText(d.employerName)}, Company ID: ${asText(d.employerIco, '—')}, address: ${asText(d.employerAddress)}`,
        d.employerEmail ? `Employer e-mail: ${asText(d.employerEmail)}` : '',
        `Worker: ${asText(d.employeeName)}, born: ${asText(d.employeeBirth, '—')}, address: ${asText(d.employeeAddress)}`,
        d.employeeEmail ? `Worker e-mail: ${asText(d.employeeEmail)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. TASK',
      body: [
        `Work to be performed: ${asText(d.taskDescription, 'not stated')}`,
        d.taskDetails ? `Details: ${asText(d.taskDetails)}` : '',
        `Place of work: ${asText(d.workPlace, 'not stated')}`,
        `Estimated scope: ${asText(d.estimatedHours, 'not stated')} hours (max. 300 h/year with one employer).`,
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. DURATION AND TERMINATION',
      body: [
        `Term: ${d.durationType === 'fixed' && d.startDate && d.endDate ? `fixed from ${formatDate(d.startDate)} to ${formatDate(d.endDate)}` : 'indefinite'}`,
        d.deadline ? `Task deadline: ${asText(d.deadline)}` : '',
        'The agreement may be terminated by written mutual consent.',
        'Unless otherwise agreed, either party may terminate with 15 days’ notice from delivery to the other party.',
        'The agreement also ends when the task is completed, when the term expires, by mutual consent or on other statutory grounds.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'IV. REMUNERATION',
      body: [
        remunerationDesc,
        'Insurance participation does not arise if monthly income with one employer remains below the statutory threshold.',
        DPP_THRESHOLD_NOTE_EN,
        d.paymentAccount
          ? `Payment to account ${asText(d.paymentAccount)} within ${asText(d.paymentDays, '15')} days after completion / month-end.`
          : 'Payment in cash or by transfer as agreed.',
      ],
    },
    {
      title: 'V. PERFORMANCE CONDITIONS',
      body: [
        'The worker shall perform work personally, properly and follow the employer’s instructions.',
        'Working-time, rest-period, shift-schedule, work-obstacle and premium-pay rules apply to DPP as provided by the Labour Code. Only the institutions expressly excluded by Section 77(2), including transfer, temporary assignment and severance, do not apply.',
        'Holiday entitlement may arise under Section 77a LC if the agreement lasts at least 4 weeks with the same employer and the worker performs at least 20 hours (four times the fictitious weekly working time); calculation under Sections 213 and 77a.',
        'The employer must draw up a written shift schedule and inform the worker at least 3 days before a shift unless otherwise agreed in writing.',
        'Work may be performed on site, at the agreed place or remotely if the task allows and confidentiality and data security are protected.',
        dppToolsClauseEn(d),
      ],
    },
    ...premiumContent,
    {
      title: `${hasPremiumClauses ? 'IX' : 'VI'}. FINAL PROVISIONS`,
      body: [
        'Governed by the Labour Code and subsidiarily the Civil Code.',
        disputeClauseLaborEn(),
        'Two copies; each party receives one (Section 77(1) LC).',
        'Amendments in writing, numbered and signed.',
        'Invalidity of one clause does not affect the rest of the agreement.',
        'Force majeure under Section 2913(2) Civil Code excuses non-monetary breach; monetary obligations remain. The affected party must notify the other in writing without delay.',
      ],
    },
    { title: `${hasPremiumClauses ? 'X' : 'VII'}. SIGNATURES`, body: [] },
  ];

  return sections;
}
