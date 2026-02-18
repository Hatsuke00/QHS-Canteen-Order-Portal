<?php
declare(strict_types=1);

header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

if (ob_get_level() === 0) {
    ob_start();
}

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

const QHS_ALLOWED_KEYS = [
    "qhs_users",
    "qhs_orders",
    "qhs_menu",
    "qhs_suggestions",
    "qhs_student_suspensions"
];

const QHS_ALLOWED_ROLES = ["student", "staff"];

function qhs_env_or_default(string $name, string $default): string
{
    $value = getenv($name);
    if ($value === false || $value === "") return $default;
    return $value;
}

function qhs_json_response(int $status, array $payload): void
{
    if (ob_get_level() > 0) {
        ob_clean();
    }
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function qhs_read_json_body(): array
{
    $raw = file_get_contents("php://input");
    if ($raw === false || trim($raw) === "") return [];

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) return [];
    return $decoded;
}

function qhs_connect_db(): PDO
{
    $host = qhs_env_or_default("QHS_DB_HOST", "127.0.0.1");
    $port = qhs_env_or_default("QHS_DB_PORT", "3306");
    $database = qhs_env_or_default("QHS_DB_NAME", "qhs_canteen");
    $user = qhs_env_or_default("QHS_DB_USER", "root");
    $password = qhs_env_or_default("QHS_DB_PASS", "");
    $charset = qhs_env_or_default("QHS_DB_CHARSET", "utf8mb4");

    $dsn = "mysql:host={$host};port={$port};dbname={$database};charset={$charset}";

    return new PDO(
        $dsn,
        $user,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
}

function qhs_ensure_schema(PDO $pdo): void
{
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS qhs_storage (
            storage_key VARCHAR(64) NOT NULL PRIMARY KEY,
            storage_value LONGTEXT NOT NULL,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS qhs_accounts (
            id VARCHAR(64) NOT NULL PRIMARY KEY,
            full_name VARCHAR(160) NOT NULL,
            id_number VARCHAR(64) NOT NULL DEFAULT '',
            class_department VARCHAR(120) NOT NULL DEFAULT '',
            email VARCHAR(190) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(16) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_qhs_accounts_role (role)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS qhs_order_payments (
            order_id VARCHAR(64) NOT NULL PRIMARY KEY,
            user_id VARCHAR(64) NOT NULL,
            meal_name VARCHAR(160) NOT NULL,
            quantity INT NOT NULL DEFAULT 1,
            total_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            payment_method VARCHAR(16) NOT NULL DEFAULT 'On-site',
            payment_reference VARCHAR(120) NOT NULL DEFAULT '',
            order_status VARCHAR(16) NOT NULL DEFAULT 'Pending',
            placed_at DATETIME NULL,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_qhs_order_payments_user_id (user_id),
            INDEX idx_qhs_order_payments_payment_method (payment_method),
            INDEX idx_qhs_order_payments_status (order_status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS qhs_menu_items (
            menu_id VARCHAR(64) NOT NULL PRIMARY KEY,
            item_name VARCHAR(160) NOT NULL,
            item_category VARCHAR(64) NOT NULL,
            item_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            image_url TEXT NULL,
            availability VARCHAR(24) NOT NULL DEFAULT 'Available',
            nutrition VARCHAR(160) NOT NULL DEFAULT '',
            item_description TEXT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_qhs_menu_items_category (item_category),
            INDEX idx_qhs_menu_items_availability (availability)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS qhs_student_reservations (
            reservation_id VARCHAR(64) NOT NULL PRIMARY KEY,
            user_id VARCHAR(64) NOT NULL,
            meal_id VARCHAR(64) NOT NULL DEFAULT '',
            meal_name VARCHAR(160) NOT NULL,
            quantity INT NOT NULL DEFAULT 1,
            unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            total_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            payment_method VARCHAR(16) NOT NULL DEFAULT 'On-site',
            payment_reference VARCHAR(120) NOT NULL DEFAULT '',
            reservation_status VARCHAR(16) NOT NULL DEFAULT 'Pending',
            hidden_by_staff TINYINT(1) NOT NULL DEFAULT 0,
            placed_at DATETIME NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_qhs_student_reservations_user (user_id),
            INDEX idx_qhs_student_reservations_status (reservation_status),
            INDEX idx_qhs_student_reservations_hidden (hidden_by_staff),
            INDEX idx_qhs_student_reservations_placed_at (placed_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS qhs_suggestions (
            suggestion_id VARCHAR(64) NOT NULL PRIMARY KEY,
            user_id VARCHAR(64) NOT NULL,
            user_role VARCHAR(16) NOT NULL,
            full_name_snapshot VARCHAR(160) NOT NULL,
            suggestion_text TEXT NOT NULL,
            suggestion_status VARCHAR(16) NOT NULL DEFAULT 'new',
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_qhs_suggestions_user_id (user_id),
            INDEX idx_qhs_suggestions_status (suggestion_status),
            INDEX idx_qhs_suggestions_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS qhs_notifications (
            notification_id VARCHAR(64) NOT NULL PRIMARY KEY,
            user_id VARCHAR(64) NOT NULL,
            notification_type VARCHAR(32) NOT NULL,
            title VARCHAR(120) NOT NULL,
            message TEXT NOT NULL,
            source_entity VARCHAR(32) NOT NULL DEFAULT '',
            source_id VARCHAR(64) NOT NULL DEFAULT '',
            is_read TINYINT(1) NOT NULL DEFAULT 0,
            read_at DATETIME NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_qhs_notifications_user_created (user_id, created_at),
            INDEX idx_qhs_notifications_user_read (user_id, is_read)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS qhs_activity_logs (
            log_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            actor_user_id VARCHAR(64) NOT NULL DEFAULT '',
            actor_role VARCHAR(16) NOT NULL DEFAULT '',
            action_type VARCHAR(64) NOT NULL,
            entity_type VARCHAR(32) NOT NULL DEFAULT '',
            entity_id VARCHAR(64) NOT NULL DEFAULT '',
            before_state LONGTEXT NULL,
            after_state LONGTEXT NULL,
            meta LONGTEXT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_qhs_activity_logs_created_at (created_at),
            INDEX idx_qhs_activity_logs_actor (actor_user_id, created_at),
            INDEX idx_qhs_activity_logs_action (action_type, created_at),
            INDEX idx_qhs_activity_logs_entity (entity_type, entity_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS qhs_student_suspensions (
            user_id VARCHAR(64) NOT NULL PRIMARY KEY,
            is_suspended TINYINT(1) NOT NULL DEFAULT 0,
            suspension_reason TEXT NOT NULL,
            suspended_by_user_id VARCHAR(64) NOT NULL DEFAULT '',
            suspended_at DATETIME NULL,
            lifted_at DATETIME NULL,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_qhs_student_suspensions_suspended (is_suspended),
            INDEX idx_qhs_student_suspensions_updated (updated_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );
}

function qhs_decode_value(?string $value)
{
    if (!is_string($value)) return null;
    $decoded = json_decode($value, true);
    if (json_last_error() !== JSON_ERROR_NONE) return null;
    return $decoded;
}

function qhs_encode_value($value): string
{
    $encoded = json_encode($value, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($encoded === false) {
        throw new RuntimeException("JSON encoding failed.");
    }
    return $encoded;
}

function qhs_normalize_email($email): string
{
    return strtolower(trim((string)$email));
}

function qhs_normalize_role($role): string
{
    $normalized = strtolower(trim((string)$role));
    if (in_array($normalized, QHS_ALLOWED_ROLES, true)) return $normalized;
    return "";
}

function qhs_normalize_payment_method($value): string
{
    $raw = strtolower(trim((string)$value));
    if ($raw === "gcash") return "GCash";
    return "On-site";
}

function qhs_normalize_availability($value): string
{
    $raw = strtolower(trim((string)$value));
    if ($raw === "out of stock" || $raw === "unavailable") return "Out of Stock";
    return "Available";
}

function qhs_to_mysql_datetime_utc($value): ?string
{
    $raw = trim((string)$value);
    if ($raw === "") return null;
    $timestamp = strtotime($raw);
    if ($timestamp === false) return null;
    return gmdate("Y-m-d H:i:s", $timestamp);
}

function qhs_from_mysql_datetime_to_iso($value): string
{
    $raw = trim((string)$value);
    if ($raw === "") return "";

    $timestamp = strtotime("{$raw} UTC");
    if ($timestamp === false) {
        $timestamp = strtotime($raw);
    }
    if ($timestamp === false) return "";

    return gmdate("c", $timestamp);
}

function qhs_create_id(string $prefix): string
{
    return sprintf(
        "%s-%d-%s",
        $prefix,
        (int)floor(microtime(true) * 1000),
        bin2hex(random_bytes(3))
    );
}

function qhs_public_user(array $row): array
{
    return [
        "id" => (string)($row["id"] ?? ""),
        "fullName" => trim((string)($row["full_name"] ?? "")),
        "idNumber" => trim((string)($row["id_number"] ?? "")),
        "classDepartment" => trim((string)($row["class_department"] ?? "")),
        "email" => qhs_normalize_email($row["email"] ?? ""),
        "role" => qhs_normalize_role($row["role"] ?? ""),
        "createdAt" => (string)($row["created_at"] ?? "")
    ];
}

function qhs_storage_get(PDO $pdo, string $key, $fallback)
{
    $statement = $pdo->prepare(
        "SELECT storage_value
         FROM qhs_storage
         WHERE storage_key = :storage_key
         LIMIT 1"
    );
    $statement->execute([":storage_key" => $key]);
    $row = $statement->fetch();
    if (!$row) return $fallback;

    $decoded = qhs_decode_value($row["storage_value"] ?? null);
    if ($decoded === null) return $fallback;
    return $decoded;
}

function qhs_storage_save(PDO $pdo, string $key, $value): void
{
    $statement = $pdo->prepare(
        "INSERT INTO qhs_storage (storage_key, storage_value)
         VALUES (:storage_key, :storage_value)
         ON DUPLICATE KEY UPDATE
            storage_value = VALUES(storage_value)"
    );
    $statement->execute([
        ":storage_key" => $key,
        ":storage_value" => qhs_encode_value($value)
    ]);
}

function qhs_sync_user_to_storage(PDO $pdo, array $user): void
{
    $users = qhs_storage_get($pdo, "qhs_users", []);
    if (!is_array($users)) $users = [];

    $normalizedEmail = qhs_normalize_email($user["email"] ?? "");
    $nextUsers = [];
    $updated = false;

    foreach ($users as $entry) {
        if (!is_array($entry)) continue;

        $entryId = (string)($entry["id"] ?? "");
        $entryEmail = qhs_normalize_email($entry["email"] ?? "");
        $sameUser = ($entryId !== "" && $entryId === $user["id"])
            || ($entryEmail !== "" && $entryEmail === $normalizedEmail);

        if ($sameUser) {
            $nextUsers[] = array_merge($entry, $user);
            $updated = true;
            continue;
        }

        $nextUsers[] = $entry;
    }

    if (!$updated) {
        $nextUsers[] = $user;
    }

    qhs_storage_save($pdo, "qhs_users", $nextUsers);
}

function qhs_sync_user_password_to_storage(PDO $pdo, string $userId, string $email, string $passwordHash): void
{
    $users = qhs_storage_get($pdo, "qhs_users", []);
    if (!is_array($users)) return;

    $normalizedEmail = qhs_normalize_email($email);
    $changed = false;
    $nextUsers = [];

    foreach ($users as $entry) {
        if (!is_array($entry)) {
            $nextUsers[] = $entry;
            continue;
        }

        $entryId = trim((string)($entry["id"] ?? ""));
        $entryEmail = qhs_normalize_email($entry["email"] ?? "");
        $sameUser = ($userId !== "" && $entryId === $userId)
            || ($normalizedEmail !== "" && $entryEmail === $normalizedEmail);

        if ($sameUser) {
            $entry["password"] = $passwordHash;
            $changed = true;
        }

        $nextUsers[] = $entry;
    }

    if ($changed) {
        qhs_storage_save($pdo, "qhs_users", $nextUsers);
    }
}

function qhs_remove_user_data_from_storage(PDO $pdo, string $userId, string $email = ""): void
{
    $targetUserId = trim($userId);
    $targetEmail = qhs_normalize_email($email);

    $users = qhs_storage_get($pdo, "qhs_users", []);
    if (is_array($users)) {
        $nextUsers = [];
        foreach ($users as $entry) {
            if (!is_array($entry)) {
                $nextUsers[] = $entry;
                continue;
            }

            $entryId = trim((string)($entry["id"] ?? ""));
            $entryEmail = qhs_normalize_email($entry["email"] ?? "");
            $isTargetUser = ($targetUserId !== "" && $entryId === $targetUserId)
                || ($targetEmail !== "" && $entryEmail === $targetEmail);
            if ($isTargetUser) continue;

            $nextUsers[] = $entry;
        }
        qhs_storage_save($pdo, "qhs_users", $nextUsers);
    }

    $orders = qhs_storage_get($pdo, "qhs_orders", []);
    if (is_array($orders)) {
        $nextOrders = [];
        foreach ($orders as $entry) {
            if (!is_array($entry)) {
                $nextOrders[] = $entry;
                continue;
            }

            $entryUserId = trim((string)($entry["userId"] ?? ""));
            if ($targetUserId !== "" && $entryUserId === $targetUserId) continue;
            $nextOrders[] = $entry;
        }
        qhs_storage_save($pdo, "qhs_orders", $nextOrders);
    }

    $suggestions = qhs_storage_get($pdo, "qhs_suggestions", []);
    if (is_array($suggestions)) {
        $nextSuggestions = [];
        foreach ($suggestions as $entry) {
            if (!is_array($entry)) {
                $nextSuggestions[] = $entry;
                continue;
            }

            $entryUserId = trim((string)($entry["userId"] ?? ""));
            if ($targetUserId !== "" && $entryUserId === $targetUserId) continue;
            $nextSuggestions[] = $entry;
        }
        qhs_storage_save($pdo, "qhs_suggestions", $nextSuggestions);
    }

    $suspensions = qhs_storage_get($pdo, "qhs_student_suspensions", []);
    if (is_array($suspensions)) {
        $nextSuspensions = [];
        foreach ($suspensions as $entry) {
            if (!is_array($entry)) {
                $nextSuspensions[] = $entry;
                continue;
            }

            $entryUserId = trim((string)($entry["userId"] ?? ($entry["id"] ?? "")));
            if (strpos($entryUserId, "sus-") === 0) {
                $entryUserId = substr($entryUserId, 4);
            }
            if ($targetUserId !== "" && $entryUserId === $targetUserId) continue;
            $nextSuspensions[] = $entry;
        }
        qhs_storage_save($pdo, "qhs_student_suspensions", $nextSuspensions);
    }
}

function qhs_sync_order_payments(PDO $pdo, $orders): void
{
    if (!is_array($orders)) return;

    $statement = $pdo->prepare(
        "INSERT INTO qhs_order_payments (
            order_id, user_id, meal_name, quantity, total_price, payment_method, payment_reference, order_status, placed_at
         ) VALUES (
            :order_id, :user_id, :meal_name, :quantity, :total_price, :payment_method, :payment_reference, :order_status, :placed_at
         )
         ON DUPLICATE KEY UPDATE
            user_id = VALUES(user_id),
            meal_name = VALUES(meal_name),
            quantity = VALUES(quantity),
            total_price = VALUES(total_price),
            payment_method = VALUES(payment_method),
            payment_reference = VALUES(payment_reference),
            order_status = VALUES(order_status),
            placed_at = VALUES(placed_at)"
    );

    foreach ($orders as $order) {
        if (!is_array($order)) continue;

        $orderId = trim((string)($order["id"] ?? ""));
        if ($orderId === "") continue;

        $userId = trim((string)($order["userId"] ?? ""));
        $mealName = trim((string)($order["mealName"] ?? "Unknown meal"));
        $quantity = max(1, (int)($order["quantity"] ?? 1));
        $totalPrice = (float)($order["totalPrice"] ?? 0);
        $paymentMethod = qhs_normalize_payment_method($order["paymentMethod"] ?? "");
        $paymentReference = $paymentMethod === "GCash"
            ? trim((string)($order["paymentReference"] ?? ""))
            : "";
        $orderStatus = trim((string)($order["status"] ?? "Pending"));
        if ($orderStatus !== "Completed") $orderStatus = "Pending";

        $placedAtValue = null;
        $placedAtRaw = trim((string)($order["placedAt"] ?? ""));
        if ($placedAtRaw !== "") {
            $timestamp = strtotime($placedAtRaw);
            if ($timestamp !== false) {
                $placedAtValue = gmdate("Y-m-d H:i:s", $timestamp);
            }
        }

        $statement->execute([
            ":order_id" => $orderId,
            ":user_id" => $userId,
            ":meal_name" => $mealName,
            ":quantity" => $quantity,
            ":total_price" => number_format($totalPrice, 2, ".", ""),
            ":payment_method" => $paymentMethod,
            ":payment_reference" => $paymentReference,
            ":order_status" => $orderStatus,
            ":placed_at" => $placedAtValue
        ]);
    }
}

function qhs_fetch_menu_items(PDO $pdo): array
{
    $statement = $pdo->query(
        "SELECT
            menu_id,
            item_name,
            item_category,
            item_price,
            image_url,
            availability,
            nutrition,
            item_description
         FROM qhs_menu_items
         ORDER BY updated_at ASC"
    );

    $rows = $statement->fetchAll();
    $items = [];

    foreach ($rows as $row) {
        $items[] = [
            "id" => trim((string)($row["menu_id"] ?? "")),
            "name" => trim((string)($row["item_name"] ?? "")),
            "category" => trim((string)($row["item_category"] ?? "")),
            "price" => (float)($row["item_price"] ?? 0),
            "imageUrl" => trim((string)($row["image_url"] ?? "")),
            "availability" => qhs_normalize_availability($row["availability"] ?? ""),
            "nutrition" => trim((string)($row["nutrition"] ?? "")),
            "description" => trim((string)($row["item_description"] ?? ""))
        ];
    }

    return $items;
}

function qhs_sync_menu_items(PDO $pdo, $menu): void
{
    if (!is_array($menu)) return;

    $statement = $pdo->prepare(
        "INSERT INTO qhs_menu_items (
            menu_id, item_name, item_category, item_price, image_url, availability, nutrition, item_description
         ) VALUES (
            :menu_id, :item_name, :item_category, :item_price, :image_url, :availability, :nutrition, :item_description
         )
         ON DUPLICATE KEY UPDATE
            item_name = VALUES(item_name),
            item_category = VALUES(item_category),
            item_price = VALUES(item_price),
            image_url = VALUES(image_url),
            availability = VALUES(availability),
            nutrition = VALUES(nutrition),
            item_description = VALUES(item_description)"
    );

    $incomingIds = [];
    $ownsTransaction = !$pdo->inTransaction();
    if ($ownsTransaction) {
        $pdo->beginTransaction();
    }
    try {
        foreach ($menu as $item) {
            if (!is_array($item)) continue;

            $menuId = trim((string)($item["id"] ?? ""));
            if ($menuId === "") continue;

            $itemName = trim((string)($item["name"] ?? "Unnamed Item"));
            $itemCategory = trim((string)($item["category"] ?? "Food"));
            $itemPrice = (float)($item["price"] ?? 0);
            if ($itemPrice < 0) $itemPrice = 0;
            $imageUrl = trim((string)($item["imageUrl"] ?? ""));
            $availability = qhs_normalize_availability($item["availability"] ?? "Available");
            $nutrition = trim((string)($item["nutrition"] ?? ""));
            $description = trim((string)($item["description"] ?? ""));

            $statement->execute([
                ":menu_id" => $menuId,
                ":item_name" => $itemName !== "" ? $itemName : "Unnamed Item",
                ":item_category" => $itemCategory !== "" ? $itemCategory : "Food",
                ":item_price" => number_format($itemPrice, 2, ".", ""),
                ":image_url" => $imageUrl,
                ":availability" => $availability,
                ":nutrition" => $nutrition,
                ":item_description" => $description
            ]);
            $incomingIds[$menuId] = true;
        }

        $ids = array_keys($incomingIds);
        if (!empty($ids)) {
            $placeholders = implode(",", array_fill(0, count($ids), "?"));
            $deleteStatement = $pdo->prepare("DELETE FROM qhs_menu_items WHERE menu_id NOT IN ({$placeholders})");
            $deleteStatement->execute($ids);
        } else {
            $pdo->exec("DELETE FROM qhs_menu_items");
        }

        if ($ownsTransaction && $pdo->inTransaction()) {
            $pdo->commit();
        }
    } catch (Throwable $exception) {
        if ($ownsTransaction && $pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $exception;
    }
}

function qhs_fetch_student_reservations(PDO $pdo): array
{
    $statement = $pdo->query(
        "SELECT
            reservation_id,
            user_id,
            meal_id,
            meal_name,
            quantity,
            unit_price,
            total_price,
            payment_method,
            payment_reference,
            reservation_status,
            hidden_by_staff,
            placed_at
         FROM qhs_student_reservations
         ORDER BY placed_at DESC, updated_at DESC"
    );

    $rows = $statement->fetchAll();
    $orders = [];

    foreach ($rows as $row) {
        $status = trim((string)($row["reservation_status"] ?? "Pending"));
        if ($status !== "Completed") $status = "Pending";

        $paymentMethod = qhs_normalize_payment_method($row["payment_method"] ?? "");
        $paymentReference = $paymentMethod === "GCash"
            ? trim((string)($row["payment_reference"] ?? ""))
            : "";

        $orders[] = [
            "id" => trim((string)($row["reservation_id"] ?? "")),
            "userId" => trim((string)($row["user_id"] ?? "")),
            "mealId" => trim((string)($row["meal_id"] ?? "")),
            "mealName" => trim((string)($row["meal_name"] ?? "Unknown meal")),
            "quantity" => max(1, (int)($row["quantity"] ?? 1)),
            "unitPrice" => (float)($row["unit_price"] ?? 0),
            "totalPrice" => (float)($row["total_price"] ?? 0),
            "paymentMethod" => $paymentMethod,
            "paymentReference" => $paymentReference,
            "status" => $status,
            "hiddenByStaff" => ((int)($row["hidden_by_staff"] ?? 0)) === 1,
            "placedAt" => qhs_from_mysql_datetime_to_iso($row["placed_at"] ?? null)
        ];
    }

    return $orders;
}

function qhs_sync_student_reservations(PDO $pdo, $orders): void
{
    if (!is_array($orders)) return;

    $statement = $pdo->prepare(
        "INSERT INTO qhs_student_reservations (
            reservation_id,
            user_id,
            meal_id,
            meal_name,
            quantity,
            unit_price,
            total_price,
            payment_method,
            payment_reference,
            reservation_status,
            hidden_by_staff,
            placed_at
         ) VALUES (
            :reservation_id,
            :user_id,
            :meal_id,
            :meal_name,
            :quantity,
            :unit_price,
            :total_price,
            :payment_method,
            :payment_reference,
            :reservation_status,
            :hidden_by_staff,
            :placed_at
         )
         ON DUPLICATE KEY UPDATE
            user_id = VALUES(user_id),
            meal_id = VALUES(meal_id),
            meal_name = VALUES(meal_name),
            quantity = VALUES(quantity),
            unit_price = VALUES(unit_price),
            total_price = VALUES(total_price),
            payment_method = VALUES(payment_method),
            payment_reference = VALUES(payment_reference),
            reservation_status = VALUES(reservation_status),
            hidden_by_staff = VALUES(hidden_by_staff),
            placed_at = VALUES(placed_at)"
    );

    $incomingIds = [];
    $ownsTransaction = !$pdo->inTransaction();
    if ($ownsTransaction) {
        $pdo->beginTransaction();
    }
    try {
        foreach ($orders as $order) {
            if (!is_array($order)) continue;

            $reservationId = trim((string)($order["id"] ?? ""));
            if ($reservationId === "") continue;

            $userId = trim((string)($order["userId"] ?? ""));
            $mealId = trim((string)($order["mealId"] ?? ""));
            $mealName = trim((string)($order["mealName"] ?? "Unknown meal"));
            $quantity = max(1, (int)($order["quantity"] ?? 1));
            $totalPrice = (float)($order["totalPrice"] ?? 0);
            if ($totalPrice < 0) $totalPrice = 0;

            $unitPrice = (float)($order["unitPrice"] ?? 0);
            if ($unitPrice <= 0 && $quantity > 0) {
                $unitPrice = $totalPrice / $quantity;
            }
            if ($unitPrice < 0) $unitPrice = 0;

            $paymentMethod = qhs_normalize_payment_method($order["paymentMethod"] ?? "");
            $paymentReference = $paymentMethod === "GCash"
                ? trim((string)($order["paymentReference"] ?? ""))
                : "";

            $status = trim((string)($order["status"] ?? "Pending"));
            if ($status !== "Completed") $status = "Pending";

            $hiddenByStaff = !empty($order["hiddenByStaff"]) ? 1 : 0;
            $placedAt = qhs_to_mysql_datetime_utc($order["placedAt"] ?? "");

            $statement->execute([
                ":reservation_id" => $reservationId,
                ":user_id" => $userId,
                ":meal_id" => $mealId,
                ":meal_name" => $mealName !== "" ? $mealName : "Unknown meal",
                ":quantity" => $quantity,
                ":unit_price" => number_format($unitPrice, 2, ".", ""),
                ":total_price" => number_format($totalPrice, 2, ".", ""),
                ":payment_method" => $paymentMethod,
                ":payment_reference" => $paymentReference,
                ":reservation_status" => $status,
                ":hidden_by_staff" => $hiddenByStaff,
                ":placed_at" => $placedAt
            ]);

            $incomingIds[$reservationId] = true;
        }

        $ids = array_keys($incomingIds);
        if (!empty($ids)) {
            $placeholders = implode(",", array_fill(0, count($ids), "?"));
            $deleteStatement = $pdo->prepare("DELETE FROM qhs_student_reservations WHERE reservation_id NOT IN ({$placeholders})");
            $deleteStatement->execute($ids);
        } else {
            $pdo->exec("DELETE FROM qhs_student_reservations");
        }

        if ($ownsTransaction && $pdo->inTransaction()) {
            $pdo->commit();
        }
    } catch (Throwable $exception) {
        if ($ownsTransaction && $pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $exception;
    }
}

function qhs_normalize_suggestion_status($value): string
{
    $normalized = strtolower(trim((string)$value));
    if ($normalized === "reviewed") return "reviewed";
    if ($normalized === "resolved") return "resolved";
    return "new";
}

function qhs_fetch_suggestions(PDO $pdo): array
{
    $statement = $pdo->query(
        "SELECT
            suggestion_id,
            user_id,
            user_role,
            full_name_snapshot,
            suggestion_text,
            suggestion_status,
            created_at,
            updated_at
         FROM qhs_suggestions
         ORDER BY created_at DESC, updated_at DESC"
    );

    $rows = $statement->fetchAll();
    $suggestions = [];

    foreach ($rows as $row) {
        $role = qhs_normalize_role($row["user_role"] ?? "");
        if ($role === "") {
            $role = "student";
        }

        $suggestions[] = [
            "id" => trim((string)($row["suggestion_id"] ?? "")),
            "userId" => trim((string)($row["user_id"] ?? "")),
            "role" => $role,
            "fullName" => trim((string)($row["full_name_snapshot"] ?? "")),
            "text" => trim((string)($row["suggestion_text"] ?? "")),
            "status" => qhs_normalize_suggestion_status($row["suggestion_status"] ?? "new"),
            "createdAt" => qhs_from_mysql_datetime_to_iso($row["created_at"] ?? null),
            "updatedAt" => qhs_from_mysql_datetime_to_iso($row["updated_at"] ?? null)
        ];
    }

    return $suggestions;
}

function qhs_sync_suggestions(PDO $pdo, $suggestions): void
{
    if (!is_array($suggestions)) return;

    $statement = $pdo->prepare(
        "INSERT INTO qhs_suggestions (
            suggestion_id,
            user_id,
            user_role,
            full_name_snapshot,
            suggestion_text,
            suggestion_status,
            created_at
         ) VALUES (
            :suggestion_id,
            :user_id,
            :user_role,
            :full_name_snapshot,
            :suggestion_text,
            :suggestion_status,
            :created_at
         )
         ON DUPLICATE KEY UPDATE
            user_id = VALUES(user_id),
            user_role = VALUES(user_role),
            full_name_snapshot = VALUES(full_name_snapshot),
            suggestion_text = VALUES(suggestion_text),
            suggestion_status = VALUES(suggestion_status),
            updated_at = CURRENT_TIMESTAMP"
    );

    $incomingIds = [];
    $ownsTransaction = !$pdo->inTransaction();
    if ($ownsTransaction) {
        $pdo->beginTransaction();
    }

    try {
        foreach ($suggestions as $entry) {
            if (!is_array($entry)) continue;

            $suggestionId = trim((string)($entry["id"] ?? ""));
            if ($suggestionId === "") continue;

            $userId = trim((string)($entry["userId"] ?? ""));
            $userRole = qhs_normalize_role($entry["role"] ?? "");
            if ($userRole === "") {
                $userRole = "student";
            }

            $fullName = trim((string)($entry["fullName"] ?? ""));
            if ($fullName === "") {
                $fullName = "Unknown User";
            }

            $text = trim((string)($entry["text"] ?? ($entry["suggestionText"] ?? "")));
            if ($text === "") continue;

            $status = qhs_normalize_suggestion_status($entry["status"] ?? "new");
            $createdAt = qhs_to_mysql_datetime_utc($entry["createdAt"] ?? "");
            if ($createdAt === null) {
                $createdAt = gmdate("Y-m-d H:i:s");
            }

            $statement->execute([
                ":suggestion_id" => $suggestionId,
                ":user_id" => $userId,
                ":user_role" => $userRole,
                ":full_name_snapshot" => $fullName,
                ":suggestion_text" => $text,
                ":suggestion_status" => $status,
                ":created_at" => $createdAt
            ]);
            $incomingIds[$suggestionId] = true;
        }

        $ids = array_keys($incomingIds);
        if (!empty($ids)) {
            $placeholders = implode(",", array_fill(0, count($ids), "?"));
            $deleteStatement = $pdo->prepare("DELETE FROM qhs_suggestions WHERE suggestion_id NOT IN ({$placeholders})");
            $deleteStatement->execute($ids);
        } else {
            $pdo->exec("DELETE FROM qhs_suggestions");
        }

        if ($ownsTransaction && $pdo->inTransaction()) {
            $pdo->commit();
        }
    } catch (Throwable $exception) {
        if ($ownsTransaction && $pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $exception;
    }
}

function qhs_fetch_student_suspensions(PDO $pdo): array
{
    $statement = $pdo->query(
        "SELECT
            user_id,
            is_suspended,
            suspension_reason,
            suspended_by_user_id,
            suspended_at,
            lifted_at,
            updated_at
         FROM qhs_student_suspensions
         ORDER BY updated_at DESC"
    );

    $rows = $statement->fetchAll();
    $suspensions = [];

    foreach ($rows as $row) {
        $userId = trim((string)($row["user_id"] ?? ""));
        if ($userId === "") continue;

        $suspensions[] = [
            "id" => "sus-{$userId}",
            "userId" => $userId,
            "isSuspended" => ((int)($row["is_suspended"] ?? 0)) === 1,
            "reason" => trim((string)($row["suspension_reason"] ?? "")),
            "suspendedAt" => qhs_from_mysql_datetime_to_iso($row["suspended_at"] ?? null),
            "liftedAt" => qhs_from_mysql_datetime_to_iso($row["lifted_at"] ?? null),
            "updatedAt" => qhs_from_mysql_datetime_to_iso($row["updated_at"] ?? null),
            "updatedBy" => trim((string)($row["suspended_by_user_id"] ?? ""))
        ];
    }

    return $suspensions;
}

function qhs_sync_student_suspensions(PDO $pdo, $suspensions): void
{
    if (!is_array($suspensions)) return;

    $statement = $pdo->prepare(
        "INSERT INTO qhs_student_suspensions (
            user_id,
            is_suspended,
            suspension_reason,
            suspended_by_user_id,
            suspended_at,
            lifted_at
         ) VALUES (
            :user_id,
            :is_suspended,
            :suspension_reason,
            :suspended_by_user_id,
            :suspended_at,
            :lifted_at
         )
         ON DUPLICATE KEY UPDATE
            is_suspended = VALUES(is_suspended),
            suspension_reason = VALUES(suspension_reason),
            suspended_by_user_id = VALUES(suspended_by_user_id),
            suspended_at = VALUES(suspended_at),
            lifted_at = VALUES(lifted_at)"
    );

    $incomingIds = [];
    $ownsTransaction = !$pdo->inTransaction();
    if ($ownsTransaction) {
        $pdo->beginTransaction();
    }

    try {
        foreach ($suspensions as $entry) {
            if (!is_array($entry)) continue;

            $userId = trim((string)($entry["userId"] ?? ""));
            if ($userId === "") {
                $userId = trim((string)($entry["id"] ?? ""));
                if (strpos($userId, "sus-") === 0) {
                    $userId = substr($userId, 4);
                }
            }
            if ($userId === "") continue;

            $rawSuspended = $entry["isSuspended"] ?? ($entry["suspended"] ?? false);
            if (is_bool($rawSuspended)) {
                $isSuspended = $rawSuspended;
            } else {
                $rawValue = strtolower(trim((string)$rawSuspended));
                $isSuspended = in_array($rawValue, ["1", "true", "yes", "on", "suspended"], true);
            }

            $reason = trim((string)($entry["reason"] ?? ($entry["suspensionReason"] ?? "")));
            $updatedBy = trim((string)($entry["updatedBy"] ?? ($entry["suspendedByUserId"] ?? "")));
            $suspendedAt = qhs_to_mysql_datetime_utc($entry["suspendedAt"] ?? "");
            $liftedAt = qhs_to_mysql_datetime_utc($entry["liftedAt"] ?? "");

            if ($isSuspended && $suspendedAt === null) {
                $suspendedAt = gmdate("Y-m-d H:i:s");
            }
            if ($isSuspended) {
                $liftedAt = null;
            }

            $statement->execute([
                ":user_id" => $userId,
                ":is_suspended" => $isSuspended ? 1 : 0,
                ":suspension_reason" => $reason,
                ":suspended_by_user_id" => $updatedBy,
                ":suspended_at" => $suspendedAt,
                ":lifted_at" => $liftedAt
            ]);
            $incomingIds[$userId] = true;
        }

        $ids = array_keys($incomingIds);
        if (!empty($ids)) {
            $placeholders = implode(",", array_fill(0, count($ids), "?"));
            $deleteStatement = $pdo->prepare("DELETE FROM qhs_student_suspensions WHERE user_id NOT IN ({$placeholders})");
            $deleteStatement->execute($ids);
        } else {
            $pdo->exec("DELETE FROM qhs_student_suspensions");
        }

        if ($ownsTransaction && $pdo->inTransaction()) {
            $pdo->commit();
        }
    } catch (Throwable $exception) {
        if ($ownsTransaction && $pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $exception;
    }
}

function qhs_is_student_suspended(PDO $pdo, string $userId): bool
{
    $targetUserId = trim($userId);
    if ($targetUserId === "") return false;

    $statement = $pdo->prepare(
        "SELECT is_suspended
         FROM qhs_student_suspensions
         WHERE user_id = :user_id
         LIMIT 1"
    );
    $statement->execute([":user_id" => $targetUserId]);
    $row = $statement->fetch();
    if (!$row) return false;

    return ((int)($row["is_suspended"] ?? 0)) === 1;
}

function qhs_json_or_null($value): ?string
{
    if ($value === null) return null;

    if (is_string($value)) {
        $trimmed = trim($value);
        if ($trimmed === "") return null;
        return $trimmed;
    }

    try {
        return qhs_encode_value($value);
    } catch (Throwable $exception) {
        return null;
    }
}

function qhs_create_notification(PDO $pdo, array $payload): void
{
    $userId = trim((string)($payload["user_id"] ?? ($payload["userId"] ?? "")));
    if ($userId === "") return;

    $notificationType = trim((string)($payload["notification_type"] ?? ($payload["type"] ?? "")));
    if ($notificationType === "") return;

    $notificationId = trim((string)($payload["notification_id"] ?? ($payload["id"] ?? "")));
    if ($notificationId === "") {
        $notificationId = qhs_create_id("noti");
    }

    $titleRaw = trim((string)($payload["title"] ?? "Notification"));
    $title = $titleRaw !== "" ? substr($titleRaw, 0, 120) : "Notification";
    $message = trim((string)($payload["message"] ?? ""));
    $sourceEntity = trim((string)($payload["source_entity"] ?? ($payload["sourceEntity"] ?? "")));
    $sourceId = trim((string)($payload["source_id"] ?? ($payload["sourceId"] ?? "")));
    $isRead = !empty($payload["is_read"]) ? 1 : 0;
    $readAt = null;
    if ($isRead === 1) {
        $readAt = qhs_to_mysql_datetime_utc($payload["read_at"] ?? ($payload["readAt"] ?? ""));
        if ($readAt === null) {
            $readAt = gmdate("Y-m-d H:i:s");
        }
    }

    $statement = $pdo->prepare(
        "INSERT INTO qhs_notifications (
            notification_id,
            user_id,
            notification_type,
            title,
            message,
            source_entity,
            source_id,
            is_read,
            read_at
         ) VALUES (
            :notification_id,
            :user_id,
            :notification_type,
            :title,
            :message,
            :source_entity,
            :source_id,
            :is_read,
            :read_at
         )
         ON DUPLICATE KEY UPDATE
            user_id = VALUES(user_id),
            notification_type = VALUES(notification_type),
            title = VALUES(title),
            message = VALUES(message),
            source_entity = VALUES(source_entity),
            source_id = VALUES(source_id),
            is_read = VALUES(is_read),
            read_at = VALUES(read_at)"
    );

    $statement->execute([
        ":notification_id" => $notificationId,
        ":user_id" => $userId,
        ":notification_type" => $notificationType,
        ":title" => $title,
        ":message" => $message,
        ":source_entity" => $sourceEntity,
        ":source_id" => $sourceId,
        ":is_read" => $isRead,
        ":read_at" => $readAt
    ]);
}

function qhs_create_notifications_for_students(PDO $pdo, array $payload): void
{
    $statement = $pdo->prepare(
        "SELECT id
         FROM qhs_accounts
         WHERE role = :role"
    );
    $statement->execute([":role" => "student"]);
    $students = $statement->fetchAll();

    foreach ($students as $student) {
        $studentId = trim((string)($student["id"] ?? ""));
        if ($studentId === "") continue;

        $nextPayload = $payload;
        $nextPayload["user_id"] = $studentId;
        qhs_create_notification($pdo, $nextPayload);
    }
}

function qhs_log_activity(PDO $pdo, array $payload): void
{
    $actionType = trim((string)($payload["action_type"] ?? ($payload["actionType"] ?? "")));
    if ($actionType === "") return;

    $statement = $pdo->prepare(
        "INSERT INTO qhs_activity_logs (
            actor_user_id,
            actor_role,
            action_type,
            entity_type,
            entity_id,
            before_state,
            after_state,
            meta
         ) VALUES (
            :actor_user_id,
            :actor_role,
            :action_type,
            :entity_type,
            :entity_id,
            :before_state,
            :after_state,
            :meta
         )"
    );

    $statement->execute([
        ":actor_user_id" => trim((string)($payload["actor_user_id"] ?? ($payload["actorUserId"] ?? ""))),
        ":actor_role" => trim((string)($payload["actor_role"] ?? ($payload["actorRole"] ?? ""))),
        ":action_type" => $actionType,
        ":entity_type" => trim((string)($payload["entity_type"] ?? ($payload["entityType"] ?? ""))),
        ":entity_id" => trim((string)($payload["entity_id"] ?? ($payload["entityId"] ?? ""))),
        ":before_state" => qhs_json_or_null($payload["before_state"] ?? ($payload["beforeState"] ?? null)),
        ":after_state" => qhs_json_or_null($payload["after_state"] ?? ($payload["afterState"] ?? null)),
        ":meta" => qhs_json_or_null($payload["meta"] ?? null)
    ]);
}

function qhs_cleanup_activity_logs(PDO $pdo, int $days = 180): void
{
    if ($days < 1) {
        $days = 180;
    }

    $cutoff = gmdate("Y-m-d H:i:s", time() - ($days * 86400));
    $statement = $pdo->prepare(
        "DELETE FROM qhs_activity_logs
         WHERE created_at < :cutoff"
    );
    $statement->execute([":cutoff" => $cutoff]);
}

function qhs_index_by_id(array $list): array
{
    $indexed = [];
    foreach ($list as $entry) {
        if (!is_array($entry)) continue;
        $id = trim((string)($entry["id"] ?? ""));
        if ($id === "") continue;
        $indexed[$id] = $entry;
    }
    return $indexed;
}

function qhs_normalize_menu_for_diff(array $item): array
{
    $price = (float)($item["price"] ?? 0);
    if ($price < 0) {
        $price = 0;
    }

    return [
        "id" => trim((string)($item["id"] ?? "")),
        "name" => trim((string)($item["name"] ?? "")),
        "category" => trim((string)($item["category"] ?? "")),
        "price" => number_format($price, 2, ".", ""),
        "imageUrl" => trim((string)($item["imageUrl"] ?? "")),
        "availability" => qhs_normalize_availability($item["availability"] ?? ""),
        "nutrition" => trim((string)($item["nutrition"] ?? "")),
        "description" => trim((string)($item["description"] ?? ""))
    ];
}

function qhs_detect_menu_changes(array $oldMenu, array $newMenu): array
{
    $changes = [
        "added" => [],
        "updated" => [],
        "deleted" => [],
        "availability_changes" => []
    ];

    $oldIndex = qhs_index_by_id($oldMenu);
    $newIndex = qhs_index_by_id($newMenu);

    foreach ($newIndex as $menuId => $nextRaw) {
        $next = qhs_normalize_menu_for_diff($nextRaw);
        if (!array_key_exists($menuId, $oldIndex)) {
            $changes["added"][] = [
                "id" => $menuId,
                "after" => $next
            ];
            continue;
        }

        $previous = qhs_normalize_menu_for_diff($oldIndex[$menuId]);
        if ($previous !== $next) {
            $changes["updated"][] = [
                "id" => $menuId,
                "before" => $previous,
                "after" => $next
            ];
        }

        if ($previous["availability"] !== $next["availability"]) {
            $changes["availability_changes"][] = [
                "id" => $menuId,
                "before" => $previous,
                "after" => $next,
                "from" => $previous["availability"],
                "to" => $next["availability"]
            ];
        }
    }

    foreach ($oldIndex as $menuId => $previousRaw) {
        if (array_key_exists($menuId, $newIndex)) continue;

        $changes["deleted"][] = [
            "id" => $menuId,
            "before" => qhs_normalize_menu_for_diff($previousRaw)
        ];
    }

    return $changes;
}

function qhs_normalize_order_for_diff(array $order): array
{
    $status = trim((string)($order["status"] ?? "Pending"));
    if ($status !== "Completed") {
        $status = "Pending";
    }

    $quantity = max(1, (int)($order["quantity"] ?? 1));
    $totalPrice = (float)($order["totalPrice"] ?? 0);
    if ($totalPrice < 0) {
        $totalPrice = 0;
    }

    $unitPrice = (float)($order["unitPrice"] ?? 0);
    if ($unitPrice <= 0 && $quantity > 0) {
        $unitPrice = $totalPrice / $quantity;
    }
    if ($unitPrice < 0) {
        $unitPrice = 0;
    }

    $paymentMethod = qhs_normalize_payment_method($order["paymentMethod"] ?? "");
    $paymentReference = $paymentMethod === "GCash"
        ? trim((string)($order["paymentReference"] ?? ""))
        : "";

    $placedAt = qhs_to_mysql_datetime_utc($order["placedAt"] ?? "");
    if ($placedAt === null) {
        $placedAt = "";
    }

    return [
        "id" => trim((string)($order["id"] ?? "")),
        "userId" => trim((string)($order["userId"] ?? "")),
        "mealId" => trim((string)($order["mealId"] ?? "")),
        "mealName" => trim((string)($order["mealName"] ?? "")),
        "quantity" => $quantity,
        "unitPrice" => number_format($unitPrice, 2, ".", ""),
        "totalPrice" => number_format($totalPrice, 2, ".", ""),
        "paymentMethod" => $paymentMethod,
        "paymentReference" => $paymentReference,
        "status" => $status,
        "hiddenByStaff" => !empty($order["hiddenByStaff"]),
        "placedAt" => $placedAt
    ];
}

function qhs_detect_reservation_changes(array $oldOrders, array $newOrders): array
{
    $changes = [
        "status_changes" => [],
        "hide_changes" => []
    ];

    $oldIndex = qhs_index_by_id($oldOrders);
    $newIndex = qhs_index_by_id($newOrders);

    foreach ($newIndex as $orderId => $nextRaw) {
        if (!array_key_exists($orderId, $oldIndex)) continue;

        $previous = qhs_normalize_order_for_diff($oldIndex[$orderId]);
        $next = qhs_normalize_order_for_diff($nextRaw);
        $ownerId = $next["userId"] !== "" ? $next["userId"] : $previous["userId"];

        if ($previous["status"] !== $next["status"]) {
            $changes["status_changes"][] = [
                "id" => $orderId,
                "user_id" => $ownerId,
                "from" => $previous["status"],
                "to" => $next["status"],
                "before" => $previous,
                "after" => $next
            ];
        }

        if ($previous["hiddenByStaff"] !== $next["hiddenByStaff"]) {
            $changes["hide_changes"][] = [
                "id" => $orderId,
                "user_id" => $ownerId,
                "from" => $previous["hiddenByStaff"],
                "to" => $next["hiddenByStaff"],
                "before" => $previous,
                "after" => $next
            ];
        }
    }

    return $changes;
}

function qhs_find_legacy_user(PDO $pdo, string $email, string $password, string $role): ?array
{
    $users = qhs_storage_get($pdo, "qhs_users", []);
    if (!is_array($users)) return null;

    foreach ($users as $entry) {
        if (!is_array($entry)) continue;

        $entryEmail = qhs_normalize_email($entry["email"] ?? "");
        $entryRole = qhs_normalize_role($entry["role"] ?? "");
        $entryPassword = (string)($entry["password"] ?? "");

        if ($entryEmail !== $email) continue;
        if ($entryRole !== $role) continue;
        if ($entryPassword === "") continue;

        $passwordMatch = false;
        $isBcrypt = strncmp($entryPassword, '$2', 2) === 0;
        $isArgon = strncmp($entryPassword, '$argon2', 7) === 0;
        if ($isBcrypt || $isArgon) {
            $passwordMatch = password_verify($password, $entryPassword);
        } else {
            $passwordMatch = hash_equals($entryPassword, $password);
        }
        if (!$passwordMatch) continue;

        return $entry;
    }

    return null;
}

function qhs_find_account_by_email(PDO $pdo, string $email): ?array
{
    $statement = $pdo->prepare(
        "SELECT id, full_name, id_number, class_department, email, password_hash, role, created_at
         FROM qhs_accounts
         WHERE email = :email
         LIMIT 1"
    );
    $statement->execute([":email" => $email]);
    $row = $statement->fetch();
    return $row ?: null;
}

function qhs_find_account_by_id(PDO $pdo, string $id): ?array
{
    $statement = $pdo->prepare(
        "SELECT id, full_name, id_number, class_department, email, password_hash, role, created_at
         FROM qhs_accounts
         WHERE id = :id
         LIMIT 1"
    );
    $statement->execute([":id" => $id]);
    $row = $statement->fetch();
    return $row ?: null;
}

function qhs_destroy_session(): void
{
    $_SESSION = [];

    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            "",
            time() - 42000,
            $params["path"] ?? "/",
            $params["domain"] ?? "",
            (bool)($params["secure"] ?? false),
            (bool)($params["httponly"] ?? false)
        );
    }

    if (session_status() === PHP_SESSION_ACTIVE) {
        session_destroy();
    }
}

try {
    $pdo = qhs_connect_db();
    qhs_ensure_schema($pdo);

    $body = qhs_read_json_body();
    $actionRaw = $body["action"] ?? ($_GET["action"] ?? "bootstrap");
    $action = strtolower(trim((string)$actionRaw));

    if ($action === "bootstrap") {
        try {
            qhs_cleanup_activity_logs($pdo, 180);
        } catch (Throwable $exception) {
            // Best-effort cleanup only.
        }

        $inList = implode(",", array_fill(0, count(QHS_ALLOWED_KEYS), "?"));
        $statement = $pdo->prepare(
            "SELECT storage_key, storage_value
             FROM qhs_storage
             WHERE storage_key IN ({$inList})"
        );
        $statement->execute(QHS_ALLOWED_KEYS);
        $rows = $statement->fetchAll();

        $data = [];
        foreach ($rows as $row) {
            $key = (string)($row["storage_key"] ?? "");
            if ($key === "") continue;
            $decoded = qhs_decode_value($row["storage_value"] ?? null);
            if ($decoded === null) continue;
            $data[$key] = $decoded;
        }

        $suggestionsFromDb = qhs_fetch_suggestions($pdo);
        if (empty($suggestionsFromDb)) {
            $legacySuggestions = $data["qhs_suggestions"] ?? [];
            if (is_array($legacySuggestions) && !empty($legacySuggestions)) {
                qhs_sync_suggestions($pdo, $legacySuggestions);
                $suggestionsFromDb = qhs_fetch_suggestions($pdo);
            }
        }
        if (!empty($suggestionsFromDb)) {
            $data["qhs_suggestions"] = $suggestionsFromDb;
        }

        $suspensionsFromDb = qhs_fetch_student_suspensions($pdo);
        if (empty($suspensionsFromDb)) {
            $legacySuspensions = $data["qhs_student_suspensions"] ?? [];
            if (is_array($legacySuspensions) && !empty($legacySuspensions)) {
                qhs_sync_student_suspensions($pdo, $legacySuspensions);
                $suspensionsFromDb = qhs_fetch_student_suspensions($pdo);
            }
        }
        if (!empty($suspensionsFromDb)) {
            $data["qhs_student_suspensions"] = $suspensionsFromDb;
        }

        $menuFromDb = qhs_fetch_menu_items($pdo);
        if (empty($menuFromDb)) {
            $legacyMenu = $data["qhs_menu"] ?? [];
            if (is_array($legacyMenu) && !empty($legacyMenu)) {
                qhs_sync_menu_items($pdo, $legacyMenu);
                $menuFromDb = qhs_fetch_menu_items($pdo);
            }
        }
        if (!empty($menuFromDb)) {
            $data["qhs_menu"] = $menuFromDb;
        }

        $reservationsFromDb = qhs_fetch_student_reservations($pdo);
        if (empty($reservationsFromDb)) {
            $legacyReservations = $data["qhs_orders"] ?? [];
            if (is_array($legacyReservations) && !empty($legacyReservations)) {
                qhs_sync_student_reservations($pdo, $legacyReservations);
                qhs_sync_order_payments($pdo, $legacyReservations);
                $reservationsFromDb = qhs_fetch_student_reservations($pdo);
            }
        }
        if (!empty($reservationsFromDb)) {
            $data["qhs_orders"] = $reservationsFromDb;
        }

        qhs_json_response(200, [
            "ok" => true,
            "data" => $data
        ]);
    }

    if ($action === "save") {
        if (strtoupper((string)($_SERVER["REQUEST_METHOD"] ?? "")) !== "POST") {
            qhs_json_response(405, [
                "ok" => false,
                "message" => "Method not allowed."
            ]);
        }

        $key = $body["key"] ?? "";
        if (!is_string($key) || !in_array($key, QHS_ALLOWED_KEYS, true)) {
            qhs_json_response(400, [
                "ok" => false,
                "message" => "Invalid storage key."
            ]);
        }

        if (!array_key_exists("value", $body)) {
            qhs_json_response(400, [
                "ok" => false,
                "message" => "Missing value."
            ]);
        }

        $previousValue = qhs_storage_get($pdo, $key, null);
        $previousList = is_array($previousValue) ? $previousValue : [];
        $nextList = is_array($body["value"]) ? $body["value"] : [];

        $actorUserId = trim((string)($_SESSION["qhs_user_id"] ?? ""));
        $actorRole = "";
        if ($actorUserId !== "") {
            $actor = qhs_find_account_by_id($pdo, $actorUserId);
            if ($actor) {
                $actorRole = qhs_normalize_role($actor["role"] ?? "");
            }
        }

        try {
            $pdo->beginTransaction();
            qhs_storage_save($pdo, $key, $body["value"]);

            if ($key === "qhs_suggestions" && is_array($body["value"])) {
                qhs_sync_suggestions($pdo, $body["value"]);

                $oldSuggestions = qhs_index_by_id($previousList);
                $newSuggestions = qhs_index_by_id($nextList);
                foreach ($newSuggestions as $suggestionId => $suggestion) {
                    if (array_key_exists($suggestionId, $oldSuggestions)) continue;

                    qhs_log_activity($pdo, [
                        "actor_user_id" => $actorUserId,
                        "actor_role" => $actorRole,
                        "action_type" => "suggestion.submit",
                        "entity_type" => "suggestion",
                        "entity_id" => $suggestionId,
                        "before_state" => null,
                        "after_state" => $suggestion
                    ]);
                }
            }

            if ($key === "qhs_student_suspensions" && is_array($body["value"])) {
                qhs_sync_student_suspensions($pdo, $body["value"]);

                $toUserSuspendedMap = static function ($list): array {
                    $indexed = [];
                    foreach ($list as $entry) {
                        if (!is_array($entry)) continue;

                        $userId = trim((string)($entry["userId"] ?? ""));
                        if ($userId === "") {
                            $userId = trim((string)($entry["id"] ?? ""));
                            if (strpos($userId, "sus-") === 0) {
                                $userId = substr($userId, 4);
                            }
                        }
                        if ($userId === "") continue;

                        $rawStatus = $entry["isSuspended"] ?? ($entry["suspended"] ?? false);
                        if (is_bool($rawStatus)) {
                            $isSuspended = $rawStatus;
                        } else {
                            $statusValue = strtolower(trim((string)$rawStatus));
                            $isSuspended = in_array($statusValue, ["1", "true", "yes", "on", "suspended"], true);
                        }

                        $indexed[$userId] = [
                            "entry" => $entry,
                            "isSuspended" => $isSuspended
                        ];
                    }
                    return $indexed;
                };

                $oldSuspensionMap = $toUserSuspendedMap($previousList);
                $newSuspensionMap = $toUserSuspendedMap($nextList);

                foreach ($newSuspensionMap as $userId => $nextState) {
                    $previousState = $oldSuspensionMap[$userId] ?? null;
                    $oldStatus = is_array($previousState) ? !empty($previousState["isSuspended"]) : false;
                    $newStatus = !empty($nextState["isSuspended"]);

                    if ($previousState === null && !$newStatus) continue;
                    if ($oldStatus === $newStatus) continue;

                    qhs_log_activity($pdo, [
                        "actor_user_id" => $actorUserId,
                        "actor_role" => $actorRole,
                        "action_type" => $newStatus ? "account.suspend" : "account.unsuspend",
                        "entity_type" => "student_account",
                        "entity_id" => $userId,
                        "before_state" => is_array($previousState) ? ($previousState["entry"] ?? null) : null,
                        "after_state" => $nextState["entry"] ?? null
                    ]);
                }
            }

            if ($key === "qhs_menu" && is_array($body["value"])) {
                qhs_sync_menu_items($pdo, $body["value"]);

                $menuChanges = qhs_detect_menu_changes($previousList, $nextList);

                foreach ($menuChanges["added"] as $change) {
                    $after = is_array($change["after"] ?? null) ? $change["after"] : [];
                    $itemName = trim((string)($after["name"] ?? "Menu item"));
                    $menuId = trim((string)($change["id"] ?? ""));

                    qhs_log_activity($pdo, [
                        "actor_user_id" => $actorUserId,
                        "actor_role" => $actorRole,
                        "action_type" => "menu.add",
                        "entity_type" => "menu_item",
                        "entity_id" => $menuId,
                        "before_state" => null,
                        "after_state" => $after
                    ]);

                    qhs_create_notifications_for_students($pdo, [
                        "notification_type" => "menu_item_added",
                        "title" => "New menu item",
                        "message" => "{$itemName} has been added to the menu.",
                        "source_entity" => "menu_item",
                        "source_id" => $menuId
                    ]);
                }

                foreach ($menuChanges["updated"] as $change) {
                    $menuId = trim((string)($change["id"] ?? ""));
                    qhs_log_activity($pdo, [
                        "actor_user_id" => $actorUserId,
                        "actor_role" => $actorRole,
                        "action_type" => "menu.update",
                        "entity_type" => "menu_item",
                        "entity_id" => $menuId,
                        "before_state" => $change["before"] ?? null,
                        "after_state" => $change["after"] ?? null
                    ]);
                }

                foreach ($menuChanges["deleted"] as $change) {
                    $menuId = trim((string)($change["id"] ?? ""));
                    qhs_log_activity($pdo, [
                        "actor_user_id" => $actorUserId,
                        "actor_role" => $actorRole,
                        "action_type" => "menu.delete",
                        "entity_type" => "menu_item",
                        "entity_id" => $menuId,
                        "before_state" => $change["before"] ?? null,
                        "after_state" => null
                    ]);
                }

                foreach ($menuChanges["availability_changes"] as $change) {
                    $menuId = trim((string)($change["id"] ?? ""));
                    $to = trim((string)($change["to"] ?? ""));
                    $after = is_array($change["after"] ?? null) ? $change["after"] : [];
                    $before = is_array($change["before"] ?? null) ? $change["before"] : [];
                    $itemName = trim((string)($after["name"] ?? ($before["name"] ?? "Menu item")));

                    qhs_log_activity($pdo, [
                        "actor_user_id" => $actorUserId,
                        "actor_role" => $actorRole,
                        "action_type" => "menu.availability_change",
                        "entity_type" => "menu_item",
                        "entity_id" => $menuId,
                        "before_state" => $before,
                        "after_state" => $after,
                        "meta" => [
                            "from" => trim((string)($change["from"] ?? "")),
                            "to" => $to
                        ]
                    ]);

                    $isAvailable = $to === "Available";
                    qhs_create_notifications_for_students($pdo, [
                        "notification_type" => $isAvailable ? "menu_item_available" : "menu_item_unavailable",
                        "title" => $isAvailable ? "Item available" : "Item unavailable",
                        "message" => $isAvailable
                            ? "{$itemName} is now available."
                            : "{$itemName} is now out of stock.",
                        "source_entity" => "menu_item",
                        "source_id" => $menuId
                    ]);
                }
            }

            if ($key === "qhs_orders" && is_array($body["value"])) {
                qhs_sync_student_reservations($pdo, $body["value"]);
                qhs_sync_order_payments($pdo, $body["value"]);

                $reservationChanges = qhs_detect_reservation_changes($previousList, $nextList);

                foreach ($reservationChanges["status_changes"] as $change) {
                    $reservationId = trim((string)($change["id"] ?? ""));
                    $toStatus = trim((string)($change["to"] ?? ""));
                    $fromStatus = trim((string)($change["from"] ?? ""));

                    qhs_log_activity($pdo, [
                        "actor_user_id" => $actorUserId,
                        "actor_role" => $actorRole,
                        "action_type" => "reservation.status_change",
                        "entity_type" => "reservation",
                        "entity_id" => $reservationId,
                        "before_state" => $change["before"] ?? null,
                        "after_state" => $change["after"] ?? null,
                        "meta" => [
                            "from" => $fromStatus,
                            "to" => $toStatus
                        ]
                    ]);

                    if ($fromStatus !== "Completed" && $toStatus === "Completed") {
                        $ownerId = trim((string)($change["user_id"] ?? ""));
                        $after = is_array($change["after"] ?? null) ? $change["after"] : [];
                        $mealName = trim((string)($after["mealName"] ?? "Your reservation"));

                        qhs_create_notification($pdo, [
                            "user_id" => $ownerId,
                            "notification_type" => "reservation_completed",
                            "title" => "Reservation completed",
                            "message" => "{$mealName} is marked as completed.",
                            "source_entity" => "reservation",
                            "source_id" => $reservationId
                        ]);
                    }
                }

                foreach ($reservationChanges["hide_changes"] as $change) {
                    if (!($change["to"] ?? false)) continue;

                    $reservationId = trim((string)($change["id"] ?? ""));
                    qhs_log_activity($pdo, [
                        "actor_user_id" => $actorUserId,
                        "actor_role" => $actorRole,
                        "action_type" => "reservation.hide",
                        "entity_type" => "reservation",
                        "entity_id" => $reservationId,
                        "before_state" => $change["before"] ?? null,
                        "after_state" => $change["after"] ?? null
                    ]);
                }
            }

            qhs_cleanup_activity_logs($pdo, 180);
            $pdo->commit();
        } catch (Throwable $exception) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            qhs_json_response(500, [
                "ok" => false,
                "message" => "Failed to save data. Please try again."
            ]);
        }

        qhs_json_response(200, ["ok" => true]);
    }

    if ($action === "register") {
        if (strtoupper((string)($_SERVER["REQUEST_METHOD"] ?? "")) !== "POST") {
            qhs_json_response(405, [
                "ok" => false,
                "message" => "Method not allowed."
            ]);
        }

        $payload = is_array($body["payload"] ?? null) ? $body["payload"] : $body;
        $fullName = trim((string)($payload["fullName"] ?? ""));
        $idNumber = trim((string)($payload["idNumber"] ?? ""));
        $classDepartment = trim((string)($payload["classDepartment"] ?? ""));
        $email = qhs_normalize_email($payload["email"] ?? "");
        $password = (string)($payload["password"] ?? "");
        $role = qhs_normalize_role($payload["role"] ?? "");

        if ($fullName === "") {
            qhs_json_response(400, ["ok" => false, "message" => "Full Name is required."]);
        }
        if ($role === "") {
            qhs_json_response(400, ["ok" => false, "message" => "Please choose Student or Staff."]);
        }
        if ($role === "student" && $idNumber === "") {
            qhs_json_response(400, ["ok" => false, "message" => "LRN is required."]);
        }
        if ($role === "student" && $classDepartment === "") {
            qhs_json_response(400, ["ok" => false, "message" => "Grade and Section is required."]);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            qhs_json_response(400, ["ok" => false, "message" => "Enter a valid email address."]);
        }
        if (strlen($password) < 6) {
            qhs_json_response(400, ["ok" => false, "message" => "Password must be at least 6 characters."]);
        }

        $existing = qhs_find_account_by_email($pdo, $email);
        if ($existing) {
            qhs_json_response(409, ["ok" => false, "message" => "Email is already registered."]);
        }

        $id = qhs_create_id("usr");
        $statement = $pdo->prepare(
            "INSERT INTO qhs_accounts (
                id, full_name, id_number, class_department, email, password_hash, role
             ) VALUES (
                :id, :full_name, :id_number, :class_department, :email, :password_hash, :role
             )"
        );
        $statement->execute([
            ":id" => $id,
            ":full_name" => $fullName,
            ":id_number" => $idNumber,
            ":class_department" => $classDepartment,
            ":email" => $email,
            ":password_hash" => password_hash($password, PASSWORD_DEFAULT),
            ":role" => $role
        ]);

        $row = qhs_find_account_by_id($pdo, $id);
        if (!$row) {
            qhs_json_response(500, ["ok" => false, "message" => "Failed to create account."]);
        }

        $user = qhs_public_user($row);
        qhs_sync_user_to_storage($pdo, $user);
        $_SESSION["qhs_user_id"] = $user["id"];

        qhs_json_response(200, [
            "ok" => true,
            "user" => $user
        ]);
    }

    if ($action === "login") {
        if (strtoupper((string)($_SERVER["REQUEST_METHOD"] ?? "")) !== "POST") {
            qhs_json_response(405, [
                "ok" => false,
                "message" => "Method not allowed."
            ]);
        }

        $payload = is_array($body["payload"] ?? null) ? $body["payload"] : $body;
        $email = qhs_normalize_email($payload["email"] ?? "");
        $password = (string)($payload["password"] ?? "");
        $role = qhs_normalize_role($payload["role"] ?? "");

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            qhs_json_response(400, ["ok" => false, "message" => "Enter a valid email address."]);
        }
        if ($password === "") {
            qhs_json_response(400, ["ok" => false, "message" => "Password is required."]);
        }
        if ($role === "") {
            qhs_json_response(400, ["ok" => false, "message" => "Select Student or Staff."]);
        }

        $row = qhs_find_account_by_email($pdo, $email);
        if (!$row) {
            $legacy = qhs_find_legacy_user($pdo, $email, $password, $role);
            if (is_array($legacy)) {
                $legacyId = trim((string)($legacy["id"] ?? ""));
                $nextId = $legacyId !== "" && !qhs_find_account_by_id($pdo, $legacyId)
                    ? $legacyId
                    : qhs_create_id("usr");

                $migrationInsert = $pdo->prepare(
                    "INSERT INTO qhs_accounts (
                        id, full_name, id_number, class_department, email, password_hash, role
                     ) VALUES (
                        :id, :full_name, :id_number, :class_department, :email, :password_hash, :role
                     )"
                );
                $migrationInsert->execute([
                    ":id" => $nextId,
                    ":full_name" => trim((string)($legacy["fullName"] ?? "")),
                    ":id_number" => trim((string)($legacy["idNumber"] ?? "")),
                    ":class_department" => trim((string)($legacy["classDepartment"] ?? "")),
                    ":email" => $email,
                    ":password_hash" => password_hash($password, PASSWORD_DEFAULT),
                    ":role" => $role
                ]);

                $row = qhs_find_account_by_email($pdo, $email);
            }
        }

        if (
            !$row
            || qhs_normalize_role($row["role"] ?? "") !== $role
            || !password_verify($password, (string)($row["password_hash"] ?? ""))
        ) {
            qhs_json_response(401, ["ok" => false, "message" => "Invalid email/password for the selected role."]);
        }
        if ($role === "student" && qhs_is_student_suspended($pdo, (string)($row["id"] ?? ""))) {
            qhs_json_response(403, [
                "ok" => false,
                "message" => "Your account is suspended. Please contact staff."
            ]);
        }

        $user = qhs_public_user($row);
        qhs_sync_user_to_storage($pdo, $user);
        $_SESSION["qhs_user_id"] = $user["id"];

        qhs_json_response(200, [
            "ok" => true,
            "user" => $user
        ]);
    }

    if ($action === "change_password") {
        if (strtoupper((string)($_SERVER["REQUEST_METHOD"] ?? "")) !== "POST") {
            qhs_json_response(405, [
                "ok" => false,
                "message" => "Method not allowed."
            ]);
        }

        $userId = trim((string)($_SESSION["qhs_user_id"] ?? ""));
        if ($userId === "") {
            qhs_json_response(401, [
                "ok" => false,
                "message" => "Login is required."
            ]);
        }

        $payload = is_array($body["payload"] ?? null) ? $body["payload"] : $body;
        $currentPassword = (string)($payload["currentPassword"] ?? "");
        $newPassword = (string)($payload["newPassword"] ?? "");

        if ($currentPassword === "") {
            qhs_json_response(400, [
                "ok" => false,
                "message" => "Current password is required."
            ]);
        }
        if (strlen($newPassword) < 6) {
            qhs_json_response(400, [
                "ok" => false,
                "message" => "New password must be at least 6 characters."
            ]);
        }
        if (hash_equals($currentPassword, $newPassword)) {
            qhs_json_response(400, [
                "ok" => false,
                "message" => "New password must be different from current password."
            ]);
        }

        $row = qhs_find_account_by_id($pdo, $userId);
        if (!$row) {
            qhs_destroy_session();
            qhs_json_response(404, [
                "ok" => false,
                "message" => "User account not found."
            ]);
        }

        $passwordHash = (string)($row["password_hash"] ?? "");
        if ($passwordHash === "" || !password_verify($currentPassword, $passwordHash)) {
            qhs_json_response(401, [
                "ok" => false,
                "message" => "Current password is incorrect."
            ]);
        }

        $nextHash = password_hash($newPassword, PASSWORD_DEFAULT);
        $updateStatement = $pdo->prepare(
            "UPDATE qhs_accounts
             SET password_hash = :password_hash
             WHERE id = :id"
        );
        $updateStatement->execute([
            ":password_hash" => $nextHash,
            ":id" => $userId
        ]);

        qhs_sync_user_password_to_storage(
            $pdo,
            (string)($row["id"] ?? ""),
            qhs_normalize_email($row["email"] ?? ""),
            $nextHash
        );

        qhs_json_response(200, [
            "ok" => true,
            "message" => "Password updated successfully."
        ]);
    }

    if ($action === "delete_account") {
        if (strtoupper((string)($_SERVER["REQUEST_METHOD"] ?? "")) !== "POST") {
            qhs_json_response(405, [
                "ok" => false,
                "message" => "Method not allowed."
            ]);
        }

        $userId = trim((string)($_SESSION["qhs_user_id"] ?? ""));
        if ($userId === "") {
            qhs_json_response(401, [
                "ok" => false,
                "message" => "Login is required."
            ]);
        }

        $payload = is_array($body["payload"] ?? null) ? $body["payload"] : $body;
        $currentPassword = (string)($payload["currentPassword"] ?? "");
        if ($currentPassword === "") {
            qhs_json_response(400, [
                "ok" => false,
                "message" => "Current password is required."
            ]);
        }

        $row = qhs_find_account_by_id($pdo, $userId);
        if (!$row) {
            qhs_destroy_session();
            qhs_json_response(404, [
                "ok" => false,
                "message" => "User account not found."
            ]);
        }

        $passwordHash = (string)($row["password_hash"] ?? "");
        if ($passwordHash === "" || !password_verify($currentPassword, $passwordHash)) {
            qhs_json_response(401, [
                "ok" => false,
                "message" => "Current password is incorrect."
            ]);
        }

        $role = qhs_normalize_role($row["role"] ?? "");
        $email = qhs_normalize_email($row["email"] ?? "");

        try {
            $pdo->beginTransaction();

            qhs_log_activity($pdo, [
                "actor_user_id" => $userId,
                "actor_role" => $role,
                "action_type" => "account.delete",
                "entity_type" => "account",
                "entity_id" => $userId,
                "before_state" => qhs_public_user($row),
                "after_state" => null
            ]);

            $deleteByUserId = [
                "qhs_order_payments" => "user_id",
                "qhs_student_reservations" => "user_id",
                "qhs_suggestions" => "user_id",
                "qhs_notifications" => "user_id",
                "qhs_student_suspensions" => "user_id"
            ];

            foreach ($deleteByUserId as $tableName => $columnName) {
                $statement = $pdo->prepare("DELETE FROM {$tableName} WHERE {$columnName} = :user_id");
                $statement->execute([":user_id" => $userId]);
            }

            $deleteAccountStatement = $pdo->prepare(
                "DELETE FROM qhs_accounts
                 WHERE id = :id
                 LIMIT 1"
            );
            $deleteAccountStatement->execute([":id" => $userId]);

            qhs_remove_user_data_from_storage($pdo, $userId, $email);
            qhs_cleanup_activity_logs($pdo, 180);

            if ($pdo->inTransaction()) {
                $pdo->commit();
            }
        } catch (Throwable $exception) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            qhs_json_response(500, [
                "ok" => false,
                "message" => "Failed to delete account. Please try again."
            ]);
        }

        qhs_destroy_session();
        qhs_json_response(200, [
            "ok" => true,
            "message" => "Account deleted successfully."
        ]);
    }

    if ($action === "session") {
        $userId = trim((string)($_SESSION["qhs_user_id"] ?? ""));
        if ($userId === "") {
            qhs_json_response(200, [
                "ok" => true,
                "authenticated" => false
            ]);
        }

        $row = qhs_find_account_by_id($pdo, $userId);
        if (!$row) {
            qhs_destroy_session();
            qhs_json_response(200, [
                "ok" => true,
                "authenticated" => false
            ]);
        }
        if (
            qhs_normalize_role($row["role"] ?? "") === "student"
            && qhs_is_student_suspended($pdo, (string)($row["id"] ?? ""))
        ) {
            qhs_destroy_session();
            qhs_json_response(200, [
                "ok" => true,
                "authenticated" => false
            ]);
        }

        $user = qhs_public_user($row);
        qhs_sync_user_to_storage($pdo, $user);
        qhs_json_response(200, [
            "ok" => true,
            "authenticated" => true,
            "user" => $user
        ]);
    }

    if ($action === "logout") {
        qhs_destroy_session();
        qhs_json_response(200, ["ok" => true]);
    }

    qhs_json_response(400, [
        "ok" => false,
        "message" => "Unknown action."
    ]);
} catch (PDOException $exception) {
    qhs_json_response(500, [
        "ok" => false,
        "message" => "Database error. Verify QHS_DB_* settings and MySQL access."
    ]);
} catch (Throwable $exception) {
    qhs_json_response(500, [
        "ok" => false,
        "message" => "Server error."
    ]);
}
