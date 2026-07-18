import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { redis } from '@/lib/redis';
import { stripe } from '@/lib/stripe';
import { ensurePortalAccessToken } from '@/lib/orders-portal';
import {
  CHECKOUT_ADDON_CONFIG,
  getArchiveDaysWithAddons,
  getCheckoutAddonsTotalCzk,
  normalizeStoredCheckoutAddons,
  type CheckoutAddonKey,
} from '@/lib/checkout-addons';
import { normalizePricingTier } from '@/lib/pricing';
import { recordAnalyticsEvent } from '@/lib/analytics-server';
import type { AnalyticsEventParams } from '@/lib/analytics';
import { getTransactionalEmailCopy } from '@/lib/i18n/builder-shared-copy';

export const runtime = 'nodejs';

async function recordPaidCheckoutAnalytics(
  session: Stripe.Checkout.Session,
  options: {
    tier: string;
    contractType: string;
    packageKey: string | null;
    addOns: CheckoutAddonKey[];
  },
) {
  const normalizedTier = normalizePricingTier(options.tier);
  const priceBand: AnalyticsEventParams['price_band'] = options.packageKey
    ? '299'
    : normalizedTier === 'complete'
      ? '199'
      : '99';
  const addonsTotalCzk = getCheckoutAddonsTotalCzk(options.addOns);
  const totalPriceCzk =
    typeof session.amount_total === 'number' ? Math.round(session.amount_total / 100) : undefined;

  await recordAnalyticsEvent('checkout_completed', {
    source: 'stripe_webhook',
    surface: 'paid_checkout',
    contract_type: options.contractType as AnalyticsEventParams['contract_type'],
    tier: normalizedTier,
    package_key: options.packageKey as AnalyticsEventParams['package_key'],
    price_band: priceBand,
    add_on_keys: options.addOns.join(','),
    addons_total_czk: addonsTotalCzk,
    total_price_czk: totalPriceCzk,
    selected_addons_count: options.addOns.length,
  });

  if (options.addOns.length === 0) return;

  await Promise.all(
    options.addOns.map((addOnKey) =>
      recordAnalyticsEvent('checkout_addon_purchased', {
        source: 'stripe_webhook',
        surface: 'paid_checkout',
        contract_type: options.contractType as AnalyticsEventParams['contract_type'],
        tier: normalizedTier,
        package_key: options.packageKey as AnalyticsEventParams['package_key'],
        price_band: priceBand,
        add_on_key: addOnKey,
        add_on_price_czk: CHECKOUT_ADDON_CONFIG[addOnKey].priceCzk,
        add_on_keys: options.addOns.join(','),
        addons_total_czk: addonsTotalCzk,
        total_price_czk: totalPriceCzk,
        selected_addons_count: options.addOns.length,
      }),
    ),
  );
}

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

      if (session.payment_status !== 'paid') {
        console.warn(
          `[webhook] checkout.session.completed without paid status (${session.id}: ${session.payment_status})`,
        );
        return NextResponse.json({ received: true });
      }

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
      let checkoutAnalyticsRecorded = false;

      if (draftId) {
        const key = `contract:draft:${draftId}`;
        const existing = await redis.get<Record<string, unknown>>(key);

        if (existing) {
          const existingPayload =
            existing.payload && typeof existing.payload === 'object' && !Array.isArray(existing.payload)
              ? (existing.payload as Record<string, unknown>)
              : {};
          const tier = String(session.metadata?.tier || existing.tier || 'basic');
          const lang = String(session.metadata?.lang || existing.lang || existingPayload.lang || 'cs');
          const addOns = normalizeStoredCheckoutAddons(existing.addOns ?? existingPayload.addOns);
          const contractType = String(
            session.metadata?.contractType || existing.contractType || existingPayload.contractType || '',
          );
          const packageKey = typeof existing.packageKey === 'string' ? existing.packageKey : null;
          const archiveDays = getArchiveDaysWithAddons(normalizePricingTier(tier), packageKey, addOns);
          const downloadToken =
            typeof session.metadata?.downloadToken === 'string'
              ? session.metadata.downloadToken
              : typeof existing.downloadToken === 'string'
                ? existing.downloadToken
                : null;
          const ttl = archiveDays * 60 * 60 * 24;
          await redis.set(
            key,
            {
              ...existing,
              lang,
              addOns,
              paid: true,
              paidAt: new Date().toISOString(),
              stripeSessionId: session.id,
              paymentStatus: session.payment_status,
              customerEmail: session.customer_email || (existing.email as string) || null,
              ...(downloadToken ? { downloadToken } : {}),
            },
            { ex: ttl },
          );

          // Reverzní index: session_id → draftId (pro zákaznickou zónu)
          try {
            await redis.set(`session:draft:${session.id}`, draftId, { ex: ttl });
          } catch (revErr) {
            console.warn('[webhook] Reverse index error (non-critical):', revErr);
          }

          // Indexovat session_id pod e-mailem zákazníka pro zákaznickou zónu (cross-device)
          const customerEmailForIndex = session.customer_email || (existing.email as string);
          if (customerEmailForIndex) {
            try {
              const normalizedEmail = customerEmailForIndex.toLowerCase().trim();
              const emailKey = `orders:email:${normalizedEmail}`;
              await redis.sadd(emailKey, session.id);
              await redis.expire(emailKey, ttl);
              await ensurePortalAccessToken(normalizedEmail);
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
            const portalToken = await ensurePortalAccessToken(customerEmail).catch(() => null);
            await sendDownloadEmail(
              resendKey,
              customerEmail,
              session.id,
              session.metadata?.contractType || 'dokument',
              process.env.NEXT_PUBLIC_BASE_URL || 'https://www.smlouvahned.cz',
              tier,
              lang,
              portalToken,
              downloadToken,
              archiveDays,
              addOns,
            ).catch((err) => console.error('[webhook] E-mail error:', err));
          }

          await recordPaidCheckoutAnalytics(session, {
            tier,
            contractType,
            packageKey,
            addOns,
          });
          checkoutAnalyticsRecorded = true;
        }
      }

      if (!checkoutAnalyticsRecorded) {
        const tier = String(session.metadata?.tier || 'basic');
        const contractType = String(session.metadata?.contractType || '');
        const packageKey =
          typeof session.metadata?.packageKey === 'string' ? session.metadata.packageKey : null;
        const addOns = normalizeStoredCheckoutAddons(session.metadata?.addOns);

        await recordPaidCheckoutAnalytics(session, {
          tier,
          contractType,
          packageKey,
          addOns,
        });
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
  lang: string = 'cs',
  portalToken: string | null = null,
  downloadToken: string | null = null,
  archiveDays: number = tier === 'basic' ? 7 : 30,
  addOns: readonly CheckoutAddonKey[] = [],
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

  const localizedEmail = getTransactionalEmailCopy(lang);
  const contractName = lang === 'cs'
    ? contractNames[contractType] || 'Právní dokument'
    : localizedEmail.contractName(contractType);
  const emailCopy = localizedEmail.copy;
  const langQuery = lang === 'cs' ? '' : `&lang=${encodeURIComponent(lang)}`;
  const tokenQuery = downloadToken ? `&token=${encodeURIComponent(downloadToken)}` : '';
  const downloadUrl = `${baseUrl}/api/contracts/download?session_id=${sessionId}${langQuery}${tokenQuery}`;
  const docxDownloadUrl = `${downloadUrl}&format=docx`;
  const portalUrl = portalToken
    ? `${baseUrl}/zakaznicka-zona?access=${encodeURIComponent(portalToken)}`
    : `${baseUrl}/zakaznicka-zona`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'SmlouvaHned <dokumenty@smlouvahned.cz>',
      to: [to],
      subject: emailCopy.subject(contractName),
      html: `
        <!DOCTYPE html>
        <html lang="${emailCopy.htmlLang}">
        <head><meta charset="UTF-8"><title>${emailCopy.title} | SmlouvaHned</title></head>
        <body style="background:#05080f;font-family:Arial,sans-serif;color:#e2e8f0;padding:40px 20px;margin:0;">
          <div style="max-width:580px;margin:0 auto;background:#0c1426;border-radius:24px;border:1px solid #1e2940;padding:40px;">
            <div style="text-align:center;margin-bottom:32px;">
              <div style="display:inline-block;background:#f59e0b;color:#000;font-weight:900;font-size:18px;padding:10px 18px;border-radius:12px;letter-spacing:-0.5px;">
                SmlouvaHned
              </div>
            </div>
            <h1 style="color:#fff;font-size:26px;font-weight:900;margin:0 0 12px;text-align:center;">
              ${emailCopy.title}
            </h1>
            <p style="color:#94a3b8;font-size:15px;text-align:center;margin-bottom:32px;">
              ${emailCopy.documentReady(contractName)}
            </p>
            <a href="${downloadUrl}"
               style="display:block;text-align:center;background:linear-gradient(135deg,#f59e0b,#eab308);color:#000;font-weight:900;font-size:18px;padding:18px 32px;border-radius:16px;text-decoration:none;margin-bottom:16px;letter-spacing:-0.3px;">
              ${emailCopy.downloadPdf}
            </a>
            ${addOns.includes('docx') ? `
            <a href="${docxDownloadUrl}"
               style="display:block;text-align:center;background:#1f2937;color:#fbbf24;font-weight:800;font-size:14px;padding:14px 24px;border-radius:14px;text-decoration:none;margin-bottom:16px;border:1px solid #92400e;">
              ${emailCopy.downloadDocx}
            </a>
            ` : ''}
            <a href="${portalUrl}"
               style="display:block;text-align:center;border:1px solid #334155;color:#cbd5e1;font-weight:700;font-size:14px;padding:12px 24px;border-radius:12px;text-decoration:none;margin-bottom:24px;">
              ${emailCopy.myDocuments}
            </a>
            <p style="color:#64748b;font-size:12px;text-align:center;margin:0;">
              ${emailCopy.expiry(archiveDays)}<br>
              ${emailCopy.questions} <a href="mailto:info@smlouvahned.cz" style="color:#f59e0b;">info@smlouvahned.cz</a>
            </p>
          </div>
          <p style="color:#334155;font-size:11px;text-align:center;margin-top:24px;">
            © 2026 SmlouvaHned. ${emailCopy.footer}
          </p>
        </body>
        </html>
      `,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Resend API error ${response.status}: ${body.slice(0, 500)}`);
  }
}
