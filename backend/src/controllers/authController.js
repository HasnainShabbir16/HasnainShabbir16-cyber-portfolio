import jwt from 'jsonwebtoken';
import { z } from 'zod';
import AdminUser from '../models/AdminUser.js';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const login = async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Validation error', errors: parsed.error.flatten() });
  }

  const { email, password } = parsed.data;
  const admin = await AdminUser.findOne({ email });
  if (!admin || !(await admin.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  res.json({ token, admin: { id: admin._id, email: admin.email } });
};
