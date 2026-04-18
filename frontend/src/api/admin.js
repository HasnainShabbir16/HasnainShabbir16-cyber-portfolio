import api from './axios.js';

// Auth
export const adminLogin = (email, password) =>
  api.post('/api/auth/login', { email, password });

// Upload
export const uploadImage = (file) => {
  const form = new FormData();
  form.append('image', file);
  return api.post('/api/admin/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Site Settings
export const getAdminSettings = () => api.get('/api/admin/settings');
export const updateSettings = (data) => api.put('/api/admin/settings', data);

// Categories
export const getAdminCategories = () => api.get('/api/admin/categories');
export const createCategory = (data) => api.post('/api/admin/categories', data);
export const updateCategory = (id, data) => api.put(`/api/admin/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/api/admin/categories/${id}`);

// Projects
export const getAdminProjects = () => api.get('/api/admin/projects');
export const createProject = (data) => api.post('/api/admin/projects', data);
export const updateProject = (id, data) => api.put(`/api/admin/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/api/admin/projects/${id}`);

// Certifications
export const getAdminCertifications = () => api.get('/api/admin/certifications');
export const createCertification = (data) => api.post('/api/admin/certifications', data);
export const updateCertification = (id, data) => api.put(`/api/admin/certifications/${id}`, data);
export const deleteCertification = (id) => api.delete(`/api/admin/certifications/${id}`);

// Writeups
export const getAdminWriteups = () => api.get('/api/admin/writeups');
export const createWriteup = (data) => api.post('/api/admin/writeups', data);
export const updateWriteup = (id, data) => api.put(`/api/admin/writeups/${id}`, data);
export const deleteWriteup = (id) => api.delete(`/api/admin/writeups/${id}`);

// Progress
export const getAdminProgress = () => api.get('/api/admin/progress');
export const createProgress = (data) => api.post('/api/admin/progress', data);
export const updateProgress = (id, data) => api.put(`/api/admin/progress/${id}`, data);
export const deleteProgress = (id) => api.delete(`/api/admin/progress/${id}`);

// Messages
export const getMessages = (params) => api.get('/api/admin/messages', { params });
export const markMessageRead = (id) => api.put(`/api/admin/messages/${id}/read`);
export const deleteMessage = (id) => api.delete(`/api/admin/messages/${id}`);

// Dashboard stats
export const getDashboardStats = () => api.get('/api/admin/dashboard/stats');
