/**
 * Vygeneruje PDF pro všech 14 typů × 2 reálné tiery (basic + complete).
 * Professional je legacy alias pro complete v pricing UI, takže testujeme jen
 * tier kombinace, které zákazník reálně může koupit.
 */
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { renderContractPdf } from '../lib/pdf';
import type { ContractType, StoredContractData, Tier } from '../lib/contracts';

const TYPES: ContractType[] = [
  'lease', 'car_sale', 'gift', 'work_contract', 'loan', 'nda',
  'general_sale', 'employment', 'dpp', 'service', 'sublease',
  'power_of_attorney', 'debt_acknowledgment', 'cooperation',
];
const TIERS: Tier[] = ['basic', 'complete'];

function input(type: ContractType): Partial<StoredContractData> {
  const base = { contractDate: '2026-05-16', disputeResolution: 'mediation' } as Partial<StoredContractData>;
  switch (type) {
    case 'lease':
      return { ...base, landlordName: 'Jan Novák', landlordId: '12.3.1980', landlordAddress: 'Krátká 12, 110 00 Praha 1',
        tenantName: 'Petra Svobodová', tenantId: '5.6.1992', tenantAddress: 'Dlouhá 8, 602 00 Brno',
        propertyAddress: 'Vinohradská 100, 130 00 Praha 3', flatLayout: '2+kk', flatArea: '58',
        rentAmount: '18500', utilityAmount: '3500', depositAmount: '37000',
        startDate: '2026-06-01', duration: 'fixed', endDate: '2028-05-31', paymentDay: '10' };
    case 'car_sale':
      return { ...base, sellerName: 'Tomáš Dvořák', sellerId: '14.4.1985', sellerAddress: 'Husitská 22, Praha 3',
        buyerName: 'Eva Horáková', buyerId: '7.9.1990', buyerAddress: 'Bělehradská 50, Praha 2',
        carMake: 'Škoda', carModel: 'Octavia', carVIN: 'TMBJB41Z9C2123456', carPlate: '5AB 1234',
        carYear: '2020', carMileage: '85000', priceAmount: '250000', paymentMethod: 'transfer',
        bankAccount: '1234567890/0100' };
    case 'gift':
      return { ...base, donorName: 'Marie Procházková', donorId: '20.10.1965', donorAddress: 'Sokolská 14, Praha 2',
        doneeName: 'Lukáš Horák', doneeId: '3.8.1990', doneeAddress: 'Bělehradská 50, Praha 2',
        giftType: 'money', amount: '150000', currency: 'Kč', transferMethod: 'transfer',
        bankAccount: '9876543210/0100' };
    case 'work_contract':
      return { ...base, clientName: 'Acme s.r.o.', clientRegNo: '12345678', clientAddress: 'Karlovo nám. 5, Praha 2',
        contractorName: 'Petr Stavební', contractorRegNo: '87654321', contractorAddress: 'Hlavní 1, Praha 8',
        workTitle: 'Rekonstrukce koupelny', workDescription: 'Kompletní rekonstrukce koupelny vč. obkladů a dlažby',
        workLocation: 'Karlovo nám. 5, Praha 2', priceAmount: '180000', currency: 'Kč',
        startDate: '2026-06-01', endDate: '2026-07-31' };
    case 'loan':
      return { ...base, lenderName: 'Marie Procházková', lenderId: '20.10.1965', lenderAddress: 'Sokolská 14, Praha 2',
        borrowerName: 'Lukáš Horák', borrowerId: '3.8.1990', borrowerAddress: 'Bělehradská 50, Praha 2',
        loanAmount: '250000', interestRate: '5.5', interestPayment: 'monthly',
        repaymentType: 'installments', installmentCount: '24', installmentAmount: '11000',
        firstPaymentDate: '2026-06-15', paymentDay: '15', transferMethod: 'transfer',
        borrowerBankAccount: '1234567890/0100', securityType: 'guarantee',
        guarantorName: 'Eva Horáková', guarantorId: '7.9.1962', guarantorAddress: 'Bělehradská 50, Praha 2' };
    case 'nda':
      return { ...base, disclosingParty: 'Acme s.r.o.', receivingParty: 'Beta Tech s.r.o.',
        purpose: 'Vyhodnocení možné obchodní spolupráce', confidentialityDurationYears: '3',
        ndaType: 'mutual' };
    case 'general_sale':
      return { ...base, sellerName: 'Tomáš Dvořák', sellerId: '14.4.1985', sellerAddress: 'Praha',
        buyerName: 'Eva Horáková', buyerId: '7.9.1990', buyerAddress: 'Praha',
        itemDescription: 'Notebook Lenovo ThinkPad X1 Carbon', itemType: 'electronics',
        serialNumber: 'XYZ-987654321', price: '35000', currency: 'Kč',
        priceWords: 'třicet pět tisíc korun českých', paymentMethod: 'transfer',
        sellerBankAccount: '1234567890/0100' };
    case 'employment':
      return { ...base, employerName: 'Acme s.r.o.', employerIco: '12345678', employerAddress: 'Karlovo nám. 5, Praha 2',
        employeeName: 'Tomáš Dvořák', employeeBirth: '14.4.1995', employeeAddress: 'Husitská 22, Praha 3',
        jobTitle: 'Senior Frontend Developer', workPlace: 'Praha 2', startDate: '2026-06-01',
        salary: '85000', salaryType: 'monthly', trialPeriodMonths: '3', workHours: '40' };
    case 'dpp':
      return { ...base, employerName: 'Acme s.r.o.', employerIco: '12345678', employerAddress: 'Karlovo nám. 5, Praha 2',
        employeeName: 'Tomáš Dvořák', employeeBirth: '14.4.1995', employeeAddress: 'Husitská 22, Praha 3',
        taskDescription: 'Vývoj webové aplikace v jazyce TypeScript',
        taskDetails: 'Implementace front-endových komponent dle zadání projektového manažera, code review, testování.',
        workPlace: 'Praha / home office', estimatedHours: '120',
        remunerationType: 'hourly', hourlyRate: '650',
        durationType: 'fixed', startDate: '2026-06-01', endDate: '2026-12-31',
        deadline: '31. 12. 2026', paymentAccount: '1234567890/0100', paymentDays: '15',
        toolsProvided: 'employee' };
    case 'service':
      return { ...base, providerName: 'Beta Tech s.r.o.', clientName: 'Acme s.r.o.',
        serviceDescription: 'Měsíční IT podpora a správa serverů', priceModel: 'monthly',
        monthlyFee: '25000', startDate: '2026-06-01', vatPayer: 'yes' };
    case 'sublease':
      return { ...base, landlordName: 'Jan Novák', tenantName: 'Petra Svobodová',
        propertyAddress: 'Vinohradská 100, Praha 3', rentAmount: '12000',
        startDate: '2026-06-01', duration: 'fixed', endDate: '2027-05-31' };
    case 'power_of_attorney':
      return { ...base, principalName: 'Marie Procházková', principalId: '20.10.1965',
        agentName: 'Lukáš Horák', agentId: '3.8.1990',
        scope: 'Zastupování při převodu vozidla VW Golf, SPZ 5AB 1234, na obecním úřadu',
        scopeType: 'vehicle', carMake: 'VW Golf', carPlate: '5AB 1234' };
    case 'debt_acknowledgment':
      return { ...base, creditorName: 'Marie Procházková', debtorName: 'Lukáš Horák',
        debtAmount: '120000', currency: 'Kč',
        debtAmountWords: 'sto dvacet tisíc korun českých',
        repaymentType: 'installments', installmentCount: '12', installmentAmount: '10000',
        firstPaymentDate: '2026-06-15' };
    case 'cooperation':
      return { ...base, partyAName: 'Acme s.r.o.', partyAId: '12345678', partyAAddress: 'Praha',
        partyBName: 'Beta Tech s.r.o.', partyBId: '87654321', partyBAddress: 'Praha',
        cooperationDescription: 'Společný marketingový projekt pro Q3 2026',
        cooperationGoal: 'Akvizice nových zákazníků', feeMode: 'fixed', fixedFee: '50000' };
  }
}

async function main() {
  const outDir = path.join(process.cwd(), 'sample-pdfs', 'regression');
  await mkdir(outDir, { recursive: true });
  let total = 0; let failures = 0;
  for (const type of TYPES) {
    for (const tier of TIERS) {
      try {
        const data = { ...input(type), contractType: type, tier } as StoredContractData;
        const pdf = await renderContractPdf(data);
        const file = path.join(outDir, `${type}-${tier}.pdf`);
        await writeFile(file, pdf);
        const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
        console.log(`✓ ${type.padEnd(20)} ${tier.padEnd(8)} ${pages} str.   ${(pdf.length / 1024).toFixed(1)} kB`);
        total++;
      } catch (err) {
        console.error(`✗ ${type}/${tier}: ${(err as Error).message}`);
        failures++;
      }
    }
  }
  console.log(`\n${total - failures}/${total + failures} PDF úspěšně vygenerováno.`);
  if (failures > 0) process.exit(1);
}

main().catch((err) => { console.error(err); process.exit(1); });
