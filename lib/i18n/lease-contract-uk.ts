import type { ContractSection, StoredContractData } from '@/lib/contracts';
import { resolveTierFeatures } from '@/lib/contracts';
import { asText, formatAmount, formatDate, today } from '@/lib/i18n/lease-contract-en';

function disputeClauseUk(d: StoredContractData): string {
  switch (d.disputeResolution) {
    case 'mediation':
      return 'Сторони спочатку намагаються досягти мирової угоди. Якщо згоди немає, можлива медіація за законом № 202/2012 Зб. про медіацію або звернення до компетентного суду Чехії.';
    case 'arbitration':
      return 'Спори за цим договором остаточно вирішує арбітражний суд при Торгово-промисловій та сільськогосподарській коморах ЧР за її правилами, одноосібним арбітром. Місце: Прага. Мова: чеська (закон № 216/1994 Зб.). Сторони відмовляються від права звернення до загального суду в межах цієї клаузули.';
    default:
      return 'Спори спочатку вирішуються мирно. Якщо згоди немає — компетентний суд Чехії.';
  }
}

const MINOR_REPAIRS_UK =
  'Орендар оплачує поточне обслуговування та дрібний ремонт, пов’язаний з користуванням (§ 2257 ЦК), у межах наказу № 308/2015 Зб.';

/** Пояснювальний український переклад чеського договору оренди — не офіційний і не засвідчений. */
export function buildLeaseContractSectionsUk(d: StoredContractData): ContractSection[] {
  const { hasPremiumClauses } = resolveTierFeatures(d);
  const propertyAddress = asText(d.propertyAddress || d.flatAddress);
  const propertyLayout = asText(d.propertyLayout || d.flatLayout, 'не вказано');
  const utilitiesAmount = d.utilitiesAmount ?? d.utilityAmount ?? '';
  const paymentDay =
    d.paymentDay !== undefined && d.paymentDay !== null && String(d.paymentDay).trim() !== ''
      ? String(d.paymentDay).replace(/\D/g, '')
      : '5';
  const isFixedTerm = d.duration === 'fixed' && Boolean(d.endDate);
  const leaseDuration = d.leaseDuration
    ? asText(d.leaseDuration)
    : isFixedTerm
      ? `на визначений строк до ${formatDate(d.endDate)}`
      : 'на невизначений строк';
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
          title: 'XI. ОРГАНІЗАЦІЯ ТА ДОКУМЕНТУВАННЯ',
          body: [
            'Істотні факти (звіти про вади, передача ключів, зміни складу домогосподарства, дати передачі та ремонти) бажано підтверджувати між сторонами в доказовій формі, переважно e-mail на адреси з розділу X або рекомендованим листом.',
            'Наприкінці оренди складається протокол передачі (додаток № 1) з показниками лічильників, ключами, обладнанням і станом кімнат. Можна додати фото.',
            'У разі спору про шкоду понад нормальне зношення сторони спочатку намагаються домовитися. За потреби призначають експерта; витрати несе сторона, чиї вимоги виявилися необґрунтованими.',
            'Орендар відповідає за шкоду, завдану квартирі або спільним частинам особами, яким він надав доступ.',
          ],
        },
        {
          title: 'XII. ОСОБЛИВОСТІ РОЗІРВАННЯ',
          body: [
            'Щонайменше за 5 робочих днів до планованого закінчення сторони письмово підтверджують точну дату й час передачі.',
            'Орендодавець повертає заставу або її невикористану частину у строк за ст. V(3), з письмовим обґрунтуванням утримань.',
            'Якщо після виселення потрібні ремонти чи професійне прибирання, орендодавець письмово повідомляє орендаря до початку робіт, вказує орієнтовну вартість і дає щонайменше 5 робочих днів на відповідь, крім термінових випадків.',
          ],
        },
      ]
    : [];

  return [
    {
      title: 'ПРЕАМБУЛА',
      body: [
        'Цей договір оренди укладено згідно з § 2201 та наст. закону № 89/2012 Зб. (ЦК) та § 2235 та наст. про оренду житла.',
        `Дата укладення: ${d.contractDate ? formatDate(d.contractDate) : today()}`,
      ],
    },
    {
      title: 'I. СТОРОНИ',
      body: [
        `Орендодавець: ${asText(d.landlordName)}, РНОКПП/дата народження: ${asText(d.landlordId, '—')}, адреса: ${asText(d.landlordAddress)}`,
        d.landlordOP ? `Посвідчення орендодавця: ${asText(d.landlordOP)}` : '',
        d.landlordEmail ? `E-mail орендодавця: ${asText(d.landlordEmail)}` : '',
        d.landlordPhone ? `Телефон орендодавця: ${asText(d.landlordPhone)}` : '',
        `Орендар: ${asText(d.tenantName)}, РНОКПП/дата народження: ${asText(d.tenantId, '—')}, адреса: ${asText(d.tenantAddress)}`,
        d.tenantOP ? `Посвідчення орендаря: ${asText(d.tenantOP)}` : '',
        d.tenantEmail ? `E-mail орендаря: ${asText(d.tenantEmail)}` : '',
        d.tenantPhone ? `Телефон орендаря: ${asText(d.tenantPhone)}` : '',
      ].filter(Boolean) as string[],
    },
    {
      title: 'II. ПРЕДМЕТ ОРЕНДИ',
      body: [
        `Орендодавець передає орендареві за плату користування квартиру: ${propertyAddress}.`,
        `Планування: ${propertyLayout}.`,
        d.flatUnitNumber ? `Номер одиниці: ${asText(d.flatUnitNumber)}.` : '',
        d.cadastralArea
          ? `Кадастрова ділянка: ${asText(d.cadastralArea)}, номер ділянки: ${asText(d.parcelNumber, 'не вказано')}.`
          : '',
        d.ownershipSheet ? `Лист власності: ${asText(d.ownershipSheet)}.` : '',
        d.floor ? `Поверх: ${asText(d.floor)}.` : '',
        d.flatArea || d.approxArea ? `Площа: ${asText(d.flatArea || d.approxArea)} м².` : '',
        'Орендодавець заявляє, що має право здавати квартиру і не знає перешкод для належного користування.',
        'Орендар підтверджує огляд квартири перед підписанням; стан описано в протоколі передачі.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'III. СТРОК',
      body: [
        `Строк оренди: ${leaseDuration}.`,
        d.startDate ? `Початок: ${formatDate(d.startDate)}.` : '',
        d.handoverDate ? `Фізична передача: ${formatDate(d.handoverDate)}.` : '',
        isFixedTerm
          ? 'Після закінчення строку договір припиняється, якщо сторони письмово не домовляться інакше. Дострокове розірвання — лише на підставах закону або цього договору.'
          : 'Орендар може розірвати з тримісячним попередженням без вказання причин. Орендодавець — лише на підставах закону (§ 2288 ЦК).',
      ].filter(Boolean) as string[],
    },
    {
      title: 'IV. ОРЕНДНА ПЛАТА ТА ПОСЛУГИ',
      body: [
        `Щомісячна оренда: ${formatAmount(d.rentAmount)} Kč.`,
        hasUtilities
          ? `Щомісячний аванс за послуги: ${formatAmount(utilitiesAmount)} Kč.`
          : 'Окремий аванс за послуги не узгоджено; орендар платить постачальникам або за розрахунком орендодавця.',
        hasUtilities ? `Разом на місяць: ${formatAmount(monthlyTotal)} Kč.` : '',
        `Оплата до ${paymentDay}-го числа кожного місяця наперед.`,
        d.bankAccount ? `Рахунок: ${asText(d.bankAccount)}.` : '',
        d.variableSymbol ? `Змінний символ: ${asText(d.variableSymbol)}.` : '',
        d.utilitiesIncludedText
          ? `Що входить у аванси: ${asText(d.utilitiesIncludedText)}.`
          : hasUtilities
            ? 'Аванси зазвичай охоплюють воду, опалення, спільні зони тощо — за фактичними витратами.'
            : '',
        hasUtilities
          ? 'Орендодавець щонайменше раз на рік надає розрахунок фактичних витрат протягом чотирьох місяців (закон № 67/2013 Зб.).'
          : '',
        useInflationIndexation
          ? 'Оренду можна щороку з 1 квітня індексувати за інфляцією (ČSÚ) з 30-денним письмовим попередженням.'
          : 'Орендодавець може запропонувати збільшення згідно з ЦК, зокрема § 2249; якщо немає згоди — застосовуються законні правила.',
        'Електрика та газ за окремими договорами орендаря не входять у аванси.',
        'Прострочення — законні пені (наказ № 351/2013 Зб.).',
      ].filter(Boolean) as string[],
    },
    {
      title: 'V. ЗАСТАВА',
      body: hasDeposit
        ? [
            `До передачі (найпізніше при підписанні) орендар сплачує заставу ${formatAmount(d.depositAmount)} Kč${d.rentAmount && Number(d.rentAmount) > 0 ? ` (${Math.round(Number(d.depositAmount) / Number(d.rentAmount))}× місячна оренда)` : ''}.`,
            'Застава забезпечує вимоги орендодавця, зокрема борг, аванси, шкоду та відновлення понад нормальне зношення.',
            'Повернення протягом місяця після закінчення та звільнення, з відсотками, за вирахуванням обґрунтованих сум.',
            'Залік — лише з письмовим повідомленням і розшифровкою.',
          ]
        : ['Заставу сторони не узгодили.'],
    },
    {
      title: 'VI. ПРАВИЛА КОРИСТУВАННЯ',
      body: [
        d.maxOccupants ? `Максимум постійних мешканців: ${asText(d.maxOccupants)} (включно з орендарем).` : '',
        `Тварини: ${d.allowPets ? 'дозволено; орендар відповідає за шкоду та витрати' : 'лише якщо не завдають надмірних незручностей; бажано повідомити орендодавця'}.`,
        `Куріння: ${d.allowSmoking ? 'дозволено' : 'заборонено'} в квартирі та спільних зонах.`,
        `Короткострокова здача (Airbnb тощо) — піднайм; ${d.allowAirbnb ? 'дозволено, ризики на орендарі' : 'заборонено без письмової згоди'}.`,
        `Підприємницька діяльність: ${d.businessUseAllowed ? 'дозволена в межах звичайного зношення' : 'лише за письмовою згодою (§ 2255 ЦК)'}.`,
        d.inspectionAllowed
          ? 'Орендодавець може оглянути квартиру після щонайменше 24 год письмового (e-mail) попередження (§ 2219 ЦК).'
          : 'Доступ орендодавця — за § 2219 ЦК.',
        d.strictPenalties ? 'Серйозні порушення можуть призвести до розірвання без попередження за законом.' : '',
        'Орендар утримує помешкання, повідомляє про вади, дозволяє ремонт, оплачує дрібний ремонт за § 2257, без змін без згоди.',
        'Піднайм частини — якщо орендар там живе; усього помешкання без проживання — лише з письмовою згодою.',
        'За запитом — підтвердження страхування відповідальності протягом 7 днів.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'VII. ПЕРЕДАЧА ТА ПРОТОКОЛ',
      body: [
        d.keysCount ? `Ключі: ${asText(d.keysCount)} комплект(ів).` : '',
        'Копії ключів — за згодою; втрата — негайне повідомлення; заміна замка — за вини орендаря.',
        d.electricityMeter ? `Електролічильник: ${asText(d.electricityMeter)} кВт·год.` : '',
        d.gasMeter ? `Газ: ${asText(d.gasMeter)} м³.` : '',
        d.waterMeter ? `Холодна вода: ${asText(d.waterMeter)} м³.` : '',
        d.hotWaterMeter ? `Гаряча вода: ${asText(d.hotWaterMeter)} м³.` : '',
        d.equipmentList ? `Обладнання: ${asText(d.equipmentList)}.` : '',
        d.knownDefects ? `Вади: ${asText(d.knownDefects)}.` : 'Без заявлених вад понад нормальне зношення.',
        'Детальний протокол — додаток № 1, невід’ємна частина договору.',
      ].filter(Boolean) as string[],
    },
    {
      title: 'VIII. ЗАКІНЧЕННЯ ТА ПОВЕРНЕННЯ',
      body: [
        d.duration === 'indefinite'
          ? 'Безстроковий договір можна розірвати попередженням, угодою або за законом.'
          : 'Строковий договір закінчується зі строком; попередження — лише на підставах закону.',
        'При закінченні орендар звільняє приміщення, забирає речі, повертає стан з урахуванням нормального зношення, ключі та протокол.',
        `За прострочення повернення — щоденна санкція ${asText(d.lateVacatePenalty, 'добова орендна плата')}.`,
      ],
    },
    {
      title: 'IX. АВАРІЇ ТА РЕМОНТ',
      body: [
        'Про аварії (протікання, опалення тощо) — протягом 24 годин.',
        'Термінові роботи орендар може організувати без попередньої згоди з негайним повідомленням орендодавця.',
        MINOR_REPAIRS_UK,
        'Капітальний ремонт — орендодавець, якщо не через вину орендаря чи гостей.',
      ],
    },
    {
      title: 'X. ВРУЧЕННЯ ДОКУМЕНТІВ',
      body: [
        `Орендодавець: ${asText(d.landlordAddress)}${d.landlordEmail ? `, e-mail: ${asText(d.landlordEmail)}` : ''}.`,
        `Орендар: ${propertyAddress}${d.tenantEmail ? `, e-mail: ${asText(d.tenantEmail)}` : ''}.`,
        'Зміни та розірвання — особисто, рекомендованим листом, датаційною скринькою або іншим доказовим способом.',
        'E-mail — для поточної комунікації, якщо адресу надано.',
        'Відмова або невикуплення пошти може вважатися врученням за правилами.',
      ],
    },
    ...premiumContent,
    {
      title: `${hasPremiumClauses ? 'XIII' : 'XI'}. ЗАКЛЮЧНІ ПОЛОЖЕННЯ`,
      body: [
        'Договір регулюється правом Чехії, зокрема ЦК та законом № 67/2013 Зб.',
        disputeClauseUk(d),
        'Два примірники; по одному кожній стороні.',
        'Зміни — письмово, з нумерацією та підписами.',
        'Недійсність одного положення не впливає на решту.',
        'Додаток № 1 — протокол передачі.',
        'Зміна власника не припиняє оренду; набувач вступає в права орендодавця (§ 2221 ЦК).',
        'Персональні дані — GDPR та закон № 110/2019 Зб.',
        'Форс-мажор (§ 2913(2) ЦК) не звільняє від грошових зобов’язань.',
      ],
    },
    {
      title: `${hasPremiumClauses ? 'XIV' : 'XII'}. ПІДПИСИ`,
      body: [],
    },
    {
      title: 'ДОДАТОК № 1 – ПОЯСНЮВАЛЬНИЙ ПРОТОКОЛ ПЕРЕДАЧІ',
      body: [
        'Пояснювальний український підсумок передачі. Первинний чеський протокол у PDF має перевагу при розбіжностях.',
        `Квартира: ${propertyAddress}`,
        `Орендодавець: ${asText(d.landlordName)} · Орендар: ${asText(d.tenantName)}`,
        `Дата передачі: ${formatDate(d.handoverDate)}`,
        d.electricityMeter
          ? `Електрика (${asText(d.electricityMeterSerial, '—')}): ${asText(d.electricityMeter)} кВт·год`
          : '',
        d.gasMeter ? `Газ (${asText(d.gasMeterSerial, '—')}): ${asText(d.gasMeter)} м³` : '',
        d.waterMeter ? `Холодна вода (${asText(d.waterMeterSerial, '—')}): ${asText(d.waterMeter)} м³` : '',
        d.hotWaterMeter ? `Гаряча вода (${asText(d.hotWaterMeterSerial, '—')}): ${asText(d.hotWaterMeter)} м³` : '',
        d.keysCount ? `Ключі: ${asText(d.keysCount)}` : '',
        d.equipmentList ? `Обладнання: ${asText(d.equipmentList)}` : '',
        d.knownDefects ? `Вади/примітки: ${asText(d.knownDefects)}` : 'Без заявлених вад понад нормальне зношення.',
      ].filter(Boolean) as string[],
    },
  ];
}
