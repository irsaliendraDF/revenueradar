-- Tracks whether the user has dismissed the onboarding welcome screen.
-- Null = show welcome on next /onboarding visit. Timestamp = they've seen it.

alter table profiles
  add column if not exists onboarding_welcome_seen_at timestamptz;
