<?php
declare(strict_types=1);

if (session_status() === PHP_SESSION_NONE) {
    $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (string) ($_SERVER['SERVER_PORT'] ?? '') === '443';

    session_start([
        'use_only_cookies' => true,
        'cookie_httponly' => true,
        'cookie_samesite' => 'Lax',
        'cookie_secure' => $isHttps,
        'use_strict_mode' => true,
    ]);
}

if (!defined('APP_NAME')) {
    define('APP_NAME', 'Campus Canteen Reservation');
}
