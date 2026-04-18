# 🛡️ Cyber Portfolio — Full-Stack Cybersecurity Portfolio CMS

A modern, responsive cybersecurity portfolio website with a full admin panel CMS.  
Built with **React + Vite** (frontend) and **Node.js + Express + MongoDB** (backend).

![Dark neon theme with admin panel](.github/preview.png)

---

## ✨ Features

### Public Site
- **Home** — Hero section with typing animation, CTA buttons
- **About** — Bio, skills, tools, career goals (all CMS-managed)
- **Certifications** — Category tabs + certificate cards with verification links
- **Projects** — Category filter, search, tag filter, project cards
- **Labs / Writeups** — Difficulty badges, tool chips, full Markdown rendering
- **Progress Tracker** — Animated progress bars for skills/courses
- **Contact** — Form (stored in DB) + social links

### Admin Panel (`/admin`)
- JWT login / logout
- CRUD for: Site Settings, Categories, Projects, Certifications, Writeups, Progress Items
- Contact message inbox with read/unread status
- Markdown editor with live preview for writeups
- Image upload → Cloudinary (frontend → backend → Cloudinary)

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite, React Router v6 |
| Markdown | react-markdown + remark-gfm + rehype-highlight |
| Backend | Node.js + Express |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Images | Cloudinary |
| Security | helmet, cors, express-rate-limit, zod validation |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js ≥ 18
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free cluster
- A [Cloudinary](https://cloudinary.com/) free account

### 1. Clone & install

```bash
git clone https://github.com/HasnainShabbir16/HasnainShabbir16-cyber-portfolio.git
cd HasnainShabbir16-cyber-portfolio

# Install backend deps
cd backend && npm install

# Install frontend deps
cd ../frontend && npm install
```

### 2. Configure environment variables

**Backend** — copy and fill in:
```bash
cp backend/.env.example backend/.env
```

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/cyber-portfolio
JWT_SECRET=replace-with-a-long-random-string
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=changeme123
```

**Frontend** — copy and fill in:
```bash
cp frontend/.env.example frontend/.env
```

```env
VITE_API_URL=http://localhost:5000
```

### 3. Seed the database

```bash
cd backend
npm run seed
```

This creates:
- Admin user (from `ADMIN_EMAIL` / `ADMIN_PASSWORD`)
- Initial site settings
- Sample categories, project, certification, writeup, progress item

### 4. Start development servers

```bash
# Terminal 1 — backend (port 5000)
cd backend && npm run dev

# Terminal 2 — frontend (port 5173)
cd frontend && npm run dev
```

Open http://localhost:5173 for the public site.  
Open http://localhost:5173/admin to log in to the admin panel.

---

## 📁 Project Structure

```
├── backend/
│   ├── server.js              # Express app entry point
│   ├── .env.example
│   └── src/
│       ├── config/            # DB + Cloudinary config
│       ├── middleware/        # JWT auth, error handler
│       ├── models/            # Mongoose models (8)
│       ├── routes/            # auth, public, admin, upload
│       ├── controllers/       # Route handlers
│       └── scripts/
│           └── seed.js        # Admin + sample data seeder
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── .env.example
    └── src/
        ├── App.jsx            # Routing
        ├── index.css          # CSS vars + global styles
        ├── api/               # Axios instance + API functions
        ├── contexts/          # AuthContext (JWT)
        ├── hooks/             # useApi hook
        ├── components/        # Navbar, Footer, cards, etc.
        ├── pages/             # Public pages
        └── admin/             # Admin panel pages + components
```

### API Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/login` | — | Admin login → JWT |
| GET | `/api/public/settings` | — | Site settings |
| GET | `/api/public/projects` | — | Projects (filter/search) |
| GET | `/api/public/certifications` | — | Certifications |
| GET | `/api/public/writeups` | — | Writeups list |
| GET | `/api/public/writeups/:id` | — | Single writeup |
| GET | `/api/public/progress` | — | Progress items |
| POST | `/api/public/contact` | — | Submit contact form |
| GET/PUT | `/api/admin/settings` | JWT | Manage site settings |
| GET/POST/PUT/DELETE | `/api/admin/projects` | JWT | CRUD projects |
| GET/POST/PUT/DELETE | `/api/admin/certifications` | JWT | CRUD certifications |
| GET/POST/PUT/DELETE | `/api/admin/writeups` | JWT | CRUD writeups |
| GET/POST/PUT/DELETE | `/api/admin/categories` | JWT | CRUD categories |
| GET/POST/PUT/DELETE | `/api/admin/progress` | JWT | CRUD progress items |
| GET/PUT/DELETE | `/api/admin/messages` | JWT | Contact messages |
| POST | `/api/admin/upload` | JWT | Upload image → Cloudinary |
| DELETE | `/api/admin/upload/:publicId` | JWT | Delete from Cloudinary |

---

## 🌐 Deployment Guide

### Backend → Render (free tier)

1. Push your code to GitHub.
2. Go to [render.com](https://render.com/) → **New Web Service**.
3. Connect your repo, set **Root Directory** to `backend`.
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add all backend env vars under **Environment**.
7. Note the service URL (e.g. `https://cyber-portfolio-api.onrender.com`).

### Frontend → GitHub Pages

1. Set `VITE_API_URL` to your Render backend URL in `frontend/.env`.
2. Update `vite.config.js` — set `base` to your repo name if deploying as a project page:
   ```js
   base: '/HasnainShabbir16-cyber-portfolio/',
   ```
3. Build: `cd frontend && npm run build`
4. Deploy the `dist/` folder to GitHub Pages:
   - Option A: Use the [GitHub Pages action](https://github.com/actions/deploy-pages)
   - Option B: `gh-pages` package: `npx gh-pages -d dist`

### MongoDB Atlas
1. Create a free M0 cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a DB user and whitelist `0.0.0.0/0` (or Render's IP range).
3. Copy the connection string into `MONGODB_URI`.

### Cloudinary
1. Sign up at [cloudinary.com](https://cloudinary.com/) (free tier is sufficient).
2. Copy **Cloud Name**, **API Key**, **API Secret** from the dashboard.
3. Set the three `CLOUDINARY_*` env vars.

---

## 🔒 Security Notes

- Never commit `.env` files — they are in `.gitignore`
- Change `ADMIN_PASSWORD` to a strong password before deploying
- The auth rate limiter allows only **5 login attempts per 15 minutes**
- JWT tokens expire after `JWT_EXPIRES_IN` (default 7 days)
- All admin API routes require a valid JWT bearer token

---

## 📝 License

MIT © HasnainShabbir16
