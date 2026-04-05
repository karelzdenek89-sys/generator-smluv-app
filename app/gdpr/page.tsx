import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ochrana osobních údajů (GDPR) | SmlouvaHned',
  description:
    'Zásady zpracování osobních údajů platformy SmlouvaHned.cz v souladu s GDPR a českými právními předpisy.',
  alternates: { canonical: 'https://www.smlouvahned.cz/gdpr' },
};

const rights = [
  {
    title: 'Právo na přístup',
    desc: 'Můžete požádat o informaci, jaké osobní údaje o vás zpracováváme a za jakým účelem.',
  },
  {
    title: 'Právo na opravu',
    desc: 'Můžete požadovat opravu nepřesných nebo neúplných osobních údajů.',
  },
  {
    title: 'Právo na výmaz',
    desc: 'Můžete požádat o výmaz údajů, pokud jsou splněny podmínky stanovené GDPR.',
  },
  {
    title: 'Právo na omezení',
    desc: 'V některých situacích můžete žádat o dočasné omezení zpracování.',
  },
  {
    title: 'Právo na přenositelnost',
    desc: 'U údajů zpracovávaných automatizovaně na základě smlouvy můžete požadovat jejich předání ve strojově čitelném formátu.',
  },
  {
    title: 'Právo vznést námitku',
    desc: 'Můžete vznést námitku proti zpracování založenému na oprávněném zájmu.',
  },
];

export default function GdprPage() {
  return (
    <main className="premium-page-bg-ref px-6 py-16 text-slate-300">
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-full -translate-x-1/2 bg-amber-500/4 blur-[120px]" />

      <div className="premium-page-shell-ref max-w-4xl">
        <div className="mb-3">
          <Link href="/" className="premium-back-link-ref">
            ← SmlouvaHned
          </Link>
        </div>

        <div className="premium-page-hero-ref mb-12">
          <div className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Ochrana osobních údajů</div>
          <h1 className="font-heading-serif text-4xl text-white md:text-5xl">
            Ochrana osobních <span className="text-amber-400">údajů</span>
          </h1>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
            Platné od 4. 4. 2026 · dle GDPR a zákona č. 110/2019 Sb.
          </p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed">
          <section className="premium-page-card-ref p-8">
            <h2 className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-amber-400">1. Správce osobních údajů</h2>
            <p className="mb-3">
              Správcem osobních údajů je <strong className="text-white">Karel Zdeněk</strong>, IČO 23660295, s místem podnikání
              Plzeňská 189, 345 61 Staňkov, kontaktní e-mail:{' '}
              <a href="mailto:info@smlouvahned.cz" className="text-amber-400 hover:underline">
                info@smlouvahned.cz
              </a>
              .
            </p>
            <div className="space-y-1 rounded-xl border border-white/8 bg-white/3 p-4 text-sm text-slate-300">
              <p>
                <strong className="text-white">Karel Zdeněk</strong>
              </p>
              <p>IČO: 23660295</p>
              <p>Místo podnikání: Plzeňská 189, 345 61 Staňkov</p>
              <p>
                Kontaktní e-mail:{' '}
                <a href="mailto:info@smlouvahned.cz" className="text-amber-400 hover:underline">
                  info@smlouvahned.cz
                </a>
              </p>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Osobní údaje zpracováváme v souladu s nařízením Evropského parlamentu a Rady (EU) 2016/679 (GDPR) a
              příslušnými českými právními předpisy.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-amber-400">2. Jaké údaje zpracováváme a proč</h2>
            <div className="space-y-4">
              {[
                {
                  title: 'Údaje zadané do formuláře dokumentu',
                  copy:
                    'Typicky jména, adresy, data narození, IČO, identifikační údaje stran a další informace, které do formuláře zadáte vy sami.',
                  meta: [
                    'Účel: sestavení požadovaného dokumentu a jeho zpřístupnění.',
                    'Právní základ: plnění smlouvy podle čl. 6 odst. 1 písm. b) GDPR.',
                    'Doba uchování: po dobu dostupnosti odkazu ke stažení podle zakoupené varianty, nejdéle 30 dnů, pokud právní předpis nevyžaduje delší uchování konkrétních souvisejících údajů.',
                  ],
                },
                {
                  title: 'E-mailová adresa',
                  copy:
                    'Pokud ji při objednávce zadáte, použijeme ji pro zaslání odkazu ke stažení, komunikaci k objednávce nebo vyřízení reklamace.',
                  meta: [
                    'Právní základ: plnění smlouvy a v odůvodněných případech oprávněný zájem podle čl. 6 odst. 1 písm. b) a f) GDPR.',
                  ],
                },
                {
                  title: 'Údaje o objednávce a platbě',
                  copy:
                    'Evidujeme základní údaje o objednávce, variantě služby, stavu platby a technickém zpřístupnění dokumentu.',
                  meta: [
                    'Právní základ: plnění smlouvy, plnění zákonných povinností a oprávněný zájem na prokázání řádného poskytnutí služby.',
                  ],
                },
                {
                  title: 'Platební údaje',
                  copy:
                    'Údaje o platební kartě nebo bankovní údaje zpracovává přímo platební brána Stripe. Poskytovatel k těmto údajům nemá přímý přístup.',
                  meta: [],
                },
              ].map(item => (
                <div key={item.title} className="premium-page-card-ref p-5">
                  <div className="mb-2 font-bold text-white">{item.title}</div>
                  <p className="mb-2 text-xs text-slate-400">{item.copy}</p>
                  {item.meta.map(line => {
                    const [label, ...rest] = line.split(':');
                    return (
                      <div key={line} className="text-xs text-slate-500">
                        <span className="font-bold text-amber-400">{label}:</span> {rest.join(':').trim()}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </section>

          <section className="premium-page-card-ref p-8">
            <h2 className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-amber-400">3. Příjemci a zpracovatelé</h2>
            <ul className="space-y-2 text-slate-400">
              {[
                'Stripe – zpracování plateb a souvisejících technických informací.',
                'Upstash – dočasné uložení dat potřebných pro generování a zpřístupnění dokumentu.',
                'Resend – odesílání transakčních e-mailů, pokud zákazník zadá e-mailovou adresu.',
                'Vercel – hosting a technický provoz webu.',
              ].map(item => (
                <li key={item} className="flex gap-3">
                  <span className="flex-shrink-0 font-bold text-amber-400">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-slate-500">Osobní údaje neprodáváme třetím stranám a nepoužíváme je pro marketingové profilování.</p>
          </section>

          <section className="premium-page-card-ref p-8">
            <h2 className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-amber-400">4. Předávání údajů mimo EHP</h2>
            <p>
              Někteří zpracovatelé mohou sídlit mimo Evropský hospodářský prostor, zejména v USA. V takovém případě
              využíváme pouze poskytovatele, kteří deklarují odpovídající smluvní a organizační záruky, například
              standardní smluvní doložky nebo jiný platný mechanismus podle GDPR.
            </p>
          </section>

          <section className="premium-page-card-ref p-8">
            <h2 className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-amber-400">5. Cookies a technické údaje</h2>
            <p className="mb-3">
              Web nepoužívá marketingové ani remarketingové cookies třetích stran. Mohou být používány pouze technické
              prostředky nezbytné pro fungování webu, platební proces nebo zapamatování souhlasu s cookies lištou.
            </p>
            <p className="text-xs text-slate-500">Pokud se technické nastavení webu změní, budou tyto informace průběžně aktualizovány.</p>
          </section>

          <section className="premium-page-card-ref p-8">
            <h2 className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-amber-400">6. Zabezpečení údajů</h2>
            <p>
              Přenos dat mezi zařízením uživatele a webem je zabezpečen šifrovaným připojením HTTPS. Přístup k údajům je
              omezen na technicky nezbytný rozsah a údaje určené pro generování dokumentu jsou uchovávány pouze dočasně po
              dobu potřebnou k jeho zpřístupnění.
            </p>
          </section>

          <section className="premium-page-card-ref p-8">
            <h2 className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-amber-400">7. Vaše práva</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {rights.map(item => (
                <div key={item.title} className="premium-note-card-ref p-4">
                  <div className="mb-1 text-xs font-bold text-white">{item.title}</div>
                  <div className="text-xs text-slate-400">{item.desc}</div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-400">
              Své žádosti a dotazy můžete zasílat na{' '}
              <a href="mailto:info@smlouvahned.cz" className="text-amber-400 hover:underline">
                info@smlouvahned.cz
              </a>
              .
            </p>
          </section>

          <section className="premium-page-card-ref p-8">
            <h2 className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-amber-400">8. Právo podat stížnost</h2>
            <p>
              Máte právo podat stížnost u dozorového úřadu, kterým je <strong className="text-white">Úřad pro ochranu osobních údajů</strong>, Pplk. Sochora 27, 170 00 Praha 7,{' '}
              <a href="https://www.uoou.cz" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">
                www.uoou.cz
              </a>
              .
            </p>
          </section>

          <section className="premium-footer-ref flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-600">Karel Zdeněk · IČO 23660295 · SmlouvaHned.cz © 2026</p>
            <Link href="/" className="btn-outline-ref rounded-full px-8 py-3 text-[10px] font-black uppercase">
              Zpět na úvodní stránku
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
