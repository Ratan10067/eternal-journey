import { Router, Request, Response } from 'express';
import { Guestbook } from '../models/Guestbook.js';
import { guestbookLimiter } from '../middleware/rateLimiter.js';
import { requireAdmin, requireCsrf } from '../middleware/auth.js';

export const guestbookRouter = Router();

guestbookRouter.get('/admin/all', requireAdmin, async (_req: Request, res: Response) => {
  const entries = await Guestbook.find().sort({ createdAt: -1 }).limit(200).lean();
  res.json({ entries });
});

// GET /api/guestbook - List guestbook messages with pagination
guestbookRouter.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;
    const skip = (page - 1) * limit;

    const entries = await Guestbook.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Guestbook.countDocuments({ status: 'approved' });

    res.json({
      entries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve guestbook entries', details: error.message });
  }
});

// POST /api/guestbook - Submit postcard message with rate limiting
guestbookRouter.post('/', guestbookLimiter, async (req: Request, res: Response) => {
  try {
    const { name, city, message, favoriteMoment, reaction } = req.body;
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

    if (!message || message.trim().length === 0) {
      res.status(400).json({ error: 'Message content is required' });
      return;
    }

    const sanitizedName = (name || 'Sacred Pilgrim').trim().slice(0, 80);
    const sanitizedCity = city ? city.trim().slice(0, 80) : undefined;
    const sanitizedMsg = message.trim().slice(0, 1000);
    const sanitizedMoment = favoriteMoment ? favoriteMoment.trim().slice(0, 120) : undefined;

    const newEntry = new Guestbook({
      id: `gb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: sanitizedName,
      city: sanitizedCity,
      message: sanitizedMsg,
      favoriteMoment: sanitizedMoment,
      reaction: reaction || '🙏',
      ipAddress,
      status: 'pending'
    });

    await newEntry.save();
    res.status(201).json({ message: 'Postcard submitted for moderation.' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to submit postcard', details: error.message });
  }
});

// PATCH /api/guestbook/:id - Approve, hold, or flag an entry without exposing it publicly.
guestbookRouter.patch('/:id', requireAdmin, requireCsrf, async (req: Request, res: Response) => {
  const status = String(req.body.status || '');
  if (!['approved', 'pending', 'flagged'].includes(status)) return res.status(400).json({ error: 'Invalid moderation status.' });
  const entry = await Guestbook.findOneAndUpdate({ $or: [{ id: req.params.id }, { _id: req.params.id }] }, { $set: { status } }, { new: true });
  if (!entry) return res.status(404).json({ error: 'Postcard not found.' });
  res.json({ entry });
});

// DELETE /api/guestbook/:id - Admin moderation
guestbookRouter.delete('/:id', requireAdmin, requireCsrf, async (req: Request, res: Response) => {
  try {
    await Guestbook.findOneAndDelete({ $or: [{ id: req.params.id }, { _id: req.params.id }] });
    res.json({ message: 'Postcard deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to delete postcard', details: error.message });
  }
});
