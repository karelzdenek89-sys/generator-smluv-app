import type { CheckoutAddonConfig } from '@/lib/checkout-addons';
import { normalizeLocale } from '@/lib/locale';

export type LocalizedCheckoutAddon = Pick<
  CheckoutAddonConfig,
  'title' | 'description' | 'includedItem'
>;

const BILINGUAL_CONTRACT_COPY: Record<'cs' | 'en' | 'ua', LocalizedCheckoutAddon> = {
  cs: {
    title: 'Dvojjazyčná smlouva PDF',
    description:
      'České a anglické nebo ukrajinské znění je spárované odstavec po odstavci v jednom PDF. Při rozporu má přednost české znění.',
    includedItem: 'Dvojjazyčná smlouva PDF CZ+EN nebo CZ+UA',
  },
  en: {
    title: 'Czech-English contract PDF',
    description:
      'Each Czech clause is followed by its English wording in the same PDF. The Czech wording prevails in case of discrepancy.',
    includedItem: 'Czech-English contract PDF with paired clauses',
  },
  ua: {
    title: 'Чесько-український договір PDF',
    description:
      'Після кожного чеського положення наведено український текст у тому самому PDF. У разі розбіжностей переважає чеське формулювання.',
    includedItem: 'Чесько-український договір PDF з попарними положеннями',
  },
};

const BILINGUAL_CONTRACT_TITLES: Record<string, Record<'cs' | 'en' | 'ua', string>> = {
  lease: {
    cs: 'Dvojjazyčná nájemní smlouva PDF',
    en: 'Czech-English rental agreement PDF',
    ua: 'Чесько-український договір оренди PDF',
  },
  sublease: {
    cs: 'Dvojjazyčná podnájemní smlouva PDF',
    en: 'Czech-English sublease agreement PDF',
    ua: 'Чесько-український договір піднайму PDF',
  },
  employment: {
    cs: 'Dvojjazyčná pracovní smlouva PDF',
    en: 'Czech-English employment contract PDF',
    ua: 'Чесько-український трудовий договір PDF',
  },
  dpp: {
    cs: 'Dvojjazyčná dohoda DPP PDF',
    en: 'Czech-English DPP agreement PDF',
    ua: 'Чесько-український договір DPP PDF',
  },
  power_of_attorney: {
    cs: 'Dvojjazyčná plná moc PDF',
    en: 'Czech-English power of attorney PDF',
    ua: 'Чесько-українська довіреність PDF',
  },
  car_sale: {
    cs: 'Dvojjazyčná kupní smlouva na auto PDF',
    en: 'Czech-English vehicle purchase agreement PDF',
    ua: 'Чесько-український договір купівлі-продажу авто PDF',
  },
};

const DOCX_FOREIGN_COPY: Record<'en' | 'ua', LocalizedCheckoutAddon> = {
  en: {
    title: 'Editable DOCX (Czech only)',
    description:
      'Adds an editable Czech DOCX for later changes. The paired Czech-English layout is provided only in the PDF.',
    includedItem: 'Editable Czech-only DOCX version',
  },
  ua: {
    title: 'Редагований DOCX (лише чеською)',
    description:
      'Додає редагований чеський DOCX. Попарне чесько-українське оформлення надається лише у PDF.',
    includedItem: 'Редагована версія DOCX лише чеською',
  },
};

export function getLocalizedCheckoutAddon(
  addon: CheckoutAddonConfig,
  locale?: string | null,
  contractType?: string | null,
): LocalizedCheckoutAddon {
  const loc = normalizeLocale(locale);
  if (addon.key === 'bilingual_contract' || addon.key === 'bilingual_lease') {
    const copy = BILINGUAL_CONTRACT_COPY[loc];
    const title = BILINGUAL_CONTRACT_TITLES[String(contractType ?? '')]?.[loc];
    return title ? { ...copy, title } : copy;
  }
  if (addon.key === 'docx' && loc !== 'cs') return DOCX_FOREIGN_COPY[loc];
  return addon;
}

export function getCheckoutAddonsHeading(locale?: string | null): string {
  const loc = normalizeLocale(locale);
  if (loc === 'en') return 'Optional additions';
  if (loc === 'ua') return 'Додаткові опції';
  return 'Doplňky k hotovému dokumentu';
}
