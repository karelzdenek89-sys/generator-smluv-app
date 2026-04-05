export function normalizeCompanyId(value: string): string {
  return value.replace(/\D/g, '').slice(0, 8);
}

export function isValidCzechCompanyId(value: string): boolean {
  const ico = normalizeCompanyId(value);

  if (!/^\d{8}$/.test(ico)) {
    return false;
  }

  const digits = ico.split('').map(Number);
  const checksumBase =
    digits[0] * 8 +
    digits[1] * 7 +
    digits[2] * 6 +
    digits[3] * 5 +
    digits[4] * 4 +
    digits[5] * 3 +
    digits[6] * 2;

  const mod = checksumBase % 11;
  let checksum = 11 - mod;

  if (checksum === 10) checksum = 0;
  if (checksum === 11) checksum = 1;

  return digits[7] === checksum;
}

export function getCompanyIdValidationMessage(value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const normalized = normalizeCompanyId(trimmed);

  if (normalized.length < 8) {
    return 'IČO má mít 8 číslic.';
  }

  if (!isValidCzechCompanyId(normalized)) {
    return 'Zadané IČO nevypadá jako platné osmimístné IČO.';
  }

  return null;
}
