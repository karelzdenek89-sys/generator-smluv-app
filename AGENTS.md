<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Vercel deployment cost guardrails

- Routine work branches must not trigger Vercel builds. Use local checks and repository CI while iterating.
- `main` is the production lane. Keep production deploys tied to coherent release commits rather than retriggering them for verification-only edits.
- Use `preview-*` only when an actual hosted runtime/browser preview is materially needed, preferably once after a coherent batch of changes.
- Do not push no-op or documentation-only commits to retrigger Vercel.
- Cost control must not weaken production verification, checkout, payment, partner-engine, or document-generation safety.
