import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export const runtime = 'nodejs';

/**
 * Lightweight payment status check — nevrací PDF, jen stav platby.
 * Používá success page pro polling před zobrazením tlačítka stažení.
 */
export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ status: 'error', message: 'Missing session_id' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      return NextResponse.json({ status: 'paid' });
    }

    return NextResponse.json({ status: 'pending' });
  } catch {
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
