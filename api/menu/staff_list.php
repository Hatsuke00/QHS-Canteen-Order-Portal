<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

require_method('GET');
require_role_api(ROLE_STAFF);

$stmt = db()->query(
    'SELECT id, name, category, price, description, nutritional_values, is_halal, image_path, is_available
     FROM menu_items
     WHERE is_available = 1
     ORDER BY category ASC, name ASC'
);

$items = array_map(static function (array $row): array {
    return [
        'id' => (int) $row['id'],
        'name' => (string) $row['name'],
        'category' => (string) $row['category'],
        'price' => (float) $row['price'],
        'description' => (string) $row['description'],
        'nutritional_values' => (string) $row['nutritional_values'],
        'is_halal' => ((int) $row['is_halal']) === 1,
        'image_path' => (string) $row['image_path'],
        'is_available' => ((int) $row['is_available']) === 1,
    ];
}, $stmt->fetchAll());

json_response([
    'ok' => true,
    'items' => $items,
]);