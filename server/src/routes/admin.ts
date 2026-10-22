import { randomBytes } from 'node:crypto';
import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { requireAdmin, requireCsrf } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimiter.js';
import { Day } from '../models/Day.js';
import { Location } from '../models/Location.js';
import { Photo } from '../models/Photo.js';
import { Battle } from '../models/Battle.js';
import { Vote } from '../models/Vote.js';
import { Comment } from '../models/Comment.js';
import { Guestbook } from '../models/Guestbook.js';
import { PhotoComment } from '../models/PhotoComment.js';

export const adminRouter = Router();
const csrfToken = () => randomBytes(32).toString('base64url');

adminRouter.post('/login', loginLimiter, async (req: Request, res: Response) => {
  const adminKey = String(req.body.adminKey || '');
  const keyHash = process.env.ADMIN_KEY_HASH;
  if (!keyHash) return res.status(503).json({ error: 'Administrator authentication is not configured.' });
  if (!adminKey) return res.status(400).json({ error: 'Enter the shared administrator key.' });
  if (!(await bcrypt.compare(adminKey, keyHash))) return res.status(401).json({ error: 'The administrator key is not correct.' });

  req.session.regenerate((regenerateError) => {
    if (regenerateError) return res.status(500).json({ error: 'Unable to begin a secure session.' });
    req.session.isMemoryStudioAdmin = true;
    req.session.authVersion = process.env.ADMIN_SESSION_VERSION || '1';
    req.session.csrfToken = csrfToken();
    req.session.save((saveError) => {
      if (saveError) return res.status(500).json({ error: 'Unable to save the secure session.' });
      res.json({ authenticated: true, csrfToken: req.session.csrfToken, expiresInSeconds: 8 * 60 * 60 });
    });
  });
});

adminRouter.get('/session', requireAdmin, (req: Request, res: Response) => {
  res.json({ authenticated: true, csrfToken: req.session.csrfToken, expiresInSeconds: 8 * 60 * 60 });
});

adminRouter.post('/logout', requireAdmin, requireCsrf, (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.clearCookie('eternal_journey_admin');
    res.status(204).end();
  });
});

adminRouter.get('/stats', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const [days, locations, photos, battles, votes, comments, guestbook, pendingPhotoComments] = await Promise.all([
      Day.countDocuments(), Location.countDocuments(), Photo.countDocuments(), Battle.countDocuments(), Vote.countDocuments(), Comment.countDocuments(), Guestbook.countDocuments(), PhotoComment.countDocuments({ status: 'pending' })
    ]);
    res.json({ days, locations, photos, battles, votes, comments, guestbook, pendingPhotoComments });
  } catch {
    res.status(500).json({ error: 'Unable to retrieve studio statistics.' });
  }
});
