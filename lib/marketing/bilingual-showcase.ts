import { buildContractSections, type StoredContractData } from '@/lib/contracts';
import type { ExpatContractType } from '@/lib/locale';

export type ShowcaseLanguage = 'en' | 'ua';

export type ShowcaseArticle = { title: string; paragraphs: string[] };

export type BilingualShowcaseSample = {
  key: ExpatContractType;
  label: Record<'cs' | 'en' | 'ua', string>;
  cs: ShowcaseArticle;
  translations: Record<ShowcaseLanguage, ShowcaseArticle>;
};

type SampleSpec = {
  key: ExpatContractType;
  label: BilingualShowcaseSample['label'];
  data: Partial<StoredContractData>;
  /** Roman numeral that opens the article to show (e.g. 'IV.'). */
  article: string;
  paragraphs: number;
};

const SAMPLE_SPECS: SampleSpec[] = [
  {
    key: 'lease',
    label: { cs: 'Nájemní smlouva', en: 'Lease agreement', ua: 'Договір оренди' },
    data: { rentAmount: '18500', utilitiesAmount: '3500', paymentDay: '15' },
    article: 'IV.',
    paragraphs: 4,
  },
  {
    key: 'employment',
    label: { cs: 'Pracovní smlouva', en: 'Employment contract', ua: 'Трудовий договір' },
    data: { salaryType: 'monthly', salary: '42000', payDay: '12' },
    article: 'V.',
    paragraphs: 2,
  },
  {
    key: 'car_sale',
    label: { cs: 'Prodej auta', en: 'Car sale', ua: 'Продаж авто' },
    data: { purchasePrice: '245000', priceAmount: '245000', paymentMethod: 'transfer', paymentDueDays: '3' },
    article: 'III.',
    paragraphs: 3,
  },
];

/**
 * The homepage showcase is cut from the real generator output — the same
 * Czech article and the same aligned EN/UA translation a customer receives —
 * so the marketing sample cannot drift from the product. A sample whose
 * translation is missing is dropped rather than shown half in Czech.
 */
export function getBilingualShowcaseSamples(): BilingualShowcaseSample[] {
  return SAMPLE_SPECS.flatMap((spec) => {
    const section = buildContractSections({ contractType: spec.key, tier: 'basic', ...spec.data } as StoredContractData)
      .find((item) => item.title.startsWith(spec.article));
    const en = section?.translations?.en;
    const ua = section?.translations?.ua;
    if (!section || !en?.title || !ua?.title || !en.body || !ua.body) return [];
    if (en.body.length !== section.body.length || ua.body.length !== section.body.length) return [];
    const count = Math.min(spec.paragraphs, section.body.length);
    return [{
      key: spec.key,
      label: spec.label,
      cs: { title: section.title, paragraphs: section.body.slice(0, count) },
      translations: {
        en: { title: en.title, paragraphs: en.body.slice(0, count) },
        ua: { title: ua.title, paragraphs: ua.body.slice(0, count) },
      },
    }];
  });
}
