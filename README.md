# Campus Canteen Reservation (Frontend + PHP JSON API)

This project is a frontend-rendered web app:
- Frontend: `HTML + CSS + JavaScript (Fetch API)`
- Backend: `PHP API endpoints returning JSON`
- Database: `MySQL`

No server-rendered PHP dashboard pages are used.
No `localStorage`, `sessionStorage`, or JSON-file backend is used.

## Features
- Register and login with role-based accounts:
  - Student registration: full name, LRN, grade, section, email, password
  - Staff registration: full name, staff ID, password
  - Login: full name + password
- Session-based authentication with role field in MySQL
- Student dashboard:
  - View available menu items by category
  - Add/remove items in cart
  - Checkout via API
  - View own active orders and completed history
- Staff dashboard:
  - View all student orders
  - Update status flow (`Pending -> Preparing -> Completed`)
  - Completed orders appear in history
  - Add, edit, and delete menu items (database-backed)
- Backend role-based authorization on protected API routes

## Project Structure
- `index.html`: Login/register page
- `student.html`: Student dashboard
- `staff.html`: Staff dashboard
- `assets/`: CSS + JS assets
- `api/`: PHP JSON API endpoints
- `config/`: App + DB config
- `includes/`: Authentication/session helpers
- `database.sql`: SQL schema + seed data (import only)

## Requirements
- PHP 8.0+ with PDO MySQL extension
- MySQL 8+ (or MariaDB equivalent)
- Apache (XAMPP/WAMP/Laragon/local Apache, or shared hosting Apache)

## Local Setup
1. Create/import database using `database.sql`.
2. Configure database credentials by one of these methods:
   - Environment variables: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`
   - Local config file: create `config/database.local.php` from `config/database.local.example.php`
3. Put the project under your web root.
4. Open the app using Apache URL (example: `http://localhost/Triple3/`).

## Publish To Production (All Features Working)
Use any host with `PHP + MySQL + SSL` (shared hosting or VPS).

1. Create a new MySQL database and user in your hosting panel.
2. Import `database.sql` in phpMyAdmin.
3. Upload the entire project to your public web directory (`public_html` or domain root).
4. Configure DB credentials:
   - Preferred: create `config/database.local.php` on the server using `config/database.local.example.php` values.
   - Or set environment variables in hosting panel.
5. Ensure HTTPS is enabled for your domain.
6. Confirm the app is served over the web server URL (not `file://`).

## Security Hardening Included
- `.htaccess` blocks directory listing and sensitive file extensions (`.sql`, `.env`, `.ini`, `.md`, backups).
- `.htaccess` denies direct web access to `config/` and `includes/`.
- Security headers set: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`.
- Password hashing via `password_hash()` and `password_verify()`.
- Session regeneration on login.
- HTTP-only, SameSite cookies.
- Backend role checks on protected endpoints.
- Prepared SQL statements (PDO).

## Post-Deploy Verification
1. Register a student account and verify required student fields.
2. Register a staff account and verify only staff fields are required.
3. Login as student and place an order.
4. Login as staff, update status to `Preparing` then `Completed`.
5. Confirm both dashboards reflect status changes and completed history.

## Demo Accounts (Seeded)
- Student: `Juan Dela Cruz` / `student123`
- Staff: `Maria Santos` / `staff123`

## API Endpoints
- Auth
  - `POST api/auth/register.php`
  - `POST api/auth/login.php`
  - `POST api/auth/logout.php`
  - `GET api/auth/me.php`
- Menu
  - `GET api/menu/list.php`
  - `GET api/menu/staff_list.php` (staff only)
  - `POST api/menu/create.php` (staff only)
  - `POST api/menu/update.php` (staff only)
  - `POST api/menu/delete.php` (staff only)
- Orders
  - `POST api/orders/create.php` (student only)
  - `GET api/orders/student_list.php` (student only)
  - `GET api/orders/staff_list.php` (staff only)
  - `POST api/orders/update_status.php` (staff only)
