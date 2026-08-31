import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Přihlášení do interního reportingu',
  robots: { index: false, follow: false },
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function InternalReportingLoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;
  const errorMessage = error === 'rate'
    ? 'Příliš mnoho pokusů. Zkuste to znovu za 15 minut.'
    : error === 'unavailable'
      ? 'Přihlášení je dočasně nedostupné. Zkuste to prosím později.'
      : error
        ? 'E-mail nebo heslo není správné.'
        : '';

  return (
    <main className="min-h-screen bg-[#05080f] px-6 py-20 text-slate-200">
      <form
        method="post"
        action="/interni/analytics/auth"
        className="mx-auto max-w-md rounded-3xl border border-white/10 bg-[#0c1426] p-8"
      >
        <h1 className="text-2xl font-black text-white">Interní reporting</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Přístup je omezený na schválený administrátorský e-mail a heslo. Údaje se nepřenášejí v URL.
        </p>
        <label htmlFor="reporting-email" className="mt-6 block text-sm font-semibold text-slate-300">
          Administrátorský e-mail
        </label>
        <input
          id="reporting-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="mt-2 w-full rounded-xl border border-white/10 bg-[#111c31] px-4 py-3 text-base text-white outline-none focus:border-amber-400"
        />
        <label htmlFor="reporting-secret" className="mt-4 block text-sm font-semibold text-slate-300">
          Přístupové heslo
        </label>
        <input
          id="reporting-secret"
          name="secret"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 w-full rounded-xl border border-white/10 bg-[#111c31] px-4 py-3 text-base text-white outline-none focus:border-amber-400"
        />
        {errorMessage ? (
          <p role="alert" className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            {errorMessage}
          </p>
        ) : null}
        <button type="submit" className="mt-5 w-full rounded-xl bg-amber-500 px-5 py-3 font-black text-black hover:bg-amber-400">
          Přihlásit se
        </button>
      </form>
    </main>
  );
}
