# PeerBridge Customization Guide

## Recommended: rename a tutor from the website

1. Start Apache and MySQL in XAMPP and open a frontend.
2. Open **Discover Tutors** or **Find Tutors**.
3. Locate the tutor and click the pencil-shaped **Edit** button.
4. Replace **Full name** and modify department, subjects, availability, contact, country or languages if required.
5. Click **Save tutor profile**.
6. Refresh and confirm the updated record.

The frontend sends `PUT /api/tutors/{id}`; PHP updates that tutor in MySQL.

## Rename a tutor with phpMyAdmin

1. Open `http://localhost/phpmyadmin`.
2. Select `local_tutor_connector`.
3. Open the `tutors` table and select **Browse**.
4. Click **Edit** beside the correct tutor.
5. Change `name` and click **Go**.

Or run:

```sql
SELECT id, name, department FROM tutors;
UPDATE tutors SET name='Mohammed Sulthan Akthar' WHERE id=1;
```

Confirm the correct `id` before updating.

## Change initial sample tutors

Open `database/schema.sql`, search for `INSERT INTO tutors`, and edit the first quoted value in the required row:

```sql
('Ananya Rao', 'MCA - Sacred Heart College', 'DBMS, SQL', ...)
```

Change it to:

```sql
('Mohammed Sulthan Akthar', 'MCA - Sacred Heart College', 'DBMS, SQL', ...)
```

This affects fresh database imports only. Use Edit or SQL `UPDATE` for an existing database.

## Change tutors in the professional demo

Open `professional-interface-demo/app.js`. Near the beginning, find `tutors: [` and edit fields such as:

```javascript
name: 'Ananya Rao',
department: 'MCA · Sacred Heart College',
subjects: 'DBMS, SQL',
country: 'India',
languages: 'English, Tamil, Hindi'
```

Keep quotation marks and commas. Then click **Reset demo data** in the interface so the new values replace browser-saved values.

## Rename PeerBridge

- Professional demo: open `professional-interface-demo/index.html`.
- ReactJS: open `react-frontend/src/main.jsx`.
- AngularJS: open `angularjs-frontend/index.html`.

Search for `PeerBridge` and replace each visible occurrence with your new name. In both HTML files, also change the `<title>` text.

## Change colors

| Interface | File | Primary color |
|---|---|---|
| ReactJS | `react-frontend/src/style.css` | `#185adb` |
| AngularJS | `angularjs-frontend/style.css` | `#185adb` |
| Professional demo | `professional-interface-demo/asia.css` | `#185adb` |

Replace the primary color consistently and maintain strong text contrast.

## Change API address

Edit the `API` constant in:

- `react-frontend/src/main.jsx`
- `angularjs-frontend/app.js`

Development:

```javascript
const API='http://localhost/local-tutor-connector/backend/api';
```

Production example:

```javascript
const API='https://yourdomain.com/backend/api';
```

## Safe modification rules

- Keep a backup before large changes.
- Change one part and test it immediately.
- Do not remove code punctuation.
- Never put the MySQL password in frontend files.
- Do not rename database columns unless every matching PHP query is updated.
- Add authentication and restrict CORS before public production use.

## Final test checklist

- Tutor Create, Read, Update and Delete work.
- Help-request Create, Read, Update, Close and Delete work.
- Country, language and subject searches work.
- Study rooms load and accept joins until capacity is reached.
- Desktop and mobile layouts remain aligned.
