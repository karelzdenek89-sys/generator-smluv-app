import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('./vercel-ignore-build.mjs', import.meta.url));
const originalEnv = {
  ...process.env,
  VERCEL_GIT_COMMIT_REF: 'feat/test',
  VERCEL_ENV: 'preview',
  VERCEL_GIT_COMMIT_SHA: 'test-commit',
  VERCEL_GIT_PREVIOUS_SHA: 'previous-commit',
};

function check(overrides, expectedCode, expectedMessage) {
  const result = spawnSync(process.execPath, [script], {
    encoding: 'utf8',
    env: { ...originalEnv, VERCEL_MANUAL_ACCEPTANCE_PREVIEW: '', ...overrides },
  });
  assert.equal(result.error, undefined);
  assert.equal(result.status, expectedCode, result.stderr);
  assert.ok(result.stdout.includes(expectedMessage), result.stdout);
}

check({}, 0, 'skip: routine branch feat/test');
check({ VERCEL_MANUAL_ACCEPTANCE_PREVIEW: '1' }, 1, 'build: explicit manual acceptance preview');
check({ VERCEL_MANUAL_ACCEPTANCE_PREVIEW: '1', VERCEL_ENV: 'production' }, 0, 'skip: routine branch feat/test');
check({ VERCEL_GIT_COMMIT_REF: 'preview-acceptance' }, 1, 'build: explicit preview lane');
console.log('Vercel manual acceptance build gate passed.');
