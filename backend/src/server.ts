import 'dotenv/config';

import connectDB from './config/db.js';
import app from './app.js';

// ─── Bootstrap ───────────────────────────────────────────────────────────────

const PORT = Number(process.env.PORT) || 5000;

const start = async (): Promise<void> => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(
      `🚀  Server running on http://localhost:${PORT} [${process.env.NODE_ENV ?? 'development'}]`,
    );
  });
};

start();
