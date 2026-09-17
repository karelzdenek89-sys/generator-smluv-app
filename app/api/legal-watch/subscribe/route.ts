import { NextResponse } from 'next/server';
import { getClientIp, readFirstPartyJson } from '@/lib/api-security';
import { takeRateLimit } from '@/lib/rate-limit';
import { subscribeLegislationWatch } from '@/lib/legal/watch';
import { hashOwnerEmail } from '@/lib/cases/store';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const json = await readFirstPartyJson(req, 3 * 1024);
  if (!json.ok) {
    const status = json.error === 'invalid_origin' ? 403 : json.error === 'payload_too_large' ? 413 : 400;
    return NextResponse.json({ error: 'Neplatný požadavek.' }, { status });
  }
  const email = typeof json.data.email === 'string' ? json.data.email.trim().toLowerCase() : '';
  const changeKey = typeof json.data.changeKey === 'string' ? json.data.changeKey.trim() : '';
  const honeypot = typeof json.data.company === 'string' ? json.data.company.trim() : '';
  if (honeypot) return NextResponse.json({ ok: true });
  if (!email || !changeKey) return NextResponse.json({ error: 'Doplňte e-mail a sledovanou změnu.' }, { status: 400 });
  try {
    const [ipLimit, emailLimit] = await Promise.all([
      takeRateLimit(`ratelimit:legal-watch:${getClientIp(req)}`, 10, 3600),
      takeRateLimit(`ratelimit:legal-watch-email:${hashOwnerEmail(email)}`, 4, 3600),
    ]);
    if (!ipLimit.allowed || !emailLimit.allowed) return NextResponse.json({ error: 'Příliš mnoho požadavků. Zkuste to za hodinu.' }, { status: 429 });
  } catch {
    return NextResponse.json({ error: 'Službu nyní nelze bezpečně použít.' }, { status: 503 });
  }
  const result = await subscribeLegislationWatch(changeKey, email);
  if (!result.ok) {
    const status = result.reason === 'disabled' || result.reason === 'delivery' ? 503 : 400;
    return NextResponse.json({ error: result.reason === 'email' ? 'Zadejte platný e-mail.' : result.reason === 'unknown_change' ? 'Sledovaná změna nebyla nalezena.' : 'Upozornění nyní nelze aktivovat.' }, { status });
  }
  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
}
