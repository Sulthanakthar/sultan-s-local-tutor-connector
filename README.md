# Local Tutor & Peer Help Connector

A college peer-learning CRUD project with two independent frontends and one shared backend.

## Technology

- Backend: PHP 8+ REST API with PDO
- Database: MySQL 8+
- Frontend A: ReactJS + Vite
- Frontend B: AngularJS 1.8
- Professional demo: HTML5, CSS3 and JavaScript

## Features

- Create, browse, search, edit and delete tutor profiles
- Create, browse, edit, close/reopen and delete help requests
- Filter tutors by subject through `GET /tutors?subject=DBMS`
- Responsive UI for mobile and desktop
- Prepared SQL statements, JSON validation, CORS and useful error responses
- Sample DBMS, Java and Mathematics records
- Asia-wide country and language discovery
- Study rooms, capacity tracking and student joining

## Folder structure

```text
local-tutor-connector/
├── database/schema.sql
├── backend/
│   ├── config/database.php
│   └── api/index.php
├── react-frontend/
├── angularjs-frontend/
├── professional-interface-demo/
└── CUSTOMIZATION-GUIDE.md
```

## Run with XAMPP (Windows)

1. Copy `local-tutor-connector` to `C:\\xampp\\htdocs\\`.
2. Start Apache and MySQL in XAMPP.
3. Open phpMyAdmin at `http://localhost/phpmyadmin`.
4. Select **Import**, choose `database/schema.sql`, then import it.
5. Copy `backend/config/database.local.example.php` to `backend/config/database.local.php` and enter your local database credentials.
6. Test the API: `http://localhost/local-tutor-connector/backend/api/health`.

### ReactJS frontend

Open a terminal in `react-frontend` and run:

```bash
npm install
npm run dev
```

Then open the Vite URL, normally `http://localhost:5173`.

### AngularJS frontend

Open `http://localhost/local-tutor-connector/angularjs-frontend/`.

Do not double-click `index.html`; serve it through Apache as shown above.

### Professional Asia interface

Open `http://localhost/local-tutor-connector/professional-interface-demo/`.

This presentation-ready interface reads and writes the PHP/MySQL database through the REST API.

## REST API

| Method | Endpoint | Action |
|---|---|---|
| GET | `/api/tutors` | List tutors |
| GET | `/api/tutors?subject=Java` | Filter tutors |
| POST | `/api/tutors` | Create tutor |
| PUT | `/api/tutors/{id}` | Update tutor |
| DELETE | `/api/tutors/{id}` | Delete tutor |
| GET | `/api/requests` | List help requests |
| GET | `/api/requests?status=Open` | Filter requests |
| POST | `/api/requests` | Create request |
| PUT | `/api/requests/{id}` | Update or close request |
| DELETE | `/api/requests/{id}` | Delete request |
| GET | `/api/rooms` | List study rooms and member totals |
| POST | `/api/rooms` | Create a room |
| PUT | `/api/rooms/{id}` | Update a room |
| DELETE | `/api/rooms/{id}` | Delete a room |
| POST | `/api/join-room` | Join a student to a room |

## Rename tutors or modify the project

Open `CUSTOMIZATION-GUIDE.md` for exact step-by-step instructions covering tutor names, branding, colors, API URLs, countries and languages.

## How the application functions

1. The browser loads the professional responsive interface.
2. JavaScript calls the PHP REST API using JSON over HTTP.
3. PHP validates required fields and runs parameterized PDO queries.
4. MySQL permanently stores tutors, help requests, study rooms and room members.
5. The API returns JSON and the interface refreshes the relevant cards and totals.

| User action | API operation | Database table |
|---|---|---|
| Browse/search tutors | `GET /api/tutors` | `tutors` |
| Create tutor | `POST /api/tutors` | `tutors` |
| Edit tutor | `PUT /api/tutors/{id}` | `tutors` |
| Delete tutor | `DELETE /api/tutors/{id}` | `tutors` |
| Manage help requests | `/api/requests` CRUD | `help_requests` |
| Browse rooms | `GET /api/rooms` | `study_rooms`, `room_members` |
| Join a room | `POST /api/join-room` | `room_members` |

## Source and deployment folders

- `professional-interface-demo/` — client-facing production interface connected to PHP/MySQL.
- `react-frontend/` — ReactJS/Vite implementation and compiled `dist/` output.
- `angularjs-frontend/` — AngularJS implementation.
- `backend/` — PHP REST API and protected database configuration.
- `database/` — local XAMPP schema and shared-hosting schema.
- `deployment-package/public_html/` — ready-to-upload website structure.
- `DEPLOYMENT-GUIDE.md` — complete online deployment and verification instructions.
- `CUSTOMIZATION-GUIDE.md` — changing names, branding, colors and content.

## Fast online deployment summary

1. Purchase or open PHP/MySQL shared hosting and connect a domain or temporary domain.
2. Create a MySQL database and database user from the hosting control panel.
3. Import `database/schema-hosting.sql` through phpMyAdmin.
4. Copy `deployment-package/public_html/config/database.local.example.php` to `database.local.php` and enter the online database credentials.
5. Upload everything inside `deployment-package/public_html` to the host's `public_html` folder.
6. Enable SSL and open `/api/health`, `/api/tutors`, and then the home page.
7. Complete every item in the verification checklist inside `DEPLOYMENT-GUIDE.md`.

## Verification performed on this package

- React production build completes successfully.
- Professional and AngularJS JavaScript pass Node syntax checks.
- API routes and frontend API paths use the same production `/api` location.
- Prepared deployment folder contains frontend, PHP API, protected config templates and Apache rewrite rules.
- Database schemas contain all four required tables and sample records.
- Archive integrity is checked before delivery.

## Note

This academic CRUD version intentionally has no login. Before a real public college deployment, add authentication and authorization so students can edit only their own records.
