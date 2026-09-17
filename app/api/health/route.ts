import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { isFeatureEnabled } from '@/lib/feature-flags';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Health endpoint pro uptime monitoring a produkční smoke po deployi.
 *
 * Vrací pouze stav závislostí a přítomnost konfigurace (true/false), nikdy
 * hodnoty. Redis se ověřuje lehkým PING s krátkým timeoutem, aby výpadek
 * úložiště nezpůsobil, že health sám visí.
 */
async function checkRedis(): Promise<'ok' | 'error' | 'unconfigured'> {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return 'unconfigured';
  try {
    const result = await Promise.race([
      redis.ping(),
      new Promise<'timeout'>((resolve) => setTimeout(() => resolve('timeout'), 2500)),
    ]);
    return result === 'PONG' ? 'ok' : 'error';
  } catch {
    return 'error';
  }
}

export async function GET() {
  const redisStatus = await checkRedis();
  const checks = {
    redis: redisStatus,
    stripe: process.env.STRIPE_SECRET_KEY ? 'configured' : 'unconfigured',
    stripeWebhook: process.env.STRIPE_WEBHOOK_SECRET ? 'configured' : 'unconfigured',
    email: process.env.RESEND_API_KEY ? 'configured' : 'unconfigured',
    remindersCron: process.env.CRON_SECRET ? 'configured' : 'unconfigured',
    caseEngine: isFeatureEnabled('caseEngine') ? 'enabled' : 'disabled',
  } as const;
  const healthy = redisStatus === 'ok' && checks.stripe === 'configured' && checks.stripeWebhook === 'configured';
  return NextResponse.json(
    {
      status: healthy ? 'ok' : 'degraded',
      commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
      env: process.env.VERCEL_ENV ?? null,
      checks,
      checkedAt: new Date().toISOString(),
    },
    { status: healthy ? 200 : 503, headers: { 'Cache-Control': 'no-store, max-age=0' } },
  );
}
