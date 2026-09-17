import type Stripe from 'stripe';
import { randomUUID } from 'node:crypto';
import { redis } from '@/lib/redis';
import { stripe } from '@/lib/stripe';
import { SITE_URL } from '@/lib/seo/site';
import {
  CHECKOUT_CONSENT_TEXT_VERSION,
  CHECKOUT_PRIVACY_VERSION,
  CHECKOUT_TERMS_VERSION,
} from '@/lib/checkout-authorization';
import { CASE_DOCUMENT_PRICE_CZK } from './documents';
import { CASE_PAGE_PATH } from './emails';
import { markCaseDocumentPaid } from './service';
import { commitCase, findDocument, getCase, mapDocumentSession } from './store';
import type { CaseDocument, CaseRecord } from './types';

const CHECKOUT_LOCK_TTL_SECONDS = 30;
const RELEASE_LOCK_IF_OWNER = `
if redis.call('GET', KEYS[1]) == ARGV[1] then
  return redis.call('DEL', KEYS[1])
end
return 0
`;

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

/** Podmnožina Stripe klienta, kterou checkout potřebuje (testy ji stubují). */
export type CaseCheckoutStripe = {
  checkout: {
    sessions: {
      create: (
        params: Stripe.Checkout.SessionCreateParams,
        options?: Stripe.RequestOptions,
      ) => Promise<Pick<Stripe.Checkout.Session, 'id' | 'url' | 'status' | 'payment_status' | 'metadata'>>;
      retrieve: (id: string) => Promise<Pick<Stripe.Checkout.Session, 'id' | 'url' | 'status' | 'payment_status' | 'metadata' | 'expires_at'>>;
      expire: (id: string) => Promise<unknown>;
    };
  };
};

export type CaseDocumentCheckoutResult =
  | { status: 'ready'; record: CaseRecord }
  | { status: 'open'; record: CaseRecord; url: string; reused: boolean };

export function caseDocumentSessionMatches(
  session: Pick<Stripe.Checkout.Session, 'metadata'>,
  caseId: string,
  documentId: string,
): boolean {
  return (
    session.metadata?.kind === 'case_document' &&
    session.metadata?.caseId === caseId &&
    session.metadata?.documentId === documentId
  );
}

/**
 * Stripe Checkout Session pro navazující dokument (99 Kč).
 *
 * Pravidla proti dvojí platbě:
 *  - zámek na dokument: dvě karty nezaloží dvě session současně;
 *  - stav se ověřuje nad čerstvým záznamem (dokument už mohl být zaplacen);
 *  - existující otevřená session se vrací znovu, nová se nezakládá;
 *  - zaplacená session, o které ještě neví webhook, dokument rovnou označí;
 *  - nová session vzniká jen místo prošlé; předchozí otevřená se před tím
 *    zneplatní a Stripe dostane idempotency key vázaný na pořadí pokusu.
 *
 * Návratová URL nese jen id zakázky, dokumentu a `session_id`; přístupový
 * token zůstává v sessionStorage prohlížeče (lib/cases/client-access.ts).
 * Tím jsou parametry pro daný pokus stabilní a idempotency key platí i pro
 * opakovaný požadavek po výpadku mezi Stripe a naším zápisem.
 */
export async function createCaseDocumentCheckout(
  record: CaseRecord,
  document: CaseDocument,
  ownerEmail: string,
  client: CaseCheckoutStripe = stripe as unknown as CaseCheckoutStripe,
): Promise<CaseDocumentCheckoutResult> {
  const lockKey = `lock:case-doc-checkout:${document.id}`;
  const lockToken = randomUUID();
  const locked = await redis.set(lockKey, lockToken, { ex: CHECKOUT_LOCK_TTL_SECONDS, nx: true });
  if (locked === null) throw new Error('checkout_locked');
  try {
    return await createCaseDocumentCheckoutLocked(record, document, ownerEmail, client);
  } finally {
    await redis.eval(RELEASE_LOCK_IF_OWNER, [lockKey], [lockToken]).catch(() => undefined);
  }
}

async function createCaseDocumentCheckoutLocked(
  stale: CaseRecord,
  staleDocument: CaseDocument,
  ownerEmail: string,
  client: CaseCheckoutStripe,
): Promise<CaseDocumentCheckoutResult> {
  // 1) Čerstvý stav: mezitím mohl dorazit webhook nebo druhá karta.
  const current = await getCase(stale.id);
  if (!current) throw new Error('case_not_found');
  const document = findDocument(current, staleDocument.id);
  if (!document) throw new Error('document_not_found');
  if (document.status === 'ready') return { status: 'ready', record: current };

  // 2) Existující session: zaplacená → označit; otevřená → vrátit znovu.
  if (document.stripeSessionId) {
    // Unknown Stripe state is never permission to charge again.
    const existing = await client.checkout.sessions.retrieve(document.stripeSessionId);
    if (!caseDocumentSessionMatches(existing, current.id, document.id)) throw new Error('session_mismatch');
    {
      if (existing.payment_status === 'paid') {
        const paid = await markCaseDocumentPaid(current.id, document.id, existing.id);
        return { status: 'ready', record: paid ?? current };
      }
      const expiresAtMs = typeof existing.expires_at === 'number' ? existing.expires_at * 1000 : 0;
      if (existing.status === 'open' && existing.url && expiresAtMs > Date.now() + 60_000) {
        return { status: 'open', record: current, url: existing.url, reused: true };
      }
      if (existing.status === 'open') {
        await client.checkout.sessions.expire(existing.id);
        const expired = await client.checkout.sessions.retrieve(existing.id);
        if (expired.payment_status === 'paid') {
          const paid = await markCaseDocumentPaid(current.id, document.id, existing.id);
          return { status: 'ready', record: paid ?? current };
        }
        if (expired.status !== 'expired') throw new Error('session_not_expired');
      } else if (existing.status !== 'expired') {
        // Completed asynchronous payments must settle before another attempt.
        throw new Error('payment_processing');
      }
    }
  }

  // 3) Nová session pro další pokus; pořadí pokusu je součástí idempotency key.
  const attempt = (document.checkoutAttempts ?? 0) + 1;
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || SITE_URL).replace(/\/+$/, '');
  const caseQuery = `id=${encodeURIComponent(current.id)}&doc=${encodeURIComponent(document.id)}`;
  const params: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      customer_email: ownerEmail,
      locale: 'cs',
      // A lost Stripe response must never become a fresh charge after the
      // provider's idempotency retention window. These exact params persist.
      expires_at: Math.floor(Date.now() / 1000) + 23 * 60 * 60,
      line_items: [
        {
          price_data: {
            currency: 'czk',
            unit_amount: CASE_DOCUMENT_PRICE_CZK * 100,
            product_data: {
              name: document.title,
              description: `Navazující dokument k zakázce „${current.title.slice(0, 80)}“ — SmlouvaHned.cz`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}${CASE_PAGE_PATH}?${caseQuery}&paid=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}${CASE_PAGE_PATH}?${caseQuery}&cancelled=1`,
      metadata: {
        kind: 'case_document',
        caseId: current.id,
        documentId: document.id,
        documentKind: document.kind,
        attempt: String(attempt),
        consentTextVersion: CHECKOUT_CONSENT_TEXT_VERSION,
        consentTermsVersion: CHECKOUT_TERMS_VERSION,
      },
    };
  const intent = await commitCase(current.id, (fresh) => ({
    ...fresh,
    documents: fresh.documents.map((item) => {
      if (item.id !== document.id) return item;
      if (item.status === 'ready') throw new Error('document_already_paid');
      // Reuse an unresolved request even if the previous process died or its lock expired.
      if (item.checkoutRequest && item.checkoutRequest.attempt > (item.checkoutAttempts ?? 0)) return item;
      return { ...item, checkoutRequest: { attempt, params } };
    }),
  }));
  const request = intent && findDocument(intent, document.id)?.checkoutRequest;
  if (!request) throw new Error('document_not_found');
  const session = await client.checkout.sessions.create(request.params, {
    idempotencyKey: `case-doc:${document.id}:${request.attempt}`,
  });
  if (!caseDocumentSessionMatches(session, current.id, document.id)) throw new Error('session_mismatch');
  await mapDocumentSession(session.id, current.id, document.id);
  const next = await commitCase(current.id, (fresh) => ({
    ...fresh,
    documents: fresh.documents.map((item) =>
      item.id === document.id ? { ...item, stripeSessionId: session.id, checkoutAttempts: request.attempt, checkoutRequest: null } : item,
    ),
  }));
  if (!next || !findDocument(next, document.id)) {
    await client.checkout.sessions.expire(session.id);
    throw new Error('document_not_found');
  }
  if (findDocument(next, document.id)?.status === 'ready') return { status: 'ready', record: next };
  // An idempotent retry can return a session already paid or expired in Stripe.
  if (session.payment_status === 'paid') {
    const paid = await markCaseDocumentPaid(current.id, document.id, session.id);
    if (!paid) throw new Error('case_not_found');
    return { status: 'ready', record: paid };
  }
  if (session.status !== 'open') throw new Error('session_not_open');
  if (!session.url) throw new Error('Stripe did not return a checkout URL.');
  return { status: 'open', record: next, url: session.url, reused: false };
}
