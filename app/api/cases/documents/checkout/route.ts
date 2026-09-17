import { NextResponse } from 'next/server';
import { recordAnalyticsEvent } from '@/lib/analytics-server';
import { authorizeCaseRequest, isCaseRouteFailure } from '@/lib/cases/route-auth';
import { createCaseDocumentCheckout, isCaseDocumentConsentValid } from '@/lib/cases/checkout';
import { findDocument, toPublicCase } from '@/lib/cases/store';

export const runtime = 'nodejs';

/** Opakované zahájení platby pro dokument, který čeká na zaplacení. */
export async function POST(req: Request) {
  const auth = await authorizeCaseRequest(req, {
    rateLimitKey: 'case-doc-checkout',
    limit: 20,
    windowSeconds: 3600,
    maxBytes: 4 * 1024,
  });
  if (isCaseRouteFailure(auth)) return auth.response;

  const documentId = typeof auth.body.documentId === 'string' ? auth.body.documentId : '';
  const document = findDocument(auth.record, documentId);
  if (!document) return NextResponse.json({ error: 'Dokument nebyl nalezen.' }, { status: 404 });
  if (document.status === 'ready') {
    return NextResponse.json({ case: toPublicCase(auth.record), documentId, ready: true });
  }
  if (!isCaseDocumentConsentValid(auth.body.consent)) {
    return NextResponse.json(
      { error: 'Potvrďte prosím souhlas s dodáním digitálního obsahu.', field: 'consent' },
      { status: 400 },
    );
  }
  try {
    const checkout = await createCaseDocumentCheckout(auth.record, document, auth.email);
    await recordAnalyticsEvent('checkout_started', {
      source: 'case_page',
      surface: 'case_engine',
      case_kind: 'work_order',
      case_stage: auth.record.stage,
      document_kind: document.kind,
      price_band: '99',
      cta_type: 'case_document_retry',
    });
    return NextResponse.json({ case: toPublicCase(checkout.record), documentId, ready: false, url: checkout.url });
  } catch (error) {
    console.error('[cases] document checkout retry failed', error instanceof Error ? error.message : 'unknown');
    return NextResponse.json({ error: 'Platbu se nepodařilo zahájit. Zkuste to prosím znovu.' }, { status: 500 });
  }
}
