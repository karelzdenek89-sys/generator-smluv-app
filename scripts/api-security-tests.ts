import assert from 'node:assert/strict';
import { isBoundedJsonObject, readFirstPartyJson } from '@/lib/api-security';

function request(
  body: string,
  headers: Record<string, string> = {},
): Request {
  return new Request('https://www.smlouvahned.cz/api/test', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      host: 'www.smlouvahned.cz',
      ...headers,
    },
    body,
  });
}

async function main() {
  const valid = await readFirstPartyJson(
    request('{"event":"page_view"}', { origin: 'https://www.smlouvahned.cz' }),
    1024,
  );
  assert.equal(valid.ok, true);

  const crossOrigin = await readFirstPartyJson(
    request('{}', { origin: 'https://example.com' }),
    1024,
  );
  assert.deepEqual(crossOrigin, { ok: false, error: 'invalid_origin' });

  const crossSite = await readFirstPartyJson(
    request('{}', { 'sec-fetch-site': 'cross-site' }),
    1024,
  );
  assert.deepEqual(crossSite, { ok: false, error: 'invalid_origin' });

  const wrongContentType = await readFirstPartyJson(
    request('{}', { 'content-type': 'text/plain' }),
    1024,
  );
  assert.deepEqual(wrongContentType, { ok: false, error: 'invalid_content_type' });

  const oversized = await readFirstPartyJson(request('{"value":"12345"}'), 8);
  assert.deepEqual(oversized, { ok: false, error: 'payload_too_large' });

  const arrayBody = await readFirstPartyJson(request('[]'), 1024);
  assert.deepEqual(arrayBody, { ok: false, error: 'invalid_json' });

  const limits = {
    maxDepth: 2,
    maxNodes: 10,
    maxArrayLength: 2,
    maxStringLength: 5,
  };
  assert.equal(isBoundedJsonObject({ name: 'Karel', flags: [true, false] }, limits), true);
  assert.equal(isBoundedJsonObject({ name: 'Příliš dlouhé' }, limits), false);
  assert.equal(isBoundedJsonObject({ nested: { too: { deep: true } } }, limits), false);
  assert.equal(isBoundedJsonObject({ values: [1, 2, 3] }, limits), false);

  console.log('API security tests passed.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
