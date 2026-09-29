/**
 * Agreement to perform work (dohoda o provedení práce, DPP) — full EN and UA translations.
 *
 * Mirrors buildDppContractSections in lib/contracts.ts section by section and
 * paragraph by paragraph. Both languages are complete translations; the
 * Ukrainian version is no longer a summary of key terms.
 * scripts/translation-parity-tests.ts enforces the alignment and completeness.
 * The Czech text remains the legally binding version.
 */
import type { ContractSection, StoredContractData } from '../contracts';
import { DPP_MONTHLY_THRESHOLD_2026_CZK, MIN_WAGE_HOURLY_2026_CZK } from '../legal-constants-2026';
import { amt, buildBilingualTranslations, dateIn, disputeClauseIn, todayIn, txt, type ParaPair } from './helpers';

const threshold = DPP_MONTHLY_THRESHOLD_2026_CZK.toLocaleString('cs-CZ');
const minWage = MIN_WAGE_HOURLY_2026_CZK.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ── EN ─────────────────────────────────────────────────────────────────────
function en(d: StoredContractData, hasPremium: boolean): ParaPair[] {
  const remunerationDesc = d.remunerationType === 'hourly'
    ? `The agreed remuneration for performing the work is CZK ${amt(d.hourlyRate)} per hour. The total remuneration will be calculated on the basis of the hours actually worked.`
    : d.remunerationType === 'fixed' || d.totalRemuneration
      ? `The agreed remuneration for performing the entire task/work is CZK ${amt(d.totalRemuneration)}. The remuneration will be paid after the agreed task has been completed.`
      : 'The amount of remuneration will be set by agreement of the contracting parties before the work begins and will be stated in a written addendum to this agreement.';
  const taxNote = `Participation in sickness and pension insurance under a DPP arises when the decisive income from one employer is reached in a calendar month. For 2026, the decisive income for participation of an employee working under an agreement to perform work in sickness and pension insurance is CZK ${threshold} gross per month with one employer. When this amount is reached or exceeded, participation in insurance and the related contribution obligations of the employer arise. In 2026, income without participation arising is therefore below CZK 12,000 (at most CZK 11,999). From 1 July 2026 the employer must register the employee before the work begins; for a Czech employee it may carry out a pre-registration and complete the full registration within 8 days of commencement, whereas a foreign employee must be fully registered before commencement. The employer fulfils further record-keeping and contribution obligations through the Single Monthly Employer Report in accordance with the current methodology of the Czech Social Security Administration (ČSSZ).`;
  const minimumWageNote = `The remuneration for the time actually worked may not be lower than the minimum wage; for 2026 it is at least CZK ${minWage} per hour (§ 111 of the Labour Code).`;

  const premium: ParaPair[] = hasPremium ? [
    {
      title: 'VI. CONFIDENTIALITY AND PROTECTION OF INFORMATION',
      body: [
        'The Employee shall maintain confidentiality about all facts that the Employee learns in the course of performing the agreement and that are marked as confidential or whose nature makes them confidential (business strategy, prices, customer databases, internal processes, personal data of employees and customers).',
        'This duty of confidentiality continues after the end of the agreement for a period of 2 years from its end.',
        'For damage caused by a breach of the duty of confidentiality, the Employee is liable to the extent laid down in § 257 of the Labour Code. A contractual penalty to the detriment of the employee is not agreed in an agreement to perform work (§ 346d of the Labour Code). The Employer is entitled to claim compensation for proven damage to the extent permitted by law.',
        'After the end of the agreement, the Employee shall return all documents, data carriers and other materials containing confidential information and delete confidential information from the Employee’s private devices.',
      ],
    },
    {
      title: 'VII. INTELLECTUAL PROPERTY',
      body: [
        'The results of work (works, creations, software, texts, graphics, databases, etc.) created by the Employee in performing the agreement are employee works within the meaning of § 58 of Act No. 121/2000 Coll., the Copyright Act. The Employer exercises all economic copyrights to these works from the date of their creation.',
        'The Employee grants the Employer consent to the modification, processing, combination with another work, inclusion in a collective work and other changes of the outputs created, to the extent necessary for their customary use by the Employer, unless such a procedure is contrary to good morals or the legitimate moral rights of the author (§ 11 of Act No. 121/2000 Coll., the Copyright Act).',
        'The above also applies to software, algorithms and technical solutions developed by the Employee; the Employee shall hand over the source code, documentation and know-how to the Employer no later than on the day the agreement ends.',
      ],
    },
    {
      title: 'VIII. LIABILITY FOR PROPER PERFORMANCE AND COMPENSATION FOR DAMAGE',
      body: [
        'If the Employee fails to perform the agreed work task properly and on time without a serious reason on the part of the Employer, the Employee is liable for the damage demonstrably incurred by the Employer, to the extent laid down in § 257 of the Labour Code.',
        'If the Employee fails to perform the agreed work task by the agreed deadline or in the appropriate quality, the Employer is entitled to raise a written quality reservation within 5 working days of delivery and to require the defects to be remedied free of charge within 10 working days. If the defect is not remedied even within a reasonable additional period, the Employer is entitled to compensation for proven damage to the extent of § 257 of the Labour Code.',
        'A contractual penalty to the detriment of the employee is not agreed in an agreement to perform work (§ 346d of the Labour Code). The Employer may claim compensation for damage to the extent permitted by law.',
      ],
    },
  ] : [];

  const sections: ParaPair[] = [
    {
      title: 'PREAMBLE',
      body: [
        'This agreement to perform work (the "Agreement") is concluded under § 75 et seq. of Act No. 262/2006 Coll., the Labour Code, as amended (the "Labour Code").',
        `Date of conclusion of the Agreement: ${d.contractDate ? dateIn('en', d.contractDate) : todayIn('en')}`,
        'Notice: the scope of work under an agreement to perform work may not exceed 300 hours in a calendar year with one employer (§ 75(2) of the Labour Code).',
      ],
    },
    {
      title: 'I. CONTRACTING PARTIES',
      body: [
        `Employer: ${txt(d.employerName)}, Company ID (IČO): ${txt(d.employerIco)}, registered office: ${txt(d.employerAddress)}`,
        d.employerEmail ? `Employer's e-mail: ${txt(d.employerEmail)}` : '',
        `Employee: ${txt(d.employeeName)}, date of birth: ${txt(d.employeeBirth)}, residing at: ${txt(d.employeeAddress)}`,
        d.employeeEmail ? `Employee's e-mail: ${txt(d.employeeEmail)}` : '',
      ],
    },
    {
      title: 'II. SUBJECT OF THE AGREEMENT — DESCRIPTION OF THE WORK TASK',
      body: [
        `The Employee undertakes to perform the following work task (type of work) for the Employer: ${txt(d.taskDescription, 'not specified')}`,
        d.taskDetails ? `Detailed description: ${txt(d.taskDetails)}` : '',
        `Place of work: ${txt(d.workPlace, 'not specified')}`,
        `Expected scope of work: ${txt(d.estimatedHours, 'not specified')} hours (max. 300 hours per year with one employer).`,
      ],
    },
    {
      title: 'III. DURATION AND TERMINATION OF THE AGREEMENT',
      body: [
        `The Agreement is concluded for: ${d.durationType === 'fixed' && d.startDate && d.endDate ? `a fixed term from ${dateIn('en', d.startDate)} to ${dateIn('en', d.endDate)}` : 'an indefinite term'}`,
        d.deadline ? `The work task must be completed no later than: ${txt(d.deadline)}` : '',
        'The Agreement may be terminated by a written agreement of the contracting parties. Unless agreed otherwise, either party may terminate the Agreement by notice for any reason or without stating a reason with a fifteen-day notice period beginning on the day the notice is delivered to the other party.',
        'The Agreement also ends in the ways laid down by the Labour Code, in particular by completion of the agreed work task, expiry of the agreed term, agreement of the parties or immediate termination on the grounds laid down by law.',
      ],
    },
    {
      title: 'IV. REMUNERATION AND METHOD OF PAYMENT',
      body: [
        remunerationDesc,
        minimumWageNote,
        taxNote,
        d.paymentAccount
          ? `The remuneration will be paid to the Employee's bank account no. ${txt(d.paymentAccount)} within ${txt(d.paymentDays, '15')} days after completion of the task / after the end of the month.`
          : 'The remuneration will be paid in cash or by bank transfer.',
      ],
    },
    {
      title: 'V. CONDITIONS OF PERFORMING THE WORK',
      body: [
        'The Employee shall perform the agreed work personally, properly and in accordance with the Employer’s instructions.',
        'Work under a DPP is subject to the rules on working time and rest, shift scheduling, obstacles to work and wage supplements to the extent provided by the Labour Code. Only the institutions expressly listed in § 77(2) of the Labour Code do not apply, in particular transfer to other work, temporary assignment and severance pay. An employee working under an agreement to perform work becomes entitled to holiday under the conditions of § 77a of the Labour Code (effective from 1 January 2024): the agreement must last continuously for at least 4 weeks with the same employer and the employee must have worked at least 4 times the notional set weekly working time (20 hours). The specific calculation is made by the employer under § 213 and § 77a of the Labour Code.',
        'The Employer shall schedule the Employee’s working time in advance in a written shift schedule and acquaint the Employee with it no later than 3 days before the start of the shift or of the period for which the working time is scheduled, unless the parties agree in writing on a different period of notice.',
        'The work may be performed at the Employer’s registered office, at the agreed place of work under Art. II, or remotely from a place chosen by the Employee, if the nature of the task allows it and the Employee complies with the Employer’s requirements on the protection of confidential information, data security and the delivery of outputs.',
        d.toolsProvided === 'employer'
          ? 'The work aids, tools and equipment necessary for performing the work are provided by the Employer.'
          : d.toolsProvided === 'employee'
            ? 'The Employee provides the work aids, tools and equipment at the Employee’s own expense; the Employer will reimburse the Employee for demonstrably incurred costs only if agreed in writing in advance.'
            : 'The work aids and equipment needed for performing the work are provided by the parties as mutually agreed.',
      ],
    },
    ...premium,
    {
      title: `${hasPremium ? 'IX' : 'VI'}. FINAL PROVISIONS`,
      body: [
        'The Agreement is governed by Act No. 262/2006 Coll., the Labour Code, as amended, and subsidiarily by Act No. 89/2012 Coll., the Civil Code.',
        disputeClauseIn('en', d, true),
        'The Agreement is executed in two counterparts; the Employer and the Employee each receive one counterpart (§ 77(1) of the Labour Code).',
        'Amendments to the Agreement are valid only in the form of written, numbered and signed addenda.',
        'The invalidity of any individual provision does not affect the validity of the other provisions of the Agreement.',
        'Neither contracting party is liable for failure to perform non-monetary obligations caused by force majeure (vis maior), i.e. an extraordinary, unforeseeable and insurmountable event (§ 2913(2) of the Civil Code). Force majeure does not apply to the obligation to pay a sum of money. A party affected by force majeure shall inform the other party in writing without delay and resume performance without delay once the obstacle has ceased.',
      ],
    },
    { title: `${hasPremium ? 'X' : 'VII'}. SIGNATURES`, body: [] },
  ];

  if (hasPremium) {
    sections.push({ title: 'ANNEX NO. 1 – HANDOVER AND ACCEPTANCE PROTOCOL FOR OUTPUTS', body: [] });
  }
  return sections;
}

// ── UA ─────────────────────────────────────────────────────────────────────
function ua(d: StoredContractData, hasPremium: boolean): ParaPair[] {
  const remunerationDesc = d.remunerationType === 'hourly'
    ? `Погоджена винагорода за виконання роботи становить ${amt(d.hourlyRate)} крон за годину. Загальну винагороду буде обчислено на підставі фактично відпрацьованих годин.`
    : d.remunerationType === 'fixed' || d.totalRemuneration
      ? `Погоджена винагорода за виконання всього завдання/роботи становить ${amt(d.totalRemuneration)} крон. Винагороду буде виплачено після виконання погодженого завдання.`
      : 'Розмір винагороди буде встановлено за домовленістю сторін договору до початку роботи та зазначено в письмовій додатковій угоді до цієї угоди.';
  const taxNote = `Участь у страхуванні на випадок хвороби та пенсійному страхуванні за DPP виникає при досягненні визначального доходу в одного роботодавця в календарному місяці. На 2026 рік визначальний дохід для участі працівника, який працює на підставі угоди про виконання роботи, у страхуванні на випадок хвороби та пенсійному страхуванні становить ${threshold} крон брутто на місяць в одного роботодавця. При досягненні або перевищенні цієї суми виникає участь у страхуванні та пов’язані з нею обов’язки роботодавця щодо сплати внесків. Отже, у 2026 році дохід без виникнення участі не досягає 12 000 крон (максимум 11 999 крон). З 1 липня 2026 року роботодавець повинен зареєструвати працівника ще до початку роботи; для чеського працівника він може здійснити попередню реєстрацію та завершити повну реєстрацію протягом 8 днів з дня початку роботи, тоді як іноземний працівник має бути повністю зареєстрований до початку роботи. Інші облікові обов’язки та обов’язки щодо сплати внесків роботодавець виконує через Єдиний щомісячний звіт роботодавця відповідно до чинної методики Чеської адміністрації соціального забезпечення (ČSSZ).`;
  const minimumWageNote = `Винагорода за фактично відпрацьований час не може бути нижчою за мінімальну заробітну плату; на 2026 рік вона становить щонайменше ${minWage} крон за годину (§ 111 ТК).`;

  const premium: ParaPair[] = hasPremium ? [
    {
      title: 'VI. КОНФІДЕНЦІЙНІСТЬ ТА ЗАХИСТ ІНФОРМАЦІЇ',
      body: [
        'Працівник зобов’язаний зберігати конфіденційність щодо всіх фактів, з якими він ознайомиться під час виконання угоди і які позначені як конфіденційні або конфіденційність яких випливає з їхнього характеру (бізнес-стратегія, ціни, бази даних клієнтів, внутрішні процеси, персональні дані працівників і клієнтів).',
        'Цей обов’язок конфіденційності діє і після припинення угоди протягом 2 років з дня її припинення.',
        'За шкоду, заподіяну порушенням обов’язку конфіденційності, працівник відповідає в обсязі, встановленому § 257 ТК. Договірний штраф на шкоду працівнику в угоді про виконання роботи не погоджується (§ 346d ТК). Роботодавець має право вимагати відшкодування доведеної шкоди в обсязі, встановленому законом.',
        'Після припинення угоди працівник зобов’язаний повернути всі документи, носії даних та інші матеріали, що містять конфіденційну інформацію, і видалити конфіденційну інформацію зі своїх приватних пристроїв.',
      ],
    },
    {
      title: 'VII. ІНТЕЛЕКТУАЛЬНА ВЛАСНІСТЬ',
      body: [
        'Результати роботи (твори, витвори, програмне забезпечення, тексти, графіка, бази даних тощо), створені працівником під час виконання угоди, є службовими творами в розумінні § 58 Закону № 121/2000 Sb., Закон про авторське право. Роботодавець здійснює всі майнові авторські права на ці твори з дня їх створення.',
        'Працівник надає роботодавцю згоду на зміну, переробку, поєднання з іншим твором, включення до збірного твору та інші зміни створених результатів в обсязі, необхідному для їх звичайного використання роботодавцем, якщо такі дії не суперечать добрим звичаям або правомірним особистим немайновим правам автора (§ 11 Закону № 121/2000 Sb., Закон про авторське право).',
        'Зазначене вище стосується також розробленого працівником програмного забезпечення, алгоритмів і технічних рішень; працівник зобов’язаний передати роботодавцю вихідні коди, документацію та ноу-хау не пізніше дня припинення угоди.',
      ],
    },
    {
      title: 'VIII. ВІДПОВІДАЛЬНІСТЬ ЗА НАЛЕЖНЕ ВИКОНАННЯ ТА ВІДШКОДУВАННЯ ШКОДИ',
      body: [
        'Якщо працівник не виконає погоджене робоче завдання належним чином і вчасно без серйозної причини з боку роботодавця, він відповідає за шкоду, доведено завдану роботодавцю, в обсязі, встановленому § 257 ТК.',
        'Якщо працівник не виконає погоджене робоче завдання в погоджений строк або в належній якості, роботодавець має право письмово заявити застереження щодо якості протягом 5 робочих днів з дня передачі та вимагати безоплатного усунення дефектів протягом 10 робочих днів. Якщо дефект не буде усунено навіть у розумний додатковий строк, роботодавець має право на відшкодування доведеної шкоди в обсязі § 257 ТК.',
        'Договірний штраф на шкоду працівнику в угоді про виконання роботи не погоджується (§ 346d ТК). Роботодавець може вимагати відшкодування шкоди в обсязі, встановленому законом.',
      ],
    },
  ] : [];

  const sections: ParaPair[] = [
    {
      title: 'ПРЕАМБУЛА',
      body: [
        'Ця угода про виконання роботи (далі — «Угода») укладається відповідно до § 75 і наступних Закону № 262/2006 Sb., Трудовий кодекс, з наступними змінами (далі — «ТК»).',
        `Дата укладення Угоди: ${d.contractDate ? dateIn('ua', d.contractDate) : todayIn('ua')}`,
        'Увага: обсяг роботи на підставі угоди про виконання роботи не може перевищувати 300 годин у календарному році в одного роботодавця (§ 75 ч. 2 ТК).',
      ],
    },
    {
      title: 'I. СТОРОНИ ДОГОВОРУ',
      body: [
        `Роботодавець: ${txt(d.employerName)}, IČO: ${txt(d.employerIco)}, місцезнаходження: ${txt(d.employerAddress)}`,
        d.employerEmail ? `E-mail роботодавця: ${txt(d.employerEmail)}` : '',
        `Працівник: ${txt(d.employeeName)}, дата народження: ${txt(d.employeeBirth)}, місце проживання: ${txt(d.employeeAddress)}`,
        d.employeeEmail ? `E-mail працівника: ${txt(d.employeeEmail)}` : '',
      ],
    },
    {
      title: 'II. ПРЕДМЕТ УГОДИ — ОПИС РОБОЧОГО ЗАВДАННЯ',
      body: [
        `Працівник зобов’язується виконати для роботодавця таке робоче завдання (вид роботи): ${txt(d.taskDescription, 'не зазначено')}`,
        d.taskDetails ? `Детальний опис: ${txt(d.taskDetails)}` : '',
        `Місце виконання роботи: ${txt(d.workPlace, 'не зазначено')}`,
        `Очікуваний обсяг роботи: ${txt(d.estimatedHours, 'не зазначено')} годин (максимум 300 годин на рік в одного роботодавця).`,
      ],
    },
    {
      title: 'III. СТРОК ДІЇ ТА ПРИПИНЕННЯ УГОДИ',
      body: [
        `Угода укладається на: ${d.durationType === 'fixed' && d.startDate && d.endDate ? `визначений строк з ${dateIn('ua', d.startDate)} до ${dateIn('ua', d.endDate)}` : 'невизначений строк'}`,
        d.deadline ? `Робоче завдання має бути виконане не пізніше: ${txt(d.deadline)}` : '',
        'Угоду можна припинити письмовою домовленістю сторін договору. Якщо не погоджено інше, будь-яка зі сторін може розірвати Угоду з будь-якої причини або без зазначення причини з п’ятнадцятиденним строком попередження, який починається в день доставки повідомлення про розірвання іншій стороні.',
        'Угода також припиняється способами, встановленими Трудовим кодексом, зокрема виконанням погодженого робочого завдання, закінченням погодженого строку, за згодою сторін або шляхом негайного розірвання з підстав, установлених законом.',
      ],
    },
    {
      title: 'IV. ВИНАГОРОДА ТА СПОСІБ ВИПЛАТИ',
      body: [
        remunerationDesc,
        minimumWageNote,
        taxNote,
        d.paymentAccount
          ? `Винагороду буде виплачено на банківський рахунок працівника № ${txt(d.paymentAccount)} протягом ${txt(d.paymentDays, '15')} днів після виконання завдання / після закінчення місяця.`
          : 'Винагороду буде виплачено готівкою або банківським переказом.',
      ],
    },
    {
      title: 'V. УМОВИ ВИКОНАННЯ РОБОТИ',
      body: [
        'Працівник зобов’язаний виконувати погоджену роботу особисто, належним чином і відповідно до вказівок роботодавця.',
        'На роботу за DPP поширюються правила щодо робочого часу та відпочинку, графіка змін, перешкод у роботі та доплат в обсязі, передбаченому Трудовим кодексом. Не поширюються лише інститути, прямо перелічені в § 77 ч. 2 ТК, зокрема переведення на іншу роботу, тимчасове відрядження до іншого роботодавця та вихідна допомога. Працівник, який працює на підставі угоди про виконання роботи, набуває права на відпустку за умов § 77a ТК (чинного з 1 січня 2024 року): угода має тривати безперервно щонайменше 4 тижні в того самого роботодавця, і працівник має відпрацювати щонайменше 4-кратний фіктивний встановлений тижневий робочий час (20 годин). Конкретний розрахунок здійснює роботодавець відповідно до § 213 і § 77a ТК.',
        'Роботодавець зобов’язаний заздалегідь розподілити робочий час працівника в письмовому графіку змін і ознайомити з ним працівника не пізніше ніж за 3 дні до початку зміни або періоду, на який розподілено робочий час, якщо сторони письмово не домовляться про інший строк ознайомлення.',
        'Роботу можна виконувати за місцезнаходженням роботодавця, у погодженому місці виконання роботи відповідно до ст. II або дистанційно з місця, обраного працівником, якщо це дозволяє характер завдання і працівник дотримується вимог роботодавця щодо захисту конфіденційної інформації, безпеки даних і передачі результатів.',
        d.toolsProvided === 'employer'
          ? 'Робочі засоби, інструменти та обладнання, необхідні для виконання роботи, забезпечує роботодавець.'
          : d.toolsProvided === 'employee'
            ? 'Працівник забезпечує робочі засоби, інструменти та обладнання за власний рахунок; роботодавець відшкодує йому доведено понесені витрати лише тоді, якщо це було заздалегідь письмово погоджено.'
            : 'Робочі засоби та обладнання, необхідні для виконання роботи, забезпечують сторони за взаємною домовленістю.',
      ],
    },
    ...premium,
    {
      title: `${hasPremium ? 'IX' : 'VI'}. ПРИКІНЦЕВІ ПОЛОЖЕННЯ`,
      body: [
        'Угода регулюється Законом № 262/2006 Sb., Трудовий кодекс, з наступними змінами, та субсидіарно Законом № 89/2012 Sb., Цивільний кодекс.',
        disputeClauseIn('ua', d, true),
        'Угоду складено у двох однакових примірниках; роботодавець і працівник отримують по одному примірнику (§ 77 ч. 1 ТК).',
        'Зміни Угоди дійсні лише у формі письмових, пронумерованих і підписаних додаткових угод.',
        'Недійсність окремого положення не впливає на дійсність інших положень Угоди.',
        'Жодна зі сторін не відповідає за невиконання негрошових обов’язків, спричинене непереборною силою (vis maior), тобто надзвичайною, непередбачуваною та непереборною подією (§ 2913 ч. 2 ЦК). Непереборна сила не поширюється на обов’язок сплатити грошову суму. Сторона, яка зазнала дії непереборної сили, зобов’язана негайно письмово повідомити іншу сторону та після усунення перешкоди негайно продовжити виконання.',
      ],
    },
    { title: `${hasPremium ? 'X' : 'VII'}. ПІДПИСИ`, body: [] },
  ];

  if (hasPremium) {
    sections.push({ title: 'ДОДАТОК № 1 – АКТ ПЕРЕДАЧІ ТА ПРИЙМАННЯ РЕЗУЛЬТАТІВ', body: [] });
  }
  return sections;
}

export function buildDppTranslationsBySection(d: StoredContractData, hasPremium: boolean): Array<NonNullable<ContractSection['translations']>> {
  return buildBilingualTranslations({
    en: () => en(d, hasPremium),
    ua: () => ua(d, hasPremium),
  });
}
