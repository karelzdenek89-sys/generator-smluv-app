import type { Metadata } from 'next';
import Link from 'next/link';
import { CONTRACT_TYPES } from '@/lib/checkout-validation';
import { FOREIGN_LOCALES } from '@/lib/i18n/locales';
import { SITE_URL } from '@/lib/seo/site';

const canonicalUrl = `${SITE_URL}/partneri`;
const supportedLanguageCount = 1 + FOREIGN_LOCALES.length;

export const metadata: Metadata = {
  title: 'Partnerství se SmlouvaHned',
  description: 'Relevantní doporučení služeb po dokončení právní transakce, s měřitelným výkonem, transparentním řazením a důslednou minimalizací osobních údajů.',
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: 'Partnerství se SmlouvaHned',
    description: 'Oslovte zákazníka ve chvíli, kdy skutečně řeší konkrétní transakci.',
    url: canonicalUrl,
    siteName: 'SmlouvaHned',
    type: 'website',
    locale: 'cs_CZ',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Partnerství se SmlouvaHned' }],
  },
};

const verticals = [
  ['Auta', 'Kupní smlouvy a další kroky kupujícího nebo prodávajícího.'],
  ['Nájem', 'Kontext nájemce a pronajímatele zůstává oddělený.'],
  ['Stavební zakázky', 'Smlouva o dílo, rozpočet a navazující agenda objednatele či zhotovitele.'],
  ['Podnikání', 'Spolupráce, služby, fakturace a elektronické podepisování.'],
  ['Zaměstnávání', 'Pracovní smlouvy a DPP s rozlišením zaměstnavatele a zaměstnance.'],
] as const;

const models = [
  {
    title: 'Affiliate doporučení',
    flow: 'SmlouvaHned → relevantní nabídka → partner',
    text: 'Uživatel přejde sám. Obsah smlouvy ani kontaktní údaje se do odkazu nepřidávají.',
  },
  {
    title: 'Qualified lead',
    flow: 'Žádost o kontakt → konkrétní souhlas → partner',
    text: 'Předání proběhne jen po jasné akci uživatele, pro uvedený účel a s přesným seznamem polí.',
  },
  {
    title: 'Integrovaná služba',
    flow: 'SmlouvaHned ↔ partner API',
    text: 'Serverová integrace s vlastním allowlistem, autentizací, idempotencí a odděleným chybovým režimem.',
  },
] as const;

export default function PartneriPage() {
  return (
    <main className="min-h-screen bg-[#05080f] text-slate-200">
      <section className="relative overflow-hidden border-b border-white/5 px-6 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(245,158,11,0.12),transparent_42%)]" />
        <div className="relative mx-auto max-w-6xl">
          <Link href="/" className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 transition hover:text-amber-400">
            ← SmlouvaHned
          </Link>
          <div className="mt-12 max-w-4xl">
            <div className="text-xs font-black uppercase tracking-[0.24em] text-amber-400">Partnerství</div>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-6xl">
              Oslovte zákazníka ve chvíli, kdy skutečně řeší konkrétní transakci.
            </h1>
            <p className="mt-7 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              SmlouvaHned spojuje vyhledávací záměr, strukturovaný právní dokument a dokončený nákup. Navazující službu zobrazujeme až tehdy, když je pro daný typ transakce a roli uživatele relevantní.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/kontakt" className="inline-flex items-center justify-center rounded-2xl bg-amber-500 px-7 py-4 text-sm font-black text-black transition hover:bg-amber-400">
                Navrhnout spolupráci
              </Link>
              <a href="#jak-to-funguje" className="inline-flex items-center justify-center rounded-2xl border border-white/10 px-7 py-4 text-sm font-semibold text-white transition hover:border-amber-500/40">
                Jak partnerství funguje
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl border border-white/8 bg-[#0c1426] p-6">
              <div className="text-3xl font-black text-white">{CONTRACT_TYPES.length}</div>
              <p className="mt-2 text-sm text-slate-400">typů dokumentů vedených v serverovém datovém modelu</p>
            </div>
            <div className="rounded-3xl border border-white/8 bg-[#0c1426] p-6">
              <div className="text-3xl font-black text-white">{supportedLanguageCount}</div>
              <p className="mt-2 text-sm text-slate-400">podporované jazyky rozhraní: čeština, angličtina a ukrajinština</p>
            </div>
            <div className="rounded-3xl border border-white/8 bg-[#0c1426] p-6 sm:col-span-2 lg:col-span-1">
              <div className="text-3xl font-black text-white">Post-purchase</div>
              <p className="mt-2 text-sm text-slate-400">primární umístění nabídek až po dostupnosti zakoupeného dokumentu</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-600">Údaje výše se odvozují z aktuální konfigurace produktu; neuvádíme neověřené počty návštěv ani zákazníků.</p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-black text-white">Transakční vertikály</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {verticals.map(([title, text]) => (
              <article key={title} className="rounded-3xl border border-white/8 bg-white/[0.025] p-6">
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="jak-to-funguje" className="border-y border-white/5 bg-white/[0.02] px-6 py-16 scroll-mt-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-black text-white">Jak partnerství funguje</h2>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {models.map((model) => (
              <article key={model.title} className="rounded-3xl border border-white/8 bg-[#0c1426] p-7">
                <h3 className="text-lg font-bold text-white">{model.title}</h3>
                <div className="mt-4 rounded-xl bg-black/20 px-4 py-3 text-xs font-semibold text-amber-300">{model.flow}</div>
                <p className="mt-4 text-sm leading-7 text-slate-400">{model.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[32px] border border-emerald-400/15 bg-emerald-400/[0.04] p-8 sm:p-10">
            <div className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">Privacy by design</div>
            <h2 className="mt-4 text-3xl font-black text-white">Kvalitní kontext bez bezhlavého sdílení dat.</h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Obsah smluv ani osobní údaje nejsou partnerům automaticky poskytovány. Eligibility pracuje s minimalizovanými kategoriemi, jako je typ dokumentu, role, pásmo hodnoty, jazyk, monetizační režim a ověřené dokončení dokumentu.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              Kontaktní údaje lze předat pouze v samostatném flow, kde uživatel vidí konkrétního příjemce, účel, přesný rozsah údajů a další postup.
            </p>
          </div>
          <div className="rounded-[32px] border border-amber-500/20 bg-amber-500/[0.05] p-8 sm:p-10">
            <h2 className="text-2xl font-black text-white">Máte přirozeně navazující službu?</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Společně ověříme relevanci, podporovaný trh, technický model, měření, disclosure a bezpečné vypnutí nabídky.
            </p>
            <Link href="/kontakt" className="mt-7 inline-flex w-full items-center justify-center rounded-2xl bg-amber-500 px-6 py-4 text-sm font-black text-black transition hover:bg-amber-400">
              Navrhnout spolupráci
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
