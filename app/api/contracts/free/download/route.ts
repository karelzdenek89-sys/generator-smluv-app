import { NextResponse } from 'next/server';
import { getClientIp, readFirstPartyJson } from '@/lib/api-security';
import { getContractMeta } from '@/lib/contracts';
import { renderContractPdf } from '@/lib/pdf';
import { redis } from '@/lib/redis';
import { takeRateLimit } from '@/lib/rate-limit';
import { recordAnalyticsEvent } from '@/lib/analytics-server';
import {
  freeDocumentKey,
  freeDocumentTokenMatches,
  type FreeDocumentRecord,
} from '@/lib/free-documents';
import { analyticsAttributionEventParams } from '@/lib/analytics-attribution';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const json = await readFirstPartyJson(req, 4 * 1024);
  if (!json.ok) {
    const status = json.error === 'invalid_origin' ? 403 : json.error === 'payload_too_large' ? 413 : 400;
    return NextResponse.json({ error: 'Neplatný požadavek.' }, { status });
  }
  const freeId = typeof json.data.freeId === 'string' ? json.data.freeId.trim() : '';
  const token = typeof json.data.token === 'string' ? json.data.token.trim() : '';
  if (!/^[0-9a-f-]{36}$/i.test(freeId) || !token) {
    return NextResponse.json({ error: 'Neplatný odkaz ke stažení.' }, { status: 400 });
  }

  try {
    const [documentRate, ipRate] = await Promise.all([
      takeRateLimit(`ratelimit:free-download:${freeId}`, 10, 24 * 60 * 60),
      takeRateLimit(`ratelimit:free-download-ip:${getClientIp(req)}`, 30, 60 * 60),
    ]);
    if (!documentRate.allowed || !ipRate.allowed) {
      return NextResponse.json({ error: 'Příliš mnoho stažení.' }, { status: 429 });
    }
  } catch {
    return NextResponse.json({ error: 'Služba je dočasně nedostupná.' }, { status: 503 });
  }

  const record = await redis.get<FreeDocumentRecord>(freeDocumentKey(freeId));
  if (!record) return NextResponse.json({ error: 'Dokument nebyl nalezen nebo expiroval.' }, { status: 404 });
  if (!freeDocumentTokenMatches(record.downloadToken, token)) {
    return NextResponse.json({ error: 'Neplatný bezpečnostní token.' }, { status: 403 });
  }
  if (record.tier !== 'basic' || record.policy.mode !== 'free_experiment') {
    return NextResponse.json({ error: 'Neplatný režim dokumentu.' }, { status: 403 });
  }
  const expiresAt = Date.parse(record.expiresAt);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    return NextResponse.json({ error: 'Platnost dokumentu vypršela.' }, { status: 410 });
  }

  // Neúspěšný render nesmí zvýšit počítadlo ani vytvořit falešné stažení.
  const pdf = await renderContractPdf(record.payload);
  const meta = getContractMeta(record.contractType);
  const nextRecord = { ...record, downloadCount: record.downloadCount + 1 };
  const remainingTtl = Math.max(60, Math.ceil((expiresAt - Date.now()) / 1000));
  await redis.set(freeDocumentKey(freeId), nextRecord, { ex: remainingTtl });
  if (record.analyticsConsentGranted === true) {
    await recordAnalyticsEvent('free_document_downloaded', {
      contract_type: record.contractType,
      tier: 'basic',
      locale: record.lang,
      source: 'free_download',
      download_format: 'pdf',
      download_sequence: nextRecord.downloadCount,
      monetization_mode: record.policy.mode,
      experiment_id: record.policy.experimentId ?? undefined,
      variant: record.policy.variant ?? undefined,
      ...analyticsAttributionEventParams(record.analyticsAttribution),
    });
  }
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${meta.fileName}"`,
      'Cache-Control': 'no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
