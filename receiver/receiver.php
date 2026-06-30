<?php
/**
 * Konstructz framework — product sync receiver.
 *
 * Drop this file (plus sync-config.php) onto each e-commerce framework site,
 * e.g. at https://your-site.com/api/receiver.php. The Supabase Edge Function
 * pushes product data here. This script:
 *
 *   1. Verifies the X-Sync-Token header (constant-time) against SYNC_TOKEN.
 *   2. Downloads each remote image ONCE, de-duplicates by content hash,
 *      saves it into the site's own image folder, and rewrites image URLs to
 *      local /product-images/... paths.
 *   3. Upserts products into a local JSON store. Partial syncs (price / images
 *      / descriptions) merge into the existing record so nothing else is lost.
 *   4. Returns a clear JSON result, including the rewritten local image paths.
 *
 * No database server required — the local store is a JSON file written
 * atomically with a lock, which is ideal for Hostinger shared hosting and for
 * a static front-end that just fetches /data/products.json.
 *
 * Requires PHP 7.4+. cURL or allow_url_fopen for image downloads. GD optional
 * (used only for compression).
 */

declare(strict_types=1);

header('Content-Type: application/json');

$configPath = __DIR__ . '/sync-config.php';
if (!is_file($configPath)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Receiver not configured: missing sync-config.php']);
    exit;
}
require $configPath;

/* ── helpers ─────────────────────────────────────────────────────────── */

function fail(int $code, string $msg): void
{
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $msg]);
    exit;
}

function ok(array $payload): void
{
    echo json_encode(array_merge(['ok' => true], $payload));
    exit;
}

/** Read the secret token from the request header (handles common variants). */
function request_token(): string
{
    $h = $_SERVER['HTTP_X_SYNC_TOKEN'] ?? '';
    if ($h === '' && function_exists('getallheaders')) {
        foreach (getallheaders() as $k => $v) {
            if (strtolower($k) === 'x-sync-token') {
                $h = $v;
                break;
            }
        }
    }
    return is_string($h) ? trim($h) : '';
}

function ensure_dir(string $dir): void
{
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
}

function safe_slug(string $value): string
{
    $slug = strtolower(trim(preg_replace('/[^a-z0-9]+/i', '-', $value), '-'));
    return $slug !== '' ? substr($slug, 0, 96) : 'product';
}

/** Atomic JSON write with an exclusive lock. */
function write_json_atomic(string $file, $data): bool
{
    ensure_dir(dirname($file));
    $tmp = $file . '.tmp.' . getmypid();
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($json === false) {
        return false;
    }
    if (file_put_contents($tmp, $json, LOCK_EX) === false) {
        return false;
    }
    return rename($tmp, $file);
}

function read_json(string $file, $default)
{
    if (!is_file($file)) {
        return $default;
    }
    $raw = file_get_contents($file);
    if ($raw === false || $raw === '') {
        return $default;
    }
    $data = json_decode($raw, true);
    return $data === null ? $default : $data;
}

function max_image_bytes(): int
{
    return defined('MAX_IMAGE_BYTES') ? (int) MAX_IMAGE_BYTES : 12582912; // 12 MB
}

function request_timeout_seconds(): int
{
    return defined('IMAGE_REQUEST_TIMEOUT') ? (int) IMAGE_REQUEST_TIMEOUT : 20;
}

/** Download a URL to a string, cURL first then fallback to file_get_contents. */
function http_get(string $url): ?string
{
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        $bytes = '';
        $maxBytes = max_image_bytes();
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_MAXREDIRS => 5,
            CURLOPT_CONNECTTIMEOUT => min(10, request_timeout_seconds()),
            CURLOPT_TIMEOUT => request_timeout_seconds(),
            CURLOPT_USERAGENT => 'KonstructzSyncReceiver/1.0',
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_WRITEFUNCTION => function ($ch, string $chunk) use (&$bytes, $maxBytes): int {
                $bytes .= $chunk;
                return strlen($bytes) > $maxBytes ? 0 : strlen($chunk);
            },
        ]);
        curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $contentType = (string) curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
        curl_close($ch);
        if ($bytes !== '' && strlen($bytes) <= $maxBytes && $code >= 200 && $code < 300) {
            $mime = strtolower(trim(explode(';', $contentType)[0]));
            if ($mime === '' || in_array($mime, ['image/jpeg', 'image/png', 'image/webp'], true)) {
                return $bytes;
            }
        }
        return null;
    }
    if (ini_get('allow_url_fopen')) {
        $ctx = stream_context_create(['http' => ['timeout' => request_timeout_seconds(), 'user_agent' => 'KonstructzSyncReceiver/1.0']]);
        $body = @file_get_contents($url, false, $ctx);
        if ($body === false || strlen($body) > max_image_bytes()) return null;
        return $body;
    }
    return null;
}

function image_mime_from_bytes(string $bytes): ?string
{
    if (strlen($bytes) < 12) return null;
    if (substr($bytes, 0, 3) === "\xFF\xD8\xFF") return 'image/jpeg';
    if (substr($bytes, 0, 8) === "\x89PNG\r\n\x1a\n") return 'image/png';
    if (substr($bytes, 0, 4) === 'RIFF' && substr($bytes, 8, 4) === 'WEBP') return 'image/webp';
    return null;
}

function ext_from_mime(string $mime): ?string
{
    if ($mime === 'image/jpeg') return 'jpg';
    if ($mime === 'image/png') return 'png';
    if ($mime === 'image/webp') return 'webp';
    return null;
}

/** Optional GD recompression for jpg/png to shrink payload. Best-effort. */
function maybe_compress(string $path, string $ext): void
{
    if (!defined('COMPRESS_IMAGES') || !COMPRESS_IMAGES) return;
    if (!extension_loaded('gd')) return;
    try {
        if ($ext === 'jpg') {
            $img = @imagecreatefromjpeg($path);
            if ($img) {
                imagejpeg($img, $path, defined('JPEG_QUALITY') ? JPEG_QUALITY : 82);
                imagedestroy($img);
            }
        } elseif ($ext === 'png') {
            $img = @imagecreatefrompng($path);
            if ($img) {
                imagealphablending($img, false);
                imagesavealpha($img, true);
                imagepng($img, $path, 6); // 0-9 compression
                imagedestroy($img);
            }
        }
    } catch (\Throwable $e) {
        // leave the original file as-is on any failure
    }
}

/**
 * Download one image with de-duplication.
 *  - If we already mapped this exact source URL, reuse it (no re-download).
 *  - Otherwise download, hash the bytes; if the hash already exists locally,
 *    reuse that file (same image from a different URL → no duplicate).
 * Returns the local public URL, or the original URL if download failed.
 */
function localize_image(string $url, array &$manifest, string $slug = 'product', int $order = 0): string
{
    // Already a local path — nothing to do.
    if ($url === '' || strpos($url, IMAGES_URL . '/') === 0) {
        return $url;
    }
    // Non-absolute (site-relative) paths are left untouched.
    if (!preg_match('#^https?://#i', $url)) {
        return $url;
    }
    if (isset($manifest['by_url'][$url])) {
        return $manifest['by_url'][$url];
    }

    $bytes = http_get($url);
    if ($bytes === null || $bytes === '') {
        return $url; // keep remote URL so the product still renders
    }
    $mime = image_mime_from_bytes($bytes);
    $ext = $mime ? ext_from_mime($mime) : null;
    if ($mime === null || $ext === null) {
        return $url;
    }

    $hash = sha1($bytes);
    if (isset($manifest['by_hash'][$hash])) {
        $local = $manifest['by_hash'][$hash];
        $manifest['by_url'][$url] = $local; // remember this URL too
        return $local;
    }

    $safeSlug = safe_slug($slug);
    $dir = rtrim(IMAGES_DIR, '/') . '/' . $safeSlug;
    ensure_dir($dir);
    $filename = $safeSlug . '-' . str_pad((string) ($order + 1), 2, '0', STR_PAD_LEFT) . '-' . substr($hash, 0, 10) . '.' . $ext;
    $dest = $dir . '/' . $filename;
    if (!is_file($dest)) {
        if (file_put_contents($dest, $bytes) === false) {
            return $url;
        }
        maybe_compress($dest, $ext);
    }
    $local = rtrim(IMAGES_URL, '/') . '/' . $safeSlug . '/' . $filename;
    $manifest['by_url'][$url] = $local;
    $manifest['by_hash'][$hash] = $local;
    return $local;
}

/** Rewrite absolute image URLs inside blog HTML/Markdown to local copies. */
function localize_content_images(string $content, array &$manifest, string $slug): string
{
    $pattern = '#(!\[[^\]]*\]\(|src=["\']|href=["\'])(https?://[^)"\'\s]+\.(?:jpe?g|png|webp))#i';
    $out = preg_replace_callback($pattern, function (array $m) use (&$manifest, $slug): string {
        $local = localize_image($m[2], $manifest, $slug, 0);
        return $m[1] . $local;
    }, $content);
    return is_string($out) ? $out : $content;
}

/* ── auth ────────────────────────────────────────────────────────────── */

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    fail(405, 'Method not allowed');
}

$expected = defined('SYNC_TOKEN') ? (string) SYNC_TOKEN : '';
$given = request_token();
if ($expected === '' || $given === '' || !hash_equals($expected, $given)) {
    fail(401, 'Invalid or missing sync token');
}

$raw = file_get_contents('php://input');
$req = json_decode($raw ?: '', true);
if (!is_array($req)) {
    fail(400, 'Invalid JSON body');
}

$action = $req['action'] ?? 'sync';

/* ── action: ping (test connection) ──────────────────────────────────── */
if ($action === 'ping') {
    $store = read_json(PRODUCTS_PUBLIC_FILE, ['products' => []]);
    ok([
        'version' => '1.1',
        'product_count' => is_array($store['products'] ?? null) ? count($store['products']) : 0,
        'gd' => extension_loaded('gd'),
        'curl' => function_exists('curl_init'),
        'writable' => is_writable(dirname(PRODUCTS_PUBLIC_FILE)) || @ensure_dir(dirname(PRODUCTS_PUBLIC_FILE)),
        // Capabilities advertised to the KiuQ controller.
        'features' => [
            'product_sync'   => true,
            'blog_sync'      => true,
            'blog_categories' => true,
            'image_import'   => true,
        ],
    ]);
}

/* ── action: blog-categories (KiuQ → list this site's blog categories) ──── */
if ($action === 'blog-categories') {
    // Managed list lives next to blogs.json as /data/blog-categories.json.
    // Accept either a bare array or { "categories": [...] }. If it's missing or
    // empty, derive distinct categories from existing posts so the dropdown is
    // never empty.
    $catFile = rtrim(dirname(PRODUCTS_PUBLIC_FILE), '/') . '/blog-categories.json';
    $raw = read_json($catFile, null);
    $managed = is_array($raw) && isset($raw['categories']) && is_array($raw['categories'])
        ? $raw['categories']
        : (is_array($raw) ? $raw : []);

    $out = [];
    foreach ($managed as $c) {
        if (!is_array($c)) continue;
        $name = trim((string) ($c['name'] ?? ''));
        if ($name === '') continue;
        $slug = (string) ($c['slug'] ?? safe_slug($name));
        $out[] = [
            'id'          => (string) ($c['id'] ?? $slug),
            'name'        => $name,
            'slug'        => $slug,
            'description' => (string) ($c['description'] ?? ''),
            'post_count'  => isset($c['post_count']) ? (int) $c['post_count'] : null,
        ];
    }

    if (count($out) === 0) {
        $blogsFile = rtrim(dirname(PRODUCTS_PUBLIC_FILE), '/') . '/blogs.json';
        $store = read_json($blogsFile, ['posts' => []]);
        $counts = [];
        foreach (($store['posts'] ?? []) as $p) {
            $name = is_array($p) && isset($p['category']) ? trim((string) $p['category']) : '';
            if ($name === '') continue;
            $counts[$name] = ($counts[$name] ?? 0) + 1;
        }
        foreach ($counts as $name => $count) {
            $slug = safe_slug($name);
            $out[] = ['id' => $slug, 'name' => $name, 'slug' => $slug, 'description' => '', 'post_count' => $count];
        }
    }

    ok(['categories' => array_values($out)]);
}

/* ── action: sync-blogs (KiuQ blog-sync → /data/blogs.json) ──────────────── */
if ($action === 'sync-blogs') {
    $incoming = $req['posts'] ?? [];
    // "replace" makes the synced set authoritative: posts not included are dropped
    // (so archiving/unpublishing/deleting in KiuQ removes them here too). An empty
    // set with replace=true clears the blog entirely.
    $replace = !empty($req['replace']);
    if (!is_array($incoming) || (count($incoming) === 0 && !$replace)) {
        fail(400, 'No posts in payload');
    }

    // blogs.json lives next to products.json (same public /data folder).
    $blogsFile = rtrim(dirname(PRODUCTS_PUBLIC_FILE), '/') . '/blogs.json';
    ensure_dir(SYNC_STORAGE_DIR);
    $manifestFile = rtrim(SYNC_STORAGE_DIR, '/') . '/image-manifest.json';
    $manifest = read_json($manifestFile, ['by_url' => [], 'by_hash' => []]);

    $store = read_json($blogsFile, ['posts' => [], 'updated_at' => null]);
    $byId = [];
    if (!$replace) {
        foreach (($store['posts'] ?? []) as $b) {
            if (isset($b['id'])) {
                $byId[$b['id']] = $b;
            }
        }
    }

    $results = [];
    foreach ($incoming as $post) {
        if (!is_array($post) || !isset($post['id'])) {
            $results[] = ['ok' => false, 'error' => 'Post missing id'];
            continue;
        }
        $id = $post['id'];
        $slug = $post['slug'] ?? $id;
        try {
            $imgSlug = 'blog-' . safe_slug((string) $slug);
            if (array_key_exists('featuredImage', $post) && is_string($post['featuredImage']) && $post['featuredImage'] !== '') {
                $post['featuredImage'] = localize_image($post['featuredImage'], $manifest, $imgSlug, 0);
            }
            if (array_key_exists('content', $post) && is_string($post['content']) && $post['content'] !== '') {
                $post['content'] = localize_content_images($post['content'], $manifest, $imgSlug);
            }
            $post['_synced_at'] = date('c');
            $byId[$id] = $post;
            $results[] = ['ok' => true, 'id' => $id, 'slug' => $slug];
        } catch (\Throwable $e) {
            $results[] = ['ok' => false, 'id' => $id, 'slug' => $slug, 'error' => $e->getMessage()];
        }
    }

    write_json_atomic($manifestFile, $manifest);
    $store['posts'] = array_values($byId);
    $store['updated_at'] = date('c');
    if (!write_json_atomic($blogsFile, $store)) {
        fail(500, 'Failed to write blog store (check folder permissions)');
    }

    ok(['type' => 'blogs', 'count' => count($results), 'results' => $results, 'total_posts' => count($byId)]);
}

/* ── action: sync ────────────────────────────────────────────────────── */
if ($action !== 'sync') {
    fail(400, 'Unknown action: ' . $action);
}

$type = $req['type'] ?? 'full';                 // full | price | images | descriptions
$incoming = $req['products'] ?? [];
if (!is_array($incoming) || count($incoming) === 0) {
    fail(400, 'No products in payload');
}

// Load current store (keyed by id) + image manifest.
ensure_dir(SYNC_STORAGE_DIR);
$manifestFile = rtrim(SYNC_STORAGE_DIR, '/') . '/image-manifest.json';
$manifest = read_json($manifestFile, ['by_url' => [], 'by_hash' => []]);

$store = read_json(PRODUCTS_PUBLIC_FILE, ['products' => [], 'updated_at' => null]);
$byId = [];
foreach (($store['products'] ?? []) as $p) {
    if (isset($p['id'])) {
        $byId[$p['id']] = $p;
    }
}

$results = [];

foreach ($incoming as $incomingProduct) {
    if (!is_array($incomingProduct) || !isset($incomingProduct['id'])) {
        $results[] = ['ok' => false, 'error' => 'Product missing id'];
        continue;
    }
    $id = $incomingProduct['id'];
    $slug = $incomingProduct['slug'] ?? $id;

    try {
        // Localize every image field present in this payload. The master
        // (KiuQ) sends camelCase keys: featuredImage + galleryImages[].
        $imageReport = [];
        $imageOrder = 0;
        if (array_key_exists('featuredImage', $incomingProduct) && is_string($incomingProduct['featuredImage'])) {
            $local = localize_image($incomingProduct['featuredImage'], $manifest, (string) $slug, $imageOrder);
            $imageOrder++;
            $imageReport[] = $local;
            $incomingProduct['featuredImage'] = $local;
        }
        if (array_key_exists('galleryImages', $incomingProduct) && is_array($incomingProduct['galleryImages'])) {
            $gallery = [];
            foreach ($incomingProduct['galleryImages'] as $g) {
                if (is_string($g)) {
                    $local = localize_image($g, $manifest, (string) $slug, $imageOrder);
                    $imageOrder++;
                    $gallery[] = $local;
                    $imageReport[] = $local;
                }
            }
            $incomingProduct['galleryImages'] = $gallery;
        }

        // Merge: partial syncs keep existing fields; full sync replaces.
        $existing = $byId[$id] ?? null;
        if ($type === 'full' || $existing === null) {
            $merged = $incomingProduct;
            if ($existing !== null) {
                // preserve a created marker if we had one
                $merged['_created_at'] = $existing['_created_at'] ?? date('c');
            } else {
                $merged['_created_at'] = date('c');
            }
        } else {
            // Only overwrite keys that are present in the partial payload.
            $merged = $existing;
            foreach ($incomingProduct as $k => $v) {
                $merged[$k] = $v;
            }
        }
        $merged['_synced_at'] = date('c');
        $byId[$id] = $merged;

        $results[] = ['ok' => true, 'id' => $id, 'slug' => $slug, 'images' => $imageReport];
    } catch (\Throwable $e) {
        // Keep the old product data on failure — never break the live site.
        $results[] = ['ok' => false, 'id' => $id, 'slug' => $slug, 'error' => $e->getMessage()];
    }
}

// Persist manifest + catalog atomically. If the catalog write fails, report it.
write_json_atomic($manifestFile, $manifest);

$store['products'] = array_values($byId);
$store['updated_at'] = date('c');
if (!write_json_atomic(PRODUCTS_PUBLIC_FILE, $store)) {
    fail(500, 'Failed to write product store (check folder permissions)');
}

ok([
    'type' => $type,
    'count' => count($results),
    'results' => $results,
    'total_products' => count($byId),
]);
