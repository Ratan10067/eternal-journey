import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import multer from 'multer';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { daysRouter } from './routes/days.js';
import { locationsRouter } from './routes/locations.js';
import { battlesRouter } from './routes/battles.js';
import { guestbookRouter } from './routes/guestbook.js';
import { adminRouter } from './routes/admin.js';
import { photosRouter } from './routes/photos.js';

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const sessionSecret = process.env.SESSION_SECRET;
if (isProduction && !sessionSecret) throw new Error('SESSION_SECRET must be configured in production.');

app.use(helmet({ crossOriginResourcePolicy: false }));
app.set('trust proxy', 1);
// Temporary open CORS while the project is being assembled. Before public launch,
// replace this with an exact CORS_ORIGIN allowlist.
app.use(cors({ origin: true, methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], allowedHeaders: ['Content-Type', 'x-visitor-id', 'x-csrf-token'], credentials: true }));
app.use(morgan('dev'));
// Local/self-hosted API limit. Vercel Functions impose their own 4.5 MB
// request-body limit, which must be handled with direct Cloudinary uploads.
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(session({ name: 'eternal_journey_admin', secret: sessionSecret || 'development-only-session-secret-replace-before-deployment', resave: false, saveUninitialized: false, store: isProduction && process.env.MONGODB_URI ? MongoStore.create({ mongoUrl: process.env.MONGODB_URI, collectionName: 'admin_sessions', stringify: false }) : undefined, cookie: { httpOnly: true, secure: isProduction, sameSite: 'lax', maxAge: 8 * 60 * 60 * 1000 } }));
app.get('/api/health', (_req, res) => res.json({ status: 'online', title: 'THE ETERNAL JOURNEY API', subtitle: 'काशी से अयोध्या', timestamp: new Date().toISOString() }));
app.use('/api/days', daysRouter); app.use('/api/locations', locationsRouter); app.use('/api/battles', battlesRouter); app.use('/api/guestbook', guestbookRouter); app.use('/api/photos', photosRouter); app.use('/api/admin', adminRouter);
app.use((_req, res) => res.status(404).json({ error: 'API route not found.' }));
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => { console.error('[Unhandled Server Error]:', err); res.status(err instanceof multer.MulterError ? 400 : 500).json({ error: err instanceof multer.MulterError ? 'The uploaded files could not be processed.' : 'Internal server error' }); });
export default app;
