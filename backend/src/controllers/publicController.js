import { z } from 'zod';
import SiteSettings from '../models/SiteSettings.js';
import Category from '../models/Category.js';
import Project from '../models/Project.js';
import Certification from '../models/Certification.js';
import Writeup from '../models/Writeup.js';
import ProgressItem from '../models/ProgressItem.js';
import ContactMessage from '../models/ContactMessage.js';

export const getSettings = async (_req, res) => {
  const settings = await SiteSettings.findOne();
  res.json(settings || {});
};

export const getAbout = async (_req, res) => {
  const settings = await SiteSettings.findOne().select('heroName heroTitle heroIntro heroImage resumeUrl socialLinks');
  res.json(settings || {});
};

export const getCategories = async (req, res) => {
  const filter = {};
  if (req.query.type) filter.type = req.query.type;
  const categories = await Category.find(filter).sort({ order: 1, createdAt: 1 });
  res.json(categories);
};

export const getProjects = async (req, res) => {
  const filter = {};
  if (req.query.category) filter.categoryId = req.query.category;
  if (req.query.tag) filter.tags = req.query.tag;
  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
    ];
  }
  const projects = await Project.find(filter).populate('categoryId').sort({ order: 1, createdAt: -1 });
  res.json(projects);
};

export const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id).populate('categoryId');
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
};

export const getCertifications = async (req, res) => {
  const filter = {};
  if (req.query.category) filter.categoryId = req.query.category;
  const certs = await Certification.find(filter).populate('categoryId').sort({ order: 1, date: -1 });
  res.json(certs);
};

export const getWriteups = async (req, res) => {
  const filter = { published: true };
  if (req.query.category) filter.categoryId = req.query.category;
  if (req.query.difficulty) filter.difficulty = req.query.difficulty;
  const writeups = await Writeup.find(filter).populate('categoryId').sort({ order: 1, createdAt: -1 });
  res.json(writeups);
};

export const getWriteupById = async (req, res) => {
  const writeup = await Writeup.findOne({ _id: req.params.id, published: true }).populate('categoryId');
  if (!writeup) return res.status(404).json({ message: 'Writeup not found' });
  res.json(writeup);
};

export const getProgress = async (_req, res) => {
  const items = await ProgressItem.find().sort({ order: 1, createdAt: 1 });
  res.json(items);
};

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(1).max(2000),
});

export const submitContact = async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Validation error', errors: parsed.error.flatten() });
  }
  const msg = await ContactMessage.create(parsed.data);
  res.status(201).json({ message: 'Message received', id: msg._id });
};
