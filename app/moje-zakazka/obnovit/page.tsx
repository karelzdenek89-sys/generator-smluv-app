import type { Metadata } from 'next';
import Link from 'next/link';
import RequestCaseLinkForm from './RequestCaseLinkForm';

export const metadata: Metadata = {
  title: 'Návratový odkaz k zakázce',
  description: 'Nechte si poslat návratový odkaz ke své zakázce e-mailem. Bez hesla, bez registrace.',
  robots: { index: false, follow: true },
};

export default function RequestCaseLinkPage() {
  return (
    <main className="site-page">
      <div className="mx-auto max-w-xl px-6 py-16">
        <nav className="mb-6 text-xs text-slate-500" aria-label="Drobečková navigace">
          <Link href="/" className="transition hover:text-slate-300">SmlouvaHned</Link>
          <span className="mx-2 text-slate-700">›</span>
          <Link href="/zakazka" className="transition hover:text-slate-300">Řeším zakázku</Link>
          <span className="mx-2 text-slate-700">›</span>
          <span className="text-slate-400">Návratový odkaz</span>
        </nav>
        <p className="site-kicker mb-3">Moje zakázka</p>
        <h1 className="font-serif italic text-3xl font-bold text-white md:text-4xl">Poslat návratový odkaz</h1>
        <p className="mt-4 text-sm leading-7 text-slate-400">
          Zadejte e-mail, na který přišlo potvrzení objednávky. Pokud k němu vedeme zakázky, pošleme vám odkazy ke všem.
          Odkaz platí 30 dní a je určený jen vám.
        </p>
        <RequestCaseLinkForm />
        <p className="mt-8 text-xs leading-6 text-slate-500">
          Zakázku zatím nemáte? Založíte ji po zaplacení smlouvy o dílo — <Link href="/zakazka" className="text-[#e2c77b] underline underline-offset-2">jak to funguje</Link>.
        </p>
      </div>
    </main>
  );
}
