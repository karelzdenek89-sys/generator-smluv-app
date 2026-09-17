import {
  REMINDER_OFFSETS_DAYS,
  WORK_ORDER_STAGES,
  type CaseDocumentKind,
  type CaseRecord,
  type CaseStage,
  type CaseTask,
} from './types';

export type StageDefinition = {
  key: CaseStage;
  label: string;
  short: string;
  description: string;
  /** Co má člověk v této fázi typicky udělat. */
  nextSteps: readonly string[];
  /** Dokumenty, které se v této fázi nejčastěji vytvářejí. */
  documents: readonly CaseDocumentKind[];
  /** Kdy zobrazit doporučení individuálního posouzení. */
  escalation?: string;
};

export const WORK_ORDER_STAGE_DEFINITIONS: Record<CaseStage, StageDefinition> = {
  contract_signed: {
    key: 'contract_signed',
    label: 'Smlouva uzavřena',
    short: 'Smlouva',
    description:
      'Smlouva o dílo je podepsaná. Zkontrolujte termín, cenu a způsob plateb a nastavte si připomínky.',
    nextSteps: [
      'Uložte podepsanou smlouvu oběma stranám a ověřte, že se shodují všechny přílohy.',
      'Nastavte termín dokončení a připomínky předání (30, 14 a 7 dní předem).',
      'Dohodněte, jak budete zaznamenávat změny rozsahu — vždy písemně, nikdy jen ústně.',
    ],
    documents: [],
  },
  in_progress: {
    key: 'in_progress',
    label: 'Realizace',
    short: 'Realizace',
    description:
      'Dílo se provádí. Každou změnu rozsahu, ceny nebo termínu zachyťte písemně dřív, než se práce provedou.',
    nextSteps: [
      'Průběžně kontrolujte plnění milníků a plateb podle smlouvy.',
      'Požadavky nad rámec díla řešte změnovým listem nebo potvrzením víceprací před jejich provedením.',
      'Blíží-li se termín, připravte předávací protokol a dohodněte termín přejímky.',
    ],
    documents: ['change_order', 'extra_work_confirmation'],
  },
  changes: {
    key: 'changes',
    label: 'Změny rozsahu a vícepráce',
    short: 'Změny',
    description:
      'Rozsah díla se mění. Bez písemného odsouhlasení nemá zhotovitel jistotu úhrady víceprací a objednatel nemá jistotu ceny (§ 2620–2622 OZ).',
    nextSteps: [
      'Popište, co se mění: rozsah, cena, termín. Uveďte původní a nový stav.',
      'Podepište změnový list nebo potvrzení víceprací oběma stranami.',
      'Aktualizujte termín dokončení a připomínky, pokud se posouvá.',
    ],
    documents: ['change_order', 'extra_work_confirmation'],
  },
  handover: {
    key: 'handover',
    label: 'Předání díla',
    short: 'Předání',
    description:
      'Dílo je hotové nebo se blíží dokončení. Předávací protokol zachytí stav díla, výhrady a začátek záruky.',
    nextSteps: [
      'Domluvte termín přejímky a prohlédněte dílo společně.',
      'Sepište předávací protokol — bez výhrad, nebo s vadami a lhůtou k odstranění.',
      'Zaznamenejte dokončení a uhraďte / vyfakturujte doplatek podle smlouvy.',
    ],
    documents: ['handover_protocol', 'defect_record'],
  },
  defects: {
    key: 'defects',
    label: 'Vady a jejich odstranění',
    short: 'Vady',
    description:
      'Po předání se objevily vady. Oznámení vad musí být včasné a konkrétní (§ 2618 OZ), jinak může objednatel o práva z vad přijít.',
    nextSteps: [
      'Vady popište co nejpřesněji, přidejte datum zjištění a fotografie.',
      'Zašlete zhotoviteli písemné oznámení vad s výzvou k odstranění a přiměřenou lhůtou.',
      'Po odstranění vad potvrďte převzetí opravy zápisem.',
    ],
    documents: ['defect_notice', 'defect_record'],
    escalation:
      'Pokud zhotovitel vady popírá, odmítá je odstranit nebo jde o vyšší hodnotu, může situace vyžadovat individuální právní posouzení.',
  },
  closed: {
    key: 'closed',
    label: 'Uzavřeno',
    short: 'Uzavřeno',
    description: 'Zakázka je dokončená, předaná a uhrazená. Dokumenty si uložte po dobu záruky.',
    nextSteps: [
      'Archivujte smlouvu, protokoly a doklady o platbách po dobu záruční doby.',
      'Pokud plánujete další zakázku, můžete údaje o své straně použít znovu.',
    ],
    documents: [],
  },
};

export const WORK_ORDER_STAGE_LIST = WORK_ORDER_STAGES.map(
  (key) => WORK_ORDER_STAGE_DEFINITIONS[key],
);

export function isCaseStage(value: unknown): value is CaseStage {
  return typeof value === 'string' && (WORK_ORDER_STAGES as readonly string[]).includes(value);
}

export function stageIndex(stage: CaseStage): number {
  return WORK_ORDER_STAGES.indexOf(stage);
}

/** Výchozí úkoly zakázky — jeden checklist napříč fázemi. */
export function buildDefaultTasks(): CaseTask[] {
  return [
    {
      key: 'contract_archived',
      label: 'Podepsaná smlouva uložena u obou stran',
      stage: 'contract_signed',
      done: false,
    },
    {
      key: 'deadline_set',
      label: 'Nastaven termín dokončení a připomínky',
      stage: 'contract_signed',
      done: false,
    },
    {
      key: 'changes_written',
      label: 'Změny rozsahu řešeny písemně (změnový list / vícepráce)',
      stage: 'in_progress',
      done: false,
      documentKind: 'change_order',
      href: '/blog/viceprace-smlouva-o-dilo-2026',
    },
    {
      key: 'handover_scheduled',
      label: 'Domluven termín přejímky díla',
      stage: 'handover',
      done: false,
      href: '/nastroje/checklist-predani-zakazky',
    },
    {
      key: 'handover_protocol',
      label: 'Sepsán předávací protokol',
      stage: 'handover',
      done: false,
      documentKind: 'handover_protocol',
    },
    {
      key: 'final_payment',
      label: 'Doplatek uhrazen / vyfakturován podle smlouvy',
      stage: 'handover',
      done: false,
    },
    {
      key: 'defects_resolved',
      label: 'Vady z předání odstraněny a potvrzeny',
      stage: 'defects',
      done: false,
      documentKind: 'defect_record',
    },
    {
      key: 'archived',
      label: 'Dokumentace archivována po dobu záruky',
      stage: 'closed',
      done: false,
    },
  ];
}

export function getRecommendedDocuments(stage: CaseStage): readonly CaseDocumentKind[] {
  return WORK_ORDER_STAGE_DEFINITIONS[stage].documents;
}

/** Úkoly relevantní pro aktuální fázi a fázi, která bezprostředně následuje. */
export function getOpenTasksForStage(record: Pick<CaseRecord, 'tasks' | 'stage'>): CaseTask[] {
  const current = stageIndex(record.stage);
  return record.tasks.filter((task) => !task.done && stageIndex(task.stage) <= current + 1);
}

export type ReminderPlanEntry = { offsetDays: number; dueAt: Date };

/**
 * Připomínky k termínu: 30, 14 a 7 dní předem + den před termínem. Termíny
 * v minulosti se vynechávají; připomínka se plánuje na 6:00 UTC (ranní e-mail).
 */
export function planReminders(deadlineIso: string, now: Date = new Date()): ReminderPlanEntry[] {
  const deadline = parseIsoDate(deadlineIso);
  if (!deadline) return [];
  const offsets: number[] = [...REMINDER_OFFSETS_DAYS, 1];
  const entries: ReminderPlanEntry[] = [];
  for (const offsetDays of offsets) {
    const dueAt = new Date(
      Date.UTC(
        deadline.getUTCFullYear(),
        deadline.getUTCMonth(),
        deadline.getUTCDate() - offsetDays,
        6,
        0,
        0,
        0,
      ),
    );
    if (dueAt.getTime() <= now.getTime()) continue;
    entries.push({ offsetDays, dueAt });
  }
  return entries;
}

export function parseIsoDate(value: unknown): Date | null {
  if (typeof value !== 'string') return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const [, y, m, d] = match;
  const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
  if (Number.isNaN(date.getTime())) return null;
  if (date.getUTCMonth() !== Number(m) - 1 || date.getUTCDate() !== Number(d)) return null;
  return date;
}

export function formatCzechDate(value: string | null | undefined): string {
  const date = parseIsoDate(value);
  if (!date) return '—';
  return `${date.getUTCDate()}. ${date.getUTCMonth() + 1}. ${date.getUTCFullYear()}`;
}

export function daysUntil(deadlineIso: string | null | undefined, now: Date = new Date()): number | null {
  const deadline = parseIsoDate(deadlineIso);
  if (!deadline) return null;
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.round((deadline.getTime() - today) / 86_400_000);
}
