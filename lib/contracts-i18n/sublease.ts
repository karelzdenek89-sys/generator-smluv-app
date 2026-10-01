/**
 * Sublease agreement (podnájemní smlouva) — full EN and UA translations.
 *
 * Mirrors buildSubleaseContractSections in lib/contracts.ts section by section
 * and paragraph by paragraph. scripts/translation-parity-tests.ts enforces the
 * alignment and completeness. The Czech text remains the legally binding version.
 */
import type { ContractSection, StoredContractData } from '../contracts';
import { amt, buildBilingualTranslations, dateIn, disputeClauseIn, todayIn, txt, type ParaPair } from './helpers';

const monthlyTotal = (d: StoredContractData) => (Number(d.rentAmount) || 0) + (Number(d.utilityAmount) || 0);
const dailyVacateRate = (d: StoredContractData) =>
  !isNaN(Number(d.rentAmount)) && Number(d.rentAmount) > 0 ? Math.round(Number(d.rentAmount) / 30) : null;

// ── EN ─────────────────────────────────────────────────────────────────────
function en(d: StoredContractData, hasPremium: boolean): ParaPair[] {
  const consentNote = d.landlordConsent === 'yes'
    ? `The landlord's consent to the sublease was granted in writing${d.consentDate ? ` on ${dateIn('en', d.consentDate)}` : ''}.`
    : 'Notice: if the specific situation requires the landlord’s consent to the sublease, the Tenant shall obtain it before concluding this Agreement. For a sublease of part of a flat, the procedure is governed in particular by § 2274 and § 2275 of the Civil Code, depending on whether the Tenant permanently lives in the flat.';
  const vacateRate = dailyVacateRate(d);

  const premium: ParaPair[] = hasPremium ? [
    {
      title: 'IX. SPECIAL CONTRACTUAL PROVISIONS AND RELATIONSHIP TO THE MAIN LEASE',
      body: [
        `The Subtenant acknowledges that the Tenant (the Subtenant's contractual counterparty) is bound towards the owner of the property by a lease agreement${d.mainLeaseDate ? ` dated ${dateIn('en', d.mainLeaseDate)}` : ''}. If the main lease ends, the sublease also ends (§ 2277 of the Civil Code).`,
        'The Subtenant undertakes not to breach the terms of the main lease agreement, with which the Subtenant was duly acquainted before signing this Agreement and whose relevant parts were handed over to the Subtenant.',
        'The Tenant shall inform the Subtenant without delay of any change to the main lease agreement that could affect the rights and obligations of the Subtenant.',
        'The Subtenant is not entitled to sublet the subleased premises further to a third party without the prior written consent of both the Tenant and the landlord.',
        d.breachPenalty && Number(d.breachPenalty) > 0
          ? `Contractual penalty for unauthorised further subletting or any other breach of the terms of the main lease agreement: CZK ${amt(d.breachPenalty)}.`
          : 'In the event of unauthorised further subletting or any other breach of the terms of the main lease agreement, the Subtenant shall compensate the Tenant for all demonstrably incurred damage, including damage claimed by the landlord against the Tenant.',
      ],
    },
    {
      title: 'X. CONTRACTUAL PENALTIES AND SANCTIONS',
      body: [
        `Subtenant's delay in paying the sublease rent: a contractual penalty of 0.05 % of the amount due for each day of delay, but not exceeding 15 % of the amount due in total${d.minLatePenalty && Number(d.minLatePenalty) > 0 ? `; the agreed minimum of CZK ${amt(d.minLatePenalty)} per day applies only within this overall cap` : ''}.`,
        d.damagePenalty && Number(d.damagePenalty) > 0
          ? `Unauthorised alteration of or damage to the premises without the Tenant's consent: a contractual penalty of CZK ${amt(d.damagePenalty)} plus compensation for the actual damage.`
          : 'Unauthorised alteration of or damage to the premises without the Tenant’s consent: the Subtenant is liable for the damage in full and shall restore the premises to their original condition at the Subtenant’s own expense.',
        'Payment of a contractual penalty does not affect the right to compensation for the damage incurred in full.',
        'The Tenant is entitled to declare the contractual penalty immediately payable and also to withdraw from the Agreement with immediate effect if the Subtenant is more than 30 days late with payment or seriously breaches the terms of the main lease agreement.',
      ],
    },
    {
      title: 'XI. DELIVERY OF DOCUMENTS',
      body: [
        'All documents (notices of termination, notifications, reminders, invoices) shall be delivered to the addresses of the contracting parties stated in this Agreement, or to their e-mail addresses if a party has provided them.',
        'A document sent by registered letter is deemed delivered on the third working day after dispatch, even if the addressee did not accept it.',
        'A party shall notify the other party in writing of a change of its delivery address without undue delay; until the notice is delivered, the original address applies.',
      ],
    },
  ] : [];

  return [
    {
      title: 'PREAMBLE',
      body: [
        'This sublease agreement (the "Agreement") is concluded under § 2274 et seq. of Act No. 89/2012 Coll., the Civil Code, as amended (the "Civil Code").',
        consentNote,
        `Date of conclusion of the Agreement: ${d.contractDate ? dateIn('en', d.contractDate) : todayIn('en')}`,
      ],
    },
    {
      title: 'I. CONTRACTING PARTIES',
      body: [
        `Tenant (sublessor): ${txt(d.landlordName)}, date of birth / Company ID: ${txt(d.landlordId)}, residence / registered office: ${txt(d.landlordAddress)}`,
        d.landlordEmail ? `Tenant's e-mail: ${txt(d.landlordEmail)}` : '',
        `Subtenant: ${txt(d.tenantName)}, date of birth / Company ID: ${txt(d.tenantId)}, residence / registered office: ${txt(d.tenantAddress)}`,
        d.tenantEmail ? `Subtenant's e-mail: ${txt(d.tenantEmail)}` : '',
      ],
    },
    {
      title: 'II. SUBJECT OF THE SUBLEASE',
      body: [
        `The Tenant sublets to the Subtenant: the flat/premises at ${txt(d.flatAddress, 'not specified')}, ${txt(d.flatLayout, '')}, ${d.flatUnitNumber ? `unit number ${txt(d.flatUnitNumber)}, ` : ''}${d.floor ? `floor ${txt(d.floor)}, ` : ''}cadastral area ${txt(d.cadastralArea, 'not specified')}.`,
        d.subleaseArea ? `Floor area of the subleased premises: ${txt(d.subleaseArea)} m²` : '',
      ],
    },
    {
      title: 'III. TERM OF THE SUBLEASE',
      body: [
        d.duration === 'fixed'
          ? `The sublease is agreed for a fixed term from ${dateIn('en', d.startDate, 'not specified')} to ${dateIn('en', d.endDate, 'not specified')}.`
          : `The sublease is agreed for an indefinite term from ${dateIn('en', d.startDate, 'not specified')}.`,
        d.duration === 'indefinite'
          ? `Notice period: ${txt(d.noticePeriod, '3')} months; the notice period begins on the first day of the month following delivery of the notice.`
          : '',
        'In any case, the sublease ends no later than on the day the main lease ends.',
      ],
    },
    {
      title: 'IV. SUBLEASE RENT AND PAYMENTS',
      body: [
        `The monthly sublease rent is agreed at CZK ${amt(d.rentAmount)}.`,
        d.utilityAmount ? `Advance payment for services/energy: CZK ${amt(d.utilityAmount)} per month.` : '',
        `Total monthly payment: CZK ${amt(monthlyTotal(d))}.`,
        d.depositAmount ? `Security deposit: CZK ${amt(d.depositAmount)}. The Tenant shall return the deposit within 30 days of the end of the sublease and the handover of the premises, after deducting duly specified and proven claims.` : '',
        `The sublease rent is payable always by day ${txt(d.paymentDay, '15')} of the relevant month ${d.bankAccount ? `to the Tenant's bank account no. ${txt(d.bankAccount)}` : 'in cash or by bank transfer'}.`,
        'If the Subtenant is late in paying the sublease rent or the advance payment for services, the Tenant is entitled to claim statutory default interest from the due date.',
      ],
    },
    {
      title: 'V. RULES OF THE SUBLEASE',
      body: [
        'The Subtenant shall: use the premises only for the agreed purpose, keep them in order, make no alterations without the Tenant’s consent, not damage property and follow the house rules.',
        `Maximum number of persons in the flat: ${txt(d.maxOccupants, '2')}`,
        `Pets: ${d.allowPets ? 'keeping them is acknowledged by the parties; the Subtenant is liable for damage and increased costs caused by them' : 'the Subtenant may keep an animal only if it does not cause the Tenant, the landlord or other residents of the building unreasonable difficulties; the Subtenant shall inform the Tenant in advance about keeping an animal'}`,
        `Smoking: ${d.allowSmoking ? 'permitted' : 'prohibited'}`,
        `Airbnb / short-term re-subletting: ${d.allowAirbnb ? 'permitted' : 'prohibited'}`,
        'The Subtenant acknowledges the terms of the main lease agreement and undertakes to respect them.',
      ],
    },
    {
      title: 'VI. HANDOVER OF THE PREMISES',
      body: [
        `The premises will be handed over on ${dateIn('en', d.handoverDate, 'not specified')}.`,
        `Number of keys handed over: ${txt(d.keysCount, '1')}`,
        d.equipmentList ? `Equipment handed over: ${txt(d.equipmentList)}` : '',
        d.knownDefects ? `Known defects: ${txt(d.knownDefects)}` : 'The premises are handed over without apparent defects.',
        'A handover protocol signed by both parties will be drawn up for the handover.',
      ],
    },
    {
      title: 'VII. TERMINATION OF THE SUBLEASE',
      body: [
        'On termination of the sublease, the Subtenant shall vacate the premises, restore them to their original condition (taking into account ordinary wear and tear) and hand over the keys.',
        vacateRate !== null
          ? `For each day of delay in vacating, the Subtenant shall pay compensation of CZK ${vacateRate} per day (i.e. 1/30 of the agreed monthly sublease rent).`
          : 'For each day of delay in vacating, the Subtenant shall pay compensation of 1/30 of the agreed monthly sublease rent for each day of delay.',
        'The deposit will be returned within 30 days of the handover of the premises, after deducting any claims of the Tenant.',
      ],
    },
    {
      title: 'VIII. REPAIRS, EMERGENCIES AND MAINTENANCE',
      body: [
        'Minor repairs and the costs of ordinary maintenance of the subleased premises are paid by the Subtenant (to an extent appropriate to the nature of the sublease). The Subtenant is fully liable for repairs caused by wear and tear exceeding ordinary use.',
        'The Subtenant pays for minor repairs and ordinary maintenance connected with the use of the premises to the extent laid down by Government Decree No. 308/2015 Coll., as amended. Major repairs and renovations are paid by the Tenant unless the damage was caused by the Subtenant or by persons to whom the Subtenant allowed access to the premises.',
        'The Subtenant shall report to the Tenant without delay — at the latest within 24 hours — all emergencies, faults or damage (water leaks, power cuts, heating failures, etc.). In the event of imminent danger, the Subtenant is entitled to take the necessary protective measures even without the Tenant’s consent.',
        'The Subtenant may not carry out any structural alterations, conversions or other interventions in the premises without the prior written consent of the Tenant and, in the case of structural alterations, also of the landlord. The Subtenant shall restore any unauthorised alterations to the original condition at the Subtenant’s own expense.',
      ],
    },
    ...premium,
    {
      title: `${hasPremium ? 'XII' : 'IX'}. FINAL PROVISIONS`,
      body: [
        'The Agreement is governed by the law of the Czech Republic, in particular Act No. 89/2012 Coll., the Civil Code, as amended.',
        disputeClauseIn('en', d),
        'The Agreement is executed in two counterparts; the sublessor and the Subtenant each receive one counterpart.',
        'All amendments are valid only in the form of written, numbered and signed addenda.',
        'The invalidity of any individual provision of the Agreement does not affect the validity of the other provisions.',
        'Neither contracting party is liable for failure to perform non-monetary obligations caused by force majeure (vis maior), i.e. an extraordinary, unforeseeable and insurmountable event (§ 2913(2) of the Civil Code). Force majeure does not apply to the obligation to pay a sum of money. A party affected by force majeure shall inform the other party in writing without delay and resume performance without delay once the obstacle has ceased.',
      ],
    },
    { title: `${hasPremium ? 'XIII' : 'X'}. SIGNATURES`, body: [] },
  ];
}

// ── UA ─────────────────────────────────────────────────────────────────────
function ua(d: StoredContractData, hasPremium: boolean): ParaPair[] {
  const consentNote = d.landlordConsent === 'yes'
    ? `Згоду орендодавця на піднайм надано в письмовій формі${d.consentDate ? ` ${dateIn('ua', d.consentDate)}` : ''}.`
    : 'Увага: якщо конкретна ситуація вимагає згоди орендодавця на піднайм, наймач зобов’язаний отримати її до укладення цього Договору. Щодо піднайму частини квартири порядок регулюється, зокрема, § 2274 і § 2275 ЦК залежно від того, чи наймач сам постійно проживає в квартирі.';
  const vacateRate = dailyVacateRate(d);

  const premium: ParaPair[] = hasPremium ? [
    {
      title: 'IX. ОСОБЛИВІ ДОГОВІРНІ ПОЛОЖЕННЯ ТА ЗВ’ЯЗОК З ОСНОВНОЮ ОРЕНДОЮ',
      body: [
        `Піднаймач бере до відома, що наймач (його договірний контрагент) пов’язаний з власником нерухомості договором оренди${d.mainLeaseDate ? ` від ${dateIn('ua', d.mainLeaseDate)}` : ''}. У разі припинення основної оренди припиняється і піднайм (§ 2277 ЦК).`,
        'Піднаймач зобов’язується не порушувати умов основного договору оренди, з яким він належним чином ознайомився до підписання цього Договору і відповідні частини якого йому було передано.',
        'Наймач зобов’язаний негайно повідомляти піднаймача про будь-яку зміну основного договору оренди, яка могла б вплинути на права та обов’язки піднаймача.',
        'Піднаймач не має права передавати орендоване приміщення в подальший піднайм третій особі без попередньої письмової згоди наймача та орендодавця.',
        d.breachPenalty && Number(d.breachPenalty) > 0
          ? `Договірний штраф за неправомірний подальший піднайм або інше порушення умов основного договору оренди: ${amt(d.breachPenalty)} крон.`
          : 'У разі неправомірного подальшого піднайму або іншого порушення умов основного договору оренди піднаймач зобов’язаний відшкодувати наймачу всю доведено завдану шкоду, включно зі шкодою, яку орендодавець заявив до наймача.',
      ],
    },
    {
      title: 'X. ДОГОВІРНІ ШТРАФИ ТА САНКЦІЇ',
      body: [
        `Прострочення піднаймачем сплати плати за піднайм: договірний штраф у розмірі 0,05 % від заборгованої суми за кожен день прострочення, але в сукупності не більше 15 % від заборгованої суми${d.minLatePenalty && Number(d.minLatePenalty) > 0 ? `; погоджений мінімум ${amt(d.minLatePenalty)} крон на день застосовується лише в межах цієї загальної граничної суми` : ''}.`,
        d.damagePenalty && Number(d.damagePenalty) > 0
          ? `Неправомірна зміна або пошкодження приміщення без згоди наймача: договірний штраф ${amt(d.damagePenalty)} крон і відшкодування фактичної шкоди.`
          : 'Неправомірна зміна або пошкодження приміщення без згоди наймача: піднаймач відповідає за шкоду в повному обсязі та зобов’язаний за власний рахунок привести приміщення до початкового стану.',
        'Сплата договірного штрафу не зачіпає права на відшкодування завданої шкоди в повному обсязі.',
        'Наймач має право оголосити договірний штраф таким, що підлягає негайній сплаті, а також негайно відмовитися від договору, якщо піднаймач прострочить оплату понад 30 днів або суттєво порушить умови основного договору оренди.',
      ],
    },
    {
      title: 'XI. ДОСТАВКА ДОКУМЕНТІВ',
      body: [
        'Усі документи (повідомлення про розірвання, повідомлення, нагадування, рахунки) доставляються на адреси сторін договору, зазначені в цьому Договорі, або на адреси електронної пошти, якщо сторона їх повідомила.',
        'Документ, надісланий рекомендованим листом, вважається доставленим на третій робочий день після відправлення, навіть якщо адресат його не отримав.',
        'Про зміну адреси для доставки сторона зобов’язана без зайвої затримки письмово повідомити іншу сторону; до доставки повідомлення діє попередня адреса.',
      ],
    },
  ] : [];

  return [
    {
      title: 'ПРЕАМБУЛА',
      body: [
        'Цей договір піднайму (далі — «Договір») укладається відповідно до § 2274 і наступних Закону № 89/2012 Sb., Цивільний кодекс, з наступними змінами (далі — «ЦК»).',
        consentNote,
        `Дата укладення Договору: ${d.contractDate ? dateIn('ua', d.contractDate) : todayIn('ua')}`,
      ],
    },
    {
      title: 'I. СТОРОНИ ДОГОВОРУ',
      body: [
        `Наймач (особа, що передає в піднайм): ${txt(d.landlordName)}, дата народження / IČO: ${txt(d.landlordId)}, місце проживання / місцезнаходження: ${txt(d.landlordAddress)}`,
        d.landlordEmail ? `E-mail наймача: ${txt(d.landlordEmail)}` : '',
        `Піднаймач: ${txt(d.tenantName)}, дата народження / IČO: ${txt(d.tenantId)}, місце проживання / місцезнаходження: ${txt(d.tenantAddress)}`,
        d.tenantEmail ? `E-mail піднаймача: ${txt(d.tenantEmail)}` : '',
      ],
    },
    {
      title: 'II. ПРЕДМЕТ ПІДНАЙМУ',
      body: [
        `Наймач передає піднаймачу в піднайм: квартиру/приміщення за адресою ${txt(d.flatAddress, 'не зазначено')}, ${txt(d.flatLayout, '')}, ${d.flatUnitNumber ? `номер житлової одиниці ${txt(d.flatUnitNumber)}, ` : ''}${d.floor ? `${txt(d.floor)}-й поверх, ` : ''}кадастрова територія ${txt(d.cadastralArea, 'не зазначено')}.`,
        d.subleaseArea ? `Підлогова площа приміщення, що передається в піднайм: ${txt(d.subleaseArea)} м²` : '',
      ],
    },
    {
      title: 'III. СТРОК ПІДНАЙМУ',
      body: [
        d.duration === 'fixed'
          ? `Піднайм укладається на визначений строк з ${dateIn('ua', d.startDate, 'не зазначено')} до ${dateIn('ua', d.endDate, 'не зазначено')}.`
          : `Піднайм укладається на невизначений строк з ${dateIn('ua', d.startDate, 'не зазначено')}.`,
        d.duration === 'indefinite'
          ? `Строк попередження: ${txt(d.noticePeriod, '3')} місяці; строк попередження починається з першого дня місяця, що настає після доставки повідомлення про розірвання.`
          : '',
        'У будь-якому разі піднайм припиняється не пізніше дня припинення основної оренди.',
      ],
    },
    {
      title: 'IV. ПЛАТА ЗА ПІДНАЙМ ТА ПЛАТЕЖІ',
      body: [
        `Щомісячну плату за піднайм погоджено в розмірі ${amt(d.rentAmount)} крон.`,
        d.utilityAmount ? `Авансовий платіж за послуги/енергію: ${amt(d.utilityAmount)} крон на місяць.` : '',
        `Загальний щомісячний платіж: ${amt(monthlyTotal(d))} крон.`,
        d.depositAmount ? `Грошова застава (кауція): ${amt(d.depositAmount)} крон. Наймач зобов’язаний повернути заставу протягом 30 днів після припинення піднайму та передачі приміщення, після вирахування належним чином конкретизованих і доведених вимог.` : '',
        `Плата за піднайм сплачується щоразу до ${txt(d.paymentDay, '15')}-го числа відповідного місяця ${d.bankAccount ? `на банківський рахунок наймача № ${txt(d.bankAccount)}` : 'готівкою або банківським переказом'}.`,
        'У разі прострочення піднаймачем сплати плати за піднайм або авансового платежу за послуги наймач має право вимагати встановлених законом процентів за прострочення з дня настання строку платежу.',
      ],
    },
    {
      title: 'V. ПРАВИЛА ПІДНАЙМУ',
      body: [
        'Піднаймач зобов’язаний: використовувати приміщення лише за погодженим призначенням, підтримувати порядок, не здійснювати змін без згоди наймача, не пошкоджувати майно та дотримуватися правил будинку.',
        `Максимальна кількість осіб у квартирі: ${txt(d.maxOccupants, '2')}`,
        `Домашні тварини: ${d.allowPets ? 'їх утримання сторони взяли до відома; піднаймач відповідає за шкоду та підвищені витрати, спричинені ними' : 'піднаймач має право утримувати тварину лише тоді, якщо цим не завдає наймачу, орендодавцю чи іншим мешканцям будинку непропорційних незручностей; про утримання тварини він зобов’язаний заздалегідь повідомити наймача'}`,
        `Куріння: ${d.allowSmoking ? 'дозволено' : 'заборонено'}`,
        `Airbnb / короткострокова повторна передача в піднайм: ${d.allowAirbnb ? 'дозволено' : 'заборонено'}`,
        'Піднаймач бере до відома умови основного договору оренди та зобов’язується їх дотримуватися.',
      ],
    },
    {
      title: 'VI. ПЕРЕДАЧА ПРИМІЩЕННЯ',
      body: [
        `Передача приміщення відбудеться ${dateIn('ua', d.handoverDate, 'дата не зазначена')}.`,
        `Кількість переданих ключів: ${txt(d.keysCount, '1')}`,
        d.equipmentList ? `Обладнання, що передається: ${txt(d.equipmentList)}` : '',
        d.knownDefects ? `Відомі дефекти: ${txt(d.knownDefects)}` : 'Приміщення передається без очевидних дефектів.',
        'Про передачу буде складено акт приймання-передачі, підписаний обома сторонами.',
      ],
    },
    {
      title: 'VII. ПРИПИНЕННЯ ПІДНАЙМУ',
      body: [
        'Після припинення піднайму піднаймач зобов’язаний звільнити приміщення, привести його до початкового стану (з урахуванням звичайного зношення) та передати ключі.',
        vacateRate !== null
          ? `За кожен день прострочення звільнення приміщення піднаймач зобов’язаний сплачувати компенсацію в розмірі ${vacateRate} крон на день (тобто 1/30 погодженої щомісячної плати за піднайм).`
          : 'За кожен день прострочення звільнення приміщення піднаймач зобов’язаний сплачувати компенсацію в розмірі 1/30 погодженої щомісячної плати за піднайм за кожен день прострочення.',
        'Заставу буде повернуто протягом 30 днів після передачі приміщення, після вирахування можливих вимог наймача.',
      ],
    },
    {
      title: 'VIII. РЕМОНТ, АВАРІЇ ТА УТРИМАННЯ',
      body: [
        'Дрібний ремонт і витрати на звичайне утримання приміщення, що перебуває в піднаймі, оплачує піднаймач (в обсязі, що відповідає характеру піднайму). За ремонт, спричинений зношенням понад звичайне користування, піднаймач відповідає в повному обсязі.',
        'Дрібний ремонт і звичайне утримання, пов’язані з користуванням приміщенням, оплачує піднаймач в обсязі, встановленому Постановою уряду № 308/2015 Sb., з наступними змінами. Більший ремонт і реконструкцію оплачує наймач, якщо пошкодження не заподіяно піднаймачем або особами, яким піднаймач надав доступ до приміщення.',
        'Піднаймач зобов’язаний негайно — не пізніше ніж протягом 24 годин — повідомляти наймача про всі аварії, несправності чи пошкодження (витоки води, відключення електроенергії, несправності опалення тощо). У разі безпосередньої загрози він має право вжити необхідних захисних заходів навіть без згоди наймача.',
        'Піднаймач не може здійснювати жодних будівельних змін, перебудов чи інших втручань у приміщення без попередньої письмової згоди наймача, а в разі будівельних змін — також орендодавця. Здійснені недозволені зміни піднаймач зобов’язаний за власний рахунок привести до початкового стану.',
      ],
    },
    ...premium,
    {
      title: `${hasPremium ? 'XII' : 'IX'}. ПРИКІНЦЕВІ ПОЛОЖЕННЯ`,
      body: [
        'Договір регулюється правом Чеської Республіки, зокрема Законом № 89/2012 Sb., Цивільний кодекс, з наступними змінами.',
        disputeClauseIn('ua', d),
        'Договір складено у двох однакових примірниках; особа, що передає в піднайм, і піднаймач отримують по одному примірнику.',
        'Усі зміни дійсні лише у формі письмових, пронумерованих і підписаних додаткових угод.',
        'Недійсність окремого положення Договору не впливає на дійсність інших положень.',
        'Жодна зі сторін не відповідає за невиконання негрошових обов’язків, спричинене непереборною силою (vis maior), тобто надзвичайною, непередбачуваною та непереборною подією (§ 2913 ч. 2 ЦК). Непереборна сила не поширюється на обов’язок сплатити грошову суму. Сторона, яка зазнала дії непереборної сили, зобов’язана негайно письмово повідомити іншу сторону та після усунення перешкоди негайно продовжити виконання.',
      ],
    },
    { title: `${hasPremium ? 'XIII' : 'X'}. ПІДПИСИ`, body: [] },
  ];
}

export function buildSubleaseTranslationsBySection(d: StoredContractData, hasPremium: boolean): Array<NonNullable<ContractSection['translations']>> {
  return buildBilingualTranslations({
    en: () => en(d, hasPremium),
    ua: () => ua(d, hasPremium),
  });
}
