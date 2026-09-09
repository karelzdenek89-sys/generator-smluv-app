import { execFileSync } from 'node:child_process';

const ref = process.env.VERCEL_GIT_COMMIT_REF ?? '';
const currentSha = process.env.VERCEL_GIT_COMMIT_SHA ?? '';
const previousSha = process.env.VERCEL_GIT_PREVIOUS_SHA ?? '';

const build = (reason) => {
  console.log(`[vercel-ignore] build: ${reason}`);
  process.exit(1);
};
const ignore = (reason) => {
  console.log(`[vercel-ignore] skip: ${reason}`);
  process.exit(0);
};

if (!ref) build('missing branch ref');
if (ref !== 'main' && !ref.startsWith('preview-')) ignore(`routine branch ${ref}`);
if (ref.startsWith('preview-')) build('explicit preview lane');
if (!previousSha || !currentSha || previousSha === currentSha) build('no safe diff base');

try {
  const changed = execFileSync('git', ['diff', '--name-only', previousSha, currentSha], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim().split(/\r?\n/).filter(Boolean);

  if (changed.length === 0) ignore('no file changes');
  const nonRuntimeOnly = changed.every(
    (path) => path.startsWith('.github/') || (!path.includes('/') && path.toLowerCase().endsWith('.md')),
  );
  if (nonRuntimeOnly) ignore(`non-runtime-only change (${changed.length} file(s))`);
  build(`runtime-affecting change (${changed.length} file(s))`);
} catch (error) {
  console.warn(`[vercel-ignore] diff check failed; building fail-safe: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
