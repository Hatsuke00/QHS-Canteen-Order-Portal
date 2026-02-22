<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

require_method('POST');
require_role_api(ROLE_STAFF);

$input = json_input();
$orderId = filter_var((string) ($input['order_id'] ?? ''), FILTER_VALIDATE_INT);
$newStatus = trim((string) ($input['status'] ?? ''));

if ($orderId === false || $orderId <= 0) {
    json_error('Invalid order ID.');
}

if (!validate_order_status($newStatus)) {
    json_error('Invalid order status.');
}

$stmt = db()->prepare('SELECT status FROM orders WHERE id = ? LIMIT 1');
$stmt->execute([$orderId]);
$order = $stmt->fetch();

if (!$order) {
    json_error('Order not found.', 404);
}

$currentStatus = (string) $order['status'];

$allowedTransitions = [
    'Pending' => ['Pending', 'Preparing', 'Completed'],
    'Preparing' => ['Preparing', 'Completed'],
    'Completed' => ['Completed'],
];

if (!in_array($newStatus, $allowedTransitions[$currentStatus] ?? [], true)) {
    json_error("Invalid status transition from {$currentStatus} to {$newStatus}.", 409);
}

$updateStmt = db()->prepare('UPDATE orders SET status = ? WHERE id = ?');
$updateStmt->execute([$newStatus, $orderId]);

json_response([
    'ok' => true,
    'message' => 'Order status updated.',
    'order' => [
        'id' => (int) $orderId,
        'status' => $newStatus,
    ],
]);

