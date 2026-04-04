import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { redis } from '@/lib/redis';
import { stripe } from '@/lib/stripe';

export const runtime = 'nodejs';

const TTL_BASIC         = 60 * 60 * 24 * 7;   // 7 dní
const TTL_PROFESSIONAL  = 60 * 60 * 24 * 14;  // 14 dní pro Profesionální balíček
const TTL_COMPLETE      = 60 * 60 * 24 * 30;  // 30 dní pro Kompletní balíček

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET není nastaveno!');
    return NextResponse.json(
      { error: 'Missing STRIPE_WEBHOOK_SECRET.' },
      { status: 500 },
    );
  }

  try {
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header.' },
        { status: 400 },
      );
    }

    const rawBody = await req.text();

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // Idempotence: atomický SET NX — zabránění race condition při Stripe retry
      try {
        const dedupKey = `webhook:paid:${session.id}`;
        // SET NX vrátí 'OK' pokud klíč byl vytvořen, null pokud už existoval
        const acquired = await redis.set(dedupKey, '1', { ex: 60 * 60 * 24 * 3, nx: true });
        if (acquired === null) {
          console.log(`[webhook] Duplicate event for ${session.id} — skipping`);
          return NextResponse.json({ received: true });
        }
      } catch (dedupErr) {
        // Fail-open: Redis výpadek nesmí zablokovat zpracování platby
        console.warn('[webhook] Idempotency check fail-open:', dedupErr);
      }

      const draftId = session.metadata?.draftId;

      if (draftId) {
        const key = `contract:draft:${draftId}`;
        const existing = await redis.get<Record<string, unknown>>(key);

        if (existing) {
          const existingRecord = existing as Record<string, unknown>;
          const tierRaw = String(session.metadata?.tier ?? existingRecord.tier ?? 'basic').toLowerCase();
          // premium = legacy alias stejné cenové hladiny jako complete (viz checkout getPriceId)
          const tierForTtl =
            tierRaw === 'complete' || tierRaw === 'premium'
              ? 'complete'
              : tierRaw === 'professional'
                ? 'professional'
                : 'basic';
          const ttl =
            tierForTtl === 'complete'
              ? TTL_COMPLETE
              : tierForTtl === 'professional'
                ? TTL_PROFESSIONAL
                : TTL_BASIC;
          await redis.set(
            key,
            {
              ...existing,
              tier: tierForTtl,
              paid: true,
              paidAt: new Date().toISOString(),
              stripeSessionId: session.id,
              paymentStatus: session.payment_status,
              customerEmail: session.customer_email || (existing.email as string) || null,
            },
            { ex: ttl },
          );

          // Reverzní index: session_id → draftId (pro zákaznickou zónu)
          try {
            await redis.set(`session:draft:${session.id}`, draftId, { ex: TTL_COMPLETE });
          } catch (revErr) {
            console.warn('[webhook] Reverse index error (non-critical):', revErr);
          }

          // Indexovat session_id pod e-mailem zákazníka pro zákaznickou zónu (cross-device)
          const customerEmailForIndex = session.customer_email || (existing.email as string);
          if (customerEmailForIndex) {
            try {
              const emailKey = `orders:email:${customerEmailForIndex.toLowerCase().trim()}`;
              await redis.sadd(emailKey, session.id);
              await redis.expire(emailKey, TTL_COMPLETE); // index drží 30 dní
            } catch (indexErr) {
              console.warn('[webhook] Email index error (non-critical):', indexErr);
            }
          }

          // Povinné: odeslat e-mail zákazníkovi přes Resend
          const resendKey = process.env.RESEND_API_KEY;
          if (!resendKey) {
            console.error('[webhook] KRITICKÁ CHYBA: RESEND_API_KEY není nastaveno — potvrzovací e-mail NEBYL odeslán zákazníkovi!');
          }
          const customerEmail = session.customer_email || (existing.email as string);
          if (!customerEmail) {
            console.error(`[webhook] KRITICKÁ CHYBA: zákazník nemá e-mail (session ${session.id}) — potvrzovací e-mail NEBYL odeslán!`);
          }
          if (resendKey && customerEmail) {
            await sendDownloadEmail(
              resendKey,
              customerEmail,
              session.id,
              session.metadata?.contractType || 'dokument',
              process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz',
              tierForTtl,
            ).catch((err) => console.error('[webhook] E-mail error:', err));
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook verification failed.' },
      { status: 400 },
    );
  }
}

async function sendDownloadEmail(
  apiKey: string,
  to: string,
  sessionId: string,
  contractType: string,
  baseUrl: string,
  tier: string = 'basic',
): Promise<void> {
  const contractNames: Record<string, string> = {
    lease: 'Nájemní smlouva',
    car_sale: 'Kupní smlouva na vozidlo',
    gift: 'Darovací smlouva',
    work_contract: 'Smlouva o dílo',
    loan: 'Smlouva o zápůjčce',
    nda: 'Smlouva o mlčenlivosti (NDA)',
    general_sale: 'Kupní smlouva',
    employment: 'Pracovní smlouva',
    dpp: 'Dohoda o provedení práce',
    service: 'Smlouva o poskytování služeb',
    sublease: 'Podnájemní smlouva',
    power_of_attorney: 'Plná moc',
    debt_acknowledgment: 'Uznání dluhu',
    cooperation: 'Smlouva o spolupráci',
  };

  const contractName = contractNames[contractType] || 'Právní dokument';
  const downloadUrl = `${baseUrl}/api/contracts/download?session_id=${sessionId}`;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'SmlouvaHned <dokumenty@smlouvahned.cz>',
      to: [to],
      subject: `Váš dokument je připraven ke stažení — ${contractName}`,
      html: `
        <!DOCTYPE html>
        <html lang="cs">
        <head><meta charset="UTF-8"><title>Váš dokument SmlouvaHned</title></head>
        <body style="background:#05080f;font-family:Arial,sans-serif;color:#e2e8f0;padding:40px 20px;margin:0;">
          <div style="max-width:580px;margin:0 auto;background:#0c1426;border-radius:24px;border:1px solid #1e2940;padding:40px;">
            <div style="text-align:center;margin-bottom:32px;">
              <div style="display:inline-block;background:#f59e0b;color:#000;font-weight:900;font-size:18px;padding:10px 18px;border-radius:12px;letter-spacing:-0.5px;">
                SmlouvaHned
              </div>
            </div>
            <h1 style="color:#fff;font-size:26px;font-weight:900;margin:0 0 12px;text-align:center;">
              Platba přijata — dokument je připraven
            </h1>
            <p style="color:#94a3b8;font-size:15px;text-align:center;margin-bottom:8px;">
              ${contractName} je připravena ke stažení.
            </p>
            <p style="color:#64748b;font-size:13px;text-align:center;margin-bottom:32px;">
              Před podpisem zkontrolujte, prosím, všechny vyplněné údaje.
            </p>
            <a href="${downloadUrl}"
               style="display:block;text-align:center;background:linear-gradient(135deg,#f59e0b,#eab308);color:#000;font-weight:900;font-size:18px;padding:18px 32px;border-radius:16px;text-decoration:none;margin-bottom:24px;letter-spacing:-0.3px;">
              Stáhnout PDF dokument
            </a>
            <p style="color:#64748b;font-size:12px;text-align:center;margin:0;">
              Odkaz ke stažení je platný ${tier === 'complete' ? '30 dní' : tier === 'professional' ? '14 dní' : '7 dní'} od zaplacení.<br>
              V případě dotazů nás kontaktujte na <a href="mailto:info@smlouvahned.cz" style="color:#f59e0b;">info@smlouvahned.cz</a>
            </p>
          </div>
          <p style="color:#334155;font-size:11px;text-align:center;margin-top:24px;">
            © 2026 SmlouvaHned · IČO: 23660295 · SmlouvaHned není advokátní kancelář a neposkytuje právní poradenství.
          </p>
        </body>
        </html>
      `,
    }),
  });
}
