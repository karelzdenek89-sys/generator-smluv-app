import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { normalizePricingTier } from '@/lib/pricing';
import { getThematicPackageConfig, packageIncludesDocx } from '@/lib/packages';
import { normalizeLocale } from '@/lib/locale';
import { resolveEmailFromPortalToken } from '@/lib/orders-portal';
import {
  getArchiveDaysWithAddons,
  getCheckoutAddonIncludedItems,
  normalizeStoredCheckoutAddons,
} from '@/lib/checkout-addons';
import { getClientIp, readFirstPartyJson } from '@/lib/api-security';
import { takeRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

async function checkRateLimit(ip: string): Promise<boolean> {
  try {
    return (await takeRateLimit(`ratelimit:orders-lookup:${ip}`, 10, 60 * 10)).allowed;
  } catch (err) {
    console.error('[orders API] Rate-limit unavailable:', err);
    return false;
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
  deliveryEmail?: string | null;
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
  const raw = draft?.customerEmail ?? draft?.deliveryEmail ?? draft?.email;
  if (!raw || typeof raw !== 'string') return null;
  const normalized = raw.toLowerCase().trim();
  return normalized.includes('@') ? normalized : null;
}

function toOrder(sessionId: string, draft: DraftData) {
  const packageConfig = getThematicPackageConfig(draft.packageKey);
  const tier = normalizePricingTier(draft.tier);
  const addOns = normalizeStoredCheckoutAddons(draft.addOns ?? draft.payload?.addOns);
  const displayAddOns = packageIncludesDocx(draft.packageKey) && !addOns.includes('docx')
    ? [...addOns, 'docx' as const]
    : addOns;
  return {
    sessionId,
    contractName: CONTRACT_NAMES[draft.contractType ?? ''] ?? 'Právní dokument',
    packageLabel: packageConfig?.title ?? null,
    paidAt: draft.paidAt ?? null,
    tier,
    lang: normalizeLocale(draft.lang ?? draft.payload?.lang),
    downloadToken: draft.downloadToken ?? null,
    archiveDays: getArchiveDaysWithAddons(tier, draft.packageKey, addOns),
    addOns: displayAddOns,
    includedItems: packageConfig
      ? [...packageConfig.includedOutputs, ...getCheckoutAddonIncludedItems(addOns)]
      : getCheckoutAddonIncludedItems(addOns),
  };
}

async function listOrdersForEmail(email: string) {
  const sessionIds = (await redis.smembers(`orders:email:${email}`)) as string[];
  if (!sessionIds?.length) return [];

  const orders = await Promise.all(sessionIds.map(async (sessionId) => {
    try {
      const draftId = await redis.get<string>(`session:draft:${sessionId}`);
      // Expired drafts are intentionally omitted: returning a fallback row here
      // creates a dead download button after the paid archive has expired.
      if (!draftId) return null;
      const draft = await redis.get<DraftData>(`contract:draft:${draftId}`);
      if (!draft?.paid) return null;
      const ownerEmail = draftEmail(draft);
      if (!ownerEmail || ownerEmail !== email) return null;
      return toOrder(sessionId, draft);
    } catch (error) {
      console.error('[orders API] Failed to hydrate stored order:', error instanceof Error ? error.name : 'unknown');
      return null;
    }
  }));

  return orders
    .filter((order): order is NonNullable<typeof order> => order !== null)
    .sort((a, b) => {
      if (!a.paidAt) return 1;
      if (!b.paidAt) return -1;
      return new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime();
    });
}

function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: { 'Cache-Control': 'no-store, private', ...(init?.headers ?? {}) },
  });
}

export async function GET(req: NextRequest) {
  const allowed = await checkRateLimit(getClientIp(req));
  if (!allowed) return json({ error: 'Příliš mnoho dotazů. Zkuste to za chvíli.' }, { status: 429 });

  const accessToken = req.nextUrl.searchParams.get('access')?.trim();
  const sessionId = req.nextUrl.searchParams.get('session_id')?.trim();
  const emailParam = req.nextUrl.searchParams.get('email')?.toLowerCase().trim();

  if (emailParam && !accessToken && !sessionId) {
    return json({ error: 'Vyhledání pouze podle e-mailu není podporováno. Použijte bezpečný odkaz nebo e-mail spolu s ID relace.' }, { status: 401 });
  }

  if (sessionId) {
    if (!emailParam || !emailParam.includes('@')) {
      return json({ error: 'Zadejte e-mail použitý při platbě spolu s ID relace.' }, { status: 400 });
    }
    try {
      const draftId = await redis.get<string>(`session:draft:${sessionId}`);
      if (!draftId) return json({ orders: [] });
      const draft = await redis.get<DraftData>(`contract:draft:${draftId}`);
      const ownerEmail = draftEmail(draft);
      if (!draft?.paid || !ownerEmail || ownerEmail !== emailParam) return json({ orders: [] });
      return json({ orders: [toOrder(sessionId, draft)] });
    } catch (err) {
      console.error('[orders API] session lookup error:', err);
      return json({ error: 'Chyba serveru.' }, { status: 500 });
    }
  }

  const emailFromToken = await resolveEmailFromPortalToken(accessToken);
  if (!emailFromToken) {
    return json({ error: 'Přístup k dokumentům vyžaduje bezpečný odkaz z potvrzovacího e-mailu po platbě.' }, { status: 401 });
  }

  try {
    return json({ orders: await listOrdersForEmail(emailFromToken), email: emailFromToken });
  } catch (err) {
    console.error('[orders API] Error:', err);
    return json({ error: 'Chyba serveru.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const parsed = await readFirstPartyJson(req, 4 * 1024);
  if (!parsed.ok) {
    const status = parsed.error === 'invalid_origin' ? 403 : parsed.error === 'payload_too_large' ? 413 : 400;
    return json({ error: 'Neplatný požadavek.' }, { status });
  }

  const url = req.nextUrl.clone();
  const access = typeof parsed.data.access === 'string' ? parsed.data.access.trim() : '';
  const email = typeof parsed.data.email === 'string' ? parsed.data.email.trim() : '';
  const sessionId = typeof parsed.data.sessionId === 'string' ? parsed.data.sessionId.trim() : '';
  if (access) url.searchParams.set('access', access);
  if (email) url.searchParams.set('email', email);
  if (sessionId) url.searchParams.set('session_id', sessionId);
  return GET(new NextRequest(url, { headers: req.headers }));
}
