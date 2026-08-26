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
import {
  formatConsentTimestamp,
  getFulfilmentContractName,
  getFulfilmentEmailCopy,
} from '@/lib/i18n/fulfilment-email';
import type { AnalyticsEventParams } from '@/lib/analytics';
import { getEffectivePriceBand, packageIncludesDocx } from '@/lib/packages';
import { buildPartnerContext } from '@/lib/partners/context';
import {
  analyticsAttributionEventParams,
  normalizeStoredCheckoutAnalyticsAttribution,
  type CheckoutAnalyticsAttribution,
} from '@/lib/analytics-attribution';

export const runtime = 'nodejs';

const RELEASE_LOCK_IF_OWNER = `
if redis.call('GET', KEYS[1]) == ARGV[1] then
  return redis.call('DEL', KEYS[1])
end
return 0
`;

async function recordPaidCheckoutAnalytics(
  session: Stripe.Checkout.Session,
  options: {
    tier: string;
    contractType: string;
    packageKey: string | null;
    addOns: CheckoutAddonKey[];
    monetizationMode: NonNullable<AnalyticsEventParams['monetization_mode']>;
    experimentId?: string | null;
    experimentVariant?: string | null;
    analyticsAttribution?: CheckoutAnalyticsAttribution;
  },
) {
  const normalizedTier = normalizePricingTier(options.tier);
  const priceBand: AnalyticsEventParams['price_band'] = getEffectivePriceBand(
    normalizedTier,
    options.packageKey,
  );
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
    monetization_mode: options.monetizationMode,
    experiment_id: options.experimentId ?? undefined,
    variant: options.experimentVariant ?? undefined,
    ...analyticsAttributionEventParams(options.analyticsAttribution),
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
        monetization_mode: options.monetizationMode,
        experiment_id: options.experimentId ?? undefined,
        variant: options.experimentVariant ?? undefined,
        ...analyticsAttributionEventParams(options.analyticsAttribution),
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

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );
    } catch (verificationError) {
      console.error('Stripe webhook signature verification failed:', verificationError);
      return NextResponse.json(
        { error: 'Webhook verification failed.' },
        { status: 400 },
      );
    }

    if (
      event.type === 'checkout.session.completed' ||
      event.type === 'checkout.session.async_payment_succeeded'
    ) {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.payment_status !== 'paid') {
        console.warn(
          `[webhook] checkout.session.completed without paid status (${session.id}: ${session.payment_status})`,
        );
        return NextResponse.json({ received: true });
      }

      const draftId = session.metadata?.draftId;
      if (!draftId) throw new Error(`Missing draftId for paid Checkout Session ${session.id}.`);

      const completedKey = `webhook:fulfilled:${session.id}`;
      const lockKey = `webhook:fulfillment-lock:${session.id}`;
      const fulfillmentRecordTtl = 60 * 60 * 24 * 90;

      if (await redis.get(completedKey)) {
        console.log(`[webhook] Fulfilment already completed for ${session.id}.`);
        return NextResponse.json({ received: true });
      }

      const lockAcquired = await redis.set(lockKey, event.id, { ex: 5 * 60, nx: true });
      if (lockAcquired === null) {
        return NextResponse.json(
          { received: false, retry: true },
          { status: 409 },
        );
      }

      try {
        const key = `contract:draft:${draftId}`;
        const existing = await redis.get<Record<string, unknown>>(key);
        if (!existing) throw new Error(`Draft ${draftId} was not found for paid session ${session.id}.`);

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
        const analyticsConsentGranted = existing.analyticsConsentGranted === true;
        const analyticsAttribution = analyticsConsentGranted
          ? normalizeStoredCheckoutAnalyticsAttribution(existing.analyticsAttribution)
          : null;
        const monetizationMode = existing.monetizationMode === 'free_experiment'
          || existing.monetizationMode === 'freemium'
          ? existing.monetizationMode
          : 'paid';
        const experimentId = monetizationMode === 'free_experiment'
          && typeof existing.experimentId === 'string'
          ? existing.experimentId
          : null;
        const experimentVariant = monetizationMode === 'free_experiment'
          && typeof existing.experimentVariant === 'string'
          ? existing.experimentVariant
          : null;
        const archiveDays = getArchiveDaysWithAddons(normalizePricingTier(tier), packageKey, addOns);
        const archiveTtl = archiveDays * 60 * 60 * 24;
        const paidAt = typeof existing.paidAt === 'string' ? existing.paidAt : new Date().toISOString();
        const storedExpiresAt = typeof existing.expiresAt === 'string' ? Date.parse(existing.expiresAt) : NaN;
        const expiresAtMs = Number.isFinite(storedExpiresAt)
          ? storedExpiresAt
          : Date.parse(paidAt) + archiveTtl * 1000;
        const remainingTtl = Math.max(60, Math.ceil((expiresAtMs - Date.now()) / 1000));
        const customerEmail = String(
          existing.deliveryEmail ||
          session.customer_details?.email ||
          session.customer_email ||
          existing.email ||
          '',
        ).trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
          throw new Error(`Missing valid delivery email for paid session ${session.id}.`);
        }
        const downloadToken =
          typeof session.metadata?.downloadToken === 'string'
            ? session.metadata.downloadToken
            : typeof existing.downloadToken === 'string'
              ? existing.downloadToken
              : null;
        const partnerContext = buildPartnerContext({
          contractType,
          documentTier: tier,
          locale: lang,
          packageKey,
          rawContractData: existingPayload,
          monetizationMode,
          paid: true,
          completed: true,
        });

        await redis.set(
          key,
          {
            ...existing,
            lang,
            addOns,
            paid: true,
            paidAt,
            expiresAt: new Date(expiresAtMs).toISOString(),
            stripeSessionId: session.id,
            paymentStatus: session.payment_status,
            customerEmail,
            deliveryEmail: customerEmail,
            partnerContext,
            ...(downloadToken ? { downloadToken } : {}),
          },
          { ex: remainingTtl },
        );

        await redis.set(`session:draft:${session.id}`, draftId, { ex: remainingTtl });
        const emailKey = `orders:email:${customerEmail}`;
        await redis.sadd(emailKey, session.id);
        const emailIndexTtl = await redis.ttl(emailKey);
        if (emailIndexTtl < remainingTtl) await redis.expire(emailKey, remainingTtl);
        const portalToken = await ensurePortalAccessToken(customerEmail, remainingTtl);

        const resendKey = process.env.RESEND_API_KEY;
        if (!resendKey) throw new Error('RESEND_API_KEY is missing; fulfilment email cannot be sent.');
        const emailSentKey = `webhook:email-sent:${session.id}`;
        if (!(await redis.get(emailSentKey))) {
          await sendDownloadEmail(
            resendKey,
            customerEmail,
            session.id,
            contractType || 'dokument',
            process.env.NEXT_PUBLIC_BASE_URL || 'https://www.smlouvahned.cz',
            tier,
            lang,
            portalToken,
            downloadToken,
            archiveDays,
            addOns,
            packageKey,
            existing.consent,
          );
          await redis.set(emailSentKey, '1', { ex: fulfillmentRecordTtl });
        }

        if (analyticsConsentGranted) {
          await recordPaidCheckoutAnalytics(session, {
            tier,
            contractType,
            packageKey,
            addOns,
            monetizationMode,
            experimentId,
            experimentVariant,
            analyticsAttribution: analyticsAttribution ?? undefined,
          }).catch((analyticsError) => {
            console.error('[webhook] Paid checkout analytics failed:', analyticsError);
          });
        }

        await redis.set(completedKey, '1', { ex: fulfillmentRecordTtl });
      } finally {
        await redis.eval(RELEASE_LOCK_IF_OWNER, [lockKey], [event.id]).catch((unlockError) => {
          console.error('[webhook] Fulfilment lock cleanup failed:', unlockError);
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed; retry required.' },
      { status: 500 },
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
  packageKey: string | null = null,
  consent: unknown = null,
): Promise<void> {
  const copy = getFulfilmentEmailCopy(lang);
  const contractName = getFulfilmentContractName(contractType, lang);
  const langQuery = lang === 'cs' ? '' : `&lang=${encodeURIComponent(lang)}`;
  const tokenFragment = downloadToken ? `#token=${encodeURIComponent(downloadToken)}` : '';
  const downloadUrl = `${baseUrl}/stahnout?session_id=${encodeURIComponent(sessionId)}${langQuery}${tokenFragment}`;
  const docxDownloadUrl = `${baseUrl}/stahnout?session_id=${encodeURIComponent(sessionId)}${langQuery}&format=docx${tokenFragment}`;
  const portalUrl = portalToken
    ? `${baseUrl}/zakaznicka-zona#access=${encodeURIComponent(portalToken)}`
    : `${baseUrl}/zakaznicka-zona`;
  const consentRecord = consent && typeof consent === 'object' && !Array.isArray(consent)
    ? (consent as Record<string, unknown>)
    : null;
  const consentAcceptedAt = typeof consentRecord?.acceptedAt === 'string'
    ? formatConsentTimestamp(consentRecord.acceptedAt, lang)
    : null;
  const termsVersion = typeof consentRecord?.termsVersion === 'string' ? consentRecord.termsVersion : null;
  const privacyVersion = typeof consentRecord?.privacyVersion === 'string' ? consentRecord.privacyVersion : null;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `checkout-fulfilled-${sessionId}`,
    },
    body: JSON.stringify({
      from: 'SmlouvaHned <dokumenty@planstavby.cz>',
      to: [to],
      subject: copy.subject(contractName),
      html: `
        <!DOCTYPE html>
        <html lang="${copy.htmlLang}">
        <head><meta charset="UTF-8"><title>${copy.pageTitle}</title></head>
        <body style="background:#05080f;font-family:Arial,sans-serif;color:#e2e8f0;padding:40px 20px;margin:0;">
          <div style="max-width:580px;margin:0 auto;background:#0c1426;border-radius:24px;border:1px solid #1e2940;padding:40px;">
            <div style="text-align:center;margin-bottom:32px;">
              <div style="display:inline-block;background:#f59e0b;color:#000;font-weight:900;font-size:18px;padding:10px 18px;border-radius:12px;letter-spacing:-0.5px;">
                SmlouvaHned
              </div>
            </div>
            <h1 style="color:#fff;font-size:26px;font-weight:900;margin:0 0 12px;text-align:center;">
              ${copy.heading}
            </h1>
            <p style="color:#94a3b8;font-size:15px;text-align:center;margin-bottom:32px;">
              ${copy.intro(contractName)}
            </p>
            <a href="${downloadUrl}"
               style="display:block;text-align:center;background:linear-gradient(135deg,#f59e0b,#eab308);color:#000;font-weight:900;font-size:18px;padding:18px 32px;border-radius:16px;text-decoration:none;margin-bottom:16px;letter-spacing:-0.3px;">
              ${copy.downloadPdf}
            </a>
            ${addOns.includes('docx') || packageIncludesDocx(packageKey) ? `
            <a href="${docxDownloadUrl}"
               style="display:block;text-align:center;background:#1f2937;color:#fbbf24;font-weight:800;font-size:14px;padding:14px 24px;border-radius:14px;text-decoration:none;margin-bottom:16px;border:1px solid #92400e;">
              ${copy.downloadDocx}
            </a>
            ` : ''}
            <a href="${portalUrl}"
               style="display:block;text-align:center;border:1px solid #334155;color:#cbd5e1;font-weight:700;font-size:14px;padding:12px 24px;border-radius:12px;text-decoration:none;margin-bottom:24px;">
              ${copy.portal}
            </a>
            <p style="color:#64748b;font-size:12px;text-align:center;margin:0;">
              ${copy.expiry(archiveDays)}<br>
              ${copy.questions} <a href="mailto:info@smlouvahned.cz" style="color:#f59e0b;">info@smlouvahned.cz</a>
            </p>
            ${consentAcceptedAt && termsVersion && privacyVersion ? `
            <div style="margin-top:24px;padding:16px;border-radius:12px;background:#111c31;color:#94a3b8;font-size:11px;line-height:1.6;">
              ${copy.consent(consentAcceptedAt, termsVersion, privacyVersion)}
            </div>
            ` : ''}
          </div>
          <p style="color:#334155;font-size:11px;text-align:center;margin-top:24px;">
            ${copy.footer}
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
