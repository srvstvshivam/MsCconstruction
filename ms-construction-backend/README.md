# MS Construction — Backend API

Spring Boot backend for the Mangal & Sons Building Contractor (MS Construction) website.
Every piece of site content — about text, services, projects, gallery, contact info, stats —
lives in the database and is served through a REST API, editable by the admin.

## Stack
- Java 17, Spring Boot 3.3.4
- Spring Web, Spring Data JPA, Spring Security
- H2 file-based database (local, for now — see `MONGODB_MIGRATION.md` to switch later)
- JWT for admin authentication (jjwt)

## Running it locally

```bash
mvn spring-boot:run
```

The API starts on `http://localhost:8080`. On first run it seeds:
- One admin user (`admin` / `changeMe123!` — **change this immediately**, see below)
- Your company info, all 6 services, all 5 completed projects, and 5 gallery placeholders,
  taken directly from your company profile PDF.

The H2 console (to browse the DB directly) is at `http://localhost:8080/h2-console`
— JDBC URL: `jdbc:h2:file:./data/msconstruction`, user `sa`, no password.

## Before you deploy anywhere public

1. **Change the JWT secret** in `application.properties` (`app.jwt.secret`) to a long random string.
2. **Change the admin password.** Easiest way: log in with the seed credentials once, then either
   add a "change password" endpoint (not included yet — ask me to add it) or update the
   `admin_user` row's `password_hash` directly via the H2 console using a BCrypt hash.
3. **Set `app.cors.allowed-origins`** to your actual deployed frontend URL (e.g. your Lovable
   domain or custom domain) instead of localhost.
4. Don't commit `application.properties` with real secrets to a public GitHub repo — use
   environment variables in production instead (Spring Boot reads `${APP_JWT_SECRET}` etc.
   automatically if you rename the properties to environment-variable style, or you can use
   `application-prod.properties` + a Spring profile).

## API Reference

### Public (no login required)
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/public/company-info` | About text, motto, contact info, homepage stats |
| GET | `/api/public/services` | List of services offered |
| GET | `/api/public/projects` | All projects. Add `?status=COMPLETED` or `?status=RUNNING` to filter |
| GET | `/api/public/gallery` | Gallery images |
| POST | `/api/public/contact-query` | Customer submits a query — body: `{name, email, phone, message}` |

### Admin auth
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/admin/auth/login` | Body: `{username, password}` → returns `{token, username}` |

Use the returned token on every admin request below as a header:
`Authorization: Bearer <token>`

### Admin (JWT required)
| Method | Endpoint | Purpose |
|---|---|---|
| PUT | `/api/admin/company-info` | Update about/contact/stats (send the full object) |
| POST | `/api/admin/services` | Add a service |
| PUT | `/api/admin/services/{id}` | Edit a service |
| DELETE | `/api/admin/services/{id}` | Remove a service |
| POST | `/api/admin/projects` | Add a project (completed or running) |
| PUT | `/api/admin/projects/{id}` | Edit a project |
| DELETE | `/api/admin/projects/{id}` | Remove a project |
| POST | `/api/admin/gallery` | Add a gallery image (send an image URL — see note below) |
| PUT | `/api/admin/gallery/{id}` | Edit a gallery image |
| DELETE | `/api/admin/gallery/{id}` | Remove a gallery image |
| GET | `/api/admin/queries` | View all customer queries, newest first |
| PUT | `/api/admin/queries/{id}/mark-read` | Mark a query as read |
| DELETE | `/api/admin/queries/{id}` | Delete a query |

## Note on gallery image uploads
This version stores gallery images as **URLs** (a string field), not raw file uploads — the
admin pastes a URL, or you point the URLs at images you host somewhere (e.g. a `/public/gallery`
folder in your frontend, Cloudinary, or S3). If you want the admin dashboard to support actual
drag-and-drop file uploads with the backend storing the files, that's a reasonable next step —
just ask and I'll add a file-upload endpoint.

## Wiring this to your Lovable/React frontend
On the frontend, replace hardcoded content with `fetch` calls to the endpoints above, e.g.:

```javascript
const res = await fetch("http://localhost:8080/api/public/company-info");
const companyInfo = await res.json();
// companyInfo.deliveredProjectValueCr, companyInfo.workersManagedAtPeak, etc.
```

For the admin dashboard, store the JWT (e.g. in React state or `sessionStorage` if outside
Claude artifacts — note Claude-generated artifacts can't use browser storage, but your Lovable
app isn't an artifact, so `localStorage`/`sessionStorage` is fine there) and attach it to every
admin request's `Authorization` header.

Remember to update `app.cors.allowed-origins` to match wherever the frontend is actually running.
