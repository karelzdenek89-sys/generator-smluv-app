import { NextResponse } from 'next/server';
import { recordAnalyticsEvent } from '@/lib/analytics-server';
import { authorizeCaseRequest, isCaseRouteFailure } from '@/lib/cases/route-auth';
import { toPublicCase, touchCaseAccess } from '@/lib/cases/store';
import { CASE_DOCUMENT_PRICE_LABEL, isCaseDocumentIncluded, sharedFieldDefaults } from '@/lib/cases/documents';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const auth = await authorizeCaseRequest(req, { rateLimitKey: 'case-resolve', limit: 60, windowSeconds: 600, maxBytes: 4 * 1024 });
  if (isCaseRouteFailure(auth)) return auth.response;
  await touchCaseAccess(auth.record).catch(() => undefined);
  if (auth.body.returning === true) {
    await recordAnalyticsEvent('case_returned', {
      source: 'case_link', surface: 'case_engine', case_kind: auth.record.kind as never, case_stage: auth.record.stage,
    });
  }
  const isWorkOrder = auth.record.kind === 'work_order';
  return NextResponse.json({
    case: toPublicCase(auth.record),
    documentPriceLabel: isWorkOrder ? CASE_DOCUMENT_PRICE_LABEL : null,
    documentsIncluded: isWorkOrder ? isCaseDocumentIncluded(auth.record) : false,
    sharedDefaults: isWorkOrder ? sharedFieldDefaults(auth.record) : {},
  }, { headers: { 'Cache-Control': 'no-store, private' } });
}
