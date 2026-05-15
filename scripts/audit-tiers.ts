/**
 * Audit tier hodnoty: pro každý ze 14 typů smluv spočítá kolik sekcí,
 * řádků a stránek dostane každý tier, a o kolik je přírůstek mezi tiery.
 */
import { renderContractPdf } from '../lib/pdf';
import { buildContractSections, type ContractType, type StoredContractData, type Tier } from '../lib/contracts';

const TYPES: ContractType[] = [
  'lease', 'car_sale', 'gift', 'work_contract', 'loan', 'nda',
  'general_sale', 'employment', 'dpp', 'service', 'sublease',
  'power_of_attorney', 'debt_acknowledgment', 'cooperation',
];
const TIERS: Tier[] = ['basic', 'professional', 'complete'];

function minimalInput(type: ContractType): Partial<StoredContractData> {
  const base = { contractDate: '2026-05-15', disputeResolution: 'mediation' } as Partial<StoredContractData>;
  switch (type) {
    case 'lease': return { ...base, landlordName: 'A', tenantName: 'B', propertyAddress: 'Praha', rentAmount: '10000', duration: 'fixed', endDate: '2027-12-31', paymentDay: '15' };
    case 'car_sale': return { ...base, sellerName: 'A', buyerName: 'B', carMake: 'Škoda', carModel: 'Octavia', carVIN: 'TMBJB41Z9C2123456', priceAmount: '150000' };
    case 'gift': return { ...base, donorName: 'A', doneeName: 'B', giftType: 'money', amount: '50000', currency: 'Kč' };
    case 'work_contract': return { ...base, clientName: 'A', contractorName: 'B', workTitle: 'X', workDescription: 'Y', workLocation: 'Praha', priceAmount: '120000', currency: 'Kč' };
    case 'loan': return { ...base, lenderName: 'A', borrowerName: 'B', loanAmount: '100000', repaymentType: 'single', repaymentDate: '2027-05-15' };
    case 'nda': return { ...base, disclosingParty: 'A', receivingParty: 'B', purpose: 'X', confidentialityDurationYears: '3' };
    case 'general_sale': return { ...base, sellerName: 'A', buyerName: 'B', itemDescription: 'X', price: '25000', currency: 'Kč', priceWords: 'x' };
    case 'employment': return { ...base, employerName: 'A', employerIco: '12345678', employeeName: 'B', employeeBirth: '1.1.1990', jobTitle: 'Vývojář', workPlace: 'Praha', startDate: '2026-06-01', salary: '60000', salaryType: 'monthly' };
    case 'dpp': return { ...base, employerName: 'A', employerIco: '12345678', employeeName: 'B', employeeBirth: '1.1.1990', taskDescription: 'X', workPlace: 'Praha', remunerationType: 'hourly', hourlyRate: '500', estimatedHours: '50' };
    case 'service': return { ...base, providerName: 'A', clientName: 'B', serviceDescription: 'X', priceModel: 'monthly', monthlyFee: '15000' };
    case 'sublease': return { ...base, landlordName: 'A', tenantName: 'B', propertyAddress: 'Praha', rentAmount: '8000', startDate: '2026-06-01', duration: 'fixed', endDate: '2027-05-31' };
    case 'power_of_attorney': return { ...base, principalName: 'A', agentName: 'B', scope: 'X' };
    case 'debt_acknowledgment': return { ...base, creditorName: 'A', debtorName: 'B', debtAmount: '50000', currency: 'Kč', repaymentType: 'single', repaymentDate: '2027-05-15' };
    case 'cooperation': return { ...base, partyAName: 'A s.r.o.', partyBName: 'B s.r.o.', cooperationDescription: 'X', feeMode: 'fixed', fixedFee: '20000' };
  }
}

function countPages(pdf: Buffer): number {
  return (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
}

async function main() {
  console.log('Typ smlouvy          | Sekcí basic | Sekcí prof | Sekcí compl | Stran basic | Stran prof | Stran compl | +prof | +compl');
  console.log('---------------------|-------------|------------|-------------|-------------|------------|-------------|-------|--------');
  const totals = { basicSec: 0, profSec: 0, complSec: 0, basicPg: 0, profPg: 0, complPg: 0 };
  for (const type of TYPES) {
    const row: Record<Tier, { sections: number; pages: number }> = {} as any;
    for (const tier of TIERS) {
      const data = { ...minimalInput(type), contractType: type, tier } as StoredContractData;
      const sections = buildContractSections(data);
      const pdf = await renderContractPdf(data);
      row[tier] = { sections: sections.length, pages: countPages(pdf) };
    }
    const profDelta = row.professional.sections - row.basic.sections;
    const complDelta = row.complete.sections - row.professional.sections;
    totals.basicSec += row.basic.sections; totals.profSec += row.professional.sections; totals.complSec += row.complete.sections;
    totals.basicPg += row.basic.pages; totals.profPg += row.professional.pages; totals.complPg += row.complete.pages;
    console.log(
      `${type.padEnd(20)} | ${String(row.basic.sections).padStart(11)} | ${String(row.professional.sections).padStart(10)} | ${String(row.complete.sections).padStart(11)} | ${String(row.basic.pages).padStart(11)} | ${String(row.professional.pages).padStart(10)} | ${String(row.complete.pages).padStart(11)} | ${String('+'+profDelta).padStart(5)} | ${String('+'+complDelta).padStart(6)}`
    );
  }
  console.log('---------------------|-------------|------------|-------------|-------------|------------|-------------|-------|--------');
  console.log(
    `${'PRŮMĚR'.padEnd(20)} | ${(totals.basicSec/14).toFixed(1).padStart(11)} | ${(totals.profSec/14).toFixed(1).padStart(10)} | ${(totals.complSec/14).toFixed(1).padStart(11)} | ${(totals.basicPg/14).toFixed(1).padStart(11)} | ${(totals.profPg/14).toFixed(1).padStart(10)} | ${(totals.complPg/14).toFixed(1).padStart(11)} |       |`
  );

  // Per-Kč value comparison
  console.log('\nPoměr cena/strana:');
  console.log(`  Basic        99 Kč / ${(totals.basicPg/14).toFixed(1)} str = ${(99/(totals.basicPg/14)).toFixed(1)} Kč/str`);
  console.log(`  Professional 199 Kč / ${(totals.profPg/14).toFixed(1)} str = ${(199/(totals.profPg/14)).toFixed(1)} Kč/str  (přírůstek +100 Kč za +${((totals.profPg-totals.basicPg)/14).toFixed(1)} str)`);
  console.log(`  Complete     299 Kč / ${(totals.complPg/14).toFixed(1)} str = ${(299/(totals.complPg/14)).toFixed(1)} Kč/str  (přírůstek +100 Kč za +${((totals.complPg-totals.profPg)/14).toFixed(1)} str)`);
}

main().catch(console.error);
