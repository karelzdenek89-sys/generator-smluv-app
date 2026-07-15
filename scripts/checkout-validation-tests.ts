import assert from 'node:assert/strict';
import { CONTRACT_TYPES, validateContractPayload, type ContractType } from '@/lib/checkout-validation';

const fixtures: Record<ContractType, Record<string, unknown>> = {
  lease: { landlordName: 'A', tenantName: 'B', flatAddress: 'Praha 1', rentAmount: '10000', startDate: '2026-08-01', duration: 'indefinite' },
  car_sale: { sellerName: 'A', buyerName: 'B', carMake: 'Škoda', carVIN: 'TMB12345678901234', priceAmount: '200000' },
  gift: { donorName: 'A', doneeName: 'B', giftType: 'money', amount: '1000' },
  work_contract: { clientName: 'A', contractorName: 'B', workTitle: 'Web', workDescription: 'Tvorba webu', priceAmount: '50000' },
  loan: { lenderName: 'A', borrowerName: 'B', loanAmount: '10000' },
  nda: { disclosingName: 'A', receivingName: 'B', confidentialInfoDesc: 'Obchodní informace' },
  general_sale: { sellerName: 'A', buyerName: 'B', itemDescription: 'Notebook', price: '10000' },
  employment: { employerName: 'A', employeeName: 'B', jobTitle: 'Vývojář', workPlace: 'Praha', startDate: '2026-08-01', salary: '50000' },
  dpp: { employerName: 'A', employeeName: 'B', taskDescription: 'Administrativa', workPlace: 'Praha', hourlyRate: '200' },
  service: { providerName: 'A', clientName: 'B', serviceDescription: 'Konzultace', hourlyRate: '1000' },
  sublease: { landlordName: 'A', tenantName: 'B', flatAddress: 'Praha 1', rentAmount: '10000', startDate: '2026-08-01', duration: 'indefinite' },
  power_of_attorney: { principalName: 'A', agentName: 'B', poaType: 'specific' },
  debt_acknowledgment: { creditorName: 'A', debtorName: 'B', debtAmount: '10000' },
  cooperation: { partyAName: 'A', partyBName: 'B', cooperationScope: 'Společný projekt' },
};

for (const contractType of CONTRACT_TYPES) {
  const valid = validateContractPayload(contractType, fixtures[contractType]);
  assert.equal(valid.success, true, `${contractType} valid fixture must pass`);

  const firstKey = Object.keys(fixtures[contractType])[0];
  const invalid = { ...fixtures[contractType], [firstKey]: '' };
  assert.equal(
    validateContractPayload(contractType, invalid).success,
    false,
    `${contractType} missing required field must fail`,
  );
}

assert.equal(
  validateContractPayload('lease', { ...fixtures.lease, duration: 'fixed', endDate: '' }).success,
  false,
  'fixed lease requires endDate',
);
assert.equal(
  validateContractPayload('gift', { ...fixtures.gift, giftType: 'car', carVIN: '' }).success,
  false,
  'car gift requires VIN',
);

console.log(`Checkout validation tests passed for ${CONTRACT_TYPES.length} contract types.`);
