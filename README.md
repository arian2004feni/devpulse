# DevPulse – Internal Tech Issue & Feature Tracker

A collaborative platform for software teams to report bugs, suggest features, and coordinate issue resolution through role-based access control.

## 🚀 Live URL

**API:** `https://arian2004-devpulse.vercel.app`

## 📂 GitHub Repository

**Repository:** `https://github.com/arian2004feni/devpulse`

---

# ✨ Features

* JWT-based Authentication & Authorization
* Role-based Access Control (`contributor` and `maintainer`)
* Secure Password Hashing with bcrypt
* Create Bug Reports and Feature Requests
* View All Issues with Filtering & Sorting
* View Single Issue Details
* Contributor Ownership Validation
* Maintainer Management Capabilities
* Issue Status Tracking (`open`, `in_progress`, `resolved`)
* Centralized Error Handling
* PostgreSQL Database Integration
* TypeScript-based Scalable Architecture

---

# 🛠️ Tech Stack

### Backend

* Node.js
* TypeScript
* Express.js

### Database

* PostgreSQL
* Native `pg` Driver
* Raw SQL Queries

### Authentication & Security

* JWT (`jsonwebtoken`)
* bcrypt

### Deployment

* Vercel
* Neon PostgreSQL

---

# 📦 Installation & Setup

## 1. Clone Repository

```bash
git clone https://github.com/arian2004feni/devpulse.git

cd devpulse
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000

CONNECTIONSTRING=your_postgresql_connection_string

JWT_SECRET=your_super_secret_key

JWT_REFRESH_SECRET=your_super_secret_refresh_key

SECRET_EXPIRES_IN=7d

REFRESH_SECRET_EXPIRES_IN=14d
```

## 4. Start Development Server

```bash
npm run dev
```

## 5. Build Production Version

```bash
npm run build
```

## 6. Run Production Server

```bash
npm start
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | `/api/auth/signup` | Register User |
| POST   | `/api/auth/login`  | Login User    |

---

## Issues

| Method | Endpoint          | Description      |
| ------ | ----------------- | ---------------- |
| POST   | `/api/issues`     | Create Issue     |
| GET    | `/api/issues`     | Get All Issues   |
| GET    | `/api/issues/:id` | Get Single Issue |
| PATCH  | `/api/issues/:id` | Update Issue     |
| DELETE | `/api/issues/:id` | Delete Issue     |

---

# 🔍 Query Parameters

### Get All Issues

```http
GET /api/issues
```

Optional Query Parameters:

| Parameter | Values                      |
| --------- | --------------------------- |
| sort      | newest, oldest              |
| type      | bug, feature_request        |
| status    | open, in_progress, resolved |

Example:

```http
GET /api/issues?sort=newest&type=bug&status=open
```

---

# 🔐 Authentication

Protected endpoints require JWT token:

```http
Authorization: <JWT_TOKEN>
```

Example:

```http
Authorization: eyJhbGciOiJIUzI1NiIs...
```

---

# 🗄️ Database Schema Summary

## Users Table

| Field      | Type                     |
| ---------- | ------------------------ |
| id         | SERIAL PRIMARY KEY       |
| name       | VARCHAR                  |
| email      | VARCHAR UNIQUE           |
| password   | TEXT                     |
| role       | contributor / maintainer |
| created_at | TIMESTAMP                |
| updated_at | TIMESTAMP                |

### Purpose

Stores registered user information and access roles.

---

## Issues Table

| Field       | Type                          |
| ----------- | ----------------------------- |
| id          | SERIAL PRIMARY KEY            |
| title       | VARCHAR(150)                  |
| description | TEXT                          |
| type        | bug / feature_request         |
| status      | open / in_progress / resolved |
| reporter_id | INTEGER                       |
| created_at  | TIMESTAMP                     |
| updated_at  | TIMESTAMP                     |

### Purpose

Stores bug reports and feature requests submitted by users.

---

# 👥 User Roles

## Contributor

* Register & Login
* Create Issues
* View Issues
* Update Own Open Issues

## Maintainer

* All Contributor Permissions
* Update Any Issue
* Delete Any Issue
* Change Issue Status

---

# 📁 Project Structure

```bash
src/
│
├── app/
│   ├── modules/
│   │   ├── auth/
│   │   └── issues/
│   │
│   ├── middleware/
│   │
│   ├── utils/
│   │
│   ├── config/
│   │
│   └── routes/
│
├── server.ts
└── app.ts
```

---

# ⚠️ Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": "Detailed error information"
}
```

---

# ✅ Success Response Format

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

---

# 📄 License

This project was developed as part of the **Programming Hero Backend Assignment – DevPulse**.

---

## 👨‍💻 Author

**Asraful Hoque Arian**

GitHub: `https://github.com/arian2004feni`

Email: `arian2004feni@gmail.com`
