/**
 * Power of attorney (plná moc) — translations for EN/UK/RU/VN/DE.
 * Mirrors buildPowerOfAttorneyContractSections paragraph-by-paragraph.
 */
import type { ContractSection, StoredContractData } from '../contracts';
import { buildBilingualTranslations, fmtAmount, fmtDate, pad, type ParaPair } from './helpers';

// ── EN ─────────────────────────────────────────────────────────────────────
function en(d: StoredContractData, hasPremium: boolean): ParaPair[] {
  const scopeDesc = (() => {
    switch (d.poaType) {
      case 'property':
        return `any legal act relating to the transfer, purchase, sale, lease or other disposal of the real property at / in the cadastral area: ${pad(d.propertyAddress) || 'unspecified'}, in particular: signing the purchase agreement, future-purchase agreement, lease, and gift; representation before the Land Registry, financial institutions and public authorities. WARNING: This power of attorney requires officially certified signature of the principal (notary or Czech POINT). Without certification it will not be accepted by the Land Registry or financial institutions.`;
      case 'court':
        return `representation of the principal in proceedings at ${pad(d.courtName) || 'unspecified'}, file no. ${pad(d.caseNumber) || 'unspecified'}, including receipt of mail, lodging of appeals and conclusion of settlements. WARNING: A court power of attorney should bear an officially certified signature. In proceedings where representation by counsel is mandatory (§ 27 CCP), the agent must be an attorney.`;
      case 'company':
        return `representation of the principal as partner / director / shareholder of ${pad(d.companyName) || 'unspecified'}, Company ID ${pad(d.companyIco) || 'unspecified'}, for the following acts: ${pad(d.companyScope) || 'general meeting, dealings with public authorities, business negotiations'}`;
      case 'bank':
        return `representation at banks and financial institutions, in particular handling account no. ${pad(d.bankAccount) || 'unspecified'} held at ${pad(d.bankName) || 'unspecified'}, including withdrawals, deposits and administration. WARNING: Banks usually require their own power-of-attorney form or an officially certified signature. Verify with your bank that this document is accepted.`;
      default:
        return `${pad(d.customScope) || 'unspecified'}`;
    }
  })();
  const validity = d.validUntil
    ? `This power of attorney is valid until ${pad(d.validUntil)}.`
    : d.singleUse
    ? 'This power of attorney is one-off and expires upon completion of the act for which it was granted.'
    : 'This power of attorney is valid until expressly revoked by the principal.';
  const substitution = d.allowSubstitution
    ? 'The agent is entitled to grant a sub-power of attorney to a third party (substitution).'
    : 'The agent is not entitled to grant a power of attorney in his / her place to a third party (substitution prohibited).';

  const sections: ParaPair[] = [
    { title: 'POWER OF ATTORNEY', body: ['This power of attorney is granted under § 441 et seq. of Act No. 89/2012 Coll., the Czech Civil Code, as amended.', `Date granted: ${d.contractDate ? fmtDate(d.contractDate) : new Date().toLocaleDateString('en-GB')}`] },
    { title: 'I. PRINCIPAL', body: [`Name / company name: ${pad(d.principalName)}`, `Date of birth / Company ID: ${pad(d.principalId) || '—'}`, `Permanent residence / registered office: ${pad(d.principalAddress)}`, d.principalEmail ? `E-mail: ${pad(d.principalEmail)}` : ''] },
    { title: 'II. AGENT', body: [`Name / company name: ${pad(d.agentName)}`, `Date of birth / Company ID: ${pad(d.agentId) || '—'}`, `Permanent residence / registered office: ${pad(d.agentAddress)}`, d.agentEmail ? `E-mail: ${pad(d.agentEmail)}` : ''] },
    { title: 'III. SCOPE AND SUBJECT OF AUTHORISATION', body: ["The principal hereby authorises the agent to represent the principal and act in the principal's name and on the principal's account in the matter of:", scopeDesc, substitution] },
    { title: 'IV. VALIDITY', body: [validity, 'The power of attorney also expires upon the death of the principal or the agent, unless the nature of the matter implies otherwise.', 'The principal may revoke the power of attorney at any time; revocation takes effect upon delivery to the agent.'] },
    { title: "V. PRINCIPAL'S DECLARATIONS", body: ['The principal declares that:', '(a) this power of attorney is granted freely, seriously and without coercion,', '(b) the principal has full legal capacity,', '(c) the principal is aware of the scope of authority granted and its legal consequences.', hasPremium ? "The authenticity of the principal's signature is verified by a notary or at a Czech POINT. Official certification significantly increases the usability of the power of attorney towards third parties; some institutions may still require their own form or additional conditions under special rules or internal policies." : '', "(d) the agent shall act with due care and in the principal's best interest; the agent shall inform the principal of any legal act taken under this authorisation without undue delay.", '(e) the principal may revoke this power of attorney at any time in writing; revocation takes effect at the moment the agent learns of it (§ 448(1) Civil Code). The agent shall promptly return the original of the power of attorney to the principal upon revocation.'] },
  ];

  if (hasPremium) {
    sections.push({ title: 'VI. OFFICIAL SIGNATURE CERTIFICATION AND LEGAL EFFECTS TOWARDS THIRD PARTIES', body: ["Official certification of the principal's signature is performed by a notary, a Czech POINT, or the registry office of the municipal authority authorised to keep the registry. Certification is required in particular for legal acts concerning real estate to be recorded in the Land Registry (§ 6 Act No. 256/2013 Coll.), representation in proceedings before courts and public authorities, and handling bank accounts and funds.", "The original of the power of attorney is kept by the principal. The agent may present the original or an officially certified copy to third parties; upon termination of the authorisation or at the principal's request, the agent shall return the original without undue delay and destroy any copies.", 'The principal may revoke the power of attorney at any time; revocation takes effect against the agent upon delivery and against third parties at the moment they learn of it. For the avoidance of doubt, we recommend notifying third parties of the revocation in writing where the power was previously used.', 'This power of attorney is executed in two counterparts; one is kept by the principal, the other received by the agent as evidence. The principal may obtain further officially certified counterparts as needed.'] });
    sections.push({ title: 'VII. SANCTIONS FOR EXCEEDING AUTHORITY AND CONFLICT-OF-INTEREST PROHIBITION', body: ['The agent must not act in a matter in which the agent is a party or has a direct or indirect interest in the outcome (self-dealing prohibition). This restriction does not apply where the principal has granted prior express written consent, fully informed.', "The agent must not grant a sub-power of attorney without the principal's prior written consent. If a substitution is granted in breach, the agent is liable for the substitute's acts as for the agent's own.", d.agentPenalty && Number(d.agentPenalty) > 0 ? `Liability for damage caused by exceeding the scope of authority or negligent exercise of the power of attorney is governed by § 2913 Civil Code. For deliberate excess, the agent shall pay the principal a contractual penalty of CZK ${fmtAmount(d.agentPenalty)}; payment of the penalty is without prejudice to claims for damages.` : 'Liability for damage caused by exceeding the scope of authority or negligent exercise of the power of attorney is governed by § 2913 Civil Code. For deliberate excess the agent shall return any benefits received and compensate the principal for damage incurred, including reasonable costs of enforcing rights.', "If the agent exceeds the scope of authority, the excess does not bind the principal unless subsequently approved (§ 440 Civil Code). A third party acting in good faith may claim demonstrable damages against the agent."] });
  }

  sections.push({ title: `${hasPremium ? 'VIII' : 'VI'}. FINAL PROVISIONS`, body: ['This instrument is governed by the laws of the Czech Republic, in particular Act No. 89/2012 Coll., the Civil Code, as amended.', "The power of attorney takes effect upon signature of the principal and expires upon completion of the authorised act, expiry of the term, revocation by the principal, or death of a party (§ 448 Civil Code).", 'The principal may revoke this power of attorney in writing at any time, by delivering the revocation to the agent. Revocation takes effect at the moment the agent learns of it.', 'Limitation or extension of the scope of authority is valid only in writing.', 'The invalidity of any individual provision does not affect the validity of the remaining provisions.'] });
  sections.push({ title: `${hasPremium ? 'IX' : 'VII'}. SIGNATURES`, body: [] });
  return sections;
}

// ── UK (Українська) ────────────────────────────────────────────────────────
function uk(d: StoredContractData, hasPremium: boolean): ParaPair[] {
  const scopeDesc = (() => {
    switch (d.poaType) {
      case 'property': return `будь-які правочини щодо передачі, купівлі, продажу, оренди або іншого розпорядження нерухомістю за адресою / у кадастровому окрузі: ${pad(d.propertyAddress) || 'не вказано'}, зокрема: підписання договору купівлі-продажу, договору про намір, договору оренди та дарування; представництво перед Кадастром нерухомості, фінансовими установами та органами державної влади. УВАГА: ця довіреність потребує офіційно засвідченого підпису довірителя (нотаріус або Czech POINT). Без засвідчення її не прийме Кадастр нерухомості та фінансові установи.`;
      case 'court': return `представництво довірителя у провадженні в ${pad(d.courtName) || 'не вказано'}, справа № ${pad(d.caseNumber) || 'не вказано'}, у тому числі отримання кореспонденції, подання скарг та укладення мирових угод. УВАГА: судова довіреність повинна мати офіційно засвідчений підпис. У провадженнях з обов'язковим адвокатським представництвом (§ 27 ЦПК) представником має бути адвокат.`;
      case 'company': return `представництво довірителя як учасника / директора / акціонера ${pad(d.companyName) || 'не вказано'}, IČO ${pad(d.companyIco) || 'не вказано'}, для таких дій: ${pad(d.companyScope) || 'загальні збори, спілкування з органами державної влади, ділові переговори'}`;
      case 'bank': return `представництво в банках і фінансових установах, зокрема розпорядження рахунком № ${pad(d.bankAccount) || 'не вказано'} у ${pad(d.bankName) || 'не вказано'}, включно зі зняттями, внесками та адмініструванням. УВАГА: банки зазвичай вимагають власну форму довіреності або офіційно засвідчений підпис. Перевірте у вашому банку, чи приймається цей документ.`;
      default: return `${pad(d.customScope) || 'не вказано'}`;
    }
  })();
  const validity = d.validUntil ? `Ця довіреність діє до ${pad(d.validUntil)}.` : d.singleUse ? 'Ця довіреність є одноразовою і припиняється виконанням дії, для якої вона була надана.' : 'Ця довіреність діє до її прямого скасування довірителем.';
  const substitution = d.allowSubstitution ? 'Повірений має право видати субдовіреність третій особі (передоручення).' : 'Повірений не має права передоручити повноваження третій особі (передоручення заборонено).';

  const sections: ParaPair[] = [
    { title: 'ДОВІРЕНІСТЬ', body: ['Ця довіреність надається відповідно до § 441 та наступних Закону № 89/2012 Sb., Цивільний кодекс Чехії, з наступними змінами.', `Дата надання: ${d.contractDate ? fmtDate(d.contractDate, 'uk-UA') : new Date().toLocaleDateString('uk-UA')}`] },
    { title: 'I. ДОВІРИТЕЛЬ', body: [`Ім'я / назва: ${pad(d.principalName)}`, `Дата народження / IČO: ${pad(d.principalId) || '—'}`, `Місце постійного проживання / місцезнаходження: ${pad(d.principalAddress)}`, d.principalEmail ? `E-mail: ${pad(d.principalEmail)}` : ''] },
    { title: 'II. ПОВІРЕНИЙ', body: [`Ім'я / назва: ${pad(d.agentName)}`, `Дата народження / IČO: ${pad(d.agentId) || '—'}`, `Місце постійного проживання / місцезнаходження: ${pad(d.agentAddress)}`, d.agentEmail ? `E-mail: ${pad(d.agentEmail)}` : ''] },
    { title: 'III. ОБСЯГ І ПРЕДМЕТ ПОВНОВАЖЕНЬ', body: ['Довіритель цим уповноважує повіреного представляти довірителя та діяти від його імені та на його рахунок у справі:', scopeDesc, substitution] },
    { title: 'IV. СТРОК ДІЇ', body: [validity, 'Довіреність також припиняється смертю довірителя або повіреного, якщо інше не випливає з характеру справи.', 'Довіритель може будь-коли скасувати довіреність; скасування набуває чинності з моменту вручення повіреному.'] },
    { title: 'V. ЗАЯВИ ДОВІРИТЕЛЯ', body: ['Довіритель заявляє, що:', '(a) ця довіреність надана вільно, серйозно та без примусу,', '(b) має повну дієздатність,', '(c) усвідомлює обсяг наданих повноважень та їхні правові наслідки.', hasPremium ? 'Справжність підпису довірителя засвідчується нотаріусом або в системі Czech POINT. Офіційне засвідчення значно підвищує застосовність довіреності щодо третіх осіб; деякі установи, однак, можуть і надалі вимагати власну форму або додаткові умови.' : '', "(d) повірений зобов'язаний діяти добросовісно та в найкращих інтересах довірителя; про кожен правочин повірений негайно інформує довірителя.", '(e) довіритель може у будь-який момент письмово скасувати цю довіреність; скасування набуває чинності в момент, коли про нього дізнається повірений (§ 448(1) ЦК). Повірений після скасування зобов\'язаний негайно повернути оригінал довіреності довірителю.'] },
  ];

  if (hasPremium) {
    sections.push({ title: 'VI. ОФІЦІЙНЕ ЗАСВІДЧЕННЯ ПІДПИСУ ТА ПРАВОВІ НАСЛІДКИ ЩОДО ТРЕТІХ ОСІБ', body: ['Офіційне засвідчення підпису довірителя здійснює нотаріус, контактна точка Czech POINT або реєстраційний відділ муніципального органу, уповноваженого вести реєстри. Засвідчення є обов\'язковим зокрема для: правочинів щодо нерухомості, що підлягає внесенню до Кадастру нерухомості (§ 6 Закону № 256/2013 Sb.), представництва у провадженнях перед судами та органами державної влади, розпорядження банківськими рахунками та коштами.', 'Оригінал довіреності зберігає довіритель. Повірений має право подавати третім особам оригінал або офіційно засвідчену копію; після припинення повноважень або на вимогу довірителя зобов\'язаний негайно повернути оригінал і знищити всі свої копії.', 'Довіритель має право у будь-який час скасувати довіреність; скасування набуває чинності щодо повіреного з моменту вручення та щодо третіх осіб з моменту, коли вони про нього дізналися. Для уникнення сумнівів рекомендуємо письмово повідомити про скасування третім особам, перед якими довіреність раніше застосовувалась.', 'Ця довіреність складена у двох примірниках; один залишається у довірителя, другий отримує повірений як підтверджуючий документ. Довіритель має право виготовити подальші офіційно засвідчені примірники за потребою.'] });
    sections.push({ title: 'VII. САНКЦІЇ ЗА ПЕРЕВИЩЕННЯ ПОВНОВАЖЕНЬ ТА ЗАБОРОНА КОНФЛІКТУ ІНТЕРЕСІВ', body: ['Повірений не може діяти у справі, в якій сам є стороною або має прямий чи непрямий інтерес у результаті (заборона "self-dealing"). Це обмеження не застосовується, якщо довіритель надав попередню виразну письмову згоду з повним обізнанням про всі обставини.', "Повірений не може видати субдовіреність без попередньої письмової згоди довірителя. Якщо передоручення здійснено всупереч цьому, повірений відповідає за дії субпредставника як за свої власні.", d.agentPenalty && Number(d.agentPenalty) > 0 ? `За шкоду, заподіяну перевищенням обсягу повноважень або недбалим виконанням довіреності, повірений відповідає за § 2913 ЦК. У разі свідомого перевищення повноважень повірений зобов'язаний сплатити довірителю штраф у розмірі ${fmtAmount(d.agentPenalty)} крон; сплата штрафу не виключає права на відшкодування шкоди.` : "За шкоду, заподіяну перевищенням обсягу повноважень або недбалим виконанням довіреності, повірений відповідає за § 2913 ЦК. У разі свідомого перевищення повноважень повірений зобов'язаний повернути отримане та відшкодувати довірителю заподіяну шкоду, включно з доцільно понесеними витратами на захист прав.", 'Якщо повірений перевищив обсяг повноважень, перевищення не є обов\'язковим для довірителя, якщо тільки довіритель додатково не схвалить (§ 440 ЦК). Третя особа, яка діяла з повіреним добросовісно, має право на відшкодування доведеної шкоди від повіреного.'] });
  }

  sections.push({ title: `${hasPremium ? 'VIII' : 'VI'}. ЗАКЛЮЧНІ ПОЛОЖЕННЯ`, body: ['Цей акт регулюється правом Чеської Республіки, зокрема Законом № 89/2012 Sb., Цивільним кодексом, з наступними змінами.', 'Довіреність набуває чинності з моменту підпису довірителя і припиняється виконанням повноважень, спливом строку, скасуванням довірителем або смертю однієї зі сторін (§ 448 ЦК).', 'Довіритель може у будь-який час письмово скасувати цю довіреність шляхом вручення скасування повіреному. Скасування набуває чинності в момент, коли про нього дізнається повірений.', 'Обмеження або розширення обсягу повноважень дійсне лише у письмовій формі.', 'Недійсність окремого положення не впливає на дійсність інших положень.'] });
  sections.push({ title: `${hasPremium ? 'IX' : 'VII'}. ПІДПИСИ`, body: [] });
  return sections;
}

// ── RU (Русский) ───────────────────────────────────────────────────────────
export function buildPowerOfAttorneyTranslationsBySection(d: StoredContractData, hasPremium: boolean): Array<NonNullable<ContractSection['translations']>> {
  return buildBilingualTranslations({
    en: () => en(d, hasPremium),
    ua: () => uk(d, hasPremium),
  });
}
