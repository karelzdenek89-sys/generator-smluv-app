import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import {
  getEffectivePriceLabel,
  getPackageIncludedOutputs,
  getThematicPackageConfig,
  normalizePackageVersion,
  normalizeThematicPackageKey,
  packageIncludesDocx,
} from '@/lib/packages';
import { normalizePricingTier, getTierPriceLabel } from '@/lib/pricing';
import { stripe } from '@/lib/stripe';
import { normalizeLocale } from '@/lib/locale';
import {
  getArchiveDaysWithAddons,
  getCheckoutAddonIncludedItems,
  normalizeStoredCheckoutAddons,
  type CheckoutAddonKey,
} from '@/lib/checkout-addons';
import { readFirstPartyJson } from '@/lib/api-security';
import { takeRateLimit } from '@/lib/rate-limit';
import { buildPartnerContext } from '@/lib/partners/context';
import { getEligiblePartnerOffers } from '@/lib/partners/catalog';
import { getLocalizedPackagePresentation, getLocalizedPricingTier } from '@/lib/i18n/pricing-locale';
import { getFulfilmentContractName } from '@/lib/i18n/fulfilment-email';

export const runtime = 'nodejs';

async function checkStatusRateLimit(ip: string): Promise<boolean> {
  try {
    return (await takeRateLimit(`ratelimit:contract-status:${ip}`, 60, 60 * 10)).allowed;
  } catch {
    return true;
  }
}

function formatStripeAmount(amount: number | null, currency: string | null, locale: string): string | null {
  if (typeof amount !== 'number' || !currency) return null;
  const intlLocale = locale === 'en' ? 'en-GB' : locale === 'ua' ? 'uk-UA' : 'cs-CZ';
  return new Intl.NumberFormat(intlLocale, {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(amount / 100);
}

type DraftRecord = {
  contractType?: string;
  packageKey?: string | null;
  /** Verze obsahu balíčku zamrazená při nákupu; chybí u starších objednávek. */
  packageVersion?: number | null;
  tier?: string;
  lang?: string;
  addOns?: unknown;
  payload?: Record<string, unknown> & {
    addOns?: unknown;
    lang?: string;
  };
  downloadToken?: string | null;
  partnerAttributionId?: string | null;
};

function statusTokenMatches(draft: DraftRecord | null | undefined, token: string): boolean {
  if (!draft?.downloadToken) return false;
  return token === draft.downloadToken;
}

/**
 * Lightweight payment status check — used by the success page before download.
 */
export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    const allowed = await checkStatusRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { status: 'error', message: 'Příliš mnoho dotazů. Zkuste to za chvíli.' },
        { status: 429 },
      );
    }

    const sessionId = req.nextUrl.searchParams.get('session_id');
    const token = req.nextUrl.searchParams.get('token')?.trim() ?? '';

    if (!sessionId) {
      return NextResponse.json({ status: 'error', message: 'Missing session_id' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ status: 'pending' });
    }

    const draftId = session.metadata?.draftId || session.client_reference_id;
    const contractType = session.metadata?.contractType ?? '';
    const tier = normalizePricingTier(session.metadata?.tier);
    const lang = normalizeLocale(session.metadata?.lang);
    let packageKey = normalizeThematicPackageKey(session.metadata?.packageKey);
    let packageVersion = normalizePackageVersion(session.metadata?.packageVersion);
    let packageLabel: string | null = null;
    let addOns: CheckoutAddonKey[] = [];
    let tokenVerified = false;
    let verifiedDraft: DraftRecord | null = null;

    if (draftId) {
      try {
        const draft = await redis.get<DraftRecord>(`contract:draft:${draftId}`);
        if (!statusTokenMatches(draft, token)) {
          return NextResponse.json({ status: 'paid' });
        }
        tokenVerified = true;
        verifiedDraft = draft ?? null;
        if (draft?.packageKey) {
          packageKey = normalizeThematicPackageKey(draft.packageKey) ?? packageKey;
        }
        if (draft?.packageVersion != null) {
          packageVersion = normalizePackageVersion(draft.packageVersion);
        }
        addOns = normalizeStoredCheckoutAddons(draft?.addOns ?? draft?.payload?.addOns);
      } catch {
        // fail-open: metadata from Stripe is enough for UI
      }
    }

    if (!tokenVerified) {
      return NextResponse.json({ status: 'paid' });
    }

    if (packageKey) {
      packageLabel = getLocalizedPackagePresentation(packageKey, lang)?.title
        ?? getThematicPackageConfig(packageKey)?.title
        ?? null;
    }
    const displayAddOns = packageIncludesDocx(packageKey) && !addOns.includes('docx')
      ? [...addOns, 'docx' as const]
      : addOns;
    // Výpis odpovídá zakoupené verzi balíčku, ne aktuální nabídce — zákazník
    // po zaplacení vidí přesně to, co dostane ve svém dokumentu.
    const packageItems = packageKey
      ? getPackageIncludedOutputs(packageKey, { locale: lang, version: packageVersion })
      : [];

    const priceLabel =
      formatStripeAmount(session.amount_total, session.currency, lang) ??
      getEffectivePriceLabel(tier, packageKey);
    const partnerContext = buildPartnerContext({
      contractType,
      documentTier: tier,
      locale: lang,
      packageKey,
      rawContractData: verifiedDraft?.payload,
      paid: true,
      completed: true,
    });
    const partnerOffers = partnerContext ? getEligiblePartnerOffers(partnerContext) : [];

    return NextResponse.json({
      status: 'paid',
      tier,
      tierLabel: packageLabel ?? (lang === 'cs' ? getTierPriceLabel(tier) : getLocalizedPricingTier(tier, lang).title),
      packageKey,
      packageLabel,
      priceLabel,
      archiveDays: getArchiveDaysWithAddons(tier, packageKey, addOns),
      contractType,
      contractName: getFulfilmentContractName(contractType, lang),
      addOns: displayAddOns,
      includedItems: packageItems.length > 0
        ? [...packageItems, ...getCheckoutAddonIncludedItems(addOns, lang)]
        : getCheckoutAddonIncludedItems(addOns, lang),
      lang,
      partnerContext,
      partnerOffers,
      partnerAttributionId: verifiedDraft?.partnerAttributionId ?? null,
    });
  } catch {
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const json = await readFirstPartyJson(req, 4 * 1024);
  if (!json.ok) {
    const status = json.error === 'invalid_origin' ? 403 : json.error === 'payload_too_large' ? 413 : 400;
    return NextResponse.json({ status: 'error' }, { status });
  }
  const sessionId = typeof json.data.sessionId === 'string' ? json.data.sessionId.trim() : '';
  const token = typeof json.data.token === 'string' ? json.data.token.trim() : '';
  const url = req.nextUrl.clone();
  if (sessionId) url.searchParams.set('session_id', sessionId);
  if (token) url.searchParams.set('token', token);
  return GET(new NextRequest(url, { headers: req.headers }));
}
