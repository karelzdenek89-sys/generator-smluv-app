// ═══════════════════════════════════════════════════════════════════════
// PRÁVNÍ KONSTANTY 2026 — single source of truth
// ═══════════════════════════════════════════════════════════════════════
//
// Tento soubor centralizuje konkrétní právní hodnoty (částky, lhůty, limity),
// které se mění novelizacemi. Jakákoli změna legislativy = úprava jednoho
// místa, ne hledání v 2000řádkovém contracts.ts.
//
// !!! PŘED PRODUKČNÍM NASAZENÍM OVĚŘIT S PRÁVNÍKEM A AKTUÁLNÍMI SBÍRKAMI !!!
// Hodnoty zde jsou platné ke dni LEGAL_REVIEWED_AT. Při dalších novelizacích:
//   1. Aktualizovat hodnotu a citaci novely
//   2. Posunout LEGAL_VERSION a LEGAL_REVIEWED_AT
//   3. Doplnit CHANGELOG na konci souboru
// ═══════════════════════════════════════════════════════════════════════

export const LEGAL_VERSION = '2026.1';
export const LEGAL_REVIEWED_AT = '2026-05-15';

/**
 * Krátký disclaimer do patičky každé stránky PDF.
 * Záměrně se vyhýbáme formulaci „podle právního stavu", která může znít jako
 * právní garance — místo toho zdůrazňujeme automatizovanou povahu nástroje.
 */
export const LEGAL_STATE_DISCLAIMER =
  'Dokument byl vytvořen automatizovaně podle údajů zadaných uživatelem. Nejde o individuální právní poradenství ani právní službu.';

/**
 * Delší vysvětlení pro závěr dokumentu / FAQ stránku — pro situace, kdy je
 * vhodné výslovně odkázat uživatele na advokáta.
 */
export const LEGAL_FULL_DISCLAIMER =
  'Tento dokument byl vytvořen prostřednictvím online nástroje SmlouvaHned.cz na základě údajů zadaných uživatelem. Dokument představuje standardizovaný smluvní vzor určený pro běžné situace. Služba neposuzuje individuální okolnosti konkrétního případu a nenahrazuje právní poradenství advokáta. Pro složité, nestandardní nebo sporné situace doporučujeme obrátit se na advokáta.';

// ───────────────────────────────────────────────────────────────────────
// ZÁKONÍK PRÁCE (262/2006 Sb.) ve znění novely č. 120/2025 Sb. (flexinovela)
// účinné od 1. 6. 2025
// ───────────────────────────────────────────────────────────────────────

/**
 * Max. zkušební doba dle § 35 odst. 1 ZP ve znění novely č. 120/2025 Sb.
 * (flexinovela, účinnost od 1. 6. 2025).
 *
 * - 4 měsíce u běžného zaměstnance
 * - 8 měsíců u vedoucího zaměstnance
 * - u pracovního poměru na dobu určitou max. 1/2 sjednané doby trvání
 */
export const ZP_TRIAL_MONTHS_STANDARD = 4;
export const ZP_TRIAL_MONTHS_LEADERSHIP = 8;
export const ZP_TRIAL_FIXED_TERM_MAX_RATIO = 0.5;

/** Min. dovolená u hlavního pracovního poměru — 4 týdny dle § 213 ZP. */
export const ZP_VACATION_MIN_WEEKS = 4;

/** DPP — max. rozsah u jednoho zaměstnavatele za kalendářní rok (§ 75 odst. 2 ZP). */
export const DPP_MAX_HOURS_PER_YEAR = 300;

/**
 * DPP — rozhodný příjem pro účast zaměstnance na nemocenském a důchodovém
 * pojištění pro rok 2026 (25 % průměrné mzdy zaokr. dolů na celých 500 Kč).
 *
 * Při dosažení nebo překročení této částky v kalendářním měsíci u jednoho
 * zaměstnavatele vzniká účast na pojištění.
 *
 * !!! Aktualizovat každý rok podle nař. vlády o průměrné mzdě. !!!
 */
export const DPP_MONTHLY_THRESHOLD_2026_CZK = 12000;

/**
 * Minimální mzda pro rok 2026 (nař. vlády č. 466/2025 Sb.).
 * Měsíční: 22 400 Kč · hodinová (40h týden): 134,40 Kč.
 */
export const MIN_WAGE_MONTHLY_2026_CZK = 22400;
export const MIN_WAGE_HOURLY_2026_CZK = 134.4;

/** DPČ — rozhodný příjem (§ 7 odst. 2 zák. o nem. pojištění). */
export const DPC_MONTHLY_THRESHOLD_2026_CZK = 4500;

export const DPP_THRESHOLD_NOTE = `Pro rok 2026 činí rozhodný příjem pro účast zaměstnance činného na základě dohody o provedení práce na nemocenském a důchodovém pojištění ${DPP_MONTHLY_THRESHOLD_2026_CZK.toLocaleString('cs-CZ')} Kč hrubého měsíčně u jednoho zaměstnavatele. Při dosažení nebo překročení této částky vzniká účast na pojištění a související odvodové povinnosti zaměstnavatele.`;

/**
 * Klauzule o dovolené z DPP po novele § 77a a § 213 ZP účinné od 1. 1. 2024.
 * Fikce 20 h/týden pro výpočet nároku.
 */
export const DPP_VACATION_NOTE =
  'Zaměstnanci pracujícímu na základě dohody o provedení práce vzniká nárok na dovolenou za podmínek § 77a ZP (účinné od 1. 1. 2024): dohoda musí trvat nepřetržitě alespoň 4 týdny u téhož zaměstnavatele a zaměstnanec musí odpracovat alespoň 4násobek fiktivní stanovené týdenní pracovní doby (20 h). Konkrétní výpočet provádí zaměstnavatel dle § 213 a § 77a ZP.';

// ───────────────────────────────────────────────────────────────────────
// OBČANSKÝ ZÁKONÍK (89/2012 Sb.) — nájem bytu
// ───────────────────────────────────────────────────────────────────────

/**
 * Drobné opravy a běžná údržba — nařízení vlády č. 308/2015 Sb. ve znění
 * pozdějších předpisů. Limity platné pro rok 2026:
 *   - jednotlivá oprava: do 1 500 Kč
 *   - roční souhrn: 150 Kč / m² podlahové plochy bytu
 */
export const LEASE_MINOR_REPAIR_SINGLE_LIMIT_CZK = 1500;
export const LEASE_MINOR_REPAIR_ANNUAL_PER_M2_CZK = 150;

export const LEASE_MINOR_REPAIRS_NOTE = `Nájemce hradí běžnou údržbu bytu a drobné opravy související s užíváním bytu (§ 2257 OZ) v rozsahu stanoveném nařízením vlády č. 308/2015 Sb., ve znění pozdějších předpisů. Za drobnou opravu podle výše nákladů se považuje oprava, jejíž náklad nepřesáhne ${LEASE_MINOR_REPAIR_SINGLE_LIMIT_CZK.toLocaleString('cs-CZ')} Kč. Celkový roční limit těchto nákladů činí ${LEASE_MINOR_REPAIR_ANNUAL_PER_M2_CZK} Kč za m² podlahové plochy bytu za kalendářní rok.`;

/** Úrok z prodlení — nařízení vlády č. 351/2013 Sb. */
export const LATE_INTEREST_REGULATION = 'nařízení vlády č. 351/2013 Sb.';

// ───────────────────────────────────────────────────────────────────────
// OCHRANA SPOTŘEBITELE
// ───────────────────────────────────────────────────────────────────────

/**
 * Klauzule pro postoupení pohledávky v případech, kdy *dlužníkem může být
 * spotřebitel*. Bez kvalifikace je obecný souhlas s postoupením potenciálně
 * zneužívající ve smyslu § 1813 OZ.
 */
export const LOAN_ASSIGNMENT_CONSUMER_SAFE =
  'Věřitel je oprávněn postoupit svou pohledávku třetí osobě v souladu s § 1879 a násl. OZ. Je-li vydlužitel spotřebitelem, postoupení se řídí též ustanoveními na ochranu spotřebitele (zejména § 1810 a násl. OZ a zákonem č. 257/2016 Sb., o spotřebitelském úvěru, je-li dle své povahy aplikovatelný); ujednání, která by byla v rozporu s § 1813 OZ (zneužívající ujednání), jsou neplatná. Věřitel je povinen postoupení bez zbytečného odkladu vydlužiteli písemně oznámit.';

// ───────────────────────────────────────────────────────────────────────
// CHANGELOG
// ───────────────────────────────────────────────────────────────────────
// 2026-05-15 (v2026.1):
//   - Vytvořen modul, extrahovány klíčové konstanty z lib/contracts.ts.
//   - § 35 ZP po novele 120/2025 Sb. (flexinovela, účinnost 1. 6. 2025):
//     zkušební doba 4 měsíce / 8 měsíců u vedoucího + ratio 1/2 u doby určité.
//   - Nájem: drobné opravy 1 500 Kč jednotlivá / 150 Kč/m² ročně
//     (nař. vlády 308/2015 Sb. ve znění novel).
//   - DPP: rozhodný příjem pro pojištění 12 000 Kč/měs. pro rok 2026.
//   - Loan: postoupení pohledávky doplněno o ochranu spotřebitele § 1813.
