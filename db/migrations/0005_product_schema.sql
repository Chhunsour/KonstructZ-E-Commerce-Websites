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
