/**
 * Lease (nájemní smlouva) — full EN and UA translations.
 *
 * Mirrors buildLeaseContractSections in lib/contracts.ts section by section and
 * paragraph by paragraph, including every conditional branch, so the translated
 * annex is a complete rendering of the Czech contract, not a summary.
 * scripts/translation-parity-tests.ts enforces the alignment and completeness.
 * The Czech text remains the legally binding version.
 */
import type { ContractSection, StoredContractData } from '../contracts';
import { LEASE_MINOR_REPAIR_ANNUAL_PER_M2_CZK, LEASE_MINOR_REPAIR_SINGLE_LIMIT_CZK } from '../legal-constants-2026';
import { amt, buildBilingualTranslations, dateIn, disputeClauseIn, todayIn, txt, type ParaPair } from './helpers';

type L = 'en' | 'ua';

function shared(d: StoredContractData) {
  const propertyAddress = txt(d.propertyAddress || d.flatAddress);
  const utilitiesAmount = d.utilitiesAmount ?? d.utilityAmount ?? '';
  const paymentDay =
    d.paymentDay !== undefined && d.paymentDay !== null && String(d.paymentDay).trim() !== ''
      ? String(d.paymentDay).replace(/\D/g, '')
      : '5';
  const isFixedTerm = d.duration === 'fixed' && Boolean(d.endDate);
  const hasDeposit = d.depositAmount !== undefined && d.depositAmount !== null && String(d.depositAmount).trim() !== '' && Number(d.depositAmount) > 0;
  const hasUtilities = utilitiesAmount !== '' && utilitiesAmount !== undefined && utilitiesAmount !== null && Number(utilitiesAmount) > 0;
  const monthlyTotal = (Number(d.rentAmount || 0) + Number(utilitiesAmount || 0)).toString();
  const indexationRequested = d.includeInflationIndexation === true || d.rentIndexationMode === 'cpi' || d.rentIndexationMode === 'inflation';
  const depositMultiple = d.rentAmount && Number(d.rentAmount) > 0
    ? Math.round(Number(d.depositAmount) / Number(d.rentAmount))
    : null;
  return { propertyAddress, utilitiesAmount, paymentDay, isFixedTerm, hasDeposit, hasUtilities, monthlyTotal, indexationRequested, depositMultiple };
}

const MINOR_REPAIRS: Record<L, string> = {
  en: `The Tenant bears the ordinary maintenance of the flat and minor repairs connected with its use (§ 2257 of the Civil Code) to the extent laid down by Government Decree No. 308/2015 Coll., as amended. A repair counts as minor by cost if its cost does not exceed CZK ${LEASE_MINOR_REPAIR_SINGLE_LIMIT_CZK.toLocaleString('cs-CZ')}. The total annual limit of these costs is CZK ${LEASE_MINOR_REPAIR_ANNUAL_PER_M2_CZK} per m² of the floor area of the flat per calendar year.`,
  ua: `Орендар несе витрати на звичайне утримання квартири та дрібний ремонт, пов’язаний з її використанням (§ 2257 ЦК), в обсязі, встановленому Постановою уряду № 308/2015 Sb., з наступними змінами. Дрібним ремонтом за розміром витрат вважається ремонт, вартість якого не перевищує ${LEASE_MINOR_REPAIR_SINGLE_LIMIT_CZK.toLocaleString('cs-CZ')} крон. Загальний річний ліміт цих витрат становить ${LEASE_MINOR_REPAIR_ANNUAL_PER_M2_CZK} крон за м² підлогової площі квартири за календарний рік.`,
};

// ── EN ─────────────────────────────────────────────────────────────────────
function en(d: StoredContractData, hasPremium: boolean, includeLeaseHandoverProtocol: boolean): ParaPair[] {
  const s = shared(d);
  const useIndex = hasPremium && s.indexationRequested;
  const leaseDuration = d.leaseDuration
    ? txt(d.leaseDuration)
    : s.isFixedTerm
      ? `a fixed term, namely until ${dateIn('en', d.endDate)}`
      : 'an indefinite term';

  const premium: ParaPair[] = hasPremium ? [
    {
      title: 'XI. OPERATIONAL AND DOCUMENTATION ARRANGEMENTS',
      body: [
        'All facts relevant to the creation, change or termination of rights and obligations under this lease (reports of defects and emergencies, handover and return of keys, changes in the members of the household, agreements on handover dates and records of repairs carried out) shall be confirmed between the parties in a verifiable manner — preferably by e-mail correspondence to the addresses stated in Art. X, or alternatively by registered mail.',
        'On termination of the lease, a handover and acceptance protocol (Annex No. 1 to this Agreement) shall be drawn up for the return of the flat, comprising: meter readings as at the handover date, a list of the keys and access cards returned, an inventory of the equipment returned and an assessment of the condition of each room. Photographs taken may be attached as an integral part of the protocol.',
        'If a dispute arises about the extent of damage exceeding ordinary wear and tear, the parties undertake first to seek an amicable determination of the amount of damage. If they do not reach agreement, they are entitled to call in an expert witness or appraiser; the costs of the assessment shall be borne by the party whose claim proves unjustified.',
        'The Tenant is liable for damage caused to the flat or to the common parts of the building by persons to whom the Tenant allowed access to the flat.',
      ],
    },
    {
      title: 'XII. SPECIAL PROVISIONS ON TERMINATION OF THE LEASE',
      body: [
        'No later than 5 working days before the planned end of the lease, the parties shall confirm in writing the exact date and time of the formal handover of the flat. If no agreement on the date is reached, the Landlord is entitled to set the date unilaterally within working hours, with at least 3 working days’ notice.',
        'The Landlord shall return the deposit or its unused part in accordance with Art. V(3) of this Agreement. The return of the deposit shall always be accompanied by a written settlement statement specifying each claim applied as to its ground, extent and amount. Without such a statement the deposit or any part of it may not be withheld unilaterally beyond the statutory framework.',
        'If the condition of the flat after the end of the lease requires repairs or professional cleaning at the Tenant’s expense, the Landlord shall notify the Tenant in writing before the work begins, state the expected costs and give the Tenant a reasonable period to comment of at least 5 working days. This does not affect the Landlord’s rights in the case of urgent or emergency repairs.',
      ],
    },
  ] : [];

  const sections: ParaPair[] = [
    {
      title: 'PREAMBLE',
      body: [
        'This lease agreement (the "Agreement") is concluded under § 2201 et seq. of Act No. 89/2012 Coll., the Civil Code, as amended (the "Civil Code"), and in accordance with § 2235 et seq. of the Civil Code (lease of a flat).',
        `Date of conclusion of the Agreement: ${d.contractDate ? dateIn('en', d.contractDate) : todayIn('en')}`,
      ],
    },
    {
      title: 'I. CONTRACTING PARTIES',
      body: [
        `Landlord: ${txt(d.landlordName)}, date of birth / Company ID: ${txt(d.landlordId)}, residence / registered office: ${txt(d.landlordAddress)}`,
        d.landlordOP ? `Landlord's identity card no.: ${txt(d.landlordOP)}` : '',
        d.landlordEmail ? `Landlord's e-mail: ${txt(d.landlordEmail)}` : '',
        d.landlordPhone ? `Landlord's phone: ${txt(d.landlordPhone)}` : '',
        `Tenant: ${txt(d.tenantName)}, date of birth / Company ID: ${txt(d.tenantId)}, residence / registered office: ${txt(d.tenantAddress)}`,
        d.tenantOP ? `Tenant's identity card no.: ${txt(d.tenantOP)}` : '',
        d.tenantEmail ? `Tenant's e-mail: ${txt(d.tenantEmail)}` : '',
        d.tenantPhone ? `Tenant's phone: ${txt(d.tenantPhone)}` : '',
      ],
    },
    {
      title: 'II. SUBJECT OF THE LEASE',
      body: [
        `The Landlord leaves to the Tenant, for consideration, for temporary use the flat located at: ${s.propertyAddress}.`,
        `Layout: ${txt(d.propertyLayout || d.flatLayout, 'not specified')}.`,
        d.flatUnitNumber ? `Flat unit number: ${txt(d.flatUnitNumber)}.` : '',
        d.cadastralArea ? `Cadastral area: ${txt(d.cadastralArea)}, parcel number: ${txt(d.parcelNumber, 'not specified')}.` : '',
        d.ownershipSheet ? `Title deed (list vlastnictví) no.: ${txt(d.ownershipSheet)}.` : '',
        d.floor ? `Floor: ${txt(d.floor)}.` : '',
        (d.flatArea || d.approxArea) ? `Floor area of the flat: ${txt(d.flatArea || d.approxArea)} m².` : '',
        'The Landlord declares that it is entitled to leave the flat to the Tenant for use and that it is not aware of any legal or factual obstacles that would prevent the Tenant from properly using the flat under this Agreement.',
        'The Tenant confirms having become acquainted with the condition of the subject of the lease before signing this Agreement and takes it over in that condition, as described in detail in the attached handover protocol.',
      ],
    },
    {
      title: 'III. TERM OF THE LEASE',
      body: [
        `The lease is agreed for ${leaseDuration}.`,
        d.startDate ? `Commencement of the lease: ${dateIn('en', d.startDate)}.` : '',
        d.handoverDate ? `Date of physical handover of the flat: ${dateIn('en', d.handoverDate)}.` : '',
        s.isFixedTerm
          ? 'The lease ends on the expiry of the agreed term unless the contracting parties agree otherwise in writing. Notice of termination before the expiry of the agreed term is possible only on the grounds laid down by law or by this Agreement. If the Tenant continues to use the flat for at least three months after the end of the lease and the Landlord does not call on the Tenant in writing during that time to leave the flat, the lease is deemed renewed for the same term (max. 2 years) and on the same terms (§ 2285 of the Civil Code).'
          : 'The Tenant may terminate the lease by giving three months’ notice without stating a reason. The Landlord may terminate the lease with a three-month notice period only on the grounds laid down by law (§ 2288 of the Civil Code).',
      ],
    },
    {
      title: 'IV. RENT AND PAYMENTS FOR SERVICES CONNECTED WITH THE USE OF THE FLAT',
      body: [
        `The monthly rent is CZK ${amt(d.rentAmount)}.`,
        s.hasUtilities
          ? `The monthly advance payments for services connected with the use of the flat are CZK ${amt(s.utilitiesAmount)}.`
          : 'Monthly advance payments for services connected with the use of the flat have not been separately agreed; the Tenant pays for the services directly to the providers or on the basis of the Landlord’s statement of account.',
        s.hasUtilities ? `The total monthly payment (rent + advance payments) is CZK ${amt(s.monthlyTotal)}.` : '',
        `${s.hasUtilities ? 'The rent and the advance payments for services are' : 'The rent is'} payable in advance, always no later than day ${s.paymentDay} of the relevant month.`,
        d.bankAccount ? `Landlord's bank account: ${txt(d.bankAccount)}.` : '',
        d.variableSymbol ? `Variable symbol: ${txt(d.variableSymbol)}.` : '',
        d.utilitiesIncludedText
          ? `Specification of the services and advance payments included: ${txt(d.utilitiesIncludedText)}.`
          : s.hasUtilities
            ? 'The advance payments for services cover: water and sewage, heating and hot water, common areas and waste — according to the actual costs of the building manager or the Landlord.'
            : '',
        s.hasUtilities ? 'The Landlord shall once a year settle the actual costs of the services connected with the use of the flat and deliver the statement to the Tenant within 4 months after the end of the settlement period (§ 7 of Act No. 67/2013 Coll.).' : '',
        useIndex
          ? 'The contracting parties agree that, always as of 1 April of each calendar year, the Landlord is entitled to increase the rent unilaterally by the rate of inflation expressed as the increase in the average annual consumer price index for the preceding calendar year, as published by the Czech Statistical Office. Notice of the rent increase must be delivered to the Tenant in writing no later than 30 days before the first due date of the rent so increased.'
          : 'The Landlord may propose to the Tenant in writing an increase of the rent in accordance with the law, in particular with regard to the customary rent in the locality and the limits arising from § 2249 of the Civil Code. If the parties do not agree on the rent increase, the relevant provisions of the Civil Code apply.',
        'Electricity and gas taken directly by the Tenant under the Tenant’s own contract with the supplier are not part of the above advance payments for services and are paid by the Tenant separately.',
        'If the Tenant is late in paying the rent or an advance payment for services, the Landlord is entitled to claim statutory default interest at the rate set by Government Decree No. 351/2013 Coll., from the due date until the date of payment.',
      ],
    },
    {
      title: 'V. SECURITY DEPOSIT',
      body: s.hasDeposit
        ? [
            `Before taking over the flat (at the latest when signing the Agreement), the Tenant shall pay the Landlord a monetary security deposit of CZK ${amt(d.depositAmount)}${s.depositMultiple !== null ? ` (i.e. ${s.depositMultiple}× the monthly rent)` : ''}.`,
            'The deposit secures the Landlord’s claims arising from the lease, in particular unpaid rent, advance payments for services, compensation for damage and the costs of repairing damage to the flat beyond ordinary wear and tear.',
            'On termination of the lease, the Landlord shall return the deposit or its unused part to the Tenant together with interest at the statutory rate (§ 2254(2) of the Civil Code), after deducting the Landlord’s proven and duly specified claims. The contracting parties recommend agreeing that the Landlord will hand over the settlement of the deposit without undue delay after the flat has been vacated and the condition of the premises returned has been established.',
            'The Landlord is entitled to set off its due and duly specified claims arising from the lease against the deposit. The Landlord shall notify the Tenant of any set-off in writing without undue delay and attach an overview of the items set off.',
            'The monetary deposit together with any right of the Landlord to a contractual penalty may not exceed in total three times the monthly rent (§ 2254 of the Civil Code).',
          ]
        : [
            'No monetary security deposit has been agreed between the contracting parties.',
          ],
    },
    {
      title: 'VI. RULES FOR USE OF THE FLAT',
      body: [
        d.maxOccupants ? `The maximum number of persons permanently using the flat is ${txt(d.maxOccupants)} (including the Tenant). The Tenant shall notify the Landlord without undue delay of any increase in the number of persons living in the flat; the Landlord may require only such a number of persons as is reasonable with regard to the size of the flat and customary hygienic conditions.` : '',
        `Pets: ${d.allowPets ? 'the keeping of animals is expressly acknowledged by the parties; the Tenant is liable for all damage and increased costs caused by keeping them' : 'the Tenant is entitled to keep an animal in the flat provided that it does not cause the Landlord or the other residents of the building difficulties that are unreasonable in view of the conditions in the building; the Tenant shall inform the Landlord in advance about keeping an animal'}.`,
        `Smoking in the flat and in the common areas: ${d.allowSmoking ? 'permitted' : 'prohibited'}.`,
        `Short-term paid accommodation of third parties through platforms (Airbnb, Booking.com, etc.) is regarded as a sublease and is ${d.allowAirbnb ? 'agreed as permitted; the Tenant is liable for all damage and shall comply with the statutory obligations of an accommodation provider' : 'prohibited without the Landlord’s prior written consent'}.`,
        `Business and work activities in the flat: ${d.businessUseAllowed ? 'permitted provided that they do not increase the wear and tear of the flat or the building beyond the usual extent and do not disturb the other residents of the building' : 'permitted only if they do not increase the wear and tear of the flat or the building beyond the usual extent and do not disturb the other residents; activities that do not meet these criteria require the Landlord’s prior written consent (§ 2255 of the Civil Code)'}.`,
        d.inspectionAllowed
          ? 'After prior written (e-mail) notice given at least 24 hours in advance, the Landlord is entitled to inspect the condition of the flat; the inspection must not be carried out in an inappropriate manner (§ 2219 of the Civil Code).'
          : 'The Landlord’s right to enter the flat is governed by the statutory rules (§ 2219 of the Civil Code).',
        d.strictPenalties
          ? 'The Landlord is entitled to reprimand the Tenant in writing for serious or repeated breaches of obligations (in particular disturbing the peace, soiling the common areas, damaging the property) and to call on the Tenant to remedy the situation. If the Tenant does not remedy the defective state, the Landlord may give notice of termination of the lease for gross breach of obligations (§ 2288(1)(a) of the Civil Code) or — where the breach is of particularly serious intensity harming the Landlord or other residents of the building — notice without a notice period (§ 2291 of the Civil Code).'
          : '',
        'The Tenant shall: properly maintain the flat and its equipment in working order, report defects and emergencies to the Landlord without undue delay, allow necessary repairs, pay for minor repairs and the costs of ordinary maintenance (§ 2257 of the Civil Code), and not carry out any structural alterations without the Landlord’s consent.',
        'The Tenant is entitled to sublet part of the flat to another person if the Tenant permanently lives in the flat; the Tenant shall inform the Landlord of such a sublease without undue delay. The Tenant may sublet the flat as a whole, or part of it where the Tenant does not permanently live in the flat, only with the Landlord’s prior written consent.',
        'At the Landlord’s written request, the Tenant shall within 7 days prove the existence of valid household insurance covering liability for damage caused to third parties in connection with the use of the flat (recommended liability limit of at least CZK 500,000). If the Tenant does not submit proof of insurance within that period, the Landlord is entitled to repeat the written request; repeated failure to comply with the request is deemed a breach of obligations under the Agreement.',
      ],
    },
    {
      title: 'VII. HANDOVER OF THE FLAT AND HANDOVER PROTOCOL',
      body: [
        d.keysCount ? `The Landlord shall hand over to the Tenant ${txt(d.keysCount)} keys (including the keys to the entrance door, the mailbox and other accessories as listed in the handover protocol).` : '',
        'The Tenant is not entitled to make copies of the keys without the Landlord’s prior consent. In the event of loss or theft of the keys, the Tenant shall notify the Landlord in writing without undue delay. In such a case, the costs of replacing the lock cylinder or the lock shall be borne by the Tenant.',
        d.electricityMeter
          ? `Electricity meter reading at handover: ${txt(d.electricityMeter)} kWh${d.electricityMeterSerial ? `, serial number ${txt(d.electricityMeterSerial)}` : ''}.`
          : '',
        d.gasMeter
          ? `Gas meter reading at handover: ${txt(d.gasMeter)} m³${d.gasMeterSerial ? `, serial number ${txt(d.gasMeterSerial)}` : ''}.`
          : '',
        d.waterMeter
          ? `Water meter reading at handover: ${txt(d.waterMeter)} m³${d.waterMeterSerial ? `, serial number ${txt(d.waterMeterSerial)}` : ''}.`
          : '',
        d.hotWaterMeter
          ? `Hot water meter reading at handover: ${txt(d.hotWaterMeter)} m³${d.hotWaterMeterSerial ? `, serial number ${txt(d.hotWaterMeterSerial)}` : ''}.`
          : '',
        d.equipmentList ? `Inventory of the furnishings and equipment handed over: ${txt(d.equipmentList)}.` : '',
        d.knownDefects
          ? `Defects and faults acknowledged by the Landlord: ${txt(d.knownDefects)}.`
          : 'The flat is handed over without any expressly notified defects beyond ordinary wear and tear.',
        includeLeaseHandoverProtocol
          ? 'The detailed handover protocol is Annex No. 1 to this Agreement and forms an integral part of it.'
          : '',
      ],
    },
    {
      title: 'VIII. TERMINATION OF THE LEASE AND RETURN OF THE FLAT',
      body: [
        d.duration === 'indefinite'
          ? 'A lease for an indefinite term may be terminated by notice (§ 2231, § 2286 et seq. of the Civil Code), by agreement or in another manner laid down by law.'
          : 'A lease for a fixed term ends on the expiry of the agreed term. Both the Landlord and the Tenant may terminate the lease by notice on the grounds laid down by law.',
        'On termination of the lease, the Tenant shall: (a) vacate the flat and remove all of the Tenant’s movable property, (b) return the flat in the condition in which the Tenant took it over, taking into account ordinary wear and tear, (c) hand over all keys to the Landlord, and (d) allow the formal handover to take place.',
        `If the Tenant does not return the flat on the day the lease ends, the Landlord is entitled, until the flat is actually returned, to compensation equal to the agreed rent (§ 2295 of the Civil Code); for each day a proportionate part of the monthly rent applies. Specified amount agreed: ${txt(d.lateVacatePenalty, '1/30 of the monthly rent per day')}.`,
      ],
    },
    {
      title: 'IX. EMERGENCIES AND REPAIRS',
      body: [
        'The Tenant shall notify the Landlord immediately, at the latest within 24 hours, of any emergency or defect that could cause damage (water leak, heating failure, electrical installation fault, etc.).',
        'The Tenant shall secure emergencies to the necessary extent even without the Landlord’s prior consent and inform the Landlord immediately.',
        MINOR_REPAIRS.en,
        'Major repairs and renovations are paid for by the Landlord unless the damage was caused by the Tenant or by persons to whom the Tenant allowed access to the flat.',
      ],
    },
    {
      title: 'X. DELIVERY OF DOCUMENTS',
      body: [
        `Documents for the Landlord shall be delivered to the address: ${txt(d.landlordAddress)}${d.landlordEmail ? `, or to the e-mail: ${txt(d.landlordEmail)}` : ''}.`,
        `Documents for the Tenant shall be delivered to the address of the leased flat: ${s.propertyAddress}${d.tenantEmail ? `, or to the e-mail: ${txt(d.tenantEmail)}` : ''}.`,
        'Legal acts aimed at changing or terminating the lease shall be delivered in person, by registered mail, via a data box or in another verifiable manner. E-mail may be used in particular for routine operational communication and for sending notices, if the other party has provided such an address and uses this form of communication on a long-term basis.',
        'If the addressee refuses to accept a consignment, it is deemed delivered on the day of refusal. If the addressee does not collect a deposited consignment within the period set by the carrier, it is deemed delivered on the last day of the storage period, where the law and the nature of the document permit.',
      ],
    },
    ...premium,
    {
      title: `${hasPremium ? 'XIII' : 'XI'}. FINAL PROVISIONS`,
      body: [
        'This Agreement is governed by the law of the Czech Republic, in particular Act No. 89/2012 Coll., the Civil Code, as amended, and Act No. 67/2013 Coll. (settlement of services).',
        disputeClauseIn('en', d),
        'The Agreement is executed in two counterparts; the Landlord and the Tenant each receive one counterpart.',
        'Amendments are valid only in the form of written, numbered and signed addenda.',
        'The invalidity of any individual provision of the Agreement does not affect the validity of the other provisions.',
        includeLeaseHandoverProtocol
          ? 'Annex No. 1 to the Agreement is the handover protocol, which forms an integral part of the Agreement.'
          : '',
        'A change in the owner of the leased property does not in itself terminate the lease; the acquirer assumes the rights and obligations of the Landlord from the date of acquiring ownership (§ 2221 of the Civil Code).',
        'Neither contracting party is liable for failure to perform non-monetary obligations caused by force majeure (vis maior), i.e. an extraordinary, unforeseeable and insurmountable event (§ 2913(2) of the Civil Code). Force majeure does not apply to the obligation to pay a sum of money. A party affected by force majeure shall inform the other party in writing without delay and resume performance without delay once the obstacle has ceased.',
      ],
    },
    { title: `${hasPremium ? 'XIV' : 'XII'}. SIGNATURES`, body: [] },
  ];

  if (includeLeaseHandoverProtocol) {
    sections.push({ title: 'ANNEX NO. 1 – HANDOVER PROTOCOL TO THE LEASE AGREEMENT', body: [] });
  }
  return sections;
}

// ── UA ─────────────────────────────────────────────────────────────────────
function ua(d: StoredContractData, hasPremium: boolean, includeLeaseHandoverProtocol: boolean): ParaPair[] {
  const s = shared(d);
  const useIndex = hasPremium && s.indexationRequested;
  const leaseDuration = d.leaseDuration
    ? txt(d.leaseDuration)
    : s.isFixedTerm
      ? `визначений строк, а саме до ${dateIn('ua', d.endDate)}`
      : 'невизначений строк';

  const premium: ParaPair[] = hasPremium ? [
    {
      title: 'XI. ОПЕРАЦІЙНІ ТА ДОКУМЕНТАЦІЙНІ ДОМОВЛЕНОСТІ',
      body: [
        'Усі факти, суттєві для виникнення, зміни або припинення прав і обов’язків за цими орендними відносинами (повідомлення про дефекти та аварії, передача й повернення ключів, зміни у складі домогосподарства, домовленості про дати передачі квартири та записи про виконаний ремонт), сторони підтверджуватимуть у доказовий спосіб — переважно електронною поштою на адреси, зазначені у ст. X, або рекомендованим листом.',
        'Після припинення оренди буде складено акт приймання-передачі квартири (Додаток № 1 до цього Договору), який містить: показники лічильників на дату передачі, перелік переданих ключів і карток доступу, опис переданого обладнання та оцінку стану кожної кімнати. Зроблені фотографії можуть бути долучені як невід’ємна частина акта.',
        'Якщо виникне спір щодо обсягу пошкоджень, що перевищують звичайне зношення, сторони зобов’язуються насамперед докласти зусиль для мирного визначення розміру шкоди. Якщо згоди не буде досягнуто, вони мають право залучити судового експерта або оцінювача; витрати на оцінку несе сторона, чиє твердження виявиться необґрунтованим.',
        'Орендар відповідає за шкоду, заподіяну квартирі або спільним частинам будинку особами, яким він надав доступ до квартири.',
      ],
    },
    {
      title: 'XII. ОСОБЛИВІ ПОЛОЖЕННЯ ПРИ ПРИПИНЕННІ ОРЕНДИ',
      body: [
        'Не пізніше ніж за 5 робочих днів до запланованого припинення оренди сторони письмово підтвердять точну дату й час оформленої актом передачі квартири. Якщо згоди щодо дати не буде досягнуто, орендодавець має право визначити дату в односторонньому порядку в робочий час, повідомивши про це щонайменше за 3 робочі дні.',
        'Орендодавець зобов’язаний повернути заставу або її невикористану частину в порядку, передбаченому п. 3 ст. V Договору. Повернення застави завжди супроводжується письмовим розрахунком, у якому кожну заявлену вимогу конкретизовано за підставою, обсягом і розміром. Без такого розрахунку заставу або її частину не можна в односторонньому порядку утримувати понад межі, встановлені законом.',
        'Якщо стан квартири після припинення оренди потребує ремонту або професійного прибирання за рахунок орендаря, орендодавець письмово повідомить про це орендаря до початку робіт, зазначить очікувані витрати та надасть йому розумний строк для висловлення позиції — щонайменше 5 робочих днів. Це не зачіпає прав орендодавця у разі невідкладного або аварійного ремонту.',
      ],
    },
  ] : [];

  const sections: ParaPair[] = [
    {
      title: 'ПРЕАМБУЛА',
      body: [
        'Цей договір оренди (далі — «Договір») укладається відповідно до § 2201 і наступних Закону № 89/2012 Sb., Цивільний кодекс, з наступними змінами (далі — «ЦК»), та згідно з § 2235 і наступними ЦК (оренда квартири).',
        `Дата укладення Договору: ${d.contractDate ? dateIn('ua', d.contractDate) : todayIn('ua')}`,
      ],
    },
    {
      title: 'I. СТОРОНИ ДОГОВОРУ',
      body: [
        `Орендодавець: ${txt(d.landlordName)}, дата народження / IČO: ${txt(d.landlordId)}, місце проживання / місцезнаходження: ${txt(d.landlordAddress)}`,
        d.landlordOP ? `Номер посвідчення особи орендодавця: ${txt(d.landlordOP)}` : '',
        d.landlordEmail ? `E-mail орендодавця: ${txt(d.landlordEmail)}` : '',
        d.landlordPhone ? `Телефон орендодавця: ${txt(d.landlordPhone)}` : '',
        `Орендар: ${txt(d.tenantName)}, дата народження / IČO: ${txt(d.tenantId)}, місце проживання / місцезнаходження: ${txt(d.tenantAddress)}`,
        d.tenantOP ? `Номер посвідчення особи орендаря: ${txt(d.tenantOP)}` : '',
        d.tenantEmail ? `E-mail орендаря: ${txt(d.tenantEmail)}` : '',
        d.tenantPhone ? `Телефон орендаря: ${txt(d.tenantPhone)}` : '',
      ],
    },
    {
      title: 'II. ПРЕДМЕТ ОРЕНДИ',
      body: [
        `Орендодавець передає орендарю за плату в тимчасове користування квартиру за адресою: ${s.propertyAddress}.`,
        `Планування: ${txt(d.propertyLayout || d.flatLayout, 'не зазначено')}.`,
        d.flatUnitNumber ? `Номер квартири (житлової одиниці): ${txt(d.flatUnitNumber)}.` : '',
        d.cadastralArea ? `Кадастрова територія: ${txt(d.cadastralArea)}, номер земельної ділянки: ${txt(d.parcelNumber, 'не зазначено')}.` : '',
        d.ownershipSheet ? `Аркуш власності (list vlastnictví) №: ${txt(d.ownershipSheet)}.` : '',
        d.floor ? `Поверх: ${txt(d.floor)}.` : '',
        (d.flatArea || d.approxArea) ? `Підлогова площа квартири: ${txt(d.flatArea || d.approxArea)} м².` : '',
        'Орендодавець заявляє, що має право передати квартиру в користування орендарю і що йому не відомі правові чи фактичні перешкоди, які б заважали належному користуванню квартирою орендарем відповідно до цього Договору.',
        'Орендар підтверджує, що до підписання Договору ознайомився зі станом предмета оренди та приймає його в цьому стані, докладно описаному в доданому акті приймання-передачі.',
      ],
    },
    {
      title: 'III. СТРОК ОРЕНДИ',
      body: [
        `Оренда укладається на ${leaseDuration}.`,
        d.startDate ? `Початок оренди: ${dateIn('ua', d.startDate)}.` : '',
        d.handoverDate ? `Дата фактичної передачі квартири: ${dateIn('ua', d.handoverDate)}.` : '',
        s.isFixedTerm
          ? 'Оренда припиняється із закінченням погодженого строку, якщо сторони письмово не домовляться інакше. Відмова від оренди до закінчення погодженого строку можлива лише з підстав, установлених законом або цим Договором. Якщо орендар продовжує користуватися квартирою щонайменше три місяці після припинення оренди, а орендодавець протягом цього часу письмово не вимагає від нього залишити квартиру, вважається, що оренду укладено знову на той самий строк (максимум 2 роки) і на тих самих умовах (§ 2285 ЦК).'
          : 'Орендар може відмовитися від оренди з тримісячним строком попередження без зазначення причини. Орендодавець може відмовитися від оренди з тримісячним строком попередження лише з підстав, установлених законом (§ 2288 ЦК).',
      ],
    },
    {
      title: 'IV. ОРЕНДНА ПЛАТА ТА ПЛАТЕЖІ ЗА ПОСЛУГИ, ПОВ’ЯЗАНІ З КОРИСТУВАННЯМ КВАРТИРОЮ',
      body: [
        `Щомісячна орендна плата становить ${amt(d.rentAmount)} крон.`,
        s.hasUtilities
          ? `Щомісячні авансові платежі за послуги, пов’язані з користуванням квартирою, становлять ${amt(s.utilitiesAmount)} крон.`
          : 'Щомісячні авансові платежі за послуги, пов’язані з користуванням квартирою, окремо не погоджено; орендар оплачує послуги самостійно безпосередньо постачальникам або на підставі розрахунку орендодавця.',
        s.hasUtilities ? `Загальний щомісячний платіж (орендна плата + авансові платежі) становить ${amt(s.monthlyTotal)} крон.` : '',
        `${s.hasUtilities ? 'Орендна плата та авансові платежі за послуги сплачуються' : 'Орендна плата сплачується'} наперед щоразу до ${s.paymentDay}-го числа відповідного місяця.`,
        d.bankAccount ? `Банківський рахунок орендодавця: ${txt(d.bankAccount)}.` : '',
        d.variableSymbol ? `Варіабельний символ: ${txt(d.variableSymbol)}.` : '',
        d.utilitiesIncludedText
          ? `Перелік включених послуг і авансових платежів: ${txt(d.utilitiesIncludedText)}.`
          : s.hasUtilities
            ? 'Авансові платежі за послуги охоплюють: водопостачання та водовідведення, опалення та гарячу воду, місця загального користування, вивезення відходів — відповідно до фактичних витрат управителя будинку або орендодавця.'
            : '',
        s.hasUtilities ? 'Орендодавець зобов’язаний один раз на рік здійснити розрахунок фактичних витрат на послуги, пов’язані з користуванням квартирою, і доставити його орендарю протягом 4 місяців після закінчення розрахункового періоду (§ 7 Закону № 67/2013 Sb.).' : '',
        useIndex
          ? 'Сторони домовляються, що орендодавець має право щороку станом на 1 квітня календарного року в односторонньому порядку підвищити орендну плату на рівень інфляції, виражений приростом середньорічного індексу споживчих цін за попередній календарний рік, оприлюдненого Чеським статистичним управлінням. Повідомлення про підвищення орендної плати має бути доставлене орендарю письмово не пізніше ніж за 30 днів до першого строку сплати підвищеної орендної плати.'
          : 'Орендодавець може письмово запропонувати орендарю підвищення орендної плати відповідно до закону, зокрема з урахуванням звичайної орендної плати в місцевості та обмежень, що випливають із § 2249 ЦК. Якщо сторони не домовляться про підвищення орендної плати, застосовуються відповідні положення Цивільного кодексу.',
        'Електроенергія та газ, які орендар отримує безпосередньо на підставі власного договору з постачальником, не входять до зазначених авансових платежів за послуги й оплачуються орендарем окремо.',
        'У разі прострочення орендарем сплати орендної плати або авансового платежу за послуги орендодавець має право вимагати встановлених законом процентів за прострочення в розмірі, визначеному Постановою уряду № 351/2013 Sb., з дня настання строку платежу до дня оплати.',
      ],
    },
    {
      title: 'V. ГРОШОВА ЗАСТАВА (КАУЦІЯ)',
      body: s.hasDeposit
        ? [
            `До прийняття квартири (не пізніше дня підписання Договору) орендар зобов’язаний внести орендодавцю грошову заставу в розмірі ${amt(d.depositAmount)} крон${s.depositMultiple !== null ? ` (тобто ${s.depositMultiple}× щомісячна орендна плата)` : ''}.`,
            'Застава забезпечує вимоги орендодавця, що виникають з оренди, зокрема щодо несплаченої орендної плати, авансових платежів за послуги, відшкодування шкоди та витрат на усунення пошкоджень квартири понад звичайне зношення.',
            'Після припинення оренди орендодавець зобов’язаний повернути орендарю заставу або її невикористану частину разом із процентами за встановленою законом ставкою (§ 2254 ч. 2 ЦК) після вирахування доведених і належним чином конкретизованих вимог орендодавця. Сторони рекомендовано домовляються, що орендодавець передасть розрахунок застави без зайвої затримки після звільнення квартири та встановлення стану переданих приміщень.',
            'Орендодавець має право зарахувати в рахунок застави свої строкові та належним чином конкретизовані вимоги, що виникли з оренди. Про здійснене зарахування він зобов’язаний без зайвої затримки письмово повідомити орендаря та додати перелік зарахованих позицій.',
            'Грошова застава разом із можливим правом орендодавця на сплату договірного штрафу в сукупності не може перевищувати трикратного розміру щомісячної орендної плати (§ 2254 ЦК).',
          ]
        : [
            'Грошову заставу (кауцію) між сторонами договору не погоджено.',
          ],
    },
    {
      title: 'VI. ПРАВИЛА КОРИСТУВАННЯ КВАРТИРОЮ',
      body: [
        d.maxOccupants ? `Максимальна кількість осіб, які постійно користуються квартирою, становить ${txt(d.maxOccupants)} (включно з орендарем). Орендар зобов’язаний без зайвої затримки повідомити орендодавця про збільшення кількості осіб, які проживають у квартирі; орендодавець може вимагати лише такої кількості осіб, яка відповідає розміру квартири та звичайним гігієнічним умовам.` : '',
        `Домашні тварини: ${d.allowPets ? 'утримання тварин сторони прямо взяли до відома; орендар відповідає за будь-яку шкоду та підвищені витрати, спричинені утриманням тварин' : 'орендар має право утримувати в квартирі тварину, якщо цим не завдає орендодавцю чи іншим мешканцям будинку незручностей, непропорційних умовам у будинку; про утримання тварини він зобов’язаний заздалегідь повідомити орендодавця'}.`,
        `Куріння в квартирі та в місцях загального користування: ${d.allowSmoking ? 'дозволено' : 'заборонено'}.`,
        `Короткострокове платне розміщення третіх осіб через платформи (Airbnb, Booking.com тощо) вважається піднаймом і ${d.allowAirbnb ? 'погоджене як дозволене; орендар відповідає за будь-яку шкоду та зобов’язаний виконувати встановлені законом обов’язки особи, що надає послуги з розміщення' : 'заборонене без попередньої письмової згоди орендодавця'}.`,
        `Підприємницька та робоча діяльність у квартирі: ${d.businessUseAllowed ? 'дозволена за умови, що вона не збільшує зношення квартири чи будинку понад звичайну міру та не турбує інших мешканців будинку' : 'допускається лише тоді, коли вона не збільшує зношення квартири чи будинку понад звичайну міру та не турбує інших мешканців; діяльність, що не відповідає цим критеріям, потребує попередньої письмової згоди орендодавця (§ 2255 ЦК)'}.`,
        d.inspectionAllowed
          ? 'Орендодавець має право після попереднього письмового (електронного) повідомлення, надісланого щонайменше за 24 години, перевірити стан квартири; перевірка не може здійснюватися неналежним чином (§ 2219 ЦК).'
          : 'Право орендодавця входити до квартири регулюється законом (§ 2219 ЦК).',
        d.strictPenalties
          ? 'Орендодавець має право письмово вказати орендарю на серйозне або повторне порушення обов’язків (зокрема порушення спокою, забруднення місць загального користування, пошкодження нерухомості) та вимагати його усунення. Якщо орендар не усуне порушення, орендодавець може відмовитися від оренди з причини грубого порушення обов’язків (§ 2288 ч. 1 п. a) ЦК) або — якщо порушення має особливо серйозний характер і завдає шкоди орендодавцю чи іншим мешканцям будинку — без строку попередження (§ 2291 ЦК).'
          : '',
        'Орендар зобов’язаний: належним чином утримувати квартиру та обладнання в робочому стані, без зайвої затримки повідомляти орендодавця про дефекти та аварії, забезпечувати можливість необхідного ремонту, оплачувати дрібний ремонт і витрати на звичайне утримання (§ 2257 ЦК), не здійснювати будівельних змін без згоди орендодавця.',
        'Орендар має право передати частину квартири в піднайм іншій особі, якщо сам постійно проживає в квартирі; про такий піднайм він зобов’язаний без зайвої затримки повідомити орендодавця. Передати квартиру в цілому або її частину в піднайм, коли орендар сам у квартирі постійно не проживає, він може лише з попередньої письмової згоди орендодавця.',
        'На письмову вимогу орендодавця орендар зобов’язаний протягом 7 днів підтвердити наявність чинного страхування домогосподарства, що охоплює відповідальність за шкоду, заподіяну третім особам у зв’язку з користуванням квартирою (рекомендований ліміт відповідальності — щонайменше 500 000 крон). Якщо орендар не надасть підтвердження страхування у встановлений строк, орендодавець має право повторно письмово вимагати його; повторне невиконання вимоги вважається порушенням обов’язків за Договором.',
      ],
    },
    {
      title: 'VII. ПЕРЕДАЧА КВАРТИРИ ТА АКТ ПРИЙМАННЯ-ПЕРЕДАЧІ',
      body: [
        d.keysCount ? `Орендодавець передає орендарю ключі в кількості ${txt(d.keysCount)} шт. (включно з ключами від вхідних дверей, поштової скриньки та іншого приладдя згідно з актом приймання-передачі).` : '',
        'Орендар не має права виготовляти копії ключів без попередньої згоди орендодавця. У разі втрати або крадіжки ключів орендар зобов’язаний без зайвої затримки письмово повідомити про це орендодавця. У такому разі витрати на заміну циліндра замка або замка несе орендар.',
        d.electricityMeter
          ? `Показники електролічильника при передачі: ${txt(d.electricityMeter)} кВт·год${d.electricityMeterSerial ? `, заводський номер ${txt(d.electricityMeterSerial)}` : ''}.`
          : '',
        d.gasMeter
          ? `Показники газового лічильника при передачі: ${txt(d.gasMeter)} м³${d.gasMeterSerial ? `, заводський номер ${txt(d.gasMeterSerial)}` : ''}.`
          : '',
        d.waterMeter
          ? `Показники лічильника води при передачі: ${txt(d.waterMeter)} м³${d.waterMeterSerial ? `, заводський номер ${txt(d.waterMeterSerial)}` : ''}.`
          : '',
        d.hotWaterMeter
          ? `Показники лічильника гарячої води при передачі: ${txt(d.hotWaterMeter)} м³${d.hotWaterMeterSerial ? `, заводський номер ${txt(d.hotWaterMeterSerial)}` : ''}.`
          : '',
        d.equipmentList ? `Опис переданих меблів та обладнання: ${txt(d.equipmentList)}.` : '',
        d.knownDefects
          ? `Дефекти та несправності, визнані орендодавцем: ${txt(d.knownDefects)}.`
          : 'Квартира передається без прямо повідомлених дефектів понад звичайне зношення.',
        includeLeaseHandoverProtocol
          ? 'Детальний акт приймання-передачі є Додатком № 1 до цього Договору та становить його невід’ємну частину.'
          : '',
      ],
    },
    {
      title: 'VIII. ПРИПИНЕННЯ ОРЕНДИ ТА ПОВЕРНЕННЯ КВАРТИРИ',
      body: [
        d.duration === 'indefinite'
          ? 'Оренду на невизначений строк можна припинити шляхом відмови (§ 2231, § 2286 і наступні ЦК), за згодою сторін або в інший спосіб, установлений законом.'
          : 'Оренда на визначений строк припиняється із закінченням погодженого строку. Орендодавець і орендар можуть відмовитися від оренди з підстав, установлених законом.',
        'Після припинення оренди орендар зобов’язаний: (a) звільнити квартиру та вивезти всі свої рухомі речі, (b) привести квартиру до стану, у якому він її отримав, з урахуванням звичайного зношення, (c) передати всі ключі орендодавцю та (d) забезпечити можливість оформленої актом передачі.',
        `Якщо орендар не передасть квартиру в день припинення оренди, орендодавець до фактичної передачі має право на компенсацію в розмірі погодженої орендної плати (§ 2295 ЦК); за кожен день застосовується пропорційна частина щомісячної орендної плати. Погоджена уточнювальна сума: ${txt(d.lateVacatePenalty, '1/30 щомісячної орендної плати за день')}.`,
      ],
    },
    {
      title: 'IX. АВАРІЇ ТА РЕМОНТ',
      body: [
        'Орендар зобов’язаний негайно, не пізніше ніж протягом 24 годин, повідомити орендодавця про аварію або дефект, які можуть спричинити шкоду (витік води, несправність опалення, електропроводки тощо).',
        'Орендар зобов’язаний у необхідному обсязі вжити заходів щодо аварії навіть без попередньої згоди орендодавця та негайно повідомити орендодавця.',
        MINOR_REPAIRS.ua,
        'Більший ремонт і реконструкцію оплачує орендодавець, якщо пошкодження не заподіяно орендарем або особами, яким орендар надав доступ до квартири.',
      ],
    },
    {
      title: 'X. ДОСТАВКА ДОКУМЕНТІВ',
      body: [
        `Документи орендодавцю доставлятимуться за адресою: ${txt(d.landlordAddress)}${d.landlordEmail ? `, або на e-mail: ${txt(d.landlordEmail)}` : ''}.`,
        `Документи орендарю доставлятимуться за адресою орендованої квартири: ${s.propertyAddress}${d.tenantEmail ? `, або на e-mail: ${txt(d.tenantEmail)}` : ''}.`,
        'Юридичні дії, спрямовані на зміну або припинення оренди, доставляються особисто, рекомендованим листом, через електронну скриньку даних (datová schránka) або в інший доказовий спосіб. Електронну пошту можна використовувати насамперед для звичайного поточного спілкування та надсилання повідомлень, якщо інша сторона повідомила таку адресу й тривалий час користується цим способом спілкування.',
        'Якщо адресат відмовиться прийняти відправлення, воно вважається доставленим у день відмови. Якщо адресат не забере відправлення, залишене на зберіганні, у строк, встановлений поштовою службою, воно вважається доставленим в останній день строку зберігання, якщо це допускають правові норми та характер документа.',
      ],
    },
    ...premium,
    {
      title: `${hasPremium ? 'XIII' : 'XI'}. ПРИКІНЦЕВІ ПОЛОЖЕННЯ`,
      body: [
        'Цей Договір регулюється правом Чеської Республіки, зокрема Законом № 89/2012 Sb., Цивільний кодекс, з наступними змінами, та Законом № 67/2013 Sb. (розрахунок за послуги).',
        disputeClauseIn('ua', d),
        'Договір складено у двох однакових примірниках; орендодавець і орендар отримують по одному примірнику.',
        'Зміни дійсні лише у формі письмових, пронумерованих і підписаних додаткових угод.',
        'Недійсність окремого положення Договору не впливає на дійсність інших положень.',
        includeLeaseHandoverProtocol
          ? 'Додатком № 1 до Договору є акт приймання-передачі, який становить невід’ємну частину Договору.'
          : '',
        'Зміна власника орендованого майна сама по собі не припиняє орендних відносин; набувач переймає права та обов’язки орендодавця з дня набуття права власності (§ 2221 ЦК).',
        'Жодна зі сторін не відповідає за невиконання негрошових обов’язків, спричинене непереборною силою (vis maior), тобто надзвичайною, непередбачуваною та непереборною подією (§ 2913 ч. 2 ЦК). Непереборна сила не поширюється на обов’язок сплатити грошову суму. Сторона, яка зазнала дії непереборної сили, зобов’язана негайно письмово повідомити іншу сторону та після усунення перешкоди негайно продовжити виконання.',
      ],
    },
    { title: `${hasPremium ? 'XIV' : 'XII'}. ПІДПИСИ`, body: [] },
  ];

  if (includeLeaseHandoverProtocol) {
    sections.push({ title: 'ДОДАТОК № 1 – АКТ ПРИЙМАННЯ-ПЕРЕДАЧІ ДО ДОГОВОРУ ОРЕНДИ', body: [] });
  }
  return sections;
}

export function buildLeaseTranslationsBySection(d: StoredContractData, hasPremium: boolean, includeLeaseHandoverProtocol = false): Array<NonNullable<ContractSection['translations']>> {
  return buildBilingualTranslations({
    en: () => en(d, hasPremium, includeLeaseHandoverProtocol),
    ua: () => ua(d, hasPremium, includeLeaseHandoverProtocol),
  });
}

/** Translation of the landlord-package deposit receipt (Annex No. 2), mirroring lib/contracts.ts. */
export function buildLeaseDepositReceiptTranslations(d: StoredContractData): NonNullable<ContractSection['translations']> {
  const s = shared(d);
  return {
    en: {
      title: 'ANNEX NO. 2 – RECEIPT FOR THE MONETARY SECURITY DEPOSIT',
      body: s.hasDeposit
        ? [
            `The Landlord ${txt(d.landlordName)} confirms having received from the Tenant ${txt(d.tenantName)} a monetary security deposit for the lease of the flat at ${s.propertyAddress}.`,
            `Amount of the deposit received: CZK ${amt(d.depositAmount)}.`,
            'Date of receipt / crediting of the amount: ................................',
            'Method of payment: [ ] cash  [ ] bank transfer  [ ] other: ................................',
            'Note / payment reference: ................................',
            'This receipt certifies only the receipt of the stated amount. It does not change the purpose of the deposit or the conditions of its set-off or return agreed in the lease agreement and under the law.',
            'In ................................ on ................................',
            'Landlord – signature: ................................  Tenant – acknowledgement of receipt of this document: ................................',
          ]
        : [
            `The lease agreement for the flat at ${s.propertyAddress} does not provide for a monetary security deposit.`,
            'This form is therefore only a prepared template for the case that the parties later expressly agree on a monetary deposit in writing and the Tenant actually pays it.',
            'Completing this receipt does not in itself create a monetary deposit or amend the lease agreement.',
            'Amount of the deposit received: CZK ................................',
            'Date of receipt / crediting of the amount: ................................',
            'Method of payment: [ ] cash  [ ] bank transfer  [ ] other: ................................',
            'In ................................ on ................................',
            'Landlord – signature: ................................  Tenant – acknowledgement of receipt of this document: ................................',
          ],
    },
    ua: {
      title: 'ДОДАТОК № 2 – ПІДТВЕРДЖЕННЯ ОТРИМАННЯ ГРОШОВОЇ ЗАСТАВИ (КАУЦІЇ)',
      body: s.hasDeposit
        ? [
            `Орендодавець ${txt(d.landlordName)} підтверджує, що отримав від орендаря ${txt(d.tenantName)} грошову заставу за оренду квартири за адресою ${s.propertyAddress}.`,
            `Розмір отриманої застави: ${amt(d.depositAmount)} крон.`,
            'Дата отримання / зарахування суми: ................................',
            'Спосіб оплати: [ ] готівка  [ ] банківський переказ  [ ] інший: ................................',
            'Примітка / ідентифікація платежу: ................................',
            'Це підтвердження засвідчує лише отримання зазначеної суми. Воно не змінює призначення застави, умов її зарахування чи повернення, погоджених у договорі оренди та встановлених законом.',
            'У ................................ дата ................................',
            'Орендодавець – підпис: ................................  Орендар – підтвердження отримання документа: ................................',
          ]
        : [
            `Договір оренди квартири за адресою ${s.propertyAddress} не передбачає грошової застави.`,
            'Тому ця форма є лише підготовленим зразком на випадок, якщо сторони згодом прямо письмово погодять грошову заставу й орендар її фактично сплатить.',
            'Саме по собі заповнення цього підтвердження не встановлює грошової застави і не змінює договір оренди.',
            'Розмір отриманої застави: ................................ крон',
            'Дата отримання / зарахування суми: ................................',
            'Спосіб оплати: [ ] готівка  [ ] банківський переказ  [ ] інший: ................................',
            'У ................................ дата ................................',
            'Орендодавець – підпис: ................................  Орендар – підтвердження отримання документа: ................................',
          ],
    },
  };
}
