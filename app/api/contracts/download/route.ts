import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { stripe } from '@/lib/stripe';
import { getContractMeta, type StoredContractData } from '@/lib/contracts';
import { renderContractPdf } from '@/lib/pdf';

export const runtime = 'nodejs';

const TTL_AFTER_DOWNLOAD = 60 * 60 * 24 * 7; // 7 dní po stažení

type DraftRecord = {
  contractType: StoredContractData['contractType'];
  notaryUpsell?: boolean;
  payload: StoredContractData;
  paid: boolean;
  createdAt: string;
  paidAt?: string;
  stripeSessionId?: string;
  paymentStatus?: string;
  downloadCount?: number;
};

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session_id.' }, { status: 400 });
    }

    // Ověření platby přes Stripe (spolehlivější než jen Redis flag)
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
        {
          error: 'Draft nebyl nalezen nebo expiroval.',
          hint: 'Dokument je dostupný 7 dní od zaplacení. Pro opětovné zaslání kontaktujte info@smlouvahned.cz',
        },
        { status: 404 }
      );
    }

    // Dvojitá kontrola: Redis flag + Stripe payment_status
    const isPaid = draft.paid === true && session.payment_status === 'paid';

    if (!isPaid) {
      // Failsafe: zkusit aktualizovat Redis pokud Stripe říká paid
      if (session.payment_status === 'paid' && !draft.paid) {
        await redis.set(
          `contract:draft:${draftId}`,
          { ...draft, paid: true, paidAt: new Date().toISOString(), paymentStatus: 'paid' },
          { ex: TTL_AFTER_DOWNLOAD },
        );
        // Pokračuj s generováním
      } else {
        return NextResponse.json(
          {
            error: 'Platba ještě nebyla potvrzena.',
            paymentStatus: session.payment_status,
            hint: 'Platba se zpracovává. Zkuste to za 30 sekund.',
          },
          { status: 403 }
        );
      }
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

    // Počítač stažení + obnovit TTL na 7 dní
    await redis.set(
      `contract:draft:${draftId}`,
      {
        ...draft,
        paid: true,
        downloadCount: (draft.downloadCount || 0) + 1,
        lastDownloadAt: new Date().toISOString(),
      },
      { ex: TTL_AFTER_DOWNLOAD },
    );

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
