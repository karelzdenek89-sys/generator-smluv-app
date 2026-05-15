/**
 * Generuje 3 vzorová PDF napříč tiery pro vizuální audit po legal/footer změnách.
 * Spuštění: npx tsx scripts/gen-sample-pdfs.ts
 * Výstup:   ./sample-pdfs/{basic,professional,complete}-*.pdf
 */
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { renderContractPdf } from '../lib/pdf';
import type { StoredContractData } from '../lib/contracts';

const samples: Array<{ name: string; data: StoredContractData }> = [
  {
    name: 'basic-najemni-smlouva',
    data: {
      contractType: 'lease',
      tier: 'basic',
      landlordName: 'Jan Novák',
      landlordId: '12.3.1980',
      landlordAddress: 'Krátká 12, 110 00 Praha 1',
      tenantName: 'Petra Svobodová',
      tenantId: '5.6.1992',
      tenantAddress: 'Dlouhá 8, 602 00 Brno',
      propertyAddress: 'Vinohradská 100, 130 00 Praha 3',
      flatArea: '58',
      flatLayout: '2+kk',
      rentAmount: '18500',
      utilityAmount: '3500',
      depositAmount: '37000',
      startDate: '2026-06-01',
      duration: 'fixed',
      endDate: '2028-05-31',
      paymentDay: '10',
      contractDate: '2026-05-15',
      disputeResolution: 'mediation',
    },
  },
  {
    name: 'professional-dpp',
    data: {
      contractType: 'dpp',
      tier: 'professional',
      notaryUpsell: true,
      employerName: 'Acme s.r.o.',
      employerIco: '12345678',
      employerAddress: 'Karlovo nám. 5, 120 00 Praha 2',
      employeeName: 'Tomáš Dvořák',
      employeeBirth: '14.4.1995',
      employeeAddress: 'Husitská 22, 130 00 Praha 3',
      taskDescription: 'Vývoj webové aplikace v jazyce TypeScript',
      taskDetails: 'Implementace front-endových komponent dle zadání projektového manažera, code review, testování.',
      workPlace: 'Praha / home office',
      estimatedHours: '120',
      remunerationType: 'hourly',
      hourlyRate: '650',
      contractDate: '2026-05-15',
      durationType: 'fixed',
      startDate: '2026-06-01',
      endDate: '2026-12-31',
      deadline: '31. 12. 2026',
      paymentAccount: '1234567890/0100',
      paymentDays: '15',
      toolsProvided: 'employee',
      disputeResolution: 'mediation',
    },
  },
  {
    name: 'complete-pujcka',
    data: {
      contractType: 'loan',
      tier: 'complete',
      notaryUpsell: true,
      lenderName: 'Marie Procházková',
      lenderId: '20.10.1965',
      lenderAddress: 'Sokolská 14, 120 00 Praha 2',
      lenderEmail: 'marie.prochazkova@example.cz',
      borrowerName: 'Lukáš Horák',
      borrowerId: '3.8.1990',
      borrowerAddress: 'Bělehradská 50, 120 00 Praha 2',
      borrowerEmail: 'lukas.horak@example.cz',
      contractDate: '2026-05-15',
      loanAmount: '250000',
      amountWords: 'dvě stě padesát tisíc korun českých',
      currency: 'Kč',
      interestRate: '5.5',
      interestPayment: 'monthly',
      repaymentType: 'installments',
      installmentCount: '24',
      installmentAmount: '11000',
      firstPaymentDate: '2026-06-15',
      paymentDay: '15',
      securityType: 'guarantee',
      guarantorName: 'Eva Horáková',
      guarantorId: '7.9.1962',
      guarantorAddress: 'Bělehradská 50, 120 00 Praha 2',
      prepaymentFee: '1',
      disputeResolution: 'mediation',
    },
  },
];

async function main() {
  const outDir = path.join(process.cwd(), 'sample-pdfs');
  await mkdir(outDir, { recursive: true });
  for (const sample of samples) {
    const pdf = await renderContractPdf(sample.data);
    const file = path.join(outDir, `${sample.name}.pdf`);
    await writeFile(file, pdf);
    console.log(`✓ ${file}  (${(pdf.length / 1024).toFixed(1)} kB)`);
  }
  console.log(`\nHotovo. Vygenerováno ${samples.length} PDF do ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
