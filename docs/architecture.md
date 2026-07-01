# Architecture — Konstructz Website

## Overview

```
   KiuQ (master controller)
        │  push (Edge Function → HTTPS + shared secret)
        ▼
   PHP receiver (static/api/receiver.php)
        │  writes /data/products.json, /data/blogs.json
        │  downloads + dedupes images locally
        ▼
   React storefront (Vite SPA)
        │  reads local JSON  ── or ──  reads Supabase directly
        ▼
   Visitors
```

The storefront is a Vite single-page app served on Hostinger. It never needs a
live database on the hot path: a small PHP receiver ingests content pushed from
the KiuQ hub and writes local JSON, which the SPA fetches and renders.

## Frontend (`src/`)

- **React 18 + React Router** SPA (`BrowserRouter`), TypeScript throughout.
- **Data adapters**:
  - `src/lib/productStore.ts` — products from local JSON or Supabase.
  - `src/lib/blogStore.ts` — blog posts from local JSON (`VITE_BLOG_SOURCE=local`,
    default) or Supabase, with a static fallback so the site always renders.
- **CMS admin** under `src/pages/admin/` (Supabase Auth). Blog content is edited
  as sanitized HTML (`src/lib/sanitizeHtml.ts`).
- **Styling**: Tailwind with `theme-*` design tokens (light/dark) and shared
  admin UI primitives (`src/components/admin/ui.tsx`).
- **i18n**: dictionaries compiled via `scripts/compile-dictionaries.cjs`.

## Content ingestion (receiver)

- `receiver/receiver.php` (shipped at `static/api/receiver.php`) accepts pushes
  from the KiuQ Edge Functions, authenticated with a shared `X-Sync-Token`.
- It downloads referenced images once (content-hash dedupe) into local storage,
  rewrites URLs to local paths, and atomically writes `/data/products.json` and
  `/data/blogs.json`.
- The SPA `.htaccess` serves real files first so the PHP endpoints execute while
  client-side routes still work.

## Contact / lead flow

- Visitor messages are written to Supabase, optionally POSTed to `receiver/send.php`
  to be emailed to the Hostinger inbox, and forwarded to the KiuQ hub's
  `website_messages` table (a separate Supabase project) so they appear in the
  hub admin.

## Build & deploy

- **Build**: `vite build` → `dist/`. The compiled `dist/` is committed so the
  Hostinger **git-based deploy** ships a known-good build on push to `main`.
- **Env**: `VITE_*` values are inlined at build time (set in hPanel); changing a
  value requires a rebuild.
- `publicDir` is `static/` (not `public/`), copied into `dist/` on build.

## Security notes

- Client code uses only public values (Supabase anon key + public tokens);
  row-level security guards all writes.
- Server-only secrets (receiver token, email config) live in server env /
  `receiver/*-config.php` (gitignored), never in the client bundle.
