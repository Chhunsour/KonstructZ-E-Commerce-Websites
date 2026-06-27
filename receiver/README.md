# Product Sync Receiver (framework sites)

Drop this folder onto each e-commerce framework site so the **KiuQ** system
(Product Sync → Sync Center) can push product data to it. The receiver downloads
images locally, rewrites image URLs to local paths, and stores the catalog as a
JSON file the site's front-end reads — so the site never hits Supabase on a page
view. This site holds **only** the receiver; the admin dashboard lives in KiuQ.

## Install on a site (Hostinger)

1. Upload `receiver.php` and `sync-config.example.php` to a folder under
   `public_html`, e.g. `public_html/api/`.
2. Copy the example config and fill in the secret:
   ```
   cp sync-config.example.php sync-config.php
   ```
   Open `sync-config.php` and paste the **Secret token** shown for this site in
   KiuQ (Product Sync → Connected Websites → the site → Secret token). It must
   match exactly.
3. Make sure the target folders are writable by PHP:
   - `public_html/product-images/` (downloaded images, web-served)
   - `public_html/data/` (the `products.json` catalog the SPA fetches)
   - `api/storage/` (internal — the image de-dup manifest)

   The receiver creates these automatically if the parent is writable.
4. In the admin, set this site's **API sync endpoint** to the full URL, e.g.
   `https://your-site.com/api/receiver.php`, then click **Test connection**.

## Front-end: read local data instead of Supabase

Build/deploy the framework site with:

```
VITE_PRODUCTS_SOURCE=local
```

With that flag the public site loads `/data/products.json` (written by this
receiver) and uses the local `/product-images/...` paths — no live Supabase
reads, no Supabase image bandwidth. Leave it unset (or `supabase`) on the master
admin site.

## How it behaves

- **Auth:** every request must carry `X-Sync-Token` equal to `SYNC_TOKEN`
  (constant-time compared). Anything else is rejected with 401.
- **Images:** each remote image is downloaded once. De-duplicated by content
  hash, so the same picture is never stored twice even across products/URLs.
  Optional GD recompression (toggle `COMPRESS_IMAGES`).
- **Partial syncs:** `price` / `images` / `descriptions` merge into the existing
  product; only the fields in the payload change. `full` replaces the record.
- **Safety:** the catalog is written atomically (temp file + rename) under a
  lock. If a product fails, its previous data is kept — the live site never
  breaks mid-sync.

## Endpoints (POST JSON)

- `{"action":"ping"}` → connection/health check (used by Test connection).
- `{"action":"sync","type":"full|price|images|descriptions","products":[...]}`
  → upsert products and localize images.
