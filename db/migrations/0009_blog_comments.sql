-- ────────────────────────────────────────────────────────────────────────────
--  Konstructz ecommerce — blog comments
--
--  Run this in the Supabase SQL editor (Dashboard → SQL → New query → Run).
--  Idempotent: safe to re-run. Requires 0001_blog_schema.sql to have run first
--  (it provides public.is_admin() and public.touch_updated_at()).
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists public.blog_comments (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  post_slug   text not null,
  name        text not null,
  email       text,
  message     text not null,
  avatar      text,
  parent_id   uuid references public.blog_comments(id) on delete cascade
);

create index if not exists blog_comments_post_slug_idx on public.blog_comments (post_slug);
create index if not exists blog_comments_parent_id_idx on public.blog_comments (parent_id);
create index if not exists blog_comments_created_at_idx on public.blog_comments (created_at asc);

alter table public.blog_comments enable row level security;

-- Anyone (including anonymous visitors) may read comments.
drop policy if exists "Public: read comments" on public.blog_comments;
create policy "Public: read comments"
  on public.blog_comments for select
  to anon, authenticated
  using ( true );

-- Anyone may submit a comment.
drop policy if exists "Public: submit comments" on public.blog_comments;
create policy "Public: submit comments"
  on public.blog_comments for insert
  to anon, authenticated
  with check ( true );

-- Only admins may update or delete comments.
drop policy if exists "Admin: manage comments" on public.blog_comments;
create policy "Admin: manage comments"
  on public.blog_comments for all
  to authenticated
  using ( public.is_admin() )
  with check ( public.is_admin() );
