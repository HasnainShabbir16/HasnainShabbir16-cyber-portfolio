import { useState, useEffect } from 'react';
import DataTable from './components/DataTable.jsx';
import Modal from '../components/Modal.jsx';
import ImageUpload from './components/ImageUpload.jsx';
import { PageLoader } from '../components/LoadingSpinner.jsx';
import {
  getAdminProjects, createProject, updateProject, deleteProject,
} from '../api/admin.js';
import { getCategories } from '../api/public.js';

const emptyForm = {
  title: '', description: '', technologies: '', githubLink: '', demoLink: '',
  tags: '', categoryId: '', featured: false, images: [],
};

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([getAdminProjects(), getCategories('project')])
      .then(([pRes, cRes]) => {
        setProjects(pRes.data?.projects || pRes.data || []);
        setCategories(cRes.data?.categories || cRes.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openAdd = () => { setEditItem(null); setForm(emptyForm); setMsg(null); setModal(true); };
  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      title: item.title || '',
      description: item.description || '',
      technologies: Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies || '',
      githubLink: item.githubLink || '',
      demoLink: item.demoLink || '',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '',
      categoryId: item.category?._id || item.category?.id || item.categoryId || '',
      featured: !!item.featured,
      images: item.images || [],
    });
    setMsg(null);
    setModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) { setMsg({ type: 'error', text: 'Title is required.' }); return; }
    setSaving(true);
    setMsg(null);
    const payload = {
      ...form,
      technologies: form.technologies.split(',').map((t) => t.trim()).filter(Boolean),
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (editItem) await updateProject(editItem._id || editItem.id, payload);
      else await createProject(payload);
      setModal(false);
      load();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Save failed.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try { await deleteProject(id); load(); }
    catch (err) { alert(err.response?.data?.message || 'Delete failed.'); }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'featured', label: 'Featured', render: (v) => v ? <span className="badge badge-cyan">Yes</span> : '—' },
    { key: 'technologies', label: 'Tech', render: (v) => Array.isArray(v) ? v.slice(0, 3).join(', ') : String(v || '—').slice(0, 40) },
    { key: 'createdAt', label: 'Created', render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
  ];

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="flex-between mb-3">
        <h1 className="admin-page-title">Projects</h1>
        <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Add Project</button>
      </div>

      <DataTable columns={columns} data={projects} onEdit={openEdit} onDelete={handleDelete} />

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editItem ? 'Edit Project' : 'Add Project'} size="lg">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input name="title" className="form-input" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea name="description" className="form-textarea" value={form.description} onChange={handleChange} />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Technologies (comma-separated)</label>
              <input name="technologies" className="form-input" value={form.technologies} onChange={handleChange} placeholder="React, Python, Docker" />
            </div>
            <div className="form-group">
              <label className="form-label">Tags (comma-separated)</label>
              <input name="tags" className="form-input" value={form.tags} onChange={handleChange} placeholder="web, security" />
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">GitHub Link</label>
              <input name="githubLink" className="form-input" value={form.githubLink} onChange={handleChange} placeholder="https://github.com/..." />
            </div>
            <div className="form-group">
              <label className="form-label">Demo Link</label>
              <input name="demoLink" className="form-input" value={form.demoLink} onChange={handleChange} placeholder="https://demo.example.com" />
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select name="categoryId" className="form-select" value={form.categoryId} onChange={handleChange}>
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ justifyContent: 'flex-end' }}>
              <label className="form-label">Featured</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} style={{ accentColor: 'var(--neon-green)', width: 16, height: 16 }} />
                Mark as featured
              </label>
            </div>
          </div>
          <ImageUpload
            label="Project Image"
            currentUrl={form.images?.[0]}
            onUpload={(url) => setForm((f) => ({ ...f, images: url ? [url] : [] }))}
          />
          {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Project'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
