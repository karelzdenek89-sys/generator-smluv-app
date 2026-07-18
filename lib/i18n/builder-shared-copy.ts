import { normalizeLocale, type AppLocale } from '@/lib/locale';

export type BuilderSharedCopy = {
  readyTitle: string;
  selectedDocument: string;
  packageIncludes: string;
  variantIncludes: string;
  afterOrder: string;
  instantDownload: string;
  stripeNotice: string;
  completeCallout: string;
  tierHeading: string;
  tierIntro: string;
  cookies: {
    ariaLabel: string;
    body: string;
    more: string;
    accept: string;
  };
  newsletter: {
    heading: string;
    intro: string;
    emailLabel: string;
    emailPlaceholder: string;
    consent: string;
    privacy: string;
    revoke: string;
    sending: string;
    submit: string;
    success: string;
    successDetail: string;
    error: string;
  };
};

const COPY: Record<AppLocale, BuilderSharedCopy> = {
  cs: {
    readyTitle: 'Dokument připraven k odemknutí',
    selectedDocument: 'Vybraný dokument',
    packageIncludes: 'Součástí balíčku je',
    variantIncludes: 'Součástí varianty je',
    afterOrder: 'Po zaplacení získáte zvolený výstup ihned ke stažení, připravený k závěrečné kontrole a podpisu.',
    instantDownload: 'Stažení ihned po platbě. Bez registrace a bez předplatného.',
    stripeNotice: 'Platební údaje zpracovává Stripe. Dokument je standardizovaný výstup, ne individuální právní poradenství.',
    completeCallout: 'Rozšířená varianta přidává širší klauzule, checklist a praktičtější podklady pro kontrolu před podpisem.',
    tierHeading: 'Varianta dokumentu',
    tierIntro: 'Vyberte rozsah dokumentu podle složitosti vaší situace.',
    cookies: {
      ariaLabel: 'Informace o cookies',
      body: 'Používáme pouze technicky nezbytné prostředky a anonymizovanou statistiku návštěvnosti. Nepoužíváme marketingové ani profilující cookies třetích stran.',
      more: 'Více informací',
      accept: 'Rozumím',
    },
    newsletter: {
      heading: 'Tipy k dokumentům',
      intro: 'Praktické rady k nájemním a kupním smlouvám a novinky o službě — bez spamu.',
      emailLabel: 'E-mail',
      emailPlaceholder: 'vas@email.cz',
      consent: 'Souhlasím se zasíláním e-mailů s tipy a novinkami. Podrobnosti v',
      privacy: 'zásadách ochrany údajů',
      revoke: 'Souhlas mohu kdykoli odvolat.',
      sending: 'Odesílám…',
      submit: 'Přihlásit se k tipům',
      success: 'Hotovo — zkontrolujte svůj e-mail.',
      successDetail: 'Občas pošleme praktické tipy a novinky. Odhlášení je možné v každém e-mailu.',
      error: 'Přihlášení se nepodařilo. Zkuste to prosím znovu.',
    },
  },
  en: {
    readyTitle: 'Document ready to unlock',
    selectedDocument: 'Selected document',
    packageIncludes: 'Package includes',
    variantIncludes: 'Included in this level',
    afterOrder: 'After payment, your selected output is available immediately for final review and signature.',
    instantDownload: 'Download immediately after payment. No account or subscription.',
    stripeNotice: 'Stripe processes payment details. This is a standardised document output, not individual legal advice.',
    completeCallout: 'The extended level adds broader clauses, a checklist and practical materials for review before signing.',
    tierHeading: 'Document level',
    tierIntro: 'Choose the scope that fits the complexity of your situation.',
    cookies: {
      ariaLabel: 'Cookie information',
      body: 'We use only technically necessary features and anonymised traffic statistics. We do not use third-party marketing or profiling cookies.',
      more: 'More information',
      accept: 'Got it',
    },
    newsletter: {
      heading: 'Practical document tips',
      intro: 'Useful guidance for rental and purchase agreements plus product updates — no spam.',
      emailLabel: 'E-mail',
      emailPlaceholder: 'you@example.com',
      consent: 'I agree to receive e-mails with practical tips and updates. Details are in the',
      privacy: 'privacy policy',
      revoke: 'You can withdraw consent at any time.',
      sending: 'Submitting…',
      submit: 'Get practical tips',
      success: 'Done — please check your e-mail.',
      successDetail: 'We occasionally send practical tips and updates. Every e-mail includes an unsubscribe link.',
      error: 'Subscription failed. Please try again.',
    },
  },
  ua: {
    readyTitle: 'Документ готовий до отримання',
    selectedDocument: 'Обраний документ',
    packageIncludes: 'Пакет включає',
    variantIncludes: 'Цей рівень включає',
    afterOrder: 'Після оплати обраний результат одразу буде доступний для остаточної перевірки та підписання.',
    instantDownload: 'Завантаження одразу після оплати. Без реєстрації та підписки.',
    stripeNotice: 'Платіжні дані обробляє Stripe. Це стандартизований документ, а не індивідуальна юридична консультація.',
    completeCallout: 'Розширений рівень додає ширші положення, чекліст і практичні матеріали для перевірки перед підписанням.',
    tierHeading: 'Рівень документа',
    tierIntro: 'Оберіть обсяг документа відповідно до складності вашої ситуації.',
    cookies: {
      ariaLabel: 'Інформація про cookies',
      body: 'Ми використовуємо лише технічно необхідні засоби й анонімізовану статистику відвідуваності. Ми не використовуємо сторонні маркетингові чи профілюючі cookies.',
      more: 'Докладніше',
      accept: 'Зрозуміло',
    },
    newsletter: {
      heading: 'Практичні поради щодо документів',
      intro: 'Корисні поради щодо договорів оренди й купівлі та новини сервісу — без спаму.',
      emailLabel: 'E-mail',
      emailPlaceholder: 'you@example.com',
      consent: 'Я погоджуюся отримувати e-mail з практичними порадами та новинами. Деталі наведено в',
      privacy: 'політиці конфіденційності',
      revoke: 'Згоду можна відкликати будь-коли.',
      sending: 'Надсилання…',
      submit: 'Отримувати поради',
      success: 'Готово — перевірте свою електронну пошту.',
      successDetail: 'Час від часу ми надсилатимемо практичні поради та новини. У кожному листі є посилання для відписки.',
      error: 'Не вдалося оформити підписку. Спробуйте ще раз.',
    },
  },
};

export function getBuilderSharedCopy(locale?: string | null): BuilderSharedCopy {
  return COPY[normalizeLocale(locale)];
}

type TransactionalEmailCopy = {
  htmlLang: 'cs' | 'en' | 'uk';
  subject: (contractName: string) => string;
  title: string;
  documentReady: (contractName: string) => string;
  downloadPdf: string;
  downloadDocx: string;
  myDocuments: string;
  expiry: (days: number) => string;
  questions: string;
  footer: string;
};

const EMAIL_COPY: Record<AppLocale, TransactionalEmailCopy> = {
  cs: {
    htmlLang: 'cs',
    subject: (name) => `✅ Váš dokument je připraven ke stažení — ${name}`,
    title: 'Vaše platba byla přijata ✓',
    documentReady: (name) => `Dokument „${name}“ je připraven ke stažení.`,
    downloadPdf: 'STÁHNOUT PDF DOKUMENT',
    downloadDocx: 'STÁHNOUT EDITOVATELNÝ DOCX',
    myDocuments: 'MOJE DOKUMENTY (bezpečný přístup)',
    expiry: (days) => `Odkaz ke stažení je platný ${days} dní od zaplacení.`,
    questions: 'V případě dotazů nás kontaktujte na',
    footer: 'Dokumenty jsou generovány automaticky a neslouží jako individuální právní poradenství.',
  },
  en: {
    htmlLang: 'en',
    subject: (name) => `✅ Your document is ready to download — ${name}`,
    title: 'Your payment has been received ✓',
    documentReady: (name) => `Your “${name}” document is ready to download.`,
    downloadPdf: 'DOWNLOAD PDF DOCUMENT',
    downloadDocx: 'DOWNLOAD EDITABLE DOCX',
    myDocuments: 'MY DOCUMENTS (secure access)',
    expiry: (days) => `The download link is valid for ${days} days after payment.`,
    questions: 'If you have any questions, contact us at',
    footer: 'Documents are generated automatically and do not constitute individual legal advice.',
  },
  ua: {
    htmlLang: 'uk',
    subject: (name) => `✅ Ваш документ готовий до завантаження — ${name}`,
    title: 'Ваш платіж отримано ✓',
    documentReady: (name) => `Документ «${name}» готовий до завантаження.`,
    downloadPdf: 'ЗАВАНТАЖИТИ PDF-ДОКУМЕНТ',
    downloadDocx: 'ЗАВАНТАЖИТИ РЕДАГОВАНИЙ DOCX',
    myDocuments: 'МОЇ ДОКУМЕНТИ (безпечний доступ)',
    expiry: (days) => `Посилання для завантаження дійсне ${days} днів після оплати.`,
    questions: 'Якщо маєте запитання, напишіть нам на',
    footer: 'Документи створюються автоматично й не є індивідуальною юридичною консультацією.',
  },
};

const CONTRACT_NAMES: Record<AppLocale, Record<string, string>> = {
  cs: {
    lease: 'Nájemní smlouva', sublease: 'Podnájemní smlouva', employment: 'Pracovní smlouva',
    dpp: 'Dohoda o provedení práce', power_of_attorney: 'Plná moc', car_sale: 'Kupní smlouva na vozidlo',
  },
  en: {
    lease: 'Rental agreement', sublease: 'Sublease agreement', employment: 'Employment contract',
    dpp: 'DPP agreement', power_of_attorney: 'Power of attorney', car_sale: 'Vehicle purchase agreement',
  },
  ua: {
    lease: 'Договір оренди', sublease: 'Договір піднайму', employment: 'Трудовий договір',
    dpp: 'Договір DPP', power_of_attorney: 'Довіреність', car_sale: 'Договір купівлі-продажу транспортного засобу',
  },
};

export function getTransactionalEmailCopy(locale?: string | null) {
  const normalized = normalizeLocale(locale);
  return {
    copy: EMAIL_COPY[normalized],
    contractName(contractType: string) {
      return CONTRACT_NAMES[normalized][contractType] ?? (normalized === 'en' ? 'Legal document' : normalized === 'ua' ? 'Юридичний документ' : 'Právní dokument');
    },
  };
}
