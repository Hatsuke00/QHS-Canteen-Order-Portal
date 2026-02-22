CREATE DATABASE IF NOT EXISTS canteen_reservation
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE canteen_reservation;

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'staff') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS menu_items (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    is_available TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_menu_name_category (name, category)
);

CREATE TABLE IF NOT EXISTS orders (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id INT UNSIGNED NOT NULL,
    student_name VARCHAR(120) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('Pending', 'Preparing', 'Completed') NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNSIGNED NOT NULL,
    menu_item_id INT UNSIGNED NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    line_total DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_menu FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE RESTRICT
);

INSERT INTO users (full_name, username, password_hash, role)
VALUES
    ('Juan Dela Cruz', 'student1', '$2y$12$QCJcd.mBUygD7fkDossnd.B5ZgsoGPGHVfY0SLJKOzi9f9AGkEII2', 'student'),
    ('Maria Santos', 'staff1', '$2y$12$06fxQU9MNqgHwsPtrEL99uksSlr65l157QcaWMyjnq7dRn7t6bXnS', 'staff')
ON DUPLICATE KEY UPDATE
    full_name = VALUES(full_name),
    password_hash = VALUES(password_hash),
    role = VALUES(role);

INSERT INTO menu_items (name, category, price, image_path, is_available)
VALUES
    ('Sisig', 'Food', 75.00, 'pictures/Food/Sisig.jpg', 1),
    ('Fried Chicken', 'Food', 85.00, 'pictures/Food/Fried chicken.jpg', 1),
    ('Palabok', 'Food', 70.00, 'pictures/Food/Palabok.jpg', 1),
    ('Siomai', 'Food', 45.00, 'pictures/Food/Siomai.jpg', 1),
    ('Longanisa with Rice', 'Food', 65.00, 'pictures/Food/Longanisa with rice.jpg', 1),
    ('Skinless with Rice', 'Food', 65.00, 'pictures/Food/Skinless with rice.jpg', 1),
    ('Pancit', 'Food', 60.00, 'pictures/Food/Pancit.jpg', 1),
    ('Pizza', 'Food', 50.00, 'pictures/Food/Pizza.jpg', 1),
    ('Biko', 'Kakanin', 30.00, 'pictures/Kakanin/Biko.jpg', 1),
    ('Kuchinta', 'Kakanin', 25.00, 'pictures/Kakanin/Kuchinta.jpg', 1),
    ('Suman', 'Kakanin', 20.00, 'pictures/Kakanin/Suman.jpg', 1),
    ('Pichi Pichi', 'Kakanin', 28.00, 'pictures/Kakanin/Pichi pichi.jpg', 1),
    ('Mamon', 'Snack', 25.00, 'pictures/Snack/Mamon.jpg', 1),
    ('Turon', 'Snack', 20.00, 'pictures/Snack/Turon.jpg', 1),
    ('Egg Pie', 'Snack', 35.00, 'pictures/Snack/Egg Pie.jpg', 1),
    ('Banana Chips', 'Snack', 18.00, 'pictures/Snack/Banana Chips.jpg', 1),
    ('Buko Juice', 'Drink', 25.00, 'pictures/Drink/Buko Juice.jpg', 1),
    ('Mango Shake', 'Drink', 45.00, 'pictures/Drink/Mango Shake.jpg', 1),
    ('Cucumber Shake', 'Drink', 40.00, 'pictures/Drink/Cucumber Shake.jpg', 1),
    ('Water', 'Drink', 15.00, 'pictures/Drink/Water.jpg', 1)
ON DUPLICATE KEY UPDATE
    price = VALUES(price),
    image_path = VALUES(image_path),
    is_available = VALUES(is_available);
