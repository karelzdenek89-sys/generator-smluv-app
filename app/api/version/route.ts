import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Který commit právě běží v produkci.
 *
 * Slouží k tomu, aby po deployi šlo poznat, že je nasazená *nová* verze.
 * Workflow `seznam-indexnow.yml` na to čekal dotazem na statický klíčový
 * soubor IndexNow — jenže ten je napříč deploymenty identický a byl živý už
 * z předchozího buildu, takže kontrola prošla okamžitě a odeslala starou
 * sitemapu. 2026-09-11 se tím minula jediná URL, na které záleželo.
 *
 * Repozitář je veřejný, takže SHA commitu není citlivý údaj.
 */
export function GET() {
  return NextResponse.json(
    {
      commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
      env: process.env.VERCEL_ENV ?? null,
    },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } },
  );
}
