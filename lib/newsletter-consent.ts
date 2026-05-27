import { redis } from '@/lib/redis';

const CONSENT_TTL_SECONDS = 60 * 60 * 24 * 1095; // 3 roky — auditní stopa souhlasu

export async function recordNewsletterConsent(
  email: string,
  source: string,
  consentedAt: string,
): Promise<void> {
  try {
    const key = `newsletter:consent:${email}`;
    await redis.set(
      key,
      JSON.stringify({ source, consentedAt }),
      { ex: CONSENT_TTL_SECONDS },
    );
  } catch (err) {
    console.warn('[newsletter] Consent audit log fail-open:', err);
  }
}
