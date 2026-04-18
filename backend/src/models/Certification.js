import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({ url: String, publicId: String }, { _id: false });

const certificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, default: '' },
    date: { type: Date },
    description: { type: String, default: '' },
    image: { type: imageSchema, default: () => ({}) },
    verificationLink: { type: String, default: '' },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Certification', certificationSchema);
