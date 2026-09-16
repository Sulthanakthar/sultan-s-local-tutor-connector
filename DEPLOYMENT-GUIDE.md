# PeerBridge Online Deployment Guide

## Recommended architecture

Use one PHP/MySQL shared-hosting account so the frontend, REST API and database remain on the same domain:

```text
Browser
  └── https://yourdomain.com
       ├── Professional HTML/CSS/JavaScript interface
       ├── /api → PHP REST API
       └── MySQL database (private hosting connection)
```

This is simpler and more reliable for this project than splitting React onto Vercel and PHP/MySQL onto another provider. Vercel does not officially provide a native PHP runtime; a PHP deployment there requires a community runtime. A normal PHP/MySQL host is the recommended client-demo route.

## Requirements

- A domain or hosting-provided temporary domain
- Linux shared hosting with Apache, PHP 8.1+ and PDO MySQL
- MySQL 8+ or a compatible current MariaDB release
- phpMyAdmin or another SQL import tool
- Apache `mod_rewrite` and `.htaccess` support
- HTTPS/SSL enabled

## Part A — test locally before uploading

1. Install XAMPP.
2. Extract the project folder to `C:\xampp\htdocs\local-tutor-connector`.
3. Start **Apache** and **MySQL**.
4. Open `http://localhost/phpmyadmin`.
5. Select **Import** and import `database/schema.sql`.
6. Copy `backend/config/database.local.example.php` to `backend/config/database.local.php`.
7. For a normal XAMPP installation, set:

```php
<?php
return [
    'host' => '127.0.0.1',
    'port' => '3306',
    'name' => 'local_tutor_connector',
    'user' => 'root',
    'pass' => '',
];
```

8. Open `http://localhost/local-tutor-connector/backend/api/health`.
9. Confirm that it returns `{"status":"ok"}`.
10. Open `http://localhost/local-tutor-connector/professional-interface-demo/`.
11. Test tutor creation, editing and deletion; help requests; study-room joining.

## Part B — create the online MySQL database

### cPanel

1. Open **MySQL Databases** or **Manage My Databases**.
2. Create a database such as `peerbridge`.
3. Create a MySQL user such as `peeruser` with a strong unique password.
4. Add that user to the database.
5. Grant **All Privileges** for this database.
6. Record the complete prefixed names. Example:

```text
Database: account_peerbridge
User: account_peeruser
Host: localhost
```

### Hostinger hPanel

1. Open **Websites → Dashboard → Databases → Management**.
2. Create a new MySQL database and user.
3. Save the database name, username, password and host exactly as displayed.

Never create the database user only through phpMyAdmin; use the hosting database-management screen so privileges and backups work correctly.

## Part C — import the online tables

1. Open phpMyAdmin from your hosting panel.
2. Select the database you just created.
3. Choose **Import**.
4. Upload `database/schema-hosting.sql`.
5. Run the import.
6. Confirm these tables exist:

```text
tutors
help_requests
study_rooms
room_members
```

`schema-hosting.sql` intentionally does not contain `CREATE DATABASE` or `USE`, because shared-hosting database names normally include an account prefix.

## Part D — configure the database connection

1. Inside the prepared `deployment-package/public_html/config` folder, copy `database.local.example.php`.
2. Rename the copy to `database.local.php`.
3. Open it and enter the exact online credentials:

```php
<?php
return [
    'host' => 'localhost',
    'port' => '3306',
    'name' => 'account_peerbridge',
    'user' => 'account_peeruser',
    'pass' => 'YOUR_STRONG_DATABASE_PASSWORD',
];
```

4. Save the file.
5. Never publish this file in GitHub or send it to a client without removing the real password.

## Part E — upload the website

1. Open the hosting **File Manager**.
2. Open the domain’s `public_html` folder.
3. Back up or remove the default placeholder `index.html` only after confirming the correct domain folder.
4. Upload the contents inside `deployment-package/public_html`—not the outer `public_html` folder itself.
5. Confirm the online structure is exactly:

```text
public_html/
├── index.html
├── app.js
├── style.css
├── asia.css
├── .htaccess
├── api/
│   ├── index.php
│   └── .htaccess
└── config/
    ├── database.php
    ├── database.local.php
    └── .htaccess
```

6. Ensure hidden files are visible so both `.htaccess` files are uploaded.
7. Use file permissions `644` for files and `755` for folders unless the host specifies otherwise.
8. Enable the free SSL certificate in the hosting dashboard.
9. Force HTTPS using the hosting control panel.

## Part F — verify the live deployment

Run these checks in this order:

1. Open `https://yourdomain.com/api/health` → must return `{"status":"ok"}`.
2. Open `https://yourdomain.com/api/tutors` → must return a JSON list.
3. Open `https://yourdomain.com` → tutor cards must load from MySQL.
4. Search by tutor, country and language.
5. Create a temporary tutor.
6. Edit its name and availability.
7. Delete that temporary tutor.
8. Create a help request, close it, reopen it and delete it.
9. Open **Study rooms**, join one using a test name, and verify a new row appears in `room_members` through phpMyAdmin.
10. Test at mobile width and on a real phone.
11. Open the browser console and confirm there are no red errors.

## Common deployment problems

### “Cannot connect to the database”

- Confirm `config/database.local.php` exists.
- Confirm the complete prefixed database name and username.
- Confirm the password.
- Try the database host shown by the provider instead of assuming `localhost`.
- Ensure the MySQL user is assigned to the database with privileges.

### `/api/tutors` gives 404

- Confirm `api/.htaccess` was uploaded.
- Confirm Apache rewrite support is enabled.
- Confirm the API folder is directly under `public_html`.

### Website loads but no tutor data appears

- Test `/api/health` and `/api/tutors` directly.
- Check that `schema-hosting.sql` was imported into the same database used by `database.local.php`.
- Open browser developer tools and inspect the Network tab.

### 500 Internal Server Error

- Select PHP 8.1 or newer in the hosting control panel.
- Enable the `pdo_mysql` extension.
- Check the hosting error log.
- Temporarily set the hosting environment variable `APP_DEBUG=true` only while diagnosing, then switch it off.

### Refreshing a page gives 404

- Upload the root `.htaccess` file from the deployment package.
- Confirm hidden files are enabled in File Manager.

## Production security checklist

- Use HTTPS.
- Use a separate database user only for this application.
- Keep `database.local.php` out of Git.
- Use a strong password and rotate it after handover.
- Back up files and MySQL before updates.
- Add login and authorization before allowing the general public to edit or delete records.
- Replace permissive editing with owner/admin permissions for a real institution deployment.
- Configure rate limiting and server backups through the hosting provider.

## Client presentation checklist

- Replace sample tutor names and contacts.
- Add the college or client logo and brand name.
- Use a professional domain or hosting temporary URL.
- Test the demo in an incognito browser.
- Keep three tutor records, two open requests and three study rooms ready.
- Do not demonstrate using real student phone numbers.
- Give the client a read-only presentation first; enable editing only when needed.

## Official hosting references

- Hostinger — upload website files: https://www.hostinger.com/support/2458059-how-to-create-a-website-in-hostinger/
- Hostinger — File Manager: https://www.hostinger.com/support/4548688-basic-actions-in-the-file-manager-in-hostinger/
- cPanel — create and manage MySQL databases/users: https://docs.cpanel.net/cpanel/databases/mysql-databases/
- Vercel — unsupported runtimes require a custom/community runtime: https://vercel.com/docs/project-configuration/vercel-json
