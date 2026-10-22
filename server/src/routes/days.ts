import { Router, Request, Response } from 'express';
import { Day } from '../models/Day.js';
import { DayRevision } from '../models/DayRevision.js';
import { requireAdmin, requireCsrf } from '../middleware/auth.js';

export const daysRouter = Router();
const editableFields = ['date', 'isoDate', 'city', 'title', 'hindiTitle', 'subtitle', 'coverPhoto', 'personalNarrative', 'locationsVisited', 'timeline', 'funnyIncidents', 'memorableConversations', 'highlightQuotes', 'photoIds', 'featuredPhotoIds', 'status'];

daysRouter.get('/', async (_req: Request, res: Response) => {
  try { res.json(await Day.find({ status: 'published' }).sort({ day: 1 }).lean()); }
  catch { res.status(500).json({ error: 'Unable to retrieve published journey days.' }); }
});

daysRouter.get('/admin/all', requireAdmin, async (_req, res) => {
  const days = await Day.find().sort({ day: 1 }).lean();
  res.json({ days });
});

daysRouter.post('/admin/initialize', requireAdmin, requireCsrf, async (_req, res) => {
  const dates = ['2026-10-16', '2026-10-17', '2026-10-18', '2026-10-19', '2026-10-20'];
  await Day.bulkWrite(dates.map((isoDate, index) => ({
    updateOne: {
      filter: { day: index + 1 },
      update: { $setOnInsert: { day: index + 1, date: isoDate, isoDate, city: 'Transit' as const, status: 'draft' as const, title: '', hindiTitle: '', subtitle: '', coverPhoto: '', personalNarrative: '', locationsVisited: [], timeline: [], funnyIncidents: [], memorableConversations: [], highlightQuotes: [], photoIds: [], featuredPhotoIds: [] } },
      upsert: true
    }
  })));
  const days = await Day.find().sort({ day: 1 }).lean();
  res.json({ days });
});

daysRouter.get('/admin/:dayNumber/revisions', requireAdmin, async (req, res) => {
  const revisions = await DayRevision.find({ day: Number(req.params.dayNumber) }).sort({ version: -1 }).limit(30).lean();
  res.json({ revisions });
});

daysRouter.get('/:dayNumber', async (req: Request, res: Response) => {
  const day = await Day.findOne({ day: Number(req.params.dayNumber), status: 'published' }).lean();
  if (!day) return res.status(404).json({ error: 'Published journey day not found.' });
  res.json(day);
});

daysRouter.put('/:dayNumber', requireAdmin, requireCsrf, async (req: Request, res: Response) => {
  const dayNumber = Number(req.params.dayNumber);
  const expectedVersion = Number(req.body.version);
  if (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > 5) return res.status(400).json({ error: 'A journey day between 1 and 5 is required.' });
  if (!Number.isInteger(expectedVersion)) return res.status(400).json({ error: 'The current diary version is required.' });
  const update = Object.fromEntries(Object.entries(req.body).filter(([field]) => editableFields.includes(field)));
  const current = await Day.findOne({ day: dayNumber }).lean();
  if (!current) return res.status(404).json({ error: 'Create this draft with the diary setup script first.' });
  if (current.version !== expectedVersion) return res.status(409).json({ error: 'This diary changed in another session. Refresh before saving.', current });
  await DayRevision.create({ day: dayNumber, version: current.version, snapshot: current });
  const day = await Day.findOneAndUpdate({ day: dayNumber, version: expectedVersion }, { $set: update, $inc: { version: 1 } }, { new: true, runValidators: true });
  if (!day) return res.status(409).json({ error: 'This diary changed in another session. Refresh before saving.' });
  res.json({ day });
});

daysRouter.post('/:dayNumber/restore/:version', requireAdmin, requireCsrf, async (req, res) => {
  const revision = await DayRevision.findOne({ day: Number(req.params.dayNumber), version: Number(req.params.version) }).lean();
  if (!revision) return res.status(404).json({ error: 'Diary revision not found.' });
  const snapshot = revision.snapshot as Record<string, unknown>;
  const fields = Object.fromEntries(Object.entries(snapshot).filter(([field]) => editableFields.includes(field)));
  const day = await Day.findOneAndUpdate({ day: Number(req.params.dayNumber) }, { $set: fields, $inc: { version: 1 } }, { new: true, runValidators: true });
  res.json({ day });
});
