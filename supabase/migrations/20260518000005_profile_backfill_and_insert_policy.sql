-- Backfill profiles for any auth.users created before the on_auth_user_created
-- trigger existed, and add a defensive INSERT policy so the app can self-heal
-- if the trigger ever fails.

-- 1. Backfill missing profile rows
insert into profiles (user_id, full_name)
select au.id, coalesce(au.raw_user_meta_data->>'full_name', au.email)
from auth.users au
where not exists (select 1 from profiles p where p.user_id = au.id);

-- 2. Allow users to insert their own profile row (matches the trigger's effect
-- but lets the application layer self-heal if the trigger failed for any reason)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'profiles_insert_own'
  ) then
    create policy "profiles_insert_own" on profiles
      for insert to authenticated
      with check (user_id = auth.uid());
  end if;
end
$$;
