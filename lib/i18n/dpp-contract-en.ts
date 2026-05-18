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

/** Explanatory English translation of the Czech DPP agreement — not certified or official. */
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
            'No contractual penalties to the worker’s detriment; proven damage may be claimed.',
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
        `Estimated scope: ${asText(d.estimatedHours, 'not stated')} hours.`,
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. DURATION AND TERMINATION',
      body: [
        `Term: ${d.durationType === 'fixed' && d.startDate && d.endDate ? `fixed from ${formatDate(d.startDate)} to ${formatDate(d.endDate)}` : 'indefinite'}`,
        d.deadline ? `Task deadline: ${asText(d.deadline)}` : '',
        'Either party may terminate with 15 days’ notice unless otherwise agreed; the agreement also ends by law when the task is completed or on other statutory grounds.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'IV. REMUNERATION',
      body: [
        remunerationDesc,
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
        'Standard working-time rules for full employment do not apply to the same extent (Section 77(2) LC).',
        'Work may be performed on site, at the agreed place or remotely if the task allows and confidentiality is protected.',
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
        'Invalidity of one clause does not affect the rest.',
        'Personal data processed under GDPR and Section 316 LC.',
        'Force majeure under Section 2913(2) Civil Code; monetary obligations remain due.',
      ],
    },
    { title: `${hasPremiumClauses ? 'X' : 'VII'}. SIGNATURES`, body: [] },
  ];

  return sections;
}
