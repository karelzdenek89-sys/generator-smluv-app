import type { ContractSection, StoredContractData } from '@/lib/contracts';
import { resolveTierFeatures } from '@/lib/contracts';
import { asText, disputeClauseUa, formatDateCs, today } from '@/lib/i18n/expat-contract-helpers';

function scopeDescUa(d: StoredContractData): string {
  switch (d.poaType) {
    case 'property':
      return `правові дії щодо нерухомості: ${asText(d.propertyAddress, 'не вказано')}, включно з купівлею, орендою та кадастром. Для представництва в кадастровому провадженні потрібен офіційно засвідчений підпис довірителя; повноваження на конкретний акт має також відповідати § 441(2) ЦК.`;
    case 'court':
      return `представництво у справі ${asText(d.courtName, '—')}, справа ${asText(d.caseNumber, '—')}. У процесах з обов’язковим адвокатом — лише advokát.`;
    case 'company':
      return `дії як учасник/керівник ${asText(d.companyName, '—')}, IČO ${asText(d.companyIco, '—')}: ${asText(d.companyScope, 'корпоративні дії')}`;
    case 'bank':
      return `банківські дії з рахунком ${asText(d.bankAccount, '—')} у ${asText(d.bankName, '—')}. Банк може вимагати власну форму.`;
    default:
      return asText(d.customScope, 'не вказано');
  }
}

/** Пояснювальний переклад чеської довіреності — не офіційний. */
export function buildPowerOfAttorneyContractSectionsUa(d: StoredContractData): ContractSection[] {
  const { hasPremiumClauses } = resolveTierFeatures(d);
  const validityClause = d.validUntil
    ? `Дійсна до ${asText(d.validUntil)}.`
    : d.singleUse
      ? 'Одноразова: припиняється після виконання повноваження.'
      : 'Дійсна до відкликання довірителем.';

  const sections: ContractSection[] = [
    {
      title: 'ПРЕАМБУЛА',
      body: [
        'Довіреність за § 441–449 цивільного кодексу ЧР № 89/2012 Зб.',
        `Дата: ${d.contractDate ? formatDateCs(d.contractDate) : today()}`,
        'Шаблон з генератора; адресат може вимагати офіційне засвідчення підпису або власну форму, якщо це передбачено законом чи правилами прийняття.',
      ],
    },
    {
      title: 'I. ДОВІРИТЕЛЬ',
      body: [
        `${asText(d.principalName)}, ${asText(d.principalId, '—')}, ${asText(d.principalAddress)}`,
        d.principalEmail ? `E-mail: ${asText(d.principalEmail)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. ПОВІРЕНИЙ',
      body: [
        `${asText(d.agentName)}, ${asText(d.agentId, '—')}, ${asText(d.agentAddress)}`,
        d.agentEmail ? `E-mail: ${asText(d.agentEmail)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. ПОВНОВАЖЕННЯ',
      body: [
        `Довіритель уповноважує: ${scopeDescUa(d)}`,
        d.allowSubstitution ? 'Можлива субституція.' : 'Субституція заборонена.',
      ],
    },
    {
      title: 'IV. СТРОК',
      body: [validityClause, 'Довіритель може відкликати довіреність письмово в будь-який час.'],
    },
    {
      title: `${hasPremiumClauses ? 'VI' : 'V'}. ЗАКЛЮЧНІ ПОЛОЖЕННЯ`,
      body: ['Право Чехії.', disputeClauseUa(d), 'Два примірники.'],
    },
    { title: `${hasPremiumClauses ? 'VII' : 'VI'}. ПІДПИСИ`, body: [] },
  ];

  return sections;
}
