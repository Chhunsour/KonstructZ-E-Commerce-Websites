<?php
/**
 * Configuration for send.php (the contact/quote email endpoint).
 */

// ── Mailbox that SENDS the notifications (must be a real Hostinger mailbox) ──
define('SMTP_HOST', 'smtp.hostinger.com');
define('SMTP_PORT', 465);
define('SMTP_USER', 'sales@konstructz.com');        // full sending email address
define('SMTP_PASS', 'Qassword369@'); 

// ── Where the message is sent and how it appears ──
define('MAIL_TO',        'support@konstructz.com');  // 📩 ENQUIRIES GO HERE
define('MAIL_FROM',      'sales@konstructz.com');    // should match SMTP_USER
define('MAIL_FROM_NAME', 'Konstructz Website');

// ── Which website origin is allowed to call this endpoint (CORS) ──
define('ALLOWED_ORIGIN', 'https://konstructz.com');
