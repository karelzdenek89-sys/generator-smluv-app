import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { normalizePricingTier } from '@/lib/pricing';
import { getThematicPackageConfig } from '@/lib/packages';

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

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Příliš mnoho dotazů. Zkuste to za chvíli.' },
      { status: 429 },
    );
  }

  const email = req.nextUrl.searchParams.get('email')?.toLowerCase().trim();
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Neplatný e-mail.' }, { status: 400 });
  }

  try {
    const emailKey = `orders:email:${email}`;
    const sessionIds = (await redis.smembers(emailKey)) as string[];

    if (!sessionIds || sessionIds.length === 0) {
      return NextResponse.json({ orders: [] });
    }

    const orders = await Promise.all(
      sessionIds.map(async (sessionId) => {
        try {
          const draftId = await redis.get<string>(`session:draft:${sessionId}`);

          if (draftId) {
            const draft = await redis.get<DraftData>(`contract:draft:${draftId}`);
            if (draft?.paid) {
              const packageConfig = getThematicPackageConfig(draft.packageKey);
              return {
                sessionId,
                contractName:
                  CONTRACT_NAMES[draft.contractType ?? ''] ?? 'Právní dokument',
                packageLabel: packageConfig?.title ?? null,
                paidAt: draft.paidAt ?? null,
                tier: normalizePricingTier(draft.tier),
              };
            }
          }

          return {
            sessionId,
            contractName: 'Právní dokument',
            packageLabel: null,
            paidAt: null,
            tier: 'basic',
          };
        } catch {
          return {
            sessionId,
            contractName: 'Právní dokument',
            packageLabel: null,
            paidAt: null,
            tier: 'basic',
          };
        }
      }),
    );

    orders.sort((a, b) => {
      if (!a.paidAt) return 1;
      if (!b.paidAt) return -1;
      return new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime();
    });

    return NextResponse.json({ orders });
  } catch (err) {
    console.error('[orders API] Error:', err);
    return NextResponse.json({ error: 'Chyba serveru.' }, { status: 500 });
  }
}
