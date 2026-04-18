import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login } from '../controllers/authController.js';

// Stricter rate limit for auth endpoints: 5 requests / 15 min
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, standardHeaders: true, legacyHeaders: false });

const router = Router();

router.post('/login', authLimiter, login);

export default router;
