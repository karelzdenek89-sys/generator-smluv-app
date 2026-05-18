/** Shared legal / UX safety copy — no authority guarantees, no certified translation claims. */

type NoticeLocale = 'cs' | 'en' | 'ua';

function noticeLocale(locale?: string | null): NoticeLocale {
  const raw = String(locale ?? 'cs').trim().toLowerCase();
  if (raw === 'ukr' || raw === 'uk' || raw === 'ua') return 'ua';
  if (raw === 'en') return 'en';
  return 'cs';
}

export const LEASE_USE_NOTICE_EN =
  'This document may be useful for ordinary rental arrangements in the Czech Republic. Requirements of authorities or third parties may differ. SmlouvaHned does not guarantee acceptance by any authority.';

export const LEASE_USE_NOTICE_UK =
  'Цей документ може бути корисним для звичайної оренди в Чехії. Вимоги органів або третіх осіб можуть відрізнятися. SmlouvaHned не гарантує прийняття будь-яким органом.';

export const LEASE_USE_NOTICE_CS =
  'Tento dokument muze byt uzitecny pro bezny pronajem v Ceske republice. Pozadavky uradu nebo tretich stran se mohou lisit. SmlouvaHned nezarucuje prijeti kterymkoli uradem.';

export const EMPLOYMENT_WORK_ELIGIBILITY_NOTICE_EN =
  'This document does not verify whether a foreign national is allowed to work in the Czech Republic. Before signing, the parties should verify any applicable work permit, residence or employment requirements with the relevant authorities or a qualified specialist.';

export const EMPLOYMENT_WORK_ELIGIBILITY_NOTICE_CS =
  'Tento dokument neověřuje, zda má cizinec oprávnění pracovat v České republice. Před podpisem by strany měly ověřit případné požadavky na pracovní povolení, pobyt nebo zaměstnání u příslušných úřadů nebo odborného specialisty.';

export const EMPLOYMENT_WORK_ELIGIBILITY_NOTICE_UK =
  'Цей документ не перевіряє, чи має іноземець право працювати в Чеській Республіці. Перед підписом сторони повинні перевірити вимоги до дозволу на роботу, перебування чи працевлаштування у відповідних органах або у кваліфікованого спеціаліста.';

export function getLeaseUseNotice(locale?: string | null): string {
  const loc = noticeLocale(locale);
  if (loc === 'ua') return LEASE_USE_NOTICE_UK;
  if (loc === 'cs') return LEASE_USE_NOTICE_CS;
  return LEASE_USE_NOTICE_EN;
}

export function getEmploymentWorkEligibilityNotice(locale?: string | null): string {
  const loc = noticeLocale(locale);
  if (loc === 'ua') return EMPLOYMENT_WORK_ELIGIBILITY_NOTICE_UK;
  if (loc === 'cs') return EMPLOYMENT_WORK_ELIGIBILITY_NOTICE_CS;
  return EMPLOYMENT_WORK_ELIGIBILITY_NOTICE_EN;
}
