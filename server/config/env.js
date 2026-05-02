require('dotenv').config();

const REQUIRED_VARS = ['MONGODB_URI', 'JWT_SECRET'];

const missingVars = REQUIRED_VARS.filter((key) => !process.env[key]);
if (missingVars.length > 0) {
  // In serverless environments process.exit() crashes the function permanently.
  // Log the error clearly and let requests fail with a 500 instead.
  console.error(
    `[Tasklab] FATAL — Missing required environment variables: ${missingVars.join(', ')}. ` +
    'Please set them in Vercel Dashboard → Project Settings → Environment Variables.'
  );
}

module.exports = {
  PORT: process.env.PORT || 5001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};
