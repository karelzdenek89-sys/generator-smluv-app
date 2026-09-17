import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/lib/seo/site';
import AnalyticsConsentSettings from '@/app/components/analytics/AnalyticsConsentSettings';

const canonicalUrl = `${SITE_URL}/gdpr`;

export const metadata: Metadata = {
  title: 'Ochrana osobních údajů (GDPR)',
  description: 'Zásady zpracování osobních údajů platformy SmlouvaHned.cz v souladu s GDPR (nařízení EU 2016/679) — jaké údaje zpracováváme, proč a jak dlouho.',
  alternates: {
    canonical: canonicalUrl,
    languages: {
      cs: `${SITE_URL}/gdpr`,
      en: `${SITE_URL}/en/privacy`,
      uk: `${SITE_URL}/ua/privacy`,
      'x-default': `${SITE_URL}/gdpr`,
    },
  },
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
          <Link href="/" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-amber-400 transition">
            ← SmlouvaHned
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white mb-3 uppercase italic tracking-tighter">
          Ochrana osobních <span className="text-amber-500">údajů</span>
        </h1>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.25em] mb-12">
          Verze 2026-09-17 • Dle nařízení EU 2016/679 (GDPR)
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
                <div className="text-xs text-slate-400"><span className="text-amber-400 font-bold">Účel:</span> Vygenerování standardizovaného smluvního dokumentu dle vašich zadaných dat.</div>
                <div className="text-xs text-slate-400"><span className="text-amber-400 font-bold">Právní základ:</span> Plnění smlouvy (čl. 6 odst. 1 písm. b) GDPR).</div>
                <div className="text-xs text-slate-400"><span className="text-amber-400 font-bold">Doba uchování:</span> U bezplatného experimentu nejvýše 24 hodin od vytvoření; e-mail pro tento tok nevyžadujeme. U placeného dokumentu 7–30 dní od zaplacení podle zakoupené varianty, případně 90 dní s doplňkem archivace. Poté jsou data automaticky smazána z dočasného úložiště.</div>
              </div>
              <div className="border border-white/8 rounded-2xl p-5">
                <div className="font-bold text-white mb-2">E-mailová adresa</div>
                <p className="text-slate-400 text-xs mb-2">E-mail pro doručení dokumentu zadává objednatel před přechodem k platbě.</p>
                <div className="text-xs text-slate-400"><span className="text-amber-400 font-bold">Účel:</span> Zaslání odkazu ke stažení, potvrzení objednávky a zabezpečeného přístupu do zákaznické zóny.</div>
                <div className="text-xs text-slate-400"><span className="text-amber-400 font-bold">Právní základ:</span> Plnění smlouvy + oprávněný zájem (čl. 6 odst. 1 písm. b) a f) GDPR).</div>
                <div className="text-xs text-slate-400"><span className="text-amber-400 font-bold">Doba uchování:</span> 7–30 dní od objednávky podle zakoupeného dokumentu, případně 90 dní s doplňkem archivace, poté automaticky smazáno.</div>
              </div>
              <div className="border border-white/8 rounded-2xl p-5">
                <div className="font-bold text-white mb-2">Kontaktní formulář</div>
                <p className="text-slate-400 text-xs mb-2">Jméno, e-mail, předmět a obsah zprávy, které odešlete na stránce Kontakt.</p>
                <div className="text-xs text-slate-400"><span className="text-amber-400 font-bold">Účel:</span> Vyřízení dotazu, reklamace nebo žádosti zákazníka.</div>
                <div className="text-xs text-slate-400"><span className="text-amber-400 font-bold">Právní základ:</span> Jednání o smlouvě, plnění smlouvy nebo oprávněný zájem na zákaznické podpoře (čl. 6 odst. 1 písm. b) a f) GDPR).</div>
                <div className="text-xs text-slate-400"><span className="text-amber-400 font-bold">Doba uchování:</span> Po dobu vyřízení požadavku, nejdéle 12 měsíců od poslední komunikace; déle pouze vyžaduje-li to právní předpis nebo ochrana právních nároků.</div>
              </div>
              <div className="border border-white/8 rounded-2xl p-5">
                <div className="font-bold text-white mb-2">Newsletter (tipy a novinky)</div>
                <p className="text-slate-400 text-xs mb-2">
                  Pouze pokud se v patičce webu výslovně přihlásíte, zaškrtnete souhlas a následně odběr potvrdíte odkazem zaslaným na uvedený e-mail (double opt-in).
                </p>
                <div className="text-xs text-slate-400"><span className="text-amber-400 font-bold">Účel:</span> Zasílání praktických tipů k dokumentům a informací o službě SmlouvaHned.</div>
                <div className="text-xs text-slate-400"><span className="text-amber-400 font-bold">Právní základ:</span> Souhlas (čl. 6 odst. 1 písm. a) GDPR).</div>
                <div className="text-xs text-slate-400"><span className="text-amber-400 font-bold">Doba uchování:</span> Do odvolání souhlasu nebo odhlášení z odběru (odkaz v každém e-mailu).</div>
              </div>
              <div className="border border-white/8 rounded-2xl p-5">
                <div className="font-bold text-white mb-2">Moje zakázka (pokračování případu)</div>
                <p className="text-slate-400 text-xs mb-2">
                  Pouze pokud po zaplacení smlouvy o dílo zvolíte „Pokračovat jako zakázka“. Zakázka obsahuje váš e-mail z objednávky, název zakázky, vaši roli (objednatel/zhotovitel), termín, cenu a cenový režim ze smlouvy, fázi, úkoly, poznámky, historii a údaje, které doplníte do navazujících dokumentů (např. jména stran, popis vad). Obsah smlouvy ani kontaktní údaje protistrany se do zakázky nekopírují.
                </p>
                <div className="text-xs text-slate-400"><span className="text-amber-400 font-bold">Účel:</span> Vedení průběhu zakázky, zasílání návratových odkazů a funkčních připomínek termínu (jen pokud je zapnete), tvorba navazujících dokumentů.</div>
                <div className="text-xs text-slate-400"><span className="text-amber-400 font-bold">Právní základ:</span> Plnění smlouvy (čl. 6 odst. 1 písm. b) GDPR); připomínky jsou funkční upozornění k vaší zakázce, nikoli obchodní sdělení.</div>
                <div className="text-xs text-slate-400"><span className="text-amber-400 font-bold">Doba uchování:</span> 12 měsíců od poslední změny zakázky; zakázka označená jako uzavřená 6 měsíců od uzavření (pevný termín, který další úpravy neprodlužují); rozpracovaný navazující dokument, který nebyl zaplacen, 30 dní od vytvoření — poté se už nezobrazuje a nejpozději následující den jej odstraní automatický denní úklid. Do zakázky se neukládá obsah smlouvy ani identifikátor platby; z navazujících dokumentů se uchovává jen to, co do nich sami zapíšete. Zakázku můžete kdykoli exportovat (JSON) nebo smazat přímo ve svém přehledu; návratové odkazy (platnost 30 dní) můžete kdykoli zneplatnit.</div>
              </div>
              <div className="border border-white/8 rounded-2xl p-5">
                <div className="font-bold text-white mb-2">Poptávka navazující služby (commercial intent)</div>
                <p className="text-slate-400 text-xs mb-2">
                  Pouze pokud výslovně požádáte o kontakt konkrétním partnerem: kategorie služby, stručný popis, naléhavost, cenové pásmo, kraj a kontaktní údaje, které sami zvolíte ke sdílení. K poptávce se ukládá záznam souhlasu (partner, účel, sdílená pole, verze textu, čas udělení a odvolání).
                </p>
                <div className="text-xs text-slate-400"><span className="text-amber-400 font-bold">Účel:</span> Předání vaší poptávky vámi zvolenému partnerovi. Bez připraveného partnera zůstává poptávka uložená a nikam se nepředává.</div>
                <div className="text-xs text-slate-400"><span className="text-amber-400 font-bold">Právní základ:</span> Souhlas (čl. 6 odst. 1 písm. a) GDPR) udělený konkrétně pro daného partnera; lze kdykoli odvolat.</div>
                <div className="text-xs text-slate-400"><span className="text-amber-400 font-bold">Doba uchování:</span> 6 měsíců od vytvoření, poté automatický výmaz. Po odvolání souhlasu se kontaktní údaje z poptávky odstraní ihned.</div>
                <div className="text-xs text-slate-400 mt-2">Tato funkce je v současnosti neaktivní; zapne se až se schváleným partnerem a jeho vlastním textem souhlasu.</div>
              </div>
              <div className="border border-white/8 rounded-2xl p-5">
                <div className="font-bold text-white mb-2">Bezplatné nástroje (checklisty, průvodci)</div>
                <p className="text-slate-400 text-xs mb-2">Stav checklistu se ukládá pouze ve vašem prohlížeči (localStorage). Na server se neodesílá žádný obsah — pouze anonymní událost „nástroj zahájen / dokončen“, a to jen se souhlasem s produktovou analytikou.</p>
              </div>
              <div className="border border-white/8 rounded-2xl p-5">
                <div className="font-bold text-white mb-2">Platební údaje</div>
                <p className="text-slate-400 text-xs mb-2">Čísla platebních karet a bankovní údaje jsou zpracovávány výhradně platební bránou <strong>Stripe</strong> (Stripe, Inc., USA). Správce k nim nemá přístup.</p>
                <div className="text-xs text-slate-400"><span className="text-amber-400 font-bold">Více o Stripe GDPR:</span> <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">stripe.com/privacy</a></div>
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
              <li className="flex gap-3"><span className="text-amber-400 font-bold flex-shrink-0">→</span><span><strong className="text-white">Resend</strong> — transakční e-maily, doručení odkazu k dokumentu, přenos zpráv z kontaktního formuláře a rozesílání newsletteru potvrzeným odběratelům.</span></li>
              <li className="flex gap-3"><span className="text-amber-400 font-bold flex-shrink-0">→</span><span><strong className="text-white">Upstash (Redis)</strong> — dočasná evidence nepotvrzeného newsletteru po dobu 24 hodin a evidence potvrzeného souhlasu po dobu odběru.</span></li>
              <li className="flex gap-3"><span className="text-amber-400 font-bold flex-shrink-0">→</span><span><strong className="text-white">Upstash (Redis)</strong> — údaje zakázky (Moje zakázka) po dobu 12 měsíců od poslední změny (uzavřená zakázka 6 měsíců), hash návratových tokenů a plán připomínek; poptávky navazujících služeb po dobu 6 měsíců.</span></li>
              <li className="flex gap-3"><span className="text-amber-400 font-bold flex-shrink-0">→</span><span><strong className="text-white">Stripe, Inc.</strong> — také platba za navazující dokument zakázky (99 Kč); Stripe obdrží váš e-mail a název dokumentu, nikoli jeho obsah.</span></li>
              <li className="flex gap-3"><span className="text-amber-400 font-bold flex-shrink-0">→</span><span><strong className="text-white">Vercel</strong> — hosting platformy. Údaje jsou zpracovávány v rámci EHP nebo za odpovídajících záruk.</span></li>
            </ul>
            <p className="mt-3 text-xs text-slate-400">
              Navazující partner není příjemcem obsahu smlouvy ani kontaktních údajů automaticky. Nabídka se vybírá z minimalizovaných kategorií. Teprve vědomým kliknutím uživatel přejde na web konkrétního poskytovatele; případné předání kontaktních údajů vyžaduje samostatný, konkrétní souhlas pro daného partnera.
            </p>
            <p className="mt-3 text-xs text-slate-400">
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
              identifikace konkrétní osoby). Vlastní produktové události (např. vstup do formuláře nebo klik na
              checkout) odesíláme pouze po vašem volitelném souhlasu a bez propojení s platební kartou; dokončené
              platby eviduje až server po potvrzení Stripe.
            </p>
            <p className="mt-3">
              Bez ohledu na tuto volbu může server evidovat nezbytné agregované bezpečnostní a provozní signály
              odmítnutých nebo neplatných požadavků, aby bylo možné chránit checkout a odhalit jeho výpadek. Tyto
              signály neobsahují obsah formuláře ani kontaktní údaje a nezapočítávají se jako tržba či dokončení.
            </p>
            <p className="mt-3">
              Jen po tomto souhlasu uložíme pro vyhodnocení cesty k produktu do first-party session úložiště pouze
              kategorii prvního zdroje, veřejnou cestu stránky a případně slug článku. Záznam aktivně odstraníme po
              30 minutách; starší záznam navíc při každém čtení odmítneme a smažeme. Samotná atribuce neobsahuje
              UUID uživatele, obsah formuláře, VIN, jméno, e-mail, telefon ani adresu. Pokud ale následně vytvoříte
              dokument, server připojí kopii tohoto minimalizovaného atribučního údaje k zabezpečenému záznamu
              dokumentu, a proto může být po tuto dobu spojitelný s údaji objednávky: 24 hodin u bezplatného toku,
              7–30 dní u placeného dokumentu, případně 90 dní s doplňkem archivace. Syrový reportovací buffer
              obsahuje nejvýše 5 000 událostí a dashboard pracuje s posledními 30 dny. Affiliate partnerovi atribuci
              ani údaje objednávky nepředáváme.
            </p>
            <p className="mt-3">
              Odvolání souhlasu zastaví další browserové produktové události a nové atribuce a ihned smaže atribuci
              z aktuálního panelu prohlížeče. Neodstraňuje zpětně již přijaté serverové události ani atribuci
              připojenou k dříve vytvořenému dokumentu; serverové dokončení či stažení tohoto dříve atribuovaného
              dokumentu se proto může evidovat po dobu jeho dostupnosti. U těchto záznamů můžete uplatnit svá práva
              postupem v části 5.
            </p>
            <AnalyticsConsentSettings />
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
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">SmlouvaHned © 2026</p>
            <Link href="/" className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-white text-[10px] font-black uppercase hover:bg-amber-500 hover:text-black transition">
              Zpět na úvodní stránku
            </Link>
          </section>

        </div>
      </div>
    </main>
  );
}
