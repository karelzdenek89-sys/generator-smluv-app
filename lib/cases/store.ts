import { createHash, randomUUID } from 'node:crypto';
import { redis } from '@/lib/redis';
import {
  CASE_SCHEMA_VERSION,
  type CaseDocument,
  type CaseEvent,
  type CaseEventType,
  type CaseOwnerRole,
  type CasePriceMode,
  type CaseRecord,
  type CaseReminder,
  type PublicCase,
} from './types';
import { buildDefaultTasks, planReminders } from './workflow';

/**
 * Redis datový model Case Engine (viz docs/DATA_MAP.md):
 *
 *   case:{caseId}                 JSON CaseRecord, TTL CASE_RETENTION_DAYS od poslední změny
 *   case:owner:{sha256(email)}    SET caseId, TTL stejně jako případ
 *   case:tokens:{caseId}          SET hash tokenů (lib/cases/access.ts)
 *   case:access:{sha256(token)}   JSON CaseAccessRecord, TTL 30 dní
 *   case:reminders:due            ZSET score=dueAt(ms) member=caseId:reminderId
 *   case:docsession:{sessionId}   JSON {caseId, documentId} — mapování Stripe session
 *
 * Retence: případ bez aktivity se smaže po CASE_RETENTION_DAYS. Vlastník jej
 * může smazat kdykoli (`deleteCase`), což odstraní i indexy a připomínky.
 */

export const CASE_RETENTION_DAYS = 365;
const CASE_TTL_SECONDS = CASE_RETENTION_DAYS * 24 * 60 * 60;
const MAX_EVENTS = 200;
export const CASE_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const REMINDERS_DUE_KEY = 'case:reminders:due';

function caseKey(caseId: string): string {
  return `case:${caseId}`;
}

export function hashOwnerEmail(email: string): string {
  return createHash('sha256').update(email.trim().toLowerCase()).digest('hex');
}

function ownerKey(email: string): string {
  return `case:owner:${hashOwnerEmail(email)}`;
}

export function isCaseIdFormat(value: unknown): value is string {
  return typeof value === 'string' && CASE_ID_RE.test(value);
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  const visible = local.slice(0, 1);
  return `${visible}${'*'.repeat(Math.max(2, Math.min(6, local.length - 1)))}@${domain}`;
}

export function newEvent(type: CaseEventType, label: string, at: string = new Date().toISOString()): CaseEvent {
  return { id: randomUUID(), type, at, label };
}

export type CreateCaseInput = {
  ownerEmail: string;
  ownerRole: CaseOwnerRole;
  title: string;
  startDate: string | null;
  deadline: string | null;
  priceAmountCzk: number | null;
  priceMode: CasePriceMode;
  origin: CaseRecord['origin'];
};

export function buildCaseRecord(input: CreateCaseInput, now: Date = new Date()): CaseRecord {
  const nowIso = now.toISOString();
  const id = randomUUID();
  const tasks = buildDefaultTasks();
  const events: CaseEvent[] = [newEvent('created', 'Zakázka založena ze smlouvy o dílo', nowIso)];
  const reminders: CaseReminder[] = [];
  if (input.deadline) {
    tasks.find((task) => task.key === 'deadline_set')!.done = true;
    tasks.find((task) => task.key === 'deadline_set')!.doneAt = nowIso;
    events.push(newEvent('deadline_set', `Termín dokončení nastaven ze smlouvy`, nowIso));
  }
  return {
    id,
    schemaVersion: CASE_SCHEMA_VERSION,
    kind: 'work_order',
    ownerEmail: input.ownerEmail.trim().toLowerCase(),
    ownerRole: input.ownerRole,
    title: input.title.trim().slice(0, 120) || 'Zakázka',
    stage: 'contract_signed',
    startDate: input.startDate,
    deadline: input.deadline,
    priceAmountCzk: input.priceAmountCzk,
    priceMode: input.priceMode,
    origin: input.origin,
    documents: [],
    tasks,
    events,
    reminders,
    remindersEnabled: false,
    createdAt: nowIso,
    updatedAt: nowIso,
    lastAccessAt: nowIso,
    expiresAt: new Date(now.getTime() + CASE_TTL_SECONDS * 1000).toISOString(),
  };
}

export async function saveCase(record: CaseRecord, now: Date = new Date()): Promise<CaseRecord> {
  const next: CaseRecord = {
    ...record,
    updatedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + CASE_TTL_SECONDS * 1000).toISOString(),
    events: record.events.slice(-MAX_EVENTS),
  };
  await redis.set(caseKey(next.id), next, { ex: CASE_TTL_SECONDS });
  await redis.sadd(ownerKey(next.ownerEmail), next.id);
  await redis.expire(ownerKey(next.ownerEmail), CASE_TTL_SECONDS);
  return next;
}

export async function getCase(caseId: string): Promise<CaseRecord | null> {
  if (!isCaseIdFormat(caseId)) return null;
  const record = await redis.get<CaseRecord>(caseKey(caseId));
  if (!record || record.kind !== 'work_order' || !Array.isArray(record.tasks)) return null;
  return record;
}

export async function touchCaseAccess(record: CaseRecord): Promise<void> {
  // Otevření případu nesmí resetovat retenci; jen zaznamená poslední přístup.
  const ttl = await redis.ttl(caseKey(record.id));
  if (ttl <= 0) return;
  await redis.set(caseKey(record.id), { ...record, lastAccessAt: new Date().toISOString() }, { ex: ttl });
}

export async function listCaseIdsForEmail(email: string): Promise<string[]> {
  const ids = (await redis.smembers(ownerKey(email))) as string[];
  return Array.isArray(ids) ? ids.filter(isCaseIdFormat) : [];
}

export async function deleteCase(record: CaseRecord): Promise<void> {
  await Promise.all([
    ...record.reminders.map((reminder) => redis.zrem(REMINDERS_DUE_KEY, `${record.id}:${reminder.id}`)),
    ...record.documents
      .filter((document) => document.stripeSessionId)
      .map((document) => redis.del(`case:docsession:${document.stripeSessionId}`)),
  ]);
  await redis.srem(ownerKey(record.ownerEmail), record.id);
  await redis.del(caseKey(record.id));
}

// ── Připomínky ─────────────────────────────────────────────────────────────

export async function indexReminder(caseId: string, reminder: CaseReminder): Promise<void> {
  await redis.zadd(REMINDERS_DUE_KEY, {
    score: Date.parse(reminder.dueAt),
    member: `${caseId}:${reminder.id}`,
  });
}

export async function unindexReminder(caseId: string, reminderId: string): Promise<void> {
  await redis.zrem(REMINDERS_DUE_KEY, `${caseId}:${reminderId}`);
}

/**
 * Přeplánuje připomínky podle termínu. Odeslané připomínky zůstávají
 * v historii; naplánované se nahradí novým plánem.
 */
export async function rescheduleReminders(
  record: CaseRecord,
  enabled: boolean,
  now: Date = new Date(),
): Promise<CaseRecord> {
  const kept = record.reminders.filter((reminder) => reminder.status === 'sent');
  await Promise.all(
    record.reminders
      .filter((reminder) => reminder.status === 'scheduled')
      .map((reminder) => unindexReminder(record.id, reminder.id)),
  );
  const scheduled: CaseReminder[] = [];
  if (enabled && record.deadline) {
    for (const entry of planReminders(record.deadline, now)) {
      const reminder: CaseReminder = {
        id: randomUUID(),
        dueAt: entry.dueAt.toISOString(),
        offsetDays: entry.offsetDays,
        anchor: 'deadline',
        status: 'scheduled',
        createdAt: now.toISOString(),
      };
      scheduled.push(reminder);
    }
    await Promise.all(scheduled.map((reminder) => indexReminder(record.id, reminder)));
  }
  return { ...record, remindersEnabled: enabled, reminders: [...kept, ...scheduled] };
}

export type DueReminderRef = { caseId: string; reminderId: string; member: string; dueAtMs: number };

export async function listDueReminders(nowMs: number, limit = 200): Promise<DueReminderRef[]> {
  const members = (await redis.zrange(REMINDERS_DUE_KEY, 0, nowMs, {
    byScore: true,
    withScores: true,
    offset: 0,
    count: limit,
  })) as Array<string | number>;
  const refs: DueReminderRef[] = [];
  for (let i = 0; i + 1 < members.length; i += 2) {
    const member = String(members[i]);
    const score = Number(members[i + 1]);
    const [caseId, reminderId] = member.split(':');
    if (!isCaseIdFormat(caseId) || !reminderId) continue;
    refs.push({ caseId, reminderId, member, dueAtMs: score });
  }
  return refs;
}

export async function removeDueReminder(member: string): Promise<void> {
  await redis.zrem(REMINDERS_DUE_KEY, member);
}

// ── Dokumenty ──────────────────────────────────────────────────────────────

export async function mapDocumentSession(sessionId: string, caseId: string, documentId: string, ttlSeconds = CASE_TTL_SECONDS): Promise<void> {
  await redis.set(`case:docsession:${sessionId}`, { caseId, documentId }, { ex: ttlSeconds });
}

export async function resolveDocumentSession(sessionId: string): Promise<{ caseId: string; documentId: string } | null> {
  const record = await redis.get<{ caseId: string; documentId: string }>(`case:docsession:${sessionId}`);
  if (!record || !isCaseIdFormat(record.caseId) || typeof record.documentId !== 'string') return null;
  return record;
}

export function findDocument(record: CaseRecord, documentId: string): CaseDocument | null {
  return record.documents.find((document) => document.id === documentId) ?? null;
}

// ── Projekce ───────────────────────────────────────────────────────────────

export function toPublicCase(record: CaseRecord): PublicCase {
  const { ownerEmail, origin, ...rest } = record;
  const { orderSessionId: _orderSessionId, ...publicOrigin } = origin;
  void _orderSessionId;
  return {
    ...rest,
    ownerEmailMasked: maskEmail(ownerEmail),
    origin: publicOrigin,
    documents: record.documents.map((document) => ({
      ...document,
      stripeSessionId: null,
    })),
  };
}
