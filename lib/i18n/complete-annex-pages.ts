import type { ExpatContractType } from '@/lib/locale';

/**
 * English and Ukrainian versions of the complete-tier helper pages (signing
 * guide and pre-signing checklist) for the six contracts sold to foreigners.
 * They are practical SmlouvaHned guidance, not contract text, so a foreign
 * buyer gets them in the language they filled the form in.
 *
 * Line conventions match the Czech originals in lib/pdf.ts: an upper-case line
 * or "N. TITLE" is a heading, "• " a bullet, "☐  " a checklist item, '' a gap.
 */

type AnnexLocale = 'en' | 'ua';

export type CompleteAnnexLabels = {
  guideKicker: string;
  checklistKicker: string;
};

export const COMPLETE_ANNEX_LABELS: Record<AnnexLocale, CompleteAnnexLabels> = {
  en: {
    guideKicker: 'ANNEX TO THE DOCUMENT — SIGNING GUIDE',
    checklistKicker: 'ANNEX TO THE DOCUMENT — CHECKLIST',
  },
  ua: {
    guideKicker: 'ДОДАТОК ДО ДОКУМЕНТА — ПОРАДИ ЩОДО ПІДПИСАННЯ',
    checklistKicker: 'ДОДАТОК ДО ДОКУМЕНТА — КОНТРОЛЬНИЙ СПИСОК',
  },
};

const GUIDE_COMMON: Record<AnnexLocale, string[]> = {
  en: [
    'SIGNING AND ARCHIVING GUIDE',
    '',
    'Recommended steps for signing, verifying and keeping your contract. The guide refers to the Czech contract, which is the version the parties sign.',
    '',
    '1. BEFORE SIGNING',
    '• Read the whole contract including its annexes; the English translation in this PDF helps you understand every article.',
    '• Check all details: names, addresses, amounts and dates.',
    '• Prepare any annexes (handover protocol etc.) for signing together with the contract.',
    '• Make sure both parties have enough time to read the document.',
    '',
    '2. SIGNING',
    '• Sign at least two counterparts — one for each party.',
    '• Sign on the signature lines at the end of the Czech contract.',
    '• Use a permanent pen (ballpoint).',
    '• For multi-page contracts we recommend initialling every page.',
    '• Fill in the place and date on the day you actually sign.',
    '',
    '3. CERTIFIED SIGNATURE (OPTIONAL)',
    '• Consider having signatures certified where certainty of identity matters or where the law, an authority or the other party requires it.',
    '• Signatures can be certified, for example, at a Czech POINT office or by a notary; check the requirements for the specific use.',
    '',
    '4. ARCHIVING',
    '• Keep the original for the whole term of the contract and at least as long as claims may be raised; the general limitation period is 3 years, longer for some claims.',
    '• Make a digital backup (scan or photo).',
    '',
    '5. ELECTRONIC SIGNATURE',
    '• The contract can be signed electronically under EU Regulation No. 910/2014 (eIDAS) and Czech Act No. 297/2016 Coll.',
    '• Under eIDAS, a qualified electronic signature (QES) has the same effect as a handwritten signature.',
    '• Other electronic signatures cannot be denied legal effect just because they are electronic; their evidential value depends on identification, document integrity and the audit trail.',
    '• Where a certified signature is required, check the special conditions for replacing it electronically; an ordinary electronic signature may not be enough.',
  ],
  ua: [
    'ПОРАДИ ЩОДО ПІДПИСАННЯ ТА ЗБЕРІГАННЯ',
    '',
    'Рекомендований порядок підписання, засвідчення та зберігання договору. Поради стосуються чеського договору — саме цю версію підписують сторони.',
    '',
    '1. ПЕРЕД ПІДПИСАННЯМ',
    '• Уважно прочитайте весь договір разом із додатками; український переклад у цьому PDF допоможе зрозуміти кожну статтю.',
    '• Перевірте всі дані: імена, адреси, суми та дати.',
    '• Підготуйте додатки (акт приймання-передачі тощо) до підписання разом із договором.',
    '• Переконайтеся, що обидві сторони мали достатньо часу ознайомитися з документом.',
    '',
    '2. ПІДПИСАННЯ',
    '• Підпишіть щонайменше два примірники — по одному для кожної сторони.',
    '• Підписуйтеся на рядках для підпису в кінці чеського договору.',
    '• Використовуйте стійке чорнило (кулькову ручку).',
    '• Для багатосторінкових договорів радимо парафувати кожну сторінку.',
    '• Місце й дату заповнюйте в день фактичного підписання.',
    '',
    '3. ЗАСВІДЧЕННЯ ПІДПИСУ (ЗА БАЖАННЯМ)',
    '• Засвідчення підпису варто розглянути, якщо важлива впевненість у особі або цього вимагає закон, установа чи інша сторона.',
    '• Підпис можна засвідчити, наприклад, у Czech POINT або в нотаріуса; перевірте вимоги для конкретної дії.',
    '',
    '4. ЗБЕРІГАННЯ',
    '• Зберігайте оригінал протягом усього строку дії договору і щонайменше доти, доки можуть бути заявлені вимоги; загальний строк позовної давності — 3 роки, для деяких вимог довший.',
    '• Зробіть цифрову копію (скан або фото).',
    '',
    '5. ЕЛЕКТРОННИЙ ПІДПИС',
    '• Договір можна підписати електронно відповідно до Регламенту ЄС № 910/2014 (eIDAS) та чеського закону № 297/2016 Sb.',
    '• Згідно з eIDAS кваліфікований електронний підпис (QES) має таку саму силу, як власноручний.',
    '• Іншому електронному підпису не можна відмовити в юридичній силі лише через те, що він електронний; його доказова сила залежить від ідентифікації, цілісності документа та журналу дій.',
    '• Якщо потрібен засвідчений підпис, перевірте особливі умови його електронної заміни; звичайного електронного підпису може бути недостатньо.',
  ],
};

const GUIDE_SPECIFIC: Record<AnnexLocale, Record<ExpatContractType, string[]>> = {
  en: {
    lease: [
      '6. SPECIFIC NOTES FOR THE LEASE',
      '• Hand over the flat when the contract is signed and fill in the handover protocol.',
      '• Document the condition of the property with photos (meters, walls, floors, appliances).',
      '• The Tenant receives all keys; record their number in the handover protocol.',
      '• Pay the security deposit in the agreed way and keep the proof of payment.',
    ],
    car_sale: [
      '6. SPECIFIC NOTES FOR THE CAR SALE',
      '• Hand over the registration certificate and the technical certificate when signing.',
      '• Apply to the authority for the change of owner within 10 working days (§ 8(2) of Act No. 56/2001 Coll.).',
      '• Record the odometer reading and the overall condition of the vehicle with photos.',
      '• Check the vehicle register that no transfer ban applies to the vehicle.',
      '• The Buyer arranges new compulsory liability insurance no later than the day ownership passes.',
    ],
    employment: [
      '6. SPECIFIC NOTES FOR THE EMPLOYMENT CONTRACT',
      '• The Employee must receive one counterpart no later than on the first working day.',
      '• The Employer must register the Employee with the Czech Social Security Administration (ČSSZ) and the health insurance company.',
      '• Before signing, check any work permit or residence requirements that apply to the Employee.',
    ],
    dpp: [
      '6. SPECIFIC NOTES FOR THE DPP AGREEMENT',
      '• The Employer reports the DPP to the Czech Social Security Administration (ČSSZ) in line with current rules.',
      '• Keep track of the limit of 300 hours per calendar year with one employer.',
      '• Keep track of the monthly earnings threshold (CZK 12,000 for 2026); exceeding it means participation in insurance.',
      '• Hand over the results of the work in the way agreed in the contract.',
    ],
    sublease: [
      '6. SPECIFIC NOTES FOR THE SUBLEASE',
      '• The Subtenant should receive a copy (or an extract) of the main lease.',
      '• When the main lease ends, the sublease ends too — inform the Subtenant well in advance.',
      '• Fill in a handover protocol for the premises, as for a lease.',
    ],
    power_of_attorney: [
      '6. SPECIFIC NOTES FOR THE POWER OF ATTORNEY',
      '• For real estate, court proceedings and banks the Principal’s signature usually has to be certified.',
      '• The Principal keeps the original; the Agent presents a certified copy where needed.',
      '• Notify a revocation in writing to the Agent and to the third parties where the power of attorney was used.',
    ],
  },
  ua: {
    lease: [
      '6. ОСОБЛИВІ ПОРАДИ ДЛЯ ДОГОВОРУ ОРЕНДИ',
      '• Під час підписання договору передайте квартиру та складіть акт приймання-передачі.',
      '• Зафіксуйте стан нерухомості на фото (лічильники, стіни, підлога, побутова техніка).',
      '• Орендар отримує всі ключі; їхню кількість запишіть в акт приймання-передачі.',
      '• Сплатіть грошову заставу погодженим способом і збережіть підтвердження оплати.',
    ],
    car_sale: [
      '6. ОСОБЛИВІ ПОРАДИ ДЛЯ КУПІВЛІ-ПРОДАЖУ АВТО',
      '• Під час підписання передайте свідоцтво про реєстрацію та технічний паспорт.',
      '• Подайте заяву про зміну власника до органу протягом 10 робочих днів (§ 8 ч. 2 закону № 56/2001 Sb.).',
      '• Зафіксуйте показники одометра та загальний стан авто на фото.',
      '• Перевірте в реєстрі транспортних засобів, що на авто немає заборони переоформлення.',
      '• Покупець оформлює нове обов’язкове страхування не пізніше дня переходу права власності.',
    ],
    employment: [
      '6. ОСОБЛИВІ ПОРАДИ ДЛЯ ТРУДОВОГО ДОГОВОРУ',
      '• Працівник має отримати один примірник не пізніше першого робочого дня.',
      '• Роботодавець зобов’язаний зареєструвати працівника в ČSSZ та у відповідній медичній страховій компанії.',
      '• Перед підписанням перевірте вимоги щодо дозволу на роботу чи перебування, які стосуються працівника.',
    ],
    dpp: [
      '6. ОСОБЛИВІ ПОРАДИ ДЛЯ ДОГОВОРУ DPP',
      '• Роботодавець повідомляє ČSSZ про DPP відповідно до чинних правил.',
      '• Стежте за лімітом 300 годин на календарний рік в одного роботодавця.',
      '• Стежте за місячним порогом доходу (12 000 крон у 2026 році); його перевищення означає участь у страхуванні.',
      '• Передайте результати роботи способом, погодженим у договорі.',
    ],
    sublease: [
      '6. ОСОБЛИВІ ПОРАДИ ДЛЯ ПІДНАЙМУ',
      '• Піднаймач має отримати копію (або витяг) основного договору оренди.',
      '• Після припинення основної оренди припиняється й піднайм — повідомте піднаймача заздалегідь.',
      '• Складіть акт приймання-передачі приміщення так само, як при оренді.',
    ],
    power_of_attorney: [
      '6. ОСОБЛИВІ ПОРАДИ ДЛЯ ДОВІРЕНОСТІ',
      '• Для нерухомості, судових справ і банків підпис довірителя зазвичай має бути засвідчений.',
      '• Оригінал залишається в довірителя; повірений за потреби пред’являє засвідчену копію.',
      '• Про відкликання довіреності письмово повідомте повіреного та третіх осіб, де її використовували.',
    ],
  },
};

const CHECKLIST_COMMON: Record<AnnexLocale, string[]> = {
  en: [
    'PRE-SIGNING CHECKLIST',
    '',
    'Before signing, check each of the following points:',
    '',
    '☐  The names of all contracting parties are correct',
    '☐  Permanent addresses / registered offices are up to date',
    '☐  Dates of birth / company IDs are free of typos',
    '☐  The subject of the contract is clearly defined',
    '☐  The financial terms (price, rent, wage) match the parties’ agreement',
    '☐  The effective date of the contract is correct',
    '☐  The term and notice conditions match the agreement',
    '☐  The payment terms are clear and complete',
    '☐  The rights and obligations of both parties are balanced',
    '☐  Contractual penalties are reasonable and within legal limits',
    '☐  The way of resolving disputes is stated',
    '☐  The contract contains no blank fields',
    '☐  The number of counterparts matches the number of parties',
    '☐  All annexes are attached and complete',
  ],
  ua: [
    'КОНТРОЛЬНИЙ СПИСОК ПЕРЕД ПІДПИСАННЯМ',
    '',
    'Перед підписанням договору перевірте кожен із наведених пунктів:',
    '',
    '☐  Імена всіх сторін договору вказано правильно',
    '☐  Адреси постійного проживання / місцезнаходження актуальні',
    '☐  Дати народження / IČO без помилок',
    '☐  Предмет договору визначено чітко й однозначно',
    '☐  Фінансові умови (ціна, орендна плата, зарплата) відповідають домовленості сторін',
    '☐  Дату набрання чинності договором вказано правильно',
    '☐  Строк дії та умови припинення відповідають домовленості',
    '☐  Умови оплати чіткі та повні',
    '☐  Права й обов’язки обох сторін збалансовані',
    '☐  Договірні штрафи помірні й не перевищують законних меж',
    '☐  Спосіб вирішення спорів зазначено',
    '☐  У договорі немає незаповнених полів',
    '☐  Кількість примірників відповідає кількості сторін',
    '☐  Усі додатки додано та вони повні',
  ],
};

const CHECKLIST_SPECIFIC: Record<AnnexLocale, Record<ExpatContractType, string[]>> = {
  en: {
    lease: [
      'SPECIFICALLY FOR THE LEASE:',
      '☐  The address and layout of the flat match reality',
      '☐  The rent and the advance payments for services are correct',
      '☐  The security deposit does not exceed three months’ rent (§ 2254 of the Civil Code)',
      '☐  The settlement of services is regulated',
      '☐  The handover protocol is ready for signing',
    ],
    car_sale: [
      'SPECIFICALLY FOR THE CAR SALE:',
      '☐  The VIN matches the registration documents',
      '☐  The odometer reading is recorded',
      '☐  All known defects of the vehicle are stated',
      '☐  The handover of the registration documents is agreed',
    ],
    employment: [
      'SPECIFICALLY FOR THE EMPLOYMENT CONTRACT:',
      '☐  The type of work matches the actual position',
      '☐  The place of work is stated correctly',
      '☐  The start date is realistic',
      '☐  The wage terms match the agreement',
      '☐  The probationary period does not exceed the statutory maximum',
    ],
    dpp: [
      'SPECIFICALLY FOR THE DPP AGREEMENT:',
      '☐  The scope of work does not exceed 300 hours per year with one employer',
      '☐  Monthly pay below the insurance threshold (CZK 12,000 for 2026), or insurance is accounted for',
      '☐  The work task is clearly defined',
      '☐  The deadline and the method of payment are clear',
    ],
    sublease: [
      'SPECIFICALLY FOR THE SUBLEASE:',
      '☐  The landlord’s consent to the sublease is documented',
      '☐  The main lease (or an extract) is available to the Subtenant',
      '☐  The sublease term does not exceed the term of the main lease',
      '☐  The handover protocol for the premises is ready',
    ],
    power_of_attorney: [
      'SPECIFICALLY FOR THE POWER OF ATTORNEY:',
      '☐  The scope of authorisation is specific (not “in all matters”)',
      '☐  The Principal’s signature is certified where required (real estate, courts, banks)',
      '☐  The validity period is stated if it is limited',
      '☐  The Agent has accepted the power of attorney (by signature or acceptance)',
    ],
  },
  ua: {
    lease: [
      'ОКРЕМО ДЛЯ ДОГОВОРУ ОРЕНДИ:',
      '☐  Адреса та планування квартири відповідають дійсності',
      '☐  Розмір орендної плати та авансових платежів за послуги правильний',
      '☐  Застава не перевищує трикратної місячної орендної плати (§ 2254 ЦК)',
      '☐  Порядок розрахунку за послуги врегульовано',
      '☐  Акт приймання-передачі готовий до підписання',
    ],
    car_sale: [
      'ОКРЕМО ДЛЯ КУПІВЛІ-ПРОДАЖУ АВТО:',
      '☐  VIN відповідає даним у реєстраційних документах',
      '☐  Показники одометра зафіксовано',
      '☐  Усі відомі вади авто зазначено',
      '☐  Спосіб передачі реєстраційних документів погоджено',
    ],
    employment: [
      'ОКРЕМО ДЛЯ ТРУДОВОГО ДОГОВОРУ:',
      '☐  Вид роботи відповідає фактичній посаді',
      '☐  Місце роботи зазначено правильно',
      '☐  Дата початку роботи реальна',
      '☐  Умови оплати праці відповідають домовленості',
      '☐  Випробувальний строк не перевищує законного максимуму',
    ],
    dpp: [
      'ОКРЕМО ДЛЯ ДОГОВОРУ DPP:',
      '☐  Обсяг роботи не перевищить 300 годин на рік в одного роботодавця',
      '☐  Місячна винагорода нижча за поріг участі в страхуванні (12 000 крон у 2026 році), або страхування враховано',
      '☐  Робоче завдання визначено чітко',
      '☐  Строк виконання та спосіб виплати зрозумілі',
    ],
    sublease: [
      'ОКРЕМО ДЛЯ ПІДНАЙМУ:',
      '☐  Згоду орендодавця на піднайм підтверджено',
      '☐  Основний договір оренди (або витяг) доступний піднаймачу',
      '☐  Строк піднайму не перевищує строку основної оренди',
      '☐  Акт приймання-передачі приміщення підготовлено',
    ],
    power_of_attorney: [
      'ОКРЕМО ДЛЯ ДОВІРЕНОСТІ:',
      '☐  Обсяг повноважень визначено конкретно (не «в усіх справах»)',
      '☐  Підпис довірителя засвідчено, де це потрібно (нерухомість, суди, банки)',
      '☐  Строк дії довіреності зазначено, якщо він обмежений',
      '☐  Повірений прийняв довіреність (підписом або акцептом)',
    ],
  },
};

export function getLocalizedSigningInstructions(contractType: ExpatContractType, locale: AnnexLocale): string[] {
  return [...GUIDE_COMMON[locale], '', ...GUIDE_SPECIFIC[locale][contractType]];
}

export function getLocalizedPreSignChecklist(contractType: ExpatContractType, locale: AnnexLocale): string[] {
  return [...CHECKLIST_COMMON[locale], '', ...CHECKLIST_SPECIFIC[locale][contractType]];
}
