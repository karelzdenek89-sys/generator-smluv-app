import { redis } from '@/lib/redis';

const SUBSCRIBERS_SET_KEY = 'newsletter:subscribers';
const CONSENT_TTL_SECONDS = 60 * 60 * 24 * 1095;

export type SaveNewsletterSubscriberResult =
  | { ok: true; alreadySubscribed: boolean }
  | { ok: false; reason: 'storage_unavailable' };

/** Uloží přihlášení do Redis (primární úložiště, bez Resend). */
export async function saveNewsletterSubscriber(
  email: string,
  source: string,
  consentedAt: string,
): Promise<SaveNewsletterSubscriberResult> {
  try {
    const consentKey = `newsletter:consent:${email}`;
    const alreadySubscribed = (await redis.exists(consentKey)) === 1;
    await redis.set(
      consentKey,
      JSON.stringify({ source, consentedAt }),
      { ex: CONSENT_TTL_SECONDS },
    );

    try {
      await redis.srem(SUBSCRIBERS_SET_KEY, email);
    } catch (cleanupError) {
      console.warn('[newsletter] Legacy subscriber cleanup failed:', cleanupError);
    }

    return { ok: true, alreadySubscribed };
  } catch (err) {
    console.error('[newsletter] Redis save failed:', err);
    return { ok: false, reason: 'storage_unavailable' };
  }
}
