import type { AppLocale } from '@/lib/locale';

const HEADING: Record<AppLocale, string> = {
  cs: 'Než budete pokračovat, upravte prosím:',
  en: 'Please correct the following before you continue:',
  ua: 'Перш ніж продовжити, виправте, будь ласка:',
};

/**
 * Legal blocks (minimum wage, the 300 h DPP cap…) used to surface only as an
 * alert() after the buyer had already opened the payment modal, typed an
 * e-mail and ticked consent. Showing them next to the generate button stops
 * the modal from opening on a document that can never be paid for.
 */
export default function BuilderBlockingNotice({
  locale,
  messages,
}: {
  locale: AppLocale;
  messages: string[];
}) {
  if (messages.length === 0) return null;
  return (
    <div
      role="alert"
      data-builder-blocking-notice=""
      className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-200"
    >
      <div className="font-semibold mb-1">{HEADING[locale]}</div>
      <ul className="space-y-1">
        {messages.map((message, index) => (
          <li key={index}>• {message}</li>
        ))}
      </ul>
    </div>
  );
}
