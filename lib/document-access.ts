// A capability stays in this tab only. Server-side authorization and expiry
// remain authoritative; this cache only supports refresh/back navigation.
const ACCESS_TTL_MS = 30 * 60 * 1000;

export function resolveDocumentAccess(url: URL, orderKey: string): string {
  const supplied = url.searchParams.get('token')?.trim()
    || new URLSearchParams(url.hash.slice(1)).get('token')?.trim()
    || '';
  if (!orderKey) return supplied;
  const key = `sh_document_access:${orderKey}`;
  let token = supplied;
  let stored = false;
  try {
    if (supplied) {
      sessionStorage.setItem(key, JSON.stringify({ token: supplied, expiresAt: Date.now() + ACCESS_TTL_MS }));
      stored = true;
    } else {
      const cached = JSON.parse(sessionStorage.getItem(key) || 'null');
      if (cached && typeof cached.token === 'string' && cached.expiresAt > Date.now()) {
        token = cached.token;
      } else {
        sessionStorage.removeItem(key);
      }
    }
  } catch {
    // If storage is blocked, retain the capability in the fragment, never query.
  }
  if (supplied) {
    url.searchParams.delete('token');
    url.hash = stored ? '' : `token=${encodeURIComponent(supplied)}`;
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  }
  return token;
}
