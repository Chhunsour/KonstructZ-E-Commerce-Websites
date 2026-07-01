# Project Overview — Konstructz Website

## What it is

The public-facing storefront for **Konstructz**, a heavy construction equipment
brand. It presents the equipment/attachment catalog and the **Typhon** product
line, a blog, and a contact/quote flow — plus a hidden CMS admin for running the
site day to day.

Built with React + Vite + TypeScript + Tailwind and backed by Supabase, the site
is designed to run as a **receiver** in a larger content pipeline: content is
authored centrally in the **KiuQ** system and pushed here, so public pages render
from a fast local JSON snapshot instead of querying a database on every request.

## Main areas

- **Storefront** — home, equipment/attachment listings, product detail pages,
  the Typhon catalog, and the blog.
- **CMS admin** (`/sour`, Supabase Auth-gated):
  - Products (the "Image Dashboard"), Blog posts, Categories.
  - Leads/Messages (contact + chat), viewable at `/sour/leads`.
  - Chatbot knowledge management.
- **Contact / quote** — messages are stored in Supabase, optionally emailed via
  the PHP `send.php`, and forwarded to the KiuQ hub's messages inbox.

## Data sources

The site can read content two ways, selected by env vars:

- **Local JSON (default for the deployed storefront)** — reads
  `/data/products.json` and `/data/blogs.json` written by the PHP receiver.
- **Supabase (live)** — reads directly from the site's Supabase project (used on
  the master/admin site and in early development).

This dual adapter keeps the public site fast and decoupled while still allowing
live editing through the admin. See [`architecture.md`](architecture.md).

## Repository map

| Path | Purpose |
|------|---------|
| `src/` | React application code |
| `static/` | Public assets (Vite `publicDir`) + PHP receiver at `static/api/` |
| `receiver/` | Source of the PHP sync receiver |
| `db/` | Supabase SQL migrations |
| `scripts/` | SEO, i18n, and product-import tooling |
| `dist/` | Committed production build for git-based deploy |
| `docs/` | This documentation |
