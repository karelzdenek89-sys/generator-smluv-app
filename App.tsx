'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
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

type IntentKey = 'auto' | 'housing' | 'loans' | 'notice';

type FormState = {
  buyerName: string;
  sellerName: string;
  vehicle: string;
  price: string;
  transferDate: string;
  vin: string;
};

type WizardStep = 1 | 2 | 3 | 4;

const intents: Array<{
  key: IntentKey;
  label: string;
  hint: string;
  icon: typeof CarFront;
  route: string;
}> = [
  {
    key: 'auto',
    label: 'Prodávám auto',
    hint: 'Kupní smlouva na auto nebo motocykl',
    icon: CarFront,
    route: 'Kupní smlouva na vozidlo',
  },
  {
    key: 'housing',
    label: 'Pronajímám byt',
    hint: 'Nájem, podnájem a předání bytu',
    icon: Home,
    route: 'Nájemní smlouva',
  },
  {
    key: 'loans',
    label: 'Půjčuji peníze',
    hint: 'Zápůjčka, dluh a splácení',
    icon: HandCoins,
    route: 'Smlouva o zápůjčce',
  },
  {
    key: 'notice',
    label: 'Dávám výpověď',
    hint: 'Ukončení nájmu nebo smluvního vztahu',
    icon: Landmark,
    route: 'Výpověď / ukončení smlouvy',
  },
];

const wizardSteps: Array<{
  id: WizardStep;
  title: string;
  helper: string;
}> = [
  {
    id: 1,
    title: 'Základní info',
    helper: 'Vybereme typ dokumentu a ukážeme, co bude výstupem.',
  },
  {
    id: 2,
    title: 'Smluvní strany',
    helper: 'Zadáte, kdo prodává a kdo kupuje. Stačí běžné identifikační údaje.',
  },
  {
    id: 3,
    title: 'Předmět převodu',
    helper: 'Popíšete vozidlo. VIN najdete v technickém průkazu.',
  },
  {
    id: 4,
    title: 'Finalizace',
    helper: 'Doplníte cenu a datum předání. Výstup pak zkontrolujete před stažením.',
  },
];

const mobileQuestions = [
  'Jak se jmenuje kupující?',
  'Jak se jmenuje prodávající?',
  'Jaké vozidlo převádíte?',
  'Jaká je kupní cena?',
];

const defaultForm: FormState = {
  buyerName: '',
  sellerName: '',
  vehicle: '',
  price: '',
  transferDate: '',
  vin: '',
};

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
      className={`group rounded-[1.75rem] border p-4 text-left transition duration-200 ${
        active
          ? 'border-indigo-400/70 bg-indigo-500/10 shadow-[0_18px_44px_rgba(79,70,229,0.18)]'
          : 'border-slate-200 bg-white/80 hover:border-slate-300 hover:bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        {active ? <BadgeCheck className="mt-1 h-5 w-5 text-emerald-500" /> : null}
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
  placeholder,
  helper,
  icon: Icon,
  onChange,
  onCommit,
}: {
  label: string;
  value: string;
  placeholder: string;
  helper: string;
  icon: typeof UserRound;
  onChange: (next: string) => void;
  onCommit: () => void;
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
        onKeyUp={onCommit}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
      />
      <p className="mt-2 text-xs leading-5 text-slate-500">{helper}</p>
    </label>
  );
}

function DocumentCanvas({ data }: { data: FormState }) {
  const safeData = {
    buyerName: data.buyerName || 'Jan Novák',
    sellerName: data.sellerName || 'Petra Svobodová',
    vehicle: data.vehicle || 'Škoda Octavia, rok výroby 2021',
    price: data.price || '285 000 Kč',
    transferDate: data.transferDate || '15. 4. 2026',
    vin: data.vin || 'TMBJP7NX9MY123456',
  };

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-[#f8f5ef] p-5 shadow-[0_28px_60px_rgba(15,23,42,0.18)]">
      <div className="rounded-[1.5rem] border border-[#e2d7c4] bg-[#f5efe4] px-6 py-7 text-slate-800 shadow-inner">
        <div className="mb-7 flex items-center justify-between border-b border-[#deceb5] pb-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8d7752]">DocumentCanvas</div>
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
            <p className="mt-2">
              Vozidlo: <strong>{safeData.vehicle}</strong>
            </p>
            <p>
              VIN: <strong>{safeData.vin}</strong>
            </p>
          </section>

          <section>
            <div className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8d7752]">3. Kupní cena a předání</div>
            <p className="mt-2">
              Kupní cena činí <strong>{safeData.price}</strong>. Předání vozidla proběhne dne{' '}
              <strong>{safeData.transferDate}</strong>.
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
  const [step, setStep] = useState<WizardStep>(1);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [previewState, setPreviewState] = useState<FormState>(defaultForm);

  const deferredPreview = useDeferredValue(previewState);
  const currentIntent = useMemo(
    () => intents.find(intent => intent.key === activeIntent) ?? intents[0],
    [activeIntent],
  );

  const completion = useMemo(() => {
    const values = [form.buyerName, form.sellerName, form.vehicle, form.vin, form.price, form.transferDate];
    const completed = values.filter(value => value.trim().length > 0).length;
    return Math.round((completed / values.length) * 100);
  }, [form]);

  const updateField = (field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const commitPreview = () => {
    setPreviewState(form);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.08),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/72 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <div className="text-lg font-semibold tracking-[-0.03em] text-slate-900">SmlouvaHned.cz</div>
            <div className="mt-1 text-xs leading-5 text-slate-500">
              Inteligentní nástroj pro vzory smluv. Nejsme advokátní kancelář.
            </div>
          </div>

          <div className="hidden items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs text-slate-600 shadow-sm md:flex">
            <ShieldCheck className="h-4 w-4 text-indigo-600" />
            Standardizované dokumenty pro běžné a typizované situace
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pt-16">
          <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
            <div className="space-y-8">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-medium text-slate-600 shadow-sm">
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                  Zero-friction rozhraní pro rychlé sestavení dokumentu
                </div>

                <div className="max-w-3xl">
                  <h1 className="text-4xl font-semibold tracking-[-0.06em] text-slate-900 sm:text-5xl lg:text-6xl">
                    Co dnes řešíte?
                  </h1>
                  <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                    Nevybíráte z dlouhého katalogu. Zvolíte situaci a smart filter vás pošle rovnou ke správnému
                    standardizovanému dokumentu.
                  </p>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200/80 bg-white/75 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">Intent-based navigation</div>
                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-900">Vyberte svůj záměr</h2>
                  </div>
                  <div className="hidden rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white sm:flex">
                    Zero search
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

                <div className="mt-6 rounded-[1.5rem] border border-indigo-100 bg-indigo-50 px-4 py-4 text-sm leading-6 text-slate-700">
                  Smart filter vybral: <span className="font-semibold text-slate-900">{currentIntent.route}</span>. Uživatel
                  nemusí hledat v katalogu, ale jde rovnou do vhodného flow.
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="rounded-[2rem] border border-slate-200/80 bg-white/78 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">Ukázka flow</div>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-900">Kupní smlouva na auto</h2>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
                  Dokončeno: <span className="font-semibold text-slate-900">{completion} %</span>
                </div>
              </div>

              <div className="mt-6 hidden gap-6 lg:grid lg:grid-cols-2">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <CircleHelp className="h-4 w-4 text-indigo-500" />
                    Multi-step wizard s lidskou nápovědou
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    {wizardSteps.map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setStep(item.id)}
                        className={`rounded-2xl px-3 py-3 text-left text-sm transition ${
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

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.22 }}
                      className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-600"
                    >
                      {wizardSteps[step - 1].helper}
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-5 space-y-4">
                    <WizardField
                      label="Kupující"
                      value={form.buyerName}
                      onChange={next => updateField('buyerName', next)}
                      onCommit={commitPreview}
                      placeholder="Např. Jan Novák"
                      helper="Uveďte osobu nebo firmu, která vozidlo kupuje."
                      icon={UserRound}
                    />
                    <WizardField
                      label="Prodávající"
                      value={form.sellerName}
                      onChange={next => updateField('sellerName', next)}
                      onCommit={commitPreview}
                      placeholder="Např. Petra Svobodová"
                      helper="Uveďte osobu nebo firmu, která vozidlo prodává."
                      icon={UserRound}
                    />
                    <WizardField
                      label="Vozidlo"
                      value={form.vehicle}
                      onChange={next => updateField('vehicle', next)}
                      onCommit={commitPreview}
                      placeholder="Např. Škoda Octavia 2.0 TDI"
                      helper="Stačí značka, model a další údaje, podle kterých je vozidlo jasně určeno."
                      icon={CarFront}
                    />
                    <WizardField
                      label="VIN"
                      value={form.vin}
                      onChange={next => updateField('vin', next)}
                      onCommit={commitPreview}
                      placeholder="Např. TMBJP7NX9MY123456"
                      helper="VIN najdete v technickém průkazu nebo na vozidle."
                      icon={FileText}
                    />
                    <div className="grid gap-4 md:grid-cols-2">
                      <WizardField
                        label="Kupní cena"
                        value={form.price}
                        onChange={next => updateField('price', next)}
                        onCommit={commitPreview}
                        placeholder="Např. 285 000 Kč"
                        helper="Zadejte částku tak, jak ji mezi stranami sjednáte."
                        icon={Wallet}
                      />
                      <WizardField
                        label="Datum předání"
                        value={form.transferDate}
                        onChange={next => updateField('transferDate', next)}
                        onCommit={commitPreview}
                        placeholder="Např. 15. 4. 2026"
                        helper="Datum, kdy se vozidlo a doklady předávají kupujícímu."
                        icon={Clock3}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-600">
                    <FileText className="h-4 w-4 text-indigo-500" />
                    Real-time live preview
                  </div>
                  <DocumentCanvas data={deferredPreview} />
                </div>
              </div>

              <div className="mt-6 space-y-4 lg:hidden">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4">
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">Conversational mobile flow</div>
                  <div className="mt-4 space-y-3">
                    {mobileQuestions.map((question, index) => (
                      <div key={question} className="space-y-2">
                        <div className="max-w-[85%] rounded-[1.35rem] border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm">
                          {question}
                        </div>
                        <div className="ml-auto max-w-[85%] rounded-[1.35rem] bg-indigo-600 px-4 py-3 text-sm leading-6 text-white shadow-sm">
                          {index === 0
                            ? form.buyerName || 'Jan Novák'
                            : index === 1
                              ? form.sellerName || 'Petra Svobodová'
                              : index === 2
                                ? form.vehicle || 'Škoda Octavia'
                                : form.price || '285 000 Kč'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                  <div className="text-sm font-medium text-slate-700">Živý náhled dokumentu</div>
                  <div className="mt-4">
                    <DocumentCanvas data={deferredPreview} />
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
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-900">
                Vyplňte. Zkontrolujte. Stáhněte.
              </h2>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {[
                {
                  title: 'Vyplňte',
                  text: 'Průvodce se ptá na fakta: kdo, co, za kolik a kdy. Bez zbytečné právní terminologie.',
                },
                {
                  title: 'Zkontrolujte',
                  text: 'Během vyplňování sledujete živý náhled dokumentu a máte kontrolu nad tím, co se do něj propisuje.',
                },
                {
                  title: 'Stáhněte',
                  text: 'Po dokončení získáte standardizovaný dokument podle zadaných údajů, určený ke kontrole a podpisu.',
                },
              ].map((item, index) => (
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
                Plynulý stepper bez zbytečného tření
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
