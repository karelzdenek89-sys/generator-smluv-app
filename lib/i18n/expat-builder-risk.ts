import type { AppLocale } from '@/lib/locale';

export type RiskLevel = 'high' | 'medium' | 'low';
export type RiskWarning = { text: string; level: RiskLevel };

function loc(locale: AppLocale): 'cs' | 'en' | 'ua' {
  return locale === 'en' || locale === 'ua' ? locale : 'cs';
}

export function employmentRiskWarnings(
  locale: AppLocale,
  form: {
    employerIco: string;
    jobTitle: string;
    workPlace: string;
    startDate: string;
    salary: string;
    hourlyRate: string;
    employmentType: string;
    endDate: string;
    trialPeriodMonths: string;
    isManager: boolean;
  },
): RiskWarning[] {
  const L = loc(locale);
  const m = {
    cs: {
      ico: 'Doplňte IČO zaměstnavatele — povinný údaj.',
      job: 'Druh práce (pozice) je povinná náležitost § 34 ZP.',
      place: 'Místo výkonu práce je povinná náležitost § 34 ZP.',
      start: 'Den nástupu je povinná náležitost § 34 ZP.',
      pay: 'Doporučujeme doplnit mzdu — zaměstnanec ji musí znát.',
      end: 'Doplňte datum konce pro smlouvu na dobu určitou.',
      trial: (max: number, mgr: boolean) =>
        `Zákonné maximum zkušební doby je ${max} měsíce (§ 35 ZP).${mgr ? '' : ' U vedoucích zaměstnanců max. 8 měsíců.'}`,
    },
    en: {
      ico: 'Add the employer’s company ID (IČO) — required.',
      job: 'Job type/position is a mandatory element under Czech Labour Code § 34.',
      place: 'Place of work is mandatory under § 34.',
      start: 'Start date is mandatory under § 34.',
      pay: 'We recommend stating salary — the employee must know it.',
      end: 'Add the end date for a fixed-term contract.',
      trial: (max: number, mgr: boolean) =>
        `Maximum probation period is ${max} months (§ 35).${mgr ? '' : ' For managers, up to 8 months.'}`,
    },
    ua: {
      ico: 'Додайте IČO роботодавця — обов’язково.',
      job: 'Вид роботи (посада) — обов’язкова вимога § 34 трудового кодексу ЧР.',
      place: 'Місце виконання — обов’язкова вимога § 34.',
      start: 'День виходу на роботу — обов’язкова вимога § 34.',
      pay: 'Рекомендуємо вказати зарплату — працівник має її знати.',
      end: 'Додайте дату закінчення для строкового договору.',
      trial: (max: number, mgr: boolean) =>
        `Максимальний випробувальний строк — ${max} міс. (§ 35).${mgr ? '' : ' Для керівників — до 8 міс.'}`,
    },
  }[L];
  const warnings: RiskWarning[] = [];
  if (!form.employerIco) warnings.push({ text: m.ico, level: 'high' });
  if (!form.jobTitle) warnings.push({ text: m.job, level: 'high' });
  if (!form.workPlace) warnings.push({ text: m.place, level: 'high' });
  if (!form.startDate) warnings.push({ text: m.start, level: 'high' });
  if (!form.salary && !form.hourlyRate) warnings.push({ text: m.pay, level: 'medium' });
  if (form.employmentType === 'fixed' && !form.endDate) warnings.push({ text: m.end, level: 'high' });
  const maxTrial = form.isManager ? 8 : 4;
  if (Number(form.trialPeriodMonths) > maxTrial) {
    warnings.push({ text: m.trial(maxTrial, form.isManager), level: 'high' });
  }
  return warnings;
}

export function employmentValidationFields(locale: AppLocale): Record<string, string> {
  const L = loc(locale);
  const t = {
    cs: {
      employerName: 'název / jméno zaměstnavatele',
      employeeName: 'jméno zaměstnance',
      jobTitle: 'druh práce',
      workPlace: 'místo výkonu práce',
      startDate: 'den nástupu do práce',
      salary: 'výši mzdy / hodinové sazby',
    },
    en: {
      employerName: 'employer name',
      employeeName: 'employee name',
      jobTitle: 'job type',
      workPlace: 'place of work',
      startDate: 'start date',
      salary: 'salary or hourly rate',
    },
    ua: {
      employerName: 'назву роботодавця',
      employeeName: "ім'я працівника",
      jobTitle: 'вид роботи',
      workPlace: 'місце виконання',
      startDate: 'день виходу на роботу',
      salary: 'зарплату або погодинну ставку',
    },
  }[L];
  return t;
}

export function dppRiskWarnings(
  locale: AppLocale,
  form: { taskDescription: string; estimatedHours: string; totalRemuneration: string; hourlyRate: string },
): RiskWarning[] {
  const L = loc(locale);
  const m = {
    cs: {
      task: 'Popis pracovního úkolu je povinný.',
      hours: 'Doplňte počet hodin — limit je 300 hod./rok u jednoho zaměstnavatele.',
      over: 'Počet hodin překračuje zákonný limit 300 hod./rok (§ 75 ZP)!',
      pay: 'Doporučujeme doplnit odměnu.',
    },
    en: {
      task: 'Task description is required.',
      hours: 'Add estimated hours — limit is 300 hours/year per employer.',
      over: 'Hours exceed the statutory 300 hours/year cap (§ 75)!',
      pay: 'We recommend stating remuneration.',
    },
    ua: {
      task: 'Опис завдання обов’язковий.',
      hours: 'Додайте години — ліміт 300 год/рік у одного роботодавця.',
      over: 'Перевищено ліміт 300 год/рік (§ 75)!',
      pay: 'Рекомендуємо вказати винагороду.',
    },
  }[L];
  const warnings: RiskWarning[] = [];
  if (!form.taskDescription) warnings.push({ text: m.task, level: 'high' });
  if (!form.estimatedHours) warnings.push({ text: m.hours, level: 'medium' });
  if (Number(form.estimatedHours) > 300) warnings.push({ text: m.over, level: 'high' });
  if (!form.totalRemuneration && !form.hourlyRate) warnings.push({ text: m.pay, level: 'medium' });
  return warnings;
}

export function dppValidationFields(locale: AppLocale): Record<string, string> {
  const L = loc(locale);
  return {
    cs: { employerName: 'zaměstnavatele', employeeName: 'zaměstnance', taskDescription: 'popis úkolu' },
    en: { employerName: 'employer', employeeName: 'worker', taskDescription: 'task description' },
    ua: { employerName: 'роботодавця', employeeName: 'працівника', taskDescription: 'опис завдання' },
  }[L];
}

export function subleaseRiskWarnings(
  locale: AppLocale,
  form: {
    landlordId: string;
    tenantId: string;
    landlordConsent: string;
    consentDate: string;
    duration: string;
    endDate: string;
    depositAmount: string;
    rentAmount: string;
    allowAirbnb: boolean;
    flatUnitNumber: string;
    cadastralArea: string;
  },
): RiskWarning[] {
  const L = loc(locale);
  const m = {
    cs: {
      id: 'Doplňte rodná čísla / data narození smluvních stran. Zvýšíte tím vymahatelnost smlouvy.',
      consent: 'Podnájem bez souhlasu pronajímatele je protiprávní a může vést k výpovědi hlavního nájmu.',
      consentDate: 'Doplňte datum souhlasu pronajímatele k podnájmu.',
      end: 'U doby určité doplňte datum konce podnájmu.',
      deposit: 'Doporučená doplnění: Kauce by měla být alespoň v rozsahu měsíčního nájemného.',
      airbnb: 'Povolení dalšího podnájmu / Airbnb je rizikové a může porušovat podmínky hlavní nájemní smlouvy.',
      unit: 'Doplňte identifikaci bytu (číslo jednotky / katastrální území).',
    },
    en: {
      id: 'Add birth numbers / dates of birth for both parties — improves enforceability.',
      consent: 'Sublease without the landlord’s consent is unlawful and may terminate the main lease.',
      consentDate: 'Add the date of the landlord’s consent to sublease.',
      end: 'For a fixed term, add the sublease end date.',
      deposit: 'Recommended: deposit should be at least one month’s rent.',
      airbnb: 'Allowing further subletting / short-term rental may breach the main lease.',
      unit: 'Add flat unit identification (unit no. / cadastral area).',
    },
    ua: {
      id: 'Додайте ідентифікаційні дані сторін — підвищує виконуваність договору.',
      consent: 'Піднайм без згоди орендодавця незаконний і може призвести до розірвання основного договору.',
      consentDate: 'Додайте дату згоди орендодавця на піднайм.',
      end: 'Для строкового піднайму додайте дату закінчення.',
      deposit: 'Рекомендовано: кауція не менше місячної оренди.',
      airbnb: 'Дозвіл на Airbnb / повторний піднайм може порушувати основний договір.',
      unit: 'Додайте ідентифікацію квартири (номер одиниці / кадастр).',
    },
  }[L];
  const warnings: RiskWarning[] = [];
  if (!form.landlordId || !form.tenantId) warnings.push({ text: m.id, level: 'high' });
  if (form.landlordConsent === 'no') warnings.push({ text: m.consent, level: 'high' });
  if (form.landlordConsent === 'yes' && !form.consentDate) warnings.push({ text: m.consentDate, level: 'medium' });
  if (form.duration === 'fixed' && !form.endDate) warnings.push({ text: m.end, level: 'high' });
  if (form.depositAmount && Number(form.depositAmount) < Number(form.rentAmount)) {
    warnings.push({ text: m.deposit, level: 'medium' });
  }
  if (form.allowAirbnb) warnings.push({ text: m.airbnb, level: 'high' });
  if (!form.flatUnitNumber?.trim() || !form.cadastralArea?.trim()) {
    warnings.push({ text: m.unit, level: 'medium' });
  }
  return warnings;
}

export function subleaseValidationFields(locale: AppLocale): Record<string, string> {
  const L = loc(locale);
  return {
    cs: {
      landlordName: 'pronajímatele (podnájemce)',
      tenantName: 'podnájemce',
      flatAddress: 'adresu bytu',
      rentAmount: 'výši podnájemného',
    },
    en: {
      landlordName: 'sublessor (main tenant)',
      tenantName: 'subtenant',
      flatAddress: 'flat address',
      rentAmount: 'sublease rent',
    },
    ua: {
      landlordName: 'піднаймодавця',
      tenantName: 'підорендаря',
      flatAddress: 'адресу квартири',
      rentAmount: 'піднайм',
    },
  }[L];
}

export function poaRiskWarnings(
  locale: AppLocale,
  form: {
    principalName: string;
    principalId: string;
    agentName: string;
    agentId: string;
    poaType: string;
    customScope: string;
    validUntil: string;
    singleUse: boolean;
    needsNotarized: boolean;
  },
): RiskWarning[] {
  const L = loc(locale);
  const m = {
    cs: {
      principal: 'Doplňte identifikaci zmocnitele.',
      agent: 'Doplňte identifikaci zmocněnce.',
      scope: 'Doplňte rozsah zmocnění.',
      validity: 'Platnost plné moci není omezena (platí do odvolání).',
      notary: 'Pro nemovitosti a firmy doporučujeme úředně ověřený podpis (ověřená plná moc).',
    },
    en: {
      principal: 'Add principal identification.',
      agent: 'Add agent identification.',
      scope: 'Add the scope of authority.',
      validity: 'Validity is not limited (until revoked).',
      notary: 'For real estate and companies, a notarized signature is often required.',
    },
    ua: {
      principal: 'Додайте дані довірителя.',
      agent: 'Додайте дані повіреного.',
      scope: 'Додайте обсяг повноважень.',
      validity: 'Строк дії не обмежено (до відкликання).',
      notary: 'Для нерухомості та компаній часто потрібен нотаріальний підпис.',
    },
  }[L];
  const warnings: RiskWarning[] = [];
  if (!form.principalName || !form.principalId) warnings.push({ text: m.principal, level: 'high' });
  if (!form.agentName || !form.agentId) warnings.push({ text: m.agent, level: 'high' });
  if (form.poaType === 'general' && !form.customScope) warnings.push({ text: m.scope, level: 'high' });
  if (!form.validUntil && !form.singleUse) warnings.push({ text: m.validity, level: 'low' });
  if (form.needsNotarized) warnings.push({ text: m.notary, level: 'medium' });
  return warnings;
}

export function poaValidationFields(locale: AppLocale): Record<string, string> {
  const L = loc(locale);
  return {
    cs: { principalName: 'jméno zmocnitele', agentName: 'jméno zmocněnce', customScope: 'rozsah plné moci' },
    en: { principalName: 'principal name', agentName: 'agent name', customScope: 'scope of authority' },
    ua: { principalName: "ім'я довірителя", agentName: "ім'я повіреного", customScope: 'обсяг повноважень' },
  }[L];
}

export function carRiskWarnings(
  locale: AppLocale,
  form: {
    carVIN: string;
    sellerOP: string;
    buyerOP: string;
    sellerAddress: string;
    buyerAddress: string;
    handoverDate: string;
    handoverPlace: string;
    knownDefects: string;
    paymentMethod: string;
    bankAccount: string;
    isPledged: boolean;
    isInLeasing: boolean;
    hasThirdPartyRights: boolean;
    odometerGuaranteed: boolean;
    buyerInspectedVehicle: boolean;
  },
  priceNumber: number,
): { warnings: RiskWarning[]; checkoutBlocked: boolean } {
  const L = loc(locale);
  const m = {
    cs: {
      vin: 'Doporučujeme doplnit správný VIN (17 znaků) pro jednoznačnou identifikaci vozidla.',
      id: 'Doporučujeme doplnit přesnou identifikaci obou stran — OP a adresy.',
      handover: 'Doporučujeme doplnit datum a místo předání vozidla.',
      defects: 'Doporučujeme doplnit popis známých vad. Detailní popis chrání obě strany.',
      bank: 'Doplňte číslo bankovního účtu prodávajícího pro bankovní převod.',
      cash: 'Hotovostní platba nad 270 000 Kč není možná. Změňte způsob úhrady na bankovní převod.',
      legal: 'Doporučujeme doplnit detaily právního omezení nebo práv třetích osob.',
      odometer: 'Doporučujeme doplnit garanci stavu tachometru pro přesnější zachycení stavu vozidla.',
      inspect: 'Doporučujeme potvrdit, že se kupující seznámil s technickým stavem vozidla.',
    },
    en: {
      vin: 'Add a valid 17-character VIN for clear vehicle identification.',
      id: 'Add full identification for both parties — ID card and addresses.',
      handover: 'Add handover date and place.',
      defects: 'Describe known defects — protects both parties.',
      bank: 'Add the seller’s bank account for bank transfer.',
      cash: 'Cash payment over CZK 270,000 is not allowed. Use bank transfer.',
      legal: 'Add details of legal encumbrances or third-party rights.',
      odometer: 'Consider confirming odometer accuracy.',
      inspect: 'Confirm the buyer inspected the vehicle.',
    },
    ua: {
      vin: 'Додайте коректний VIN (17 символів) для ідентифікації авто.',
      id: 'Додайте повну ідентифікацію сторін — документ і адреси.',
      handover: 'Додайте дату та місце передачі авто.',
      defects: 'Опишіть відомі вади — захищає обидві сторони.',
      bank: 'Додайте банківський рахунок продавця для переказу.',
      cash: 'Готівка понад 270 000 Kč заборонена. Оберіть банківський переказ.',
      legal: 'Додайте деталі обтяжень або прав третіх осіб.',
      odometer: 'Рекомендуємо підтвердити показання одометра.',
      inspect: 'Підтвердіть, що покупець оглянув авто.',
    },
  }[L];
  const warnings: RiskWarning[] = [];
  if (!form.carVIN || form.carVIN.trim().length !== 17) warnings.push({ text: m.vin, level: 'high' });
  if (!form.sellerOP || !form.buyerOP || !form.sellerAddress || !form.buyerAddress) {
    warnings.push({ text: m.id, level: 'high' });
  }
  if (!form.handoverDate || !form.handoverPlace) warnings.push({ text: m.handover, level: 'medium' });
  if (!form.knownDefects.trim()) warnings.push({ text: m.defects, level: 'high' });
  if (form.paymentMethod === 'transfer' && !form.bankAccount.trim()) {
    warnings.push({ text: m.bank, level: 'high' });
  }
  if (form.paymentMethod === 'cash' && priceNumber > 270000) {
    warnings.push({ text: m.cash, level: 'high' });
  }
  if (form.isPledged || form.isInLeasing || form.hasThirdPartyRights) {
    warnings.push({ text: m.legal, level: 'high' });
  }
  if (!form.odometerGuaranteed) warnings.push({ text: m.odometer, level: 'medium' });
  if (!form.buyerInspectedVehicle) warnings.push({ text: m.inspect, level: 'low' });
  return {
    warnings,
    checkoutBlocked: form.paymentMethod === 'cash' && priceNumber > 270000,
  };
}

export function carValidationFields(locale: AppLocale): Record<string, string> {
  const L = loc(locale);
  return {
    cs: {
      sellerName: 'jméno prodávajícího',
      buyerName: 'jméno kupujícího',
      carMake: 'značku vozidla',
      carVIN: 'VIN kód',
      priceAmount: 'kupní cenu',
    },
    en: {
      sellerName: 'seller name',
      buyerName: 'buyer name',
      carMake: 'vehicle make',
      carVIN: 'VIN',
      priceAmount: 'purchase price',
    },
    ua: {
      sellerName: "ім'я продавця",
      buyerName: "ім'я покупця",
      carMake: 'марку авто',
      carVIN: 'VIN',
      priceAmount: 'ціну',
    },
  }[L];
}
