const { PORT } = require('./config/env');
const connectDB = require('./config/db');
const app = require('./app');

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.info(`🚀 Tasklab server running on port ${PORT} [${process.env.NODE_ENV}]`);
  });
};

start();
