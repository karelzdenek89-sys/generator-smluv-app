import type { PartnerContext } from './types';

export const PARTNER_LEAD_CONSENT_VERSION = '2026-08-13.1';
export const PARTNER_LEAD_FIELDS = ['contact_name', 'email', 'phone'] as const;
export type PartnerLeadField = (typeof PARTNER_LEAD_FIELDS)[number];

export type PartnerLeadConsent = {
  partnerId: string;
  purpose: string;
  fields: readonly PartnerLeadField[];
  grantedAt: string;
  consentVersion: typeof PARTNER_LEAD_CONSENT_VERSION;
};

export type PartnerLeadAdapter = {
  partnerId: string;
  allowedFields: readonly PartnerLeadField[];
  credentialsConfigured: () => boolean;
  timeoutMs: number;
  submit: (payload: {
    consent: PartnerLeadConsent;
    context: PartnerContext;
    contact: Partial<Record<PartnerLeadField, string>>;
    idempotencyKey: string;
  }) => Promise<void>;
};

export function createPartnerLeadConsent(input: {
  partnerId: string;
  purpose: string;
  fields: readonly PartnerLeadField[];
  grantedAt?: Date;
}): PartnerLeadConsent {
  const fields = [...new Set(input.fields)].filter((field) => PARTNER_LEAD_FIELDS.includes(field));
  if (!input.partnerId.trim() || !input.purpose.trim() || fields.length === 0) {
    throw new Error('invalid_partner_lead_consent');
  }
  return {
    partnerId: input.partnerId.trim(),
    purpose: input.purpose.trim(),
    fields,
    grantedAt: (input.grantedAt ?? new Date()).toISOString(),
    consentVersion: PARTNER_LEAD_CONSENT_VERSION,
  };
}

/**
 * Prepared server-side delivery boundary. There is intentionally no public API
 * route and no active adapter until a reviewed partner contract and credentials exist.
 */
export async function tryDeliverPartnerLead(input: {
  adapter: PartnerLeadAdapter;
  consent: PartnerLeadConsent;
  context: PartnerContext;
  contact: Partial<Record<PartnerLeadField, string>>;
  idempotencyKey: string;
}): Promise<{ ok: true } | { ok: false; reason: 'consent_invalid' | 'not_configured' | 'provider_failed' }> {
  const { adapter, consent, context } = input;
  if (consent.partnerId !== adapter.partnerId
    || consent.consentVersion !== PARTNER_LEAD_CONSENT_VERSION
    || consent.fields.some((field) => !adapter.allowedFields.includes(field))) {
    return { ok: false, reason: 'consent_invalid' };
  }
  if (!adapter.credentialsConfigured()) return { ok: false, reason: 'not_configured' };
  if (!/^[a-zA-Z0-9_-]{16,128}$/.test(input.idempotencyKey)) {
    return { ok: false, reason: 'consent_invalid' };
  }
  const contact = Object.fromEntries(
    consent.fields
      .map((field) => [field, input.contact[field]?.trim()] as const)
      .filter((entry): entry is readonly [PartnerLeadField, string] => Boolean(entry[1])),
  );
  try {
    await Promise.race([
      adapter.submit({ consent, context, contact, idempotencyKey: input.idempotencyKey }),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('partner_timeout')), Math.min(Math.max(adapter.timeoutMs, 500), 10_000));
      }),
    ]);
    return { ok: true };
  } catch {
    return { ok: false, reason: 'provider_failed' };
  }
}
