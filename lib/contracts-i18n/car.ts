/**
 * Vehicle purchase agreement (kupní smlouva na vozidlo) — full EN and UA translations.
 *
 * Mirrors buildCarContractSections in lib/contracts.ts section by section and
 * paragraph by paragraph, including the vehicle-sale package annexes.
 * scripts/translation-parity-tests.ts enforces the alignment and completeness.
 * The Czech text remains the legally binding version.
 */
import type { ContractSection, StoredContractData } from '../contracts';
import { hasCheckoutAddon } from '../checkout-addons';
import { normalizePackageVersion, PACKAGE_VERSION_WITH_FLAG_OUTPUTS } from '../packages';
import { amt, buildBilingualTranslations, dateIn, disputeClauseIn, todayIn, txt, type ParaPair } from './helpers';

function flags(d: StoredContractData) {
  const includeVehicleHandoverProtocol = Boolean(d.packageKey) || hasCheckoutAddon(d, 'handover_protocol');
  const includePackageAnnexes = d.packageKey === 'vehicle_sale'
    && normalizePackageVersion(d.packageVersion) >= PACKAGE_VERSION_WITH_FLAG_OUTPUTS;
  const cashOverLimit = d.paymentMethod === 'cash' && Number(d.priceAmount ?? d.purchasePrice ?? 0) > 270000;
  return { includeVehicleHandoverProtocol, includePackageAnnexes, cashOverLimit };
}

const joinParts = (parts: string[], sep = ', ') => parts.filter(Boolean).join(sep);

// ── EN ─────────────────────────────────────────────────────────────────────
function en(d: StoredContractData, hasPremium: boolean): ParaPair[] {
  const f = flags(d);
  const paymentText =
    d.paymentMethod === 'cash'
      ? f.cashOverLimit
        ? 'Notice: the purchase price exceeds CZK 270,000; payment in cash is excluded (§ 4 of Act No. 254/2004 Coll., on the Limitation of Cash Payments). The parties must choose a non-cash payment before signing the Agreement.'
        : 'In cash on signing the Agreement, but no later than on physical handover of the vehicle. The parties acknowledge that a cash payment above CZK 270,000 is excluded under Act No. 254/2004 Coll.'
      : d.bankAccount
        ? `By bank transfer to the Seller's account no. ${txt(d.bankAccount)}${d.variableSymbol ? `, variable symbol: ${txt(d.variableSymbol)}` : ''}, within ${txt(d.paymentDueDays, '3')} working days of signing the Agreement.`
        : `By bank transfer to the Seller's account, the details of which will be provided to the Buyer on signing the Agreement, within ${txt(d.paymentDueDays, '3')} working days of signing.`;
  const ownershipTransfer = d.ownershipTransferMoment === 'payment'
    ? 'Ownership passes to the Buyer at the moment the purchase price is paid in full.'
    : 'Ownership passes to the Buyer at the moment of physical handover of the vehicle.';

  const premium: ParaPair[] = hasPremium ? [
    {
      title: 'VI. DETAILED CONDITION OF THE VEHICLE AND DOCUMENTS HANDED OVER',
      body: [
        (() => {
          const parts = joinParts([
            d.carColor ? `colour ${txt(d.carColor)}` : '',
            d.fuelType ? `fuel ${txt(d.fuelType)}` : '',
            d.engineCapacity ? `engine capacity ${txt(d.engineCapacity)} cc` : '',
            d.powerKW ? `power ${txt(d.powerKW)} kW` : '',
            d.techCardNumber ? `vehicle registration certificate (technical card) no. ${txt(d.techCardNumber)}` : '',
          ]);
          return parts ? `Technical data of the vehicle: ${parts}.` : '';
        })(),
        (() => {
          const parts = joinParts([
            d.stkValidUntil ? `roadworthiness test (STK) valid until ${txt(d.stkValidUntil)}` : '',
            d.emissionsValidUntil ? `emissions test valid until ${txt(d.emissionsValidUntil)}` : '',
          ]);
          return parts ? `Validity of the technical and emissions inspection: ${parts}.` : '';
        })(),
        (() => {
          const parts = joinParts([
            d.previousOwnersCount ? `number of previous owners: ${txt(d.previousOwnersCount)}` : '',
            d.vehicleOrigin ? `origin of the vehicle: ${txt(d.vehicleOrigin)}` : '',
          ]);
          return parts ? `History of the vehicle — ${parts}.` : '';
        })(),
        `Service book / history: ${d.serviceHistory ? 'yes, handed over together with the vehicle' : 'not available'}.`,
        `Accident history: ${d.accidentHistory ? 'the vehicle has been in an accident; repairs as documented in the service records' : 'the Seller is not aware of any accidents or major bodywork repairs'}.`,
        d.equipmentIncluded ? `Equipment and accessories handed over: ${txt(d.equipmentIncluded)}.` : 'Equipment and accessories handed over: according to the actual condition at handover.',
        d.tiresInfo ? `Tyres: ${txt(d.tiresInfo)}.` : '',
        d.documentsIncluded ? `Documents handed over: ${txt(d.documentsIncluded)}.` : 'Documents handed over: vehicle technical card and vehicle registration certificate.',
        d.keysCount ? `Number of keys handed over: ${txt(d.keysCount)}.` : '',
      ],
    },
    {
      title: 'VII. CONTRACTUAL PENALTIES AND LIABILITY FOR CONCEALED DEFECTS',
      body: [
        'The Seller is liable to the Buyer for defects that the item had when the risk of damage passed to the Buyer, even if they become apparent only later. If the Seller is an entrepreneur and the Buyer a consumer, a defect that becomes apparent within two years of takeover may be claimed; for a used item the parties may shorten this period to as little as one year. The mandatory rights of a consumer are not limited by this Agreement.',
        d.hiddenDefectPenalty && Number(d.hiddenDefectPenalty) > 0
          ? `If the Seller knowingly conceals a defect of which the Seller did not give notice, the Seller shall pay the Buyer a contractual penalty of CZK ${amt(d.hiddenDefectPenalty)}. Payment of the penalty does not affect the right to compensation for damage or the rights arising from defects.`
          : 'If the Seller knowingly conceals a defect of which the Seller did not give notice, the Seller shall compensate the Buyer in full for the damage incurred, including the costs of remedying the defect; this does not affect the rights arising from defective performance under § 1914 et seq. of the Civil Code.',
        `Contractual penalty for the Buyer's delay in paying the purchase price: ${txt(d.buyerLatePenalty, '0.05')} % of the amount due for each day of delay.`,
        d.sellerLatePenalty && Number(d.sellerLatePenalty) > 0
          ? `Contractual penalty for the Seller's delay in handing over the vehicle after the agreed deadline: CZK ${amt(d.sellerLatePenalty)} for each day of delay.`
          : 'If the Seller is late in handing over the vehicle after the agreed deadline, the Buyer is entitled to claim compensation for damage (in particular the costs of substitute transport and of putting the vehicle into operation) in the amount demonstrably incurred.',
        'The Seller declares that, to the best of the Seller’s knowledge, the vehicle is not subject to enforcement proceedings, a lien or any other restriction on disposal; the Seller is liable for the truthfulness of this declaration within the scope of pre-contractual liability under § 1728 et seq. of the Civil Code.',
      ],
    },
    {
      title: 'VIII. INSURANCE EVENTS, DEBT-FREE STATUS AND PENALTIES RELATING TO THE REGISTRATION TRANSFER',
      body: [
        'The contracting parties mutually authorise each other to act as representatives in the matter of the transfer of ownership of the vehicle in the register of road vehicles. If one of the parties fails to appear at the agreed date to carry out the transfer, the other party is entitled to carry out the transfer alone on the basis of this Agreement and the power of attorney granted by this Agreement for this purpose.',
        'If the Seller fails without serious reason to appear for the transfer of ownership within the period under Art. V, the Seller shall pay the Buyer a contractual penalty of CZK 200 for each day of delay and reimburse the costs reasonably incurred in asserting the Buyer’s rights.',
        'From the moment ownership passes, the Buyer shall take out new compulsory motor third-party liability insurance for the vehicle. The Seller shall arrange for the termination of the existing motor third-party liability insurance as of the date ownership passes.',
        'The Seller declares that the vehicle is not encumbered by any unsettled obligation towards a leasing company, bank or other third party arising from earlier financing of the vehicle.',
        'The Seller further declares that, as of the date of signing this Agreement, the Seller is not aware of any pending or unsettled insurance events relating to the vehicle.',
        d.declarationPenalty && Number(d.declarationPenalty) > 0
          ? `If the above declarations prove untrue, the Seller shall pay the Buyer the damage demonstrably incurred and a contractual penalty of CZK ${amt(d.declarationPenalty)}.`
          : 'If the above declarations prove untrue, the Seller shall pay the Buyer the damage demonstrably incurred, including the costs reasonably incurred in asserting the Buyer’s rights.',
      ],
    },
  ] : [];

  const sections: ParaPair[] = [
    {
      title: 'PREAMBLE',
      body: [
        'This purchase agreement (the "Agreement") is concluded under § 2079 et seq. of Act No. 89/2012 Coll., the Civil Code, as amended (the "Civil Code").',
        `Date of conclusion of the Agreement: ${d.contractDate ? dateIn('en', d.contractDate) : todayIn('en')}`,
      ],
    },
    {
      title: 'I. CONTRACTING PARTIES',
      body: [
        `Seller: ${txt(d.sellerName)}, date of birth / Company ID: ${txt(d.sellerId)}, residence / registered office: ${txt(d.sellerAddress)}`,
        d.sellerOP ? `Seller's identity card no.: ${txt(d.sellerOP)}` : '',
        d.sellerEmail ? `Seller's e-mail: ${txt(d.sellerEmail)}` : '',
        d.sellerPhone ? `Seller's phone: ${txt(d.sellerPhone)}` : '',
        `Buyer: ${txt(d.buyerName)}, date of birth / Company ID: ${txt(d.buyerId)}, residence / registered office: ${txt(d.buyerAddress)}`,
        d.buyerOP ? `Buyer's identity card no.: ${txt(d.buyerOP)}` : '',
        d.buyerEmail ? `Buyer's e-mail: ${txt(d.buyerEmail)}` : '',
        d.buyerPhone ? `Buyer's phone: ${txt(d.buyerPhone)}` : '',
      ],
    },
    {
      title: 'II. SUBJECT OF THE PURCHASE',
      body: [
        `The subject of the purchase is a motor vehicle of the make ${txt(d.carMake)}${d.carModel ? `, model ${txt(d.carModel)}` : ''}.`,
        joinParts([
          d.carVIN ? `VIN (body number): ${txt(d.carVIN)}` : '',
          d.carPlate ? `registration plate: ${txt(d.carPlate)}` : '',
        ]),
        (() => {
          const parts = joinParts([
            d.carMileage ? `Odometer reading on the date of signing: ${amt(d.carMileage)} km` : '',
            d.carYear ? `year of manufacture: ${txt(d.carYear)}` : '',
          ], '. ');
          return parts ? `${parts}.` : '';
        })(),
        d.carFirstRegistration ? `Date of first registration: ${txt(d.carFirstRegistration)}.` : '',
      ],
    },
    {
      title: 'III. PURCHASE PRICE, PAYMENT AND TRANSFER OF OWNERSHIP',
      body: [
        `The purchase price of the vehicle is agreed at CZK ${amt(d.priceAmount ?? d.purchasePrice)}${d.priceWords ? ` (in words: ${d.priceWords})` : ''}.`,
        `Method of payment: ${paymentText}`,
        ownershipTransfer,
        d.handoverDate ? `Agreed date of physical handover of the vehicle: ${dateIn('en', d.handoverDate)}.` : '',
        d.handoverPlace ? `Place of handover: ${txt(d.handoverPlace)}.` : '',
      ],
    },
    {
      title: 'IV. TECHNICAL CONDITION, SELLER’S DECLARATIONS AND WARRANTIES',
      body: [
        (() => {
          if (d.buyerInspectedVehicle === false) {
            return 'The Buyer acknowledges that the Buyer did not have the opportunity to become fully acquainted with the technical condition of the vehicle before signing the Agreement; this fact was taken into account when agreeing the purchase price.';
          }
          const details: string[] = ['The Buyer confirms having duly become acquainted with the technical condition of the vehicle before signing the Agreement'];
          if (d.testDriveCompleted) details.push('having taken a test drive');
          if (d.mechanicInspectionOffered) details.push('and having had the opportunity to have the vehicle checked by the Buyer’s own mechanic or by diagnostics');
          return `${details.join(', ')}; the Buyer accepts the vehicle in this condition (§ 2104 of the Civil Code).`;
        })(),
        `The Seller declares that the Seller is aware of the following defects and limitations of the vehicle: ${txt(d.knownDefects, 'No apparent defects beyond ordinary wear and tear corresponding to the age and mileage')}.`,
        d.odometerGuaranteed === false
          ? 'The Seller expressly does not guarantee the correctness of the odometer reading.'
          : 'The Seller declares that the odometer reading corresponds to the best of the Seller’s knowledge and has not been tampered with.',
        d.isPledged
          ? 'The Seller states that the vehicle IS SUBJECT to a lien — the details are agreed separately or form part of the annexes.'
          : 'The Seller declares that the vehicle IS NOT subject to any lien.',
        d.isInLeasing
          ? 'The Seller states that the vehicle IS SUBJECT to a lease or another obligation towards a financial institution — details agreed separately.'
          : 'The Seller declares that the vehicle IS NOT subject to a lease or any other obligation towards a financial institution.',
        d.hasThirdPartyRights
          ? 'The vehicle IS ENCUMBERED by rights of third parties — details agreed separately.'
          : 'The Seller declares that the vehicle IS NOT encumbered by any rights of third parties.',
        d.strictWarranties
          ? 'The Seller provides a contractual quality warranty for 6 months from handover. During the warranty period the Seller is liable for defects that existed at the time the risk of damage passed.'
          : 'The vehicle is sold as used, in a condition corresponding to its age, previous use and mileage. The Seller provides no contractual quality warranty beyond the statutory framework and is liable only for defects to the extent laid down by law and by this Agreement.',
      ],
    },
    {
      title: 'V. OBLIGATIONS AFTER HANDOVER AND REGISTRATION TRANSFER OF THE VEHICLE',
      body: [
        'The contracting parties shall, without delay and no later than 10 working days after ownership passes, file an application for registration of the change of the vehicle owner with the competent municipal office of a municipality with extended powers (§ 8(2) of Act No. 56/2001 Coll.).',
        'The Seller shall hand over to the Buyer all documents relating to the vehicle, the keys and the equipment as listed in this Agreement.',
        'The Seller’s insurance contracts do not pass to the Buyer. The Buyer shall arrange the Buyer’s own motor third-party liability insurance without any gap in cover, at the latest before operating the vehicle or registering the change; the Seller shall terminate and settle the Seller’s existing insurance. Comprehensive (collision) insurance is optional.',
        'After takeover, the Buyer shall carry out a reasonable inspection and notify the Seller of apparent defects without undue delay (§ 2104 of the Civil Code). If the Buyer is a consumer, this provision does not shorten the statutory period for claiming defects or any other mandatory consumer rights.',
      ],
    },
    ...premium,
    {
      title: `${hasPremium ? 'IX' : 'VI'}. FINAL PROVISIONS`,
      body: [
        'This Agreement is governed by the law of the Czech Republic, in particular Act No. 89/2012 Coll., the Civil Code, as amended.',
        disputeClauseIn('en', d),
        'The Agreement is executed in two counterparts; the Seller and the Buyer each receive one counterpart.',
        'All amendments to the Agreement are valid only in the form of written, numbered and signed addenda.',
        'The invalidity of any individual provision of the Agreement does not affect the validity of the other provisions.',
        'Neither contracting party is liable for failure to perform non-monetary obligations caused by force majeure (vis maior), i.e. an extraordinary, unforeseeable and insurmountable event (§ 2913(2) of the Civil Code). Force majeure does not apply to the obligation to pay a sum of money. A party affected by force majeure shall inform the other party in writing without delay and resume performance without delay once the obstacle has ceased.',
      ],
    },
    { title: `${hasPremium ? 'X' : 'VII'}. SIGNATURES`, body: [] },
  ];

  if (f.includeVehicleHandoverProtocol) {
    sections.push({
      title: 'ANNEX NO. 1 – VEHICLE HANDOVER PROTOCOL',
      body: [
        `The Seller hands over the vehicle to the Buyer: ${txt(d.carMake)} ${txt(d.carModel)}.`,
        `VIN: ${txt(d.carVIN)}.`,
        d.carPlate ? `Registration plate: ${txt(d.carPlate)}.` : '',
        d.carMileage ? `Odometer reading at handover: ${amt(d.carMileage)} km.` : '',
        d.handoverDate ? `Date of handover: ${dateIn('en', d.handoverDate)}.` : '',
        d.handoverPlace ? `Place of handover: ${txt(d.handoverPlace)}.` : '',
        `Keys and documents handed over: ${txt(d.keysAndDocs, 'the vehicle keys and the available vehicle documents')}.`,
        `Defects found at handover: ${txt(d.knownDefects, 'no apparent defects beyond ordinary wear and tear')}.`,
        'The contracting parties confirm that the vehicle, the keys and the documents were handed over in the condition stated above.',
      ],
    });
  }

  if (f.includePackageAnnexes) {
    sections.push({
      title: 'ANNEX NO. 2 – POWER OF ATTORNEY FOR REGISTRATION OF THE CHANGE OF VEHICLE OWNER',
      body: [
        'Principal (the party not attending the transfer): [ ] Seller  [ ] Buyer — tick who grants the authorisation.',
        `Seller: ${txt(d.sellerName)}, date of birth / Company ID: ${txt(d.sellerId)}, residence / registered office: ${txt(d.sellerAddress)}`,
        `Buyer: ${txt(d.buyerName)}, date of birth / Company ID: ${txt(d.buyerId)}, residence / registered office: ${txt(d.buyerAddress)}`,
        `Vehicle: ${txt(d.carMake)} ${txt(d.carModel)}, VIN: ${txt(d.carVIN)}${d.carPlate ? `, registration plate: ${txt(d.carPlate)}` : ''}.`,
        'The Principal hereby authorises the other contracting party named above to represent the Principal in the proceedings for registration of the change of owner of a road vehicle under § 8 et seq. of Act No. 56/2001 Coll., on the Conditions for the Operation of Vehicles on Roads, in particular to file the application, supplement documents, collect documents and perform other acts connected with this registration.',
        'The authorisation is granted only for the transfer of the vehicle identified above under the attached purchase agreement and expires upon registration of the change of owner or upon written revocation by the Principal.',
        'The Agent accepts the authorisation.',
        'Under § 441(2) of the Civil Code, a power of attorney must be in the form required for the legal act for which it is granted. The competent municipal office of a municipality with extended powers usually requires a power of attorney with the Principal’s officially certified signature; certification can be done at a notary, at a Czech POINT or at a registry office. The office may require its own form or further particulars beyond the law — before filing we recommend checking the current requirements of the specific office.',
        'The application for registration of the change of owner must be filed within 10 working days after ownership passes (§ 8(2) of Act No. 56/2001 Coll.).',
        'In ................................ on ................................',
        'Principal’s signature: ................................  Agent’s signature: ................................',
      ],
    });
    sections.push({
      title: 'ANNEX NO. 3 – CHECKLIST FOR HANDOVER OF THE VEHICLE AND DOCUMENTS',
      body: [
        '[ ] The identity of the other party was verified against an identity document and the details match the Agreement.',
        '[ ] The VIN on the vehicle matches the VIN stated in the Agreement and in the vehicle technical card.',
        '[ ] The odometer reading at handover was recorded in the handover protocol.',
        '[ ] The vehicle technical card and the vehicle registration certificate (small technical card) were handed over.',
        '[ ] All vehicle keys, including spare keys, and any remote controls were handed over.',
        '[ ] The service book, service records and other documentation were handed over, if available.',
        '[ ] The validity of the technical inspection and emissions test was checked.',
        '[ ] It was checked whether the vehicle is subject to a lien, lease, security transfer of title or enforcement proceedings.',
        '[ ] The purchase price was paid in the agreed manner and the payment can be evidenced.',
        '[ ] The application for registration of the change of owner was filed within 10 working days after ownership passed.',
        '[ ] The Seller terminated the Seller’s motor third-party liability insurance only after the change of owner was registered; the Buyer took out the Buyer’s own insurance before putting the vehicle into operation.',
        '[ ] Both parties have a signed counterpart of the Agreement and of the handover protocol.',
        'Check carried out by: ................................  Date: ................................  Signature: ................................',
      ],
    });
  }
  return sections;
}

// ── UA ─────────────────────────────────────────────────────────────────────
function ua(d: StoredContractData, hasPremium: boolean): ParaPair[] {
  const f = flags(d);
  const paymentText =
    d.paymentMethod === 'cash'
      ? f.cashOverLimit
        ? 'Увага: купівельна ціна перевищує 270 000 крон; оплата готівкою виключена (§ 4 Закону № 254/2004 Sb., про обмеження готівкових платежів). Сторони зобов’язані обрати безготівкову оплату до підписання Договору.'
        : 'Готівкою під час підписання Договору, але не пізніше фактичної передачі транспортного засобу. Сторони беруть до відома, що оплата готівкою понад 270 000 крон відповідно до Закону № 254/2004 Sb. виключена.'
      : d.bankAccount
        ? `Банківським переказом на рахунок продавця № ${txt(d.bankAccount)}${d.variableSymbol ? `, варіабельний символ: ${txt(d.variableSymbol)}` : ''}, протягом ${txt(d.paymentDueDays, '3')} робочих днів з дня підписання Договору.`
        : `Банківським переказом на рахунок продавця, реквізити якого буде повідомлено покупцю під час підписання Договору, протягом ${txt(d.paymentDueDays, '3')} робочих днів з дня підписання.`;
  const ownershipTransfer = d.ownershipTransferMoment === 'payment'
    ? 'Право власності переходить до покупця в момент повної сплати купівельної ціни.'
    : 'Право власності переходить до покупця в момент фактичної передачі транспортного засобу.';

  const premium: ParaPair[] = hasPremium ? [
    {
      title: 'VI. ДЕТАЛЬНИЙ СТАН ТРАНСПОРТНОГО ЗАСОБУ ТА ПЕРЕДАНІ ДОКУМЕНТИ',
      body: [
        (() => {
          const parts = joinParts([
            d.carColor ? `колір ${txt(d.carColor)}` : '',
            d.fuelType ? `пальне ${txt(d.fuelType)}` : '',
            d.engineCapacity ? `об’єм двигуна ${txt(d.engineCapacity)} см³` : '',
            d.powerKW ? `потужність ${txt(d.powerKW)} кВт` : '',
            d.techCardNumber ? `номер технічного паспорта ${txt(d.techCardNumber)}` : '',
          ]);
          return parts ? `Технічні дані транспортного засобу: ${parts}.` : '';
        })(),
        (() => {
          const parts = joinParts([
            d.stkValidUntil ? `технічний огляд (STK) дійсний до ${txt(d.stkValidUntil)}` : '',
            d.emissionsValidUntil ? `контроль викидів дійсний до ${txt(d.emissionsValidUntil)}` : '',
          ]);
          return parts ? `Чинність технічного огляду та контролю викидів: ${parts}.` : '';
        })(),
        (() => {
          const parts = joinParts([
            d.previousOwnersCount ? `кількість попередніх власників: ${txt(d.previousOwnersCount)}` : '',
            d.vehicleOrigin ? `походження транспортного засобу: ${txt(d.vehicleOrigin)}` : '',
          ]);
          return parts ? `Історія транспортного засобу — ${parts}.` : '';
        })(),
        `Сервісна книжка / історія обслуговування: ${d.serviceHistory ? 'так, передається разом із транспортним засобом' : 'відсутня'}.`,
        `Історія ДТП: ${d.accidentHistory ? 'транспортний засіб був учасником ДТП, ремонт — згідно із сервісною документацією' : 'продавцю не відомі жодні ДТП чи серйозні кузовні ремонти'}.`,
        d.equipmentIncluded ? `Передане оснащення та приладдя: ${txt(d.equipmentIncluded)}.` : 'Передане оснащення та приладдя: відповідно до фактичного стану на момент передачі.',
        d.tiresInfo ? `Шини: ${txt(d.tiresInfo)}.` : '',
        d.documentsIncluded ? `Передані документи: ${txt(d.documentsIncluded)}.` : 'Передані документи: технічний паспорт, свідоцтво про реєстрацію транспортного засобу.',
        d.keysCount ? `Кількість переданих ключів: ${txt(d.keysCount)}.` : '',
      ],
    },
    {
      title: 'VII. ДОГОВІРНІ ШТРАФИ ТА ВІДПОВІДАЛЬНІСТЬ ЗА ПРИХОВАНІ ДЕФЕКТИ',
      body: [
        'Продавець відповідає перед покупцем за дефекти, які річ мала в момент переходу ризику випадкового пошкодження до покупця, навіть якщо вони проявляться пізніше. Якщо продавець є підприємцем, а покупець — споживачем, можна заявити про дефект, що проявився протягом двох років після прийняття; для вживаної речі сторони можуть скоротити цей строк до одного року. Цей Договір не обмежує імперативних прав споживача.',
        d.hiddenDefectPenalty && Number(d.hiddenDefectPenalty) > 0
          ? `Якщо продавець свідомо приховає дефект, про який не повідомив, він зобов’язаний сплатити покупцю договірний штраф у розмірі ${amt(d.hiddenDefectPenalty)} крон. Сплата штрафу не зачіпає права на відшкодування шкоди та прав, що випливають з дефектів.`
          : 'Якщо продавець свідомо приховає дефект, про який не повідомив, він зобов’язаний відшкодувати покупцю завдану шкоду в повному обсязі, включно з витратами на усунення дефекту; це не зачіпає прав, що випливають з неналежного виконання відповідно до § 1914 і наступних ЦК.',
        `Договірний штраф за прострочення покупцем сплати купівельної ціни: ${txt(d.buyerLatePenalty, '0,05')} % від заборгованої суми за кожен день прострочення.`,
        d.sellerLatePenalty && Number(d.sellerLatePenalty) > 0
          ? `Договірний штраф за прострочення продавцем передачі транспортного засобу після погодженого строку: ${amt(d.sellerLatePenalty)} крон за кожен день прострочення.`
          : 'У разі прострочення продавцем передачі транспортного засобу після погодженого строку покупець має право вимагати відшкодування шкоди (зокрема витрат на заміщувальний транспорт і введення транспортного засобу в експлуатацію) в доведеному розмірі.',
        'Продавець заявляє, що, наскільки йому відомо, транспортний засіб не є предметом виконавчого провадження, застави чи іншого обмеження розпорядження; за правдивість цієї заяви він відповідає в межах переддоговірної відповідальності відповідно до § 1728 і наступних ЦК.',
      ],
    },
    {
      title: 'VIII. СТРАХОВІ ВИПАДКИ, ВІДСУТНІСТЬ БОРГІВ ТА САНКЦІЇ ПРИ ПЕРЕРЕЄСТРАЦІЇ',
      body: [
        'Сторони договору взаємно уповноважують одна одну на представництво у справі переоформлення права власності на транспортний засіб у реєстрі дорожніх транспортних засобів. Якщо одна зі сторін не з’явиться в погоджений строк для переоформлення, інша сторона має право здійснити переоформлення самостійно на підставі цього Договору та довіреності, яка для цієї мети надається цим Договором.',
        'Якщо продавець без поважної причини не з’явиться для переоформлення права власності у строк відповідно до ст. V, він зобов’язаний сплатити покупцю договірний штраф у розмірі 200 крон за кожен день прострочення та відшкодувати доцільно понесені витрати, пов’язані зі здійсненням прав.',
        'З моменту переходу права власності покупець зобов’язаний укласти новий договір обов’язкового страхування цивільної відповідальності власників транспортних засобів. Продавець забезпечить припинення чинного страхування відповідальності з дня переходу права власності.',
        'Продавець заявляє, що транспортний засіб не обтяжений жодним неврегульованим зобов’язанням перед лізинговою компанією, банком чи іншою третьою особою, що випливає з попереднього фінансування транспортного засобу.',
        'Продавець також заявляє, що станом на день підписання цього Договору йому не відомі жодні триваючі чи неврегульовані страхові випадки щодо транспортного засобу.',
        d.declarationPenalty && Number(d.declarationPenalty) > 0
          ? `У разі неправдивості наведених вище заяв продавець зобов’язаний відшкодувати покупцю доведено завдану шкоду та сплатити договірний штраф у розмірі ${amt(d.declarationPenalty)} крон.`
          : 'У разі неправдивості наведених вище заяв продавець зобов’язаний відшкодувати покупцю доведено завдану шкоду, включно з доцільно понесеними витратами на здійснення прав.',
      ],
    },
  ] : [];

  const sections: ParaPair[] = [
    {
      title: 'ПРЕАМБУЛА',
      body: [
        'Цей договір купівлі-продажу (далі — «Договір») укладається відповідно до § 2079 і наступних Закону № 89/2012 Sb., Цивільний кодекс, з наступними змінами (далі — «ЦК»).',
        `Дата укладення Договору: ${d.contractDate ? dateIn('ua', d.contractDate) : todayIn('ua')}`,
      ],
    },
    {
      title: 'I. СТОРОНИ ДОГОВОРУ',
      body: [
        `Продавець: ${txt(d.sellerName)}, дата народження / IČO: ${txt(d.sellerId)}, місце проживання / місцезнаходження: ${txt(d.sellerAddress)}`,
        d.sellerOP ? `Номер посвідчення особи продавця: ${txt(d.sellerOP)}` : '',
        d.sellerEmail ? `E-mail продавця: ${txt(d.sellerEmail)}` : '',
        d.sellerPhone ? `Телефон продавця: ${txt(d.sellerPhone)}` : '',
        `Покупець: ${txt(d.buyerName)}, дата народження / IČO: ${txt(d.buyerId)}, місце проживання / місцезнаходження: ${txt(d.buyerAddress)}`,
        d.buyerOP ? `Номер посвідчення особи покупця: ${txt(d.buyerOP)}` : '',
        d.buyerEmail ? `E-mail покупця: ${txt(d.buyerEmail)}` : '',
        d.buyerPhone ? `Телефон покупця: ${txt(d.buyerPhone)}` : '',
      ],
    },
    {
      title: 'II. ПРЕДМЕТ КУПІВЛІ',
      body: [
        `Предметом купівлі є механічний транспортний засіб марки ${txt(d.carMake)}${d.carModel ? `, модель ${txt(d.carModel)}` : ''}.`,
        joinParts([
          d.carVIN ? `VIN (номер кузова): ${txt(d.carVIN)}` : '',
          d.carPlate ? `номерний знак: ${txt(d.carPlate)}` : '',
        ]),
        (() => {
          const parts = joinParts([
            d.carMileage ? `Показання одометра на день підписання: ${amt(d.carMileage)} км` : '',
            d.carYear ? `рік випуску: ${txt(d.carYear)}` : '',
          ], '. ');
          return parts ? `${parts}.` : '';
        })(),
        d.carFirstRegistration ? `Дата першої реєстрації: ${txt(d.carFirstRegistration)}.` : '',
      ],
    },
    {
      title: 'III. КУПІВЕЛЬНА ЦІНА, ОПЛАТА ТА ПЕРЕХІД ПРАВА ВЛАСНОСТІ',
      body: [
        `Купівельну ціну транспортного засобу погоджено в розмірі ${amt(d.priceAmount ?? d.purchasePrice)} крон${d.priceWords ? ` (прописом: ${d.priceWords})` : ''}.`,
        `Спосіб оплати: ${paymentText}`,
        ownershipTransfer,
        d.handoverDate ? `Погоджена дата фактичної передачі транспортного засобу: ${dateIn('ua', d.handoverDate)}.` : '',
        d.handoverPlace ? `Місце передачі: ${txt(d.handoverPlace)}.` : '',
      ],
    },
    {
      title: 'IV. ТЕХНІЧНИЙ СТАН, ЗАЯВИ ПРОДАВЦЯ ТА ГАРАНТІЇ',
      body: [
        (() => {
          if (d.buyerInspectedVehicle === false) {
            return 'Покупець бере до відома, що не мав можливості в повному обсязі ознайомитися з технічним станом транспортного засобу до підписання Договору; цю обставину було враховано під час погодження купівельної ціни.';
          }
          const details: string[] = ['Покупець підтверджує, що до підписання Договору належним чином ознайомився з технічним станом транспортного засобу'];
          if (d.testDriveCompleted) details.push('здійснив тест-драйв');
          if (d.mechanicInspectionOffered) details.push('мав можливість доручити перевірку транспортного засобу власному механіку або діагностиці');
          return `${details.join(', ')}; він приймає транспортний засіб у цьому стані (§ 2104 ЦК).`;
        })(),
        `Продавець заявляє, що йому відомі такі дефекти та обмеження транспортного засобу: ${txt(d.knownDefects, 'Жодних очевидних дефектів понад звичайне зношення, що відповідає віку та пробігу')}.`,
        d.odometerGuaranteed === false
          ? 'Продавець прямо не гарантує правильність показань одометра.'
          : 'Продавець заявляє, що показання одометра, наскільки йому відомо, є правильними і не були неправомірно змінені.',
        d.isPledged
          ? 'Продавець зазначає, що транспортний засіб Є предметом застави — подробиці погоджено окремо або вони є частиною додатків.'
          : 'Продавець заявляє, що транспортний засіб НЕ є предметом жодної застави.',
        d.isInLeasing
          ? 'Продавець зазначає, що транспортний засіб Є предметом лізингу чи іншого зобов’язання перед фінансовою установою — подробиці погоджено окремо.'
          : 'Продавець заявляє, що транспортний засіб НЕ є предметом лізингу чи іншого зобов’язання перед фінансовою установою.',
        d.hasThirdPartyRights
          ? 'Транспортний засіб ОБТЯЖЕНИЙ правами третіх осіб — подробиці погоджено окремо.'
          : 'Продавець заявляє, що транспортний засіб НЕ обтяжений жодними правами третіх осіб.',
        d.strictWarranties
          ? 'Продавець надає договірну гарантію якості строком 6 місяців з дня передачі. Протягом гарантійного строку продавець відповідає за дефекти, які існували в момент переходу ризику випадкового пошкодження.'
          : 'Транспортний засіб продається як вживаний, у стані, що відповідає його віку, попередньому використанню та пробігу. Продавець не надає договірної гарантії якості понад межі, встановлені законом, і відповідає лише за дефекти в обсязі, встановленому правовими нормами та цим Договором.',
      ],
    },
    {
      title: 'V. ОБОВ’ЯЗКИ ПІСЛЯ ПЕРЕДАЧІ ТА ПЕРЕРЕЄСТРАЦІЯ ТРАНСПОРТНОГО ЗАСОБУ',
      body: [
        'Сторони договору зобов’язані негайно, не пізніше ніж протягом 10 робочих днів з дня переходу права власності, подати заяву про внесення зміни власника транспортного засобу до компетентного муніципального органу муніципалітету з розширеними повноваженнями (§ 8 ч. 2 Закону № 56/2001 Sb.).',
        'Продавець зобов’язаний передати покупцю всі документи на транспортний засіб, ключі та оснащення згідно з переліком у цьому Договорі.',
        'Договори страхування продавця до покупця не переходять. Покупець забезпечить власне страхування цивільної відповідальності без перерви в покритті, не пізніше ніж до початку експлуатації транспортного засобу або внесення зміни до реєстру; продавець припинить і врегулює своє чинне страхування. Страхування КАСКО є добровільним.',
        'Після прийняття покупець проведе розумний огляд і без зайвої затримки повідомить продавця про очевидні дефекти (§ 2104 ЦК). Якщо покупець є споживачем, це положення не скорочує встановленого законом строку для заявлення про дефект та інших імперативних прав споживача.',
      ],
    },
    ...premium,
    {
      title: `${hasPremium ? 'IX' : 'VI'}. ПРИКІНЦЕВІ ПОЛОЖЕННЯ`,
      body: [
        'Цей Договір регулюється правом Чеської Республіки, зокрема Законом № 89/2012 Sb., Цивільний кодекс, з наступними змінами.',
        disputeClauseIn('ua', d),
        'Договір складено у двох однакових примірниках; продавець і покупець отримують по одному примірнику.',
        'Усі зміни Договору дійсні лише у формі письмових, пронумерованих і підписаних додаткових угод.',
        'Недійсність окремого положення Договору не впливає на дійсність інших положень.',
        'Жодна зі сторін не відповідає за невиконання негрошових обов’язків, спричинене непереборною силою (vis maior), тобто надзвичайною, непередбачуваною та непереборною подією (§ 2913 ч. 2 ЦК). Непереборна сила не поширюється на обов’язок сплатити грошову суму. Сторона, яка зазнала дії непереборної сили, зобов’язана негайно письмово повідомити іншу сторону та після усунення перешкоди негайно продовжити виконання.',
      ],
    },
    { title: `${hasPremium ? 'X' : 'VII'}. ПІДПИСИ`, body: [] },
  ];

  if (f.includeVehicleHandoverProtocol) {
    sections.push({
      title: 'ДОДАТОК № 1 – АКТ ПРИЙМАННЯ-ПЕРЕДАЧІ ТРАНСПОРТНОГО ЗАСОБУ',
      body: [
        `Продавець передає покупцю транспортний засіб: ${txt(d.carMake)} ${txt(d.carModel)}.`,
        `VIN: ${txt(d.carVIN)}.`,
        d.carPlate ? `Номерний знак: ${txt(d.carPlate)}.` : '',
        d.carMileage ? `Показання одометра при передачі: ${amt(d.carMileage)} км.` : '',
        d.handoverDate ? `Дата передачі: ${dateIn('ua', d.handoverDate)}.` : '',
        d.handoverPlace ? `Місце передачі: ${txt(d.handoverPlace)}.` : '',
        `Передані ключі та документи: ${txt(d.keysAndDocs, 'ключі від транспортного засобу та наявні документи на нього')}.`,
        `Дефекти, виявлені при передачі: ${txt(d.knownDefects, 'без очевидних дефектів понад звичайне зношення')}.`,
        'Сторони договору підтверджують, що транспортний засіб, ключі та документи було передано у зазначеному вище стані.',
      ],
    });
  }

  if (f.includePackageAnnexes) {
    sections.push({
      title: 'ДОДАТОК № 2 – ДОВІРЕНІСТЬ НА ВНЕСЕННЯ ЗМІНИ ВЛАСНИКА ТРАНСПОРТНОГО ЗАСОБУ',
      body: [
        'Довіритель (сторона, яка не бере участі в переоформленні): [ ] продавець  [ ] покупець — позначте, хто надає повноваження.',
        `Продавець: ${txt(d.sellerName)}, дата народження / IČO: ${txt(d.sellerId)}, місце проживання / місцезнаходження: ${txt(d.sellerAddress)}`,
        `Покупець: ${txt(d.buyerName)}, дата народження / IČO: ${txt(d.buyerId)}, місце проживання / місцезнаходження: ${txt(d.buyerAddress)}`,
        `Транспортний засіб: ${txt(d.carMake)} ${txt(d.carModel)}, VIN: ${txt(d.carVIN)}${d.carPlate ? `, номерний знак: ${txt(d.carPlate)}` : ''}.`,
        'Довіритель цим уповноважує іншу зазначену вище сторону договору представляти його в провадженні щодо внесення зміни власника дорожнього транспортного засобу відповідно до § 8 і наступних Закону № 56/2001 Sb., про умови експлуатації транспортних засобів на дорогах, зокрема подати заяву, доповнити документи, отримати документи та вчинити інші дії, пов’язані з цим внесенням.',
        'Повноваження надається лише для переоформлення зазначеного вище транспортного засобу відповідно до доданого договору купівлі-продажу та припиняється внесенням зміни власника або письмовим відкликанням довірителем.',
        'Повірений приймає повноваження.',
        'Відповідно до § 441 ч. 2 ЦК довіреність повинна мати форму, що відповідає юридичній дії, для якої її видано. Компетентний муніципальний орган муніципалітету з розширеними повноваженнями, як правило, вимагає довіреність з офіційно засвідченим підписом довірителя; засвідчення можна здійснити у нотаріуса, у пункті Czech POINT або в органі реєстрації актів цивільного стану (matrika). Орган може понад вимоги закону вимагати власний бланк або додаткові реквізити — перед поданням рекомендуємо перевірити актуальні вимоги конкретного органу.',
        'Заяву про внесення зміни власника необхідно подати протягом 10 робочих днів з дня переходу права власності (§ 8 ч. 2 Закону № 56/2001 Sb.).',
        'У ................................ дата ................................',
        'Підпис довірителя: ................................  Підпис повіреного: ................................',
      ],
    });
    sections.push({
      title: 'ДОДАТОК № 3 – ЧЕК-ЛИСТ ПЕРЕДАЧІ ТРАНСПОРТНОГО ЗАСОБУ ТА ДОКУМЕНТІВ',
      body: [
        '[ ] Особу іншої сторони перевірено за документом, що посвідчує особу, і дані відповідають Договору.',
        '[ ] VIN на транспортному засобі збігається з VIN, зазначеним у Договорі та в технічному паспорті.',
        '[ ] Показання одометра при передачі внесено до акта приймання-передачі.',
        '[ ] Передано технічний паспорт і свідоцтво про реєстрацію транспортного засобу (малий технічний паспорт).',
        '[ ] Передано всі ключі від транспортного засобу, включно із запасними, та можливі пульти.',
        '[ ] Передано сервісну книжку, документи про обслуговування та іншу документацію, якщо вони є.',
        '[ ] Перевірено чинність технічного огляду та вимірювання викидів.',
        '[ ] Перевірено, чи не обтяжений транспортний засіб заставою, лізингом, забезпечувальною передачею права власності чи виконавчим провадженням.',
        '[ ] Купівельну ціну сплачено погодженим способом, і оплату можна підтвердити документально.',
        '[ ] Заяву про внесення зміни власника подано протягом 10 робочих днів з дня переходу права власності.',
        '[ ] Продавець припинив своє страхування цивільної відповідальності лише після внесення зміни власника; покупець уклав власне страхування до початку експлуатації транспортного засобу.',
        '[ ] Обидві сторони мають підписаний примірник Договору та акта приймання-передачі.',
        'Перевірку здійснив(ла): ................................  Дата: ................................  Підпис: ................................',
      ],
    });
  }
  return sections;
}

export function buildCarTranslationsBySection(d: StoredContractData, hasPremium: boolean): Array<NonNullable<ContractSection['translations']>> {
  return buildBilingualTranslations({
    en: () => en(d, hasPremium),
    ua: () => ua(d, hasPremium),
  });
}
