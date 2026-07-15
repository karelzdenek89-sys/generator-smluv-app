import type { ContractSection, StoredContractData } from '@/lib/contracts';
import { resolveTierFeatures } from '@/lib/contracts';
import { asText, disputeClauseEn, formatDate, today } from '@/lib/i18n/expat-contract-helpers';

function scopeDescEn(d: StoredContractData): string {
  switch (d.poaType) {
    case 'property':
      return `legal acts regarding property at / in cadastral area: ${asText(d.propertyAddress, 'not stated')}, including purchase, lease and filings with the land registry. Representation in Czech land-registry proceedings requires the principal’s officially certified signature; the authority for a specific instrument must also satisfy Section 441(2) of the Civil Code.`;
    case 'court':
      return `representation in proceedings at ${asText(d.courtName, 'not stated')}, file no. ${asText(d.caseNumber, 'not stated')}, including submissions and settlements. Court representation may require a lawyer where mandatory under Czech law.`;
    case 'company':
      return `acts as partner/manager of ${asText(d.companyName, 'not stated')}, ID ${asText(d.companyIco, 'not stated')}: ${asText(d.companyScope, 'general corporate acts')}`;
    case 'bank':
      return `banking acts regarding account ${asText(d.bankAccount, 'not stated')} at ${asText(d.bankName, 'not stated')}. Banks may require their own form or notarised signature.`;
    default:
      return asText(d.customScope, 'not stated');
  }
}

/** Explanatory English translation of Czech power of attorney — not certified or official. */
export function buildPowerOfAttorneyContractSectionsEn(d: StoredContractData): ContractSection[] {
  const { hasPremiumClauses } = resolveTierFeatures(d);
  const validityClause = d.validUntil
    ? `Valid until ${asText(d.validUntil)}.`
    : d.singleUse
      ? 'Single-use: expires when the authorised act is completed.'
      : 'Valid until expressly revoked by the principal.';

  const sections: ContractSection[] = [
    {
      title: 'PREAMBLE',
      body: [
        'This power of attorney is granted under Act No. 89/2012 Coll., the Civil Code (Sections 441–449).',
        `Date: ${d.contractDate ? formatDate(d.contractDate) : today()}`,
        'This is a software-generated template; a recipient may require official signature certification or its own form where the law or its acceptance rules so provide.',
      ],
    },
    {
      title: 'I. PRINCIPAL',
      body: [
        `Principal: ${asText(d.principalName)}, ID/birth: ${asText(d.principalId, '—')}, address: ${asText(d.principalAddress)}`,
        d.principalEmail ? `E-mail: ${asText(d.principalEmail)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. AGENT',
      body: [
        `Agent: ${asText(d.agentName)}, ID/birth: ${asText(d.agentId, '—')}, address: ${asText(d.agentAddress)}`,
        d.agentEmail ? `E-mail: ${asText(d.agentEmail)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. SCOPE',
      body: [
        `The principal authorises the agent to perform: ${scopeDescEn(d)}`,
        d.allowSubstitution
          ? 'The agent may delegate to a substitute representative.'
          : 'Substitution to a third person is not allowed.',
      ],
    },
    {
      title: 'IV. VALIDITY',
      body: [validityClause, 'The principal may revoke this power at any time in writing.'],
    },
    {
      title: `${hasPremiumClauses ? 'VI' : 'V'}. FINAL PROVISIONS`,
      body: [
        'Governed by the Civil Code of the Czech Republic.',
        disputeClauseEn(d),
        'Two copies; amendments in writing.',
      ],
    },
    { title: `${hasPremiumClauses ? 'VII' : 'VI'}. SIGNATURES`, body: [] },
  ];

  return sections;
}
