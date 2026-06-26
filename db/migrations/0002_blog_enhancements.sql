-- ────────────────────────────────────────────────────────────────────────────
--  Konstructz blog admin — enhancements
--
--  Adds tags, scheduling, and a "scheduled" status, then updates the public
--  read policy so scheduled posts surface automatically once their time passes.
--
--  Run AFTER 0001_blog_schema.sql in the Supabase SQL editor.
--  Idempotent: safe to re-run.
-- ────────────────────────────────────────────────────────────────────────────

-- ── new columns ──────────────────────────────────────────────────────────────
alter table public.blog_posts
  add column if not exists tags         text[] not null default '{}',
  add column if not exists scheduled_at timestamptz;

-- ── widen the status check to allow 'scheduled' ──────────────────────────────
alter table public.blog_posts
  drop constraint if exists blog_posts_status_check;
alter table public.blog_posts
  add  constraint blog_posts_status_check
       check (status in ('draft', 'scheduled', 'published'));

-- helps the public query that filters scheduled posts by time
create index if not exists blog_posts_scheduled_at_idx
  on public.blog_posts (scheduled_at)
  where status = 'scheduled';

-- ── public read policy: published OR a scheduled post whose time has arrived ──
-- This is the security backstop. Even though the client also filters, RLS
-- guarantees a draft or future-scheduled post can never be read by visitors.
drop policy if exists "Public: read published posts" on public.blog_posts;
create policy "Public: read published posts"
  on public.blog_posts for select
  using (
    status = 'published'
    or (status = 'scheduled' and scheduled_at is not null and scheduled_at <= now())
  );
