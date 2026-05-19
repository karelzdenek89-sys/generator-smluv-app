import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import {
  getEffectivePriceLabel,
  getThematicPackageConfig,
  normalizeThematicPackageKey,
} from '@/lib/packages';
import { normalizePricingTier, getTierArchiveDays, getTierPriceLabel } from '@/lib/pricing';
import { stripe } from '@/lib/stripe';
import { normalizeLocale } from '@/lib/locale';

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
};

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

    if (draftId) {
      try {
        const draft = await redis.get<DraftRecord>(`contract:draft:${draftId}`);
        if (draft?.packageKey) {
          packageKey = normalizeThematicPackageKey(draft.packageKey) ?? packageKey;
        }
      } catch {
        // fail-open: metadata from Stripe is enough for UI
      }
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
      archiveDays: getTierArchiveDays(tier),
      contractType,
      contractName: CONTRACT_NAMES[contractType] ?? 'Právní dokument',
      lang,
    });
  } catch {
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
