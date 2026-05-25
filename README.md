# Solventa

Full-stack Solventa project with:
- `backend` (Express + TypeScript)
- `frontend` (React + Vite + TypeScript)

## Prerequisites

- Node.js 20+
- npm 10+

## 1) Install Dependencies

From the project root, install each app's dependencies:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## 2) Configure Environment Variables

### Backend

Create `backend/.env` (or copy from `backend/.env.example`):

```env
PORT=4000
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace-with-a-long-random-secret
ADMIN_EMAIL=solventatrade@gmail.com
ADMIN_PASSWORD=Solventa2026
```

### Frontend

Create `frontend/.env` (or copy from `frontend/.env.example`):

```env
VITE_API_URL=http://localhost:4000
VITE_FORMSPREE_SUBSCRIBE_ENDPOINT=https://formspree.io/f/xvzljzpp
```

## 3) Run the Project (Development)

Use two terminals.

### Terminal A: Start backend

```bash
cd backend
npm run dev
```

Backend runs on: `http://localhost:4000`

### Terminal B: Start frontend

```bash
cd frontend
npm run dev
```

Frontend runs on: `http://localhost:5173`

## 4) Admin Login Details

Use your configured backend credentials from `backend/.env` on `/admin/login`.

## 5) Build for Production

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

## Notes

- There is currently no public sign-up flow.
- Authentication is admin login based on backend environment variables.
- If you change `ADMIN_EMAIL` or `ADMIN_PASSWORD`, restart the backend server.
