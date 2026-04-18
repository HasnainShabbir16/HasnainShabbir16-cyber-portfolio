import { Router } from 'express';
import multer from 'multer';
import auth from '../middleware/auth.js';
import { uploadImage, deleteImage } from '../controllers/uploadController.js';

// Store file in memory (passed directly to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5 MB limit

const router = Router();

router.use(auth);

router.post('/upload', upload.single('image'), uploadImage);
router.delete('/upload/:publicId', deleteImage);

export default router;
