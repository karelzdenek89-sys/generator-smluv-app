import { createHash, randomUUID } from 'node:crypto';
import { redis } from '@/lib/redis';

function generationKey(email: string): string {
  return `case:access-generation:${createHash('sha256').update(email.trim().toLowerCase()).digest('hex')}`;
}

// Keep revocation epochs for longer than every possible issued token. Renewing
// the retention on issuance prevents legacy tokens from becoming valid again.
const GENERATION_TTL = 60 * 60 * 24 * 400;
export async function getAccessGeneration(email: string): Promise<string> {
  return await redis.get<string>(generationKey(email)) ?? 'legacy';
}
export async function issueAccessGeneration(email: string): Promise<string> {
  const generation = await getAccessGeneration(email);
  await redis.expire(generationKey(email), GENERATION_TTL);
  return generation;
}
export async function revokeOwnerAccess(email: string): Promise<void> {
  await redis.set(generationKey(email), randomUUID(), { ex: GENERATION_TTL });
}
