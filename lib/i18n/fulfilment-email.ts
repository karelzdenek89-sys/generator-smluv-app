/**
 * Znění potvrzovacího e-mailu po zaplacení.
 *
 * Zákazník, který prošel celý funnel anglicky nebo ukrajinsky, dostával
 * e-mail pouze česky. Odkazy i dokument byly správné, ale u právního
 * produktu je český e-mail po anglickém nákupu zbytečná ztráta důvěry.
 *
 * Překlad drží význam českého originálu, zejména u potvrzení souhlasu
 * s okamžitým dodáním digitálního obsahu — tam nejde o marketingový text,
 * ale o doklad podle § 1837 písm. l) OZ. Neznámé locale spadne na češtinu.
 */

import { normalizeLocale, type AppLocale } from '@/lib/locale';

export type FulfilmentEmailCopy = {
  htmlLang: string;
  subject: (contractName: string) => string;
  pageTitle: string;
  heading: string;
  intro: (contractName: string) => string;
  downloadPdf: string;
  downloadDocx: string;
  portal: string;
  expiry: (days: number) => string;
  questions: string;
  /** Doklad o souhlasu s dodáním před uplynutím lhůty pro odstoupení. */
  consent: (acceptedAt: string, termsVersion: string, privacyVersion: string) => string;
  /** Patička — vymezení, že nejde o individuální právní poradenství. */
  footer: string;
};

const COPY: Record<AppLocale, FulfilmentEmailCopy> = {
  cs: {
    htmlLang: 'cs',
    subject: (name) => `✅ Váš dokument je připraven ke stažení — ${name}`,
    pageTitle: 'Váš dokument SmlouvaHned',
    heading: 'Vaše platba byla přijata ✓',
    intro: (name) => `${name} je připravena ke stažení.`,
    downloadPdf: 'STÁHNOUT PDF DOKUMENT',
    downloadDocx: 'STÁHNOUT EDITOVATELNÝ DOCX',
    portal: 'MOJE DOKUMENTY (bezpečný přístup)',
    expiry: (days) => `Odkaz ke stažení je platný ${days} dní od zaplacení.`,
    questions: 'V případě dotazů nás kontaktujte na',
    consent: (at, terms, privacy) =>
      `Potvrzení uzavření smlouvy: dne ${at} jste výslovně souhlasil(a) s okamžitým dodáním digitálního obsahu před uplynutím lhůty pro odstoupení a vzal(a) jste na vědomí, že dodáním digitálního obsahu ztrácíte právo odstoupit. Obchodní podmínky verze ${terms}, zásady ochrany osobních údajů verze ${privacy}.`,
    footer:
      '© 2026 SmlouvaHned. Dokumenty jsou generovány automaticky a neslouží jako individuální právní poradenství.',
  },
  en: {
    htmlLang: 'en',
    subject: (name) => `✅ Your document is ready to download — ${name}`,
    pageTitle: 'Your SmlouvaHned document',
    heading: 'Your payment was received ✓',
    intro: (name) => `${name} is ready to download.`,
    downloadPdf: 'DOWNLOAD PDF DOCUMENT',
    downloadDocx: 'DOWNLOAD EDITABLE DOCX',
    portal: 'MY DOCUMENTS (secure access)',
    expiry: (days) => `The download link is valid for ${days} days from payment.`,
    questions: 'If you have any questions, contact us at',
    consent: (at, terms, privacy) =>
      `Contract confirmation: on ${at} you expressly consented to the immediate delivery of digital content before the withdrawal period expired and acknowledged that you lose the right to withdraw once the digital content is delivered. Terms and conditions version ${terms}, privacy policy version ${privacy}.`,
    footer:
      '© 2026 SmlouvaHned. Documents are generated automatically and do not constitute individual legal advice.',
  },
  ua: {
    htmlLang: 'uk',
    subject: (name) => `✅ Ваш документ готовий до завантаження — ${name}`,
    pageTitle: 'Ваш документ SmlouvaHned',
    heading: 'Вашу оплату отримано ✓',
    intro: (name) => `${name} готовий до завантаження.`,
    downloadPdf: 'ЗАВАНТАЖИТИ PDF-ДОКУМЕНТ',
    downloadDocx: 'ЗАВАНТАЖИТИ РЕДАГОВАНИЙ DOCX',
    portal: 'МОЇ ДОКУМЕНТИ (безпечний доступ)',
    expiry: (days) => `Посилання для завантаження дійсне ${days} днів від дати оплати.`,
    questions: 'У разі запитань звертайтеся на',
    consent: (at, terms, privacy) =>
      `Підтвердження укладення договору: ${at} ви прямо погодилися на негайне надання цифрового вмісту до закінчення строку на відмову та підтвердили, що з наданням цифрового вмісту втрачаєте право на відмову. Версія комерційних умов ${terms}, версія політики конфіденційності ${privacy}.`,
    footer:
      '© 2026 SmlouvaHned. Документи генеруються автоматично і не є індивідуальною юридичною консультацією.',
  },
};

/**
 * Název dokumentu v jazyce e-mailu.
 *
 * Cizojazyčný název pojmenovává, co si zákazník koupil; samotný dokument
 * zůstává český, jak web uvádí před platbou.
 */
const CONTRACT_NAMES: Record<AppLocale, Record<string, string>> = {
  cs: {
    lease: 'Nájemní smlouva',
    car_sale: 'Kupní smlouva na vozidlo',
    gift: 'Darovací smlouva',
    work_contract: 'Smlouva o dílo',
    loan: 'Smlouva o zápůjčce',
    nda: 'Smlouva o mlčenlivosti (NDA)',
    general_sale: 'Kupní smlouva',
    employment: 'Pracovní smlouva',
    dpp: 'Dohoda o provedení práce',
    service: 'Smlouva o poskytování služeb',
    sublease: 'Podnájemní smlouva',
    power_of_attorney: 'Plná moc',
    debt_acknowledgment: 'Uznání dluhu',
    cooperation: 'Smlouva o spolupráci',
  },
  en: {
    lease: 'Czech rental agreement',
    car_sale: 'Czech vehicle purchase agreement',
    gift: 'Czech gift agreement',
    work_contract: 'Czech contract for work',
    loan: 'Czech loan agreement',
    nda: 'Czech non-disclosure agreement (NDA)',
    general_sale: 'Czech purchase agreement',
    employment: 'Czech employment contract',
    dpp: 'Czech agreement to perform work (DPP)',
    service: 'Czech service agreement',
    sublease: 'Czech sublease agreement',
    power_of_attorney: 'Czech power of attorney',
    debt_acknowledgment: 'Czech acknowledgement of debt',
    cooperation: 'Czech cooperation agreement',
  },
  ua: {
    lease: 'Чеський договір оренди',
    car_sale: 'Чеський договір купівлі-продажу автомобіля',
    gift: 'Чеський договір дарування',
    work_contract: 'Чеський договір підряду',
    loan: 'Чеський договір позики',
    nda: 'Чеський договір про нерозголошення (NDA)',
    general_sale: 'Чеський договір купівлі-продажу',
    employment: 'Чеський трудовий договір',
    dpp: 'Чеська угода про виконання роботи (DPP)',
    service: 'Чеський договір про надання послуг',
    sublease: 'Чеський договір суборенди',
    power_of_attorney: 'Чеська довіреність',
    debt_acknowledgment: 'Чеське визнання боргу',
    cooperation: 'Чеський договір про співпрацю',
  },
};

const FALLBACK_NAME: Record<AppLocale, string> = {
  cs: 'Právní dokument',
  en: 'Legal document',
  ua: 'Юридичний документ',
};

export function getFulfilmentEmailCopy(lang?: string | null): FulfilmentEmailCopy {
  return COPY[normalizeLocale(lang)];
}

export function getFulfilmentContractName(
  contractType: string,
  lang?: string | null,
): string {
  const locale = normalizeLocale(lang);
  return CONTRACT_NAMES[locale][contractType] ?? FALLBACK_NAME[locale];
}

/** Formát data souhlasu podle jazyka e-mailu; časové pásmo zůstává pražské. */
export function formatConsentTimestamp(iso: string, lang?: string | null): string {
  const locale = normalizeLocale(lang);
  const intlLocale = locale === 'cs' ? 'cs-CZ' : locale === 'ua' ? 'uk-UA' : 'en-GB';
  return new Date(iso).toLocaleString(intlLocale, { timeZone: 'Europe/Prague' });
}
