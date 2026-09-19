'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, type FormEvent } from 'react';

type User = {
  id: string;
  username: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string | null;
};

type Mode = 'login' | 'register' | 'forgot' | 'reset';
type ApiResult = {
  ok?: boolean;
  authenticated?: boolean;
  user?: User;
  csrf?: string | null;
  error?: string;
  message?: string;
  emailSent?: boolean;
  alreadyVerified?: boolean;
  available?: boolean;
  url?: string;
  fallback?: string;
};

export default function AccountHub() {
  const [user, setUser] = useState<User | null>(null);
  const [csrf, setCsrf] = useState('');
  const [mode, setMode] = useState<Mode>('login');
  const [resetToken, setResetToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [login, setLogin] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [register, setRegister] = useState({ username: '', email: '', displayName: '', password: '', acceptTerms: false });
  const [forgotLogin, setForgotLogin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profile, setProfile] = useState({ username: '', displayName: '', currentPassword: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [deletePassword, setDeletePassword] = useState('');

  const initials = useMemo(() => {
    const source = user?.displayName || user?.username || 'U';
    return source.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'U';
  }, [user]);

  const api = async (action: string, payload: Record<string, unknown> = {}, csrfToken = csrf): Promise<ApiResult> => {
    const response = await fetch('/api/account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}) },
      cache: 'no-store',
      body: JSON.stringify({ action, ...payload }),
    });
    const body = await response.json().catch(() => ({})) as ApiResult;
    if (!response.ok) throw new Error(body.error ?? 'Požadavek se nepodařilo dokončit.');
    return body;
  };

  const applySession = (body: ApiResult) => {
    if (body.user) {
      setUser(body.user);
      setProfile({ username: body.user.username, displayName: body.user.displayName, currentPassword: '' });
    }
    if (typeof body.csrf === 'string') setCsrf(body.csrf);
  };

  const loadSession = async () => {
    try {
      const response = await fetch('/api/account', { cache: 'no-store' });
      const body = await response.json().catch(() => ({})) as ApiResult;
      if (response.ok && body.authenticated && body.user) applySession(body);
      else setUser(null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const requestedMode = query.get('mode');
    if (requestedMode === 'register' || requestedMode === 'forgot' || requestedMode === 'login' || requestedMode === 'reset') setMode(requestedMode);

    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const verify = hash.get('verify');
    const reset = hash.get('reset');
    if (reset) {
      setResetToken(reset);
      setMode('reset');
      // Keep the token in the fragment until it is consumed, so refresh works.
      // Fragments are never included in HTTP requests or referrer headers.
    }
    if (verify) {
      setBusy('verify');
      void api('verify_email', { token: verify }, '')
        .then((body) => {
          applySession(body);
          setMessage('E-mail byl ověřen. Účet je teď propojen s dokumenty a případy vedenými pod touto adresou.');
          window.history.replaceState(window.history.state, '', '/moje?verified=1');
        })
        .catch((reason) => setError(reason instanceof Error ? reason.message : 'Ověření se nepodařilo.'))
        .finally(() => { setBusy(''); setLoading(false); });
    } else {
      void loadSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = (name: string) => { setBusy(name); setMessage(''); setError(''); };
  const end = () => setBusy('');

  const submitLogin = async (event: FormEvent) => {
    event.preventDefault(); start('login');
    try {
      const body = await api('login', { login, password: loginPassword }, '');
      applySession(body); setLoginPassword(''); setMessage('Jste přihlášeni.');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Přihlášení se nezdařilo.'); }
    finally { end(); }
  };

  const submitRegister = async (event: FormEvent) => {
    event.preventDefault(); start('register');
    try {
      const body = await api('register', register, '');
      applySession(body);
      setMessage(body.emailSent === false ? 'Účet byl vytvořen. Ověřovací e-mail se nyní nepodařilo doručit; můžete jej z profilu odeslat znovu.' : 'Účet byl vytvořen. Pro propojení dokumentů a případů potvrďte e-mail.');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Registrace se nezdařila.'); }
    finally { end(); }
  };

  const submitForgot = async (event: FormEvent) => {
    event.preventDefault(); start('forgot');
    try {
      const body = await api('forgot_password', { login: forgotLogin }, '');
      setMessage(body.message ?? 'Pokud účet existuje, odeslali jsme odkaz pro nastavení nového hesla.');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Požadavek se nezdařil.'); }
    finally { end(); }
  };

  const submitReset = async (event: FormEvent) => {
    event.preventDefault(); start('reset');
    try {
      const body = await api('reset_password', { token: resetToken, password: newPassword }, '');
      applySession(body); setNewPassword(''); setResetToken(''); setMode('login'); setMessage('Heslo bylo změněno a jste přihlášeni.');
      window.history.replaceState(window.history.state, '', '/moje');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Heslo se nepodařilo změnit.'); }
    finally { end(); }
  };

  const openPortal = async (target: 'documents' | 'cases') => {
    start(target);
    try {
      const body = await api('portal_link', { target });
      if (body.available && body.url) { window.location.assign(body.url); return; }
      setMessage(target === 'documents'
        ? 'Pod ověřeným e-mailem teď není dostupný placený dokument. Otevřu standardní obnovu přístupu.'
        : 'Pod ověřeným e-mailem teď není uložený případ. Otevřu standardní přehled případů.');
      if (body.fallback) window.setTimeout(() => window.location.assign(body.fallback!), 700);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Přístup se nepodařilo připravit.'); }
    finally { end(); }
  };

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault(); start('profile');
    try {
      const body = await api('profile', profile); applySession(body);
      setProfile((current) => ({ ...current, currentPassword: '' })); setMessage('Profil byl uložen.');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Profil se nepodařilo uložit.'); }
    finally { end(); }
  };

  const changePassword = async (event: FormEvent) => {
    event.preventDefault(); start('password');
    try {
      const body = await api('change_password', passwords); applySession(body);
      setPasswords({ currentPassword: '', newPassword: '' });
      setMessage('Heslo bylo změněno. Ostatní přihlášené relace byly ukončeny.');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Heslo se nepodařilo změnit.'); }
    finally { end(); }
  };

  const resend = async () => {
    start('resend');
    try {
      const body = await api('resend_verification');
      setMessage(body.alreadyVerified ? 'E-mail už je ověřený.' : body.emailSent === false ? 'Ověřovací e-mail se nyní nepodařilo doručit. Zkuste to později.' : 'Ověřovací e-mail jsme odeslali znovu.');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Ověřovací e-mail se nepodařilo odeslat.'); }
    finally { end(); }
  };

  const logout = async () => {
    start('logout');
    try { await api('logout'); setUser(null); setCsrf(''); setMode('login'); setMessage('Byli jste odhlášeni.'); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Odhlášení se nezdařilo.'); }
    finally { end(); }
  };

  const logoutEverywhere = async () => {
    start('logout-all');
    try {
      await api('logout_all');
      setUser(null); setCsrf(''); setMode('login');
      setMessage('Všechna přihlášená zařízení byla odhlášena.');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Relace se nepodařilo ukončit.'); }
    finally { end(); }
  };

  const removeAccount = async (event: FormEvent) => {
    event.preventDefault();
    if (!window.confirm('Opravdu chcete smazat účet? Zakoupené dokumenty a uložené případy mají vlastní retenční režim a nesmažou se automaticky spolu s účtem.')) return;
    start('delete');
    try {
      await api('delete_account', { password: deletePassword });
      setUser(null); setCsrf(''); setDeletePassword(''); setMode('login');
      setMessage('Účet byl smazán. Dokumenty a případy zůstávají dostupné původními bezpečnými odkazy po dobu jejich vlastní retence.');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Účet se nepodařilo smazat.'); }
    finally { end(); }
  };

  if (loading) return <main className="site-page min-h-screen"><div className="mx-auto max-w-5xl px-6 py-16"><div className="site-content-card rounded-2xl p-8"><div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#c9a852] border-t-transparent" aria-label="Načítání" /></div></div></main>;

  return (
    <main className="site-page min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <nav className="mb-7 text-xs text-slate-400"><Link href="/" className="hover:text-white">SmlouvaHned</Link><span className="mx-2">›</span><span>Můj účet</span></nav>
        <header className="mb-8">
          <p className="site-kicker mb-3">Soukromá zákaznická zóna</p>
          <h1 className="site-heading-xl">Můj účet</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">Účet je dobrovolný. Nákup ani stažení dokumentu jej nevyžaduje. Po ověření e-mailu propojí přístup k dokumentům a případům vedeným pod stejnou adresou.</p>
        </header>

        {message ? <div role="status" className="mb-5 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] p-4 text-sm leading-6 text-emerald-100">{message}</div> : null}
        {error ? <div role="alert" className="mb-5 rounded-xl border border-red-500/25 bg-red-500/[0.06] p-4 text-sm leading-6 text-red-200">{error}</div> : null}

        {!user || mode === 'reset' ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,.95fr)_minmax(300px,.65fr)]">
            <section className="site-content-card rounded-3xl p-6 md:p-8">
              <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Přístup k účtu">
                {([['login','Přihlášení'],['register','Registrace'],['forgot','Zapomenuté heslo']] as const).map(([key,label]) => (
                  <button key={key} type="button" onClick={() => { setMode(key); setError(''); setMessage(''); }} className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${mode === key ? 'border-[#c9a852]/55 bg-[#c9a852]/10 text-[#e8d092]' : 'border-white/10 text-slate-400 hover:text-white'}`}>{label}</button>
                ))}
              </div>

              {mode === 'login' ? <form onSubmit={submitLogin} className="space-y-4">
                <div><label htmlFor="login-id" className="site-form-label">Uživatelské jméno nebo e-mail</label><input id="login-id" className="site-input" autoComplete="username" value={login} onChange={(e) => setLogin(e.target.value)} required /></div>
                <div><label htmlFor="login-password" className="site-form-label">Heslo</label><input id="login-password" type="password" className="site-input" autoComplete="current-password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required /></div>
                <button type="submit" disabled={busy === 'login'} className="site-button-primary w-full">{busy === 'login' ? 'Přihlašuji…' : 'Přihlásit se'}</button>
              </form> : null}

              {mode === 'register' ? <form onSubmit={submitRegister} className="space-y-4">
                <div><label htmlFor="register-username" className="site-form-label">Uživatelské jméno</label><input id="register-username" className="site-input" autoComplete="username" value={register.username} onChange={(e) => setRegister((c) => ({...c, username:e.target.value}))} required minLength={3} maxLength={32} /><p className="mt-1 text-xs text-slate-500">3–32 znaků; písmena, čísla, tečka, pomlčka nebo podtržítko.</p></div>
                <div><label htmlFor="register-email" className="site-form-label">E-mail</label><input id="register-email" type="email" className="site-input" autoComplete="email" value={register.email} onChange={(e) => setRegister((c) => ({...c, email:e.target.value}))} required /></div>
                <div><label htmlFor="register-name" className="site-form-label">Zobrazované jméno <span className="normal-case tracking-normal text-slate-500">(volitelné)</span></label><input id="register-name" className="site-input" autoComplete="name" value={register.displayName} onChange={(e) => setRegister((c) => ({...c, displayName:e.target.value}))} maxLength={80} /></div>
                <div><label htmlFor="register-password" className="site-form-label">Heslo</label><input id="register-password" type="password" className="site-input" autoComplete="new-password" value={register.password} onChange={(e) => setRegister((c) => ({...c, password:e.target.value}))} required minLength={10} maxLength={128} /><p className="mt-1 text-xs text-slate-500">Alespoň 10 znaků. Použijte heslo, které nepoužíváte u jiné služby.</p></div>
                <label className="flex items-start gap-3 text-xs leading-6 text-slate-400"><input type="checkbox" checked={register.acceptTerms} onChange={(e) => setRegister((c) => ({...c, acceptTerms:e.target.checked}))} className="mt-1 h-4 w-4 accent-[#c9a852]" required /><span>Potvrzuji, že jsem se seznámil(a) s <Link href="/obchodni-podminky" className="text-[#e8d092] underline">obchodními podmínkami</Link> a <Link href="/gdpr" className="text-[#e8d092] underline">zásadami ochrany osobních údajů</Link>. Nejde o souhlas s marketingem.</span></label>
                <button type="submit" disabled={busy === 'register'} className="site-button-primary w-full">{busy === 'register' ? 'Vytvářím účet…' : 'Vytvořit účet'}</button>
              </form> : null}

              {mode === 'forgot' ? <form onSubmit={submitForgot} className="space-y-4">
                <p className="text-sm leading-7 text-slate-400">Zadejte uživatelské jméno nebo e-mail. Pokud účet existuje, pošleme jednorázový odkaz platný 60 minut.</p>
                <div><label htmlFor="forgot-login" className="site-form-label">Uživatelské jméno nebo e-mail</label><input id="forgot-login" className="site-input" autoComplete="username" value={forgotLogin} onChange={(e) => setForgotLogin(e.target.value)} required /></div>
                <button type="submit" disabled={busy === 'forgot'} className="site-button-primary w-full">{busy === 'forgot' ? 'Odesílám…' : 'Poslat odkaz pro nové heslo'}</button>
              </form> : null}

              {mode === 'reset' ? <form onSubmit={submitReset} className="space-y-4">
                <p className="text-sm leading-7 text-slate-400">Nastavte nové heslo. Po úspěšné změně budou staré relace zneplatněny.</p>
                <div><label htmlFor="reset-password" className="site-form-label">Nové heslo</label><input id="reset-password" type="password" className="site-input" autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={10} maxLength={128} /></div>
                <button type="submit" disabled={busy === 'reset' || !resetToken} className="site-button-primary w-full">{busy === 'reset' ? 'Měním heslo…' : 'Nastavit nové heslo'}</button>
                {!resetToken ? <p className="text-xs text-red-300">Odkaz pro změnu hesla chybí nebo byl z adresy odstraněn. Vyžádejte si nový.</p> : null}
              </form> : null}
            </section>

            <aside className="site-content-card rounded-3xl p-6">
              <p className="site-kicker mb-2">Bez účtu to dál funguje</p>
              <h2 className="site-heading-md">Stávající bezpečné odkazy zůstávají</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">Nechcete účet? Zakoupené dokumenty a případy můžete dál otevírat přes bezpečné odkazy zasílané na e-mail z objednávky. Odkazy fungují po dobu své platnosti; nikomu je nepřeposílejte.</p>
              <div className="mt-5 grid gap-3"><Link href="/zakaznicka-zona" className="site-button-secondary justify-center">Moje dokumenty</Link><Link href="/moje-pripady" className="site-button-secondary justify-center">Moje případy</Link></div>
            </aside>
          </div>
        ) : (
          <div className="space-y-6">
            <section className="site-content-card rounded-3xl p-6 md:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#c9a852]/30 bg-[#c9a852]/10 font-serif text-xl font-semibold text-[#e8d092]">{initials}</div><div><p className="text-xs text-slate-500">@{user.username}</p><h2 className="mt-1 text-xl font-semibold text-white">{user.displayName || 'Zákaznický účet'}</h2><p className="mt-1 text-sm text-slate-400">{user.email}</p></div></div>
                <div className="flex flex-wrap items-center gap-2"><span className={`rounded-full border px-3 py-1 text-xs font-semibold ${user.emailVerified ? 'border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-300' : 'border-amber-500/30 bg-amber-500/[0.06] text-amber-300'}`}>{user.emailVerified ? 'E-mail ověřen' : 'E-mail čeká na ověření'}</span><button type="button" onClick={() => void logout()} disabled={busy === 'logout'} className="site-button-secondary">Odhlásit se</button></div>
              </div>
              {!user.emailVerified ? <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] p-5"><h3 className="font-semibold text-white">Ověřte e-mail pro propojení dat</h3><p className="mt-2 text-sm leading-6 text-slate-400">Bez ověření e-mailu účet nezpřístupní dokumenty ani případy. Tím bráníme tomu, aby někdo připojil cizí objednávky pouze znalostí adresy.</p><button type="button" onClick={() => void resend()} disabled={busy === 'resend'} className="site-button-secondary mt-4">{busy === 'resend' ? 'Odesílám…' : 'Poslat ověřovací e-mail znovu'}</button></div> : null}
            </section>

            <section className="grid gap-4 md:grid-cols-2" aria-label="Zákaznické služby">
              <article className="site-content-card rounded-3xl p-6"><p className="site-kicker mb-2">Zakoupené výstupy</p><h2 className="site-heading-md">Moje dokumenty</h2><p className="mt-3 text-sm leading-7 text-slate-400">Otevřete dokumenty, které jsou ještě dostupné v online archivu. Ověřený účet připraví bezpečný přístup bez dalšího e-mailu.</p><button type="button" disabled={!user.emailVerified || busy === 'documents'} onClick={() => void openPortal('documents')} className="site-button-primary mt-5 w-full disabled:opacity-50">{busy === 'documents' ? 'Připravuji…' : 'Otevřít Moje dokumenty'}</button></article>
              <article className="site-content-card rounded-3xl p-6"><p className="site-kicker mb-2">Termíny a další kroky</p><h2 className="site-heading-md">Moje případy</h2><p className="mt-3 text-sm leading-7 text-slate-400">Pronájem, převod vozidla a zakázka na jednom místě: stav, termín, checklist a připomínky podle typu případu.</p><button type="button" disabled={!user.emailVerified || busy === 'cases'} onClick={() => void openPortal('cases')} className="site-button-primary mt-5 w-full disabled:opacity-50">{busy === 'cases' ? 'Připravuji…' : 'Otevřít Moje případy'}</button></article>
            </section>

            <section id="profil" className="grid gap-6 lg:grid-cols-2">
              <form onSubmit={saveProfile} className="site-content-card rounded-3xl p-6">
                <p className="site-kicker mb-2">Profil</p><h2 className="site-heading-md">Údaje účtu</h2>
                <div className="mt-5 space-y-4">
                  <div><label htmlFor="profile-username" className="site-form-label">Uživatelské jméno</label><input id="profile-username" className="site-input" value={profile.username} onChange={(e) => setProfile((c) => ({...c,username:e.target.value}))} minLength={3} maxLength={32} /></div>
                  <div><label htmlFor="profile-name" className="site-form-label">Zobrazované jméno</label><input id="profile-name" className="site-input" value={profile.displayName} onChange={(e) => setProfile((c) => ({...c,displayName:e.target.value}))} maxLength={80} /></div>
                  <div><label htmlFor="profile-email" className="site-form-label">Ověřený e-mail pro propojení</label><input id="profile-email" className="site-input opacity-70" value={user.email} readOnly /><p className="mt-1 text-xs text-slate-500">E-mail je vazba na objednávky a případy. Z bezpečnostních důvodů jej v samoobsluze neměníme; změnu vyřeší podpora po ověření identity.</p></div>
                  {profile.username.trim().toLowerCase() !== user.username.trim().toLowerCase() ? <div><label htmlFor="profile-password" className="site-form-label">Aktuální heslo pro změnu uživatelského jména</label><input id="profile-password" type="password" className="site-input" autoComplete="current-password" value={profile.currentPassword} onChange={(e) => setProfile((c) => ({...c,currentPassword:e.target.value}))} required /></div> : null}
                  <button type="submit" disabled={busy === 'profile'} className="site-button-secondary w-full justify-center">{busy === 'profile' ? 'Ukládám…' : 'Uložit profil'}</button>
                </div>
              </form>
              <form onSubmit={changePassword} className="site-content-card rounded-3xl p-6">
                <p className="site-kicker mb-2">Zabezpečení</p><h2 className="site-heading-md">Změnit heslo</h2><p className="mt-2 text-xs leading-6 text-slate-500">Po změně hesla ukončíme všechny ostatní relace a vytvoříme novou relaci pro tento prohlížeč.</p>
                <div className="mt-5 space-y-4"><div><label htmlFor="current-password" className="site-form-label">Aktuální heslo</label><input id="current-password" type="password" className="site-input" autoComplete="current-password" value={passwords.currentPassword} onChange={(e) => setPasswords((c) => ({...c,currentPassword:e.target.value}))} required /></div><div><label htmlFor="new-password" className="site-form-label">Nové heslo</label><input id="new-password" type="password" className="site-input" autoComplete="new-password" value={passwords.newPassword} onChange={(e) => setPasswords((c) => ({...c,newPassword:e.target.value}))} required minLength={10} maxLength={128} /></div><button type="submit" disabled={busy === 'password'} className="site-button-secondary w-full justify-center">{busy === 'password' ? 'Měním…' : 'Změnit heslo'}</button>
                  <button type="button" disabled={busy === 'logout-all'} onClick={() => void logoutEverywhere()} className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:text-white">{busy === 'logout-all' ? 'Ukončuji relace…' : 'Odhlásit všechna zařízení'}</button>
                </div>
              </form>
            </section>

            <section className="site-content-card rounded-3xl p-6"><p className="site-kicker mb-2">Soukromí a data</p><h2 className="site-heading-md">Smazání účtu</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">Smazáním účtu odstraníme profil, přihlašovací údaje, ověřovací/resetovací tokeny a relace. Zakoupené dokumenty a případy jsou samostatné záznamy s vlastní retenční dobou; účet je nemaže automaticky, aby nedošlo k nechtěné ztrátě zaplaceného obsahu nebo evidence případu.</p><form onSubmit={removeAccount} className="mt-5 flex flex-col gap-3 sm:max-w-lg sm:flex-row"><input type="password" className="site-input flex-1" autoComplete="current-password" placeholder="Potvrďte heslem" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} required /><button type="submit" disabled={busy === 'delete'} className="rounded-xl border border-red-500/30 px-5 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-500/10">{busy === 'delete' ? 'Mažu…' : 'Smazat účet'}</button></form></section>
          </div>
        )}
      </div>
    </main>
  );
}
