export const CHECKOUT_TERMS_VERSION = '2026-07-15';
export const CHECKOUT_PRIVACY_VERSION = '2026-07-15';
export const CHECKOUT_CONSENT_TEXT_VERSION = 'digital-content-v1';

export type CheckoutConsent = {
  accepted: true;
  acceptedAt: string;
  termsVersion: typeof CHECKOUT_TERMS_VERSION;
  privacyVersion: typeof CHECKOUT_PRIVACY_VERSION;
  textVersion: typeof CHECKOUT_CONSENT_TEXT_VERSION;
};

export type CheckoutAuthorization = {
  deliveryEmail: string;
  consent: CheckoutConsent;
  annexLanguage?: 'en' | 'ua';
};

export function createCheckoutAuthorization(
  deliveryEmail: string,
  annexLanguage?: 'en' | 'ua',
): CheckoutAuthorization {
  return {
    deliveryEmail: deliveryEmail.trim().toLowerCase(),
    ...(annexLanguage ? { annexLanguage } : {}),
    consent: {
      accepted: true,
      acceptedAt: new Date().toISOString(),
      termsVersion: CHECKOUT_TERMS_VERSION,
      privacyVersion: CHECKOUT_PRIVACY_VERSION,
      textVersion: CHECKOUT_CONSENT_TEXT_VERSION,
    },
  };
}
