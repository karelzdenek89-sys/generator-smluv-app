import type { Metadata } from 'next';
import Link from 'next/link';
import { breadcrumbSchema, faqPageSchema, jsonLdScript, type FaqItem } from '@/lib/schemas';
import { getMonetizationPolicy } from '@/lib/monetization-policy';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.smlouvahned.cz';
const FREE_BASIC_DPP = getMonetizationPolicy('dpp', 'cs').mode === 'free_experiment';

export const metadata: Metadata = {
  title: 'Časté dotazy (FAQ) 2026',
  description:
    'Odpovědi na časté otázky o tvorbě smluv online v roce 2026 — platnost a použitelnost dokumentů, ceny, ochrana údajů podle GDPR i vrácení peněz.',
  alternates: { canonical: `${BASE_URL}/faq` },
  openGraph: {
    title: 'Časté dotazy (FAQ) 2026',
    description: 'Odpovědi na časté otázky o smluvních dokumentech 2026, cenách a GDPR.',
    url: `${BASE_URL}/faq`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SmlouvaHned — časté dotazy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Časté dotazy 2026',
    description: 'Ceny, doručení, platnost odkazu, GDPR a použití smluvních dokumentů ze SmlouvaHned.',
    images: ['/og-image.png'],
  },
};

type FaqGroup = {
  title: string;
  items: FaqItem[];
};

const FAQ_GROUPS: FaqGroup[] = [
  {
    title: 'Ceny a platba',
    items: [
      {
        question: 'Kolik dokument stojí?',
        answer: FREE_BASIC_DPP
          ? 'Základní DPP je v aktivním experimentu zdarma; rozšířená DPP stojí 199 Kč. U ostatních typů stojí Základní dokument 99 Kč, Rozšířený dokument 199 Kč, tematický balíček 299 Kč a personální balíček Zaměstnavatel Start 2026 599 Kč. Bez předplatného a skrytých poplatků.'
          : 'Základní dokument 99 Kč, Rozšířený dokument s ochrannými klauzulemi 199 Kč, tematický balíček pro pronájem nebo prodej vozidla 299 Kč a personální balíček Zaměstnavatel Start 2026 za 599 Kč. Cena je konečná, žádné předplatné ani skryté poplatky.',
      },
      {
        question: 'Jak probíhá platba?',
        answer:
          'Platby zpracovává Stripe — podporuje platební karty (Visa, Mastercard, American Express), Apple Pay i Google Pay. Platební údaje se na naše servery nikdy nedostanou.',
      },
      {
        question: 'Mohu dostat fakturu?',
        answer:
          'Ano. Po platbě vám odešleme doklad na uvedený e-mail. Provozovatel není plátcem DPH; na dokladu lze uvést firemní IČO.',
      },
      {
        question: 'Vrácení peněz?',
        answer:
          'Pokud generátor nefunguje technicky nebo dokument neobdržíte, vrátíme peníze v plné výši do 14 dnů. U správně vygenerovaného a stáhnutého dokumentu nelze platbu vrátit (povaha digitálního obsahu, § 1837 OZ).',
      },
    ],
  },
  {
    title: 'Právní platnost a použití',
    items: [
      {
        question: 'Jsou dokumenty právně platné?',
        answer:
          'Výstupem je strukturovaný PDF dokument odpovídající příslušným ustanovením občanského zákoníku č. 89/2012 Sb. a dalších předpisů (zákoník práce, autorský zákon). Po podpisu oběma stranami je platný smluvní dokument. Doporučujeme před podpisem všechna data zkontrolovat.',
      },
      {
        question: 'Jsou tu šablony aktualizované?',
        answer:
          'Ano. Šablony jsou udržované pro českou legislativu k roku 2026, včetně aktualizací občanského zákoníku, zákoníku práce a souvisejících předpisů.',
      },
      {
        question: 'Můžu dokument použít opakovaně?',
        answer:
          'Vygenerovaný dokument je váš — můžete ho použít neomezeně pro vlastní potřebu. Každý nový dokument s odlišnými údaji vyžaduje novou objednávku.',
      },
      {
        question: 'Je to náhrada advokáta?',
        answer:
          'Ne. SmlouvaHned je softwarový nástroj pro typické situace. Pro nestandardní případy, vyšší hodnotu transakce, mezinárodní prvek nebo probíhající spor doporučujeme konzultaci s advokátem (seznam na cak.cz).',
      },
      {
        question: 'Čím se liší Základní a Rozšířený dokument?',
        answer:
          'Základní obsahuje povinné strukturální ustanovení. Rozšířený přidává klauzule o smluvních pokutách, podrobnější odpovědnostní ustanovení a sankční mechanismy pro případ nesplnění závazku.',
      },
    ],
  },
  {
    title: 'Technika a doručení',
    items: [
      {
        question: 'Jak rychle dokument obdržím?',
        answer: FREE_BASIC_DPP
          ? 'Základní DPP vygenerujete ihned bez platby a bez registrace; zabezpečený odkaz ke stažení je dostupný 24 hodin. Placené dokumenty obdržíte ihned po dokončení platby, základní na 7 dní a rozšířený nebo tematický balíček na 30 dní.'
          : 'Ihned po dokončení platby. Odkaz ke stažení PDF se zobrazí v prohlížeči a odešle se vám e-mailem. Platnost odkazu: Základní dokument 7 dní, Rozšířený dokument a tematický balíček 30 dní, případně 90 dní s doplňkem archivace.',
      },
      {
        question: 'V jakém formátu je výstup?',
        answer:
          'Standardní PDF (A4) optimalizovaný pro tisk i elektronický podpis. Otevřete ho v každém běžném prohlížeči nebo PDF čtečce.',
      },
      {
        question: 'Můžu dokument elektronicky podepsat?',
        answer:
          'Ano. PDF je kompatibilní se všemi běžnými nástroji elektronického podpisu (Adobe Sign, DocuSign, Signi). Pro vyšší právní jistotu doporučujeme zaručený elektronický podpis nebo úředně ověřený podpis u relevantních typů smluv.',
      },
      {
        question: 'Co když dělám chybu ve formuláři?',
        answer:
          'Před zaplacením se můžete vrátit a opravit jakékoli pole. Po zaplacení obdržíte PDF přesně s těmi údaji, které jste zadali — proto doporučujeme vše před odesláním pečlivě zkontrolovat.',
      },
    ],
  },
  {
    title: 'GDPR a bezpečnost',
    items: [
      {
        question: 'Jak nakládáte s mými údaji?',
        answer:
          'Údaje jsou uloženy pouze dočasně v šifrovaném úložišti po dobu 7–30 dní podle zakoupeného dokumentu, případně 90 dní s doplňkem archivace, a poté automaticky smazány. Platební údaje zpracovává výhradně Stripe — k vašim kartám nemáme přístup.',
      },
      {
        question: 'Sdílíte data s třetími stranami?',
        answer:
          'Ne. Data ze smlouvy nesdílíme s nikým třetím. Stripe zpracovává pouze platby. Resend obstarává transakční e-maily. Více v zásadách ochrany osobních údajů.',
      },
      {
        question: 'Můžu požádat o smazání dat?',
        answer:
          'Ano, kdykoli. Stačí napsat na info@smlouvahned.cz a údaje smažeme do 30 dnů (článek 17 GDPR — právo na výmaz).',
      },
    ],
  },
];

const allFaqItems = FAQ_GROUPS.flatMap((g) => g.items);

export default function FaqPage() {
  const faq = faqPageSchema(allFaqItems);
  const breadcrumb = breadcrumbSchema([
    { label: 'SmlouvaHned', href: '/' },
    { label: 'Časté dotazy', href: '/faq' },
  ]);

  return (
    <main className="min-h-screen bg-[#05080f] text-slate-200 px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(faq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }}
      />

      <div className="mx-auto max-w-3xl">
        <nav className="mb-8 text-xs text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="transition hover:text-slate-300">
            SmlouvaHned
          </Link>
          <span className="mx-2 text-slate-700">›</span>
          <span className="text-slate-400">Časté dotazy</span>
        </nav>

        <header className="mb-12">
          <div className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">
            FAQ
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-4">
            Časté dotazy 2026
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-2xl">
            Odpovědi na nejčastější otázky o SmlouvaHned — ceny, právní platnost, technika i GDPR.
            Obsah je aktuální pro rok 2026.
            Pokud nenajdete odpověď, napište na{' '}
            <a href="mailto:info@smlouvahned.cz" className="text-amber-400 hover:text-amber-300 underline underline-offset-2">
              info@smlouvahned.cz
            </a>.
          </p>
        </header>

        <div className="space-y-10">
          {FAQ_GROUPS.map((group) => (
            <section key={group.title}>
              <h2 className="text-xs font-black uppercase tracking-[0.18em] text-amber-400 mb-5">
                {group.title}
              </h2>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <details
                    key={item.question}
                    className="group rounded-2xl border border-white/8 bg-[#0c1426] p-5 transition hover:border-amber-500/20"
                  >
                    <summary className="flex cursor-pointer items-start justify-between gap-4 list-none">
                      <span className="text-base font-semibold text-white">{item.question}</span>
                      <span className="mt-1 flex-shrink-0 text-amber-400 transition group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-4 text-sm leading-relaxed text-slate-400">{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-14 rounded-3xl border border-amber-500/20 bg-amber-500/5 p-8 text-center">
          <h2 className="text-xl font-black tracking-tight text-white mb-3">
            Nenašli jste odpověď?
          </h2>
          <p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-slate-400">
            Napište nám — odpovídáme zpravidla do několika hodin v pracovní dny.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400"
            >
              Kontakt →
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Vybrat dokument
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
