/**
 * Generates a PDF for each of the 6 foreigner-relevant contracts in all active
 * locales (CS baseline plus EN/UA bilingual outputs).
 */
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { renderContractPdf } from '../lib/pdf';
import { FOREIGN_LOCALES } from '../lib/i18n/locales';
import type { StoredContractData } from '../lib/contracts';

const OUT_DIR = path.join(process.cwd(), 'tmp', 'pdf-test');
const base = { contractDate: '2026-06-01' };

const samples: Record<string, StoredContractData> = {
  lease: { ...base, contractType: 'lease', tier: 'basic', landlordName: 'Karel Novák', landlordId: '750101/1234', landlordAddress: 'Vinohradská 12, 120 00 Praha 2', tenantName: 'Oleksandr Petrov', tenantId: '900215/5678', tenantAddress: 'Wenceslas Square 1, 110 00 Praha 1', propertyAddress: 'Korunní 45, Praha 2', propertyLayout: '2+kk, 48 m²', flatArea: '48', floor: '5', rentAmount: '18000', utilitiesAmount: '3500', paymentDay: '5', depositAmount: '36000', bankAccount: '123456789/0100', duration: 'indefinite', startDate: '2026-07-01', maxOccupants: '2', keysCount: '3', disputeResolution: 'default' } as StoredContractData,
  sublease: { ...base, contractType: 'sublease', tier: 'basic', landlordName: 'Hlavní Nájemce', landlordId: '800101/1234', landlordAddress: 'Wenceslas Square 1, Praha 1', tenantName: 'Mark Williams', tenantId: '900215/5678', tenantAddress: 'Korunní 45, Praha 2', flatAddress: 'Korunní 45, Praha 2', flatLayout: '1+kk', rentAmount: '15000', utilityAmount: '2500', paymentDay: '10', depositAmount: '15000', duration: 'fixed', startDate: '2026-07-01', endDate: '2027-06-30', handoverDate: '2026-07-01', keysCount: '2', maxOccupants: '1', landlordConsent: 'yes', consentDate: '2026-06-15' } as StoredContractData,
  dpp: { ...base, contractType: 'dpp', tier: 'basic', employerName: 'Praha Café s.r.o.', employerIco: '12345678', employerAddress: 'Národní 5, Praha 1', employeeName: 'Anna Schmidt', employeeBirth: '1998-03-22', employeeAddress: 'Karlín 10, Praha 8', taskDescription: 'Barista — příprava nápojů', workPlace: 'Národní 5, Praha 1', estimatedHours: '200', durationType: 'fixed', startDate: '2026-07-01', endDate: '2026-12-31', remunerationType: 'hourly', hourlyRate: '180', paymentAccount: '987654321/0100', paymentDays: '15', toolsProvided: 'employer' } as StoredContractData,
  employment: { ...base, contractType: 'employment', tier: 'basic', employerName: 'Tech Solutions a.s.', employerIco: '87654321', employerAddress: 'Karlovo nám. 10, Praha 2', employeeName: 'Carlos Rodriguez', employeeBirth: '1992-08-14', employeeAddress: 'Smíchov 22, Praha 5', jobTitle: 'Software Engineer', jobDescription: 'Backend development', workPlace: 'Karlovo nám. 10, Praha 2', employmentType: 'indefinite', startDate: '2026-07-15', trialPeriodMonths: '3', salaryType: 'monthly', salary: '85000', payDay: '15', workHours: '40', breakMinutes: '30', vacationWeeks: '5', noticePeriod: '2' } as StoredContractData,
  power_of_attorney: { ...base, contractType: 'power_of_attorney', tier: 'basic', principalName: 'Mai Nguyen', principalId: '900101/1234', principalAddress: 'Vodičkova 8, Praha 1', agentName: 'Petr Novák', agentId: '750505/5678', agentAddress: 'Korunní 12, Praha 2', poaType: 'bank', bankAccount: '1234567890/0300', bankName: 'ČSOB', validUntil: '31.12.2026', singleUse: false, allowSubstitution: false } as StoredContractData,
  car_sale: { ...base, contractType: 'car_sale', tier: 'basic', sellerName: 'Jana Dvořáková', sellerId: '800505/4567', sellerAddress: 'Brno, Hlavní 1', buyerName: 'Hans Mueller', buyerId: '850101/8901', buyerAddress: 'München, Hauptstr. 5', carMake: 'Škoda', carModel: 'Octavia', carVIN: 'TMBJB41Z9L0123456', carPlate: '1BB 2345', carMileage: '85000', carYear: '2019', priceAmount: '250000', paymentMethod: 'bank', bankAccount: '987654/0100', handoverDate: '2026-06-30', handoverPlace: 'Brno, Hlavní 1', ownershipTransferMoment: 'payment', buyerInspectedVehicle: true, testDriveCompleted: true } as StoredContractData,
};

async function run() {
  await mkdir(OUT_DIR, { recursive: true });
  let total = 0;
  for (const [contract, data] of Object.entries(samples)) {
    {
      const pdf = await renderContractPdf(data);
      await writeFile(path.join(OUT_DIR, `${contract}-cs.pdf`), pdf);
      console.log(`✓ ${contract.padEnd(20)} cs  ${(pdf.length / 1024).toFixed(0).padStart(4)} kB`);
      total++;
    }
    for (const loc of FOREIGN_LOCALES) {
      const pdf = await renderContractPdf({ ...data, lang: loc, addOns: ['bilingual_contract'] });
      await writeFile(path.join(OUT_DIR, `${contract}-${loc}.pdf`), pdf);
      console.log(`✓ ${contract.padEnd(20)} ${loc}  ${(pdf.length / 1024).toFixed(0).padStart(4)} kB`);
      total++;
    }
  }
  console.log(`\n${total} PDFs in: ${OUT_DIR}`);
}

run().catch(err => { console.error('FAILED:', err); process.exit(1); });
