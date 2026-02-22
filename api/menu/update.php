<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

require_method('POST');
require_role_api(ROLE_STAFF);

$input = json_input();

$menuItemId = filter_var((string) ($input['menu_item_id'] ?? ''), FILTER_VALIDATE_INT);
$price = filter_var((string) ($input['price'] ?? ''), FILTER_VALIDATE_FLOAT);
$isAvailableInput = $input['is_available'] ?? null;

if ($menuItemId === false || $menuItemId <= 0) {
    json_error('Invalid menu item ID.');
}

if ($price === false || $price <= 0) {
    json_error('Price must be greater than 0.');
}

$isAvailable = null;
if (is_bool($isAvailableInput)) {
    $isAvailable = $isAvailableInput ? 1 : 0;
} elseif (in_array((string) $isAvailableInput, ['0', '1'], true)) {
    $isAvailable = (int) $isAvailableInput;
}

if ($isAvailable === null) {
    json_error('Availability must be 0 or 1.');
}

$existingStmt = db()->prepare('SELECT id, name, category FROM menu_items WHERE id = ? LIMIT 1');
$existingStmt->execute([$menuItemId]);
$existing = $existingStmt->fetch();

if (!$existing) {
    json_error('Menu item not found.', 404);
}

$updateStmt = db()->prepare(
    'UPDATE menu_items
     SET price = ?, is_available = ?
     WHERE id = ?'
);
$updateStmt->execute([$price, $isAvailable, $menuItemId]);

json_response([
    'ok' => true,
    'message' => 'Menu item updated.',
    'item' => [
        'id' => (int) $menuItemId,
        'name' => (string) $existing['name'],
        'category' => (string) $existing['category'],
        'price' => (float) $price,
        'is_available' => $isAvailable === 1,
    ],
]);
