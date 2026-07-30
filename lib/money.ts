/**
 * Reads an amount the way a Czech user actually types it into a form.
 *
 * Builders only check that the amount field is non-empty, so anything the
 * server rejects here surfaces as a failed checkout after the user has already
 * pressed pay. Accepting the common notations keeps that from happening:
 * "15000", "15 000", "15 000 Kč", "15000,-", "1.234.567", "15,50", "1 234,50".
 *
 * A trailing group of one or two digits is read as a decimal part; a group of
 * three is a thousands separator, which is how "15.000" and "15,000" are meant
 * in Czech. Returns null when the value cannot be read as a positive amount.
 */

const CURRENCY_TOKENS = /(kč|kc|czk|eur|usd|€|\$)/gi;
/** \s already covers non-breaking and narrow no-break spaces pasted from other apps. */
const WHITESPACE = /\s/g;
const DIGITS_AND_SEPARATORS = /^\d[\d.,]*$/;

export function parseMoney(input: unknown): number | null {
  if (typeof input === 'number') {
    return Number.isFinite(input) && input > 0 ? input : null;
  }
  if (typeof input !== 'string') return null;

  let value = input
    .replace(WHITESPACE, '')
    .replace(CURRENCY_TOKENS, '')
    .replace(/[,.-]+$/, '');

  if (!DIGITS_AND_SEPARATORS.test(value)) return null;

  const lastSeparator = Math.max(value.lastIndexOf(','), value.lastIndexOf('.'));
  if (lastSeparator !== -1) {
    const trailingDigits = value.length - lastSeparator - 1;
    if (trailingDigits === 1 || trailingDigits === 2) {
      const whole = value.slice(0, lastSeparator).replace(/[.,]/g, '');
      value = `${whole}.${value.slice(lastSeparator + 1)}`;
    } else {
      value = value.replace(/[.,]/g, '');
    }
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

/** True when the value can be read as a positive amount. */
export function isValidMoney(input: unknown): boolean {
  return parseMoney(input) !== null;
}
