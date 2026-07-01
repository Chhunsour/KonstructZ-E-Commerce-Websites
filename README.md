# Konstructz Website

The public storefront for **Konstructz** — a heavy construction equipment brand
(excavators, loaders, attachments, and the Typhon product line). Built with
React + Vite + TypeScript + Tailwind, backed by Supabase, with a hidden CMS admin
and a "receiver" architecture that renders products and blog posts from a fast
local JSON snapshot.

> Content is authored in the **KiuQ** master controller and pushed to this site's
> receiver, which writes `/data/products.json` and `/data/blogs.json`. This site
> can also read directly from Supabase when configured. See
> [`docs/architecture.md`](docs/architecture.md).

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, React Router |
| Content/data | Supabase (Postgres + Auth + Storage) or synced local JSON |
| Rich text | Custom dependency-free WYSIWYG + HTML sanitizer |
| Integrations | Ecwid (add-to-cart), Hostinger (hosting + PHP receiver) |

## Key features

- **Storefront** — equipment & attachment catalog, product detail pages, Typhon
  line, blog, and contact/quote flow.
- **Hidden CMS admin** (`/sour`) — manage products, blog posts, categories,
  leads/messages, and the site chatbot.
- **Receiver architecture** — a small PHP receiver ingests pushed content and
  images so the site renders from local JSON, decoupled from any live database.
- **i18n** — multi-language dictionaries with a compile step.
- **SEO tooling** — sitemap/robots generation and validation scripts.

## AI features / workflows

- **Site chatbot** — a knowledge-grounded assistant (see
  `CHATBOT_KNOWLEDGE_GUIDE.md`) that answers product and company questions from a
  curated knowledge base.
- **AI-assisted catalog** — product knowledge and specs are generated/normalized
  into structured data (`productKnowledge.generated.json`) that powers search and
  the assistant.

---

## Getting started

### Prerequisites
- Node.js 18+ and npm

### Install & run
```bash
npm install
cp .env.example .env.local   # fill in real values
npm run dev                  # http://localhost:5173
```

### Environment variables
See [`.env.example`](.env.example). All client vars are `VITE_*`; the Supabase
anon key is browser-safe (row-level security guards writes). Key vars:

| Variable | Purpose |
|----------|---------|
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | This site's Supabase project |
| `VITE_PRODUCTS_SOURCE` | `supabase` (live) or `local` (synced JSON) |
| `VITE_BLOG_SOURCE` | `local` (synced JSON, default) or Supabase |
| `VITE_ECWID_PUBLIC_TOKEN` | Optional Ecwid add-to-cart |
| `VITE_LEADS_EMAIL_ENDPOINT` | Contact/quote email endpoint (`receiver/send.php`) |
| `VITE_HUB_SUPABASE_URL` / `VITE_HUB_SUPABASE_ANON_KEY` | Forward messages to the KiuQ hub |

### Build
```bash
npm run build       # vite production build → dist/
npm run typecheck   # tsc --noEmit
npm run start       # serve the built dist/ locally
```

Useful scripts: `seo:generate`, `seo:check`, `compile-i18n`, `import:typhon`.

---

## Deployment notes

- Deployed on **Hostinger** via **GitHub auto-deploy** — pushing to `main`
  triggers a rebuild. The compiled `dist/` is committed so git-based deploys
  ship a known-good build.
- The **PHP receiver** (`receiver/`, shipped at `static/api/receiver.php`)
  ingests pushed content from the KiuQ hub and writes `/data/*.json` plus local
  images; the SPA `.htaccess` serves real files so PHP executes.
- Env vars are set in hPanel; Vite inlines `VITE_*` at build time, so changing a
  value requires a rebuild.

## Screenshots

> _Add screenshots of the storefront, a product page, the blog, and the CMS admin
> here._

| | |
|---|---|
| Home | _screenshot_ |
| Product detail | _screenshot_ |
| Blog | _screenshot_ |
| CMS admin | _screenshot_ |

## Documentation

- [Project overview](docs/project-overview.md)
- [Architecture](docs/architecture.md)
- [Blog admin setup](SETUP_BLOG_ADMIN.md)
- [Chatbot knowledge guide](CHATBOT_KNOWLEDGE_GUIDE.md)

## Future improvements

- Code-split the bundle (route-level lazy loading) to shrink first load.
- Automated tests + CI (typecheck, build, lint) on pull requests.
- Consolidate the Supabase and local-JSON data adapters behind one interface.
- Image optimization pipeline for storefront media.

## License

Proprietary — see [LICENSE](LICENSE). Published for portfolio/demonstration.
