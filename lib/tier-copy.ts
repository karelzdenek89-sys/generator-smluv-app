import {
  BASIC_ARCHIVE_DAYS,
  COMPLETE_ARCHIVE_DAYS,
  CHECKOUT_INCLUDED_ITEMS,
  type PricingTier,
} from './pricing';

export type TierCopyContractType =
  | 'lease'
  | 'car_sale'
  | 'gift'
  | 'work_contract'
  | 'loan'
  | 'nda'
  | 'general_sale'
  | 'employment'
  | 'dpp'
  | 'service'
  | 'sublease'
  | 'power_of_attorney'
  | 'debt_acknowledgment'
  | 'cooperation';

type TierContractCopy = {
  basicDescription: string;
  completeDescription: string;
  completeHighlights: readonly string[];
  completeIncludes: readonly string[];
  upsellReason: string;
};

const sharedBasicItems = [
  ...CHECKOUT_INCLUDED_ITEMS,
  `Dostupnost odkazu ke stažení ${BASIC_ARCHIVE_DAYS} dní`,
] as const;

const CONTRACT_TIER_COPY: Record<TierCopyContractType, TierContractCopy> = {
  lease: {
    basicDescription: 'Plnohodnotná nájemní smlouva pro běžný a přímočarý pronájem.',
    completeDescription:
      'Rozšířená varianta pro citlivější nájemní vztahy, kde je důležité podrobnější nastavení povinností a předání.',
    completeHighlights: [
      'doručování a sankce',
      'podrobnější režim služeb a kauce',
      'checklist předání bytu',
    ],
    completeIncludes: [
      ...sharedBasicItems,
      'Rozšířené klauzule k doručování, sankcím a povinnostem stran',
      'Příloha s instrukcemi k podpisu a checklistem předání bytu',
      `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
    ],
    upsellReason:
      'U nájmu se vyšší varianta hodí tam, kde chcete podrobněji upravit předání bytu, sankce a praktické situace během trvání nájmu.',
  },
  car_sale: {
    basicDescription: 'Plnohodnotná kupní smlouva pro běžný prodej vozidla mezi dvěma stranami.',
    completeDescription:
      'Rozšířená varianta pro případy, kdy chcete detailněji zachytit stav vozidla, doklady a režim předání.',
    completeHighlights: [
      'detailní stav vozidla',
      'předávané doklady a výbava',
      'checklist převodu vozidla',
    ],
    completeIncludes: [
      ...sharedBasicItems,
      'Rozšířené klauzule ke stavu vozidla, dokladům a prohlášením prodávajícího',
      'Příloha s instrukcemi k převodu a checklistem předání vozidla',
      `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
    ],
    upsellReason:
      'U vozidla se vyšší varianta hodí tehdy, když chcete přesněji zachytit technický stav, výbavu a předávané doklady.',
  },
  gift: {
    basicDescription: 'Plnohodnotný dokument pro standardní darování peněz, věcí nebo majetku.',
    completeDescription:
      'Rozšířená varianta pro dary s vyšší hodnotou nebo tam, kde chcete podrobněji upravit právní stav a podmínky vrácení.',
    completeHighlights: [
      'právní stav daru',
      'podmínky vrácení daru',
      'pokyny k předání a evidenci',
    ],
    completeIncludes: [
      ...sharedBasicItems,
      'Rozšířené klauzule k právnímu stavu daru a podmínkám vrácení',
      'Příloha s instrukcemi k podpisu a praktickým checklistem',
      `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
    ],
    upsellReason:
      'Vyšší varianta je vhodná, pokud darujete hodnotnější majetek nebo chcete podrobněji řešit právní stav daru a jeho případné vrácení.',
  },
  work_contract: {
    basicDescription: 'Plnohodnotná smlouva o dílo pro standardní zakázku s jasně vymezeným rozsahem.',
    completeDescription:
      'Rozšířená varianta pro projekty, kde potřebujete vícepráce, podrobnější předání a vyšší smluvní jistotu.',
    completeHighlights: [
      'vícepráce a změnové listy',
      'předání a akceptace',
      'checklist převzetí díla',
    ],
    completeIncludes: [
      ...sharedBasicItems,
      'Rozšířené klauzule k vícepracím, předání díla a duševnímu vlastnictví',
      'Příloha s instrukcemi k podpisu a checklistem převzetí díla',
      `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
    ],
    upsellReason:
      'U díla má vyšší varianta smysl tam, kde může vzniknout spor o rozsah plnění, předání, vícepráce nebo práva k výsledku.',
  },
  loan: {
    basicDescription: 'Plnohodnotná smlouva o zápůjčce pro běžně sjednanou částku a standardní splatnost.',
    completeDescription:
      'Rozšířená varianta pro případy, kde chcete přesněji upravit zajištění, sankce a praktický režim splácení.',
    completeHighlights: [
      'zajištění pohledávky',
      'podrobnější sankční ujednání',
      'checklist pro podpis a archivaci',
    ],
    completeIncludes: [
      ...sharedBasicItems,
      'Rozšířené klauzule k zajištění pohledávky a prodlení dlužníka',
      'Příloha s instrukcemi k podpisu a checklistem pro archivaci',
      `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
    ],
    upsellReason:
      'Vyšší varianta se hodí tehdy, kdy je důležité upravit zajištění dluhu, splátky nebo důsledky prodlení podrobněji.',
  },
  nda: {
    basicDescription: 'Plnohodnotná NDA pro standardní předání důvěrných informací mezi dvěma stranami.',
    completeDescription:
      'Rozšířená varianta pro citlivější obchodní vztahy, kde chcete řešit i navazující omezení a kontrolní mechanismy.',
    completeHighlights: [
      'non-compete a non-solicitation',
      'audit a vrácení informací',
      'checklist práce s důvěrnými daty',
    ],
    completeIncludes: [
      ...sharedBasicItems,
      'Rozšířené klauzule k ochraně know-how, auditu a navazujícím omezením',
      'Příloha s instrukcemi k podpisu a checklistem práce s důvěrnými informacemi',
      `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
    ],
    upsellReason:
      'Vyšší varianta je vhodná pro citlivější obchodní vztahy, kde nestačí jen základní mlčenlivost.',
  },
  general_sale: {
    basicDescription: 'Plnohodnotná kupní smlouva pro běžný převod movité věci.',
    completeDescription:
      'Rozšířená varianta pro případy, kde chcete podrobněji upravit záruky, vady a právní stav prodávané věci.',
    completeHighlights: [
      'rozšířená záruka a reklamace',
      'prohlášení o vlastnictví',
      'checklist předání věci',
    ],
    completeIncludes: [
      ...sharedBasicItems,
      'Rozšířené klauzule k vadám, reklamacím a právnímu stavu věci',
      'Příloha s instrukcemi k podpisu a checklistem předání věci',
      `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
    ],
    upsellReason:
      'U kupní smlouvy má vyšší varianta smysl tehdy, když chcete detailněji upravit vady, záruky a odpovědnost stran.',
  },
  employment: {
    basicDescription: 'Plnohodnotná pracovní smlouva pro standardní pracovní poměr.',
    completeDescription:
      'Rozšířená varianta pro zaměstnání, kde potřebujete navíc řešit mlčenlivost, konkurenční doložku nebo ochranu know-how.',
    completeHighlights: [
      'mlčenlivost a obchodní tajemství',
      'konkurenční doložka',
      'checklist nástupu',
    ],
    completeIncludes: [
      ...sharedBasicItems,
      'Rozšířené klauzule k mlčenlivosti, konkurenční doložce a ochraně zaměstnavatele',
      'Příloha s instrukcemi k podpisu a checklistem nástupu',
      `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
    ],
    upsellReason:
      'Vyšší varianta je vhodná, když má pracovní poměr citlivější charakter a je potřeba řešit mlčenlivost nebo konkurenční omezení.',
  },
  dpp: {
    basicDescription:
      'Plnohodnotná dohoda o provedení práce pro standardně nastavenou brigádu nebo krátkodobou práci.',
    completeDescription:
      'Rozšířená varianta pro spolupráci, kde je důležitá mlčenlivost, výstupy práce nebo podrobnější pravidla ukončení.',
    completeHighlights: [
      'mlčenlivost',
      'duševní vlastnictví',
      'checklist nástupu a předání',
    ],
    completeIncludes: [
      ...sharedBasicItems,
      'Rozšířené klauzule k mlčenlivosti, výsledkům práce a ukončení dohody',
      'Příloha s instrukcemi k podpisu a checklistem nástupu',
      `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
    ],
    upsellReason:
      'Vyšší varianta dává smysl tam, kde pracovník pracuje s citlivými informacemi nebo vytváří konkrétní výstupy.',
  },
  service: {
    basicDescription:
      'Plnohodnotná smlouva o poskytování služeb pro běžný vztah poskytovatel–objednatel.',
    completeDescription:
      'Rozšířená varianta pro služby, kde chcete řešit úroveň plnění, odpovědnost a nakládání s výstupy podrobněji.',
    completeHighlights: [
      'SLA a sankce',
      'práva k výstupům',
      'checklist předání služeb',
    ],
    completeIncludes: [
      ...sharedBasicItems,
      'Rozšířené klauzule k úrovni služeb, sankcím a právům k výstupům',
      'Příloha s instrukcemi k podpisu a checklistem předání služeb',
      `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
    ],
    upsellReason:
      'Vyšší varianta se hodí pro dlouhodobější nebo citlivější služby, kde je důležitá úroveň plnění a práce s výstupy.',
  },
  sublease: {
    basicDescription:
      'Plnohodnotná podnájemní smlouva pro standardně nastavený podnájem prostoru.',
    completeDescription:
      'Rozšířená varianta pro případy, kde potřebujete podrobněji upravit vztah k hlavnímu nájmu, sankce a doručování.',
    completeHighlights: [
      'vztah k hlavnímu nájmu',
      'sankce a doručování',
      'checklist předání prostoru',
    ],
    completeIncludes: [
      ...sharedBasicItems,
      'Rozšířené klauzule k návaznosti na hlavní nájem, sankcím a doručování',
      'Příloha s instrukcemi k podpisu a checklistem předání prostoru',
      `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
    ],
    upsellReason:
      'U podnájmu má vyšší varianta smysl tehdy, když chcete přesněji zachytit vazbu na hlavní nájem a pravidla předání.',
  },
  power_of_attorney: {
    basicDescription: 'Plnohodnotná plná moc pro běžné zastoupení v obvyklé situaci.',
    completeDescription:
      'Rozšířená varianta pro použití vůči úřadům, bankám nebo třetím stranám, kde potřebujete podrobnější instrukce a vyšší praktickou jistotu.',
    completeHighlights: [
      'ověření podpisu a účinky',
      'odpovědnost zmocněnce',
      'pokyny k úřednímu použití',
    ],
    completeIncludes: [
      ...sharedBasicItems,
      'Rozšířené klauzule k ověření podpisu, odpovědnosti a použití vůči třetím stranám',
      'Příloha s instrukcemi k podpisu a checklistem pro úřední použití',
      `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
    ],
    upsellReason:
      'Vyšší varianta se hodí tam, kde má být plná moc používána vůči úřadům, bankám nebo v citlivějších situacích.',
  },
  debt_acknowledgment: {
    basicDescription:
      'Plnohodnotné uznání dluhu pro standardní potvrzení závazku a jeho splatnosti.',
    completeDescription:
      'Rozšířená varianta pro případy, kde chcete detailněji upravit vykonatelnost, sankce a navazující kroky.',
    completeHighlights: [
      'přímá vykonatelnost',
      'sankce a splatnost',
      'checklist podpisu a vymáhání',
    ],
    completeIncludes: [
      ...sharedBasicItems,
      'Rozšířené klauzule k přímé vykonatelnosti, sankcím a navazujícím krokům',
      'Příloha s instrukcemi k podpisu a checklistem pro archivaci a vymáhání',
      `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
    ],
    upsellReason:
      'Vyšší varianta dává smysl tam, kde je důležité podrobněji upravit vymáhání dluhu nebo praktický postup po podpisu.',
  },
  cooperation: {
    basicDescription:
      'Plnohodnotná smlouva o spolupráci pro běžný obchodní vztah mezi dvěma stranami.',
    completeDescription:
      'Rozšířená varianta pro spolupráci, kde chcete chránit know-how, kontakty a citlivější obchodní nastavení.',
    completeHighlights: [
      'ochrana know-how',
      'non-solicitation',
      'checklist pro zahájení spolupráce',
    ],
    completeIncludes: [
      ...sharedBasicItems,
      'Rozšířené klauzule k ochraně know-how, zákazníkům a řešení sporů',
      'Příloha s instrukcemi k podpisu a checklistem pro zahájení spolupráce',
      `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
    ],
    upsellReason:
      'Vyšší varianta se hodí pro obchodní spolupráci, kde je potřeba detailněji chránit důvěrné informace a vztahy.',
  },
};

const DEFAULT_TIER_COPY: TierContractCopy = {
  basicDescription:
    'Plnohodnotný standardizovaný dokument pro běžnou a typizovanou situaci.',
  completeDescription:
    'Rozšířená varianta pro citlivější použití, kde požadujete širší rozsah ustanovení a praktičtější podklady.',
  completeHighlights: [
    'rozšířené varianty ustanovení',
    'praktický checklist',
    'delší dostupnost odkazu',
  ],
  completeIncludes: [
    ...sharedBasicItems,
    'Rozšířené varianty ustanovení podle typu dokumentu',
    'Příloha s instrukcemi k podpisu a checklistem',
    `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
  ],
  upsellReason:
    'Vyšší varianta je vhodná, pokud chcete širší rozsah ustanovení a praktičtější podklady k použití dokumentu.',
};

export function getContractTierCopy(contractType?: string | null): TierContractCopy {
  if (!contractType) return DEFAULT_TIER_COPY;
  return CONTRACT_TIER_COPY[contractType as TierCopyContractType] ?? DEFAULT_TIER_COPY;
}

export function getTierIncludedItems(
  contractType: string | null | undefined,
  tier: PricingTier,
): readonly string[] {
  const copy = getContractTierCopy(contractType);
  if (tier === 'complete') return copy.completeIncludes;
  return sharedBasicItems;
}

export function getTierSelectorDescription(
  contractType: string | null | undefined,
  tier: PricingTier,
): string {
  const copy = getContractTierCopy(contractType);
  return tier === 'complete' ? copy.completeDescription : copy.basicDescription;
}
