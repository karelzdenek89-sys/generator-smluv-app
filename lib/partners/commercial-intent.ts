import { createHash, randomUUID } from 'node:crypto';
import { redis } from '@/lib/redis';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { PARTNER_LEAD_CONSENT_VERSION, type PartnerLeadField, PARTNER_LEAD_FIELDS } from './lead-consent';

/**
 * Commercial intent = explicitní, uživatelem vyžádaná poptávka po navazující
 * službě. Není to marketingový souhlas ani „databáze kontaktů“:
 *
 *   commercial_intent  — co člověk potřebuje (kategorie, urgence, pásmo, kraj)
 *   partner_consent    — komu, proč, jaká pole, verze textu, kdy uděleno/odvoláno
 *   partner_lead       — stav předání konkrétnímu partnerovi (fail-closed)
 *
 * Bez zapnutého partnera s `delivery_method` jiným než `none` lead nikdy
 * neopustí Redis: zůstane `pending` a je vidět jen v interním reportingu.
 *
 * Redis klíče:
 *   partner:intent:{id}            JSON CommercialIntent (TTL INTENT_RETENTION_DAYS)
 *   partner:consent:{id}           JSON PartnerConsent
 *   partner:lead:{id}              JSON PartnerLead
 *   partner:intent:index           ZSET score=createdAt member=intentId
 *   partner:lead:index             ZSET score=createdAt member=leadId
 */

export const INTENT_RETENTION_DAYS = 180;
const INTENT_TTL_SECONDS = INTENT_RETENTION_DAYS * 24 * 60 * 60;

export const COMMERCIAL_INTENT_CATEGORIES = [
  'financing',
  'insurance',
  'electronic_signature',
  'legal_consultation',
  'construction_planning',
  'vehicle_history',
  'accounting',
] as const;
export type CommercialIntentCategory = (typeof COMMERCIAL_INTENT_CATEGORIES)[number];

export const INTENT_URGENCIES = ['now', 'month', 'quarter', 'later'] as const;
export type IntentUrgency = (typeof INTENT_URGENCIES)[number];

export const INTENT_BUDGET_BANDS = ['unknown', 'under_50k', '50k_250k', '250k_1m', '1m_plus'] as const;
export type IntentBudgetBand = (typeof INTENT_BUDGET_BANDS)[number];

export const CZ_REGIONS = [
  'praha', 'stredocesky', 'jihocesky', 'plzensky', 'karlovarsky', 'ustecky', 'liberecky',
  'kralovehradecky', 'pardubicky', 'vysocina', 'jihomoravsky', 'olomoucky', 'zlinsky',
  'moravskoslezsky', 'unknown',
] as const;
export type CzRegion = (typeof CZ_REGIONS)[number];

export const INTENT_STATUSES = ['open', 'matched', 'closed', 'withdrawn'] as const;
export type CommercialIntentStatus = (typeof INTENT_STATUSES)[number];

export type CommercialIntent = {
  id: string;
  /** Hash e-mailu nebo caseId — nikdy plaintext kontakt v indexech. */
  subjectRef: string;
  subjectType: 'case' | 'email';
  category: CommercialIntentCategory;
  requestedService: string;
  urgency: IntentUrgency;
  budgetBand: IntentBudgetBand;
  broadLocation: CzRegion;
  /** Kontakt, který si uživatel výslovně přál předat. Ukládá se jen s consentem. */
  contact: Partial<Record<PartnerLeadField, string>>;
  status: CommercialIntentStatus;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
};

export type PartnerConsent = {
  id: string;
  commercialIntentId: string;
  partnerId: string;
  purpose: string;
  fieldsShared: readonly PartnerLeadField[];
  consentTextVersion: string;
  grantedAt: string;
  withdrawnAt: string | null;
};

export const PARTNER_LEAD_STATUSES = ['pending', 'sent', 'accepted', 'rejected', 'withdrawn', 'failed'] as const;
export type PartnerLeadStatus = (typeof PARTNER_LEAD_STATUSES)[number];

export type PartnerDeliveryMethod = 'none' | 'email' | 'api';

export type PartnerLead = {
  id: string;
  commercialIntentId: string;
  partnerConsentId: string;
  partnerId: string;
  status: PartnerLeadStatus;
  deliveryMethod: PartnerDeliveryMethod;
  createdAt: string;
  sentAt: string | null;
  lastError: string | null;
};

/** Provozní stav partnera pro předávání leadů. Vše mimo `enabled` = neposílat. */
export type PartnerDeliveryState = {
  partnerId: string;
  displayName: string;
  state: 'enabled' | 'temporary_pause' | 'disabled';
  /** Denní kapacita; 0 = bez limitu. */
  capacity: number;
  deliveryMethod: PartnerDeliveryMethod;
  categories: readonly CommercialIntentCategory[];
};

function isOn(value: string | undefined): boolean {
  return value === 'true' || value === '1';
}

/**
 * Partneři schopní přijímat leady. Jediný aktuálně definovaný je záměrně
 * `disabled` s `deliveryMethod: 'none'` — engine tak jde otestovat end-to-end
 * (uložení, consent, pending), aniž by kamkoli odešel jediný záznam.
 */
export function getPartnerDeliveryStates(): readonly PartnerDeliveryState[] {
  return [
    {
      partnerId: 'legal_consultation_placeholder',
      displayName: 'Ověřený právní partner (zatím nesjednán)',
      state: isOn(process.env.PARTNER_LEGAL_CONSULTATION_ENABLED) ? 'enabled' : 'disabled',
      capacity: 0,
      deliveryMethod: 'none',
      categories: ['legal_consultation'],
    },
  ];
}

export function isCommercialIntentCaptureEnabled(): boolean {
  return isFeatureEnabled('commercialIntents');
}

/** Partneři, kterým lze aktuálně nabídnout předání pro danou kategorii. */
export function getDeliverablePartners(category: CommercialIntentCategory): readonly PartnerDeliveryState[] {
  return getPartnerDeliveryStates().filter(
    (partner) => partner.state === 'enabled' && partner.deliveryMethod !== 'none' && partner.categories.includes(category),
  );
}

export function hashSubject(value: string): string {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

export type CommercialIntentInput = {
  subjectType: 'case' | 'email';
  subjectValue: string;
  category: unknown;
  requestedService: unknown;
  urgency: unknown;
  budgetBand: unknown;
  broadLocation: unknown;
  contact: unknown;
  partnerId: unknown;
  purpose: unknown;
  fieldsShared: unknown;
  consentTextVersion: unknown;
};

export type CommercialIntentValidation =
  | { ok: true; intent: CommercialIntent; consent: PartnerConsent; lead: PartnerLead }
  | { ok: false; field: string; message: string };

function oneOf<T extends string>(list: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && (list as readonly string[]).includes(value);
}

/**
 * Validace jednoho záznamu intent + consent + lead. Consent musí jmenovat
 * konkrétního partnera, účel, pole a verzi textu — generické „sdílení
 * s partnery“ validací neprojde.
 */
export function buildCommercialIntent(input: CommercialIntentInput, now: Date = new Date()): CommercialIntentValidation {
  if (!oneOf(COMMERCIAL_INTENT_CATEGORIES, input.category)) return { ok: false, field: 'category', message: 'Neplatná kategorie služby.' };
  if (!oneOf(INTENT_URGENCIES, input.urgency)) return { ok: false, field: 'urgency', message: 'Zvolte, kdy službu potřebujete.' };
  if (!oneOf(INTENT_BUDGET_BANDS, input.budgetBand)) return { ok: false, field: 'budgetBand', message: 'Neplatné cenové pásmo.' };
  if (!oneOf(CZ_REGIONS, input.broadLocation)) return { ok: false, field: 'broadLocation', message: 'Neplatný kraj.' };
  const requestedService = typeof input.requestedService === 'string' ? input.requestedService.trim().slice(0, 120) : '';
  if (!requestedService) return { ok: false, field: 'requestedService', message: 'Popište stručně požadovanou službu.' };
  const partnerId = typeof input.partnerId === 'string' ? input.partnerId.trim() : '';
  const partner = getPartnerDeliveryStates().find((item) => item.partnerId === partnerId);
  if (!partner) return { ok: false, field: 'partnerId', message: 'Neznámý partner.' };
  if (!partner.categories.includes(input.category)) return { ok: false, field: 'partnerId', message: 'Partner tuto službu neposkytuje.' };
  const purpose = typeof input.purpose === 'string' ? input.purpose.trim().slice(0, 200) : '';
  if (!purpose) return { ok: false, field: 'purpose', message: 'Chybí účel předání.' };
  if (input.consentTextVersion !== PARTNER_LEAD_CONSENT_VERSION) return { ok: false, field: 'consentTextVersion', message: 'Text souhlasu je zastaralý. Obnovte stránku.' };
  const fieldsShared = Array.isArray(input.fieldsShared)
    ? [...new Set(input.fieldsShared.filter((field): field is PartnerLeadField => oneOf(PARTNER_LEAD_FIELDS, field)))]
    : [];
  if (fieldsShared.length === 0) return { ok: false, field: 'fieldsShared', message: 'Zvolte alespoň jeden kontaktní údaj.' };

  const contactSource = input.contact && typeof input.contact === 'object' && !Array.isArray(input.contact)
    ? (input.contact as Record<string, unknown>)
    : {};
  const contact: Partial<Record<PartnerLeadField, string>> = {};
  for (const field of fieldsShared) {
    const value = typeof contactSource[field] === 'string' ? String(contactSource[field]).trim().slice(0, 200) : '';
    if (!value) return { ok: false, field, message: 'Vyplňte kontaktní údaj, který chcete předat.' };
    if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return { ok: false, field, message: 'Zadejte platný e-mail.' };
    contact[field] = value;
  }
  // Nikdy neukládáme pole, ke kterým nebyl udělen souhlas.
  for (const key of Object.keys(contactSource)) {
    if (!fieldsShared.includes(key as PartnerLeadField)) delete contactSource[key];
  }

  const nowIso = now.toISOString();
  const intent: CommercialIntent = {
    id: randomUUID(),
    subjectRef: input.subjectType === 'case' ? input.subjectValue : hashSubject(input.subjectValue),
    subjectType: input.subjectType,
    category: input.category,
    requestedService,
    urgency: input.urgency,
    budgetBand: input.budgetBand,
    broadLocation: input.broadLocation,
    contact,
    status: 'open',
    createdAt: nowIso,
    updatedAt: nowIso,
    expiresAt: new Date(now.getTime() + INTENT_TTL_SECONDS * 1000).toISOString(),
  };
  const consent: PartnerConsent = {
    id: randomUUID(),
    commercialIntentId: intent.id,
    partnerId,
    purpose,
    fieldsShared,
    consentTextVersion: PARTNER_LEAD_CONSENT_VERSION,
    grantedAt: nowIso,
    withdrawnAt: null,
  };
  const deliverable = partner.state === 'enabled' && partner.deliveryMethod !== 'none';
  const lead: PartnerLead = {
    id: randomUUID(),
    commercialIntentId: intent.id,
    partnerConsentId: consent.id,
    partnerId,
    // Fail-closed: bez připraveného partnera zůstává lead pending a nikam se neposílá.
    status: 'pending',
    deliveryMethod: deliverable ? partner.deliveryMethod : 'none',
    createdAt: nowIso,
    sentAt: null,
    lastError: null,
  };
  return { ok: true, intent, consent, lead };
}

export async function persistCommercialIntent(bundle: { intent: CommercialIntent; consent: PartnerConsent; lead: PartnerLead }): Promise<void> {
  const { intent, consent, lead } = bundle;
  const createdMs = Date.parse(intent.createdAt);
  await Promise.all([
    redis.set(`partner:intent:${intent.id}`, intent, { ex: INTENT_TTL_SECONDS }),
    redis.set(`partner:consent:${consent.id}`, consent, { ex: INTENT_TTL_SECONDS }),
    redis.set(`partner:lead:${lead.id}`, lead, { ex: INTENT_TTL_SECONDS }),
    redis.zadd('partner:intent:index', { score: createdMs, member: intent.id }),
    redis.zadd('partner:lead:index', { score: createdMs, member: lead.id }),
  ]);
}

export async function withdrawCommercialIntent(intentId: string, consentId: string, leadId: string): Promise<boolean> {
  const [intent, consent, lead] = await Promise.all([
    redis.get<CommercialIntent>(`partner:intent:${intentId}`),
    redis.get<PartnerConsent>(`partner:consent:${consentId}`),
    redis.get<PartnerLead>(`partner:lead:${leadId}`),
  ]);
  if (!intent || !consent || !lead || consent.commercialIntentId !== intentId || lead.partnerConsentId !== consentId) return false;
  const now = new Date().toISOString();
  await Promise.all([
    redis.set(`partner:intent:${intentId}`, { ...intent, status: 'withdrawn', contact: {}, updatedAt: now }, { ex: INTENT_TTL_SECONDS }),
    redis.set(`partner:consent:${consentId}`, { ...consent, withdrawnAt: now }, { ex: INTENT_TTL_SECONDS }),
    redis.set(`partner:lead:${leadId}`, { ...lead, status: 'withdrawn' }, { ex: INTENT_TTL_SECONDS }),
  ]);
  return true;
}

export type CommercialIntentSummary = {
  intents: number;
  leadsPending: number;
  leadsSent: number;
  leadsAccepted: number;
  byCategory: Record<string, number>;
  partners: readonly PartnerDeliveryState[];
};

/** Souhrn pro interní reporting — bez kontaktů. */
export async function summarizeCommercialIntents(limit = 500): Promise<CommercialIntentSummary> {
  const summary: CommercialIntentSummary = {
    intents: 0,
    leadsPending: 0,
    leadsSent: 0,
    leadsAccepted: 0,
    byCategory: {},
    partners: getPartnerDeliveryStates(),
  };
  try {
    const intentIds = (await redis.zrange('partner:intent:index', -limit, -1)) as string[];
    const leadIds = (await redis.zrange('partner:lead:index', -limit, -1)) as string[];
    const intents = await Promise.all(intentIds.map((id) => redis.get<CommercialIntent>(`partner:intent:${id}`)));
    const leads = await Promise.all(leadIds.map((id) => redis.get<PartnerLead>(`partner:lead:${id}`)));
    for (const intent of intents) {
      if (!intent) continue;
      summary.intents += 1;
      summary.byCategory[intent.category] = (summary.byCategory[intent.category] ?? 0) + 1;
    }
    for (const lead of leads) {
      if (!lead) continue;
      if (lead.status === 'pending') summary.leadsPending += 1;
      if (lead.status === 'sent') summary.leadsSent += 1;
      if (lead.status === 'accepted') summary.leadsAccepted += 1;
    }
  } catch (error) {
    console.warn('[partners] intent summary unavailable', error instanceof Error ? error.name : 'unknown');
  }
  return summary;
}
