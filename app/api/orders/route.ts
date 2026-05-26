import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { normalizePricingTier } from '@/lib/pricing';
import { getThematicPackageConfig } from '@/lib/packages';
import { normalizeLocale } from '@/lib/locale';
import { resolveEmailFromPortalToken } from '@/lib/orders-portal';
import {
  getArchiveDaysWithAddons,
  getCheckoutAddonIncludedItems,
  normalizeStoredCheckoutAddons,
} from '@/lib/checkout-addons';

export const runtime = 'nodejs';

async function checkRateLimit(ip: string): Promise<boolean> {
  try {
    const key = `ratelimit:orders-lookup:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, 60 * 10);
    return count <= 10;
  } catch {
    return true;
  }
}

type DraftData = {
  contractType?: string;
  packageKey?: string | null;
  paidAt?: string;
  tier?: string;
  paid?: boolean;
  lang?: string;
  downloadToken?: string | null;
  customerEmail?: string | null;
  email?: string | null;
  addOns?: unknown;
  payload?: { lang?: string; addOns?: unknown };
};

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

function draftEmail(draft: DraftData | null | undefined): string | null {
  const raw = draft?.customerEmail ?? draft?.email;
  if (!raw || typeof raw !== 'string') return null;
  const normalized = raw.toLowerCase().trim();
  return normalized.includes('@') ? normalized : null;
}

async function listOrdersForEmail(email: string) {
  const emailKey = `orders:email:${email}`;
  const sessionIds = (await redis.smembers(emailKey)) as string[];

  if (!sessionIds?.length) {
    return [];
  }

  const orders = await Promise.all(
    sessionIds.map(async (sessionId) => {
      try {
        const draftId = await redis.get<string>(`session:draft:${sessionId}`);

        if (draftId) {
          const draft = await redis.get<DraftData>(`contract:draft:${draftId}`);
          const ownerEmail = draftEmail(draft);
          if (ownerEmail && ownerEmail !== email) {
            return null;
          }
          if (draft?.paid) {
            const packageConfig = getThematicPackageConfig(draft.packageKey);
            const tier = normalizePricingTier(draft.tier);
            const addOns = normalizeStoredCheckoutAddons(draft.addOns ?? draft.payload?.addOns);
            return {
              sessionId,
              contractName:
                CONTRACT_NAMES[draft.contractType ?? ''] ?? 'Právní dokument',
              packageLabel: packageConfig?.title ?? null,
              paidAt: draft.paidAt ?? null,
              tier,
              lang: normalizeLocale(draft.lang ?? draft.payload?.lang),
              downloadToken: draft.downloadToken ?? null,
              archiveDays: getArchiveDaysWithAddons(tier, draft.packageKey, addOns),
              addOns,
              includedItems: getCheckoutAddonIncludedItems(addOns),
            };
          }
        }

        return {
          sessionId,
          contractName: 'Právní dokument',
          packageLabel: null,
          paidAt: null,
          tier: 'basic',
          lang: 'cs',
        };
      } catch {
        return {
          sessionId,
          contractName: 'Právní dokument',
          packageLabel: null,
          paidAt: null,
          tier: 'basic',
          lang: 'cs',
        };
      }
    }),
  );

  return orders
    .filter((order): order is NonNullable<typeof order> => order !== null)
    .sort((a, b) => {
      if (!a.paidAt) return 1;
      if (!b.paidAt) return -1;
      return new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime();
    });
}

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Příliš mnoho dotazů. Zkuste to za chvíli.' },
      { status: 429 },
    );
  }

  const accessToken = req.nextUrl.searchParams.get('access')?.trim();
  const sessionId = req.nextUrl.searchParams.get('session_id')?.trim();
  const emailParam = req.nextUrl.searchParams.get('email')?.toLowerCase().trim();

  // Block legacy email-only enumeration (P0 security).
  if (emailParam && !accessToken && !sessionId) {
    return NextResponse.json(
      {
        error:
          'Vyhledání pouze podle e-mailu není podporováno. Použijte bezpečný odkaz z potvrzovacího e-mailu nebo e-mail spolu s ID relace.',
      },
      { status: 401 },
    );
  }

  // Single-document lookup: session_id from purchase e-mail (no e-mail index leak).
  if (sessionId) {
    if (!emailParam || !emailParam.includes('@')) {
      return NextResponse.json(
        { error: 'Pro stažení zadejte e-mail použitý při platbě spolu s ID relace z potvrzovacího e-mailu.' },
        { status: 400 },
      );
    }

    try {
      const draftId = await redis.get<string>(`session:draft:${sessionId}`);
      if (!draftId) {
        return NextResponse.json({ orders: [] });
      }
      const draft = await redis.get<DraftData>(`contract:draft:${draftId}`);
      const ownerEmail = draftEmail(draft);
      if (!draft?.paid || !ownerEmail || ownerEmail !== emailParam) {
        return NextResponse.json({ orders: [] });
      }

      const packageConfig = getThematicPackageConfig(draft.packageKey);
      const tier = normalizePricingTier(draft.tier);
      const addOns = normalizeStoredCheckoutAddons(draft.addOns ?? draft.payload?.addOns);
      return NextResponse.json({
        orders: [
          {
            sessionId,
            contractName: CONTRACT_NAMES[draft.contractType ?? ''] ?? 'Právní dokument',
            packageLabel: packageConfig?.title ?? null,
            paidAt: draft.paidAt ?? null,
            tier,
            lang: normalizeLocale(draft.lang ?? draft.payload?.lang),
            downloadToken: draft.downloadToken ?? null,
            archiveDays: getArchiveDaysWithAddons(tier, draft.packageKey, addOns),
            addOns,
            includedItems: getCheckoutAddonIncludedItems(addOns),
          },
        ],
      });
    } catch (err) {
      console.error('[orders API] session lookup error:', err);
      return NextResponse.json({ error: 'Chyba serveru.' }, { status: 500 });
    }
  }

  // List all documents: requires signed portal token from purchase e-mail.
  const emailFromToken = await resolveEmailFromPortalToken(accessToken);
  if (!emailFromToken) {
    return NextResponse.json(
      {
        error:
          'Přístup k dokumentům vyžaduje bezpečný odkaz z potvrzovacího e-mailu po platbě. Stažení jednoho PDF je možné i přes odkaz „Stáhnout PDF“ v e-mailu.',
      },
      { status: 401 },
    );
  }

  try {
    const orders = await listOrdersForEmail(emailFromToken);
    return NextResponse.json({ orders, email: emailFromToken });
  } catch (err) {
    console.error('[orders API] Error:', err);
    return NextResponse.json({ error: 'Chyba serveru.' }, { status: 500 });
  }
}
