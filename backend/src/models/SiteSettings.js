import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({ url: String, publicId: String }, { _id: false });

const siteSettingsSchema = new mongoose.Schema(
  {
    heroName: { type: String, default: '' },
    heroTitle: { type: String, default: '' },
    heroIntro: { type: String, default: '' },
    heroImage: { type: imageSchema, default: () => ({}) },
    resumeUrl: { type: String, default: '' },
    socialLinks: {
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      twitter: { type: String, default: '' },
    },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('SiteSettings', siteSettingsSchema);
