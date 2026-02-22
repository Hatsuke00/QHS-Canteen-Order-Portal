<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('X-Content-Type-Options: nosniff');

function json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function json_error(string $message, int $status = 400, array $extra = []): void
{
    json_response(array_merge([
        'ok' => false,
        'message' => $message,
    ], $extra), $status);
}

set_exception_handler(static function (Throwable $exception): void {
    json_error('Internal server error.', 500);
});

function require_method(string $method): void
{
    $requestMethod = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));

    if ($requestMethod !== strtoupper($method)) {
        json_error('Method not allowed.', 405);
    }
}

function json_input(): array
{
    $raw = file_get_contents('php://input');

    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $decoded = json_decode($raw, true);

    if (!is_array($decoded)) {
        json_error('Invalid JSON body.');
    }

    return $decoded;
}

function require_login_api(): array
{
    $user = current_user();

    if (!$user) {
        json_error('Authentication required.', 401);
    }

    return $user;
}

function require_role_api(string $role): array
{
    $user = require_login_api();
    $userRole = (string) ($user['role'] ?? '');

    if ($userRole !== $role) {
        json_error('Forbidden.', 403);
    }

    return $user;
}

function public_user(array $user): array
{
    return [
        'id' => (int) $user['id'],
        'full_name' => (string) $user['full_name'],
        'username' => (string) $user['username'],
        'role' => (string) $user['role'],
    ];
}

function validate_order_status(string $status): bool
{
    return in_array($status, ['Pending', 'Preparing', 'Completed'], true);
}
