import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/lib/seo/site';

const canonicalUrl = `${SITE_URL}/gdpr`;

export const metadata: Metadata = {
  title: 'Ochrana osobních údajů (GDPR)',
  description: 'Zásady zpracování osobních údajů platformy SmlouvaHned.cz v souladu s GDPR (nařízení EU 2016/679).',
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: 'Ochrana osobních údajů (GDPR)',
    description: 'Jak SmlouvaHned.cz zpracovává osobní údaje při tvorbě a zpřístupnění smluvních dokumentů.',
    url: canonicalUrl,
    siteName: 'SmlouvaHned',
    type: 'website',
    locale: 'cs_CZ',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SmlouvaHned - GDPR' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ochrana osobních údajů | SmlouvaHned',
    description: 'Zásady zpracování osobních údajů pro tvorbu dokumentů na SmlouvaHned.cz.',
    images: ['/og-image.png'],
  },
};

export default function GdprPage() {
  return (
    <main className="min-h-screen bg-[#05080f] text-slate-300 py-16 px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-amber-500/4 blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="mb-3">
          <Link href="/" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-amber-400 transition">
            ← SmlouvaHned
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white mb-3 uppercase italic tracking-tighter">
          Ochrana osobních <span className="text-amber-500">údajů</span>
        </h1>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.25em] mb-12">
          Platné od 1. 1. 2026 • Dle nařízení EU 2016/679 (GDPR)
        </p>

        <div className="space-y-10 text-sm leading-relaxed">

          <section className="bg-[#0c1426]/60 border border-white/5 p-8 rounded-[28px]">
            <h2 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-4">
              1. Správce osobních údajů
            </h2>
            <p className="mb-3">
              Správcem osobních údajů je fyzická osoba — podnikatel provozující platformu SmlouvaHned.cz (dále jen „Správce“):
            </p>
            <div className="bg-white/3 border border-white/8 rounded-xl p-4 text-slate-300 space-y-1 text-sm">
              <p><strong className="text-white">Karel Zdeněk</strong>, fyzická osoba — podnikatel</p>
              <p>IČO: 23660295</p>
              <p>Místo podnikání: Plzeňská 189, 345 61 Staňkov</p>
              <p>Kontaktní e-mail: <a href="mailto:info@smlouvahned.cz" className="text-amber-400 hover:underline">info@smlouvahned.cz</a></p>
              <p>Web: smlouvahned.cz</p>
            </div>
            <p className="mt-3 text-slate-400 text-xs">
              Správce zpracovává osobní údaje v souladu s nařízením Evropského parlamentu a Rady (EU) 2016/679 (GDPR) a zákonem č. 110/2019 Sb., o zpracování osobních údajů.
            </p>
          </section>

          <section>
            <h2 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-4">
              2. Jaké osobní údaje zpracováváme a proč
            </h2>
            <div className="space-y-4">
              <div className="border border-white/8 rounded-2xl p-5">
                <div className="font-bold text-white mb-2">Údaje zadané do formuláře smlouvy</div>
                <p className="text-slate-400 text-xs mb-2">Jména, adresy, data narození, čísla OP a IČO smluvních stran, které do formuláře zadáte vy sami.</p>
                <div className="text-xs text-slate-500"><span className="text-amber-400 font-bold">Účel:</span> Vygenerování standardizovaného smluvního dokumentu dle vašich zadaných dat.</div>
                <div className="text-xs text-slate-500"><span className="text-amber-400 font-bold">Právní základ:</span> Plnění smlouvy (čl. 6 odst. 1 písm. b) GDPR).</div>
                <div className="text-xs text-slate-500"><span className="text-amber-400 font-bold">Doba uchování:</span> 7–30 dní od zaplacení podle zakoupeného dokumentu (Základní dokument 7 dní, Rozšířený dokument 30 dní, Tematický balíček 30 dní), případně 90 dní s doplňkem archivace. Poté jsou data automaticky smazána z dočasného úložiště.</div>
              </div>
              <div className="border border-white/8 rounded-2xl p-5">
                <div className="font-bold text-white mb-2">E-mailová adresa</div>
                <p className="text-slate-400 text-xs mb-2">Pokud ji dobrovolně zadáte při objednávce.</p>
                <div className="text-xs text-slate-500"><span className="text-amber-400 font-bold">Účel:</span> Zaslání odkazu ke stažení hotového dokumentu.</div>
                <div className="text-xs text-slate-500"><span className="text-amber-400 font-bold">Právní základ:</span> Plnění smlouvy + oprávněný zájem (čl. 6 odst. 1 písm. b) a f) GDPR).</div>
                <div className="text-xs text-slate-500"><span className="text-amber-400 font-bold">Doba uchování:</span> 7–30 dní od objednávky podle zakoupeného dokumentu, případně 90 dní s doplňkem archivace, poté automaticky smazáno.</div>
              </div>
              <div className="border border-white/8 rounded-2xl p-5">
                <div className="font-bold text-white mb-2">Newsletter (tipy a novinky)</div>
                <p className="text-slate-400 text-xs mb-2">
                  Pouze pokud se v patičce webu výslovně přihlásíte a zaškrtnete souhlas se zasíláním e-mailů.
                </p>
                <div className="text-xs text-slate-500"><span className="text-amber-400 font-bold">Účel:</span> Zasílání praktických tipů k dokumentům a informací o službě SmlouvaHned.</div>
                <div className="text-xs text-slate-500"><span className="text-amber-400 font-bold">Právní základ:</span> Souhlas (čl. 6 odst. 1 písm. a) GDPR).</div>
                <div className="text-xs text-slate-500"><span className="text-amber-400 font-bold">Doba uchování:</span> Do odvolání souhlasu nebo odhlášení z odběru (odkaz v každém e-mailu).</div>
              </div>
              <div className="border border-white/8 rounded-2xl p-5">
                <div className="font-bold text-white mb-2">Platební údaje</div>
                <p className="text-slate-400 text-xs mb-2">Čísla platebních karet a bankovní údaje jsou zpracovávány výhradně platební bránou <strong>Stripe</strong> (Stripe, Inc., USA). Správce k nim nemá přístup.</p>
                <div className="text-xs text-slate-500"><span className="text-amber-400 font-bold">Více o Stripe GDPR:</span> <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">stripe.com/privacy</a></div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-4">
              3. Příjemci osobních údajů
            </h2>
            <p className="mb-3">
              Osobní údaje mohou být předány těmto zpracovatelům:
            </p>
            <ul className="space-y-2 text-slate-400">
              <li className="flex gap-3"><span className="text-amber-400 font-bold flex-shrink-0">→</span><span><strong className="text-white">Stripe, Inc.</strong> — zpracování plateb. Zpracovatel dle čl. 28 GDPR, certifikace PCI DSS Level 1.</span></li>
              <li className="flex gap-3"><span className="text-amber-400 font-bold flex-shrink-0">→</span><span><strong className="text-white">Upstash (Redis)</strong> — dočasné uložení dat formuláře po dobu generování a stažení dokumentu (7–30 dní podle zakoupeného dokumentu, případně 90 dní s doplňkem archivace).</span></li>
              <li className="flex gap-3"><span className="text-amber-400 font-bold flex-shrink-0">→</span><span><strong className="text-white">Resend</strong> — transakční e-maily (odkaz ke stažení), pouze pokud zadáte e-mail při objednávce.</span></li>
              <li className="flex gap-3"><span className="text-amber-400 font-bold flex-shrink-0">→</span><span><strong className="text-white">Upstash (Redis)</strong> — uložení e-mailu a záznamu souhlasu při přihlášení k newsletteru v patičce (do odvolání souhlasu).</span></li>
              <li className="flex gap-3"><span className="text-amber-400 font-bold flex-shrink-0">→</span><span><strong className="text-white">Vercel</strong> — hosting platformy. Údaje jsou zpracovávány v rámci EHP nebo za odpovídajících záruk.</span></li>
            </ul>
            <p className="mt-3 text-xs text-slate-500">
              Správce neprodává osobní údaje třetím stranám. Marketingové e-maily (newsletter) zasíláme výhradně na základě
              dobrovolného souhlasu, který můžete kdykoli odvolat.
            </p>
          </section>

          <section>
            <h2 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-4">
              4. Předávání údajů mimo EHP
            </h2>
            <p>
              Stripe, Inc. a Resend sídlí v USA. Předávání je zabezpečeno prostřednictvím standardních smluvních doložek (SCC) schválených Evropskou komisí a doplňkových technických opatření. Upstash a Vercel umožňují volbu regionu EU (platí pro naše nasazení).
            </p>
          </section>

          <section>
            <h2 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-4">
              5. Vaše práva
            </h2>
            <p className="mb-4">Jako subjekt údajů máte tato práva:</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { title: 'Právo na přístup', desc: 'Máte právo vědět, jaké osobní údaje o vás zpracováváme.' },
                { title: 'Právo na opravu', desc: 'Máte právo na opravu nepřesných osobních údajů.' },
                { title: 'Právo na výmaz', desc: 'Máte právo požádat o smazání vašich údajů za podmínek čl. 17 GDPR.' },
                { title: 'Právo na omezení', desc: 'Máte právo požadovat omezení zpracování vašich údajů.' },
                { title: 'Právo na přenositelnost', desc: 'Máte právo obdržet vaše údaje ve strojově čitelném formátu.' },
                { title: 'Právo vznést námitku', desc: 'Máte právo vznést námitku proti zpracování na základě oprávněného zájmu.' },
              ].map(r => (
                <div key={r.title} className="border border-white/8 rounded-xl p-4">
                  <div className="font-bold text-white text-xs mb-1">{r.title}</div>
                  <div className="text-xs text-slate-400">{r.desc}</div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-400">
              Práva uplatňujte na: <a href="mailto:info@smlouvahned.cz" className="text-amber-400 hover:underline">info@smlouvahned.cz</a>. Na vaši žádost odpovíme do 30 dnů.
            </p>
          </section>

          <section>
            <h2 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-4">
              6. Cookies a analytika
            </h2>
            <p className="mb-3">
              SmlouvaHned nepoužívá marketingové ani profilující cookies třetích stran. Pro základní fungování aplikace mohou být použity technicky nezbytné session cookies. Na webu není nasazena žádná behaviorální reklamní platforma (Facebook Pixel, Google Ads remarketing apod.).
            </p>
            <p>
              Pro anonymizovanou statistiku návštěvnosti používáme{' '}
              <strong className="text-white">Vercel Web Analytics</strong> (agregované zobrazení stránek, bez
              identifikace konkrétní osoby). Produktové události (např. vstup do formuláře, klik na checkout) ukládáme
              interně bez propojení s platební kartou; dokončené platby evidujeme až po potvrzení Stripe.
            </p>
          </section>

          <section>
            <h2 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-4">
              7. Zabezpečení údajů
            </h2>
            <p>
              Veškerá komunikace je šifrována protokolem TLS (HTTPS). Data formulářů jsou ukládána v šifrovaném dočasném úložišti s automatickým výmazem po 7–30 dnech podle zakoupeného dokumentu, případně po 90 dnech s doplňkem archivace. Přístup k datům je omezen na technicky nezbytné osoby. Platební údaje nikdy neprocházejí našimi servery.
            </p>
          </section>

          <section>
            <h2 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-4">
              8. Právo podat stížnost
            </h2>
            <p>
              Máte právo podat stížnost u dozorového úřadu — <strong className="text-white">Úřad pro ochranu osobních údajů (ÚOOÚ)</strong>, se sídlem Pplk. Sochora 27, 170 00 Praha 7, <a href="https://www.uoou.cz" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">www.uoou.cz</a>.
            </p>
          </section>

          <section className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] text-slate-600 uppercase tracking-widest">SmlouvaHned © 2026</p>
            <Link href="/" className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-white text-[10px] font-black uppercase hover:bg-amber-500 hover:text-black transition">
              Zpět na úvodní stránku
            </Link>
          </section>

        </div>
      </div>
    </main>
  );
}
