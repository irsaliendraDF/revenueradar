-- Revenue Radar initial schema
-- Mirrors Section 7 of docs/BUILD_PLAN.md
-- Run order: this file first, then 20260518000002_rls_policies.sql
-- All tables: uuid PK with default, created_at/updated_at with defaults, updated_at trigger

set search_path = public;

-- Shared trigger for updated_at columns
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- PROFILES (extends supabase auth.users)
create table profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  company_name text,
  company_website text,
  product_one_liner text,
  pricing_model text,
  typical_deal_size_min integer,
  typical_deal_size_max integer,
  sales_motion text check (sales_motion in ('founder_led', 'small_team', 'full_team')),
  current_icp text,
  dream_customers jsonb default '[]'::jsonb,
  bad_fit_customers jsonb default '[]'::jsonb,
  fdw_target_tiers text[] default '{}',
  subscription_tier text check (subscription_tier in ('starter', 'growth', 'scale')),
  stripe_customer_id text unique,
  stripe_subscription_id text,
  hubspot_portal_id text,
  hubspot_refresh_token text,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_set_updated_at before update on profiles
  for each row execute function set_updated_at();

-- BYOK API keys
create table user_api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  provider text not null check (provider in ('apollo', 'hunter', 'clay', 'sales_nav')),
  encrypted_key text not null,
  added_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, provider)
);
create trigger user_api_keys_set_updated_at before update on user_api_keys
  for each row execute function set_updated_at();

-- CAMPAIGNS
create table campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  name text not null,
  goal text,
  target_geography text[] default '{}',
  target_industries text[] default '{}',
  employee_count_min integer,
  employee_count_max integer,
  revenue_min bigint,
  revenue_max bigint,
  fdw_tier text check (fdw_tier in ('fish', 'dolphin', 'whale')),
  target_personas text[] default '{}',
  prioritized_signals text[] default '{}',
  exclusion_list jsonb default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'running', 'completed', 'failed')),
  scout_started_at timestamptz,
  scout_completed_at timestamptz,
  outreach_started_at timestamptz,
  outreach_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index campaigns_user_id_idx on campaigns(user_id);
create index campaigns_status_idx on campaigns(status);
create trigger campaigns_set_updated_at before update on campaigns
  for each row execute function set_updated_at();

-- ACCOUNTS (per campaign)
create table accounts (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  user_id uuid not null references profiles(user_id) on delete cascade,
  company_name text not null,
  company_domain text,
  fdw_tier text check (fdw_tier in ('fish', 'dolphin', 'whale')),
  composite_fit_score integer check (composite_fit_score between 0 and 100),
  fit_reasoning text,
  top_signal text,
  recommended_next_action text,
  is_deep_dive boolean not null default false,
  profile_json jsonb,
  sources_json jsonb default '[]'::jsonb,
  last_refreshed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index accounts_campaign_id_idx on accounts(campaign_id);
create index accounts_user_id_idx on accounts(user_id);
create index accounts_company_domain_idx on accounts(company_domain);
create trigger accounts_set_updated_at before update on accounts
  for each row execute function set_updated_at();

-- DECISION MAKERS (per deep-dive account)
create table decision_makers (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  name text not null,
  role text,
  persona_bucket text check (persona_bucket in ('ceo', 'coo', 'cmo', 'cio_cto', 'vp_sales', 'director')),
  linkedin_search_url text,
  email_pattern text,
  email_confidence_score integer check (email_confidence_score between 0 and 100),
  email_verified boolean not null default false,
  source_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index decision_makers_account_id_idx on decision_makers(account_id);
create trigger decision_makers_set_updated_at before update on decision_makers
  for each row execute function set_updated_at();

-- OUTREACH OUTPUTS
create table outreach_outputs (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  persona_bucket text not null check (persona_bucket in ('ceo', 'coo', 'cmo', 'cio_cto', 'vp_sales', 'director')),
  email_sequence jsonb not null default '[]'::jsonb,
  linkedin_messages jsonb default '[]'::jsonb,
  call_talk_track jsonb,
  objections jsonb default '[]'::jsonb,
  why_now_narrative text,
  generated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index outreach_outputs_account_id_idx on outreach_outputs(account_id);
create trigger outreach_outputs_set_updated_at before update on outreach_outputs
  for each row execute function set_updated_at();

-- SIGNALS (running log)
create table signals (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  user_id uuid not null references profiles(user_id) on delete cascade,
  signal_type text not null,
  description text,
  source_url text,
  detected_at timestamptz not null default now(),
  user_dismissed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index signals_account_id_idx on signals(account_id);
create index signals_user_id_idx on signals(user_id);
create index signals_detected_at_idx on signals(detected_at desc);
create trigger signals_set_updated_at before update on signals
  for each row execute function set_updated_at();

-- GENERATED FILES
create table campaign_files (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  user_id uuid not null references profiles(user_id) on delete cascade,
  file_type text not null check (file_type in ('xlsx', 'docx', 'pdf')),
  storage_path text not null,
  generated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index campaign_files_campaign_id_idx on campaign_files(campaign_id);
create index campaign_files_user_id_idx on campaign_files(user_id);
create trigger campaign_files_set_updated_at before update on campaign_files
  for each row execute function set_updated_at();

-- USAGE LOG (rate limiting + audit)
create table usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  event_type text not null,
  cost_usd_cents integer not null default 0,
  metadata jsonb default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index usage_events_user_id_idx on usage_events(user_id);
create index usage_events_occurred_at_idx on usage_events(occurred_at desc);

-- HUBSPOT SYNC LOG
create table hubspot_sync_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(user_id) on delete cascade,
  account_id uuid not null references accounts(id) on delete cascade,
  hubspot_company_id text,
  fields_synced jsonb default '{}'::jsonb,
  synced_at timestamptz not null default now(),
  error_message text,
  created_at timestamptz not null default now()
);
create index hubspot_sync_log_user_id_idx on hubspot_sync_log(user_id);
create index hubspot_sync_log_account_id_idx on hubspot_sync_log(account_id);

-- Auto-create profile row on auth.users insert
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
