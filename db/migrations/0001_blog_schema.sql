-- ────────────────────────────────────────────────────────────────────────────
--  Konstructz blog admin — Supabase schema
--
--  Run this in the Supabase SQL editor (Dashboard → SQL → New query → Run).
--  It is idempotent: safe to re-run during dev.
--
--  After this finishes:
--    1. Authentication → Providers → Email: keep "Confirm email" enabled or
--       turn it off if you want instant logins.
--    2. Authentication → Users → "Add user" — create your admin account.
--       (Your account email must match a row in `public.admins` to be allowed
--        to write posts.)
--    3. Storage → Create bucket → name: blog-images, public: YES.
-- ────────────────────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- ── categories ──────────────────────────────────────────────────────────────
create table if not exists public.blog_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  created_at  timestamptz not null default now()
);

-- ── posts ───────────────────────────────────────────────────────────────────
create table if not exists public.blog_posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  excerpt         text,
  content         text not null default '',
  featured_image  text,                         -- storage path OR full URL
  author          text,
  category_id     uuid references public.blog_categories(id) on delete set null,
  status          text not null default 'draft' check (status in ('draft','published')),
  seo_title       text,
  seo_description text,
  keywords        text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  published_at    timestamptz
);

create index if not exists blog_posts_status_published_at_idx
  on public.blog_posts (status, published_at desc);
create index if not exists blog_posts_category_idx
  on public.blog_posts (category_id);

-- keep updated_at fresh on every UPDATE
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists blog_posts_touch_updated_at on public.blog_posts;
create trigger blog_posts_touch_updated_at
  before update on public.blog_posts
  for each row execute function public.touch_updated_at();

-- ── admins (whitelist) ──────────────────────────────────────────────────────
-- A user can read/write posts only if their auth.email() is in this table.
create table if not exists public.admins (
  email       text primary key,
  created_at  timestamptz not null default now()
);

-- Helper: is the current session an admin?
create or replace function public.is_admin()
returns boolean language sql stable as $$
  select exists (
    select 1 from public.admins where email = auth.email()
  );
$$;

-- ── row-level security ──────────────────────────────────────────────────────
alter table public.blog_posts      enable row level security;
alter table public.blog_categories enable row level security;
alter table public.admins          enable row level security;

-- Public visitors: only published posts.
drop policy if exists "Public: read published posts" on public.blog_posts;
create policy "Public: read published posts"
  on public.blog_posts for select
  using ( status = 'published' );

-- Admins: full access to posts.
drop policy if exists "Admin: full posts access" on public.blog_posts;
create policy "Admin: full posts access"
  on public.blog_posts for all
  using ( public.is_admin() )
  with check ( public.is_admin() );

-- Public can read category list; only admins write.
drop policy if exists "Public: read categories" on public.blog_categories;
create policy "Public: read categories"
  on public.blog_categories for select
  using ( true );

drop policy if exists "Admin: write categories" on public.blog_categories;
create policy "Admin: write categories"
  on public.blog_categories for all
  using ( public.is_admin() )
  with check ( public.is_admin() );

-- Admins table is admin-only (and only an admin can promote another).
drop policy if exists "Admin: read admins" on public.admins;
create policy "Admin: read admins"
  on public.admins for select using ( public.is_admin() );
drop policy if exists "Admin: manage admins" on public.admins;
create policy "Admin: manage admins"
  on public.admins for all using ( public.is_admin() ) with check ( public.is_admin() );

-- ── storage policies (run AFTER you create the `blog-images` bucket) ───────
-- Public read for the bucket happens automatically when the bucket is "public".
-- These policies add admin-only write/delete:
drop policy if exists "Admin: upload blog images"  on storage.objects;
create policy "Admin: upload blog images"
  on storage.objects for insert
  with check ( bucket_id = 'blog-images' and public.is_admin() );

drop policy if exists "Admin: update blog images" on storage.objects;
create policy "Admin: update blog images"
  on storage.objects for update
  using ( bucket_id = 'blog-images' and public.is_admin() );

drop policy if exists "Admin: delete blog images" on storage.objects;
create policy "Admin: delete blog images"
  on storage.objects for delete
  using ( bucket_id = 'blog-images' and public.is_admin() );

-- ── seed categories (match the existing site) ──────────────────────────────
insert into public.blog_categories (name, slug) values
  ('Mini Excavator''s Blog', 'mini-excavator'),
  ('Skid Steer''s Blog',     'skid-steer'),
  ('Wheel Loader''s Blog',   'wheel-loader'),
  ('Forklift''s Blog',       'forklift'),
  ('Road Roller''s Blog',    'road-roller'),
  ('Scissor Lift''s Blog',   'scissor-lift'),
  ('Stone Crusher''s Blog',  'stone-crusher')
on conflict (slug) do nothing;
