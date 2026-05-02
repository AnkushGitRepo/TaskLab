/**
 * @file   api/index.js
 * @desc   Vercel serverless entry point for the Tasklab Express API.
 *
 *  ⚠️  Required Vercel Environment Variables (set in Vercel Dashboard):
 *      MONGODB_URI  — MongoDB Atlas connection string
 *      JWT_SECRET   — Random string, 32+ characters
 *      NODE_ENV     — "production"
 *      CLIENT_URL   — Your frontend Vercel URL (for CORS)
 */
const connectDB = require('../config/db');
const app = require('../app');

let isConnected = false;

module.exports = async (req, res) => {
  // Return a helpful error if env vars are missing
  if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
    return res.status(500).json({
      success: false,
      message: 'Server misconfigured: MONGODB_URI and JWT_SECRET must be set as Vercel Environment Variables.',
      hint: 'Go to Vercel Dashboard → your project → Settings → Environment Variables',
    });
  }

  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.error('DB connection failed:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Database connection failed.',
        error: err.message,
      });
    }
  }

  return app(req, res);
};
