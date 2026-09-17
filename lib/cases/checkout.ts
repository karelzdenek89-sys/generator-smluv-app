import { stripe } from '@/lib/stripe';
import { SITE_URL } from '@/lib/seo/site';
import {
  CHECKOUT_CONSENT_TEXT_VERSION,
  CHECKOUT_PRIVACY_VERSION,
  CHECKOUT_TERMS_VERSION,
} from '@/lib/checkout-authorization';
import { issueCaseAccessToken } from './access';
import { CASE_DOCUMENT_PRICE_CZK } from './documents';
import { CASE_PAGE_PATH } from './emails';
import { mapDocumentSession, saveCase } from './store';
import type { CaseDocument, CaseRecord } from './types';

/** Token pro návrat z platební brány — krátká platnost, samostatně revokovatelný. */
export const RETURN_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

export function isCaseDocumentConsentValid(candidate: unknown, now: number = Date.now()): boolean {
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return false;
  const consent = candidate as Record<string, unknown>;
  const acceptedAtMs = Date.parse(typeof consent.acceptedAt === 'string' ? consent.acceptedAt : '');
  return (
    consent.accepted === true &&
    consent.termsVersion === CHECKOUT_TERMS_VERSION &&
    consent.privacyVersion === CHECKOUT_PRIVACY_VERSION &&
    consent.textVersion === CHECKOUT_CONSENT_TEXT_VERSION &&
    Number.isFinite(acceptedAtMs) &&
    acceptedAtMs <= now + 5 * 60_000 &&
    acceptedAtMs >= now - 24 * 60 * 60_000
  );
}

/**
 * Stripe Checkout Session pro navazující dokument (99 Kč). Metadata
 * `kind: case_document` odliší platbu od objednávek smluv ve webhooku.
 */
export async function createCaseDocumentCheckout(
  record: CaseRecord,
  document: CaseDocument,
  ownerEmail: string,
): Promise<{ record: CaseRecord; url: string }> {
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || SITE_URL).replace(/\/+$/, '');
  const returnToken = await issueCaseAccessToken(record.id, ownerEmail, RETURN_TOKEN_TTL_SECONDS);
  const returnFragment = `#access=${encodeURIComponent(returnToken)}`;
  const caseQuery = `id=${encodeURIComponent(record.id)}&doc=${encodeURIComponent(document.id)}`;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: ownerEmail,
    locale: 'cs',
    line_items: [
      {
        price_data: {
          currency: 'czk',
          unit_amount: CASE_DOCUMENT_PRICE_CZK * 100,
          product_data: {
            name: document.title,
            description: `Navazující dokument k zakázce „${record.title.slice(0, 80)}“ — SmlouvaHned.cz`,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}${CASE_PAGE_PATH}?${caseQuery}&paid=1${returnFragment}`,
    cancel_url: `${baseUrl}${CASE_PAGE_PATH}?${caseQuery}&cancelled=1${returnFragment}`,
    metadata: {
      kind: 'case_document',
      caseId: record.id,
      documentId: document.id,
      documentKind: document.kind,
      consentTextVersion: CHECKOUT_CONSENT_TEXT_VERSION,
      consentTermsVersion: CHECKOUT_TERMS_VERSION,
    },
  });
  if (!session.url) throw new Error('Stripe did not return a checkout URL.');

  await mapDocumentSession(session.id, record.id, document.id);
  const next = await saveCase({
    ...record,
    documents: record.documents.map((item) =>
      item.id === document.id ? { ...item, stripeSessionId: session.id } : item,
    ),
  });
  return { record: next, url: session.url };
}
