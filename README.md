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

## Deploy Frontend for Free (Cheapest Option)

If you only need to show the website publicly, deploy the `frontend` app on a free static host.

### Recommended: Cloudflare Pages (Free)

1. Push this repository to GitHub.
2. Go to Cloudflare Pages → **Create project** → **Connect to Git**.
3. Select this repository and configure:
   - **Framework preset:** `Vite`
   - **Root directory:** `frontend`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Add environment variable (optional, if backend is deployed):
   - `VITE_API_URL=https://your-backend-url`
5. Deploy. You will get a free subdomain like:
   - `your-project.pages.dev`
6. Enable automatic deploys on every push (enabled by default when connected to Git).

### Other Free Hosts

- **Netlify:** `your-project.netlify.app`
- **Vercel:** `your-project.vercel.app`
- **GitHub Pages:** `username.github.io`

### Custom Domain (Optional)

- You can attach a custom domain such as `solventa.com` later.
- Hosting can stay free; only the domain registration is usually paid yearly.
