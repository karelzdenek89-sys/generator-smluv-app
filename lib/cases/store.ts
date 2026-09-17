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
 *                                 (CASE_RETENTION_DAYS_CLOSED po uzavření)
 *   case:rev:{caseId}             číslo revize pro compare-and-set (stejné TTL)
 *   case:seen:{caseId}            ISO čas posledního otevření (stejné TTL, samostatný zápis)
 *   case:owner:{sha256(email)}    SET caseId, TTL CASE_RETENTION_DAYS
 *   case:tokens:{caseId}          SET hash tokenů (lib/cases/access.ts)
 *   case:access:{sha256(token)}   JSON CaseAccessRecord, TTL 30 dní
 *   case:reminders:due            ZSET score=dueAt(ms) member=caseId:reminderId
 *   case:docsession:{sessionId}   JSON {caseId, documentId} — mapování Stripe session
 *
 *   case:documents:pending        ZSET score=purgeAt(ms) member=caseId:documentId
 *
 * Retence: případ bez aktivity se smaže po CASE_RETENTION_DAYS; uzavřená
 * zakázka po CASE_RETENTION_DAYS_CLOSED od okamžiku uzavření (`closedAt`) —
 * TTL se při dalších zápisech dopočítává k tomuto pevnému termínu.
 * Rozpracovaný navazující dokument, který nebyl zaplacen do
 * PENDING_DOCUMENT_RETENTION_DAYS od vytvoření, se po uplynutí lhůty už
 * nevrací ze čtení, odstraní se při dalším zápisu a denní úklid
 * (`purgeExpiredPendingDocuments`, cron) jej fyzicky smaže i z neaktivních
 * případů. Vlastník může případ smazat kdykoli (`deleteCase`), což odstraní
 * i indexy a připomínky.
 */

export const CASE_RETENTION_DAYS = 365;
export const CASE_RETENTION_DAYS_CLOSED = 180;
export const PENDING_DOCUMENT_RETENTION_DAYS = 30;
const DAY_SECONDS = 24 * 60 * 60;
const CASE_TTL_SECONDS = CASE_RETENTION_DAYS * DAY_SECONDS;
const CASE_CLOSED_TTL_SECONDS = CASE_RETENTION_DAYS_CLOSED * DAY_SECONDS;

const MIN_TTL_SECONDS = 60;

/** TTL případu: 365 dní od zápisu, u uzavřené zakázky zbytek do closedAt + 180 dní. */
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

/**
 * Data, která nemají v případu co dělat (nebo už ne), se odstraní při každém
 * zápisu: starší záznamy mohly nést `origin.orderSessionId`; nezaplacené
 * dokumenty po 30 dnech nikdo nedoplatí.
 */
function scrubForStorage(record: CaseRecord, now: Date): CaseRecord {
  const { orderSessionId: _legacy, ...origin } = record.origin as CaseRecord['origin'] & { orderSessionId?: unknown };
  void _legacy;
  const documents = record.documents.filter((document) => !isExpiredPendingDocument(document, now.getTime()));
  // closedAt drží pevný termín výmazu uzavřené zakázky; při návratu do jiné fáze se ruší.
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

function revisionKey(caseId: string): string {
  return `case:rev:${caseId}`;
}

function seenKey(caseId: string): string {
  return `case:seen:${caseId}`;
}

/** Zápis případu selhal, protože jej mezitím změnil jiný požadavek (webhook, druhá karta). */
export class CaseConflictError extends Error {
  constructor(caseId: string) {
    super(`case ${caseId} was modified concurrently`);
    this.name = 'CaseConflictError';
  }
}

/**
 * Compare-and-set: zapíše případ jen tehdy, když je uložená revize stejná,
 * jakou nesl načtený záznam. Revize žije v samostatném klíči, aby skript
 * nemusel parsovat JSON (funguje stejně v Upstash i v paměťové náhradě).
 */
const SAVE_CASE_SCRIPT = `
local current = redis.call('GET', KEYS[2])
if current == false then current = '0' end
if current ~= ARGV[1] then return 0 end
redis.call('SET', KEYS[1], ARGV[2], 'EX', ARGV[4])
redis.call('SET', KEYS[2], ARGV[3], 'EX', ARGV[4])
return 1
`;

export async function saveCase(record: CaseRecord, now: Date = new Date()): Promise<CaseRecord> {
  const scrubbed = scrubForStorage(record, now);
  const ttl = caseTtlSeconds(scrubbed, now);
  const expectedRevision = record.revision ?? 0;
  const next: CaseRecord = {
    ...scrubbed,
    revision: expectedRevision + 1,
    updatedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + ttl * 1000).toISOString(),
    events: record.events.slice(-MAX_EVENTS),
  };
  const stored = await redis.eval(
    SAVE_CASE_SCRIPT,
    [caseKey(next.id), revisionKey(next.id)],
    [String(expectedRevision), JSON.stringify(next), String(next.revision), String(ttl)],
  );
  if (Number(stored) !== 1) throw new CaseConflictError(next.id);
  await redis.sadd(ownerKey(next.ownerEmail), next.id);
  await redis.expire(ownerKey(next.ownerEmail), CASE_TTL_SECONDS);
  // Index nezaplacených dokumentů pro denní úklid: přidat čekající, odebrat ostatní.
  const pending = next.documents.filter((document) => document.status === 'pending_payment');
  const settled = record.documents.filter((document) => !pending.some((item) => item.id === document.id));
  await Promise.all([
    ...pending.map((document) => redis.zadd(PENDING_DOCUMENTS_KEY, { score: pendingDocumentPurgeAt(document), member: `${next.id}:${document.id}` })),
    ...settled.map((document) => redis.zrem(PENDING_DOCUMENTS_KEY, `${next.id}:${document.id}`)),
  ]);
  return next;
}

/**
 * Změna případu odolná proti souběhu: načte čerstvý záznam, aplikuje
 * `mutate` a uloží; při konfliktu revize to zopakuje nad novým stavem.
 * Starý snapshot (z klienta nebo z jiné routy) tak nikdy nepřepíše novější
 * zápis — typicky potvrzení platby webhookem.
 */
export async function commitCase(
  caseId: string,
  mutate: (fresh: CaseRecord) => CaseRecord | Promise<CaseRecord>,
  now: Date = new Date(),
  attempts = 4,
): Promise<CaseRecord | null> {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const fresh = await getCase(caseId);
    if (!fresh) return null;
    const next = await mutate(fresh);
    try {
      return await saveCase({ ...next, revision: fresh.revision ?? 0 }, now);
    } catch (error) {
      if (!(error instanceof CaseConflictError) || attempt === attempts - 1) throw error;
    }
  }
  return null;
}

export async function getCase(caseId: string): Promise<CaseRecord | null> {
  if (!isCaseIdFormat(caseId)) return null;
  const [record, revision, seenAt] = await Promise.all([
    redis.get<CaseRecord>(caseKey(caseId)),
    redis.get<string | number>(revisionKey(caseId)),
    redis.get<string>(seenKey(caseId)),
  ]);
  if (!record || record.kind !== 'work_order' || !Array.isArray(record.tasks)) return null;
  const nowMs = Date.now();
  return {
    ...record,
    // Prošlý nezaplacený dokument se nevrací ani před fyzickým úklidem.
    documents: record.documents.filter((document) => !isExpiredPendingDocument(document, nowMs)),
    revision: Number(revision ?? record.revision ?? 0),
    lastAccessAt: typeof seenAt === 'string' && seenAt > record.lastAccessAt ? seenAt : record.lastAccessAt,
  };
}

/**
 * Denní úklid: fyzicky odstraní nezaplacené dokumenty po lhůtě i z případů,
 * kterých se nikdo nedotkl. Vrací počty pro log cronu.
 */
export async function purgeExpiredPendingDocuments(nowMs: number = Date.now(), limit = 200): Promise<{ due: number; purged: number; missing: number }> {
  const entries = (await redis.zrange(PENDING_DOCUMENTS_KEY, 0, nowMs, { byScore: true, withScores: true })) as (string | number)[];
  const members: string[] = [];
  for (let i = 0; i + 1 < entries.length && members.length < limit; i += 2) members.push(String(entries[i]));
  const summary = { due: members.length, purged: 0, missing: 0 };
  for (const member of members) {
    const [caseId, documentId] = member.split(':');
    const raw = isCaseIdFormat(caseId) ? await redis.get<CaseRecord>(caseKey(caseId)) : null;
    const document = raw?.documents.find((item) => item.id === documentId);
    if (!raw || !document) {
      summary.missing += 1;
      await redis.zrem(PENDING_DOCUMENTS_KEY, member);
      continue;
    }
    if (document.status !== 'pending_payment') {
      await redis.zrem(PENDING_DOCUMENTS_KEY, member);
      continue;
    }
    const ttl = await redis.ttl(caseKey(caseId));
    // Zápis bez prodloužení retence: TTL zůstává, jen dokument zmizí.
    const next = await commitCase(caseId, (fresh) => ({ ...fresh, documents: fresh.documents.filter((item) => item.id !== documentId) }), new Date(nowMs));
    if (next && ttl > 0) await redis.expire(caseKey(caseId), ttl);
    if (document.stripeSessionId) await redis.del(`case:docsession:${document.stripeSessionId}`);
    await redis.zrem(PENDING_DOCUMENTS_KEY, member);
    summary.purged += 1;
  }
  return summary;
}

export async function touchCaseAccess(record: Pick<CaseRecord, 'id'>): Promise<void> {
  // Otevření případu nesmí resetovat retenci ani přepsat záznam: čas přístupu
  // jde do samostatného klíče se zbývajícím TTL případu.
  const ttl = await redis.ttl(caseKey(record.id));
  if (ttl <= 0) return;
  await redis.set(seenKey(record.id), new Date().toISOString(), { ex: ttl });
}

export async function listCaseIdsForEmail(email: string): Promise<string[]> {
  const ids = (await redis.smembers(ownerKey(email))) as string[];
  return Array.isArray(ids) ? ids.filter(isCaseIdFormat) : [];
}

export async function deleteCase(record: CaseRecord): Promise<void> {
  await Promise.all([
    ...record.reminders.map((reminder) => redis.zrem(REMINDERS_DUE_KEY, `${record.id}:${reminder.id}`)),
    ...record.documents.map((document) => redis.zrem(PENDING_DOCUMENTS_KEY, `${record.id}:${document.id}`)),
    ...record.documents
      .filter((document) => document.stripeSessionId)
      .map((document) => redis.del(`case:docsession:${document.stripeSessionId}`)),
  ]);
  await redis.srem(ownerKey(record.ownerEmail), record.id);
  await redis.del(caseKey(record.id));
  await redis.del(revisionKey(record.id));
  await redis.del(seenKey(record.id));
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
  // Starší záznamy mohly nést orderSessionId; klientovi se nikdy nevrací.
  const { orderSessionId: _legacy, ...publicOrigin } = origin as CaseRecord['origin'] & { orderSessionId?: unknown };
  void _legacy;
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
