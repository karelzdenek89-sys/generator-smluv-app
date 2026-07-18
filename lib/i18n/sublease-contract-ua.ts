import type { ContractSection, StoredContractData } from '@/lib/contracts';
import { resolveTierFeatures } from '@/lib/contracts';
import { asText, disputeClauseUa, formatAmountCs, formatDateCs, today } from '@/lib/i18n/expat-contract-helpers';

function yesNoUa(value: unknown, yes: string, no: string): string {
  return value === true || value === 'yes' ? yes : no;
}

/** Пояснювальний переклад піднайму — не офіційний. */
export function buildSubleaseContractSectionsUa(d: StoredContractData): ContractSection[] {
  const { hasPremiumClauses } = resolveTierFeatures(d);
  const consentNote =
    d.landlordConsent === 'yes'
      ? `Згода орендодавця на піднайм надана письмово ${asText(d.consentDate, 'не вказано')}.`
      : 'За потреби орендар має отримати згоду власника перед піднаймом (§ 2274–2275 цивільного кодексу ЧР).';

  const sections: ContractSection[] = [
    {
      title: 'ПРЕАМБУЛА',
      body: [
        'Договір піднайму за § 2274 та наст. цивільного кодексу ЧР № 89/2012 Зб.',
        consentNote,
        `Дата: ${d.contractDate ? formatDateCs(d.contractDate) : today()}`,
      ],
    },
    {
      title: 'I. СТОРОНИ',
      body: [
        `Орендар (підорендодавець): ${asText(d.landlordName)}, ${asText(d.landlordId, '—')}, ${asText(d.landlordAddress)}`,
        d.landlordEmail ? `E-mail: ${asText(d.landlordEmail)}` : '',
        `Підорендар: ${asText(d.tenantName)}, ${asText(d.tenantId, '—')}, ${asText(d.tenantAddress)}`,
        d.tenantEmail ? `E-mail: ${asText(d.tenantEmail)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. ПРЕДМЕТ',
      body: [
        `Приміщення: ${asText(d.flatAddress, 'не вказано')}, ${asText(d.flatLayout, '')}.`,
        d.subleaseArea ? `Площа: ${asText(d.subleaseArea)} m².` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. СТРОК',
      body: [
        d.duration === 'fixed'
          ? `Строковий: ${formatDateCs(d.startDate)} – ${formatDateCs(d.endDate)}.`
          : `Безстроковий з ${formatDateCs(d.startDate)}.`,
        d.duration === 'indefinite' ? `Попередження: ${asText(d.noticePeriod, '3')} міс.` : '',
        'Піднайм припиняється з основною орендою.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'IV. ПЛАТІ',
      body: [
        `Підоренда: ${formatAmountCs(d.rentAmount)} Kč/міс.`,
        d.utilityAmount ? `Комунальні аванси: ${formatAmountCs(d.utilityAmount)} Kč.` : '',
        d.depositAmount ? `Грошова застава (кауція): ${formatAmountCs(d.depositAmount)} Kč, повернення за 30 днів.` : '',
        `До ${asText(d.paymentDay, '15')}-го числа${d.bankAccount ? `, рахунок ${asText(d.bankAccount)}` : ''}.`,
      ].filter(Boolean) as string[],
    },
    {
      title: 'V. ПРАВИЛА',
      body: [
        'Дбайливе користування, без змін без згоди, дотримання правил будинку.',
        `Макс. осіб: ${asText(d.maxOccupants, '2')}.`,
        `Тварини: ${d.allowPets ? 'дозволено з відповідальністю за шкоду' : 'лише без надмірних незручностей'}.`,
        `Куріння: ${yesNoUa(d.allowSmoking, 'дозволено', 'заборонено')}.`,
        `Короткостроковий піднайм: ${yesNoUa(d.allowAirbnb, 'дозволено', 'заборонено')}.`,
      ],
    },
    {
      title: 'VI. ПЕРЕДАЧА',
      body: [
        `Дата: ${formatDateCs(d.handoverDate)}. Ключі: ${asText(d.keysCount, '1')}.`,
        d.knownDefects ? `Вади: ${asText(d.knownDefects)}.` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: `${hasPremiumClauses ? 'XII' : 'IX'}. ЗАКЛЮЧНІ ПОЛОЖЕННЯ`,
      body: [
        'Право Чехії, цивільний кодекс.',
        disputeClauseUa(d),
        'Два примірники; зміни письмово.',
        'Персональні дані — GDPR.',
        'Форс-мажор — § 2913(2) OZ.',
      ],
    },
    { title: `${hasPremiumClauses ? 'XIII' : 'X'}. ПІДПИСИ`, body: [] },
  ];

  return sections;
}
