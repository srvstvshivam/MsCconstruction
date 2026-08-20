# MS Construction — Full Website (Frontend + Backend)

This is the complete replica of your MS Construction website, rebuilt so that all content is
served from a real backend instead of being hardcoded — with an admin login to edit everything.

```
ms-construction-site/
├── ms-construction-backend/    ← Spring Boot (Java) — API + database
└── ms-construction-frontend/   ← React (Vite) — the actual website
```

## How it fits together

The **frontend** is the website people see. When it loads, it calls the **backend** API to fetch
your about text, services, projects, gallery, and contact info — nothing is hardcoded. The admin
dashboard (reachable via the "Admin Login" link in the footer) also talks to the backend to save
any edits, which are stored in the database and show up on the site immediately.

## Running it — step by step

### 1. Start the backend first
```bash
cd ms-construction-backend
mvn spring-boot:run
```
Wait until you see it running on port 8080. It auto-creates a local database file and seeds it
with your real company content and an admin login (`admin` / `changeMe123!`).

**I could not compile-test the backend in my own sandbox** (no access to Maven Central there),
so if `mvn spring-boot:run` throws an error on your machine, send me the exact error message and
I'll fix it immediately.

### 2. Start the frontend
In a **new terminal window** (leave the backend running):
```bash
cd ms-construction-frontend
npm install
cp .env.example .env
npm run dev
```
This opens the website at `http://localhost:5173`. **I did verify this builds successfully** —
`npm install` and `npm run build` both ran clean with zero errors in my sandbox.

### 3. Try it out
- Visit `http://localhost:5173` — you should see the full site with real content loaded from the backend.
- Scroll to the footer and click **Admin Login**.
- Log in with `admin` / `changeMe123!`.
- Edit anything (about text, add a project, add a service, check customer queries) and go back
  to the homepage — your changes are live immediately.
- Submit the contact form as a visitor, then check the "Customer Queries" tab in the admin
  dashboard — your message should appear there.

## What's real vs. what needs your input later
- ✅ All content (about, services, 5 completed projects, contact info, stats) is real, taken from
  your PDF, and stored in the database — not hardcoded in the frontend.
- ✅ Admin can add/edit/delete services, projects (including marking a project "Running" vs
  "Completed" — so you can now list ongoing work too, which your original site couldn't do),
  and gallery entries.
- ✅ Customer query form saves to the database and shows up in the admin inbox.
- ⏳ Gallery images are added by pasting a URL — actual drag-and-drop file upload isn't built yet
  (see backend README for what that would take).
- ⏳ Database is local (H2 file) for now — see `ms-construction-backend/MONGODB_MIGRATION.md`
  for exactly what changes when you're ready to point it at MongoDB.
- ⏳ Before putting this live publicly: change the JWT secret and admin password (see backend
  README), and set `VITE_API_BASE_URL` in the frontend `.env` to your deployed backend's real URL.

## If something breaks
Tell me the exact error message and which step it happened on (backend won't start, frontend
won't start, a specific button doesn't work, etc.) — I'll fix it directly rather than you having
to debug it yourself.
