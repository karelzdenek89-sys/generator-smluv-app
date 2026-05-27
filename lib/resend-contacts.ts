export type NewsletterSubscribeInput = {
  email: string;
  source: string;
  consentedAt: string;
};

export type NewsletterSubscribeResult =
  | { ok: true; segmentAssigned: boolean }
  | { ok: false; reason: 'missing_api_key' | 'api_error'; status?: number; body?: string };

function newsletterSegmentId(): string | undefined {
  return (
    process.env.RESEND_NEWSLETTER_SEGMENT_ID?.trim() ||
    process.env.RESEND_AUDIENCE_ID?.trim() ||
    undefined
  );
}

async function resendFetch(
  apiKey: string,
  path: string,
  init?: RequestInit,
): Promise<Response> {
  return fetch(`https://api.resend.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
}

async function addContactToSegment(
  apiKey: string,
  email: string,
  segmentId: string,
): Promise<boolean> {
  const encodedEmail = encodeURIComponent(email);
  const response = await resendFetch(
    apiKey,
    `/contacts/${encodedEmail}/segments/${segmentId}`,
    { method: 'POST' },
  );
  return response.ok || response.status === 409;
}

/** Přidá kontakt do Resend (volitelně do segmentu). Vyžaduje RESEND_API_KEY. */
export async function subscribeNewsletterContact(
  input: NewsletterSubscribeInput,
): Promise<NewsletterSubscribeResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const segmentId = newsletterSegmentId();

  if (!apiKey) {
    return { ok: false, reason: 'missing_api_key' };
  }

  const createBody: Record<string, unknown> = {
    email: input.email,
    unsubscribed: false,
  };
  if (segmentId) {
    createBody.segments = [{ id: segmentId }];
  }

  const createResponse = await resendFetch(apiKey, '/contacts', {
    method: 'POST',
    body: JSON.stringify(createBody),
  });

  if (createResponse.ok) {
    return { ok: true, segmentAssigned: Boolean(segmentId) };
  }

  if (createResponse.status === 409) {
    if (segmentId) {
      const added = await addContactToSegment(apiKey, input.email, segmentId);
      return { ok: true, segmentAssigned: added };
    }
    return { ok: true, segmentAssigned: false };
  }

  // Neplatný segment ID — kontakt bez segmentu je lepší než selhání pro uživatele.
  if (segmentId && createResponse.status === 422) {
    const body = await createResponse.text().catch(() => '');
    if (/segment/i.test(body)) {
      console.warn('[newsletter] Invalid segment ID, creating contact without segment:', body.slice(0, 200));
      const fallback = await resendFetch(apiKey, '/contacts', {
        method: 'POST',
        body: JSON.stringify({ email: input.email, unsubscribed: false }),
      });
      if (fallback.ok || fallback.status === 409) {
        return { ok: true, segmentAssigned: false };
      }
    }
  }

  const body = await createResponse.text().catch(() => '');
  return { ok: false, reason: 'api_error', status: createResponse.status, body: body.slice(0, 500) };
}
