function emailAddress(value: string | undefined, fallback: string) {
  const normalized = value?.trim();
  return normalized && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) ? normalized : fallback;
}

export function getTransactionalSender() {
  return `SmlouvaHned <${emailAddress(process.env.RESEND_FROM_EMAIL, 'dokumenty@planstavby.cz')}>`;
}

export function getContactSender() {
  return `SmlouvaHned <${emailAddress(process.env.RESEND_CONTACT_FROM_EMAIL, 'noreply@planstavby.cz')}>`;
}
