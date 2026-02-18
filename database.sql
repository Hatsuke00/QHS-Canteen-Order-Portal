CREATE DATABASE IF NOT EXISTS qhs_canteen
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE qhs_canteen;

CREATE TABLE IF NOT EXISTS qhs_storage (
    storage_key VARCHAR(64) NOT NULL PRIMARY KEY,
    storage_value LONGTEXT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS qhs_accounts (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS qhs_order_payments (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS qhs_menu_items (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS qhs_student_reservations (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS qhs_suggestions (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS qhs_notifications (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS qhs_activity_logs (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS qhs_student_suspensions (
    user_id VARCHAR(64) NOT NULL PRIMARY KEY,
    is_suspended TINYINT(1) NOT NULL DEFAULT 0,
    suspension_reason TEXT NOT NULL,
    suspended_by_user_id VARCHAR(64) NOT NULL DEFAULT '',
    suspended_at DATETIME NULL,
    lifted_at DATETIME NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_qhs_student_suspensions_suspended (is_suspended),
    INDEX idx_qhs_student_suspensions_updated (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
