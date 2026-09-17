import { NextResponse } from 'next/server';
import { recordAnalyticsEvent } from '@/lib/analytics-server';
import { authorizeCaseRequest, isCaseRouteFailure } from '@/lib/cases/route-auth';
import { findDocument } from '@/lib/cases/store';
import { CASE_DOCUMENT_DEFINITIONS, CASE_DOCUMENT_SIGNATURE_TITLE, resolveCaseDocumentRender } from '@/lib/cases/documents';
import { formatCzechDate } from '@/lib/cases/workflow';
import { renderSimpleDocumentPdf } from '@/lib/pdf';

export const runtime = 'nodejs';

function safeFilename(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 60) || 'dokument';
}

/**
 * PDF navazujícího dokumentu. POST, aby token nikdy nebyl v URL; prohlížeč
 * dostane blob a uloží jej. Dokument musí být ve stavu `ready`.
 */
export async function POST(req: Request) {
  const auth = await authorizeCaseRequest(req, {
    rateLimitKey: 'case-doc-download',
    limit: 40,
    windowSeconds: 3600,
    maxBytes: 4 * 1024,
  });
  if (isCaseRouteFailure(auth)) return auth.response;

  const documentId = typeof auth.body.documentId === 'string' ? auth.body.documentId : '';
  const document = findDocument(auth.record, documentId);
  if (!document) return NextResponse.json({ error: 'Dokument nebyl nalezen.' }, { status: 404 });
  if (document.status !== 'ready') {
    return NextResponse.json({ error: 'Dokument zatím není zaplacený.' }, { status: 402 });
  }

  try {
    const definition = CASE_DOCUMENT_DEFINITIONS[document.kind];
    // Vydaný dokument je neměnný: sekce, název zakázky i termín pocházejí ze
    // snapshotu z doby vytvoření a datum z document.createdAt.
    const render = resolveCaseDocumentRender(auth.record, document);
    const pdf = await renderSimpleDocumentPdf({
      title: definition.title,
      subtitleLines: [
        `Zakázka: ${render.caseTitle}`,
        `Termín dokončení podle smlouvy: ${formatCzechDate(render.caseDeadline)} · Vytvořeno ${new Date(document.createdAt).toLocaleDateString('cs-CZ')} · Šablona ${render.templateVersion}`,
      ],
      sections: render.sections,
      signatureSectionTitle: CASE_DOCUMENT_SIGNATURE_TITLE,
      signatureLabels: definition.signatureLabels,
      docId: `SH-Z-${document.id.slice(0, 8).toUpperCase()}`,
    });
    await recordAnalyticsEvent('document_downloaded', {
      source: 'case_page',
      surface: 'case_engine',
      case_kind: 'work_order',
      document_kind: document.kind,
      download_format: 'pdf',
    });
    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeFilename(definition.shortTitle)}-${document.id.slice(0, 8)}.pdf"`,
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error) {
    console.error('[cases] document render failed', error instanceof Error ? error.message : 'unknown');
    return NextResponse.json({ error: 'Dokument se nepodařilo vygenerovat.' }, { status: 500 });
  }
}
