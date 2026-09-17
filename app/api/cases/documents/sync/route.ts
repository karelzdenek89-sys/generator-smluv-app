import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { recordAnalyticsEvent } from '@/lib/analytics-server';
import { authorizeCaseRequest, isCaseRouteFailure } from '@/lib/cases/route-auth';
import { markCaseDocumentPaid } from '@/lib/cases/service';
import { findDocument, toPublicCase } from '@/lib/cases/store';

export const runtime = 'nodejs';

/**
 * Failsafe po návratu z platební brány: pokud webhook ještě nedorazil,
 * ověří stav session přímo u Stripe. Session musí patřit tomuto dokumentu.
 */
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
  if (!document.stripeSessionId) {
    return NextResponse.json({ case: toPublicCase(auth.record), status: 'pending' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(document.stripeSessionId);
    const matches =
      session.metadata?.kind === 'case_document' &&
      session.metadata?.caseId === auth.record.id &&
      session.metadata?.documentId === document.id;
    if (!matches || session.payment_status !== 'paid') {
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
