-- ────────────────────────────────────────────────────────────────────────────
--  Konstructz ecommerce — leads / contact messages
--
--  Run this in the Supabase SQL editor (Dashboard → SQL → New query → Run).
--  Idempotent: safe to re-run. Requires 0001_blog_schema.sql to have run first
--  (it provides public.is_admin() and public.touch_updated_at()).
--
--  Every message a visitor sends (contact/quote form or the chat assistant) is
--  stored here. Anyone may INSERT a lead (so the public form works), but only
--  an admin session may read, update or delete them — same model as products.
-- ────────────────────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  -- where it came from
  source              text not null default 'contact-form',  -- 'contact-form' | 'chat'
  source_page         text,

  -- who
  name                text,
  company             text,
  email               text,
  phone               text,
  location            text,
  language            text,

  -- what they want
  interest_type       text,          -- 'general' | 'product' | 'attachment'
  product_interest    text,
  product_url         text,
  message             text,
  transcript_summary  text,

  -- admin workflow
  status              text not null default 'new'
                        check (status in ('new','read','archived')),
  handled_by          text
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx     on public.leads (status);

drop trigger if exists leads_touch_updated_at on public.leads;
create trigger leads_touch_updated_at
  before update on public.leads
  for each row execute function public.touch_updated_at();

alter table public.leads enable row level security;

-- Anyone (even anonymous visitors) may submit a message.
drop policy if exists "Public: submit leads" on public.leads;
create policy "Public: submit leads"
  on public.leads for insert
  to anon, authenticated
  with check ( true );

-- Only admins may read the inbox.
drop policy if exists "Admin: read leads" on public.leads;
create policy "Admin: read leads"
  on public.leads for select
  using ( public.is_admin() );

-- Only admins may change status / assign.
drop policy if exists "Admin: update leads" on public.leads;
create policy "Admin: update leads"
  on public.leads for update
  using ( public.is_admin() )
  with check ( public.is_admin() );

-- Only admins may delete.
drop policy if exists "Admin: delete leads" on public.leads;
create policy "Admin: delete leads"
  on public.leads for delete
  using ( public.is_admin() );
