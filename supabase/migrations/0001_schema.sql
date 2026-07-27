-- ===========================================================================
-- abbas.gfixdigital.com — schema
--
-- Run this whole file once in the Supabase SQL editor
-- (Dashboard > SQL Editor > New query > paste > Run).
--
-- Safe to re-run: every statement is idempotent.
-- ===========================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Shared trigger: keep updated_at honest
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profile — single row
-- ---------------------------------------------------------------------------

create table if not exists public.profile (
  id            uuid primary key default gen_random_uuid(),
  name          text not null default '',
  title         text not null default '',
  full_title    text not null default '',
  tagline       text not null default '',
  short_bio     text not null default '',
  long_bio      jsonb not null default '[]'::jsonb,
  founding_story jsonb not null default '[]'::jsonb,
  location      text not null default '',
  email         text not null default '',
  phone         text not null default '',
  headshot_url  text,
  portrait_url  text,
  cv_url        text,
  company       text not null default '',
  company_url   text not null default '',
  availability  text not null default '',
  published     boolean not null default true,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- metrics
-- ---------------------------------------------------------------------------

create table if not exists public.metrics (
  id         uuid primary key default gen_random_uuid(),
  label      text not null,
  value      int not null default 0,
  suffix     text not null default '',
  track      text not null default 'studio' check (track in ('studio','academy')),
  note       text not null default '',
  published  boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- services
-- ---------------------------------------------------------------------------

create table if not exists public.services (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text not null unique,
  description text not null default '',
  icon_name   text not null default 'Palette',
  features    jsonb not null default '[]'::jsonb,
  track       text not null default 'studio' check (track in ('studio','academy')),
  published   boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- case_studies
-- ---------------------------------------------------------------------------

create table if not exists public.case_studies (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text not null unique,
  client          text not null default '',
  category        text not null default '',
  eyebrow         text not null default '',
  year            text not null default '',
  summary         text not null default '',
  brief           text not null default '',
  solution        text not null default '',
  result          text not null default '',
  cover_image_url text,
  gallery         jsonb not null default '[]'::jsonb,
  tech_used       jsonb not null default '[]'::jsonb,
  live_url        text,
  featured        boolean not null default false,
  track           text not null default 'studio' check (track in ('studio','academy')),
  published       boolean not null default true,
  sort_order      int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists case_studies_category_idx on public.case_studies (category);

-- ---------------------------------------------------------------------------
-- testimonials
-- ---------------------------------------------------------------------------

create table if not exists public.testimonials (
  id               uuid primary key default gen_random_uuid(),
  quote            text not null,
  author_name      text not null,
  author_title     text not null default '',
  author_company   text,
  author_photo_url text,
  published        boolean not null default true,
  sort_order       int not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- experience
-- ---------------------------------------------------------------------------

create table if not exists public.experience (
  id           uuid primary key default gen_random_uuid(),
  organisation text not null,
  role         text not null,
  start_date   date not null,
  end_date     date,
  is_current   boolean not null default false,
  location     text not null default '',
  description  text not null default '',
  bullets      jsonb not null default '[]'::jsonb,
  track        text not null default 'studio' check (track in ('studio','academy','community')),
  published    boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- education
-- ---------------------------------------------------------------------------

create table if not exists public.education (
  id            uuid primary key default gen_random_uuid(),
  institution   text not null,
  qualification text not null,
  start_year    text not null default '',
  end_year      text not null default '',
  is_current    boolean not null default false,
  note          text,
  published     boolean not null default true,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- certifications
-- ---------------------------------------------------------------------------

create table if not exists public.certifications (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  issuer         text not null default '',
  year           text not null default '',
  description    text not null default '',
  credential_url text,
  published      boolean not null default true,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- awards
-- ---------------------------------------------------------------------------

create table if not exists public.awards (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  issuer          text not null default '',
  year            text not null default '',
  description     text not null default '',
  certificate_url text,
  published       boolean not null default true,
  sort_order      int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- skill_groups
-- ---------------------------------------------------------------------------

create table if not exists public.skill_groups (
  id         uuid primary key default gen_random_uuid(),
  "group"    text not null,
  icon_name  text not null default 'Palette',
  skills     jsonb not null default '[]'::jsonb,
  published  boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- clients
-- ---------------------------------------------------------------------------

create table if not exists public.clients (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  context    text not null default '',
  url        text,
  logo_url   text,
  published  boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- partners
-- ---------------------------------------------------------------------------

create table if not exists public.partners (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    text not null default '',
  description text not null default '',
  logo_url    text,
  url         text,
  published   boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- gallery_items
--
-- While this table is empty the gallery page falls back to case study cover
-- images, so the page is never blank on a fresh install.
-- ---------------------------------------------------------------------------

create table if not exists public.gallery_items (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  category   text not null default '',
  caption    text not null default '',
  image_url  text not null,
  published  boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists gallery_items_category_idx
  on public.gallery_items (category);

-- ---------------------------------------------------------------------------
-- speaking
-- ---------------------------------------------------------------------------

create table if not exists public.speaking (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  event       text not null default '',
  organiser   text not null default '',
  year        text not null default '',
  type        text not null default '',
  description text not null default '',
  url         text,
  published   boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- posts
-- ---------------------------------------------------------------------------

create table if not exists public.posts (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text not null unique,
  excerpt         text not null default '',
  body            jsonb not null default '[]'::jsonb,
  tags            jsonb not null default '[]'::jsonb,
  cover_image_url text,
  published_at    date not null default current_date,
  reading_minutes int not null default 3,
  published       boolean not null default false,
  sort_order      int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- social_links
-- ---------------------------------------------------------------------------

create table if not exists public.social_links (
  id         uuid primary key default gen_random_uuid(),
  platform   text not null,
  url        text not null,
  icon_name  text not null default 'Globe',
  handle     text not null default '',
  published  boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- contact_messages — public insert, admin read
-- ---------------------------------------------------------------------------

create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  subject    text not null default '',
  message    text not null,
  read       boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contact_messages_created_idx
  on public.contact_messages (created_at desc);

-- ---------------------------------------------------------------------------
-- newsletter_subscribers
-- ---------------------------------------------------------------------------

create table if not exists public.newsletter_subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  confirmed     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- site_settings — single row
-- ---------------------------------------------------------------------------

create table if not exists public.site_settings (
  id               uuid primary key default gen_random_uuid(),
  meta_title       text not null default '',
  meta_description text not null default '',
  og_image_url     text,
  footer_text      text not null default '',
  published        boolean not null default true,
  sort_order       int not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ===========================================================================
-- Upgrade path for databases created by an earlier version of this site.
--
-- `create table if not exists` above leaves pre-existing tables untouched, so
-- the columns added since v1 are applied explicitly here. Every statement is
-- a no-op on a fresh database.
-- ===========================================================================

alter table public.profile
  add column if not exists full_title     text not null default '',
  add column if not exists founding_story jsonb not null default '[]'::jsonb,
  add column if not exists company        text not null default '',
  add column if not exists company_url    text not null default '',
  add column if not exists availability   text not null default '';

alter table public.metrics
  add column if not exists track text not null default 'studio',
  add column if not exists note  text not null default '';

alter table public.services
  add column if not exists track text not null default 'studio';

alter table public.case_studies
  add column if not exists eyebrow  text not null default '',
  add column if not exists featured boolean not null default false,
  add column if not exists track    text not null default 'studio';

alter table public.experience
  add column if not exists location text not null default '',
  add column if not exists track    text not null default 'studio';

alter table public.social_links
  add column if not exists handle text not null default '';

alter table public.site_settings
  add column if not exists published   boolean not null default true,
  add column if not exists sort_order  int not null default 0,
  add column if not exists booking_url text;

alter table public.contact_messages
  add column if not exists updated_at timestamptz not null default now();

-- Track constraints are added separately so they survive the additive alters
-- above without failing when the column already existed unconstrained.
do $$
begin
  alter table public.metrics
    add constraint metrics_track_check check (track in ('studio','academy'));
exception when duplicate_object then null;
end $$;

do $$
begin
  alter table public.services
    add constraint services_track_check check (track in ('studio','academy'));
exception when duplicate_object then null;
end $$;

do $$
begin
  alter table public.case_studies
    add constraint case_studies_track_check check (track in ('studio','academy'));
exception when duplicate_object then null;
end $$;

do $$
begin
  alter table public.experience
    add constraint experience_track_check
    check (track in ('studio','academy','community'));
exception when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- updated_at triggers for every table
-- ---------------------------------------------------------------------------

do $$
declare
  t text;
  tables text[] := array[
    'profile','metrics','services','case_studies','testimonials','experience',
    'education','certifications','awards','skill_groups','clients','speaking',
    'posts','social_links','contact_messages','newsletter_subscribers',
    'site_settings','partners','gallery_items'
  ];
begin
  foreach t in array tables loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format(
      'create trigger set_updated_at before update on public.%I
       for each row execute function public.set_updated_at()', t);
  end loop;
end $$;
