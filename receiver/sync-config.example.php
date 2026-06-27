<?php
/**
 * Per-site sync receiver configuration.
 *
 * 1. Copy this file to `sync-config.php` in the same folder as `receiver.php`.
 * 2. Paste the secret token shown for THIS website in the Konstructz admin
 *    (Websites → the site → Secret token). It must match exactly.
 * 3. Keep `sync-config.php` out of version control — it holds the secret.
 *
 * Paths default to a `storage/` folder next to the receiver and a public
 * `product-images/` folder. Adjust if your Hostinger layout differs.
 */

// The shared secret — must equal connected_websites.secret_token for this site.
define('SYNC_TOKEN', 'paste-the-secret-token-from-the-dashboard-here');

// Where the local product database (JSON) and image manifest live.
// Keep this OUTSIDE public_html if you can; the SPA does not need to read it
// directly — it reads PRODUCTS_PUBLIC_FILE below.
define('SYNC_STORAGE_DIR', __DIR__ . '/storage');

// Public, web-served copy of the catalog the SPA fetches at /data/products.json
define('PRODUCTS_PUBLIC_FILE', __DIR__ . '/../data/products.json');

// Public folder where downloaded product images are saved, and the URL path
// the SPA uses to reference them. IMAGES_DIR must be web-served at IMAGES_URL.
define('IMAGES_DIR', __DIR__ . '/../product-images');
define('IMAGES_URL', '/product-images');

// Optional: re-encode/compress downloaded JPEG/PNG images when GD is available.
define('COMPRESS_IMAGES', true);
define('JPEG_QUALITY', 82);
