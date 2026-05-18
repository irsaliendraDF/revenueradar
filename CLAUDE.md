# Revenue Radar by DigitalFlow Consulting

A two-agent SaaS web app for B2B founders. Owner: Irene Saliendra (DigitalFlow Consulting Inc., Nova Scotia, Canada). Phase 1 in progress, build plan canonical at `docs/BUILD_PLAN.md`.

## Stack

- **Framework:** Next.js 16.2 (App Router) on Vercel. Note: build plan calls for Next 15; we bootstrapped on 16 because it shipped just before kickoff and the project is greenfield. See "Next.js 16 conventions" below for what changed.
- **Language:** TypeScript (strict).
- **Styling:** Tailwind CSS v4 (CSS-based config in `src/app/globals.css`, no JS config file). shadcn/ui to be added.
- **Database/Auth:** Supabase (Postgres 15 + Auth + Storage + Realtime). RLS on every table.
- **Auth:** Supabase Auth, magic link + Google OAuth. No password auth.
- **Background jobs:** Inngest.
- **Payments:** Stripe Subscriptions + Customer Portal. Placeholders until Chase business account is live.
- **Email:** Resend (transactional). Loops post-launch (marketing).
- **Monitoring:** Sentry + Posthog.
- **Agents:** Anthropic TypeScript SDK direct. Models `claude-sonnet-4-5` (Scout, Outreach) and `claude-opus-4-5` (deep dives only).
- **HubSpot:** Official Node SDK with OAuth 2.0.
- **File generation:** ExcelJS (xlsx), `docx`, pdfme (pdf).

## Hard rules (do not violate)

- **No em dashes.** Anywhere. Code, copy, comments, commit messages, docs. Use commas, semicolons, or parens. Stricter than the brand system, which allows them in display headers.
- **No "AI-powered" marketing language.** Lead with outcomes and methodology.
- **No autonomous send.** Outreach is generation only.
- **No LinkedIn scraping.** PhantomBuster BYOK at Tier 2+ only.
- **Source attribution on every data point** in every shipped output (`source_url` + `retrieved_at`).
- **No mocked data in shipped UI.** Explain failed source retrievals.
- **No password auth.** Magic link + Google OAuth only.
- **All prices CAD.**

## Brand system

Source of truth: Notion page `34f7b3f7964681efbfaee0f6be952542` (DigitalFlow Brand & Design System). Tokens are mirrored locally in `src/app/globals.css`. When the brand system changes, update `globals.css` to match. Do not redefine tokens elsewhere.

Palette: warm orange `#FFA74F`, sage greens (`#3e4d34`, `#5e734e`, `#7d9a68`, `#9dc183`), cream `#fff3e2`, ink `#2a2a22`, warm-white `#fffaf3`, muted `#8a7d6e`, border `#e0d8ce`. Fonts: Fraunces (display), DM Sans (body), DM Mono (eyebrows). All from Google Fonts.

Tag every product surface "Revenue Radar by DigitalFlow Consulting". Phase 1 uses the DigitalFlow Consulting logo (`public/logo.png`) because Revenue Radar does not have its own mark yet.

## Repo layout

```
.
├── docs/
│   └── BUILD_PLAN.md         # canonical build plan, mirrored from Notion
├── public/
│   ├── logo.png              # DigitalFlow Consulting mark
│   └── favicon.png
└── src/
    ├── app/
    │   ├── (marketing)/      # public marketing routes (landing, pricing, about)
    │   ├── (app)/            # authenticated product routes (dashboard, settings, onboarding, account inspector)
    │   ├── api/              # route handlers (Stripe webhook, Inngest receiver, HubSpot OAuth callback, Supabase auth callback)
    │   ├── globals.css       # Tailwind v4 theme + brand tokens
    │   ├── layout.tsx
    │   └── page.tsx          # marketing landing
    ├── components/
    │   ├── brand/            # eyebrow, callout, gradient, footer, logo lockup
    │   └── ui/               # shadcn primitives
    └── lib/                  # supabase client, anthropic client, hubspot client, inngest client, utils
```

Route groups: `(marketing)` and `(app)` are URL-invisible groupings. The `(app)` group will own the auth layout that requires a Supabase session.

## Commands

- `npm run dev` — Turbopack dev server on http://localhost:3000.
- `npm run build` — Turbopack production build (Turbopack is now default in Next 16).
- `npm start` — production server.
- `npm run lint` — ESLint (Next 16 removed `next lint`; ESLint is invoked directly).

## Environment variables

Listed in `.env.example`. Copy to `.env.local` for development; set production values in Vercel project settings. Phase 1 needs Supabase, Anthropic, Resend, Sentry, Posthog, Inngest, HubSpot, and Stripe placeholders. Phase 2 adds Exa, Firecrawl, BuiltWith. Phase 2+ adds Crunchbase.

## Next.js 16 conventions to follow

Most of the codebase Claude has indexed targets Next 14/15. Differences that matter here:

- **Turbopack by default** for dev and build. No `--turbopack` flag in scripts.
- **Async request APIs.** `cookies()`, `headers()`, `draftMode()`, `params`, and `searchParams` are all Promises. Always `await` them in pages, layouts, and route handlers.
- **`middleware` → `proxy`.** The auth gate file goes in `proxy.ts` at the project root, with a named export `proxy(request)`. `nodejs` runtime only (no edge). Supabase SSR helpers still work, just renamed.
- **`next lint` removed.** `package.json` uses `"lint": "eslint"`.
- **PPR removed.** If we want partial prerendering later, use the top-level `cacheComponents: true` config flag, not `experimental.ppr`.
- **`images.domains` deprecated.** Use `images.remotePatterns`.
- **Parallel route slots** require explicit `default.js`/`default.tsx`. Build fails without them.
- **React 19.2** is in use. View Transitions, `useEffectEvent`, and Activity are available.

When in doubt, the upgrade guide is at `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md`.

## Open Phase 1 items waiting on Irene

- Supabase project URL + service role key (or authorize provisioning via MCP)
- Anthropic API key
- Resend API key + sending domain verified
- Sentry DSN + auth token
- Posthog project key
- Inngest event + signing keys
- HubSpot Public App credentials (after Solutions Partner approval, or sandbox app)
- Stripe DFC Inc. keys (after Chase business account is live)
- Exa, Firecrawl, BuiltWith API keys (Phase 2 but easier to set now)
- Vercel team/scope to link the project to

## Working notes

- The Insider Hub project removed Google OAuth because it caused data fragmentation. Revenue Radar uses Google OAuth per build plan; mitigate the same risk by ensuring the `profiles` table is keyed strictly on `auth.users.id` and never on email, and by tracking `provider` on each session so we can surface "you already signed in with magic link, switch providers?" instead of silently creating duplicate accounts.
- Brand voice is "BizDev Bestie" for the marketing site and consultative for the in-product copy. Never "AI-powered" anything.
