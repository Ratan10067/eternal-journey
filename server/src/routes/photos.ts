import { randomUUID } from 'node:crypto';
import { Router, Request, Response } from 'express';
import multer from 'multer';
import { Photo } from '../models/Photo.js';
import { PhotoLike } from '../models/PhotoLike.js';
import { PhotoComment } from '../models/PhotoComment.js';
import { requireAdmin, requireCsrf } from '../middleware/auth.js';
import { commentLimiter } from '../middleware/rateLimiter.js';
import { hashBuffer, imageUrl, isSupportedImageBuffer, uploadPhotoBuffer } from '../services/photoUpload.js';
import { cloudinary } from '../config/cloudinary.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';

export const photosRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024, files: 20 },
  fileFilter: (_req, file, callback) => {
    const supported = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    callback(null, supported.includes(file.mimetype));
  }
});

const asArray = (value: unknown) => Array.isArray(value)
  ? value.map(String).map((item) => item.trim()).filter(Boolean)
  : typeof value === 'string' ? value.split(',').map((item) => item.trim()).filter(Boolean) : [];

const visitorHash = (request: Request) => String(request.get('x-visitor-id') || '').trim().slice(0, 128);

const photoPayload = (photo: any, likes = 0) => ({
  id: photo.id,
  src: photo.imageUrl,
  thumbnail: photo.thumbnailUrl,
  date: photo.date || null,
  city: photo.city || null,
  locationId: photo.locationId || null,
  caption: photo.caption,
  title: photo.title,
  altText: photo.altText,
  featured: photo.featured,
  device: photo.device,
  width: photo.width,
  height: photo.height,
  aspect: photo.aspect,
  tags: photo.tags,
  category: photo.category,
  journeyDay: photo.journeyDay,
  likes
});

// Published photographs are the only images exposed to public consumers.
photosRouter.get('/', async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(60, Math.max(1, Number(req.query.limit) || 30));
    const filter: Record<string, unknown> = { visibility: 'published' };
    if (req.query.city) filter.city = req.query.city;
    if (req.query.place) filter.locationId = req.query.place;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.day) filter.journeyDay = Number(req.query.day);

    const [photos, total] = await Promise.all([
      Photo.find(filter).sort({ displayOrder: 1, createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Photo.countDocuments(filter)
    ]);
    const ids = photos.map((photo) => photo.id);
    const likes = await PhotoLike.aggregate([{ $match: { photoId: { $in: ids } } }, { $group: { _id: '$photoId', count: { $sum: 1 } } }]);
    const likeCounts = new Map(likes.map((item) => [item._id, item.count]));
    res.json({ photos: photos.map((photo) => photoPayload(photo, likeCounts.get(photo.id) || 0)), pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve photographs.' });
  }
});

photosRouter.get('/:id', async (req, res) => {
  const photo = await Photo.findOne({ id: req.params.id, visibility: 'published' }).lean();
  if (!photo) return res.status(404).json({ error: 'Photograph not found.' });
  const likes = await PhotoLike.countDocuments({ photoId: photo.id });
  res.json(photoPayload(photo, likes));
});

photosRouter.post('/:id/likes', async (req, res) => {
  const hash = visitorHash(req);
  if (!hash) return res.status(400).json({ error: 'A privacy-preserving visitor identifier is required.' });
  const photo = await Photo.exists({ id: req.params.id, visibility: 'published' });
  if (!photo) return res.status(404).json({ error: 'Photograph not found.' });
  await PhotoLike.updateOne({ photoId: req.params.id, visitorHash: hash }, { $setOnInsert: { photoId: req.params.id, visitorHash: hash } }, { upsert: true });
  res.status(201).json({ likes: await PhotoLike.countDocuments({ photoId: req.params.id }) });
});

photosRouter.delete('/:id/likes', async (req, res) => {
  const hash = visitorHash(req);
  if (!hash) return res.status(400).json({ error: 'A privacy-preserving visitor identifier is required.' });
  await PhotoLike.deleteOne({ photoId: req.params.id, visitorHash: hash });
  res.json({ likes: await PhotoLike.countDocuments({ photoId: req.params.id }) });
});

photosRouter.get('/:id/comments', async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
  const [comments, total] = await Promise.all([
    PhotoComment.find({ photoId: req.params.id, status: 'approved' }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    PhotoComment.countDocuments({ photoId: req.params.id, status: 'approved' })
  ]);
  res.json({ comments, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
});

photosRouter.post('/:id/comments', commentLimiter, async (req, res) => {
  const text = String(req.body.text || '').trim();
  const displayName = String(req.body.displayName || 'Fellow Pilgrim').trim().slice(0, 60);
  const hash = visitorHash(req);
  if (!text || !hash) return res.status(400).json({ error: 'Comment text and visitor identifier are required.' });
  const comment = await PhotoComment.create({ photoId: req.params.id, text: text.slice(0, 500), displayName, visitorHash: hash, status: 'pending' });
  res.status(201).json({ comment, message: 'Comment submitted for moderation.' });
});

photosRouter.get('/admin/all', requireAdmin, async (req, res) => {
  const visibility = req.query.visibility ? { visibility: req.query.visibility } : {};
  const photos = await Photo.find(visibility).sort({ displayOrder: 1, createdAt: -1 }).lean();
  res.json({ photos });
});

photosRouter.get('/admin/comments', requireAdmin, async (req, res) => {
  const status = req.query.status ? { status: req.query.status } : {};
  const comments = await PhotoComment.find(status).sort({ createdAt: -1 }).limit(200).lean();
  res.json({ comments });
});

photosRouter.patch('/admin/comments/:id', requireAdmin, requireCsrf, async (req, res) => {
  const status = String(req.body.status || '');
  if (!['approved', 'pending', 'hidden'].includes(status)) return res.status(400).json({ error: 'Invalid moderation status.' });
  const comment = await PhotoComment.findByIdAndUpdate(req.params.id, { $set: { status } }, { new: true });
  if (!comment) return res.status(404).json({ error: 'Comment not found.' });
  res.json({ comment });
});

photosRouter.post('/admin/upload', requireAdmin, requireCsrf, uploadLimiter, upload.array('photos', 20), async (req: Request, res: Response) => {
  const files = (req.files || []) as Express.Multer.File[];
  if (!files.length) return res.status(400).json({ error: 'Select at least one JPEG, PNG, WebP, HEIC, or HEIF image.' });

  const results = await Promise.all(files.map(async (file) => {
    if (!isSupportedImageBuffer(file.buffer)) {
      return { filename: file.originalname, status: 'failed', error: 'The file contents are not a supported image.' };
    }
    const fileHash = hashBuffer(file.buffer);
    const duplicate = await Photo.findOne({ fileHash }).lean();
    if (duplicate) return { filename: file.originalname, status: 'duplicate', photoId: duplicate.id };
    try {
      const uploaded = await uploadPhotoBuffer(file, fileHash);
      let photo;
      try {
        photo = await Photo.create({
        id: `photo-${randomUUID()}`,
        cloudinaryPublicId: uploaded.public_id,
        cloudinaryAssetId: uploaded.asset_id,
        originalFilename: file.originalname,
        imageUrl: imageUrl(uploaded.public_id, 1800),
        thumbnailUrl: imageUrl(uploaded.public_id, 640),
        format: uploaded.format,
        fileSize: uploaded.bytes,
        fileHash,
        title: req.body.title?.trim() || undefined,
        caption: req.body.caption?.trim() || '',
        altText: req.body.altText?.trim() || req.body.title?.trim() || 'Journey photograph awaiting a descriptive caption',
        date: req.body.date || null,
        journeyDay: req.body.journeyDay ? Number(req.body.journeyDay) : undefined,
        city: req.body.city || null,
        locationId: req.body.locationId || null,
        tags: asArray(req.body.tags),
        category: req.body.category?.trim() || undefined,
        featured: req.body.featured === 'true',
        visibility: req.body.visibility === 'published' ? 'published' : 'draft',
        displayOrder: Number(req.body.displayOrder) || 0,
        width: uploaded.width,
        height: uploaded.height,
        aspect: uploaded.width && uploaded.height ? uploaded.width / uploaded.height : undefined
        });
      } catch (error) {
        // Avoid retaining an orphaned Cloudinary asset if metadata cannot be saved.
        await cloudinary.uploader.destroy(uploaded.public_id, { resource_type: 'image', invalidate: true }).catch(() => undefined);
        throw error;
      }
      return { filename: file.originalname, status: 'uploaded', photo };
    } catch (error: any) {
      return { filename: file.originalname, status: 'failed', error: error.message || 'Upload failed' };
    }
  }));
  res.status(207).json({ results });
});

photosRouter.patch('/admin/:id', requireAdmin, requireCsrf, async (req, res) => {
  const allowed = ['title', 'caption', 'altText', 'date', 'journeyDay', 'city', 'locationId', 'tags', 'category', 'featured', 'visibility', 'displayOrder', 'coordinates', 'device'];
  const update = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  if (typeof update.tags === 'string') update.tags = asArray(update.tags);
  const photo = await Photo.findOneAndUpdate({ id: req.params.id }, { $set: update }, { new: true, runValidators: true });
  if (!photo) return res.status(404).json({ error: 'Photograph not found.' });
  res.json({ photo });
});
