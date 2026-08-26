import { NextResponse } from 'next/server';
import { getClientIp, readFirstPartyJson } from '@/lib/api-security';
import { redis } from '@/lib/redis';
import { takeRateLimit } from '@/lib/rate-limit';
import { getEligiblePartnerOffers } from '@/lib/partners/catalog';
import {
  freeDocumentKey,
  freeDocumentTokenMatches,
  type FreeDocumentRecord,
} from '@/lib/free-documents';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const json = await readFirstPartyJson(req, 4 * 1024);
  if (!json.ok) return NextResponse.json({ status: 'error' }, { status: json.error === 'invalid_origin' ? 403 : 400 });
  const freeId = typeof json.data.freeId === 'string' ? json.data.freeId.trim() : '';
  const token = typeof json.data.token === 'string' ? json.data.token.trim() : '';
  if (!/^[0-9a-f-]{36}$/i.test(freeId) || !token) {
    return NextResponse.json({ status: 'error' }, { status: 400 });
  }
  try {
    const rate = await takeRateLimit(`ratelimit:free-status:${getClientIp(req)}`, 60, 10 * 60);
    if (!rate.allowed) return NextResponse.json({ status: 'error' }, { status: 429 });
  } catch {
    return NextResponse.json({ status: 'error' }, { status: 503 });
  }
  const record = await redis.get<FreeDocumentRecord>(freeDocumentKey(freeId));
  if (!record || !freeDocumentTokenMatches(record.downloadToken, token)) {
    return NextResponse.json({ status: 'error' }, { status: 403 });
  }
  if (Date.parse(record.expiresAt) <= Date.now()) return NextResponse.json({ status: 'expired' }, { status: 410 });
  return NextResponse.json({
    status: 'ready',
    tier: 'basic',
    contractType: record.contractType,
    lang: record.lang,
    monetizationPolicy: record.policy,
    partnerContext: record.partnerContext,
    partnerOffers: record.partnerContext ? getEligiblePartnerOffers(record.partnerContext) : [],
    partnerAttributionId: record.partnerAttributionId,
    analyticsAttribution: record.analyticsConsentGranted === true
      ? record.analyticsAttribution ?? null
      : null,
  });
}
