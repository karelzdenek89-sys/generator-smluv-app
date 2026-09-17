import {
  BASIC_ARCHIVE_DAYS,
  COMPLETE_ARCHIVE_DAYS,
  PRICING_TIER_CONFIG,
} from '@/lib/pricing';
import { isThematicPackageAvailable, THEMATIC_PACKAGE_CONFIG } from '@/lib/packages';
import { CHECKOUT_ADDON_CONFIG } from '@/lib/checkout-addons';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { CASE_DOCUMENT_PRICE_LABEL } from '@/lib/cases/documents';
import type { LegalDocument, LegalSection } from '@/lib/legal/types';

/**
 * Obchodní podmínky v angličtině a ukrajinštině.
 *
 * Zákazník, který nakupuje v /en nebo /ua, musí před platbou odškrtnout souhlas
 * s podmínkami — do 17. 9. 2026 vedl odkaz na stránku, která existovala jen
 * česky. Překlad je informativní; závazné zůstává české znění, což je u každé
 * jazykové verze uvedeno nahoře i v odkazu na originál.
 *
 * Ceny a lhůty se berou ze stejné konfigurace jako česká stránka, takže se
 * jazykové verze nemůžou rozejít při změně ceníku.
 */

export const TERMS_VERSION = '2026-09-17';

function priceRows(): Array<{ label: string; value: string }> {
  const rows = [
    { label: PRICING_TIER_CONFIG.basic.title, value: PRICING_TIER_CONFIG.basic.priceLabel },
    { label: PRICING_TIER_CONFIG.complete.title, value: PRICING_TIER_CONFIG.complete.priceLabel },
    { label: THEMATIC_PACKAGE_CONFIG.landlord.title, value: THEMATIC_PACKAGE_CONFIG.landlord.priceLabel },
    { label: THEMATIC_PACKAGE_CONFIG.employer_start.title, value: THEMATIC_PACKAGE_CONFIG.employer_start.priceLabel },
  ];
  if (isThematicPackageAvailable('work_order')) {
    rows.push({
      label: THEMATIC_PACKAGE_CONFIG.work_order.title,
      value: THEMATIC_PACKAGE_CONFIG.work_order.priceLabel,
    });
  }
  return rows;
}

function addonRows(): Array<{ label: string; value: string }> {
  return Object.values(CHECKOUT_ADDON_CONFIG).map((addon) => ({
    label: addon.title,
    value: addon.priceLabel,
  }));
}

const CASE_ENGINE_ON = isFeatureEnabled('caseEngine');

function enSections(): LegalSection[] {
  const sections: LegalSection[] = [
    {
      id: 'nature',
      heading: 'Nature of the service',
      blocks: [
        {
          kind: 'callout',
          label: 'Software tool, not a law firm',
          text:
            'SmlouvaHned.cz is an automated software tool (SaaS) for assembling standardised contract documents. It is operated by a sole trader, Karel Zdeněk (company ID 23660295). The platform is not a law firm and does not provide legal services within the meaning of Act No. 85/1996 Coll., on the legal profession. For complex, disputed or non-standard situations we recommend consulting an attorney (directory at cak.cz).',
        },
      ],
    },
    {
      id: 'operator',
      heading: '01. Operator and identification details',
      blocks: [
        {
          kind: 'p',
          text:
            'The operator of the website, the seller and the provider of the service is Karel Zdeněk, company ID (IČO) 23660295, place of business Plzeňská 189, 345 61 Staňkov, Czech Republic, contact e-mail info@smlouvahned.cz. SmlouvaHned.cz is the trade name of the online platform operated by this person.',
        },
        {
          kind: 'rows',
          rows: [
            { label: 'Operator', value: 'Karel Zdeněk' },
            { label: 'Company ID (IČO)', value: '23660295' },
            { label: 'Place of business', value: 'Plzeňská 189, 345 61 Staňkov, Czech Republic' },
            { label: 'Trade name of the platform', value: 'SmlouvaHned.cz' },
            { label: 'Contact e-mail', value: 'info@smlouvahned.cz' },
          ],
        },
        {
          kind: 'note',
          text:
            'These terms and conditions (the “Terms”) govern the rights and obligations between the Provider (Karel Zdeněk, company ID 23660295) and the user (the “Customer”).',
        },
      ],
    },
    {
      id: 'subject',
      heading: '02. Subject of the service',
      blocks: [
        {
          kind: 'p',
          text:
            'The subject of the service is enabling the Customer to assemble a structured contract document from the details entered into an online form. The platform is a software tool (SaaS) for the automated creation of standardised documents — it provides neither legal advice nor legal representation. The output is a PDF file and, where ordered by the Customer, an editable DOCX file or a related annex or checklist, intended for a final review and signature.',
        },
        {
          kind: 'p',
          text:
            'Document types currently available: residential lease, sublease, purchase agreement, vehicle purchase agreement, gift agreement, work contract, loan agreement, non-disclosure agreement (NDA), employment contract, agreement to perform work (DPP), service agreement, cooperation agreement, power of attorney, acknowledgement of debt.',
        },
        {
          kind: 'note',
          text:
            'The PDF opens in any current PDF reader and prints on A4. The optional DOCX is intended for current Microsoft Word, LibreOffice or another editor supporting Office Open XML; the appearance may differ slightly between editors. The files carry no DRM and require neither an account nor a subscription.',
        },
      ],
    },
    {
      id: 'order',
      heading: '03. Formation of the contract and the order',
      blocks: [
        {
          kind: 'p',
          text:
            'The contract between the Provider and the Customer is formed on completion of the order — that is, by filling in the form and successfully completing payment. The Customer acknowledges that the details entered must be true and complete.',
        },
        {
          kind: 'p',
          text:
            'The Customer is obliged to check the generated document before using it. The Provider is not liable for damage arising from incorrect completion of the form.',
        },
      ],
    },
    {
      id: 'prices',
      heading: '04. Prices and payment terms',
      blocks: [
        { kind: 'rows', label: 'Documents and packages', rows: priceRows() },
        { kind: 'rows', label: 'Optional add-ons at checkout', rows: addonRows() },
        { kind: 'note', text: 'The Provider is not a VAT payer. The prices stated are final.' },
        {
          kind: 'p',
          text:
            'Payment is made through the secure Stripe payment gateway (by card). Immediately after payment is confirmed, the Customer is given a download link on the page and the link is sent to the delivery e-mail address, which is mandatory.',
        },
        {
          kind: 'callout',
          label: 'Digital content and the right of withdrawal',
          text:
            'The performance consists of digital content (the generated PDF, and where ordered the DOCX) delivered immediately after payment is confirmed. In accordance with Section 1837(l) of the Czech Civil Code, before completing the order the Customer expressly confirms consent to performance beginning immediately and acknowledges that, upon complete delivery of the digital content, the Customer loses the right to withdraw from the contract within 14 days under Section 1829 of the Czech Civil Code. The time and the version of this confirmation are recorded with the order and the Customer receives them in the confirmation e-mail on a durable medium.',
        },
      ],
    },
    {
      id: 'availability',
      heading: '05. Availability of the document for download',
      blocks: [
        {
          kind: 'p',
          text: `The link for downloading the document and any ordered add-ons is active for ${BASIC_ARCHIVE_DAYS} days (${PRICING_TIER_CONFIG.basic.title}) or ${COMPLETE_ARCHIVE_DAYS} days (${PRICING_TIER_CONFIG.complete.title} and thematic packages) from the moment of payment. If the Customer purchases the 90-day availability add-on, the link is available for 90 days from payment. After that period the document may become unavailable because the temporary storage is deleted automatically. We recommend saving the document in a safe place immediately after downloading it. If you encounter any problem, contact us at info@smlouvahned.cz.`,
        },
      ],
    },
    {
      id: 'liability',
      heading: '06. Liability of the Provider',
      blocks: [
        {
          kind: 'p',
          text:
            'The Customer bears full responsibility for the accuracy and truthfulness of the details entered into the form. The Provider is not liable for damage arising from incorrect completion or from use of the generated document contrary to applicable law.',
        },
        {
          kind: 'p',
          text:
            'The templates are designed for typical standard situations and may not be suitable for atypical or disputed cases. The Provider provides neither legal advice nor legal representation.',
        },
        {
          kind: 'p',
          text:
            'The Provider’s total liability for damage incurred by the Customer in connection with a single order is limited to the amount actually paid by the Customer for that order, unless mandatory law provides otherwise. This limitation does not apply in the case of intent or gross negligence on the part of the Provider.',
        },
      ],
    },
    {
      id: 'complaints',
      heading: '07. Complaints',
      blocks: [
        {
          kind: 'p',
          text:
            'Submit a complaint to info@smlouvahned.cz. We will handle a complaint within 30 days of its delivery.',
        },
        {
          kind: 'p',
          text:
            'A complaint may be raised in particular where the generated document does not correspond to the details entered (a technical fault of the system). A complaint does not cover inappropriate use of the document or errors caused by incorrect completion by the Customer.',
        },
        {
          kind: 'p',
          text:
            'The Customer is entitled to turn to the Czech Trade Inspection Authority (Česká obchodní inspekce, ČOI) as the body for out-of-court resolution of consumer disputes. A proposal for out-of-court resolution can be filed at adr.coi.cz.',
        },
        {
          kind: 'note',
          text:
            'The European platform for online dispute resolution (ODR) was discontinued on 20 July 2025. Please use the Czech Trade Inspection Authority portal above instead.',
        },
      ],
    },
  ];

  if (CASE_ENGINE_ON) {
    sections.push({
      id: 'case',
      heading: '07a. Moje zakázka — continuing a job',
      blocks: [
        {
          kind: 'p',
          text:
            'After paying for a work contract, the Customer may open a “job” free of charge: an overview with the deadline, phase, tasks, history and optional e-mail deadline reminders (30, 14, 7 days and 1 day before the deadline). The reminders are functional notifications about the Customer’s own job, not commercial communications, and can be switched off at any time. Opening a job requires no registration — access is tied to a return link sent to the delivery e-mail address of the order. The link is valid for 30 days; the Customer may invalidate it at any time and delete or export the job.',
        },
        {
          kind: 'p',
          text: `Within a job the Customer can create follow-up documents (handover protocol, change order, confirmation of additional work, defect record, notice of defects and request for their removal) from the details the Customer supplies. For jobs opened from the Zakázka Plus package these documents are included in the package price; otherwise each document costs ${CASE_DOCUMENT_PRICE_LABEL} and constitutes digital content under clause 04 (express consent to immediate delivery, loss of the right of withdrawal upon complete delivery). The document is available for download for the duration of the job.`,
        },
        {
          kind: 'note',
          text:
            'A job with no activity is deleted automatically 12 months after the last change, a closed job 6 months after closing (a fixed date); an unpaid draft follow-up document stops being displayed 30 days after creation and is removed automatically no later than the following day. The content of the contract, the counterparty’s contact details and the payment identifier are not copied into the job. The Provider is not responsible for the Customer meeting deadlines; the reminders are a supporting tool, not a legal service.',
        },
      ],
    });
  }

  sections.push(
    {
      id: 'ip',
      heading: '08. Intellectual property',
      blocks: [
        {
          kind: 'p',
          text:
            'The generated document is owned by the Customer and may be used for personal and business purposes. The templates, the software and the visual design of the SmlouvaHned platform are the intellectual property of the Provider and may not be copied or distributed without consent.',
        },
      ],
    },
    {
      id: 'final',
      heading: '09. Final provisions',
      blocks: [
        {
          kind: 'p',
          text:
            'These Terms are governed by the law of the Czech Republic. Any disputes will be resolved by the court having subject-matter and territorial jurisdiction.',
        },
        {
          kind: 'p',
          text:
            'The Provider is entitled to amend the Terms unilaterally. The Provider will inform consumers of material changes by publishing the updated version here and by sending information to the e-mail address given with the order, at least 14 days before the change takes effect. A change to the Terms does not affect orders completed before it took effect. The current wording of the Terms is always available at smlouvahned.cz/obchodni-podminky.',
        },
      ],
    },
  );

  return sections;
}

function uaSections(): LegalSection[] {
  const sections: LegalSection[] = [
    {
      id: 'nature',
      heading: 'Характер послуги',
      blocks: [
        {
          kind: 'callout',
          label: 'Програмний інструмент, не адвокатська контора',
          text:
            'SmlouvaHned.cz — це автоматизований програмний інструмент (SaaS) для складання стандартизованих договірних документів. Оператором є фізична особа — підприємець Karel Zdeněk (IČO 23660295). Платформа не є адвокатською конторою і не надає юридичних послуг у розумінні Закону № 85/1996 Зб. про адвокатуру. Для складних, спірних чи нетипових ситуацій рекомендуємо консультацію з адвокатом (перелік на cak.cz).',
        },
      ],
    },
    {
      id: 'operator',
      heading: '01. Оператор та ідентифікаційні дані',
      blocks: [
        {
          kind: 'p',
          text:
            'Оператором вебсайту, продавцем і надавачем послуги є Karel Zdeněk, IČO 23660295, місце підприємницької діяльності Plzeňská 189, 345 61 Staňkov, Чеська Республіка, контактний e-mail info@smlouvahned.cz. SmlouvaHned.cz — комерційне позначення онлайн-платформи, яку веде ця особа.',
        },
        {
          kind: 'rows',
          rows: [
            { label: 'Оператор', value: 'Karel Zdeněk' },
            { label: 'IČO', value: '23660295' },
            { label: 'Місце підприємницької діяльності', value: 'Plzeňská 189, 345 61 Staňkov, Чеська Республіка' },
            { label: 'Комерційне позначення платформи', value: 'SmlouvaHned.cz' },
            { label: 'Контактний e-mail', value: 'info@smlouvahned.cz' },
          ],
        },
        {
          kind: 'note',
          text:
            'Ці комерційні умови (далі «Умови») регулюють права та обов’язки між Надавачем (Karel Zdeněk, IČO 23660295) і користувачем (далі «Замовник»).',
        },
      ],
    },
    {
      id: 'subject',
      heading: '02. Предмет послуги',
      blocks: [
        {
          kind: 'p',
          text:
            'Предметом послуги є надання Замовнику можливості скласти структурований договірний документ на основі даних, внесених в онлайн-форму. Платформа працює як програмний інструмент (SaaS) для автоматизованого створення стандартизованих документів — вона не надає ані юридичних консультацій, ані юридичного представництва. Результатом є файл PDF, а якщо Замовник його замовить — також редагований DOCX чи супутній додаток або чек-лист, призначені для підсумкової перевірки та підпису.',
        },
        {
          kind: 'p',
          text:
            'Наразі доступні типи документів: договір оренди, договір піднайму, договір купівлі-продажу, договір купівлі-продажу транспортного засобу, договір дарування, договір підряду, договір позики, договір про нерозголошення (NDA), трудовий договір, договір про виконання роботи (DPP), договір про надання послуг, договір про співпрацю, довіреність, визнання боргу.',
        },
        {
          kind: 'note',
          text:
            'PDF відкривається у звичайному сучасному переглядачі PDF і друкується на форматі A4. Необов’язковий DOCX призначений для сучасного Microsoft Word, LibreOffice або іншого редактора з підтримкою Office Open XML; вигляд між редакторами може дещо відрізнятися. Файли не захищені DRM, для їх використання не потрібні ані обліковий запис, ані передплата.',
        },
      ],
    },
    {
      id: 'order',
      heading: '03. Укладення договору та замовлення',
      blocks: [
        {
          kind: 'p',
          text:
            'Договір між Надавачем і Замовником виникає в момент завершення замовлення, тобто заповненням форми та успішним здійсненням оплати. Замовник усвідомлює, що внесені дані мають бути правдивими та повними.',
        },
        {
          kind: 'p',
          text:
            'Замовник зобов’язаний перевірити створений документ перед його використанням. Надавач не відповідає за шкоду, спричинену помилковим заповненням форми.',
        },
      ],
    },
    {
      id: 'prices',
      heading: '04. Ціни та умови оплати',
      blocks: [
        { kind: 'rows', label: 'Документи та пакети', rows: priceRows() },
        { kind: 'rows', label: 'Необов’язкові доповнення на оплаті', rows: addonRows() },
        { kind: 'note', text: 'Надавач не є платником ПДВ. Наведені ціни є остаточними.' },
        {
          kind: 'p',
          text:
            'Оплата здійснюється через захищений платіжний шлюз Stripe (карткою). Одразу після підтвердження оплати Замовнику відкривається посилання для завантаження документа на сторінці, і воно надсилається на обов’язково зазначену e-mail адресу доставки.',
        },
        {
          kind: 'callout',
          label: 'Цифровий вміст і право на відмову від договору',
          text:
            'Предметом виконання є цифровий вміст (створений PDF, за замовленням також DOCX), який доставляється одразу після підтвердження оплати. Відповідно до § 1837 літ. l) Цивільного кодексу ЧР Замовник перед завершенням замовлення прямо підтверджує згоду з негайним початком виконання та усвідомлює, що з повною доставкою цифрового вмісту втрачає право відмовитися від договору протягом 14 днів за § 1829 Цивільного кодексу ЧР. Час і версія цього підтвердження фіксуються при замовленні, і Замовник отримує їх у підтверджувальному листі на довговічному носії.',
        },
      ],
    },
    {
      id: 'availability',
      heading: '05. Доступність документа для завантаження',
      blocks: [
        {
          kind: 'p',
          text: `Посилання для завантаження документа та замовлених доповнень активне протягом ${BASIC_ARCHIVE_DAYS} днів (${PRICING_TIER_CONFIG.basic.title}) або ${COMPLETE_ARCHIVE_DAYS} днів (${PRICING_TIER_CONFIG.complete.title} і тематичні пакети) з моменту оплати. Якщо Замовник придбає доповнення «Доступність 90 днів», посилання діє 90 днів з моменту оплати. Після спливу цього строку документ може стати недоступним через автоматичне очищення тимчасового сховища. Рекомендуємо зберегти документ у безпечному місці одразу після завантаження. У разі проблем звертайтеся на info@smlouvahned.cz.`,
        },
      ],
    },
    {
      id: 'liability',
      heading: '06. Відповідальність Надавача',
      blocks: [
        {
          kind: 'p',
          text:
            'Замовник несе повну відповідальність за правильність і правдивість даних, внесених у форму. Надавач не відповідає за шкоду, що виникла внаслідок помилкового заповнення або невідповідного використання створеного документа всупереч чинному законодавству.',
        },
        {
          kind: 'p',
          text:
            'Шаблони розраховані на типові стандартні ситуації і можуть не підходити для нетипових чи спірних випадків. Надавач не надає ані юридичних консультацій, ані юридичного представництва.',
        },
        {
          kind: 'p',
          text:
            'Сукупна відповідальність Надавача за шкоду, заподіяну Замовнику у зв’язку з одним замовленням, обмежується сумою, фактично сплаченою Замовником за це замовлення, якщо імперативні норми не встановлюють інше. Це обмеження не застосовується у разі умислу або грубої необережності Надавача.',
        },
      ],
    },
    {
      id: 'complaints',
      heading: '07. Рекламації та скарги',
      blocks: [
        {
          kind: 'p',
          text: 'Рекламацію або скаргу надсилайте на info@smlouvahned.cz. Розглянемо її протягом 30 днів від отримання.',
        },
        {
          kind: 'p',
          text:
            'Рекламацію можна заявити передусім тоді, коли створений документ не відповідає внесеним даним (технічна помилка системи). Рекламація не поширюється на невідповідне використання документа чи помилки, спричинені неправильним заповненням з боку Замовника.',
        },
        {
          kind: 'p',
          text:
            'Замовник має право звернутися до Чеської торгової інспекції (Česká obchodní inspekce, ČOI) як до органу позасудового вирішення споживчих спорів. Заяву про позасудове вирішення спору можна подати за адресою adr.coi.cz.',
        },
        {
          kind: 'note',
          text:
            'Європейську платформу онлайн-вирішення споживчих спорів (ODR) було припинено 20 липня 2025 року. Для позасудового вирішення спору тому використовуйте зазначений вище портал Чеської торгової інспекції.',
        },
      ],
    },
  ];

  if (CASE_ENGINE_ON) {
    sections.push({
      id: 'case',
      heading: '07a. Moje zakázka — продовження замовлення',
      blocks: [
        {
          kind: 'p',
          text:
            'Після оплати договору підряду Замовник може безкоштовно створити «замовлення»: огляд із терміном, фазою, завданнями, історією та необов’язковими e-mail нагадуваннями про термін (за 30, 14, 7 днів і 1 день до терміну). Нагадування є функціональними сповіщеннями щодо власного замовлення Замовника, а не комерційними повідомленнями; їх можна будь-коли вимкнути. Створення замовлення не потребує реєстрації — доступ прив’язаний до зворотного посилання, надісланого на e-mail доставки замовлення. Посилання дійсне 30 днів; Замовник може будь-коли зробити його недійсним, а замовлення видалити або експортувати.',
        },
        {
          kind: 'p',
          text: `У замовленні можна створювати супутні документи (протокол передання-приймання, лист змін, підтвердження додаткових робіт, акт про недоліки, повідомлення про недоліки з вимогою їх усунення) з даних, які доповнює Замовник. Для замовлень, створених із пакета Zakázka Plus, ці документи входять у ціну пакета; в іншому разі кожен документ коштує ${CASE_DOCUMENT_PRICE_LABEL} і є цифровим вмістом за ст. 04 (пряма згода з негайною доставкою, втрата права на відмову при повній доставці). Документ доступний для завантаження протягом строку існування замовлення.`,
        },
        {
          kind: 'note',
          text:
            'Замовлення без активності автоматично видаляється через 12 місяців від останньої зміни, закрите замовлення — через 6 місяців від закриття (фіксований строк); неоплачений чернетковий супутній документ перестає відображатися через 30 днів від створення і щонайпізніше наступного дня видаляється автоматично. У замовлення не копіюється ані зміст договору, ані контактні дані другої сторони, ані ідентифікатор платежу. Надавач не відповідає за дотримання строків Замовником; нагадування — це допоміжний інструмент, а не юридична послуга.',
        },
      ],
    });
  }

  sections.push(
    {
      id: 'ip',
      heading: '08. Інтелектуальна власність',
      blocks: [
        {
          kind: 'p',
          text:
            'Створений документ належить Замовнику, і він може використовувати його в особистих та підприємницьких цілях. Шаблони, програмне забезпечення та візуальний дизайн платформи SmlouvaHned є інтелектуальною власністю Надавача і не можуть копіюватися чи розповсюджуватися без згоди.',
        },
      ],
    },
    {
      id: 'final',
      heading: '09. Прикінцеві положення',
      blocks: [
        {
          kind: 'p',
          text:
            'Ці Умови регулюються правом Чеської Республіки. Можливі спори вирішуватиме предметно та територіально компетентний суд.',
        },
        {
          kind: 'p',
          text:
            'Надавач має право змінювати Умови в односторонньому порядку. Про суттєві зміни він повідомляє споживачів публікацією оновленої версії на цій сторінці та надсиланням інформації на e-mail, зазначений при замовленні, щонайменше за 14 днів до набрання зміною чинності. Зміна Умов не впливає на замовлення, завершені до набрання нею чинності. Чинна редакція Умов завжди доступна на smlouvahned.cz/obchodni-podminky.',
        },
      ],
    },
  );

  return sections;
}

export function getTermsDocument(locale: 'en' | 'ua'): LegalDocument {
  if (locale === 'ua') {
    return {
      slug: 'terms',
      locale: 'ua',
      title: 'Комерційні',
      titleAccent: 'умови',
      version: `Версія ${TERMS_VERSION} • SmlouvaHned.cz`,
      metaTitle: 'Комерційні умови',
      metaDescription:
        'Комерційні умови платформи SmlouvaHned.cz: замовлення, ціни, оплата, доступність документів, рекламації та позасудове вирішення спорів.',
      prevailingNotice:
        'Це інформативний переклад. Обов’язковою є чеська редакція комерційних умов; у разі розбіжностей переважає чеський текст.',
      czechHref: '/obchodni-podminky',
      czechLinkLabel: 'Чеська редакція (обов’язкова)',
      sections: uaSections(),
      footer: 'Karel Zdeněk · IČO 23660295 · SmlouvaHned.cz © 2026',
      backLabel: 'Назад на головну',
    };
  }

  return {
    slug: 'terms',
    locale: 'en',
    title: 'Terms and',
    titleAccent: 'conditions',
    version: `Version ${TERMS_VERSION} • SmlouvaHned.cz`,
    metaTitle: 'Terms and conditions',
    metaDescription:
      'Terms and conditions of the SmlouvaHned.cz platform: orders, prices, payment, document availability, complaints and out-of-court dispute resolution.',
    prevailingNotice:
      'This is a translation provided for information. The binding version of the terms and conditions is the Czech one; in case of any discrepancy, the Czech wording prevails.',
    czechHref: '/obchodni-podminky',
    czechLinkLabel: 'Czech version (binding)',
    sections: enSections(),
    footer: 'Karel Zdeněk · Company ID 23660295 · SmlouvaHned.cz © 2026',
    backLabel: 'Back to the homepage',
  };
}
