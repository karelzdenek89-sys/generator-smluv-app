import type { AppLocale } from '@/lib/locale';

export type ContractLandingChromeCopy = {
  whatIsIncluded: string;
  detailsTitle: string;
  detailsDescription: string;
  documentContents: string;
  whatDocumentIncludes: string;
  structuredDescription: string;
  typicalUse: string;
  whenSuitable: string;
  otherDocument: string;
  whenOther: string;
  faq: string;
  commonQuestions: string;
};

const COPY: Record<AppLocale, ContractLandingChromeCopy> = {
  cs: {
    whatIsIncluded: 'Co dokument obsahuje',
    detailsTitle: 'Podrobnosti o dokumentu',
    detailsDescription: 'Obsah, vhodné použití, rozdíl oproti běžnému vzoru a časté otázky.',
    documentContents: 'Obsah dokumentu',
    whatDocumentIncludes: 'Co dokument obsahuje',
    structuredDescription:
      'Strukturovaný obsah obvyklý pro tento typ dokumentu, sestavený podle vašich podmínek.',
    typicalUse: 'Vhodné použití',
    whenSuitable: 'Kdy je tento dokument vhodný',
    otherDocument: 'Jiný typ dokumentu',
    whenOther: 'Kdy už je lepší zvolit jiný postup',
    faq: 'Časté otázky',
    commonQuestions: 'Nejčastější dotazy',
  },
  en: {
    whatIsIncluded: 'What is included',
    detailsTitle: 'Document details',
    detailsDescription: 'Contents, typical use, how it differs from a generic template, and common questions.',
    documentContents: 'Document contents',
    whatDocumentIncludes: 'What the document includes',
    structuredDescription:
      'Structured Czech contract content assembled from your answers. English labels and notices help you understand the form.',
    typicalUse: 'Typical use',
    whenSuitable: 'When this document is suitable',
    otherDocument: 'Other document',
    whenOther: 'When another document may fit better',
    faq: 'FAQ',
    commonQuestions: 'Common questions',
  },
  ua: {
    whatIsIncluded: 'Що входить до документа',
    detailsTitle: 'Докладніше про документ',
    detailsDescription: 'Зміст, типове використання, відмінності від звичайного шаблону та поширені запитання.',
    documentContents: 'Зміст документа',
    whatDocumentIncludes: 'Що містить документ',
    structuredDescription:
      'Структурований зміст чеського договору, сформований з ваших відповідей. Українські підказки допомагають заповнити форму.',
    typicalUse: 'Типове використання',
    whenSuitable: 'Коли цей документ підходить',
    otherDocument: 'Інший документ',
    whenOther: 'Коли краще обрати інший документ',
    faq: 'Запитання та відповіді',
    commonQuestions: 'Поширені запитання',
  },
};

export function getContractLandingChromeCopy(locale: AppLocale): ContractLandingChromeCopy {
  return COPY[locale];
}
