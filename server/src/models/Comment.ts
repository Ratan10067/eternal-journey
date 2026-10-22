import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  id: string;
  battleId: string;
  author: string;
  text: string;
  reaction?: string;
  status: 'approved' | 'pending' | 'flagged';
  createdAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    battleId: { type: String, required: true, index: true },
    author: { type: String, required: true, trim: true, maxlength: 60 },
    text: { type: String, required: true, trim: true, maxlength: 500 },
    reaction: { type: String, default: '✨' },
    status: { type: String, enum: ['approved', 'pending', 'flagged'], default: 'approved', index: true }
  },
  { timestamps: true }
);

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);
