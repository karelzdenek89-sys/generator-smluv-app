import { NextResponse } from 'next/server';
import { getClientIp, readFirstPartyJson } from '@/lib/api-security';
import { takeRateLimit } from '@/lib/rate-limit';
import { manageLegislationWatch } from '@/lib/legal/watch';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const json = await readFirstPartyJson(req, 3 * 1024);
  if (!json.ok) {
    const status = json.error === 'invalid_origin' ? 403 : json.error === 'payload_too_large' ? 413 : 400;
    return NextResponse.json({ error: 'Neplatný požadavek.' }, { status });
  }
  const id = typeof json.data.id === 'string' ? json.data.id.trim() : '';
  const token = typeof json.data.token === 'string' ? json.data.token.trim() : '';
  const action = json.data.action === 'unsubscribe' ? 'unsubscribe' : json.data.action === 'confirm' ? 'confirm' : null;
  if (!id || id.length > 100 || !token || token.length > 200 || !action) return NextResponse.json({ error: 'Neplatný požadavek.' }, { status: 400 });
  try {
    const limit = await takeRateLimit(`ratelimit:legal-watch-manage:${getClientIp(req)}`, 30, 3600);
    if (!limit.allowed) return NextResponse.json({ error: 'Příliš mnoho požadavků.' }, { status: 429 });
  } catch {
    return NextResponse.json({ error: 'Službu nyní nelze bezpečně použít.' }, { status: 503 });
  }
  const result = await manageLegislationWatch(id, token, action);
  if (result === 'invalid') return NextResponse.json({ error: 'Odkaz je neplatný nebo vypršel.' }, { status: 403 });
  return NextResponse.json({ ok: true, status: result }, { headers: { 'Cache-Control': 'no-store, private' } });
}
