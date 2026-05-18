import type { ContractSection, StoredContractData } from '@/lib/contracts';
import { resolveTierFeatures } from '@/lib/contracts';
import {
  asText,
  disputeClauseLaborUa,
  DPP_HOURS_LIMIT_UA,
  DPP_THRESHOLD_NOTE_UA,
  formatAmountCs,
  formatDateCs,
  today,
} from '@/lib/i18n/expat-contract-helpers';
import { EMPLOYMENT_WORK_ELIGIBILITY_NOTICE_UK } from '@/lib/i18n/safety-copy';

/** Пояснювальний український огляд основних умов чеської DPP — не повний переклад. */
export function buildDppContractSectionsUa(d: StoredContractData): ContractSection[] {
  const { hasPremiumClauses } = resolveTierFeatures(d);
  const remunerationDesc =
    d.remunerationType === 'hourly'
      ? `Винагорода: ${formatAmountCs(d.hourlyRate)} Kč/год за фактично відпрацьовані години.`
      : d.remunerationType === 'fixed' || d.totalRemuneration
        ? `Фіксована винагорода за завдання: ${formatAmountCs(d.totalRemuneration)} Kč після виконання.`
        : 'Розмір винагороди погоджується письмово до початку роботи.';

  const premiumContent: ContractSection[] = hasPremiumClauses
    ? [
        {
          title: 'VI. КОНФІДЕНЦІЙНІСТЬ',
          body: [
            'Працівник зберігає конфіденційність комерційної та персональної інформації.',
            'Обов’язок діє 2 роки після завершення угоди.',
            'Відповідальність — § 257 трудового кодексу; штрафи на шкоду працівника не погоджуються (§ 346d).',
            'Після завершення — повернення документів і видалення даних з приватних пристроїв.',
          ],
        },
        {
          title: 'VII. ІНТЕЛЕКТУАЛЬНА ВЛАСНІСТЬ',
          body: [
            'Результати роботи — твори найманого працівника; майнові права належать роботодавцю.',
            'Згода на зміни та використання в межах звичайної діяльності роботодавця.',
            'Код і know-how передаються до дати завершення.',
          ],
        },
        {
          title: 'VIII. ВІДПОВІДАЛЬНІСТЬ',
          body: [
            'Неналежне виконання без вагомої причини з боку роботодавця — відшкодування шкоди (§ 257).',
            'Роботодавець може заявити зауваження до якості протягом 5 робочих днів.',
            'Без договірних штрафів на шкоду працівника.',
          ],
        },
      ]
    : [];

  const sections: ContractSection[] = [
    {
      title: 'ПРЕАМБУЛА',
      body: [
        'Договір про виконання роботи (DPP) укладено згідно з § 75 та наст. трудового кодексу ЧР № 262/2006 Зб.',
        `Дата: ${d.contractDate ? formatDateCs(d.contractDate) : today()}`,
        DPP_HOURS_LIMIT_UA,
        'У разі розбіжностей між цим оглядом і чеським текстом перевага має чеське формулювання.',
        EMPLOYMENT_WORK_ELIGIBILITY_NOTICE_UK,
      ],
    },
    {
      title: 'I. СТОРОНИ',
      body: [
        `Роботодавець: ${asText(d.employerName)}, IČO: ${asText(d.employerIco, '—')}, ${asText(d.employerAddress)}`,
        d.employerEmail ? `E-mail: ${asText(d.employerEmail)}` : '',
        `Працівник: ${asText(d.employeeName)}, нар.: ${asText(d.employeeBirth, '—')}, ${asText(d.employeeAddress)}`,
        d.employeeEmail ? `E-mail: ${asText(d.employeeEmail)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. ЗАВДАННЯ',
      body: [
        `Робота: ${asText(d.taskDescription, 'не вказано')}`,
        d.taskDetails ? `Деталі: ${asText(d.taskDetails)}` : '',
        `Місце: ${asText(d.workPlace, 'не вказано')}`,
        `Орієнтовно: ${asText(d.estimatedHours, '—')} год.`,
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. СТРОК І ПРИПИНЕННЯ',
      body: [
        `Строк: ${d.durationType === 'fixed' && d.startDate && d.endDate ? `визначений ${formatDateCs(d.startDate)} – ${formatDateCs(d.endDate)}` : 'невизначений'}`,
        d.deadline ? `Кінцевий термін завдання: ${asText(d.deadline)}` : '',
        'Сторона може розірвати з 15-денним попередженням, якщо не погоджено інакше; також припинення законом після виконання завдання.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'IV. ВИНАГОРОДА',
      body: [
        remunerationDesc,
        DPP_THRESHOLD_NOTE_UA,
        d.paymentAccount
          ? `Виплата на рахунок ${asText(d.paymentAccount)} протягом ${asText(d.paymentDays, '15')} днів.`
          : 'Виплата готівкою або переказом за домовленістю.',
      ],
    },
    {
      title: 'V. УМОВИ ВИКОНАННЯ',
      body: [
        'Робота виконується особисто, належним чином, за вказівками роботодавця.',
        'Правила робочого часу основного трудового договору (hlavní pracovní poměr — «основна робота») застосовуються обмежено (§ 77(2)).',
        'Можлива віддалена робота, якщо дозволяє характер завдання та захист конфіденційності.',
      ],
    },
    ...premiumContent,
    {
      title: `${hasPremiumClauses ? 'IX' : 'VI'}. ЗАКЛЮЧНІ ПОЛОЖЕННЯ`,
      body: [
        'Регулюється трудовим та цивільним кодексом ЧР.',
        disputeClauseLaborUa(),
        'Два примірники — по одному стороні (§ 77(1)).',
        'Зміни письмово, з нумерацією та підписами.',
        'Персональні дані — GDPR та § 316.',
        'Форс-мажор — § 2913(2) OZ; грошові зобов’язання залишаються.',
      ],
    },
    { title: `${hasPremiumClauses ? 'X' : 'VII'}. ПІДПИСИ`, body: [] },
  ];

  return sections;
}
