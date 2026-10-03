# Portfolio — Backend API

REST API for the portfolio site ([portfolio-f](https://github.com/AbhiJeet9065/poftfolio-f)).
NestJS 12, Prisma 7, Postgres (Neon), JWT admin auth.

## Features
- Public read endpoints: profile, stats, experience, skills, projects, settings; contact form (`POST /messages`)
- Admin-only writes (JWT): everything above plus messages inbox and uploads
- Media "bucket" stored in Postgres (`Media` table) — images and PDFs up to 5 MB, served at `GET /api/media/:id`
- Visitor counter (`/api/visits`), health check (`/api/health`)
- Login lockout after 5 failed attempts (15 min); change login via `POST /api/auth/change-credentials`

## Run locally
```bash
npm install
cp .env.example .env          # fill in DATABASE_URL, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npx prisma generate
npx prisma migrate dev        # apply migrations
npm run prisma:seed           # seed content + first admin (from ADMIN_EMAIL / ADMIN_PASSWORD)
npm run prisma:upload-assets  # upload hero/about photos + résumé into the DB bucket
npm run start:dev             # http://localhost:3001/api
```

## Admin login
Sign in on the frontend at `/admin/login`. Change the email/password any time from **Admin → Account**.
Forgot it? `ADMIN_EMAIL=you@x.com ADMIN_PASSWORD='long-new-password' npm run admin:set`

## Environment variables
| Name | Purpose |
|---|---|
| `DATABASE_URL` | Neon/Postgres connection string |
| `JWT_SECRET` | 16+ chars; **required** in production |
| `FRONTEND_ORIGIN` | Allowed CORS origin(s), comma-separated |
| `PUBLIC_API_URL` | This API's public URL incl. `/api` — used for uploaded-file links |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Only for seeding / `admin:set` |

## Deploy (Render)
`render.yaml` is a Blueprint: *New → Blueprint →* pick this repo, fill in the prompted env vars
(`DATABASE_URL`, `FRONTEND_ORIGIN`, `PUBLIC_API_URL`). Each deploy runs `prisma migrate deploy`.
Point an uptime monitor (e.g. UptimeRobot, 5-minute interval) at `https://<service>.onrender.com/api/health`
to stop the free instance sleeping.

After moving the API to a new URL, re-point stored file links:
`FROM=http://localhost:3001/api TO=https://<service>.onrender.com/api npm run prisma:rewrite-urls`
