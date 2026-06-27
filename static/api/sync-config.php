<?php
/**
 * Sync receiver configuration for THIS e-commerce site.
 *
 * Shipped via the Vite build: files in /static are copied into /dist on build,
 * so this lives at https://<this-site>/api/receiver.php after deploy.
 *
 * Secret token: read ONLY from the SYNC_TOKEN environment variable, so no
 * secret ever lives in the repo. Set SYNC_TOKEN once in Hostinger (hPanel →
 * Advanced → Environment Variables) to the SAME value as the Secret token for
 * this site in KiuQ → Product Sync → Connected Websites. Until it is set, the
 * receiver refuses every request (a KiuQ "Test connection" will show this).
 */

$envToken = getenv('SYNC_TOKEN');
define('SYNC_TOKEN', $envToken !== false ? trim($envToken) : '');

// Internal store (image de-dup manifest). Lives next to the receiver.
define('SYNC_STORAGE_DIR', __DIR__ . '/storage');

// Public catalog the SPA fetches at /data/products.json (web root = /dist).
define('PRODUCTS_PUBLIC_FILE', __DIR__ . '/../data/products.json');

// Public folder for downloaded images + the URL the SPA references them by.
define('IMAGES_DIR', __DIR__ . '/../product-images');
define('IMAGES_URL', '/product-images');

// Re-encode/compress downloaded JPEG/PNG when GD is available.
define('COMPRESS_IMAGES', true);
define('JPEG_QUALITY', 82);

// Safety limits for server-side image importing.
define('IMAGE_REQUEST_TIMEOUT', 20);
define('MAX_IMAGE_BYTES', 12 * 1024 * 1024);
