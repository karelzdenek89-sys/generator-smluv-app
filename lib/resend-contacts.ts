export type NewsletterSubscribeInput = {
  email: string;
  source: string;
  consentedAt: string;
};

export type NewsletterSubscribeResult =
  | { ok: true }
  | { ok: false; reason: 'missing_config' | 'api_error'; status?: number; body?: string };

function newsletterSegmentId(): string | undefined {
  return (
    process.env.RESEND_NEWSLETTER_SEGMENT_ID?.trim() ||
    process.env.RESEND_AUDIENCE_ID?.trim() ||
    undefined
  );
}

/** Přidá kontakt do Resend segmentu pro newsletter (vyžaduje výslovný souhlas na straně volajícího). */
export async function subscribeNewsletterContact(
  input: NewsletterSubscribeInput,
): Promise<NewsletterSubscribeResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const segmentId = newsletterSegmentId();

  if (!apiKey || !segmentId) {
    return { ok: false, reason: 'missing_config' };
  }

  const response = await fetch('https://api.resend.com/contacts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: input.email,
      unsubscribed: false,
      segments: [{ id: segmentId }],
      properties: {
        newsletter_source: input.source,
        newsletter_consent_at: input.consentedAt,
      },
    }),
  });

  if (response.ok) {
    return { ok: true };
  }

  // Již existující kontakt — vracíme úspěch (bez enumerace e-mailů).
  if (response.status === 409) {
    return { ok: true };
  }

  const body = await response.text().catch(() => '');
  return { ok: false, reason: 'api_error', status: response.status, body: body.slice(0, 500) };
}
