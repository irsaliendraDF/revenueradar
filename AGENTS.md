# Agents working on Revenue Radar

Primary context lives in [`CLAUDE.md`](CLAUDE.md). Read it first.

<!-- BEGIN:nextjs-agent-rules -->
## Next.js 16 warning

This project runs Next.js 16. APIs, conventions, and file structure differ from Next 14/15. If you've trained on older code, double-check before writing:

- Turbopack is the default for `next dev` and `next build`. No flag needed.
- `cookies()`, `headers()`, `params`, and `searchParams` are all Promises. Await them.
- The middleware file is named `proxy.ts`. The exported function is `proxy`. Node runtime only (no edge).
- `next lint` was removed. Use ESLint directly.
- PPR is gone. Use the top-level `cacheComponents: true` config for similar behavior.
- Parallel route slots need explicit `default.tsx`.

Full upgrade notes: `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md`.
<!-- END:nextjs-agent-rules -->

## Hard rules

- No em dashes anywhere (code, copy, comments, commit messages).
- No "AI-powered" marketing language.
- No password auth. Magic link + Google OAuth only.
- Source attribution (`source_url`, `retrieved_at`) on every data point in shipped outputs.
- Apply DFC brand tokens from `src/app/globals.css`. Do not redefine palette/fonts inline.
