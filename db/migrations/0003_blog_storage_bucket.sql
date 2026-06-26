-- ────────────────────────────────────────────────────────────────────────────
--  Konstructz blog admin — Storage bucket
--
--  Creates the public Supabase Storage bucket used by the admin post editor.
--  Run this in the Supabase SQL editor after 0001_blog_schema.sql.
--  Idempotent: safe to re-run.
-- ────────────────────────────────────────────────────────────────────────────

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'blog-images',
  'blog-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- The upload/update/delete RLS policies for this bucket live in 0001_blog_schema.sql.
