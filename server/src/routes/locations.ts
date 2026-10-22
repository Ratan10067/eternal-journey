import { Router, Request, Response } from 'express';
import { Location } from '../models/Location.js';
import { requireAdmin, requireCsrf } from '../middleware/auth.js';

export const locationsRouter = Router();

// GET /api/locations - List locations with optional city/day filters
locationsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { city, day } = req.query;
    const filter: any = {};
    if (city && city !== 'All') filter.city = city;
    if (day && day !== 'All') filter.dayNumber = parseInt(day as string, 10);

    const locations = await Location.find(filter).sort({ dayNumber: 1 });
    res.json(locations);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve locations', details: error.message });
  }
});

// GET /api/locations/:slug - Get single location details
locationsRouter.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const location = await Location.findOne({ $or: [{ slug }, { id: slug }] });
    if (!location) {
      res.status(404).json({ error: 'Location not found' });
      return;
    }
    res.json(location);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve location', details: error.message });
  }
});

// POST /api/locations - Create new location (Admin protected)
locationsRouter.post('/', requireAdmin, requireCsrf, async (req: Request, res: Response) => {
  try {
    const newLoc = new Location(req.body);
    await newLoc.save();
    res.status(201).json(newLoc);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to create location', details: error.message });
  }
});

// PUT /api/locations/:id - Update location (Admin protected)
locationsRouter.put('/:id', requireAdmin, requireCsrf, async (req: Request, res: Response) => {
  try {
    const updated = await Location.findOneAndUpdate(
      { $or: [{ id: req.params.id }, { slug: req.params.id }] },
      { $set: req.body },
      { new: true }
    );
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to update location', details: error.message });
  }
});
