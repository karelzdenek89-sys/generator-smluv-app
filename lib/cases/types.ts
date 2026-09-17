/**
 * Case Engine — společný doménový model pro „případ“ (zakázka, zaměstnávání,
 * auto, pronájem…). První a zatím jediný druh je `work_order` (Moje zakázka).
 *
 * Zásada oddělení dat:
 *   DOCUMENT DATA — citlivý obsah smlouvy zůstává v `contract:draft:*` a
 *                   nikdy se do případu nekopíruje.
 *   CASE DATA     — termíny, stav, workflow, druh dokumentu a minimum údajů
 *                   nutných pro pokračování (název zakázky, cenový režim).
 *
 * Případ NEOBSAHUJE jméno, adresu, IČO ani kontakt protistrany. Jediný osobní
 * údaj je e-mail vlastníka případu, protože bez něj nelze poslat návratový
 * odkaz ani připomínku.
 */

export const CASE_KINDS = ['work_order'] as const;
export type CaseKind = (typeof CASE_KINDS)[number];

export const CASE_SCHEMA_VERSION = 1;

/** Fáze zakázky po uzavření smlouvy. Pořadí odpovídá typickému průběhu. */
export const WORK_ORDER_STAGES = [
  'contract_signed',
  'in_progress',
  'changes',
  'handover',
  'defects',
  'closed',
] as const;
export type CaseStage = (typeof WORK_ORDER_STAGES)[number];

export const CASE_OWNER_ROLES = ['contractor', 'customer', 'unknown'] as const;
export type CaseOwnerRole = (typeof CASE_OWNER_ROLES)[number];

export const CASE_PRICE_MODES = ['after_completion', 'with_deposit', 'milestones', 'unknown'] as const;
export type CasePriceMode = (typeof CASE_PRICE_MODES)[number];

export const CASE_DOCUMENT_KINDS = [
  'handover_protocol',
  'change_order',
  'extra_work_confirmation',
  'defect_record',
  'defect_notice',
] as const;
export type CaseDocumentKind = (typeof CASE_DOCUMENT_KINDS)[number];

export type CaseDocumentStatus = 'pending_payment' | 'ready';

export type CaseDocument = {
  id: string;
  kind: CaseDocumentKind;
  title: string;
  status: CaseDocumentStatus;
  /** Uživatelem doplněné údaje dokumentu (data případu, nikoli obsah smlouvy). */
  data: Record<string, string>;
  /** `included` = součást balíčku Zakázka Plus; `paid` = samostatně zaplaceno. */
  entitlement: 'included' | 'paid';
  stripeSessionId?: string | null;
  createdAt: string;
  paidAt?: string | null;
};

export const CASE_EVENT_TYPES = [
  'created',
  'stage_changed',
  'deadline_set',
  'task_done',
  'task_reopened',
  'reminders_enabled',
  'reminders_disabled',
  'reminder_sent',
  'document_created',
  'document_paid',
  'note',
  'links_revoked',
] as const;
export type CaseEventType = (typeof CASE_EVENT_TYPES)[number];

export type CaseEvent = {
  id: string;
  type: CaseEventType;
  at: string;
  label: string;
};

export type CaseTask = {
  key: string;
  label: string;
  stage: CaseStage;
  done: boolean;
  doneAt?: string | null;
  /** Doporučený navazující dokument k úkolu. */
  documentKind?: CaseDocumentKind;
  /** Odkaz na návod nebo nástroj. */
  href?: string;
};

export const REMINDER_OFFSETS_DAYS = [30, 14, 7] as const;
export type ReminderOffsetDays = (typeof REMINDER_OFFSETS_DAYS)[number] | 1;

export type CaseReminder = {
  id: string;
  /** ISO datum-čas, kdy se má připomínka odeslat. */
  dueAt: string;
  offsetDays: number;
  anchor: 'deadline';
  status: 'scheduled' | 'sent' | 'cancelled';
  createdAt: string;
  sentAt?: string | null;
};

export type CaseOrigin = {
  source: 'success_page' | 'manual';
  contractType: 'work_contract';
  tier: 'basic' | 'complete';
  packageKey: 'work_order' | null;
  /** Pouze pro interní korelaci s objednávkou; nikdy se nevrací klientovi. */
  orderSessionId: string | null;
};

export type CaseRecord = {
  id: string;
  schemaVersion: number;
  kind: CaseKind;
  ownerEmail: string;
  ownerRole: CaseOwnerRole;
  title: string;
  stage: CaseStage;
  startDate: string | null;
  deadline: string | null;
  priceAmountCzk: number | null;
  priceMode: CasePriceMode;
  origin: CaseOrigin;
  documents: CaseDocument[];
  tasks: CaseTask[];
  events: CaseEvent[];
  reminders: CaseReminder[];
  remindersEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  lastAccessAt: string;
  expiresAt: string;
};

/** Veřejná projekce případu vracená do prohlížeče vlastníka. */
export type PublicCase = Omit<CaseRecord, 'ownerEmail' | 'origin'> & {
  ownerEmailMasked: string;
  origin: Omit<CaseOrigin, 'orderSessionId'>;
};
