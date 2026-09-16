# PeerBridge — Local Tutor & Peer Help Connector
## Department Presentation & Project Overview Document

**Project Administrator & Lead Founder:** Mohammed Sulthan Akthar  
**Department:** MCA – Sacred Heart College  
**Live Production URL:** [https://sultan-local-tutor-connector.vercel.app](https://sultan-local-tutor-connector.vercel.app)  
**GitHub Repository:** [https://github.com/Sulthanakthar/sultan-s-local-tutor-connector](https://github.com/Sulthanakthar/sultan-s-local-tutor-connector)  

---

## 📌 Executive Summary

**PeerBridge** is an academic peer-learning and mentorship platform built to connect college students who need academic support with qualified peer tutors and collaborative study groups.

In traditional college setups, junior students often struggle with difficult subjects (e.g., DBMS, Java, Python, Web Development) and lack an easy, organized way to reach out to senior students for help. PeerBridge provides a digital platform where students can search for mentors, request help on specific topics, and join live study rooms.

---

## 🏗️ 1. How the Project Was Created (Architecture & Design)

The project was engineered using a **modular, multi-frontend architecture** connected to a **robust RESTful API backend**:

```text
       ┌──────────────────────────────────────────────────────────┐
       │                 FRONTEND USER INTERFACES                 │
       ├──────────────────────────┬───────────────────────────────┤
       │ 1. ReactJS 18 (Vite SPA)  │ 2. Professional Demo (HTML/JS)│
       │ 3. AngularJS 1.8 App     │ 4. Vercel Cloud Distribution  │
       └──────────────────────────┴───────────────────────────────┘
                                    │
                         HTTP REST API (JSON)
                                    ▼
       ┌──────────────────────────────────────────────────────────┐
       │                BACKEND REST CONTROLLER                    │
       │       PHP 8+ with Parameterized PDO Security             │
       └──────────────────────────────────────────────────────────┘
                                    │
                           SQL PDO Connection
                                    ▼
       ┌──────────────────────────────────────────────────────────┐
       │                     DATABASE LAYER                       │
       │       MySQL 8+ Relational Schema & Constraints           │
       └──────────────────────────────────────────────────────────┘
```

### Development Highlights:
- **Prepared SQL Statements**: Uses PDO parameterized queries (`PDO::ATTR_EMULATE_PREPARES => false`) to eliminate SQL injection vulnerabilities.
- **Dynamic Routing**: Built custom PHP router (`router.php`) supporting clean REST paths (`/api/tutors`, `/api/requests`, `/api/rooms`).
- **Resilient Cloud Hydration**: Equipped with client-side fallback storage so the application operates seamlessly both locally with MySQL and online via Vercel Cloud CDN.

---

## ⚙️ 2. Core Functionalities & Features

| Feature | Description |
|---|---|
| 👨‍🏫 **Tutor Discovery & Filtering** | Search tutors by name, subject (e.g., DBMS, SQL, Java), department, language, and country. |
| 📝 **Help Requests Board** | Students can post urgent learning needs; peers can offer assistance or close/reopen requests. |
| 👥 **Live Study Rooms** | Tutors and students can create small-group study sessions with real-time seat capacity tracking. |
| ⚡ **Full CRUD Operations** | Full **Create, Read, Update, and Delete** functionality across tutors, requests, and study rooms. |
| 📱 **Responsive Design** | Mobile-first, desktop-optimized UI with modern card layouts and modal overlays. |
| 🛡️ **Admin Profile & Governance** | Features a dedicated Admin badge and profile for lead platform administration. |

---

## 💻 3. Technology Stack Used

### 🔹 Backend & Server Layer
- **PHP 8.2+**: Lightweight REST API controller producing JSON responses.
- **MySQL 8.0+**: Relational database storing `tutors`, `help_requests`, `study_rooms`, and `room_members`.
- **PDO (PHP Data Objects)**: Secure database connectivity layer.

### 🔹 Frontend Layer
- **React 18 + Vite**: High-performance Single Page Application with component hooks (`useState`, `useEffect`, `useMemo`).
- **AngularJS 1.8**: Secondary frontend implementation showcasing `$http` integration.
- **Vanilla HTML5 / CSS3 / ES6 JS**: Professional demo interface with Asian regional discovery filters.
- **Lucide React Icons**: Modern icon suite.

### 📁 Deployment & Infrastructure
- **Git & GitHub**: Source code management (`Sulthanakthar/sultan-s-local-tutor-connector`).
- **Vercel Cloud**: Production hosting with automatic CI/CD deployment pipeline.

---

## 👥 4. Who Can Use This Project?

1. **Junior & Struggling Students**:
   - Easily find peer mentors for subjects they find challenging.
   - Post specific help requests (e.g., *"Need help understanding 2NF/3NF in DBMS"*).
2. **Senior Students & Peer Tutors**:
   - Showcase their expertise in programming languages and core subjects.
   - Complete peer tutoring sessions and build academic leadership experience.
3. **Study Groups & Project Teams**:
   - Join capacity-managed study rooms for exam preparation and lab sprints.
4. **Department Faculty & HODs**:
   - Monitor peer-learning trends, identify tough subjects, and foster student collaboration.

---

## 💡 5. Key Benefits for the Department

- 📈 **Improves Academic Performance**: Encourages peer tutoring, helping lower-performing students improve test scores.
- 💰 **Zero Cost Infrastructure**: Can be deployed for free on Vercel or hosted on existing college PHP/MySQL servers.
- ⚡ **Lightweight & High-Speed**: No heavy frameworks required for backend execution; loads in under 1 second.
- 🎯 **Multi-Frontend Showcase**: Demonstrates mastery of ReactJS, AngularJS, PHP REST APIs, MySQL, and Cloud Deployment in a single project.
- 🔐 **Secure & Scalable**: Prepared SQL queries and structured REST endpoints prepare the platform for future authentication integration.

---

## 📋 6. Key Presentation Talking Points (For HOD & Faculty)

> 1. *"PeerBridge is a complete full-stack academic platform designed to solve student learning difficulties through peer mentorship."*
> 2. *"It supports full CRUD operations—students can search mentors, post requests, edit listings, delete posts, and join study rooms."*
> 3. *"The project uses PHP 8 REST API with PDO security on the backend, MySQL for relational data, ReactJS + Vite for the frontend, and is deployed live on Vercel."*
> 4. *"It features client-side state hydration so the demo operates flawlessly both offline and online."*
> 5. *"It costs zero rupees to run and can be immediately adopted by our department to support junior-senior learning circles."*
