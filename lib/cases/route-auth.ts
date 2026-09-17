import { NextResponse } from 'next/server';
import { getClientIp, readFirstPartyJson, type JsonObject } from '@/lib/api-security';
import { takeRateLimit } from '@/lib/rate-limit';
import { resolveCaseAccess } from './access';
import { getCase, isCaseIdFormat } from './store';
import { isCaseEngineEnabled } from './service';
import type { CaseRecord } from './types';

export type AuthorizedCaseRequest = {
  record: CaseRecord;
  body: JsonObject;
  email: string;
  ip: string;
};

export type CaseRouteFailure = { response: NextResponse };

/**
 * Společný vstup všech case API rout: first-party JSON, rate limit, formát
 * identifikátorů, token ↔ případ. Chybové odpovědi jsou záměrně stejné pro
 * neexistující případ i špatný token (žádná enumerace případů).
 */
export async function authorizeCaseRequest(
  req: Request,
  options: { rateLimitKey: string; limit: number; windowSeconds: number; maxBytes?: number },
): Promise<AuthorizedCaseRequest | CaseRouteFailure> {
  if (!isCaseEngineEnabled()) {
    return { response: NextResponse.json({ error: 'Funkce není dostupná.' }, { status: 404 }) };
  }
  const json = await readFirstPartyJson(req, options.maxBytes ?? 32 * 1024);
  if (!json.ok) {
    const status = json.error === 'invalid_origin' ? 403 : json.error === 'payload_too_large' ? 413 : 400;
    return { response: NextResponse.json({ error: 'Neplatný požadavek.' }, { status }) };
  }
  const ip = getClientIp(req);
  try {
    const limit = await takeRateLimit(`ratelimit:${options.rateLimitKey}:${ip}`, options.limit, options.windowSeconds);
    if (!limit.allowed) {
      return { response: NextResponse.json({ error: 'Příliš mnoho požadavků. Zkuste to za chvíli.' }, { status: 429 }) };
    }
  } catch (error) {
    console.error(`[cases] rate-limit unavailable (${options.rateLimitKey})`, error instanceof Error ? error.name : 'unknown');
    return { response: NextResponse.json({ error: 'Služba je dočasně nedostupná.' }, { status: 503 }) };
  }

  const caseId = typeof json.data.caseId === 'string' ? json.data.caseId.trim() : '';
  const token = typeof json.data.token === 'string' ? json.data.token.trim() : '';
  if (!isCaseIdFormat(caseId) || !token) {
    return { response: NextResponse.json({ error: 'Odkaz k zakázce je neplatný nebo vypršel.' }, { status: 403 }) };
  }
  const access = await resolveCaseAccess(caseId, token);
  if (!access) {
    return { response: NextResponse.json({ error: 'Odkaz k zakázce je neplatný nebo vypršel.' }, { status: 403 }) };
  }
  const record = await getCase(caseId);
  if (!record || record.ownerEmail !== access.email) {
    return { response: NextResponse.json({ error: 'Odkaz k zakázce je neplatný nebo vypršel.' }, { status: 403 }) };
  }
  return { record, body: json.data, email: access.email, ip };
}

export function isCaseRouteFailure(value: AuthorizedCaseRequest | CaseRouteFailure): value is CaseRouteFailure {
  return 'response' in value;
}
