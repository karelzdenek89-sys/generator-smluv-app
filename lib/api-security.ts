export type JsonObject = Record<string, unknown>;

type JsonReadError = 'invalid_origin' | 'invalid_content_type' | 'payload_too_large' | 'invalid_json';

export type JsonReadResult =
  | { ok: true; data: JsonObject }
  | { ok: false; error: JsonReadError };

function requestHost(req: Request): string {
  const forwardedHost = req.headers.get('x-forwarded-host')?.split(',')[0]?.trim();
  return (forwardedHost || req.headers.get('host') || new URL(req.url).host).toLowerCase();
}

function hasValidBrowserOrigin(req: Request): boolean {
  if (req.headers.get('sec-fetch-site') === 'cross-site') return false;

  const origin = req.headers.get('origin');
  if (!origin) return true;

  try {
    return new URL(origin).host.toLowerCase() === requestHost(req);
  } catch {
    return false;
  }
}

export async function readFirstPartyJson(
  req: Request,
  maxBytes: number,
): Promise<JsonReadResult> {
  if (!hasValidBrowserOrigin(req)) {
    return { ok: false, error: 'invalid_origin' };
  }

  const contentType = req.headers.get('content-type')?.toLowerCase() ?? '';
  if (!contentType.startsWith('application/json')) {
    return { ok: false, error: 'invalid_content_type' };
  }

  const contentLength = Number(req.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    return { ok: false, error: 'payload_too_large' };
  }

  let text: string;
  try {
    text = await req.text();
  } catch {
    return { ok: false, error: 'invalid_json' };
  }

  if (new TextEncoder().encode(text).byteLength > maxBytes) {
    return { ok: false, error: 'payload_too_large' };
  }

  try {
    const data = JSON.parse(text) as unknown;
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return { ok: false, error: 'invalid_json' };
    }
    return { ok: true, data: data as JsonObject };
  } catch {
    return { ok: false, error: 'invalid_json' };
  }
}

export function isBoundedJsonObject(
  value: JsonObject,
  options: {
    maxDepth: number;
    maxNodes: number;
    maxArrayLength: number;
    maxStringLength: number;
  },
): boolean {
  let nodes = 0;

  const visit = (current: unknown, depth: number): boolean => {
    nodes += 1;
    if (nodes > options.maxNodes || depth > options.maxDepth) return false;

    if (current === null || typeof current === 'boolean') return true;
    if (typeof current === 'string') return current.length <= options.maxStringLength;
    if (typeof current === 'number') return Number.isFinite(current);

    if (Array.isArray(current)) {
      return current.length <= options.maxArrayLength && current.every((item) => visit(item, depth + 1));
    }

    if (typeof current !== 'object') return false;

    return Object.entries(current).every(
      ([key, item]) =>
        key !== '__proto__' &&
        key !== 'prototype' &&
        key !== 'constructor' &&
        key.length <= 100 &&
        visit(item, depth + 1),
    );
  };

  return visit(value, 0);
}

export function getClientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}
