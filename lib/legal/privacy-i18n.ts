import type { LegalDocument, LegalSection } from '@/lib/legal/types';

/**
 * Zásady ochrany osobních údajů v angličtině a ukrajinštině.
 *
 * Stejný důvod jako u obchodních podmínek: souhlas v checkoutu odkazuje na tuto
 * stránku a cizojazyčný zákazník ji do 17. 9. 2026 našel jen česky. Překlad je
 * informativní, závazné je české znění.
 */

export const PRIVACY_VERSION = '2026-09-17';

function enSections(): LegalSection[] {
  return [
    {
      id: 'controller',
      heading: '1. Data controller',
      blocks: [
        {
          kind: 'p',
          text:
            'The controller of personal data is the sole trader operating the SmlouvaHned.cz platform (the “Controller”):',
        },
        {
          kind: 'rows',
          rows: [
            { label: 'Controller', value: 'Karel Zdeněk, sole trader' },
            { label: 'Company ID (IČO)', value: '23660295' },
            { label: 'Place of business', value: 'Plzeňská 189, 345 61 Staňkov, Czech Republic' },
            { label: 'Contact e-mail', value: 'info@smlouvahned.cz' },
            { label: 'Website', value: 'smlouvahned.cz' },
          ],
        },
        {
          kind: 'p',
          text:
            'The Controller processes personal data in accordance with Regulation (EU) 2016/679 of the European Parliament and of the Council (GDPR) and Act No. 110/2019 Coll., on personal data processing.',
        },
      ],
    },
    {
      id: 'data',
      heading: '2. What personal data we process and why',
      blocks: [
        {
          kind: 'record',
          title: 'Data entered into the contract form',
          text:
            'Names, addresses, dates of birth, ID-card numbers and company IDs of the contracting parties, which you enter into the form yourself.',
          meta: [
            { label: 'Purpose', value: 'Generating a standardised contract document from the data you enter.' },
            { label: 'Legal basis', value: 'Performance of a contract (Art. 6(1)(b) GDPR).' },
            {
              label: 'Retention',
              value:
                'For the free experiment at most 24 hours from creation; no e-mail is required for that flow. For a paid document 7–30 days from payment depending on the variant purchased, or 90 days with the archiving add-on. The data is then deleted automatically from the temporary storage.',
            },
          ],
        },
        {
          kind: 'record',
          title: 'E-mail address',
          text: 'The delivery e-mail is entered by the customer before proceeding to payment.',
          meta: [
            { label: 'Purpose', value: 'Sending the download link, the order confirmation and secure access to the customer zone.' },
            { label: 'Legal basis', value: 'Performance of a contract and legitimate interest (Art. 6(1)(b) and (f) GDPR).' },
            {
              label: 'Retention',
              value: '7–30 days from the order depending on the document purchased, or 90 days with the archiving add-on, then deleted automatically.',
            },
          ],
        },
        {
          kind: 'record',
          title: 'Contact form',
          text: 'The name, e-mail, subject and content of the message you send from the Contact page.',
          meta: [
            { label: 'Purpose', value: 'Handling a query, a complaint or a customer request.' },
            { label: 'Legal basis', value: 'Pre-contractual negotiation, performance of a contract or legitimate interest in customer support (Art. 6(1)(b) and (f) GDPR).' },
            {
              label: 'Retention',
              value: 'For as long as the request is being handled, at most 12 months from the last communication; longer only where required by law or to protect legal claims.',
            },
          ],
        },
        {
          kind: 'record',
          title: 'Newsletter (tips and news)',
          text:
            'Only if you explicitly subscribe in the site footer, tick the consent box and then confirm the subscription through the link sent to the address given (double opt-in).',
          meta: [
            { label: 'Purpose', value: 'Sending practical tips about documents and information about the SmlouvaHned service.' },
            { label: 'Legal basis', value: 'Consent (Art. 6(1)(a) GDPR).' },
            { label: 'Retention', value: 'Until consent is withdrawn or the subscription is cancelled (link in every e-mail).' },
          ],
        },
        {
          kind: 'record',
          title: 'Moje zakázka (continuing a job)',
          text:
            'Only if, after paying for a work contract, you choose “Continue as a job”. The job holds your e-mail from the order, the job name, your role (client/contractor), the deadline, the price and pricing mode from the contract, the phase, tasks, notes, history and the details you add to follow-up documents (for example party names, a description of defects). Neither the content of the contract nor the counterparty’s contact details are copied into the job.',
          meta: [
            { label: 'Purpose', value: 'Tracking the progress of the job, sending return links and functional deadline reminders (only if you switch them on), and creating follow-up documents.' },
            { label: 'Legal basis', value: 'Performance of a contract (Art. 6(1)(b) GDPR); the reminders are functional notifications about your job, not commercial communications.' },
            {
              label: 'Retention',
              value:
                '12 months from the last change to the job; a job marked as closed 6 months from closing (a fixed date that further edits do not extend); an unpaid draft follow-up document 30 days from creation — after that it is no longer displayed and is removed by the automatic daily clean-up no later than the following day. Neither the content of the contract nor the payment identifier is stored in the job; from follow-up documents only what you write into them is kept. You can export the job (JSON) or delete it at any time from your overview; return links (valid 30 days) can be invalidated at any time.',
            },
          ],
        },
        {
          kind: 'record',
          title: 'Request for a follow-up service (commercial intent)',
          text:
            'Only if you explicitly ask to be contacted by a specific partner: the service category, a short description, urgency, price range, region and the contact details you choose to share. A record of consent is stored with the request (partner, purpose, shared fields, text version, time of granting and of withdrawal).',
          meta: [
            { label: 'Purpose', value: 'Passing your request to the partner you selected. Without an onboarded partner the request stays stored and is not passed anywhere.' },
            { label: 'Legal basis', value: 'Consent (Art. 6(1)(a) GDPR) granted specifically for that partner; it can be withdrawn at any time.' },
            { label: 'Retention', value: '6 months from creation, then automatic erasure. After consent is withdrawn the contact details are removed from the request immediately.' },
          ],
        },
        {
          kind: 'record',
          title: 'Free tools (checklists, guides)',
          text:
            'The state of a checklist is stored only in your browser (localStorage). No content is sent to the server — only an anonymous “tool started / completed” event, and only with your consent to product analytics.',
          meta: [],
        },
        {
          kind: 'record',
          title: 'Payment details',
          text:
            'Card numbers and bank details are processed exclusively by the Stripe payment gateway (Stripe, Inc., USA). The Controller has no access to them. More about Stripe and the GDPR: stripe.com/privacy.',
          meta: [],
        },
      ],
    },
    {
      id: 'recipients',
      heading: '3. Recipients of personal data',
      blocks: [
        { kind: 'p', text: 'Personal data may be passed to the following processors:' },
        {
          kind: 'list',
          items: [
            'Stripe, Inc. — payment processing. A processor under Art. 28 GDPR, PCI DSS Level 1 certified.',
            'Upstash (Redis) — temporary storage of form data while the document is generated and downloaded (7–30 days depending on the document purchased, or 90 days with the archiving add-on).',
            'Resend — transactional e-mails, delivery of the document link, forwarding of contact-form messages and sending the newsletter to confirmed subscribers.',
            'Upstash (Redis) — temporary record of an unconfirmed newsletter subscription for 24 hours and a record of confirmed consent for the duration of the subscription.',
            'Upstash (Redis) — job data (Moje zakázka) for 12 months from the last change (a closed job 6 months), hashes of return tokens and the reminder schedule; requests for follow-up services for 6 months.',
            'Stripe, Inc. — also payment for a follow-up job document; Stripe receives your e-mail and the document name, not its content.',
            'Vercel — hosting of the platform. Data is processed within the EEA or under corresponding safeguards.',
          ],
        },
        {
          kind: 'p',
          text:
            'A follow-up partner does not automatically receive the content of the contract or your contact details. The offer is selected from minimised categories. Only by a deliberate click does the user move to a specific provider’s website; any transfer of contact details requires separate, specific consent for that partner.',
        },
        {
          kind: 'p',
          text:
            'The Controller does not sell personal data to third parties. Marketing e-mails (the newsletter) are sent solely on the basis of voluntary consent, which you can withdraw at any time.',
        },
      ],
    },
    {
      id: 'transfers',
      heading: '4. Transfers outside the EEA',
      blocks: [
        {
          kind: 'p',
          text:
            'Stripe, Inc. and Resend are based in the USA. Transfers are safeguarded by standard contractual clauses (SCC) approved by the European Commission together with supplementary technical measures. Upstash and Vercel allow an EU region to be selected (which applies to our deployment).',
        },
      ],
    },
    {
      id: 'rights',
      heading: '5. Your rights',
      blocks: [
        {
          kind: 'list',
          items: [
            'Right of access — you may ask what data we process about you.',
            'Right to rectification — you may ask us to correct inaccurate data.',
            'Right to erasure — you may ask for your data to be deleted.',
            'Right to restriction of processing — you may ask us to restrict processing.',
            'Right to data portability — you may receive your data in a machine-readable format.',
            'Right to object — you may object to processing based on legitimate interest.',
          ],
        },
        { kind: 'p', text: 'Exercise your rights at info@smlouvahned.cz. We will respond to your request within 30 days.' },
      ],
    },
    {
      id: 'cookies',
      heading: '6. Cookies and analytics',
      blocks: [
        {
          kind: 'p',
          text:
            'SmlouvaHned uses no third-party marketing or profiling cookies. Technically necessary session cookies may be used for the basic functioning of the application. No behavioural advertising platform (Facebook Pixel, Google Ads remarketing and the like) is deployed on the website.',
        },
        {
          kind: 'p',
          text:
            'For anonymised traffic statistics we use Vercel Web Analytics (aggregated page views, without identifying a specific person). Our own product events (for example entering a form or clicking through to checkout) are sent only after your optional consent and without any link to a payment card; completed payments are recorded by the server only after Stripe confirms them.',
        },
        {
          kind: 'p',
          text:
            'Regardless of that choice, the server may record the necessary aggregated security and operational signals about rejected or invalid requests, so that checkout can be protected and an outage detected. These signals contain neither form content nor contact details and do not count as revenue or completion.',
        },
        {
          kind: 'p',
          text:
            'Only after that consent do we store, in first-party session storage and for the purpose of evaluating the path to the product, the category of the first source, the public page path and possibly an article slug. We actively delete the record after 30 minutes; an older record is additionally rejected and deleted on every read. The attribution itself contains no user UUID, form content, VIN, name, e-mail, telephone number or address. If you subsequently create a document, however, the server attaches a copy of this minimised attribution to the secure document record, so for that period it may be linkable to the order data: 24 hours for the free flow, 7–30 days for a paid document, or 90 days with the archiving add-on. The raw reporting buffer holds at most 5,000 events and the dashboard works with the last 30 days. We pass neither the attribution nor the order data to any affiliate partner.',
        },
        {
          kind: 'p',
          text:
            'Withdrawing consent stops further browser product events and new attributions and immediately deletes the attribution from the current browser tab. It does not retroactively remove server events already received or the attribution attached to a document created earlier; a server-side completion or download of such a previously attributed document may therefore be recorded for as long as it remains available. You can exercise your rights over these records as described in section 5.',
        },
        {
          kind: 'note',
          text: 'Analytics consent can be changed at any time on the Czech version of this page, where the settings panel is available.',
        },
      ],
    },
    {
      id: 'security',
      heading: '7. Data security',
      blocks: [
        {
          kind: 'p',
          text:
            'All communication is encrypted with TLS (HTTPS). Form data is stored in encrypted temporary storage with automatic erasure after 7–30 days depending on the document purchased, or after 90 days with the archiving add-on. Access to the data is limited to technically necessary persons. Payment details never pass through our servers.',
        },
      ],
    },
    {
      id: 'complaint',
      heading: '8. Right to lodge a complaint',
      blocks: [
        {
          kind: 'p',
          text:
            'You have the right to lodge a complaint with the supervisory authority — the Office for Personal Data Protection (Úřad pro ochranu osobních údajů, ÚOOÚ), Pplk. Sochora 27, 170 00 Prague 7, Czech Republic, www.uoou.cz.',
        },
      ],
    },
  ];
}

function uaSections(): LegalSection[] {
  return [
    {
      id: 'controller',
      heading: '1. Контролер персональних даних',
      blocks: [
        {
          kind: 'p',
          text:
            'Контролером персональних даних є фізична особа — підприємець, який веде платформу SmlouvaHned.cz (далі «Контролер»):',
        },
        {
          kind: 'rows',
          rows: [
            { label: 'Контролер', value: 'Karel Zdeněk, фізична особа — підприємець' },
            { label: 'IČO', value: '23660295' },
            { label: 'Місце підприємницької діяльності', value: 'Plzeňská 189, 345 61 Staňkov, Чеська Республіка' },
            { label: 'Контактний e-mail', value: 'info@smlouvahned.cz' },
            { label: 'Вебсайт', value: 'smlouvahned.cz' },
          ],
        },
        {
          kind: 'p',
          text:
            'Контролер обробляє персональні дані відповідно до Регламенту (ЄС) 2016/679 Європейського Парламенту і Ради (GDPR) та Закону № 110/2019 Зб. про обробку персональних даних.',
        },
      ],
    },
    {
      id: 'data',
      heading: '2. Які персональні дані ми обробляємо і навіщо',
      blocks: [
        {
          kind: 'record',
          title: 'Дані, внесені у форму договору',
          text:
            'Імена, адреси, дати народження, номери документів, що посвідчують особу, та IČO сторін договору, які ви самі вносите у форму.',
          meta: [
            { label: 'Мета', value: 'Створення стандартизованого договірного документа за внесеними вами даними.' },
            { label: 'Правова підстава', value: 'Виконання договору (ст. 6(1)(b) GDPR).' },
            {
              label: 'Строк зберігання',
              value:
                'Для безкоштовного експерименту щонайбільше 24 години від створення; e-mail для цього потоку ми не вимагаємо. Для платного документа 7–30 днів від оплати залежно від придбаного варіанта, або 90 днів із доповненням архівації. Потім дані автоматично видаляються з тимчасового сховища.',
            },
          ],
        },
        {
          kind: 'record',
          title: 'E-mail адреса',
          text: 'E-mail для доставки документа замовник вносить перед переходом до оплати.',
          meta: [
            { label: 'Мета', value: 'Надсилання посилання для завантаження, підтвердження замовлення та захищеного доступу до клієнтської зони.' },
            { label: 'Правова підстава', value: 'Виконання договору та законний інтерес (ст. 6(1)(b) і (f) GDPR).' },
            { label: 'Строк зберігання', value: '7–30 днів від замовлення залежно від придбаного документа, або 90 днів із доповненням архівації, потім автоматичне видалення.' },
          ],
        },
        {
          kind: 'record',
          title: 'Контактна форма',
          text: 'Ім’я, e-mail, тема та зміст повідомлення, яке ви надсилаєте зі сторінки «Контакт».',
          meta: [
            { label: 'Мета', value: 'Опрацювання запиту, рекламації або звернення клієнта.' },
            { label: 'Правова підстава', value: 'Переддоговірні перемовини, виконання договору або законний інтерес у клієнтській підтримці (ст. 6(1)(b) і (f) GDPR).' },
            { label: 'Строк зберігання', value: 'На час опрацювання запиту, щонайбільше 12 місяців від останньої комунікації; довше — лише якщо цього вимагає закон або захист правових вимог.' },
          ],
        },
        {
          kind: 'record',
          title: 'Розсилка (поради та новини)',
          text:
            'Лише якщо ви прямо підпишетеся в підвалі сайту, поставите позначку згоди і потім підтвердите підписку посиланням, надісланим на вказаний e-mail (double opt-in).',
          meta: [
            { label: 'Мета', value: 'Надсилання практичних порад щодо документів та інформації про сервіс SmlouvaHned.' },
            { label: 'Правова підстава', value: 'Згода (ст. 6(1)(a) GDPR).' },
            { label: 'Строк зберігання', value: 'До відкликання згоди або відписки (посилання є в кожному листі).' },
          ],
        },
        {
          kind: 'record',
          title: 'Moje zakázka (продовження замовлення)',
          text:
            'Лише якщо після оплати договору підряду ви оберете «Продовжити як замовлення». Замовлення містить ваш e-mail із замовлення, назву замовлення, вашу роль (замовник/виконавець), термін, ціну та ціновий режим з договору, фазу, завдання, нотатки, історію і дані, які ви додаєте до супутніх документів (наприклад, імена сторін, опис недоліків). Ані зміст договору, ані контактні дані другої сторони в замовлення не копіюються.',
          meta: [
            { label: 'Мета', value: 'Ведення перебігу замовлення, надсилання зворотних посилань і функціональних нагадувань про термін (лише якщо ви їх увімкнете), створення супутніх документів.' },
            { label: 'Правова підстава', value: 'Виконання договору (ст. 6(1)(b) GDPR); нагадування є функціональними сповіщеннями щодо вашого замовлення, а не комерційними повідомленнями.' },
            {
              label: 'Строк зберігання',
              value:
                '12 місяців від останньої зміни замовлення; закрите замовлення — 6 місяців від закриття (фіксований строк, який подальші правки не продовжують); неоплачений чернетковий супутній документ — 30 днів від створення, після чого він більше не відображається і щонайпізніше наступного дня його видаляє автоматичне щоденне прибирання. У замовлення не зберігаються ані зміст договору, ані ідентифікатор платежу; із супутніх документів зберігається лише те, що ви до них самі впишете. Замовлення можна будь-коли експортувати (JSON) або видалити у своєму огляді; зворотні посилання (дійсні 30 днів) можна будь-коли зробити недійсними.',
            },
          ],
        },
        {
          kind: 'record',
          title: 'Запит на супутню послугу (commercial intent)',
          text:
            'Лише якщо ви прямо попросите, щоб з вами зв’язався конкретний партнер: категорія послуги, стислий опис, терміновість, ціновий діапазон, край і контактні дані, які ви самі оберете для передання. Разом із запитом зберігається запис згоди (партнер, мета, передані поля, версія тексту, час надання та відкликання).',
          meta: [
            { label: 'Мета', value: 'Передання вашого запиту обраному вами партнерові. Без підготовленого партнера запит залишається збереженим і нікуди не передається.' },
            { label: 'Правова підстава', value: 'Згода (ст. 6(1)(a) GDPR), надана конкретно для цього партнера; її можна будь-коли відкликати.' },
            { label: 'Строк зберігання', value: '6 місяців від створення, потім автоматичне видалення. Після відкликання згоди контактні дані з запиту видаляються негайно.' },
          ],
        },
        {
          kind: 'record',
          title: 'Безкоштовні інструменти (чек-листи, путівники)',
          text:
            'Стан чек-листа зберігається лише у вашому браузері (localStorage). На сервер не надсилається жодний вміст — тільки анонімна подія «інструмент розпочато / завершено», і тільки за вашої згоди на продуктову аналітику.',
          meta: [],
        },
        {
          kind: 'record',
          title: 'Платіжні дані',
          text:
            'Номери платіжних карток і банківські дані обробляє виключно платіжний шлюз Stripe (Stripe, Inc., США). Контролер не має до них доступу. Докладніше про Stripe і GDPR: stripe.com/privacy.',
          meta: [],
        },
      ],
    },
    {
      id: 'recipients',
      heading: '3. Одержувачі персональних даних',
      blocks: [
        { kind: 'p', text: 'Персональні дані можуть передаватися таким обробникам:' },
        {
          kind: 'list',
          items: [
            'Stripe, Inc. — обробка платежів. Обробник за ст. 28 GDPR, сертифікація PCI DSS Level 1.',
            'Upstash (Redis) — тимчасове зберігання даних форми на час створення та завантаження документа (7–30 днів залежно від придбаного документа, або 90 днів із доповненням архівації).',
            'Resend — транзакційні листи, доставка посилання на документ, передання повідомлень із контактної форми та розсилка підтвердженим підписникам.',
            'Upstash (Redis) — тимчасовий запис непідтвердженої підписки протягом 24 годин і запис підтвердженої згоди на час підписки.',
            'Upstash (Redis) — дані замовлення (Moje zakázka) протягом 12 місяців від останньої зміни (закрите замовлення — 6 місяців), хеші зворотних токенів і план нагадувань; запити на супутні послуги — 6 місяців.',
            'Stripe, Inc. — також оплата супутнього документа замовлення; Stripe отримує ваш e-mail і назву документа, але не його зміст.',
            'Vercel — хостинг платформи. Дані обробляються в межах ЄЕЗ або за відповідних гарантій.',
          ],
        },
        {
          kind: 'p',
          text:
            'Супутній партнер не є автоматичним одержувачем ані змісту договору, ані контактних даних. Пропозиція добирається з мінімізованих категорій. Лише свідомим кліком користувач переходить на сайт конкретного надавача; можливе передання контактних даних потребує окремої, конкретної згоди для цього партнера.',
        },
        {
          kind: 'p',
          text:
            'Контролер не продає персональні дані третім особам. Маркетингові листи (розсилку) ми надсилаємо виключно на підставі добровільної згоди, яку ви можете будь-коли відкликати.',
        },
      ],
    },
    {
      id: 'transfers',
      heading: '4. Передання даних за межі ЄЕЗ',
      blocks: [
        {
          kind: 'p',
          text:
            'Stripe, Inc. і Resend розташовані у США. Передання захищене стандартними договірними положеннями (SCC), схваленими Європейською Комісією, та додатковими технічними заходами. Upstash і Vercel дозволяють обрати регіон ЄС (що стосується нашого розгортання).',
        },
      ],
    },
    {
      id: 'rights',
      heading: '5. Ваші права',
      blocks: [
        {
          kind: 'list',
          items: [
            'Право на доступ — ви можете запитати, які дані про вас ми обробляємо.',
            'Право на виправлення — ви можете попросити виправити неточні дані.',
            'Право на видалення — ви можете попросити видалити ваші дані.',
            'Право на обмеження обробки — ви можете попросити обмежити обробку.',
            'Право на перенесення даних — ви можете отримати свої дані у машинозчитуваному форматі.',
            'Право на заперечення — ви можете заперечити проти обробки на підставі законного інтересу.',
          ],
        },
        { kind: 'p', text: 'Права реалізуйте через info@smlouvahned.cz. На ваш запит відповімо протягом 30 днів.' },
      ],
    },
    {
      id: 'cookies',
      heading: '6. Файли cookie та аналітика',
      blocks: [
        {
          kind: 'p',
          text:
            'SmlouvaHned не використовує маркетингових чи профілюючих файлів cookie третіх сторін. Для базового функціонування застосунку можуть використовуватися технічно необхідні сесійні cookie. На сайті не розгорнуто жодної поведінкової рекламної платформи (Facebook Pixel, ремаркетинг Google Ads тощо).',
        },
        {
          kind: 'p',
          text:
            'Для анонімізованої статистики відвідуваності ми використовуємо Vercel Web Analytics (агреговані перегляди сторінок, без ідентифікації конкретної особи). Власні продуктові події (наприклад, вхід у форму або клік на оплату) ми надсилаємо лише після вашої необов’язкової згоди і без пов’язання з платіжною карткою; завершені платежі сервер фіксує аж після підтвердження від Stripe.',
        },
        {
          kind: 'p',
          text:
            'Незалежно від цього вибору сервер може фіксувати необхідні агреговані сигнали безпеки та експлуатації щодо відхилених або недійсних запитів, щоб можна було захистити оплату та виявити її збій. Ці сигнали не містять ані вмісту форми, ані контактних даних і не зараховуються як дохід чи завершення.',
        },
        {
          kind: 'p',
          text:
            'Лише після цієї згоди ми зберігаємо для оцінки шляху до продукту у first-party сесійному сховищі тільки категорію першого джерела, публічний шлях сторінки і, можливо, slug статті. Запис ми активно видаляємо через 30 хвилин; старіший запис до того ж відхиляємо і видаляємо при кожному читанні. Сама атрибуція не містить ані UUID користувача, ані вмісту форми, VIN, імені, e-mail, телефону чи адреси. Проте якщо ви згодом створите документ, сервер додасть копію цього мінімізованого атрибуційного запису до захищеного запису документа, і тому протягом цього часу він може бути пов’язуваним із даними замовлення: 24 години для безкоштовного потоку, 7–30 днів для платного документа, або 90 днів із доповненням архівації. Сирий звітний буфер містить щонайбільше 5 000 подій, а панель працює з останніми 30 днями. Ані атрибуцію, ані дані замовлення ми партнерам не передаємо.',
        },
        {
          kind: 'p',
          text:
            'Відкликання згоди зупиняє подальші браузерні продуктові події та нові атрибуції і негайно видаляє атрибуцію з поточної вкладки браузера. Воно не усуває ретроспективно вже отримані серверні події чи атрибуцію, приєднану до раніше створеного документа; серверне завершення чи завантаження такого раніше атрибутованого документа тому може фіксуватися протягом строку його доступності. Щодо цих записів ви можете реалізувати свої права за порядком із розділу 5.',
        },
        {
          kind: 'note',
          text: 'Згоду з аналітикою можна будь-коли змінити на чеській версії цієї сторінки, де доступна панель налаштувань.',
        },
      ],
    },
    {
      id: 'security',
      heading: '7. Захист даних',
      blocks: [
        {
          kind: 'p',
          text:
            'Уся комунікація шифрується протоколом TLS (HTTPS). Дані форм зберігаються у зашифрованому тимчасовому сховищі з автоматичним видаленням через 7–30 днів залежно від придбаного документа, або через 90 днів із доповненням архівації. Доступ до даних обмежено технічно необхідними особами. Платіжні дані ніколи не проходять через наші сервери.',
        },
      ],
    },
    {
      id: 'complaint',
      heading: '8. Право подати скаргу',
      blocks: [
        {
          kind: 'p',
          text:
            'Ви маєте право подати скаргу до наглядового органу — Управління із захисту персональних даних (Úřad pro ochranu osobních údajů, ÚOOÚ), Pplk. Sochora 27, 170 00 Praha 7, Чеська Республіка, www.uoou.cz.',
        },
      ],
    },
  ];
}

export function getPrivacyDocument(locale: 'en' | 'ua'): LegalDocument {
  if (locale === 'ua') {
    return {
      slug: 'privacy',
      locale: 'ua',
      title: 'Захист персональних',
      titleAccent: 'даних',
      version: `Версія ${PRIVACY_VERSION} • Згідно з Регламентом ЄС 2016/679 (GDPR)`,
      metaTitle: 'Захист персональних даних',
      metaDescription:
        'Як SmlouvaHned.cz обробляє персональні дані: цілі, правові підстави, строки зберігання, одержувачі, передання за межі ЄЕЗ і ваші права за GDPR.',
      prevailingNotice:
        'Це інформативний переклад. Обов’язковою є чеська редакція; у разі розбіжностей переважає чеський текст.',
      czechHref: '/gdpr',
      czechLinkLabel: 'Чеська редакція (обов’язкова)',
      sections: uaSections(),
      footer: 'SmlouvaHned © 2026',
      backLabel: 'Назад на головну',
    };
  }

  return {
    slug: 'privacy',
    locale: 'en',
    title: 'Personal data',
    titleAccent: 'protection',
    version: `Version ${PRIVACY_VERSION} • Under Regulation (EU) 2016/679 (GDPR)`,
    metaTitle: 'Privacy policy',
    metaDescription:
      'How SmlouvaHned.cz processes personal data: purposes, legal bases, retention periods, recipients, transfers outside the EEA and your rights under the GDPR.',
    prevailingNotice:
      'This is a translation provided for information. The binding version is the Czech one; in case of any discrepancy, the Czech wording prevails.',
    czechHref: '/gdpr',
    czechLinkLabel: 'Czech version (binding)',
    sections: enSections(),
    footer: 'SmlouvaHned © 2026',
    backLabel: 'Back to the homepage',
  };
}
