<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

require_method('GET');
require_login_api();

$stmt = db()->query(
    'SELECT id, name, category, price, image_path
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
        'image_path' => (string) $row['image_path'],
    ];
}, $stmt->fetchAll());

json_response([
    'ok' => true,
    'items' => $items,
]);
