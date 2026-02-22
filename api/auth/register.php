<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

require_method('POST');

$input = json_input();

$fullName = trim((string) ($input['full_name'] ?? ''));
$password = (string) ($input['password'] ?? '');
$role = strtolower(trim((string) ($input['role'] ?? '')));

$email = trim((string) ($input['email'] ?? ''));
$lrn = trim((string) ($input['lrn'] ?? ''));
$grade = trim((string) ($input['grade'] ?? ''));
$section = trim((string) ($input['section'] ?? ''));
$staffNumber = trim((string) ($input['staff_number'] ?? ''));

if ($fullName === '' || strlen($fullName) < 3 || strlen($fullName) > 120) {
    json_error('Full name must be 3 to 120 characters.');
}

if (strlen($password) < 8 || strlen($password) > 255) {
    json_error('Password must be at least 8 characters.');
}

if (!in_array($role, [ROLE_STUDENT, ROLE_STAFF], true)) {
    json_error('Role must be student or staff.');
}

$fullNameStmt = db()->prepare('SELECT id FROM users WHERE full_name = ? LIMIT 1');
$fullNameStmt->execute([$fullName]);
if ($fullNameStmt->fetch()) {
    json_error('Full name is already registered.', 409);
}

$username = '';
$studentEmail = null;
$studentLrn = null;
$studentGrade = null;
$studentSection = null;
$staffNumberValue = null;

if ($role === ROLE_STUDENT) {
    if ($email === '' || strlen($email) > 150 || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
        json_error('A valid email is required for student registration.');
    }

    if (!preg_match('/^\d{6,20}$/', $lrn)) {
        json_error('LRN must be 6 to 20 digits.');
    }

    if ($grade === '' || strlen($grade) > 30) {
        json_error('Grade is required and must be up to 30 characters.');
    }

    if ($section === '' || strlen($section) > 60) {
        json_error('Section is required and must be up to 60 characters.');
    }

    $emailStmt = db()->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
    $emailStmt->execute([$email]);
    if ($emailStmt->fetch()) {
        json_error('Email is already registered.', 409);
    }

    $lrnStmt = db()->prepare('SELECT id FROM users WHERE lrn = ? LIMIT 1');
    $lrnStmt->execute([$lrn]);
    if ($lrnStmt->fetch()) {
        json_error('LRN is already registered.', 409);
    }

    $username = $lrn;
    $studentEmail = strtolower($email);
    $studentLrn = $lrn;
    $studentGrade = $grade;
    $studentSection = $section;
}

if ($role === ROLE_STAFF) {
    if (!preg_match('/^[a-zA-Z0-9-]{3,50}$/', $staffNumber)) {
        json_error('Staff ID is required (3-50 characters, letters/numbers/dash).');
    }

    $staffStmt = db()->prepare('SELECT id FROM users WHERE staff_number = ? LIMIT 1');
    $staffStmt->execute([$staffNumber]);
    if ($staffStmt->fetch()) {
        json_error('Staff ID is already registered.', 409);
    }

    $username = $staffNumber;
    $staffNumberValue = $staffNumber;
}

$usernameStmt = db()->prepare('SELECT id FROM users WHERE username = ? LIMIT 1');
$usernameStmt->execute([$username]);
if ($usernameStmt->fetch()) {
    if ($role === ROLE_STUDENT) {
        json_error('LRN is already registered.', 409);
    }

    json_error('Staff ID is already registered.', 409);
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);

if ($passwordHash === false) {
    json_error('Unable to secure password.', 500);
}

$stmt = db()->prepare(
    'INSERT INTO users (full_name, username, password_hash, role, email, lrn, grade, section, staff_number)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
);

try {
    $stmt->execute([
        $fullName,
        $username,
        $passwordHash,
        $role,
        $studentEmail,
        $studentLrn,
        $studentGrade,
        $studentSection,
        $staffNumberValue,
    ]);
} catch (PDOException $exception) {
    if ((string) $exception->getCode() === '23000') {
        if ($role === ROLE_STUDENT) {
            json_error('Student information is already registered.', 409);
        }

        json_error('Staff ID is already registered.', 409);
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