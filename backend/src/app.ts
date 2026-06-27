import { env } from './config/env.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
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

export const app = express();

app.set('trust proxy', 1);

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts. Please try again later.' },
});

const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many contact submissions. Please try again later.' },
});

const subscriptionRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many subscription requests. Please try again later.' },
});

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (env.clientUrls.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true
  })
);
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

app.get('/api', (_req, res) => {
  res.json({ message: 'Solventa API is running' });
});

app.use('/api/health', healthRouter);
app.use('/api/auth', authRateLimiter, authRouter);
app.use('/api/contact', contactRateLimiter, contactRouter);
app.use('/api/blog', blogRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/admin/content', adminContentRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/subscriptions', subscriptionRateLimiter, subscriptionsRouter);

app.use(notFoundHandler);
app.use(errorHandler);