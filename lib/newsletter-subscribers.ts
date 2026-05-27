import { redis } from '@/lib/redis';

const SUBSCRIBERS_SET_KEY = 'newsletter:subscribers';

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
    const wasNew = await redis.sadd(SUBSCRIBERS_SET_KEY, email);
    await redis.set(
      `newsletter:consent:${email}`,
      JSON.stringify({ source, consentedAt }),
      { ex: 60 * 60 * 24 * 1095 },
    );
    return { ok: true, alreadySubscribed: wasNew === 0 };
  } catch (err) {
    console.error('[newsletter] Redis save failed:', err);
    return { ok: false, reason: 'storage_unavailable' };
  }
}
