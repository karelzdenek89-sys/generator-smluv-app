import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import {
  getEffectivePriceLabel,
  getThematicPackageConfig,
  normalizeThematicPackageKey,
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

export const runtime = 'nodejs';

async function checkStatusRateLimit(ip: string): Promise<boolean> {
  try {
    const key = `ratelimit:contract-status:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, 60 * 10);
    return count <= 60;
  } catch {
    return true;
  }
}

const CONTRACT_NAMES: Record<string, string> = {
  lease: 'Nájemní smlouva',
  car_sale: 'Kupní smlouva na vozidlo',
  gift: 'Darovací smlouva',
  work_contract: 'Smlouva o dílo',
  loan: 'Smlouva o zápůjčce',
  nda: 'Smlouva o mlčenlivosti (NDA)',
  general_sale: 'Kupní smlouva',
  employment: 'Pracovní smlouva',
  dpp: 'Dohoda o provedení práce',
  service: 'Smlouva o poskytování služeb',
  sublease: 'Podnájemní smlouva',
  power_of_attorney: 'Plná moc',
  debt_acknowledgment: 'Uznání dluhu',
  cooperation: 'Smlouva o spolupráci',
};

function formatStripeAmount(amount: number | null, currency: string | null): string | null {
  if (typeof amount !== 'number' || !currency) return null;
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(amount / 100);
}

type DraftRecord = {
  contractType?: string;
  packageKey?: string | null;
  tier?: string;
  lang?: string;
  addOns?: unknown;
  payload?: {
    addOns?: unknown;
    lang?: string;
  };
  downloadToken?: string | null;
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
    let packageLabel: string | null = null;
    let addOns: CheckoutAddonKey[] = [];
    let tokenVerified = false;

    if (draftId) {
      try {
        const draft = await redis.get<DraftRecord>(`contract:draft:${draftId}`);
        if (!statusTokenMatches(draft, token)) {
          return NextResponse.json({ status: 'paid' });
        }
        tokenVerified = true;
        if (draft?.packageKey) {
          packageKey = normalizeThematicPackageKey(draft.packageKey) ?? packageKey;
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
      packageLabel = getThematicPackageConfig(packageKey)?.title ?? null;
    }

    const priceLabel =
      formatStripeAmount(session.amount_total, session.currency) ??
      getEffectivePriceLabel(tier, packageKey);

    return NextResponse.json({
      status: 'paid',
      tier,
      tierLabel: packageLabel ?? getTierPriceLabel(tier),
      packageKey,
      packageLabel,
      priceLabel,
      archiveDays: getArchiveDaysWithAddons(tier, packageKey, addOns),
      contractType,
      contractName: CONTRACT_NAMES[contractType] ?? 'Právní dokument',
      addOns,
      includedItems: getCheckoutAddonIncludedItems(addOns),
      lang,
    });
  } catch {
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
