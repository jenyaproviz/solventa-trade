import { app } from './app.js';
import { env } from './config/env.js';
import { initializeMongo } from './data/mongo.js';

async function startServer() {
  try {
    await initializeMongo();
    app.listen(env.port, () => {
      console.log(`Solventa API listening on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('[server] Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

void startServer();