import mongoose, { Schema, Document } from 'mongoose';

export interface IDayRevision extends Document {
  day: number;
  version: number;
  snapshot: Record<string, unknown>;
  createdAt: Date;
}

const DayRevisionSchema = new Schema({
  day: { type: Number, required: true, index: true },
  version: { type: Number, required: true },
  snapshot: { type: Schema.Types.Mixed, required: true }
}, { timestamps: { createdAt: true, updatedAt: false } });

DayRevisionSchema.index({ day: 1, version: -1 }, { unique: true });
export const DayRevision = mongoose.model<IDayRevision>('DayRevision', DayRevisionSchema);
