# Campus Canteen Reservation (Frontend + PHP JSON API)

This project is a **frontend-rendered web app**:
- Frontend: `HTML + CSS + JavaScript (Fetch API)`
- Backend: `PHP API endpoints returning JSON`
- Database: `MySQL`

No server-rendered PHP pages are used for dashboard rendering.
No `localStorage`, `sessionStorage`, or JSON-file backend is used.

## Features
- Register and login for `student` and `staff` accounts
- Session-based authentication with role field in MySQL
- Student dashboard:
  - View available menu items
  - Add/remove items in cart (frontend state)
  - Checkout via API
  - View own order history and status
- Staff dashboard:
  - View all student orders with details
  - Update order status (`Pending -> Preparing -> Completed`)
  - Auto-refresh every 5 seconds
  - Manage menu item price and availability
- Backend role-based authorization on every protected API route

## Project Structure
- `index.html`: Login/Register frontend page
- `student.html`: Student dashboard frontend page
- `staff.html`: Staff dashboard frontend page
- `assets/`: CSS + JS frontend assets
- `api/`: PHP JSON API endpoints
- `config/`: App + DB bootstrap
- `database.sql`: MySQL schema and seed data

## Requirements
- PHP 8.0+ with PDO MySQL extension
- MySQL 8+ (or MariaDB)
- Apache/XAMPP/WAMP/Laragon

## Setup
1. Import `database.sql` into MySQL.
2. Configure database environment variables if needed:
   - `DB_HOST` (default `127.0.0.1`)
   - `DB_PORT` (default `3306`)
   - `DB_NAME` (default `canteen_reservation`)
   - `DB_USER` (default `root`)
   - `DB_PASS` (default empty)
3. Put the project in your web root and open `index.html`.

## Demo Accounts
- Student: `student1` / `student123`
- Staff: `staff1` / `staff123`

## API Endpoints
- Auth
  - `POST api/auth/register.php`
  - `POST api/auth/login.php`
  - `POST api/auth/logout.php`
  - `GET api/auth/me.php`
- Menu
  - `GET api/menu/list.php`
  - `GET api/menu/staff_list.php` (staff only)
  - `POST api/menu/update.php` (staff only)
- Orders
  - `POST api/orders/create.php` (student only)
  - `GET api/orders/student_list.php` (student only)
  - `GET api/orders/staff_list.php` (staff only)
  - `POST api/orders/update_status.php` (staff only)

## Security Controls
- Password hashing via `password_hash()` and `password_verify()`
- Session regeneration on login
- HTTP-only, SameSite session cookies
- Role checks in backend API (`student`/`staff`)
- Prepared SQL statements (PDO)
