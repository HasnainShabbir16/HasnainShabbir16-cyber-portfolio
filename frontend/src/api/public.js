import api from './axios.js';

export const getSiteSettings = () => api.get('/api/public/settings');

export const getCategories = (type) =>
  api.get('/api/public/categories', { params: type ? { type } : {} });

export const getProjects = (params) =>
  api.get('/api/public/projects', { params });

export const getProject = (id) => api.get(`/api/public/projects/${id}`);

export const getCertifications = (params) =>
  api.get('/api/public/certifications', { params });

export const getWriteups = (params) =>
  api.get('/api/public/writeups', { params });

export const getWriteup = (id) => api.get(`/api/public/writeups/${id}`);

export const getProgress = () => api.get('/api/public/progress');

export const getAbout = () => api.get('/api/public/about');

export const submitContact = (data) => api.post('/api/public/contact', data);
