const mongoose = require('mongoose');

/**
 * @desc    Connect to MongoDB — serverless-safe, with connection reuse.
 *
 *  ⚠️  IMPORTANT for Vercel deployment:
 *      MongoDB Atlas must allow connections from any IP (0.0.0.0/0).
 *      Go to Atlas → Network Access → Add IP → Allow Access from Anywhere.
 *      Vercel uses dynamic IPs so a fixed allowlist will NOT work.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      'MONGODB_URI is not set. Add it in Vercel Dashboard → Project Settings → Environment Variables.'
    );
  }

  // Reuse existing open connection (important for serverless warm invocations)
  if (mongoose.connection.readyState === 1) {
    return; // Already connected
  }

  // If connecting, wait for it
  if (mongoose.connection.readyState === 2) {
    await new Promise((resolve) => mongoose.connection.once('connected', resolve));
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000, // 15s — Atlas cold starts can be slow
      connectTimeoutMS: 15000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10,
      // Required for stable serverless connections
      bufferCommands: false,
    });
    console.info(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Tip: Make sure 0.0.0.0/0 is in MongoDB Atlas → Network Access → IP Allowlist');
    throw error;
  }
};

module.exports = connectDB;
