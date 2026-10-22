import mongoose, { Document, Schema } from 'mongoose';

export interface IPhotoLike extends Document {
  photoId: string;
  visitorHash: string;
  createdAt: Date;
}

const PhotoLikeSchema = new Schema<IPhotoLike>({
  photoId: { type: String, required: true, index: true },
  visitorHash: { type: String, required: true }
}, { timestamps: { createdAt: true, updatedAt: false } });

PhotoLikeSchema.index({ photoId: 1, visitorHash: 1 }, { unique: true });
export const PhotoLike = mongoose.model<IPhotoLike>('PhotoLike', PhotoLikeSchema);
