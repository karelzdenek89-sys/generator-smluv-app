/**
 * Transakční e-maily portálu (návratové odkazy, připomínky).
 *
 * Odesílatel je stejný jako u doručení dokumentů — doména ověřená v Resendu.
 * Funkce nikdy nevyhazuje: síťová chyba se vrací jako `{ ok: false }` a volající
 * rozhodne, zda je pro daný krok kritická. Do logu se nikdy nezapisuje
 * příjemce ani obsah, pouze status a typ chyby.
 */

export const TRANSACTIONAL_EMAIL_FROM = 'SmlouvaHned <dokumenty@planstavby.cz>';

export type TransactionalEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  idempotencyKey: string;
};

export type TransactionalEmailResult =
  | { ok: true; id: string | null }
  | { ok: false; reason: 'missing_api_key' | 'provider_error' | 'network_error'; status?: number };

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function isTransactionalEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export async function sendTransactionalEmail(input: TransactionalEmailInput): Promise<TransactionalEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return { ok: false, reason: 'missing_api_key' };

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': input.idempotencyKey,
      },
      body: JSON.stringify({
        from: TRANSACTIONAL_EMAIL_FROM,
        to: [input.to],
        subject: input.subject,
        html: input.html,
        ...(input.text ? { text: input.text } : {}),
      }),
    });
    if (!response.ok) {
      console.error(`[email] provider error status=${response.status} key=${input.idempotencyKey.split('-')[0]}`);
      return { ok: false, reason: 'provider_error', status: response.status };
    }
    const body = (await response.json().catch(() => null)) as { id?: string } | null;
    return { ok: true, id: body?.id ?? null };
  } catch (error) {
    console.error('[email] network error', error instanceof Error ? error.name : 'unknown');
    return { ok: false, reason: 'network_error' };
  }
}

/** Jednoduchá tmavá šablona odpovídající doručovacím e-mailům. */
export function renderEmailShell(options: {
  heading: string;
  intro: string;
  ctaLabel: string;
  ctaUrl: string;
  footerNote: string;
  secondary?: string;
}): string {
  const heading = escapeHtml(options.heading);
  const intro = escapeHtml(options.intro);
  const ctaLabel = escapeHtml(options.ctaLabel);
  const ctaUrl = escapeHtml(options.ctaUrl);
  const footerNote = escapeHtml(options.footerNote);
  const secondary = options.secondary ? `<p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 24px;">${escapeHtml(options.secondary)}</p>` : '';
  return `<!DOCTYPE html>
<html lang="cs">
<head><meta charset="UTF-8"><title>${heading}</title></head>
<body style="background:#05080f;font-family:Arial,sans-serif;color:#e2e8f0;padding:40px 20px;margin:0;">
  <div style="max-width:580px;margin:0 auto;background:#0c1426;border-radius:24px;border:1px solid #1e2940;padding:40px;">
    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-block;background:#c9a852;color:#07111e;font-weight:900;font-size:18px;padding:10px 18px;border-radius:12px;">SmlouvaHned</div>
    </div>
    <h1 style="color:#fff;font-size:24px;font-weight:800;margin:0 0 12px;text-align:center;">${heading}</h1>
    <p style="color:#94a3b8;font-size:15px;line-height:1.6;text-align:center;margin:0 0 28px;">${intro}</p>
    ${secondary}
    <a href="${ctaUrl}" style="display:block;text-align:center;background:#c9a852;color:#07111e;font-weight:800;font-size:16px;padding:16px 28px;border-radius:14px;text-decoration:none;margin-bottom:20px;">${ctaLabel}</a>
    <p style="color:#64748b;font-size:12px;line-height:1.6;text-align:center;margin:0;">${footerNote}</p>
  </div>
  <p style="color:#334155;font-size:11px;text-align:center;margin-top:24px;">SmlouvaHned.cz je softwarový nástroj pro tvorbu standardizovaných dokumentů. Neposkytuje právní poradenství.</p>
</body>
</html>`;
}
