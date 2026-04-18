import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import AdminUser from '../models/AdminUser.js';
import SiteSettings from '../models/SiteSettings.js';
import Category from '../models/Category.js';
import Project from '../models/Project.js';
import Certification from '../models/Certification.js';
import Writeup from '../models/Writeup.js';
import ProgressItem from '../models/ProgressItem.js';

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // ── Admin user ────────────────────────────────────────────────────────────
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'changeme123';

  const existing = await AdminUser.findOne({ email });
  if (existing) {
    console.log(`Admin already exists: ${email} — skipping`);
  } else {
    await AdminUser.create({ email, password });
    console.log(`Admin created: ${email}`);
  }

  // ── Site settings ─────────────────────────────────────────────────────────
  const settingsExist = await SiteSettings.findOne();
  if (settingsExist) {
    console.log('SiteSettings already exists — skipping');
  } else {
    await SiteSettings.create({
      heroName: 'Hasnain Shabbir',
      heroTitle: 'Cybersecurity Enthusiast & Penetration Tester',
      heroIntro: 'Passionate about ethical hacking, CTFs, and building secure systems.',
      resumeUrl: '',
      socialLinks: { linkedin: '', github: 'https://github.com/HasnainShabbir16', twitter: '' },
      metaTitle: 'Hasnain Shabbir | Cybersecurity Portfolio',
      metaDescription: 'Cybersecurity portfolio showcasing projects, certifications, and CTF writeups.',
    });
    console.log('SiteSettings created');
  }

  // ── Categories ────────────────────────────────────────────────────────────
  const catDefs = [
    { name: 'Web Security', type: 'project', order: 1 },
    { name: 'Network Security', type: 'project', order: 2 },
    { name: 'CompTIA', type: 'certification', order: 1 },
    { name: 'HackTheBox', type: 'writeup', order: 1 },
    { name: 'TryHackMe', type: 'writeup', order: 2 },
  ];

  const catMap = {};
  for (const def of catDefs) {
    const exists = await Category.findOne({ name: def.name, type: def.type });
    if (exists) {
      console.log(`Category "${def.name}" already exists — skipping`);
      catMap[def.name] = exists._id;
    } else {
      const cat = await Category.create(def);
      catMap[def.name] = cat._id;
      console.log(`Category created: ${def.name}`);
    }
  }

  // ── Sample project ────────────────────────────────────────────────────────
  const projectExists = await Project.findOne({ title: 'Web Vulnerability Scanner' });
  if (projectExists) {
    console.log('Sample project already exists — skipping');
  } else {
    await Project.create({
      title: 'Web Vulnerability Scanner',
      description: 'A Python-based tool that scans web applications for common vulnerabilities like SQLi and XSS.',
      technologies: ['Python', 'Requests', 'BeautifulSoup'],
      githubLink: 'https://github.com/HasnainShabbir16',
      tags: ['python', 'security', 'scanner'],
      categoryId: catMap['Web Security'],
      featured: true,
      order: 1,
    });
    console.log('Sample project created');
  }

  // ── Sample certification ──────────────────────────────────────────────────
  const certExists = await Certification.findOne({ title: 'CompTIA Security+' });
  if (certExists) {
    console.log('Sample certification already exists — skipping');
  } else {
    await Certification.create({
      title: 'CompTIA Security+',
      issuer: 'CompTIA',
      date: new Date('2024-01-01'),
      description: 'Foundation-level cybersecurity certification covering threats, attacks, and vulnerabilities.',
      categoryId: catMap['CompTIA'],
      order: 1,
    });
    console.log('Sample certification created');
  }

  // ── Sample writeup ────────────────────────────────────────────────────────
  const writeupExists = await Writeup.findOne({ title: 'HackTheBox – Lame' });
  if (writeupExists) {
    console.log('Sample writeup already exists — skipping');
  } else {
    await Writeup.create({
      title: 'HackTheBox – Lame',
      difficulty: 'easy',
      tools: ['nmap', 'Metasploit'],
      content: '## Enumeration\n\nRan nmap to discover open ports...\n\n## Exploitation\n\nUsed Metasploit module...',
      categoryId: catMap['HackTheBox'],
      tags: ['smb', 'metasploit', 'linux'],
      published: true,
      order: 1,
    });
    console.log('Sample writeup created');
  }

  // ── Sample progress item ──────────────────────────────────────────────────
  const progressExists = await ProgressItem.findOne({ label: 'Penetration Testing' });
  if (progressExists) {
    console.log('Sample progress item already exists — skipping');
  } else {
    await ProgressItem.create({ label: 'Penetration Testing', percentage: 80, category: 'Offensive Security', order: 1 });
    console.log('Sample progress item created');
  }

  console.log('\nSeed complete.');
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
