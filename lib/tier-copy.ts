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
    basicDescription: 'Pro běžný pronájem bytu: strany, nájemné, služby, jistota, doba nájmu a základní pravidla.',
    completeDescription:
      'K základní smlouvě přidává podrobnější doručování, sankce, pravidla služeb a praktický checklist předání.',
    completeHighlights: [
      'doručování a sankce',
      'podrobnější režim služeb a kauce',
      'checklist předání bytu',
    ],
    completeIncludes: [
      ...CHECKOUT_INCLUDED_ITEMS,
      'Rozšířené klauzule k doručování, sankcím a povinnostem stran',
      'Příloha s instrukcemi k podpisu a checklistem předání bytu',
      `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
    ],
    upsellReason:
      'Zvolte ji, pokud chcete předání bytu, sankce a praktické situace během nájmu popsat podrobněji.',
  },
  car_sale: {
    basicDescription: 'Pro běžný prodej auta mezi dvěma stranami se stavem vozidla, cenou a předáním.',
    completeDescription:
      'Přidává podrobnější popis stavu vozidla, dokladů, výbavy a postupu při předání.',
    completeHighlights: [
      'detailní stav vozidla',
      'předávané doklady a výbava',
      'checklist převodu vozidla',
    ],
    completeIncludes: [
      ...CHECKOUT_INCLUDED_ITEMS,
      'Rozšířené klauzule ke stavu vozidla, dokladům a prohlášením prodávajícího',
      'Příloha s instrukcemi k převodu a checklistem předání vozidla',
      `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
    ],
    upsellReason:
      'Zvolte ji, pokud je důležité přesně zachytit technický stav, výbavu a předávané doklady.',
  },
  gift: {
    basicDescription: 'Pro běžné darování peněz, movité věci nebo jiného majetku.',
    completeDescription:
      'Přidává ustanovení k právnímu stavu daru, podmínkám vrácení a praktickému předání.',
    completeHighlights: [
      'právní stav daru',
      'podmínky vrácení daru',
      'pokyny k předání a evidenci',
    ],
    completeIncludes: [
      ...CHECKOUT_INCLUDED_ITEMS,
      'Rozšířené klauzule k právnímu stavu daru a podmínkám vrácení',
      'Příloha s instrukcemi k podpisu a praktickým checklistem',
      `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
    ],
    upsellReason:
      'Hodí se zejména u hodnotnějšího daru nebo když chcete podmínky případného vrácení popsat výslovněji.',
  },
  work_contract: {
    basicDescription: 'Pro běžnou zakázku, kde chcete písemně zachytit rozsah, cenu, termín a předání.',
    completeDescription:
      'Přidává podrobnější pravidla pro změny rozsahu, vícepráce, předání a práva k výsledku.',
    // Formulace záměrně mluví o ustanoveních smlouvy, ne o samostatných
    // dokumentech — ty jsou obsahem balíčku Zakázka Plus. Dřívější znění
    // („vícepráce a změnové listy“) vypadalo jako slib samostatných formulářů
    // a stíralo rozdíl mezi 199 Kč a 399 Kč.
    completeHighlights: [
      'ustanovení pro vícepráce a změny rozsahu',
      'podrobnější pravidla předání a akceptace',
      'checklist převzetí díla',
    ],
    completeIncludes: [
      ...CHECKOUT_INCLUDED_ITEMS,
      'Rozšířené klauzule k vícepracím, předání díla a duševnímu vlastnictví',
      'Příloha s instrukcemi k podpisu a checklistem převzetí díla',
      `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
    ],
    upsellReason:
      'Užitečná je tam, kde se může měnit rozsah práce nebo vzniknout spor o předání, vícepráce či práva k výsledku.',
  },
  loan: {
    basicDescription: 'Pro běžnou zápůjčku s určenou částkou, splatností a případnými splátkami.',
    completeDescription:
      'Přidává podrobnější zajištění, sankce, prodlení a praktický režim splácení.',
    completeHighlights: [
      'zajištění pohledávky',
      'podrobnější sankční ujednání',
      'checklist pro podpis a archivaci',
    ],
    completeIncludes: [
      ...CHECKOUT_INCLUDED_ITEMS,
      'Rozšířené klauzule k zajištění pohledávky a prodlení dlužníka',
      'Příloha s instrukcemi k podpisu a checklistem pro archivaci',
      `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
    ],
    upsellReason:
      'Zvažte ji, pokud chcete výslovněji řešit zajištění, splátky nebo následky prodlení.',
  },
  nda: {
    basicDescription: 'Pro běžné předání důvěrných informací mezi dvěma stranami.',
    completeDescription:
      'Přidává širší ochranu know-how, navazující omezení, vrácení informací a kontrolní mechanismy.',
    completeHighlights: [
      'non-compete a non-solicitation',
      'audit a vrácení informací',
      'checklist práce s důvěrnými daty',
    ],
    completeIncludes: [
      ...CHECKOUT_INCLUDED_ITEMS,
      'Rozšířené klauzule k ochraně know-how, auditu a navazujícím omezením',
      'Příloha s instrukcemi k podpisu a checklistem práce s důvěrnými informacemi',
      `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
    ],
    upsellReason:
      'Vhodná pro vztahy, kde nestačí samotná povinnost mlčenlivosti.',
  },
  general_sale: {
    basicDescription: 'Pro běžný prodej movité věci s cenou, předáním a základní odpovědností za vady.',
    completeDescription:
      'Přidává podrobnější úpravu vad, záruk, vlastnictví a předání věci.',
    completeHighlights: [
      'rozšířená záruka a reklamace',
      'prohlášení o vlastnictví',
      'checklist předání věci',
    ],
    completeIncludes: [
      ...CHECKOUT_INCLUDED_ITEMS,
      'Rozšířené klauzule k vadám, reklamacím a právnímu stavu věci',
      'Příloha s instrukcemi k podpisu a checklistem předání věci',
      `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
    ],
    upsellReason:
      'Zvolte ji u hodnotnější věci nebo pokud chcete přesněji popsat vady, záruky a odpovědnost stran.',
  },
  employment: {
    basicDescription: 'Pro standardní pracovní poměr se základními povinnými a praktickými ujednáními.',
    completeDescription:
      'Přidává mlčenlivost, konkurenční doložku a podrobnější ochranu informací zaměstnavatele.',
    completeHighlights: [
      'mlčenlivost a obchodní tajemství',
      'konkurenční doložka',
      'checklist nástupu',
    ],
    completeIncludes: [
      ...CHECKOUT_INCLUDED_ITEMS,
      'Rozšířené klauzule k mlčenlivosti, konkurenční doložce a ochraně zaměstnavatele',
      'Příloha s instrukcemi k podpisu a checklistem nástupu',
      `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
    ],
    upsellReason:
      'Vhodná, pokud zaměstnanec pracuje s důvěrnými informacemi, know-how nebo citlivými obchodními vztahy.',
  },
  dpp: {
    basicDescription:
      'Pro běžnou brigádu nebo krátkodobou práci v režimu DPP.',
    completeDescription:
      'Přidává mlčenlivost, pravidla k výsledkům práce a podrobnější ukončení spolupráce.',
    completeHighlights: [
      'mlčenlivost',
      'duševní vlastnictví',
      'checklist nástupu a předání',
    ],
    completeIncludes: [
      ...CHECKOUT_INCLUDED_ITEMS,
      'Rozšířené klauzule k mlčenlivosti, výsledkům práce a ukončení dohody',
      'Příloha s instrukcemi k podpisu a checklistem nástupu',
      `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
    ],
    upsellReason:
      'Zvažte ji, pokud pracovník pracuje s citlivými informacemi nebo vytváří konkrétní výstupy.',
  },
  service: {
    basicDescription:
      'Pro běžné poskytování služeb mezi poskytovatelem a objednatelem.',
    completeDescription:
      'Přidává podrobnější úroveň plnění, sankce, odpovědnost a práva k výstupům.',
    completeHighlights: [
      'SLA a sankce',
      'práva k výstupům',
      'checklist předání služeb',
    ],
    completeIncludes: [
      ...CHECKOUT_INCLUDED_ITEMS,
      'Rozšířené klauzule k úrovni služeb, sankcím a právům k výstupům',
      'Příloha s instrukcemi k podpisu a checklistem předání služeb',
      `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
    ],
    upsellReason:
      'Vhodná pro dlouhodobější služby nebo tam, kde potřebujete přesněji nastavit kvalitu plnění a práci s výstupy.',
  },
  sublease: {
    basicDescription:
      'Pro běžný podnájem prostoru s nájemným, dobou trvání a pravidly užívání.',
    completeDescription:
      'Přidává podrobnější vazbu na hlavní nájem, sankce, doručování a předání prostoru.',
    completeHighlights: [
      'vztah k hlavnímu nájmu',
      'sankce a doručování',
      'checklist předání prostoru',
    ],
    completeIncludes: [
      ...CHECKOUT_INCLUDED_ITEMS,
      'Rozšířené klauzule k návaznosti na hlavní nájem, sankcím a doručování',
      'Příloha s instrukcemi k podpisu a checklistem předání prostoru',
      `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
    ],
    upsellReason:
      'Zvolte ji, pokud je důležitá návaznost na hlavní nájem nebo přesnější pravidla předání.',
  },
  power_of_attorney: {
    basicDescription: 'Pro běžné zastoupení v konkrétní nebo obecně vymezené záležitosti.',
    completeDescription:
      'Přidává podrobnější pokyny k ověření podpisu, odpovědnosti zmocněnce a použití vůči třetím stranám.',
    completeHighlights: [
      'ověření podpisu a účinky',
      'odpovědnost zmocněnce',
      'pokyny k úřednímu použití',
    ],
    completeIncludes: [
      ...CHECKOUT_INCLUDED_ITEMS,
      'Rozšířené klauzule k ověření podpisu, odpovědnosti a použití vůči třetím stranám',
      'Příloha s instrukcemi k podpisu a checklistem pro úřední použití',
      `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
    ],
    upsellReason:
      'Hodí se zejména pro použití vůči úřadům, bankám nebo když chcete rozsah zmocnění popsat přesněji.',
  },
  debt_acknowledgment: {
    basicDescription:
      'Pro písemné uznání existujícího dluhu, jeho výše a splatnosti.',
    completeDescription:
      'Přidává sankce, režim splácení a součinnost k případnému notářskému zápisu se svolením k vykonatelnosti.',
    completeHighlights: [
      'součinnost k případnému notářskému zápisu',
      'sankce a splatnost',
      'checklist podpisu a vymáhání',
    ],
    completeIncludes: [
      ...CHECKOUT_INCLUDED_ITEMS,
      'Ujednání o součinnosti k případnému notářskému zápisu se svolením k vykonatelnosti',
      'Příloha s instrukcemi k podpisu a checklistem pro archivaci a vymáhání',
      `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
    ],
    upsellReason:
      'Zvažte ji, pokud chcete podrobněji řešit splácení, prodlení a postup pro případné pořízení notářského zápisu.',
  },
  cooperation: {
    basicDescription:
      'Pro běžnou obchodní spolupráci mezi dvěma stranami s vymezením plnění a odměny.',
    completeDescription:
      'Přidává ochranu know-how, kontaktů, navazující omezení a podrobnější řešení sporů.',
    completeHighlights: [
      'ochrana know-how',
      'non-solicitation',
      'checklist pro zahájení spolupráce',
    ],
    completeIncludes: [
      ...CHECKOUT_INCLUDED_ITEMS,
      'Rozšířené klauzule k ochraně know-how, zákazníkům a řešení sporů',
      'Příloha s instrukcemi k podpisu a checklistem pro zahájení spolupráce',
      `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
    ],
    upsellReason:
      'Vhodná, pokud je spolupráce dlouhodobější nebo pracuje s důvěrnými informacemi a obchodními kontakty.',
  },
};

const DEFAULT_TIER_COPY: TierContractCopy = {
  basicDescription:
    'Standardizovaný dokument pro běžnou situaci.',
  completeDescription:
    'Přidává další ustanovení a praktickou přílohu podle typu dokumentu.',
  completeHighlights: [
    'rozšířené varianty ustanovení',
    'praktický checklist',
    'delší dostupnost odkazu',
  ],
  completeIncludes: [
    ...CHECKOUT_INCLUDED_ITEMS,
    'Rozšířené varianty ustanovení podle typu dokumentu',
    'Příloha s instrukcemi k podpisu a checklistem',
    `Dostupnost odkazu ke stažení ${COMPLETE_ARCHIVE_DAYS} dní`,
  ],
  upsellReason:
    'Zvolte ji, pokud chcete širší rozsah ustanovení a praktické podklady pro podpis a použití.',
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
