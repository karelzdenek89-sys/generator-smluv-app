/**
 * Balíček Zakázka Plus — obsah dokumentu, cenová cesta a chování flagu.
 *
 * Flagy se nastavují nahoře, aby platily po celý běh testu; obsah balíčku
 * i generovaný dokument je čtou až při volání, takže na pořadí importů
 * nezáleží. Právě tuto vlastnost ověřuje `testVehiclePromiseMatchesDocument`.
 */
process.env.NEXT_PUBLIC_FEATURE_ZAKAZKA_PLUS = 'true';
process.env.NEXT_PUBLIC_FEATURE_CAR_SALE_COMPLETE = 'true';
process.env.STRIPE_PRICE_ID_WORK_ORDER = 'price_work_order';
process.env.STRIPE_PRICE_ID_PACKAGE = 'price_package';

import assert from 'node:assert/strict';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import { buildContractSections, type StoredContractData } from '../lib/contracts';
import { renderContractPdf } from '../lib/pdf';
import { extractPdfText } from '../lib/pdf-text';
import { getPackageIncludedOutputs, THEMATIC_PACKAGE_CONFIG } from '../lib/packages';

const baseWorkContract: StoredContractData = {
  contractType: 'work_contract',
  packageKey: 'work_order',
  tier: 'complete',
  clientName: 'Objednatel s.r.o.',
  clientRegNo: '23660295',
  clientAddress: 'Václavské náměstí 1, Praha 1',
  contractorName: 'Jan Zhotovitel',
  contractorRegNo: '87654321',
  contractorAddress: 'Dlouhá 10, Brno',
  workTitle: 'Rekonstrukce koupelny',
  workDescription: 'Kompletní rekonstrukce koupelny včetně obkladů a instalací.',
  workLocation: 'Praha 4',
  materialBy: 'contractor',
  priceAmount: '180000',
  currency: 'Kč',
  vatIncluded: true,
  paymentType: 'with_deposit',
  depositAmount: '50000',
  depositDueDays: '5',
  finalPaymentDays: '14',
  bankAccount: '123456789/0800',
  variableSymbol: '2026001',
  startDate: '2026-09-01',
  endDate: '2026-11-30',
  warrantyMonths: '24',
  delayPenaltyPerDay: '0,05',
  clientPenaltyPerDay: '0,05',
  maxPenaltyPercent: '15',
  defectPenaltyPercent: '10',
  handoverProtocol: true,
  withdrawalRight: true,
  ipAssignment: 'client',
  disputeResolution: 'mediation',
  contractDate: '2026-08-20',
};

function combinedText(data: StoredContractData) {
  return buildContractSections(data)
    .flatMap((section) => [section.title, ...section.body])
    .join('\n');
}

function testPackageAppendices() {
  const text = combinedText(baseWorkContract);

  assert.match(text, /PŘÍLOHA Č\. 1 – PŘEDÁVACÍ A AKCEPTAČNÍ PROTOKOL K DÍLU/);
  assert.match(text, /PŘÍLOHA Č\. 2 – FORMULÁŘ VÍCEPRACÍ/);
  assert.match(text, /PŘÍLOHA Č\. 3 – ZMĚNOVÝ LIST/);
  assert.match(text, /PŘÍLOHA Č\. 4 – PLATEBNÍ HARMONOGRAM/);

  // Přílohy musí vycházet ze zadaných údajů, ne z obecné šablony.
  assert.match(text, /Rekonstrukce koupelny/);
  // toLocaleString('cs-CZ') odděluje tisíce pevnou mezerou, proto \s.
  assert.match(text, /180\s000\sKč/);
  assert.match(text, /123456789\/0800/);
  // Záruka v protokolu odpovídá záruce sjednané ve smlouvě.
  assert.match(text, /24 měsíců a počíná běžet dnem podpisu tohoto protokolu/);
  // Vícepráce zůstávají navázané na písemné odsouhlasení podle § 2597 OZ.
  assert.match(text, /§ 2597 OZ/);
  // Změnový list se stává číslovaným dodatkem podle § 564 OZ.
  assert.match(text, /§ 564 OZ/);
}

function testSingleDocumentHasNoAppendices() {
  const text = combinedText({ ...baseWorkContract, packageKey: null, tier: 'complete' });
  assert.doesNotMatch(
    text,
    /FORMULÁŘ VÍCEPRACÍ|ZMĚNOVÝ LIST|PLATEBNÍ HARMONOGRAM/,
    'standalone document must not include package appendices',
  );

  const basic = combinedText({ ...baseWorkContract, packageKey: null, tier: 'basic' });
  assert.doesNotMatch(basic, /PŘÍLOHA Č\./, 'basic tier must not include appendices');
}

function testNoPlaceholderLeaks() {
  const text = combinedText(baseWorkContract);
  assert.doesNotMatch(text, /_{8,}/, 'appendices must not use underscore placeholders');
  assert.doesNotMatch(text, /\(neuvedeno\)/, 'appendices must not leak the literal placeholder');
  assert.doesNotMatch(text, /undefined|NaN|\[object Object\]/, 'appendices must not leak raw values');
}

function testVehiclePackageExtras() {
  const car: StoredContractData = {
    contractType: 'car_sale',
    packageKey: 'vehicle_sale',
    tier: 'complete',
    sellerName: 'Petr Prodávající',
    sellerId: '800101/1234',
    sellerAddress: 'Nádražní 5, Plzeň',
    buyerName: 'Eva Kupující',
    buyerId: '905050/5678',
    buyerAddress: 'Krátká 2, Ostrava',
    carMake: 'Škoda',
    carModel: 'Octavia',
    carVIN: 'TMBJB41Z9C2123456',
    carPlate: '1AB 2345',
    priceAmount: '250000',
    contractDate: '2026-08-20',
  };

  const text = combinedText(car);
  assert.match(text, /PŘÍLOHA Č\. 2 – PLNÁ MOC K ZÁPISU ZMĚNY VLASTNÍKA VOZIDLA/);
  assert.match(text, /PŘÍLOHA Č\. 3 – CHECKLIST PŘEDÁNÍ VOZIDLA A DOKLADŮ/);
  assert.match(text, /TMBJB41Z9C2123456/);
  assert.match(text, /§ 441 odst\. 2 OZ/);
  assert.match(text, /56\/2001 Sb\./);
  assert.match(text, /úředně ověřeným podpisem/);

  // Samostatný dokument bez balíčku tyto přílohy nedostane.
  const standalone = combinedText({ ...car, packageKey: null });
  assert.doesNotMatch(standalone, /PLNÁ MOC K ZÁPISU ZMĚNY VLASTNÍKA/);
}

/**
 * Slib v checkoutu a skutečný obsah dokumentu musí řídit tentýž flag.
 * Kdyby se rozešly, zákazník by v obsahu balíčku viděl přílohu, kterou PDF
 * neobsahuje — nebo naopak platil za méně, než dostane.
 */
function testVehiclePromiseMatchesDocument() {
  const promised = getPackageIncludedOutputs('vehicle_sale');
  const promisesPoa = promised.some((item) => /Plná moc/i.test(item));
  const promisesChecklist = promised.some((item) => /Checklist předání vozidla/i.test(item));

  assert.equal(
    promisesPoa,
    true,
    'with the flag on, the checkout summary must promise the power of attorney',
  );
  assert.equal(promisesChecklist, true, 'with the flag on, the checklist must be promised');
}

async function testPdfRenders() {
  const pdf = await renderContractPdf(baseWorkContract);
  const parsed = await pdfParse(pdf);
  const pdfText = await extractPdfText(pdf);

  assert.ok(parsed.numpages >= 6, 'work-order package PDF should carry the contract and appendices');
  assert.match(pdfText, /PŘEDÁVACÍ A AKCEPTAČNÍ PROTOKOL K DÍLU/i);
  assert.match(pdfText, /FORMULÁŘ VÍCEPRACÍ/i);
  assert.match(pdfText, /ZMĚNOVÝ LIST/i);
  assert.match(pdfText, /PLATEBNÍ HARMONOGRAM/i);
  // Česká diakritika musí přežít sazbu PDF.
  assert.match(pdfText, /příloh|Příloh|PŘÍLOHA/);
  assert.match(pdfText, /Rekonstrukce koupelny/);
}

async function main() {
  assert.equal(THEMATIC_PACKAGE_CONFIG.work_order.priceCzk, 399);
  assert.equal(THEMATIC_PACKAGE_CONFIG.work_order.contractType, 'work_contract');

  testPackageAppendices();
  testSingleDocumentHasNoAppendices();
  testNoPlaceholderLeaks();
  testVehiclePackageExtras();
  testVehiclePromiseMatchesDocument();
  await testPdfRenders();

  console.log('Work-order package audit passed (appendices, vehicle extras, PDF, diacritics).');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
