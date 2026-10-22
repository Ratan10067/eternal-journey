import mongoose, { Document, Schema } from 'mongoose';

export interface IPhotoComment extends Document {
  photoId: string;
  displayName: string;
  text: string;
  visitorHash: string;
  status: 'pending' | 'approved' | 'hidden';
  createdAt: Date;
}

const PhotoCommentSchema = new Schema<IPhotoComment>({
  photoId: { type: String, required: true, index: true },
  displayName: { type: String, required: true, trim: true, maxlength: 60 },
  text: { type: String, required: true, trim: true, maxlength: 500 },
  visitorHash: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'hidden'], default: 'pending', index: true }
}, { timestamps: { createdAt: true, updatedAt: true } });

export const PhotoComment = mongoose.model<IPhotoComment>('PhotoComment', PhotoCommentSchema);
