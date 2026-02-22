<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

require_method('POST');
$student = require_role_api(ROLE_STUDENT);

$input = json_input();
$itemsInput = $input['items'] ?? null;

if (!is_array($itemsInput) || $itemsInput === []) {
    json_error('At least one item is required.');
}

$cart = [];
foreach ($itemsInput as $entry) {
    if (!is_array($entry)) {
        continue;
    }

    $menuItemId = filter_var((string) ($entry['menu_item_id'] ?? ''), FILTER_VALIDATE_INT);
    $quantity = filter_var((string) ($entry['quantity'] ?? ''), FILTER_VALIDATE_INT);

    if ($menuItemId === false || $menuItemId <= 0 || $quantity === false || $quantity <= 0) {
        continue;
    }

    $cart[(int) $menuItemId] = ($cart[(int) $menuItemId] ?? 0) + min((int) $quantity, 99);
}

if ($cart === []) {
    json_error('No valid order items were provided.');
}

$menuIds = array_keys($cart);
$placeholders = implode(',', array_fill(0, count($menuIds), '?'));

$pdo = db();
$pdo->beginTransaction();

try {
    $menuStmt = $pdo->prepare(
        "SELECT id, name, price
         FROM menu_items
         WHERE id IN ($placeholders) AND is_available = 1
         FOR UPDATE"
    );
    $menuStmt->execute($menuIds);
    $menuRows = $menuStmt->fetchAll();

    $menuMap = [];
    foreach ($menuRows as $row) {
        $menuMap[(int) $row['id']] = $row;
    }

    $lineItems = [];
    $totalPrice = 0.0;

    foreach ($cart as $menuId => $quantity) {
        if (!isset($menuMap[$menuId])) {
            continue;
        }

        $menu = $menuMap[$menuId];
        $price = (float) $menu['price'];
        $lineTotal = $price * $quantity;

        $lineItems[] = [
            'menu_item_id' => $menuId,
            'item_name' => (string) $menu['name'],
            'price' => $price,
            'quantity' => $quantity,
            'line_total' => $lineTotal,
        ];

        $totalPrice += $lineTotal;
    }

    if ($lineItems === []) {
        $pdo->rollBack();
        json_error('Selected items are no longer available.', 409);
    }

    $orderStmt = $pdo->prepare(
        'INSERT INTO orders (student_id, student_name, total_price, status)
         VALUES (?, ?, ?, "Pending")'
    );
    $orderStmt->execute([
        (int) $student['id'],
        (string) $student['full_name'],
        $totalPrice,
    ]);

    $orderId = (int) $pdo->lastInsertId();

    $itemStmt = $pdo->prepare(
        'INSERT INTO order_items (order_id, menu_item_id, item_name, price, quantity, line_total)
         VALUES (?, ?, ?, ?, ?, ?)'
    );

    foreach ($lineItems as $lineItem) {
        $itemStmt->execute([
            $orderId,
            $lineItem['menu_item_id'],
            $lineItem['item_name'],
            $lineItem['price'],
            $lineItem['quantity'],
            $lineItem['line_total'],
        ]);
    }

    $createdAtStmt = $pdo->prepare('SELECT created_at FROM orders WHERE id = ? LIMIT 1');
    $createdAtStmt->execute([$orderId]);
    $createdAtRow = $createdAtStmt->fetch();
    $createdAt = (string) ($createdAtRow['created_at'] ?? date('Y-m-d H:i:s'));

    $pdo->commit();

    json_response([
        'ok' => true,
        'message' => 'Order placed successfully.',
        'order' => [
            'id' => $orderId,
            'student_id' => (int) $student['id'],
            'student_name' => (string) $student['full_name'],
            'status' => 'Pending',
            'total_price' => round($totalPrice, 2),
            'created_at' => $createdAt,
            'items' => $lineItems,
        ],
    ], 201);
} catch (Throwable $exception) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    throw $exception;
}
