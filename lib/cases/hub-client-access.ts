const HUB_STORAGE_KEY = 'sh_case_hub_access';
const ACCESS_TTL_MS = 12 * 60 * 60 * 1000;

/**
 * Stejný princip jako case client-access: tajný token přichází ve fragmentu,
 * po načtení se uloží jen do sessionStorage a z adresy se odstraní.
 */
export function resolveCaseHubAccessFromLocation(url: URL): string {
  const fromHash = new URLSearchParams(url.hash.replace(/^#/, '')).get('access')?.trim() ?? '';
  let token = fromHash;
  let stored = false;
  try {
    if (fromHash) {
      sessionStorage.setItem(HUB_STORAGE_KEY, JSON.stringify({ token: fromHash, expiresAt: Date.now() + ACCESS_TTL_MS }));
      stored = true;
    } else {
      const cached = JSON.parse(sessionStorage.getItem(HUB_STORAGE_KEY) || 'null') as { token?: string; expiresAt?: number } | null;
      if (cached && typeof cached.token === 'string' && typeof cached.expiresAt === 'number' && cached.expiresAt > Date.now()) token = cached.token;
      else sessionStorage.removeItem(HUB_STORAGE_KEY);
    }
  } catch {
    // Storage může být blokované; capability v takovém případě zůstává ve fragmentu.
  }
  if (fromHash) {
    url.hash = stored ? '' : `access=${encodeURIComponent(fromHash)}`;
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  }
  return token;
}

export function forgetCaseHubAccess(): void {
  try { sessionStorage.removeItem(HUB_STORAGE_KEY); } catch { /* ignore */ }
}
