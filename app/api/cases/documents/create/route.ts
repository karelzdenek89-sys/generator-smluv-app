import { NextResponse } from 'next/server';
import { recordAnalyticsEvent } from '@/lib/analytics-server';
import { authorizeCaseRequest, isCaseRouteFailure } from '@/lib/cases/route-auth';
import { prepareCaseDocument } from '@/lib/cases/service';
import { createCaseDocumentCheckout, isCaseDocumentConsentValid } from '@/lib/cases/checkout';
import { toPublicCase } from '@/lib/cases/store';

export const runtime = 'nodejs';

/**
 * Vytvoří navazující dokument zakázky. U zakázek z balíčku Zakázka Plus je
 * dokument ihned připraven; jinak vznikne Stripe Checkout Session za 99 Kč
 * a dokument čeká na webhook (`kind: case_document`).
 */
export async function POST(req: Request) {
  const auth = await authorizeCaseRequest(req, {
    rateLimitKey: 'case-doc-create',
    limit: 30,
    windowSeconds: 3600,
    maxBytes: 32 * 1024,
  });
  if (isCaseRouteFailure(auth)) return auth.response;

  const prepared = await prepareCaseDocument(auth.record, auth.body.kind, auth.body.data);
  if (!prepared.ok) {
    return NextResponse.json({ error: prepared.message, field: prepared.field }, { status: 400 });
  }

  const analyticsBase = {
    source: 'case_page',
    surface: 'case_engine',
    case_kind: 'work_order' as const,
    case_stage: prepared.record.stage,
    document_kind: prepared.document.kind,
  };

  if (!prepared.requiresPayment) {
    await recordAnalyticsEvent('followup_document_purchased', {
      ...analyticsBase,
      price_band: '0',
      package_key: 'work_order',
    });
    return NextResponse.json({
      case: toPublicCase(prepared.record),
      documentId: prepared.document.id,
      ready: true,
    });
  }

  if (!isCaseDocumentConsentValid(auth.body.consent)) {
    // Dokument zůstává uložený jako čekající; platbu lze dokončit později.
    return NextResponse.json(
      {
        error: 'Potvrďte prosím souhlas s dodáním digitálního obsahu.',
        field: 'consent',
        case: toPublicCase(prepared.record),
        documentId: prepared.document.id,
      },
      { status: 400 },
    );
  }

  try {
    const checkout = await createCaseDocumentCheckout(prepared.record, prepared.document, auth.email);
    await recordAnalyticsEvent('checkout_started', {
      ...analyticsBase,
      price_band: '99',
      cta_type: 'case_document',
    });
    return NextResponse.json({
      case: toPublicCase(checkout.record),
      documentId: prepared.document.id,
      ready: false,
      url: checkout.url,
    });
  } catch (error) {
    console.error('[cases] document checkout failed', error instanceof Error ? error.message : 'unknown');
    return NextResponse.json(
      {
        error: 'Platbu se nepodařilo zahájit. Dokument zůstal uložený, zkuste to prosím znovu.',
        case: toPublicCase(prepared.record),
        documentId: prepared.document.id,
      },
      { status: 500 },
    );
  }
}
