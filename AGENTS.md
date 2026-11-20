<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- mso-local-context -->
## Local Integration & Credential Context
Before running GitHub (`git`/`gh`/API) or external provider operations, check local gitignored `mso.md` (or `.mso/mso.md`) in this repository root if present. It specifies the intended MSO integration user and connection for this project. Never commit `mso.md`, `.mso/mso.md`, or raw credentials.
