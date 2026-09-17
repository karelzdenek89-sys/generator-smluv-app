import { randomUUID } from 'node:crypto';
import { redis } from '@/lib/redis';
import { stripe } from '@/lib/stripe';
import { normalizePricingTier } from '@/lib/pricing';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { escapeHtml, sendTransactionalEmail } from '@/lib/email/transactional';
import { issueCaseAccessToken, revokeCaseAccessTokens } from './access';
import { buildCaseUrl, sendCaseAccessEmail } from './emails';
import {
  buildCaseRecord,
  deleteCase,
  getCase,
  listCaseIdsForEmail,
  newEvent,
  rescheduleReminders,
  saveCase,
} from './store';
import { CASE_DOCUMENT_DEFINITIONS, isCaseDocumentIncluded, validateCaseDocumentData, isCaseDocumentKind } from './documents';
import type { CaseDocument, CaseOwnerRole, CasePriceMode, CaseRecord } from './types';
import { WORK_ORDER_STAGE_DEFINITIONS, isCaseStage, parseIsoDate } from './workflow';

export function isCaseEngineEnabled(): boolean {
  return isFeatureEnabled('caseEngine');
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

function parseOwnerRole(value: unknown): CaseOwnerRole {
  return value === 'contractor' || value === 'customer' ? value : 'unknown';
}

function parsePriceMode(value: unknown): CasePriceMode {
  return value === 'after_completion' || value === 'with_deposit' || value === 'milestones' ? value : 'unknown';
}

function parseAmountCzk(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.round(value);
  if (typeof value !== 'string') return null;
  const cleaned = value.replace(/kč/i, '').replace(/\s/g, '').replace(',', '.');
  const num = Number(cleaned);
  return Number.isFinite(num) && num > 0 ? Math.round(num) : null;
}

/**
 * Založí zakázku ze zaplacené objednávky smlouvy o dílo.
 *
 * Autorizace: Stripe session musí být `paid` a token musí odpovídat
 * download tokenu draftu (stejná kapabilita, kterou má kupující na success
 * stránce). Bez ní by kdokoli se session_id mohl založit případ na cizí e-mail.
 * Idempotentní: opakované volání vrátí existující případ a nový odkaz.
 */
export async function createCaseFromPaidOrder(input: {
  sessionId: string;
  token: string;
}): Promise<CreateCaseFromOrderResult> {
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
  if (contractType !== 'work_contract') return { ok: false, reason: 'unsupported' };

  const ownerEmail = String(draft.deliveryEmail || draft.customerEmail || session.customer_details?.email || '')
    .trim()
    .toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerEmail)) return { ok: false, reason: 'not_found' };

  let record: CaseRecord | null = null;
  let created = false;
  if (typeof draft.caseId === 'string') {
    record = await getCase(draft.caseId);
  }
  if (!record) {
    const payload = draft.payload && typeof draft.payload === 'object' ? draft.payload : {};
    const tier = normalizePricingTier(String(session.metadata?.tier || draft.tier || 'basic'));
    const packageKey = draft.packageKey === 'work_order' ? 'work_order' : null;
    record = buildCaseRecord({
      ownerEmail,
      ownerRole: parseOwnerRole(payload.partnerUserRole),
      title: typeof payload.workTitle === 'string' ? payload.workTitle : 'Zakázka',
      startDate: parseIsoDate(payload.startDate) ? String(payload.startDate) : null,
      deadline: parseIsoDate(payload.endDate) ? String(payload.endDate) : null,
      priceAmountCzk: parseAmountCzk(payload.priceAmount),
      priceMode: parsePriceMode(payload.paymentType),
      origin: {
        source: 'success_page',
        contractType: 'work_contract',
        tier: packageKey ? 'complete' : tier,
        packageKey,
      },
    });
    record = await saveCase(record);
    created = true;
    // Propojení objednávky s případem, aby opakované kliknutí nevytvořilo duplikát.
    const ttl = await redis.ttl(draftKey);
    await redis.set(draftKey, { ...draft, caseId: record.id }, ttl > 0 ? { ex: ttl } : undefined);
  }

  const token = await issueCaseAccessToken(record.id, ownerEmail);
  const url = buildCaseUrl(record.id, token);
  let emailSent = false;
  if (created) {
    const emailToken = await issueCaseAccessToken(record.id, ownerEmail);
    const result = await sendCaseAccessEmail({
      to: ownerEmail,
      caseTitle: record.title,
      url: buildCaseUrl(record.id, emailToken),
      idempotencyKey: `case-created-${record.id}`,
      reason: 'created',
    });
    emailSent = result.ok;
  }
  return { ok: true, record, token, url, created, emailSent };
}

/**
 * Pošle návratové odkazy ke všem zakázkám e-mailu. Volající vždy odpovídá
 * stejně, ať e-mail případy má nebo ne (žádná enumerace).
 */
export async function sendCaseLinksForEmail(email: string): Promise<{ cases: number; emailSent: boolean }> {
  const ids = await listCaseIdsForEmail(email);
  const records = (await Promise.all(ids.map((id) => getCase(id)))).filter((record): record is CaseRecord => Boolean(record));
  if (records.length === 0) return { cases: 0, emailSent: false };

  const links = await Promise.all(
    records.slice(0, 10).map(async (record) => ({
      record,
      url: buildCaseUrl(record.id, await issueCaseAccessToken(record.id, email)),
    })),
  );

  const items = links
    .map(
      ({ record, url }) =>
        `<li style="margin:0 0 12px;"><a href="${escapeHtml(url)}" style="color:#e2c77b;font-weight:700;text-decoration:none;">${escapeHtml(record.title)}</a><br><span style="color:#94a3b8;font-size:12px;">Fáze: ${escapeHtml(WORK_ORDER_STAGE_DEFINITIONS[record.stage].label)}</span></li>`,
    )
    .join('');
  const html = `<!DOCTYPE html><html lang="cs"><head><meta charset="UTF-8"><title>Návratové odkazy k zakázkám</title></head>
<body style="background:#05080f;font-family:Arial,sans-serif;color:#e2e8f0;padding:40px 20px;margin:0;">
  <div style="max-width:580px;margin:0 auto;background:#0c1426;border-radius:24px;border:1px solid #1e2940;padding:40px;">
    <div style="text-align:center;margin-bottom:28px;"><div style="display:inline-block;background:#c9a852;color:#07111e;font-weight:900;font-size:18px;padding:10px 18px;border-radius:12px;">SmlouvaHned</div></div>
    <h1 style="color:#fff;font-size:24px;font-weight:800;margin:0 0 12px;text-align:center;">Vaše zakázky</h1>
    <p style="color:#94a3b8;font-size:15px;line-height:1.6;text-align:center;margin:0 0 24px;">Požádali jste o návratové odkazy. Každý odkaz platí 30 dní a je určený jen vám.</p>
    <ul style="list-style:none;padding:0;margin:0 0 24px;">${items}</ul>
    <p style="color:#64748b;font-size:12px;line-height:1.6;text-align:center;margin:0;">Pokud jste o odkazy nežádali, tento e-mail ignorujte. Odkazy nikomu nepřeposílejte.</p>
  </div>
</body></html>`;
  const result = await sendTransactionalEmail({
    to: email,
    subject: `Návratové odkazy k vašim zakázkám (${records.length})`,
    html,
    text: `Vaše zakázky:\n\n${links.map(({ record, url }) => `${record.title}: ${url}`).join('\n')}`,
    idempotencyKey: `case-links-${randomUUID()}`,
  });
  return { cases: records.length, emailSent: result.ok };
}

// ── Akce nad případem ─────────────────────────────────────────────────────

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
  switch (body.type) {
    case 'set_stage':
      return typeof body.stage === 'string' ? { type: 'set_stage', stage: body.stage } : null;
    case 'set_deadline':
      return body.deadline === null || typeof body.deadline === 'string'
        ? { type: 'set_deadline', deadline: body.deadline }
        : null;
    case 'set_title':
      return typeof body.title === 'string' ? { type: 'set_title', title: body.title } : null;
    case 'toggle_task':
      return typeof body.taskKey === 'string' && typeof body.done === 'boolean'
        ? { type: 'toggle_task', taskKey: body.taskKey, done: body.done }
        : null;
    case 'set_reminders':
      return typeof body.enabled === 'boolean' ? { type: 'set_reminders', enabled: body.enabled } : null;
    case 'add_note':
      return typeof body.note === 'string' ? { type: 'add_note', note: body.note } : null;
    case 'revoke_links':
      return { type: 'revoke_links' };
    case 'delete':
      return { type: 'delete' };
    default:
      return null;
  }
}

export async function applyCaseAction(record: CaseRecord, action: CaseAction): Promise<CaseActionResult> {
  const now = new Date();
  switch (action.type) {
    case 'set_stage': {
      if (!isCaseStage(action.stage)) return { ok: false, message: 'Neplatná fáze zakázky.', field: 'stage' };
      if (action.stage === record.stage) return { ok: true, record, eventType: 'noop' };
      const label = WORK_ORDER_STAGE_DEFINITIONS[action.stage].label;
      const next = await saveCase(
        { ...record, stage: action.stage, events: [...record.events, newEvent('stage_changed', `Fáze změněna na „${label}“`)] },
        now,
      );
      return { ok: true, record: next, eventType: 'stage_changed' };
    }
    case 'set_deadline': {
      if (action.deadline !== null && !parseIsoDate(action.deadline)) {
        return { ok: false, message: 'Zadejte platné datum ve formátu RRRR-MM-DD.', field: 'deadline' };
      }
      const withDeadline: CaseRecord = {
        ...record,
        deadline: action.deadline,
        tasks: record.tasks.map((task) =>
          task.key === 'deadline_set' ? { ...task, done: Boolean(action.deadline), doneAt: action.deadline ? now.toISOString() : null } : task,
        ),
        events: [
          ...record.events,
          newEvent('deadline_set', action.deadline ? `Termín dokončení nastaven na ${action.deadline}` : 'Termín dokončení odstraněn'),
        ],
      };
      const rescheduled = await rescheduleReminders(withDeadline, withDeadline.remindersEnabled && Boolean(action.deadline), now);
      const next = await saveCase(rescheduled, now);
      return { ok: true, record: next, eventType: 'deadline_set' };
    }
    case 'set_title': {
      const title = action.title.trim().slice(0, 120);
      if (!title) return { ok: false, message: 'Název zakázky nesmí být prázdný.', field: 'title' };
      const next = await saveCase({ ...record, title }, now);
      return { ok: true, record: next, eventType: 'title_changed' };
    }
    case 'toggle_task': {
      const task = record.tasks.find((item) => item.key === action.taskKey);
      if (!task) return { ok: false, message: 'Úkol nebyl nalezen.', field: 'taskKey' };
      const next = await saveCase(
        {
          ...record,
          tasks: record.tasks.map((item) =>
            item.key === action.taskKey ? { ...item, done: action.done, doneAt: action.done ? now.toISOString() : null } : item,
          ),
          events: [...record.events, newEvent(action.done ? 'task_done' : 'task_reopened', `${action.done ? 'Splněno' : 'Znovu otevřeno'}: ${task.label}`)],
        },
        now,
      );
      return { ok: true, record: next, eventType: action.done ? 'task_done' : 'task_reopened' };
    }
    case 'set_reminders': {
      if (action.enabled && !record.deadline) {
        return { ok: false, message: 'Nejdřív nastavte termín dokončení.', field: 'deadline' };
      }
      const rescheduled = await rescheduleReminders(record, action.enabled, now);
      const next = await saveCase(
        {
          ...rescheduled,
          events: [...record.events, newEvent(action.enabled ? 'reminders_enabled' : 'reminders_disabled', action.enabled ? 'Připomínky termínu zapnuty' : 'Připomínky termínu vypnuty')],
        },
        now,
      );
      return { ok: true, record: next, eventType: action.enabled ? 'reminders_enabled' : 'reminders_disabled' };
    }
    case 'add_note': {
      const note = action.note.trim().slice(0, 500);
      if (!note) return { ok: false, message: 'Poznámka nesmí být prázdná.', field: 'note' };
      const next = await saveCase({ ...record, events: [...record.events, newEvent('note', note)] }, now);
      return { ok: true, record: next, eventType: 'note' };
    }
    case 'revoke_links': {
      await revokeCaseAccessTokens(record.id);
      const next = await saveCase({ ...record, events: [...record.events, newEvent('links_revoked', 'Všechny návratové odkazy zneplatněny')] }, now);
      return { ok: true, record: next, eventType: 'links_revoked' };
    }
    case 'delete': {
      await revokeCaseAccessTokens(record.id);
      await deleteCase(record);
      return { ok: true, record: null, eventType: 'deleted' };
    }
    default:
      return { ok: false, message: 'Neznámá akce.' };
  }
}

// ── Navazující dokumenty ──────────────────────────────────────────────────

export type PrepareDocumentResult =
  | { ok: true; record: CaseRecord; document: CaseDocument; requiresPayment: boolean }
  | { ok: false; message: string; field?: string };

export async function prepareCaseDocument(record: CaseRecord, kindInput: unknown, dataInput: unknown): Promise<PrepareDocumentResult> {
  if (!isCaseDocumentKind(kindInput)) return { ok: false, message: 'Neznámý typ dokumentu.', field: 'kind' };
  const validation = validateCaseDocumentData(kindInput, dataInput);
  if (!validation.ok) return { ok: false, message: validation.message, field: validation.field };
  if (record.documents.length >= 40) return { ok: false, message: 'Zakázka již obsahuje maximální počet dokumentů.' };

  const included = isCaseDocumentIncluded(record);
  const now = new Date();
  const document: CaseDocument = {
    id: randomUUID(),
    kind: kindInput,
    title: CASE_DOCUMENT_DEFINITIONS[kindInput].title,
    status: included ? 'ready' : 'pending_payment',
    data: validation.data,
    entitlement: included ? 'included' : 'paid',
    stripeSessionId: null,
    createdAt: now.toISOString(),
    paidAt: included ? now.toISOString() : null,
  };
  const next = await saveCase(
    {
      ...record,
      documents: [...record.documents, document],
      events: [...record.events, newEvent('document_created', `${document.title} připraven${included ? '' : ' (čeká na platbu)'}`)],
    },
    now,
  );
  return { ok: true, record: next, document, requiresPayment: !included };
}

export async function markCaseDocumentPaid(caseId: string, documentId: string, stripeSessionId: string): Promise<CaseRecord | null> {
  const record = await getCase(caseId);
  if (!record) return null;
  const document = record.documents.find((item) => item.id === documentId);
  if (!document) return null;
  if (document.status === 'ready') return record;
  const now = new Date();
  return saveCase(
    {
      ...record,
      documents: record.documents.map((item) =>
        item.id === documentId ? { ...item, status: 'ready', paidAt: now.toISOString(), stripeSessionId } : item,
      ),
      events: [...record.events, newEvent('document_paid', `${document.title} zaplacen a připraven ke stažení`)],
    },
    now,
  );
}
