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
  employment: { employerName: 'A', employeeName: 'B', jobTitle: 'Vývojář', workPlace: 'Praha', startDate: '2026-08-01', salaryType: 'monthly', salary: '50000', workHours: '40', employmentType: 'indefinite', trialPeriodMonths: '3', noticePeriod: '2' },
  dpp: { employerName: 'A', employeeName: 'B', taskDescription: 'Administrativa', workPlace: 'Praha', remunerationType: 'hourly', hourlyRate: '200', estimatedHours: '80', durationType: 'fixed', startDate: '2026-08-01', endDate: '2026-12-31' },
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

assert.equal(
  validateContractPayload('employment', { ...fixtures.employment, salary: '20000' }).success,
  false,
  'full-time monthly salary below the 2026 minimum must fail',
);
assert.equal(
  validateContractPayload('employment', {
    ...fixtures.employment,
    salaryType: 'hourly',
    salary: '',
    hourlyRate: '120',
  }).success,
  false,
  'employment hourly rate below the 2026 minimum must fail',
);
assert.equal(
  validateContractPayload('employment', {
    ...fixtures.employment,
    employmentType: 'fixed',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    trialPeriodMonths: '2',
  }).success,
  false,
  'probation must not exceed half of a fixed employment term',
);
assert.equal(
  validateContractPayload('employment', {
    ...fixtures.employment,
    employmentType: 'fixed',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    trialPeriodMonths: '1',
  }).success,
  true,
  'one-month probation must fit into a three-month fixed term',
);
assert.equal(
  validateContractPayload('employment', { ...fixtures.employment, noticePeriod: '1' }).success,
  false,
  'generic contractual notice period below two months must fail',
);
assert.equal(
  validateContractPayload('dpp', { ...fixtures.dpp, hourlyRate: '120' }).success,
  false,
  'DPP hourly remuneration below the 2026 minimum must fail',
);
assert.equal(
  validateContractPayload('dpp', {
    ...fixtures.dpp,
    remunerationType: 'fixed',
    hourlyRate: '',
    totalRemuneration: '10000',
    estimatedHours: '100',
  }).success,
  false,
  'DPP fixed remuneration below the hourly minimum must fail',
);
assert.equal(
  validateContractPayload('dpp', { ...fixtures.dpp, estimatedHours: '301' }).success,
  false,
  'DPP above 300 hours per employer and year must fail',
);
assert.equal(
  validateContractPayload('dpp', {
    ...fixtures.dpp,
    remunerationType: 'fixed',
    hourlyRate: '',
    totalRemuneration: '20000',
    estimatedHours: '',
  }).success,
  false,
  'DPP fixed remuneration requires hours so minimum pay can be checked',
);

console.log(`Checkout validation tests passed for ${CONTRACT_TYPES.length} contract types.`);
