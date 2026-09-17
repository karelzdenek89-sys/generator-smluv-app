import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { recordAnalyticsEvent } from '@/lib/analytics-server';
import { issueCaseAccessToken } from '@/lib/cases/access';
import { buildCaseUrl, sendReminderEmail } from '@/lib/cases/emails';
import { isCaseEngineEnabled } from '@/lib/cases/service';
import { commitCase, getCase, indexLegacyPendingDocuments, listDueReminders, newEvent, purgeExpiredPendingDocuments, removeDueReminder } from '@/lib/cases/store';
import { isTransactionalEmailConfigured } from '@/lib/email/transactional';
import { processLegislationWatches } from '@/lib/legal/watch';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const LOCK_KEY = 'operations:daily-cron-lock';
const LOCK_TTL_SECONDS = 10 * 60;
const BATCH_LIMIT = 100;

function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  const header = req.headers.get('authorization') ?? '';
  if (!secret || !header.startsWith('Bearer ')) return false;
  const provided = Buffer.from(header.slice('Bearer '.length));
  const expected = Buffer.from(secret);
  return provided.length === expected.length && timingSafeEqual(provided, expected);
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const lock = await redis.set(LOCK_KEY, String(Date.now()), { ex: LOCK_TTL_SECONDS, nx: true });
  if (lock === null) return NextResponse.json({ ok: true, skipped: 'locked' });

  const summary = {
    due: 0, sent: 0, skipped: 0, failed: 0, purgedDocuments: 0,
    legislationChecked: 0, legislationChanged: 0, legislationSent: 0, legislationFailed: 0,
  };
  try {
    const now = Date.now();
    if (isCaseEngineEnabled()) {
      try {
        await indexLegacyPendingDocuments();
        const purge = await purgeExpiredPendingDocuments(now);
        summary.purgedDocuments = purge.purged;
      } catch (error) {
        console.error('[cron] pending document purge failed', error instanceof Error ? error.name : 'unknown');
        return NextResponse.json({ ok: false, error: 'retention_cleanup_failed' }, { status: 503 });
      }
    }

    if (!isTransactionalEmailConfigured()) return NextResponse.json({ ...summary, ok: false, skipped: 'email_not_configured' }, { status: 503 });

    if (isCaseEngineEnabled()) {
      const due = await listDueReminders(now, BATCH_LIMIT);
      summary.due = due.length;
      for (const ref of due) {
        try {
          const record = await getCase(ref.caseId);
          const reminder = record?.reminders.find((item) => item.id === ref.reminderId);
          if (!record || !reminder || reminder.status !== 'scheduled' || !record.remindersEnabled) {
            await removeDueReminder(ref.member);
            summary.skipped += 1;
            continue;
          }
          const token = await issueCaseAccessToken(record.id, record.ownerEmail);
          const url = buildCaseUrl(record.id, token, { reminder: reminder.id }, record.kind);
          const result = await sendReminderEmail({ to: record.ownerEmail, record, reminder, url });
          if (!result.ok) {
            summary.failed += 1;
            continue;
          }
          const sentAt = new Date().toISOString();
          await commitCase(record.id, (fresh) => ({
            ...fresh,
            reminders: fresh.reminders.map((item) => item.id === reminder.id ? { ...item, status: 'sent', sentAt } : item),
            events: [...fresh.events, newEvent('reminder_sent', `Připomínka termínu odeslána (${reminder.offsetDays} dní předem)`, sentAt)],
          }));
          await removeDueReminder(ref.member);
          await recordAnalyticsEvent('reminder_sent', {
            source: 'cron', surface: 'case_engine', case_kind: record.kind as never,
            case_stage: record.stage, reminder_offset_days: reminder.offsetDays,
          });
          summary.sent += 1;
        } catch (error) {
          summary.failed += 1;
          console.error('[cron] reminder failed', error instanceof Error ? error.name : 'unknown');
        }
      }
    }

    try {
      const legislation = await processLegislationWatches(500);
      summary.legislationChecked = legislation.checked;
      summary.legislationChanged = legislation.changed;
      summary.legislationSent = legislation.sent;
      summary.legislationFailed = legislation.failed;
    } catch (error) {
      summary.legislationFailed += 1;
      console.error('[cron] legislation watch failed', error instanceof Error ? error.name : 'unknown');
    }
  } finally {
    await redis.del(LOCK_KEY).catch(() => undefined);
  }

  console.log(`[cron] reminders due=${summary.due} sent=${summary.sent} skipped=${summary.skipped} failed=${summary.failed} purged=${summary.purgedDocuments}; legislation checked=${summary.legislationChecked} changed=${summary.legislationChanged} sent=${summary.legislationSent} failed=${summary.legislationFailed}`);
  return NextResponse.json({ ok: summary.failed === 0 && summary.legislationFailed === 0, ...summary }, { headers: { 'Cache-Control': 'no-store' } });
}
