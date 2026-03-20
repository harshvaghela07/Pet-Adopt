import dotenv from 'dotenv';
import connectDB from './config/database.js';
import app from './app.js';

dotenv.config();

const start = async () => {
  await connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start().catch((e) => { console.error(e); process.exit(1); });
