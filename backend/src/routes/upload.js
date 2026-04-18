import { Router } from 'express';
import multer from 'multer';
import auth from '../middleware/auth.js';
import { uploadImage, deleteImage } from '../controllers/uploadController.js';

// Store file in memory (passed directly to Cloudinary)
const storage = multer.memoryStorage();
const imageFileFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, png, webp, gif) are allowed'), false);
  }
};
const upload = multer({ storage, fileFilter: imageFileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5 MB limit

const router = Router();

router.use(auth);

router.post('/upload', upload.single('image'), uploadImage);
router.delete('/upload/:publicId', deleteImage);

export default router;
