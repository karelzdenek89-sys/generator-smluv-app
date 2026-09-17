/**
 * Case Engine — společný doménový model pro praktické životní a podnikatelské
 * situace. V2 rozšiřuje původní `work_order` o `rental` a `vehicle_transfer`
 * bez změny bezpečnostního modelu, tokenů nebo Redis namespace.
 */

export const CASE_KINDS = ['work_order', 'rental', 'vehicle_transfer'] as const;
export type CaseKind = (typeof CASE_KINDS)[number];
export const CASE_SCHEMA_VERSION = 2;

export const WORK_ORDER_STAGES = ['contract_signed', 'in_progress', 'changes', 'handover', 'defects', 'closed'] as const;
export type WorkOrderStage = (typeof WORK_ORDER_STAGES)[number];
/** Legacy stage alias kept work-order scoped for old UI/tests. */
export type CaseStage = WorkOrderStage;

export const RENTAL_STAGES = ['rental_preparation', 'rental_contract', 'rental_handover_in', 'rental_active', 'rental_change', 'rental_renewal', 'rental_ending', 'rental_handover_out', 'rental_deposit_settlement', 'closed'] as const;
export type RentalStage = (typeof RENTAL_STAGES)[number];
export const VEHICLE_STAGES = ['vehicle_preparation', 'vehicle_contract', 'vehicle_handover', 'vehicle_registration', 'vehicle_confirmation', 'vehicle_issue', 'closed'] as const;
export type VehicleStage = (typeof VEHICLE_STAGES)[number];
export type AnyCaseStage = WorkOrderStage | RentalStage | VehicleStage;

/** Constant stays backward-compatible; type expands for the generalized engine. */
export const CASE_OWNER_ROLES = ['contractor', 'customer', 'unknown'] as const;
export type LegacyCaseOwnerRole = (typeof CASE_OWNER_ROLES)[number];
export const ALL_CASE_OWNER_ROLES = ['contractor', 'customer', 'landlord', 'tenant', 'seller', 'buyer', 'unknown'] as const;
export type CaseOwnerRole = (typeof ALL_CASE_OWNER_ROLES)[number];
export type AnyCaseOwnerRole = CaseOwnerRole;

export const CASE_PRICE_MODES = ['after_completion', 'with_deposit', 'milestones', 'unknown'] as const;
export type CasePriceMode = (typeof CASE_PRICE_MODES)[number];

export const CASE_DOCUMENT_KINDS = ['handover_protocol', 'change_order', 'extra_work_confirmation', 'defect_record', 'defect_notice'] as const;
export type CaseDocumentKind = (typeof CASE_DOCUMENT_KINDS)[number];
export type CaseDocumentStatus = 'pending_payment' | 'ready';

export type CaseDocumentSnapshot = { templateVersion: string; caseTitle: string; caseDeadline: string | null; sections: readonly { title: string; body: readonly string[] }[] };
export type CaseDocument = {
  id: string;
  kind: CaseDocumentKind;
  title: string;
  status: CaseDocumentStatus;
  data: Record<string, string>;
  entitlement: 'included' | 'paid';
  stripeSessionId?: string | null;
  checkoutAttempts?: number;
  checkoutRequest?: { attempt: number; params: import('stripe').default.Checkout.SessionCreateParams } | null;
  snapshot?: CaseDocumentSnapshot;
  createdAt: string;
  paidAt?: string | null;
};

export const CASE_EVENT_TYPES = ['created', 'stage_changed', 'deadline_set', 'role_changed', 'task_done', 'task_reopened', 'reminders_enabled', 'reminders_disabled', 'reminder_sent', 'document_created', 'document_paid', 'note', 'links_revoked'] as const;
export type CaseEventType = (typeof CASE_EVENT_TYPES)[number];
export type CaseEvent = { id: string; type: CaseEventType; at: string; label: string };

export type CaseTask = { key: string; label: string; stage: AnyCaseStage; done: boolean; doneAt?: string | null; documentKind?: CaseDocumentKind; href?: string };
export const REMINDER_OFFSETS_DAYS = [30, 14, 7] as const;
export type ReminderOffsetDays = (typeof REMINDER_OFFSETS_DAYS)[number] | 1;
export type CaseReminder = { id: string; dueAt: string; offsetDays: number; anchor: 'deadline'; status: 'scheduled' | 'sent' | 'cancelled'; createdAt: string; sentAt?: string | null };

export type CaseOrigin = {
  source: 'success_page' | 'manual';
  contractType: 'work_contract' | 'lease' | 'car_sale';
  tier: 'basic' | 'complete';
  packageKey: 'work_order' | 'landlord' | 'vehicle_sale' | null;
};

export type CaseRecord = {
  id: string;
  schemaVersion: number;
  kind: CaseKind;
  ownerEmail: string;
  ownerRole: CaseOwnerRole;
  title: string;
  stage: AnyCaseStage;
  closedAt?: string | null;
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
  revision?: number;
  createdAt: string;
  updatedAt: string;
  lastAccessAt: string;
  expiresAt: string;
};

/**
 * Public boundary keeps `ownerRole` loose for the legacy work-order UI, while
 * `stage` stays the known union so generalized workflow helpers remain typed.
 */
export type PublicCase = Omit<CaseRecord, 'ownerEmail' | 'origin' | 'ownerRole'> & {
  ownerEmailMasked: string;
  ownerRole: string;
  origin: Omit<CaseOrigin, 'orderSessionId'>;
};
