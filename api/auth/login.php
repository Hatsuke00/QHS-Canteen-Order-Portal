<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

require_method('POST');

$input = json_input();

$username = trim((string) ($input['username'] ?? ''));
$password = (string) ($input['password'] ?? '');

if ($username === '' || $password === '') {
    json_error('Username and password are required.');
}

$stmt = db()->prepare(
    'SELECT id, full_name, username, password_hash, role
     FROM users
     WHERE username = ?
     LIMIT 1'
);
$stmt->execute([$username]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, (string) $user['password_hash'])) {
    json_error('Invalid username or password.', 401);
}

$role = (string) ($user['role'] ?? '');

if (!in_array($role, [ROLE_STUDENT, ROLE_STAFF], true)) {
    json_error('This account has an invalid role.', 403);
}

login_user($user);

json_response([
    'ok' => true,
    'message' => 'Login successful.',
    'user' => public_user($user),
]);
