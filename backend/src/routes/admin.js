import { Router } from 'express';
import auth from '../middleware/auth.js';
import {
  getSettings,
  updateSettings,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
  getWriteups,
  createWriteup,
  updateWriteup,
  deleteWriteup,
  getProgress,
  createProgress,
  updateProgress,
  deleteProgress,
  getMessages,
  markMessageRead,
  deleteMessage,
} from '../controllers/adminController.js';

const router = Router();

// All admin routes require authentication
router.use(auth);

// Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// Categories
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Projects
router.get('/projects', getProjects);
router.post('/projects', createProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

// Certifications
router.get('/certifications', getCertifications);
router.post('/certifications', createCertification);
router.put('/certifications/:id', updateCertification);
router.delete('/certifications/:id', deleteCertification);

// Writeups
router.get('/writeups', getWriteups);
router.post('/writeups', createWriteup);
router.put('/writeups/:id', updateWriteup);
router.delete('/writeups/:id', deleteWriteup);

// Progress
router.get('/progress', getProgress);
router.post('/progress', createProgress);
router.put('/progress/:id', updateProgress);
router.delete('/progress/:id', deleteProgress);

// Contact messages
router.get('/messages', getMessages);
router.put('/messages/:id/read', markMessageRead);
router.delete('/messages/:id', deleteMessage);

export default router;
