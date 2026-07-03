import type { AppLocale } from '@/lib/locale';
import type { ComparisonColumn } from '@/lib/marketing/differentiation';

export type WhyNotGenericCopy = {
  kicker: string;
  title: string;
  introGeneric: string;
  introWithHint: (hint: string) => string;
  footer: string;
  footerLink: string;
  generic: ComparisonColumn;
  ours: ComparisonColumn;
  bullets: readonly string[];
};

const CS: WhyNotGenericCopy = {
  kicker: 'Rozdíl oproti běžnému vzoru',
  title: 'Proč nestačí soubor stažený z webu',
  introGeneric:
    'Hledáte vzor z internetu? Stažený soubor nezná vaše strany, částky ani termíny. Tady postupujete jinak.',
  introWithHint: (hint) =>
    `Hledáte vzor ${hint}? Stažený soubor nezná vaše strany, částky ani termíny. Tady postupujete jinak.`,
  footer: 'SmlouvaHned je softwarový generátor, ne advokátní kancelář.',
  footerLink: 'Jak nástroj funguje',
  generic: {
    label: 'Vzor z internetu',
    lines: [
      'Prázdná šablona — údaje dopisujete sami',
      'Bez § u klauzulí a bez nápovědy ve formuláři',
    ],
  },
  ours: {
    label: 'SmlouvaHned',
    positive: true,
    lines: [
      'PDF z vašeho formuláře, ne statický soubor',
      '§ u klauzulí, upozornění u rizikových voleb, pak náhled',
    ],
  },
  bullets: [
    'Stažený Word nebo PDF nezná vaše jméno, cenu ani termíny — musíte vše dopisovat ručně.',
    'U generického textu snadno přehlédnete kauci, předání vozidla nebo rozsah mlčenlivosti.',
    'Tady nejdřív doplníte údaje, projdete náhled a PDF odemknete až po dokončení objednávky.',
  ],
};

const EN: WhyNotGenericCopy = {
  kicker: 'Difference from a typical template',
  title: 'Why a downloaded file is not enough',
  introGeneric:
    'Looking for a template online? A downloaded file does not know your parties, amounts or dates. Here you work differently.',
  introWithHint: (hint) =>
    `Looking for a template ${hint}? A downloaded file does not know your parties, amounts or dates. Here you work differently.`,
  footer: 'SmlouvaHned is a software generator, not a law firm.',
  footerLink: 'How the tool works',
  generic: {
    label: 'Template from the web',
    lines: [
      'Blank template — you fill in details yourself',
      'No § references and no guidance in the form',
    ],
  },
  ours: {
    label: 'SmlouvaHned',
    positive: true,
    lines: [
      'PDF from your form, not a static file',
      '§ references, warnings on risky choices, then preview',
    ],
  },
  bullets: [
    'A downloaded Word or PDF file does not know your name, price or dates — you must edit everything manually.',
    'Generic text makes it easy to miss the deposit, vehicle handover or scope of confidentiality.',
    'Here you fill in the form first, review the preview, and unlock the PDF only after checkout.',
  ],
};

const UA: WhyNotGenericCopy = {
  kicker: 'Відмінність від типового зразка',
  title: 'Чому недостатньо файлу з інтернету',
  introGeneric:
    'Шукаєте зразок у мережі? Завантажений файл не знає ваших сторін, сум і термінів. Тут ви працюєте інакше.',
  introWithHint: (hint) =>
    `Шукаєте зразок ${hint}? Завантажений файл не знає ваших сторін, сум і термінів. Тут ви працюєте інакше.`,
  footer: 'SmlouvaHned — програмний генератор, а не адвокатська канцелярія.',
  footerLink: 'Як працює інструмент',
  generic: {
    label: 'Зразок з інтернету',
    lines: [
      'Порожній шаблон — дані дописуєте самі',
      'Без § і без підказок у формі',
    ],
  },
  ours: {
    label: 'SmlouvaHned',
    positive: true,
    lines: [
      'PDF з вашої форми, а не статичний файл',
      '§ біля положень, попередження про ризики, потім перегляд',
    ],
  },
  bullets: [
    'Завантажений Word або PDF не знає вашого імені, ціни чи термінів — усе дописуєте вручну.',
    'У загальному тексті легко пропустити заставу, передачу авто чи обсяг конфіденційності.',
    'Спочатку заповнюєте форму, переглядаєте попередній перегляд і відкриваєте PDF лише після оплати.',
  ],
};

const COPY: Record<AppLocale, WhyNotGenericCopy> = { cs: CS, en: EN, ua: UA };

export function getWhyNotGenericCopy(locale: AppLocale): WhyNotGenericCopy {
  return COPY[locale] ?? CS;
}
