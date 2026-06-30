<?php
/**
 * Contact / quote email endpoint.
 *
 * The website POSTs a JSON message here (see src/lib/leadsStore.ts) and this
 * script emails it to the Hostinger inbox via SMTP. Storage of the lead is
 * handled separately by the site (Supabase) — this endpoint is email only, so
 * if it's down the message is still recorded in the admin dashboard.
 *
 * Setup: copy send-config.example.php → send-config.php and fill in the
 * mailbox password, then upload this whole folder to Hostinger (e.g. into
 * public_html/send/). The endpoint URL is then https://yourdomain.com/send/send.php
 * — put that in the site's VITE_LEADS_EMAIL_ENDPOINT env var.
 */

$configPath = __DIR__ . '/send-config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['ok' => false, 'error' => 'send-config.php is missing']);
    exit;
}
require $configPath;

// ── CORS ──────────────────────────────────────────────────────────────────
$origin = defined('ALLOWED_ORIGIN') ? ALLOWED_ORIGIN : '*';
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// ── Parse + validate ────────────────────────────────────────────────────────
$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON']);
    exit;
}

$get = function (string $key) use ($data): string {
    $v = $data[$key] ?? '';
    return is_string($v) ? trim($v) : '';
};

$name  = $get('name');
$email = $get('email');
$phone = $get('phone');

if ($name === '' && $email === '' && $phone === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Empty message']);
    exit;
}
// Basic sanity on the reply-to address.
$replyTo = (filter_var($email, FILTER_VALIDATE_EMAIL)) ? $email : MAIL_FROM;

// ── Build the email body ────────────────────────────────────────────────────
$source  = $get('source') === 'chat' ? 'Chat assistant' : 'Contact form';
$rows = [
    'Name'             => $name,
    'Company'          => $get('company'),
    'Email'            => $email,
    'Phone'            => $phone,
    'Interest'         => $get('product_interest') ?: $get('interest_type'),
    'Product link'     => $get('product_url'),
    'Location'         => $get('location'),
    'Language'         => $get('language'),
    'Source'           => $source . ' · ' . $get('source_page'),
];

$lines = ["New message from the Konstructz website", str_repeat('=', 40), ''];
foreach ($rows as $label => $value) {
    if ($value !== '') {
        $lines[] = str_pad($label . ':', 16) . $value;
    }
}
$message = $get('message');
if ($message !== '') {
    $lines[] = '';
    $lines[] = 'Message:';
    $lines[] = $message;
}
$summary = $get('transcript_summary');
if ($summary !== '') {
    $lines[] = '';
    $lines[] = 'Chat summary:';
    $lines[] = $summary;
}
$body = implode("\r\n", $lines) . "\r\n";

$subjectName = $name !== '' ? $name : ($email !== '' ? $email : 'Website visitor');
$subject = 'New enquiry — ' . $subjectName;

// ── Send via SMTP ───────────────────────────────────────────────────────────
try {
    smtp_send(MAIL_FROM, MAIL_FROM_NAME, MAIL_TO, $replyTo, $subject, $body);
    echo json_encode(['ok' => true]);
} catch (Exception $e) {
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
}

/**
 * Minimal, dependency-free SMTP sender (AUTH LOGIN over implicit TLS).
 * Works with Hostinger's smtp.hostinger.com:465.
 */
function smtp_send(
    string $from,
    string $fromName,
    string $to,
    string $replyTo,
    string $subject,
    string $body
): void {
    $host = SMTP_HOST;
    $port = SMTP_PORT;
    $transport = ($port == 465) ? 'ssl://' : '';

    $fp = @stream_socket_client(
        $transport . $host . ':' . $port,
        $errno,
        $errstr,
        20,
        STREAM_CLIENT_CONNECT
    );
    if (!$fp) {
        throw new Exception("Connection failed: $errstr ($errno)");
    }
    stream_set_timeout($fp, 20);

    $read = function () use ($fp): string {
        $data = '';
        while (($line = fgets($fp, 515)) !== false) {
            $data .= $line;
            // Multiline replies have a '-' after the code; final line has a space.
            if (isset($line[3]) && $line[3] === ' ') break;
        }
        return $data;
    };
    $expect = function (string $resp, array $codes): void {
        $code = (int) substr($resp, 0, 3);
        if (!in_array($code, $codes, true)) {
            throw new Exception('SMTP error: ' . trim($resp));
        }
    };
    $cmd = function (string $line) use ($fp): void {
        fwrite($fp, $line . "\r\n");
    };

    $expect($read(), [220]);
    $cmd('EHLO ' . ($_SERVER['SERVER_NAME'] ?? 'localhost'));
    $expect($read(), [250]);

    $cmd('AUTH LOGIN');
    $expect($read(), [334]);
    $cmd(base64_encode(SMTP_USER));
    $expect($read(), [334]);
    $cmd(base64_encode(SMTP_PASS));
    $expect($read(), [235]);

    $cmd('MAIL FROM:<' . $from . '>');
    $expect($read(), [250]);
    $cmd('RCPT TO:<' . $to . '>');
    $expect($read(), [250, 251]);
    $cmd('DATA');
    $expect($read(), [354]);

    $headers = [
        'From: ' . encode_header_name($fromName) . ' <' . $from . '>',
        'To: <' . $to . '>',
        'Reply-To: <' . $replyTo . '>',
        'Subject: ' . encode_header($subject),
        'Date: ' . date('r'),
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
    ];
    // Dot-stuffing: any line starting with '.' must be escaped as '..'.
    $safeBody = preg_replace('/^\./m', '..', $body);
    $cmd(implode("\r\n", $headers) . "\r\n\r\n" . $safeBody . "\r\n.");
    $expect($read(), [250]);

    $cmd('QUIT');
    fclose($fp);
}

/** RFC 2047 encode an arbitrary header value (subject etc.). */
function encode_header(string $value): string
{
    if (preg_match('/[^\x20-\x7e]/', $value)) {
        return '=?UTF-8?B?' . base64_encode($value) . '?=';
    }
    return $value;
}

/** Encode a display name, quoting if it has non-ASCII or specials. */
function encode_header_name(string $name): string
{
    if (preg_match('/[^\x20-\x7e]/', $name)) {
        return encode_header($name);
    }
    return '"' . str_replace('"', '', $name) . '"';
}
