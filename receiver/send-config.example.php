<?php
/**
 * Configuration for send.php (the contact/quote email endpoint).
 *
 * 1. Copy this file to `send-config.php` in the same folder as `send.php`.
 * 2. Fill in the SMTP password for the Hostinger mailbox you want to send
 *    FROM (create it in hPanel → Emails if you haven't).
 * 3. Keep `send-config.php` OUT of version control — it holds the password.
 *
 * Hostinger SMTP settings are the same for every mailbox on the domain:
 *   host: smtp.hostinger.com   port: 465   security: SSL/TLS
 *   username: the full email address      password: that mailbox's password
 */

// ── Mailbox that SENDS the notifications (must be a real Hostinger mailbox) ──
define('SMTP_HOST', 'smtp.hostinger.com');
define('SMTP_PORT', 465);
define('SMTP_USER', 'sales@konstructz.com');        // full email address
define('SMTP_PASS', 'paste-the-mailbox-password-here');

// ── Where the message is sent and how it appears ──
define('MAIL_TO',        'sales@konstructz.com');    // inbox that receives leads
define('MAIL_FROM',      'sales@konstructz.com');    // should match SMTP_USER
define('MAIL_FROM_NAME', 'Konstructz Website');

// ── Which website origin is allowed to call this endpoint (CORS) ──
// Use your live site origin in production. '*' allows any origin (less strict).
define('ALLOWED_ORIGIN', 'https://konstructz.com');
