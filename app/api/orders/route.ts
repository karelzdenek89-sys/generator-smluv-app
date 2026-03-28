import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export const runtime = 'nodejs';

// Rate limit: max 10 dotazů per IP za 10 minut (ochrana proti brute-force e-mailů)
async function checkRateLimit(ip: string): Promise<boolean> {
  try {
    const key = `ratelimit:orders-lookup:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, 60 * 10);
    return count <= 10;
  } catch {
    return true; // fail-open
  }
}

type DraftData = {
  contractType?: string;
  paidAt?: string;
  tier?: string;
  paid?: boolean;
};

const CONTRACT_NAMES: Record<string, string> = {
  lease:               'Nájemní smlouva',
  car_sale:            'Kupní smlouva na vozidlo',
  gift:                'Darovací smlouva',
  work_contract:       'Smlouva o dílo',
  loan:                'Smlouva o zápůjčce',
  nda:                 'Smlouva o mlčenlivosti (NDA)',
  general_sale:        'Kupní smlouva',
  employment:          'Pracovní smlouva',
  dpp:                 'Dohoda o provedení práce',
  service:             'Smlouva o poskytování služeb',
  sublease:            'Podnájemní smlouva',
  power_of_attorney:   'Plná moc',
  debt_acknowledgment: 'Uznání dluhu',
  cooperation:         'Smlouva o spolupráci',
};

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json({ error: 'Příliš mnoho dotazů. Zkuste to za chvíli.' }, { status: 429 });
  }

  const email = req.nextUrl.searchParams.get('email')?.toLowerCase().trim();
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Neplatný e-mail.' }, { status: 400 });
  }

  try {
    const emailKey = `orders:email:${email}`;
    // smembers vrátí Set nebo null — Upstash REST vrací string[]
    const sessionIds = await redis.smembers(emailKey) as string[];

    if (!sessionIds || sessionIds.length === 0) {
      return NextResponse.json({ orders: [] });
    }

    // Pro každý session_id načteme metadata z Redis (contractType, paidAt, tier)
    // Hledáme draft klíč přes session_id → potřebujeme reverzní index
    // Upstash REST neumí SCAN, proto ukládáme session→draftId index v webhoku.
    // Fallback: vrátíme jen session_id, název "Právní dokument" a datum z indexu.
    const orders = await Promise.all(
      sessionIds.map(async (sessionId) => {
        try {
          // Pokus načíst metadata z reverzního indexu session→draft
          const draftIdKey = `session:draft:${sessionId}`;
          const draftId = await redis.get<string>(draftIdKey);

          if (draftId) {
            const draft = await redis.get<DraftData>(`contract:draft:${draftId}`);
            if (draft?.paid) {
              return {
                sessionId,
                contractName: CONTRACT_NAMES[draft.contractType ?? ''] ?? 'Právní dokument',
                paidAt: draft.paidAt ?? null,
                tier: draft.tier ?? 'basic',
              };
            }
          }

          // Fallback: bez metadat
          return { sessionId, contractName: 'Právní dokument', paidAt: null, tier: 'basic' };
        } catch {
          return { sessionId, contractName: 'Právní dokument', paidAt: null, tier: 'basic' };
        }
      }),
    );

    // Seřadit od nejnovějšího
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
