import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { stripe } from '@/lib/stripe';
import { getContractMeta, type StoredContractData } from '@/lib/contracts';
import { renderContractPdf } from '@/lib/pdf';

export const runtime = 'nodejs';

type DraftRecord = {
  contractType: StoredContractData['contractType'];
  notaryUpsell?: boolean;
  payload: StoredContractData;
  paid: boolean;
  createdAt: string;
  paidAt?: string;
  stripeSessionId?: string;
  paymentStatus?: string;
};

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session_id.' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const draftId = session.metadata?.draftId || session.client_reference_id;

    if (!draftId) {
      return NextResponse.json(
        { error: 'Session neobsahuje draftId.' },
        { status: 400 }
      );
    }

    const draft = await redis.get<DraftRecord>(`contract:draft:${draftId}`);

    if (!draft) {
      return NextResponse.json(
        { error: 'Draft nebyl nalezen nebo expiroval.' },
        { status: 404 }
      );
    }

    const isPaid = draft.paid === true && session.payment_status === 'paid';

    if (!isPaid) {
      return NextResponse.json(
        {
          error: 'Platba ještě nebyla potvrzena.',
          paymentStatus: session.payment_status,
          paidFlag: draft.paid,
        },
        { status: 403 }
      );
    }

    const fullData: StoredContractData = {
      ...draft.payload,
      contractType: draft.payload.contractType || draft.contractType,
      notaryUpsell:
        draft.notaryUpsell === true || draft.payload.notaryUpsell === true,
    };

    if (!fullData.contractType) {
      return NextResponse.json(
        { error: 'Payload neobsahuje contractType.' },
        { status: 500 }
      );
    }

    const pdf = await renderContractPdf(fullData);
    const meta = getContractMeta(fullData.contractType);

    await redis.expire(`contract:draft:${draftId}`, 60 * 60);

    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${meta.fileName}"`,
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Download PDF error:', error);

    const message =
      error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        error: 'Nepodařilo se vygenerovat PDF.',
        details: message,
      },
      { status: 500 }
    );
  }
}