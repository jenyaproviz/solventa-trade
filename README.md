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
NODE_ENV=development
PORT=4000
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace-with-a-long-random-secret-at-least-32-chars
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-a-strong-admin-password
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

## 6) Domain Deployment Notes

- Set `NODE_ENV=production` in backend so auth cookies are `Secure`.
- Set `CLIENT_URL` to your frontend domain. For multiple origins, use a comma-separated list.
Example: `CLIENT_URL=https://solventa.com,https://www.solventa.com`
- Set `VITE_API_URL` in frontend to your deployed backend URL.
- Frontend includes SPA rewrites for route refreshes:
Files: `frontend/vercel.json` and `frontend/public/_redirects`

## Notes

- There is a public sign-up flow for non-admin users.
- Authentication uses an HTTP-only session cookie and CSRF protection for mutating authenticated routes.
- If you change `ADMIN_EMAIL` or `ADMIN_PASSWORD`, restart the backend server.
