import type { ContractSection, StoredContractData } from '@/lib/contracts';
import { resolveTierFeatures } from '@/lib/contracts';

const emptyLine = '—';

export const formatAmount = (amount?: unknown) => {
  if (amount === null || amount === undefined || amount === '') return emptyLine;
  const num = Number(amount);
  if (!Number.isFinite(num)) return emptyLine;
  return num.toLocaleString('cs-CZ');
};

export const asText = (value: unknown, fallback = emptyLine, maxLength = 1000) => {
  if (value === null || value === undefined) return fallback;
  const str = String(value).trim();
  if (str === '') return fallback;
  return str.length > maxLength ? `${str.substring(0, maxLength)}…` : str;
};

export const formatDate = (value: unknown, fallback = emptyLine): string => {
  if (value === null || value === undefined) return fallback;
  const str = String(value).trim();
  if (!str) return fallback;
  const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${parseInt(day, 10)}. ${parseInt(month, 10)}. ${year}`;
  }
  return str;
};

export const today = () => new Date().toLocaleDateString('cs-CZ');

function disputeClauseEn(d: StoredContractData): string {
  switch (d.disputeResolution) {
    case 'mediation':
      return 'The parties shall first seek an amicable settlement. If no agreement is reached, either party may use mediation under Act No. 202/2012 Coll. on mediation, or bring the dispute before the competent court of the Czech Republic.';
    default:
      return 'Disputes shall first be resolved amicably. If no agreement is reached, the dispute shall be decided by the competent court of the Czech Republic.';
  }
}

const MINOR_REPAIRS_EN =
  'The tenant shall pay for routine maintenance and minor repairs related to use of the apartment (Section 2257 of the Civil Code) within the limits set by Government Regulation No. 308/2015 Coll., as amended.';

/** Explanatory English translation of the Czech lease — not an official or certified translation. */
export function buildLeaseContractSectionsEn(d: StoredContractData): ContractSection[] {
  const { hasPremiumClauses } = resolveTierFeatures(d);
  const propertyAddress = asText(d.propertyAddress || d.flatAddress);
  const propertyLayout = asText(d.propertyLayout || d.flatLayout, 'not specified');
  const utilitiesAmount = d.utilitiesAmount ?? d.utilityAmount ?? '';
  const paymentDay =
    d.paymentDay !== undefined && d.paymentDay !== null && String(d.paymentDay).trim() !== ''
      ? String(d.paymentDay).replace(/\D/g, '')
      : '5';
  const isFixedTerm = d.duration === 'fixed' && Boolean(d.endDate);
  const leaseDuration = d.leaseDuration
    ? asText(d.leaseDuration)
    : isFixedTerm
      ? `fixed term until ${formatDate(d.endDate)}`
      : 'indefinite';
  const hasDeposit =
    d.depositAmount !== undefined &&
    d.depositAmount !== null &&
    String(d.depositAmount).trim() !== '' &&
    Number(d.depositAmount) > 0;
  const hasUtilities =
    utilitiesAmount !== '' && utilitiesAmount !== undefined && utilitiesAmount !== null && Number(utilitiesAmount) > 0;
  const monthlyTotal = (Number(d.rentAmount || 0) + Number(utilitiesAmount || 0)).toString();
  const useInflationIndexation =
    hasPremiumClauses &&
    (d.includeInflationIndexation === true || d.rentIndexationMode === 'cpi' || d.rentIndexationMode === 'inflation');

  const premiumContent: ContractSection[] = hasPremiumClauses
    ? [
        {
          title: 'XI. OPERATIONAL AND DOCUMENTATION ARRANGEMENTS',
          body: [
            'Material facts relating to the lease (defect reports, handover of keys, changes in household occupancy, handover dates and repair records) shall be confirmed between the parties in a provable manner, preferably by e-mail to the addresses in Article X or by registered mail.',
            'At the end of the lease, a handover protocol (Annex No. 1) shall be drawn up, including meter readings, keys, equipment list and room-by-room condition. Photos may be attached.',
            'If there is a dispute about damage beyond normal wear, the parties shall first seek an amicable assessment. Failing agreement, they may appoint an expert; costs are borne by the party whose claim proves unjustified.',
            'The tenant is liable for damage caused to the apartment or common parts by persons to whom the tenant allowed access.',
          ],
        },
        {
          title: 'XII. SPECIAL PROVISIONS ON TERMINATION',
          body: [
            'At least 5 business days before planned termination, the parties shall confirm the exact date and time of handover in writing.',
            'The landlord must return the security deposit or the unused part within the statutory period under Article V(3), with a written statement of any deductions.',
            'If repairs or professional cleaning are required after move-out, the landlord shall notify the tenant in writing before work starts, state estimated costs and allow at least 5 business days to respond, except urgent repairs.',
          ],
        },
      ]
    : [];

  const sections: ContractSection[] = [
    {
      title: 'PREAMBLE',
      body: [
        'This rental agreement (the “Agreement”) is concluded under Sections 2201 et seq. of Act No. 89/2012 Coll., the Civil Code, and Sections 2235 et seq. on lease of an apartment.',
        `Date of conclusion: ${d.contractDate ? formatDate(d.contractDate) : today()}`,
      ],
    },
    {
      title: 'I. PARTIES',
      body: [
        `Landlord: ${asText(d.landlordName)}, ID/date of birth: ${asText(d.landlordId, '—')}, address: ${asText(d.landlordAddress)}`,
        d.landlordOP ? `Landlord ID card no.: ${asText(d.landlordOP)}` : '',
        d.landlordEmail ? `Landlord e-mail: ${asText(d.landlordEmail)}` : '',
        d.landlordPhone ? `Landlord phone: ${asText(d.landlordPhone)}` : '',
        `Tenant: ${asText(d.tenantName)}, ID/date of birth: ${asText(d.tenantId, '—')}, address: ${asText(d.tenantAddress)}`,
        d.tenantOP ? `Tenant ID card no.: ${asText(d.tenantOP)}` : '',
        d.tenantEmail ? `Tenant e-mail: ${asText(d.tenantEmail)}` : '',
        d.tenantPhone ? `Tenant phone: ${asText(d.tenantPhone)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. SUBJECT OF THE LEASE',
      body: [
        `The landlord lets the tenant use for consideration the apartment at: ${propertyAddress}.`,
        `Layout: ${propertyLayout}.`,
        d.flatUnitNumber ? `Unit number: ${asText(d.flatUnitNumber)}.` : '',
        d.cadastralArea
          ? `Cadastral area: ${asText(d.cadastralArea)}, parcel no.: ${asText(d.parcelNumber, 'not stated')}.`
          : '',
        d.ownershipSheet ? `Land registry sheet no.: ${asText(d.ownershipSheet)}.` : '',
        d.floor ? `Floor: ${asText(d.floor)}.` : '',
        d.flatArea || d.approxArea ? `Floor area: ${asText(d.flatArea || d.approxArea)} m².` : '',
        'The landlord declares that they are entitled to let the apartment and that no legal or factual obstacles preventing proper use are known.',
        'The tenant confirms having inspected the apartment before signing; condition is described in the handover protocol.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. TERM',
      body: [
        `The lease is agreed for: ${leaseDuration}.`,
        d.startDate ? `Lease start: ${formatDate(d.startDate)}.` : '',
        d.handoverDate ? `Physical handover date: ${formatDate(d.handoverDate)}.` : '',
        isFixedTerm
          ? 'The lease ends when the fixed term expires unless the parties agree otherwise in writing. Early termination is only on statutory grounds or as set out herein.'
          : 'The tenant may terminate with three months’ notice without stating a reason. The landlord may terminate with three months’ notice only on statutory grounds (Section 2288 Civil Code).',
      ].filter(Boolean) as string[],
    },
    {
      title: 'IV. RENT AND SERVICE CHARGES',
      body: [
        `Monthly rent: CZK ${formatAmount(d.rentAmount)}.`,
        hasUtilities
          ? `Monthly advance for services related to use of the apartment: CZK ${formatAmount(utilitiesAmount)}.`
          : 'No separate monthly advance for services was agreed; the tenant pays service providers directly or based on the landlord’s billing.',
        hasUtilities ? `Total monthly payment (rent + advances): CZK ${formatAmount(monthlyTotal)}.` : '',
        `Rent${hasUtilities ? ' and service advances are' : ' is'} due by the ${paymentDay}th day of each month in advance.`,
        d.bankAccount ? `Landlord bank account: ${asText(d.bankAccount)}.` : '',
        d.variableSymbol ? `Variable symbol: ${asText(d.variableSymbol)}.` : '',
        d.utilitiesIncludedText
          ? `Services covered by advances: ${asText(d.utilitiesIncludedText)}.`
          : hasUtilities
            ? 'Advances typically cover water, heating, common areas and waste — per actual costs.'
            : '',
        hasUtilities
          ? 'The landlord shall bill actual service costs at least once a year within four months after the billing period (Act No. 67/2013 Coll.).'
          : '',
        useInflationIndexation
          ? 'Rent may be increased annually on 1 April by inflation (Czech Statistical Office CPI) with 30 days’ prior written notice.'
          : 'The landlord may propose a rent increase in line with the Civil Code, including Section 2249; if not agreed, statutory rules apply.',
        'Electricity and gas supplied under the tenant’s own contracts are not part of the service advances.',
        'Late payment attracts statutory default interest under Government Regulation No. 351/2013 Coll.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'V. SECURITY DEPOSIT',
      body: hasDeposit
        ? [
            `Before handover (at latest on signing), the tenant shall pay a deposit of CZK ${formatAmount(d.depositAmount)}${d.rentAmount && Number(d.rentAmount) > 0 ? ` (${Math.round(Number(d.depositAmount) / Number(d.rentAmount))}× monthly rent)` : ''}.`,
            'The deposit secures the landlord’s claims from the lease, especially unpaid rent, service advances, damage and restoration costs beyond normal wear.',
            'The landlord shall return the deposit or balance within one month after termination and vacation, with statutory interest, after proven deductions.',
            'Set-off requires written notice with an itemised list.',
          ]
        : ['No security deposit was agreed between the parties.'],
    },
    {
      title: 'VI. RULES OF USE',
      body: [
        d.maxOccupants
          ? `Maximum permanent occupants: ${asText(d.maxOccupants)} (including the tenant). Changes must be notified promptly.`
          : '',
        `Pets: ${d.allowPets ? 'keeping pets is acknowledged; the tenant is liable for related damage and costs' : 'pets only if they do not cause disproportionate nuisance; the tenant should inform the landlord in advance'}.`,
        `Smoking: ${d.allowSmoking ? 'allowed' : 'prohibited'} in the apartment and common areas.`,
        `Short-term paid letting (Airbnb, Booking.com, etc.) is treated as subletting and is ${d.allowAirbnb ? 'allowed; the tenant bears all risks and legal duties' : 'prohibited without prior written consent'}.`,
        `Business use: ${d.businessUseAllowed ? 'allowed if wear and nuisance stay within ordinary limits' : 'only if wear and nuisance stay ordinary; otherwise prior written consent is required (Section 2255 Civil Code)'}.`,
        d.inspectionAllowed
          ? 'The landlord may inspect the apartment after at least 24 hours’ prior written (e-mail) notice (Section 2219 Civil Code).'
          : 'Landlord access is governed by Section 2219 Civil Code.',
        d.strictPenalties
          ? 'Serious or repeated breaches may lead to notice and, in grave cases, termination without notice under the Civil Code.'
          : '',
        'The tenant shall maintain the apartment, report defects promptly, allow necessary repairs, pay minor repairs under Section 2257, and not alter the apartment without consent.',
        'Subletting part of the apartment is allowed if the tenant lives there; subletting the whole apartment while not living there requires written consent.',
        'The tenant shall provide proof of household insurance covering third-party liability within 7 days if requested.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'VII. HANDOVER AND PROTOCOL',
      body: [
        d.keysCount ? `Keys handed over: ${asText(d.keysCount)} sets.` : '',
        'Key copies require consent; lost keys must be reported; replacement lock costs are borne by the tenant if at fault.',
        d.electricityMeter ? `Electricity meter at handover: ${asText(d.electricityMeter)} kWh.` : '',
        d.gasMeter ? `Gas meter at handover: ${asText(d.gasMeter)} m³.` : '',
        d.waterMeter ? `Cold water meter at handover: ${asText(d.waterMeter)} m³.` : '',
        d.equipmentList ? `Equipment: ${asText(d.equipmentList)}.` : '',
        d.knownDefects
          ? `Known defects: ${asText(d.knownDefects)}.`
          : 'The apartment is handed over without expressly declared defects beyond normal wear.',
        'Detailed handover protocol is Annex No. 1 and forms an integral part of this Agreement.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'VIII. END OF LEASE AND RETURN',
      body: [
        d.duration === 'indefinite'
          ? 'Indefinite lease may be terminated by notice, agreement or as provided by law.'
          : 'Fixed-term lease ends when the term expires; notice is only on statutory grounds.',
        'On termination the tenant shall vacate, remove belongings, return the apartment in the received condition allowing normal wear, return all keys and allow handover protocol.',
        `If the tenant fails to return the apartment on time, a daily penalty of ${asText(d.lateVacatePenalty, 'one day’s rent')} may apply.`,
      ],
    },
    {
      title: 'IX. EMERGENCIES AND REPAIRS',
      body: [
        'The tenant shall report emergencies (water leak, heating failure, etc.) within 24 hours.',
        'The tenant may secure urgent repairs without prior consent and shall inform the landlord immediately.',
        MINOR_REPAIRS_EN,
        'Major repairs and reconstruction are paid by the landlord unless caused by the tenant or their guests.',
      ],
    },
    {
      title: 'X. SERVICE OF DOCUMENTS',
      body: [
        `Notices to the landlord: ${asText(d.landlordAddress)}${d.landlordEmail ? `, e-mail: ${asText(d.landlordEmail)}` : ''}.`,
        `Notices to the tenant: leased apartment ${propertyAddress}${d.tenantEmail ? `, e-mail: ${asText(d.tenantEmail)}` : ''}.`,
        'Changes or termination require personal delivery, registered mail, data box or other provable means. E-mail may be used for operational notices where used long-term.',
        'Refusal or failure to collect mail may constitute deemed delivery under applicable rules.',
      ],
    },
    ...premiumContent,
    {
      title: `${hasPremiumClauses ? 'XIII' : 'XI'}. FINAL PROVISIONS`,
      body: [
        'This Agreement is governed by the law of the Czech Republic, especially the Civil Code and Act No. 67/2013 Coll. on service billing.',
        disputeClauseEn(d),
        'The Agreement is executed in two copies; each party receives one.',
        'Amendments must be in writing, numbered and signed.',
        'Invalidity of one provision does not affect the rest.',
        'Annex No. 1 is the handover protocol.',
        'Change of ownership does not terminate the lease; the acquirer steps into the landlord’s position (Section 2221 Civil Code).',
        'Neither party is liable for non-monetary failure caused by force majeure (Section 2913(2) Civil Code); monetary obligations remain due.',
      ],
    },
    {
      title: `${hasPremiumClauses ? 'XIV' : 'XII'}. SIGNATURES`,
      body: [],
    },
    {
      title: 'ANNEX NO. 1 – EXPLANATORY HANDOVER PROTOCOL SUMMARY',
      body: [
        'This is an explanatory English summary of handover information. The primary handover protocol attached to the Czech lease may use a separate structured form; where details differ, the Czech version prevails.',
        `Apartment: ${propertyAddress}`,
        `Landlord: ${asText(d.landlordName)} · Tenant: ${asText(d.tenantName)}`,
        `Handover date: ${formatDate(d.handoverDate)}`,
        d.electricityMeter
          ? `Electricity (${asText(d.electricityMeterSerial, '—')}): ${asText(d.electricityMeter)} kWh`
          : '',
        d.gasMeter ? `Gas (${asText(d.gasMeterSerial, '—')}): ${asText(d.gasMeter)} m³` : '',
        d.waterMeter ? `Cold water (${asText(d.waterMeterSerial, '—')}): ${asText(d.waterMeter)} m³` : '',
        d.hotWaterMeter ? `Hot water (${asText(d.hotWaterMeterSerial, '—')}): ${asText(d.hotWaterMeter)} m³` : '',
        d.keysCount ? `Keys: ${asText(d.keysCount)}` : '',
        d.equipmentList ? `Equipment: ${asText(d.equipmentList)}` : '',
        d.knownDefects ? `Defects/notes: ${asText(d.knownDefects)}` : 'No declared defects beyond normal wear.',
      ].filter(Boolean) as string[],
    },
  ];

  return sections;
}
