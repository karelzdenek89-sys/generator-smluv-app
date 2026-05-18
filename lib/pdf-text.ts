/**
 * Extract searchable text from generated PDF buffers (for QA tests).
 */
export async function extractPdfText(buffer: Buffer): Promise<string> {
  // Import the parser directly — the package entry runs a debug self-test when module.parent is unset.
  const pdfParse = (await import('pdf-parse/lib/pdf-parse.js')).default as (
    data: Buffer,
  ) => Promise<{ text: string }>;
  const result = await pdfParse(buffer);
  return result.text ?? '';
}
