import { NextResponse } from 'next/server';
import { authorizeCaseRequest, isCaseRouteFailure } from '@/lib/cases/route-auth';
import { CASE_RETENTION_DAYS, CASE_RETENTION_DAYS_CLOSED } from '@/lib/cases/store';

export const runtime = 'nodejs';

/** Export údajů případu (GDPR čl. 15/20) — JSON bez interních identifikátorů objednávky. */
export async function POST(req: Request) {
  const auth = await authorizeCaseRequest(req, {
    rateLimitKey: 'case-export',
    limit: 10,
    windowSeconds: 3600,
    maxBytes: 4 * 1024,
  });
  if (isCaseRouteFailure(auth)) return auth.response;

  const { origin, ...record } = auth.record;
  const { orderSessionId: _legacy, ...publicOrigin } = origin as typeof origin & { orderSessionId?: unknown };
  void _legacy;
  const documents = record.documents.map(({ stripeSessionId: _stripeSessionId, ...document }) => {
    void _stripeSessionId;
    return document;
  });
  const payload = {
    exportedAt: new Date().toISOString(),
    retention: `Případ se automaticky smaže ${CASE_RETENTION_DAYS} dní od poslední změny (uzavřená zakázka ${CASE_RETENTION_DAYS_CLOSED} dní); smazat jej lze kdykoli v zakázce.`,
    case: { ...record, origin: publicOrigin, documents },
  };
  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="zakazka-${auth.record.id.slice(0, 8)}.json"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
