# Blog admin — setup & deployment guide

The Konstructz site ships with a self-contained blog admin dashboard that runs
on **Supabase** (auth + Postgres + image storage) and deploys as a static SPA
on **Hostinger**. Nothing else from the previous "main system" is involved.

This guide takes you from zero to a working admin in about 10 minutes.

---

## 1. Create a Supabase project (free tier is enough)

1. Sign up at <https://supabase.com> and create a new project.
   - Pick a strong database password (you won't need it day-to-day; just store it).
   - Choose the region closest to your visitors.
2. When the project is ready, open **Project Settings → API** and copy:
   - **Project URL** → looks like `https://abcdefgh.supabase.co`
   - **Project API keys → anon (public)** → a long `eyJ...` string

> The anon key is **safe to put in the client.** Row-level security (set up by
> the migration below) is what actually protects writes — only your admin
> account can create or edit posts.

---

## 2. Run the database migration

1. In the Supabase dashboard go to **SQL editor → New query**.
2. Open `db/migrations/0001_blog_schema.sql` from this repo, paste the entire
   contents into the editor, and click **Run**.

This creates `blog_posts`, `blog_categories`, and `admins` tables, sets up
row-level security so the public can only read **published** posts, and
seeds the existing category list. The migration is idempotent — safe to
re-run.

---

## 3. Create your admin user

### 3a. Insert the admin email into the database

Open **SQL editor → New query** and run:

```sql
insert into public.admins (email)
values ('sour@kiuq.com')
on conflict (email) do nothing;
```

This whitelists `sour@kiuq.com` so RLS lets it create, edit, and delete posts.
Anyone signed in *without* a matching row in `public.admins` will be blocked.
The `on conflict` clause makes it safe to re-run.

### 3b. Create the login password in Supabase

> **Do NOT hardcode the password in source code or expose the service-role key
> on the frontend.** The password is set exclusively through the Supabase
> Dashboard.

Follow these steps:

1. Go to the **Supabase Dashboard** for your project.
2. Open **Authentication → Users**.
3. Click **Add user**.
4. Email: `sour@kiuq.com`
5. Set a **strong password** manually.
6. Enable **Auto Confirm** if available (so you can log in immediately without
   an email confirmation step).
7. Click **Save** to create the user.
8. Log in at `/#/sour` using `sour@kiuq.com` and the password you just set.

### Forgot the password?

Reset it from **Supabase Dashboard → Authentication → Users** — find the user
row and update the password there. Do **not** add password-reset logic to the
website code.

---

## 4. Create the image storage bucket

1. **Storage → New bucket**
   - Name: `blog-images`
   - **Public bucket: ON** (so featured-image URLs work from any device)
2. The SQL migration already added admin-only write/delete policies, so the
   public can only read.

Featured images uploaded from the admin land here and the dashboard stores
the path (e.g. `1719312000000-my-photo.webp`). The public URL is generated
on the fly via the Supabase JS SDK.

---

## 5. Local development

In the repo root:

```bash
cp .env.example .env.local
# paste your Supabase URL and anon key into .env.local
npm install
npm run dev
```

Visit:

| URL                        | What it is                                     |
|----------------------------|------------------------------------------------|
| `http://localhost:5173/`   | Public site                                    |
| `http://localhost:5173/#/sour` | Hidden admin login                          |
| `http://localhost:5173/#/blog` | Public blog list (published posts only)     |

If the env vars are missing, the admin route shows a friendly "admin disabled"
screen and the public blog falls back to the static `src/data/blogPosts.ts`
list — the rest of the site keeps working.

---

## 6. Day-to-day use

1. Go to `/sour`, sign in.
2. Click **+ New post**:
   - Title, slug (auto-generated from title until you edit it), excerpt
   - **Content** — Markdown with a live preview tab
   - Featured image — upload directly from the editor
   - Category, author
   - SEO title, SEO description, keywords
3. Hit **Save draft** to keep working, or **Publish** to make it live.
4. **Unpublish** any time from the post list — drafts are never visible publicly.

Performance details that are already handled for you:
- The blog list query excludes `content` so payloads stay tiny.
- All blog images use `loading="lazy"` and the storage bucket serves them
  through Supabase's CDN.
- Upload WebP or AVIF when you can — the upload accepts both.

---

## 7. Deploy to Hostinger

Hostinger only needs the built static files. Supabase is a separate service
the site talks to over HTTPS.

1. **Set env vars in Hostinger** (hPanel → Hosting → Advanced → Environment
   Variables — Business plan and up):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - On shared/Premium plans without env-var UI: paste them into the build
     command in your CI, or inline them into `.env.production` before zipping
     the build output.
2. **Build locally** (or in CI):
   ```bash
   npm install
   npm run build
   ```
   The output is in `dist/`.
3. **Upload `dist/` to `public_html`** via hPanel → File Manager (or FTP).
   Replace whatever is currently there.
4. **SPA routing fix.** This app uses `HashRouter`, so URLs already work
   without any rewrite rules — `/#/sour`, `/#/blog/example-title`, etc. all
   resolve from `index.html`. No `.htaccess` needed.
5. (Optional) Add this to `public_html/robots.txt` so the hidden admin can't
   accidentally show up in search:
   ```
   User-agent: *
   Disallow: /sour
   ```
   The admin pages also send `noindex, nofollow, noarchive, nosnippet` as a
   meta tag (handled by `SeoManager`).

---

## 8. Security model — what protects what

| Layer | Protection |
|---|---|
| Hidden URL `/sour` | Not linked anywhere on the site, blocked by `robots.txt`, sends `noindex` meta. Defense-in-depth only — not the actual lock. |
| Supabase Auth | Real email/password login with JWT sessions stored in `localStorage` (key `konstructz-admin-auth`). Required before any admin route renders. |
| RLS — public reads | Visitors can only `SELECT` rows where `status = 'published'`. Drafts are invisible at the database level. |
| RLS — admin writes | `INSERT/UPDATE/DELETE` on posts/categories require `auth.email()` to exist in `public.admins`. Even a signed-in non-admin user is blocked. |
| Storage policies | Public read for the `blog-images` bucket; only admins can upload/update/delete. |

To revoke an admin: delete their row from `public.admins` (and optionally
disable the user in **Authentication → Users**).

---

## 9. Troubleshooting

- **"Supabase isn't configured"** in the login page → `.env.local` is missing
  or the Vite dev server wasn't restarted after editing it.
- **Login succeeds but every save returns "new row violates row-level
  security"** → your email isn't in `public.admins`. See step 3.
- **Uploaded image doesn't appear publicly** → the `blog-images` bucket
  isn't marked public. **Storage → blog-images → Settings → Public bucket: ON**.
- **Slugs colliding** → both `blog_categories.slug` and `blog_posts.slug` are
  unique; the editor will show the Postgres error verbatim, just pick a
  different slug.

---

## 10. Files added by this feature

```
db/migrations/0001_blog_schema.sql      SQL migration (run once in Supabase)
src/lib/supabase.ts                     Supabase client + types
src/lib/blogStore.ts                    Public-blog adapter (Supabase → static fallback)
src/context/AuthContext.tsx             Auth state + RequireAuth guard
src/pages/admin/Login.tsx               Hidden /sour login page
src/pages/admin/AdminLayout.tsx         Admin shell (sidebar/topbar, sign out)
src/pages/admin/Dashboard.tsx           Posts list + publish/unpublish/delete
src/pages/admin/PostEditor.tsx          Create/edit with Markdown preview + image upload
src/pages/admin/Categories.tsx          Category manager
.env.example                            Env-var template
SETUP_BLOG_ADMIN.md                     This file
```

Public blog pages (`src/pages/BlogPage`, `src/pages/SingleBlogPage`) were
updated to read from Supabase when available, otherwise from the existing
static `src/data/blogPosts.ts` so previews and dev work without any backend.
