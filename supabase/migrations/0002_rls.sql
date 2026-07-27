-- ===========================================================================
-- Row Level Security
--
-- Model:
--   anon           SELECT only, and only rows where published = true
--   authenticated  full read/write on content tables (single admin account)
--   contact_messages  anon INSERT only; read and update restricted to admin
--   newsletter_subscribers  anon INSERT only; no anon read at all
--
-- Run after 0001_schema.sql. Safe to re-run.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- Clear every existing policy first.
--
-- A database created by an earlier version of this site carries policies under
-- different names. Dropping by name would leave those in place, and a stale
-- permissive policy is additive in Postgres, so it would silently keep granting
-- access this file is meant to remove. Wiping by catalogue is the only way to
-- make this file authoritative.
-- ---------------------------------------------------------------------------

do $$
declare
  r record;
  managed text[] := array[
    'profile','metrics','services','case_studies','testimonials','experience',
    'education','certifications','awards','skill_groups','clients','speaking',
    'posts','social_links','site_settings','contact_messages',
    'newsletter_subscribers','partners','gallery_items'
  ];
begin
  for r in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public' and tablename = any(managed)
  loop
    execute format(
      'drop policy if exists %I on %I.%I',
      r.policyname, r.schemaname, r.tablename);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Content tables: public read of published rows, admin write
-- ---------------------------------------------------------------------------

do $$
declare
  t text;
  content_tables text[] := array[
    'profile','metrics','services','case_studies','testimonials','experience',
    'education','certifications','awards','skill_groups','clients','speaking',
    'posts','social_links','site_settings','partners','gallery_items'
  ];
begin
  foreach t in array content_tables loop
    -- Skip anything not present, so this file can be re-run against a database
    -- that is mid-upgrade without aborting the whole transaction.
    if not exists (
      select 1 from information_schema.tables
      where table_schema = 'public' and table_name = t
    ) then
      raise notice 'skipping %, table not present', t;
      continue;
    end if;

    execute format('alter table public.%I enable row level security', t);

    execute format('drop policy if exists "public reads published" on public.%I', t);
    execute format(
      'create policy "public reads published" on public.%I
         for select to anon, authenticated
         using (published = true)', t);

    -- Authenticated admin can see everything, including unpublished drafts.
    execute format('drop policy if exists "admin reads all" on public.%I', t);
    execute format(
      'create policy "admin reads all" on public.%I
         for select to authenticated
         using (true)', t);

    execute format('drop policy if exists "admin inserts" on public.%I', t);
    execute format(
      'create policy "admin inserts" on public.%I
         for insert to authenticated
         with check (true)', t);

    execute format('drop policy if exists "admin updates" on public.%I', t);
    execute format(
      'create policy "admin updates" on public.%I
         for update to authenticated
         using (true) with check (true)', t);

    execute format('drop policy if exists "admin deletes" on public.%I', t);
    execute format(
      'create policy "admin deletes" on public.%I
         for delete to authenticated
         using (true)', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- contact_messages: anyone may submit, only the admin may read
-- ---------------------------------------------------------------------------

alter table public.contact_messages enable row level security;

drop policy if exists "anyone can submit" on public.contact_messages;
create policy "anyone can submit" on public.contact_messages
  for insert to anon, authenticated
  with check (true);

drop policy if exists "admin reads messages" on public.contact_messages;
create policy "admin reads messages" on public.contact_messages
  for select to authenticated
  using (true);

drop policy if exists "admin updates messages" on public.contact_messages;
create policy "admin updates messages" on public.contact_messages
  for update to authenticated
  using (true) with check (true);

drop policy if exists "admin deletes messages" on public.contact_messages;
create policy "admin deletes messages" on public.contact_messages
  for delete to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- newsletter_subscribers: insert-only for the public. Deliberately no anon
-- SELECT policy, so the subscriber list cannot be enumerated with the anon key.
-- ---------------------------------------------------------------------------

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "anyone can subscribe" on public.newsletter_subscribers;
create policy "anyone can subscribe" on public.newsletter_subscribers
  for insert to anon, authenticated
  with check (true);

drop policy if exists "admin reads subscribers" on public.newsletter_subscribers;
create policy "admin reads subscribers" on public.newsletter_subscribers
  for select to authenticated
  using (true);

drop policy if exists "admin deletes subscribers" on public.newsletter_subscribers;
create policy "admin deletes subscribers" on public.newsletter_subscribers
  for delete to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- Storage: media bucket, public read, authenticated write
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'media');

drop policy if exists "media admin upload" on storage.objects;
create policy "media admin upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media');

drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'media');

drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media');
