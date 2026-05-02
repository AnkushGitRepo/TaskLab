# Tasklab — Backend API

> **Express.js REST API** powering the Tasklab productivity suite. Built with Node.js, MongoDB Atlas, and JWT authentication. Vercel-serverless ready.
>
> 🌐 **Live App:** https://tasklab-client.vercel.app  
> ⚙️ **Live API:** https://tasklab-beta.vercel.app | Health check: https://tasklab-beta.vercel.app/api/health


---

## 📋 Overview

The Tasklab backend is a RESTful API that handles:
- **Authentication** — JWT-based register/login/refresh
- **Task Management** — Full CRUD with soft-delete, subtasks, comments, and auto-overdue detection
- **Projects** — Organize tasks into labeled, color-coded projects with member lists
- **Analytics** — Aggregation pipelines for productivity insights
- **Security** — Helmet headers, rate limiting, NoSQL injection prevention, input validation

---

## 🗂 Directory Structure

```
server/
├── api/
│   └── index.js             # Vercel serverless entry point (wraps Express app)
├── config/
│   ├── db.js                # Mongoose connection with retry logic
│   └── env.js               # Required env-var validation + exports
├── controllers/
│   ├── authController.js    # register, login, logout, getMe, updateMe
│   ├── taskController.js    # getTasks (auto-overdue), CRUD, stats, bulk
│   ├── projectController.js # Project CRUD
│   └── analyticsController.js # Overview + timeline aggregations
├── middleware/
│   ├── authMiddleware.js    # JWT `protect` guard — attaches req.user
│   ├── errorMiddleware.js   # asyncHandler wrapper + global error handler
│   ├── rateLimitMiddleware.js # express-rate-limit (100 req/15 min)
│   └── validateMiddleware.js  # express-validator result checker
├── models/
│   ├── Task.js              # Task schema (status, priority, dueDate, subtasks,
│   │                        #   comments, tags, soft-delete, statusLockedByUser)
│   ├── User.js              # User schema (bcrypt password, avatar)
│   └── Project.js           # Project schema (name, color, icon, members)
├── routes/
│   ├── authRoutes.js
│   ├── taskRoutes.js
│   ├── projectRoutes.js
│   └── analyticsRoutes.js
├── utils/
│   ├── ApiError.js          # Custom error class (message + statusCode)
│   ├── ApiResponse.js       # Standardized { success, data, message } wrapper
│   └── generateToken.js     # JWT sign helper
├── validators/
│   ├── authValidators.js    # express-validator rules for auth routes
│   └── taskValidators.js    # express-validator rules for task routes
├── app.js                   # Express app — middleware stack + route mounting
├── server.js                # Local dev entry — connectDB() then app.listen()
├── seed.js                  # Database seeder script
├── vercel.json              # Vercel deployment configuration
├── .env                     # Local environment variables (git-ignored)
└── .env.example             # Environment variable template (committed)
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: `5001`) |
| `NODE_ENV` | No | `development` or `production` |
| `MONGODB_URI` | ✅ Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ Yes | Random string, minimum 32 characters |
| `JWT_EXPIRE` | No | Token lifetime (default: `7d`) |
| `CLIENT_URL` | No | Frontend origin for CORS (default: `http://localhost:5173`) |

**MongoDB Atlas URI format:**
```
mongodb+srv://<username>:<password>@cluster.mongodb.net/tasklab?appName=Cluster0
```

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server with hot-reload (nodemon)
npm run dev

# Start production server
npm start
```

Server will run at `http://localhost:5001`.

---

## 🌱 Database Seeder

Populate the database with a test user and 18 realistic tasks:

```bash
node seed.js
```

**Test credentials created:**
```
Email:    testuser@tasklab.com
Password: Password1
```

**Seed data includes:**
- 3 projects: Design Sprint, Backend API, Marketing Q2
- 18 tasks with mixed statuses (`todo`, `in_progress`, `completed`, `overdue`) and priorities (`low`, `medium`, `high`)

---

## 📡 API Reference

All routes (except auth) require `Authorization: Bearer <token>` header.

### Authentication — `/api/auth`

#### `POST /api/auth/register`
Create a new user account.

**Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password1"
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "token": "<jwt>",
    "user": { "id": "...", "name": "Jane Doe", "email": "jane@example.com" }
  }
}
```

---

#### `POST /api/auth/login`
Authenticate and receive a JWT.

**Body:**
```json
{ "email": "jane@example.com", "password": "Password1" }
```

---

#### `GET /api/auth/me`
Returns the currently authenticated user's profile.

---

#### `PUT /api/auth/me`
Update name or avatar URL.

**Body:** `{ "name": "New Name" }` or `{ "avatar": "https://..." }`

---

### Tasks — `/api/tasks`

#### `GET /api/tasks`
Fetch tasks with optional filters. **Auto-marks overdue tasks** on every call (unless `statusLockedByUser = true`).

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `status` | string | `todo` \| `in_progress` \| `completed` \| `overdue` |
| `priority` | string | `low` \| `medium` \| `high` |
| `project` | ObjectId | Filter by project ID |
| `search` | string | Case-insensitive title search (regex) |
| `startDate` | ISO Date | Filter by `dueDate >= startDate` |
| `endDate` | ISO Date | Filter by `dueDate <= endDate` |
| `page` | number | Page number (default: `1`) |
| `limit` | number | Items per page (default: `50`) |

---

#### `POST /api/tasks`
Create a new task.

**Body:**
```json
{
  "title": "Design the landing page",
  "description": "Create wireframes and mockups",
  "status": "todo",
  "priority": "high",
  "dueDate": "2025-12-31T00:00:00.000Z",
  "project": "<projectId>",
  "tags": ["design", "ui"],
  "subtasks": [{ "title": "Wireframe", "completed": false }]
}
```

---

#### `GET /api/tasks/:id`
Get a single task by ID. Populates `project`, `assignees`, and `comments.user`.

---

#### `PUT /api/tasks/:id`
Update any task fields. **Sets `statusLockedByUser = true`** when `status` is provided (prevents auto-overdue reverting).

---

#### `DELETE /api/tasks/:id`
Soft-delete a task (sets `deletedAt` timestamp). Task is excluded from all queries but preserved in database.

---

#### `PATCH /api/tasks/:id/status`
Update only the task status. Also sets `statusLockedByUser = true`.

**Body:** `{ "status": "in_progress" }`

---

#### `PATCH /api/tasks/:id/order`
Update Kanban sort order and optionally status (drag-and-drop). Sets lock flag.

**Body:** `{ "order": 2, "status": "in_progress" }`

---

#### `GET /api/tasks/stats`
Returns task counts grouped by status and priority. Also runs auto-overdue.

**Response:**
```json
{
  "stats": {
    "byStatus": { "todo": 4, "in_progress": 3, "completed": 8, "overdue": 2 },
    "byPriority": { "low": 3, "medium": 7, "high": 4 },
    "total": 17,
    "overdue": 2
  }
}
```

---

#### `POST /api/tasks/bulk`
Bulk update multiple task statuses.

**Body:** `{ "taskIds": ["id1", "id2"], "status": "completed" }`

---

### Projects — `/api/projects`

#### `GET /api/projects`
List all projects for the authenticated user.

#### `POST /api/projects`
Create a project.

**Body:**
```json
{
  "name": "Design Sprint",
  "color": "#6B4EFF",
  "icon": "🎨",
  "members": ["alice@example.com", "bob@example.com"]
}
```

#### `PUT /api/projects/:id`
Update project name, color, icon, or members.

#### `DELETE /api/projects/:id`
Delete a project. All tasks belonging to that project have their `project` field cleared.

---

### Analytics — `/api/analytics`

#### `GET /api/analytics/overview`
Aggregated statistics for the Dashboard.

#### `GET /api/analytics/timeline`
Task completion counts over time (past 30 days), grouped by date.

---

## 🏗 Auto-Overdue Logic

Every call to `GET /api/tasks` and `GET /api/tasks/stats` runs:

```js
await Task.updateMany(
  {
    createdBy: req.user._id,
    dueDate: { $lt: new Date() },
    status: { $nin: ['completed', 'overdue'] },
    statusLockedByUser: { $ne: true },   // ← respects manual user overrides
    deletedAt: null,
  },
  { status: 'overdue' }
);
```

When a user **manually** moves a task to any status (via PATCH `/status`, PUT, or drag-and-drop order update), `statusLockedByUser` is set to `true`. This prevents the auto-overdue from reverting the user's choice on the next page load.

---

## 🔒 Security

| Measure | Implementation |
|---------|---------------|
| Authentication | JWT Bearer tokens (7-day expiry) |
| Password storage | bcryptjs (12 salt rounds) |
| Security headers | `helmet` |
| Rate limiting | 100 requests per 15 minutes per IP |
| NoSQL injection | `express-mongo-sanitize` |
| Input validation | `express-validator` rules on all POST/PUT routes |
| CORS | Allowlist — localhost + any `*.vercel.app` domain |

---

## ☁️ Vercel Deployment

The server is pre-configured for Vercel serverless deployment.

### Entry Point

`api/index.js` is the Vercel handler. It:
1. Lazily connects to MongoDB on first invocation (cached for subsequent calls)
2. Delegates all requests to the Express `app`

### `vercel.json`

```json
{
  "version": 2,
  "builds": [{ "src": "api/index.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "api/index.js" }]
}
```

### Required Vercel Environment Variables

Set these in **Vercel Dashboard → Project Settings → Environment Variables**:

```
MONGODB_URI    = mongodb+srv://...
JWT_SECRET     = <strong-random-string>
JWT_EXPIRE     = 7d
CLIENT_URL     = https://your-frontend.vercel.app
NODE_ENV       = production
```

---

## 📄 Response Format

All API responses follow this standardized envelope:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "data": { ... }
}
```

Errors:
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Task not found"
}
```
