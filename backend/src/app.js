import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { corsOptions } from './config/cors.js';

import authRoutes from './routes/auth.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import calendarRoutes from './routes/calendar.routes.js';
import timelineRoutes from './routes/timeline.routes.js';
import resourcesRoutes from './routes/resources.routes.js';
import dsaRoutes from './routes/dsa.routes.js';
import sessionsRoutes from './routes/sessions.routes.js';
import notesRoutes from './routes/notes.routes.js';
import applicationsRoutes from './routes/applications.routes.js';
import readinessRoutes from './routes/readiness.routes.js';

const app = express();

const corsConfig = corsOptions();

// CORS before other middleware so preflight (OPTIONS) always gets headers
app.use(cors(corsConfig));
app.options('*', cors(corsConfig));

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500 });
app.use('/api', limiter);

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    service: 'placement-sprint-api',
    timestamp: new Date(),
    cors: process.env.CLIENT_URL ? 'configured' : 'CLIENT_URL missing',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/dsa', dsaRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/readiness', readinessRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
