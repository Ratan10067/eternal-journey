import { createHash, randomUUID } from 'node:crypto';
import { Readable } from 'node:stream';
import { UploadApiResponse } from 'cloudinary';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

export const hashBuffer = (buffer: Buffer) => createHash('sha256').update(buffer).digest('hex');

export const isSupportedImageBuffer = (buffer: Buffer) => {
  const ascii = (start: number, end: number) => buffer.subarray(start, end).toString('ascii');
  const isJpeg = buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isPng = buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const isWebp = buffer.length >= 12 && ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP';
  const isHeif = buffer.length >= 12 && ascii(4, 8) === 'ftyp' && ['heic', 'heix', 'hevc', 'hevx', 'mif1', 'msf1'].includes(ascii(8, 12));
  return isJpeg || isPng || isWebp || isHeif;
};

export const uploadPhotoBuffer = async (file: Express.Multer.File, fileHash: string): Promise<UploadApiResponse> => {
  if (!isCloudinaryConfigured()) throw new Error('Cloudinary is not configured on the server.');

  const publicId = randomUUID();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({
      public_id: publicId,
      folder: 'eternal-journey/photos',
      resource_type: 'image',
      overwrite: false,
      unique_filename: false,
      context: `file_hash=${fileHash}|original_filename=${file.originalname}`,
      transformation: [{ quality: 'auto', fetch_format: 'auto', strip_profile: true }]
    }, (error, result) => error || !result ? reject(error || new Error('Cloudinary returned no upload result.')) : resolve(result));
    Readable.from(file.buffer).pipe(stream);
  });
};

export const imageUrl = (publicId: string, width: number) => cloudinary.url(publicId, {
  secure: true,
  resource_type: 'image',
  transformation: [{ width, crop: 'limit', quality: 'auto', fetch_format: 'auto', strip_profile: true }]
});
