import mongoose, { Schema, Document } from 'mongoose';

export interface IGuestbook extends Document {
  id: string;
  name: string;
  city?: string;
  message: string;
  favoriteMoment?: string;
  reaction: string;
  ipAddress?: string;
  status: 'approved' | 'pending' | 'flagged';
  createdAt: Date;
}

const GuestbookSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    city: { type: String, trim: true, maxlength: 80 },
    message: { type: String, required: true, trim: true, maxlength: 1000 },
    favoriteMoment: { type: String, trim: true, maxlength: 120 },
    reaction: { type: String, default: '🙏' },
    ipAddress: { type: String },
    status: { type: String, enum: ['approved', 'pending', 'flagged'], default: 'pending', index: true }
  },
  { timestamps: true }
);

export const Guestbook = mongoose.model<IGuestbook>('Guestbook', GuestbookSchema);
