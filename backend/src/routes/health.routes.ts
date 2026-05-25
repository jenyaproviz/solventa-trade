import { Router } from 'express';
import { checkMongoConnection } from '../data/mongo.js';

export const healthRouter = Router();

healthRouter.get('/', async (_req, res) => {
  const mongo = await checkMongoConnection();
  const status = mongo.connected ? 'ok' : 'degraded';

  res.json({
    status,
    service: 'solventa-api',
    timestamp: new Date().toISOString(),
    databases: {
      mongo: mongo.connected ? 'connected' : 'disconnected',
      name: mongo.database,
    },
  });
});