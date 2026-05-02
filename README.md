# Tasklab

![Tasklab — Organize everything in your life](./TaskLap.png)

> **Organize everything in your life.** A premium full-stack productivity suite with Kanban boards, advanced filters, real-time notifications, analytics, and beautiful dark-mode-ready design.

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)](https://mongodb.com)
[![Frontend](https://img.shields.io/badge/Frontend-Live-brightgreen)](https://tasklab-client.vercel.app)
[![API](https://img.shields.io/badge/API-Live-black)](https://tasklab-beta.vercel.app/api/health)

> 🌐 **Live App:** https://tasklab-client.vercel.app  
> ⚙️ **Live API:** https://tasklab-beta.vercel.app

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 🗂 **Multiple Views** | Kanban board, Table, List, and Calendar views |
| 🔔 **Notifications** | Real-time in-app notifications for create, update, delete, complete, and overdue events |
| 🔍 **Advanced Filters** | Filter by status, priority, project, date range; global search with `⌘K` |
| ⏰ **Auto-Overdue** | Tasks past their due date automatically move to Overdue (user-locked statuses respected) |
| 📁 **Projects** | Organize tasks into color-coded projects with emoji icons and member management |
| 📊 **Analytics** | Charts for task completion rates, priority distribution, and productivity trends |
| 🔐 **JWT Auth** | Secure authentication with persistent sessions via localStorage |
| 📱 **Fully Responsive** | Mobile-first design with slide-in drawer sidebar and touch-optimized UI |
| 🌐 **Vercel Ready** | Both client and server are pre-configured for Vercel deployment |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework with hooks |
| **Vite** | Lightning-fast build tool and dev server |
| **Tailwind CSS** | Utility-first styling with custom design tokens |
| **Zustand** | Lightweight global state management |
| **@dnd-kit** | Accessible drag-and-drop for Kanban |
| **Recharts** | Responsive chart library for Analytics |
| **date-fns** | Date formatting and manipulation |
| **Lucide React** | Consistent icon set |
| **React Router v6** | Client-side routing |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js 18+** | JavaScript runtime |
| **Express.js** | REST API framework |
| **MongoDB Atlas** | Cloud NoSQL database |
| **Mongoose** | ODM with schema validation |
| **JSON Web Tokens** | Stateless authentication |
| **bcryptjs** | Password hashing |
| **Helmet** | Security headers |
| **express-rate-limit** | API rate limiting |
| **express-validator** | Request body validation |
| **compression** | Response gzip compression |

---

## 📁 Project Structure

```
TaskManager/
├── client/                          # Vite + React SPA
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── api/                     # Axios instance + API call wrappers
│   │   │   ├── axiosInstance.js     # Base URL, JWT interceptor
│   │   │   ├── taskApi.js
│   │   │   ├── projectApi.js
│   │   │   ├── authApi.js
│   │   │   └── analyticsApi.js
│   │   ├── components/
│   │   │   ├── common/              # Avatar, Badge, Button, Modal, etc.
│   │   │   ├── kanban/              # KanbanBoard, KanbanColumn, TaskCard DnD
│   │   │   ├── layout/              # Sidebar, TopBar, PageWrapper
│   │   │   ├── notifications/       # NotificationPanel with badge
│   │   │   └── tasks/               # TaskCard, TaskForm, filters
│   │   ├── hooks/                   # useAuth, useTasks, useProjects
│   │   ├── pages/                   # Dashboard, Tasks, Projects, Analytics, Login, Register
│   │   ├── store/                   # Zustand stores (auth, task, project, notification)
│   │   ├── styles/
│   │   │   └── index.css            # Design tokens + Tailwind directives
│   │   └── utils/                   # dateHelpers, priorityHelpers, validators
│   ├── .env                         # Dev env (Vite proxy to localhost:5001)
│   ├── .env.production              # Prod env (VITE_API_BASE_URL)
│   ├── vercel.json                  # SPA routing for Vercel
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                          # Express REST API
│   ├── api/
│   │   └── index.js                 # Vercel serverless entry point
│   ├── config/
│   │   ├── db.js                    # Mongoose connection
│   │   └── env.js                   # Environment variable validation
│   ├── controllers/                 # Route handler logic
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT protect
│   │   ├── errorMiddleware.js       # Global error handler
│   │   ├── rateLimitMiddleware.js   # express-rate-limit
│   │   └── validateMiddleware.js    # express-validator runner
│   ├── models/
│   │   ├── Task.js                  # Task schema (soft-delete, subtasks, comments)
│   │   ├── User.js                  # User schema (bcrypt)
│   │   └── Project.js               # Project schema
│   ├── routes/                      # Express routers
│   ├── utils/                       # ApiError, ApiResponse, generateToken
│   ├── validators/                  # express-validator rule sets
│   ├── seed.js                      # Database seeder (test user + 18 sample tasks)
│   ├── app.js                       # Express app (middleware + routes)
│   ├── server.js                    # Local dev entry (connectDB + listen)
│   ├── vercel.json                  # Vercel serverless config
│   └── .env.example                 # Environment variable template
│
├── TaskLap.png                      # App screenshot / hero image
└── README.md                        # This file
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites

- Node.js **18+**
- MongoDB (local) **or** a [MongoDB Atlas](https://mongodb.com/cloud/atlas) account
- Git

### 1 — Clone the repository

```bash
git clone https://github.com/AnkushGitRepo/TaskLab.git
cd TaskLab
```

### 2 — Install dependencies

```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 3 — Configure environment variables

```bash
# Server
cp server/.env.example server/.env
# Open server/.env and set your MONGODB_URI and JWT_SECRET
```

```bash
# Client — dev uses Vite proxy (no changes needed for local dev)
# For production, edit client/.env.production and set VITE_API_BASE_URL
```

### 4 — Seed the database (optional but recommended)

```bash
cd server && node seed.js
```

This creates a test account with **18 sample tasks** across 3 projects:

| Credential | Value |
|-----------|-------|
| **Email** | `testuser@tasklab.com` |
| **Password** | `Password1` |

### 5 — Run the application

```bash
# Terminal 1 — API server (port 5001)
cd server && npm run dev

# Terminal 2 — React client (port 5173)
cd client && npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🌐 Deployment on Vercel

Tasklab is structured for deployment as **two separate Vercel projects** — one for the backend API and one for the React frontend.

## 🌐 Deployment

### Live Backend API

| | URL |
|--|-----|
| **API Base** | https://tasklab-beta.vercel.app |
| **Health Check** | https://tasklab-beta.vercel.app/api/health |
| **Auth** | https://tasklab-beta.vercel.app/api/auth/login |

### Deploy the Frontend Client

1. Import this repo as a new Vercel project
2. Set **Root Directory** to `client`
3. **Build Command:** `npm run build` · **Output Directory:** `dist`
4. The `client/.env.production` already points to `https://tasklab-beta.vercel.app/api` — no extra env vars needed
5. `client/vercel.json` handles SPA routing automatically

> **Tip:** After the frontend is live, update `CLIENT_URL` in the backend's Vercel Environment Variables to the frontend URL so CORS is locked down.

---

## 🌐 API Reference

Full API docs are in [`server/README.md`](./server/README.md).

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create new account |
| `POST` | `/api/auth/login` | Login → returns JWT |
| `GET` | `/api/auth/me` | Get current user profile |
| `PUT` | `/api/auth/me` | Update name / avatar |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | List tasks (filters: `status`, `priority`, `project`, `search`, `startDate`, `endDate`) |
| `POST` | `/api/tasks` | Create task |
| `GET` | `/api/tasks/:id` | Get single task |
| `PUT` | `/api/tasks/:id` | Update task |
| `DELETE` | `/api/tasks/:id` | Soft-delete task |
| `PATCH` | `/api/tasks/:id/status` | Update status only |
| `PATCH` | `/api/tasks/:id/order` | Update Kanban order |
| `GET` | `/api/tasks/stats` | Task counts by status/priority |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/projects` | List all projects |
| `POST` | `/api/projects` | Create project |
| `PUT` | `/api/projects/:id` | Update project |
| `DELETE` | `/api/projects/:id` | Delete project (cascades tasks) |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/analytics/overview` | Aggregate stats dashboard |
| `GET` | `/api/analytics/timeline` | Task completion over time |

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| **Primary** | `#6B4EFF` | Buttons, active states, badges |
| **Surface** | `#FCF8FF` | Page backgrounds |
| **On-Surface** | `#1B1B2F` | Body text |
| **Error** | `#B3261E` | Destructive actions |
| **Font** | Plus Jakarta Sans | All typography |
| **Border Radius** | `16px` (card), `999px` (pill) | Cards and buttons |
| **Shadow** | `0 2px 8px rgba(0,0,0,0.08)` | Card ambient shadow |

---

## 🧪 Test Credentials

```
Email:    testuser@tasklab.com
Password: Password1
```

The seed creates **18 tasks** spanning:
- 3 Projects (Design Sprint, Backend API, Marketing Q2)
- All statuses: `todo`, `in_progress`, `completed`, `overdue`
- All priorities: `low`, `medium`, `high`

---

## 📄 License

MIT © [Ankush](https://github.com/AnkushGitRepo)
