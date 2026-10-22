import { Router, Request, Response } from 'express';
import { Battle } from '../models/Battle.js';
import { Vote } from '../models/Vote.js';
import { Comment } from '../models/Comment.js';
import { voteLimiter, commentLimiter } from '../middleware/rateLimiter.js';
import { requireAdmin, requireCsrf } from '../middleware/auth.js';

export const battlesRouter = Router();

// GET /api/battles - List all battles
battlesRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const battles = await Battle.find().sort({ createdAt: -1 });
    res.json(battles);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve battles', details: error.message });
  }
});

// GET /api/battles/:id - Single battle detail
battlesRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const battle = await Battle.findOne({ id: req.params.id });
    if (!battle) {
      res.status(404).json({ error: 'Battle not found' });
      return;
    }
    res.json(battle);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve battle', details: error.message });
  }
});

// POST /api/battles/:id/vote - Cast vote with abuse protection
battlesRouter.post('/:id/vote', voteLimiter, async (req: Request, res: Response) => {
  try {
    const { device, visitorId } = req.body;
    const battleId = req.params.id;
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

    if (!['Galaxy S25', 'iPhone 17'].includes(device)) {
      res.status(400).json({ error: 'Invalid device choice. Must be Galaxy S25 or iPhone 17.' });
      return;
    }

    if (!visitorId) {
      res.status(400).json({ error: 'visitorId is required' });
      return;
    }

    // Check existing vote
    const existingVote = await Vote.findOne({ battleId, visitorId });

    if (existingVote) {
      // If vote changed, update counts
      if (existingVote.device !== device) {
        const oldDevice = existingVote.device;
        existingVote.device = device;
        await existingVote.save();

        const decrementField = oldDevice === 'Galaxy S25' ? 'votesS25' : 'votesIPhone';
        const incrementField = device === 'Galaxy S25' ? 'votesS25' : 'votesIPhone';

        await Battle.findOneAndUpdate(
          { id: battleId },
          { $inc: { [decrementField]: -1, [incrementField]: 1 } }
        );
      }
    } else {
      // New vote
      const newVote = new Vote({ battleId, visitorId, ipAddress, device });
      await newVote.save();

      const incrementField = device === 'Galaxy S25' ? 'votesS25' : 'votesIPhone';
      await Battle.findOneAndUpdate(
        { id: battleId },
        { $inc: { [incrementField]: 1 } }
      );
    }

    const updatedBattle = await Battle.findOne({ id: battleId });
    res.json({ message: 'Vote recorded successfully', battle: updatedBattle });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to record vote', details: error.message });
  }
});

// GET /api/battles/:id/comments - Retrieve comments for battle
battlesRouter.get('/:id/comments', async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find({
      battleId: req.params.id,
      status: 'approved'
    }).sort({ createdAt: -1 });

    res.json(comments);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve comments', details: error.message });
  }
});

// POST /api/battles/:id/comments - Post comment with rate limiting
battlesRouter.post('/:id/comments', commentLimiter, async (req: Request, res: Response) => {
  try {
    const { author, text, reaction } = req.body;
    const battleId = req.params.id;

    if (!text || text.trim().length === 0) {
      res.status(400).json({ error: 'Comment text is required' });
      return;
    }

    const sanitizedAuthor = (author || 'Sacred Pilgrim').trim().slice(0, 60);
    const sanitizedText = text.trim().slice(0, 500);

    const newComment = new Comment({
      id: `comm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      battleId,
      author: sanitizedAuthor,
      text: sanitizedText,
      reaction: reaction || '✨',
      status: 'approved'
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to post comment', details: error.message });
  }
});

// POST /api/battles - Create new battle (Admin protected)
battlesRouter.post('/', requireAdmin, requireCsrf, async (req: Request, res: Response) => {
  try {
    const newBattle = new Battle(req.body);
    await newBattle.save();
    res.status(201).json(newBattle);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to create battle', details: error.message });
  }
});
