import { z } from 'zod';
import { isValidMoney } from '@/lib/money';
import {
  getDppLegalIssues,
  getEmploymentLegalIssues,
  getLaborValidationMessage,
} from '@/lib/labor-law-validation';

export const CONTRACT_TYPES = [
  'lease', 'car_sale', 'gift', 'work_contract', 'loan', 'nda',
  'general_sale', 'employment', 'dpp', 'service', 'sublease',
  'power_of_attorney', 'debt_acknowledgment', 'cooperation',
] as const;

export type ContractType = (typeof CONTRACT_TYPES)[number];

const text = z.string().trim().min(1).max(20_000);
const shortText = z.string().trim().min(1).max(500);
const optionalText = z.string().max(20_000).optional();
/**
 * Validates only — the original string is passed through to document rendering
 * untouched, so accepting more notations cannot change what a contract says.
 */
const money = z.union([
  z.number().positive().finite(),
  z.string().trim().min(1).max(50).refine(isValidMoney, {
    message: 'Zadejte částku jako číslo, například 15000 nebo 15 000 Kč.',
  }),
]);
const optionalMoney = z.union([
  z.number().positive().finite(),
  z.string().max(50).refine((value) => !value.trim() || isValidMoney(value), {
    message: 'Zadejte částku jako číslo, například 15000 nebo 15 000 Kč.',
  }),
]).optional();
const optionalNumber = z.union([
  z.number().finite(),
  z.string().max(50).refine(
    (value) => !value.trim() || Number.isFinite(Number(value.trim().replace(',', '.'))),
    { message: 'Zadejte platné číslo.' },
  ),
]).optional();

const base = z.object({}).passthrough();
const role = {
  lease: z.enum(['tenant', 'landlord', 'unknown']).optional(),
  car: z.enum(['buyer', 'seller', 'unknown']).optional(),
  work: z.enum(['customer', 'contractor', 'unknown']).optional(),
  hr: z.enum(['employer', 'employee', 'unknown']).optional(),
  cooperation: z.enum(['client', 'supplier', 'freelancer', 'company', 'unknown']).optional(),
};

const schemas: Record<ContractType, z.ZodType<Record<string, unknown>>> = {
  lease: base.extend({
    partnerUserRole: role.lease,
    landlordName: shortText,
    tenantName: shortText,
    flatAddress: text,
    rentAmount: money,
    startDate: shortText,
    duration: z.enum(['fixed', 'indefinite']).optional(),
    endDate: optionalText,
  }).superRefine((data, ctx) => {
    if (data.duration === 'fixed' && !data.endDate?.trim()) {
      ctx.addIssue({ code: 'custom', path: ['endDate'], message: 'Datum konce je povinné pro dobu určitou.' });
    }
  }),
  car_sale: base.extend({
    partnerUserRole: role.car,
    sellerName: shortText,
    buyerName: shortText,
    carMake: shortText,
    carVIN: shortText,
    priceAmount: money,
  }),
  gift: base.extend({
    donorName: shortText,
    doneeName: shortText,
    giftType: z.enum(['money', 'car', 'property', 'thing']),
    amount: optionalText,
    carVIN: optionalText,
    propertyAddress: optionalText,
    thingDescription: optionalText,
  }).superRefine((data, ctx) => {
    const requiredByType = {
      money: ['amount', 'Darovaná částka'],
      car: ['carVIN', 'VIN vozidla'],
      property: ['propertyAddress', 'Adresa nemovitosti'],
      thing: ['thingDescription', 'Popis darované věci'],
    } as const;
    const [field, label] = requiredByType[data.giftType];
    if (!data[field]?.trim()) ctx.addIssue({ code: 'custom', path: [field], message: `${label} je povinný údaj.` });
  }),
  work_contract: base.extend({
    partnerUserRole: role.work,
    clientName: shortText,
    contractorName: shortText,
    workTitle: shortText,
    workDescription: text,
    priceAmount: money,
  }),
  loan: base.extend({
    lenderName: shortText,
    borrowerName: shortText,
    loanAmount: money,
    repaymentType: z.enum(['lump_sum', 'installments']).optional(),
    repaymentDate: optionalText,
    installmentCount: z.union([z.string(), z.number()]).optional(),
    installmentAmount: z.union([z.string(), z.number()]).optional(),
    securityType: z.string().optional(),
    guarantorName: optionalText,
  }).superRefine((data, ctx) => {
    if (data.repaymentType === 'lump_sum' && !data.repaymentDate?.trim()) {
      ctx.addIssue({ code: 'custom', path: ['repaymentDate'], message: 'Datum splatnosti je povinné.' });
    }
    if (data.repaymentType === 'installments' && (!String(data.installmentCount ?? '').trim() || !String(data.installmentAmount ?? '').trim())) {
      ctx.addIssue({ code: 'custom', path: ['installmentCount'], message: 'Počet a výše splátek jsou povinné.' });
    }
    if (data.securityType === 'guarantee' && !data.guarantorName?.trim()) {
      ctx.addIssue({ code: 'custom', path: ['guarantorName'], message: 'Jméno ručitele je povinné.' });
    }
  }),
  nda: base.extend({
    disclosingName: shortText,
    receivingName: shortText,
    confidentialInfoDesc: text,
  }),
  general_sale: base.extend({
    sellerName: shortText,
    buyerName: shortText,
    itemDescription: text,
    price: money,
    itemType: z.string().optional(),
    carVIN: optionalText,
  }).superRefine((data, ctx) => {
    if (data.itemType === 'car' && !data.carVIN?.trim()) {
      ctx.addIssue({ code: 'custom', path: ['carVIN'], message: 'VIN vozidla je povinné.' });
    }
  }),
  employment: base.extend({
    partnerUserRole: role.hr,
    employerName: shortText,
    employeeName: shortText,
    jobTitle: shortText,
    workPlace: shortText,
    startDate: shortText,
    salaryType: z.enum(['monthly', 'hourly']).optional(),
    salary: optionalMoney,
    hourlyRate: optionalMoney,
    workHours: optionalNumber,
    noticePeriod: optionalNumber,
    trialPeriodMonths: optionalNumber,
    employmentType: z.enum(['fixed', 'indefinite']).optional(),
    endDate: optionalText,
    isManager: z.boolean().optional(),
  }).superRefine((data, ctx) => {
    const salaryType = data.salaryType === 'hourly'
      || (!String(data.salary ?? '').trim() && String(data.hourlyRate ?? '').trim())
      ? 'hourly'
      : 'monthly';
    const activePay = salaryType === 'hourly' ? data.hourlyRate : data.salary;
    if (!String(activePay ?? '').trim()) {
      ctx.addIssue({
        code: 'custom',
        path: [salaryType === 'hourly' ? 'hourlyRate' : 'salary'],
        message: salaryType === 'hourly' ? 'Hodinová sazba je povinná.' : 'Měsíční mzda je povinná.',
      });
    }
    if (data.employmentType === 'fixed' && !data.endDate?.trim()) {
      ctx.addIssue({ code: 'custom', path: ['endDate'], message: 'Datum konce je povinné pro dobu určitou.' });
    }
    for (const issue of getEmploymentLegalIssues(data)) {
      ctx.addIssue({
        code: 'custom',
        path: [issue.field],
        message: getLaborValidationMessage(issue, 'cs'),
      });
    }
  }),
  dpp: base.extend({
    partnerUserRole: role.hr,
    employerName: shortText,
    employeeName: shortText,
    taskDescription: text,
    workPlace: shortText,
    remunerationType: z.enum(['fixed', 'hourly']).optional(),
    hourlyRate: optionalMoney,
    totalRemuneration: optionalMoney,
    estimatedHours: optionalNumber,
    durationType: z.enum(['fixed', 'indefinite']).optional(),
    startDate: optionalText,
    endDate: optionalText,
  }).superRefine((data, ctx) => {
    const remunerationType = data.remunerationType === 'hourly'
      || (!String(data.totalRemuneration ?? '').trim() && String(data.hourlyRate ?? '').trim())
      ? 'hourly'
      : 'fixed';
    const activePay = remunerationType === 'hourly' ? data.hourlyRate : data.totalRemuneration;
    if (!String(activePay ?? '').trim()) {
      ctx.addIssue({
        code: 'custom',
        path: [remunerationType === 'hourly' ? 'hourlyRate' : 'totalRemuneration'],
        message: remunerationType === 'hourly' ? 'Hodinová odměna je povinná.' : 'Celková odměna je povinná.',
      });
    }
    if (data.durationType === 'fixed' && (!data.startDate?.trim() || !data.endDate?.trim())) {
      ctx.addIssue({
        code: 'custom',
        path: [!data.startDate?.trim() ? 'startDate' : 'endDate'],
        message: 'Datum začátku a konce je povinné pro DPP na dobu určitou.',
      });
    }
    for (const issue of getDppLegalIssues(data)) {
      ctx.addIssue({
        code: 'custom',
        path: [issue.field],
        message: getLaborValidationMessage(issue, 'cs'),
      });
    }
  }),
  service: base.extend({
    providerName: shortText,
    clientName: shortText,
    serviceDescription: text,
    hourlyRate: z.union([z.string(), z.number()]).optional(),
    monthlyFee: z.union([z.string(), z.number()]).optional(),
    totalPrice: z.union([z.string(), z.number()]).optional(),
  }).superRefine((data, ctx) => {
    if (![data.hourlyRate, data.monthlyFee, data.totalPrice].some((value) => String(value ?? '').trim())) {
      ctx.addIssue({ code: 'custom', path: ['hourlyRate'], message: 'Alespoň jeden způsob určení ceny je povinný.' });
    }
  }),
  sublease: base.extend({
    landlordName: shortText,
    tenantName: shortText,
    flatAddress: text,
    rentAmount: money,
    startDate: shortText,
    duration: z.enum(['fixed', 'indefinite']).optional(),
    endDate: optionalText,
  }).superRefine((data, ctx) => {
    if (data.duration === 'fixed' && !data.endDate?.trim()) {
      ctx.addIssue({ code: 'custom', path: ['endDate'], message: 'Datum konce je povinné pro dobu určitou.' });
    }
  }),
  power_of_attorney: base.extend({
    principalName: shortText,
    agentName: shortText,
    poaType: z.string().optional(),
    customScope: optionalText,
  }).superRefine((data, ctx) => {
    if (data.poaType === 'general' && !data.customScope?.trim()) {
      ctx.addIssue({ code: 'custom', path: ['customScope'], message: 'Rozsah plné moci je povinný.' });
    }
  }),
  debt_acknowledgment: base.extend({
    creditorName: shortText,
    debtorName: shortText,
    debtAmount: money,
  }),
  cooperation: base.extend({
    partnerUserRole: role.cooperation,
    partyAName: shortText,
    partyBName: shortText,
    cooperationScope: text,
  }),
};

export function validateContractPayload(contractType: ContractType, payload: unknown) {
  return schemas[contractType].safeParse(payload);
}
