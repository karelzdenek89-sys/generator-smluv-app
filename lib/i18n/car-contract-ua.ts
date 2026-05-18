import type { ContractSection, StoredContractData } from '@/lib/contracts';
import { resolveTierFeatures } from '@/lib/contracts';
import { asText, disputeClauseUa, formatAmountCs, formatDateCs, today } from '@/lib/i18n/expat-contract-helpers';

/** Пояснювальний переклад купівлі авто — не офіційний. */
export function buildCarContractSectionsUa(d: StoredContractData): ContractSection[] {
  const { hasPremiumClauses } = resolveTierFeatures(d);
  const price = Number(d.priceAmount ?? d.purchasePrice ?? 0);
  const cashOverLimit = d.paymentMethod === 'cash' && price > 270000;
  const paymentText =
    d.paymentMethod === 'cash'
      ? cashOverLimit
        ? 'Ціна понад 270 000 Kč — готівка заборонена (закон № 254/2004 Зб.).'
        : 'Готівка при підписі/передачі; понад 270 000 Kč — лише переказ.'
      : d.bankAccount
        ? `Переказ на ${asText(d.bankAccount)} протягом ${asText(d.paymentDueDays, '3')} роб. днів.`
        : `Банківський переказ протягом ${asText(d.paymentDueDays, '3')} роб. днів.`;

  const ownershipTransfer =
    d.ownershipTransferMoment === 'payment'
      ? 'Власність переходить після повної оплати.'
      : 'Власність переходить при фізичній передачі авто.';

  const sections: ContractSection[] = [
    {
      title: 'ПРЕАМБУЛА',
      body: [
        'Купівельна угода на авто за § 2079 та наст. цивільного кодексу ЧР.',
        `Дата: ${d.contractDate ? formatDateCs(d.contractDate) : today()}`,
      ],
    },
    {
      title: 'I. СТОРОНИ',
      body: [
        `Продавець: ${asText(d.sellerName)}, ${asText(d.sellerId, '—')}, ${asText(d.sellerAddress)}`,
        `Покупець: ${asText(d.buyerName)}, ${asText(d.buyerId, '—')}, ${asText(d.buyerAddress)}`,
      ],
    },
    {
      title: 'II. АВТО',
      body: [
        `${asText(d.carMake)} ${asText(d.carModel, '')}`.trim(),
        d.carVIN ? `VIN: ${asText(d.carVIN)}` : '',
        d.carPlate ? `Номер: ${asText(d.carPlate)}` : '',
        d.carMileage ? `Пробіг: ${formatAmountCs(d.carMileage)} km` : '',
        d.knownDefects ? `Вади: ${asText(d.knownDefects)}` : 'Прихованих вад продавець не знає.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. ЦІНА',
      body: [`Ціна: ${formatAmountCs(d.priceAmount ?? d.purchasePrice)} Kč.`, paymentText, ownershipTransfer],
    },
    {
      title: 'IV. ПЕРЕДАЧА',
      body: [
        `Дата: ${formatDateCs(d.handoverDate, 'при підписі')}.`,
        'Покупець реєструє авто та страхує після переходу власності.',
      ],
    },
    {
      title: `${hasPremiumClauses ? 'IX' : 'V'}. ЗАКЛЮЧНІ ПОЛОЖЕННЯ`,
      body: [
        'Цивільний кодекс ЧР; для споживачів — особливий захист.',
        disputeClauseUa(d),
        'Два примірники.',
        'Продавець заявляє про відсутність застави/виконавчого провадження.',
        'GDPR.',
        'Форс-мажор § 2913(2) OZ.',
      ],
    },
    { title: `${hasPremiumClauses ? 'X' : 'VI'}. ПІДПИСИ`, body: [] },
  ];

  return sections;
}
