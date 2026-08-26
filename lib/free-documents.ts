import { timingSafeEqual } from 'node:crypto';
import type { CheckoutConsent } from '@/lib/checkout-authorization';
import type { CheckoutAnalyticsAttribution } from '@/lib/analytics-attribution';
import {
  CHECKOUT_CONSENT_TEXT_VERSION,
  CHECKOUT_PRIVACY_VERSION,
  CHECKOUT_TERMS_VERSION,
} from '@/lib/checkout-authorization';
import type { StoredContractData } from '@/lib/contracts';
import type { PublicMonetizationPolicy } from '@/lib/monetization-policy';
import type { PartnerContext } from '@/lib/partners/types';

export const FREE_DOCUMENT_TTL_SECONDS = 24 * 60 * 60;

export type FreeDocumentRecord = {
  freeId: string;
  contractType: StoredContractData['contractType'];
  tier: 'basic';
  lang: 'cs' | 'en' | 'ua';
  payload: StoredContractData;
  consent: CheckoutConsent;
  policy: PublicMonetizationPolicy;
  downloadToken: string;
  partnerContext: PartnerContext | null;
  partnerAttributionId: string;
  analyticsConsentGranted?: boolean;
  analyticsAttribution?: CheckoutAnalyticsAttribution;
  createdAt: string;
  expiresAt: string;
  downloadCount: number;
};

export function validateCurrentCheckoutConsent(value: unknown, now = Date.now()): CheckoutConsent | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const candidate = value as Record<string, unknown>;
  const acceptedAt = typeof candidate.acceptedAt === 'string' ? candidate.acceptedAt : '';
  const acceptedAtMs = Date.parse(acceptedAt);
  if (
    candidate.accepted !== true
    || candidate.termsVersion !== CHECKOUT_TERMS_VERSION
    || candidate.privacyVersion !== CHECKOUT_PRIVACY_VERSION
    || candidate.textVersion !== CHECKOUT_CONSENT_TEXT_VERSION
    || !Number.isFinite(acceptedAtMs)
    || acceptedAtMs > now + 5 * 60_000
    || acceptedAtMs < now - 24 * 60 * 60_000
  ) return null;
  return {
    accepted: true,
    acceptedAt: new Date(now).toISOString(),
    termsVersion: CHECKOUT_TERMS_VERSION,
    privacyVersion: CHECKOUT_PRIVACY_VERSION,
    textVersion: CHECKOUT_CONSENT_TEXT_VERSION,
  };
}

export function freeDocumentTokenMatches(stored: string, provided: string): boolean {
  if (!stored || !provided) return false;
  const left = Buffer.from(stored);
  const right = Buffer.from(provided);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function freeDocumentKey(freeId: string): string {
  return `contract:free:${freeId}`;
}
