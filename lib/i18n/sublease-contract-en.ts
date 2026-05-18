import type { ContractSection, StoredContractData } from '@/lib/contracts';
import { resolveTierFeatures } from '@/lib/contracts';
import { asText, disputeClauseEn, formatAmount, formatDate, today } from '@/lib/i18n/expat-contract-helpers';

function yesNoEn(value: unknown, yes: string, no: string): string {
  return value === true || value === 'yes' ? yes : no;
}

/** Explanatory English translation of Czech sublease — not certified or official. */
export function buildSubleaseContractSectionsEn(d: StoredContractData): ContractSection[] {
  const { hasPremiumClauses } = resolveTierFeatures(d);
  const consentNote =
    d.landlordConsent === 'yes'
      ? `The main landlord’s consent to sublease was given in writing on ${asText(d.consentDate, 'not stated')}.`
      : 'Note: Where required, the tenant must obtain the landlord’s consent before subletting. Subletting part of a flat is governed especially by Sections 2274–2275 of the Civil Code.';

  const sections: ContractSection[] = [
    {
      title: 'PREAMBLE',
      body: [
        'This sublease agreement is concluded under Sections 2274 et seq. of Act No. 89/2012 Coll., the Civil Code.',
        consentNote,
        `Date of conclusion: ${d.contractDate ? formatDate(d.contractDate) : today()}`,
      ],
    },
    {
      title: 'I. PARTIES',
      body: [
        `Tenant (sub-lessor): ${asText(d.landlordName)}, ID: ${asText(d.landlordId, '—')}, address: ${asText(d.landlordAddress)}`,
        d.landlordEmail ? `E-mail: ${asText(d.landlordEmail)}` : '',
        `Sub-tenant: ${asText(d.tenantName)}, ID: ${asText(d.tenantId, '—')}, address: ${asText(d.tenantAddress)}`,
        d.tenantEmail ? `E-mail: ${asText(d.tenantEmail)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. SUBJECT',
      body: [
        `Premises sublet at: ${asText(d.flatAddress, 'not stated')}, ${asText(d.flatLayout, '')}${d.flatUnitNumber ? `, unit ${asText(d.flatUnitNumber)}` : ''}.`,
        d.subleaseArea ? `Sublet area: ${asText(d.subleaseArea)} m².` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. TERM',
      body: [
        d.duration === 'fixed'
          ? `Fixed term from ${formatDate(d.startDate, 'not stated')} to ${formatDate(d.endDate, 'not stated')}.`
          : `Indefinite from ${formatDate(d.startDate, 'not stated')}.`,
        d.duration === 'indefinite'
          ? `Notice period: ${asText(d.noticePeriod, '3')} months from the first day of the month following delivery.`
          : '',
        'Sublease ends at the latest when the main lease ends.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'IV. RENT AND PAYMENTS',
      body: [
        `Monthly sub-rent: CZK ${formatAmount(d.rentAmount)}.`,
        d.utilityAmount ? `Service advance: CZK ${formatAmount(d.utilityAmount)}/month.` : '',
        `Total monthly payment: CZK ${formatAmount((Number(d.rentAmount) || 0) + (Number(d.utilityAmount) || 0))}.`,
        d.depositAmount
          ? `Security deposit: CZK ${formatAmount(d.depositAmount)}; return within 30 days after handback.`
          : '',
        `Due by the ${asText(d.paymentDay, '15')}th of each month${d.bankAccount ? ` to account ${asText(d.bankAccount)}` : ''}.`,
        'Late payment attracts statutory default interest.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'V. RULES',
      body: [
        'The sub-tenant shall use the premises properly, not make alterations without consent, and follow house rules.',
        `Max. occupants: ${asText(d.maxOccupants, '2')}.`,
        `Pets: ${d.allowPets ? 'allowed subject to damage liability' : 'only if they do not cause disproportionate nuisance'}.`,
        `Smoking: ${yesNoEn(d.allowSmoking, 'allowed', 'prohibited')}.`,
        `Short-term letting (Airbnb): ${yesNoEn(d.allowAirbnb, 'allowed', 'prohibited')}.`,
        'The sub-tenant acknowledges the main lease conditions.',
      ],
    },
    {
      title: 'VI. HANDOVER',
      body: [
        `Handover on ${formatDate(d.handoverDate, 'not stated')}.`,
        `Keys: ${asText(d.keysCount, '1')}.`,
        d.equipmentList ? `Equipment: ${asText(d.equipmentList)}.` : '',
        d.knownDefects ? `Known defects: ${asText(d.knownDefects)}.` : 'No declared defects beyond normal wear.',
        'A handover protocol will be signed.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'VII. END OF SUBLEASE',
      body: [
        'On termination the sub-tenant shall vacate, restore normal wear condition and return keys.',
        'Deposit returned within 30 days after handback, less justified deductions.',
      ],
    },
    {
      title: `${hasPremiumClauses ? 'XII' : 'IX'}. FINAL PROVISIONS`,
      body: [
        'Governed by the Civil Code of the Czech Republic.',
        disputeClauseEn(d),
        'Two copies; amendments in writing, numbered and signed.',
        'Personal data under GDPR and Act No. 110/2019 Coll.',
        'Force majeure under Section 2913(2) Civil Code; monetary obligations remain due.',
      ],
    },
    { title: `${hasPremiumClauses ? 'XIII' : 'X'}. SIGNATURES`, body: [] },
  ];

  return sections;
}
