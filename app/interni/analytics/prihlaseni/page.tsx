import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Přihlášení do interního reportingu',
  robots: { index: false, follow: false },
};

export default function InternalReportingLoginPage() {
  return (
    <main className="min-h-screen bg-[#05080f] px-6 py-20 text-slate-200">
      <form
        method="post"
        action="/interni/analytics/auth"
        className="mx-auto max-w-md rounded-3xl border border-white/10 bg-[#0c1426] p-8"
      >
        <h1 className="text-2xl font-black text-white">Interní reporting</h1>
        <p className="mt-3 text-sm text-slate-400">Zadejte přístupové heslo. Heslo se nepřenáší v URL.</p>
        <label htmlFor="reporting-secret" className="mt-6 block text-sm font-semibold text-slate-300">
          Přístupové heslo
        </label>
        <input
          id="reporting-secret"
          name="secret"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 w-full rounded-xl border border-white/10 bg-[#111c31] px-4 py-3 text-white outline-none focus:border-amber-400"
        />
        <button type="submit" className="mt-5 w-full rounded-xl bg-amber-500 px-5 py-3 font-black text-black hover:bg-amber-400">
          Přihlásit se
        </button>
      </form>
    </main>
  );
}
