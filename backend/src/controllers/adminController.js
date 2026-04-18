import { z } from 'zod';
import SiteSettings from '../models/SiteSettings.js';
import Category from '../models/Category.js';
import Project from '../models/Project.js';
import Certification from '../models/Certification.js';
import Writeup from '../models/Writeup.js';
import ProgressItem from '../models/ProgressItem.js';
import ContactMessage from '../models/ContactMessage.js';

// ── Zod schemas ──────────────────────────────────────────────────────────────

const imageSchema = z.object({ url: z.string().url(), publicId: z.string() }).optional();

const settingsSchema = z.object({
  heroName: z.string().optional(),
  heroTitle: z.string().optional(),
  heroIntro: z.string().optional(),
  heroImage: imageSchema,
  resumeUrl: z.string().optional(),
  socialLinks: z
    .object({ linkedin: z.string().optional(), github: z.string().optional(), twitter: z.string().optional() })
    .optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

const categorySchema = z.object({
  name: z.string().min(1),
  type: z.enum(['project', 'certification', 'writeup']),
  order: z.number().optional(),
});

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  images: z.array(z.object({ url: z.string(), publicId: z.string() })).optional(),
  githubLink: z.string().optional(),
  demoLink: z.string().optional(),
  tags: z.array(z.string()).optional(),
  categoryId: z.string().optional(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
});

const certificationSchema = z.object({
  title: z.string().min(1),
  issuer: z.string().optional(),
  date: z.string().optional(),
  description: z.string().optional(),
  image: z.object({ url: z.string(), publicId: z.string() }).optional(),
  verificationLink: z.string().optional(),
  categoryId: z.string().optional(),
  order: z.number().optional(),
});

const writeupSchema = z.object({
  title: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard', 'insane']),
  tools: z.array(z.string()).optional(),
  content: z.string().optional(),
  images: z.array(z.object({ url: z.string(), publicId: z.string() })).optional(),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
  order: z.number().optional(),
});

const progressSchema = z.object({
  label: z.string().min(1),
  percentage: z.number().min(0).max(100),
  category: z.string().optional(),
  order: z.number().optional(),
});

// ── Helper ───────────────────────────────────────────────────────────────────

const validate = (schema, body) => {
  const result = schema.safeParse(body);
  if (!result.success) {
    const err = new Error('Validation error');
    err.statusCode = 400;
    err.details = result.error.flatten();
    throw err;
  }
  return result.data;
};

// ── Settings ─────────────────────────────────────────────────────────────────

export const getSettings = async (_req, res) => {
  const settings = await SiteSettings.findOne();
  res.json(settings || {});
};

export const updateSettings = async (req, res) => {
  const data = validate(settingsSchema, req.body);
  const settings = await SiteSettings.findOneAndUpdate({}, { $set: data }, { new: true, upsert: true });
  res.json(settings);
};

// ── Categories ────────────────────────────────────────────────────────────────

export const getCategories = async (_req, res) => {
  const categories = await Category.find().sort({ order: 1 });
  res.json(categories);
};

export const createCategory = async (req, res) => {
  const data = validate(categorySchema, req.body);
  const cat = await Category.create(data);
  res.status(201).json(cat);
};

export const updateCategory = async (req, res) => {
  const data = validate(categorySchema.partial(), req.body);
  const cat = await Category.findByIdAndUpdate(req.params.id, data, { new: true });
  if (!cat) return res.status(404).json({ message: 'Category not found' });
  res.json(cat);
};

export const deleteCategory = async (req, res) => {
  const cat = await Category.findByIdAndDelete(req.params.id);
  if (!cat) return res.status(404).json({ message: 'Category not found' });
  res.json({ message: 'Deleted' });
};

// ── Projects ──────────────────────────────────────────────────────────────────

export const getProjects = async (_req, res) => {
  const projects = await Project.find().populate('categoryId').sort({ order: 1, createdAt: -1 });
  res.json(projects);
};

export const createProject = async (req, res) => {
  const data = validate(projectSchema, req.body);
  const project = await Project.create(data);
  res.status(201).json(project);
};

export const updateProject = async (req, res) => {
  const data = validate(projectSchema.partial(), req.body);
  const project = await Project.findByIdAndUpdate(req.params.id, data, { new: true });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
};

export const deleteProject = async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json({ message: 'Deleted' });
};

// ── Certifications ────────────────────────────────────────────────────────────

export const getCertifications = async (_req, res) => {
  const certs = await Certification.find().populate('categoryId').sort({ order: 1 });
  res.json(certs);
};

export const createCertification = async (req, res) => {
  const data = validate(certificationSchema, req.body);
  const cert = await Certification.create(data);
  res.status(201).json(cert);
};

export const updateCertification = async (req, res) => {
  const data = validate(certificationSchema.partial(), req.body);
  const cert = await Certification.findByIdAndUpdate(req.params.id, data, { new: true });
  if (!cert) return res.status(404).json({ message: 'Certification not found' });
  res.json(cert);
};

export const deleteCertification = async (req, res) => {
  const cert = await Certification.findByIdAndDelete(req.params.id);
  if (!cert) return res.status(404).json({ message: 'Certification not found' });
  res.json({ message: 'Deleted' });
};

// ── Writeups ──────────────────────────────────────────────────────────────────

export const getWriteups = async (_req, res) => {
  const writeups = await Writeup.find().populate('categoryId').sort({ order: 1, createdAt: -1 });
  res.json(writeups);
};

export const createWriteup = async (req, res) => {
  const data = validate(writeupSchema, req.body);
  const writeup = await Writeup.create(data);
  res.status(201).json(writeup);
};

export const updateWriteup = async (req, res) => {
  const data = validate(writeupSchema.partial(), req.body);
  const writeup = await Writeup.findByIdAndUpdate(req.params.id, data, { new: true });
  if (!writeup) return res.status(404).json({ message: 'Writeup not found' });
  res.json(writeup);
};

export const deleteWriteup = async (req, res) => {
  const writeup = await Writeup.findByIdAndDelete(req.params.id);
  if (!writeup) return res.status(404).json({ message: 'Writeup not found' });
  res.json({ message: 'Deleted' });
};

// ── Progress ──────────────────────────────────────────────────────────────────

export const getProgress = async (_req, res) => {
  const items = await ProgressItem.find().sort({ order: 1 });
  res.json(items);
};

export const createProgress = async (req, res) => {
  const data = validate(progressSchema, req.body);
  const item = await ProgressItem.create(data);
  res.status(201).json(item);
};

export const updateProgress = async (req, res) => {
  const data = validate(progressSchema.partial(), req.body);
  const item = await ProgressItem.findByIdAndUpdate(req.params.id, data, { new: true });
  if (!item) return res.status(404).json({ message: 'Progress item not found' });
  res.json(item);
};

export const deleteProgress = async (req, res) => {
  const item = await ProgressItem.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Progress item not found' });
  res.json({ message: 'Deleted' });
};

// ── Messages ──────────────────────────────────────────────────────────────────

export const getMessages = async (_req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  res.json(messages);
};

export const markMessageRead = async (req, res) => {
  const msg = await ContactMessage.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  if (!msg) return res.status(404).json({ message: 'Message not found' });
  res.json(msg);
};

export const deleteMessage = async (req, res) => {
  const msg = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!msg) return res.status(404).json({ message: 'Message not found' });
  res.json({ message: 'Deleted' });
};
