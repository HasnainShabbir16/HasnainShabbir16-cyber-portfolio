import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

// Upload a file buffer to Cloudinary via a stream
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folder || 'cyber-portfolio', resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const uploadImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file provided' });

  const folder = req.query.folder || 'cyber-portfolio';
  try {
    const result = await uploadToCloudinary(req.file.buffer, folder);
    res.status(201).json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    res.status(500).json({ message: 'Image upload failed', error: err.message });
  }
};

export const deleteImage = async (req, res) => {
  const publicId = decodeURIComponent(req.params.publicId);
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== 'ok') {
      return res.status(400).json({ message: 'Failed to delete image', result });
    }
    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Image deletion failed', error: err.message });
  }
};
