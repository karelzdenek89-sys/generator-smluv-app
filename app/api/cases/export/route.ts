import { authorizeCaseRequest, isCaseRouteFailure } from '@/lib/cases/route-auth';
import { toPublicCase } from '@/lib/cases/store';

export const runtime = 'nodejs';

/**
 * Export provozních dat případu. Neobsahuje e-mail vlastníka, přístupové tokeny
 * ani Stripe session ID. Citlivý obsah původní smlouvy Case Engine neukládá.
 */
export async function POST(req: Request) {
  const auth = await authorizeCaseRequest(req, {
    rateLimitKey: 'case-export',
    limit: 20,
    windowSeconds: 600,
    maxBytes: 4 * 1024,
  });
  if (isCaseRouteFailure(auth)) return auth.response;
  const exported = {
    exportedAt: new Date().toISOString(),
    product: 'SmlouvaHned',
    case: toPublicCase(auth.record),
  };
  return new Response(JSON.stringify(exported, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="smlouvahned-pripad-${auth.record.id}.json"`,
      'Cache-Control': 'no-store, private',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
