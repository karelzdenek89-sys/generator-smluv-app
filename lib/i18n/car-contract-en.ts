import type { ContractSection, StoredContractData } from '@/lib/contracts';
import { resolveTierFeatures } from '@/lib/contracts';
import { asText, disputeClauseEn, formatAmount, formatDate, today } from '@/lib/i18n/expat-contract-helpers';

/** Explanatory English translation of Czech vehicle sale — not certified or official. */
export function buildCarContractSectionsEn(d: StoredContractData): ContractSection[] {
  const { hasPremiumClauses } = resolveTierFeatures(d);
  const price = Number(d.priceAmount ?? d.purchasePrice ?? 0);
  const cashOverLimit = d.paymentMethod === 'cash' && price > 270000;
  const paymentText =
    d.paymentMethod === 'cash'
      ? cashOverLimit
        ? 'Price exceeds CZK 270,000; cash payment is excluded (Act No. 254/2004 Coll.). Use bank transfer.'
        : 'Cash on signing / handover; cash over CZK 270,000 is prohibited.'
      : d.bankAccount
        ? `Bank transfer to ${asText(d.bankAccount)} within ${asText(d.paymentDueDays, '3')} business days.`
        : `Bank transfer within ${asText(d.paymentDueDays, '3')} business days.`;

  const ownershipTransfer =
    d.ownershipTransferMoment === 'payment'
      ? 'Title passes when price is paid in full.'
      : 'Title passes on physical handover of the vehicle.';

  const sections: ContractSection[] = [
    {
      title: 'PREAMBLE',
      body: [
        'This vehicle purchase agreement is under Sections 2079 et seq. of Act No. 89/2012 Coll., the Civil Code.',
        `Date: ${d.contractDate ? formatDate(d.contractDate) : today()}`,
      ],
    },
    {
      title: 'I. PARTIES',
      body: [
        `Seller: ${asText(d.sellerName)}, ID: ${asText(d.sellerId, '—')}, ${asText(d.sellerAddress)}`,
        `Buyer: ${asText(d.buyerName)}, ID: ${asText(d.buyerId, '—')}, ${asText(d.buyerAddress)}`,
      ],
    },
    {
      title: 'II. VEHICLE',
      body: [
        `Make/model: ${asText(d.carMake)} ${asText(d.carModel, '')}`.trim(),
        d.carVIN ? `VIN: ${asText(d.carVIN)}` : '',
        d.carPlate ? `Plate: ${asText(d.carPlate)}` : '',
        d.carMileage ? `Mileage: ${formatAmount(d.carMileage)} km` : '',
        d.knownDefects
          ? `Known defects: ${asText(d.knownDefects)}`
          : 'Seller declares no known hidden defects beyond stated condition.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. PRICE AND PAYMENT',
      body: [
        `Purchase price: CZK ${formatAmount(d.priceAmount ?? d.purchasePrice)}.`,
        paymentText,
        ownershipTransfer,
      ],
    },
    {
      title: 'IV. HANDOVER',
      body: [
        `Handover date: ${formatDate(d.handoverDate, 'on signing')}.`,
        d.keysCount ? `Keys: ${asText(d.keysCount)}.` : '',
        'The parties shall apply for registration of the ownership change within 10 working days. The buyer shall arrange compulsory liability insurance without any coverage gap before using or registering the vehicle; the seller’s insurance does not transfer.',
      ].filter(Boolean) as string[],
    },
    {
      title: `${hasPremiumClauses ? 'IX' : 'V'}. FINAL PROVISIONS`,
      body: [
        'Governed by the Civil Code; consumer protection may apply to consumers.',
        disputeClauseEn(d),
        'Two copies; amendments in writing.',
        'Seller declares no execution, lien or disposition restriction known to them.',
        'Force majeure under Section 2913(2) Civil Code.',
      ],
    },
    { title: `${hasPremiumClauses ? 'X' : 'VI'}. SIGNATURES`, body: [] },
  ];

  return sections;
}
