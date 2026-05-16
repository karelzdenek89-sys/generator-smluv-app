/**
 * Centrální definice aktuálního roku pro SEO obsah a metadata.
 *
 * Účel: čeští uživatelé často hledají „smlouva 2026", „vzor 2026" apod.
 * Mít rok v title a description je významný relevance signál.
 *
 * Při přechodu na další rok stačí aktualizovat jednu konstantu —
 * propíše se do všech míst, která ji importují.
 *
 * POZN.: Některé titulky obsahují „2026" napevno (kvůli ladnější
 * formulaci jako „Pracovní smlouva 2026"). Tyto je třeba aktualizovat
 * ručně — přehled drží `grep -r '2026' app/`.
 */
export const CURRENT_YEAR = 2026;

/** Lidský popisek pro UI/copy, např. „platné pro rok 2026". */
export const CURRENT_YEAR_LABEL = `${CURRENT_YEAR}`;

/** Datum, ke kterému je obsah revidován (ISO). Aktualizovat při větší legislativní novele. */
export const LAST_CONTENT_REVISION_ISO = '2026-05-16';
