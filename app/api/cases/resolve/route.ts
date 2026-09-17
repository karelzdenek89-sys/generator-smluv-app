import { NextResponse } from 'next/server';
import { recordAnalyticsEvent } from '@/lib/analytics-server';
import { authorizeCaseRequest, isCaseRouteFailure } from '@/lib/cases/route-auth';
import { toPublicCase, touchCaseAccess } from '@/lib/cases/store';
import {
  CASE_DOCUMENT_PRICE_LABEL,
  isCaseDocumentIncluded,
  sharedFieldDefaults,
} from '@/lib/cases/documents';

export const runtime = 'nodejs';

/** Načte případ vlastníka. Token je vždy v těle POST, nikdy v URL. */
export async function POST(req: Request) {
  const auth = await authorizeCaseRequest(req, {
    rateLimitKey: 'case-resolve',
    limit: 60,
    windowSeconds: 600,
    maxBytes: 4 * 1024,
  });
  if (isCaseRouteFailure(auth)) return auth.response;

  await touchCaseAccess(auth.record).catch(() => undefined);
  if (auth.body.returning === true) {
    await recordAnalyticsEvent('case_returned', {
      source: 'case_link',
      surface: 'case_engine',
      case_kind: 'work_order',
      case_stage: auth.record.stage,
    });
  }
  return NextResponse.json({
    case: toPublicCase(auth.record),
    documentPriceLabel: CASE_DOCUMENT_PRICE_LABEL,
    documentsIncluded: isCaseDocumentIncluded(auth.record),
    sharedDefaults: sharedFieldDefaults(auth.record),
  });
}
