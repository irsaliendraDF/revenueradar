-- Revenue Radar RLS policies
-- Every table is enabled and locked to the owning user.
-- Reads use auth.uid(); writes do the same. Service role bypasses RLS by default.

-- PROFILES
alter table profiles enable row level security;

create policy "profiles_select_own" on profiles
  for select to authenticated
  using (user_id = auth.uid());

create policy "profiles_update_own" on profiles
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Insert is handled by the on_auth_user_created trigger (security definer);
-- end users never insert directly.

-- USER_API_KEYS
alter table user_api_keys enable row level security;

create policy "user_api_keys_owner_all" on user_api_keys
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- CAMPAIGNS
alter table campaigns enable row level security;

create policy "campaigns_owner_all" on campaigns
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ACCOUNTS
alter table accounts enable row level security;

create policy "accounts_owner_all" on accounts
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- DECISION_MAKERS (no user_id column; check via parent account ownership)
alter table decision_makers enable row level security;

create policy "decision_makers_owner_select" on decision_makers
  for select to authenticated
  using (
    exists (
      select 1 from accounts
      where accounts.id = decision_makers.account_id
        and accounts.user_id = auth.uid()
    )
  );

create policy "decision_makers_owner_modify" on decision_makers
  for all to authenticated
  using (
    exists (
      select 1 from accounts
      where accounts.id = decision_makers.account_id
        and accounts.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from accounts
      where accounts.id = decision_makers.account_id
        and accounts.user_id = auth.uid()
    )
  );

-- OUTREACH_OUTPUTS (same pattern; check via parent account)
alter table outreach_outputs enable row level security;

create policy "outreach_outputs_owner_all" on outreach_outputs
  for all to authenticated
  using (
    exists (
      select 1 from accounts
      where accounts.id = outreach_outputs.account_id
        and accounts.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from accounts
      where accounts.id = outreach_outputs.account_id
        and accounts.user_id = auth.uid()
    )
  );

-- SIGNALS
alter table signals enable row level security;

create policy "signals_owner_all" on signals
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- CAMPAIGN_FILES
alter table campaign_files enable row level security;

create policy "campaign_files_owner_all" on campaign_files
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- USAGE_EVENTS (read-only for the user; writes happen via service role)
alter table usage_events enable row level security;

create policy "usage_events_owner_select" on usage_events
  for select to authenticated
  using (user_id = auth.uid());

-- HUBSPOT_SYNC_LOG (read-only for the user; writes happen via service role)
alter table hubspot_sync_log enable row level security;

create policy "hubspot_sync_log_owner_select" on hubspot_sync_log
  for select to authenticated
  using (user_id = auth.uid());
