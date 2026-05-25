import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { authRouter } from './routes/auth.routes.js';
import { blogRouter } from './routes/blog.routes.js';
import { reviewsRouter } from './routes/reviews.routes.js';
import { adminContentRouter } from './routes/adminContent.routes.js';
import { dashboardRouter } from './routes/dashboard.routes.js';
import { healthRouter } from './routes/health.routes.js';
import { contactRouter } from './routes/contact.routes.js';
import { subscriptionsRouter } from './routes/subscriptions.routes.js';
import { notFoundHandler } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import { env } from './config/env.js';

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

app.get('/api', (_req, res) => {
  res.json({ message: 'Solventa API is running' });
});

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/contact', contactRouter);
app.use('/api/blog', blogRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/admin/content', adminContentRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/subscriptions', subscriptionsRouter);

app.use(notFoundHandler);
app.use(errorHandler);