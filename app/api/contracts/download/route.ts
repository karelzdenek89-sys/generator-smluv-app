import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { stripe } from '@/lib/stripe';
import {
  getEffectivePriceBand,
  normalizePackageVersion,
  normalizeThematicPackageKeyForContract,
  packageIncludesDocx,
} from '@/lib/packages';
import { getContractMeta, type StoredContractData } from '@/lib/contracts';
import { renderContractPdf } from '@/lib/pdf';
import { renderContractDocx } from '@/lib/docx';
import { normalizeLocale } from '@/lib/locale';
import {
  getArchiveDaysWithAddons,
  hasCheckoutAddon,
  normalizeStoredCheckoutAddons,
} from '@/lib/checkout-addons';
import { recordAnalyticsEvent } from '@/lib/analytics-server';
import {
  analyticsAttributionEventParams,
  type CheckoutAnalyticsAttribution,
} from '@/lib/analytics-attribution';
import { takeRateLimit } from '@/lib/rate-limit';
import { readFirstPartyJson } from '@/lib/api-security';
import type { MonetizationMode } from '@/lib/monetization-policy';

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
    return (await takeRateLimit(`ratelimit:download:${sessionId}`, 20, TTL_COMPLETE)).allowed;
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

async function nextDownloadSequence(draftId: string, existingDownloadCount: number, ttl: number): Promise<number> {
  const key = `contract:draft:${draftId}:download-sequence`;
  await redis.set(key, existingDownloadCount, { nx: true, ex: ttl });
  const sequence = await redis.incr(key);
  await redis.expire(key, ttl);
  return sequence;
}

type DraftRecord = {
  contractType: StoredContractData['contractType'];
  tier?: string;
  packageKey?: string | null;
  /** Verze obsahu balíčku zamrazená při nákupu; chybí u starších objednávek. */
  packageVersion?: number | null;
  notaryUpsell?: boolean;
  payload: StoredContractData;
  paid: boolean;
  createdAt: string;
  paidAt?: string;
  expiresAt?: string;
  stripeSessionId?: string;
  paymentStatus?: string;
  downloadCount?: number;
  lang?: string;
  downloadToken?: string | null;
  addOns?: unknown;
  analyticsConsentGranted?: boolean;
  analyticsAttribution?: CheckoutAnalyticsAttribution;
  monetizationMode?: MonetizationMode;
  experimentId?: string | null;
  experimentVariant?: string | null;
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
        const paidAt = new Date().toISOString();
        await redis.set(
          `contract:draft:${draftId}`,
          {
            ...draft,
            paid: true,
            paidAt,
            expiresAt: new Date(Date.parse(paidAt) + failsafeTtl * 1000).toISOString(),
            paymentStatus: 'paid',
          },
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
    // Verze zakoupená při platbě. Objednávky z doby před verzováním údaj
    // nemají a spadnou na verzi 1 — přesně na rozsah, který tehdy koupily.
    const resolvedPackageVersion = normalizePackageVersion(
      session.metadata?.packageVersion ?? draft.packageVersion ?? draft.payload.packageVersion,
    );

    const fullData: StoredContractData = {
      ...draft.payload,
      contractType: resolvedContractType,
      notaryUpsell: paidNotaryUpsell,
      tier: resolvedTier,
      packageKey: resolvedPackageKey,
      packageVersion: resolvedPackageVersion,
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

    // Počítat stažení bez prodlužování pevné retenční lhůty od zaplacení.
    const archiveTtl = getArchiveDaysWithAddons(
      resolvedTier === 'professional' ? 'complete' : resolvedTier,
      resolvedPackageKey,
      addOns,
    ) * 60 * 60 * 24;
    const paidAtMs = draft.paidAt ? Date.parse(draft.paidAt) : Date.now();
    const storedExpiresAtMs = draft.expiresAt ? Date.parse(draft.expiresAt) : NaN;
    const expiresAtMs = Number.isFinite(storedExpiresAtMs)
      ? storedExpiresAtMs
      : paidAtMs + archiveTtl * 1000;
    if (expiresAtMs <= Date.now()) {
      return NextResponse.json(
        { error: 'Platnost dokumentu od zaplacení již vypršela.' },
        { status: 410 },
      );
    }
    const remainingTtl = Math.max(60, Math.ceil((expiresAtMs - Date.now()) / 1000));

    // Nejdřív ověřit entitlement a skutečně vyrenderovat výstup. Počítadlo i
    // analytiku měníme až poté, takže 403 ani chyba rendereru nejsou „stažení“.
    let output: Uint8Array<ArrayBuffer>;
    let contentType: string;
    let fileName: string;
    if (format === 'docx') {
      if (!hasCheckoutAddon(fullData, 'docx') && !packageIncludesDocx(resolvedPackageKey)) {
        return NextResponse.json(
          { error: 'DOCX verze nebyla součástí této objednávky.' },
          { status: 403 },
        );
      }
      output = Uint8Array.from(await renderContractDocx(fullData));
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      fileName = meta.fileName.replace(/\.pdf$/i, '.docx');
    } else {
      output = Uint8Array.from(await renderContractPdf(fullData));
      contentType = 'application/pdf';
      fileName = meta.fileName;
    }

    const nextDownloadCount = await nextDownloadSequence(draftId, draft.downloadCount || 0, remainingTtl);
    await redis.set(
      `contract:draft:${draftId}`,
      {
        ...draft,
        paid: true,
        paidAt: draft.paidAt ?? new Date(paidAtMs).toISOString(),
        expiresAt: new Date(expiresAtMs).toISOString(),
        downloadCount: nextDownloadCount,
        lastDownloadAt: new Date().toISOString(),
      },
      { ex: remainingTtl },
    );

    if (draft.analyticsConsentGranted === true) {
      await recordAnalyticsEvent('document_downloaded', {
        source: 'success_page',
        surface: 'download_endpoint',
        contract_type: resolvedContractType,
        tier: resolvedTier === 'basic' ? 'basic' : 'complete',
        package_key: resolvedPackageKey ?? undefined,
        price_band: getEffectivePriceBand(
          resolvedTier === 'basic' ? 'basic' : 'complete',
          resolvedPackageKey,
        ),
        download_format: format,
        download_sequence: nextDownloadCount,
        monetization_mode: draft.monetizationMode ?? 'paid',
        experiment_id: draft.experimentId ?? undefined,
        variant: draft.experimentVariant ?? undefined,
        ...analyticsAttributionEventParams(draft.analyticsAttribution),
        add_on_keys: addOns.join(','),
        selected_addons_count: addOns.length,
        total_price_czk:
          typeof session.amount_total === 'number'
            ? Math.round(session.amount_total / 100)
            : undefined,
      });
    }

    return new NextResponse(output, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
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

export async function POST(req: NextRequest) {
  const json = await readFirstPartyJson(req, 4 * 1024);
  if (!json.ok) {
    const status = json.error === 'invalid_origin' ? 403 : json.error === 'payload_too_large' ? 413 : 400;
    return NextResponse.json({ error: 'Neplatný požadavek.' }, { status });
  }

  const url = req.nextUrl.clone();
  const sessionId = typeof json.data.sessionId === 'string' ? json.data.sessionId.trim() : '';
  const token = typeof json.data.token === 'string' ? json.data.token.trim() : '';
  const lang = typeof json.data.lang === 'string' ? json.data.lang.trim() : '';
  const format = json.data.format === 'docx' ? 'docx' : 'pdf';
  if (sessionId) url.searchParams.set('session_id', sessionId);
  if (token) url.searchParams.set('token', token);
  if (lang) url.searchParams.set('lang', lang);
  if (format === 'docx') url.searchParams.set('format', format);

  return GET(new NextRequest(url, { headers: req.headers }));
}
