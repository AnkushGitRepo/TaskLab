const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const mongoose = require('mongoose');
const { CLIENT_URL, NODE_ENV } = require('./config/env');
const { errorHandler } = require('./middleware/errorMiddleware');

// Disable Mongoose command buffering globally — fail fast instead of 10s timeout
mongoose.set('bufferCommands', false);

// Route imports
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const projectRoutes = require('./routes/projectRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

// Security headers
app.use(helmet());

// CORS — allow localhost (dev) and Vercel deployments (prod)
const ALLOWED_ORIGINS = [
  CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'https://tasklab-beta.vercel.app',   // Live backend (for Vercel preview requests)
  /\.vercel\.app$/,                     // Any Vercel subdomain (frontend previews)
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow non-browser requests (Postman, etc.)
    const allowed = ALLOWED_ORIGINS.some(o =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );
    if (allowed) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// NoSQL injection prevention
app.use(mongoSanitize());

// Logging (dev only)
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Root — API info (shown when visiting the bare backend URL)
app.get('/', (req, res) => {
  res.json({
    success: true,
    name: 'Tasklab API',
    version: '1.0.0',
    status: 'operational',
    docs: 'https://github.com/AnkushGitRepo/TaskLab#-api-reference',
    endpoints: {
      health:   '/api/health',
      auth:     '/api/auth',
      tasks:    '/api/tasks',
      projects: '/api/projects',
      analytics:'/api/analytics',
    },
  });
});

// Health check
app.get('/api/health', (req, res) => res.json({ success: true, message: 'Tasklab API is running' }));


// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
