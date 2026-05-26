import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { stripe } from '@/lib/stripe';
import { normalizeThematicPackageKeyForContract } from '@/lib/packages';
import { getContractMeta, type StoredContractData } from '@/lib/contracts';
import { renderContractPdf } from '@/lib/pdf';
import { renderContractDocx } from '@/lib/docx';
import { normalizeLocale } from '@/lib/locale';
import {
  getArchiveDaysWithAddons,
  hasCheckoutAddon,
  normalizeStoredCheckoutAddons,
} from '@/lib/checkout-addons';

export const runtime = 'nodejs';

const TTL_BASIC    = 60 * 60 * 24 * 7;   // 7 dní
const TTL_COMPLETE = 60 * 60 * 24 * 30;  // 30 dní

function getTtlForTier(tier?: string): number {
  if (tier === 'basic') return TTL_BASIC;
  return TTL_COMPLETE;
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

type PaidTier = 'basic' | 'professional' | 'complete';

function normalizePaidTier(value?: string | null): PaidTier {
  const raw = String(value ?? 'basic').toLowerCase();
  if (raw === 'professional') return 'professional';
  if (raw === 'complete' || raw === 'premium') return 'complete';
  return 'basic';
}

type DraftRecord = {
  contractType: StoredContractData['contractType'];
  tier?: string;
  packageKey?: string | null;
  notaryUpsell?: boolean;
  payload: StoredContractData;
  paid: boolean;
  createdAt: string;
  paidAt?: string;
  stripeSessionId?: string;
  paymentStatus?: string;
  downloadCount?: number;
  lang?: string;
  downloadToken?: string | null;
  addOns?: unknown;
};

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id');
    const format = req.nextUrl.searchParams.get('format') === 'docx' ? 'docx' : 'pdf';
    const downloadToken = req.nextUrl.searchParams.get('token')?.trim() ?? '';
    const requestedLang = normalizeLocale(req.nextUrl.searchParams.get('lang'));

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

    const draft = await redis.get<DraftRecord>(`contract:draft:${draftId}`);

    // Bez uloženého draftu nemáme zákaznický payload. Nerekonstruujeme prázdný dokument.
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

    const storedToken = draft.downloadToken || session.metadata?.downloadToken || '';
    if (storedToken && downloadToken !== storedToken) {
      return NextResponse.json(
        { error: 'Neplatný nebo chybějící bezpečnostní token ke stažení.' },
        { status: 403 },
      );
    }

    // Tier je primární zdroj pravdy — odvozujeme ho z více míst pro robustnost
    const resolvedTier = normalizePaidTier(session.metadata?.tier || draft.tier);

    const resolvedContractType = draft.payload.contractType || draft.contractType;
    const resolvedPackageKey =
      normalizeThematicPackageKeyForContract(session.metadata?.packageKey, resolvedContractType) ??
      normalizeThematicPackageKeyForContract(draft.packageKey, resolvedContractType) ??
      normalizeThematicPackageKeyForContract(
        typeof draft.payload.packageKey === 'string' ? draft.payload.packageKey : null,
        resolvedContractType,
      );
    const hasPaidPackage = Boolean(resolvedPackageKey);
    const paidNotaryUpsell = hasPaidPackage || resolvedTier === 'professional' || resolvedTier === 'complete';
    const addOns = normalizeStoredCheckoutAddons(draft.addOns ?? draft.payload.addOns);

    const fullData: StoredContractData = {
      ...draft.payload,
      contractType: resolvedContractType,
      notaryUpsell: paidNotaryUpsell,
      tier: resolvedTier,
      packageKey: resolvedPackageKey,
      addOns,
      lang: requestedLang !== 'cs'
        ? requestedLang
        : normalizeLocale(draft.payload.lang ?? draft.lang ?? session.metadata?.lang),
    };

    if (!fullData.contractType) {
      return NextResponse.json(
        { error: 'Payload neobsahuje contractType.' },
        { status: 500 }
      );
    }

    const meta = getContractMeta(fullData.contractType);

    // Počítač stažení + obnovit TTL (7 dní basic, 30 dní ostatní)
    const ttl = getArchiveDaysWithAddons(
      resolvedTier === 'professional' ? 'complete' : resolvedTier,
      resolvedPackageKey,
      addOns,
    ) * 60 * 60 * 24;
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

    if (format === 'docx') {
      if (!hasCheckoutAddon(fullData, 'docx')) {
        return NextResponse.json(
          { error: 'DOCX verze nebyla součástí této objednávky.' },
          { status: 403 },
        );
      }

      const docx = await renderContractDocx(fullData);
      return new NextResponse(new Uint8Array(docx), {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': `attachment; filename="${meta.fileName.replace(/\.pdf$/i, '.docx')}"`,
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    }

    const pdf = await renderContractPdf(fullData);
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
