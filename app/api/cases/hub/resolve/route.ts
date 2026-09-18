import { NextResponse } from 'next/server';
import { getClientIp, readFirstPartyJson } from '@/lib/api-security';
import { takeRateLimit } from '@/lib/rate-limit';
import { buildCaseHubPayload, resolveCaseHubAccess } from '@/lib/cases/hub-access';
import { isFeatureEnabled } from '@/lib/feature-flags';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  if (!isFeatureEnabled('caseHub')) return NextResponse.json({ error: 'Funkce není dostupná.' }, { status: 404 });
  const json = await readFirstPartyJson(req, 3 * 1024);
  if (!json.ok) {
    const status = json.error === 'invalid_origin' ? 403 : json.error === 'payload_too_large' ? 413 : 400;
    return NextResponse.json({ error: 'Neplatný požadavek.' }, { status });
  }
  const token = typeof json.data.token === 'string' ? json.data.token.trim() : '';
  if (!token || token.length > 200) return NextResponse.json({ error: 'Neplatný přístup.' }, { status: 400 });
  try {
    const limit = await takeRateLimit(`ratelimit:case-hub-resolve:${getClientIp(req)}`, 60, 600);
    if (!limit.allowed) return NextResponse.json({ error: 'Příliš mnoho požadavků.' }, { status: 429 });
  } catch {
    return NextResponse.json({ error: 'Službu nyní nelze bezpečně použít.' }, { status: 503 });
  }
  const access = await resolveCaseHubAccess(token);
  if (!access) return NextResponse.json({ error: 'Odkaz je neplatný nebo vypršel.' }, { status: 403 });
  const offset = typeof json.data.offset === 'number' && Number.isSafeInteger(json.data.offset) && json.data.offset >= 0 ? json.data.offset : 0;
  const page = await buildCaseHubPayload(access.email, offset, 50, access.generation ?? 'legacy');
  if (!await resolveCaseHubAccess(token)) return NextResponse.json({ error: 'Odkaz byl zneplatněn.' }, { status: 403 });
  return NextResponse.json({ ...page, nextOffset: page.hasMore ? page.nextOffset : null }, { headers: { 'Cache-Control': 'no-store, private' } });
}
