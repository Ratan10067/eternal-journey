import mongoose, { Schema, Document } from 'mongoose';

export interface IDay extends Document {
  day: number;
  date: string;
  isoDate: string;
  city: 'Varanasi' | 'Ayodhya' | 'Transit';
  title: string;
  hindiTitle: string;
  subtitle: string;
  coverPhoto: string;
  personalNarrative: string;
  locationsVisited: string[];
  timeline: Array<{
    time: string;
    title: string;
    note: string;
    photoId?: string;
    locationId?: string;
  }>;
  funnyIncidents: string[];
  memorableConversations: Array<{
    speaker: string;
    text: string;
    context?: string;
  }>;
  highlightQuotes: string[];
  photoIds: string[];
  featuredPhotoIds: string[];
  status: 'draft' | 'published';
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const DaySchema: Schema = new Schema(
  {
    day: { type: Number, required: true, unique: true, index: true },
    date: { type: String, required: true },
    isoDate: { type: String, required: true },
    city: { type: String, enum: ['Varanasi', 'Ayodhya', 'Transit'], default: 'Transit' },
    title: { type: String, default: '' },
    hindiTitle: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    coverPhoto: { type: String, default: '' },
    personalNarrative: { type: String, default: '' },
    locationsVisited: [{ type: String }],
    timeline: [
      {
        time: { type: String, required: true },
        title: { type: String, required: true },
        note: { type: String, required: true },
        photoId: { type: String },
        locationId: { type: String }
      }
    ],
    funnyIncidents: [{ type: String }],
    memorableConversations: [
      {
        speaker: { type: String, required: true },
        text: { type: String, required: true },
        context: { type: String }
      }
    ],
    highlightQuotes: [{ type: String }],
    photoIds: [{ type: String }],
    featuredPhotoIds: [{ type: String }],
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    version: { type: Number, default: 1 }
  },
  { timestamps: true }
);

export const Day = mongoose.model<IDay>('Day', DaySchema);
