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
