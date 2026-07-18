import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { renderContractPdf } from '../lib/pdf';
import type { StoredContractData } from '../lib/contracts';

const OUTPUT_DIR = path.join(process.cwd(), 'output', 'pdf');

const samples: Array<{ slug: string; data: StoredContractData }> = [
  {
    slug: 'najemni-smlouva',
    data: {
      contractType: 'lease', landlordName: 'Jan Novák', landlordId: '750101/1234',
      landlordAddress: 'Vinohradská 12, Praha 2', tenantName: 'Olena Petrenko',
      tenantId: '900215/5678', tenantAddress: 'Korunní 45, Praha 2',
      flatAddress: 'Korunní 45, Praha 2', flatLayout: '2+kk', flatArea: '48', floor: '5',
      rentAmount: '18000', utilityAmount: '3500', depositAmount: '36000', paymentDay: '5',
      bankAccount: '123456789/0100', duration: 'fixed', startDate: '2026-08-01',
      endDate: '2027-07-31', handoverDate: '2026-08-01', maxOccupants: '2', keysCount: '3',
    },
  },
  {
    slug: 'podnajemni-smlouva',
    data: {
      contractType: 'sublease', landlordName: 'Jan Novák', landlordId: '750101/1234',
      landlordAddress: 'Vinohradská 12, Praha 2', tenantName: 'Mark Williams',
      tenantId: '900215/5678', tenantAddress: 'Korunní 45, Praha 2',
      flatAddress: 'Korunní 45, Praha 2', flatLayout: '1+kk', rentAmount: '15000',
      utilityAmount: '2500', depositAmount: '15000', paymentDay: '10', duration: 'fixed',
      startDate: '2026-08-01', endDate: '2027-07-31', handoverDate: '2026-08-01',
      landlordConsent: 'yes', consentDate: '2026-07-15', maxOccupants: '1', keysCount: '2',
    },
  },
  {
    slug: 'pracovni-smlouva',
    data: {
      contractType: 'employment', employerName: 'Tech Solutions a.s.', employerIco: '87654321',
      employerAddress: 'Karlovo náměstí 10, Praha 2', employeeName: 'Carlos Rodriguez',
      employeeBirth: '1992-08-14', employeeAddress: 'Smíchov 22, Praha 5',
      jobTitle: 'Software Engineer', jobDescription: 'Backend development',
      workPlace: 'Karlovo náměstí 10, Praha 2', employmentType: 'indefinite',
      startDate: '2026-08-01', trialPeriodMonths: '3', salaryType: 'monthly', salary: '85000',
      payDay: '15', workHours: '40', breakMinutes: '30', vacationWeeks: '5', noticePeriod: '2',
    },
  },
  {
    slug: 'dpp',
    data: {
      contractType: 'dpp', employerName: 'Praha Café s.r.o.', employerIco: '12345678',
      employerAddress: 'Národní 5, Praha 1', employeeName: 'Anna Schmidt',
      employeeBirth: '1998-03-22', employeeAddress: 'Karlín 10, Praha 8',
      taskDescription: 'Barista - příprava nápojů', workPlace: 'Národní 5, Praha 1',
      estimatedHours: '200', durationType: 'fixed', startDate: '2026-08-01', endDate: '2026-12-31',
      remunerationType: 'hourly', hourlyRate: '180', paymentAccount: '987654321/0100', paymentDays: '15',
    },
  },
  {
    slug: 'plna-moc',
    data: {
      contractType: 'power_of_attorney', principalName: 'Mai Nguyen', principalId: '900101/1234',
      principalAddress: 'Vodičkova 8, Praha 1', agentName: 'Petr Novák', agentId: '750505/5678',
      agentAddress: 'Korunní 12, Praha 2', poaType: 'bank', bankAccount: '1234567890/0300',
      bankName: 'ČSOB', validUntil: '2026-12-31', singleUse: false, allowSubstitution: false,
    },
  },
  {
    slug: 'kupni-smlouva-auto',
    data: {
      contractType: 'car_sale', sellerName: 'Jana Dvořáková', sellerId: '800505/4567',
      sellerAddress: 'Hlavní 1, Brno', buyerName: 'Hans Mueller', buyerId: '850101/8901',
      buyerAddress: 'Hauptstrasse 5, München', carMake: 'Škoda', carModel: 'Octavia',
      carVIN: 'TMBJB41Z9L0123456', carPlate: '1BB 2345', carMileage: '85000', carYear: '2019',
      priceAmount: '250000', paymentMethod: 'transfer', bankAccount: '987654/0100',
      handoverDate: '2026-08-01', handoverPlace: 'Hlavní 1, Brno',
      ownershipTransferMoment: 'payment', buyerInspectedVehicle: true, testDriveCompleted: true,
    },
  },
];

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  for (const { slug, data } of samples) {
    for (const locale of ['en', 'ua'] as const) {
      const pdf = await renderContractPdf({
        ...data,
        tier: 'basic',
        lang: locale,
        addOns: ['bilingual_contract'],
        contractDate: '2026-07-18',
      });
      const fileName = `${slug}-cz-${locale}.pdf`;
      await writeFile(path.join(OUTPUT_DIR, fileName), pdf);
      console.log(`${fileName}: ${(pdf.length / 1024).toFixed(1)} kB`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
