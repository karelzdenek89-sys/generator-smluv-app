import type { ContractSection, StoredContractData } from '@/lib/contracts';
import { resolveTierFeatures } from '@/lib/contracts';
import {
  asText,
  disputeClauseLaborUa,
  formatAmount,
  formatDate,
  pluralMonthsUa,
  today,
} from '@/lib/i18n/expat-contract-helpers';
import { ZP_TRIAL_MONTHS_LEADERSHIP, ZP_TRIAL_MONTHS_STANDARD } from '@/lib/legal-constants-2026';

/** Пояснювальний український переклад чеського трудового договору — не офіційний. */
export function buildEmploymentContractSectionsUa(d: StoredContractData): ContractSection[] {
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
      ? `Випробувальний строк ${pluralMonthsUa(effectiveTrialMonths)} з дня початку роботи (§ 35 трудового кодексу ЧР у редакції закону № 120/2025 Зб.). Для строкового договору випробування не більше половини строку. Під час випробування кожна сторона може припинити відносини в будь-який час, навіть без причини.`
      : 'Випробувальний строк не погоджується.';

  const durationClause =
    d.employmentType === 'fixed'
      ? `на строк до ${formatDate(d.endDate, 'не вказано')}`
      : 'на невизначений строк';

  const salaryDesc =
    d.salaryType === 'monthly'
      ? `Брутто-зарплата: ${formatAmount(d.salary)} Kč на місяць. Виплата до ${asText(d.payDay, '15')}-го числа наступного місяця на рахунок працівника.`
      : `Погодинна ставка: ${formatAmount(d.hourlyRate)} Kč/год брутто.`;

  const workTimeClause = d.workHours
    ? `Тижневий робочий час: ${asText(d.workHours)} год. Графік: ${asText(d.workSchedule, 'пн–пт, 8:00–17:00')}.`
    : 'Тижневий робочий час 40 годин (§ 79 трудового кодексу ЧР). Графік: пн–пт, 8:00–17:00.';

  const premiumContent: ContractSection[] = hasPremiumClauses
    ? [
        ...(d.nonCompete
          ? [
              {
                title: 'VIII. КОНКУРЕНТНА УГОДА',
                body: [
                  `Працівник зобов’язується ${asText(d.nonCompetePeriod, '12')} місяців після звільнення не займатися діяльністю, що конкурує з роботодавцем (§ 310 трудового кодексу ЧР).`,
                  'За дотримання обмеження належить грошова компенсація щонайменше половини середньомісячного заробітку за кожен місяць.',
                  'Обмеження визначене за предметом, часом і територією. Роботодавець може відкликати угоду під час роботи (§ 310(4)).',
                  'Порушення — повернення компенсації за відповідні місяці та відшкодування доведеної шкоди.',
                ],
              },
            ]
          : []),
        {
          title: 'IX. КОНФІДЕНЦІЙНІСТЬ',
          body: [
            'Працівник зберігає конфіденційність щодо інформації, отриманої під час роботи.',
            'Обов’язок діє під час роботи та 3 роки після її завершення.',
            'Відповідальність за шкоду — § 257 трудового кодексу ЧР. Договірні штрафи на шкоду працівника не погоджуються (§ 346d).',
          ],
        },
      ]
    : [];

  const sections: ContractSection[] = [
    {
      title: 'ПРЕАМБУЛА',
      body: [
        'Цей трудовий договір укладено згідно з § 34 та наст. закону ЧР № 262/2006 Зб. (трудовий кодекс).',
        `Дата укладення: ${d.contractDate ? formatDate(d.contractDate) : today()}`,
      ],
    },
    {
      title: 'I. СТОРОНИ',
      body: [
        `Роботодавець: ${asText(d.employerName)}, IČO: ${asText(d.employerIco, '—')}, адреса: ${asText(d.employerAddress)}`,
        d.employerEmail ? `E-mail роботодавця: ${asText(d.employerEmail)}` : '',
        `Працівник: ${asText(d.employeeName)}, нар.: ${asText(d.employeeBirth, '—')}, адреса: ${asText(d.employeeAddress)}`,
        d.employeeEmail ? `E-mail працівника: ${asText(d.employeeEmail)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. ВИД І МІСЦЕ РОБОТИ',
      body: [
        `Посада / вид роботи: ${asText(d.jobTitle, 'не вказано')}`,
        `Опис: ${asText(d.jobDescription, 'згідно з описом посади')}`,
        `Місце виконання: ${asText(d.workPlace, 'не вказано')}`,
        d.remoteWork ? `Віддалена робота: ${asText(d.remoteWork)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. ПОЧАТОК І СТРОК',
      body: [
        `Вихід на роботу: ${formatDate(d.startDate, 'не вказано')}`,
        `Трудові відносини ${durationClause}.`,
        trialPeriodClause,
      ],
    },
    {
      title: 'IV. РОБОЧИЙ ЧАС',
      body: [
        workTimeClause,
        `Перерва: ${asText(d.breakMinutes, '30')} хв (§ 88).`,
        `Відпустка: ${asText(d.vacationWeeks, '4')} тижні на рік (§ 212).`,
      ],
    },
    {
      title: 'V. ЗАРПЛАТА',
      body: [
        salaryDesc,
        d.bonusDesc ? `Можливі бонуси: ${asText(d.bonusDesc)}.` : '',
        'Роботодавець надає письмову розрахункову відомість.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'VI. ОБОВ’ЯЗКИ ПРАЦІВНИКА',
      body: [
        'Працівник зобов’язується:',
        'a) особисто виконувати роботу та дотримуватися робочого часу,',
        'b) дотримуватися BOZP та внутрішніх правил,',
        'c) повідомляти про перешкоди в роботі,',
        'd) зберігати конфіденційність,',
        'e) берегти майно роботодавця, не вживати алкоголь/наркотики на роботі.',
      ],
    },
    {
      title: 'VII. ПРИПИНЕННЯ',
      body: [
        'Припинення: за згодою, з попередженням, негайно або зі спливом строку (§ 48).',
        `Строк попередження: ${asText(d.noticePeriod, '2')} місяці з першого дня місяця після вручення (§ 51).`,
        'Попередження роботодавця — з підставами (§ 52); працівника — з будь-якої причини або без неї.',
      ],
    },
    ...premiumContent,
    {
      title: `${hasPremiumClauses ? 'X' : 'VIII'}. ЗАКЛЮЧНІ ПОЛОЖЕННЯ`,
      body: [
        'Договір регулюється трудовим кодексом ЧР та субсидіарно цивільним кодексом.',
        'Договір має бути укладений до початку роботи (§ 34(3)).',
        disputeClauseLaborUa(),
        'Два примірники — по одному кожній стороні (§ 37).',
        'Зміни лише письмово, з нумерацією та підписами (§ 564 OZ).',
        'Недійсність окремого положення не впливає на решту.',
        'Персональні дані — GDPR, закон № 110/2019 Зб., § 316 трудового кодексу.',
        'Форс-мажор (§ 2913(2) OZ) — без відповідальності за негрошові зобов’язання; грошові залишаються.',
      ],
    },
    { title: `${hasPremiumClauses ? 'XI' : 'IX'}. ПІДПИСИ`, body: [] },
  ];

  return sections;
}
