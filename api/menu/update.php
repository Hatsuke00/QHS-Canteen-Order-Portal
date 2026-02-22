<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

require_method('POST');
require_role_api(ROLE_STAFF);

$input = json_input();

$menuItemId = filter_var((string) ($input['menu_item_id'] ?? ''), FILTER_VALIDATE_INT);
$name = trim((string) ($input['name'] ?? ''));
$category = trim((string) ($input['category'] ?? ''));
$price = filter_var((string) ($input['price'] ?? ''), FILTER_VALIDATE_FLOAT);
$description = trim((string) ($input['description'] ?? ''));
$nutritionalValues = trim((string) ($input['nutritional_values'] ?? ''));
$imagePath = trim((string) ($input['image_path'] ?? ''));
$isAvailableInput = $input['is_available'] ?? 1;
$isHalalInput = $input['is_halal'] ?? 1;

$allowedCategories = ['Food', 'Drink', 'Snack', 'Kakanin'];

if ($menuItemId === false || $menuItemId <= 0) {
    json_error('Invalid menu item ID.');
}

if ($name === '' || strlen($name) > 100) {
    json_error('Item name must be 1 to 100 characters.');
}

if (!in_array($category, $allowedCategories, true)) {
    json_error('Invalid category.');
}

if ($price === false || $price <= 0) {
    json_error('Price must be greater than 0.');
}

if ($description === '' || strlen($description) > 1000) {
    json_error('Description must be 1 to 1000 characters.');
}

if ($nutritionalValues === '' || strlen($nutritionalValues) > 1000) {
    json_error('Nutritional values must be 1 to 1000 characters.');
}

if ($imagePath === '' || strlen($imagePath) > 255) {
    json_error('Image path must be 1 to 255 characters.');
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

$isHalal = null;
if (is_bool($isHalalInput)) {
    $isHalal = $isHalalInput ? 1 : 0;
} elseif (in_array((string) $isHalalInput, ['0', '1'], true)) {
    $isHalal = (int) $isHalalInput;
}

if ($isHalal === null) {
    json_error('Halal value must be 0 or 1.');
}

$existingStmt = db()->prepare('SELECT id FROM menu_items WHERE id = ? LIMIT 1');
$existingStmt->execute([$menuItemId]);

if (!$existingStmt->fetch()) {
    json_error('Menu item not found.', 404);
}

$updateStmt = db()->prepare(
    'UPDATE menu_items
     SET name = ?, category = ?, price = ?, description = ?, nutritional_values = ?, is_halal = ?, image_path = ?, is_available = ?
     WHERE id = ?'
);

try {
    $updateStmt->execute([$name, $category, $price, $description, $nutritionalValues, $isHalal, $imagePath, $isAvailable, $menuItemId]);
} catch (PDOException $exception) {
    if ((string) $exception->getCode() === '23000') {
        json_error('A menu item with the same name and category already exists.', 409);
    }

    throw $exception;
}

json_response([
    'ok' => true,
    'message' => 'Menu item updated.',
    'item' => [
        'id' => (int) $menuItemId,
        'name' => $name,
        'category' => $category,
        'price' => (float) $price,
        'description' => $description,
        'nutritional_values' => $nutritionalValues,
        'is_halal' => $isHalal === 1,
        'image_path' => $imagePath,
        'is_available' => $isAvailable === 1,
    ],
]);