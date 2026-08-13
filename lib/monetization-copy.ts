import { normalizeLocale, type AppLocale } from '@/lib/locale';

export type FreeBasicPdfCopy = {
  priceLabel: string;
  includedItems: readonly string[];
  summaryTitle: string;
  summaryAfterOrder: string;
  summaryDownload: string;
  summaryRetention: string;
  modalDescription: string;
  modalSubtitle: string;
  modalSecure: string;
  modalPremium: string;
  processing: string;
  generateCta: string;
  footerSecure: string;
  dpp: {
    h1Main: string;
    h1Accent: string;
    subtitle: string;
    benefit: string;
    faqQuestion: string;
    faqAnswer: string;
    landingCta: string;
    builderCta: string;
    previewHint: string;
    whyNotGeneric: string;
  };
};

const COPY: Record<AppLocale, FreeBasicPdfCopy> = {
  cs: {
    priceLabel: 'Zdarma',
    includedItems: [
      'PDF dokument sestavený podle zadaných údajů',
      'Přehledná struktura určená ke kontrole a podpisu',
      'Zabezpečené stažení bez platby a bez registrace',
      'Dostupnost odkazu ke stažení 24 hodin',
    ],
    summaryTitle: 'Dokument připraven k vygenerování',
    summaryAfterOrder:
      'Základní PDF získáte bez platby a bez registrace. Dokument bude připraven k závěrečné kontrole a podpisu.',
    summaryDownload: 'Stažení základního PDF zdarma. Bez registrace a bez předplatného.',
    summaryRetention:
      'Bezplatný dokument bezpečně uchováváme 24 hodin. Jde o standardizovaný výstup, ne individuální právní poradenství.',
    modalDescription:
      'Zkontrolujte základní variantu a potvrďte podmínky. PDF vytvoříme bez platby a bez registrace.',
    modalSubtitle:
      'Základní DPP je připravena k bezplatnému vygenerování. Rozšířená varianta zůstává placená.',
    modalSecure: 'Bez platby a bez registrace. Základní PDF uchováme 24 hodin pro zabezpečené stažení.',
    modalPremium: 'Rozšířená varianta s dalšími klauzulemi je nadále placená.',
    processing: 'Připravuji PDF…',
    generateCta: 'Vygenerovat základní PDF zdarma →',
    footerSecure: '🔒 Zabezpečené stažení · bez Stripe · bez registrace',
    dpp: {
      h1Main: 'DPP 2026',
      h1Accent: 'zdarma online',
      subtitle:
        'Vyplňte základní dohodu o provedení práce online a stáhněte PDF zdarma. Rozšířená varianta s dalšími klauzulemi zůstává placená.',
      benefit: 'Základní PDF ke stažení zdarma, bez platby a bez registrace',
      faqQuestion: 'Dostanu základní DPP opravdu zdarma?',
      faqAnswer:
        'Ano. V aktivním experimentu vytvoříte základní PDF bez platby a bez registrace; odkaz ke stažení je dostupný 24 hodin.',
      landingCta: 'Vytvořit základní DPP zdarma',
      builderCta: 'Vygenerovat základní DPP zdarma →',
      previewHint: 'Náhled před bezplatným vygenerováním',
      whyNotGeneric:
        'Tady nejdřív doplníte údaje, projdete náhled a základní PDF zdarma vygenerujete po dokončení formuláře.',
    },
  },
  en: {
    priceLabel: 'Free',
    includedItems: [
      'PDF document generated from the details you enter',
      'Clear structure for review and signature',
      'Secure download without payment or registration',
      'Download link available for 24 hours',
    ],
    summaryTitle: 'Document ready to generate',
    summaryAfterOrder:
      'Get the basic PDF without payment or registration. The document will be ready for final review and signature.',
    summaryDownload: 'Download the basic PDF for free. No registration or subscription.',
    summaryRetention:
      'We securely store the free document for 24 hours. It is a standardized output, not individual legal advice.',
    modalDescription:
      'Review the basic version and confirm the terms. We will generate the PDF without payment or registration.',
    modalSubtitle:
      'The basic DPP is ready to generate free of charge. The extended version remains paid.',
    modalSecure: 'No payment or registration. We keep the basic PDF available for secure download for 24 hours.',
    modalPremium: 'The extended version with additional clauses remains paid.',
    processing: 'Preparing PDF…',
    generateCta: 'Generate the basic PDF for free →',
    footerSecure: '🔒 Secure download · no Stripe · no registration',
    dpp: {
      h1Main: 'DPP 2026',
      h1Accent: 'free online',
      subtitle:
        'Complete a Czech agreement to perform work online and download the basic PDF for free. The extended version with additional clauses remains paid.',
      benefit: 'Basic PDF free to download, with no payment or registration',
      faqQuestion: 'Is the basic DPP really free?',
      faqAnswer:
        'Yes. While the experiment is active, you can generate the basic PDF without payment or registration; the download link is available for 24 hours.',
      landingCta: 'Create a basic DPP for free',
      builderCta: 'Generate the basic DPP for free →',
      previewHint: 'Preview before free generation',
      whyNotGeneric:
        'Here you complete the form, review the preview, and generate the basic PDF for free after finishing the form.',
    },
  },
  ua: {
    priceLabel: 'Безкоштовно',
    includedItems: [
      'PDF-документ, сформований із введених вами даних',
      'Зрозуміла структура для перевірки та підписання',
      'Безпечне завантаження без оплати та реєстрації',
      'Посилання для завантаження доступне 24 години',
    ],
    summaryTitle: 'Документ готовий до створення',
    summaryAfterOrder:
      'Отримайте базовий PDF без оплати та реєстрації. Документ буде готовий до остаточної перевірки й підписання.',
    summaryDownload: 'Завантажте базовий PDF безкоштовно. Без реєстрації та підписки.',
    summaryRetention:
      'Ми безпечно зберігаємо безкоштовний документ протягом 24 годин. Це стандартизований документ, а не індивідуальна юридична консультація.',
    modalDescription:
      'Перевірте базову версію та підтвердьте умови. Ми створимо PDF без оплати та реєстрації.',
    modalSubtitle:
      'Базова DPP готова до безкоштовного створення. Розширена версія залишається платною.',
    modalSecure: 'Без оплати та реєстрації. Базовий PDF доступний для безпечного завантаження протягом 24 годин.',
    modalPremium: 'Розширена версія з додатковими положеннями залишається платною.',
    processing: 'Готуємо PDF…',
    generateCta: 'Створити базовий PDF безкоштовно →',
    footerSecure: '🔒 Безпечне завантаження · без Stripe · без реєстрації',
    dpp: {
      h1Main: 'DPP 2026',
      h1Accent: 'безкоштовно онлайн',
      subtitle:
        'Заповніть чеську угоду про виконання роботи онлайн і безкоштовно завантажте базовий PDF. Розширена версія з додатковими положеннями залишається платною.',
      benefit: 'Базовий PDF безкоштовно, без оплати та реєстрації',
      faqQuestion: 'Базова DPP справді безкоштовна?',
      faqAnswer:
        'Так. Поки експеримент активний, базовий PDF можна створити без оплати та реєстрації; посилання для завантаження доступне 24 години.',
      landingCta: 'Створити базову DPP безкоштовно',
      builderCta: 'Створити базову DPP безкоштовно →',
      previewHint: 'Попередній перегляд перед безкоштовним створенням',
      whyNotGeneric:
        'Тут ви заповнюєте форму, перевіряєте попередній перегляд і безкоштовно створюєте базовий PDF після завершення форми.',
    },
  },
};

export function getFreeBasicPdfCopy(locale?: string | null): FreeBasicPdfCopy {
  return COPY[normalizeLocale(locale)];
}

/** Czech SSR compatibility for existing metadata and regression checks. */
export const FREE_BASIC_PDF_INCLUDED_ITEMS = COPY.cs.includedItems;
