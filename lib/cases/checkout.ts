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
  const current = (await getCase(stale.id)) ?? stale;
  const document = findDocument(current, staleDocument.id) ?? staleDocument;
  if (document.status === 'ready') return { status: 'ready', record: current };

  // 2) Existující session: zaplacená → označit; otevřená → vrátit znovu.
  if (document.stripeSessionId) {
    const existing = await client.checkout.sessions.retrieve(document.stripeSessionId).catch(() => null);
    if (existing && caseDocumentSessionMatches(existing, current.id, document.id)) {
      if (existing.payment_status === 'paid') {
        const paid = await markCaseDocumentPaid(current.id, document.id, existing.id);
        return { status: 'ready', record: paid ?? current };
      }
      const expiresAtMs = typeof existing.expires_at === 'number' ? existing.expires_at * 1000 : 0;
      if (existing.status === 'open' && existing.url && expiresAtMs > Date.now() + 60_000) {
        return { status: 'open', record: current, url: existing.url, reused: true };
      }
      if (existing.status === 'open') {
        await client.checkout.sessions.expire(existing.id).catch(() => undefined);
      }
    }
  }

  // 3) Nová session pro další pokus; pořadí pokusu je součástí idempotency key.
  const attempt = (document.checkoutAttempts ?? 0) + 1;
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || SITE_URL).replace(/\/+$/, '');
  const caseQuery = `id=${encodeURIComponent(current.id)}&doc=${encodeURIComponent(document.id)}`;
  const session = await client.checkout.sessions.create(
    {
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
    },
    { idempotencyKey: `case-doc:${document.id}:${attempt}` },
  );
  if (!session.url) throw new Error('Stripe did not return a checkout URL.');

  await mapDocumentSession(session.id, current.id, document.id);
  const next = await commitCase(current.id, (fresh) => ({
    ...fresh,
    documents: fresh.documents.map((item) =>
      item.id === document.id ? { ...item, stripeSessionId: session.id, checkoutAttempts: attempt } : item,
    ),
  }));
  return { status: 'open', record: next ?? current, url: session.url, reused: false };
}
