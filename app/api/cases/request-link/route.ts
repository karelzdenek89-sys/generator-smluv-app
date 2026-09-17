import { NextResponse } from 'next/server';
import { getClientIp, readFirstPartyJson } from '@/lib/api-security';
import { takeRateLimit } from '@/lib/rate-limit';
import { isCaseEngineEnabled, sendCaseLinksForEmail } from '@/lib/cases/service';
import { hashOwnerEmail } from '@/lib/cases/store';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Vyžádání návratového odkazu e-mailem. Odpověď je vždy `{ ok: true }`,
 * aby nešlo zjistit, zda daný e-mail zakázky má. Limit na IP i na e-mail.
 */
export async function POST(req: Request) {
  if (!isCaseEngineEnabled()) {
    return NextResponse.json({ error: 'Funkce není dostupná.' }, { status: 404 });
  }
  const json = await readFirstPartyJson(req, 2 * 1024);
  if (!json.ok) {
    const status = json.error === 'invalid_origin' ? 403 : json.error === 'payload_too_large' ? 413 : 400;
    return NextResponse.json({ error: 'Neplatný požadavek.' }, { status });
  }
  const email = typeof json.data.email === 'string' ? json.data.email.trim().toLowerCase() : '';
  const honeypot = typeof json.data.company === 'string' ? json.data.company.trim() : '';
  if (honeypot) return NextResponse.json({ ok: true });
  if (!email || email.length > 200 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Zadejte platný e-mail.' }, { status: 400 });
  }
  try {
    const [ipLimit, emailLimit] = await Promise.all([
      takeRateLimit(`ratelimit:case-link:${getClientIp(req)}`, 10, 3600),
      takeRateLimit(`ratelimit:case-link-email:${hashOwnerEmail(email)}`, 3, 3600),
    ]);
    if (!ipLimit.allowed || !emailLimit.allowed) {
      return NextResponse.json({ error: 'Příliš mnoho požadavků. Zkuste to za hodinu.' }, { status: 429 });
    }
  } catch {
    return NextResponse.json({ error: 'Službu nyní nelze bezpečně použít.' }, { status: 503 });
  }

  try {
    await sendCaseLinksForEmail(email);
  } catch (error) {
    console.error('[cases] request-link failed', error instanceof Error ? error.name : 'unknown');
  }
  return NextResponse.json({ ok: true });
}
