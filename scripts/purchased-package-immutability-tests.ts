/**
 * Zakoupený balíček je neměnný.
 *
 * Feature flag smí rozhodovat pouze o tom, zda lze produkt právě koupit.
 * Nikdy nesmí ovlivnit, co dostane zákazník, který už zaplatil — ani při
 * opětovném stažení po vypnutí produktu.
 *
 * Flagy se tu přepínají za běhu; `isFeatureEnabled` i celý balíčkový modul
 * čtou prostředí až při volání, takže na pořadí importů nezáleží.
 */
import assert from 'node:assert/strict';
import { buildContractSections, type StoredContractData } from '../lib/contracts';
import {
  getPackageIncludedOutputs,
  normalizeThematicPackageKeyForContract,
  resolvePurchasablePackageKeyForContract,
  resolvePurchasablePackageVersion,
} from '../lib/packages';

function setFlag(name: string, on: boolean) {
  if (on) process.env[name] = 'true';
  else delete process.env[name];
}

function combinedText(data: StoredContractData): string {
  return buildContractSections(data)
    .flatMap((section) => [section.title, ...section.body])
    .join('\n');
}

const paidVehicleOrder: StoredContractData = {
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

const paidWorkOrder: StoredContractData = {
  contractType: 'work_contract',
  packageKey: 'work_order',
  tier: 'complete',
  clientName: 'Objednatel s.r.o.',
  contractorName: 'Jan Zhotovitel',
  workTitle: 'Rekonstrukce koupelny',
  workDescription: 'Kompletní rekonstrukce koupelny.',
  workLocation: 'Praha 4',
  priceAmount: '180000',
  currency: 'Kč',
  warrantyMonths: '24',
  contractDate: '2026-08-20',
};

/**
 * Balíček pro prodej vozidla: obsah verze 2 musí přežít vypnutí flagu.
 */
function testVehiclePackageStaysImmutable() {
  // 1. Produkt je v provozu — nový zákazník kupuje verzi 2.
  setFlag('NEXT_PUBLIC_FEATURE_CAR_SALE_COMPLETE', true);
  const purchasedVersion = resolvePurchasablePackageVersion('vehicle_sale');
  assert.equal(purchasedVersion, 2, 'with the flag on a new order must buy version 2');

  // 2. Stav odpovídající zaplacené objednávce.
  const paid: StoredContractData = { ...paidVehicleOrder, packageVersion: purchasedVersion };
  const whileEnabled = combinedText(paid);
  assert.match(whileEnabled, /PLNÁ MOC K ZÁPISU ZMĚNY VLASTNÍKA VOZIDLA/);
  assert.match(whileEnabled, /CHECKLIST PŘEDÁNÍ VOZIDLA A DOKLADŮ/);
  const promisedWhileEnabled = getPackageIncludedOutputs('vehicle_sale', {
    version: purchasedVersion,
  });

  // 3. Produkt se vypne.
  setFlag('NEXT_PUBLIC_FEATURE_CAR_SALE_COMPLETE', false);

  // 4. Opětovné stažení téže objednávky.
  const whileDisabled = combinedText(paid);

  // 5. Obsah je bajt po bajtu totožný.
  assert.equal(
    whileDisabled,
    whileEnabled,
    'turning the product off must not change an already paid document',
  );
  assert.deepEqual(
    getPackageIncludedOutputs('vehicle_sale', { version: purchasedVersion }),
    promisedWhileEnabled,
    'the purchased scope listing must survive the product being turned off',
  );
}

/**
 * Objednávka koupená před verzováním nemá `packageVersion`. Musí zůstat
 * na verzi 1 i tehdy, když je flag zapnutý — nekoupila si přílohy navíc.
 */
function testLegacyOrderStaysOnVersionOne() {
  setFlag('NEXT_PUBLIC_FEATURE_CAR_SALE_COMPLETE', true);
  const legacy = combinedText(paidVehicleOrder); // bez packageVersion
  assert.doesNotMatch(
    legacy,
    /PLNÁ MOC K ZÁPISU ZMĚNY VLASTNÍKA/,
    'an order placed before versioning must not silently gain new appendices',
  );
  assert.match(legacy, /PŘEDÁVACÍ PROTOKOL K VOZIDLU/, 'version 1 scope must stay intact');
  setFlag('NEXT_PUBLIC_FEATURE_CAR_SALE_COMPLETE', false);
}

/**
 * Zakázka Plus: vypnutí produktu nesmí zákazníkovi, který zaplatil 399 Kč,
 * vygenerovat dokument bez příloh.
 */
function testWorkOrderPackageStaysImmutable() {
  setFlag('NEXT_PUBLIC_FEATURE_ZAKAZKA_PLUS', true);
  const paid: StoredContractData = {
    ...paidWorkOrder,
    packageVersion: resolvePurchasablePackageVersion('work_order'),
  };
  const whileEnabled = combinedText(paid);
  assert.match(whileEnabled, /PŘEDÁVACÍ A AKCEPTAČNÍ PROTOKOL K DÍLU/);
  assert.match(whileEnabled, /FORMULÁŘ VÍCEPRACÍ/);
  assert.match(whileEnabled, /ZMĚNOVÝ LIST/);
  assert.match(whileEnabled, /PLATEBNÍ HARMONOGRAM/);

  setFlag('NEXT_PUBLIC_FEATURE_ZAKAZKA_PLUS', false);
  assert.equal(
    combinedText(paid),
    whileEnabled,
    'turning Zakázka Plus off must not strip appendices from a paid order',
  );
}

/**
 * Opačný směr: vypnutý produkt nelze koupit, ale zaplacenou objednávku
 * je pořád možné odbavit a znovu stáhnout.
 */
function testDisabledProductBlocksSaleButNotFulfilment() {
  setFlag('NEXT_PUBLIC_FEATURE_ZAKAZKA_PLUS', false);

  // Nový nákup: checkout balíček odmítne.
  assert.equal(
    resolvePurchasablePackageKeyForContract('work_order', 'work_contract'),
    null,
    'a disabled product must not be purchasable',
  );

  // Plnění objednávky: klíč se musí normálně vyřešit, jinak by stažení
  // vygenerovalo dokument bez zakoupených příloh.
  assert.equal(
    normalizeThematicPackageKeyForContract('work_order', 'work_contract'),
    'work_order',
    'fulfilment must resolve the package even while the product is off',
  );

  // Typová vazba balíčku platí v obou cestách.
  assert.equal(normalizeThematicPackageKeyForContract('work_order', 'lease'), null);

  // Se zapnutým produktem jde koupit i odbavit.
  setFlag('NEXT_PUBLIC_FEATURE_ZAKAZKA_PLUS', true);
  assert.equal(
    resolvePurchasablePackageKeyForContract('work_order', 'work_contract'),
    'work_order',
  );
  setFlag('NEXT_PUBLIC_FEATURE_ZAKAZKA_PLUS', false);

  // Balíčky bez flagu jsou dostupné pořád.
  assert.equal(
    resolvePurchasablePackageKeyForContract('landlord', 'lease'),
    'landlord',
  );
}

/**
 * Pojistka proti návratu chyby: generování dokumentu ani jeho odbavení
 * se nesmí ptát na feature flag.
 */
async function testGenerationNeverReadsFlags() {
  const { readFileSync } = await import('node:fs');
  const { join, dirname } = await import('node:path');
  const { fileURLToPath } = await import('node:url');
  const root = join(dirname(fileURLToPath(import.meta.url)), '..');

  const guarded = [
    'lib/contracts.ts',
    'lib/pdf.ts',
    'lib/docx.ts',
    'app/api/contracts/download/route.ts',
    'app/api/contracts/status/route.ts',
    'app/api/stripe/webhook/route.ts',
  ];

  for (const file of guarded) {
    const source = readFileSync(join(root, file), 'utf8');
    assert.doesNotMatch(
      source,
      /isFeatureEnabled|isThematicPackageAvailable/,
      `${file} must not gate a paid document on a feature flag`,
    );
  }
}

async function main() {
  testVehiclePackageStaysImmutable();
  testLegacyOrderStaysOnVersionOne();
  testWorkOrderPackageStaysImmutable();
  testDisabledProductBlocksSaleButNotFulfilment();
  await testGenerationNeverReadsFlags();

  console.log(
    'Purchased package immutability passed (vehicle_sale, work_order, legacy orders, sale vs fulfilment).',
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
