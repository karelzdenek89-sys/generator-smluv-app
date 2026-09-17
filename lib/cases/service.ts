import { randomUUID } from 'node:crypto';
import { redis } from '@/lib/redis';
import { stripe } from '@/lib/stripe';
import { normalizePricingTier } from '@/lib/pricing';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { escapeHtml, renderEmailShell, sendTransactionalEmail } from '@/lib/email/transactional';
import { issueCaseAccessToken, revokeCaseAccessTokens } from './access';
import { buildCaseUrl, sendCaseAccessEmail } from './emails';
import {
  buildCaseRecord,
  commitCase,
  deleteCase,
  getCase,
  listCaseIdsForEmail,
  newEvent,
  rescheduleReminders,
  saveCase,
} from './store';
import {
  CASE_DOCUMENT_DEFINITIONS,
  buildCaseDocumentSnapshot,
  isCaseDocumentIncluded,
  isCaseDocumentKind,
  validateCaseDocumentData,
} from './documents';
import type { CaseDocument, CaseKind, CaseOwnerRole, CasePriceMode, CaseRecord } from './types';
import { getStageDefinition, isCaseStageForKind, parseIsoDate } from './workflow';

export function isCaseEngineEnabled(): boolean {
  return isFeatureEnabled('caseEngine');
}

export function isCaseKindEnabled(kind: CaseKind): boolean {
  if (!isCaseEngineEnabled()) return false;
  if (kind === 'rental') return isFeatureEnabled('caseRental');
  if (kind === 'vehicle_transfer') return isFeatureEnabled('caseVehicle');
  return true;
}

type DraftRecord = {
  contractType?: string;
  tier?: string;
  packageKey?: string | null;
  downloadToken?: string | null;
  deliveryEmail?: string | null;
  customerEmail?: string | null;
  paid?: boolean;
  caseId?: string | null;
  payload?: Record<string, unknown>;
};

export type CreateCaseFromOrderResult =
  | { ok: true; record: CaseRecord; token: string; url: string; created: boolean; emailSent: boolean }
  | { ok: false; reason: 'not_found' | 'not_paid' | 'forbidden' | 'unsupported' | 'disabled' };

function caseKindForContract(contractType: string): CaseKind | null {
  if (contractType === 'work_contract') return 'work_order';
  if (contractType === 'lease') return 'rental';
  if (contractType === 'car_sale') return 'vehicle_transfer';
  return null;
}

function parseOwnerRole(value: unknown, kind: CaseKind): CaseOwnerRole {
  if (kind === 'work_order' && (value === 'contractor' || value === 'customer')) return value;
  if (kind === 'rental' && (value === 'landlord' || value === 'tenant')) return value;
  if (kind === 'vehicle_transfer' && (value === 'seller' || value === 'buyer')) return value;
  return 'unknown';
}

function parsePriceMode(value: unknown): CasePriceMode {
  return value === 'after_completion' || value === 'with_deposit' || value === 'milestones' ? value : 'unknown';
}

export function parseAmountCzk(value: unknown, currency: unknown = 'Kč'): number | null {
  const unit = typeof currency === 'string' ? currency.trim().toLowerCase() : '';
  if (unit && unit !== 'kč' && unit !== 'czk' && unit !== 'kc') return null;
  const number = typeof value === 'number'
    ? value
    : typeof value === 'string'
      ? Number(value.replace(/kč/i, '').replace(/\s/g, '').replace(',', '.'))
      : Number.NaN;
  return Number.isFinite(number) && number > 0 ? Math.round(number * 100) / 100 : null;
}

function text(payload: Record<string, unknown>, key: string): string {
  return typeof payload[key] === 'string' ? String(payload[key]).trim() : '';
}

/**
 * Case title deliberately avoids copying an address, VIN, party name or other
 * contract identifiers into the long-lived workflow layer.
 */
function buildTitle(kind: CaseKind, payload: Record<string, unknown>, role: CaseOwnerRole): string {
  if (kind === 'work_order') return text(payload, 'workTitle') || 'Zakázka';
  if (kind === 'rental') return 'Pronájem bytu';
  const vehicle = [text(payload, 'carMake'), text(payload, 'carModel')].filter(Boolean).join(' ').slice(0, 70);
  const prefix = role === 'buyer' ? 'Koupě' : role === 'seller' ? 'Prodej' : 'Převod';
  return vehicle ? `${prefix} ${vehicle}` : `${prefix} vozidla`;
}

function caseDates(kind: CaseKind, payload: Record<string, unknown>) {
  if (kind === 'work_order') {
    return {
      startDate: parseIsoDate(payload.startDate) ? String(payload.startDate) : null,
      deadline: parseIsoDate(payload.endDate) ? String(payload.endDate) : null,
    };
  }
  if (kind === 'rental') {
    const startDate = parseIsoDate(payload.startDate) ? String(payload.startDate) : null;
    const handover = parseIsoDate(payload.handoverDate) ? String(payload.handoverDate) : null;
    const endDate = parseIsoDate(payload.endDate) ? String(payload.endDate) : null;
    return { startDate, deadline: handover ?? endDate };
  }
  const handover = parseIsoDate(payload.handoverDate) ? String(payload.handoverDate) : null;
  return { startDate: handover, deadline: handover };
}

function packageForCase(kind: CaseKind, packageKey: unknown): CaseRecord['origin']['packageKey'] {
  if (kind === 'work_order' && packageKey === 'work_order') return 'work_order';
  if (kind === 'rental' && packageKey === 'landlord') return 'landlord';
  if (kind === 'vehicle_transfer' && packageKey === 'vehicle_sale') return 'vehicle_sale';
  return null;
}

export async function createCaseFromPaidOrder(input: { sessionId: string; token: string }): Promise<CreateCaseFromOrderResult> {
  if (!isCaseEngineEnabled()) return { ok: false, reason: 'disabled' };

  const session = await stripe.checkout.sessions.retrieve(input.sessionId);
  if (session.payment_status !== 'paid') return { ok: false, reason: 'not_paid' };
  const draftId = session.metadata?.draftId || session.client_reference_id;
  if (!draftId) return { ok: false, reason: 'not_found' };

  const draftKey = `contract:draft:${draftId}`;
  const draft = await redis.get<DraftRecord>(draftKey);
  if (!draft) return { ok: false, reason: 'not_found' };
  if (!draft.downloadToken || draft.downloadToken !== input.token) return { ok: false, reason: 'forbidden' };

  const contractType = String(session.metadata?.contractType || draft.contractType || '');
  const kind = caseKindForContract(contractType);
  if (!kind) return { ok: false, reason: 'unsupported' };
  if (!isCaseKindEnabled(kind)) return { ok: false, reason: 'disabled' };

  const ownerEmail = String(draft.deliveryEmail || draft.customerEmail || session.customer_details?.email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerEmail)) return { ok: false, reason: 'not_found' };

  let record = typeof draft.caseId === 'string' ? await getCase(draft.caseId) : null;
  let created = false;
  if (!record) {
    const payload = draft.payload && typeof draft.payload === 'object' ? draft.payload : {};
    const ownerRole = parseOwnerRole(payload.partnerUserRole, kind);
    const tier = normalizePricingTier(String(session.metadata?.tier || draft.tier || 'basic'));
    const packageKey = packageForCase(kind, draft.packageKey);
    const dates = caseDates(kind, payload);

    record = buildCaseRecord({
      kind,
      ownerEmail,
      ownerRole,
      title: buildTitle(kind, payload, ownerRole),
      startDate: dates.startDate,
      deadline: dates.deadline,
      priceAmountCzk: kind === 'work_order' ? parseAmountCzk(payload.priceAmount, payload.currency) : null,
      priceMode: kind === 'work_order' ? parsePriceMode(payload.paymentType) : 'unknown',
      origin: {
        source: 'success_page',
        contractType: contractType as CaseRecord['origin']['contractType'],
        tier: packageKey ? 'complete' : tier,
        packageKey,
      },
    });

    if (kind === 'rental') {
      record.stage = 'rental_contract';
      record.tasks = record.tasks.map((task) => task.key === 'rental_contract_ready'
        ? { ...task, done: true, doneAt: new Date().toISOString() }
        : task);
    }
    if (kind === 'vehicle_transfer') {
      record.stage = 'vehicle_contract';
      record.tasks = record.tasks.map((task) => task.key === 'vehicle_contract_ready'
        ? { ...task, done: true, doneAt: new Date().toISOString() }
        : task);
    }

    record = await saveCase(record);
    created = true;
    const ttl = await redis.ttl(draftKey);
    await redis.set(draftKey, { ...draft, caseId: record.id }, ttl > 0 ? { ex: ttl } : undefined);
  }

  const token = await issueCaseAccessToken(record.id, ownerEmail);
  const url = buildCaseUrl(record.id, token, undefined, record.kind);
  let emailSent = false;
  if (created) {
    const emailToken = await issueCaseAccessToken(record.id, ownerEmail);
    const result = await sendCaseAccessEmail({
      to: ownerEmail,
      record,
      url: buildCaseUrl(record.id, emailToken, undefined, record.kind),
      idempotencyKey: `case-created-${record.id}`,
      reason: 'created',
    });
    emailSent = result.ok;
  }
  return { ok: true, record, token, url, created, emailSent };
}

export async function sendCaseLinksForEmail(email: string): Promise<{ cases: number; emailSent: boolean }> {
  const ids = await listCaseIdsForEmail(email);
  const records = (await Promise.all(ids.map((id) => getCase(id)))).filter((item): item is CaseRecord => Boolean(item));
  if (!records.length) return { cases: 0, emailSent: false };

  const links = await Promise.all(records.slice(0, 10).map(async (record) => ({
    record,
    url: buildCaseUrl(record.id, await issueCaseAccessToken(record.id, email), undefined, record.kind),
  })));
  const list = links.map(({ record, url }) => {
    const stage = getStageDefinition(record.kind, record.stage);
    return `<li style="margin:0 0 12px"><a href="${escapeHtml(url)}">${escapeHtml(record.title)}</a> — ${escapeHtml(stage?.label ?? 'Aktivní')}</li>`;
  }).join('');
  const result = await sendTransactionalEmail({
    to: email,
    subject: `Návratové odkazy k vašim případům (${records.length})`,
    idempotencyKey: `case-links-${randomUUID()}`,
    html: renderEmailShell({
      heading: 'Vaše případy',
      intro: `<ul style="padding-left:18px">${list}</ul>`,
      ctaLabel: 'Otevřít první případ',
      ctaUrl: links[0].url,
      footerNote: 'Odkazy jsou funkční přístupové klíče. Nikomu je nepřeposílejte.',
    }),
    text: links.map(({ record, url }) => `${record.title}: ${url}`).join('\n'),
  });
  return { cases: records.length, emailSent: result.ok };
}

export type CaseAction =
  | { type: 'set_stage'; stage: string }
  | { type: 'set_deadline'; deadline: string | null }
  | { type: 'set_title'; title: string }
  | { type: 'toggle_task'; taskKey: string; done: boolean }
  | { type: 'set_reminders'; enabled: boolean }
  | { type: 'add_note'; note: string }
  | { type: 'revoke_links' }
  | { type: 'delete' };

export type CaseActionResult =
  | { ok: true; record: CaseRecord | null; eventType: string }
  | { ok: false; message: string; field?: string };

export function parseCaseAction(input: unknown): CaseAction | null {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  const body = input as Record<string, unknown>;
  if (body.type === 'set_stage' && typeof body.stage === 'string') return { type: 'set_stage', stage: body.stage };
  if (body.type === 'set_deadline' && (body.deadline === null || typeof body.deadline === 'string')) return { type: 'set_deadline', deadline: body.deadline };
  if (body.type === 'set_title' && typeof body.title === 'string') return { type: 'set_title', title: body.title };
  if (body.type === 'toggle_task' && typeof body.taskKey === 'string' && typeof body.done === 'boolean') return { type: 'toggle_task', taskKey: body.taskKey, done: body.done };
  if (body.type === 'set_reminders' && typeof body.enabled === 'boolean') return { type: 'set_reminders', enabled: body.enabled };
  if (body.type === 'add_note' && typeof body.note === 'string') return { type: 'add_note', note: body.note };
  if (body.type === 'revoke_links') return { type: 'revoke_links' };
  if (body.type === 'delete') return { type: 'delete' };
  return null;
}

export async function applyCaseAction(record: CaseRecord, action: CaseAction): Promise<CaseActionResult> {
  const now = new Date();
  const save = (mutate: (fresh: CaseRecord) => CaseRecord | Promise<CaseRecord>) => commitCase(record.id, mutate, now);
  const gone: CaseActionResult = { ok: false, message: 'Případ už neexistuje.' };

  if (action.type === 'set_stage') {
    if (!isCaseStageForKind(record.kind, action.stage)) return { ok: false, message: 'Neplatná fáze případu.', field: 'stage' };
    if (action.stage === record.stage) return { ok: true, record, eventType: 'noop' };
    const stage = action.stage;
    const label = getStageDefinition(record.kind, stage)?.label ?? stage;
    const next = await save((fresh) => ({ ...fresh, stage, closedAt: stage === 'closed' ? fresh.closedAt ?? now.toISOString() : null, events: [...fresh.events, newEvent('stage_changed', `Fáze změněna na „${label}“`)] }));
    return next ? { ok: true, record: next, eventType: stage === 'closed' ? 'case_completed' : 'stage_changed' } : gone;
  }

  if (action.type === 'set_deadline') {
    if (action.deadline !== null && !parseIsoDate(action.deadline)) return { ok: false, message: 'Zadejte platné datum ve formátu RRRR-MM-DD.', field: 'deadline' };
    const next = await save(async (fresh) => {
      const withDeadline: CaseRecord = {
        ...fresh,
        deadline: action.deadline,
        tasks: fresh.tasks.map((task) => task.key === 'deadline_set' ? { ...task, done: Boolean(action.deadline), doneAt: action.deadline ? now.toISOString() : null } : task),
        events: [...fresh.events, newEvent('deadline_set', action.deadline ? `Důležitý termín nastaven na ${action.deadline}` : 'Důležitý termín odstraněn')],
      };
      return rescheduleReminders(withDeadline, withDeadline.remindersEnabled && Boolean(action.deadline), now);
    });
    return next ? { ok: true, record: next, eventType: 'deadline_set' } : gone;
  }

  if (action.type === 'set_title') {
    const title = action.title.trim().slice(0, 120);
    if (!title) return { ok: false, message: 'Název případu nesmí být prázdný.', field: 'title' };
    const next = await save((fresh) => ({ ...fresh, title }));
    return next ? { ok: true, record: next, eventType: 'title_changed' } : gone;
  }

  if (action.type === 'toggle_task') {
    const task = record.tasks.find((item) => item.key === action.taskKey);
    if (!task) return { ok: false, message: 'Úkol nebyl nalezen.', field: 'taskKey' };
    const next = await save((fresh) => ({
      ...fresh,
      tasks: fresh.tasks.map((item) => item.key === action.taskKey ? { ...item, done: action.done, doneAt: action.done ? now.toISOString() : null } : item),
      events: [...fresh.events, newEvent(action.done ? 'task_done' : 'task_reopened', `${action.done ? 'Splněno' : 'Znovu otevřeno'}: ${task.label}`)],
    }));
    return next ? { ok: true, record: next, eventType: action.done ? 'task_done' : 'task_reopened' } : gone;
  }

  if (action.type === 'set_reminders') {
    if (action.enabled && !record.deadline) return { ok: false, message: 'Nejdřív nastavte důležitý termín.', field: 'deadline' };
    const next = await save(async (fresh) => {
      const rescheduled = await rescheduleReminders(fresh, action.enabled && Boolean(fresh.deadline), now);
      return { ...rescheduled, events: [...fresh.events, newEvent(action.enabled ? 'reminders_enabled' : 'reminders_disabled', action.enabled ? 'Připomínky termínu zapnuty' : 'Připomínky termínu vypnuty')] };
    });
    return next ? { ok: true, record: next, eventType: action.enabled ? 'reminders_enabled' : 'reminders_disabled' } : gone;
  }

  if (action.type === 'add_note') {
    const note = action.note.trim().slice(0, 500);
    if (!note) return { ok: false, message: 'Poznámka nesmí být prázdná.', field: 'note' };
    const next = await save((fresh) => ({ ...fresh, events: [...fresh.events, newEvent('note', note)] }));
    return next ? { ok: true, record: next, eventType: 'note' } : gone;
  }

  if (action.type === 'revoke_links') {
    await revokeCaseAccessTokens(record.id);
    const next = await save((fresh) => ({ ...fresh, events: [...fresh.events, newEvent('links_revoked', 'Všechny návratové odkazy zneplatněny')] }));
    return next ? { ok: true, record: next, eventType: 'links_revoked' } : gone;
  }

  await revokeCaseAccessTokens(record.id);
  await deleteCase(record);
  return { ok: true, record: null, eventType: 'deleted' };
}

export type PrepareDocumentResult =
  | { ok: true; record: CaseRecord; document: CaseDocument; requiresPayment: boolean }
  | { ok: false; message: string; field?: string };

export async function prepareCaseDocument(record: CaseRecord, kindInput: unknown, dataInput: unknown): Promise<PrepareDocumentResult> {
  if (record.kind !== 'work_order') return { ok: false, message: 'Tento navazující dokument je zatím dostupný pouze pro zakázku.' };
  if (!isCaseDocumentKind(kindInput)) return { ok: false, message: 'Neznámý typ dokumentu.', field: 'kind' };
  const validation = validateCaseDocumentData(kindInput, dataInput);
  if (!validation.ok) return { ok: false, message: validation.message, field: validation.field };
  if (record.documents.length >= 40) return { ok: false, message: 'Případ již obsahuje maximální počet dokumentů.' };

  const included = isCaseDocumentIncluded(record);
  const now = new Date();
  const kind = kindInput;
  let document: CaseDocument | null = null;
  const next = await commitCase(record.id, (fresh) => {
    if (fresh.documents.length >= 40) throw new Error('document_limit');
    document = {
      id: randomUUID(),
      kind,
      title: CASE_DOCUMENT_DEFINITIONS[kind].title,
      status: included ? 'ready' : 'pending_payment',
      data: validation.data,
      entitlement: included ? 'included' : 'paid',
      stripeSessionId: null,
      checkoutAttempts: 0,
      snapshot: buildCaseDocumentSnapshot(kind, fresh, validation.data),
      createdAt: now.toISOString(),
      paidAt: included ? now.toISOString() : null,
    };
    return { ...fresh, documents: [...fresh.documents, document], events: [...fresh.events, newEvent('document_created', `${document.title} připraven${included ? '' : ' (čeká na platbu)'}`)] };
  }, now).catch((error: unknown) => {
    if (error instanceof Error && error.message === 'document_limit') return null;
    throw error;
  });
  if (!next || !document) return { ok: false, message: 'Případ již obsahuje maximální počet dokumentů.' };
  return { ok: true, record: next, document, requiresPayment: !included };
}

export async function markCaseDocumentPaid(caseId: string, documentId: string, stripeSessionId: string): Promise<CaseRecord | null> {
  const now = new Date();
  let found = true;
  const next = await commitCase(caseId, (fresh) => {
    const document = fresh.documents.find((item) => item.id === documentId);
    if (!document) {
      found = false;
      return fresh;
    }
    if (document.status === 'ready') return fresh;
    return {
      ...fresh,
      documents: fresh.documents.map((item) => item.id === documentId ? { ...item, status: 'ready' as const, paidAt: now.toISOString(), stripeSessionId } : item),
      events: [...fresh.events, newEvent('document_paid', `${document.title} zaplacen a připraven ke stažení`)],
    };
  }, now);
  return found ? next : null;
}
