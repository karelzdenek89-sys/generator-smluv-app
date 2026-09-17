import { NextResponse } from 'next/server';
import { getClientIp, readFirstPartyJson } from '@/lib/api-security';
import { takeRateLimit } from '@/lib/rate-limit';
import { recordAnalyticsEvent } from '@/lib/analytics-server';
import { createCaseFromPaidOrder, isCaseEngineEnabled } from '@/lib/cases/service';
import { toPublicCase } from '@/lib/cases/store';
import { casePagePath } from '@/lib/cases/emails';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  if (!isCaseEngineEnabled()) return NextResponse.json({ error: 'Funkce není dostupná.' }, { status: 404 });
  const json = await readFirstPartyJson(req, 4 * 1024);
  if (!json.ok) {
    const status = json.error === 'invalid_origin' ? 403 : json.error === 'payload_too_large' ? 413 : 400;
    return NextResponse.json({ error: 'Neplatný požadavek.' }, { status });
  }
  try {
    const limit = await takeRateLimit(`ratelimit:case-create:${getClientIp(req)}`, 10, 3600);
    if (!limit.allowed) return NextResponse.json({ error: 'Příliš mnoho požadavků. Zkuste to za chvíli.' }, { status: 429 });
  } catch {
    return NextResponse.json({ error: 'Službu nyní nelze bezpečně použít.' }, { status: 503 });
  }

  const sessionId = typeof json.data.sessionId === 'string' ? json.data.sessionId.trim() : '';
  const token = typeof json.data.token === 'string' ? json.data.token.trim() : '';
  if (!/^cs_[A-Za-z0-9_]{10,200}$/.test(sessionId) || !token || token.length > 200) return NextResponse.json({ error: 'Neplatná objednávka.' }, { status: 400 });

  try {
    const result = await createCaseFromPaidOrder({ sessionId, token });
    if (!result.ok) {
      const status = result.reason === 'forbidden' ? 403 : result.reason === 'not_paid' ? 402 : result.reason === 'unsupported' ? 422 : 404;
      return NextResponse.json({ error: 'Případ z této objednávky nelze založit.' }, { status });
    }
    if (result.created) {
      await recordAnalyticsEvent('case_started', {
        source: 'success_page', surface: 'case_engine', case_kind: result.record.kind as never,
        case_origin: 'success_page', contract_type: result.record.origin.contractType,
        tier: result.record.origin.tier, package_key: result.record.origin.packageKey ?? undefined,
      });
    }
    return NextResponse.json({
      caseId: result.record.id,
      token: result.token,
      path: `${casePagePath(result.record.kind)}?id=${encodeURIComponent(result.record.id)}`,
      created: result.created,
      emailSent: result.emailSent,
      case: toPublicCase(result.record),
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('[cases] from-order failed', error instanceof Error ? error.message : 'unknown');
    return NextResponse.json({ error: 'Případ se nepodařilo založit. Zkuste to prosím znovu.' }, { status: 500 });
  }
}
