import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({ url: String, publicId: String }, { _id: false });

const writeupSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard', 'insane'], required: true },
    tools: [{ type: String }],
    content: { type: String, default: '' },
    images: [imageSchema],
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    tags: [{ type: String }],
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Writeup', writeupSchema);
