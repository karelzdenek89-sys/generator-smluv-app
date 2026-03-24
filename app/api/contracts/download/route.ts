import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { generatePDF } from '@/lib/pdf'; // Opraveno: tvůj soubor se jmenuje pdf.ts

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const draftId = searchParams.get('draftId');

    if (!draftId) {
      return NextResponse.json({ error: 'Missing draftId' }, { status: 400 });
    }

    // 1. Získání dat z Redis
    const draftData = await redis.get(`contract:draft:${draftId}`);

    if (!draftData) {
      return NextResponse.json({ error: 'Smlouva nenalezena nebo vypršela' }, { status: 404 });
    }

    // 2. Kontrola platby (zakomentováno pro testování)
    /*
    if ((draftData as any).status !== 'paid') {
      return NextResponse.json({ error: 'Platba nebyla potvrzena' }, { status: 402 });
    }
    */

    // 3. Generování PDF dat
    const pdf = await generatePDF(draftData as any);

    // 4. Prodloužení expirace v Redis
    await redis.expire(`contract:draft:${draftId}`, 60 * 60);

    // 5. VRÁCENÍ PDF (s "as any" pro TypeScript a správnými hlavičkami)
    return new NextResponse(pdf as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="smlouva-${draftId.slice(0, 8)}.pdf"`,
        'Cache-Control': 'no-store, max-age=0',
      },
    });

  } catch (error) {
    console.error('Chyba při stahování PDF:', error);
    return NextResponse.json(
      { error: 'Nepodařilo se vygenerovat dokument' },
      { status: 500 }
    );
  }
}