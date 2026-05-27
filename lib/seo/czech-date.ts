/** Mapuje českou textovou formu data („15. března 2026") na ISO „2026-03-15". */
const MONTHS_CZ: Record<string, string> = {
  ledna: '01',
  února: '02',
  března: '03',
  dubna: '04',
  května: '05',
  června: '06',
  července: '07',
  srpna: '08',
  září: '09',
  října: '10',
  listopadu: '11',
  prosince: '12',
};

export function czechDateToIso(date: string): string {
  const m = date.match(/^(\d{1,2})\.\s*([^\s]+)\s+(\d{4})/);
  if (!m) return date;
  const day = m[1].padStart(2, '0');
  const month = MONTHS_CZ[m[2].toLowerCase()];
  if (!month) return date;
  return `${m[3]}-${month}-${day}`;
}

export function czechDateToDate(date: string): Date {
  const iso = czechDateToIso(date);
  const parsed = Date.parse(iso);
  if (Number.isNaN(parsed)) return new Date();
  return new Date(parsed);
}
