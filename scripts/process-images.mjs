import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import exifr from 'exifr';

const ORIGINALS_DIR = path.resolve('public/images/originals');
const OPTIMIZED_DIR = path.resolve('public/images/optimized');
const THUMBNAILS_DIR = path.resolve('public/images/thumbnails');
const MANIFEST_PATH = path.resolve('src/data/photos.json');
const OVERRIDES_PATH = path.resolve('src/data/photo-overrides.json');

// Supported extensions
const SUPPORTED_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.tif', '.avif']);

// Ensure target directories exist
fs.mkdirSync(ORIGINALS_DIR, { recursive: true });
fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
fs.mkdirSync(THUMBNAILS_DIR, { recursive: true });
fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });

function getFilesRecursively(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getFilesRecursively(fullPath));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (SUPPORTED_EXTS.has(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

function loadJson(filePath, defaultValue) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn(`[Image Pipeline] Could not parse ${filePath}, using fallback`, err.message);
  }
  return defaultValue;
}

async function extractExifSafe(filePath) {
  try {
    const data = await exifr.parse(filePath, {
      tiff: true,
      exif: true,
      gps: true,
      pick: [
        'DateTimeOriginal',
        'CreateDate',
        'latitude',
        'longitude',
        'Make',
        'Model',
        'FocalLength',
        'FNumber',
        'ISO'
      ]
    });

    if (!data) return null;

    let date = null;
    if (data.DateTimeOriginal instanceof Date && !isNaN(data.DateTimeOriginal)) {
      date = data.DateTimeOriginal.toISOString();
    } else if (data.CreateDate instanceof Date && !isNaN(data.CreateDate)) {
      date = data.CreateDate.toISOString();
    }

    return {
      date,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      camera: data.Make && data.Model ? `${data.Make} ${data.Model}`.trim() : null
    };
  } catch {
    return null;
  }
}

async function processAll() {
  console.log('--- The Eternal Journey: Image Processing Pipeline ---');
  console.log(`Scanning originals at: ${ORIGINALS_DIR}`);

  const originalFiles = getFilesRecursively(ORIGINALS_DIR);
  console.log(`Found ${originalFiles.length} original photos.`);

  // Load existing manifest and manual overrides
  const existingManifest = loadJson(MANIFEST_PATH, []);
  const overrides = loadJson(OVERRIDES_PATH, {});

  const existingMap = new Map();
  for (const item of existingManifest) {
    if (item.id) existingMap.set(item.id, item);
  }

  const manifest = [];

  for (const filePath of originalFiles) {
    const relPath = path.relative(ORIGINALS_DIR, filePath);
    // Create deterministic ID based on relative path
    const hash = crypto.createHash('md5').update(relPath).digest('hex').slice(0, 8);
    const baseSlug = path.parse(filePath).name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const photoId = `${baseSlug}-${hash}`;

    const optimizedFilename = `${photoId}.webp`;
    const optimizedPath = path.join(OPTIMIZED_DIR, optimizedFilename);
    const thumbnailPath = path.join(THUMBNAILS_DIR, optimizedFilename);

    let imgMetadata = null;

    try {
      const imageBuffer = fs.readFileSync(filePath);
      const sharpInstance = sharp(imageBuffer).rotate(); // auto-rotate orientation
      imgMetadata = await sharpInstance.metadata();

      // Generate optimized high-res (max 2400px width/height, stripped EXIF for privacy)
      if (!fs.existsSync(optimizedPath)) {
        await sharp(imageBuffer)
          .rotate()
          .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 86, effort: 4 })
          .withMetadata(false) // strip private metadata
          .toFile(optimizedPath);
      }

      // Generate thumbnail (max 600px width/height)
      if (!fs.existsSync(thumbnailPath)) {
        await sharp(imageBuffer)
          .rotate()
          .resize({ width: 600, height: 600, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80, effort: 3 })
          .withMetadata(false)
          .toFile(thumbnailPath);
      }
    } catch (err) {
      console.error(`[Error processing ${relPath}]:`, err.message);
      continue;
    }

    // Extract EXIF safely (no fabricated data)
    const exifData = await extractExifSafe(filePath);

    // Merge priority: Overrides > Existing manifest entry > Extracted EXIF > Defaults
    const existingEntry = existingMap.get(photoId) || {};
    const overrideEntry = overrides[photoId] || overrides[path.basename(filePath)] || {};

    const entry = {
      id: photoId,
      src: `/images/optimized/${optimizedFilename}`,
      thumbnail: `/images/thumbnails/${optimizedFilename}`,
      date: overrideEntry.date ?? existingEntry.date ?? exifData?.date ?? null,
      city: overrideEntry.city ?? existingEntry.city ?? null,
      locationId: overrideEntry.locationId ?? existingEntry.locationId ?? null,
      caption: overrideEntry.caption ?? existingEntry.caption ?? '',
      featured: Boolean(overrideEntry.featured ?? existingEntry.featured ?? false),
      width: imgMetadata?.width || undefined,
      height: imgMetadata?.height || undefined,
      aspect: imgMetadata?.width && imgMetadata?.height ? +(imgMetadata.width / imgMetadata.height).toFixed(3) : undefined
    };

    manifest.push(entry);
    console.log(`✓ Processed: ${photoId} (${entry.city || 'Unassigned city'})`);
  }

  // Write updated manifest
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`\nSuccessfully generated manifest with ${manifest.length} photos at: ${MANIFEST_PATH}`);
}

processAll().catch(err => {
  console.error('Fatal error in image processing pipeline:', err);
  process.exit(1);
});
