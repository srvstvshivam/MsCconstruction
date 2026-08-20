# Deploying MS Construction — Handoff Guide

## ⚠️ Do this first: rotate your credentials

Real, working credentials were sitting in plaintext in this project (in `application.properties`
and `.env.example`, both of which are normal committed files, not gitignored):
your MongoDB Atlas username/password, your Gmail app password, and your Cloudinary API secret.

They've now been removed from the code, **but removing them doesn't undo the fact they were
exposed** in every copy of this project that's been shared so far. Before you hand this to a
client or deploy it publicly:

1. **MongoDB Atlas** → Database Access → edit the user → reset the password.
2. **Gmail** → myaccount.google.com/apppasswords → revoke the old app password, generate a new one.
3. **Cloudinary** → Settings → Security → regenerate your API secret.

Then use the new values in the steps below. This is the single most important thing to fix
before this goes anywhere near a real client.

---

## How the pieces fit together

- **Frontend** (`ms-construction-frontend/`): React + Vite. Builds to static files — host it
  anywhere that serves static sites (Vercel, Netlify, Cloudflare Pages).
- **Backend** (`ms-construction-backend/`): Spring Boot. Needs a real server, not static
  hosting — Render, Railway, or a VPS all work.
- **Database**: MongoDB Atlas (you're already using it).
- **Image storage**: Cloudinary (you're already using it).

## 1. Backend

Set these as environment variables on whatever platform you deploy to (Render/Railway both have
an "Environment Variables" section in their dashboard — don't put real values in any committed file):

```
MONGODB_URI=<your new Atlas connection string>
JWT_SECRET=<a long random string — generate with: openssl rand -base64 48>
CORS_ALLOWED_ORIGINS=https://your-actual-frontend-domain.com
ADMIN_SEED_USERNAME=admin
ADMIN_SEED_PASSWORD=<a real password, not the placeholder>
MAIL_USERNAME=<your gmail address>
MAIL_PASSWORD=<your new gmail app password>
ADMIN_NOTIFICATION_EMAIL=<where enquiry emails should go>
CLOUDINARY_CLOUD_NAME=<yours>
CLOUDINARY_API_KEY=<yours>
CLOUDINARY_API_SECRET=<your new secret>
```

Build and run:
```
cd ms-construction-backend
./gradlew build
java -jar build/libs/*.jar
```
On Render/Railway, point the build command at `./gradlew build` and the start command at
`java -jar build/libs/*.jar` (exact jar name depends on your `build.gradle` — check `build/libs/`
after building once).

The app will refuse to start if `MONGODB_URI`, `JWT_SECRET`, `ADMIN_SEED_PASSWORD`,
`MAIL_USERNAME`/`MAIL_PASSWORD`, or the Cloudinary variables are missing — that's intentional,
so a misconfigured deploy fails loudly instead of silently running with no database.

## 2. Frontend

Set one environment variable at build time:
```
VITE_API_BASE_URL=https://your-backend-domain.com
```
Then:
```
cd ms-construction-frontend
npm install
npm run build
```
This produces a static `dist/` folder — deploy that to Vercel/Netlify/Cloudflare Pages. On
Vercel/Netlify, set `VITE_API_BASE_URL` in their dashboard's environment variables and set the
build command to `npm run build` with output directory `dist`.

**Order matters:** deploy the backend first, get its real URL, then build the frontend with
that URL — the API base URL is baked into the static files at build time, not read at runtime.

## 3. First login

Once both are live, go to `https://your-frontend-domain.com/admin/login` and log in with the
`ADMIN_SEED_USERNAME` / `ADMIN_SEED_PASSWORD` you set. From there, use "Edit My Website" to
replace the seeded placeholder content (about text, projects, gallery photos, team members) with
the client's real content.

## What I could not verify

I don't have a Java/Gradle toolchain or a live browser in this environment, so every backend
change across this whole project has been reviewed by reading the code carefully, not by
actually compiling or running it. Before you hand this off:

- Run `./gradlew build` locally and fix anything that doesn't compile.
- Run through the admin flow yourself once end-to-end: log in → edit each section → Save Draft →
  Publish → check the public site → refresh → confirm it stuck.
- Test the contact form actually sends you an email with the new Gmail app password.
- Test image upload with a real multi-MB phone photo, not a tiny test image.
