/**
 * Klientská správa přístupového tokenu k případu.
 *
 * Token přichází ve fragmentu URL (#access=…), nikdy v query. Po načtení se
 * přesune do sessionStorage (jen tato karta) a z URL se odstraní, aby
 * neskončil v historii, refereru ani ve sdíleném odkazu. Server zůstává
 * autoritou — tento cache jen umožňuje refresh a návrat z platební brány.
 */

const STORAGE_PREFIX = 'sh_case_access:';
const ACCESS_TTL_MS = 12 * 60 * 60 * 1000;

export function resolveCaseAccessFromLocation(url: URL, caseId: string): string {
  const fromHash = new URLSearchParams(url.hash.replace(/^#/, '')).get('access')?.trim() ?? '';
  const key = `${STORAGE_PREFIX}${caseId}`;
  let token = fromHash;
  let stored = false;
  try {
    if (fromHash) {
      sessionStorage.setItem(key, JSON.stringify({ token: fromHash, expiresAt: Date.now() + ACCESS_TTL_MS }));
      stored = true;
    } else {
      const cached = JSON.parse(sessionStorage.getItem(key) || 'null') as { token?: string; expiresAt?: number } | null;
      if (cached && typeof cached.token === 'string' && typeof cached.expiresAt === 'number' && cached.expiresAt > Date.now()) {
        token = cached.token;
      } else {
        sessionStorage.removeItem(key);
      }
    }
  } catch {
    // Storage blocked — keep the capability in the fragment only.
  }
  if (fromHash) {
    url.hash = stored ? '' : `access=${encodeURIComponent(fromHash)}`;
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  }
  return token;
}

export function forgetCaseAccess(caseId: string): void {
  try {
    sessionStorage.removeItem(`${STORAGE_PREFIX}${caseId}`);
  } catch {
    // ignore
  }
}

export function rememberCaseAccess(caseId: string, token: string): void {
  try {
    sessionStorage.setItem(`${STORAGE_PREFIX}${caseId}`, JSON.stringify({ token, expiresAt: Date.now() + ACCESS_TTL_MS }));
  } catch {
    // ignore
  }
}
