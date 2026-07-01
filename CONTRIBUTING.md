# Contributing

This is a proprietary project. These notes describe the working conventions for
the Konstructz website.

## Prerequisites

- Node.js 18+ and npm
- A Supabase project (URL + anon key) — see [`.env.example`](.env.example)

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in real values
npm run dev
```

## Project structure

| Path | Purpose |
|------|---------|
| `src/` | React app — `pages/`, `screens/`, `components/`, `lib/`, `context/`, `data/`, `i18n/` |
| `src/pages/admin/` | Hidden CMS admin (`/sour`) |
| `static/` | Vite `publicDir` — public assets + the PHP receiver under `static/api/` |
| `receiver/` | Source of the PHP sync receiver |
| `db/` | Supabase SQL migrations |
| `scripts/` | Build/data tooling (SEO, i18n, product import) |
| `dist/` | Committed production build (git-based deploy ships this) |

## Conventions

- **TypeScript + React function components**; match the surrounding file's style.
- **Styling** uses Tailwind with the project's `theme-*` design tokens and the
  shared admin UI primitives in `src/components/admin/ui.tsx` — reuse them.
- **Blog HTML** is sanitized via `src/lib/sanitizeHtml.ts` before save/render;
  never bypass it.
- **Secrets**: only `VITE_*` values belong in client env; the anon key is
  public. Never commit a `service_role` key or `.env.local`.

## Before opening a PR

```bash
npm run typecheck   # tsc --noEmit
npm run build       # vite build must pass
```

Keep changes focused, use clear commit messages, and don't commit
`node_modules`, `.env*` (except `.env.example`), or local scratch files.

> Note: pushing to `main` auto-deploys to production. Use a feature branch and
> open a PR for review.
