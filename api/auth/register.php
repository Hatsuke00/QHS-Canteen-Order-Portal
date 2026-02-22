<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

require_method('POST');

$input = json_input();

$fullName = trim((string) ($input['full_name'] ?? ''));
$username = trim((string) ($input['username'] ?? ''));
$password = (string) ($input['password'] ?? '');
$role = strtolower(trim((string) ($input['role'] ?? '')));

if ($fullName === '' || strlen($fullName) < 3 || strlen($fullName) > 120) {
    json_error('Full name must be 3 to 120 characters.');
}

if (!preg_match('/^[a-zA-Z0-9_]{3,50}$/', $username)) {
    json_error('Username must be 3-50 characters (letters, numbers, underscore).');
}

if (strlen($password) < 8 || strlen($password) > 255) {
    json_error('Password must be at least 8 characters.');
}

if (!in_array($role, [ROLE_STUDENT, ROLE_STAFF], true)) {
    json_error('Role must be student or staff.');
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);

if ($passwordHash === false) {
    json_error('Unable to secure password.', 500);
}

$stmt = db()->prepare(
    'INSERT INTO users (full_name, username, password_hash, role)
     VALUES (?, ?, ?, ?)'
);

try {
    $stmt->execute([$fullName, $username, $passwordHash, $role]);
} catch (PDOException $exception) {
    if ((string) $exception->getCode() === '23000') {
        json_error('Username is already taken.', 409);
    }

    throw $exception;
}

$userId = (int) db()->lastInsertId();
$user = [
    'id' => $userId,
    'full_name' => $fullName,
    'username' => $username,
    'role' => $role,
];

login_user($user);

json_response([
    'ok' => true,
    'message' => 'Registration successful.',
    'user' => public_user($user),
]);
