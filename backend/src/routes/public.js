import { Router } from 'express';
import {
  getSettings,
  getAbout,
  getCategories,
  getProjects,
  getProjectById,
  getCertifications,
  getWriteups,
  getWriteupById,
  getProgress,
  submitContact,
} from '../controllers/publicController.js';

const router = Router();

router.get('/settings', getSettings);
router.get('/about', getAbout);
router.get('/categories', getCategories);
router.get('/projects', getProjects);
router.get('/projects/:id', getProjectById);
router.get('/certifications', getCertifications);
router.get('/writeups', getWriteups);
router.get('/writeups/:id', getWriteupById);
router.get('/progress', getProgress);
router.post('/contact', submitContact);

export default router;
