# Placement Sprint

A personal placement operating system that takes a final-year student from **June 1 → placement-ready in 60 days**, targeting **5–12 LPA** software roles.

Fully functional monorepo with persistent MongoDB storage, JWT auth, 60-day roadmap, calendar, DSA tracker, study sessions, notes, applications kanban, and placement readiness scoring.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React, Vite, Tailwind CSS, Framer Motion, React Router, React Query, Recharts, Axios |
| Backend | Node.js, Express |
| Database | MongoDB Atlas |
| Auth | JWT + refresh tokens |

## Project structure

```
placement-sprint/
├── frontend/          # React SPA (Vercel)
├── backend/           # Express API (Render)
├── docker-compose.yml
├── render.yaml
└── README.md
```

## Quick start (local)

### Prerequisites

- Node.js 20+
- MongoDB (Atlas URI or local via Docker)

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Environment

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit `backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/placement-sprint
JWT_ACCESS_SECRET=your-access-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
CLIENT_URL=http://localhost:5173
SPRINT_START_DATE=2025-06-01
```

### 3. Seed database (timeline, resources, DSA problems)

```bash
npm run seed
```

### 4. Run dev servers

```bash
npm run dev
```

- Frontend: http://localhost:5173  
- API: http://localhost:5000/api/health  

### Docker (Mongo + API)

```bash
docker compose up -d mongo
# Set MONGODB_URI=mongodb://localhost:27017/placement-sprint in backend/.env
cd backend && npm run seed && npm run dev
```

## Features

- **Auth** — Register, login, profile (name, goal, target package, streak)
- **Dashboard** — Day countdown, streak, hours, questions, readiness, quick actions
- **Calendar** — Month/week/heatmap, color-coded days, edit hours/topics/notes
- **Timeline** — 60-day auto-unlock roadmap (Java → DSA → Core → Placement)
- **Resources** — Real YouTube/LeetCode/GFG links per topic with completion tracking
- **DSA Tracker** — 40+ real problems with solve/attempt tracking
- **Study Session** — Timer with pause/resume, XP, streak on 5h days
- **Notes** — Markdown editor, folders, autosave, search
- **Applications** — Kanban pipeline tracker
- **Readiness** — Weighted score (Java 30%, DSA 40%, Core 20%, Consistency 10%)

## Deployment

### MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Add database user + network access (0.0.0.0/0 for cloud deploy)
3. Copy connection string → `MONGODB_URI`
4. Run seed once against production URI: `cd backend && npm run seed`

### Backend — Render

1. Connect repo, use `render.yaml` or set root `backend`
2. Build: `npm install` · Start: `npm start`
3. Env vars on Render:
   - `MONGODB_URI` — Atlas connection string
   - `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — 32+ char secrets
   - `CLIENT_URL` — **`https://placementsprint.vercel.app`** (no trailing slash; comma-separate multiple origins if needed)
   - `NODE_ENV` — `production`

### Frontend — Vercel

1. Import repo, set root directory `frontend`
2. Env on Vercel: `VITE_API_URL=https://placement-sprint.onrender.com/api` (must include `/api`, no trailing slash after)
3. Deploy

## API overview

| Route | Description |
|-------|-------------|
| `POST /api/auth/register` | Create account |
| `POST /api/auth/login` | Login |
| `POST /api/auth/refresh` | Refresh access token |
| `GET /api/dashboard` | Dashboard stats |
| `GET/PUT /api/calendar` | Calendar days |
| `GET /api/timeline` | 60-day roadmap |
| `GET /api/resources` | Learning resources |
| `GET/PATCH /api/dsa` | DSA problems |
| `POST /api/sessions/start` | Study timer |
| `CRUD /api/notes` | Notes |
| `CRUD /api/applications` | Job tracker |
| `GET /api/readiness` | Readiness score |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install root + backend + frontend |
| `npm run dev` | Run API + frontend concurrently |
| `npm run seed` | Seed MongoDB with roadmap & problems |
| `npm run build` | Build frontend for production |

## License

MIT
