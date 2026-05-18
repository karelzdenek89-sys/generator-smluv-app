import type { ContractSection, StoredContractData } from '@/lib/contracts';
import { resolveTierFeatures } from '@/lib/contracts';
import {
  asText,
  disputeClauseLaborUa,
  DPP_HOURS_LIMIT_UA,
  DPP_THRESHOLD_NOTE_UA,
  DPP_VACATION_NOTE_UA,
  formatAmountCs,
  formatDateCs,
  today,
} from '@/lib/i18n/expat-contract-helpers';
import { EMPLOYMENT_WORK_ELIGIBILITY_NOTICE_UK } from '@/lib/i18n/safety-copy';

function dppToolsClauseUa(d: StoredContractData): string {
  if (d.toolsProvided === 'employer') {
    return 'Робочі інструменти, засоби та обладнання забезпечує роботодавець.';
  }
  if (d.toolsProvided === 'employee') {
    return 'Працівник забезпечує інструменти власним коштом; відшкодування витрат — лише за попередньою письмовою згодою роботодавця.';
  }
  return 'Робочі інструменти та обладнання сторони забезпечують за взаємною домовленістю.';
}

/** Пояснювальний український огляд основних умов чеської DPP — не повний переклад. */
export function buildDppContractSectionsUa(d: StoredContractData): ContractSection[] {
  const { hasPremiumClauses } = resolveTierFeatures(d);
  const remunerationDesc =
    d.remunerationType === 'hourly'
      ? `Винагорода: ${formatAmountCs(d.hourlyRate)} Kč/год за фактично відпрацьовані години.`
      : d.remunerationType === 'fixed' || d.totalRemuneration
        ? `Фіксована винагорода за завдання: ${formatAmountCs(d.totalRemuneration)} Kč, виплата після виконання.`
        : 'Розмір винагороди погоджується письмово до початку роботи.';

  const premiumContent: ContractSection[] = hasPremiumClauses
    ? [
        {
          title: 'VI. КОНФІДЕНЦІЙНІСТЬ',
          body: [
            'Працівник зберігає конфіденційність комерційної та персональної інформації, отриманої під час виконання договору.',
            'Обов’язок діє 2 роки після завершення договору.',
            'Відповідальність — § 257 трудового кодексу; договірні штрафи на шкоду працівника не погоджуються (§ 346d).',
            'Після завершення — повернення документів і видалення даних з приватних пристроїв.',
          ],
        },
        {
          title: 'VII. ІНТЕЛЕКТУАЛЬНА ВЛАСНІСТЬ',
          body: [
            'Результати роботи — твори найманого працівника; майнові права належать роботодавцю.',
            'Згода на зміни та використання в межах звичайної діяльності роботодавця.',
            'Код і know-how передаються не пізніше ніж у день завершення договору.',
          ],
        },
        {
          title: 'VIII. ВІДПОВІДАЛЬНІСТЬ',
          body: [
            'Неналежне виконання без вагомої причини з боку роботодавця — відшкодування шкоди (§ 257).',
            'Роботодавець може заявити зауваження до якості протягом 5 робочих днів і вимагати усунення недоліків протягом 10 робочих днів.',
            'Без договірних штрафів на шкоду працівника; можлива лише законна компенсація доведеної шкоди.',
          ],
        },
      ]
    : [];

  const sections: ContractSection[] = [
    {
      title: 'ПРЕАМБУЛА',
      body: [
        'Договір про виконання роботи (DPP) укладено згідно з § 75 та наст. трудового кодексу ЧР № 262/2006 Зб.',
        `Дата укладення: ${d.contractDate ? formatDateCs(d.contractDate) : today()}`,
        DPP_HOURS_LIMIT_UA,
        'У разі розбіжностей між цим оглядом і чеським текстом договору перевага має чеське формулювання.',
        EMPLOYMENT_WORK_ELIGIBILITY_NOTICE_UK,
      ],
    },
    {
      title: 'I. СТОРОНИ',
      body: [
        `Роботодавець: ${asText(d.employerName)}, IČO: ${asText(d.employerIco, '—')}, ${asText(d.employerAddress)}`,
        d.employerEmail ? `E-mail роботодавця: ${asText(d.employerEmail)}` : '',
        `Працівник: ${asText(d.employeeName)}, дата народження: ${d.employeeBirth ? formatDateCs(d.employeeBirth) : '—'}, ${asText(d.employeeAddress)}`,
        d.employeeEmail ? `E-mail працівника: ${asText(d.employeeEmail)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. ЗАВДАННЯ',
      body: [
        `Опис роботи: ${asText(d.taskDescription, 'не вказано')}`,
        d.taskDetails ? `Деталі: ${asText(d.taskDetails)}` : '',
        `Місце виконання: ${asText(d.workPlace, 'не вказано')}`,
        `Орієнтовний обсяг: ${asText(d.estimatedHours, '—')} годин (макс. 300 год./рік у одного роботодавця).`,
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. СТРОК І ПРИПИНЕННЯ',
      body: [
        `Строк дії: ${d.durationType === 'fixed' && d.startDate && d.endDate ? `визначений з ${formatDateCs(d.startDate)} по ${formatDateCs(d.endDate)}` : 'невизначений'}`,
        d.deadline ? `Кінцевий термін виконання завдання: ${formatDateCs(d.deadline)}` : '',
        'Договір можна припинити письмовою згодою сторін.',
        'Якщо не погоджено інакше, кожна сторона може розірвати договір з 15-денним попереднім повідомленням (з дня вручення другій стороні).',
        'Договір також припиняється після виконання завдання, зі спливом строку, за згодою сторін або на інших підставах, передбачених законом.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'IV. ВИНАГОРОДА',
      body: [
        remunerationDesc,
        'Винагорода за DPP зазвичай не підлягає соціальному та медичному страхуванню, якщо місячний дохід у одного роботодавця не перевищує законний поріг.',
        DPP_THRESHOLD_NOTE_UA,
        d.paymentAccount
          ? `Виплата на рахунок ${asText(d.paymentAccount)} протягом ${asText(d.paymentDays, '15')} днів після виконання / наприкінці місяця.`
          : 'Виплата готівкою або банківським переказом за домовленістю.',
      ],
    },
    {
      title: 'V. УМОВИ ВИКОНАННЯ',
      body: [
        'Робота виконується особисто, належним чином і за вказівками роботодавця.',
        'Правила робочого часу основного трудового договору (hlavní pracovní poměr — «основна робота») застосовуються лише обмежено (§ 77(2)).',
        DPP_VACATION_NOTE_UA,
        'Роботодавець заздалегідь складає письмовий розклад змін і повідомляє працівника не пізніше ніж за 3 дні до початку зміни, якщо сторони письмово не домовилися інакше.',
        'Робота може виконуватися в офісі роботодавця, за погодженим місцем або дистанційно, якщо це дозволяє характер завдання та дотримання конфіденційності й безпеки даних.',
        dppToolsClauseUa(d),
      ],
    },
    ...premiumContent,
    {
      title: `${hasPremiumClauses ? 'IX' : 'VI'}. ЗАКЛЮЧНІ ПОЛОЖЕННЯ`,
      body: [
        'Договір регулюється трудовим кодексом ЧР та субсидіарно цивільним кодексом (OZ).',
        disputeClauseLaborUa(),
        'Договір складається у двох примірниках; кожна сторона отримує по одному (§ 77(1)).',
        'Зміни дійсні лише у письмовій формі, з нумерацією та підписами.',
        'Недійсність окремого положення не впливає на чинність решти договору.',
        'Персональні дані обробляються згідно з GDPR, законом № 110/2019 Зб. та § 316 трудового кодексу; працівник має права доступу, виправлення, видалення та скарги до UOOU (www.uoou.cz).',
        'Форс-мажор (§ 2913(2) OZ) звільняє від відповідальності за негрошові зобов’язання; грошові зобов’язання залишаються. Постраждала сторона негайно письмово інформує другу сторону.',
      ],
    },
    { title: `${hasPremiumClauses ? 'X' : 'VII'}. ПІДПИСИ`, body: [] },
  ];

  return sections;
}
