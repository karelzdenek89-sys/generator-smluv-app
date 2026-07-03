/**
 * Ping search engines with sitemap URL after deploy (optional CI step).
 * Usage: npx tsx scripts/ping-sitemap-indexing.ts
 */
const SITEMAP = 'https://www.smlouvahned.cz/sitemap.xml';

const PING_URLS = [
  `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP)}`,
  `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP)}`,
];

async function main() {
  for (const url of PING_URLS) {
    try {
      const res = await fetch(url, { method: 'GET' });
      console.log(`${res.status} ${url}`);
    } catch (err) {
      console.warn(`Failed: ${url}`, err);
    }
  }
}

main();
