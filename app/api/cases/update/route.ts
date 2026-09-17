import { NextResponse } from 'next/server';
import { recordAnalyticsEvent } from '@/lib/analytics-server';
import { authorizeCaseRequest, isCaseRouteFailure } from '@/lib/cases/route-auth';
import { applyCaseAction, parseCaseAction } from '@/lib/cases/service';
import { toPublicCase } from '@/lib/cases/store';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const auth = await authorizeCaseRequest(req, {
    rateLimitKey: 'case-update',
    limit: 120,
    windowSeconds: 600,
    maxBytes: 8 * 1024,
  });
  if (isCaseRouteFailure(auth)) return auth.response;

  const action = parseCaseAction(auth.body.action);
  if (!action) return NextResponse.json({ error: 'Neplatná akce.' }, { status: 400 });

  try {
    const result = await applyCaseAction(auth.record, action);
    if (!result.ok) {
      return NextResponse.json({ error: result.message, field: result.field }, { status: 400 });
    }
    const analyticsBase = { source: 'case_page', surface: 'case_engine', case_kind: 'work_order' as const };
    if (action.type === 'delete') {
      await recordAnalyticsEvent('case_deleted', analyticsBase);
      return NextResponse.json({ deleted: true });
    }
    if (action.type === 'set_reminders' && action.enabled) {
      await recordAnalyticsEvent('reminder_enabled', { ...analyticsBase, case_stage: result.record?.stage });
    } else if (action.type !== 'revoke_links') {
      await recordAnalyticsEvent('case_saved', {
        ...analyticsBase,
        case_stage: result.record?.stage,
        cta_type: action.type,
      });
    }
    return NextResponse.json({ case: result.record ? toPublicCase(result.record) : null });
  } catch (error) {
    console.error('[cases] update failed', error instanceof Error ? error.message : 'unknown');
    return NextResponse.json({ error: 'Změnu se nepodařilo uložit. Zkuste to prosím znovu.' }, { status: 500 });
  }
}
