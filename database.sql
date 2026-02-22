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
    email VARCHAR(150) NULL,
    lrn VARCHAR(20) NULL,
    grade VARCHAR(30) NULL,
    section VARCHAR(60) NULL,
    staff_number VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS email VARCHAR(150) NULL AFTER role,
    ADD COLUMN IF NOT EXISTS lrn VARCHAR(20) NULL AFTER email,
    ADD COLUMN IF NOT EXISTS grade VARCHAR(30) NULL AFTER lrn,
    ADD COLUMN IF NOT EXISTS section VARCHAR(60) NULL AFTER grade,
    ADD COLUMN IF NOT EXISTS staff_number VARCHAR(50) NULL AFTER section;

CREATE TABLE IF NOT EXISTS menu_items (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description VARCHAR(1000) NOT NULL DEFAULT '',
    nutritional_values VARCHAR(1000) NOT NULL DEFAULT '',
    is_halal TINYINT(1) NOT NULL DEFAULT 1,
    image_path VARCHAR(255) NOT NULL,
    is_available TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_menu_name_category (name, category)
);

ALTER TABLE menu_items
    ADD COLUMN IF NOT EXISTS description VARCHAR(1000) NOT NULL DEFAULT '' AFTER price,
    ADD COLUMN IF NOT EXISTS nutritional_values VARCHAR(1000) NOT NULL DEFAULT '' AFTER description,
    ADD COLUMN IF NOT EXISTS is_halal TINYINT(1) NOT NULL DEFAULT 1 AFTER nutritional_values;

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

UPDATE menu_items SET is_available = 0;

INSERT INTO menu_items (name, category, price, description, nutritional_values, is_halal, image_path, is_available)
VALUES
    ('Delight', 'Drink', 20.00, 'Yakult-like cultured milk drink.', 'Calories: 50 kcal | Carbohydrates: 12g | Sugar: 10g | Protein: 1g | Fat: 0g | Sodium: 10mg | Calcium: Small amount', 1, 'pictures/Drink/Delight.jpg', 1),
    ('Water', 'Drink', 10.00, 'Purified drinking water.', 'Calories: 0 kcal | Carbohydrates: 0g | Sugar: 0g | Protein: 0g | Fat: 0g | Sodium: 0mg', 1, 'pictures/Drink/Water.jpg', 1),
    ('Mango Shake', 'Drink', 30.00, 'Cold blended mango shake.', 'Calories: 220 kcal | Carbohydrates: 40g | Sugar: 32g | Protein: 3g | Fat: 3g | Fiber: 2g | Vitamin C: High', 1, 'pictures/Drink/Mango Shake.jpg', 1),
    ('Choco Shake', 'Drink', 30.00, 'Chocolate milkshake.', 'Calories: 250 kcal | Carbohydrates: 38g | Sugar: 30g | Protein: 5g | Fat: 8g | Calcium: Moderate', 1, 'pictures/Drink/Choco Shake.jpg', 1),
    ('Dragon Fruit Juice', 'Drink', 30.00, 'Fresh dragon fruit juice.', 'Calories: 120 kcal | Carbohydrates: 25g | Sugar: 18g | Protein: 2g | Fat: 1g | Fiber: 3g | Antioxidants: High', 1, 'pictures/Drink/Dragon Fruit Shake.jpg', 1),
    ('Cucumber Juice', 'Drink', 20.00, 'Refreshing cucumber juice.', 'Calories: 40 kcal | Carbohydrates: 8g | Sugar: 5g | Protein: 1g | Fat: 0g | Potassium: Moderate', 1, 'pictures/Drink/Cucumber Shake.jpg', 1),
    ('Bear Brand', 'Drink', 40.00, 'Fortified powdered milk drink.', 'Calories: 140 kcal | Carbohydrates: 20g | Sugar: 18g | Protein: 6g | Fat: 4g | Calcium: High | Iron: Present', 1, 'pictures/Drink/Bear Brand.jpg', 1),
    ('Milo', 'Drink', 40.00, 'Chocolate malt energy drink.', 'Calories: 180 kcal | Carbohydrates: 30g | Sugar: 22g | Protein: 6g | Fat: 5g | Iron: Moderate | Calcium: Moderate', 1, 'pictures/Drink/Milo.jpg', 1),
    ('Selecta Ice Cream', 'Drink', 40.00, 'Single-serve ice cream cup.', 'Calories: 270 kcal | Carbohydrates: 30g | Sugar: 25g | Protein: 4g | Fat: 15g | Saturated Fat: High | Calcium: Moderate', 1, 'pictures/Drink/Selecta.jpg', 1),
    ('Buko Juice', 'Drink', 20.00, 'Fresh coconut juice.', 'Calories: 50 kcal | Carbohydrates: 12g | Sugar: 10g | Protein: 0g | Fat: 0g | Potassium: High | Electrolytes: High', 1, 'pictures/Drink/Buko Juice.jpg', 1),
    ('Chuckie', 'Drink', 40.00, 'Ready-to-drink chocolate milk.', 'Calories: 200 kcal | Carbohydrates: 30g | Sugar: 24g | Protein: 6g | Fat: 6g | Calcium: Moderate', 1, 'pictures/Drink/Chuckie.jpg', 1),

    ('Sisig', 'Food', 60.00, 'Savory sizzling sisig.', 'Calories: 420 kcal | Carbohydrates: 8g | Protein: 22g | Fat: 35g | Saturated Fat: High | Sodium: High', 0, 'pictures/Food/Sisig.jpg', 1),
    ('Pancit (Chicken)', 'Food', 30.00, 'Stir-fried noodles with chicken.', 'Calories: 300 kcal | Carbohydrates: 45g | Protein: 10g | Fat: 10g | Fiber: 3g | Sodium: Moderate', 1, 'pictures/Food/Pancit.jpg', 1),
    ('Macaroni', 'Food', 30.00, 'Creamy macaroni dish.', 'Calories: 320 kcal | Carbohydrates: 50g | Protein: 8g | Fat: 12g | Sugar: 10g', 1, 'pictures/Food/Macaroni.jpg', 1),
    ('Palabok', 'Food', 30.00, 'Rice noodles with savory sauce.', 'Calories: 350 kcal | Carbohydrates: 55g | Protein: 12g | Fat: 10g | Sodium: Moderate', 1, 'pictures/Food/Palabok.jpg', 1),
    ('Maja Blanca', 'Food', 20.00, 'Sweet coconut pudding.', 'Calories: 220 kcal | Carbohydrates: 35g | Sugar: 20g | Fat: 8g | Protein: 3g', 1, 'pictures/Food/Maha.jpg', 1),
    ('Creamy Steak (Beef)', 'Food', 60.00, 'Creamy beef steak meal.', 'Calories: 480 kcal | Carbohydrates: 10g | Protein: 30g | Fat: 35g | Iron: High | Sodium: Moderate', 1, 'pictures/Food/Creamy steak.jpg', 1),
    ('Fried Chicken', 'Food', 30.00, 'Crispy fried chicken.', 'Calories: 320 kcal | Carbohydrates: 15g | Protein: 22g | Fat: 22g | Sodium: Moderate', 1, 'pictures/Food/Fried chicken.jpg', 1),
    ('Corn Dog (Pork)', 'Food', 25.00, 'Deep-fried pork corn dog.', 'Calories: 230 kcal | Carbohydrates: 25g | Protein: 7g | Fat: 12g | Sodium: Moderate', 0, 'pictures/Food/Corn dog.jpg', 1),
    ('Egg with Rice', 'Food', 60.00, 'Egg served with rice.', 'Calories: 400 kcal | Carbohydrates: 55g | Protein: 14g | Fat: 12g | Iron: Moderate', 1, 'pictures/Food/Egg with rice.jpg', 1),
    ('Skinless with Rice (Pork)', 'Food', 60.00, 'Pork skinless sausage with rice.', 'Calories: 500 kcal | Carbohydrates: 55g | Protein: 18g | Fat: 28g | Sodium: High', 0, 'pictures/Food/Skinless with rice.jpg', 1),
    ('Longanisa with Rice (Pork)', 'Food', 60.00, 'Pork longanisa with rice.', 'Calories: 520 kcal | Carbohydrates: 55g | Protein: 18g | Fat: 30g | Sugar: Moderate', 0, 'pictures/Food/Longanisa with rice.jpg', 1),
    ('Pizza (Cheese)', 'Food', 25.00, 'Cheese pizza slice.', 'Calories: 280 kcal | Carbohydrates: 35g | Protein: 12g | Fat: 10g | Calcium: Moderate', 1, 'pictures/Food/Pizza.jpg', 1),
    ('Siopao (Chicken)', 'Food', 30.00, 'Steamed bun with chicken filling.', 'Calories: 280 kcal | Carbohydrates: 45g | Protein: 10g | Fat: 6g', 1, 'pictures/Food/Siopao.jpg', 1),
    ('Siomai (Chicken)', 'Food', 20.00, 'Chicken siomai dumplings.', 'Calories: 180 kcal | Carbohydrates: 15g | Protein: 10g | Fat: 8g | Sodium: Moderate', 1, 'pictures/Food/Siomai.jpg', 1),
    ('Pastil with Rice (Chicken)', 'Food', 55.00, 'Chicken pastil with rice.', 'Calories: 380 kcal | Carbohydrates: 55g | Protein: 18g | Fat: 8g | Iron: Moderate', 1, 'pictures/Food/Pastil with rice.jpg', 1),

    ('Banana Chips', 'Snack', 15.00, 'Crunchy banana chips.', 'Calories: 120-300 kcal | Carbohydrates: 20-40g | Sugar: 10-25g | Fat: 5-15g | Protein: 2-6g', 1, 'pictures/Snack/Banana Chips.jpg', 1),
    ('Kringkols', 'Snack', 20.00, 'Sweet crunchy kringkols.', 'Calories: 120-300 kcal | Carbohydrates: 20-40g | Sugar: 10-25g | Fat: 5-15g | Protein: 2-6g', 1, 'pictures/Snack/Kringkols.jpg', 1),
    ('Eggnog', 'Snack', 10.00, 'Classic eggnog cookie.', 'Calories: 120-300 kcal | Carbohydrates: 20-40g | Sugar: 10-25g | Fat: 5-15g | Protein: 2-6g', 1, 'pictures/Snack/EggNog.jpg', 1),
    ('Breadsticks', 'Snack', 10.00, 'Baked breadsticks.', 'Calories: 120-300 kcal | Carbohydrates: 20-40g | Sugar: 10-25g | Fat: 5-15g | Protein: 2-6g', 1, 'pictures/Snack/Bread Sticks.jpg', 1),
    ('Mamon', 'Snack', 20.00, 'Soft mamon cake.', 'Calories: 120-300 kcal | Carbohydrates: 20-40g | Sugar: 10-25g | Fat: 5-15g | Protein: 2-6g', 1, 'pictures/Snack/Mamon.jpg', 1),
    ('Lintiao', 'Snack', 20.00, 'Fried lintiao snack.', 'Calories: 120-300 kcal | Carbohydrates: 20-40g | Sugar: 10-25g | Fat: 5-15g | Protein: 2-6g', 1, 'pictures/Snack/Lintiao.jpg', 1),
    ('Egg Pie', 'Snack', 20.00, 'Sweet egg pie slice.', 'Calories: 120-300 kcal | Carbohydrates: 20-40g | Sugar: 10-25g | Fat: 5-15g | Protein: 2-6g', 1, 'pictures/Snack/Egg Pie.jpg', 1),
    ('Turon', 'Snack', 20.00, 'Banana spring roll.', 'Calories: 120-300 kcal | Carbohydrates: 20-40g | Sugar: 10-25g | Fat: 5-15g | Protein: 2-6g', 1, 'pictures/Snack/Turon.jpg', 1),
    ('Egg Sandwich', 'Snack', 20.00, 'Egg sandwich snack.', 'Calories: 120-300 kcal | Carbohydrates: 20-40g | Sugar: 10-25g | Fat: 5-15g | Protein: 2-6g', 1, 'pictures/Snack/Egg sandwich.jpg', 1),

    ('Pichi-Pichi', 'Kakanin', 20.00, 'Steamed cassava kakanin.', 'Calories: 150-250 kcal | Carbohydrates: 30-45g | Sugar: 15-25g | Fat: 5-10g | Protein: 2-4g', 1, 'pictures/Kakanin/Pichi pichi.jpg', 1),
    ('Kutsinta', 'Kakanin', 20.00, 'Steamed brown rice cake.', 'Calories: 150-250 kcal | Carbohydrates: 30-45g | Sugar: 15-25g | Fat: 5-10g | Protein: 2-4g', 1, 'pictures/Kakanin/Kuchinta.jpg', 1),
    ('Palitaw', 'Kakanin', 20.00, 'Sticky rice cake with coconut.', 'Calories: 150-250 kcal | Carbohydrates: 30-45g | Sugar: 15-25g | Fat: 5-10g | Protein: 2-4g', 1, 'pictures/Kakanin/Palitaw.jpg', 1),
    ('Biko', 'Kakanin', 20.00, 'Sweet sticky rice with coconut.', 'Calories: 150-250 kcal | Carbohydrates: 30-45g | Sugar: 15-25g | Fat: 5-10g | Protein: 2-4g', 1, 'pictures/Kakanin/Biko.jpg', 1),
    ('Sapin-Sapin', 'Kakanin', 20.00, 'Layered glutinous rice cake.', 'Calories: 150-250 kcal | Carbohydrates: 30-45g | Sugar: 15-25g | Fat: 5-10g | Protein: 2-4g', 1, 'pictures/Kakanin/Sapin sapin.jpg', 1),
    ('Suman', 'Kakanin', 20.00, 'Rice cake wrapped in leaves.', 'Calories: 150-250 kcal | Carbohydrates: 30-45g | Sugar: 15-25g | Fat: 5-10g | Protein: 2-4g', 1, 'pictures/Kakanin/Suman.jpg', 1)
ON DUPLICATE KEY UPDATE
    price = VALUES(price),
    description = VALUES(description),
    nutritional_values = VALUES(nutritional_values),
    is_halal = VALUES(is_halal),
    image_path = VALUES(image_path),
    is_available = VALUES(is_available);
