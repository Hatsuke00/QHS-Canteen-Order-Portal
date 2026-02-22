<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

require_method('POST');

$input = json_input();

$fullName = trim((string) ($input['full_name'] ?? ''));
$password = (string) ($input['password'] ?? '');

if ($fullName === '' || $password === '') {
    json_error('Full name and password are required.');
}

$stmt = db()->prepare(
    'SELECT id, full_name, username, password_hash, role
     FROM users
     WHERE full_name = ?
     ORDER BY id ASC'
);
$stmt->execute([$fullName]);
$users = $stmt->fetchAll();

if (!$users) {
    json_error('Invalid full name or password.', 401);
}

$matchedUser = null;
foreach ($users as $user) {
    if (password_verify($password, (string) $user['password_hash'])) {
        $matchedUser = $user;
        break;
    }
}

if (!$matchedUser) {
    json_error('Invalid full name or password.', 401);
}

$role = (string) ($matchedUser['role'] ?? '');

if (!in_array($role, [ROLE_STUDENT, ROLE_STAFF], true)) {
    json_error('This account has an invalid role.', 403);
}

login_user($matchedUser);

json_response([
    'ok' => true,
    'message' => 'Login successful.',
    'user' => public_user($matchedUser),
]);
