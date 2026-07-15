import { createHash, randomBytes } from 'node:crypto';
import { redis } from '@/lib/redis';

const PENDING_TTL_SECONDS = 60 * 60 * 24;
export const NEWSLETTER_CONSENT_VERSION = 'newsletter-v1-2026-07-15';
export const NEWSLETTER_PRIVACY_VERSION = '2026-07-15';

type PendingNewsletterSubscription = {
  email: string;
  source: string;
  requestedAt: string;
  consentVersion: string;
  privacyVersion: string;
};

export type SaveNewsletterSubscriberResult =
  | { ok: true; alreadySubscribed: boolean }
  | { ok: false; reason: 'storage_unavailable' };

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export async function createNewsletterConfirmation(
  email: string,
  source: string,
  requestedAt: string,
): Promise<{ token: string; alreadySubscribed: boolean }> {
  const consentKey = `newsletter:consent:${email}`;
  const alreadySubscribed = (await redis.exists(consentKey)) === 1;
  const token = randomBytes(32).toString('hex');
  const pending: PendingNewsletterSubscription = {
    email,
    source,
    requestedAt,
    consentVersion: NEWSLETTER_CONSENT_VERSION,
    privacyVersion: NEWSLETTER_PRIVACY_VERSION,
  };
  await redis.set(
    `newsletter:pending:${hashToken(token)}`,
    pending,
    { ex: PENDING_TTL_SECONDS },
  );
  return { token, alreadySubscribed };
}

export async function getNewsletterConfirmation(
  token: string,
): Promise<PendingNewsletterSubscription | null> {
  const key = `newsletter:pending:${hashToken(token)}`;
  return redis.get<PendingNewsletterSubscription>(key);
}

export async function completeNewsletterConfirmation(token: string): Promise<void> {
  await redis.del(`newsletter:pending:${hashToken(token)}`);
}

/** Uchová důkaz potvrzeného souhlasu po dobu odběru; maže se při odhlášení. */
export async function saveNewsletterSubscriber(
  pending: PendingNewsletterSubscription,
  confirmedAt: string,
): Promise<SaveNewsletterSubscriberResult> {
  try {
    const consentKey = `newsletter:consent:${pending.email}`;
    const alreadySubscribed = (await redis.exists(consentKey)) === 1;
    await redis.set(consentKey, {
      email: pending.email,
      source: pending.source,
      requestedAt: pending.requestedAt,
      confirmedAt,
      consentVersion: pending.consentVersion,
      privacyVersion: pending.privacyVersion,
      confirmationMethod: 'double-opt-in',
    });
    return { ok: true, alreadySubscribed };
  } catch (error) {
    console.error('[newsletter] Redis save failed:', error);
    return { ok: false, reason: 'storage_unavailable' };
  }
}
