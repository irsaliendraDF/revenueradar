-- Revenue Radar agent setup
-- Adds per-user defaults for Scout and Outreach so the dashboard can gate the
-- "Create your first campaign" CTA on both agents being set up.

alter table profiles
  add column if not exists scout_default_signals text[] default '{}',
  add column if not exists scout_default_exclusions text,
  add column if not exists scout_setup_completed_at timestamptz,
  add column if not exists outreach_value_prop text,
  add column if not exists outreach_proof_points jsonb default '[]'::jsonb,
  add column if not exists outreach_setup_completed_at timestamptz;
