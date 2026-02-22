<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

require_method('POST');
require_role_api(ROLE_STAFF);

$input = json_input();
$menuItemId = filter_var((string) ($input['menu_item_id'] ?? ''), FILTER_VALIDATE_INT);

if ($menuItemId === false || $menuItemId <= 0) {
    json_error('Invalid menu item ID.');
}

$pdo = db();

$existingStmt = $pdo->prepare('SELECT id, name FROM menu_items WHERE id = ? LIMIT 1');
$existingStmt->execute([$menuItemId]);
$existing = $existingStmt->fetch();

if (!$existing) {
    json_error('Menu item not found.', 404);
}

$deleteStmt = $pdo->prepare('DELETE FROM menu_items WHERE id = ?');

try {
    $deleteStmt->execute([$menuItemId]);

    json_response([
        'ok' => true,
        'message' => 'Menu item deleted.',
        'deleted' => true,
    ]);
} catch (PDOException $exception) {
    if ((string) $exception->getCode() === '23000') {
        $archiveStmt = $pdo->prepare('UPDATE menu_items SET is_available = 0 WHERE id = ?');
        $archiveStmt->execute([$menuItemId]);

        json_response([
            'ok' => true,
            'message' => 'Menu item archived because it exists in past orders.',
            'deleted' => false,
        ]);
    }

    throw $exception;
}
