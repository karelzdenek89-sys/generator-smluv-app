import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { stripe } from '@/lib/stripe';
import { getContractMeta, type StoredContractData } from '@/lib/contracts';
import { renderContractPdf } from '@/lib/pdf';

export const runtime = 'nodejs';

const TTL_BASIC         = 60 * 60 * 24 * 7;   // 7 dní
const TTL_PROFESSIONAL  = 60 * 60 * 24 * 14;  // 14 dní pro Profesionální balíček
const TTL_COMPLETE      = 60 * 60 * 24 * 30;  // 30 dní pro Kompletní balíček

function getTtlForTier(tier?: string): number {
  if (tier === 'complete' || tier === 'premium') return TTL_COMPLETE;
  if (tier === 'professional') return TTL_PROFESSIONAL;
  return TTL_BASIC;
}

// Rate limit: max 20 stažení per session_id za dobu životnosti dokumentu
// Chrání před scrapingem při úniku session_id; legitimní zákazník stáhne 1–3×
async function checkDownloadRateLimit(sessionId: string): Promise<boolean> {
  try {
    const key = `ratelimit:download:${sessionId}`;
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, TTL_COMPLETE); // use longest TTL for rate limit key
    }
    return count <= 20;
  } catch (err) {
    console.error('Download rate limit Redis error:', err);
    // fail-open pro download: zákazník by jinak nemohl stáhnout dokument
    // při výpadku Redis — riziko přijatelné (session_id je UUID, těžko uhodnutelné)
    return true;
  }
}

type DraftRecord = {
  contractType: StoredContractData['contractType'];
  tier?: 'basic' | 'professional' | 'complete';
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

    // Rate limit per session_id
    const downloadAllowed = await checkDownloadRateLimit(sessionId);
    if (!downloadAllowed) {
      return NextResponse.json(
        { error: 'Příliš mnoho stažení tohoto dokumentu. Kontaktujte info@smlouvahned.cz' },
        { status: 429 },
      );
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

    let draft = await redis.get<DraftRecord>(`contract:draft:${draftId}`);

    // Fallback: Redis selhal nebo draft expiroval — rekonstruujeme z Stripe metadat
    if (!draft) {
      if (session.payment_status === 'paid' && session.metadata?.contractType) {
        console.warn(`[download] Draft missing for ${draftId}, reconstructing from Stripe metadata`);
        const fallbackTier = (session.metadata.tier as DraftRecord['tier']) || 'basic';
        draft = {
          contractType: session.metadata.contractType as DraftRecord['contractType'],
          tier: fallbackTier,
          notaryUpsell: session.metadata.notaryUpsell === 'true',
          payload: {
            contractType: session.metadata.contractType as DraftRecord['contractType'],
            tier: fallbackTier,
          },
          paid: true,
          createdAt: new Date().toISOString(),
          stripeSessionId: session.id,
          paymentStatus: session.payment_status,
        };
      } else {
        return NextResponse.json(
          {
            error: 'Draft nebyl nalezen nebo expiroval.',
            hint: 'Dokument je dostupný 7 dní od zaplacení. Pro opětovné zaslání kontaktujte info@smlouvahned.cz',
          },
          { status: 404 }
        );
      }
    }

    // Dvojitá kontrola: Redis flag + Stripe payment_status
    const isPaid = draft.paid === true && session.payment_status === 'paid';

    if (!isPaid) {
      // Failsafe: zkusit aktualizovat Redis pokud Stripe říká paid
      if (session.payment_status === 'paid' && !draft.paid) {
        const failsafeTtl = getTtlForTier(draft.tier);
        await redis.set(
          `contract:draft:${draftId}`,
          { ...draft, paid: true, paidAt: new Date().toISOString(), paymentStatus: 'paid' },
          { ex: failsafeTtl },
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

    // Tier je primární zdroj pravdy — odvozujeme ho z více míst pro robustnost
    const payloadExtras = draft.payload as StoredContractData & {
      tier?: DraftRecord['tier'];
      notaryUpsell?: boolean;
    };
    const rawTier = (draft.tier || payloadExtras.tier || 'basic') as string;
    const resolvedTier = (rawTier === 'premium' ? 'complete' : rawTier) as DraftRecord['tier'];

    // notaryUpsell = true pro professional a complete (i když Redis draft neobsahuje flag)
    // Tím je zajištěno, že zákazník dostane přesně ten obsah, za který zaplatil
    const resolvedNotaryUpsell =
      draft.notaryUpsell === true ||
      Boolean(payloadExtras.notaryUpsell) ||
      resolvedTier === 'professional' ||
      resolvedTier === 'complete';

    const fullData: StoredContractData = {
      ...draft.payload,
      contractType: draft.payload.contractType || draft.contractType,
      notaryUpsell: resolvedNotaryUpsell,
      tier: resolvedTier,
    };

    if (!fullData.contractType) {
      return NextResponse.json(
        { error: 'Payload neobsahuje contractType.' },
        { status: 500 }
      );
    }

    const pdf = await renderContractPdf(fullData);
    const meta = getContractMeta(fullData.contractType);

    // Počítač stažení + obnovit TTL (7 dní basic, 14 dní professional, 30 dní complete)
    const ttl = getTtlForTier(draft.tier);
    await redis.set(
      `contract:draft:${draftId}`,
      {
        ...draft,
        paid: true,
        downloadCount: (draft.downloadCount || 0) + 1,
        lastDownloadAt: new Date().toISOString(),
      },
      { ex: ttl },
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

    return NextResponse.json(
      { error: 'Nepodařilo se vygenerovat PDF.' },
      { status: 500 }
    );
  }
}
