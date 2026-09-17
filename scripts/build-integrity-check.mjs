import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Ověří, že zkompilované CSS v .next odpovídá zdrojovému app/globals.css.
 *
 * Preview build cb568cb (2026-09-17) na Vercelu obnovil Turbopack FS cache
 * z předchozího deploymentu a vydal CSS bez commitnutých pravidel. Kontrola
 * čte revizi `--sh-css-revision` ze zdroje a hledá ji ve všech CSS chuncích;
 * chybí-li, build selže dřív, než se zastaralé assety dostanou do produkce.
 *
 * Běží jako součást `vercel.json` buildCommand i lokálního test:pre-deploy.
 * Záměrně bez závislostí (žádné tsx), aby fungovala v každém prostředí.
 */

const root = process.cwd();
const source = readFileSync(join(root, 'app/globals.css'), 'utf8');
const match = source.match(/--sh-css-revision:\s*([A-Za-z0-9_-]+)\s*;/);
if (!match) {
  console.error('[build-integrity] app/globals.css must declare --sh-css-revision');
  process.exit(1);
}
const revision = match[1];

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : path.endsWith('.css') ? [path] : [];
  });
}

const cssFiles = walk(join(root, '.next/static'));
if (cssFiles.length === 0) {
  console.error('[build-integrity] no compiled CSS found under .next/static — run next build first');
  process.exit(1);
}
const marker = new RegExp(`--sh-css-revision:\\s*${revision}\\b`);
const hit = cssFiles.find((file) => marker.test(readFileSync(file, 'utf8')));
if (!hit) {
  console.error(
    `[build-integrity] compiled CSS does not contain --sh-css-revision:${revision}; ` +
      'the build served stale assets from cache. Refusing to ship.',
  );
  process.exit(1);
}
console.log(`[build-integrity] compiled CSS carries revision ${revision} (${cssFiles.length} chunk(s) checked).`);
