import { renderContractPdf } from '../lib/pdf';
import { writeFileSync } from 'fs';

const testData = {
  contractType: 'lease' as const,
  tier: 'complete' as const,
  notaryUpsell: true,

  landlordName: 'Ing. Pavel Novák',
  landlordId: '15.07.1978',
  landlordAddress: 'Vinohradská 48, 120 00 Praha 2',
  landlordOP: '123456789',
  landlordEmail: 'p.novak@email.cz',
  landlordPhone: '602 111 222',

  tenantName: 'Mgr. Jana Svobodová',
  tenantId: '12.03.1992',
  tenantAddress: 'Korunní 15, 101 00 Praha 10',
  tenantOP: '987654321',
  tenantEmail: 'j.svobodova@email.cz',
  tenantPhone: '777 333 444',

  flatAddress: 'Mánesova 22, 120 00 Praha 2',
  flatLayout: '2+kk',
  flatArea: '58',
  flatUnitNumber: '14',
  floor: '3',
  ownershipSheet: '1842',
  cadastralArea: 'Vinohrady',
  parcelNumber: '412/2',

  startDate: '2026-05-01',
  handoverDate: '2026-05-01',
  duration: 'indefinite' as const,
  endDate: '',

  rentAmount: '22000',
  utilityAmount: '3500',
  depositAmount: '44000',
  paymentDay: '15',
  bankAccount: '2345678901/0800',
  variableSymbol: '2026001',
  utilitiesIncludedText: 'Voda, teplo, elektřina společných prostor, internet (optika)',

  keysCount: '3',
  electricityMeter: '5 247',
  electricityMeterSerial: 'EL-4452017',
  gasMeter: '318',
  gasMeterSerial: 'GAS-7731',
  waterMeter: '142',
  waterMeterSerial: 'VD-2291-S',
  hotWaterMeter: '68',
  hotWaterMeterSerial: 'VD-2292-T',
  equipmentList: 'Kuchyňská linka (vestavěná trouba, indukční varná deska, digestoř, myčka), lednice, pračka, vestavěné skříně v ložnici, žaluzie na všech oknech',
  knownDefects: 'Drobná škrábanec na parketové podlaze v obývacím pokoji (cca 5 cm), viz přiložená fotodokumentace.',

  allowPets: false,
  allowSmoking: false,
  allowAirbnb: false,
  strictPenalties: true,
  inspectionAllowed: true,
  maxOccupants: '2',
  businessUseAllowed: false,
  includeInflationIndexation: true,

  disputeResolution: 'court' as const,
  packageKey: null,
};

(async () => {
  console.log('Generating PDF...');
  const buf = await renderContractPdf(testData as any);
  writeFileSync('/sessions/laughing-beautiful-brown/test-lease.pdf', buf);
  console.log(`Done — ${buf.length} bytes → test-lease.pdf`);
})();
