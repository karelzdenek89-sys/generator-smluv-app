import { NextResponse } from 'next/server';
import { getClientIp, readFirstPartyJson } from '@/lib/api-security';
import { takeRateLimit } from '@/lib/rate-limit';
import { hashOwnerEmail } from '@/lib/cases/store';
import { sendCaseHubAccessEmail } from '@/lib/cases/hub-access';
import { isFeatureEnabled } from '@/lib/feature-flags';

export const runtime = 'nodejs';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  if (!isFeatureEnabled('caseHub')) return NextResponse.json({ error: 'Funkce není dostupná.' }, { status: 404 });
  const json = await readFirstPartyJson(req, 2 * 1024);
  if (!json.ok) {
    const status = json.error === 'invalid_origin' ? 403 : json.error === 'payload_too_large' ? 413 : 400;
    return NextResponse.json({ error: 'Neplatný požadavek.' }, { status });
  }
  const email = typeof json.data.email === 'string' ? json.data.email.trim().toLowerCase() : '';
  const honeypot = typeof json.data.company === 'string' ? json.data.company.trim() : '';
  if (honeypot) return NextResponse.json({ ok: true });
  if (!email || email.length > 200 || !EMAIL_RE.test(email)) return NextResponse.json({ error: 'Zadejte platný e-mail.' }, { status: 400 });

  try {
    const [ipLimit, emailLimit] = await Promise.all([
      takeRateLimit(`ratelimit:case-hub-link:${getClientIp(req)}`, 10, 3600),
      takeRateLimit(`ratelimit:case-hub-email:${hashOwnerEmail(email)}`, 3, 3600),
    ]);
    if (!ipLimit.allowed || !emailLimit.allowed) return NextResponse.json({ error: 'Příliš mnoho požadavků. Zkuste to za hodinu.' }, { status: 429 });
  } catch {
    return NextResponse.json({ error: 'Službu nyní nelze bezpečně použít.' }, { status: 503 });
  }

  try {
    await sendCaseHubAccessEmail(email);
  } catch (error) {
    console.error('[cases] hub request-link failed', error instanceof Error ? error.name : 'unknown');
  }
  // Enumeration-resistant response: stejná odpověď pro e-mail s případy i bez nich.
  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
}
