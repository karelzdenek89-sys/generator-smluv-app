/**
 * Lokální náhled bez dotyku produkčních služeb: paměťový Redis (lib/redis-memory.ts)
 * místo Upstash z .env.local a neplatný Stripe klíč, aby žádná lokální akce
 * nemohla založit skutečnou platbu. Používá port 3200, aby se nepletl
 * s ostatními projekty ani s produkčním `next start` pro Playwright.
 *
 *   npm run dev:local
 */
import { spawn } from 'node:child_process';

const port = process.env.PORT || '3200';
const child = spawn('npx', ['next', 'dev', '-p', port], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    SMLOUVAHNED_FAKE_REDIS: '1',
    STRIPE_SECRET_KEY: 'sk_test_local_preview_disabled',
    STRIPE_WEBHOOK_SECRET: 'whsec_local_preview_disabled',
    NEXT_PUBLIC_BASE_URL: `http://127.0.0.1:${port}`,
  },
});
child.on('exit', (code) => process.exit(code ?? 0));
