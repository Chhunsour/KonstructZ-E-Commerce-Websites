-- Combined product migrations (0005 + 0006 + 0007). Run once in the Supabase SQL editor.

-- ────────────────────────────────────────────────────────────────────────────
--  Konstructz ecommerce — product management schema
--
--  Run this in the Supabase SQL editor (Dashboard → SQL → New query → Run).
--  Idempotent: safe to re-run. Requires 0001_blog_schema.sql to have run first
--  (it provides public.admins, public.is_admin(), public.touch_updated_at()).
--
--  Design note — "hybrid" model:
--    Everything queryable lives in typed columns on `products`. Variable-length
--    collections (gallery, extra spec rows, compatible attachments) are stored
--    as JSONB so the MVP stays simple. The reusable names product_images /
--    product_specs / product_attachments are reserved for a future fully
--    normalized system; those JSONB columns map cleanly into them later.
-- ────────────────────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- ── product categories ──────────────────────────────────────────────────────
create table if not exists public.product_categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  singular    text,
  brand       text,
  description text,
  image       text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- ── products ────────────────────────────────────────────────────────────────
create table if not exists public.products (
  id                     uuid primary key default gen_random_uuid(),
  slug                   text not null unique,
  name                   text not null,
  brand                  text,
  category_id            uuid references public.product_categories(id) on delete set null,
  -- which catalog this belongs to — drives button behavior & public routing
  product_line           text not null default 'konstructz'
                           check (product_line in ('konstructz','typhon')),
  product_type           text not null default 'equipment'
                           check (product_type in ('equipment','attachment')),

  -- content
  short_description      text,
  full_description       text not null default '',   -- sanitized markdown/HTML
  featured_image         text,
  gallery_images         jsonb not null default '[]'::jsonb,

  -- commerce
  price                  text,
  sale_price             text,
  sku                    text,
  gtin                   text,
  stock_status           text,
  condition              text,

  -- typed specs
  engine                 text,
  horsepower             text,
  operating_weight       text,
  lift_capacity          text,
  digging_depth          text,
  width                  text,
  height                 text,
  length                 text,
  fuel_type              text,
  machine_type           text,
  extra_specs            jsonb not null default '[]'::jsonb,  -- [{label,value}]
  compatible_attachments jsonb not null default '[]'::jsonb,  -- [string|{name,url}]

  -- info blocks
  warranty_info          text,
  shipping_info          text,
  financing_info         text,

  -- call to action
  button_text            text,
  button_url             text,

  -- seo
  seo_title              text,
  seo_description        text,
  seo_keywords           text,

  -- lifecycle
  status                 text not null default 'draft'
                           check (status in ('draft','published','hidden')),
  sort_order             int not null default 0,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  published_at           timestamptz,
  created_by             text,
  updated_by             text
);

create index if not exists products_slug_idx          on public.products (slug);
create index if not exists products_status_idx         on public.products (status, updated_at desc);
create index if not exists products_category_idx       on public.products (category_id);
create index if not exists products_product_line_idx   on public.products (product_line);

-- keep updated_at fresh on every UPDATE (reuse blog's trigger function)
drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
  before update on public.products
  for each row execute function public.touch_updated_at();

-- ── row-level security ──────────────────────────────────────────────────────
alter table public.products           enable row level security;
alter table public.product_categories enable row level security;

-- Public visitors: only published products (draft/hidden never leak).
drop policy if exists "Public: read published products" on public.products;
create policy "Public: read published products"
  on public.products for select
  using ( status = 'published' );

-- Admins: full access to products.
drop policy if exists "Admin: full products access" on public.products;
create policy "Admin: full products access"
  on public.products for all
  using ( public.is_admin() )
  with check ( public.is_admin() );

-- Public can read the category list; only admins write.
drop policy if exists "Public: read product categories" on public.product_categories;
create policy "Public: read product categories"
  on public.product_categories for select
  using ( true );

drop policy if exists "Admin: write product categories" on public.product_categories;
create policy "Admin: write product categories"
  on public.product_categories for all
  using ( public.is_admin() )
  with check ( public.is_admin() );

-- ============================================================

-- ────────────────────────────────────────────────────────────────────────────
--  Konstructz product sync — multi-site distribution schema
--
--  Run this in the Supabase SQL editor (Dashboard → SQL → New query → Run)
--  AFTER 0005_product_schema.sql. Idempotent: safe to re-run. Requires
--  public.is_admin() and public.touch_updated_at() from earlier migrations.
--
--  What this adds — the "push once, fan out everywhere" model:
--    connected_websites        one row per e-commerce site that receives data
--    website_product_overrides per-site field overrides (custom price, etc.)
--    website_product_sync      current sync state for each (website, product)
--    sync_logs                 append-only history of every sync attempt
--    sync_settings             single-row global tuning (batch size, etc.)
--
--  Secrets (per-site tokens) live in connected_websites.secret_token. They are
--  readable only by admins (RLS below) and by the Edge Function via the service
--  role key. They are never exposed to anonymous/public visitors.
-- ────────────────────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- ── connected websites ──────────────────────────────────────────────────────
create table if not exists public.connected_websites (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  domain        text not null,
  -- full URL of the receiver endpoint, e.g. https://siteb.com/api/receiver.php
  sync_endpoint text not null,
  -- shared secret sent as the X-Sync-Token header; also generated for new sites
  secret_token  text not null default encode(gen_random_bytes(24), 'hex'),
  platform      text not null default 'konstructz-framework',
  active        boolean not null default true,
  last_sync_at  timestamptz,
  last_status   text,                 -- 'success' | 'partial' | 'failed' | null
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

drop trigger if exists connected_websites_touch on public.connected_websites;
create trigger connected_websites_touch
  before update on public.connected_websites
  for each row execute function public.touch_updated_at();

-- ── per-website product overrides ───────────────────────────────────────────
-- A non-null override column wins over the master value at push time, so a
-- normal sync never clobbers it. A "force" sync ignores overrides and pushes
-- the raw master values. enabled=false excludes the product from that site.
create table if not exists public.website_product_overrides (
  id                uuid primary key default gen_random_uuid(),
  website_id        uuid not null references public.connected_websites(id) on delete cascade,
  product_id        uuid not null references public.products(id) on delete cascade,
  enabled           boolean not null default true,
  price             text,
  sale_price        text,
  title             text,
  short_description text,
  full_description  text,
  featured_image    text,
  status            text,
  button_url        text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (website_id, product_id)
);

drop trigger if exists website_product_overrides_touch on public.website_product_overrides;
create trigger website_product_overrides_touch
  before update on public.website_product_overrides
  for each row execute function public.touch_updated_at();

create index if not exists wpo_website_idx on public.website_product_overrides (website_id);
create index if not exists wpo_product_idx on public.website_product_overrides (product_id);

-- ── current sync state per (website, product) ───────────────────────────────
create table if not exists public.website_product_sync (
  id               uuid primary key default gen_random_uuid(),
  website_id       uuid not null references public.connected_websites(id) on delete cascade,
  product_id       uuid not null references public.products(id) on delete cascade,
  status           text not null default 'pending',   -- pending | success | failed
  last_synced_at   timestamptz,
  last_synced_hash text,            -- hash of the last payload pushed (skip if unchanged)
  last_error       text,
  retry_count      int not null default 0,
  unique (website_id, product_id)
);

create index if not exists wps_website_idx on public.website_product_sync (website_id);
create index if not exists wps_product_idx on public.website_product_sync (product_id);
create index if not exists wps_status_idx  on public.website_product_sync (status);

-- ── append-only sync log ────────────────────────────────────────────────────
create table if not exists public.sync_logs (
  id           uuid primary key default gen_random_uuid(),
  website_id   uuid references public.connected_websites(id) on delete set null,
  product_id   uuid references public.products(id) on delete set null,
  website_name text,
  product_name text,
  product_sku  text,
  sync_type    text not null,        -- full | price | images | descriptions
  status       text not null,        -- pending | success | failed
  error        text,
  retry_count  int not null default 0,
  created_at   timestamptz not null default now(),
  finished_at  timestamptz
);

create index if not exists sync_logs_created_idx on public.sync_logs (created_at desc);
create index if not exists sync_logs_status_idx  on public.sync_logs (status, created_at desc);
create index if not exists sync_logs_website_idx on public.sync_logs (website_id);

-- ── global settings (single row, id = 1) ────────────────────────────────────
create table if not exists public.sync_settings (
  id                int primary key default 1 check (id = 1),
  batch_size        int not null default 5,    -- products per HTTP request to a site
  concurrency       int not null default 3,    -- websites processed in parallel
  request_timeout_s int not null default 60,   -- per-request timeout
  compress_images   boolean not null default true,
  updated_at        timestamptz not null default now()
);

insert into public.sync_settings (id) values (1)
  on conflict (id) do nothing;

drop trigger if exists sync_settings_touch on public.sync_settings;
create trigger sync_settings_touch
  before update on public.sync_settings
  for each row execute function public.touch_updated_at();

-- ── row-level security: admins only, everything ─────────────────────────────
alter table public.connected_websites        enable row level security;
alter table public.website_product_overrides enable row level security;
alter table public.website_product_sync      enable row level security;
alter table public.sync_logs                 enable row level security;
alter table public.sync_settings             enable row level security;

do $$
declare t text;
begin
  foreach t in array array[
    'connected_websites','website_product_overrides',
    'website_product_sync','sync_logs','sync_settings'
  ]
  loop
    execute format('drop policy if exists "Admin: full %1$s access" on public.%1$s', t);
    execute format(
      'create policy "Admin: full %1$s access" on public.%1$s
         for all using ( public.is_admin() ) with check ( public.is_admin() )', t);
  end loop;
end $$;

-- The Edge Function uses the service role key and bypasses RLS entirely, so it
-- can read secret_token and write logs without a user session. No public/anon
-- policy exists for any of these tables — sync data is admin-only.

-- ============================================================

-- ────────────────────────────────────────────────────────────────────────────
--  Product image imports — local image cache metadata
--
--  Run after 0005_product_schema.sql. Idempotent: safe to re-run.
--  The static CSV importer stores its local cache in scripts/image-imports.json;
--  this table mirrors the same metadata for Supabase-backed product repair runs.
-- ────────────────────────────────────────────────────────────────────────────

alter table public.products
  add column if not exists thumbnail_image text,
  add column if not exists image_import_warnings jsonb not null default '[]'::jsonb;

create table if not exists public.image_imports (
  id          uuid primary key default gen_random_uuid(),
  source_url  text not null unique,
  local_path  text not null,
  product_id  uuid references public.products(id) on delete set null,
  file_size   bigint,
  mime_type   text,
  imported_at timestamptz not null default now()
);

create index if not exists image_imports_product_idx on public.image_imports (product_id);
create index if not exists image_imports_imported_idx on public.image_imports (imported_at desc);

alter table public.image_imports enable row level security;

drop policy if exists "Admin: full image_imports access" on public.image_imports;
create policy "Admin: full image_imports access"
  on public.image_imports for all
  using ( public.is_admin() )
  with check ( public.is_admin() );
