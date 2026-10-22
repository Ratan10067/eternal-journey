import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import multer from 'multer';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { connectDB } from './config/db.js';

// Route imports
import { daysRouter } from './routes/days.js';
import { locationsRouter } from './routes/locations.js';
import { battlesRouter } from './routes/battles.js';
import { guestbookRouter } from './routes/guestbook.js';
import { adminRouter } from './routes/admin.js';
import { photosRouter } from './routes/photos.js';

const app = express();
const PORT = process.env.PORT || 5001;
const isProduction = process.env.NODE_ENV === 'production';
const sessionSecret = process.env.SESSION_SECRET;
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const localDevelopmentOrigin = /^http:\/\/(localhost|127\.0\.0\.1)(?::\d+)?$/;

if (isProduction && !sessionSecret) {
  throw new Error('SESSION_SECRET must be configured in production.');
}

// Security and utility middleware
app.use(helmet({
  crossOriginResourcePolicy: false
}));

app.set('trust proxy', 1);
app.use(cors({
  origin(origin, callback) {
    // Requests without an Origin header include local tooling and same-origin calls.
    if (!origin || allowedOrigins.includes(origin) || (!isProduction && localDevelopmentOrigin.test(origin))) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS.'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-visitor-id', 'x-csrf-token'],
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  name: 'eternal_journey_admin',
  secret: sessionSecret || 'development-only-session-secret-replace-before-deployment',
  resave: false,
  saveUninitialized: false,
  // Local development remains usable before Atlas is provisioned. Production
  // sessions are durable and shared through MongoDB rather than process memory.
  store: isProduction && process.env.MONGODB_URI
    ? MongoStore.create({ mongoUrl: process.env.MONGODB_URI, collectionName: 'admin_sessions', stringify: false })
    : undefined,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    // Vercel's frontend and a separately hosted API are different sites.
    // Secure cross-site administrator sessions therefore need SameSite=None.
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 8 * 60 * 60 * 1000
  }
}));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    title: 'THE ETERNAL JOURNEY API',
    subtitle: 'काशी से अयोध्या',
    timestamp: new Date().toISOString()
  });
});

// Mount modular API routers
app.use('/api/days', daysRouter);
app.use('/api/locations', locationsRouter);
app.use('/api/battles', battlesRouter);
app.use('/api/guestbook', guestbookRouter);
app.use('/api/photos', photosRouter);
app.use('/api/admin', adminRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'API route not found.' });
});

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err?.message === 'Origin is not allowed by CORS.') {
    return res.status(403).json({ error: 'Origin is not permitted to call this API.' });
  }
  console.error('[Unhandled Server Error]:', err);
  res.status(err instanceof multer.MulterError ? 400 : 500).json({
    error: err instanceof multer.MulterError ? 'The uploaded files could not be processed.' : 'Internal server error'
  });
});

// Start Server & Connect to DB
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`✦ THE ETERNAL JOURNEY — Backend API Server Online ✦`);
    console.log(`  Local Endpoint: http://localhost:${PORT}/api/health`);
    console.log(`======================================================\n`);
  });
};

startServer();

export default app;
