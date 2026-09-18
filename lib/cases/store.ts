import { createHash, randomUUID } from 'node:crypto';
import { redis } from '@/lib/redis';
import {
  CASE_KINDS,
  CASE_SCHEMA_VERSION,
  type CaseDocument,
  type CaseEvent,
  type CaseEventType,
  type CaseKind,
  type CaseOwnerRole,
  type CasePriceMode,
  type CaseRecord,
  type CaseReminder,
  type PublicCase,
} from './types';
import { buildDefaultTasks, initialStageForKind, planReminders } from './workflow';
import { buildCaseDocumentSnapshot } from './documents';

/**
 * Redis datový model Case Engine (viz docs/DATA_MAP.md):
 *
 *   case:{caseId}                 JSON CaseRecord, TTL CASE_RETENTION_DAYS od poslední změny
 *   case:rev:{caseId}             číslo revize pro compare-and-set (stejné TTL)
 *   case:seen:{caseId}            ISO čas posledního otevření (stejné TTL, samostatný zápis)
 *   case:owner:{sha256(email)}    SET caseId, TTL CASE_RETENTION_DAYS
 *   case:tokens:{caseId}          SET hash tokenů (lib/cases/access.ts)
 *   case:access:{sha256(token)}   JSON CaseAccessRecord, TTL 30 dní
 *   case:reminders:due            ZSET score=dueAt(ms) member=caseId:reminderId
 *   case:docsession:{sessionId}   JSON {caseId, documentId} — mapování Stripe session
 *   case:documents:pending        ZSET score=purgeAt(ms) member=caseId:documentId
 *
 * V2 zachovává stejný namespace, tokeny, CAS a retenci pro všechny case typy.
 * Aktivní případ se maže po 365 dnech od poslední změny; uzavřený po 180 dnech
 * od uzavření. Vlastník může případ smazat kdykoli.
 */

export const CASE_RETENTION_DAYS = 365;
export const CASE_RETENTION_DAYS_CLOSED = 180;
export const PENDING_DOCUMENT_RETENTION_DAYS = 30;
const DAY_SECONDS = 24 * 60 * 60;
const CASE_TTL_SECONDS = CASE_RETENTION_DAYS * DAY_SECONDS;
const CASE_CLOSED_TTL_SECONDS = CASE_RETENTION_DAYS_CLOSED * DAY_SECONDS;
const MIN_TTL_SECONDS = 60;

export function caseTtlSeconds(record: Pick<CaseRecord, 'stage' | 'closedAt'>, now: Date = new Date()): number {
  if (record.stage !== 'closed') return CASE_TTL_SECONDS;
  const closedAtMs = Date.parse(record.closedAt ?? '');
  if (!Number.isFinite(closedAtMs)) return CASE_CLOSED_TTL_SECONDS;
  const remaining = Math.floor((closedAtMs + CASE_CLOSED_TTL_SECONDS * 1000 - now.getTime()) / 1000);
  return Math.max(MIN_TTL_SECONDS, Math.min(CASE_CLOSED_TTL_SECONDS, remaining));
}

export function pendingDocumentPurgeAt(document: Pick<CaseDocument, 'createdAt'>): number {
  return Date.parse(document.createdAt) + PENDING_DOCUMENT_RETENTION_DAYS * DAY_SECONDS * 1000;
}

function isExpiredPendingDocument(document: CaseDocument, nowMs: number): boolean {
  return document.status === 'pending_payment' && pendingDocumentPurgeAt(document) <= nowMs;
}

function scrubForStorage(record: CaseRecord, now: Date): CaseRecord {
  const { orderSessionId: _legacy, ...origin } = record.origin as CaseRecord['origin'] & { orderSessionId?: unknown };
  void _legacy;
  const documents = record.documents.filter((document) => !isExpiredPendingDocument(document, now.getTime()));
  const closedAt = record.stage === 'closed' ? record.closedAt ?? now.toISOString() : null;
  return { ...record, origin, documents, closedAt };
}
const MAX_EVENTS = 200;
export const CASE_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const REMINDERS_DUE_KEY = 'case:reminders:due';
const PENDING_DOCUMENTS_KEY = 'case:documents:pending';

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
  kind?: CaseKind;
  ownerEmail: string;
  ownerRole: CaseOwnerRole;
  title: string;
  startDate: string | null;
  deadline: string | null;
  priceAmountCzk: number | null;
  priceMode: CasePriceMode;
  origin: CaseRecord['origin'];
};

const CREATED_LABEL: Record<CaseKind, string> = {
  work_order: 'Zakázka založena ze smlouvy o dílo',
  rental: 'Pronájem uložen jako případ',
  vehicle_transfer: 'Převod vozidla uložen jako případ',
};
const FALLBACK_TITLE: Record<CaseKind, string> = {
  work_order: 'Zakázka',
  rental: 'Pronájem',
  vehicle_transfer: 'Převod vozidla',
};

export function buildCaseRecord(input: CreateCaseInput, now: Date = new Date()): CaseRecord {
  const nowIso = now.toISOString();
  const id = randomUUID();
  const kind = input.kind ?? 'work_order';
  const tasks = buildDefaultTasks(kind);
  const events: CaseEvent[] = [newEvent('created', CREATED_LABEL[kind], nowIso)];
  const reminders: CaseReminder[] = [];
  if (input.deadline) {
    const deadlineTask = tasks.find((task) => task.key === 'deadline_set');
    if (deadlineTask) {
      deadlineTask.done = true;
      deadlineTask.doneAt = nowIso;
    }
    events.push(newEvent('deadline_set', 'Nejbližší důležitý termín nastaven při založení případu', nowIso));
  }
  return {
    id,
    schemaVersion: CASE_SCHEMA_VERSION,
    kind,
    ownerEmail: input.ownerEmail.trim().toLowerCase(),
    ownerRole: input.ownerRole,
    title: input.title.trim().slice(0, 120) || FALLBACK_TITLE[kind],
    stage: initialStageForKind(kind),
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

function revisionKey(caseId: string): string {
  return `case:rev:${caseId}`;
}

function seenKey(caseId: string): string {
  return `case:seen:${caseId}`;
}

export class CaseConflictError extends Error {
  constructor(caseId: string) {
    super(`case ${caseId} was modified concurrently`);
    this.name = 'CaseConflictError';
  }
}

const SAVE_CASE_SCRIPT = `
local current = redis.call('GET', KEYS[2])
if current == false then current = '0' end
if current ~= ARGV[1] then return 0 end
local ttl = tonumber(ARGV[4])
if ARGV[5] == 'preserve' then
  local remaining = redis.call('TTL', KEYS[1])
  if remaining <= 0 then return 0 end
  ttl = math.min(ttl, remaining)
end
local previous = redis.call('GET', KEYS[1])
if previous then
  for _, doc in ipairs(cjson.decode(previous).documents or {}) do
    redis.call('ZREM', KEYS[3], ARGV[6] .. ':' .. doc.id)
  end
end
for _, pending in ipairs(cjson.decode(ARGV[7])) do
  redis.call('ZADD', KEYS[3], pending[2], pending[1])
end
redis.call('SET', KEYS[1], ARGV[2], 'EX', ttl)
redis.call('SET', KEYS[2], ARGV[3], 'EX', ttl)
return 1
`;

type SaveCaseOptions = { preserveRetention?: boolean };

export async function saveCase(record: CaseRecord, now: Date = new Date(), options: SaveCaseOptions = {}): Promise<CaseRecord> {
  const scrubbed = scrubForStorage(record, now);
  const ttl = caseTtlSeconds(scrubbed, now);
  const expectedRevision = record.revision ?? 0;
  const next: CaseRecord = {
    ...scrubbed,
    revision: expectedRevision + 1,
    updatedAt: options.preserveRetention ? record.updatedAt : now.toISOString(),
    expiresAt: options.preserveRetention ? record.expiresAt : new Date(now.getTime() + ttl * 1000).toISOString(),
    events: record.events.slice(-MAX_EVENTS),
  };
  const stored = await redis.eval(
    SAVE_CASE_SCRIPT,
    [caseKey(next.id), revisionKey(next.id), PENDING_DOCUMENTS_KEY],
    [String(expectedRevision), JSON.stringify(next), String(next.revision), String(ttl),
      options.preserveRetention ? 'preserve' : 'renew', next.id,
      JSON.stringify(next.documents.filter((document) => document.status === 'pending_payment')
        .map((document) => [`${next.id}:${document.id}`, pendingDocumentPurgeAt(document)]))],
  );
  if (Number(stored) !== 1) throw new CaseConflictError(next.id);
  await redis.sadd(ownerKey(next.ownerEmail), next.id);
  await redis.expire(ownerKey(next.ownerEmail), CASE_TTL_SECONDS);
  return next;
}

export async function commitCase(
  caseId: string,
  mutate: (fresh: CaseRecord) => CaseRecord | Promise<CaseRecord>,
  now: Date = new Date(),
  attempts = 4,
  options: SaveCaseOptions = {},
): Promise<CaseRecord | null> {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const fresh = await getCase(caseId);
    if (!fresh) return null;
    const stable = {
      ...fresh,
      documents: fresh.documents.map((document) => document.snapshot ? document : ({
        ...document,
        snapshot: { ...buildCaseDocumentSnapshot(document.kind, fresh, document.data), templateVersion: 'legacy-frozen-2026.2' },
      })),
    };
    const next = await mutate(stable);
    try {
      return await saveCase({ ...next, revision: fresh.revision ?? 0 }, now, options);
    } catch (error) {
      if (!(error instanceof CaseConflictError) || attempt === attempts - 1) throw error;
    }
  }
  return null;
}

export async function getCase(caseId: string): Promise<CaseRecord | null> {
  if (!isCaseIdFormat(caseId)) return null;
  const [record, seenAt] = await Promise.all([
    redis.get<CaseRecord>(caseKey(caseId)),
    redis.get<string>(seenKey(caseId)),
  ]);
  if (!record || !(CASE_KINDS as readonly string[]).includes(record.kind) || !Array.isArray(record.tasks)) return null;
  const nowMs = Date.now();
  return {
    ...record,
    schemaVersion: record.schemaVersion ?? 1,
    documents: Array.isArray(record.documents) ? record.documents.filter((document) => !isExpiredPendingDocument(document, nowMs)) : [],
    revision: record.revision ?? 0,
    lastAccessAt: typeof seenAt === 'string' && seenAt > record.lastAccessAt ? seenAt : record.lastAccessAt,
  };
}

export async function purgeExpiredPendingDocuments(nowMs: number = Date.now(), limit = 200): Promise<{ due: number; purged: number; missing: number }> {
  const entries = (await redis.zrange(PENDING_DOCUMENTS_KEY, 0, nowMs, { byScore: true, withScores: true, offset: 0, count: limit })) as (string | number)[];
  const members: string[] = [];
  for (let i = 0; i + 1 < entries.length && members.length < limit; i += 2) members.push(String(entries[i]));
  const summary = { due: members.length, purged: 0, missing: 0 };
  for (const member of members) {
    const [caseId, documentId] = member.split(':');
    const raw = isCaseIdFormat(caseId) ? await redis.get<CaseRecord>(caseKey(caseId)) : null;
    const document = raw?.documents?.find((item) => item.id === documentId);
    if (!raw || !document) {
      summary.missing += 1;
      await redis.zrem(PENDING_DOCUMENTS_KEY, member);
      continue;
    }
    if (document.status !== 'pending_payment' || !isExpiredPendingDocument(document, nowMs)) {
      await redis.zrem(PENDING_DOCUMENTS_KEY, member);
      continue;
    }
    const cleaned = await commitCase(caseId, (fresh) => ({
      ...fresh,
      documents: fresh.documents.filter((item) => item.id !== documentId || !isExpiredPendingDocument(item, nowMs)),
    }), new Date(nowMs), 4, { preserveRetention: true });
    if (cleaned?.documents.some((item) => item.id === documentId)) continue;
    if (document.stripeSessionId) await redis.del(`case:docsession:${document.stripeSessionId}`);
    await redis.zrem(PENDING_DOCUMENTS_KEY, member);
    summary.purged += 1;
  }
  return summary;
}

export async function indexLegacyPendingDocuments(maxPages = 10): Promise<{ scanned: number; complete: boolean }> {
  const cursorKey = 'case:maintenance:pending-scan';
  let cursor = Number(await redis.get<string | number>(cursorKey) ?? 0);
  let scanned = 0;
  for (let page = 0; page < maxPages; page += 1) {
    const [nextCursor, keys] = await redis.scan(cursor, { match: 'case:*', count: 200 });
    for (const key of keys) {
      const id = key.slice('case:'.length);
      if (!isCaseIdFormat(id)) continue;
      const record = await redis.get<CaseRecord>(key);
      if (!record || !Array.isArray(record.documents)) continue;
      scanned += 1;
      for (const document of record.documents) {
        if (document.status === 'pending_payment') {
          await redis.zadd(PENDING_DOCUMENTS_KEY, { score: pendingDocumentPurgeAt(document), member: `${id}:${document.id}` });
        }
      }
    }
    cursor = Number(nextCursor);
    await redis.set(cursorKey, cursor);
    if (cursor === 0) return { scanned, complete: true };
  }
  return { scanned, complete: false };
}

export async function touchCaseAccess(record: Pick<CaseRecord, 'id'>): Promise<void> {
  const ttl = await redis.ttl(caseKey(record.id));
  if (ttl <= 0) return;
  await redis.set(seenKey(record.id), new Date().toISOString(), { ex: ttl });
}

export async function listCaseIdsForEmail(email: string): Promise<string[]> {
  const ids = (await redis.smembers(ownerKey(email))) as string[];
  return Array.isArray(ids) ? ids.filter(isCaseIdFormat) : [];
}

export async function listCasesForEmail(email: string, limit = 50, offset = 0): Promise<CaseRecord[]> {
  const ids = await listCaseIdsForEmail(email);
  const records: CaseRecord[] = [];
  const staleIds: string[] = [];

  // Do not slice the owner index before resolving records. Expired case IDs can
  // remain in the SET until it is next touched and must not hide a newer,
  // still-valid case from the hub or recovery e-mail.
  for (let index = 0; index < ids.length; index += 50) {
    const batchIds = ids.slice(index, index + 50);
    const batch = await Promise.all(batchIds.map((id) => getCase(id)));
    batch.forEach((record, position) => {
      if (record) records.push(record);
      else staleIds.push(batchIds[position]);
    });
  }

  for (let index = 0; index < staleIds.length; index += 100) {
    await redis.srem(ownerKey(email), ...staleIds.slice(index, index + 100));
  }

  const safeLimit = Math.max(1, Math.min(limit, 100));
  const safeOffset = Math.max(0, Math.floor(offset));
  return records
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(safeOffset, safeOffset + safeLimit);
}

export async function deleteCase(record: CaseRecord): Promise<void> {
  await Promise.all([
    ...record.reminders.map((reminder) => redis.zrem(REMINDERS_DUE_KEY, `${record.id}:${reminder.id}`)),
    ...record.documents.map((document) => redis.zrem(PENDING_DOCUMENTS_KEY, `${record.id}:${document.id}`)),
    ...record.documents.filter((document) => document.stripeSessionId).map((document) => redis.del(`case:docsession:${document.stripeSessionId}`)),
  ]);
  await redis.srem(ownerKey(record.ownerEmail), record.id);
  await redis.del(caseKey(record.id));
  await redis.del(revisionKey(record.id));
  await redis.del(seenKey(record.id));
}

export async function indexReminder(caseId: string, reminder: CaseReminder): Promise<void> {
  await redis.zadd(REMINDERS_DUE_KEY, { score: Date.parse(reminder.dueAt), member: `${caseId}:${reminder.id}` });
}

export async function unindexReminder(caseId: string, reminderId: string): Promise<void> {
  await redis.zrem(REMINDERS_DUE_KEY, `${caseId}:${reminderId}`);
}

export async function rescheduleReminders(record: CaseRecord, enabled: boolean, now: Date = new Date()): Promise<CaseRecord> {
  const kept = record.reminders.filter((reminder) => reminder.status === 'sent');
  await Promise.all(record.reminders.filter((reminder) => reminder.status === 'scheduled').map((reminder) => unindexReminder(record.id, reminder.id)));
  const scheduled: CaseReminder[] = [];
  if (enabled && record.deadline) {
    for (const entry of planReminders(record.deadline, now)) {
      const reminder: CaseReminder = {
        id: randomUUID(), dueAt: entry.dueAt.toISOString(), offsetDays: entry.offsetDays,
        anchor: 'deadline', status: 'scheduled', createdAt: now.toISOString(),
      };
      scheduled.push(reminder);
    }
    await Promise.all(scheduled.map((reminder) => indexReminder(record.id, reminder)));
  }
  return { ...record, remindersEnabled: enabled, reminders: [...kept, ...scheduled] };
}

export type DueReminderRef = { caseId: string; reminderId: string; member: string; dueAtMs: number };

export async function listDueReminders(nowMs: number, limit = 200): Promise<DueReminderRef[]> {
  const members = (await redis.zrange(REMINDERS_DUE_KEY, 0, nowMs, { byScore: true, withScores: true, offset: 0, count: limit })) as Array<string | number>;
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

export function toPublicCase(record: CaseRecord): PublicCase {
  const { ownerEmail, origin, ...rest } = record;
  const { orderSessionId: _legacy, ...publicOrigin } = origin as CaseRecord['origin'] & { orderSessionId?: unknown };
  void _legacy;
  return {
    ...rest,
    ownerEmailMasked: maskEmail(ownerEmail),
    origin: publicOrigin,
    documents: record.documents.map((document) => ({ ...document, stripeSessionId: null, checkoutRequest: null })),
  };
}
