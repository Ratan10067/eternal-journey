import mongoose, { Schema, Document } from 'mongoose';

export interface IBattle extends Document {
  id: string;
  title: string;
  locationId: string;
  locationName: string;
  date: string;
  description: string;
  photoS25: {
    src: string;
    thumbnail: string;
    caption: string;
    device: 'Galaxy S25';
    settings?: string;
  };
  photoIPhone: {
    src: string;
    thumbnail: string;
    caption: string;
    device: 'iPhone 17';
    settings?: string;
  };
  votesS25: number;
  votesIPhone: number;
  status: 'active' | 'concluded';
  createdAt: Date;
}

const BattleSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    locationId: { type: String, required: true },
    locationName: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String, required: true },
    photoS25: {
      src: { type: String, required: true },
      thumbnail: { type: String, required: true },
      caption: { type: String, default: '' },
      device: { type: String, default: 'Galaxy S25' },
      settings: { type: String }
    },
    photoIPhone: {
      src: { type: String, required: true },
      thumbnail: { type: String, required: true },
      caption: { type: String, default: '' },
      device: { type: String, default: 'iPhone 17' },
      settings: { type: String }
    },
    votesS25: { type: Number, default: 0 },
    votesIPhone: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'concluded'], default: 'active', index: true }
  },
  { timestamps: true }
);

export const Battle = mongoose.model<IBattle>('Battle', BattleSchema);
