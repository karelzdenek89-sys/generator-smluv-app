import type { ContractType } from '@/lib/contracts';

export type DifferentiationPillar = {
  icon: string;
  title: string;
  desc: string;
};

export type ComparisonColumn = {
  label: string;
  lines: string[];
  positive?: boolean;
};

export const DIFFERENTIATION_PILLARS: readonly DifferentiationPillar[] = [
  {
    icon: '§',
    title: 'Paragraf u klauzule',
    desc: 'U důležitých ustanovení v PDF uvidíte, na který § OZ nebo zákoníku práce text navazuje. Ne jen obecnou formulaci bez kontextu.',
  },
  {
    icon: '⚠',
    title: 'Upozornění ve formuláři',
    desc: 'Při vyplňování vás systém upozorní na volby, které bývají sporné — vysoká pokuta, chybějící souhlas pronajímatele, neobvyklá sazba. Nejde o posouzení vaší konkrétní věci.',
  },
  {
    icon: '✓',
    title: 'Klauzule, na které se zapomíná',
    desc: 'Kauce u nájmu, záruky u díla, sankce mezi podnikateli. V rozšířené variantě dokumentu — ne až jako placený doplněk jinde.',
  },
  {
    icon: '→',
    title: 'Nejdřív formulář, pak stažení',
    desc: 'Projdete celý formulář, zkontrolujete náhled a teprve pak rozhodnete, jestli PDF stáhnete. Víte předem, co v souboru bude.',
  },
];

/** Kratší srovnání pro SEO landing pages a buildery */
export const LANDING_COMPARISON: {
  generic: ComparisonColumn;
  ours: ComparisonColumn;
} = {
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
};

export const DIFFERENTIATION_COMPARISON: {
  generic: ComparisonColumn;
  ours: ComparisonColumn;
} = {
  generic: {
    label: 'Obecný vzor z internetu',
    lines: [
      'Prázdná šablona bez vašich údajů',
      'Text bez odkazu na zákon',
      'Žádná nápověda při vyplnění',
      'Obvykle jen jeden typ smlouvy',
    ],
  },
  ours: {
    label: 'SmlouvaHned',
    positive: true,
    lines: [
      'PDF sestavené z vašeho formuláře',
      'Citace § OZ a ZP u klauzulí',
      'Upozornění u rizikových voleb',
      '14 typů + nápověda EN/UA k českému PDF',
    ],
  },
};

export const NOT_A_LAW_FIRM_POINTS = [
  {
    title: 'Softwarový nástroj',
    desc: 'Generátor standardizovaných dokumentů. Ne advokátní kancelář ve smyslu zákona o advokacii.',
  },
  {
    title: 'Bez individuálního posouzení',
    desc: 'Neřekneme vám, jestli je konkrétní ujednání pro vás výhodné. To patří advokátovi.',
  },
  {
    title: 'Typické situace',
    desc: 'Když se strany shodly a chtějí podmínky zachytit písemně. U sporu nebo nestandardní věci doporučíme cestu k advokátovi.',
  },
] as const;

export const WHY_NOT_GENERIC_BULLETS = [
  'Stažený Word nebo PDF nezná vaše jméno, cenu ani termíny — musíte vše dopisovat ručně.',
  'U generického textu snadno přehlédnete kauci, předání vozidla nebo rozsah mlčenlivosti.',
  'Tady nejdřív doplníte údaje, projdete náhled a PDF odemknete až po dokončení objednávky.',
] as const;

export const O_PROJEKTU_COMPARISON_ROWS = [
  {
    source: 'Vzor zdarma z internetu',
    problem: 'Obecný text, ruční dopisování, bez varování ve formuláři.',
    ours: 'Formulář → náhled → PDF s vašimi údaji a § u klauzulí.',
  },
  {
    source: 'Levný generátor „na klik"',
    problem: 'Často bez paragrafů, bez tierů obsahu, bez expat nápovědy.',
    ours: '14 typů smluv, rozšířená varianta, EN/UA vedení formuláře.',
  },
  {
    source: 'Advokát',
    problem: 'Individuální služba — jiný režim, jiná cena, jiný účel.',
    ours: 'Doporučujeme u sporu nebo nestandardní věci. My pokrýváme běžné případy.',
  },
] as const;

export const DOCUMENT_HINT_BY_CONTRACT: Partial<Record<ContractType, string>> = {
  lease: 'u nájemní smlouvy',
  sublease: 'u podnájemní smlouvy',
  employment: 'u pracovní smlouvy',
  dpp: 'u dohody o provedení práce',
  power_of_attorney: 'u plné moci',
  car_sale: 'u kupní smlouvy na vozidlo',
  gift: 'u darovací smlouvy',
  work_contract: 'u smlouvy o dílo',
  loan: 'u smlouvy o zápůjčce',
  nda: 'u NDA',
  general_sale: 'u kupní smlouvy',
  service: 'u smlouvy o službách',
  debt_acknowledgment: 'u uznání dluhu',
  cooperation: 'u smlouvy o spolupráci',
};

export const SEO_LANDING_DOCUMENT_HINT: Record<string, string> = {
  '/najemni-smlouva': 'u nájemní smlouvy',
  '/najemni-smlouva-byt': 'u nájemní smlouvy',
  '/kupni-smlouva': 'u kupní smlouvy',
  '/prodej-vozidla': 'u prodeje vozidla',
  '/pracovni-smlouva': 'u pracovní smlouvy',
  '/dohoda-o-provedeni-prace': 'u dohody o provedení práce',
  '/podnajemni-smlouva': 'u podnájemní smlouvy',
  '/plna-moc-online': 'u plné moci',
  '/darovaci-smlouva': 'u darovací smlouvy',
  '/nda-smlouva': 'u NDA',
  '/pujcka-smlouva': 'u smlouvy o zápůjčce',
  '/smlouva-o-dilo-online': 'u smlouvy o dílo',
  '/smlouva-o-sluzbach': 'u smlouvy o službách',
  '/smlouva-o-spolupraci': 'u smlouvy o spolupráci',
  '/uznani-dluhu-vzor': 'u uznání dluhu',
  '/pro-pronajimatele': 'v pronájmu bytu',
  '/balicek-pronajimatel': 'v pronájmu bytu',
  '/balicek-prodej-vozidla': 'při prodeji vozidla',
};

export function resolveDocumentHint(options: {
  explicit?: string;
  seoPath?: string;
  contractType?: ContractType | null;
}): string | undefined {
  if (options.explicit) return options.explicit;
  if (options.seoPath && SEO_LANDING_DOCUMENT_HINT[options.seoPath]) {
    return SEO_LANDING_DOCUMENT_HINT[options.seoPath];
  }
  if (options.contractType) {
    return DOCUMENT_HINT_BY_CONTRACT[options.contractType];
  }
  return undefined;
}
