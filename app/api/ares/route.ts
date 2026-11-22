import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ico = (searchParams.get('ico') ?? '').replace(/\s+/g, '');

  if (!/^\d{8}$/.test(ico)) {
    return NextResponse.json(
      { ok: false, error: 'Zadejte platné 8místné IČO.' },
      { status: 400 },
    );
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);
    const res = await fetch(
      `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${ico}`,
      {
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      },
    );
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: 'Subjekt s tímto IČO nebyl v registru ARES nalezen.' },
        { status: res.status === 404 ? 404 : 502 },
      );
    }

    const data = (await res.json()) as {
      ico?: string;
      obchodniJmeno?: string;
      dic?: string;
      sidlo?: { textovaAdresa?: string };
    };

    return NextResponse.json(
      {
        ok: true,
        ico: data.ico ?? ico,
        name: data.obchodniJmeno ?? '',
        address: data.sidlo?.textovaAdresa ?? '',
        dic: data.dic ?? null,
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=3600',
        },
      },
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Registr ARES je momentálně nedostupný. Vyplňte údaje ručně.' },
      { status: 503 },
    );
  }
}
