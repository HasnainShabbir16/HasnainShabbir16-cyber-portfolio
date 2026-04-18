import mongoose from 'mongoose';

const progressItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    percentage: { type: Number, required: true, min: 0, max: 100 },
    category: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('ProgressItem', progressItemSchema);
