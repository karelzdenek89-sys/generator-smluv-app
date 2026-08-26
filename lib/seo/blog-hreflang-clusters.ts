import { SITE_URL } from '@/lib/seo/site';

const WHY_SMOLOUVAHNED_CLUSTER: Record<string, string> = {
  cs: `${SITE_URL}/blog/proc-smlouvahned-misto-vzoru-2026`,
  en: `${SITE_URL}/blog/expat/why-smlouvahned-not-template-2026-guide-en`,
  uk: `${SITE_URL}/blog/expat/why-smlouvahned-not-template-2026-guide-ua`,
  'x-default': `${SITE_URL}/blog/proc-smlouvahned-misto-vzoru-2026`,
};

const DEPOSIT_RETURN_CLUSTER: Record<string, string> = {
  cs: `${SITE_URL}/blog/vraceni-kauce-po-skonceni-najmu-2026`,
  en: `${SITE_URL}/blog/expat/deposit-return-czechia-2026-guide-en`,
  uk: `${SITE_URL}/blog/expat/deposit-return-czechia-2026-guide-ua`,
  'x-default': `${SITE_URL}/blog/vraceni-kauce-po-skonceni-najmu-2026`,
};

const WITHDRAWAL_CLUSTER: Record<string, string> = {
  cs: `${SITE_URL}/blog/odstoupeni-od-smlouvy-2026`,
  en: `${SITE_URL}/blog/expat/withdrawal-from-contract-czechia-2026-guide-en`,
  uk: `${SITE_URL}/blog/expat/withdrawal-from-contract-czechia-2026-guide-ua`,
  'x-default': `${SITE_URL}/blog/odstoupeni-od-smlouvy-2026`,
};

const LATE_INTEREST_CLUSTER: Record<string, string> = {
  cs: `${SITE_URL}/blog/urok-z-prodleni-2026`,
  en: `${SITE_URL}/blog/expat/late-payment-interest-czechia-2026-guide-en`,
  uk: `${SITE_URL}/blog/expat/late-payment-interest-czechia-2026-guide-ua`,
  'x-default': `${SITE_URL}/blog/urok-z-prodleni-2026`,
};

const DPP_HOLIDAY_CLUSTER: Record<string, string> = {
  cs: `${SITE_URL}/blog/dovolena-dpp-2026`,
  en: `${SITE_URL}/blog/expat/dpp-holiday-czechia-2026-guide-en`,
  uk: `${SITE_URL}/blog/expat/dpp-holiday-czechia-2026-guide-ua`,
  'x-default': `${SITE_URL}/blog/dovolena-dpp-2026`,
};

const EMPLOYMENT_NOTICE_CLUSTER: Record<string, string> = {
  cs: `${SITE_URL}/blog/vypovedni-doba-pracovni-pomer-2026`,
  en: `${SITE_URL}/blog/expat/employment-notice-period-czechia-2026-guide-en`,
  uk: `${SITE_URL}/blog/expat/employment-notice-period-czechia-2026-guide-ua`,
  'x-default': `${SITE_URL}/blog/vypovedni-doba-pracovni-pomer-2026`,
};

const RENTAL_ADDRESS_CLUSTER: Record<string, string> = {
  cs: `${SITE_URL}/blog/trvaly-pobyt-v-najmu-2026`,
  en: `${SITE_URL}/blog/expat/registered-address-rental-czechia-2026-guide-en`,
  uk: `${SITE_URL}/blog/expat/registered-address-rental-czechia-2026-guide-ua`,
  'x-default': `${SITE_URL}/blog/trvaly-pobyt-v-najmu-2026`,
};

const MINIMUM_WAGE_CLUSTER: Record<string, string> = {
  cs: `${SITE_URL}/blog/minimalni-mzda-dpp-pracovni-smlouva-2026`,
  en: `${SITE_URL}/blog/expat/minimum-wage-dpp-czechia-2026-guide-en`,
  uk: `${SITE_URL}/blog/expat/minimum-wage-dpp-czechia-2026-guide-ua`,
  'x-default': `${SITE_URL}/blog/minimalni-mzda-dpp-pracovni-smlouva-2026`,
};

/** Slugs (Czech or expat) that share a trilingual hreflang cluster. */
export const BLOG_HREFLANG_CLUSTER_BY_SLUG: Record<string, Record<string, string>> = {
  'proc-smlouvahned-misto-vzoru-2026': WHY_SMOLOUVAHNED_CLUSTER,
  'why-smlouvahned-not-template-2026-guide-en': WHY_SMOLOUVAHNED_CLUSTER,
  'why-smlouvahned-not-template-2026-guide-ua': WHY_SMOLOUVAHNED_CLUSTER,
  'vraceni-kauce-po-skonceni-najmu-2026': DEPOSIT_RETURN_CLUSTER,
  'deposit-return-czechia-2026-guide-en': DEPOSIT_RETURN_CLUSTER,
  'deposit-return-czechia-2026-guide-ua': DEPOSIT_RETURN_CLUSTER,
  'odstoupeni-od-smlouvy-2026': WITHDRAWAL_CLUSTER,
  'withdrawal-from-contract-czechia-2026-guide-en': WITHDRAWAL_CLUSTER,
  'withdrawal-from-contract-czechia-2026-guide-ua': WITHDRAWAL_CLUSTER,
  'urok-z-prodleni-2026': LATE_INTEREST_CLUSTER,
  'late-payment-interest-czechia-2026-guide-en': LATE_INTEREST_CLUSTER,
  'late-payment-interest-czechia-2026-guide-ua': LATE_INTEREST_CLUSTER,
  'dovolena-dpp-2026': DPP_HOLIDAY_CLUSTER,
  'dpp-holiday-czechia-2026-guide-en': DPP_HOLIDAY_CLUSTER,
  'dpp-holiday-czechia-2026-guide-ua': DPP_HOLIDAY_CLUSTER,
  'vypovedni-doba-pracovni-pomer-2026': EMPLOYMENT_NOTICE_CLUSTER,
  'employment-notice-period-czechia-2026-guide-en': EMPLOYMENT_NOTICE_CLUSTER,
  'employment-notice-period-czechia-2026-guide-ua': EMPLOYMENT_NOTICE_CLUSTER,
  'trvaly-pobyt-v-najmu-2026': RENTAL_ADDRESS_CLUSTER,
  'registered-address-rental-czechia-2026-guide-en': RENTAL_ADDRESS_CLUSTER,
  'registered-address-rental-czechia-2026-guide-ua': RENTAL_ADDRESS_CLUSTER,
  'minimalni-mzda-dpp-pracovni-smlouva-2026': MINIMUM_WAGE_CLUSTER,
  'minimum-wage-dpp-czechia-2026-guide-en': MINIMUM_WAGE_CLUSTER,
  'minimum-wage-dpp-czechia-2026-guide-ua': MINIMUM_WAGE_CLUSTER,
};

export function getBlogHreflangAlternates(slug: string): Record<string, string> | undefined {
  return BLOG_HREFLANG_CLUSTER_BY_SLUG[slug];
}
