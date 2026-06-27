# Supabase — product sync orchestrator

The `product-sync` Edge Function is the secure server-side pusher. The admin SPA
calls it; it reads products + per-site secrets with the service role key, applies
per-website overrides, batches, pushes to each site's receiver, and writes logs.

## One-time deploy

```bash
# from the repo root, with the Supabase CLI installed and logged in:
supabase link --project-ref <your-project-ref>      # once
supabase functions deploy product-sync
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected into the function
automatically — you do **not** set them manually, and the service role key is
never shipped to the browser.

## Database

Run the SQL migration first (Dashboard → SQL editor):

```
db/migrations/0006_product_sync.sql
```

## How the dashboard calls it

The SPA invokes `${VITE_SUPABASE_URL}/functions/v1/product-sync` with the
logged-in admin's access token in the `Authorization` header. The function
verifies the user is in `public.admins` before doing anything.

Actions:
- `{"action":"sync","productIds":"all"|[...],"websiteIds":"all"|[...],"syncType":"full|price|images|descriptions","force":false}`
- `{"action":"retry-failed","websiteId?":"...","productId?":"..."}`
- `{"action":"test-connection","websiteId":"..."}`
