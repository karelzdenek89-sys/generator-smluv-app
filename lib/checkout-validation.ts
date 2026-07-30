import { z } from 'zod';
import { isValidMoney } from '@/lib/money';

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

const base = z.object({}).passthrough();

const schemas: Record<ContractType, z.ZodType<Record<string, unknown>>> = {
  lease: base.extend({
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
    employerName: shortText,
    employeeName: shortText,
    jobTitle: shortText,
    workPlace: shortText,
    startDate: shortText,
    salary: z.union([z.string(), z.number()]).optional(),
    hourlyRate: z.union([z.string(), z.number()]).optional(),
  }).superRefine((data, ctx) => {
    if (!String(data.salary ?? '').trim() && !String(data.hourlyRate ?? '').trim()) {
      ctx.addIssue({ code: 'custom', path: ['salary'], message: 'Mzda nebo hodinová sazba je povinná.' });
    }
  }),
  dpp: base.extend({
    employerName: shortText,
    employeeName: shortText,
    taskDescription: text,
    workPlace: shortText,
    hourlyRate: z.union([z.string(), z.number()]).optional(),
    totalRemuneration: z.union([z.string(), z.number()]).optional(),
  }).superRefine((data, ctx) => {
    if (!String(data.hourlyRate ?? '').trim() && !String(data.totalRemuneration ?? '').trim()) {
      ctx.addIssue({ code: 'custom', path: ['hourlyRate'], message: 'Výše odměny je povinná.' });
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
    partyAName: shortText,
    partyBName: shortText,
    cooperationScope: text,
  }),
};

export function validateContractPayload(contractType: ContractType, payload: unknown) {
  return schemas[contractType].safeParse(payload);
}
