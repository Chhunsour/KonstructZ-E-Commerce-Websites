-- ────────────────────────────────────────────────────────────────────────────
--  Fix: infinite recursion in is_admin()  →  Postgres error 54001
--       ("stack depth limit exceeded")
--
--  is_admin() reads public.admins, but public.admins has RLS policies that call
--  is_admin() in their USING clause — so every call recurses until the stack
--  blows. This surfaced as "Upload failed: database error, code: 54001" (the
--  blog-images storage policy is gated by is_admin()), but it breaks every
--  admin write (publish/update/delete) the same way.
--
--  Making the function SECURITY DEFINER runs its body as the function owner, so
--  the inner read of public.admins bypasses RLS and the recursion stops. The
--  empty search_path + fully-qualified names is the standard Supabase hardening
--  against search_path hijacking.
--
--  Run in the Supabase SQL editor. Idempotent: safe to re-run.
-- ────────────────────────────────────────────────────────────────────────────

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where email = auth.email()
  );
$$;
