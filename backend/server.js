import 'express-async-errors';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import publicRoutes from './src/routes/public.js';
import adminRoutes from './src/routes/admin.js';
import uploadRoutes from './src/routes/upload.js';
import errorHandler from './src/middleware/errorHandler.js';

connectDB();

const app = express();

// Security headers
app.use(helmet());

// CORS – allow frontend origin
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// General rate limit: 100 requests / 15 min
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', uploadRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
