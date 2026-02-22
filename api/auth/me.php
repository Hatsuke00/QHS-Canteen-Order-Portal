<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

require_method('GET');

$user = current_user();

if (!$user) {
    json_response([
        'ok' => true,
        'authenticated' => false,
        'user' => null,
    ]);
}

json_response([
    'ok' => true,
    'authenticated' => true,
    'user' => public_user($user),
]);
