import mongoose, { Schema, Document } from 'mongoose';

export interface IPhoto extends Document {
  id: string;
  cloudinaryPublicId: string;
  cloudinaryAssetId?: string;
  originalFilename: string;
  imageUrl: string;
  thumbnailUrl: string;
  format: string;
  fileSize: number;
  fileHash: string;
  title?: string;
  date: string | null;
  journeyDay?: number;
  city: 'Varanasi' | 'Ayodhya' | null;
  locationId: string | null;
  caption: string;
  altText: string;
  tags: string[];
  category?: string;
  featured: boolean;
  visibility: 'draft' | 'published' | 'hidden';
  displayOrder: number;
  coordinates?: [number, number];
  device?: string;
  width?: number;
  height?: number;
  aspect?: number;
  exif?: {
    make?: string;
    model?: string;
    focalLength?: string;
    aperture?: string;
    iso?: string;
  };
}

const PhotoSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    cloudinaryPublicId: { type: String, required: true, unique: true, index: true },
    cloudinaryAssetId: { type: String, unique: true, sparse: true, index: true },
    originalFilename: { type: String, required: true },
    imageUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    format: { type: String, required: true },
    fileSize: { type: Number, required: true },
    fileHash: { type: String, required: true, unique: true, index: true },
    title: { type: String, trim: true, maxlength: 160 },
    date: { type: String },
    journeyDay: { type: Number, min: 1, max: 5, index: true },
    city: { type: String, enum: ['Varanasi', 'Ayodhya', null], index: true },
    locationId: { type: String, index: true },
    caption: { type: String, default: '' },
    altText: { type: String, required: true, maxlength: 300 },
    tags: [{ type: String, trim: true, maxlength: 40, index: true }],
    category: { type: String, trim: true, maxlength: 80, index: true },
    featured: { type: Boolean, default: false, index: true },
    visibility: { type: String, enum: ['draft', 'published', 'hidden'], default: 'draft', index: true },
    displayOrder: { type: Number, default: 0, index: true },
    coordinates: { type: [Number], validate: (value: number[]) => !value || value.length === 0 || value.length === 2 },
    device: { type: String },
    width: { type: Number },
    height: { type: Number },
    aspect: { type: Number },
    exif: {
      make: { type: String },
      model: { type: String },
      focalLength: { type: String },
      aperture: { type: String },
      iso: { type: String }
    }
  },
  { timestamps: true }
);

export const Photo = mongoose.model<IPhoto>('Photo', PhotoSchema);
