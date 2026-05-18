# Revenue Radar — Claude Code Build Plan

> Single source of truth for Claude Code to build Revenue Radar v1. Read top to bottom. Every section is intentional. Strategy, positioning, and pricing decisions are locked in the parent doc. This page is for execution only.
>
> **Status:** v1.1, May 16, 2026. Pricing, domain, branding, Tier 1 account count all confirmed. Three open items remain in Section 14 (legal, Stripe, beta cohort 4th name).
>
> **Local copy.** Mirror of Notion page `3627b3f79646819cbb08fa6a72a36419`. Saved 2026-05-18.

## 0. What you're building

A two-agent SaaS web app that helps B2B founders at $1M to $25M decide who to target and how to reach them. Scout Agent researches accounts at the company level. Outreach Agent generates personalized first-touch sequences per persona. Signal Layer runs underneath both, refreshing intent data on cadence. Outputs are an Excel workbook, a Word outreach kit, and a PDF campaign brief, plus a live web dashboard.

Three pricing tiers: Starter $39/mo, Growth $129/mo, Scale $349/mo (all CAD). Annual billing saves ~17%. Built on the Fish/Dolphin/Whale methodology with C-suite persona priority and SPICED/MEDDPICC layered in.

Not autonomous. Not credit-priced. Not a CRM replacement. The methodology layer is the moat.

## 1. Resolved decisions (do not relitigate)

From parent doc plus Irene's May 16 sign-off:

- Product name: Revenue Radar
- Agent layer names: Scout Agent, Outreach Agent, Signal Layer
- Tier names: Starter / Growth / Scale
- Tier pricing: $39 / $129 / $349 CAD, annual saves ~17%
- Two-agent architecture, account intelligence first, contact data second
- HubSpot integration moves to Phase 1
- HubSpot Solutions Partner application: yes, week 1
- Free Breeze ROI Audit lead magnet: yes, Phase 5
- 90-day outcome guarantee: yes, on launch
- Output formats: xlsx workbook, docx outreach kit, pdf campaign brief
- Beta cohort base: Patrick (AG Business), P4G, Neucleus, plus one Volta Labs founder TBD
- Branded as 'Revenue Radar by DigitalFlow Consulting'. Full DFC brand system applied throughout product, marketing, and outputs.
- Domain: revenueradar.digitalflowconsulting.ca (subdomain of digitalflowconsulting.ca).
- Starter tier: 20 accounts/mo (reduced from 25 per May 16 decision to improve unit economics).

## 2. Tech stack (concrete picks, no options)

### Core infrastructure

- **Frontend:** Next.js 15 App Router on Vercel. TypeScript. React Server Components where possible. (Local note 2026-05-18: bootstrapped on Next.js 16, which was just released and is the latest stable. Phase 1 will track Next 16 conventions, see CLAUDE.md.)
- **Styling:** Tailwind CSS + shadcn/ui (Radix primitives). Matches Irene's existing aesthetic with custom tokens for orange #FFA74F, sage greens, cream.
- **Database:** Supabase (Postgres 15 + Auth + Storage + Realtime). Row-level security enabled on every table.
- **Auth:** Supabase Auth. Email/password (with email confirmation) + magic link. No Google OAuth or other social providers. Override of the original plan per Irene 2026-05-18, matching the Insider Hub policy after Google caused account fragmentation.
- **Background jobs:** Inngest. Handles agent runs (5 to 15 min jobs), retries, durable execution, signal refresh cron. Native Vercel integration.
- **Payments:** Stripe Subscriptions + Stripe Customer Portal for self-serve billing.
- **Transactional email:** Resend (welcome, campaign ready, invoice receipts, password reset).
- **Marketing email:** Loops, integrated post-launch.
- **Monitoring:** Sentry for errors, Posthog for product analytics and session replay.
- **File storage:** Supabase Storage for generated xlsx/docx/pdf outputs.

### Agent layer

- **Primary model:** Claude Sonnet 4.5 (claude-sonnet-4-5) for both Scout and Outreach Agents. Best price-performance for agentic work.
- **Deep-dive model:** Claude Opus 4.5 (claude-opus-4-5) for the 5 deep-dive accounts only. Premium intelligence on the prospects that matter most.
- **SDK:** Anthropic TypeScript SDK direct, with native tool use. No LangChain. Simpler, cheaper, more reliable.
- **Orchestration:** Inngest workflows for multi-step agent runs. Each step is a discrete tool call.

### Research and data sources

- **Web search:** Exa.ai (semantic search, best for B2B intent and news). Tavily as fallback.
- **Web scraping:** Firecrawl for clean markdown extraction of company pages. ScrapingBee for JS-heavy fallback. Both are commercial-grade and respect robots.txt.
- **Tech stack detection:** BuiltWith API + inference from job descriptions parsed by Scout Agent.
- **Jobs data:** Greenhouse and Lever public APIs (free, public job boards). No LinkedIn scraping.
- **Company registry data:** OpenCorporates API for incorporation, officers, structure.
- **Funding data:** Crunchbase API at Tier 2+. Web search for Tier 1.
- **News and social:** Exa.ai covers this. Twitter/X scraping deferred to v2.

### BYOK integrations (Tier 2+)

- Apollo API (contact data unlock)
- Hunter API (email verification)
- Clay API (workflow enrichment, optional)
- Sales Navigator via PhantomBuster (user-provided keys only)

### File generation

- **xlsx:** ExcelJS (multi-tab, formatting, charts)
- **docx:** docx npm library (Microsoft format, reliable)
- **pdf:** pdfme or @sparticuz/chromium + puppeteer-core on Vercel serverless

### HubSpot integration

- Official HubSpot Node SDK. OAuth 2.0 flow.
- Custom fields pushed: F/D/W tier, composite fit score, signal score, persona priority, methodology notes.
- App listed in HubSpot App Marketplace (post-launch).

### What this stack avoids

- No Lovable (older B2B Prospecting Agent Suite doc referenced it; Next.js gives more control for an agent product).
- No Vercel KV / Upstash Redis in v1 (Supabase + Inngest covers caching and queue needs).
- No LangChain / LangGraph (adds latency and abstraction overhead with no gain at this scale).
- No third-party auth (Clerk, Auth0). Supabase Auth is sufficient and keeps the stack consolidated.

## 3. System architecture

```
Browser (Next.js App)
  - Onboarding wizard
  - Campaign creation
  - Live dashboard (Supabase Realtime)
  - Account inspector
  - Outreach kit viewer
        |
        v
Next.js API Routes (Vercel)
  - Auth callbacks
  - Campaign trigger
  - Stripe webhooks
  - HubSpot OAuth + push
  - File downloads (signed URLs)
        |
        +------> Supabase (Postgres + Auth + Storage)
        |
        +------> Inngest (background workflows)
                  |
                  +--> Scout Agent run
                  |     - Exa search
                  |     - Firecrawl scrape
                  |     - BuiltWith API
                  |     - Greenhouse/Lever
                  |     - Claude Sonnet 4.5 reasoning
                  |
                  +--> Outreach Agent run
                  |     - Claude Sonnet 4.5 generation
                  |
                  +--> File generation
                  |     - ExcelJS
                  |     - docx
                  |     - pdfme
                  |
                  +--> HubSpot push
                  |
                  +--> Signal refresh cron (weekly/quarterly)
```

## 4. Scout Agent architecture

### Inputs

Campaign config (industry, geography, ICP, F/D/W tier, signals to prioritize, exclusions) plus user's company context from onboarding.

### Tools available to Scout Agent

```
- exa_search(query, num_results, type)
- exa_find_similar(url, num_results)
- firecrawl_scrape(url) -> returns clean markdown
- builtwith_lookup(domain) -> returns tech stack
- greenhouse_jobs(company_slug) -> returns open roles
- lever_jobs(company_slug) -> returns open roles
- opencorporates_lookup(jurisdiction, name) -> returns registry data
- crunchbase_funding(company) -> Tier 2+ only
- apollo_search(filters) -> BYOK Tier 2+ only
- hunter_verify(email) -> BYOK Tier 2+ only
```

### Flow per campaign

**Phase A: Candidate generation (1 to 2 min)**

1. Translate ICP + F/D/W tier into search queries (3 to 5 queries)
2. Run Exa searches in parallel
3. Deduplicate, filter against exclusion list
4. Return candidate pool of 100 to 200 companies
5. Rank by signal density (recent news, hiring velocity, funding) and ICP fit
6. Truncate to tier-appropriate count (25 / 50 / unlimited)

**Phase B: Per-account research (5 to 10 min total, parallelized)**

For each account, Scout Agent runs a tool-use loop with this objective:

> Research [company]. Produce a structured profile covering firmographics, recent news (last 90 days), tech stack signals, hiring velocity especially in sales/revenue roles, funding history, social content themes, and any buyer intent signals. Cite every claim with a source URL. Output JSON matching the AccountProfile schema.

Token budget per account: ~8K input / ~4K output. Cost: ~$0.15 to $0.25 per account on Sonnet 4.5.

**Phase C: F/D/W classification + scoring**

- Rule-based F/D/W tier from employee count + revenue + industry
- LLM-generated composite fit score (0 to 100) with plain-language reasoning
- Top signal extraction (single highest-priority signal per account)
- Recommended next action (one sentence)

**Phase D: Deep dive (5 accounts, Opus 4.5)**

For user-selected deep-dive accounts only:

- 30+ field detailed profile
- Named decision-makers per persona requested
- Email pattern prediction with confidence score
- SPICED prompts surfaced
- MEDDPICC prompts if Whale tier
- 'Why this account, why now' narrative

Token budget per deep dive: ~30K input / ~8K output. Cost: ~$1 to $1.50 per deep dive on Opus.

### Caching

Company-level research cached 30 days. If user A and user B both research Acme Corp, the second request is a cache hit (no re-research, no cost). Campaign-level (signals + scoring + recommendations) is never cached because it's user-specific.

### Source attribution

Every data point in the AccountProfile JSON includes a `source_url` and `retrieved_at` timestamp. Sources Log tab in xlsx aggregates them. This is the trust layer.

## 5. Outreach Agent architecture

### Inputs

Deep-dive AccountProfile + user's product/service one-liner + value prop + 2-3 proof points + selected personas + F/D/W tier.

### Per persona output

The agent generates outreach calibrated to:

1. The persona's priorities (from the C-suite Persona Priority Layer in parent doc)
2. The F/D/W tier (Fish = short and direct, Dolphin = consultative, Whale = insight-led)
3. The account's top signal (funding round, hiring spike, etc.)

Outputs per persona:

- 3-touch email sequence (subject + body + signoff for each)
- LinkedIn connection request + 1 follow-up message
- Call talk track (opener, value bridge, 2 discovery questions, close)
- Top 3 anticipated objections with framework-backed responses
- Why this account, why now (one paragraph)

Token budget per persona: ~6K input / ~4K output. Cost: ~$0.10 to $0.20 per persona on Sonnet 4.5.

### Calibration prompts per F/D/W tier baked into the system prompt

**Fish:** Outreach is direct, personal, short. Founder-to-founder voice. Lead with the outcome. Skip the 'I noticed' opener. 75-word email max.

**Dolphin:** Consultative. Lead with the signal (funding, hiring, etc.) and tie to outcome. Reference a comparable customer. 120-word email max.

**Whale:** Insight-led. Open with an industry observation or contrarian framing. Tie to a specific business pain. Position for a longer conversation, not an immediate yes. 180-word email max. Trigger MEDDPICC prompts.

## 6. Signal Layer

### Cadence

- Tier 1 Starter: no signal refresh (one-time research only)
- Tier 2 Growth: quarterly refresh on all tracked accounts
- Tier 3 Scale: weekly refresh on all tracked accounts

### Architecture

Inngest cron job runs at the configured cadence per user. For each tracked account, re-run Phase B (per-account research) with a targeted prompt: only look for changes since `last_refreshed_at`. Diff against the previous AccountProfile. Surface deltas in the dashboard and email digest.

### Signals tracked (priority order)

1. New funding round (single most predictive signal)
2. Leadership change (especially CRO, VP Sales, VP Marketing)
3. Hiring velocity spike (especially sales/revenue roles)
4. Tech stack change inferred from job postings
5. M&A activity
6. Expansion (new office, new market)
7. Product launch
8. Content themes (what the company is publicly talking about)

## 7. Database schema (Supabase Postgres)

All tables have `id uuid PK`, `created_at timestamptz`, `updated_at timestamptz`. RLS enabled on every table, users see only their own data.

```sql
-- USERS (extends supabase auth.users)
create table profiles (
  user_id uuid primary key references auth.users(id),
  full_name text,
  company_name text,
  company_website text,
  product_one_liner text,
  pricing_model text,
  typical_deal_size_min int,
  typical_deal_size_max int,
  sales_motion text,           -- founder_led | small_team | full_team
  current_icp text,
  dream_customers jsonb,        -- [{name, website, why}]
  bad_fit_customers jsonb,
  fdw_target_tiers text[],     -- ['fish', 'dolphin', 'whale']
  subscription_tier text,       -- starter | growth | scale
  stripe_customer_id text,
  stripe_subscription_id text,
  hubspot_portal_id text,
  hubspot_refresh_token text,
  onboarding_completed_at timestamptz
);

-- ICP API KEYS (BYOK)
create table user_api_keys (
  user_id uuid references profiles(user_id),
  provider text,                -- apollo | hunter | clay | sales_nav
  encrypted_key text,           -- AES-256 encrypted
  added_at timestamptz
);

-- CAMPAIGNS
create table campaigns (
  id uuid primary key,
  user_id uuid references profiles(user_id),
  name text,
  goal text,
  target_geography text[],
  target_industries text[],
  employee_count_min int,
  employee_count_max int,
  revenue_min int,
  revenue_max int,
  fdw_tier text,                -- fish | dolphin | whale
  target_personas text[],
  prioritized_signals text[],
  exclusion_list jsonb,
  status text,                  -- draft | running | completed | failed
  scout_started_at timestamptz,
  scout_completed_at timestamptz,
  outreach_started_at timestamptz,
  outreach_completed_at timestamptz
);

-- ACCOUNTS (per campaign)
create table accounts (
  id uuid primary key,
  campaign_id uuid references campaigns(id),
  user_id uuid references profiles(user_id),
  company_name text,
  company_domain text,
  fdw_tier text,
  composite_fit_score int,      -- 0 to 100
  fit_reasoning text,
  top_signal text,
  recommended_next_action text,
  is_deep_dive boolean default false,
  profile_json jsonb,           -- full AccountProfile schema
  sources_json jsonb,           -- [{claim, source_url, retrieved_at}]
  last_refreshed_at timestamptz
);

-- DECISION MAKERS (per deep-dive account)
create table decision_makers (
  id uuid primary key,
  account_id uuid references accounts(id),
  name text,
  role text,
  persona_bucket text,          -- ceo | coo | cmo | cio_cto | vp_sales | director
  linkedin_search_url text,
  email_pattern text,
  email_confidence_score int,   -- 0 to 100
  email_verified boolean,
  source_url text
);

-- OUTREACH OUTPUTS
create table outreach_outputs (
  id uuid primary key,
  account_id uuid references accounts(id),
  persona_bucket text,
  email_sequence jsonb,         -- [{touch, subject, body}]
  linkedin_messages jsonb,
  call_talk_track jsonb,
  objections jsonb,
  why_now_narrative text,
  generated_at timestamptz
);

-- SIGNALS (running log)
create table signals (
  id uuid primary key,
  account_id uuid references accounts(id),
  user_id uuid references profiles(user_id),
  signal_type text,
  description text,
  source_url text,
  detected_at timestamptz,
  user_dismissed boolean default false
);

-- GENERATED FILES
create table campaign_files (
  id uuid primary key,
  campaign_id uuid references campaigns(id),
  user_id uuid references profiles(user_id),
  file_type text,               -- xlsx | docx | pdf
  storage_path text,
  generated_at timestamptz
);

-- USAGE LOG (for rate limiting and audit)
create table usage_events (
  id uuid primary key,
  user_id uuid references profiles(user_id),
  event_type text,              -- account_researched | deep_dive | outreach_generated | api_call
  cost_usd_cents int,
  metadata jsonb,
  occurred_at timestamptz
);

-- HUBSPOT SYNC LOG
create table hubspot_sync_log (
  id uuid primary key,
  user_id uuid references profiles(user_id),
  account_id uuid references accounts(id),
  hubspot_company_id text,
  fields_synced jsonb,
  synced_at timestamptz,
  error_message text
);
```

## 8. API surface

Next.js API routes under `/api`. All authenticated routes verify Supabase session.

```
POST   /api/auth/callback                  Supabase auth callback
GET    /api/profile                        Get current user profile
PATCH  /api/profile                        Update profile
POST   /api/onboarding                     Complete onboarding

POST   /api/campaigns                      Create new campaign
GET    /api/campaigns                      List user's campaigns
GET    /api/campaigns/:id                  Get campaign details
POST   /api/campaigns/:id/run              Trigger Scout Agent
GET    /api/campaigns/:id/status           Poll status (or use Realtime)
POST   /api/campaigns/:id/select-deep-dives Mark accounts for deep-dive
POST   /api/campaigns/:id/generate-outreach Trigger Outreach Agent
GET    /api/campaigns/:id/files/:type      Download xlsx/docx/pdf

GET    /api/accounts/:id                   Get account detail
PATCH  /api/accounts/:id                   Update F/D/W tier (user override)

POST   /api/api-keys                       Add BYOK key
DELETE /api/api-keys/:provider             Remove BYOK key

GET    /api/integrations/hubspot/connect   Initiate HubSpot OAuth
GET    /api/integrations/hubspot/callback  HubSpot OAuth callback
POST   /api/integrations/hubspot/sync/:account_id Push account to HubSpot

POST   /api/billing/create-checkout        Stripe checkout session
POST   /api/billing/portal                 Stripe customer portal session
POST   /api/billing/webhook                Stripe webhook receiver

POST   /api/inngest                        Inngest webhook receiver
```

## 9. Key UI flows

### Onboarding (first-run only, 4 steps max)

1. **Welcome + company basics** (name, website, one-liner, deal size range)
2. **ICP foundation** (free-text ICP, 2-3 dream customers, 2-3 bad fits, or 'help me' triggers guided worksheet)
3. **F/D/W declaration** (visual selector explaining each tier)
4. **Optional: BYOK setup** (skip allowed, return to in settings)

Progress bar, back/next, save-and-resume. Max 6 minutes to complete.

### Campaign creation (3 to 4 minutes per campaign)

1. Campaign name + goal (one-liner)
2. Geography + industries (multi-select)
3. Employee/revenue range (auto-populated from F/D/W, editable)
4. Personas to target (multi-select from C-suite framework)
5. Prioritized signals (multi-select, default: funding + hiring)
6. Exclusion list (paste or upload csv)
7. Review + 'Run Scout Agent' button

### Campaign dashboard (live, Supabase Realtime subscription)

- Progress indicator while Scout runs
- Account list table once complete: name, F/D/W tier, score, top signal, recommended action
- Filters: tier, score range, signal type
- Bulk select 5 for deep dive
- 'Run Deep Dives + Outreach' button triggers Opus run + Outreach Agent

### Account inspector

- Full AccountProfile rendered as readable sections
- Sources panel on right (every claim linked to source)
- F/D/W override toggle
- Push to HubSpot button (if connected)
- Outreach kit preview per persona (if generated)

### Files panel

- Download xlsx, docx, pdf
- Version history per campaign
- Email link to send to teammate (signed URL, 7-day expiry)

### Settings

- Profile + company info
- Subscription (link to Stripe portal)
- BYOK keys management
- HubSpot connection
- Notification preferences
- Cancel subscription (retention offer: 1 month free, then cancel link)

## 10. Commercial-grade features (what makes this sellable vs prototype)

These are not optional. Skipping any of them costs conversion or churn.

- **Source citation per data point.** Sources Log tab in xlsx + sources panel in account inspector. Builds trust, defends against 'where did this come from' churn risk.
- **Confidence scores on email patterns.** Honest 'we predict 70% confidence' beats false certainty. Reduces refund requests.
- **Per-account data freshness display.** 'Last refreshed 3 days ago' on every account card.
- **Source filtering in dashboard.** User can filter accounts to only those backed by 2+ corroborating sources.
- **Cost transparency on BYOK.** Show user 'You saved $X this month using your own API keys'.
- **Quota dashboard.** Real-time view of accounts researched this month vs tier limit. Prevents surprise.
- **Soft fair-use cap on Tier 3.** 500 accounts / 50 deep dives per month before throttling kicks in. Documented in ToS.
- **Cancellation flow with retention offer.** One-click cancel, but offer 1 month free first. Industry standard 15 to 25% save rate.
- **Audit log per user.** Every agent run logged with cost. Defends against billing disputes.
- **Stripe customer portal.** Self-serve plan changes, invoice history, payment method updates. Zero support load.
- **Onboarding email sequence.** Day 1 welcome + tutorial link, Day 3 'how was your first campaign', Day 7 'unlock deep dives', Day 14 'upgrade for signal layer'.
- **In-app empty states with one-click examples.** Never show 'You have no campaigns yet' without a 'See example campaign' button.
- **Outreach kit preview before download.** Stop users emailing themselves a docx to verify quality.
- **Per-export branding option (Tier 3).** White-label the docx with the user's logo. Agencies will pay for this.
- **Slack/email notifications when campaign completes.** Long-running jobs need closure pings.

## 11. HubSpot integration spec (Phase 1)

### Scope

MVP integration: push F/D/W tier, composite fit score, signal data, methodology recommendations as custom fields on HubSpot Company records. Pull existing HubSpot contacts/companies for context (avoid researching accounts the user already has).

### Setup

1. Register as HubSpot Solutions Partner (week 1 of build, application takes 2 to 4 weeks)
2. Create HubSpot Public App in HubSpot Developer Portal
3. Define custom properties on Company object:
	- `revenue_radar_fdw_tier` (enum: fish/dolphin/whale)
	- `revenue_radar_fit_score` (number, 0 to 100)
	- `revenue_radar_top_signal` (string)
	- `revenue_radar_recommended_action` (string)
	- `revenue_radar_methodology_notes` (string, long)
	- `revenue_radar_last_synced` (datetime)

### OAuth scopes required

- `crm.objects.companies.read`
- `crm.objects.companies.write`
- `crm.objects.contacts.read`
- `crm.schemas.companies.write` (to create custom properties)

### Sync flow

- User connects HubSpot in settings
- Custom properties created on first connect
- 'Push to HubSpot' button per account in inspector
- Bulk 'Push all campaign accounts' option
- Match logic: domain-based, fall back to fuzzy company name match, surface conflicts for user resolution

### App Marketplace listing

Deferred to Phase 5. Requires DPA, security questionnaire, and listing copy.

## 12. Unit economics validation

All prices CAD. API costs USD, converted at 1.36 CAD/USD assumption.

### Tier 1 Starter ($39 CAD = $28.70 USD revenue/mo)

Usage: 20 accounts/mo + 3 deep dives + 3 outreach kits. Reduced from 25 per May 16 decision.

API costs:

- 20 accounts on Sonnet 4.5: 20 x $0.20 = $4.00
- 3 deep dives on Opus 4.5: 3 x $1.25 = $3.75
- 3 outreach kits, 3 personas each on Sonnet: 9 x $0.15 = $1.35
- Exa search: ~120 queries x $0.005 = $0.60
- Firecrawl: ~60 scrapes x $0.005 = $0.30
- Total: ~$10.00 USD per active user per month
- Gross margin before fixed costs: $28.70 - $10.00 = $18.70 (65%)
- After Stripe (2.9% + $0.30): ~$18 net

**Solid margin for the wedge tier.** Drops costs by 11% vs the original 25-account spec; lifts Starter gross margin from 61% to 65%.

### Tier 2 Growth ($129 CAD = $94.85 USD revenue/mo)

Usage: 50 accounts/mo + 5 deep dives + 5 outreach kits + quarterly signal refresh.

API costs:

- 50 accounts: $10.00
- 5 deep dives: $6.25
- 5 outreach kits, 5 personas each: 25 x $0.15 = $3.75
- Search + scrape: ~$2.50
- Quarterly refresh (amortized monthly): ~$3.50
- Total: ~$26.00 USD per active user per month
- Gross margin: $94.85 - $26.00 = $68.85 (73%)

**Strong margin.** This is the unit economics anchor tier.

### Tier 3 Scale ($349 CAD = $256.62 USD revenue/mo)

Assume average user runs 200 accounts/mo, 20 deep dives, weekly signal refresh.

API costs:

- 200 accounts: $40.00
- 20 deep dives: $25.00
- 20 outreach kits: $15.00
- Search + scrape: ~$10.00
- Weekly refresh on 200 accounts: ~$20.00
- Total: ~$110.00 USD per active user per month
- Gross margin: $256.62 - $110.00 = $146.62 (57%)

**Soft cap at 500 accounts / 50 deep dives needed.** Documented in fair-use clause. Above the cap, throttle to weekly batches. Prevents 5% of users blowing up margins.

### Fixed costs (monthly, all tiers)

- Vercel Pro: $20
- Supabase Pro: $25
- Inngest: $20 (starter, scales with usage)
- Sentry + Posthog: $26 + $0 (free tier)
- Resend: $20
- Exa: $50 minimum
- Firecrawl: $19
- BuiltWith: $295 (annual, ~$25/mo amortized)
- Stripe: pass-through
- **Total fixed: ~$200 USD/mo**

Breakeven at ~12 Tier 2 customers OR 18 Tier 1 OR 3 Tier 3. Reachable with the beta cohort alone.

## 13. Build phases (revised for Claude Code)

Replaces the Phase 1 to 5 plan in the parent doc with Claude Code-executable tasks.

### Phase 1: Foundation + HubSpot OAuth (Week 1 to 2)

- [x] Next.js project init, Tailwind, shadcn/ui, deploy to Vercel (Next.js 16, see CLAUDE.md)
- [ ] Supabase project setup, migrations, RLS policies
- [ ] Supabase Auth with magic link + Google OAuth
- [ ] Profile page + onboarding wizard (4 steps)
- [ ] Database schema deployed (Section 7)
- [ ] Stripe products + prices created (Starter/Growth/Scale, monthly + annual)
- [ ] Stripe checkout + customer portal integration
- [ ] Stripe webhook handler (subscription lifecycle events)
- [ ] HubSpot Public App registration
- [ ] HubSpot OAuth flow + token storage
- [ ] Inngest project setup, deployed to Vercel
- [ ] Sentry + Posthog instrumentation
- [ ] Resend transactional emails (welcome, password reset)
- [ ] HubSpot Solutions Partner application submitted

### Phase 2: Scout Agent MVP (Week 3 to 5)

- [ ] Campaign creation flow
- [ ] Inngest workflow for Scout Agent
- [ ] Exa.ai integration
- [ ] Firecrawl integration
- [ ] BuiltWith integration
- [ ] Greenhouse + Lever job board scrapers
- [ ] OpenCorporates integration
- [ ] Scout Agent system prompt + tool definitions
- [ ] Candidate generation Phase A
- [ ] Per-account research Phase B (parallel execution)
- [ ] F/D/W classification engine (rule + LLM hybrid)
- [ ] Composite scoring with reasoning
- [ ] Source attribution logging
- [ ] Campaign dashboard with Realtime updates
- [ ] Account inspector page
- [ ] xlsx generation (multi-tab workbook)
- [ ] Caching layer (30-day account cache)
- [ ] **Internal eval: run Scout on 10 test ICPs, manually grade output quality**

### Phase 3: Outreach Agent + Deep Dives (Week 6 to 7)

- [ ] Deep-dive selection UI
- [ ] Opus 4.5 deep-dive flow
- [ ] Decision maker extraction
- [ ] Email pattern prediction + Hunter verification (if BYOK)
- [ ] Outreach Agent system prompt + per-tier calibration
- [ ] Per-persona generation (email, LinkedIn, call, objections)
- [ ] docx generation (per-account outreach kit)
- [ ] pdf generation (campaign brief)
- [ ] Outreach kit preview in app
- [ ] **Internal eval: run Outreach on 10 deep-dive accounts, manually grade**

### Phase 4: HubSpot push + BYOK + Signal Layer (Week 8 to 9)

- [ ] HubSpot custom property creation on connect
- [ ] Push account to HubSpot (single + bulk)
- [ ] HubSpot company match logic (domain + fuzzy name)
- [ ] BYOK key management UI
- [ ] Apollo / Hunter / Clay / Sales Navigator integrations
- [ ] Encrypted key storage
- [ ] Signal Layer cron jobs (Tier 2 quarterly, Tier 3 weekly)
- [ ] Signal diff detection
- [ ] Weekly email digest (Tier 3)
- [ ] Zapier webhook out (Tier 3 only)

### Phase 5: Polish + Launch prep (Week 10 to 12)

- [ ] Onboarding email sequence (Day 1, 3, 7, 14)
- [ ] Cancellation flow with retention offer
- [ ] Quota dashboard
- [ ] Help docs (10 to 15 articles, Notion or Mintlify)
- [ ] In-app empty states with example campaigns
- [ ] Marketing site at revenueradar.digitalflowconsulting.ca with full DFC brand system
- [ ] Landing page copy + Lighthouse score >= 95
- [ ] ToS + privacy policy (lawyer-reviewed)
- [ ] Beta cohort onboarded: Patrick (AG Business), P4G, Neucleus, Volta TBD
- [ ] 2-week beta feedback collection
- [ ] Iterate on top 3 feedback themes
- [ ] Public launch + LinkedIn announcement series
- [ ] Free Breeze ROI Audit lead magnet (post-launch)

## 14. Open decisions

- [x] **Pricing structure final-final.** Locked at $39/$129/$349. Starter tier reduced from 25 to 20 accounts/mo per May 16 decision.
- [x] **Domain.** Subdomain of digitalflowconsulting.ca: revenueradar.digitalflowconsulting.ca.
- [x] **Marketing site placement.** Under DFC subdomain, full DigitalFlow brand system.
- [ ] **Legal consultation booked on scraping approach.** Non-blocking for Phase 1-2 but must be resolved before public launch (Phase 5).
- [ ] **Stripe account status for DigitalFlow Consulting Inc.** Chase business account in progress. Phase 1 Stripe wiring uses placeholders until keys land.
- [ ] **Beta cohort: 4th name confirmed.** Patrick, P4G, Neucleus locked; need one Volta Labs founder or equivalent outside-network candidate.
- [ ] **HubSpot App Marketplace listing.** Confirm: in Phase 5, yes/no.

## 15. Research running in parallel with build

- [ ] Email pattern accuracy benchmark (test on 100 known emails, measure prediction rate)
- [ ] Per-account API cost validation (measure actual costs during Phase 2)
- [ ] HubSpot Solutions Partner application processing (submit Phase 1, approves during Phase 2-3)
- [ ] ToS draft started (does not need lawyer yet, only on review)
- [ ] Privacy policy draft, especially re: BYOK data handling and scraping disclosure
- [ ] Mira Media partnership conversation (no build dependency)
- [ ] HubSpot Breeze hands-on test

## 16. Out of scope for v1

- Salesforce integration (HubSpot only in v1)
- Pipedrive, Zoho, other CRMs (HubSpot only)
- Auto-send email (manual export only; legal and reputation risk)
- Real-time signal monitoring (quarterly/weekly only)
- Mobile app (responsive web only)
- Multi-language (English only)
- Multi-currency (CAD only, USD shown in copy where useful)
- Team workspaces beyond 3 seats on Tier 3 (no enterprise SSO yet)
- API access for end users (Zapier webhook out only)
- White-label resale (single brand only in v1, agency white-label deferred to v1.1)
- Twitter/X scraping for signals
- Custom F/D/W tier definitions (locked thresholds in v1)
- Custom persona definitions beyond the 6 in the C-suite framework
- Custom report templates (xlsx/docx/pdf structure is fixed in v1)
- Win-pattern feedback loop (Tier 3 spec, deferred to v1.1)

## 17. Constraints (the don'ts)

- **No em dashes anywhere.** Use commas, semicolons, or parentheses. Hard rule per Irene's preference. (Stricter than the brand system, which allows them in display headers. Revenue Radar follows the stricter rule everywhere, including display headers and code comments.)
- **Revenue Radar is a DigitalFlow Consulting product.** Use full DFC brand system: warm orange #FFA74F, sage greens, cream backgrounds, atmospheric blurred blobs, dark green footer band, orange-emphasis headlines. Branded as 'Revenue Radar by DigitalFlow Consulting' in product UI, footer, marketing site, and all generated outputs (xlsx, docx, pdf).
- **No AI-generated stock imagery.** Real screenshots or clean illustrations only.
- **No 'AI-powered' marketing language.** Lead with outcomes and methodology, not the AI angle.
- **No credit-based pricing language anywhere.** Always 'flat monthly', 'unlimited', or specific account counts.
- **No LinkedIn direct scraping.** PhantomBuster + user-provided keys only at Tier 2+.
- **No Google OAuth or social providers.** Email/password + magic link only (Irene 2026-05-18, matching the Insider Hub policy after Google caused account fragmentation). The original plan called for the opposite; this overrides it.
- **No autonomous send.** Outreach is generation only, user copies/pastes to their own tool.
- **No mocked data in beta or public launch.** If a data source fails, the app must explain (with the source citation pattern) what couldn't be retrieved.
- **Source attribution is non-negotiable.** Every data point in every output must have a citable source URL.

## 18. Acceptance criteria (v1 ships when)

- [ ] All Section 13 phase tasks complete
- [ ] All 4 onboarding steps work end-to-end
- [ ] User can create a campaign, run Scout, see results in dashboard, select 5 deep dives, run Outreach, download all 3 file formats
- [ ] HubSpot OAuth + custom property creation + per-account push working
- [ ] Stripe checkout + portal + webhook lifecycle working for all 3 tiers, monthly and annual
- [ ] Every account in output has source citations
- [ ] F/D/W classification matches manual classification on 18/20 test accounts
- [ ] Scout Agent run on 50 accounts completes in <10 min
- [ ] Outreach Agent run on 5 accounts x 3 personas completes in <5 min
- [ ] Unit economics measured on 5 test users match Section 12 projections within 20%
- [ ] All 4 beta clients onboarded and ran >=1 campaign
- [ ] Top 3 beta feedback themes addressed
- [ ] ToS + privacy policy live and lawyer-reviewed
- [ ] Lighthouse score >= 90 on marketing site (95 on landing page)
- [ ] No P1 bugs in Sentry for 7 days pre-launch
- [ ] Subscription cancel flow + retention offer working
- [ ] HubSpot Solutions Partner status approved

## 19. Open questions to flag during build

Claude Code should surface these in chat (not guess) if encountered:

- HubSpot App credentials for the Public App (created during Phase 1 after Solutions Partner approval)
- Stripe API keys (live + test) once DFC Inc. account is unlocked (Chase pending)
- Resend API key + verified sending domain
- Exa, Firecrawl, BuiltWith, Crunchbase API keys
- Sentry DSN, Posthog API key
- Production database connection string (Supabase project URL + service role key)
- Cron secret for Inngest signed requests
- Final ToS + privacy policy text from lawyer review
- Marketing site final copy (landing page, pricing page, about page)
- OG image assets (1200x630 PNG for each shareable page)
- Logo files in SVG + PNG at multiple resolutions (Phase 1 uses the DigitalFlow Consulting logo until Revenue Radar gets its own)
- Brand color final values if any deviation from parent doc spec
