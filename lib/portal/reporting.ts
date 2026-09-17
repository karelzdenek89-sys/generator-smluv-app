import { redis } from '@/lib/redis';
import { MAX_STORED_ANALYTICS_EVENTS } from '@/lib/analytics-server';
import type { AnalyticsEventName } from '@/lib/analytics';
import { getAllDocumentLegalVersions, type DocumentLegalVersion } from '@/lib/legal/document-versions';
import { LEGAL_CHANGES, getLegalChangesNeedingReview, type LegalChange } from '@/lib/legal/radar';
import { summarizeCommercialIntents, type CommercialIntentSummary } from '@/lib/partners/commercial-intent';

/**
 * Portál 2.0 — KPI funnelu: organic → tool → document → purchase → case →
 * return → follow-up → partner intent. Čte stejnou událostní frontu jako
 * hlavní reporting, ale počítá jen nové signály, aby se stávající dashboard
 * neměnil.
 */

export type PortalFunnelCounts = Record<
  | 'situation_viewed'
  | 'situation_started'
  | 'tool_started'
  | 'tool_completed'
  | 'tool_result_saved'
  | 'builder_view'
  | 'checkout_completed'
  | 'case_offer_viewed'
  | 'case_started'
  | 'case_saved'
  | 'case_returned'
  | 'case_deleted'
  | 'reminder_enabled'
  | 'reminder_sent'
  | 'reminder_clicked'
  | 'followup_document_viewed'
  | 'followup_document_started'
  | 'followup_document_purchased'
  | 'bundle_viewed'
  | 'legal_change_viewed'
  | 'commercial_intent_started'
  | 'commercial_intent_created'
  | 'partner_consent_given'
  | 'subscription_interest',
  number
>;

export type PortalRate = { label: string; value: number | null; numerator: number; denominator: number; target: string };

export type PortalDashboardData = {
  windowDays: number;
  counts: PortalFunnelCounts;
  rates: PortalRate[];
  situations: Array<{ key: string; views: number; starts: number }>;
  tools: Array<{ key: string; starts: number; completions: number; saves: number }>;
  followupRevenueCzk: number;
  intents: CommercialIntentSummary;
  legalChangesTotal: number;
  legalChangesNeedingReview: LegalChange[];
  documentVersions: DocumentLegalVersion[];
  activeCasesApprox: number | null;
  dueRemindersApprox: number | null;
};

type StoredEvent = { event: string; params?: Record<string, unknown>; received_at?: string };

function parseEvent(raw: unknown): StoredEvent | null {
  try {
    const value = typeof raw === 'string' ? (JSON.parse(raw) as unknown) : raw;
    if (!value || typeof value !== 'object') return null;
    const record = value as StoredEvent;
    return typeof record.event === 'string' ? record : null;
  } catch {
    return null;
  }
}

const COUNTED: readonly (keyof PortalFunnelCounts)[] = [
  'situation_viewed', 'situation_started', 'tool_started', 'tool_completed', 'tool_result_saved',
  'builder_view', 'checkout_completed', 'case_offer_viewed', 'case_started', 'case_saved',
  'case_returned', 'case_deleted', 'reminder_enabled', 'reminder_sent', 'reminder_clicked',
  'followup_document_viewed', 'followup_document_started', 'followup_document_purchased',
  'bundle_viewed', 'legal_change_viewed', 'commercial_intent_started', 'commercial_intent_created',
  'partner_consent_given', 'subscription_interest',
];

function rate(label: string, numerator: number, denominator: number, target: string): PortalRate {
  return { label, numerator, denominator, target, value: denominator > 0 ? numerator / denominator : null };
}

export async function getPortalDashboardData(windowDays = 30): Promise<PortalDashboardData> {
  const sinceTime = Date.now() - windowDays * 86_400_000;
  const counts = Object.fromEntries(COUNTED.map((key) => [key, 0])) as PortalFunnelCounts;
  const situations = new Map<string, { views: number; starts: number }>();
  const tools = new Map<string, { starts: number; completions: number; saves: number }>();
  let followupRevenueCzk = 0;
  let workContractPurchases = 0;

  try {
    const rawEvents = ((await redis.lrange('analytics:events', 0, MAX_STORED_ANALYTICS_EVENTS - 1)) ?? []) as unknown[];
    for (const raw of rawEvents) {
      const record = parseEvent(raw);
      if (!record) continue;
      const receivedAt = Date.parse(record.received_at ?? '');
      if (Number.isFinite(receivedAt) && receivedAt < sinceTime) continue;
      const name = record.event as AnalyticsEventName;
      if ((COUNTED as readonly string[]).includes(name)) counts[name as keyof PortalFunnelCounts] += 1;
      const params = record.params ?? {};
      const situation = typeof params.portal_situation === 'string' ? params.portal_situation : null;
      if (situation && (name === 'situation_viewed' || name === 'situation_started')) {
        const entry = situations.get(situation) ?? { views: 0, starts: 0 };
        if (name === 'situation_viewed') entry.views += 1;
        else entry.starts += 1;
        situations.set(situation, entry);
      }
      const toolKey = typeof params.tool_key === 'string' ? params.tool_key : null;
      if (toolKey && (name === 'tool_started' || name === 'tool_completed' || name === 'tool_result_saved')) {
        const entry = tools.get(toolKey) ?? { starts: 0, completions: 0, saves: 0 };
        if (name === 'tool_started') entry.starts += 1;
        else if (name === 'tool_completed') entry.completions += 1;
        else entry.saves += 1;
        tools.set(toolKey, entry);
      }
      if (name === 'followup_document_purchased' && typeof params.total_price_czk === 'number') {
        followupRevenueCzk += params.total_price_czk;
      }
      if (name === 'checkout_completed' && params.contract_type === 'work_contract') workContractPurchases += 1;
    }
  } catch (error) {
    console.warn('[portal-reporting] events unavailable', error instanceof Error ? error.name : 'unknown');
  }

  let activeCasesApprox: number | null = null;
  let dueRemindersApprox: number | null = null;
  try {
    dueRemindersApprox = Number(await redis.zcard('case:reminders:due'));
    // Počet případů se odvozuje z indexu připomínek a událostí; přesný scan
    // klíčů case:* by byl na Upstash drahý, proto zůstává orientační.
    activeCasesApprox = counts.case_started - counts.case_deleted;
  } catch {
    // reporting is best-effort
  }

  const intents = await summarizeCommercialIntents();

  return {
    windowDays,
    counts,
    rates: [
      rate('Tool activation (tool start / situace zobrazena)', counts.tool_started, counts.situation_viewed, 'sledovat'),
      rate('Tool completion (dokončeno / zahájeno)', counts.tool_completed, counts.tool_started, '≥ 50 %'),
      rate('Case activation (zakázka založena / nabídka zobrazena)', counts.case_started, counts.case_offer_viewed, '20–30 %'),
      rate('Case activation vs. nákupy smlouvy o dílo', counts.case_started, workContractPurchases, '20–30 %'),
      rate('Reminder adoption (zapnuto / zakázka založena)', counts.reminder_enabled, counts.case_started, '≥ 25 %'),
      rate('Case return rate (návrat / založeno)', counts.case_returned, counts.case_started, 'sledovat'),
      rate('Follow-up start (zahájen / zakázka založena)', counts.followup_document_started, counts.case_started, '10–15 %'),
      rate('Follow-up purchase (zaplaceno / zahájeno)', counts.followup_document_purchased, counts.followup_document_started, 'sledovat'),
      rate('Partner intent rate (intent / zakázka založena)', counts.commercial_intent_created, counts.case_started, 'sledovat'),
    ],
    situations: [...situations.entries()].map(([key, value]) => ({ key, ...value })).sort((a, b) => b.views - a.views),
    tools: [...tools.entries()].map(([key, value]) => ({ key, ...value })).sort((a, b) => b.starts - a.starts),
    followupRevenueCzk,
    intents,
    legalChangesTotal: LEGAL_CHANGES.length,
    legalChangesNeedingReview: getLegalChangesNeedingReview(),
    documentVersions: getAllDocumentLegalVersions(),
    activeCasesApprox,
    dueRemindersApprox,
  };
}
