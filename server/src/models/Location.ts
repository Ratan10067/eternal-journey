import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
  id: string;
  slug: string;
  name: string;
  hindiName: string;
  city: 'Varanasi' | 'Ayodhya';
  category: 'temple' | 'ghat' | 'sacred_site' | 'heritage' | 'ceremony';
  coordinates: [number, number]; // [lng, lat]
  date: string;
  dayNumber: number;
  timeOfDay?: string;
  coverImage: string;
  summary: string;
  culturalNote?: string;
  photoIds: string[];
}

const LocationSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    hindiName: { type: String, required: true },
    city: { type: String, required: true, enum: ['Varanasi', 'Ayodhya'], index: true },
    category: { type: String, required: true },
    coordinates: {
      type: [Number],
      required: true,
      validate: (v: number[]) => v.length === 2
    },
    date: { type: String, required: true },
    dayNumber: { type: Number, required: true, index: true },
    timeOfDay: { type: String },
    coverImage: { type: String, required: true },
    summary: { type: String, required: true },
    culturalNote: { type: String },
    photoIds: [{ type: String }]
  },
  { timestamps: true }
);

export const Location = mongoose.model<ILocation>('Location', LocationSchema);
