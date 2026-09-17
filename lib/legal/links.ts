import type { AppLocale } from '@/lib/locale';

/**
 * Odkazy na právní dokumenty podle jazyka.
 *
 * Cizojazyčný zákazník musí před platbou odškrtnout souhlas s podmínkami —
 * do 17. 9. 2026 vedl odkaz vždy na české znění, které si přečíst nemohl.
 * České znění zůstává závazné, překlad je informativní.
 */
export function termsHref(locale: AppLocale): string {
  return locale === 'cs' ? '/obchodni-podminky' : `/${locale}/terms`;
}

export function privacyHref(locale: AppLocale): string {
  return locale === 'cs' ? '/gdpr' : `/${locale}/privacy`;
}
