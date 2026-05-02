/**
 * @file   api/index.js
 * @desc   Vercel serverless entry point for the Tasklab Express API.
 *         Vercel expects a single exported handler function — this file
 *         wraps the existing Express app and lazily connects to MongoDB.
 */
const connectDB = require('../config/db');
const app = require('../app');

let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  return app(req, res);
};
