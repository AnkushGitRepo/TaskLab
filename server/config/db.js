const mongoose = require('mongoose');

/**
 * @desc    Connect to MongoDB — serverless-safe (no process.exit)
 *          Throws on failure so the caller can return a 500 response.
 */
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error(
        'MONGODB_URI is not set. Add it in Vercel Dashboard → Project Settings → Environment Variables.'
      );
    }

    // Reuse existing connection if already open (important for serverless warm calls)
    if (mongoose.connection.readyState === 1) {
      return;
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error; // Let the caller handle it gracefully instead of process.exit
  }
};

module.exports = connectDB;
