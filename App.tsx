'use client';

import { useDeferredValue, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  CarFront,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileText,
  HandCoins,
  Home,
  Landmark,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wallet,
} from 'lucide-react';

type IntentKey = 'auto' | 'housing' | 'work' | 'loans';
type FormState = {
  buyerName: string;
  sellerName: string;
  vehicle: string;
  price: string;
  transferDate: string;
};

const intents: Array<{
  key: IntentKey;
  label: string;
  hint: string;
  icon: typeof CarFront;
}> = [
  { key: 'auto', label: 'Auto / Moto', hint: 'Koupě, prodej, převod vozidla', icon: CarFront },
  { key: 'housing', label: 'Bydlení', hint: 'Nájem, podnájem, předání bytu', icon: Home },
  { key: 'work', label: 'Práce', hint: 'Služby, dílo, spolupráce', icon: Landmark },
  { key: 'loans', label: 'Půjčky', hint: 'Zápůjčka, uznání dluhu, splácení', icon: HandCoins },
];

const wizardSteps = [
  { id: 1, title: 'Kdo smlouvu uzavírá', helper: 'Ptáme se na strany a základní identifikaci.' },
  { id: 2, title: 'Co se převádí', helper: 'Sbíráme fakta, ne právnické formulace.' },
  { id: 3, title: 'Cena a termín', helper: 'Doplníte částku a datum předání.' },
];

const mobileMessages = [
  { from: 'system', text: 'Vítejte. Nejprve zvolte, co dnes řešíte.' },
  { from: 'user', text: 'Kupní smlouvu na auto.' },
  { from: 'system', text: 'Dobře. Potřebuji jméno kupujícího, jméno prodávajícího, vozidlo, cenu a datum předání.' },
];

const howItWorks = [
  {
    title: 'Vyplňte fakta',
    text: 'Průvodce se ptá lidsky: kdo, co, za kolik a kdy. Bez přetížení právní terminologií.',
  },
  {
    title: 'Zkontrolujte výstup',
    text: 'Průběžně vidíte strukturu dokumentu a před zaplacením ještě jednou zkontrolujete zadání.',
  },
  {
    title: 'Stáhněte PDF',
    text: 'Po zaplacení získáte standardizovaný dokument podle zadaných údajů, určený ke kontrole a podpisu.',
  },
];

function IntentCard({
  active,
  icon: Icon,
  label,
  hint,
  onClick,
}: {
  active: boolean;
  icon: typeof CarFront;
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group rounded-3xl border p-4 text-left transition duration-200 ${
        active
          ? 'border-indigo-400/70 bg-indigo-500/12 shadow-[0_18px_40px_rgba(79,70,229,0.18)]'
          : 'border-slate-200/70 bg-white/80 hover:border-slate-300 hover:bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        {active ? <BadgeCheck className="mt-1 h-5 w-5 text-indigo-500" /> : null}
      </div>
      <div className="mt-5">
        <div className="text-base font-semibold tracking-[-0.02em] text-slate-900">{label}</div>
        <p className="mt-1 text-sm leading-6 text-slate-600">{hint}</p>
      </div>
    </button>
  );
}

function WizardField({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
  icon: typeof UserRound;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
        <Icon className="h-4 w-4 text-slate-400" />
        {label}
      </span>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
      />
    </label>
  );
}

function PreviewDocument({ data }: { data: FormState }) {
  const safeData = {
    buyerName: data.buyerName || 'Jan Novák',
    sellerName: data.sellerName || 'Petra Svobodová',
    vehicle: data.vehicle || 'Škoda Octavia, VIN TMB12345678901234',
    price: data.price || '285 000 Kč',
    transferDate: data.transferDate || '15. 4. 2026',
  };

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-[#f8f5ef] p-5 shadow-[0_28px_60px_rgba(15,23,42,0.18)]">
      <div className="rounded-[1.5rem] border border-[#e2d7c4] bg-[#f5efe4] px-6 py-7 text-slate-800 shadow-inner">
        <div className="mb-7 flex items-center justify-between border-b border-[#deceb5] pb-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8d7752]">Ukázka výstupu</div>
            <div className="mt-1 font-serif text-3xl text-[#5b4420]">Kupní smlouva na vozidlo</div>
          </div>
          <FileText className="h-6 w-6 text-[#a98b5b]" />
        </div>

        <div className="space-y-5 text-[15px] leading-7">
          <section>
            <div className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8d7752]">1. Smluvní strany</div>
            <p className="mt-2">
              Prodávající: <strong>{safeData.sellerName}</strong>
            </p>
            <p>
              Kupující: <strong>{safeData.buyerName}</strong>
            </p>
          </section>

          <section>
            <div className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8d7752]">2. Předmět převodu</div>
            <p className="mt-2">{safeData.vehicle}</p>
          </section>

          <section>
            <div className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8d7752]">3. Kupní cena a předání</div>
            <p className="mt-2">
              Kupní cena činí <strong>{safeData.price}</strong>. Předání vozidla proběhne dne <strong>{safeData.transferDate}</strong>.
            </p>
          </section>

          <section>
            <div className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8d7752]">4. Závěrečná ustanovení</div>
            <p className="mt-2">
              Dokument je sestaven podle údajů zadaných uživatelem a je určen ke kontrole a podpisu oběma stranami.
            </p>
          </section>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-8 border-t border-[#deceb5] pt-6 text-sm text-[#7b6746]">
          <div>
            <div className="border-t border-[#ccb794] pt-2">Prodávající</div>
          </div>
          <div>
            <div className="border-t border-[#ccb794] pt-2">Kupující</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeIntent, setActiveIntent] = useState<IntentKey>('auto');
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({
    buyerName: '',
    sellerName: '',
    vehicle: '',
    price: '',
    transferDate: '',
  });

  const deferredForm = useDeferredValue(form);
  const currentIntent = intents.find(intent => intent.key === activeIntent) ?? intents[0];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.08),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/72 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <div className="text-lg font-semibold tracking-[-0.03em] text-slate-900">SmlouvaHned.cz</div>
            <div className="mt-1 text-xs leading-5 text-slate-500">
              Online nástroj pro sestavení standardizovaných dokumentů. Nejde o individuální právní poradenství.
            </div>
          </div>

          <div className="hidden items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs text-slate-600 shadow-sm md:flex">
            <ShieldCheck className="h-4 w-4 text-indigo-600" />
            Vhodné pro běžné a typizované situace
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pt-16">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="space-y-8">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-medium text-slate-600 shadow-sm">
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                  Zero-friction průvodce pro standardizované smluvní dokumenty
                </div>

                <div className="max-w-3xl">
                  <h1 className="text-4xl font-semibold tracking-[-0.06em] text-slate-900 sm:text-5xl lg:text-6xl">
                    Smluvní dokument
                    <span className="block text-indigo-600">bez zbytečného tření</span>
                  </h1>
                  <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                    Vyberete situaci, doplníte fakta a získáte standardizovaný dokument podle zadaných údajů. Výstup je
                    určen ke kontrole a podpisu.
                  </p>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200/80 bg-white/75 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">Decision tree</div>
                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-900">Co dnes řešíte?</h2>
                  </div>
                  <div className="hidden rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white sm:flex">
                    3 kliknutí ke smlouvě
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {intents.map(intent => (
                    <IntentCard
                      key={intent.key}
                      active={intent.key === activeIntent}
                      icon={intent.icon}
                      label={intent.label}
                      hint={intent.hint}
                      onClick={() => setActiveIntent(intent.key)}
                    />
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(79,70,229,0.24)] transition hover:-translate-y-0.5 hover:bg-indigo-500"
                  >
                    Spustit průvodce
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <div className="text-sm leading-6 text-slate-500">
                    Vybraný okruh: <span className="font-medium text-slate-700">{currentIntent.label}</span>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="rounded-[2rem] border border-slate-200/80 bg-white/78 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">Aktivní scénář</div>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-900">Kupní smlouva na auto</h2>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
                  Live preview
                </div>
              </div>

              <div className="mt-6 hidden gap-6 lg:grid lg:grid-cols-[0.92fr_1.08fr]">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <CircleHelp className="h-4 w-4 text-indigo-500" />
                    Průvodce se ptá na fakta, ne na paragrafy.
                  </div>

                  <div className="mt-5 flex gap-2">
                    {wizardSteps.map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setStep(item.id)}
                        className={`flex-1 rounded-2xl px-3 py-3 text-left text-sm transition ${
                          step === item.id
                            ? 'bg-slate-900 text-white shadow-lg'
                            : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] opacity-70">Krok 0{item.id}</div>
                        <div className="mt-1 font-medium">{item.title}</div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-600">
                    {wizardSteps[step - 1].helper}
                  </div>

                  <div className="mt-5 space-y-4">
                    <WizardField
                      label="Kupující"
                      value={form.buyerName}
                      onChange={next => setForm(prev => ({ ...prev, buyerName: next }))}
                      placeholder="Např. Jan Novák"
                      icon={UserRound}
                    />
                    <WizardField
                      label="Prodávající"
                      value={form.sellerName}
                      onChange={next => setForm(prev => ({ ...prev, sellerName: next }))}
                      placeholder="Např. Petra Svobodová"
                      icon={UserRound}
                    />
                    <WizardField
                      label="Vozidlo"
                      value={form.vehicle}
                      onChange={next => setForm(prev => ({ ...prev, vehicle: next }))}
                      placeholder="Např. Škoda Octavia, VIN..."
                      icon={CarFront}
                    />
                    <div className="grid gap-4 md:grid-cols-2">
                      <WizardField
                        label="Kupní cena"
                        value={form.price}
                        onChange={next => setForm(prev => ({ ...prev, price: next }))}
                        placeholder="Např. 285 000 Kč"
                        icon={Wallet}
                      />
                      <WizardField
                        label="Datum předání"
                        value={form.transferDate}
                        onChange={next => setForm(prev => ({ ...prev, transferDate: next }))}
                        placeholder="Např. 15. 4. 2026"
                        icon={Clock3}
                      />
                    </div>
                  </div>
                </div>

                <PreviewDocument data={deferredForm} />
              </div>

              <div className="mt-6 space-y-4 lg:hidden">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4">
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">Mobile-first chat UI</div>
                  <div className="mt-4 space-y-3">
                    {mobileMessages.map((message, index) => (
                      <div
                        key={`${message.from}-${index}`}
                        className={`max-w-[85%] rounded-[1.35rem] px-4 py-3 text-sm leading-6 shadow-sm ${
                          message.from === 'user'
                            ? 'ml-auto bg-indigo-600 text-white'
                            : 'bg-white text-slate-700 border border-slate-200'
                        }`}
                      >
                        {message.text}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                  <div className="text-sm font-medium text-slate-700">Náhled výstupu</div>
                  <div className="mt-4">
                    <PreviewDocument data={deferredForm} />
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-slate-700">
                SmlouvaHned je online nástroj pro sestavení standardizovaných smluvních dokumentů podle údajů zadaných
                uživatelem. Nejde o individuální právní poradenství ani o poskytování advokátních služeb.
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8">
            <div className="max-w-2xl">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">Jak to funguje</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-900">Vyplňte. Zkontrolujte. Stáhněte.</h2>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {howItWorks.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.35, delay: index * 0.07 }}
                  className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-6"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
                    0{index + 1}
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2">
                <ShieldCheck className="h-4 w-4 text-indigo-600" />
                Transparentní vymezení služby
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2">
                <Clock3 className="h-4 w-4 text-indigo-600" />
                Krátký a srozumitelný flow
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2">
                <ChevronRight className="h-4 w-4 text-indigo-600" />
                Výstup určený ke kontrole a podpisu
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
