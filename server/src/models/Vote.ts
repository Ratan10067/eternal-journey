import mongoose, { Schema, Document } from 'mongoose';

export interface IVote extends Document {
  battleId: string;
  visitorId: string;
  ipAddress: string;
  device: 'Galaxy S25' | 'iPhone 17';
  createdAt: Date;
}

const VoteSchema: Schema = new Schema(
  {
    battleId: { type: String, required: true, index: true },
    visitorId: { type: String, required: true, index: true },
    ipAddress: { type: String, required: true },
    device: { type: String, enum: ['Galaxy S25', 'iPhone 17'], required: true }
  },
  { timestamps: true }
);

// Prevent duplicate votes from same visitor on same battle
VoteSchema.index({ battleId: 1, visitorId: 1 }, { unique: true });

export const Vote = mongoose.model<IVote>('Vote', VoteSchema);
