import type { ContractSection } from '@/lib/contracts';
import { CASE_DOCUMENT_KINDS, type CaseDocumentKind, type CaseRecord } from './types';
import { formatCzechDate, parseIsoDate } from './workflow';

/**
 * Navazující dokumenty zakázky. Vznikají uvnitř případu z minima údajů,
 * které uživatel doplní v jednoduchém formuláři. Nejde o nové typy smluv:
 * dokumenty pouze dávají písemnou formu tomu, co si strany sjednaly ve
 * smlouvě o dílo (změny rozsahu, vícepráce, předání, vady).
 *
 * Cena: 99 Kč za dokument (STRIPE_PRICE_ID_BASIC). Zakázky založené z balíčku
 * Zakázka Plus mají všechny navazující dokumenty v ceně balíčku.
 */

export const CASE_DOCUMENT_PRICE_CZK = 99;
export const CASE_DOCUMENT_PRICE_LABEL = `${CASE_DOCUMENT_PRICE_CZK} Kč`;

export type CaseDocumentFieldType = 'text' | 'textarea' | 'date' | 'money' | 'number' | 'select';

export type CaseDocumentField = {
  key: string;
  label: string;
  type: CaseDocumentFieldType;
  required?: boolean;
  placeholder?: string;
  help?: string;
  options?: readonly { value: string; label: string }[];
  /** Klíč sdílený napříč dokumenty (např. jména stran) — předvyplní se z posledního dokumentu. */
  shared?: boolean;
};

export type CaseDocumentDefinition = {
  kind: CaseDocumentKind;
  title: string;
  shortTitle: string;
  description: string;
  /** Kdy dokument použít — jednou větou, bez právního žargonu. */
  whenToUse: string;
  legalBasis: string;
  fields: readonly CaseDocumentField[];
  signatureLabels: [string, string];
  buildSections: (record: Pick<CaseRecord, 'title' | 'deadline' | 'priceAmountCzk'>, data: Record<string, string>) => ContractSection[];
};

const PARTY_FIELDS: readonly CaseDocumentField[] = [
  {
    key: 'customerName',
    label: 'Objednatel (jméno / název)',
    type: 'text',
    required: true,
    shared: true,
    placeholder: 'např. Jan Novák nebo Firma s.r.o.',
  },
  {
    key: 'contractorName',
    label: 'Zhotovitel (jméno / název)',
    type: 'text',
    required: true,
    shared: true,
    placeholder: 'např. Petr Dvořák, IČO 12345678',
  },
];

const text = (value: unknown, fallback = '—', max = 2000): string => {
  if (value === null || value === undefined) return fallback;
  const str = String(value).trim();
  if (!str) return fallback;
  return str.length > max ? `${str.slice(0, max)}…` : str;
};

const dateText = (value: unknown): string => (parseIsoDate(value) ? formatCzechDate(String(value)) : '—');

const moneyText = (value: unknown): string => {
  const str = text(value, '');
  if (!str) return '—';
  const num = Number(str.replace(/\s/g, '').replace(',', '.').replace(/kč/i, ''));
  return Number.isFinite(num) ? `${num.toLocaleString('cs-CZ')} Kč` : str;
};

function optionLabel(field: CaseDocumentField | undefined, value: unknown): string {
  const match = field?.options?.find((option) => option.value === value);
  return match ? match.label : text(value);
}

function header(record: Pick<CaseRecord, 'title'>, data: Record<string, string>): string[] {
  return [
    `Objednatel: ${text(data.customerName)}`,
    `Zhotovitel: ${text(data.contractorName)}`,
    `Dílo: „${text(record.title)}“ podle smlouvy o dílo uzavřené mezi výše uvedenými stranami.`,
  ];
}

const SIGNATURE_TITLE = 'PODPISY STRAN';

function signatureSection(left: string, right: string): ContractSection {
  return {
    title: SIGNATURE_TITLE,
    body: [`${left}: ................................`, `${right}: ................................`],
  };
}

export const CASE_DOCUMENT_DEFINITIONS: Record<CaseDocumentKind, CaseDocumentDefinition> = {
  handover_protocol: {
    kind: 'handover_protocol',
    title: 'Předávací protokol k dílu',
    shortTitle: 'Předávací protokol',
    description:
      'Zachytí datum předání, rozsah skutečně provedených prací, zjištěné vady a výsledek přejímky. Od podpisu se zpravidla počítá záruční doba.',
    whenToUse: 'Když je dílo hotové a strany si ho předávají.',
    legalBasis:
      'Dílo je provedeno, je-li dokončeno a předáno (§ 2604 OZ). Objednatel převezme dílo s výhradami nebo bez výhrad (§ 2605 OZ). U stavby nemůže objednatel odmítnout převzetí pro ojedinělé drobné vady, které nebrání užívání (§ 2628 OZ).',
    fields: [
      ...PARTY_FIELDS,
      { key: 'handoverDate', label: 'Datum předání', type: 'date', required: true },
      { key: 'handoverPlace', label: 'Místo předání', type: 'text', required: true, placeholder: 'adresa nebo označení místa plnění' },
      {
        key: 'scopeDelivered',
        label: 'Rozsah skutečně provedených prací',
        type: 'textarea',
        required: true,
        placeholder: 'Stručně popište, co bylo provedeno a předáno.',
      },
      {
        key: 'acceptanceResult',
        label: 'Výsledek přejímky',
        type: 'select',
        required: true,
        options: [
          { value: 'accepted', label: 'Dílo se přejímá bez výhrad' },
          { value: 'accepted_with_reservations', label: 'Dílo se přejímá s výhradami (vady a nedodělky níže)' },
          { value: 'refused', label: 'Dílo se nepřejímá pro podstatné vady' },
        ],
      },
      {
        key: 'defectsList',
        label: 'Zjištěné vady a nedodělky',
        type: 'textarea',
        placeholder: 'Každou vadu na samostatný řádek. Pokud nejsou, nechte prázdné.',
      },
      { key: 'defectsDeadline', label: 'Lhůta pro odstranění vad', type: 'date' },
      { key: 'notes', label: 'Další ujednání nebo poznámky', type: 'textarea' },
    ],
    signatureLabels: ['Předal za zhotovitele', 'Převzal za objednatele'],
    buildSections: (record, data) => {
      const def = CASE_DOCUMENT_DEFINITIONS.handover_protocol;
      const result = optionLabel(def.fields.find((f) => f.key === 'acceptanceResult'), data.acceptanceResult);
      const defects = text(data.defectsList, '');
      return [
        { title: 'I. STRANY A DÍLO', body: header(record, data) },
        {
          title: 'II. PŘEDÁNÍ A PŘEVZETÍ DÍLA',
          body: [
            `Datum předání a převzetí: ${dateText(data.handoverDate)}. Místo: ${text(data.handoverPlace)}.`,
            `Předmět předání (rozsah skutečně provedených prací): ${text(data.scopeDelivered)}`,
            `Výsledek přejímky: ${result}.`,
          ],
        },
        {
          title: 'III. VADY A NEDODĚLKY',
          body: defects
            ? [
                `Zjištěné vady a nedodělky: ${defects}`,
                `Lhůta pro odstranění vad: ${dateText(data.defectsDeadline)}.`,
                'Vady uvedené v tomto protokolu se považují za včas vytknuté (§ 2618 OZ). Ostatní vady, které objednatel při převzetí mohl s vynaložením obvyklé pozornosti zjistit, se za vytknuté nepovažují.',
              ]
            : [
                'Při předání nebyly zjištěny žádné vady ani nedodělky. Skryté vady, které se projeví později, objednatel oznámí bez zbytečného odkladu poté, co je mohl při dostatečné péči zjistit (§ 2618 OZ).',
              ],
        },
        {
          title: 'IV. ZÁRUKA A DALŠÍ UJEDNÁNÍ',
          body: [
            'Záruční doba sjednaná ve smlouvě o dílo počíná běžet dnem převzetí díla uvedeným v tomto protokolu, nestanoví-li smlouva jinak.',
            `Poznámky: ${text(data.notes)}`,
            'Tento protokol je nedílnou součástí smlouvy o dílo a nezakládá nová práva ani povinnosti nad její rámec.',
          ],
        },
        signatureSection(def.signatureLabels[0], def.signatureLabels[1]),
      ];
    },
  },

  change_order: {
    kind: 'change_order',
    title: 'Změnový list ke smlouvě o dílo',
    shortTitle: 'Změnový list',
    description:
      'Písemný, číslovaný dodatek pro změnu rozsahu, technického řešení, harmonogramu nebo ceny díla.',
    whenToUse: 'Když se mění, co nebo kdy se má provést, nebo za kolik.',
    legalBasis:
      'Sjednaly-li si strany písemnou formu smlouvy, mění se smlouva jen písemně (§ 564 OZ). Je-li cena sjednána pevně nebo podle rozpočtu, nelze bez dohody stran žádat její změnu jen proto, že si dílo vyžádalo jiné úsilí nebo náklady (§ 2620 OZ) — změna rozsahu proto vyžaduje písemnou dohodu.',
    fields: [
      ...PARTY_FIELDS,
      { key: 'number', label: 'Číslo změnového listu', type: 'text', required: true, placeholder: 'např. 1' },
      { key: 'date', label: 'Datum', type: 'date', required: true },
      {
        key: 'subject',
        label: 'Předmět změny',
        type: 'select',
        required: true,
        options: [
          { value: 'scope', label: 'Rozsah díla' },
          { value: 'technical', label: 'Technické řešení' },
          { value: 'schedule', label: 'Harmonogram / termín' },
          { value: 'price', label: 'Cena' },
          { value: 'other', label: 'Jiné' },
        ],
      },
      { key: 'originalState', label: 'Původní stav podle smlouvy', type: 'textarea', required: true },
      { key: 'newState', label: 'Nový sjednaný stav', type: 'textarea', required: true },
      { key: 'reason', label: 'Důvod změny', type: 'textarea' },
      { key: 'priceImpact', label: 'Dopad na celkovou cenu díla (Kč, se znaménkem)', type: 'text', placeholder: 'např. +12 000 nebo 0' },
      { key: 'newDeadline', label: 'Nový termín dokončení (pokud se mění)', type: 'date' },
    ],
    signatureLabels: ['Za objednatele', 'Za zhotovitele'],
    buildSections: (record, data) => {
      const def = CASE_DOCUMENT_DEFINITIONS.change_order;
      return [
        { title: 'I. STRANY A DÍLO', body: header(record, data) },
        {
          title: `II. ZMĚNOVÝ LIST Č. ${text(data.number, '…')}`,
          body: [
            `Datum: ${dateText(data.date)}.`,
            `Předmět změny: ${optionLabel(def.fields.find((f) => f.key === 'subject'), data.subject)}.`,
            `Původní stav podle smlouvy: ${text(data.originalState)}`,
            `Nový sjednaný stav: ${text(data.newState)}`,
            `Důvod změny: ${text(data.reason)}`,
          ],
        },
        {
          title: 'III. DOPAD NA CENU A TERMÍN',
          body: [
            `Dopad na celkovou cenu díla: ${text(data.priceImpact, 'bez dopadu')} ${text(data.priceImpact, '') ? 'Kč' : ''}`.trim() + '.',
            `Termín dokončení: ${data.newDeadline ? `nově ${dateText(data.newDeadline)}` : `beze změny (${formatCzechDate(record.deadline)})`}.`,
            'Ostatní ujednání smlouvy o dílo zůstávají nedotčena. Tento změnový list se po podpisu oběma stranami stává číslovaným dodatkem smlouvy (§ 564 OZ).',
          ],
        },
        signatureSection(def.signatureLabels[0], def.signatureLabels[1]),
      ];
    },
  },

  extra_work_confirmation: {
    kind: 'extra_work_confirmation',
    title: 'Potvrzení víceprací',
    shortTitle: 'Vícepráce',
    description:
      'Odsouhlasení prací nad rámec sjednaného rozsahu včetně ceny a vlivu na termín — před jejich provedením.',
    whenToUse: 'Když objednatel požaduje nebo zhotovitel navrhuje práce navíc.',
    legalBasis:
      'Je-li cena sjednána pevně nebo podle rozpočtu, nelze bez dohody žádat její změnu jen proto, že si dílo vyžádalo jiné úsilí (§ 2620 OZ). U rozpočtu s výhradou neúplnosti nebo nezávaznosti může zhotovitel žádat zvýšení ceny za nepředvídané práce, musí však jejich nutnost oznámit bez zbytečného odkladu (§ 2621–2622 OZ). Písemné odsouhlasení víceprací předem je proto v zájmu obou stran.',
    fields: [
      ...PARTY_FIELDS,
      { key: 'number', label: 'Číslo víceprací', type: 'text', required: true, placeholder: 'např. 1' },
      { key: 'date', label: 'Datum', type: 'date', required: true },
      { key: 'description', label: 'Popis prací nad rámec sjednaného rozsahu', type: 'textarea', required: true },
      {
        key: 'reason',
        label: 'Důvod víceprací',
        type: 'select',
        required: true,
        options: [
          { value: 'customer_request', label: 'Požadavek objednatele' },
          { value: 'discovered', label: 'Skutečnost zjištěná při provádění díla' },
          { value: 'other', label: 'Jiný důvod' },
        ],
      },
      { key: 'price', label: 'Cena víceprací (Kč)', type: 'money', required: true },
      {
        key: 'vatMode',
        label: 'DPH',
        type: 'select',
        required: true,
        options: [
          { value: 'incl', label: 'Cena včetně DPH' },
          { value: 'excl', label: 'Cena bez DPH (DPH dle platných předpisů)' },
          { value: 'none', label: 'Zhotovitel není plátcem DPH' },
        ],
      },
      { key: 'scheduleImpactDays', label: 'Posun termínu dokončení (dny)', type: 'number', placeholder: '0' },
      { key: 'newDeadline', label: 'Nový termín dokončení (pokud se mění)', type: 'date' },
    ],
    signatureLabels: ['Za zhotovitele (navrhl)', 'Za objednatele (odsouhlasil)'],
    buildSections: (record, data) => {
      const def = CASE_DOCUMENT_DEFINITIONS.extra_work_confirmation;
      const days = text(data.scheduleImpactDays, '0');
      return [
        { title: 'I. STRANY A DÍLO', body: header(record, data) },
        {
          title: `II. VÍCEPRÁCE Č. ${text(data.number, '…')}`,
          body: [
            `Datum vyhotovení: ${dateText(data.date)}.`,
            `Popis prací nad rámec sjednaného rozsahu díla: ${text(data.description)}`,
            `Důvod víceprací: ${optionLabel(def.fields.find((f) => f.key === 'reason'), data.reason)}.`,
          ],
        },
        {
          title: 'III. CENA A TERMÍN',
          body: [
            `Cena víceprací: ${moneyText(data.price)} (${optionLabel(def.fields.find((f) => f.key === 'vatMode'), data.vatMode).toLowerCase()}).`,
            days === '0'
              ? `Dopad na termín dokončení: bez vlivu (termín ${formatCzechDate(record.deadline)} zůstává).`
              : `Dopad na termín dokončení: posun o ${days} dnů${data.newDeadline ? `, nový termín ${dateText(data.newDeadline)}` : ''}.`,
            'Vícepráce se provedou pouze na základě tohoto písemného odsouhlasení oběma stranami. Odsouhlasením se sjednaný rozsah díla a cena mění pouze v rozsahu zde uvedeném; ostatní ujednání smlouvy zůstávají nedotčena.',
            'Odsouhlasené vícepráce se fakturují samostatně, nedohodnou-li se strany jinak.',
          ],
        },
        signatureSection(def.signatureLabels[0], def.signatureLabels[1]),
      ];
    },
  },

  defect_record: {
    kind: 'defect_record',
    title: 'Zápis o vadách díla',
    shortTitle: 'Evidence vad',
    description:
      'Soupis vad zjištěných při předání nebo v záruční době, dohodnutý způsob nápravy a lhůta. Slouží jako důkaz včasného vytknutí vad.',
    whenToUse: 'Když se strany na vadách shodnou a chtějí je zapsat včetně lhůty k odstranění.',
    legalBasis:
      'Objednatel má práva z vadného plnění, oznámí-li vadu bez zbytečného odkladu (§ 2618 OZ). Právo z vady zaniká, neoznámí-li ji objednatel nejpozději do dvou let od předání (§ 2618, § 2112 OZ), u stavby do pěti let (§ 2629 OZ).',
    fields: [
      ...PARTY_FIELDS,
      { key: 'date', label: 'Datum zápisu', type: 'date', required: true },
      { key: 'discoveredOn', label: 'Datum zjištění vad', type: 'date' },
      { key: 'defects', label: 'Soupis vad (každá na samostatný řádek)', type: 'textarea', required: true },
      {
        key: 'remedy',
        label: 'Dohodnutý způsob nápravy',
        type: 'select',
        required: true,
        options: [
          { value: 'repair', label: 'Odstranění vad opravou nebo dokončením' },
          { value: 'discount', label: 'Přiměřená sleva z ceny díla' },
          { value: 'other', label: 'Jiný postup uvedený v poznámce' },
        ],
      },
      { key: 'deadline', label: 'Lhůta pro odstranění vad', type: 'date' },
      { key: 'notes', label: 'Poznámky', type: 'textarea' },
    ],
    signatureLabels: ['Za objednatele', 'Za zhotovitele'],
    buildSections: (record, data) => {
      const def = CASE_DOCUMENT_DEFINITIONS.defect_record;
      return [
        { title: 'I. STRANY A DÍLO', body: header(record, data) },
        {
          title: 'II. ZJIŠTĚNÉ VADY',
          body: [
            `Datum zápisu: ${dateText(data.date)}. Datum zjištění vad: ${dateText(data.discoveredOn ?? data.date)}.`,
            `Soupis vad: ${text(data.defects)}`,
            'Strany potvrzují, že vady uvedené v tomto zápisu byly zhotoviteli oznámeny ke dni zápisu (§ 2618 OZ).',
          ],
        },
        {
          title: 'III. ZPŮSOB A LHŮTA NÁPRAVY',
          body: [
            `Dohodnutý způsob nápravy: ${optionLabel(def.fields.find((f) => f.key === 'remedy'), data.remedy)}.`,
            `Lhůta pro odstranění vad: ${dateText(data.deadline)}.`,
            `Poznámky: ${text(data.notes)}`,
            'Po odstranění vad strany potvrdí převzetí opravy krátkým zápisem. Tento zápis nemění smlouvu o dílo; pouze dokumentuje uplatnění práv z vadného plnění.',
          ],
        },
        signatureSection(def.signatureLabels[0], def.signatureLabels[1]),
      ];
    },
  },

  defect_notice: {
    kind: 'defect_notice',
    title: 'Oznámení vad díla a výzva k jejich odstranění',
    shortTitle: 'Výzva k odstranění vad',
    description:
      'Jednostranné písemné oznámení vad zhotoviteli s požadovaným způsobem nápravy a přiměřenou lhůtou. Používá se, když se strany na vadách neshodly nebo zhotovitel nereaguje.',
    whenToUse: 'Když zhotovitel vady neuznává, nereaguje nebo je potřeba mít doklad o včasném vytknutí.',
    legalBasis:
      'Práva z vadného plnění vznikají, oznámí-li objednatel vadu bez zbytečného odkladu poté, co ji mohl při dostatečné péči zjistit (§ 2618 OZ); pro práva z vad díla se použijí přiměřeně ustanovení o kupní smlouvě (§ 2615 odst. 2 OZ). Objednatel oznámí, jaké právo si zvolil (§ 2106 OZ).',
    fields: [
      ...PARTY_FIELDS,
      { key: 'date', label: 'Datum oznámení', type: 'date', required: true },
      { key: 'discoveredOn', label: 'Datum zjištění vad', type: 'date', required: true },
      { key: 'defects', label: 'Popis vad (každá na samostatný řádek)', type: 'textarea', required: true },
      {
        key: 'remedy',
        label: 'Požadovaný způsob nápravy',
        type: 'select',
        required: true,
        options: [
          { value: 'repair', label: 'Odstranění vad opravou nebo dokončením díla' },
          { value: 'discount', label: 'Přiměřená sleva z ceny díla' },
        ],
      },
      { key: 'deadlineDays', label: 'Lhůta k odstranění vad (dny od doručení)', type: 'number', required: true, placeholder: 'např. 14' },
      {
        key: 'delivery',
        label: 'Způsob doručení',
        type: 'select',
        required: true,
        options: [
          { value: 'email', label: 'E-mailem na adresu uvedenou ve smlouvě' },
          { value: 'letter', label: 'Doporučeným dopisem' },
          { value: 'in_person', label: 'Osobně proti podpisu' },
        ],
      },
      { key: 'notes', label: 'Doplňující informace (fotografie, svědci, předchozí komunikace)', type: 'textarea' },
    ],
    signatureLabels: ['Objednatel', 'Převzal za zhotovitele (při osobním doručení)'],
    buildSections: (record, data) => {
      const def = CASE_DOCUMENT_DEFINITIONS.defect_notice;
      return [
        { title: 'I. STRANY A DÍLO', body: header(record, data) },
        {
          title: 'II. OZNÁMENÍ VAD',
          body: [
            `Datum oznámení: ${dateText(data.date)}. Vady byly zjištěny dne ${dateText(data.discoveredOn)}.`,
            `Objednatel tímto bez zbytečného odkladu (§ 2618 OZ) oznamuje zhotoviteli následující vady díla: ${text(data.defects)}`,
            `Doplňující informace: ${text(data.notes)}`,
          ],
        },
        {
          title: 'III. VÝZVA K ODSTRANĚNÍ VAD',
          body: [
            `Objednatel požaduje: ${optionLabel(def.fields.find((f) => f.key === 'remedy'), data.remedy)} (§ 2106 a násl. ve spojení s § 2615 OZ).`,
            `Objednatel vyzývá zhotovitele, aby vady odstranil ve lhůtě ${text(data.deadlineDays, '…')} dnů od doručení tohoto oznámení a o termínu nápravy jej předem informoval.`,
            'Nebudou-li vady ve lhůtě odstraněny, objednatel si vyhrazuje uplatnění dalších práv z vadného plnění podle smlouvy a zákona, včetně případné slevy z ceny nebo odstranění vad třetí osobou na náklady zhotovitele tam, kde to smlouva nebo zákon připouští.',
            `Způsob doručení: ${optionLabel(def.fields.find((f) => f.key === 'delivery'), data.delivery)}.`,
            'Toto oznámení nenahrazuje individuální právní posouzení. U sporných nebo hodnotově významných vad doporučujeme konzultaci s advokátem.',
          ],
        },
        signatureSection(def.signatureLabels[0], def.signatureLabels[1]),
      ];
    },
  },
};

export const CASE_DOCUMENT_LIST = CASE_DOCUMENT_KINDS.map((kind) => CASE_DOCUMENT_DEFINITIONS[kind]);

export function isCaseDocumentKind(value: unknown): value is CaseDocumentKind {
  return typeof value === 'string' && (CASE_DOCUMENT_KINDS as readonly string[]).includes(value);
}

export type CaseDocumentValidation =
  | { ok: true; data: Record<string, string> }
  | { ok: false; field: string; message: string };

const MAX_FIELD_LENGTH: Record<CaseDocumentFieldType, number> = {
  text: 200,
  textarea: 4000,
  date: 10,
  money: 40,
  number: 10,
  select: 40,
};

/** Validuje a normalizuje uživatelský vstup dokumentu. Neznámé klíče zahazuje. */
export function validateCaseDocumentData(kind: CaseDocumentKind, input: unknown): CaseDocumentValidation {
  const def = CASE_DOCUMENT_DEFINITIONS[kind];
  const source = input && typeof input === 'object' && !Array.isArray(input) ? (input as Record<string, unknown>) : {};
  const data: Record<string, string> = {};
  for (const field of def.fields) {
    const raw = source[field.key];
    const value = typeof raw === 'string' ? raw.trim() : typeof raw === 'number' && Number.isFinite(raw) ? String(raw) : '';
    if (!value) {
      if (field.required) return { ok: false, field: field.key, message: `Vyplňte pole „${field.label}“.` };
      continue;
    }
    if (value.length > MAX_FIELD_LENGTH[field.type]) {
      return { ok: false, field: field.key, message: `Pole „${field.label}“ je příliš dlouhé.` };
    }
    if (field.type === 'date' && !parseIsoDate(value)) {
      return { ok: false, field: field.key, message: `Pole „${field.label}“ musí být platné datum.` };
    }
    if (field.type === 'select' && !field.options?.some((option) => option.value === value)) {
      return { ok: false, field: field.key, message: `Pole „${field.label}“ má neplatnou hodnotu.` };
    }
    if (field.type === 'number' && !/^-?\d{1,6}$/.test(value)) {
      return { ok: false, field: field.key, message: `Pole „${field.label}“ musí být celé číslo.` };
    }
    if (field.type === 'money' && !/^[\d\s.,]{1,20}(?:\s?kč)?$/i.test(value)) {
      return { ok: false, field: field.key, message: `Pole „${field.label}“ musí být částka.` };
    }
    data[field.key] = value;
  }
  return { ok: true, data };
}

/** Sdílené hodnoty (např. strany) z posledního dokumentu případu pro předvyplnění. */
export function sharedFieldDefaults(record: Pick<CaseRecord, 'documents'>): Record<string, string> {
  const defaults: Record<string, string> = {};
  for (const document of record.documents) {
    for (const [key, value] of Object.entries(document.data)) {
      if (PARTY_FIELDS.some((field) => field.key === key && field.shared) && value) defaults[key] = value;
    }
  }
  return defaults;
}

export function isCaseDocumentIncluded(record: Pick<CaseRecord, 'origin'>): boolean {
  return record.origin.packageKey === 'work_order';
}

export { SIGNATURE_TITLE as CASE_DOCUMENT_SIGNATURE_TITLE };
