'use client';

import type { ContractType } from '@/lib/contracts';
import type { PartnerLocale, PartnerUserRole } from '@/lib/partners/types';

type Option = { value: PartnerUserRole; cs: string; en: string; ua: string };

const OPTIONS: Partial<Record<ContractType, readonly Option[]>> = {
  car_sale: [
    { value: 'buyer', cs: 'Kupující', en: 'Buyer', ua: 'Покупець' },
    { value: 'seller', cs: 'Prodávající', en: 'Seller', ua: 'Продавець' },
  ],
  lease: [
    { value: 'tenant', cs: 'Nájemce', en: 'Tenant', ua: 'Орендар' },
    { value: 'landlord', cs: 'Pronajímatel', en: 'Landlord', ua: 'Орендодавець' },
  ],
  work_contract: [
    { value: 'customer', cs: 'Objednatel', en: 'Customer', ua: 'Замовник' },
    { value: 'contractor', cs: 'Zhotovitel / OSVČ', en: 'Contractor', ua: 'Підрядник' },
  ],
  employment: [
    { value: 'employer', cs: 'Zaměstnavatel', en: 'Employer', ua: 'Роботодавець' },
    { value: 'employee', cs: 'Zaměstnanec', en: 'Employee', ua: 'Працівник' },
  ],
  dpp: [
    { value: 'employer', cs: 'Zaměstnavatel', en: 'Employer', ua: 'Роботодавець' },
    { value: 'employee', cs: 'Pracovník', en: 'Worker', ua: 'Працівник' },
  ],
  cooperation: [
    { value: 'freelancer', cs: 'OSVČ / freelancer', en: 'Freelancer', ua: 'Фрилансер' },
    { value: 'supplier', cs: 'Dodavatel', en: 'Supplier', ua: 'Постачальник' },
    { value: 'client', cs: 'Klient / odběratel', en: 'Client', ua: 'Клієнт' },
    { value: 'company', cs: 'Firma', en: 'Company', ua: 'Компанія' },
  ],
};

const COPY = {
  cs: {
    title: 'Pro koho dokument připravujete?',
    hint: 'Nepovinné. Pomůže nám po dokončení zobrazit jen relevantní další kroky.',
    unknown: 'Nechci uvést / jiná role',
  },
  en: {
    title: 'Which party are you preparing the document for?',
    hint: 'Optional. This helps us show only relevant next steps after payment.',
    unknown: 'Prefer not to say / another role',
  },
  ua: {
    title: 'Для якої сторони ви готуєте документ?',
    hint: 'Необов’язково. Це допоможе показати лише доречні наступні кроки після оплати.',
    unknown: 'Не хочу вказувати / інша роль',
  },
} as const;

export default function BuilderUserRoleField({
  contractType,
  locale,
  value,
  onChange,
}: {
  contractType: ContractType;
  locale: PartnerLocale;
  value: PartnerUserRole;
  onChange: (value: PartnerUserRole) => void;
}) {
  const options = OPTIONS[contractType];
  if (!options) return null;
  const copy = COPY[locale];

  return (
    <section className="rounded-2xl border border-slate-800/80 bg-[#0c1426] p-4 sm:p-5">
      <label className="block">
        <span className="block text-sm font-semibold text-white">{copy.title}</span>
        <span className="mt-1 block text-xs leading-5 text-slate-500">{copy.hint}</span>
        <select
          name="partnerUserRole"
          value={value}
          onChange={(event) => onChange(event.target.value as PartnerUserRole)}
          className="site-input mt-3"
        >
          <option value="unknown">{copy.unknown}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option[locale]}</option>
          ))}
        </select>
      </label>
    </section>
  );
}
