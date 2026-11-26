import assert from 'node:assert/strict';
import { buildContractSections } from '@/lib/contracts';
import { LEGACY_LABOR_TERMS_VERSION } from '@/lib/legal/labor-rates';
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

const propertyGift = validateContractPayload('gift', {
  ...fixtures.gift,
  giftType: 'property',
  propertyAddress: 'Vzorová 1, Praha',
  propertyLV: '123',
  propertyCadastre: 'Vzorové území',
});
assert.equal(propertyGift.success, false, 'new real-estate gifts are unavailable at checkout');
if (!propertyGift.success) {
  assert.ok(propertyGift.error.issues.some(({ path }) => path[0] === 'giftType'));
}


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
assert.equal(
  validateContractPayload('work_contract', {
    ...fixtures.work_contract,
    paymentType: 'with_deposit',
    depositAmount: '60000',
  }).success,
  false,
  'work_contract deposit exceeding total priceAmount must fail',
);
assert.equal(
  validateContractPayload('work_contract', {
    ...fixtures.work_contract,
    warrantyMonths: '-6',
  }).success,
  false,
  'work_contract negative warrantyMonths must fail',
);
assert.equal(
  validateContractPayload('loan', {
    ...fixtures.loan,
    interestRate: '-5',
  }).success,
  false,
  'loan negative interestRate must fail',
);
assert.equal(
  validateContractPayload('lease', {
    ...fixtures.lease,
    utilityAmount: '-500',
  }).success,
  false,
  'lease negative utilityAmount must fail',
);

const dppYearEnd = { ...fixtures.dpp, startDate: '2026-12-01', hourlyRate: '140' };
const dppJanuary = { ...dppYearEnd, startDate: '2027-01-01', endDate: '2027-01-31' };
assert.equal(validateContractPayload('dpp', dppYearEnd).success, true, 'DPP in 2026 still accepts the 2026 rate');
assert.equal(validateContractPayload('dpp', dppJanuary).success, false, 'DPP starting in 2027 enforces the new hourly rate');
assert.equal(validateContractPayload('dpp', { ...dppJanuary, hourlyRate: '148,30' }).success, true, 'DPP accepts an hourly rate exactly at the 2027 minimum');
assert.equal(validateContractPayload('dpp', { ...dppJanuary, durationType: 'indefinite', startDate: '' }).success, false, 'the start date is required to check a DPP for an indefinite term');
assert.equal(validateContractPayload('dpp', { ...dppJanuary, startDate: '2027-02-30' }).success, false, 'an invalid date cannot fall back to the older DPP minimum');

const dppCrossing = {
  ...dppYearEnd,
  endDate: '2027-01-31',
  remunerationType: 'fixed',
  estimatedHours: '20',
  totalRemuneration: '2800',
};
assert.equal(validateContractPayload('dpp', dppCrossing).success, false, 'a single fixed amount across the new year accounts for the higher minimum');
assert.equal(validateContractPayload('dpp', { ...dppCrossing, totalRemuneration: '2966' }).success, true, 'DPP fixed amount at the required equivalent passes');

const employmentYearEnd = { ...fixtures.employment, salary: '23000', startDate: '2026-12-01' };
const employmentJanuary = { ...employmentYearEnd, startDate: '2027-01-01' };
assert.equal(validateContractPayload('employment', employmentYearEnd).success, true, 'an indefinite employment contract can use the minimum at commencement');
assert.equal(validateContractPayload('employment', employmentJanuary).success, false, 'a January start enforces the higher monthly employment minimum');
for (const workHours of ['0', '-1']) {
  const result = validateContractPayload('employment', { ...employmentJanuary, workHours });
  assert.ok(!result.success && result.error.issues.some((issue) => issue.path[0] === 'workHours'), 'nonpositive hours cannot bypass the wage check');
}
assert.equal(validateContractPayload('employment', { ...employmentJanuary, workHours: '' }).success, false, 'missing hours default to full-time for the monthly minimum');
assert.equal(validateContractPayload('employment', { ...employmentJanuary, salary: '12450', workHours: '20' }).success, true, 'monthly minimum is proportional to the working hours');
assert.equal(validateContractPayload('employment', { ...employmentYearEnd, employmentType: 'fixed', endDate: '2027-01-01', trialPeriodMonths: '0' }).success, false, 'a single monthly amount for a fixed term crossing into 2027 accounts for the higher minimum');

const dppDocument = { ...dppCrossing, contractType: 'dpp' as const, contractDate: '2026-11-26' };
const dppSections = JSON.stringify(buildContractSections(dppDocument)).replace(/\s+/g, ' ');
assert.match(dppSections, /134,40.+148,30/, 'cross-year DPP describes both Czech minimum rates');
assert.match(dppSections, /148\.30/, 'the DPP English translation contains the new rate');
assert.match(dppSections, /12 500/, 'cross-year DPP describes the new insurance threshold');
const legacyDppSections = JSON.stringify(buildContractSections({ ...dppDocument, laborTermsVersion: LEGACY_LABOR_TERMS_VERSION }));
assert.match(legacyDppSections, /pro rok 2026 činí nejméně 134,40 Kč/);
assert.doesNotMatch(legacyDppSections, /148,30|148\.30/, 'archived DPP keeps the previously issued wording');

console.log(`Checkout validation tests passed for ${CONTRACT_TYPES.length} contract types.`);
