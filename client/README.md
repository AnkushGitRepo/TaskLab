# Tasklab — Frontend Client

> **React + Vite + Tailwind CSS** single-page application for the Tasklab productivity suite. Features Kanban boards, advanced filters, real-time notifications, analytics, and a fully responsive mobile-first design.

---

## 📋 Overview

The Tasklab client is a production-grade React SPA that communicates with the Tasklab Express API. It provides:

- **Dashboard** — Stats, greeting, and recent tasks with live search
- **Tasks** — Board, Table, Calendar, and List views with advanced filters and delete confirmation
- **Projects** — Card grid with task counts, click-to-navigate, member management
- **Analytics** — Charts powered by Recharts (status distribution, priority breakdown, timeline)
- **Notifications** — Persistent bell-icon panel with event history (create, update, delete, complete, overdue)
- **Auth** — JWT login/register with quick "Test User" demo button

---

## 🗂 Directory Structure

```
client/
├── public/
│   └── favicon.ico
├── src/
│   ├── api/
│   │   ├── axiosInstance.js      # Base URL, JWT Authorization interceptor, auto-redirect on 401
│   │   ├── authApi.js            # login, register, logout, getMe, updateMe
│   │   ├── taskApi.js            # getTasks, createTask, updateTask, deleteTask, stats, etc.
│   │   ├── projectApi.js         # getProjects, createProject, updateProject, deleteProject
│   │   └── analyticsApi.js       # overview, timeline
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Avatar.jsx         # Initials or image avatar with size variants
│   │   │   ├── Badge.jsx          # Status / Priority colored badges
│   │   │   ├── Button.jsx         # Primary / Secondary / Danger with loading spinner
│   │   │   └── Modal.jsx          # Accessible overlay modal with backdrop
│   │   ├── calendar/
│   │   │   └── CalendarGrid.jsx   # Monthly calendar view of tasks by dueDate
│   │   ├── kanban/
│   │   │   ├── KanbanBoard.jsx    # @dnd-kit DndContext — 4-column board
│   │   │   ├── KanbanColumn.jsx   # Droppable column (Todo / Doing / Done / Overdue)
│   │   │   └── KanbanCard.jsx     # Draggable task card with drag overlay
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx        # Desktop sidebar + mobile slide-in drawer
│   │   │   ├── TopBar.jsx         # Page title, search (⌘K), notifications, New Task
│   │   │   └── PageWrapper.jsx    # App shell — wires Sidebar + TopBar + main content
│   │   ├── notifications/
│   │   │   └── NotificationPanel.jsx  # Bell + dropdown with event history
│   │   └── tasks/
│   │       ├── TaskCard.jsx        # Card with hover ⋯ menu (Edit / Delete)
│   │       └── TaskForm.jsx        # Create / Edit modal form
│   │
│   ├── hooks/
│   │   ├── useAuth.js             # Redirect-if-not-authenticated guard
│   │   ├── useTasks.js            # Fetch + CRUD operations, wraps taskStore
│   │   └── useProjects.js         # Fetch + CRUD operations, wraps projectStore
│   │
│   ├── pages/
│   │   ├── Landing.jsx            # Public marketing page
│   │   ├── Login.jsx              # Login form + quick test-user button
│   │   ├── Register.jsx           # Register form + quick test-user button
│   │   ├── Dashboard.jsx          # Home — stats, greeting, recent/searched tasks
│   │   ├── Tasks.jsx              # Multi-view task manager with advanced filters
│   │   ├── Projects.jsx           # Project card grid
│   │   ├── Analytics.jsx          # Charts and metrics
│   │   └── NotFound.jsx           # 404 page
│   │
│   ├── store/
│   │   ├── authStore.js           # Zustand — user, token, login, logout, updateProfile
│   │   ├── taskStore.js           # Zustand — tasks, stats, CRUD + notification emit
│   │   ├── projectStore.js        # Zustand — projects, CRUD
│   │   └── notificationStore.js   # Zustand — notification list, unread count, localStorage persist
│   │
│   ├── styles/
│   │   └── index.css              # Tailwind directives + custom design tokens and utilities
│   │
│   └── utils/
│       ├── dateHelpers.js         # formatDate, formatDateShort, isOverdue
│       ├── priorityHelpers.js     # COLOR_MAP, PRIORITY_LABELS, PROJECT_COLORS
│       └── validators.js          # validateEmail, validatePassword
│
├── .env                           # Dev — empty (Vite proxy handles /api)
├── .env.production                # Prod — VITE_API_BASE_URL
├── vercel.json                    # SPA routing rewrite for Vercel
├── vite.config.js                 # Proxy /api → localhost:5001 (dev only)
├── tailwind.config.js             # Custom color tokens + font
└── postcss.config.js
```

---

## ⚙️ Environment Variables

### Development (`.env`)

No env vars are needed for local development. The Vite dev server proxies all `/api` requests to `http://localhost:5001` via `vite.config.js`.

### Production (`.env.production`)

```bash
VITE_API_BASE_URL=https://your-tasklab-api.vercel.app
```

Set this as an **Environment Variable** in your Vercel project dashboard.

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server (port 5173)
npm run dev
```

The app expects the backend server to be running at `http://localhost:5001`.  
See [server/README.md](../server/README.md) for backend setup.

---

## 🏗 Build for Production

```bash
npm run build
```

Output is in `dist/`. Preview the production build locally:

```bash
npm run preview
```

---

## ☁️ Vercel Deployment

The client is pre-configured for Vercel deployment.

### `vercel.json`

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This ensures React Router handles all client-side routes (prevents 404 on page refresh).

### Steps

1. Import this repository on [Vercel](https://vercel.com)
2. Set **Root Directory** to `client`
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`
5. Add **Environment Variable:**

   | Variable | Value |
   |----------|-------|
   | `VITE_API_BASE_URL` | Your deployed API URL |

---

## 🎨 Design System

The design is implemented using **Tailwind CSS** with custom tokens defined in `tailwind.config.js` and utility classes in `src/styles/index.css`.

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-500` | `#6B4EFF` | Buttons, active nav, badges |
| `primary-100` | `#EDE9FF` | Hover backgrounds |
| `surface` | `#FCF8FF` | Page background |
| `surface-container-low` | `#F3EFF7` | Card backgrounds |
| `on-surface` | `#1B1B2F` | Primary text |
| `on-surface-variant` | `#6B6B8A` | Secondary text |
| `outline-variant` | `#D0C8E8` | Borders, dividers |
| `error` | `#B3261E` | Destructive actions |

### Typography

- **Font Family:** [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (loaded from Google Fonts)
- **Scale:** `text-xs` (12px) → `text-3xl` (30px)

### Utility Classes (custom)

```css
.btn-primary        /* Purple pill button */
.btn-secondary      /* Outlined pill button */
.btn-icon           /* Square icon-only button */
.card               /* White card with radius + shadow */
.card-hover         /* Card with hover lift animation */
.input              /* Styled text input */
.input-error        /* Error-state input */
.sidebar-link       /* Nav link with active state */
.sidebar-link-active/* Active nav link */
.animate-fade-in-up /* Fade + translate-up entrance */
.animate-slide-in-left /* Mobile drawer slide animation */
.no-scrollbar       /* Hide scrollbar cross-browser */
```

---

## 📦 Dependencies

### Core

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | 18.x | UI framework |
| `react-dom` | 18.x | DOM rendering |
| `react-router-dom` | 6.x | Client-side routing |
| `axios` | 1.x | HTTP client |
| `zustand` | 4.x | State management |

### UI & Interaction

| Package | Version | Purpose |
|---------|---------|---------|
| `@dnd-kit/core` | 6.x | Drag-and-drop core |
| `@dnd-kit/sortable` | 7.x | Sortable lists/Kanban |
| `recharts` | 2.x | Data visualization charts |
| `lucide-react` | 0.x | Icon set |
| `date-fns` | 3.x | Date formatting |

### Build

| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | 5.x | Build tool + dev server |
| `@vitejs/plugin-react` | 4.x | React Fast Refresh |
| `tailwindcss` | 3.x | Utility CSS |
| `autoprefixer` | 10.x | CSS vendor prefixes |

---

## 🧩 Key Architectural Decisions

### 1. Vite Proxy (Dev) vs `VITE_API_BASE_URL` (Prod)
In development, `vite.config.js` proxies `/api/*` to `localhost:5001` — this avoids CORS issues without touching `axiosInstance.js`. In production, `VITE_API_BASE_URL` is prepended to all API requests via the Axios base URL.

### 2. Zustand Stores
Global state is split into 4 lean stores:
- `authStore` — user session (persisted in `localStorage`)
- `taskStore` — task list + stats + CRUD
- `projectStore` — project list + CRUD
- `notificationStore` — notification queue (persisted in `localStorage`, max 50 items)

### 3. Auto-Overdue on Client
When the server returns tasks, any task already in `overdue` status from the server's auto-update is shown correctly. The client does not independently compute overdue — it trusts the server's authoritative state.

### 4. statusLockedByUser Flag
When a user manually moves a task out of overdue (e.g., to `in_progress`), the server sets `statusLockedByUser: true`. Subsequent auto-overdue server scans skip these tasks, so the user's choice persists across page refreshes.

### 5. Notification Persistence
Notifications are stored in `localStorage` (key: `tasklab_notifications`, max 50 entries). They are loaded synchronously at store initialization so the unread count is available before the first API call completes.

---

## 🔐 Authentication Flow

```
User submits login form
  → POST /api/auth/login
  → Server returns { token, user }
  → authStore saves to localStorage (tasklab_token, tasklab_user)
  → axiosInstance interceptor attaches Bearer token to all subsequent requests
  → On 401 response: interceptor clears storage + redirects to /login
```

---

## 📱 Responsive Design

| Breakpoint | Layout |
|-----------|--------|
| `< 1024px` (mobile/tablet) | Sidebar hidden, hamburger menu → slide-in drawer |
| `≥ 1024px` (desktop) | Fixed sidebar, full layout |

Additional responsive patterns:
- Kanban: horizontal scroll on mobile
- Table: progressive column hiding (`sm:table-cell`, `md:table-cell`)
- Stats: 2-column grid on mobile → 4-column on desktop
- Search: collapsed icon on mobile → expands on tap
