<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

require_method('GET');
require_role_api(ROLE_STAFF);

$ordersStmt = db()->query(
    'SELECT id, student_id, student_name, total_price, status, created_at
     FROM orders
     ORDER BY created_at DESC, id DESC'
);
$orders = $ordersStmt->fetchAll();

$itemsByOrder = [];

if ($orders !== []) {
    $orderIds = array_map(static fn(array $order): int => (int) $order['id'], $orders);
    $placeholders = implode(',', array_fill(0, count($orderIds), '?'));

    $itemsStmt = db()->prepare(
        "SELECT order_id, menu_item_id, item_name, price, quantity, line_total
         FROM order_items
         WHERE order_id IN ($placeholders)
         ORDER BY id ASC"
    );
    $itemsStmt->execute($orderIds);
    $items = $itemsStmt->fetchAll();

    foreach ($items as $item) {
        $orderId = (int) $item['order_id'];
        if (!isset($itemsByOrder[$orderId])) {
            $itemsByOrder[$orderId] = [];
        }

        $itemsByOrder[$orderId][] = [
            'menu_item_id' => (int) $item['menu_item_id'],
            'item_name' => (string) $item['item_name'],
            'price' => (float) $item['price'],
            'quantity' => (int) $item['quantity'],
            'line_total' => (float) $item['line_total'],
        ];
    }
}

$payload = array_map(static function (array $order) use ($itemsByOrder): array {
    $orderId = (int) $order['id'];

    return [
        'id' => $orderId,
        'student_id' => (int) $order['student_id'],
        'student_name' => (string) $order['student_name'],
        'total_price' => (float) $order['total_price'],
        'status' => (string) $order['status'],
        'created_at' => (string) $order['created_at'],
        'items' => $itemsByOrder[$orderId] ?? [],
    ];
}, $orders);

json_response([
    'ok' => true,
    'orders' => $payload,
]);
