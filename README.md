# Senior Full-Stack Developer Assessment
⚠️ **NOTE!** Do not submit a pull request to this repository. Fork it and open a pull request in your own fork..
## Introduction

Welcome! If you're reviewing this repository, you are likely a candidate for the Senior Full-Stack Developer position at HyperGuest—congratulations on making it this far.

This task is designed to evaluate your problem-solving skills and full-stack development capabilities.

> **Important:** While the frontend uses Vue.js (with Vuex and Vue Router), **prior experience with Vue.js is not required**. The task focuses on functionality, integration, and clean code.

---

### Please note:

- **Do not use AI tools (e.g., GitHub Copilot)** for this task. We are evaluating your skills—not those of an assistant.
- Code quality matters. Please write clean, readable, and maintainable code.
- Do **not submit a pull request to this repository**. Fork it and open a pull request in your own fork.

### With your submission, include:

- A brief explanation of your implementation.
- Suggestions for improvements or architectural changes you would recommend. The existing codebase is intentionally not perfect.

---

## Project Overview

This is a full-stack application using the following technologies:

- **Backend**: Node.js, TypeScript, Express, TypeORM
- **Frontend**: Vue.js (Vuex, Vue Router, Vite)
- **Database**: SQLite

---

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

---

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies:**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Set environment variables:**
   - Copy `.env.example` to `.env` in the backend directory.
   - SQLite is used, so no additional database setup is required.

4. **Run database migrations:**
   ```bash
   npm run migration:run
   ```

5. **Start development servers:**
   ```bash
   # Backend (from backend directory)
   npm run start:dev

   # Frontend (from frontend directory)
   npm run dev
   ```

- Application endpoints:
  - Frontend: http://localhost:5173
  - Backend: http://localhost:3000

---

## Project Structure

```
├── backend/        # Backend application
│   ├── src/        # Source code
│   ├── database.sqlite
│   └── package.json
├── frontend/       # Frontend application
│   ├── src/        # Source code
│   └── package.json
└── README.md
```

---

## Assessment Objectives

You will be evaluated on your ability to:

- Implement backend business logic
- Design and expose RESTful APIs
- Modify and migrate database schema
- Integrate backend with frontend
- Manage application state using Vuex
- Implement routing and authorization

---

## Tasks

Implement the following features:

1. **User Role Management**
   - Replace the current single-role-per-user setup with support for **multiple roles**.
   - The DB column `role` should be change to `roles` and it's type to `JSON`, it will contain a JSON array of roles
   - Please use the DB migrations as you would in a real life application

2. **User Status Enhancement**
   - Replace the current boolean status field with a new enum: `Enabled`, `Disabled`, and `Deleted`.

3. **Update both backend and frontend** to support the above changes.

4. **Authorization Check**
   - The server should return HTTP 401 Unauthorized if a user's status is `Deleted`.

5. **Client-Side Implementation Requirements**
   - Use Vuex for all HTTP requests and state management.
   - Implement role-based route guards:
     - Home page: accessible to all users (`regular`, `editor`, `admin`)
     - Editor page: accessible to `editor` and `admin` users
     - Admin page: accessible only to `admin` users
   - Display the username in the welcome message on each page.

> ⚠️ **All database schema changes must be implemented using TypeORM migration files.**

---

## Bonus Task

As a bonus, enhance the user interface:

- Redesign the navigation bar to make it more modern and user-friendly.
- You may use UI libraries such as **Vuetify** or others.
- Feel free to introduce additional UI enhancements that improve the user experience.

---

## Nave Shelly Submission

## Implementation Summary

- Database: Introduced a migration to replace `users.role` (TEXT) and `status` (INTEGER) with `users.roles` (JSON string) and `status` (TEXT: `Enabled` | `Disabled` | `Deleted`). The migration is reversible and works on fresh or previously migrated databases.
- Backend: Updated the `User` entity to use `simple-json` for roles and a string status. Added status validation so `Deleted` users receive HTTP 401. Existing login endpoint (`POST /users/login/:username`) returns the user; the root route is protected by an auth guard that reads the username from the `token` header (demo only).
- Frontend: All HTTP calls and state flow through Vuex. Role-based routing is enforced via router `meta.allowedRoles`. The username is displayed on Home, Editor, and Admin views. Vite dev server proxies `/api` to the backend.

## Suggested Improvements

- Authentication: Replace the demo `token` header approach with a real auth mechanism (e.g., JWT or session) and CSRF protection if needed.
- Validation: Add DTOs and class-validator pipes on the backend for stronger input validation (e.g., login payloads), even if the current flow is username-only.
- Persistence: Optionally persist minimal auth state on the client (e.g., localStorage) to survive reloads; rehydrate on app mount.
- Observability: Add structured logging and basic error handling middleware to improve debuggability.

