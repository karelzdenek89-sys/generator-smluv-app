import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { recordAnalyticsEvent } from '@/lib/analytics-server';
import { authorizeCaseRequest, isCaseRouteFailure } from '@/lib/cases/route-auth';
import { caseDocumentSessionMatches } from '@/lib/cases/checkout';
import { markCaseDocumentPaid } from '@/lib/cases/service';
import { findDocument, resolveDocumentSession, toPublicCase } from '@/lib/cases/store';

export const runtime = 'nodejs';

/**
 * Failsafe po návratu z platební brány: pokud webhook ještě nedorazil,
 * ověří stav session přímo u Stripe. Ověřuje se session, ze které se
 * zákazník vrací (`session_id` v návratové URL) — musí být zmapovaná na tento
 * dokument; teprve bez ní se použije poslední session uložená u dokumentu.
 */
const SESSION_ID_RE = /^cs_[A-Za-z0-9_]{8,200}$/;
export async function POST(req: Request) {
  const auth = await authorizeCaseRequest(req, {
    rateLimitKey: 'case-doc-sync',
    limit: 30,
    windowSeconds: 600,
    maxBytes: 4 * 1024,
  });
  if (isCaseRouteFailure(auth)) return auth.response;

  const documentId = typeof auth.body.documentId === 'string' ? auth.body.documentId : '';
  const document = findDocument(auth.record, documentId);
  if (!document) return NextResponse.json({ error: 'Dokument nebyl nalezen.' }, { status: 404 });
  if (document.status === 'ready') {
    return NextResponse.json({ case: toPublicCase(auth.record), status: 'ready' });
  }
  const returnedSessionId = typeof auth.body.sessionId === 'string' && SESSION_ID_RE.test(auth.body.sessionId) ? auth.body.sessionId : '';
  let sessionId = document.stripeSessionId ?? '';
  if (returnedSessionId) {
    const mapping = await resolveDocumentSession(returnedSessionId);
    if (mapping && mapping.caseId === auth.record.id && mapping.documentId === document.id) sessionId = returnedSessionId;
  }
  if (!sessionId) {
    return NextResponse.json({ case: toPublicCase(auth.record), status: 'pending' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!caseDocumentSessionMatches(session, auth.record.id, document.id) || session.payment_status !== 'paid') {
      return NextResponse.json({ case: toPublicCase(auth.record), status: 'pending' });
    }
    const updated = await markCaseDocumentPaid(auth.record.id, document.id, session.id);
    if (updated) {
      await recordAnalyticsEvent('followup_document_purchased', {
        source: 'stripe_sync',
        surface: 'case_engine',
        case_kind: 'work_order',
        case_stage: updated.stage,
        document_kind: document.kind,
        price_band: '99',
        total_price_czk: typeof session.amount_total === 'number' ? Math.round(session.amount_total / 100) : undefined,
      });
    }
    return NextResponse.json({ case: toPublicCase(updated ?? auth.record), status: updated ? 'ready' : 'pending' });
  } catch (error) {
    console.error('[cases] document sync failed', error instanceof Error ? error.message : 'unknown');
    return NextResponse.json({ case: toPublicCase(auth.record), status: 'pending' });
  }
}
