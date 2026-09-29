/**
 * Power of attorney (plná moc) — full EN and UA translations.
 *
 * Mirrors buildPowerOfAttorneyContractSections in lib/contracts.ts section by
 * section and paragraph by paragraph. scripts/translation-parity-tests.ts
 * enforces the alignment and completeness. The Czech text remains the legally
 * binding version.
 */
import type { ContractSection, StoredContractData } from '../contracts';
import { amt, buildBilingualTranslations, dateIn, todayIn, txt, type ParaPair } from './helpers';

// ── EN ─────────────────────────────────────────────────────────────────────
function en(d: StoredContractData, hasPremium: boolean): ParaPair[] {
  const scopeDesc = (() => {
    switch (d.poaType) {
      case 'property':
        return `all legal acts relating to the transfer, purchase, sale, lease or other disposal of the immovable property at the address / in the cadastral area: ${txt(d.propertyAddress, 'not specified')}, in particular: signing a purchase agreement, an agreement on a future agreement, a lease agreement or a gift agreement; representation before the Land Registry (katastr nemovitostí), financial institutions and public authorities. Representation in Land Registry proceedings requires a power of attorney with the principal’s officially certified signature; for signing a specific deed for registration the power of attorney must also meet the form required by § 441(2) of the Civil Code. A bank or other recipient may require its own form.`;
      case 'court':
        return `representation of the principal in the matter conducted before ${txt(d.courtName, 'not specified')}, file no. ${txt(d.caseNumber, 'not specified')}, including receiving documents, lodging appeals and concluding settlements. An officially certified signature is usually not required for an ordinary procedural power of attorney; special proceedings or appeals may, however, require representation by an attorney or notary under the applicable procedural rules.`;
      case 'company':
        return `representation of the principal as a partner/executive director/shareholder of the company ${txt(d.companyName, 'not specified')}, Company ID ${txt(d.companyIco, 'not specified')}, in the following dealings: ${txt(d.companyScope, 'general meeting, dealings with state administration authorities, business negotiations')}`;
      case 'bank':
        return `representation at banks and financial institutions, in particular the handling of account no. ${txt(d.bankAccount, 'not specified')} held with ${txt(d.bankName, 'not specified')}, including withdrawals, deposits and account management. NOTICE: banks usually require their own power of attorney form or an officially certified signature. Check with your bank whether it accepts this document.`;
      default:
        return txt(d.customScope, 'not specified');
    }
  })();
  const validityClause = d.validUntil
    ? `This power of attorney is valid until ${txt(d.validUntil)}.`
    : d.singleUse
      ? 'This power of attorney is for a single use and expires upon performance of the act for which it was granted.'
      : 'This power of attorney is valid until expressly revoked by the principal.';
  const substitutionClause = d.allowSubstitution
    ? 'The agent is entitled to grant a substitute power of attorney to a third party (substitution).'
    : 'The agent is not entitled to grant a power of attorney to a third party in the agent’s place (substitution prohibited).';

  const sections: ParaPair[] = [
    {
      title: 'POWER OF ATTORNEY',
      body: [
        'This power of attorney is granted under § 441 et seq. of Act No. 89/2012 Coll., the Civil Code, as amended.',
        `Date granted: ${d.contractDate ? dateIn('en', d.contractDate) : todayIn('en')}`,
      ],
    },
    {
      title: 'I. PRINCIPAL',
      body: [
        `Name and surname / company name: ${txt(d.principalName)}`,
        `Date of birth / Company ID: ${txt(d.principalId)}`,
        `Permanent residence / registered office: ${txt(d.principalAddress)}`,
        d.principalEmail ? `E-mail: ${txt(d.principalEmail)}` : '',
      ],
    },
    {
      title: 'II. AGENT',
      body: [
        `Name and surname / company name: ${txt(d.agentName)}`,
        `Date of birth / Company ID: ${txt(d.agentId)}`,
        `Permanent residence / registered office: ${txt(d.agentAddress)}`,
        d.agentEmail ? `E-mail: ${txt(d.agentEmail)}` : '',
      ],
    },
    {
      title: 'III. SCOPE AND SUBJECT OF THE AUTHORISATION',
      body: [
        'The principal hereby authorises the agent to represent the principal and to act in the principal’s name and on the principal’s account in the matter of:',
        scopeDesc,
        substitutionClause,
      ],
    },
    {
      title: 'IV. VALIDITY OF THE POWER OF ATTORNEY',
      body: [
        validityClause,
        'The power of attorney also expires upon the death of the principal or of the agent, unless the nature of the matter implies otherwise.',
        'The principal may revoke the power of attorney at any time; the revocation takes effect upon delivery to the agent.',
      ],
    },
    {
      title: 'V. DECLARATIONS OF THE PRINCIPAL',
      body: [
        'The principal declares that the principal:',
        'a) grants this power of attorney freely, seriously and without coercion,',
        'b) has full legal capacity to perform legal acts,',
        'c) is aware of the scope of the authority granted and its legal consequences.',
        hasPremium ? 'If an officially certified signature is required for the intended act, the principal will have the signature certified by a notary, at a Czech POINT or at a registry office (matrika). Some institutions may require their own form or further conditions under special regulations or internal rules.' : '',
        'd) the agent shall act with the care of a prudent manager and in the best interests of the principal; the agent shall inform the principal without undue delay of every legal act performed under this authorisation.',
        'e) the principal may revoke this power of attorney in writing at any time; the revocation takes effect at the moment the agent learns of it (§ 448(1) of the Civil Code). After revocation, the agent shall return the original of the power of attorney to the principal without delay.',
      ],
    },
  ];

  if (hasPremium) {
    sections.push(
      {
        title: 'VI. OFFICIAL CERTIFICATION OF THE SIGNATURE AND LEGAL EFFECTS TOWARDS THIRD PARTIES',
        body: [
          'Under § 441(2) of the Civil Code, a power of attorney must have the same special form as the legal act for which it is granted; where the law requires a public instrument, a written power of attorney with an officially certified signature is usually sufficient. The signature can be certified by a notary, at a Czech POINT or at a registry office (matrika). Beyond the law, a particular court, authority, bank or other recipient may require its own form or further particulars.',
          'The original of the power of attorney is kept by the principal. The agent is entitled to present the original or an officially certified copy to third parties; upon termination of the authorisation or at the principal’s request, the agent shall return the original without undue delay and destroy all copies held by the agent.',
          'The principal is entitled to revoke the power of attorney at any time; the revocation takes effect towards the agent on the day of delivery and towards third parties at the moment they learned of it. For the avoidance of doubt, we recommend notifying the revocation in writing also to third parties towards whom the power of attorney was previously used.',
          'This power of attorney is drawn up in two counterparts; one is kept by the principal and the other is received by the agent as proof of authority. The principal is entitled to have further officially certified counterparts made as needed.',
        ],
      },
      {
        title: 'VII. SANCTIONS FOR EXCEEDING THE AUTHORITY AND PROHIBITION OF CONFLICTS OF INTEREST',
        body: [
          'The agent may not act in a matter in which the agent is a party or has a direct or indirect interest in the outcome (prohibition of so-called self-dealing). This restriction does not apply if the principal has given prior express written consent to such an act with knowledge of all relevant circumstances.',
          'The agent may not grant a substitution (transfer of the power of attorney to a third party) without the principal’s prior written consent. If the agent grants a substitution in breach of this provision, the agent is liable for the acts of the substitute as for the agent’s own.',
          d.agentPenalty && Number(d.agentPenalty) > 0
            ? `For damage caused by exceeding the scope of the authority or by negligent exercise of the power of attorney, the agent is liable to the principal for the damage demonstrably caused (§ 2913 of the Civil Code). If the agent knowingly exceeds the scope of the authority, the agent shall pay the principal a contractual penalty of CZK ${amt(d.agentPenalty)}; payment of the penalty does not affect the right to compensation for the damage incurred.`
            : 'For damage caused by exceeding the scope of the authority or by negligent exercise of the power of attorney, the agent is liable to the principal for the damage demonstrably caused (§ 2913 of the Civil Code). If the agent knowingly exceeds the authority, the agent shall return any performance received and compensate the principal for the damage incurred, including the costs reasonably incurred in asserting the principal’s rights.',
          'If the agent exceeds the scope of the authority, the excess is not binding on the principal unless the principal subsequently approves it (§ 440 of the Civil Code). A third party who dealt with the agent in good faith is entitled to compensation for demonstrable damage from the agent.',
        ],
      },
    );
  }

  sections.push({
    title: `${hasPremium ? 'VIII' : 'VI'}. FINAL PROVISIONS`,
    body: [
      'This instrument is governed by the law of the Czech Republic, in particular Act No. 89/2012 Coll., the Civil Code, as amended.',
      'The power of attorney takes effect upon the principal’s signature and expires upon performance of the authorised matter, expiry of the term, revocation by the principal or the death of either party (§ 448 of the Civil Code).',
      'The principal may revoke this power of attorney in writing at any time by delivering the revocation to the agent. The revocation takes effect at the moment the agent learns of it.',
      'A limitation or extension of the scope of the authority is valid only in writing.',
      'The invalidity of any individual provision does not affect the validity of the other provisions.',
    ],
  });
  sections.push({ title: `${hasPremium ? 'IX' : 'VII'}. SIGNATURES`, body: [] });
  return sections;
}

// ── UA ─────────────────────────────────────────────────────────────────────
function ua(d: StoredContractData, hasPremium: boolean): ParaPair[] {
  const scopeDesc = (() => {
    switch (d.poaType) {
      case 'property':
        return `усі юридичні дії щодо передачі, купівлі, продажу, оренди або іншого розпорядження нерухомою річчю за адресою / на кадастровій території: ${txt(d.propertyAddress, 'не зазначено')}, зокрема: підписання договору купівлі-продажу, договору про майбутній договір, договору оренди, договору дарування; представництво перед кадастром нерухомості (katastr nemovitostí), фінансовими установами та органами публічної влади. Для представництва в кадастровому провадженні потрібна довіреність з офіційно засвідченим підписом довірителя; для підписання конкретного документа для внесення до кадастру довіреність також має відповідати формі, яку вимагає § 441 ч. 2 ЦК. Банк або інший одержувач може вимагати власний бланк.`;
      case 'court':
        return `представництво довірителя у справі, що розглядається в ${txt(d.courtName, 'не зазначено')}, номер справи ${txt(d.caseNumber, 'не зазначено')}, включно з отриманням відправлень, поданням засобів оскарження та укладенням мирових угод. Для звичайної процесуальної довіреності офіційно засвідчений підпис, як правило, не вимагається; однак окремі провадження або засоби оскарження можуть вимагати представництва адвокатом чи нотаріусом відповідно до застосовного процесуального законодавства.`;
      case 'company':
        return `представництво довірителя як учасника/директора/акціонера товариства ${txt(d.companyName, 'не зазначено')}, IČO ${txt(d.companyIco, 'не зазначено')}, у таких справах: ${txt(d.companyScope, 'загальні збори, взаємодія з органами державного управління, ділові переговори')}`;
      case 'bank':
        return `представництво в банках і фінансових установах, зокрема розпорядження рахунком № ${txt(d.bankAccount, 'не зазначено')}, відкритим у ${txt(d.bankName, 'не зазначено')}, включно зі зняттям коштів, внесенням коштів і управлінням рахунком. УВАГА: банки, як правило, вимагають власний бланк довіреності або офіційно засвідчений підпис. Перевірте у своєму банку, чи приймає він цей документ.`;
      default:
        return txt(d.customScope, 'не зазначено');
    }
  })();
  const validityClause = d.validUntil
    ? `Ця довіреність дійсна до ${txt(d.validUntil)}.`
    : d.singleUse
      ? 'Ця довіреність є одноразовою і припиняється виконанням дії, для якої її було надано.'
      : 'Ця довіреність дійсна до її прямого відкликання довірителем.';
  const substitutionClause = d.allowSubstitution
    ? 'Повірений має право видати третій особі довіреність у порядку передоручення (субституція).'
    : 'Повірений не має права видати довіреність третій особі замість себе (заборона передоручення).';

  const sections: ParaPair[] = [
    {
      title: 'ДОВІРЕНІСТЬ',
      body: [
        'Ця довіреність надається відповідно до § 441 і наступних Закону № 89/2012 Sb., Цивільний кодекс, з наступними змінами.',
        `Дата надання: ${d.contractDate ? dateIn('ua', d.contractDate) : todayIn('ua')}`,
      ],
    },
    {
      title: 'I. ДОВІРИТЕЛЬ',
      body: [
        `Ім’я та прізвище / найменування: ${txt(d.principalName)}`,
        `Дата народження / IČO: ${txt(d.principalId)}`,
        `Місце постійного проживання / місцезнаходження: ${txt(d.principalAddress)}`,
        d.principalEmail ? `E-mail: ${txt(d.principalEmail)}` : '',
      ],
    },
    {
      title: 'II. ПОВІРЕНИЙ',
      body: [
        `Ім’я та прізвище / найменування: ${txt(d.agentName)}`,
        `Дата народження / IČO: ${txt(d.agentId)}`,
        `Місце постійного проживання / місцезнаходження: ${txt(d.agentAddress)}`,
        d.agentEmail ? `E-mail: ${txt(d.agentEmail)}` : '',
      ],
    },
    {
      title: 'III. ОБСЯГ І ПРЕДМЕТ ПОВНОВАЖЕНЬ',
      body: [
        'Довіритель цим уповноважує повіреного представляти його та діяти від його імені й на його рахунок у справі:',
        scopeDesc,
        substitutionClause,
      ],
    },
    {
      title: 'IV. СТРОК ДІЇ ДОВІРЕНОСТІ',
      body: [
        validityClause,
        'Довіреність також припиняється смертю довірителя або повіреного, якщо інше не випливає з характеру справи.',
        'Довіритель може будь-коли відкликати довіреність; відкликання набуває чинності з моменту його доставки повіреному.',
      ],
    },
    {
      title: 'V. ЗАЯВИ ДОВІРИТЕЛЯ',
      body: [
        'Довіритель заявляє, що:',
        'a) надає цю довіреність вільно, серйозно та без примусу,',
        'b) має повну дієздатність для вчинення юридичних дій,',
        'c) усвідомлює обсяг наданих повноважень та їхні правові наслідки.',
        hasPremium ? 'Якщо для запланованої дії потрібен офіційно засвідчений підпис, довіритель засвідчить підпис у нотаріуса, у пункті Czech POINT або в органі реєстрації актів цивільного стану (matrika). Деякі установи можуть вимагати власний бланк або додаткові умови відповідно до спеціальних норм чи внутрішніх правил.' : '',
        'd) повірений зобов’язаний діяти з турботливістю належного господаря та в найкращих інтересах довірителя; про кожну юридичну дію, вчинену в межах повноваження, повірений зобов’язаний без зайвої затримки повідомляти довірителя.',
        'e) довіритель може будь-коли письмово відкликати цю довіреність; відкликання набуває чинності в момент, коли про нього дізнається повірений (§ 448 ч. 1 ЦК). Після відкликання повірений зобов’язаний негайно повернути довірителю оригінал довіреності.',
      ],
    },
  ];

  if (hasPremium) {
    sections.push(
      {
        title: 'VI. ОФІЦІЙНЕ ЗАСВІДЧЕННЯ ПІДПИСУ ТА ПРАВОВІ НАСЛІДКИ ЩОДО ТРЕТІХ ОСІБ',
        body: [
          'Відповідно до § 441 ч. 2 ЦК довіреність повинна мати ту саму особливу форму, що й юридична дія, для якої її видано; якщо закон вимагає публічного документа, як правило, достатньо письмової довіреності з офіційно засвідченим підписом. Засвідчення підпису можна здійснити у нотаріуса, у пункті Czech POINT або в органі реєстрації актів цивільного стану (matrika). Понад вимоги закону конкретний суд, орган, банк чи інший одержувач може вимагати власний бланк або додаткові реквізити.',
          'Оригінал довіреності зберігає довіритель. Повірений має право пред’являти третім особам оригінал або офіційно засвідчену копію; після припинення повноважень або на вимогу довірителя він зобов’язаний без зайвої затримки повернути оригінал і знищити всі свої копії.',
          'Довіритель має право будь-коли відкликати довіреність; відкликання набуває чинності щодо повіреного в день доставки, а щодо третіх осіб — у момент, коли вони про нього дізналися. Для уникнення сумнівів рекомендуємо письмово повідомити про відкликання довіреності також третіх осіб, перед якими довіреність раніше використовувалася.',
          'Ця довіреність складена у двох однакових примірниках; один залишає собі довіритель, другий отримує повірений як документ, що підтверджує повноваження. Довіритель має право за потреби виготовити додаткові офіційно засвідчені примірники.',
        ],
      },
      {
        title: 'VII. САНКЦІЇ ЗА ПЕРЕВИЩЕННЯ ПОВНОВАЖЕНЬ І ЗАБОРОНА КОНФЛІКТУ ІНТЕРЕСІВ',
        body: [
          'Повірений не може діяти у справі, в якій сам є стороною або має прямий чи непрямий інтерес у результаті (заборона так званого self-dealing). Це обмеження не застосовується, якщо довіритель надав на таку дію попередню пряму письмову згоду з урахуванням усіх відповідних обставин.',
          'Повірений не може здійснити передоручення (передати довіреність третій особі) без попередньої письмової згоди довірителя. Якщо він здійснить передоручення всупереч цьому положенню, він відповідає за дії особи, якій передоручено, як за власні.',
          d.agentPenalty && Number(d.agentPenalty) > 0
            ? `За шкоду, заподіяну перевищенням обсягу повноважень або недбалим виконанням довіреності, повірений відповідає перед довірителем за доведено заподіяну шкоду (§ 2913 ЦК). У разі свідомого перевищення обсягу повноважень повірений зобов’язаний сплатити довірителю договірний штраф у розмірі ${amt(d.agentPenalty)} крон; сплата штрафу не зачіпає права на відшкодування завданої шкоди.`
            : 'За шкоду, заподіяну перевищенням обсягу повноважень або недбалим виконанням довіреності, повірений відповідає перед довірителем за доведено заподіяну шкоду (§ 2913 ЦК). У разі свідомого перевищення повноважень повірений зобов’язаний повернути отримане та відшкодувати довірителю завдану шкоду, включно з доцільно понесеними витратами на здійснення прав.',
          'Якщо повірений перевищить обсяг повноважень, перевищення не є обов’язковим для довірителя, якщо довіритель його згодом не схвалить (§ 440 ЦК). Третя особа, яка добросовісно діяла з повіреним, має право на відшкодування доведеної шкоди від повіреного.',
        ],
      },
    );
  }

  sections.push({
    title: `${hasPremium ? 'VIII' : 'VI'}. ПРИКІНЦЕВІ ПОЛОЖЕННЯ`,
    body: [
      'Цей документ регулюється правом Чеської Республіки, зокрема Законом № 89/2012 Sb., Цивільний кодекс, з наступними змінами.',
      'Довіреність набуває чинності з моменту підписання довірителем і припиняється виконанням доручення, закінченням строку, відкликанням довірителем або смертю однієї зі сторін (§ 448 ЦК).',
      'Довіритель може будь-коли письмово відкликати цю довіреність шляхом доставки відкликання повіреному. Відкликання набуває чинності в момент, коли про нього дізнається повірений.',
      'Обмеження або розширення обсягу повноважень дійсне лише в письмовій формі.',
      'Недійсність окремого положення не впливає на дійсність інших положень.',
    ],
  });
  sections.push({ title: `${hasPremium ? 'IX' : 'VII'}. ПІДПИСИ`, body: [] });
  return sections;
}

export function buildPowerOfAttorneyTranslationsBySection(d: StoredContractData, hasPremium: boolean): Array<NonNullable<ContractSection['translations']>> {
  return buildBilingualTranslations({
    en: () => en(d, hasPremium),
    ua: () => ua(d, hasPremium),
  });
}
