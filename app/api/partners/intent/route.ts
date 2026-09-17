import { NextResponse } from 'next/server';
import { getClientIp, readFirstPartyJson } from '@/lib/api-security';
import { takeRateLimit } from '@/lib/rate-limit';
import { recordAnalyticsEvent } from '@/lib/analytics-server';
import { resolveCaseAccess } from '@/lib/cases/access';
import { isCaseIdFormat } from '@/lib/cases/store';
import {
  buildCommercialIntent,
  isCommercialIntentCaptureEnabled,
  persistCommercialIntent,
  withdrawCommercialIntent,
} from '@/lib/partners/commercial-intent';

export const runtime = 'nodejs';

/**
 * Založení commercial intentu s partner consentem.
 *
 * Fail-closed: bez zapnutého flagu `commercialIntents` vrací 404; bez
 * připraveného partnera zůstává lead `pending` a nikam se neodesílá.
 * Subjekt je buď případ (ověřený case tokenem), nebo e-mail zadaný uživatelem.
 */
export async function POST(req: Request) {
  if (!isCommercialIntentCaptureEnabled()) {
    return NextResponse.json({ error: 'Funkce není dostupná.' }, { status: 404 });
  }
  const json = await readFirstPartyJson(req, 8 * 1024);
  if (!json.ok) {
    const status = json.error === 'invalid_origin' ? 403 : json.error === 'payload_too_large' ? 413 : 400;
    return NextResponse.json({ error: 'Neplatný požadavek.' }, { status });
  }
  try {
    const limit = await takeRateLimit(`ratelimit:partner-intent:${getClientIp(req)}`, 5, 3600);
    if (!limit.allowed) return NextResponse.json({ error: 'Příliš mnoho požadavků.' }, { status: 429 });
  } catch {
    return NextResponse.json({ error: 'Službu nyní nelze bezpečně použít.' }, { status: 503 });
  }

  const body = json.data;
  if (body.withdraw === true) {
    const ok =
      typeof body.intentId === 'string' && typeof body.consentId === 'string' && typeof body.leadId === 'string'
        ? await withdrawCommercialIntent(body.intentId, body.consentId, body.leadId)
        : false;
    return NextResponse.json({ ok });
  }

  let subjectType: 'case' | 'email';
  let subjectValue: string;
  if (typeof body.caseId === 'string' && typeof body.token === 'string') {
    if (!isCaseIdFormat(body.caseId)) return NextResponse.json({ error: 'Neplatný případ.' }, { status: 403 });
    const access = await resolveCaseAccess(body.caseId, body.token);
    if (!access) return NextResponse.json({ error: 'Odkaz k zakázce je neplatný nebo vypršel.' }, { status: 403 });
    subjectType = 'case';
    subjectValue = body.caseId;
  } else if (typeof body.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) {
    subjectType = 'email';
    subjectValue = body.email.trim().toLowerCase();
  } else {
    return NextResponse.json({ error: 'Chybí identifikace žadatele.' }, { status: 400 });
  }

  const built = buildCommercialIntent({
    subjectType,
    subjectValue,
    category: body.category,
    requestedService: body.requestedService,
    urgency: body.urgency,
    budgetBand: body.budgetBand,
    broadLocation: body.broadLocation,
    contact: body.contact,
    partnerId: body.partnerId,
    purpose: body.purpose,
    fieldsShared: body.fieldsShared,
    consentTextVersion: body.consentTextVersion,
  });
  if (!built.ok) return NextResponse.json({ error: built.message, field: built.field }, { status: 400 });

  try {
    await persistCommercialIntent(built);
  } catch (error) {
    console.error('[partners] intent persist failed', error instanceof Error ? error.name : 'unknown');
    return NextResponse.json({ error: 'Poptávku se nepodařilo uložit. Zkuste to prosím znovu.' }, { status: 503 });
  }
  await recordAnalyticsEvent('commercial_intent_created', {
    source: subjectType === 'case' ? 'case_page' : 'form',
    surface: 'partner_engine',
    intent_category: built.intent.category,
    urgency: built.intent.urgency,
    budget_band: built.intent.budgetBand,
    partner_id: built.consent.partnerId,
  });
  await recordAnalyticsEvent('partner_consent_given', {
    source: subjectType === 'case' ? 'case_page' : 'form',
    surface: 'partner_engine',
    partner_id: built.consent.partnerId,
    intent_category: built.intent.category,
  });
  return NextResponse.json({
    ok: true,
    intentId: built.intent.id,
    consentId: built.consent.id,
    leadId: built.lead.id,
    leadStatus: built.lead.status,
    deliveryMethod: built.lead.deliveryMethod,
  });
}
