import { NextResponse } from 'next/server';
import { isContractType } from '@/lib/partners/context';
import { normalizeLocale } from '@/lib/locale';
import { getMonetizationPolicy } from '@/lib/monetization-policy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const contractType = url.searchParams.get('contractType');
  if (!isContractType(contractType)) {
    return NextResponse.json({ error: 'invalid_contract_type' }, { status: 400 });
  }
  const locale = normalizeLocale(url.searchParams.get('locale'));
  return NextResponse.json(getMonetizationPolicy(contractType, locale), {
    headers: { 'Cache-Control': 'private, no-store, max-age=0' },
  });
}
